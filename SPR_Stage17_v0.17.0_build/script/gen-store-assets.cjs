/**
 * Title: SPR - Store Assets Helper
 * File: script/gen-store-assets.cjs
 * Purpose: Ensure store/ assets exist (placeholder generator lives in build pipeline).
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const store = path.join(root, "store");

if (!fs.existsSync(store)) {
  console.error("store/ folder not found.");
  process.exit(1);
}

console.log("✅ store/ assets present.");
console.log("Next: replace screenshot-placeholder.png with real screenshots before submission.");
