// content.js - Captures prompts from AI chat interfaces


let lastCapture = { hash: null, at: 0 };

// Site-specific selectors
const SITES = {
  chatgpt: {
    input: "#prompt-textarea",
    submit: "[data-testid='send-button'], button[data-testid='send-button']",
  },
  claude: {
    input: "div[contenteditable='true']",
    submit: "button[aria-label='Send Message'], button[aria-label='Send']",
  },
  generic: {
    input: "textarea, input[type='text'], div[contenteditable='true']",
    submit: "button[type='submit'], button[aria-label='Send'], button[aria-label='Submit']",
  },
};

function detectSite() {
  const host = window.location.hostname;
  if (host.includes("openai")) return "chatgpt";
  if (host.includes("claude")) return "claude";
  return "generic";
}

function getConversationId(siteKey) {
  try {
    const url = new URL(window.location.href);
    if (siteKey === 'chatgpt') {
      const parts = url.pathname.split('/').filter(Boolean);
      const i = parts.indexOf('c');
      if (i >= 0 && parts[i + 1]) return parts[i + 1];
    }
    if (siteKey === 'claude') {
      const parts = url.pathname.split('/').filter(Boolean);
      const i = parts.indexOf('chat');
      if (i >= 0 && parts[i + 1]) return parts[i + 1];
    }
    return null;
  } catch {
    return null;
  }
}

function getPromptText(inputEl) {
  if (inputEl.tagName === "TEXTAREA" || inputEl.tagName === "INPUT") {
    return inputEl.value;
  }
  return inputEl.innerText;
}

function resolveInput(selectors) {
  const active = document.activeElement;
  if (active && active.matches && active.matches(selectors.input)) return active;
  return document.querySelector(selectors.input);
}

function setupListeners() {
  const siteKey = detectSite();
  const selectors = SITES[siteKey] || SITES.generic;

  // Capture on Enter
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Enter' || e.shiftKey) return;
      const input = resolveInput(selectors);
      if (!input) return;
      const text = getPromptText(input);
      if (text.trim()) capturePrompt(text, siteKey, 'enter');
    },
    true,
  );

  // Capture on submit click
  document.addEventListener(
    'click',
    (e) => {
      const target = e.target?.closest?.(selectors.submit);
      if (!target) return;
      const input = resolveInput(selectors);
      if (!input) return;
      const text = getPromptText(input);
      if (text.trim()) capturePrompt(text, siteKey, 'click');
    },
    true,
  );

  // Fallback: capture on form submit (some UIs use hidden form handlers)
  document.addEventListener(
    'submit',
    (e) => {
      const input = resolveInput(selectors);
      if (!input) return;
      const text = getPromptText(input);
      if (text.trim()) capturePrompt(text, siteKey, 'submit');
    },
    true,
  );
}

async function capturePrompt(text, site, method) {
  // Hash text for dedup
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Local debounce to avoid double-capture from enter+click
  const now = Date.now();
  if (lastCapture.hash === hashHex && now - lastCapture.at < 800) {
    return;
  }
  lastCapture = { hash: hashHex, at: now };

  const payload = {
    site,
    pageUrl: window.location.href,
    conversationId: getConversationId(site),
    promptText: text,
    promptHash: hashHex,
    meta: {
      lengthChars: text.length,
      lengthTokensEst: Math.ceil(text.length / 4),
      isEdit: false, // Todo: detect edits
      submitMethod: method
    }
  };

  chrome.runtime.sendMessage({ type: "SAVE_PROMPT", payload });
}

// Initialize
setupListeners();
