// content.js - Captures prompts from AI chat interfaces

console.log("SPR Content Script Loaded");

let lastPromptText = "";

// Site-specific selectors
const SITES = {
  chatgpt: {
    input: "#prompt-textarea",
    submit: "[data-testid='send-button']"
  },
  claude: {
    input: "div[contenteditable='true']", // Generic contenteditable often used by Claude
    submit: "button[aria-label='Send Message']" // Verify this selector
  },
  generic: {
    input: "textarea, input[type='text'], div[contenteditable='true']",
    submit: "button[type='submit'], button[aria-label='Send'], button[aria-label='Submit']"
  }
};

function detectSite() {
  const host = window.location.hostname;
  if (host.includes("openai")) return "chatgpt";
  if (host.includes("claude")) return "claude";
  return "generic";
}

function getPromptText(inputEl) {
  if (inputEl.tagName === "TEXTAREA" || inputEl.tagName === "INPUT") {
    return inputEl.value;
  }
  return inputEl.innerText;
}

function setupListeners() {
  const siteKey = detectSite();
  const selectors = SITES[siteKey] || SITES.generic;
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // User pressed Enter. Check if an input is focused.
      const active = document.activeElement;
      if (active && active.matches(selectors.input)) {
        const text = getPromptText(active);
        if (text.trim()) {
          // Capture immediately before submit clears it
          capturePrompt(text, siteKey, "enter");
        }
      }
    }
  }, true); // Capture phase to get it before other listeners might stop propagation

  // Click listener for submit buttons
  document.addEventListener("click", (e) => {
    const target = e.target.closest(selectors.submit);
    if (target) {
      // Find the input. This is tricky as it might be anywhere.
      // Heuristic: Look for the main input selector on the page.
      const input = document.querySelector(selectors.input);
      if (input) {
        const text = getPromptText(input);
        if (text.trim()) {
          capturePrompt(text, siteKey, "click");
        }
      }
    }
  }, true);
}

async function capturePrompt(text, site, method) {
  // Hash text for dedup
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const payload = {
    site,
    pageUrl: window.location.href,
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
