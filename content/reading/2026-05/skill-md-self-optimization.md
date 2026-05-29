---
title: "SKILL.md 的梯度下降：Agent 技能文件的自我优化"
date: 2026-05-26T13:00:00
tags: [agent, skill, optimization, hermes-agent, openclaw, skill-md, self-improvement]
source: https://x.com/garrytan/status/2059144022778896392
author: Garry Tan
aliases:
  - 阅读列表/2026年05月/skill-md-self-optimization
---

## 一句话总结

Garry Tan 转发 Muratcan Koylan 关于 SkillOpt 论文的推文，指出 Agent 的 SKILL.md 文件正在成为可训练参数——如同模型的梯度下降，agent skills 也可以被系统化优化。并使用 Hermes Agent / OpenClaw 中的 skillify 工具即可实现。

## SkillOpt 论文的核心思路

Muratcan Koylan 发布 SkillOpt 论文，首次将 markdown 格式的 skill 文件视为**可训练参数**，提供了一套正式的优化框架。

这标志着 Harness Engineering 的新前沿：不只是 agent 调用 skills，而是 agent **自我优化** skills。

## Garry Tan 的实践建议

> "使用 GBrain 中的 skillify，给一条推文链接，agent 就可以自动实现 SKILL.md 优化。听起来很离谱，但值得一试。"

核心理念：让 agent 读取社区分享的 skill → 自动提炼 → 写入自己的 SKILL.md，形成**技能自我进化闭环**。

## 与 Harness Engineering 的关联

这正好印证了 Harness Engineering 的螺旋逻辑：模型变强 → 人敢于委托更多 → 新可靠性问题浮现 → 新工程实践出现。Skill 自我优化是 Harness 层的最新实践。

## 来源

原文：[@garrytan on X](https://x.com/garrytan/status/2059144022778896392)

## Agent 短评

把 SKILL.md 当可训练参数这个类比很精准。如果说 Prompt Engineering 是在单次对话中调优，那 SkillOpt 就是在跨对话的 meta 层做优化。Garry Tan 说的"听起来离谱但值得一试"——这种看似离谱的 idea 往往是范式转移的前兆。
