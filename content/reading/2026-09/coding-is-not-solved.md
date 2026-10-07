---
title: "Coding is NOT solved"
date: 2026-09-28T09:00
tags: [ai-coding, software-engineering, llm-limitations, accountability, reliability-engineering, ai-hype, developer-productivity, agentic-ai, saas-economics, nfr]
aliases:
  - 阅读列表/2026年09月/coding-is-not-solved
---

## 一句话总结

一位可靠性工程背景的资深工程师对「coding is solved」叙事的系统性反驳：核心论据是**创建变便宜了，但维护/可靠性/安全/可扩展性（NFR）才是成本主体**，而 AI 无法承担问责——因此低容错行业的软件工程没有被解决，只是被营销叙事掩盖了。

## 核心观点

**1. 前提反驳：NFR 才是成本主体，而它远未解决**

作者认为"说 LLM 能写出像样代码的人不懂代码是怎么运作的"。他的论证是成本结构：**创建变便宜了，但任何在生产环境跑过大规模软件的人都知道，维护、可靠性、安全、可扩展性才是成本的大头**——这些统称 NFR（非功能需求）。更激进的一点：**在他看来连功能需求（FR，"代码该做什么"）都还不是已解决的问题**。他归因于邓宁-克鲁格效应：**不读输出的人，对输出更有信心**。

他给出 3 类"确实不严格需要读代码"的产品：**个人软件**（自用自动化、DIY patch）、**POC**（验证技术可行性与产品潜力）、**weaponized AI**（明知风险并主动利用）。

**2. 不可绕过的约束：问责制**

这是全文最硬的一组论证。作者区分了两件事：**AI 无法被问责，因为它无法承受后果**——"你能对 AI 做的最坏的事就是拔掉插头"，它不能坐牢、不能被罚款、不会死。因此**你也不能为你不理解的东西负责**（"You cannot be accountable for what you don't understand"）。

他列举了低容错、高问责要求的行业：医疗、金融、汽车、国防、核电、航空、制造——"任何出错会带来金钱、生命或法律后果的地方"。

配套提出 **Ownership 三支柱**：① **Knowledge**（你知道在解决什么问题、技术能力与限制在哪）② **Mandate**（你有决策授权，不必处处请示）③ **Accountability**（出事时你在 on-call）。**抽掉任何一根，ownership 就是坏的。** 结论："如果你发布了代码，无论你怎么生产的，你都要为它负责——所以你最好理解它。"

**3. 反直觉的核心论点：coding 反而是 LLM 最后攻克的领域之一**

这是文章最有攻击性的判断。逻辑链条是：

- **coding 关乎逻辑**，而 LLM 是概率的、随机的
- LLM 写代码之所以"成功"，是因为**我们建了一个反馈循环**：把语法错误、运行时错误喂回去，不断迭代直到大部分错误被解决**或被隐藏**
- 但 LLM 的根本弱点仍在：**它做不好逻辑，也扛不住体量**——"输入越大、上下文窗口用得越多，准确率越低"
- 所以他认为 LLM 在自然语言类任务（写社媒、报告、文章）上"可以糊过去"，但代码不行——**同一个算不准 "Raspberry" 里有几个 R 的引擎，会在逻辑上暴露其他缺陷**

他补了一刀关于"精度"的证据：让 agent 更新 5 个 npm 依赖（**全部是 patch 版本**），花了 **12 分钟、72 步**；而他自己手动"不到一分钟"。

**4. AI 版邓宁-克鲁格效应：懂得越少，越信任输出**

他提出一个分层的解释框架——"我们这行业从未如此分裂：一边声称在运营'软件工厂'、用 prompt 生成 app；另一边不相信 LLM 输出可用于生产，因为要算上额外时间成本：**priming（写 SKILL/AGENTS.md/工具）+ review（读 giant diff）+ 排查异常行为**"。

他给出的深层规律是：**"对任务复杂度和边界情况了解越少的人，越可能信任 AI 输出。"** 并延伸到管理层："管理者以前把任务委派给工程师，现在同样地委派给 AI"——而这成立的前提是"管理者本人技术能力足够到能有效管理 agent"。

他给了一个具体的企业实例：Shopify CEO Toby Lutke 一年前催促员工用 AI，最近却创造了一个词来描述结果——**"slop grenades"（垃圾手榴弹）**。

