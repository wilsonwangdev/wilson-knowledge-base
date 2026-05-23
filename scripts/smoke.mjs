#!/usr/bin/env node
// Smoke test: verify built site pages return 200 + contain expected content.
// Requires `npm run serve` (or python3 -m http.server on public/) running.
import { request } from "node:http";

const PORT = process.env.PORT ?? "4180";
const HOST = "127.0.0.1";

const checks = [
  { path: "/", expect: ["知识花园", "最近更新"] },
  { path: "/2026/05/agentic-infrastructure", expect: ["Agentic Infrastructure", "Vercel"] },
  { path: "/2026/05/comprehension-debt", expect: ["Comprehension Debt", "AI 生成"] },
  { path: "/2026/05/jj-agent-version-control", expect: ["Agent 时代", "版本控制"] },
  { path: "/2026/05/pi-design-art", expect: ["pi 的设计艺术", "Coding Agent"] },
];

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

const results = await Promise.all(
  checks.map(async (check) => {
    try {
      const res = await fetch(check.path);
      const missing = check.expect.filter((s) => !res.body.includes(s));
      const ok = res.status === 200 && missing.length === 0;
      return { path: check.path, status: res.status, ok, missing };
    } catch (err) {
      return { path: check.path, status: 0, ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }),
);

let failed = 0;
for (const r of results) {
  if (r.ok) console.log(`  ok  ${r.path}  [${r.status}]`);
  else {
    failed++;
    console.log(`FAIL  ${r.path}  [${r.status}]  ${r.error ? `error: ${r.error}` : `missing: ${(r.missing ?? []).join(", ")}`}`);
  }
}
if (failed > 0) { console.log(`\n${failed}/${results.length} smoke checks failed`); process.exit(1); }
console.log(`\nall ${results.length} smoke checks passed`);
