# SPR — Stage 18 Report (v0.18.0)

## Goal
Data/API robustness (P0): query performance, consistent error contract, streaming exports, and ingestion rate limiting.

## Done ✅
- DB schema: add `prompts.user_id` and add performance indexes:
  - (user_id, created_at), (user_id, site), (user_id, task_type), (user_id, intent), GIN(tags)
- API robustness:
  - Create prompt now correctly binds prompt to the authenticated user
  - Add per-user ingestion rate limiting (`INGEST_RATE_LIMIT_PER_MIN`)
  - Standardize error responses to include `{ code, message, requestId }` where applicable
- Export robustness:
  - Export JSON/CSV rewritten as streaming endpoints to avoid high memory usage

## Not yet ⏳
- Full-text search / tsvector optimization (optional future)
- Bench thresholds wired into CI (planned in Stage 18.1 / 18)

## Acceptance Checklist ✅
1. `npm run build` passes
2. Create prompt via extension sync stores under correct user (no cross-user leakage)
3. Export JSON/CSV succeeds for large datasets without excessive memory growth
4. Ingestion returns 429 when exceeding the per-minute limit (configurable)

## Rollback
Revert to Stage 16 ZIP.

## Changelog (copyable)
- Add prompts.user_id + performance indexes (btree + gin)
- Fix prompt creation to attach authenticated userId
- Add per-user ingestion rate limiting with 429 response
- Stream export JSON/CSV to reduce memory spikes
- Expand error contract with code + requestId


---
## Stage 20 — Repo Layout Refactor (backend/frontend/others)

- Root directories are now strictly: `backend/`, `frontend/`, `others/`.
- All previous top-level folders were relocated accordingly.
- Root-level config files remain in place (package.json, vite.config.ts, etc.).

Acceptance:
- `npm run dev` still starts server + dashboard.
- `npm run build` still produces `dist/`.
- `npm run test:ui` and `npm run test:ext` still resolve the new `others/e2e` path.
