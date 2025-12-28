/**
 * Title: SPR - Render Deploy Check
 * File: backend/script/render-check.cjs
 * Purpose: Quick env validation for production deploys.
 */
const required = ["DATABASE_URL", "SESSION_SECRET", "APP_ORIGIN"];
const missing = required.filter((k) => !process.env[k] || String(process.env[k]).trim() === "");

if (missing.length) {
  console.error("❌ Missing required env vars:");
  for (const k of missing) console.error(`- ${k}`);
  process.exit(1);
}

console.log("✅ Env looks good.");
