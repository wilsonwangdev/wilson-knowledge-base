---
title: "Spec Driven Development 的反思：银弹尚未出现"
date: 2026-03-17
tags: [spec-driven-development, speckit, vibe-coding, ai-coding-agents, software-engineering]
---

## 一句话总结

Spec Driven Development 被高估了——文档与代码之间存在巨大的表达能力 gap，Coding Agent 是放大器而非银弹，真正的软件工程困境短期内无法解决。

## 核心批评

1. **SDD 是瀑布流的回归**：SpecKit 一开始比零基础 prompt 更稳妥，但很快陷入「提前设计、脑内逻辑推演」的循环——Spec 覆盖到的地方执行尚可，未覆盖到的地方代码质量极差。

2. **文档 vs 代码的表达力 gap**：无法在简化后的载体（Spec）上表达完整的产品信息；需求持续变化而文档往往跟不上，最早的设计通常偏离真实情况很远。

3. **隐含知识无法编码**：代码中包含大量反直觉的隐含知识和工程经验（维护成本远高于开发成本、软件永远无法 bug free），产品人和营销人一直不关注这些，Coding Agent 将这个问题百倍放大。

4. **小团队快速迭代是当前最优解**：Coding Agent 是放大器而非解决方案。真正的突破要等到 AGI，届时将不再是丢不丢工作的问题而是整个人类的存在主义危机。

> "什么时候 Coding Agent 能一把过，直接生成优雅到我能直接 approve 的代码？—— 肯定在你失去工作之后。"

## 来源

[我对 Spec Driven Development 的看法 — STRRL](https://strrl.dev/post/2026/my-thought-about-spec/)
