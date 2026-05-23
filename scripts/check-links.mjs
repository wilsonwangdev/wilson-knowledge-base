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

const args = ["--config", "lychee.toml", ...process.argv.slice(2), "./content/**/*.md"];
const result = spawnSync("lychee", args, { stdio: "inherit" });
process.exit(result.status ?? 1);
