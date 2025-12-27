# Self-Prompt Reflection (SPR)

**Version:** v0.5.0 (Stage 5)

### What's new in v0.5.0
- Rules-first **prompt analysis engine** (taxonomy + scores + suggestions) auto-generated on ingest
- API: `/api/prompts` supports `taskType`, `intent`, `riskFlag`
- API: new `/api/taxonomy` endpoint for dropdown filter options
- Dashboard: new filters for **Task Type** and **Risk**

A **browser extension + dashboard** that captures your AI prompts (ChatGPT / Claude) and lets you review, search, and analyze them.

This repo runs as a **single full-stack app**:
- **Extension** (Chrome MV3) captures prompts
- **Server** (Express + Drizzle) stores & serves data
- **Client** (React + Vite) shows Timeline/Analytics UI

---

## 0) Requirements

- Node.js 20+
- npm 9+
- (Recommended) Docker Desktop (for local Postgres)

---

## 1) Quick Start (Local Dev)

### Step 1 — Install deps

```bash
npm install
```

### Step 2 — Create your .env

Copy:

```bash
cp .env.example .env
```

### Step 3 — Start Postgres (recommended)

```bash
npm run db:up
```

Then set your `DATABASE_URL` in `.env` to:

```bash
postgres://spr:spr_password@localhost:5432/spr
```

### Step 4 — Create tables (Drizzle push)

```bash
npm run db:push
```

### Step 5 — Run the app

```bash
npm run dev
```

Open:
- Dashboard: http://localhost:5000
- API: http://localhost:5000/api/prompts

> On first run, the server seeds a small sample dataset.

---

## 2) Build & Run (Production-like)

```bash
npm run build
npm start
```

---

## 3) Load the Chrome Extension

1) Open Chrome: `chrome://extensions/`
2) Enable **Developer mode**
3) Click **Load unpacked**
4) Select this folder:

```text
extension/
```

### Manual Test Checklist

**Popup & Status**
- [ ] Click the SPR extension icon → Recording shows ON
- [ ] Click Pause → OFF
- [ ] Click Resume → ON

**Capture (ChatGPT)**
- [ ] Go to `https://chat.openai.com/` (or `https://chatgpt.com/` if you use that)
- [ ] Type a prompt and send
- [ ] Open extension service worker console → verify logs

**Capture (Claude)**
- [ ] Go to `https://claude.ai/`
- [ ] Type a prompt and send
- [ ] Verify logs

✅ Stage-2: the extension stores prompts locally **and** will auto-sync to the server (default: `http://localhost:5000`).

Sync tips:
- You can change **Server URL** and toggle **Auto sync** in the popup
- Popup shows pending sync count
- Server health: `http://localhost:5000/api/health`

---

## 4) Repo Structure

- `extension/` Chrome Extension (Manifest V3)
- `client/` React Dashboard
- `server/` Express API + Vite integration
- `shared/` Shared types, API contract, DB schema

---

## 5) Common Commands

```bash
npm run dev        # start server + dashboard (Vite middleware)
npm run check      # TypeScript typecheck
npm run build      # build client + bundle server to dist/
npm start          # run production bundle
npm run db:up      # start postgres via docker compose
npm run db:down    # stop postgres
npm run db:push    # create/update tables from shared/schema.ts
```

---

## Privacy

- Extension currently stores prompts locally in Chrome.
- No third-party cloud is used unless you later configure it.


## Stage 4 (v0.4.0) — Device ID, Idempotent Ingestion, Sync Observability

- Extension now generates a persistent `deviceId` and a per-capture `clientEventId`.
- Server enforces idempotency with a unique constraint on `(deviceId, clientEventId)`.
- Popup shows device id, last sync time, and last sync error.


---

## Stage 7: Production Ready (Deploy + Publish)

### One-service deployment (recommended): Render (Fullstack + Postgres)
This repo builds BOTH the client and server into `dist/` and serves the dashboard from the same web service.

#### Deploy steps (Render)
1) Push this repo to GitHub.
2) In Render: **New → Blueprint** and select the repo (uses `render.yaml`).
3) After deploy, open:
   - App: `https://<your-app>.onrender.com`
   - Health: `https://<your-app>.onrender.com/api/health`

#### Required env vars
- `DATABASE_URL` (Render auto-wires from the database in render.yaml)
- `SESSION_SECRET` (Render auto-generates)
- `APP_ORIGIN` (set to your public URL, e.g. https://<your-app>.onrender.com)

### Extension packaging
- macOS/Linux: requires `zip`
- Windows: uses PowerShell `Compress-Archive`

Commands:
```bash
npm run pack:extension
```
Output:
- `dist-artifacts/spr-extension.zip`

### Chrome Web Store prep
Draft assets and documents are in `store/`:
- `listing.md`
- `privacy.md`
- `permissions.md`
- `screenshot-placeholder.png` (replace with real screenshots)

### Permissions minimization
This extension only requires:
- `storage`
- `alarms`
Host permissions are limited to supported AI chat sites, and server origins are optional.


## CI

This repo includes a minimal GitHub Actions workflow:

- TypeScript typecheck (`npm run check`)
- Production build (`npm run build`)
- API smoke test (`npm run test:smoke`) against a Postgres service

See `.github/workflows/ci.yml`.
