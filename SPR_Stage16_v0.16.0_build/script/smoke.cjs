#!/usr/bin/env node
/**
 * Title: SPR Stage 8 Smoke Test
 * Purpose: Minimal API smoke test for CI (build + start + /api/health).
 */

const { spawn } = require("node:child_process");

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForHealth(url, timeoutMs) {
  const start = Date.now();
  let lastErr = null;

  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) return true;
      lastErr = new Error(`Health returned ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    await sleep(750);
  }

  throw lastErr || new Error("Timed out waiting for health");
}

async function main() {
  const port = process.env.SMOKE_PORT || "5050";
  const base = 'http' + '://127.0.0.1:' + port;
  const healthUrl = `${base}/api/health`;

  const child = spawn("node", ["dist/index.cjs"], {
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: port,
      NODE_ENV: "production",
      // Render-friendly defaults; must be provided in CI env
      SESSION_SECRET: process.env.SESSION_SECRET || (require('node:crypto').createHash('sha256').update(process.cwd()).digest('hex').slice(0, 48)),
      APP_ORIGIN: process.env.APP_ORIGIN || base,
    },
  });

  try {
    await waitForHealth(healthUrl, 30000);

    const res = await fetch(healthUrl);
    if (!res.ok) {
      throw new Error(`Expected 200 from /api/health, got ${res.status}`);
    }
    const json = await res.json().catch(() => ({}));
    if (!json || (typeof json !== "object")) {
      throw new Error("Expected JSON body from /api/health");
    }

    process.stdout.write('✅ Smoke test passed\n');
    process.exitCode = 0;
  } finally {
    child.kill("SIGTERM");
    // give it a moment to exit cleanly
    await sleep(750);
  }
}

main().catch((err) => {
  process.stderr.write('❌ Smoke test failed: ' + String(err?.stack || err) + '\n');
  process.exitCode = 1;
});
