document.addEventListener('DOMContentLoaded', () => {
  const statusText = document.getElementById('status-text');
  const toggleBtn = document.getElementById('toggle-btn');
  const serverUrlInput = document.getElementById('server-url');
  const apiTokenInput = document.getElementById('api-token');
  const autoSyncCheckbox = document.getElementById('auto-sync');
  const syncNowBtn = document.getElementById('sync-now');
  const recentEl = document.getElementById('recent');
  const openDashboardLink = document.getElementById('open-dashboard');
  const syncChip = document.getElementById('sync-chip');
  const failedChip = document.getElementById('failed-chip');
  const lastRequestIdEl = document.getElementById('last-request-id');
  const deviceIdEl = document.getElementById('device-id');
  const lastSyncEl = document.getElementById('last-sync');
  const lastSyncErrEl = document.getElementById('last-sync-error');

  const DEFAULT_LOCAL = 'http' + '://' + 'localhost:5000';

  function setChipFor(chip, text, ok) {
    if (!chip) return;
    chip.textContent = text;
    chip.style.background = ok ? '#eaffea' : '#ffecec';
  }

  function setChip(text, ok) {
    setChipFor(syncChip, text, ok);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  }

  function renderRecent(items) {
    while (recentEl.firstChild) recentEl.removeChild(recentEl.firstChild);

    if (!items || !items.length) {
      recentEl.appendChild(el('div', 'small', 'No captures yet.'));
      return;
    }

    for (const p of items) {
      const div = el('div', 'item');

      const header = el('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.gap = '8px';

      const site = p?.site || 'unknown';
      const t = p?.createdAt ? new Date(p.createdAt).toLocaleTimeString() : '';
      const st = p?.syncStatus || 'local';

      const left = el('div', 'small');
      const b = document.createElement('b');
      b.textContent = String(site);
      left.appendChild(b);
      left.appendChild(document.createTextNode(` · ${escapeHtml(t)}`));

      const chip = el('div', 'chip', st);

      header.appendChild(left);
      header.appendChild(chip);

      const text = String(p?.promptText || '').replace(/\s+/g, ' ').trim();
      const preview = text.length > 90 ? text.slice(0, 90) + '…' : text;
      const body = el('div');
      body.style.marginTop = '4px';
      body.textContent = preview;

      div.appendChild(header);
      div.appendChild(body);
      recentEl.appendChild(div);
    }
  }

  function refresh() {
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (status) => {
      if (!status) return;

      updateUI(status.recording);
      serverUrlInput.value = status.serverUrl || '';
      if (apiTokenInput) apiTokenInput.value = status.apiToken || '';
      autoSyncCheckbox.checked = Boolean(status.autoSync);

      const dash = (status.serverUrl || DEFAULT_LOCAL) + '';
      openDashboardLink.href = dash;

      setChip(`pending: ${status.pending ?? 0}`, (status.pending ?? 0) === 0);

      if (failedChip) {
        setChipFor(failedChip, `failed: ${status.failed ?? 0}`, (status.failed ?? 0) === 0);
      }

      if (lastRequestIdEl) {
        lastRequestIdEl.textContent = status.lastRequestId || '—';
      }

      if (deviceIdEl) deviceIdEl.textContent = status.deviceId || 'unknown';

      if (lastSyncEl) {
        lastSyncEl.textContent = status.lastSyncAt ? new Date(status.lastSyncAt).toLocaleString() : '—';
      }

      if (lastSyncErrEl) {
        const err = status.lastSyncError;
        if (err) {
          lastSyncErrEl.style.display = 'block';
          lastSyncErrEl.textContent = String(err);
        } else {
          lastSyncErrEl.style.display = 'none';
          lastSyncErrEl.textContent = '';
        }
      }
    });

    chrome.runtime.sendMessage({ type: 'GET_RECENT' }, (resp) => {
      renderRecent(resp?.recent || []);
    });
  }

  refresh();

  toggleBtn.addEventListener('click', () => {
    chrome.storage.local.get('recording', (data) => {
      const newState = !data.recording;
      chrome.storage.local.set({ recording: newState }, () => {
        updateUI(newState);
        refresh();
      });
    });
  });

  serverUrlInput.addEventListener('change', () => {
    const serverUrl = serverUrlInput.value.trim();
    chrome.runtime.sendMessage({ type: 'SET_SETTINGS', payload: { serverUrl } }, () => refresh());
  });

  if (apiTokenInput) {
    apiTokenInput.addEventListener('change', () => {
      const apiToken = apiTokenInput.value.trim();
      chrome.runtime.sendMessage({ type: 'SET_SETTINGS', payload: { apiToken } }, () => refresh());
    });
  }

  autoSyncCheckbox.addEventListener('change', () => {
    const autoSync = autoSyncCheckbox.checked;
    chrome.runtime.sendMessage({ type: 'SET_SETTINGS', payload: { autoSync } }, () => refresh());
  });

  syncNowBtn.addEventListener('click', () => {
    setChip('syncing…', false);
    chrome.runtime.sendMessage({ type: 'TRIGGER_SYNC' }, () => {
      setTimeout(refresh, 600);
    });
  });

  function updateUI(recording) {
    statusText.textContent = recording ? 'ON' : 'OFF';
    statusText.style.color = recording ? 'green' : 'red';
    toggleBtn.textContent = recording ? 'Pause Recording' : 'Resume Recording';
  }
});
