---
title: "Claude Code 在大规模代码库中的工作原理"
date: 2026-05-16
source: https://claude.com/blog/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start
tags: [claude-code, ai-coding, large-codebase, best-practices]
---

## TL;DR

Claude Code 核心差异化：**Agentic Search 而非 RAG Index**——像人类工程师一样遍历文件系统、grep 精准查找，无需维护嵌入索引。**"Harness"比模型本身更重要**：CLAUDE.md → Hooks → Skills → Plugins → MCP → LSP → Subagents。

## Harness 扩展体系

| 组件 | 作用 |
|------|------|
| CLAUDE.md | 项目约定、代码库知识（每次会话） |
| Hooks | 自动化一致性，Stop Hook 持续改进配置 |
| Skills | 按需加载的专家知识（渐进式披露） |
| Plugins | 组织内分发已验证配置 |
| LSP | 符号级精度，大规模代码库杀手级能力 |
| MCP Servers | 连接内部工具和数据源 |
| Subagents | 探索与编辑分离 |

## 三种成功模式

1. **让代码库可导航**：CLAUDE.md 精益分层、子目录初始化、排除生成文件
2. **持续维护配置**：每 3-6 月审查，模型进化后旧规则可能变成桎梏
3. **指定 DRI**：Agent Manager 角色，先小范围跑通再推广

## Agent 总结

Claude Code 在大规模代码库中的核心策略是 Agentic Search（类人工程师的文件遍历）而非 RAG 索引。Harness 体系（CLAUDE.md→Hooks→Skills→Plugins→MCP→LSP→Subagents）比模型本身更关键，持续维护配置是成功的关键。
