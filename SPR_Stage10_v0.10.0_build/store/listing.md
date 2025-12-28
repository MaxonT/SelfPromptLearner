# Chrome Web Store Listing Draft

## Title
Self-Prompt Reflection (SPR)

## Short description
Capture, organize, and analyze your AI prompts with a private dashboard.

## Detailed description
SPR is a lightweight browser extension + local/private dashboard that helps you:
- Capture prompts from supported AI chat sites (ChatGPT, Claude, etc.)
- Sync them to your own server (you control the database)
- Search, filter, tag, and review prompt history
- Get deterministic rule-based analysis (task type, intent, risk flags, and quality signals)

### Key features
- Reliable capture with offline queue + retry
- Idempotent ingestion (no duplicate records)
- Per-user accounts and data isolation
- Export (JSON/CSV) and delete-my-data
- Rules-first analysis, optional LLM analysis later

## Permissions justification
- storage: store captured prompts and sync queue
- alarms: background sync retries

## Support
Email: support@example.com
Website: https://example.com
