---
title: "构建 Claude Code 的经验：我们如何使用 Skills"
date: 2026-03-18
tags: [claude-code, ai-agent, skills, anthropic, developer-tools]
---

## 一句话总结

Claude Code 团队 Thariq Shihipar 基于数百个活跃 Skills 的实战经验，系统梳理了 Agent Skills 的九种类型、编写最佳实践和分发策略。

## 九大 Skills 分类

Anthropic 内部将 Skills 分为九大类：库与 API 参考、产品验证、数据获取与分析、业务流程自动化、代码脚手架、代码质量审查、CI/CD 部署、运维手册、基础设施运维。

## 编写关键技巧

1. **Skills 不只是 markdown**：它们是可以包含脚本、资源、数据的**文件夹**，agent 可以探索和使用其中的所有内容。

2. **渐进式披露**：利用 description 字段描述「何时触发」（而非「功能摘要」），让 agent 在需要时才读取具体文件。

3. **踩坑点章节**：必须建立 pitfalls 章节记录常见错误，这是最有价值的 Skill 组成部分。

4. **不要过度限制 Claude**：避免指令太死限制灵活性，给 agent 留出推理空间。

5. **钩子与记忆**：支持 PreToolUse 钩子和持久化存储（日志/JSON/SQLite），数据应存到 `${CLAUDE_PLUGIN_DATA}` 目录。

> "A common misconception is that skills are 'just markdown files', but they're folders that can include scripts, assets, data — the agent can discover, explore and manipulate them."

## 来源

- [原帖 @trq212](https://x.com/trq212/status/2033949937936085378)
- [中文翻译 @dotey](https://x.com/dotey/status/2034002188994060691)
