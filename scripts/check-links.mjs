#!/usr/bin/env node
// Dead link check using lychee.
// Install: brew install lychee
// Usage:   node scripts/check-links.mjs    # all links
//          node scripts/check-links.mjs --offline  # internal only
import { spawnSync } from "node:child_process";

const which = spawnSync("which", ["lychee"], { encoding: "utf-8" });
if (which.status !== 0) {
  console.error("✗ lychee not found. Install: brew install lychee");
  process.exit(127);
}

// Keep these flags in sync with .github/workflows/links.yml so local runs match CI.
// --root-dir content is required to resolve root-relative links like /reading/.
const args = [
  "--config", "lychee.toml",
  "--no-progress",
  "--root-dir", "content",
  ...process.argv.slice(2),
  "./content/**/*.md",
];
const result = spawnSync("lychee", args, { stdio: "inherit" });
process.exit(result.status ?? 1);
