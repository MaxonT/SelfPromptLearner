document.addEventListener('DOMContentLoaded', () => {
  const statusText = document.getElementById('status-text');
  const toggleBtn = document.getElementById('toggle-btn');
  const serverUrlInput = document.getElementById('server-url');
  const autoSyncCheckbox = document.getElementById('auto-sync');
  const syncNowBtn = document.getElementById('sync-now');
  const recentEl = document.getElementById('recent');
  const openDashboardLink = document.getElementById('open-dashboard');
  const syncChip = document.getElementById('sync-chip');
  const deviceIdEl = document.getElementById('device-id');
  const lastSyncEl = document.getElementById('last-sync');
  const lastSyncErrEl = document.getElementById('last-sync-error');

  function setChip(text, ok) {
    syncChip.textContent = text;
    syncChip.style.background = ok ? '#eaffea' : '#ffecec';
  }

  function renderRecent(items) {
    recentEl.innerHTML = '';
    if (!items || !items.length) {
      recentEl.innerHTML = '<div class="small">No captures yet.</div>';
      return;
    }

    for (const p of items) {
      const div = document.createElement('div');
      div.className = 'item';
      const text = (p.promptText || '').replace(/\s+/g, ' ').trim();
      const preview = text.length > 90 ? text.slice(0, 90) + '…' : text;
      const site = p.site || 'unknown';
      const t = p.createdAt ? new Date(p.createdAt).toLocaleTimeString() : '';
      const st = p.syncStatus || 'local';
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; gap:8px;">
          <div class="small"><b>${site}</b> · ${t}</div>
          <div class="chip">${st}</div>
        </div>
        <div style="margin-top:4px;">${escapeHtml(preview)}</div>
      `;
      recentEl.appendChild(div);
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function refresh() {
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (status) => {
      if (!status) return;
      updateUI(status.recording);
      serverUrlInput.value = status.serverUrl || '';
      autoSyncCheckbox.checked = Boolean(status.autoSync);
      openDashboardLink.href = (status.serverUrl || 'http://localhost:5000') + '';
      setChip(`pending: ${status.pending ?? 0}`, (status.pending ?? 0) === 0);
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

  // Initial load
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
