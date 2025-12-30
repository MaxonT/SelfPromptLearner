// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const countEl = document.querySelector('#count span');
  
  // 核心：读取并显示
  const updateCount = async () => {
    const { prompts } = await chrome.storage.local.get('prompts');
    countEl.textContent = (prompts || []).length;
    return prompts || [];
  };
  await updateCount();

  // 导出功能
  document.getElementById('export').onclick = async () => {
    const prompts = await updateCount(); // 确保读到最新的
    if (prompts.length === 0) {
      alert("还没有收集到数据，先去 ChatGPT 页面点「扫描」！");
      return;
    }
    const list = prompts.map(p => p.text).join('\n===SPLIT===\n');
    const blob = new Blob([list], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'my_prompts.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  // 扫描功能 (逻辑重写：Popup 直接写入 storage，不经过 background)
  document.getElementById('scan').onclick = async () => {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (!tab?.url) return alert("无法获取当前页面 URL");
    
    if (!tab.url.includes("chat.openai.com") && !tab.url.includes("chatgpt.com")) {
      alert("请先打开 ChatGPT 网页！");
      return;
    }
    
    // 注入脚本抓取
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: () => {
        // 抓取逻辑：找所有 user 气泡
        return [...document.querySelectorAll('[data-message-author-role="user"]')]
               .map(d => d.innerText.trim()).filter(t => t);
      }
    }, async (results) => {
      if (chrome.runtime.lastError) {
        alert("扫描失败: " + chrome.runtime.lastError.message);
        return;
      }
      
      const texts = results[0]?.result || [];
      if (texts.length === 0) {
        alert("当前页面没找到 Prompt，请滚动加载更多历史记录后再试。");
        return;
      }

      // --- 关键修改：直接在这里写入 storage ---
      const { prompts = [] } = await chrome.storage.local.get("prompts");
      let added = 0;
      
      // 简单去重：只存新的
      const existing = new Set(prompts.map(p => p.text));
      texts.forEach(t => {
        if (!existing.has(t)) {
          prompts.push({ ts: Date.now(), text: t, src: "scan" });
          existing.add(t); // 防止单次扫描内重复
          added++;
        }
      });

      await chrome.storage.local.set({ prompts });
      // ------------------------------------

      await updateCount(); // 立即刷新界面
      alert(`扫描完成！\n找到: ${texts.length} 条\n新增: ${added} 条\n(已过滤重复内容)`);
    });
  };
});