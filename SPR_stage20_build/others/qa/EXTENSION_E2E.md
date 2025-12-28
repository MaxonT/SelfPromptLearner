# Extension Harness E2E

This suite loads the unpacked MV3 extension into Chromium and verifies the ingestion chain against a stable fixture page.

## Run locally

```bash
npm install
npm run db:up
npm run db:push
npm run build
node dist/index.cjs
```

In another terminal:

```bash
# Linux CI-like
npm run test:ext

# macOS/Windows (headed)
npm run test:ext:local
```

## Notes

- The test uses `/e2e/fixture/chat.html` as a stable DOM page.
- A test-only background hook is gated behind `SPR_E2E_ENABLE`.
