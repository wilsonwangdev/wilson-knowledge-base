---
title: "用好你的 jj — Agent 时代的版本控制"
date: 2026-03-17T09:00:00
tags: [version-control, jj, jujutsu, ai-agent, developer-workflow, git]
---

## 一句话总结

Git 是为「人类线性思维」设计的，在 agent 时代存在根本性摩擦——agent 的「先生成一堆再整理历史」与 Git 的「边想边提交」天然冲突，jj (Jujutsu) 给出了更优雅的答案。

## 为什么 Git 不适合 Agent

1. **隐式状态是绊脚石**：staging area、branch、stash 等机制为人类设计，agent 介入后这些隐性状态白白消耗 token 和心力。

2. **沟通瓶颈**：每次和 agent 交互都要交代「先 stash」「切到那个分支」「interactive rebase 一下」，占用了大量人机沟通带宽。

## jj 的 Agent 友好设计

1. **Change 模型**：工作区本身就是 change，没有 staging area，文件改动立即归属当前 change，无需 `git add`。

2. **无缝共存**：本地用 jj 管理变更，远端通过 `jj git push/fetch` 和标准 Git 交互，对 GitHub 和同事完全透明。

3. **Agent 友好操作**：`jj split` 拆分变更、`jj undo` 一键回退、`jj edit` 无缝切换工作上下文、骨架 change 预规划实现步骤。

> "agent 的干活方式是「先哗哗地生成一堆，回头再整理历史」，而 Git 的模型偏向「边想边提交」。这两件事天然就是拧着的。"

## 来源

[用好你的 jj — onevcat](https://onevcat.com/2026/03/jj-for-agent-era/)
