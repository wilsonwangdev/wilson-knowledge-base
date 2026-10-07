#!/usr/bin/env node
// Smoke test: verify every content page is served with HTTP 200.
// Requires `npm run serve` (or python3 -m http.server on public/) running.
// Usage: node scripts/smoke.mjs         # verify all discovered pages
//        node scripts/smoke.mjs --list  # print discovered paths, no HTTP requests
import { readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { request } from "node:http";

const PORT = process.env.PORT ?? "4180";
const HOST = process.env.HOST ?? "127.0.0.1";
const CONTENT_DIR = "content";

// Map markdown files under content/ to their built URL paths:
//   content/index.md            -> "/"
//   content/<dir>/index.md      -> "/<dir>/"
//   content/<dir>/<name>.md     -> "/<dir>/<name>"
// Nested folders are handled by the same rule (e.g. reading/2026-10).
function discoverPages(dir = CONTENT_DIR) {
  const pages = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      pages.push(...discoverPages(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const slug = relative(CONTENT_DIR, full).split(sep).join("/").slice(0, -3);
      if (slug === "index") pages.push("/");
      else if (slug.endsWith("/index")) pages.push(`/${slug.slice(0, -"index".length)}`);
      else pages.push(`/${slug}`);
    }
  }
  return pages;
}

const checks = [...new Set(discoverPages())].sort();

if (process.argv.includes("--list")) {
  for (const path of checks) console.log(path);
  process.exit(0);
}

function fetch(path) {
  return new Promise((resolve, reject) => {
    const req = request({ host: HOST, port: PORT, path, method: "GET" }, (res) => {
      let body = "";
      res.setEncoding("utf-8");
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode ?? 0, body }));
    });
    req.on("error", reject);
    req.setTimeout(5000, () => { req.destroy(new Error("timeout")); });
    req.end();
  });
}

// Single-threaded dev servers (serve.py / python3 -m http.server) drop
// connections (ECONNRESET) when hit with many simultaneous requests, so the
// checks run sequentially. All 125 pages take ~120ms this way — concurrency is
// not worth the fragility. Do not parallelise without retesting against serve.py.
async function check(path) {
  try {
    const res = await fetch(path);
    return { path, status: res.status, ok: res.status === 200 };
  } catch (err) {
    return { path, status: 0, ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

const results = [];
for (const path of checks) {
  results.push(await check(path));
}

let failed = 0;
for (const r of results) {
  if (r.ok) console.log(`  ok  ${r.path}  [${r.status}]`);
  else {
    failed++;
    console.log(`FAIL  ${r.path}  [${r.status}]${r.error ? `  error: ${r.error}` : ""}`);
  }
}
if (failed > 0) { console.log(`\n${failed}/${results.length} smoke checks failed`); process.exit(1); }
console.log(`\nall ${results.length} smoke checks passed`);
