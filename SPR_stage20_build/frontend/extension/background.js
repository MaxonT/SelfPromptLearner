// background.js - Handles storage, sync queue, and messaging (MV3 service worker)

const STORAGE_KEYS = {
  recording: 'recording',
  prompts: 'prompts',
  serverUrl: 'serverUrl',
  apiToken: 'apiToken',
  autoSync: 'autoSync',
  syncQueue: 'syncQueue',
  logs: 'logs',
  deviceId: 'deviceId',
  lastSyncAt: 'lastSyncAt',
  lastSyncError: 'lastSyncError',
  lastSyncResult: 'lastSyncResult',
  e2eMode: 'e2eMode',
};

const DEFAULTS = {
  recording: true,
  prompts: [],
  serverUrl: '',
  apiToken: '',
  autoSync: true,
  syncQueue: [],
  logs: [],
  e2eMode: false,
};

const MAX_PROMPTS = 5000;
const MAX_LOGS = 200;
const MAX_BATCH = 5;
const MAX_ATTEMPTS = 5;
const BASE_BACKOFF_MS = 2000;

const QUEUE_VERSION = 2;
const DEDUPE_WINDOW_MS = 30_000;
const SENDING_STALE_MS = 2 * 60_000;

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return ("0000000" + h.toString(16)).slice(-8);
}

function computeEventFingerprint(payload, tMs) {
  const bucket = Math.floor(tMs / DEDUPE_WINDOW_MS);
  const site = String(payload?.site || '');
  const cid = String(payload?.conversationId || '');
  const txt = String(payload?.promptText || '');
  return { bucket, fingerprint: fnv1a(`${site}|${cid}|${txt}|${bucket}`) };
}

function normalizeQueue(rawQueue) {
  const q = Array.isArray(rawQueue) ? rawQueue : [];
  // v1: array of localId strings
  if (!q.length) return { version: QUEUE_VERSION, items: [] };

  if (typeof q[0] === 'string') {
    return {
      version: QUEUE_VERSION,
      items: q.filter(Boolean).map((localId) => ({
        localId,
        state: 'pending',
        attempts: 0,
        nextRetryAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastError: null,
        lastRequestId: null,
      })),
    };
  }

  return { version: Number(q.version || QUEUE_VERSION) || QUEUE_VERSION, items: q.items ? q.items : q };
}

function queueCounts(qItems) {
  const out = { pending: 0, sending: 0, failed: 0 };
  for (const it of qItems) {
    const st = it?.state;
    if (st === 'sending') out.sending++;
    else if (st === 'failed') out.failed++;
    else if (st === 'pending') out.pending++;
  }
  return out;
}

let isSyncing = false;

function nowMs() {
  return Date.now();
}

function clampArray(arr, max) {
  if (!Array.isArray(arr)) return [];
  if (arr.length <= max) return arr;
  return arr.slice(arr.length - max);
}

function pushLog(level, message, extra) {
  chrome.storage.local.get([STORAGE_KEYS.logs], (data) => {
    const logs = Array.isArray(data.logs) ? data.logs : [];
    logs.push({
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
      level,
      message,
      extra: extra ?? null,
    });
    chrome.storage.local.set({ [STORAGE_KEYS.logs]: clampArray(logs, MAX_LOGS) });
  });
}


function ensureDeviceId() {
  chrome.storage.local.get([STORAGE_KEYS.deviceId], (data) => {
    if (!data.deviceId) {
      const id = crypto.randomUUID();
      chrome.storage.local.set({ [STORAGE_KEYS.deviceId]: id }, () => {
        pushLog('info', 'DeviceId generated', { deviceId: id });
      });
    }
  });
}

function initDefaults() {
  chrome.storage.local.get(Object.values(STORAGE_KEYS), (data) => {
    const next = {};
    for (const [k, v] of Object.entries(DEFAULTS)) {
      if (data[k] === undefined) next[k] = v;
    }
    if (Object.keys(next).length) chrome.storage.local.set(next);
  });
}

