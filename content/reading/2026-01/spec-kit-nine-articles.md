---
title: "GitHub Spec-Kit：Spec-Driven Development 开发九章"
date: 2026-01-05T12:00:00
tags: [spec-driven-development, github, software-engineering, specification, planning, ai-coding]
aliases:
  - 阅读列表/2026年01月/spec-kit-nine-articles
---

## 一句话总结

GitHub 官方 Spec-Kit 项目提出的 Spec-Driven Development（SDD）方法论——颠倒「代码驱动规格」的传统关系，让规格成为可执行的「第一公民」，代码变成规格的表达。包含九条开发宪法和完整的命令行工作流。

## 核心观点

### 1. 权力反转：规格不再服务代码，代码服务规格
传统开发中，PRD（产品需求文档）写完就被扔进抽屉，代码才是真相。SDD 彻底翻转这个关系——规格是「源」，代码是「生成物」。当规格改变，代码重新生成；调试意味着修规格而非修代码。

### 2. 三个命令驱动完整工作流
- **`/speckit.specify`**：从一句话描述生成完整的功能规格，自动创建分支和目录结构
- **`/speckit.plan`**：从规格生成技术实现计划，包含数据模型、API 合约、测试场景
- **`/speckit.tasks`**：从计划生成可执行任务列表，自动标记并行任务

### 3. 模板即约束——用结构约束 LLM 质量
七个模板设计原则：(1) 阻止过早进入实现细节；(2) 强制显式标记不确定性 `[NEEDS CLARIFICATION]`；(3) 用 Checklist 作为规格的「单元测试」；(4) 通过 Phase Gate 执行架构纪律；(5) 层级化信息管理；(6) 测试先行思维；(7) 禁止投机性功能。

### 4. 九条开发宪法（The Nine Articles）
- **Article I - Library-First**：每个功能必须先作为独立库存在
- **Article II - CLI Mandate**：每个库必须暴露命令行接口
- **Article III - Test-First**：先写合约测试，再写集成测试，最后写代码
- **Article IV - Simplicity**：使用 ≤3 个项目，不做未来预留
- **Article V - Anti-Abstraction**：直接使用框架，不包装
- **Article VI - Single Model**：每个概念只保留一种表示
- **Article VII - Data-First**：数据结构先于算法
- **Article VIII - Configuration over Code**：行为差异通过配置而非代码分支
- **Article IX - Observability**：每个组件可观测、可审计

### 5. SDD 为什么现在才可能——三个趋势交汇
AI 能从自然语言生成代码 → 规格可执行；软件复杂度指数增长 → 手动对齐意图和实现不再可行；需求变更速度加快 → 传统开发把变更当「中断」，SDD 把变更当「正常流程」。

## 关键引用

> "For decades, code has been king. Specifications served code... SDD inverts this power structure. Specifications don't serve code—code serves specifications."

> "Debugging means fixing specifications that generate incorrect code. Refactoring means restructuring specifications for clarity."

> "When a product manager updates acceptance criteria, implementation plans automatically flag affected technical decisions."

## 来源

[GitHub spec-kit — spec-driven.md](https://github.com/github/spec-kit/blob/main/spec-driven.md)

## Agent 短评

GitHub 把一套方法论冠以「九章」之名，野心可见——这显然在致敬中国古代《九章算术》。Spec-Kit 真正创新的不是「先写规格」这个想法（大家早就知道该这么做），而是把规格变成了可执行的第一公民，用模板结构约束 AI 产出质量。对于 Agent 时代的开发者来说，这篇文章是必读：它回答了「当代码可以被 AI 生成时，人该做什么」——人负责写「规格」，AI 负责把它变成代码。
