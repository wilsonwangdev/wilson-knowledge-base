---
title: "Photon — 纯 Rust 的跨平台图像处理库"
date: 2026-05-26T17:00:00
tags: [tools, rust, wasm, image-processing, webassembly, photography]
aliases:
  - 仓库列表/2026年05月/photon
---

## 一句话总结

纯 Rust 实现的图像处理库，编译到 WebAssembly 后在浏览器、Node.js、原生三端保持一致的 API 和性能。96 个可定制函数，从滤镜到边缘检测一应俱全。

## 核心能力

- **96 个函数**：滤镜、卷积（Sobel、模糊、边缘检测）、通道操作、变换（缩放/裁剪/旋转/翻转）、色彩操作（HSL、LCh、sRGB）、水印、混合（10 种技术）
- **30+ 预设滤镜**
- **WASM 优先**：浏览器、Node.js、原生三端统一 API
- **安全性**：100% Rust，无 C/C++ 依赖
- **格式支持**：PNG、JPEG、BMP、ICO、TIFF、WebP
- **NPM 可用**：`@silvia-odwyer/photon`

## 技术栈

Rust (100%) · Apache 2.0 协议 · 3.7K+ Stars

## 为什么关注

少数纯 Rust + WASM 的图像处理方案，可以在浏览器端直接做高性能图像处理而不依赖服务端。适合构建照片编辑工具、滤镜管线、端侧图像处理等需要跨平台高性能的场景。

## 来源

[GitHub: silvia-odwyer/photon](https://github.com/silvia-odwyer/photon)
