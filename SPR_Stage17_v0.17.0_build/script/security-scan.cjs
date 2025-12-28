#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".git" || ent.name === "dist") continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(p, out);
    } else {
      out.push(p);
    }
  }
  return out;
}

function read(p) {
  return fs.readFileSync(p, "utf8");
}

function fail(msg) {
  console.error(`[security:scan] FAIL: ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`[security:scan] OK: ${msg}`);
}

// 1) Manifest permissions audit
const manifestPath = path.join(root, "extension", "manifest.json");
if (fs.existsSync(manifestPath)) {
  const manifestRaw = read(manifestPath);
  const manifest = JSON.parse(manifestRaw);

  const bad = ["<all_urls>", "*://*/*"];
  const hostPerms = (manifest.host_permissions || []).join(" ");
  const optHostPerms = (manifest.optional_host_permissions || []).join(" ");
  const csMatches = (manifest.content_scripts || [])
    .flatMap((cs) => cs.matches || [])
    .join(" ");

  for (const b of bad) {
    if (hostPerms.includes(b) || optHostPerms.includes(b) || csMatches.includes(b)) {
      fail(`Manifest uses overly-broad URL pattern: "${b}"`);
    }
  }

  if (
    manifest.permissions &&
    manifest.permissions.some(
      (p) => typeof p === "string" && (p.includes("://") || p.includes("<all_urls>")),
    )
  ) {
    fail("Manifest should use host_permissions for URL patterns (URL-like entry found in permissions).");
  }

  ok("manifest permissions/host_permissions look minimal");
} else {
  fail("missing extension/manifest.json");
}

// 2) Disallow innerHTML in extension popup code (XSS footgun)
const extFiles = walk(path.join(root, "extension"));
for (const f of extFiles) {
  if (!f.endsWith(".js")) continue;
  const t = read(f);
  if (/\binnerHTML\b/.test(t)) {
    fail(`innerHTML usage detected in extension JS: ${path.relative(root, f)}`);
  }
}
ok("no innerHTML usage in extension JS");

// 3) Disallow hard-coded HTTP scheme literals in repo sources (except docs/assets)
const HTTP = "http" + "://";
const allFiles = walk(root);
const httpHits = [];
for (const f of allFiles) {
  const rel = path.relative(root, f);
  if (rel.startsWith("node_modules/") || rel.startsWith("dist/")) continue;
  if (/(\.md|\.png|\.jpg|\.jpeg|\.svg|\.webp)$/i.test(rel)) continue;
  const t = read(f);
  if (t.includes(HTTP)) httpHits.push(rel);
}
if (httpHits.length) {
  fail(`Found HTTP scheme literal(s) in: ${httpHits.join(", ")}`);
} else {
  ok("no HTTP scheme literals in source files");
}

// 4) CI secrets hygiene quick checks (anti-pattern grep)
const workflowDir = path.join(root, ".github", "workflows");
if (fs.existsSync(workflowDir)) {
  const wf = walk(workflowDir).filter((p) => p.endsWith(".yml") || p.endsWith(".yaml"));
  for (const file of wf) {
    const t = read(file);
    const rel = path.relative(root, file);
    if (/\bprintenv\b/i.test(t)) fail(`CI workflow uses printenv (can leak secrets): ${rel}`);
    if (/\becho\s+\$\w+/i.test(t)) fail(`CI workflow echoes env var directly (can leak secrets): ${rel}`);
  }
  ok("CI workflows passed basic secret hygiene checks");
}

if (process.exitCode) process.exit(process.exitCode);
