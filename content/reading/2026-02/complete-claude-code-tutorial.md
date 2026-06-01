---
title: "Claude Code 完全教程（X 线程 by @eyad_khrais）"
date: 2026-02-14
tags: [claude-code, ai-coding, tutorial, agentic-development, prompting]
aliases:
  - 阅读列表/2026年02月/complete-claude-code-tutorial
---

## 一句话总结

AWS/Disney/Capital One 七年经验、现 CTO 的 @eyad_khrais 整理的 Claude Code 实战完全指南——1,043 万次查看、6.8 万书签，是目前社区最全面的 Claude Code 实践参考。

## 核心要点

### 1. Think First — 先想再打字
`Shift+Tab` 两次进入 Plan Mode。10/10 次使用 plan mode 的输出显著优于直接开始。花 5 分钟规划，省下数小时调试。

### 2. CLAUDE.md — 你的杠杆点
- **短**：Claude 只能可靠遵循 ~150-200 条指令，系统提示已占 ~50 条
- **具体**：写 Claude 不懂的怪东西，别解释什么是 components 文件夹
- **说为什么**：「因为隐式 any 导致过线上 bug」比「使用严格模式」更能让 Claude 做正确判断
- **持续更新**：按 `#` 自动将指令加入 CLAUDE.md。纠正 Claude 两次以上的事就应该在里面

### 3. 上下文窗口陷阱
- 质量在 ~20-40% 就开始下降，不是 100%
- 一个 conversation 一个功能，不要混合
- 用外部记忆（SCRATCHPAD.md / plan.md）跨 session 持久化
- 「复制-粘贴重置」：/compact 摘要 → /clear → 只粘贴关键内容

### 4. Prompt 决定一切
- 具体 > 模糊，约束 > 开放，示例 > 描述
- 告诉 Claude **不要做什么**（Claude 4.5 喜欢过度工程化）
- 给 why context：「这个每请求都跑所以必须快」→ 改变 Claude 的权衡判断

### 5. 模型选择策略
- **Sonnet**：快且便宜，路径清晰的执行任务
- **Opus**：慢且贵，复杂推理和架构决策
- 工作流：Opus 规划 → Sonnet 实现。CLAUDE.md 保证两模型一致性

### 6. MCP / Hooks / Slash Commands
- MCP 连接外部服务，大概率已有现成的。
- Hooks 在 Claude 每次修改后自动跑 lint/type-check
- 自定义 `/commands` 把重复 prompt 打包。Pro Max ($200/月) 用户应全试一遍

### 7. Claude 卡住时
不循环——换方法：`/clear` 清上下文 → 拆小任务 → 写示例代替描述 → 换角度（"用状态机实现" vs "处理这些转换"）。纠正三次还不懂，就该换个方法。

### 8. Build Systems — 非交互态
`-p` 标志实现 headless 模式。可脚本化 → pipe → 自动化 PR review、工单回复、日志更新。飞轮效应：犯错 → 审核日志 → 改进 CLAUDE.md → 下次更好。

## 来源

[The complete claude code tutorial — X/@eyad_khrais](https://x.com/eyad_khrais/status/2010076957938188661)
