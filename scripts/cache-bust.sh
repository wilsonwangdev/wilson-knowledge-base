#!/bin/bash
# Post-build cache busting: append ?v=<git-hash> to index.css references in all HTML files.
# Quartz (esbuild) outputs a fixed index.css filename without content hash, so browser
# caching across rebuilds is a real problem. This script appends a commit-based query
# string so each deploy gets a unique CSS URL — browser treats it as a new resource.
#
# Run after `npx quartz build`, before deploying the public/ directory.
# Idempotent: re-running strips the old hash and applies the new one.

set -euo pipefail

PUBLIC_DIR="${1:-public}"
HASH=$(git rev-parse --short HEAD)

echo "→ Cache-busting with git hash $HASH ..."

# Strip any existing ?v=... query string, then append the new one.
# Matches both href=".../index.css" and href=".../index.css?v=oldhash"
find "$PUBLIC_DIR" -name '*.html' -exec sed -i '' \
  -e "s|\(index\.css\)?v=[^\"]*|\1|g" \
  -e "s|href=\"\(.*\)index\.css\"|href=\"\1index.css?v=$HASH\"|g" \
  {} \;

COUNT=$(grep -rl "index.css?v=$HASH" "$PUBLIC_DIR" --include='*.html' | wc -l | tr -d ' ')
echo "✓ Updated $COUNT HTML files"
