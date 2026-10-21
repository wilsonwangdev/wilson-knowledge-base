---
title: "The Future of CSS：Interop 2027 十大候选特性，以及 LLM 时代为什么还要懂底层"
date: 2026-10-21T14:00
tags: [css, web-standards, interop, browser-support, progressive-enhancement, accessibility, frontend, llm]
aliases:
  - 阅读列表/2026年10月/future-of-css-interop-2027
---

## 一句话总结

Josh Comeau 借 Mozilla 为 Interop 2027 开的公开投票榜，逐个拆解他投的十个 CSS 特性（`@function`、`corner-shape`、`reading-flow`、滚动触发动画等），并给出一个比清单更重要的判断：**进了 Interop 专注区的特性通常一年内就能跨浏览器可用**，所以关心这些提案等于提前一年知道 CSS 会变成什么样；而结尾那段转折——LLM 的训练数据停在几年前，不会主动使用现代 CSS——把这份清单从"技术前瞻"变成了"你为什么要自己懂"的论证。

## 核心观点

**1. Interop 的有效性不是口号，有一个可验证的案例**

写作起点不是特性，而是机制。Google、Apple、Microsoft、Mozilla 加上 Igalia、Bocoup，每年选一批"专注区"协作推进。作者用 Subgrid 作证据链：**2019 年 Firefox 就实现了，之后多年其他浏览器毫无动静；2023 年被加进 Interop，到当年年底全浏览器广泛可用。** 他配了一张通过率曲线图——三条各自爬升的线最后并到接近 100%。

这个案例的分量在于它给出了**可操作的时间预期**：某个特性进了今年的 Interop，你就该按"明年能用"来规划，而不是按"等等再说"。整篇文章的框架建立在这条经验规律上，不是建立在作者的个人偏好上。

**2. 十个特性指向三个不同方向，不是一个方向的堆叠**

清单容易被误读成"又一批语法糖"，实际它们解决的是三类问题：

**表达能力**——`@function` 让 CSS 能定义函数，`result` 指定返回值。作者的示例是把极坐标转成笛卡尔坐标（`--translate-polar(45deg, 100px)`），这在纯 CSS 动画里原本要靠预算好的数值手写。配套的 `inherit()` 则是把"从父元素取值"变成显式函数调用。

**视觉精度**——`corner-shape` 在 `border-radius` 之外提供 `squircle`、`bevel`、`notch`、`scoop` 四种连接方式。`border-shape` 更进一步，把形状应用到边框本身。这两个直接对应"iOS 那种连续圆角"和"斜切角"这类过去只能上 SVG 或 canvas 的效果。

**可访问性与状态**——`reading-flow` / `reading-order` 解决一个长期无解的问题：**tab 顺序永远跟随 DOM 顺序，不跟随视觉顺序**。作者正在做一个响应式网格项目，桌面端第一个视觉元素和移动端完全不同，但两者焦点顺序一样，"对一部分用户来说必然是错的"。`reading-flow: grid-rows` 让焦点顺序跟着视觉走。滚动状态容器查询则让「元素是否在视口内」变成可查询条件。

**3. scroll-driven 与 scroll-triggered 是两件事，前者已经落地**

这一节的区分容易被跳过，但它是全文最实用的辨析：**scroll-driven animations 已进入 Interop 2026 并成功跨浏览器实现**，它做的是用滚动位置"擦洗"（scrub）动画进度，元素随滚动逐渐淡入就属于这类。而 **scroll-triggered animations 是另一个提案**，做的是在滚到某个点时"触发"关键帧动画，然后按自己的时长正常播放——作者用"接近传感器（proximity sensor）"作类比。

现在要做滚动触发只能用 `IntersectionObserver`，"挺麻烦"。所以这两项的关系不是新旧替代，而是**各自覆盖一个用例**，可以理解成"连续映射"与"离散触发"的分工。

**4. 这些特性在把 JavaScript 的活搬回 CSS，代价是可访问性和可维护性**

如果只看单个特性，容易低估这十条的共同方向：动画（滚动触发）、定位（锚点容器查询）、表单状态、焦点顺序——过去每一项都要写 JS 和事件监听。搬回声明式 CSS 的收益是状态不再靠脚本同步，缺点是**浏览器支持一旦参差，你就得自己写降级**。

作者对此的态度是渐进增强："多数特性今天就能当 progressive enhancement 用。"这句话的前提是：**你得知道它的存在，才谈得上把它当增强项。** 这直接连到结尾。

**5. 结尾的转折比清单本身更值钱**

文章末尾作者主动挑明了一个当下开发者普遍在想的疑问："如果我们把所有工作都交给 LLM，还需要跟进最新 CSS 吗？"他的答案是更需要，理由不是情怀而是机制：**LLM 的训练数据是几年前的，它不会主动使用它没见过的新特性。** 所以想拿到更好的用户体验，反需要自己去认识这些特性，再引导 agent 使用。

这段为什么重要：它把"技术前瞻"和"AI 辅助开发"这两件常被对立讨论的事，放进了同一个因果链——**自动化程度越高，输入端的知识面越决定输出上限**。

## 关键引用

> "when a focus area gets added to Interop, it often winds up reaching near-100% support across all major browsers within a year."

> "This is one of the great things about responsive CSS, but it leads to an unfortunate side effect: tab order is always based on the DOM order, not the visual order."

> "I know it's kind of a weird time right now for web developers, and many of us are wondering whether we even need to care about this kind of stuff anymore. If we're delegating all of our work to LLMs, do we still need to keep up with the latest-and-greatest CSS features? Personally, I think it's more important than ever."

> "We can't expect LLMs to use modern CSS features when so much of their training data is years old."

> "If we want to build the best possible user experiences, we'll need to guide our agents to take advantage of modern web features, which requires us to know about them!"

## 来源

- [The Future of CSS — Josh W. Comeau（2026-10-20）](https://www.joshwcomeau.com/css/interop-2027/)
- 文中引用：[Mozilla 的 Interop 2027 投票榜](https://github.com/web-platform-tests/interop/issues?q=is%3Aissue+label%3Ainterop-2027) · [scroll-driven / scroll-triggered 详解（Bramus）](https://www.bram.us/)

## Agent 短评

表层是路线图：作者逐个拆解他投票选出的十个特性，附代码与支持态，`@function`、`corner-shape`、`reading-flow` 几项现在就能渐进增强。更值钱的是判断：Interop 的有效性被 Subgrid 证明过，2019 年仅 Firefox 实现，2023 年进 Interop 后一年内全浏览器接近 100%；结尾作者说 LLM 训练数据停在几年前，不会主动用现代 CSS，所以要好体验更需自己知道。局限有三：这是投票推荐非最终名单；支持数据是 2026 年 10 月快照，引用前须重查；作者卖课，正文非软文但立场要知。
