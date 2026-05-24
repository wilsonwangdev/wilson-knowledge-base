# CLINE.md — Wilson's Knowledge Base Harness

> Agent harness for navigating and contributing to this Quartz knowledge base project.
> Read this before making any changes.

---

## Project Identity

- **Name:** Wilson's Knowledge Base (知识花园)
- **Type:** Quartz v4.5.2 static site (digital garden)
- **Live:** [kb.wilsonhandbook.online](https://kb.wilsonhandbook.online)
- **Repo:** `github.com/wilsonwangdev/wilson-knowledge-base`
- **Language:** zh-CN (Chinese), all UI labels Chinese
- **Content:** 21 AI-curated tech notes on agent engineering, AI coding tools

---

## Build & Run

```bash
# Build
npx quartz build

# Dev server (auto-reload on file changes)
npx quartz build --serve

# Type check + format check
npm run check

# Auto-format
npm run format

# Run all tests
npm test
```

**Build output:** `public/` directory (134 files — HTML, CSS, JS, RSS, sitemap, OG images)
**Build time:** ~3s for 22 Markdown files

---

## Architecture

See `architecture.html` for the full system diagram. Quick reference:

```
Content Layer         →  Build Pipeline          →  Runtime              →  Deployment
content/YYYY/MM/*.md     Transformers (9)           Preact SPA              Vercel
+ YAML frontmatter        Filters (1)               D3.js Graph             GitHub Actions (links)
+ [[wikilinks]]           Emitters (12)             FlexSearch              lychee.toml
                                                    custom.scss
```

### Page layout (from `quartz.layout.ts`):

| Zone | Desktop (≥1200px) | Tablet (800-1200) | Mobile (<800px) |
|------|-------------------|-------------------|-----------------|
| Left | Search + Explorer + SidebarCollapse | Same | Drawer overlay (custom) |
| Center | Article | Article | Article |
| Right | Graph + TOC + Backlinks | Graph + TOC + Backlinks (row) | Stacked below |

### Key breakpoints (from `quartz/styles/variables.scss`):

- `$mobile`: ≤800px
- `$desktop`: ≥1200px
- `$sidePanelWidth`: 320px (customized from default 380px)

---

## Key Files — What to Touch for What

| Task | File(s) |
|------|---------|
| Add a new article | `content/YYYY/MM/article-name.md` |
| Change site config | `quartz.config.ts` |
| Change layout/component order | `quartz.layout.ts` |
| Style changes (ALL custom CSS) | `quartz/styles/custom.scss` |
| Add a new component | `quartz/components/YourComponent.tsx` + register in `quartz.layout.ts` |
| Add interactive behavior | `quartz/components/scripts/your-feature.inline.ts` |
| Change i18n strings | `quartz/i18n/locales/zh-CN.ts` |
| Change Quartz core behavior | Edit source in `quartz/` — but prefer custom.scss overrides |
| Fix dead links | Edit content markdown + update `lychee.toml` if needed |
| Change Vercel settings | `vercel.json` |

---

## Custom Code Inventory

### Components
- **`SidebarCollapse.tsx`** — The ONLY custom component. Adds a fixed-position collapse toggle button at the left edge. Only active ≥1200px. localStorage-persisted state. Injects inline script.

### Scripts
- **`sidebar-collapse.inline.ts`** — 73-line inline script. Creates a `position: fixed` button on `<body>`. Toggles `sb-collapsed` class on `#quartz-body`. On mobile: hidden. On desktop resize crossing 1200px: restores state.

### Styles
- **`custom.scss`** — 345 lines, heavily customized:
  - Sidebar collapse animation (desktop): `grid-template-columns: 0 1fr 320px`
  - Fixed-position drawer handle button (left edge, 18px icon, hover shadow)
  - Mobile/H5 (~230 lines): drawer panel (85vw, 380px max), backdrop-blur overlay, 44×44 hamburger touch target, 40×40 close button, finger-friendly nav spacing
  - Desktop balance: `padding-right: 1.25rem` on center column
  - Extra small (<480px): compact sizing

---

## Content Conventions

### Frontmatter
```yaml
title: "中文标题 — English Subtitle"
date: 2026-05-23          # or 2026-03-19T09:00:00 for ordering within a day
tags: [kebab-case, only-lowercase, no-spaces]
```

- Only 3 fields used: `title`, `date`, `tags`
- Date determines Explorer sort order and PrevNext sequence
- No `draft` field — use `status: placeholder` for incomplete articles (Quartz ignores it)

### Article structure
All 21 articles follow this pattern:
1. `## 一句话总结` — one-sentence takeaway
2. Structured analysis (tables, blockquotes, numbered points)
3. `## 来源` — original source URL
4. `## Agent 总结` — AI-curated synthesis

### Wikilinks
- Format: `[[filename|Display Name]]`
- Cross-reference within the knowledge base
- Resolved by Quartz's ObsidianFlavoredMarkdown transformer

---

## Common Pitfalls

### 1. Don't edit `quartz/` core files unless necessary
- Prefer `custom.scss` overrides instead of editing component `.scss` files
- The build cache (`quartz/.quartz-cache/`) may mask changes — `rm -rf quartz/.quartz-cache && npx quartz build` after editing framework code

### 2. CSS specificity and cascade
- `custom.scss` loads AFTER all component styles — use this for overrides
- But `custom.scss` uses `@use "./variables.scss"` — SASS `$mobile` and `$desktop` variables available
- Mobile: use `@media all and ($mobile)` NOT hardcoded `768px`

### 3. Inline scripts
- Go in `quartz/components/scripts/*.inline.ts`
- Compiled via esbuild, minified into `public/postscript.js` (724KB)
- Function names are minified — search for unique CSS class names to verify presence
- Use `window.addCleanup()` for event listener cleanup (SPA-aware)

### 4. Explorer/Mobile nav
- Quartz's `explorer.inline.ts` uses `checkVisibility()` API (Chrome 105+/Safari 17+)
- A polyfill was added: fallback to `getComputedStyle().display`
- `return` → `continue` bug was fixed in the nav handler loop

### 5. Dead links
- `lychee.toml` excludes `openai.com` and `zhihu.com` (block automated checkers)
- All external links in articles must be verified before deployment
- CI runs on push to main + PRs touching content/

### 6. Node.js version
- Quartz 4.5.2 requires Node 20.x
- Running on Node 24 works but shows engine warnings (cosmetic only)

---

## Deployment

```bash
# Push to main → Vercel auto-deploys
git push origin main

# Manual build check before push
npx quartz build && lychee --config lychee.toml public/
```

- **Vercel project ID:** in `.vercel/project.json`
- **Build command:** `npx quartz build`
- **Output:** `public/`
- **Clean URLs:** enabled
- **Domain:** `kb.wilsonhandbook.online`

### Local tunnel (for phone testing)
```bash
python3 -m http.server 4180 -d public &
ssh -R 80:localhost:4180 nokey@localhost.run
# → https://XXXX.lhr.life
```

---

## Testing

```bash
# Type check
npm run check

# Run test suite
npm test

# Dead link check (local)
lychee --config lychee.toml public/

# Visual regression (manual)
# 1. Build: npx quartz build
# 2. Serve: python3 -m http.server -d public
# 3. Check on phone via localhost.run tunnel
```

---

## Glossary

| Term | Meaning |
|------|---------|
| Quartz | Static site generator (this project's framework) |
| Frontmatter | YAML metadata block at top of each `.md` file |
| Explorer | Left sidebar file tree / navigation |
| SidebarCollapse | Custom desktop sidebar toggle component |
| Drawer | Mobile side-slide navigation panel |
| Backdrop | Semi-transparent overlay behind the mobile drawer |
| PrevNext | Article navigation links (previous/next by date) |
| SPA | Single Page Application (micromorph-based navigation) |
| Satori | SVG-to-PNG renderer for OG social images |
| lychee | Dead link checker (CI + local) |
