// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const { prompts } = await chrome.storage.local.get('prompts');
  const list = (prompts || []).map(p => p.text).join('\n');
  document.querySelector('#count span').textContent = prompts.length;
  document.getElementById('export').onclick = () => {
    const blob = new Blob([list], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'my_prompts.txt'; a.click();
    URL.revokeObjectURL(url);
  };
});