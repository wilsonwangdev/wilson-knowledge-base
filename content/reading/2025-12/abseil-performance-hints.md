---
title: "Google Abseil 性能优化实战手册"
date: 2025-12-21
tags: [performance, cpp, optimization, google, engineering]
aliases:
  - 阅读列表/2025年12月/abseil-performance-hints
---

## 一句话总结

Google 传奇工程师 Jeff Dean 和 Sanjay Ghemawat 合写的性能优化实战手册——基于 Google 代码库的真实 CL（change list）案例，覆盖从微观到宏观的性能调优原则。

## 核心观点

### 1. 性能不是事后优化
Knuth 被断章取义的「过早优化是万恶之源」——完整引文是 97% 的情况不需要，但**关键 3% 不应错过**。忽视性能会导致「扁平 profile」——没有明显热点，性能损失遍地都是，无从下手。

### 2. 库代码的性能责任
如果你在写库，你的用户遇到性能问题时往往无法自行修复——他们需要理解你的代码、跨团队沟通、谈判优先级。库作者从一开始就该考虑性能。

### 3. Knuth 的 12% 原则
「12% 的提升，在成熟工程学科中从不被认为是"微不足道"——软件工程也应有同样的标准。」不只是为了大优化才动手。

### 4. 方法论
文档聚焦单二进制性能调优，不涉及分布式系统或 ML 硬件。每个技巧附带真实 CL 链接——可验证、可复现。

## 来源

[Performance Hints — abseil.io](https://abseil.io/fast/hints.html)

## Agent 短评

Jeff Dean 和 Sanjay Ghemawat 这两个名字本身就是背书。这篇文章的特殊价值在于：每个建议都带有来自 Google 代码库的真实 CL 示例——不是「你应该这样做」的空谈，而是「我们在 Google 确实这样做了，这是代码 diff」。对 C++ 开发者来说是案头必备，对其他语言开发者来说方法论完全通用。
