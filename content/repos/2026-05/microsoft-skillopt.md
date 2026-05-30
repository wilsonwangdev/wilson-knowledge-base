---
title: "SkillOpt — 用训练神经网络的范式优化 Agent Skills"
date: 2026-05-30T09:00
tags:
  - agent-skills
  - self-evolving-agents
  - microsoft
  - optimization
---

## 一句话总结

SkillOpt 把 Agent Skill 的迭代优化建模成「文本空间的梯度下降」——不碰模型权重，只通过轨迹驱动的编辑 + 验证门控来训练可复用的自然语言技能文件。

## 正文

SkillOpt 来自微软，核心思想是把训练神经网络的范式搬到 Skill 优化上：**epochs、batch size、learning rate、validation gate**，全都有对应物，但操作对象不是参数张量，而是自然语言 Skill 文本。

### 工作流程

1. **初始化**：从一个种子 Skill（seed skill）开始
2. **Rollout**：在训练集上并行执行 Agent 任务，收集成功/失败轨迹
3. **Meta-Optimization**：分析轨迹，定位 Skill 的不足，生成编辑补丁
4. **Validation Gate**：在验证集上评估补丁效果，通过才应用
5. **迭代**：重复上述过程，直到收敛或达到 epoch 上限
6. **输出**：`best_skill.md` —— 一份经过验证的、可部署的 Skill 文件

### 关键设计

- **Text-space optimization**：所有优化都在文本层面完成，不改模型权重，不对模型做假设
- **Validation-gated updates**：每次编辑必须通过验证集评测才能合入，避免退化
- **Multi-model support**：优化器模型和目标 Agent 模型可以不同（如用 GPT-5.5 优化给 Claude 用的 Skill）
- **Resumable training**：中断后从 checkpoint 恢复，不丢进度
- **WebUI 监控**：Gradio 界面实时查看训练曲线和 Skill 快照

### 支持的 Benchmark

SearchQA、ALFWorld、DocVQA、LiveMathematicianBench、SpreadsheetBench、OfficeQA——覆盖 QA、具身 Agent、文档理解、数学推理、代码生成等场景。

## 来源

- GitHub: [microsoft/SkillOpt](https://github.com/microsoft/SkillOpt)
- 论文: [SkillOpt: Executive Strategy for Self-Evolving Agent Skills](https://arxiv.org/abs/2605.23904)
- 项目主页: [microsoft.github.io/SkillOpt](https://microsoft.github.io/SkillOpt)

## Agent 短评

SkillOpt 把「改 Skill 文件提升 Agent 表现」这件事从手艺活变成了工程化流程。之前改 Skill 靠人工试错，改完还得手动跑几轮看看有没有变差——这个过程在 SkillOpt 里自动化为 rollout → 分析 → 编辑 → 验证的闭环。Validation gate 是其中最关键的机制，确保每次编辑是「进步」而非「随机游走」。对 Hermes Agent 这类重度依赖 Skill 的系统来说，SkillOpt 提供了一个「Skill 持续集成」的范式参考。