**5. 确定性 vs 随机性：开发时与运行时是两回事**

作者把非确定性拆成两个场景，这个拆分本身很有用：

- **开发时**（LLM 辅助开发）：AI 输出的代码要过多个 gate，每个 gate 把错误或提示反馈回去纠正——**这个反馈循环通常被藏在 harness 里面**。他强调每条环节都是"误解或指令冲突的风险点"（例如 skill 与 spec 冲突，或自然语言固有的模糊性）
- **运行时**（AI 作为系统组件）：**代码是确定性的**（同样输入产生预定输出），**AI 输出是随机的**——"即使模型通过了所有 evals（100 分）、且被 harness 严格约束，仍存在输出不可靠的风险"

他给出的对比很锋利：**人类会"一致地错"**（学会之后就知道了，会进步），**而模型会"在它曾经对的地方错、在曾经错的地方对"**——即"jagged intelligence"（参差不齐的智能）。作者自嘲：**"正如模型有 jagged intelligence，我也有 jagged trust。"**

他的收尾论证："你不会想让这样的 AI 当飞行员"（同时注明：autopilot 是闭环控制系统，是另一回事——这个 self-correction 说明他并非不懂技术细节）。

**6. 软件经济学的变化：AI 是乘数，但方向比力度重要**

这一段提供了全文最有商业价值的角度。作者的推演是：

> 假设 AI 生成的代码质量差 2 倍。如果 AI 比人快 1000 倍、便宜 100 倍，那么对很多任务来说，"用慢而贵的人来做"在经济上就不成立。

**但他立刻划出边界**：**"慢即快"（slow is fast）只对低容错的关键软件成立**（医疗、金融、军事等），不是所有 SaaS 都属于这类场景。由此他提出一个判断：

> **SaaS 公司越来越是在做"卖 SLA"（服务等级保证）的生意。**

理由链：① 确实可以用 prompt 复制一个 SaaS 产品；② 但当这个 AI 生成的产品出问题时，很多企业宁愿找厂商，而不是自己花资源排查；③ AI 自己造成的故障往往对 AI 也很难修（即使换模型）；④ 规模经济让 SaaS 公司能摊薄"更高质量 + 保证 + 跨客户规模运行"的成本。**推论**：如果需求非常独特、没有 SaaS 能合理定价提供，那就自己 prompt——但要知道 TCO 和缺少保证的代价；如果这事不是你的主业、你宁愿买 SLA，那买 SaaS 更经济。

他还指出两个互相矛盾的趋势：**一边是公司争先恐后拥抱 AI，另一边价格持续上涨**（同时裁员被部分归因于 AI）。他的判断是："到目前为止，软件厂商成功地**用人类费率收 AI 产出的钱**"，但这个窗口正在关闭——出路只有两条：接受价格崩塌（质量随之下降，因为会用更多 AI），或维持价格但聚焦质量（这里有经验的人类能创造差异）。

**Nordic Gold 的比喻**（全文最好的一个）：AI 输出像"北欧金"——**便宜、技术上先进、逼真得过分**。如果你不在乎真金，那没问题，很多场景根本不需要金。但"幼稚的 CEO 看到表面，就问'那为什么我们要付这么多钱给这些昂贵工程师'，仿佛敲代码这个动作就是全部价值"。

**7. 逐条反驳六种主流谬论**

作者列了一份谬论清单，每条都给了反驳，这是全文密度最高的部分：

