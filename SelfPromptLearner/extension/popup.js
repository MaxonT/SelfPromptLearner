document.addEventListener('DOMContentLoaded', () => {
  const statusText = document.getElementById('status-text');
  const toggleBtn = document.getElementById('toggle-btn');

  // Load state
  chrome.storage.local.get('recording', (data) => {
    updateUI(data.recording);
  });

  toggleBtn.addEventListener('click', () => {
    chrome.storage.local.get('recording', (data) => {
      const newState = !data.recording;
      chrome.storage.local.set({ recording: newState });
      updateUI(newState);
    });
  });

  function updateUI(recording) {
    statusText.textContent = recording ? 'ON' : 'OFF';
    statusText.style.color = recording ? 'green' : 'red';
    toggleBtn.textContent = recording ? 'Pause Recording' : 'Resume Recording';
  }
});
