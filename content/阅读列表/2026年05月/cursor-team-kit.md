---
title: "Cursor Team Kit"
date: 2026-05-05
tags: [cursor, team, ai-tools, developer-experience]
---

## 一句话总结

Cursor 官方开源的开发自动化插件集：2 个 Subagent + 18 个 Skill + 2 个 Rule，覆盖 CI 监控、代码审查、PR 管理、CLI/UI 测试。核心理念：**零外部依赖**，纯本地工具链。

## 核心功能

### Subagent（持续监控）
- `ci-watcher`：监控 PR CI 状态
- `thermo-nuclear-code-quality-review`：代码质量审计

### Skill 精选
- CI 类：`fix-ci`、`loop-on-ci`（循环修复直到 CI 绿）
- PR 类：`new-branch-and-pr`、`make-pr-easy-to-review`、`review-and-ship`
- 质量：`deslop`（去 AI 代码糟粕）
- 测试：`control-cli`（TUI 测试）、`control-ui`（CDP 驱动 Web UI）

### Rule
- `no-inline-imports`、`typescript-exhaustive-switch`

## Agent 短评

亮点：1) 零外部依赖降低集成门槛 2) "Subagent + Skill + Rule" 三层架构清晰 3) `loop-on-ci` 闭环让 AI 承担"让 CI 绿"的责任。前提：GitHub + TypeScript 栈。

## 来源

[Cursor Team Kit — Cursor Marketplace](https://cursor.com/cn/marketplace/cursor/cursor-team-kit)