- **"可以预先写完整规格"** → "如果你天真到这种程度，我认识一个开白色货车送免费冰淇淋的人"——除极琐碎的情况外，事前有意义地写全 spec 是不可能的
- **"英语是新的编程语言"** → 人类语言模糊且互相冲突，**这正是编程语言被创造出来的首要原因**；编译器/类型检查器能标记其中一部分冲突。虽然可以让另一个 LLM 来读指令并推理冲突，但**这比 linter 或编译器贵得多**
- **"我快多了 / 很久没手写代码了"** → **别把动作混淆为进展**；别用 SLOC、PR 数、功能数这类虚荣指标衡量；要衡量服务等级（服务消费者的满意度）。"等你能证明 token 成本与业务价值之间的利差，再打给我"
- **"我基本只读代码了，明年可能连读都不读"** → "你是在承认自己冗余吧？如果一个 power user 能 prompt 出他要的东西，你还能提供什么价值？**不要用 AI 替换自己，而要看看能在 AI 之上创造什么价值**"
- **"杠杆转移到了 taste"** → "这是退休厨师安慰自己的谎言。厨房里有机器人，不代表你该坐到客人的座位上去。" 他作为长期做前端/UX 的人说："taste 没那么值钱，人人都有 taste；每个人和他们的狗都有意见。如果你在面试里提 taste，你会以残酷的方式学到市场对它的定价低于你自己"
- **"AI 是均衡器，让创造更可及"** → **AI 是乘数，不是均衡器**——"它给聪明人和蠢人都插上翅膀"。他承认见过高质量 AI 产出，差别在于**人类介入程度、迭代和知识深度带来的反馈循环强度**；有些任务手动反而更快更省
- **"Agent 是新的编译器"** → 讽刺处理（配图）

**8. 三个预言：工程师岗位会分流**

他判断相当一部分工程师会逐渐变成四类角色：**① Technical product managers**（把想法变产品，做 POC 验证市场匹配，然后把产物交给拥有 knowledge/mandate/accountability 的工程师）· **② AI managers**（专门"放牧" agent 集群，做容忍风险或武器化风险的工作，如网络攻击）· **③ AI deployment engineers**（AI 系统的对齐、可靠性、可扩展性，以及架构、治理、数据管道）· **④ AI quality engineers**（驾驭 AI 产品的随机性、自动化评估）。

他保留的人类价值是三条：**Accountable（可问责，因此更不会犯恶意错误）· Reasonable（理性，会解释而非隐藏内部工作）· Consistent（一致，错了也是一致地错，会进步）**。

**9. 对云端 AI 的警告：你的知识是"附带损失"**

作者认为当前一代 LLM 仍需要更好的训练数据，**缺的那块是"尚未被文字化、或不易获取的智慧与经验"**——即"你做生产性工作时的上下文"。他的推演很直接：**"如果那是他们'赢得 AI'的唯一障碍，那我只能直说——你和你的知识只是附带损失。"**

他的个人策略：**只用云 AI 处理开源项目或公开数据**。本地 AI 的入场成本更高（硬件、配置时间、下载带宽、电费），上下文窗口更小、推理更弱、TTFT/TPS 更慢，但"它给你一样云 AI 永远无法保证的东西：**数据留在本地**"。他提到 Qwen 3.8 27B、Gemma 4 让本地能力大幅改善。

## 关键引用

> "You cannot be accountable for what you don't understand."

> "AI can explain it to you but it cannot understand it for you."

> "Code is a side effect of thinking and experimenting with different solutions. I have never met a good engineer who just starts coding right after being given a problem."

> "To shrink an engineer's job to coding is like shrinking a chef's job to cutting. It is part of the job, but it's never been the end."

> "Just like the models have 'jagged intelligence', I have 'jagged trust'."

> "AI is a multiplier: it gives wings to both stupid and smart people… AI is a force multiplier, but the force vector direction is more important!"

> "Slow is fast, meaning: if you take the time to understand what you're building and how it works, you'll be able to save yourself from expensive incidents and when they happen, you can fix them quickly."

## 来源

- [Coding is NOT solved — Alex Ewerlöf（2026-09-26）](https://blog.alexewerlof.com/p/coding-is-not-solved)

## Agent 短评

论战性文章，作者开篇自己定了位：观点多来自他 4 年构建 AI 系统的经验，他本人是早期采用者（写 harness、教这些主题、做 LLM 产品）——所以这是从业者从内部发起的反击，不是外部批评。硬的部分是三组不依赖具体产品的论证：NFR 才是成本主体；AI 无法承受后果因而无法被问责；确定性 vs 随机性（人类一致地错 vs 模型参差地对）。要打折的部分：修辞强度明显高于论证强度（"brain-dead thinking" 之类）；对立观点的最强版本没有被呈现——「coding 在个人软件 / POC 这类范围确实基本被解决」其实被他自己承认了，却没顺着推下去；对 Dario / Altman 动机的推测，他自己也用 Hanlon's razor 限定了。别当 AI 编码能力评测读（它不是中立的），文中涉及的具体事件会过时，三组框架不会。
