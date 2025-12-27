// background.js - Handles storage and messaging

chrome.runtime.onInstalled.addListener(() => {
  console.log("SPR Extension Installed");
  chrome.storage.local.set({ recording: true, prompts: [] });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SAVE_PROMPT") {
    handleSavePrompt(request.payload);
  } else if (request.type === "GET_STATUS") {
    chrome.storage.local.get("recording", (data) => {
      sendResponse({ recording: data.recording });
    });
    return true; // Keep channel open for async response
  }
});

function handleSavePrompt(payload) {
  chrome.storage.local.get(["recording", "prompts"], (data) => {
    if (!data.recording) return;

    const prompts = data.prompts || [];
    
    // Simple dedup based on hash and time (10s window)
    const recent = prompts[prompts.length - 1];
    const now = Date.now();
    if (recent && recent.promptHash === payload.promptHash && (now - new Date(recent.createdAt).getTime() < 10000)) {
      console.log("Duplicate prompt detected, ignoring.");
      return;
    }

    const newPrompt = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...payload,
      analysis: analyzePrompt(payload.promptText) // Local lightweight analysis
    };

    prompts.push(newPrompt);
    chrome.storage.local.set({ prompts });
    console.log("Prompt saved:", newPrompt);
    
    // Optional: Sync to server if configured
    // fetch('http://localhost:5000/api/prompts', { method: 'POST', body: JSON.stringify(newPrompt)... })
  });
}

// Lightweight heuristic analysis
function analyzePrompt(text) {
  const analysis = {
    taxonomy: { taskType: [], intent: [], constraints: [], riskFlags: [] },
    scores: { clarity: 50, ambiguity: 0, reproducibility: 50 },
    traits: [],
    suggestions: []
  };

  const lower = text.toLowerCase();
  
  // Taxonomy
  if (lower.includes("code") || lower.includes("function") || lower.includes("react")) analysis.taxonomy.taskType.push("coding");
  if (lower.includes("explain") || lower.includes("what is")) analysis.taxonomy.taskType.push("study");
  if (lower.includes("write") || lower.includes("draft")) analysis.taxonomy.taskType.push("writing");

  // Scores (Very rough heuristics)
  analysis.scores.clarity = Math.min(100, text.length / 2); 
  if (lower.includes("example")) analysis.scores.reproducibility += 20;
  
  return analysis;
}
