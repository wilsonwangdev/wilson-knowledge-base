---
title: "How to Write an Effective Software Design Document"
date: 2026-09-12T14:00
tags: [design-doc, technical-writing, engineering-process, documentation, code-review, google-engineering, software-design]
aliases:
  - 阅读列表/2026年09月/write-an-effective-design-doc
---

## 一句话总结

Michael Lynch（前 Google/Microsoft 工程师）给出设计文档的完整方法论：何时该写、该投入多少、什么该写什么不该写（判据是"犯错的代价"）、以及与一份真实示例文档对照的 20+ 个组件清单。

## 核心观点

**1. "这个决定犯错的代价是什么"是判断一切内容归属的唯一准据**

文章最有力的部分是一个分层判据：不是所有设计决定都同等重要，有些选择近乎永久，有些则无关紧要。反例是语言选型——如果 20 万行 C++ 之后才发现 Ruby on Rails 更合适，你就被困住了，从零重写永远不可能成功，而混合两种语言维护是长期负债。正例是"列表页一次显示 100 条还是每页 25 条加'加载更多'按钮"——如果选错，几小时就能改回来。作者的态度很明确：**"加载更多"按钮不是设计层面的问题，不值得占用审查周期去争论**。这条判据同时解决了两个方向的错误：既防止把设计文档写成实现文档（事无巨细地指定一切等于在设计阶段就把代码写完了），也防止把不可逆决策当成细节草率处理。

**2. 是否值得写设计文档，用 6 个问题快速判断**

作者列出的是：是否有多人协作实现？是否超过三个月全职工作量？是否要在生产环境运行多年？是否涉及跨团队协作？目标与需求是否模糊？是否有可以在设计阶段预防的灾难性风险（安全漏洞、法律风险）？**任一项为"是"就值得写，两项以上几乎必然值得**。与之配套的是"该投入多少"——作者拒绝给出通用规则，类比"没有规则规定该写多少测试"，正确投入取决于团队目标、风险、截止日期和文化，**有时正确的投入量是零**。这个"允许不写"的立场让方法论免于教条化。

**3. 目标写影响、非目标写边界，是最容易做错的两节**

Goals 要与 Background 逻辑相连，描述完成后世界变成什么样，并且**必须用影响而非实现细节来表述**——"给基础设施加上 Kubernetes"是坏目标，"最小化新版本部署导致的故障"才是好目标。Non-goals 则专门处理"读者可能误以为在范围内"的事项：示例文档里显式声明"不构建通用可复用缓存系统""v1 不做地理就近缓存"。这一节的价值在于**把隐含的期望管理变成显式的书面承诺**，避免项目末期出现"我以为你们会做这个"的争议。

**4. 未决问题与已决问题的双区结构，把设计讨论变成可追溯记录**

作者要求把悬而未决的事项集中到 "Open Issues" 附录，每条必须包含三样东西：问题是什么、有哪些备选解决方向、**立即的下一步是什么**。示例（缓存该分配多少 RAM）展示了完整的量化推理：搭测试环境跑一次模拟要 3 个开发日、后续每次 0.75 天，而 RAM 比开发时间便宜得多，所以提议"不测试直接上 128GB"。当问题解决后，**不是删除而是移到 "Resolved Issues" 并保留完整讨论**——这使得后来者能看到决策的依据，而不只是结论。

**5. 图的投入产出比被严重低估，但工具选择有陷阱**

作者指出一个认知差：设计者脑中已有架构图，审查者没有，**画图是让他们最快看到的方式**。工具选择的建议非常具体：优先选可编辑的工具（Excalidraw、draw.io、Google Drawings），或用 Mermaid / D2 / Graphviz 这类代码生成图的语言（作者提到用 LLM 生成图的代码效果不错）。反面案例是"在物理白板画得很漂亮然后拍照贴进文档"——**第一版看起来很惊艳，但从此再也改不动**，因为没有原始源文件。同时要求链接到图的源文件，让队友能复现。

