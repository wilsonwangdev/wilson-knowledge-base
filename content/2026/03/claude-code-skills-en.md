---
title: "Lessons from Building Claude Code: How We Use Skills"
date: 2026-03-19
source: https://x.com/trq212/status/2033949937936085378
tags: [claude-code, ai-agent, skills, anthropic, developer-tools]
---

## TL;DR

Thariq Shihipar from the Claude Code team shares hard-won lessons from managing hundreds of active Skills in production, systematizing nine Skill types, writing best practices, and distribution strategies.

## Nine Skill Categories

Anthropic classifies Skills into nine types internally: Library & API References, Product Validation, Data Fetching & Analysis, Business Process Automation, Code Scaffolding, Code Quality Review, CI/CD Deployment, Runbooks, and Infrastructure Operations.

## Key Writing Techniques

1. **Skills are not just markdown** — they are **folders** that can contain scripts, resources, and data. The agent can discover, explore, and use everything inside.

2. **Progressive disclosure** — use the `description` field to describe *when to trigger* (not what it does), so the agent only reads the full content when needed.

3. **Pitfalls section is mandatory** — document common mistakes; this is the most valuable part of any Skill.

4. **Don't over-constrain Claude** — avoid overly prescriptive instructions that limit flexibility. Leave room for the agent to reason.

5. **Hooks & memory** — support PreToolUse hooks and persistent storage (logs/JSON/SQLite). Data should be stored in `${CLAUDE_PLUGIN_DATA}`.

> "A common misconception is that skills are 'just markdown files', but they're folders that can include scripts, assets, data — the agent can discover, explore and manipulate them."

## Source

- [Original thread by @trq212](https://x.com/trq212/status/2033949937936085378)
- [Chinese translation by @dotey](https://x.com/dotey/status/2034002188994060691)
