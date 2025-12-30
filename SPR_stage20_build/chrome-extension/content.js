// content.js – 把页面用户消息抓出来给 background
(() => {
  const extract = () => [...document.querySelectorAll('[data-message-author-role="user"]')]
                        .map(d => d.innerText.trim()).filter(t => t);
  // 初始抓一次
  chrome.runtime.sendMessage({ type: "PROMPTS", texts: extract() });
  // 监听 DOM 变化，持续抓
  new MutationObserver(() => {
    chrome.runtime.sendMessage({ type: "PROMPTS", texts: extract() });
  }).observe(document.body, { childList: true, subtree: true });
})();