**6. 安全、隐私、法律这几节，即使"不相关"也要写下理由**

这是全文最反直觉的建议。作者承认很多团队看到这些章节会跳过，但坚持：**即使你认为威胁不太可能或与系统无关，记录你的推理过程本身就有价值——因为你的解释可能促使审查者发现你忽略的威胁**。他给了可操作的问题清单：系统处理什么敏感数据、保留多久、谁能访问、如何保护（静态和传输中是否加密）；威胁面在哪里（何处处理潜在恶意数据）；信任边界在哪（数据何时从低权限系统流向高权限系统，例如浏览器请求，服务端不能假设其安全）。示例文档里缓存层"不对公网开放、跑在隔离网络、只接受 Web 服务器入站"就是这条原则的产出。

**7. 一页纸和五十页都可能是对的，组件清单是取子集不是全用**

作者给出 20+ 个可选组件（标题、元数据、目标、背景、相关文档、目标、非目标、场景、图、术语表、约束、SLO、监控告警、时间线、接口、依赖、安全、隐私、法律、日志、未决问题、已决问题、备选方案），但明确说**"你通常不需要每个文档都包含每一节，选择适合的的子集"**。几个易被忽视但作者强调的点：元数据要含权威 URL 和签核记录（Google 用 `go/` 短链）；术语表优先用读者能懂的词，或行内定义，**最差的选择才是让读者跳来跳去查术语表**；SLO 必须可度量（"移动端要性能好"是含糊的，管理者的"好"可能是 <2ms，不要等到代码写完才知道）；时间线要选能产出对利益相关者有用产物的里程碑（先做假数据 UI 给客户看，比做完所有管道再发现需求理解错了要好）。

## 关键引用

> "As a rule of thumb, you can ask a simple question to decide whether a decision belongs in your design doc: what's the penalty for being wrong?"

> "A 'load more' button is not a design-level concern. If you pick one solution, and user feedback tells you you're wrong, you can fix it in a few hours. You don't need to detail your entire thought process in your design doc, and you definitely shouldn't waste review cycles arguing about it."

> "Sometimes, the right amount to invest in a design doc is zero."

> "I've seen developers create a beautiful diagram on a whiteboard and photograph it for their design doc. The first draft looks amazing, but then they're stuck with that diagram forever because they can't edit the photo without recreating the whole thing from scratch."

> "Even if you think security threats are unlikely or irrelevant in your system, it's still helpful to document your rationale. Your explanation might prompt reviewers to identify threats you overlooked."

## 来源

- [How to Write an Effective Software Design Document — Refactoring English](https://refactoringenglish.com/excerpts/write-an-effective-design-doc/)

## Agent 短评

设计文档这个题目上流行的内容大多是"模板清单"或"某大厂内部文档泄露"，这篇的区别在于它同时给了**判据**和**组件**，并且用一份贯穿始终的真实示例（RecencyBank 缓存层设计）演示每个组件到底该写多细——这比抽象的"要写清楚上下文"有用得多。作者的 Google/Microsoft 背景让内容有可信度，但他刻意做了抗教条化的处理：反复强调取子集、允许不写、"有时正确答案是零"，这使方法论不至于变成过度文档化的借口。三个局限：一是**组件清单的默认粒度偏重企业协作场景**，元数据里的权威短链、多人签核、以及安全/隐私/法律三个独立章节，对单人项目或小团队是明显过载的，需要读者自己判断裁剪；二是**全文只覆盖到"写完"，如何从审查中获得有用反馈被直接引到另一篇文章**，而恰恰"驱动文档通过审查"是多数人真正卡住的地方，所以这篇的方法论链条是不完整的；三是作为《Refactoring English》书节选，它天然带有导流目的，例子里提到的视频和配套文档都在站外，单独看这篇会缺一些上下文。适合作为"要开始写第一个设计文档"时的检查表，配合实际项目写一遍再回看，比通读三遍有用。
