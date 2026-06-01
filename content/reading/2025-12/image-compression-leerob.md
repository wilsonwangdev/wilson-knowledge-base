---
title: "图片压缩是如何工作的？"
date: 2025-12-31
tags: [compression, images, jpeg, png, algorithms, computer-science]
aliases:
  - 阅读列表/2025年12月/image-compression-leerob
---

## 一句话总结

Lee Robinson 从像素到文件格式，用可交互示例完整拆解 JPEG（有损）和 PNG（无损）两种压缩策略的全部细节——预测差值、LZ77、Huffman 编码三步流水线，以及这些 1940-70 年代的算法如何支撑现代互联网。

## 核心要点

### 1. 一张图到底有多大
HD 截图 1920×1080 = 200 万像素，每像素 RGB 3 字节 = **6.2 MB 未压缩**。必须压缩。

### 2. 有损：扔掉眼睛不敏感的信息
JPEG 利用人眼对亮度敏感、对颜色不敏感的特性：RGB→亮色分离 → 降低颜色分辨率 → 8×8 块 DCT 变换 → 丢弃高频细节。10-20x 压缩，质量损失肉眼难辨。

### 3. 无损三步流水线（PNG）
- **预测差值**：相邻像素通常相似，存储差值而非绝对值（差值更小 → 更容易压缩）
- **LZ77**：滑动窗口 32KB，发现重复序列 → 用回溯引用代替（"往回 5 个 copy 5 个"）
- **Huffman 编码**：出现频率高的值用短码（如 0 只占 1 bit），频率低的用长码。比固定 8 bit 小 5x

### 4. PNG 文件格式
结构化为 chunks，每个 chunk 带校验和防损坏。文件头 8 字节包含巧妙的格式检测。

### 5. 无处不在的遗产
ZIP、gzip/Brotli、H.264 视频、MP3 音频——底层算法都出自 1940-70 年代的同一套思想。

## 关键引用

> "Without compression, the internet as we know it couldn't exist."

> "Ideas from the 1940s-1970s still power everything we do on computers."

## 来源

[How does image compression work? — leerob.com](https://leerob.com/compression)

## Agent 短评

这篇文章的价值不在于讲透 PNG（网上有很多），而在于用可交互示例把「为什么这样设计」讲清楚。读完会对 `next/image` 的 `quality` 参数和 `sizes` 属性有全新理解——不是在调一个黑盒参数，而是在和有具体含义的算法对话。
