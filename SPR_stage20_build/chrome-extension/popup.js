// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const updateCount = async () => {
    const { prompts } = await chrome.storage.local.get('prompts');
    document.querySelector('#count span').textContent = (prompts || []).length;
  };
  updateCount();

  // 导出功能
  document.getElementById('export').onclick = async () => {
    const { prompts } = await chrome.storage.local.get('prompts');
    const list = (prompts || []).map(p => p.text).join('\n===SPLIT===\n');
    const blob = new Blob([list], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'my_prompts.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  // 扫描功能
  document.getElementById('scan').onclick = async () => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (!tab.url.includes("chat.openai.com") && !tab.url.includes("chatgpt.com")) {
      alert("请先打开 ChatGPT 网页！");
      return;
    }
    
    // 注入脚本抓取
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => {
        // 抓取逻辑：找所有 user 气泡
        const texts = [...document.querySelectorAll('[data-message-author-role="user"]')]
                      .map(d => d.innerText.trim()).filter(t => t);
        if (texts.length === 0) return 0;
        // 发回给 background 存
        chrome.runtime.sendMessage({type: "PROMPTS", texts});
        return texts.length;
      }
    }, (results) => {
      const count = results[0]?.result || 0;
      alert(count > 0 ? `成功扫描并保存 ${count} 条 Prompt！` : "当前页面没找到 Prompt，请滚动加载更多历史记录后再试。");
      setTimeout(updateCount, 500); // 稍后刷新计数
    });
  };
});