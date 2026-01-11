# PLAN (CURRENT)

> Iteration 0 output: **how to run + how to test** on Windows.
> No guessing — based on repo discovery + actual successful run.

## Reality
- Project folder: SPR_stage20_build/
- Node:
ode -v must work
- Use
pm.cmd (bypass
pm.ps1 ExecutionPolicy issue)
- DB required for smoke test: DATABASE_URL must be set
- DB is started via Docker Compose: SPR_stage20_build/docker-compose.yml

## Runbook (Windows, PowerShell)

### A) Start DB (required for smoke)
1) cd SPR_stage20_build
2) docker compose up -d
3) Detect the host port mapped to container 5432:
   - docker compose ps --format json
   - Find :(HOSTPORT)->5432/tcp
4) Set for this terminal:
   - \postgres://postgres:postgres@localhost:5432/postgres = "postgres://postgres:postgres@localhost:HOSTPORT/postgres"

### B) Install + Smoke
From SPR_stage20_build/:
-
pm.cmd ci
-
pm.cmd run test:smoke

### C) Optional quality chain
From SPR_stage20_build/:
-
pm.cmd run check
-
pm.cmd run build
-
pm.cmd run test:smoke

## Definition of Done (Iteration 0)
- Smoke test returns exit code 0 **with DATABASE_URL set**.
- The exact commands + outputs are logged in TEST_RESULTS.md.

