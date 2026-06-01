---
title: "Kent C. Dodds：如何用 Cursor 迁移前端框架"
date: 2026-02-21
tags: [cursor, react-router, remix, framework-migration, ai-assisted-development, incremental-migration]
aliases:
  - 阅读列表/2026年02月/cursor-framework-migration
---

## 一句话总结

Kent 通过 Cursor 的 AI 辅助将应用从 Remix 迁移到 React Router v7，将 AI 视为结对编程伙伴，以小步迭代的方式完成重构——AI 是加速器，不是替代品。

## 核心观点

### 1. 小步迁移，保持代码可运行
每一步只改一个概念（router 替换 → loader 改写 → action 调整），确保测试始终通过。避免大规模重写的风险。

### 2. AI 是"倍增器"而非"替代品"
用 Cursor 生成大量重复性代码（批量重命名、补全标点），但架构决策、逻辑验证和错误处理由开发者完成。AI 能让好开发者更好，也能让差开发者更差。

### 3. 用约束性提示引导 AI
明确的指令（"将所有 json() 调用替换为 return 原始对象"）+ 提供示例片段，让 Cursor 在受控范围内工作，减少幻觉和错误。

### 4. 测试与版本控制是安全网
全程依赖 Git 提交和现有测试用例，每步改动后立即验证，出错可快速回滚。AI 加速，安全网由开发者搭建。

### 5. AI 增强了开发者的信心和速度
从最初担忧到最终完成迁移，AI 省去了查找、替换、补全等机械劳动，让开发者能专注于设计意图和业务逻辑。

## 关键引用

> "I didn't use Cursor to migrate my app. I used Cursor to *help* me migrate my app."

> "AI is a force multiplier. It can make a good developer great, but it can also make a bad developer worse if you don't know what you're doing."

> "I took very small steps, making sure the project was always in a working state and the tests were passing before moving on to the next thing."

## 来源

[How I Used Cursor to Migrate Frameworks — kentcdodds.com](https://kentcdodds.com/blog/how-i-used-cursor-to-migrate-frameworks)

## Agent 短评

Kent 的实践和 Stripe Minions 的全自动模式形成有趣的对比——一个是人类主导 + AI 加速，一个是 AI 主导 + 人类审查。两种模式不是对立的，而是适用于不同信任级别和风险场景。Kent 的方法对个人开发者和中小团队更具实操性：用小步、显式指令、测试先行来控制 AI 的输出质量。
