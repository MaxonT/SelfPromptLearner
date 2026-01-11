# DISCOVERY (CURRENT)

> Observed repo reality only. No guessing.


## Timestamp
- 2026-01-10 21:23:37

## Top-level
- .devcontainer/
- .git/
- .githooks/
- .openhands/
- .venv/
- company/
- scripts/
- SPR_stage20_build/
- .DS_Store
- .gitignore
- agent_run.py
- render.yaml

## Key build/package descriptors (found)
- SPR_stage20_build\package.json
- SPR_stage20_build\node_modules\@alloc\quick-lru\package.json
- SPR_stage20_build\node_modules\@babel\code-frame\package.json
- SPR_stage20_build\node_modules\@babel\compat-data\package.json
- SPR_stage20_build\node_modules\@babel\core\package.json
- SPR_stage20_build\node_modules\@babel\generator\package.json
- SPR_stage20_build\node_modules\@babel\helper-compilation-targets\package.json
- SPR_stage20_build\node_modules\@babel\helper-globals\package.json
- SPR_stage20_build\node_modules\@babel\helper-module-imports\package.json
- SPR_stage20_build\node_modules\@babel\helper-module-transforms\package.json
- SPR_stage20_build\requirements.txt
- SPR_stage20_build\mirror\requirements.txt
- SPR_stage20_build\node_modules\body-parser\node_modules\debug\Makefile
- SPR_stage20_build\node_modules\express\node_modules\debug\Makefile
- SPR_stage20_build\node_modules\express-session\node_modules\debug\Makefile
- SPR_stage20_build\node_modules\finalhandler\node_modules\debug\Makefile
- SPR_stage20_build\node_modules\pause\Makefile
- SPR_stage20_build\node_modules\pg-types\Makefile
- SPR_stage20_build\node_modules\send\node_modules\debug\Makefile
- SPR_stage20_build\docker-compose.yml

## package.json scripts (first package.json)
- dev: cross-env NODE_ENV=development tsx backend/server/index.ts
- build: npx tsx backend/script/build.ts
- start: cross-env NODE_ENV=production node dist/index.cjs
- check: tsc
- db:push: drizzle-kit push
- db:fix: node backend/script/fix-db.cjs
- db:up: docker compose up -d
- db:down: docker compose down
- pack:extension: node backend/script/pack-extension.cjs
- pack:store-assets: node backend/script/gen-store-assets.cjs
- deploy:render:check: node backend/script/render-check.cjs
- test:smoke: node backend/script/smoke.cjs
- ci: npm run check && npm run build && npm run test:smoke
- test:e2e: node backend/script/e2e-lite.cjs
- bench:list: node backend/script/bench-list.cjs
- test:ui: playwright test
- playwright:install: playwright install chromium
- test:ext: xvfb-run -a npx playwright test others/e2e/extension.spec.ts
- test:ext:local: npx playwright test others/e2e/extension.spec.ts
- test:ui:visual: cross-env SPR_VISUAL=1 npm run test:ui
- security:scan: node backend/script/security-scan.cjs
- security:audit: npm audit --omit=dev --audit-level=moderate

## README hints (first README found)
- .venv\Lib\site-packages\adodbapi\readme.txt

## Next (manual): confirm run/test commands
- Fill PLAN.md after you confirm how to run and test.
