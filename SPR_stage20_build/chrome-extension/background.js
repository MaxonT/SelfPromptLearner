// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ prompts: [] });
});

// 1. 剪贴板监听：用户复制任意文本就存
chrome.clipboard.onClipboardDataChanged.addListener(async () => {
  try {
    const txt = await navigator.clipboard.readText();
    if (!txt || txt.length < 5) return;
    const { prompts } = await chrome.storage.local.get("prompts");
    prompts.push({ ts: Date.now(), text: txt, src: "clipboard" });
    chrome.storage.local.set({ prompts });
  } catch {}
});

// 2. 网页缓存：每次打开 ChatGPT 页面就抓用户消息
chrome.tabs.onUpdated.addListener(async (tabId, change, tab) => {
  if (!tab.url || !tab.url.includes("chat.openai.com")) return;
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => [...document.querySelectorAll('[data-message-author-role="user"]')]
                   .map(d => d.innerText.trim()).filter(t => t)
    });
    const texts = results[0].result;
    const { prompts } = await chrome.storage.local.get("prompts");
    texts.forEach(t => prompts.push({ ts: Date.now(), text: t, src: "chatgpt" }));
    chrome.storage.local.set({ prompts });
  } catch {}
});