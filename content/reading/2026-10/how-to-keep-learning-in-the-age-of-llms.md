---
title: "How to keep learning in the age of LLMs：LLM 时代如何不把「学习」外包出去"
date: 2026-10-05T12:00
tags: [learning, llm, deliberate-practice, socratic-method, spaced-practice, developer-productivity, ai-assisted-learning, metacognition]
aliases:
  - 阅读列表/2026年10月/how-to-keep-learning-in-the-age-of-llms
---

## 一句话总结

一位开发者对「LLM 杀死了学习动机」的诊断与解法：**LLM 能 one-shot 解决问题，也就消灭了「犯错—纠正」这个真正的学习机制**；他的应对是把 LLM 从"答案机"降级为"导师"（只解释概念、只问问题、不给代码），用**预先写好的分阶段计划**（goal / steps / **done when** / **trap**）把"决定下一步"的意志力消耗降为零，用**可视化反馈**维持动力，最后用 **spaced practice**（短会话、跨天重复）让知识真正沉淀——结论是：LLM 让研究变便宜了，但人也变懒了，所以要**主动把"挣扎"重新加回流程**。

## 核心观点

**1. 问题诊断：LLM 消灭的不是工作，是「犯错的乐趣」**

作者开篇就把矛头指向一个反直觉的损失：过去我们学框架、语言、模式的方式是**先做错，再从错误里取一堂课**——但"现在一切都太快了，我们不愿意花时间做错的事，尽管从长期看那样更有益"。他给出的机制判断是全篇的地基：

> **"That struggle is how your brain actually learns new things."**

值得注意的是他自己的定位——**他不是旁观者的批评，而是承认自己是患者**："坦白说，我自己也犯这个毛病。我过去大量苦练，但现在觉得没意义，因为 LLM 能直接给你任何想要的东西。"他是**卡在瓶颈上**（职业需要 + 兴趣需要）才被迫重新找方法，这使全文读起来是"自救记录"而非"说教"。

**2. 解法一：把 LLM 当导师，而不是答案机（全篇最有价值的一条）**

这是文章的转折点，来自一个具体动作：他读 Bitcask 论文后**决定自己实现、不借助 LLM**，中途卡住——但他没有让 LLM 替他写那一段，而是**让它把概念讲清楚，好让他自己写**。随即他意识到更一般的用法：

> "I could just use the LLM to teach me stuff without it giving me all the answers."

他随后发现了一个叫 **`socratic-code-mentor`** 的 skill，其设计正是不给答案、只问对的问题。文中给了一个简化例子——用户写了个求和循环得到 `NaN`：

```
const nums = [1, 2, 3];
let sum = 0;
for (let i = 0; i <= nums.length; i++) sum += nums[i];   // i 多跑了一步
```

**LLM 没有说"你的循环多跑了一步"**，而是问：`nums` 有几项？最后一项的索引是多少？你的循环里 `i` 会取哪些值？——他没有忘记这个 bug，因为**是被迫自己想通的**。作者补了一条理论支撑，引 *Make It Stick*：

> "When you're asked to struggle with solving a problem before being shown how to solve it, the subsequent solution is better learned and more durably remembered."

**还有一个社会性证据**：他的 CTO 对他也用同一套——当他问"我们为什么不按 X 做？"，CTO 反问"**你为什么觉得应该按 X 做？**"，一步步追问，直到他自己落到答案上。

**3. 解法二：把不感兴趣的苦工外包出去，目的是保住动机**

作者在此处划了一条容易被误解的界线。他举例：你想通过做一个 chat app 学东西，需要 server 和 client——**如果你只想练 server，为什么要为不感兴趣的 client 耗掉动机？** 于是让 LLM 去做测试、工具、可视化。

他**主动澄清这不是说那些工作没用**："我不是说它们没价值。我只是说，如果它们提不起你的兴趣，就别自己硬扛。"**这条的实质是把"学习"从"完成项目"里解耦出来**——项目是载体，不是目标；让载体的摩擦降到最低，动机才不会提前耗尽。

**4. 解法三：预生成计划对抗拖延——`PLAN.md` 的四段结构**

他先描述失败模式：**非平凡项目不可能一夜完成**，所以如果你不事先规划，下一节你就会"对着空屏发呆 30 分钟"（他承认自己就是这样）。"我们会在没动力、没纪律的时候拖延。"

解法的关键设计是让**恢复上下文这件事不需要意志力**：目标是"你坐下来，对 LLM 说'Let's continue'，它就把你从上次停下的地方接上"。他给每个 phase 定了**统一的四段结构**：

1. **goal**——这一阶段要达成什么
2. **small steps**——拆到足够小
3. **"done when"**——**一个你真的能检查的完成条件**
4. **trap**——**那个会咬你的坑**（提前标出预示的失败）

**底部 checklist 就是"let's continue"的接口**——LLM 读它就知道你在哪。这条设计的收益被他说得很直白：**"这样你不必花任何意志力决定要做什么"**，而且"即使你很累，也能做一点点，然后算一次 quick win"。

**5. 解法四：可视化反馈 + spaced practice（让动力和记忆都留得住）**

