---
title: "How to Build a Self-Improving Code Review Agent"
date: 2026-07-06T20:00
tags: [agent, code-review, loop-engineering, self-improving, cloud-software-factory, skills]
aliases:
  - 阅读列表/2026年07月/how-to-build-self-improving-code-review-agent
---

## 一句话总结

Zach Lloyd（Warp CEO）展示如何构建一个能自动进化的代码审查 Agent——核心创新是引入"外环 Agent"观察审查质量并持续改进 Skill，而非靠人手动打磨 prompt。

## 核心观点

**1. 代码审查 Agent 不是静态 prompt，而是一个有脚本支撑的 Skill**

审查 Skill 接收 PR 描述、diff 和 spec 文档三个输入，输出结构化的 `review.json`。但关键不在 prompt 本身——Skill 附带 Python 脚本做预处理和后处理，避免让 Agent 每次都现场写脚本，既省 token 又消除非确定性。Cloud Agent 在执行审查时可以读文件、搜代码库、构建验证，不是只看 diff 就下结论。

**2. "外环 Agent"是自我进化的核心机制**

这是文章最有价值的架构决策：不在一开始就塞入团队的全部代码规范，而是创建第二个 Agent 持续观察审查 Agent 的输出，学习团队的实际偏好和约定，然后把改进反馈回 Skill 本身。审查 Agent 越用越准，不需要人介入。

**3. 工厂模式下的 Agent 之间共享上下文**

所有工厂 Agent（triage、spec、implementation、review）遵循相同的模式，可以共享上下文——审查 Agent 知道 spec Agent 怎么写 spec，可以请验证 Agent 验证自己的审查建议。这种 Agent 间协作比单独部署一个代码审查平台更有系统价值。

**4. 结构化为确定性边界**

review.json 的 schema 约束、脚本而非现场生成、GitHub Action 做 plumbing——每层都在缩小 Agent 的自由度来换取可预测性。Lloyd 的核心哲学是"让 Agent 在受限的框架内发挥"，而非"给 Agent 一个开放任务然后祈祷"。

## 关键引用

> "What's missing in the skill is any specific context around the coding conventions of a particular team or repo. Rather than adding these up front, we will create a second agent that learns those conventions as the review agent runs over time."

> "Having a fully fledged agent do code review lets it test hypotheses before it suggests any changes, make sure suggested changes build, and so on. It's key to the workflow."

## 来源

- [Warp Blog: How to build a cloud software factory - self-improving code review](https://www.warp.dev/blog/how-to-build-a-cloud-software-factory-self-improving-code-review)

## Agent 短评

这篇文章在"怎么做代码审查 Agent"的表面之下藏了一个更深的主张：Agent 的 prompt 不应该由人维护，而应该由一个观察 Agent 行为的元 Agent 来持续优化。这是 loop engineering 在代码审查场景中的具体落地——外环监控内环，反馈形成闭环。对照 Addy Osmani 的五块模型，Lloyd 把"Self-verification"和"State persistence"两项从概念层拉到了工程实现层。但其前提是团队接受 Agent 高度介入 SDLC 全流程——这对很多组织来说比技术本身更难跨越。
