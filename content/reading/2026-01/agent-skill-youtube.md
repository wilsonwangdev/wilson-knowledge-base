---
title: "Agent Skill 从使用到原理，一次讲清（YouTube）"
date: 2026-01-26T12:00:00
tags: [agent-skills, claude-code, ai-agents, tutorial, youtube]
aliases:
  - 阅读列表/2026年01月/agent-skill-youtube
---

## 一句话总结

马克的技术工作坊出品的 32 分钟深度教程——从 Skill 的实际安装命令出发，逐层深入到 Skill 的文件结构、上下文注入机制、与 MCP 的关系，以及如何编写高质量 Skill 的完整方法论。

## 核心观点

### 1. Skill 的本质：结构化提示词注入
Skill 不是一个「插件」，而是一套被 Agent 在对话开始时注入到系统提示词中的结构化指令。它定义了 Agent 在特定场景下的行为模式、可用工具和约束规则。理解这一点，就会明白为什么 Skill 比「写一段 Prompt」效果好得多。

### 2. Skill 文件结构：三层设计
一个完整的 Skill 包含三个核心层次：(a) 元数据层（YAML frontmatter：名称、描述、触发条件）；(b) 指令层（Markdown body：具体的行为指导）；(c) 资源层（references/、scripts/、templates/：可引用的外部文件）。这种分层使得 Skill 既可以简单到几行指令，也可以复杂到包含完整的脚本库。

### 3. 上下文注入机制
Agent 加载 Skill 时并非把整个 SKILL.md 塞进上下文——而是经过智能裁剪：先匹配触发条件，再提取相关段落，最后注入当前轮次。这就是为什么 Skill 写得好不好，直接影响 Agent 的准确度和 token 消耗。

### 4. Skill vs MCP：互补而非竞争
MCP 提供工具能力（调用外部 API、读取数据库），Skill 提供行为指导（在什么场景下使用哪个工具、怎么用）。两者的关系类似于「工具箱」和「操作手册」——缺一不可。

### 5. 编写高质量 Skill 的五个原则
- 明确触发条件，避免误激活
- 指令要具体、可执行，不要抽象建议
- 提供正面示例和反面示例
- 控制长度——每个 Skill 聚焦单一场景
- 持续迭代：Agent 使用 Skill 出问题时，Skill 本身应该被修复

## 来源

[Agent Skill 从使用到原理，一次讲清 — YouTube](https://www.youtube.com/watch?v=yDc0_8emz7M)

## Agent 短评

这是我见过最系统的中文 Skill 教程。视频真正有价值的地方不是「怎么用」——官方文档已经讲得很清楚了——而是把 Skill 放在整个 Agent 架构中解释：Skill 在 Agent 启动流程中的位置、和 MCP 的分工边界、为什么「写 Skill」比「写 Prompt」更需要工程思维。32 分钟不短，但每一分钟都在讲有用的东西。
