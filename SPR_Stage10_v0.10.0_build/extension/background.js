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
};

const DEFAULTS = {
  recording: true,
  prompts: [],
  serverUrl: 'http://localhost:5000',
  apiToken: '',
  autoSync: true,
  syncQueue: [],
  logs: [],
};

const MAX_PROMPTS = 5000;
const MAX_LOGS = 200;
const MAX_BATCH = 5;
const MAX_ATTEMPTS = 5;
const BASE_BACKOFF_MS = 2000;

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
  chrome.alarms.create('sprSync', { periodInMinutes: 1 });
  pushLog('info', 'SPR installed / defaults initialized');
});

chrome.runtime.onStartup.addListener(() => {
  ensureDeviceId();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm?.name === 'sprSync') runSyncCycle('alarm');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
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
            STORAGE_KEYS.autoSync,
            STORAGE_KEYS.deviceId,
            STORAGE_KEYS.lastSyncAt,
            STORAGE_KEYS.lastSyncError,
            STORAGE_KEYS.lastSyncResult,
            STORAGE_KEYS.syncQueue,
            STORAGE_KEYS.logs,
          ],
          (data) => {
            const pending = Array.isArray(data.syncQueue) ? data.syncQueue.length : 0;
            const lastLog = Array.isArray(data.logs) ? data.logs[data.logs.length - 1] : null;
            sendResponse({
              recording: Boolean(data.recording),
              serverUrl: data.serverUrl || DEFAULTS.serverUrl,
              autoSync: data.autoSync !== false,
              pending,
              deviceId: data.deviceId || 'unknown',
              lastSyncAt: data.lastSyncAt || null,
              lastSyncError: data.lastSyncError || null,
              lastSyncResult: data.lastSyncResult || null,
              lastLog,
            });
          },
        );
        return;
      }

      if (request?.type === 'SET_SETTINGS') {
        const { serverUrl, autoSync } = request.payload || {};
        const patch = {};
        if (typeof serverUrl === 'string' && serverUrl.trim()) {
          patch[STORAGE_KEYS.serverUrl] = serverUrl.trim().replace(/\/$/, '');
        }
        if (typeof autoSync === 'boolean') patch[STORAGE_KEYS.autoSync] = autoSync;
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
        const queue = Array.isArray(data.syncQueue) ? data.syncQueue : [];
        const autoSync = data.autoSync !== false;

        const recent = prompts[prompts.length - 1];
        const t = nowMs();
        if (recent && recent.promptHash === payload.promptHash) {
          const dt = t - new Date(recent.createdAt).getTime();
          if (dt >= 0 && dt < 6000) {
            pushLog('info', 'Duplicate prompt ignored', { dtMs: dt });
            return resolve();
          }
        }

        const newPrompt = {
          localId: crypto.randomUUID(),
          deviceId: data.deviceId || 'unknown',
          clientEventId: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          tabUrl: sender?.tab?.url || null,
          ...payload,
          analysis: payload.analysis || analyzePrompt(payload.promptText),
          syncStatus: autoSync ? 'pending' : 'local',
          syncAttempts: 0,
          nextRetryAt: null,
          syncError: null,
        };

        prompts.push(newPrompt);
        const nextPrompts = clampArray(prompts, MAX_PROMPTS);

        const patch = { [STORAGE_KEYS.prompts]: nextPrompts };
        if (autoSync) patch[STORAGE_KEYS.syncQueue] = [...queue, newPrompt.localId];
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
    let queue = Array.isArray(data.syncQueue) ? data.syncQueue : [];

    const now = nowMs();
    const byId = new Map(prompts.map((p) => [p.localId, p]));
    const due = [];

    for (const id of queue) {
      const p = byId.get(id);
      if (!p) continue;
      if (p.syncStatus === 'synced' || p.syncStatus === 'dead') continue;
      if (p.nextRetryAt && new Date(p.nextRetryAt).getTime() > now) continue;
      due.push(p);
      if (due.length >= MAX_BATCH) break;
    }

    if (!due.length) return;

    pushLog('info', 'Sync cycle start', { reason, batch: due.length, serverUrl });

    for (const p of due) {
      const result = await syncOne(p, serverUrl);
      if (result.ok) {
        p.syncStatus = 'synced';
        p.syncError = null;
        p.nextRetryAt = null;
        queue = queue.filter((x) => x !== p.localId);
        pushLog('info', 'Synced prompt', { localId: p.localId });
      } else {
        p.syncAttempts = (p.syncAttempts || 0) + 1;
        p.syncStatus = p.syncAttempts >= MAX_ATTEMPTS ? 'dead' : 'failed';
        p.syncError = result.error;
        const backoff = BASE_BACKOFF_MS * Math.pow(2, Math.min(4, p.syncAttempts));
        p.nextRetryAt = new Date(nowMs() + backoff).toISOString();
        if (p.syncStatus === 'dead') queue = queue.filter((x) => x !== p.localId);
        pushLog('error', 'Sync failed', { localId: p.localId, attempts: p.syncAttempts, error: result.error });
      }
    }

    const succeeded = due.filter((p) => p.syncStatus === 'synced').length;
    const failed = due.length - succeeded;
    const lastSyncAt = new Date().toISOString();
    const lastSyncError = failed ? 'Some items failed to sync' : null;
    const lastSyncResult = { reason, attempted: due.length, succeeded, failed };

    await new Promise((resolve) => {
      chrome.storage.local.set(
        { 
          [STORAGE_KEYS.prompts]: prompts, 
          [STORAGE_KEYS.syncQueue]: queue,
          [STORAGE_KEYS.lastSyncAt]: lastSyncAt,
          [STORAGE_KEYS.lastSyncError]: lastSyncError,
          [STORAGE_KEYS.lastSyncResult]: lastSyncResult,
        },
        resolve,
      );
    });
  } finally {
    isSyncing = false;
  }
}

async function syncOne(prompt, serverUrl) {
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return { ok: false, error: `HTTP ${resp.status} ${text}` };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
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