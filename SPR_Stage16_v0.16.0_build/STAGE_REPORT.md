# SPR Stage 16 — Reliability Hardening (v0.16.0)

## Done ✅
- Extension transactional sync queue (stateful items: pending/sending/failed) with crash-safe "mark sending" and stale-sending reset
- Stronger capture dedupe (event fingerprint with 30s bucket) + legacy promptHash dedupe retained
- Sync observability upgrade:
  - background sync stores lastRequestId from server response headers
  - popup shows pending + failed + last request id
- Sync auth hardening: extension sync now sends Authorization Bearer token when configured

## Not yet ⏳
- Server-side batch ingestion endpoint (optional, later)
- Dashboard sync status banner (Stage 18)

## Acceptance checklist ✅
1) Load extension (unpacked) and enable recording
2) Send 50 prompts quickly -> dashboard shows 50 new items (no obvious duplicates)
3) Go offline, send 10 prompts, close & reopen browser -> go online -> all 10 eventually appear
4) Popup shows pending/failed counts and last request id updates after sync

## Rollback 🔁
- Replace this folder with previous ZIP: Stage 15 (v0.15.0)

## Changelog (copy/paste)
- Implement transactional sync queue with crash safety and stale-sending recovery
- Add event-fingerprint dedupe (30s bucket) to reduce duplicate capture noise
- Improve sync observability: lastRequestId + failed counts in popup
- Ensure extension sync uses Authorization Bearer token when apiToken is set