chrome.runtime.onInstalled.addListener(() => {
  initDefaults();
  ensureDeviceId();
  // 强化 keep-alive: 每 30 秒 ping 一次，确保不会被云平台睡眠
  chrome.alarms.create('sprSync', { periodInMinutes: 0.5 });
  // 同时保留备用的心跳检测（更频繁）
  chrome.alarms.create('sprKeepAlive', { periodInMinutes: 0.25 });
  pushLog('info', 'SPR installed / defaults initialized (keep-alive: 30s, heartbeat: 15s)');
});

chrome.runtime.onStartup.addListener(() => {
  ensureDeviceId();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm?.name === 'sprSync') {
    runSyncCycle('alarm');
    pollCommandsAndAct();
    postStatusHeartbeat();
  }
  // 额外的 keep-alive 心跳（15秒一次，比同步更频繁）
  if (alarm?.name === 'sprKeepAlive') {
    postStatusHeartbeat();
  }
});

async function postStatusHeartbeat() {
  try {
    const data = await chrome.storage.local.get([
      STORAGE_KEYS.serverUrl,
      STORAGE_KEYS.apiToken,
      STORAGE_KEYS.deviceId,
      STORAGE_KEYS.syncQueue,
      STORAGE_KEYS.lastSyncAt,
      STORAGE_KEYS.lastSyncError,
      STORAGE_KEYS.lastSyncResult,
    ]);

    const serverUrl = (data.serverUrl || DEFAULTS.serverUrl).replace(/\/$/, '');
    if (!serverUrl) return;

    const apiToken = String(data.apiToken || DEFAULTS.apiToken || '');
    const deviceId = String(data.deviceId || 'unknown');
    const q = normalizeQueue(data.syncQueue);
    const counts = queueCounts(Array.isArray(q.items) ? q.items : []);
    const lastRequestId = (data.lastSyncResult && (data.lastSyncResult.requestId || data.lastSyncResult.lastRequestId)) || null;
    await postExtensionStatus({
      serverUrl,
      apiToken,
      deviceId,
      counts,
      lastRequestId,
      lastSyncAt: data.lastSyncAt || null,
      lastSyncError: data.lastSyncError || null,
    });
  } catch {}
}