**可视化**：他承认自己"有视觉反馈时享受得多"（半个 UI、一个 REPL 都行），因为它"逼我留在局里、对下一步保持好奇"。他给出 `tinylsm` 的实测 REPL 输出——看到自己写的 compaction 代码把读放大 100 倍（88 tables 174.9µs → 1 table 1.7µs），"老实说，这确实喂饱了我的动力"。

**spaced practice**：他的工作方式天然产生它——**短会话、跨天跨周回到同一个项目**。他用铃木俊隆的意象收尾这一层："走过雾中，你不会注意到自己变湿，但你一点点湿透。"并补了心理学机制：**"会话之间的一点点遗忘，会迫使你的大脑把东西重新拉回来，而这份努力才是它记住的原因。"**（这是"提取练习"的通俗表述，也是全篇最接近认知科学的一段。）

**6. 收尾建议：把目标定得超出你的 grasp**

最后一条建议与直觉相反——**做有野心的项目**。理由是 LLM 改变了研究成本："以前实现一个 LSM-tree 意味着翻一堆 GitHub 仓库、读特定书里的特定章节；现在你只要说'我想搞懂 XYZ 怎么运作'。"**收益**：研究门槛下降；**代价**：他承认"我们变懒了"。他的对冲是两条：

- **一致性 > 强度**："即使你每天只做 30 分钟，也比猛干两天、然后 10 天不见人要好。"
- **不要满足于简单的东西**：可以对 LLM 说 100 次"我不懂"，它会再解释一遍。

## 关键引用

> "That struggle is how your brain actually learns new things."

> "I could just use the LLM to teach me stuff without it giving me all the answers."

> "When you're asked to struggle with solving a problem before being shown how to solve it, the subsequent solution is better learned and more durably remembered." —— *Make It Stick*

> "It's like Zen master Shunryu Suzuki's image of walking through fog: you don't notice you're getting wet, but you get wet little by little."

> "When you do something, you should burn yourself completely, like a good bonfire, leaving no trace of yourself." —— 铃木俊隆（全文收尾引用）

## 来源

- [How to keep learning in the age of LLMs — Oğuzhan Olguncu（2026-10-04）](https://www.ogzhanolguncu.com/blog/how-to-keep-learning-in-the-age-of-llms/)
- 文中资源：[`socratic-code-mentor`（gist）](https://gist.github.com/ogzhanolguncu/274e9974dc02942109ad70200f6d7b25) · [`tinylsm`（GitHub）](https://github.com/ogzhanolguncu/tinylsm)

## Agent 短评

**体裁**：**个人经验分享（n=1），不是论证性文章**——没有数据、没有实验、也没有反例处理，全部证据来自作者自己的项目经历和一位 CTO 的轶事。**读它不该带着「找结论」的期待，而该带着「找可复用的操作细节」的期待**。用这个尺度衡量，它的价值密度是合理的；**若按论证密度要求它，则完全不达标**——它没有论证，只有经验。

**价值（三条可迁移的操作级设计）**：

· **计划里固定一栏 `trap`**——最有价值的一条。**「提前写出那个会咬你的坑」本质上是把已知的失败模式前置到计划里**，而不是等它发生；坑通常在开工时就已经知道，只是从没被写下来。

· **`done when` 必须写成「你真的能检查」的条件**——它与「不要采信执行者的自报」是同一根神经的两端：一端是**事后的验证**（不把自报当完成），另一端是**事前的设计**（先定义可检查的完成条件）。后者是前者的前提——没写下 `done when`，事后也就无从验证。

· **`socratic-code-mentor` 的约束方向：不给答案、只问问题**——它与「不采信自报」形式相似、目的相反：后者防的是**虚假完成**，前者防的是**现成答案**。同一个反-讨好机制，用在验证与学习两个场景。

**局限（三点）**：

· **观点新颖度低**。socratic method、spaced practice、可视化反馈都不是新概念——spaced practice 有成熟的认知科学文献（间隔重复、提取练习），作者引的《Make It Stick》正是那类科普读物。本文的贡献是**把已知原理落成一套可抄的具体工作流**，不是提出新原理。

· **「把不感兴趣的活外包出去」缺判断标准**。外包得越多，越可能失去对应能力；他举的例子（测试 / 工具 / 可视化）还算安全，但边界在哪没有讨论。结尾他承认「我们变懒了」，却停在道德提醒，**没给出「什么可以外包、什么必须自己做」的判据**。

· **隐含假设「学习 = 编程」**（作者自己说「我主要谈编程」）。**能否迁移到非编程领域，文中没有证据**——对依赖大量记忆与事实性知识的领域（语言、法律、医学），「苏格拉底式追问」未必是最优路径。

**怎么读**：不要当「学习方法论综述」（覆盖不全），也不要当「LLM 使用技巧」（那些是手段不是主旨）——它是一份**「如何不把自己外包出去」的操作清单**，三条做法都不依赖你是否认同作者的哲学，抄了就能用。

**时效性提示**：文章发布于 2026-10-04，**涉及的具体工具会过时**（`socratic-code-mentor` 的 gist、Bitcask / LSM-tree 的实现细节、`tinylsm` 的项目状态），**但四个方法的结构不会过时**——它们本质上是「如何在自己和现成答案之间保留一段距离」的通用技巧。
