# SPR Regression Checklist (Stage 8)

## Local sanity
- [ ] `npm ci` completes
- [ ] `npm run check` passes (TypeScript)
- [ ] `npm run build` produces `dist/`

## DB + API
- [ ] Postgres reachable (`DATABASE_URL` set)
- [ ] `npm run db:push` succeeds
- [ ] `npm run start` boots without crash
- [ ] `GET /api/health` returns 200

## Auth + privacy
- [ ] Register works
- [ ] Login works
- [ ] Token copy works
- [ ] User A cannot see User B prompts

## Extension ingestion
- [ ] Extension can be loaded unpacked
- [ ] Token configured in popup
- [ ] Capture + sync adds prompts to dashboard
- [ ] Duplicate sync does not create duplicates (idempotent)

## Export / delete
- [ ] Export JSON works
- [ ] Export CSV works
- [ ] Delete account removes data

## Extension Harness E2E (Stage 12)
- [ ] `npm run test:ext` passes locally (requires xvfb on Linux)
- [ ] Fixture page loads: `/e2e/fixture/chat.html`
- [ ] Extension popup shows Server URL + API Token fields
- [ ] E2E capture injects a prompt and it appears in `/api/prompts`
