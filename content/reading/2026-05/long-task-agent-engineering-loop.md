---
title: "长任务 Agent 的最小工程闭环"
date: 2026-05-25T09:00:00+08:00
tags: [agent, harness-engineering, long-running, context, planning, verification, agent-architecture]
aliases:
  - 阅读列表/2026年05月/long-task-agent-engineering-loop
---

## 一句话总结

Agent 质量不只来自模型生成能力，更来自行动后的反馈回路。长任务进生产需要五层架构（状态→规划→执行→验证→监督）和八种工程模式，否则模型越强，跑偏时的动静越大。

## 核心观点

烟花老师（AI 社区「一支烟花」发起人）基于两个月的 Agent 工程化实践，系统阐述了长任务 Agent 的三大失控根源和工程解决方案。

**三大失控根源：**

1. **状态丢失** — Agent 的 context window 像一张越堆越乱的工作台。不能把状态全押在 context 里，需要一个外部状态层（progress.md、任务 ledger、trace log）来保存决策记录、验证结果和阻塞点
2. **规划失真** — Agent 没有任务尺寸感。要么 one-shot 整个项目后半程崩溃，要么把局部完成当整体完成。需要两层规划：任务切分 + 运行预算（max turns、token budget、停止条件）
3. **验证失灵** — Agent 最危险的能力是把没做对的事讲得像做完了。curl-only verification（接口 200 就算通过）、stub 逃逸（TODO 包装成交付）、自我评分过高。验证层必须和执行层分离，独立 evaluator 按标准检查证据链

**五层工程架构：**

| 层 | 职责 |
|---|---|
| 状态层 | 保存可恢复的现场：目标、进度、决策、变更、验证结果 |
| 规划层 | 拆任务 + 设预算：阶段目标、输入输出、验收方式、停止条件 |
| 执行层 | 工具调用，但关键是每次操作都回到任务状态 |
| 验证层 | 把「完成」变成证据链：测试、截图、数据库 readback、独立 evaluator |
| 监督层 | 权限控制、预算上限、危险操作确认、失败升级、人工接管 |

**八种工程模式：**

1. Spec-first — 先写短 spec（目标、非目标、约束、验收、风险），让任务执行前固化一次
2. Plan gate — 先出计划过关再自动执行，人 review 任务拆法而非每行代码
3. Progress ledger — 每阶段写进度，格式简单但确保可续跑、可扫读
4. Independent evaluator — 生成者和评价者分离，evaluator 必须有 FAIL 权
5. Browser-level verification — Web 产品必须用浏览器走关键路径，截图是便宜证据
6. Stop condition — 明确停止条件：连续验证失败、范围扩大、危险操作、预算超限
7. Rollback path — git diff、dry-run、备份、草稿预览，没有回滚就不要自动执行
8. Trace everything — 记录输入、工具调用、变更、验证、确认、重试，出问题能回溯

**核心洞察：** 更强的模型会改变 harness 但不会取消它。外部状态、外部验证、权限责任、成本控制——这四类东西很难被模型能力完全吃掉。判断 Agent 工作流先跳过模型名，问五个问题：状态在哪？计划怎么拆？执行怎么记录？结果怎么验证？什么时候必须停？

## 来源

烟花老师 Twitter/X 文章，发表日期 2026-05-25。原文是 X/Twitter 原生长文章格式。

引用资料：Anthropic（Claude Code 最佳实践、Effective harnesses for long-running agents、Harness design for long-running application development、Building effective agents）、OpenAI（Agents SDK Tracing）、ReAct 论文、Reflexion 论文。

## 关联阅读

- [[agent-harness-engineering|Agent Harness Engineering]]
- [[effective-harnesses-long-running-agents|Anthropic：长任务 Agent 的有效 Harness]]
- [[claude-code-large-codebases|Claude Code 如何驾驭大型代码库]]
