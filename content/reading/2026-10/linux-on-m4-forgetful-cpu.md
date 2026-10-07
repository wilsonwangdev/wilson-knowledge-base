---
title: "The forgetful CPU (Linux on M4)：一个让 CPU 忘掉自己寄存器的硬件 bug"
date: 2026-10-03T10:00
tags: [apple-silicon, linux, asahi-linux, m4, arm64, kernel, hardware-bringup, wfi, bootloader, reverse-engineering, firmware]
aliases:
  - 阅读列表/2026年10月/linux-on-m4-forgetful-cpu
---

## 一句话总结

作者 Yureka Lilian 记录了自己从零把 Linux 启动到 M4 Mac mini 上的完整过程——核心是发现了一个**违反 ARM64 规范的硬件行为**：M4 上 WFI（等待中断）指令会把 CPU 的 x0–x31 寄存器全部清零，也就是"健忘的 CPU"；最终解决方案（内核 bootarg + m1n1 条件注入）已并入 mainline Linux 与 m1n1，且同样适用于 M4 Pro、M4 Max 和 M5。

## 核心观点

**1. M4 的 WFI 指令会让 CPU 丢掉自己的寄存器，这直接违反 ARM64 规范的明文条款**

Apple Silicon 上有一个 chicken bit（`ARM64_REG_CYC_OVRD_ok2pwrdn_force_mask`）控制 WFI 的行为。置位时，WFI 会导致 CPU 的 x0–x31 被清零——CPU 在执行"等待"时把自己的状态忘了。XNU 的应对方式是在 WFI 前把寄存器压栈、之后恢复。

M1–M3 上，m1n1 会**禁用**这个行为，让 CPU 表现得像标准 arm64；而 Asahi 内核后来又**重新启用**它，为的是让核心进入更深的睡眠状态省电，并且这是让同簇中某个核心在其余核心深睡时 boost 到更高频率的前提。**M4 上这个 bit 被锁定或移除了**，于是默认行为直接违反规范。

作者的临时解法是：把内核里所有 WFI 和 WFIT 指令统统替换成 NOP，于 2026 年 4 月实现了全核心启动。

**2. 内核 erratum 框架被否，最后选了"把检测挪到引导层"的方案——这是全文最有方法论价值的一处**

发现问题后，最先尝试的是 Linux 的 erratum 框架（在早期启动时给内核内存打补丁）。**但这条路被否掉了**：要准确判断"什么时候该把 WFI NOP 掉"极其困难。具体反例是——**虚拟机里 WFI 会被 macOS hypervisor 捕获并用来调度不同 guest**，如果 erratum 逻辑在虚拟机里也触发，就会破坏这个机制；而在嵌套虚拟化下检测虚拟化本身也很棘手。

Will Deacon 给出了替代方案：**让内核支持通过一个新的 bootarg 禁用 WFI idle，由 m1n1 在启动裸机、且已知该机器 WFI 有缺陷时条件性地加上这个 bootarg**。

这个设计的巧妙之处是**把"硬件是否有问题"的判断从内核移到了引导层**：m1n1 明确知道自己正在哪台机器上启动，而内核不需要（也不应该）去猜。

**3. 早期启动调试的实际手法：没有 printf，就自己造一个**

文章大量篇幅是"怎么在没有输出的情况下定位问题"，手法可迁移：

- **自制 println-debugging**：把 m1n1 的 `debug_putc` 改成只输出一个 `'a'` 字符，插入内核极早期代码，然后 **bisect 启动代码**——靠"第几个 'a' 之后断了"来定位崩溃点；后来发现 device tree 里缺 `stdout-path = "serial0"`，补上后才有完整的寄存器 dump 和栈回溯
- **MMU 一开就崩**：m1n1 给 MMIO 建了 1:1 映射，**但 Linux 不这么做**。MMU 一启用，内存访问就走虚拟地址，对 UART 的访问落到未映射空间而非 UART 本身。修法是改初始页表，补上 MMIO 的 1:1 映射
- **RVBAR 写入会崩**：Reset Vector Base Address Register 在 M4 上写入即崩，但检查后发现它本来就已是正确值——**跳过这次写入**就是正确做法
- **locked registers 的共性**：GXF 功能在 raw boot 模式下被禁用/锁定，把它的初始化改成条件性、在这些机器上跳过，就是对的处理

**4. SPTM 让"靠 hypervisor 抓 MMIO trace"这套传统 bringup 方法失效——这是一代人的方法断层**

M4 是第一代**强制 SPTM（Secure Page Table Monitor）**的 Apple Silicon，它加固的是 XNU 内核的漏洞。在此之前，Linux bringup 主要靠 m1n1 hypervisor 抓 MMIO trace，通过分析 macOS 原生驱动与硬件的交互来反推硬件行为。

**SPTM 让这条路变得昂贵**：要让 macOS 跑在 hypervisor 下，m1n1 需要做重大改动，作者直言"certainly go beyond what I could come up with as a newbie in this space"。于是他转向了一条**不依赖 hypervisor trace 的替代路径**（直接试错 + 串口调试）。这一点值得注意：它不只是"这次更难"，而是**工具链层面的方法失效**。

## 关键引用

> "It seems this chicken bit is either locked or has been removed on M4, and the default behavior does not comply with the ARM64 specification (specifically: 'If the system is configured such that the WFI instruction can be completed, then the WFI instruction must not cause a loss of architectural state.')"

> "In April 2026, I managed to boot Linux on the M4 with all cores enabled by replacing all WFI and WFIT (Wait For Interrupt with Timeout) instructions in my kernel with NOP (no-op)."

> "Sometimes it would be nice if certain projects getting a lot of funding were more transparent about how they're benefitting from the upstream projects' progress."

## 来源

https://yuka.dev/blog-2026-10-02-linux-m4.html

## Agent 短评

第一手工程叙事，不是综述——作者亲手把 Linux 启动到一块当时被认为难以支持的新硬件上。核心发现反直觉：CPU 在执行等待指令时会忘掉自己的寄存器，而且违反规范明文；调试方法论可完整迁移（自制 putc 做 println-debugging、bisect 启动代码、识别 1:1 映射陷阱），问题从临时 workaround 到被社区接受的正式方案（含一个被否掉的 erratum 框架）的全过程也都在。局限：领域极窄、门槛高（作者明确不铺背景，概念一律假设读者已知）；是进行中工作的快照，摄像头、显示控制器、GPU 初始化仍未解决，文中 workaround 也只是过渡方案；作者自述是这块的 newbie，个别设计取舍未必是领域内最权威的判断。
