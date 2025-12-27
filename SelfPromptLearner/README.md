# Self-Prompt Reflection (SPR)

A browser extension and dashboard for capturing, analyzing, and improving your AI prompts.

## Project Structure

- `extension/`: Chrome Extension source code (Manifest V3)
  - `manifest.json`: Extension configuration
  - `background.js`: Background service worker
  - `content.js`: Content script for capturing prompts
  - `popup.html` & `popup.js`: Extension popup UI
- `client/`: React Dashboard for analytics (built with Replit)
- `server/`: Backend API and storage (supports the Dashboard)
- `shared/`: Shared types and schema

## How to Run

### 1. Start the Dashboard & Server
The dashboard and sync server run in this Replit workspace.
- The application should be running automatically.
- If stopped, run `npm run dev` in the Shell.
- Open the Webview to see the Dashboard.

### 2. Load the Extension in Chrome
To test the capture functionality, you need to load the `extension/` folder into Chrome.

1. Download the `extension/` folder from this Replit workspace to your local machine.
   - You can simply copy-paste the files into a local folder named `spr-extension`.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked**.
5. Select the local `spr-extension` folder.

## Manual Test Checklist

### 1. Popup & Status
- [ ] Click the SPR extension icon.
- [ ] Verify it shows "Recording: ON".
- [ ] Click "Pause Recording" -> Status changes to "OFF".
- [ ] Click "Resume Recording" -> Status changes to "ON".

### 2. Capture (ChatGPT)
- [ ] Go to `chat.openai.com`.
- [ ] Type a prompt: "Write a haiku about code."
- [ ] Press Enter.
- [ ] Check the extension console (Inspect popup or background page) or the Dashboard.
- [ ] Verify the prompt appears in the Dashboard Timeline.

### 3. Capture (Claude)
- [ ] Go to `claude.ai`.
- [ ] Type a prompt.
- [ ] Click the Send button.
- [ ] Verify capture in Dashboard.

### 4. Dashboard
- [ ] Open the Dashboard URL.
- [ ] Verify the "Prompts Today" count incremented.
- [ ] Click on a prompt to see details (Analysis, Scores).
- [ ] Go to Analytics page and check if the Site Chart updates.

## Privacy
- By default, prompts are stored in `chrome.storage.local` within the extension (in the full build) or sent to this local Dev server (in this MVP).
- No data is sent to third-party clouds unless you configure it.
