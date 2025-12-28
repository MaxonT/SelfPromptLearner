# Chrome Web Store Packaging Checklist (SPR)

## Assets
- [ ] 128x128 icon (extension) ✅ `frontend/extension/assets/icon-128.png`
- [ ] Store icon 512x512 ✅ `others/store/assets/store-icon-512.png`
- [ ] Screenshots (at least 1) ✅ `others/store/assets/screenshot-1.png` ... `screenshot-4.png`

## Permissions
- [ ] `storage`, `alarms` only ✅
- [ ] `host_permissions` restricted to supported sites ✅
- [ ] Backend origins in `optional_host_permissions` ✅
- [ ] Web accessible resources not `<all_urls>` ✅

## Privacy
- [ ] Explain data collected (prompts + metadata) and why ✅ `others/store/privacy.md`
- [ ] Explain user control: export/delete ✅
- [ ] Clarify self-hosting / server URL ✅

## Build
- [ ] `npm run pack:extension` produces store zip ✅
- [ ] Smoke: load unpacked and capture at least one prompt ✅