async function postExtensionStatus({ serverUrl, apiToken, deviceId, counts, lastRequestId, lastSyncAt, lastSyncError }) {
  try {
    await fetch(`${serverUrl}/api/extension/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
      },
      body: JSON.stringify({
        deviceId,
        pending: counts.pending || 0,
        failed: counts.failed || 0,
        sending: counts.sending || 0,
        lastRequestId: lastRequestId || null,
        lastSyncAt: lastSyncAt || null,
        lastSyncError: lastSyncError || null,
      }),
    });
  } catch {}
}

async function pollCommandsAndAct() {
  try {
    const data = await chrome.storage.local.get([
      STORAGE_KEYS.serverUrl,
      STORAGE_KEYS.apiToken,
      STORAGE_KEYS.deviceId,
      STORAGE_KEYS.prompts,
      STORAGE_KEYS.syncQueue,
    ]);

    const serverUrl = (data.serverUrl || DEFAULTS.serverUrl).replace(/\/$/, '');
    const apiToken = String(data.apiToken || DEFAULTS.apiToken || '');
    const deviceId = String(data.deviceId || '');
    if (!serverUrl || !apiToken || !deviceId) return;

    const resp = await fetch(`${serverUrl}/api/extension/commands?deviceId=${encodeURIComponent(deviceId)}`, {
      headers: { Authorization: `Bearer ${apiToken}` },
    });
    if (!resp.ok) return;
    const json = await resp.json().catch(() => null);
    const commands = Array.isArray(json?.commands) ? json.commands : [];
    if (!commands.length) return;

    for (const c of commands) {
      if (c?.command === 'retry_failed') {
        await retryFailedItems();
      }
    }
  } catch {}
}

async function retryFailedItems() {
  const data = await chrome.storage.local.get([STORAGE_KEYS.prompts, STORAGE_KEYS.syncQueue]);
  const prompts = Array.isArray(data.prompts) ? data.prompts : [];
  const q = normalizeQueue(data.syncQueue);
  const items = Array.isArray(q.items) ? q.items : [];

  let changed = false;
  for (const p of prompts) {
    if (p && (p.syncStatus === 'failed' || p.syncStatus === 'dead')) {
      p.syncStatus = 'pending';
      p.syncError = null;
      p.nextRetryAt = null;
      changed = true;
    }
  }

  for (const it of items) {
    if (it && it.state === 'failed') {
      it.state = 'pending';
      it.nextRetryAt = null;
      it.lastError = null;
      it.updatedAt = new Date().toISOString();
      changed = true;
    }
  }

  if (changed) {
    await chrome.storage.local.set({ [STORAGE_KEYS.prompts]: prompts, [STORAGE_KEYS.syncQueue]: { version: QUEUE_VERSION, items } });
    pushLog('info', 'Retry requested: failed items set to pending');
    runSyncCycle('retry_failed');
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      
if (request?.type === 'SPR_E2E_ENABLE') {
  chrome.storage.local.set({ [STORAGE_KEYS.e2eMode]: true }, () => {
    sendResponse({ ok: true });
  });
  return;
}

if (request?.type === 'SPR_E2E_CAPTURE') {
  const data = await chrome.storage.local.get([STORAGE_KEYS.e2eMode]);
  if (!data?.e2eMode) {
    sendResponse({ ok: false, error: 'E2E mode disabled' });
    return;
  }
  await savePrompt(request.payload, sender);
  // best-effort immediate sync
  try { await triggerSync('e2e'); } catch {}
  sendResponse({ ok: true });
  return;
}

if (request?.type === 'SAVE_PROMPT') {
        await savePrompt(request.payload, sender);
        sendResponse({ ok: true });
        return;
      }

      if (request?.type === 'GET_STATUS') {
        chrome.storage.local.get(
          [
            STORAGE_KEYS.recording,
            STORAGE_KEYS.serverUrl,
            STORAGE_KEYS.apiToken,
            STORAGE_KEYS.autoSync,
            STORAGE_KEYS.deviceId,
            STORAGE_KEYS.lastSyncAt,
            STORAGE_KEYS.lastSyncError,
            STORAGE_KEYS.lastSyncResult,
            STORAGE_KEYS.syncQueue,
            STORAGE_KEYS.logs,
          ],
          (data) => {
            const q = normalizeQueue(data.syncQueue);
            const items = Array.isArray(q.items) ? q.items : [];
            const counts = queueCounts(items);
            const lastLog = Array.isArray(data.logs) ? data.logs[data.logs.length - 1] : null;
            const lastRequestId =
              (data.lastSyncResult && (data.lastSyncResult.requestId || data.lastSyncResult.lastRequestId)) ||
              (items.find((x) => x?.lastRequestId)?.lastRequestId) ||
              null;

            sendResponse({
              recording: Boolean(data.recording),
              serverUrl: data.serverUrl || DEFAULTS.serverUrl,
              apiToken: data.apiToken || '',
              autoSync: data.autoSync !== false,
              pending: counts.pending,
              failed: counts.failed,
              sending: counts.sending,
              deviceId: data.deviceId || 'unknown',
              lastSyncAt: data.lastSyncAt || null,
              lastSyncError: data.lastSyncError || null,
              lastSyncResult: data.lastSyncResult || null,
              lastRequestId,
              lastLog,
            });
          },
        );
        return;
      }

      if (request?.type === 'SET_SETTINGS') {
        const { serverUrl, autoSync, apiToken } = request.payload || {};
        const patch = {};
        if (typeof serverUrl === 'string' && serverUrl.trim()) {
          patch[STORAGE_KEYS.serverUrl] = serverUrl.trim().replace(/\/$/, '');
        }
        if (typeof autoSync === 'boolean') patch[STORAGE_KEYS.autoSync] = autoSync;
        if (typeof apiToken === 'string') patch[STORAGE_KEYS.apiToken] = apiToken.trim();
        chrome.storage.local.set(patch, () => {
          pushLog('info', 'Settings updated', patch);
          sendResponse({ ok: true });
        });
        return;
      }

      if (request?.type === 'GET_RECENT') {
        chrome.storage.local.get([STORAGE_KEYS.prompts], (data) => {
          const prompts = Array.isArray(data.prompts) ? data.prompts : [];
          const recent = prompts.slice(-10).reverse();
          sendResponse({ ok: true, recent });
        });
        return;
      }

      if (request?.type === 'TRIGGER_SYNC') {
        await runSyncCycle('manual');
        sendResponse({ ok: true });
        return;
      }

      sendResponse({ ok: false, message: 'Unknown message type' });
    } catch (err) {
      pushLog('error', 'background handler error', String(err));
      sendResponse({ ok: false, message: String(err) });
    }
  })();

  return true;
});

async function savePrompt(payload, sender) {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      [STORAGE_KEYS.recording, STORAGE_KEYS.prompts, STORAGE_KEYS.autoSync, STORAGE_KEYS.syncQueue, STORAGE_KEYS.deviceId],
      (data) => {
        if (!data.recording) {
          pushLog('info', 'Recording is OFF; prompt ignored');
          return resolve();
        }

        const prompts = Array.isArray(data.prompts) ? data.prompts : [];
        const queue = data.syncQueue || { version: QUEUE_VERSION, items: [] };
        const autoSync = data.autoSync !== false;

        const recent = prompts[prompts.length - 1];
        const t = nowMs();

        const { bucket, fingerprint } = computeEventFingerprint(payload, t);

        // Fast dedupe: same fingerprint in the last DEDUPE_WINDOW_MS
        if (recent && recent.eventFingerprint === fingerprint) {
          const dt = t - new Date(recent.createdAt).getTime();
          if (dt >= 0 && dt < DEDUPE_WINDOW_MS) {
            pushLog('info', 'Duplicate capture ignored', { dtMs: dt, bucket });
            return resolve();
          }
        }

        // Legacy dedupe: promptHash within 6s window
        if (recent && recent.promptHash === payload.promptHash) {
          const dt = t - new Date(recent.createdAt).getTime();
          if (dt >= 0 && dt < 6000) {
            pushLog('info', 'Duplicate prompt ignored', { dtMs: dt });
            return resolve();
          }
        }

        const q = normalizeQueue(queue);
const newPrompt = {
          localId: crypto.randomUUID(),
          deviceId: data.deviceId || 'unknown',
          clientEventId: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          tabUrl: sender?.tab?.url || null,
          ...payload,
          eventFingerprint: fingerprint,
          captureBucket: bucket,
          analysis: payload.analysis || analyzePrompt(payload.promptText),
          syncStatus: autoSync ? 'pending' : 'local',
          syncAttempts: 0,
          nextRetryAt: null,
          syncError: null,
        };

        prompts.push(newPrompt);
        const nextPrompts = clampArray(prompts, MAX_PROMPTS);

        const patch = { [STORAGE_KEYS.prompts]: nextPrompts };
        if (autoSync) {
          const items = Array.isArray(q.items) ? q.items : [];
          const exists = items.some((it) => it?.localId === newPrompt.localId);
          if (!exists) {
            items.push({
              localId: newPrompt.localId,
              state: 'pending',
              attempts: 0,
              nextRetryAt: null,
              createdAt: newPrompt.createdAt,
              updatedAt: newPrompt.createdAt,
              lastError: null,
              lastRequestId: null,
            });
          }
          patch[STORAGE_KEYS.syncQueue] = { version: QUEUE_VERSION, items };
        }
        chrome.storage.local.set(patch, () => {
          pushLog('info', 'Prompt captured', { site: payload.site, len: payload.promptText?.length || 0 });
          if (autoSync) runSyncCycle('capture');
          resolve();
        });
      },
    );
  });
}

async function runSyncCycle(reason) {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const data = await new Promise((resolve) => {
      chrome.storage.local.get(
        [STORAGE_KEYS.serverUrl, STORAGE_KEYS.apiToken, STORAGE_KEYS.autoSync, STORAGE_KEYS.prompts, STORAGE_KEYS.syncQueue, STORAGE_KEYS.lastSyncAt, STORAGE_KEYS.lastSyncError, STORAGE_KEYS.lastSyncResult],
        resolve,
      );
    });

    const autoSync = data.autoSync !== false;
    if (!autoSync) return;

    const serverUrl = (data.serverUrl || DEFAULTS.serverUrl).replace(/\/$/, '');
    const apiToken = String(data.apiToken || DEFAULTS.apiToken || '');
    const prompts = Array.isArray(data.prompts) ? data.prompts : [];
    const q = normalizeQueue(data.syncQueue);
    let qItems = Array.isArray(q.items) ? q.items : [];

    const byId = new Map(prompts.map((p) => [p.localId, p]));
    const due = [];

    const now = nowMs();

    // Reset stale sending items (service worker may be terminated mid-flight)
    for (const it of qItems) {
      if (it?.state === 'sending' && it?.updatedAt) {
        const age = now - new Date(it.updatedAt).getTime();
        if (age > SENDING_STALE_MS) {
          it.state = 'pending';
          it.updatedAt = new Date().toISOString();
        }
      }
    }

    for (const it of qItems) {
      if (!it || !it.localId) continue;
      const p = byId.get(it.localId);
      if (!p) continue;

      if (p.syncStatus === 'synced' || p.syncStatus === 'dead') continue;

      const nra = it.nextRetryAt || p.nextRetryAt;
      if (nra && new Date(nra).getTime() > now) continue;

      if (it.state === 'pending' || it.state === 'failed') {
        due.push({ prompt: p, item: it });
      }

      if (due.length >= MAX_BATCH) break;
    }

    if (!due.length) return;

    // Mark batch as sending atomically for crash-safety
    const markAt = new Date().toISOString();
    for (const entry of due) {
      entry.item.state = 'sending';
      entry.item.updatedAt = markAt;
    }

    await new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.syncQueue]: { version: QUEUE_VERSION, items: qItems } }, resolve);
    });

    pushLog('info', 'Sync cycle start', { reason, batch: due.length, serverUrl });

    for (const entry of due) {
      const p = entry.prompt;
      const it = entry.item;
      const result = await syncOne(p, serverUrl, apiToken);
      if (result.ok) {
        p.syncStatus = 'synced';
        p.syncError = null;
        p.nextRetryAt = null;
        qItems = qItems.filter((x) => x?.localId !== p.localId);
        it.lastRequestId = result.requestId || null;
        it.lastError = null;
        it.updatedAt = new Date().toISOString();
        pushLog('info', 'Synced prompt', { localId: p.localId, requestId: it.lastRequestId });
      } else {
        p.syncAttempts = (p.syncAttempts || 0) + 1;
        p.syncStatus = p.syncAttempts >= MAX_ATTEMPTS ? 'dead' : 'failed';
        p.syncError = result.error;
        const backoff = BASE_BACKOFF_MS * Math.pow(2, Math.min(4, p.syncAttempts));
        p.nextRetryAt = new Date(nowMs() + backoff).toISOString();
        if (p.syncStatus === 'dead') qItems = qItems.filter((x) => x?.localId !== p.localId);
        it.state = 'failed';
        it.lastError = result.error;
        it.updatedAt = new Date().toISOString();
        it.attempts = (it.attempts || 0) + 1;
        it.nextRetryAt = p.nextRetryAt;
        it.lastRequestId = result.requestId || null;
        pushLog('error', 'Sync failed', { localId: p.localId, attempts: p.syncAttempts, error: result.error, requestId: it.lastRequestId });
      }
    }

    const succeeded = due.filter((p) => p.syncStatus === 'synced').length;
    const failed = due.length - succeeded;
    const lastSyncAt = new Date().toISOString();
    const lastSyncError = failed ? 'Some items failed to sync' : null;
    const lastRequestId = due.map((e) => e.item?.lastRequestId).filter(Boolean).slice(-1)[0] || null;
    const lastSyncResult = { reason, attempted: due.length, succeeded, failed, lastRequestId };

    await new Promise((resolve) => {
      chrome.storage.local.set(
        { 
          [STORAGE_KEYS.prompts]: prompts, 
          [STORAGE_KEYS.syncQueue]: { version: QUEUE_VERSION, items: qItems },
          [STORAGE_KEYS.lastSyncAt]: lastSyncAt,
          [STORAGE_KEYS.lastSyncError]: lastSyncError,
          [STORAGE_KEYS.lastSyncResult]: lastSyncResult,
        },
        resolve,
      );
    });

    // Push status snapshot for dashboard visibility
    try {
      const counts = queueCounts(Array.isArray(qItems) ? qItems : []);
      await postExtensionStatus({
        serverUrl,
        apiToken,
        deviceId: (await chrome.storage.local.get([STORAGE_KEYS.deviceId]))?.deviceId || 'unknown',
        counts,
        lastRequestId,
        lastSyncAt,
        lastSyncError,
      });
    } catch {}
  } finally {
    isSyncing = false;
  }
}

async function syncOne(prompt, serverUrl, apiToken) {
  try {
    const body = {
      site: prompt.site,
      pageUrl: prompt.pageUrl,
      conversationId: prompt.conversationId || null,
      promptText: prompt.promptText,
      promptHash: prompt.promptHash,
      deviceId: prompt.deviceId || 'unknown',
      clientEventId: prompt.clientEventId,
      meta: prompt.meta || null,
      tags: prompt.tags || [],
      analysis: prompt.analysis || null,
      isSynced: true,
    };

    const resp = await fetch(`${serverUrl}/api/prompts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      const rid = resp.headers.get('x-request-id') || null;
      return { ok: false, error: `HTTP ${resp.status} ${text}`.trim(), requestId: rid };
    }

    const rid = resp.headers.get('x-request-id') || null;
    return { ok: true, requestId: rid };
  } catch (err) {
    return { ok: false, error: String(err), requestId: null };
  }
}

// Lightweight heuristic analysis (fallback)
function analyzePrompt(text) {
  const analysis = {
    taxonomy: { taskType: [], intent: [], constraints: [], riskFlags: [] },
    scores: { clarity: 50, ambiguity: 0, reproducibility: 50 },
    traits: [],
    suggestions: [],
  };

  const lower = String(text || '').toLowerCase();

  if (lower.includes('code') || lower.includes('function') || lower.includes('react')) {
    analysis.taxonomy.taskType.push('coding');
  }
  if (lower.includes('explain') || lower.includes('what is')) {
    analysis.taxonomy.taskType.push('study');
  }
  if (lower.includes('write') || lower.includes('draft')) {
    analysis.taxonomy.taskType.push('writing');
  }

  analysis.scores.clarity = Math.min(100, Math.max(10, Math.round(String(text || '').length / 2)));
  if (lower.includes('example')) {
    analysis.scores.reproducibility = Math.min(100, analysis.scores.reproducibility + 20);
  }

  return analysis;
}
