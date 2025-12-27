\
/**
 * Title: SPR - Pack Extension
 * File: script/pack-extension.cjs
 * Purpose: Package the Chrome extension into a zip for store upload/testing.
 *
 * Notes:
 * - Uses system zip on macOS/Linux if available.
 * - Uses PowerShell Compress-Archive on Windows.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

const root = path.resolve(__dirname, "..");
const extDir = path.join(root, "extension");
const outDir = path.join(root, "dist-artifacts");
const outZip = path.join(outDir, "spr-extension.zip");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Remove old zip
if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

const isWin = process.platform === "win32";

try {
  if (isWin) {
    // Compress-Archive requires PowerShell
    const ps = `powershell -NoProfile -Command "Compress-Archive -Path '${extDir}\\*' -DestinationPath '${outZip}' -Force"`;
    run(ps);
  } else {
    // Prefer zip if installed
    run(`cd "${extDir}" && zip -r "${outZip}" . -x "*.DS_Store"`);
  }
  console.log(`\n✅ Extension zip created: ${outZip}\n`);
} catch (err) {
  console.error("\n❌ Failed to package extension.\n");
  console.error("Try manually:");
  console.error("- Chrome: chrome://extensions -> Pack extension");
  console.error("- Or install zip tool / PowerShell Compress-Archive.\n");
  process.exit(1);
}
