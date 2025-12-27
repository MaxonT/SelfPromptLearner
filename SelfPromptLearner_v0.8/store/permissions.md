# Permissions (Chrome Web Store)

Required permissions:
- storage: needed to persist captured prompts, settings, and the offline sync queue.
- alarms: needed to periodically retry syncing when the network is back.

Host permissions:
- Only the supported AI chat sites are included by default (for content scripts).
Optional host permissions:
- localhost / 127.0.0.1 and common hosting domains (Render/Fly/Railway/Vercel/Netlify)
  are requested as optional so the extension can sync to your configured server.
