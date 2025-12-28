/**
 * Title: SPR - Store Assets Helper
 * File: backend/script/gen-store-assets.cjs
 * Purpose: Ensure others/store/ assets exist (placeholder generator lives in build pipeline).
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const store = path.join(root, "others", "store");

if (!fs.existsSync(store)) {
  console.error("others/store/ folder not found.");
  process.exit(1);
}

console.log("✅ others/store/ assets present.");
console.log("Next: replace screenshot-placeholder.png with real screenshots before submission.");
