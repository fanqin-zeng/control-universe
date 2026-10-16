# 控制宇宙 Wiki · 第二学期（semester-02）优化方案与执行计划

> 版本：v1.0 ｜ 日期：2026-09-25 ｜ 状态：待用户评审
> 范围：章节与课程结构重组、角色讨论团队升级、分阶段执行计划与推荐 Prompt
> 本文件仅为规划产物，不改动任何内容文件或代码。

---

## 目录

- [0. 现状盘点（事实基线）](#0-现状盘点事实基线)
- [1. 结构诊断：已证实的 11 个问题](#1-结构诊断已证实的-11-个问题)
- [2. 新学期章节与课程结构方案](#2-新学期semester-02章节与课程结构方案)
- [3. 角色讨论团队升级方案](#3-角色讨论团队升级方案)
- [4. 执行计划与推荐 Prompt](#4-执行计划与推荐-prompt)
- [5. 验收门槛与统计口径](#5-验收门槛与统计口径)
- [附录 A：新旧目录映射表](#附录-a新旧目录映射表)
- [附录 B：风险与取舍](#附录-b风险与取舍)

---

## 0. 现状盘点（事实基线）

以下数字均由脚本直接从 `content/catalog.ts` 与文件系统统计得出，不依赖记忆。

### 0.1 目录规模

| 章节 | slug | 目录课程数 | 已写 MDX | 已 v1.3 交付 |
|------|------|-----------|---------|-------------|
| 数学基础 | `math` | 1 | 1 | 0 |
| 经典控制 | `classic` | 10 | 10 | 8 |
| 现代控制 | `modern` | 10 | 10 | 0 |
| 鲁棒控制 | `robust` | 8 | 8 | 0 |
| 计算机控制 | `computer-control` | 8 | 8 | 0 |
| 预测控制 | `mpc` | 8 | 8 | 0 |
| 非线性控制 | `nonlinear` | 8 | 8 | 8 |
| 智能控制 | `intelligent` | 7 | 3 | 3 |
| 强化学习控制 | `rl-control` | 8 | 0 | 0 |
| 离散控制 | `discrete` | 8 | 0 | 0 |
| 多智能体控制 | `multi-agent` | 8 | 0 | 0 |
| **合计** | | **84** | **56** | **19** |

**口径告警**：`.agent/delivery-tracker.md` 底部写"17 / 83"，但实际 `[x]` 计数为 **19**，目录课程数为 **84**，三个数字互相矛盾。`OUTLINE.md` 更旧，仍写"10 章 / 79 模块 / 已完成 1"（缺 math 章、缺 nonlinear 第 8 课、状态列几乎全为待编写）。统计已完全失控，必须自动化（见 A7 / E1）。

### 0.2 讨论日志覆盖

`docs/discuss-log/semester-01/` 下只有 `07-nonlinear`（8 篇）与 `08-intelligent`（3 篇），合计 13 个 md 文件。

即：**已写 56 课中，43 课没有讨论日志**。而项目记忆明确记录过"用户因为『没有固化课堂记录』要求重写已交付课程"的事故——`describing-function`、`phase-plane`、`nonlinear-characteristics` 三课因此整课重写。这是第二学期最大的一笔隐性负债。

### 0.3 修复日志归因分布

`.agent/fix-logs/` 共 18 条。按"本该由谁拦住"归因：

| 归因类别 | 条目 | 数量 | 现有团队中是否有人负责 |
|---------|------|------|---------------------|
| 前端 / 构建 / MDX 工程 | 011, 013, 015, 017 | 4 | **无** |
| 组件默认值与正文手算例不一致 | 014, 016, 018 | 3 | **无** |
| 交互组件设计规范（坐标轴 / 动画 / ipywidgets） | 001–010, 012 | 11 | 有（苏绘 + 何仿） |

**结论**：18 条返工中 **7 条（39%）落在现有 14 个角色的职责真空区**。角色团队升级不是锦上添花，而是直接对应可测量的返工成本。

### 0.4 资产与基建盘点

- `components/wiki/` 共 43 个文件（含 `use-echarts.tsx`、`jupyter-notebook.tsx` 等基础设施）
- 路由：`app/(wiki)/[chapter]/[lesson]/page.tsx`（单层动态路由，章节改名需同步 catalog + 目录名 + 站内链接）
- 组件注册表**有两份**：`mdx-components.tsx` 与 `lib/content.ts` 的 `compileMDX({ components })`，课程页走后者且显式覆盖前者（fix-015）
- 运行时：Next.js 端口 8080（`scripts/serve.mjs`）+ Jupyter Kernel HTTP 端口 8891（POST 需 `ProxyHandler({})` 绕过系统代理）
- 已知环境陷阱：Windows 下 Tailwind 工具类可能不生效需 inline style 兜底；`.next` 缓存可能损坏需 `rm -rf .next` 后重启

---

## 1. 结构诊断：已证实的 11 个问题

每条都附文件行级证据，不做推测。

### P1 · 计算机控制 vs 离散控制：整章级重复【严重】

`computer-control`（8 课，MDX 已全部写完）与 `discrete`（8 课，**零内容**）存在 5 组 1:1 撞车：

| computer-control | discrete | 判定 |
|---|---|---|
| `z-transform-basics` | `z-transform-analysis` | 重复 |
| `discrete-stability` | `discrete-stability-criteria` | 重复 |
| `digital-controller-design` | `digital-controller` | 重复（标题几乎相同） |
| `sampling-quantization` + `sampling-period` | `sampled-data-systems` | 重复 |
| `z-transform-basics` 内"差分方程实现"小节 | `discrete-time-systems` + `difference-equation` | 重复 |

`discrete` 章唯一真正原创的只有 `discrete-optimal-control`（离散 Riccati / DARE）。
`computer-control` 章唯一真正独占的是 `digital-pid`、`computer-control-architecture`、`realtime-control`（纯工程实现）。

**关键事实**：`discrete` 章 8 课一篇 MDX 都没写，重组的边际成本为**零**。这是本方案成本最低、收益最高的一项动作。

### P2 · 数学基础章严重不完整【严重】

math 章只有 1 课（`complex-numbers`）。但 `.agent/skills/wiki-discussion/personas.md` 中方数教授的"擅长话题"列了 7 项：线性代数、常微分方程与动力系统、变分法、概率论与随机过程、凸优化、泛函分析、复变函数——**除复变函数外全部无对应课程**。人设承诺与目录之间存在系统性缺口。

更严重的是，`SKILL.md` 第 272–282 行明确规定：

> 遇到需要较多篇幅解释的数学概念，则不在原地展开完整讲解，而是用一两句话交代直觉含义，然后引用数学基础章节的对应课程……以"假设读者只有高中数学水平"为起点编写。

**这条规则当前无法执行**——被引用的目标课程不存在。

实际已在正文中出现、却无 math 课可引用的依赖（抽样）：

| 数学依赖 | 出现位置 |
|---------|---------|
| 矩阵指数、状态方程求解 | `modern/state-space` |
| 变分法、Hamilton 函数、极小值原理 | `modern/optimal-control-basics` |
| Riccati 方程、正定矩阵、二次型 | `modern/lqr-controller`、`robust/robust-stability` |
| 概率论、白噪声、条件期望 | `modern/kalman-filter` |
| QP、KKT 条件、凸集 | `mpc/constraint-handling`、`mpc/receding-horizon` |
| Lie 导数、Lie 括号、微分同胚 | `nonlinear/feedback-linearization` |
| 迹–行列式平面、Floquet 乘子、分岔 | `nonlinear/phase-plane` |
| 结构化奇异值、LFT、Kharitonov 定理 | `robust/*` 多课 |
| 图拉普拉斯、代数连通性 | `multi-agent/*`（未写，即将需要） |
| 贝尔曼方程、马尔可夫决策过程 | `rl-control/*`（未写，即将需要） |

### P3 · 章节顺序违反依赖关系【严重】

当前顺序：math → classic → modern → **robust** → **computer-control** → **mpc** → **nonlinear** → intelligent → rl-control → **discrete** → multi-agent

- **mpc 排在第 6，但它的全部数学基础在第 5 与第 9 章。** `mpc/prediction-model` 讲"状态空间预测模型"需要离散状态空间与 Z 变换，而 Z 变换在第 9 章 `discrete`（未写）与第 5 章 `computer-control`。mpc 8 课没有一课能自洽地讲预测模型。
- **robust 排在第 4，但 H∞/μ 需要 Lyapunov 工具与凸优化。** `robust/robust-stability` 含小节"Lyapunov方法：二次稳定性"（catalog.ts:444），而 Lyapunov 的系统讲解在第 7 章 `nonlinear/lyapunov-stability` 与第 3 章 `modern/linear-system-theory`。
- **nonlinear 排在第 7，但 `mpc/nonlinear-mpc`（第 6 章）依赖它**，且 mpc 章的 Lyapunov-based NMPC 小节（catalog.ts:679）直接引用非线性 Lyapunov 理论。

### P4 · 章内顺序倒置、名实不符与小节级重复【中等】

| 位置 | 问题 |
|------|------|
| `robust` 3.4 `mu-synthesis` → 3.6 `uncertainty-modeling` | **依赖倒置**：μ 综合的前提是不确定性建模，却排在它之前两课。且 `mu-synthesis` 内还有一个名为"不确定性建模"的小节（catalog.ts:433），与 3.6 整课（catalog.ts:453）重复 |
| `modern` 2.8 `linear-system-theory` | **名实不符**：标题叫"线性系统理论"，但 5 个小节全部是 Lyapunov 内容（catalog.ts:344–348）。而且它排在 LQR（2.6）之后，但 Lyapunov 是理解"LQR 为什么稳定"的前提——又一处依赖倒置 |
| `classic` 1.4 `frequency-domain-analysis` vs 1.8 `frequency-response` | **小节级逐字重复**："频域指标与时域指标的对应"在两课中同名出现（catalog.ts:103 与 177）。`frequency-response` 的"稳定性判据"（catalog.ts:176）与 `stability-analysis` 的"从频域看稳定性"（catalog.ts:159）也重复 |
| `classic` 1.7 `stability-analysis` | 排在 1.6 `pid-controller` 之后，但 Ziegler–Nichols 整定（1.8 的 catalog.ts:181）需要临界增益这一稳定性概念 |
| `nonlinear` 6.6 / 6.7 / 6.8 | 三课都含同名小节"与其他非线性控制方法的对比"（catalog.ts:797 / 811 / 826），内容必然互相覆盖；6.7 与 6.8 都含"处理参数不确定性"（catalog.ts:809 / 825） |
| `modern` 2.2 vs 2.4 | "对偶原理"同名小节出现两次（catalog.ts:253 与 281），应一处主讲 + 一处引用 |
| `mpc` 5.4 / 5.6 / 5.7 | 三课都留有独立小节"交互式可视化"（catalog.ts:635 / 666 / 683），这是 **v1.2 遗留**——v1.3 已规定交互组件内联到概念旁，不设独立可视化章节 |
| `modern` 2.7 `kalman-filter` | 含"q-和-r-的选择"小节（catalog.ts:333），与 `lqr-controller` 的"Q-和-R-的选择"（catalog.ts:314）内容重复（虽是 LQG 对偶性使然，但应一处主讲） |

### P5 · 跨章重复 slug【中等】

`multi-agent-rl` 同时出现在 `rl-control`（catalog.ts:902）与 `multi-agent`（catalog.ts:930）。路由上 `/rl-control/multi-agent-rl` 与 `/multi-agent/multi-agent-rl` 不冲突，但**内容必然重复**，且交付记录里会出现两行同名待办，统计会重复计数。

### P6 · catalog 缺少结构性元数据【中等】

`content/catalog.ts` 的 `LessonMeta` 只有 `slug / title / subsections` 三个字段（catalog.ts:6–10）。缺少：

| 缺失字段 | 后果 |
|---------|------|
| `prereq` | 无法做依赖图校验（P3 的顺序错误无法自动发现）；无法在 UI 上提示读者"先学什么" |
| `level` | 读者无法判断难度（本科 / 硕士 / 博士） |
| `type` | 无法自动决定"哪些角色上场"（阻塞第 3 节的角色矩阵落地） |
| `status` | 交付状态只能靠 `delivery-tracker.md` 手工维护，已经与事实脱节（见 0.1） |

### P7 · 完全缺失的主流控制主题【严重】

盘点 11 章，以下"教科书级、课程化成熟"的主题**一课都没有**：

| 缺失主题 | 现状 | 严重性 |
|---------|------|-------|
| **系统辨识** | 仅 `mpc/prediction-model` 一个"模型辨识基础"小节（catalog.ts:607）+ `nonlinear/adaptive-control-basics` 的 RLS 小节。一门独立学科被压成两个小节 | 高 |
| **状态估计与滤波（Kalman 之外）** | 只有 `modern/kalman-filter` 一课。EKF / UKF / 粒子滤波 / H∞ 滤波 / MHE / 多传感器融合**全部缺失** | 高 |
| **无源性与耗散理论（PBC）** | 零。而它是 backstepping、机器人力控、电力电子控制的共同基础 | 高 |
| **输入–状态稳定性 ISS 与小增益** | 零。这是连接 nonlinear 与 robust 两章的桥（`robust/robustness-concept` 讲了小增益定理但只在输入输出框架下） | 中高 |
| **控制屏障函数 CBF / 安全集不变性 / 可达性** | 零（`rl-control/safe-rl` 只覆盖 RL 侧） | 高 |
| **故障诊断与容错控制 FDI/FTC** | 零。工业刚需 | 中高 |
| **网络控制系统 NCS** | 零。延迟 / 丢包 / 带宽约束只在 `realtime-control` 零星提及 | 中高 |
| **事件触发 / 自触发控制** | 零。前沿且工程价值高（省通信、省算力） | 中 |
| **切换与混合系统** | 零。与滑模、显式 MPC、多模态机械系统直接相关 | 中 |
| **时滞系统专题** | 仅 `classic/stability-analysis` 的"时滞系统的稳定性"（catalog.ts:161）+ `frequency-response` 的"时滞对频率响应的影响"（catalog.ts:179）两个小节。化工与网络场景中时滞是常态 | 中高 |
| **迭代学习控制 ILC** | 零。机器人、伺服、批处理过程的标准方法 | 中 |
| **分布参数 / 无穷维系统（PDE 控制）** | 零（personas.md 中方数提到"泛函分析入门（无穷维系统）"，也无对应课程） | 低（P2） |
| **功能安全标准（ISO 26262 / IEC 61508）** | 零 | 中 |
| **控制理论史与方法论地图** | 零。读者学完 11 章仍无法回答"面对一个实际系统我该用哪种方法" | 中高 |
| **模型基础 RL / 离线 RL / 模仿学习 / Sim-to-Real** | 零。现有 rl-control 8 课是"算法罗列"，缺控制视角与部署视角 | 高（若要写 rl 章） |

### P8 · intelligent 章选题的时代性【中等】

`expert-system`（专家系统）在 2026 年已高度边缘化，作为一整课的性价比很低。`genetic-algorithm` 只讲 GA，但控制器整定实际更常用 PSO / 差分进化 / CMA-ES，而项目已经在 `intelligent/neural-network-control` 中用过进化策略（ES），存在覆盖不一致。建议**重新定位而非删除**（见 2.12）。

### P9 · 缺少跨章横向课程与应用专题【中等】

每章各有 `*-case-study`，但**没有跨章的选型总纲**，也没有导论章建立全局地图。同时 `personas.md` 定义了 7 类轮值领域专家（化工 / 自动驾驶 / 航空航天 / 机器人 / 电力 / 电机 / 生物医学），却没有对应的"应用专题"章来承接——轮值专家的行业知识只在单课里出现一次就消失，无法沉淀成可复用的行业课程。

### P10 · 角色团队的职责真空【严重】

由 0.3 可知，39% 的历史返工无人负责。具体缺口：

1. **无人负责前端工程**：React 交互组件、`useECharts` 用法、MDX 编译、构建流水线、双注册表一致性（fix-011/013/015/017）
2. **无独立数值仲裁者**：做"正文数字 / notebook 输出 / 组件默认参数"三方对账（fix-014/016/018）。何仿自己写的仿真无法自己审计
3. **无人负责学习体验**：整课的阅读节奏、认知负荷、H2 数量、前置链接完整性、交付档案完备性。当前 `nonlinear/phase-plane` 有 15 个 H2、`feedback-linearization` 有 14 个，已接近可读性上限却无人把关
4. **无红队角色**：质问对比公平性。项目记忆里的 ABS 稻草人基线事故（"对比基线必须整定过——ABS 的门限逻辑若写成每步继电器，湿卵石上会比无 ABS 还差"）正是这类失误
5. **无功能安全 / 标准视角**：无法支撑新增的 safety-ftc 章与工业案例课
6. **无控制史与方法论视角**：无法支撑新增的 introduction 章
7. **学生团队 4 人全部是自动化 / 控制背景**：而新增的 rl-control（11 课）、intelligent（8 课）、multi-agent（10 课）共 29 课的主力读者是 CS / ML 背景，视角完全缺失；math 章 16 课需要"只有高中数学"的读者哨兵，小初（大三自动化，已修过微积分线代概率）无法承担

### P11 · 流程机制缺失【中等】

| 缺口 | 证据 |
|------|------|
| 无自动化验收脚本 | fix-013 明确记录"本地 Python harness 不解析 MDX 故抓不到"，并把"页面 200 且 h2 数 == catalog 小节数"列为交付硬门槛，但**至今仍是人工执行** |
| notebook cell 一致性靠人工 | fix-017 要求"MDX cell 与 harness cell 字符串全等"校验脚本作为交付门槛，同样人工 |
| 双注册表未根治 | fix-015 被记录为"新增组件必须两处同改"，即用纪律规避而非从结构上消除 |
| 统计口径靠手工 | 已经错了（见 0.1） |
| fix-log 无归因闭环 | 18 条 fix-log 都没有"本该谁拦住"字段，因此无法反推角色清单缺什么 |

---

## 2. 新学期（semester-02）章节与课程结构方案

### 2.0 总览：11 章 84 课 → 16 章 155 课

| # | 章节 | slug | 课数 | 相对当前的变化 | 优先级 |
|---|------|------|------|--------------|--------|
| 00 | 导论与方法论地图 | `introduction` | 3 | **新增** | P1 |
| 01 | 数学基础 | `math` | 16 | 1 → 16 | **P0** |
| 02 | 经典控制 | `classic` | 11 | 拆"分析/设计"去重 + 新增 2 | P1 |
| 03 | 现代控制 | `modern` | 9 | 移出 kalman-filter，重命名并前移 lyapunov 课 | P1 |
| 04 | 状态估计与滤波 | `estimation` | 9 | **新增**（含自 modern 移入的 kalman-filter） | **P0** |
| 05 | 非线性控制 | `nonlinear` | 12 | 8 → 12（新增 4） | P1 |
| 06 | 离散与采样数据系统 | `discrete-sampled` | 10 | **由 computer-control 理论半 + discrete 全章合并重组** | **P0** |
| 07 | 控制工程实现 | `implementation` | 10 | **由 computer-control 工程半扩展** | **P0** |
| 08 | 预测控制 | `mpc` | 11 | 8 → 11（拆出显式 MPC，新增 3） | P1 |
| 09 | 鲁棒控制 | `robust` | 10 | 重排 + 拆分 μ + 新增时滞专题 | P1 |
| 10 | 系统辨识与数据驱动建模 | `identification` | 9 | **新增** | P1 |
| 11 | 智能控制 | `intelligent` | 8 | 重定位 2 课 + 新增 ILC | P2 |
| 12 | 强化学习控制 | `rl-control` | 11 | 8 → 11，移出 multi-agent-rl 与 safe-rl | P2 |
| 13 | 多智能体与分布式控制 | `multi-agent` | 10 | 8 → 10，接收 multi-agent-rl | P2 |
| 14 | 安全、容错与认证控制 | `safety-ftc` | 8 | **新增** | P2 |
| 15 | 控制应用专题 | `applications` | 8 | **新增**（制度化轮值专家） | P2 |
| | **合计** | | **155** | | |

> **规模说明**：155 课约为当前的 1.85 倍。已写 56 课全部保留（部分重命名 / 移位）；目录内未写的 28 课中 24 课（discrete / rl-control / multi-agent）会被重组吸收；纯新增约 71 课。
>
> **建议节奏**：P0 是"不补就会持续返工"的结构债与数学地基，优先做完；P1 是主干完善；P2 是外延扩张，可按读者反馈再决定是否全做。**本方案不要求一次性做完 155 课**，任何阶段停下都是一致状态。
>
> **章节新顺序**（解决 P3）：introduction → math → classic → modern → estimation → nonlinear → discrete-sampled → implementation → mpc → robust → identification → intelligent → rl-control → multi-agent → safety-ftc → applications。
> 依据：nonlinear 提前到 modern/estimation 之后（Lyapunov 是其自然延伸，且 mpc 与 robust 都需要它）；discrete-sampled 与 implementation 提到 mpc 之前（MPC 全部是离散的）；robust 放到 mpc 之后（H∞ 需要频域 + 状态空间 + 凸优化三件套齐备）；identification 放在 mpc 之后（回答"MPC 的模型从哪来"）。

### 2.1 `introduction` 导论与方法论地图（3 课，新增，P1）

| slug | 标题 | 说明 |
|------|------|------|
| `control-landscape` | 控制理论全景图 | 从 PID 到强化学习：16 章的知识地图、四大历史学派（频域派 / 状态空间派 / 优化派 / 学习派）、何时用什么 |
| `why-feedback-works` | 反馈为什么有效 | 灵敏度抑制、扰动抑制、参数不敏感性的统一解释；Bode 灵敏度积分定理（"反馈不创造性能，只搬运性能"） |
| `controller-selection-guide` | 控制器选型决策指南 | 面对一个实际系统的决策树：模型精度 / 约束 / 实时性 / 认证要求 / 数据可得性 → 方法族 |

> 承接 P7 的"方法论地图缺失"与 P9 的"缺少跨章横向课程"，也是新角色**许史**的主战场。`controller-selection-guide` 应在每学期末随目录变化复审一次。

### 2.2 `math` 数学基础（16 课，P0）

| # | slug | 标题 | 主要服务对象 |
|---|------|------|-------------|
| 1 | `complex-numbers` | 复数与复平面 | ✅已有，需按 v1.3 复核 |
| 2 | `linear-algebra-basics` | 向量、矩阵、秩与子空间 | modern 全章 |
| 3 | `eigen-decomposition` | 特征值、特征向量与对角化 | modern、nonlinear、multi-agent |
| 4 | `matrix-decomposition` | 矩阵分解：SVD、Jordan、二次型与正定性 | LQR、robust、identification |
| 5 | `ode-matrix-exponential` | 常微分方程与矩阵指数 | `modern/state-space` |
| 6 | `laplace-transform` | 拉普拉斯变换 | classic 全章 |
| 7 | `fourier-analysis` | 傅里叶分析与频谱概念 | classic 频域、描述函数 |
| 8 | `z-transform` | Z 变换与离散时间信号 | discrete-sampled、mpc |
| 9 | `probability-basics` | 概率论与随机变量 | estimation、kalman |
| 10 | `stochastic-processes` | 随机过程、马尔可夫链与白噪声 | estimation、rl-control |
| 11 | `convex-optimization` | 凸优化：凸集、QP 与 KKT 条件 | mpc、LQR、H∞、CBF-QP |
| 12 | `variational-dp` | 变分法与动态规划（含贝尔曼方程） | optimal-control、rl-control |
| 13 | `diff-geometry` | 微分几何入门：向量场、李导数、李括号 | feedback-linearization、sliding-mode |
| 14 | `graph-theory` | 图论与网络拉普拉斯、代数连通性 | multi-agent |
| 15 | `game-theory-math` | 博弈论数学基础：纳什均衡与 LQ 博弈 | `multi-agent/game-theory-basics` |
| 16 | `numerical-methods` | 数值方法与矩阵微积分：积分步长、刚性、条件数 | 全部含仿真的课程 |

> 第 16 课直接服务于 fix-016 那类"积分抽稀后下标换算错误"，让读者理解仿真结果为什么可信 / 不可信——这也是何仿与柯验两个角色能对话的共同语言。
> **执行要点**：math 章每课必到角色包含**岳自**（只有高中数学的自学转行者），他是"高中数学起步"这条规则的唯一真实检验者。

### 2.3 `classic` 经典控制（11 课，P1）

**核心动作**：拆分"分析"与"设计"，消除 `frequency-domain-analysis` 与 `frequency-response` 的重叠；稳定性提前。

| # | slug | 标题 | 变化 |
|---|------|------|------|
| 1 | `system-modeling` | 系统建模基础 | ✅已交付 |
| 2 | `transfer-function` | 传递函数入门 | ✅已交付 |
| 3 | `time-domain-analysis` | 时域分析 | ✅已交付 |
| 4 | `stability-analysis` | 稳定性分析：代数判据 | 从 1.7 **提前**；剥离频域 / 根轨迹部分，聚焦稳定性定义、Routh、Hurwitz、时滞初步 |
| 5 | `frequency-domain-analysis` | 频域分析：Bode、Nyquist 与稳定判据 | ✅已交付；**吸收** frequency-response 的"稳定性判据""在 Bode/Nyquist 图上读取裕度""频域指标与时域指标的对应" |
| 6 | `root-locus` | 根轨迹法 | ✅已交付 |
| 7 | `frequency-response-design` | 频率响应设计法：回路整形与带宽 | **重定位** `frequency-response`（slug 与文件改名、内容重写为"设计"而非"分析"）；保留 Ziegler–Nichols、闭环频率响应、时滞影响；删除与第 5 课重复的三个小节 |
| 8 | `pid-controller` | PID 控制器设计 | ✅已交付 |
| 9 | `compensator-design` | 校正网络设计 | ✅已交付 |
| 10 | `design-methods-comparison` | **新增**：时域 / 频域 / 根轨迹三种设计法的统一对比与选型 | 承接 P9；同时作为 `introduction/controller-selection-guide` 的经典控制分支 |
| 11 | `classic-case-study` | 经典控制综合案例 | 待 v1.3；改为串联第 4–10 课的全部方法 |

### 2.4 `modern` 现代控制（9 课，P1）

| # | slug | 标题 | 变化 |
|---|------|------|------|
| 1 | `state-space` | 状态空间表示 | 待 v1.3 |
| 2 | `controllability-observability` | 可控性与可观性 | 待 v1.3；"对偶原理"改为**本课主讲**，`state-observer` 改为引用 |
| 3 | `lyapunov-modern` | **重命名**（原 `linear-system-theory`）：Lyapunov 方法与现代稳定性 | 名实对齐；**位置从 2.8 提前到 2.3**；与 `nonlinear/lyapunov-stability` 明确分工——本课 = 线性系统的 Lyapunov 方程、内部/外部稳定性、可稳定性与可检测性；非线性课 = 直接法、LaSalle 不变集、吸引域估计 |
| 4 | `state-feedback` | 状态反馈与极点配置 | 待 v1.3 |
| 5 | `state-observer` | 状态观测器设计 | 待 v1.3；末节指向 estimation 章 |
| 6 | `optimal-control-basics` | 最优控制基础 | 待 v1.3 |
| 7 | `lqr-controller` | LQR 控制器 | 待 v1.3；"Q 和 R 的选择"**本课主讲**，kalman-filter 改为引用 |
| 8 | `multivariable-systems` | 多变量系统分析 | 待 v1.3 |
| 9 | `modern-case-study` | 现代控制综合案例 | 待 v1.3；**移除 Kalman/LQG 步骤**（改引用 estimation 章），改为极点配置 + 观测器 + LQR + Lyapunov 验证 + RGA |

> `kalman-filter` 移出至 `estimation` 章并大幅扩充。

### 2.5 `estimation` 状态估计与滤波（9 课，新增，P0）

| # | slug | 标题 |
|---|------|------|
| 1 | `estimation-problem` | 估计问题框架：从观测器到最优估计 |
| 2 | `least-squares-ml` | 最小二乘、加权最小二乘与极大似然估计 |
| 3 | `kalman-filter` | 卡尔曼滤波（自 modern 移入，保留 LQG 一节） |
| 4 | `extended-kalman-filter` | 扩展卡尔曼滤波 EKF：线性化误差、收敛条件与失效场景 |
| 5 | `unscented-kalman-filter` | 无迹卡尔曼滤波 UKF：Sigma 点选取与二阶精度 |
| 6 | `particle-filter` | 粒子滤波与蒙特卡洛方法：多峰后验、粒子退化与重采样策略 |
| 7 | `h-infinity-filter` | H∞ 滤波与鲁棒估计（与 robust 章交叉引用） |
| 8 | `mhe-fusion` | 移动水平估计 MHE 与多传感器融合 |
| 9 | `estimation-case-study` | 估计综合案例：非线性系统的滤波器选型与定量对比 |

> **为什么是 P0**：滤波是所有闭环系统的必经环节，当前只有 1 课；且 EKF / UKF / PF 天然是"参数变化 → 估计误差变化"的交互探索场景，与 v1.3 双轨制高度契合，投入产出比最好。
> **第 9 课是何疑红队机制的第一块试金石**：五种滤波器在同一非线性对象上的 RMSE 对比，基线必须公平（同一初始协方差、同一噪声实现、同一调参预算）。

### 2.6 `nonlinear` 非线性控制（12 课，P1）

| # | slug | 标题 | 状态 |
|---|------|------|------|
| 1 | `nonlinear-characteristics` | 非线性系统特性 | ✅已交付 |
| 2 | `phase-plane` | 相平面分析 | ✅已交付 |
| 3 | `describing-function` | 描述函数法 | ✅已交付 |
| 4 | `lyapunov-stability` | 李雅普诺夫稳定性 | ✅已交付 |
| 5 | `feedback-linearization` | 反馈线性化 | ✅已交付 |
| 6 | `sliding-mode-control` | 滑模控制 | ✅已交付 |
| 7 | `backstepping` | 反步法设计 | ✅已交付 |
| 8 | `adaptive-control-basics` | 自适应控制基础 | ✅已交付 |
| 9 | `passivity-control` | **新增**：无源性、耗散理论与无源性控制（PBC） | P1 |
| 10 | `iss-small-gain` | **新增**：输入–状态稳定性 ISS 与小增益定理（桥接 robust） | P1 |
| 11 | `switched-hybrid-systems` | **新增**：切换与混合系统——多 Lyapunov 函数、dwell time、Zeno 现象 | P1 |
| 12 | `bifurcation-chaos` | **新增**：分岔与混沌入门（深化 phase-plane 的分岔节 + describing-function 的跳跃共振） | P2 |

**附加动作（不新增课程，属章内治理）**：
- 三课同名的"与其他非线性控制方法的对比"小节 → 改为**一处集中对比表**（建议置于第 12 课或章末总表），另两课改为引用
- 两处"处理参数不确定性" → 明确分工：`backstepping` = 自适应反步的设计流程；`adaptive-control-basics` = 参数估计理论与持久激励

### 2.7 `discrete-sampled` 离散与采样数据系统（10 课，P0，合并重组）

**来源**：原 `discrete` 章 8 课（零内容，直接吸收）+ 原 `computer-control` 的理论半。

| # | slug | 标题 | 来源与处置 |
|---|------|------|-----------|
| 1 | `discrete-time-systems` | 离散时间系统与状态空间 | 新写 |
| 2 | `difference-equation` | 差分方程建模与脉冲传递函数 | 新写 + 吸收 `z-transform-basics` 的"差分方程实现"小节 |
| 3 | `z-transform-analysis` | Z 变换分析：性质、逆变换与 z/s 平面映射 | **迁移复用** `computer-control/z-transform-basics` |
| 4 | `discretization-methods` | 离散化方法：ZOH、Tustin、零极点匹配与保结构离散化 | **拆分独立**（原为 `digital-controller-design` 第 1 节） |
| 5 | `discrete-stability-criteria` | 离散稳定性：Jury、w 变换、离散根轨迹与稳定裕度 | **迁移复用** `computer-control/discrete-stability` |
| 6 | `discrete-time-freq` | 离散系统时频分析：混叠、频率扭曲与带宽折损 | 新写 + 吸收 `sampling-quantization` 的混叠内容 |
| 7 | `sampling-period-selection` | 采样周期选择与多速率采样 | **迁移复用** `computer-control/sampling-period` |
| 8 | `sampled-data-systems` | 采样数据系统理论：提升法、精确离散模型与采样间性能 | 新写（理论深度课） |
| 9 | `discrete-optimal-control` | 离散最优控制：DARE、离散 LQR 与动态规划 | 新写（原 discrete 章唯一真正原创的课） |
| 10 | `event-triggered-control` | **新增**：事件触发与自触发控制 | 填补 P7 缺口 |

### 2.8 `implementation` 控制工程实现（10 课，P0）

**来源**：原 `computer-control` 的工程半 + 新写。

| # | slug | 标题 | 来源与处置 |
|---|------|------|-----------|
| 1 | `digital-pid` | 数字 PID：三种实现形式、抗饱和与微分滤波 | **迁移复用** + 合并 `digital-controller-design` 的"数字PID工程实现"节 |
| 2 | `pid-engineering-tuning` | PID 工程整定：ZN、Cohen–Coon、继电反馈自整定与实测对比 | 新写（从 `classic/pid-controller` 与 `frequency-response` 的 ZN 节抽出并深化） |
| 3 | `controller-discretization-practice` | 控制器离散化实战：从连续设计到定点化部署 | 新写 |
| 4 | `computer-control-architecture` | 计算机控制系统架构与硬件选型 | **迁移复用** |
| 5 | `realtime-control` | 实时控制：任务调度、中断与优先级反转 | **迁移复用** |
| 6 | `embedded-implementation` | 嵌入式实现：定点 / 浮点、数值精度、DMA 与驱动；接收 `sampling-quantization` 的量化部分 | **迁移复用**（拆分接收） |
| 7 | `networked-control` | **新增**：网络控制系统 NCS——延迟、丢包、带宽与时钟同步 | 填补 P7 缺口 |
| 8 | `industrial-bus-protocols` | **新增**：工业总线与协议——CAN / EtherCAT / Modbus / PROFINET 的控制视角 | 填补 P7 缺口 |
| 9 | `hil-rapid-prototyping` | **新增**：半实物仿真、快速原型与自动代码生成 | 填补 P7 缺口（何仿 + 周联主战场） |
| 10 | `implementation-case-study` | 实现综合案例：同一控制器在 MCU / SoC / PLC 三种平台的移植与实测 | 新写 |

### 2.9 `mpc` 预测控制（11 课，P1）

| # | slug | 标题 | 变化 |
|---|------|------|------|
| 1 | `mpc-principle` | 模型预测控制原理 | 待 v1.3 |
| 2 | `prediction-model` | 预测模型建立 | 待 v1.3；**"模型辨识基础"小节移出**，改为引用 identification 章 |
| 3 | `receding-horizon` | 滚动优化策略 | 待 v1.3；**"显式 MPC"小节移出**为独立课 |
| 4 | `constraint-handling` | 约束处理 | 待 v1.3；**删除"交互式可视化"独立小节**（v1.2 遗留，catalog.ts:635） |
| 5 | `mpc-stability` | **新增**：MPC 稳定性理论——终端约束、终端代价与收缩性 | 集中散落在第 3、8 课的稳定性内容 |
| 6 | `explicit-mpc` | **新增**：显式 MPC 与多参数规划（连接切换系统） | |
| 7 | `generalized-predictive-control` | 广义预测控制 GPC | 待 v1.3；删除"交互式可视化"独立小节 |
| 8 | `nonlinear-mpc` | 非线性 MPC | 待 v1.3；删除"交互式可视化"独立小节；**前置改为 nonlinear 章** |
| 9 | `distributed-mpc` | 分布式 MPC | 待 v1.3；与 `multi-agent/distributed-optimization` 明确分工（后者讲算法，本课讲应用） |
| 10 | `economic-mpc` | **新增**：经济 MPC 与 MPC–规划集成 | 承接吴规的"甲方视角" |
| 11 | `mpc-case-study` | MPC 实现案例 | 从第 5 位**移到最后**，串联全章 |

### 2.10 `robust` 鲁棒控制（10 课，P1）

**核心动作**：不确定性建模提前，μ 拆分为"分析"与"综合"，新增时滞专题。

| # | slug | 标题 | 变化 |
|---|------|------|------|
| 1 | `robustness-concept` | 鲁棒性概念：灵敏度、H∞ 范数与小增益定理 | 待 v1.3 |
| 2 | `uncertainty-modeling` | 不确定性建模：加性 / 乘性 / 互质 / LFT / 实参数 | 从 3.6 **提前到 3.2** |
| 3 | `robust-stability` | 鲁棒稳定性分析：Kharitonov、二次稳定、Monte Carlo | 从 3.5 **提前到 3.3** |
| 4 | `h-infinity-basics` | H∞ 控制基础 | 待 v1.3 |
| 5 | `mixed-sensitivity` | 混合灵敏度设计 | 待 v1.3 |
| 6 | `mu-analysis` | **新增 / 拆分**：μ 分析——结构化奇异值与鲁棒性能判定 | 从 `mu-synthesis` 拆出"分析"半 |
| 7 | `mu-synthesis` | μ 综合：D–K 迭代 | **删除**内部"不确定性建模"小节（catalog.ts:433），改为引用第 2 课 |
| 8 | `robust-performance` | 鲁棒性能指标与权衡 | 从 3.7 **移到 μ 之后**（依赖对齐） |
| 9 | `delay-robust-control` | **新增**：时滞系统的鲁棒控制（吸收 classic 两处时滞小节并深化） | 填补 P7 缺口 |
| 10 | `robust-case-study` | 鲁棒控制综合案例 | 待 v1.3 |

### 2.11 `identification` 系统辨识与数据驱动建模（9 课，新增，P1）

| # | slug | 标题 |
|---|------|------|
| 1 | `identification-framework` | 辨识问题框架：模型集、准则与验证 |
| 2 | `least-squares-rls` | 最小二乘与递推最小二乘（自 `adaptive-control-basics` 抽出并深化，含协方差 windup） |
| 3 | `persistent-excitation` | 持久激励条件与参数可辨识性 |
| 4 | `model-structures` | 模型族：ARX / ARMAX / OE / BJ 与状态空间模型 |
| 5 | `instrumental-variable` | 工具变量法与闭环辨识 |
| 6 | `frequency-domain-id` | 频域辨识与谱分析（含实测扫频、窗函数与噪声抑制） |
| 7 | `subspace-id` | 子空间辨识 N4SID / MOESP |
| 8 | `nonlinear-data-driven-id` | 非线性与灰盒辨识、神经网络辨识、符号回归 |
| 9 | `identification-case-study` | 辨识综合案例：从实测数据到可用于 MPC 的模型（含阶次选择与残差检验） |

> **为什么重要**："模型从哪来"是所有基于模型方法的第一性问题。当前它被压成 `mpc/prediction-model` 与 `nonlinear/adaptive-control-basics` 的两个小节。这一章同时是 `estimation`（第 2 课共享最小二乘基础）与 `rl-control/sim-to-real`（域随机化本质是辨识不确定性建模）的公共基础。

### 2.12 `intelligent` 智能控制（8 课，P2）

| # | slug | 标题 | 变化 |
|---|------|------|------|
| 1 | `fuzzy-control-basics` | 模糊控制基础 | ✅已交付 |
| 2 | `fuzzy-controller-design` | 模糊控制器设计 | ✅已交付 |
| 3 | `neural-network-control` | 神经网络控制 | ✅已交付 |
| 4 | `fuzzy-neural-network` | 模糊神经网络（ANFIS） | 保留 |
| 5 | `metaheuristic-tuning` | **重定位**（原 `genetic-algorithm`）：元启发式优化与控制器整定——GA / PSO / DE / CMA-ES 定量对比 | 扩展选题，与 `neural-network-control` 已用的 ES 对齐 |
| 6 | `knowledge-driven-control` | **重定位**（原 `expert-system`）：知识驱动控制——规则学习、行为克隆、知识蒸馏与 LLM 辅助控制的现状与边界 | 时代化，避免讲 1980 年代专家系统外壳 |
| 7 | `iterative-learning-control` | **新增**：迭代学习控制 ILC | 填补 P7 缺口 |
| 8 | `intelligent-case-study` | 智能控制综合案例 | 建议串联第 1–7 课在同一被控对象（倒立摆）上的完整对比——这是**何疑红队机制压力最大的一课**，因为已有记忆表明"Mamdani 模糊 PD 无法稳定倒立摆（rms≈21° vs PID 2.67°）"，必须确保这不是稻草人基线 |

### 2.13 `rl-control` 强化学习控制（11 课，P2）

| # | slug | 标题 | 变化 |
|---|------|------|------|
| 1 | `rl-basics` | 强化学习基础：MDP、贝尔曼方程与折扣因子 | 引用 `math/stochastic-processes`、`math/variational-dp` |
| 2 | `q-learning` | Q-learning 与表格法 | |
| 3 | `dqn` | 深度 Q 网络 DQN：经验回放、目标网络与 Q 值过估计 | |
| 4 | `policy-gradient` | 策略梯度方法：REINFORCE 到 TRPO / PPO | 与 `intelligent/neural-network-control` 的 PPO 节明确分工（后者讲控制视角，本课讲算法机理） |
| 5 | `actor-critic` | Actor-Critic 架构：DDPG / TD3 / SAC | |
| 6 | `model-based-rl` | **新增**：基于模型的 RL 与 Dyna（连接 mpc 与 identification） | |
| 7 | `imitation-offline-rl` | **新增**：模仿学习与离线 RL（连接 identification 与行为克隆） | |
| 8 | `rl-analysis-validation` | **新增**：RL 控制器的稳定性、验证与泛化边界 | 控制视角的核心课；原 `safe-rl` 移至 safety-ftc 章 |
| 9 | `sim-to-real` | **新增**：Sim-to-Real——域随机化、系统辨识与部署 | |
| 10 | `rl-vs-classical` | **新增**：RL 与 LQR / MPC 的定量对比与选型（基线必须整定过） | 直接对应"稻草人基线"教训 |
| 11 | `rl-control-case` | RL 控制应用案例 | |

> `multi-agent-rl` 移至 multi-agent 章（去重）；`safe-rl` 移至 safety-ftc 章（归口）。

### 2.14 `multi-agent` 多智能体与分布式控制（10 课，P2）

| # | slug | 标题 | 变化 |
|---|------|------|------|
| 1 | `multi-agent-overview` | 多智能体系统概述 | 引用 `math/graph-theory` |
| 2 | `consensus-control` | 一致性控制 | |
| 3 | `consensus-under-constraints` | **新增**：通信约束下的一致性——时滞、丢包、切换拓扑与事件触发 | 与 `discrete-sampled/event-triggered-control`、`implementation/networked-control` 三方交叉引用 |
| 4 | `formation-control` | 编队控制 | |
| 5 | `distributed-optimization` | 分布式优化：ADMM、对偶上升与收敛性 | 与 `mpc/distributed-mpc` 分工（本课 = 算法，MPC 课 = 应用） |
| 6 | `distributed-estimation` | 分布式估计与卡尔曼一致性滤波 | 引用 estimation 章 |
| 7 | `game-theory-basics` | 博弈论基础与 LQ 博弈 | 引用 `math/game-theory-math` |
| 8 | `multi-agent-rl` | 多智能体 RL | **自 rl-control 移入（解决 P5 去重）** |
| 9 | `swarm-coverage` | **新增**：蜂群、覆盖控制与任务分配 | |
| 10 | `multi-agent-cooperation` | 多智能体协同综合案例 | |

### 2.15 `safety-ftc` 安全、容错与认证控制（8 课，新增，P2）

| # | slug | 标题 |
|---|------|------|
| 1 | `safety-overview` | 控制安全概论：失效模式、危害分析（HAZOP/FMEA）与安全目标 |
| 2 | `control-barrier-functions` | 控制屏障函数 CBF：安全集不变性与 CBF-QP |
| 3 | `reachability-analysis` | 可达性分析与形式化验证（Hamilton–Jacobi 可达性、区间方法、 zonotope） |
| 4 | `fault-detection-isolation` | 故障检测与诊断 FDI：残差生成、观测器组与统计检验 |
| 5 | `fault-tolerant-control` | 容错控制 FTC：被动 / 主动容错与控制重构 |
| 6 | `functional-safety-standards` | 功能安全标准：ISO 26262 / IEC 61508 / DO-178C 的控制视角 |
| 7 | `safe-rl` | 安全强化学习（自 rl-control 移入并扩充：CMDP、拉格朗日法、屏障约束 RL） |
| 8 | `safety-case-study` | 安全综合案例：从危害分析到 CBF 护栏到认证证据的完整链路 |

### 2.16 `applications` 控制应用专题（8 课，新增，P2）

> 制度化 `personas.md` 的轮值领域专家：每课由一位领域专家**主导**（而非客串），把散落在各章案例里的行业知识沉淀成独立课程。

| # | slug | 标题 | 主责轮值专家 |
|---|------|------|-------------|
| 1 | `auto-driving-control` | 自动驾驶纵向与横向控制 | 领域-自动驾驶 |
| 2 | `robotics-control` | 工业机器人与协作机器人控制 | 领域-机器人 |
| 3 | `power-electronics` | 电力电子与并网逆变器控制 | 领域-电力 / 电机驱动 |
| 4 | `process-control` | 化工过程与精馏塔控制 | 领域-化工过程 |
| 5 | `aerospace-attitude` | 航空航天与姿态控制 | 领域-航空航天 |
| 6 | `energy-storage-microgrid` | 新能源、储能与微电网控制 | 领域-新能源（新增） |
| 7 | `biomedical-control` | 生物医学控制：药物输注、假肢与手术机器人 | 领域-生物医学 |
| 8 | `semiconductor-equipment` | 半导体制造装备控制：光刻机双工件台与纳米定位 | 领域-半导体（新增） |

---

## 3. 角色讨论团队升级方案

### 3.1 设计原则

1. **每个新角色对应一类可观测的返工**。新增角色必须由 0.3 的 fix-log 归因数据或已记录的事故支撑，不做人设堆砌。
2. **按课型上场，不全员到会**。当前 Phase 2/3 都写"参与者：全员"，22 人齐上会导致讨论冗长且出现凑数发言。改为"核心常设 4 人 + 按课型选配 3–6 人"，单课实际上场 7–10 人。
3. **否决权要少而硬**。只设 3 个否决点：郑核（质量签发）、柯验（数值三方一致）、何疑（对比公平性）。
4. **沉默是允许的**。无实质贡献的角色在讨论日志中显式标 `[沉默-XXX：<原因>]`，禁止为凑数发言。
5. **清单必须可执行**。每个角色的职责写成可勾选检查项，不写"确保内容高质量"这类空话。

### 3.2 保留的现有角色（14 人，职责边界微调）

| 层 | 角色 | 微调 |
|----|------|------|
| 教授团队 | 陈控、林矩、卫韧、方数 | 改为"主责教授按章匹配"（见 3.6），非主责教授按课型选配 |
| 工程团队 | 周联、何仿、吴规 | 何仿职责收窄为"仿真设计与数据产出"，**不再自审数值正确性**（移交柯验） |
| 教学支持 | 孙助、郑核 | 郑核的"代码可运行性"检查移交秦构，"数值正确性"移交柯验，郑核聚焦签发与跨课一致性 |
| 可视化 | 苏绘 | 职责收窄为"可视化决策与视觉规范"，**组件实现移交秦构** |
| 学生团队 | 小初、李稳、赵工、钱锐 | 保留，新增 2 人见 3.4 |

### 3.3 新增角色（6 人）

#### 柯验 · 数值仲裁工程师

- **对应返工**：fix-014、fix-016、fix-018（3 条，全部是"默认参数 / 换算系数与正文手算例不一致"）
- **身份**：独立数值验证工程师，不参与内容创作，只做对账
- **背景**：计算数学硕士，前量化基金数值库维护者，做过 5 年回归测试与数值一致性审计。对"看起来对但差一个系数"有病态敏感
- **核心检查清单**：
  - [ ] 正文中每一个数值断言，是否有 notebook 复算输出支撑（不允许"算出来的数字"其实是"写出来的数字"）
  - [ ] 交互组件的**默认参数**是否恰好复现正文手算例（fix-014 直接教训：`-1/N` 轨迹起点设为 1.05 导致画不出 `A₀ = 4/(3π) = 0.4244`）
  - [ ] 时间 / 频率换算是否用对 `dt`（fix-016：必须 `T/(len-1)`，不是 `T/steps`）
  - [ ] 有记忆非线性（间隙 / 滞环）的预热末相位是否等于扫描起始相位（fix-018：不等会导致环面积少算 38%）
  - [ ] 单位、有效位数、正负号、实部 / 虚部约定是否全课一致（`describing-function` 重写教训：`N=(a₁+jb₁)/A` 实虚部写反）
  - [ ] 交点 / 极值 / 穿越点的检测算法是否有覆盖性判据（fix-014：只算 Nyquist 穿越点会在无极限环时误报）
- **产物**：Phase 3 强制输出**三方对账表**（见 3.7 M2）
- **口头禅**："这个数是你算出来的，还是你写出来的？"
- **否决权**：**有**。对账表任一行不一致 → 打回 Phase 2
- **与何仿的分工**：何仿设计仿真、产出数据；柯验独立复算、对账。**必须是两个人**，因为何仿自己写的仿真无法自己审计

#### 秦构 · 前端可视化工程师

- **对应返工**：fix-011、fix-013、fix-015、fix-017（4 条，全部是"页面 404/500 或运行时 magic 报错，但本地 harness 查不出"）
- **身份**：前端工程师，负责 React 交互组件、MDX 编译链路与构建流水线
- **背景**：Next.js + TypeScript，做过文档站与可视化组件库。对"本地能跑、线上 404"有肌肉记忆
- **核心检查清单**：
  - [ ] `useECharts` 接受的是 `useMemo` 产生的 `EChartsOption` 对象，**不是 callback**（已记录的 hydration crash：`Cannot read properties of undefined (reading 'get')`）
  - [ ] `animation: false`；`xAxis`/`yAxis` 有显式 `min`/`max`（固定坐标轴）
  - [ ] 组件在 `mdx-components.tsx` 与 `lib/content.ts` **两处都注册**（fix-015；E2 根治后改为校验单一来源）
  - [ ] 组件在 MDX 中用 `<ComponentName />` **显式引用**（已记录教训：实现了注册了但忘了引用，页面不渲染）
  - [ ] MDX 中 JSX 属性之间**无逗号**（fix-013：`setupCode={`...`},` 会导致 next-mdx-remote 编译抛错、页面表现为 404 而非 500）
  - [ ] 多行 display math 的 `$$` **独占开 / 闭行**（fix-012：`$$\begin{aligned}` 同行会被 remark-math 吞首行，其后全文被当成一个数学块以 katex-error 原文渲染）
  - [ ] notebook cell 首行不得以 `%#` 开头；拼接占位符不得含 `%`（fix-017：`%%NBn%%` 被折叠成 `%NBn%`，`#` 注释变 `%#`，IPython 报 line magic UsageError）
  - [ ] 每页 kernel id 全局唯一（fix-011：`useRef` 计数器是每实例的，同页多 notebook 会共用命名空间导致变量互相覆盖）
  - [ ] 执行 M3 的九项硬门槛并粘贴实际输出
- **口头禅**："curl 过课程页了吗？200 才算完。"
- **否决权**：无，但硬门槛未通过时郑核**不得签发**
- **与苏绘 / 何仿的分工**：苏绘决定"用不用交互组件、画什么"；何仿提供"数据与算法正确性"；秦构负责"组件能编译、能渲染、能上线"

#### 何疑 · 红队审稿人

- **对应事故**：`intelligent/fuzzy-control-basics` 的 ABS 稻草人基线（项目记忆已记录：门限逻辑写成每步继电器，湿卵石上比无 ABS 还差，导致整节对比失去说服力；修正为速率型三段逻辑并在三路面扫参后才公平）
- **身份**：怀疑论审稿人，专门攻击论证的公平性
- **背景**：前学术期刊审稿人 + 工业界 A/B 测试负责人。见过太多"新方法赢 30%"其实是基线没调参
- **核心检查清单**（针对一切"A 优于 B"的定量或半定量断言）：
  - [ ] 基线是否在**同一被控对象、同一评价指标**下**独立整定过**？整定方法与参数扫描范围是否记录？
  - [ ] 是否在 ≥3 组参数或 ≥3 个工况下对比？还是只挑了有利的那一个？
  - [ ] 是否诚实报告了 A **输给** B 的场景？（v1.3 课程普遍有"局限性讨论"节，何疑负责核查它不是敷衍）
  - [ ] 指标是否有挑选偏差（只报超调不报稳态误差、只报均值不报方差）？
  - [ ] "超越 PID 5.3%"这类结论的显著性与样本量是否交代？
  - [ ] 是否存在幸存者偏差（只展示调好的随机种子）？
- **口头禅**："你的对手是不是故意没调好？"
- **否决权**：**有**。未经何疑确认基线公平，任何对比结论不得写入正文

#### 陆阅 · 学习体验设计师

- **对应事故**："用户因为没有固化课堂记录要求重写已交付课程"（3 课重写）；以及 P10 第 3 条"无人负责认知负荷"
- **身份**：学习体验与信息架构设计师
- **背景**：教育科技产品出身，做过大规模在线课程的完课率优化。关注认知负荷而非美术
- **核心检查清单**：
  - [ ] 单课 H2 数量是否合理（当前 `nonlinear/phase-plane` 15 个、`feedback-linearization` 14 个，已接近上限；超过 14 需给出理由或拆分）
  - [ ] 阅读节奏：概念 → 手算例 → 代码验证 → 交互探索 的循环是否完整且不冗余
  - [ ] **所有 `📐 本文用到了…` 引用是否指向真实存在的 math 课**（P2 缺口导致大量引用悬空，这是当前最严重的体验缺陷）
  - [ ] 术语与符号在**正文、图示、组件标签**三处是否一致（对照 E4 的术语表与符号表）
  - [ ] 前置依赖是否齐全且顺序正确（对照 catalog 的 `prereq`）
  - [ ] **交付完整性**：讨论日志 / 三方对账表 / 红队放行记录 / 九项硬门槛输出是否齐备（用户重写事故的直接原因）
  - [ ] 读者读到第几屏会遇到第一个"看不懂但没有解释"的点
- **口头禅**："读者读到第几屏会放弃？"
- **否决权**：无，但对"交付完整性"有向郑核提请打回的权力

#### 许史 · 控制史与方法论学者

- **对应缺口**：P7"控制理论史与方法论地图"缺失；P9"缺少跨章横向课程"
- **身份**：控制理论史与方法论学者
- **背景**：科学史博士，研究 20 世纪工程控制论的学派分化。能准确引用 Nyquist(1932)、Bode(1945)、Kalman(1960)、Zames(1981)、Doyle(1982) 的原始语境
- **核心职责**：
  - [ ] 为每课提供"为什么这个方法在那个年代、那个行业出现"的一句话定位（写入引言）
  - [ ] 主责 `introduction` 章 3 课
  - [ ] 揭示**四大派**（频域派 / 状态空间派 / 优化派 / 学习派）的真实分歧与互补关系。当前 `personas.md` 只写了"陈控 vs 林矩 良性辩论"，太单薄
  - [ ] **史料准确性**：所有年代、人名、出处必须可核查，禁止编造（郑核协查；许史的发言若含无法核实的史料，郑核有权删除）
- **口头禅**："这个方法当年是为了解决什么工程麻烦？"
- **否决权**：无

#### 范安 · 功能安全与标准工程师

- **对应缺口**：P7 的 CBF / 可达性 / FDI / FTC / 功能安全标准全部缺失
- **身份**：功能安全工程师
- **背景**：汽车功能安全（ISO 26262 ASIL D）+ 工业过程安全（IEC 61508 SIL 3）双认证经验，做过量产项目的安全案例（Safety Case）
- **核心职责**：
  - [ ] 主责 `safety-ftc` 章 8 课
  - [ ] 为所有工程案例课补充"这个控制器失效会怎样、需要什么等级的保护"
  - [ ] 审查课程是否给出了**不切实际的安全承诺**（例如宣称某 RL 控制器"安全"却无形式化保证）
  - [ ] 在 `rl-control/rl-analysis-validation`、`implementation/realtime-control`、`applications/*` 中提供认证约束视角
- **口头禅**："这条结论能写进安全案例吗？"
- **否决权**：无，但对 `safety-ftc` 章有内容主责权

### 3.4 学生团队扩充（4 → 6 人）

| 角色 | 姓名 | 背景 | 说明 |
|------|------|------|------|
| 入门学生 | 小初 | 大三自动化 | 保留 |
| 进阶学生 | 李稳 | 研一控制 | 保留 |
| 工程师学生 | 赵工 | 5 年在职自动化工程师 | 保留 |
| 天才学生 | 钱锐 | 博三，数学本科出身 | 保留 |
| **跨专业学生** | **林码** | **CS 硕士，熟练 PyTorch，控制理论零基础** | rl-control（11 课）、intelligent（8 课）、multi-agent（10 课）共 29 课的主力读者。他会问"这不就是带约束的 policy gradient 吗，为什么要搞 Lyapunov""reward shaping 和 LQR 的 Q 矩阵加权有什么区别"——这个张力目前无人代表 |
| **自学转行者** | **岳自** | **只有高中数学 + 一点 Python，无大学数学** | math 章 16 课**每课必到**，是"假设读者只有高中数学水平"这条规则的唯一真实检验者。小初（大三自动化，已修完微积分 / 线代 / 概率）无法承担这个角色 |

### 3.5 轮值领域专家扩充（7 → 14 类）

**保留**：化工过程控制、自动驾驶、航空航天、机器人控制、电力系统、电机驱动、生物医学。

**新增 7 类**：

| 领域 | 适用章节 | 专家画像 |
|------|---------|---------|
| 新能源与储能 | applications、implementation | 光伏逆变器、电池管理 BMS、微电网能量管理 |
| 半导体制造装备 | applications、implementation | 光刻机双工件台、纳米定位、真空 / 温控、超精密运动控制 |
| 暖通与楼宇自控 | applications、mpc | HVAC、建筑热惯性、经济 MPC、舒适度约束 |
| 船舶与水下机器人 | applications、nonlinear | 水面 / 水下航行器、欠驱动系统、洋流扰动 |
| 过程安全与化工装置 | safety-ftc、robust | SIS 安全仪表系统、SIL 定级、联锁逻辑 |
| 农业与温室 | applications、intelligent | 精准农业、温室环境控制、农机自动驾驶 |
| 量化金融与供应链 | multi-agent、mpc | 库存控制、多主体博弈、随机需求下的决策 |

### 3.6 课型 → 上场角色矩阵

在 `catalog.ts` 的 `LessonMeta.type` 中声明课型（A2 条目落地），按下表决定上场角色。

**核心常设 4 人（每课必到）**：郑核（主持 / 签发）、苏绘（可视化决策）、孙助（习题与翻译）、柯验（数值对账）。

| 课型 `type` | 追加角色 | 典型课程 |
|------------|---------|---------|
| `math` 数学基础 | 方数（主责）、**岳自**、小初、陆阅 | math 全 16 课 |
| `theory` 理论推导 | 主责教授、林矩、钱锐、李稳、何疑 | `lyapunov-modern`、`iss-small-gain`、`mu-analysis` |
| `impl` 工程实现 | **秦构**、周联、何仿、赵工、林码 | implementation 全 10 课、discrete-sampled |
| `case` 综合案例 | 吴规、轮值领域专家、赵工、范安、**何疑** | 各章 `*-case-study`、applications 全 8 课 |
| `frontier` 前沿 | 钱锐、林码、轮值领域专家、许史、何疑 | `bifurcation-chaos`、`economic-mpc`、`rl-analysis-validation` |
| `learning` 学习类 | **林码**、钱锐、何疑、何仿、赵工 | rl-control 11 课、intelligent 第 4–8 课 |
| `history` 方法论 | **许史**（主责）、陈控、林矩、李稳、陆阅 | introduction 全 3 课 |

**主责教授按章匹配**：

| 章 | 主责 |
|----|------|
| classic | 陈控 |
| modern、estimation | 林矩 |
| robust、nonlinear、safety-ftc | 卫韧 |
| math、identification、mpc | 方数（mpc / identification 由方数主责优化与统计基础，卫韧协查鲁棒性） |
| introduction | 许史 |
| rl-control、intelligent | 林矩 + 钱锐联合 |
| implementation、discrete-sampled | 周联主责（工程侧）+ 林矩协查（理论侧） |
| multi-agent | 林矩 + 方数联合 |
| applications | 轮值领域专家 |

### 3.7 机制改进（5 项）

#### M1 · 发言配额与沉默机制

- Phase 2 每角色每轮**最多 3 条**发言，超出必须合并为一条
- 无实质贡献的角色显式标 `[沉默-<角色>：<原因>]` 写入讨论日志的出席表。示例：`[沉默-范安：本课无安全相关内容]`、`[沉默-许史：本课无历史脉络可补充]`、`[沉默-吴规：本课不涉及上游规划接口]`
- **禁止的发言类型**："我同意 XX 的观点""这个很重要""说得对"等无信息发言。改写示例：
  - ✗ `[小初] 我觉得这段讲得很好。`
  - ✓ `[小初] 第 3 节从传递函数跳到状态空间时，没说清"状态"到底选哪几个变量。我第一遍以为是随便选的。`

#### M2 · 数值三方对账（Phase 3 强制产物，柯验执行）

对账表必须原样写入讨论日志附录，并注明"这是全部实测数据的唯一留存副本"（参照 `nonlinear-characteristics` 讨论日志附录 A 的做法）：

```
| # | 正文断言            | notebook 输出 | 组件默认值读数 | 一致? |
|---|--------------------|--------------|--------------|------|
| 1 | A₀ = 4/(3π) = 0.4244 | 0.42441      | 0.4244       | ✅   |
| 2 | 极限环周期 T = 6.381 s | 6.380664   | 6.381        | ✅   |
| 3 | 间隙环面积 = 4cA = 0.84 | 0.839999  | 0.840        | ✅   |
```

> **B5 更正（2026-09-26；plan 冻结，故只加批注不回改）**：上面三行示例的数值列有误——第 1 行组件读数实测是 **0.4241**（不是 0.4244）、notebook 实测是时域基波 **0.445089**（0.42441 是手算值的四舍五入，两路里都不存在）；第 2 行**两个数值列写反了**（6.380664 是组件、notebook 是 6.380676，而 6.381 谁都不是，渐近式值是 6.381360）；第 3 行把**滞环**的 4cA 与**间隙**的 0.84 混成一行，而正文从未断言过 0.84（它应进 A.2 而非 A.1）。按实测填好的版本见 `SKILL.md`《数值三方对账》§2，逐行核对见 B5 的完成补记 ①。

**对账范围**：正文中出现的每一个数值断言——手算结果、仿真读数、性能指标、极限环幅值与周期、稳态误差、超调量、增益 / 相位裕度、收敛时间、RMSE。

任一行不一致 → 打回 Phase 2，禁止进入 Phase 4。

**"叙述服从测量"操作细则**：测量与预期不符时，只允许 ① 改叙述，或 ② 改实验设计（含重新整定基线），**不允许改数据**。
- 正例：`adaptive-control-basics` 讨论日志含 18 条"叙述服从测量"修正——正文原写"γ 越大收敛越快"，实测显示 γ 过大导致振荡发散，遂改写为"γ 存在上界，过大时闭环失稳"。
- 反例：把组件读数改成和正文一致（即篡改测量以迁就叙述），属严重违规，郑核必须打回。

> **B5 批注（2026-09-26）· 正例的归因需修正**：γ 那段叙述确实测量驱动、确实在正文里（`adaptive-control-basics.mdx:29` / `:2039` / `:2666`），**但它不在日志附录 B 那 18 条编号修正之中**——它属「一开始就按实测写、从未被推翻」，不是「写完后被测量改正」。`SKILL.md`《数值三方对账》§6 已拆为**正例 A**（γ，附三处 file:line）与**正例 B**（从 18 条里取 #8 编造/算错的三个数、#9 旧稿低估自己的实验、#10 实验根本没做过、#16 噪声标定的方法论级 bug）。另：对账范围实测已扩为**九类逐项可勾选**并显式包含习题与答案，见 personas.md 柯验条目 C 组。

#### M3 · 前端交付硬门槛（Phase 4 强制清单，秦构执行）

```
- [ ] npm run build 通过
- [ ] curl 课程页 → HTTP 200
- [ ] 页面 H2 数 == catalog.ts 该课 subsections 数
- [ ] katex-error 元素数 == 0
- [ ] MDX 中每个 JupyterNotebook 的 cell 字符串与验证脚本中的 cell 逐字全等
- [ ] 新增组件已在 mdx-components.tsx 与 lib/content.ts 两处注册（E2 后为单一来源）
- [ ] 新增组件已在 MDX 中用 <ComponentName /> 显式引用
- [ ] 每个交互组件：固定坐标轴 ✅ / animation: false ✅ / useECharts 收到 Option 对象 ✅ / 默认参数复现正文手算例 ✅
- [ ] notebook 中无 ipywidgets / interact / FloatSlider / IntSlider 引用
```

清单任一项未通过 → 郑核不得签发，`delivery-tracker.md` 不得打勾。

> **元规则**：本清单每新增一项，必须同时新增一个能自动执行它的脚本或命令（归入 E1 的 `verify-lesson.mjs`）；无法自动化的项必须写明人工检查步骤与判定标准。

> **B6 批注（2026-09-26）· 九项已逐字落地，其中三项的自动化程度与清单原本的设想不同**：这九行已**逐字**写入 `wiki-discussion/SKILL.md`《前端交付硬门槛（B6 起）》§1 与 `v1.3-refactor/SKILL.md` Step 2e（全仓恰好两份，三方 `diff` 实测 `THREE-WAY SAME`，整块 100 行 `FULL BLOCK BYTE-IDENTICAL`），每项下挂执行方式与 fix-log 编号。落地时实测出三点需要 E1 注意：① **第 6 项已经自动化**（A7 的 `check-catalog.mjs` 把双注册表不同步报成 FAIL），但**第 7 项只有 WARN**——因为 Q3 的孤儿组件 `bode-margins-explorer.tsx` 长期在册，WARN 不能阻断签发，所以第 7 项必须按课 `grep -c`；② **第 3 项不能靠 `npm run check`**：它的 §6 用 `mdxH2Titles()` 扫的是 **MDX 源文件**，而 fix-012 的实测是源码 12 个 H2、DOM 只渲染出 2 个，故第 3 项必须在 `curl` 回来的 HTML 上量（`grep -oE "<h2[ >]"`）；③ **第 5 项与第 8 项子项 4 目前没有可运行的工具**——`nc-verify.py` 与 `nc-explorer-check.mjs` 都已不在仓库（`.agent/` 下 0 个 `.mjs`、0 个 `.py`），E1 的 `verify-lesson.mjs` 必须把这两项一并实现，否则它们在纸面上存在、在实践里空转。另：第 5 项**抓不到 fix-017 的原形态**（拼接脚本同时污染 MDX 与验证脚本时两边仍全等，当时 `9/9 ALL MATCH` 而 bug 照样上线），必须叠加秦构人设里「cell 首行不得 `%#` / 占位符不得含 `%」与浏览器真实执行两条，详见权威副本 §5。

#### M4 · 红队否决（Phase 3 强制关卡，何疑执行）

对任何形如"A 优于 B""A 比 B 快 X%""A 更鲁棒"的断言（**包括交互组件与 notebook 输出的对比图**）行使否决。放行三条件：

1. 基线在**同一被控对象、同一评价指标**下独立整定过，并记录整定方法与参数扫描范围
2. 至少在 **3 组参数或 3 个工况**下对比，全部结果（含 A 输的场景）写入讨论日志附录
3. 正文诚实列出 A 不如 B 的场景与适用边界

任一条件不满足 → 结论不得写入正文。

> **B7 批注（2026-09-26）· M4 已逐字落地，且落地时实测出一处跨课矛盾（Q23）**：这三条已**逐字**写入 `wiki-discussion/SKILL.md`《定量对比红队审查（B7 起）》§2（每条附判据与「为什么」），并配 §1 适用范围（含 Prompt 任务 2 要求的「对比图本身也是断言」与跨课继承）、§3 三种合法放行 vs 五类不放行、§4 ABS 反面案例、§5 `adaptive-control-basics` 正面案例、§6 七类论证缺陷（含 B2 登记、B7 补的第 7 条「基线是否有代表性」）、§7 不放行的三种处置、§8 与既有实践关系；Phase 3 何疑改写为独立步骤 1→5、Phase 4 第 5 步补「何疑放行」四条操作定义、附录 C 骨架升级为 6 列放行表、《讨论日志固定结构》§4 追加第 14–16 条机器口径；personas.md 何疑清单 6 → 12 条分 A/B/C 三组。落地时实测出两点：① **正面案例本身只部分满足条件 a**——`adaptive-control-basics` 的四方对比达标 b（四组同台、含己方落败约 12 个数量级）与 c（`:2604` 选择建议与边界），但「固定增益（海平面整定）」基线的整定方法与扫描范围没写进正文，故 §5 诚实标注为「a 待补」的范本、不吹成满分样板（与 B5「正例归因不精确」、B4「附录 A 参照错」同族）。② **Q23（新发现，待裁决）：`fuzzy-control-basics` 与 `fuzzy-controller-design` 对同一台倒立摆的 Mamdani 5×5 给出相差 6.0 倍的 rms**——上一课实测 **3.5118°**（`content/intelligent/fuzzy-control-basics.mdx:2739`），下一课头图断言「n=5 Mamdani 模糊 PD 最优参数下 ≈ **21°**」（`content/intelligent/fuzzy-controller-design.mdx:12`）并被 `neural-network-control.mdx:27` 继承；后者前提「上一课所有实验都是开环的」（`:10`）与上一课正文含闭环 rms 表直接矛盾；且 21° 是**默认参数点**、该课自己 $G_e$ 扫描的最优是 **13.71°**，头图却写「最优参数下」。这是**跨课传播的未放行断言**（红队 §1 第 3 类）。B7 不改任何 MDX（超出「只改两个技能文件」范围），仅写成何疑清单 C 组的 `intelligent-case-study` 专项核查条 + 登记 Q23；裁定谁对需重跑两课 notebook（柯验 + 何仿的活）。候选：(a) 触发何疑时以 Q21 + Q23 为头两个案例走三条件、按实测改写两课头图（**推荐**——与 ABS 返工同型）；(b) 仅在两课头图加「默认参数点，非扫描最优」限定；(c) 等 `intelligent` 章 A6 重排时一并处理。另更正 B6 遗漏的两处前向指针（秦构行「M3，由 B6 写入」、Phase 3 引用块「本节尚未完整（B6–B7 待写入）」）为过去式。

#### M5 · fix-log 角色归因（持续改进闭环）

`.agent/fix-logs/*.md` 模板新增三个字段：

```
归因角色：<本该拦住它但没有的角色>
拦截缺口：<该角色的检查清单里缺了哪一条>
清单更新：<已写入 SKILL.md / personas.md 的具体条目；若未写入则填"待补">
```

**回顾机制**：每学期末统计归因分布。若某角色连续 3 条未拦住同类问题 → 必须修改该角色的检查清单或拆分其职责，并把修改记录写入 `fix-tracker/SKILL.md`。

> **B8 批注（2026-09-26）· M5 已逐字落地，§3.7 的 M1–M5 至此全部完成**：上面三行字段已**逐字**写入 `fix-tracker/SKILL.md`《单条修复记录格式》新增的 `## 角色归因（B8 起必填）`（`:91`–`:95`），并配《三个归因字段的写法要求》——归因角色只能取 `personas.md` 的 22 人具名池、**不含 14 类轮值专家**（轮值专家是领域知识来源、不持有检查清单，因此无法成为「拦截缺口」的归属）；拦截缺口必须能直接变成一个 `- [ ]` 勾选项，「没注意到」「不够仔细」不算缺口；清单更新必须给出「文件 + 节名 + 条目号」的落点，填「待补」合法但学期末必须清零。回顾机制落地为《归因回顾机制（B8 起）》整节（`:146`–`:224`）：§1 五列回顾表（Prompt 任务 3 点名的五列逐字照抄）；§2 三条**可判定**触发条件——T1 = 同一角色**连续 3 条同类** → 必须改清单或拆职责并把修改记录写进本文件，附三条操作定义（同一角色按**主责**计、协查不计入连续计数，否则「苏绘+何仿」双归因会同时撑大两人；「连续」按 INDEX 的 `#` **序号连续**、不看日期；「同类」= §4 登记的同一归因类别，新类别须先登记再使用），并明写**「累计 3 条」不触发**，否则凡是前端课都在场的秦构会被反复误判；T2 = 整学期零拦截 → 人设无效、应删除或改造（对应 §5.3 最后一项与风险表「纸面角色」那一行）；T3 = 学期末 `清单更新：待补` 必须为 **0**，否则该 fix 条目不得关闭。§3 第一次归因回顾的结果与 Prompt 任务 3 要求一致（秦构 4 / 柯验 3 均「角色尚未设立」→ B1 已设立，且两人清单是**照着这 7 条逐条写的**；苏绘+何仿 11 属「清单缺项」→ v1.3 三条设计规范补齐），另加一行「零拦截名单」（其余 18 名具名角色 0 条）并说明 **T2 的首次判定须等 C 或 D 阶段做完至少一章**——B1 的 6 个新角色到 B8 时点只经历了改文档、没机会拦截任何东西，故 B8 不触发 T2。
>
> **落地时实测出四点，每一点都改变了做法**：① **本节要扩写的那个模板只被 2/14 篇遵守（14%）**——实测 9 篇用英文节名（`# Fix Log NNN - 标题` + `Problem`/`Root Cause`/`Fix`/`Verification`/`Rule`）、3 篇用正负案例变体。三字段若只加在模板里，就是重演 B6 实测出的「在纸面上存在、在实践里空转」。故 SKILL.md 新增《既有 14 篇详情文件的格式实测（B8）》，给三种格式各定落点（A → `## 角色归因（B8 起必填）`；B → `## Attribution`；C → `## 归因`），并硬性要求**三行字段名在任何格式下都保持中文**——字段名是本节逐字规定的，翻译掉会让跨文件 `grep 归因角色` 漏掉英文节名那 9 篇。既有 14 篇**不回填**（与 B4「既有 11 篇讨论日志不回填」同型，且改 14 篇超出 B8 的两文件范围），18 条的归因由 INDEX.md 新列 + §4 类别级明细表承载。② **主流格式根本没有承载用户原话的位置**：`用户原话`/`用户反馈`/`用户指出` 实测只出现在 002、003 两篇（2/14），而该技能《概述》第一句就是「记录用户提出的反馈」——主流格式把技能存在的理由丢了。已在模板 `## 问题（负案例）` 下补 `**用户原话**：` 必填行，同时允许写「无用户原话 + 触发来源」（fix-011/015/017 是构建或浏览器实测抓到的，本来没有用户原话，逼着编一句反而造假）。③ **§0.3 的「18 条」少计 2 条**：`useECharts` hydration 崩溃与「组件注册了但正文没引用」在 `.agent/fix-logs/` 里 0 命中（grep `hydration` / `Cannot read properties of undefined` / `显式引用` / `忘了引用`），B6 批注也点过这两条只存在于项目记忆里。已在 §5 预登为 **019 / 020**（归因均秦构，清单更新分别指向《前端交付硬门槛（B6 起）》§1 第 5 项的 `useMemo<EChartsOption>` 判据与第 7 项「MDX 显式引用」，后者 `npm run check` 只 WARN、须按课 `grep -c`）；按 20 条算，真空区是 **9/20 = 45%** 而不是 7/18 = 39%。**§0.3 不改**（Q13 起冻结，且 39% 是 B1 设立验证层的唯一量化依据、被 `personas.md` 与三份项目记忆引用），更正只记在 §5 与本批注；补建 019/020 两个详情文件并追加两行 INDEX 是 B8 的**遗留项**。④ **Q24（新发现，待裁决）**：§0.3 把 fix-012 归入「交互组件设计规范（坐标轴 / 动画 / ipywidgets）」→ 苏绘+何仿，但 **B6 已把 fix-012 的检查项写进秦构的清单**（《前端交付硬门槛》§5 四条之一）；012 的实际成因是 remark-math 的 `$$` 独占行要求，与那三条都无关，按 §4 的类别定义应属「前端 / 构建 / MDX 工程」→ 秦构。改归会让真空区变 8/18 = 44%，牵连已冻结的 plan + `personas.md` + 三份记忆。**B8 自行裁定（用户预先授权自行决策，可否决）**：INDEX.md 与 §3 按 §0.3 原口径回填、012 单元格标 `※Q24`、39% 不动，冲突登记在 §6。候选：(a) 维持 §0.3，012 双归因（苏绘+何仿 名义、秦构 实际持有检查项），Q24 关闭为「已解释」（**推荐**）；(b) 改归秦构并同步 39% → 44%（须解冻 plan、改 `personas.md` 与三份记忆）；(c) 等 E1 的 `scripts/verify-lesson.mjs` 落地后由脚本判定归属（脚本只认检查项落在谁的清单里，天然是秦构）。
>
> **顺手更正 `fix-tracker/SKILL.md` 自身五处陈旧或自相矛盾内容**（同一文件内，沿用 B5/B6/B7 既有惯例）：① 「SKILL.md：技能定义（不变）」「极少变动」→ 自 B8 起本文件是归因口径的**权威副本**，该说法作废；② 摘要长度《文件架构》注释写「≤120字」、《记录格式》写「≤80字」→ 统一 **≤120**（实测 18 条中 13 条超 80、8 条超 120，超出的 8 条属存量债务、不回改）；③ 工作流第 1 步「当天最大序号 +1」→「全表最大 `#` 加 1」，按原句在 2026-09-24 会算出 001 并与 `2026-09-22-001.md` **撞名**；④ 第 4 步「顶部插入（最新在前）」与实况相反（既有 18 条实测**正序**，001 在顶、018 在底）→ 改「底部追加」；⑤ `类型` 枚举只声明了 `NEG`/`POS`/`BOTH`，而实测 18 条里 `BUG` 13 条、`BOTH` 5 条——**72% 的数据在用未声明的枚举值**，故把 `BUG` 予以**追认**（不改 13 行数据）。另在《注意事项》把 4 条扩到 8 条，首条即 Prompt 任务 4 的闸门：**三字段缺任一项 → 郑核不得关闭该 fix 条目**，郑核只核三件事（字段是否填全、归因角色是否在 22 人池里、清单更新是否给了可核查落点），不重算数值、不重跑对比。
>
> **验收**：① 模板含 3 个新字段——与本节三行逐字比对，`SKILL.md:93`–`:95` 全等 ✓；② INDEX.md 现有 18 条完成回填——新列插在 `类型` 与 `摘要` 之间，表头与分隔行同为 7 列，脚本实测 18/18 行各含 8 个未转义 `|`（018 行的 `max\|y-u\|` 转义与全表正序均保留），分布 = 秦构 4 / 柯验 3 / 苏绘+何仿 11（含 012 的 `※Q24`），表下补《归因角色列说明》定义三种标记 ✓；③ 回顾机制含明确触发条件——T1/T2/T3 + 三条操作定义 + 「不得触发的情形」✓。**只改两个文件**（mtime 实证：`fix-tracker/SKILL.md` **09:09**、`fix-logs/INDEX.md` **09:18**；B6/B7 时段的 07:45 / 08:30 / 08:35 与 B7 收尾的 08:40 / 08:55 都早于本窗口，`semester-02-plan.md` 与 `delivery-tracker.md` 的事后编辑是既定惯例例外）。`npm run check` = PASS 17 · WARN 36 · FAIL 0、退出码 0，唯一权威统计与 A1→B7 逐字一致（该脚本不解析 `.agent/fix-logs/`，本次表头改列不可能影响门槛，但仍照跑）。行数（`wc -l`，**全部编辑完成后复测**）：SKILL.md 118 → **251**、INDEX.md 22 → **37**。渲染实测（micromark + gfm，与 remark 同族解析器）：SKILL.md 围栏外 5 张表 → 5 个 `<table>`、INDEX.md 2 → 2，围栏外 stray `**` = 0；顺带推翻一条口头惯例——`` **`#`** `` 这类「粗体包行内码」实测渲染为 `<strong><code>#</code></strong>`，此前担心的 flanking 失效**不成立**（按 B5「叙述服从测量」，照实测写而不照推测改）。
>
> **B 阶段 B1–B8 全部完成**，§3.7 五个机制齐备：M1 发言纪律与日志固定结构（B4）、M2 数值三方对账（B5）、M3 九项前端交付硬门槛（B6）、M4 定量对比红队放行三条件（B7）、M5 fix-log 归因三字段与回顾机制（B8）。下一步按 §4 的顺序进入 E（质量基建）或 C/D（存量偿债 / 新内容生产）；§5.3 最后一项「B8 归因回顾」现已有可执行的表格式与触发条件，学期末照《归因回顾机制》§1 追加 `### 第 2 学期归因回顾` 小节即可。

### 3.8 升级后团队全貌（22 人 + 14 类轮值）

| 层 | 角色 | 人数 |
|----|------|------|
| 教授团队 | 陈控、林矩、卫韧、方数 | 4 |
| 工程团队 | 周联、何仿、吴规 | 3 |
| **验证团队（新）** | **柯验**（数值仲裁）、**秦构**（前端工程）、**何疑**（红队） | **3** |
| **体验与脉络（新）** | **陆阅**（学习体验）、**许史**（控制史与方法论）、**范安**（功能安全） | **3** |
| 教学支持 | 孙助、郑核 | 2 |
| 可视化 | 苏绘 | 1 |
| 学生团队 | 小初、李稳、赵工、钱锐、**林码**、**岳自** | 6 |
| **合计（不含轮值）** | | **22** |
| 轮值领域专家 | 14 类，按课匹配 | 按需 |

> **22 人是候选池，不是到会人数。** 按 3.6 的矩阵，单课实际上场 7–10 人，比当前的"14 人全员"更精简且更专业。

---

## 4. 执行计划与推荐 Prompt

> **使用说明**
> - 每个条目都是一个可独立执行的工作包，推荐在**新会话**中粘贴其 Prompt 执行。
> - Prompt 已尽量自包含，但执行者仍应先读 `.agent/skills/wiki-discussion/SKILL.md` 与 `.agent/fix-logs/INDEX.md`。
> - **推荐执行顺序**：A（结构治理）→ B（角色升级）→ E（质量基建）→ C（存量偿债）/ D（新内容生产）。
>   A/B/E 是"降低后续每课返工率"的基建，先做完能让 C/D 的每课成本下降；C 与 D 之间无强依赖，可交错。
> - 所有 Prompt 默认要求：**只改本条目声明的文件**；完成后更新 `.agent/delivery-tracker.md` 与本文件的勾选状态；删除本次产生的临时脚本与中间产物。
> - 涉及课程内容的条目一律走 `wiki-discussion` 技能的 Phase 1–4，不得跳过讨论直接写内容（这是项目的既有硬规则）。

---

### 阶段 A · 结构治理（不动课程正文，只动目录与元数据）

- [x] **A1 · 固化结构诊断报告**（2026-09-25 完成，产出 `docs/semester-02/01-structure-diagnosis.md`；实测更正方案 4 处数字/行号，新增 15 项发现。报告第 8 节的 Q1/Q2 已裁决并执行：`catalog.ts` 恢复 HEAD 并对齐 robust 两课，源文件维度门槛 56/56 通过。执行中新增 3 项实测发现待裁决——**Q5**：27 门课 92 个侧栏锚点是死链（`sub.slug` 手写未经 github-slugger 规范化，`H∞`→`h-`、`μ` 被删除等规则只能实测）；**Q6**：`mpc-principle` 与 `receding-horizon` 因 `$$\boxed{\begin{aligned}` 写在同一行触发 KaTeX ParseError，正文被截断到只剩 1/8 与 2/11 但 HTTP 仍 200；**Q7**：`npm run build` 在 HEAD 上就失败，12 个 ESLint error 集中在最近一次提交 `dd1b29f` 的 4 个组件里）
  - 做什么：把本文件第 0、1 节的结论连同文件行级证据整理成独立诊断报告存档，供后续每次结构调整回溯"当初为什么这么改"
  - 产出：`docs/semester-02/01-structure-diagnosis.md`
  - 验收：每条问题都有 `catalog.ts` 行号或文件路径证据；推测性表述单独归类；独立统计结果与 tracker 声明数字并列对比

  **推荐 Prompt：**
  ```
  阅读 D:/Workspace/control-universe/.agent/semester-02-plan.md 的第 0 节和第 1 节，
  以及 content/catalog.ts、.agent/delivery-tracker.md、.agent/fix-logs/INDEX.md、
  OUTLINE.md、docs/discuss-log/ 目录结构。

  任务：把所有结构诊断结论固化为独立报告 docs/semester-02/01-structure-diagnosis.md。

  要求：
  1. 每条问题必须附可核查证据（catalog.ts 行号、文件路径、或统计脚本输出）。
     凡是无法用现有文件证实的判断，标注为"推测"并单独归到一节。
  2. 重新独立统计并核对以下数字，把统计结果与 delivery-tracker.md 底部的声明数字
     并列，明确写出差异：
       - catalog.ts 的章节数与课程数
       - content/**/*.mdx 的实际文件数
       - delivery-tracker.md 中 [x] 与 [ ] 的计数
       - components/wiki/*-explorer.tsx 的数量
       - docs/discuss-log/ 下讨论日志篇数，以及"已写 MDX 但无讨论日志"的课程清单
  3. 输出一张"重叠矩阵"：列出所有跨课/跨章重复的小节标题与课程主题（含 P1 的
     computer-control vs discrete 五组撞车、P4 的八处章内重复、P5 的跨章重复 slug），
     标明建议处置（合并 / 拆分 / 改名 / 一处主讲+一处引用）。
  4. 输出一张"依赖倒置清单"：列出所有"前置知识排在后续课程之后"的情况，含 P3 的
     三处章级倒置与 P4 的两处课级倒置。
  5. 不要修改 catalog.ts、delivery-tracker.md、OUTLINE.md 或任何 content/ 下的文件。
     本次只新建 docs/semester-02/01-structure-diagnosis.md。
  6. 完成后在 .agent/semester-02-plan.md 中把 A1 的 [ ] 改为 [x]。
  ```

- [x] **A2 · catalog.ts 数据模型升级**（2026-09-25 完成。`LessonMeta` 增 `prereq?`/`level?`/`type?`/`status?`，`Chapter` 增 `order?`，全部可选 + 字面量联合约束；净 +9 行插入 / 0 删除，925 → 934 行，未动任何 slug/title/subsections、未调整顺序。开工前经用户裁决两项 Prompt 自身的问题：**Q8** 第 1 步的必填 `order: number` 与验收条款"全部可选"矛盾 → 定为可选且不填数据（A3/A5 会重排章节，现在填的 0..10 立刻作废）；**Q9** 验收门槛 `npm run build 通过` 在 HEAD 上已因 Q7 的 12 个 ESLint error 是红的 → 改验 `npx tsc --noEmit`（退出码 0）+ curl 三页（`classic/time-domain-analysis` 200/h2=11、`nonlinear/phase-plane` 200/h2=15、`intelligent/fuzzy-control-basics` 200/h2=12，错误标记 0），build 转绿仍挂在 Q7。实测补充：Prompt 的"涉及文件"漏列了 `components/wiki/sidebar.tsx`（第 3 个 catalog 消费方），`lib/content.ts` 其实不 import catalog 但自带一个**同名不同义**的 `LessonMeta`。执行中遇到 **N16**：`.next` 缓存损坏导致三页全部 500（`Cannot find module './vendor-chunks/@base-ui.js'`），经定向 stash 归因证明与本次改动无关，已 `rm -rf .next` + 重启修复——详见诊断报告 9.6。**Q5 未在本条目内处理**，仍待裁决。）
  - 做什么：为 `Chapter` 与 `LessonMeta` 增加 `order`、`prereq`、`level`、`type`、`status` 字段，为角色矩阵（3.6）与依赖校验（A8）提供数据基础
  - 涉及文件：`content/catalog.ts`、`lib/content.ts`、`app/(wiki)/[chapter]/[lesson]/page.tsx`、`app/(wiki)/page.tsx`
  - 验收：`npm run build` 通过；已有课程页 curl 200；新字段有 TS 类型约束且全部可选

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe（Next.js 14 App Router + MDX 课程 wiki）。
  先读 .agent/semester-02-plan.md 的 P6 与 3.6 节，以及 content/catalog.ts 全文。

  任务：升级 content/catalog.ts 的数据模型，为每章每课增加结构化元数据。

  1. Chapter 接口增加 order: number（章序号，0 起）。
  2. LessonMeta 接口增加以下可选字段：
     - prereq?: string[]   // 形如 "math/laplace-transform" 的依赖课程路径
     - level?: "undergrad" | "grad" | "advanced"
     - type?: "math" | "theory" | "impl" | "case" | "frontier" | "learning" | "history"
     - status?: "empty" | "draft" | "v1.3"   // 语义与 delivery-tracker 对齐
  3. 只添加字段与类型定义，**不要改动任何已有的 slug / title / subsections**，也不要
     调整章节顺序或课程顺序。数据填充留给 A3–A6 各条目。
  4. 检查 lib/content.ts、app/(wiki)/page.tsx、app/(wiki)/[chapter]/[lesson]/page.tsx
     是否需要同步适配。新字段全部可选，理论上不需要，但要实际确认类型没有报错。
  5. 验收：npm run build 通过；随机 curl 3 个已有课程页（如 classic/time-domain-analysis、
     nonlinear/phase-plane、intelligent/fuzzy-control-basics）返回 200。
  6. 完成后勾上 .agent/semester-02-plan.md 的 A2。

  环境注意：Windows；若 Tailwind 类不生效请用 inline style 兜底；若 .next 缓存异常，
  rm -rf .next 后重启 dev server（端口 8080，node scripts/serve.mjs）。
  ```

- [x] **A3 · 合并重组 computer-control + discrete → discrete-sampled + implementation**（2026-09-25 完成。前置 **Q10** 裁决：先单独修 Q7 再执行 A3——Q7 已作为独立改动交付（4 组件 12 个 ESLint error 清零、`tsc --noEmit` 与 `next lint` 退出码 0、`npm run build` 转绿 89/89 页），与 A3 的 diff 完全分离。**Q11**：迁移课用 §2.7/§2.8 新 slug 但**保留旧标题**（frontmatter title 与 H1 不动，catalog title 同步保留旧名，改名留到阶段 C 拆分时）；**Q12**：11 章 `order` 全填 0..10（按数组序）；**Q13**：`semester-02-plan.md` 与 `docs/semester-02/01-structure-diagnosis.md` 冻结，只改活引用（delivery-tracker、v1.3-refactor-plan）。执行结果：8 门 MDX `git mv`（5 → discrete-sampled、3 → implementation），`content/discrete/` 本就不存在（第 5 步空操作）、`content/computer-control/` 迁空后删除；23 处站内链接按映射重写（10 文件 14 行，含 mpc/intelligent 三行跨章链接——仅改链接目标、未动技术内容），迁移文件 diff 逐行核对**全部为链接行**；catalog 删除 computer-control 与 discrete 两章、插入两新章共 20 课（12 课骨架 status=empty、8 课迁移 status=draft），subsections 原样保留，总量 11 章 / 88 课 / 616 小节 / 56 门有 subsections 与迁移前一致；prereq 边 36 条全部指向存在的课（原写 41 条，A4 复核实测为 discrete-sampled 15 + implementation 21 = 36）。验收：`npm run build` 退出码 0（93/93 页）；8 门迁移课 200 且 H2==subsections（11/9/7/9/8/8/9/9）、katex-error=0；旧路由 404；首页与侧栏渲染两个新章。**Q14（新发现，待裁决）**：全仓死链扫描发现 6 处**迁移前就存在**的死链，与 A3 无关且落在禁止改动的章内，故未修——`classic/classic-case-study.mdx` 3 处 `/classic/pid-control`（应为 pid-controller）、`classic/compensator-design.mdx` 2 处死锚点（`/classic/frequency-response#工程应用ziegler-nichols-整定法`、`/classic/pid-controller#微分项的噪声问题`）、`nonlinear/feedback-linearization.mdx` 1 处 `/math/linear-algebra`（目标课要等 A4 建 math 章）。"全仓无失效链接"对迁移引入的链接成立（0 死链），对这 6 处历史死链不成立。另：迁移课的侧栏死锚点（如 `#Z变换的定义`，slugger 实为小写 `z`）属 **Q5** 类，随"subsections 原样保留"带入新章，仍挂 Q5 待裁决。）
  - 做什么：执行 P1 的解决方案。删除 `discrete` 章，`computer-control` 拆为两个新章；6 课 MDX 迁移复用；处理路由与站内链接
  - 涉及文件：`content/catalog.ts`、`content/computer-control/*.mdx`（迁移）、`content/discrete/`（删除，当前为空）、新建 `content/discrete-sampled/`、`content/implementation/`
  - 验收：两章下所有迁移课程页 curl 200；H2 数 == catalog subsections 数；katex-error == 0；全仓无失效链接

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/semester-02-plan.md 的 P1、2.7、2.8
  三节，以及 .agent/fix-logs/INDEX.md 全 18 条。

  前置条件：A2（catalog 元数据字段）已完成。

  背景：computer-control 章（8 课，MDX 已全部写完）与 discrete 章（8 课，零 MDX）
  存在 5 组 1:1 主题撞车。方案是把两者重组为 discrete-sampled（理论）与
  implementation（工程实现）两个新章。

  任务（分步执行，每步完成后报告再继续）：
  1. 全仓搜索对 /computer-control/* 与 /discrete/* 的引用（MDX 内部链接、catalog.ts、
     components、docs、scripts、mdx-components.tsx、lib/content.ts），列出完整清单。
  2. 按 semester-02-plan.md 的 2.7 表建立 content/discrete-sampled/，按 2.8 表建立
     content/implementation/。已有 MDX 的迁移映射：
       computer-control/z-transform-basics            -> discrete-sampled/z-transform-analysis
       computer-control/discrete-stability            -> discrete-sampled/discrete-stability-criteria
       computer-control/sampling-period               -> discrete-sampled/sampling-period-selection
       computer-control/sampling-quantization         -> 拆分：采样定理/混叠 -> discrete-sampled/discrete-time-freq
                                                              量化部分     -> implementation/embedded-implementation
       computer-control/digital-controller-design     -> 拆分：离散化方法     -> discrete-sampled/discretization-methods
                                                              数字PID工程实现 -> implementation/digital-pid（与现有 digital-pid 合并）
       computer-control/digital-pid                   -> implementation/digital-pid
       computer-control/computer-control-architecture -> implementation/computer-control-architecture
       computer-control/realtime-control              -> implementation/realtime-control
  3. 迁移时**只做移动、改名、章节归属调整与链接修正，不要重写正文技术内容**。
     需要拆分的两课（sampling-quantization、digital-controller-design），本次先整篇
     移动到主目标位置，拆分动作留到阶段 C 单独处理，并在 delivery-tracker.md 对应
     行标注"待拆分"。
  4. 更新 catalog.ts：删除 discrete 章与 computer-control 章，插入两个新章，填好
     order / prereq / level / type / status（type 分别为 theory 与 impl）。
     subsections 原样保留（迁移不改小节结构）。
  5. 删除 content/discrete/（删前先 ls 确认为空目录）。
  6. 全仓替换失效链接（含 docs/ 下的讨论日志与 fix-logs 中的路径引用——这些是历史
     记录，替换时保留原文语义，只改链接目标）。
  7. 验收：npm run build 通过；curl discrete-sampled 与 implementation 两章下所有
     迁移课程页均返回 200；每页 H2 数 == catalog subsections 数；katex-error == 0。
  8. 更新 .agent/delivery-tracker.md 的章节结构与统计；勾上 semester-02-plan.md 的 A3。

  禁止：不要修改任何课程正文的技术内容；不要动 content/math、classic、modern、robust、
  mpc、nonlinear、intelligent。
  ```

- [x] **A4 · math 章扩容骨架（1 → 16 课）+ 数学依赖图谱**（2026-09-25 完成。**第 1 步**：math 章 1 → 16 课，按 §2.2 表格写入 slug/title 并补齐 `prereq`/`level`/`type: "math"`/`status`（`complex-numbers` = `draft`，其余 15 门 = `empty`），**不写 subsections**（`complex-numbers` 原有 7 个小节原样保留）；总量 11 章 / **103** 课 / 616 小节 / 56 门有 subsections，math 章 = 16 课 / 7 小节，新增 18 条 prereq 边全部指向存在的课（全仓 54 条、0 悬空），`npx tsc --noEmit` 退出码 0。**第 2 步**：4 路并行只读扫描 56 门已写课程、逐 H2 小节判定实质性数学依赖，产出 `docs/semester-02/02-math-dependency-map.md`——**284 行依赖、56 课全部至少 1 行**，§2 排序由脚本从表格逐行统计（非手工估数）。**关键发现（2026-09-26 更正）：全仓 `📐` 实测出现 20 次 / 16 个 MDX 文件，其中只有 4 处符合 SKILL.md 的规范格式（`> 📐 …详见 [标题](/math/…)`，且 4 处全部指向 `math/complex-numbers`）**。原注解在此处写的是"全仓 `📐` 出现 0 次"——该测量错误：Windows 下 Bash 的 `grep` 匹配不到这个 emoji 且**静默返回 0 而非报错**，必须用 Node 按码点 `\u{1F4D0}` 扫描。结论方向不变（规范引用几乎没被执行，覆盖率 4/25 ≈ 16%），但依据已更正：第 2 步"摘出已有引用"= **4 行**（非空集）、第 3 步"修正引用链接"= **仍是空操作**（4 行目标 slug 与 §2.2 一致）、第 4 步"缺失清单"= §1 的 284 行减去这 4 行已覆盖的 complex-numbers 依赖。另记两条连带影响：① `nonlinear-characteristics:38` 与 `phase-plane:29` 的 📐 行还链接 `/modern/linear-system-theory`，A6 第 2 章改名 `lyapunov-modern` 时必须同步；② 涉及 emoji / 非 ASCII 的全仓统计一律改用 Node 按码点扫描。详见 `docs/semester-02/02-math-dependency-map.md` §0 的更正说明。**被依赖排序（行数/涉及课程数）**：matrix-decomposition 37/20 > eigen-decomposition 31/21 > fourier-analysis 28/14 > convex-optimization 27/13 ≈ laplace-transform 27/20 > linear-algebra-basics 26/17 > complex-numbers 25/15 > numerical-methods 20/17 > z-transform 17/7 > probability-basics 14/12 > ode-matrix-exponential 11/8 > diff-geometry 9/3 > stochastic-processes 6/4 > variational-dp 5/2 > graph-theory 1/1 > game-theory-math 0/0；**头部 6 门覆盖 176/284 ≈ 62%**，即 B 阶段 math 扩容的第一梯队（`numerical-methods` 另因服务全部含仿真课程、且是 fix-016/018 一类"读数可信度"问题的共同语言而提前）。**第 3 步**：全仓唯一与 math 章相关的存量链接 `nonlinear/feedback-linearization.mdx:17` 的 `/math/linear-algebra` → `/math/linear-algebra-basics`，Q14 死链 6 → 5（该目标课尚无 MDX，故链接结构已正确但仍 404，等 `linear-algebra-basics` 写完自动生效）。**第 4 步**：按用户裁决**只输出清单、未向任何课程正文插入引用行**；§3 给出三批插入策略（就地长篇讲解型 / 重度使用零解释型 / 一句话带过型），批量插入待确认后再做。**第 5 步验收**：`npm run build` 退出码 0、**108/108** 页（A3 时 93 页，+15 恰为 math 新骨架课）；随机 5 门已有课程 curl 全 200 且 H2==subsections、katex-error=0（`classic/time-domain-analysis` 11、`modern/lqr-controller` 10、`mpc/constraint-handling` 12、`nonlinear/phase-plane` 15、`robust/mu-synthesis` 11），另加 `math/complex-numbers` 7 与被改链接的 `nonlinear/feedback-linearization` 15；3 门骨架课路由（`math/eigen-decomposition`、`math/matrix-decomposition`、`math/numerical-methods`）返回 **404 而非 500**。**第 6 步**：delivery-tracker 的 math 表扩为 16 行（每行标注被依赖行数/课程数与排名）+ 统计改为 **19 / 103**，并顺手修正两处历史统计口径（已完成数原写 17，与实际打勾行 classic 8 + nonlinear 8 + intelligent 3 = 19 不符；组件数按 `components/wiki/*-explorer.tsx` 实测 36 个文件、其中 `bode-margins-explorer.tsx` 无 MDX 引用即 Q3 孤儿，故"被引用"35）。**同时修正 A3 条目的一处测量错误**：A3 写的"prereq 边 41 条"实测应为 **36 条**（discrete-sampled 15 + implementation 21），本次 math 新增 18 条后合计 54 条。**未处理/待裁决**：Q14 剩余 5 处 classic 章历史死链（3 处 `/classic/pid-control` 应为 `pid-controller`、2 处死锚点）；Q3/Q4/Q5/Q6 仍开放；math 15 门骨架课按设计 404，A5 需为占位页给出体面渲染。）
  - 做什么：写入 16 课骨架条目（**不写正文**）；扫描全仓已有 MDX 的数学依赖，修正 `📐` 引用链接，并输出缺失引用的清单
  - 涉及文件：`content/catalog.ts`、全仓 `content/**/*.mdx`（仅改引用行）、新建 `docs/semester-02/02-math-dependency-map.md`
  - 验收：所有已有 `📐` 引用指向 catalog 中存在的 math 课；无悬空链接；依赖图谱覆盖全部 56 门已写课程

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/semester-02-plan.md 的 P2 与 2.2 节，
  以及 .agent/skills/wiki-discussion/SKILL.md 的"数学基础章节规则"（第 272-282 行）。

  前置条件：A2（catalog 元数据字段）已完成。

  背景：math 章当前只有 1 课（complex-numbers），但 SKILL.md 规定所有需要较多篇幅
  的数学概念都必须引用 math 章。这条规则目前无法执行，因为被引用的目标课程不存在。

  任务：
  1. 按 2.2 表在 content/catalog.ts 的 math 章写入 16 课的 slug 与 title，填好
     order / prereq / level / type（全部 type: "math"）/ status。除 complex-numbers
     外全部 status: "empty"，**不要写 subsections**（写正文时再补）。
  2. 全仓扫描 content/**/*.mdx（56 门已写课程），产出"数学依赖图谱"：
     - 已有的 "📐 本文用到了" 引用行（全部摘出）
     - 正文中明显依赖但无引用的高等数学概念：矩阵指数、变分法、Hamilton 函数、
       Riccati 方程、SVD、Jordan 标准型、二次型与正定性、KKT 条件、凸集、
       Lie 导数、李括号、微分同胚、图拉普拉斯、代数连通性、贝尔曼方程、
       马尔可夫链、随机过程、白噪声、条件期望、傅里叶级数、拉普拉斯变换、
       迹-行列式平面、Floquet 乘子、结构化奇异值、LFT、Kharitonov 定理
     输出格式：哪一课的哪一节依赖哪个 math 课（16 课中的哪一门）。
     写入 docs/semester-02/02-math-dependency-map.md，并给出"每门 math 课被多少门
     课程依赖"的排序，作为后续编写 math 章的优先级依据。
  3. 对已有的 "📐" 引用行，修正链接目标为 2.2 中的正确 slug。
  4. 对第 2 步发现的、明显需要引用但缺失的位置，**先只输出清单不插入引用**，
     等用户确认后再批量插入（避免一次性大规模改动正文）。
  5. 验收：npm run build 通过；catalog 中 math 章 16 课；已有课程页随机 curl 5 门
     返回 200。
  6. 更新 .agent/delivery-tracker.md 的 math 章表格（16 行，1 行已写 15 行待写）与
     统计；勾上 semester-02-plan.md 的 A4。
  ```

- [x] **A5 · 新增 5 个章节骨架（37 课）**（2026-09-26 完成。**主体**：catalog.ts 新增 introduction(3) / estimation(9) / identification(9) / safety-ftc(8) / applications(8) 共 **37 课**骨架，按 §2.1/§2.5/§2.11/§2.15/§2.16 的 slug 与标题写入，逐课填 `order/prereq/level/type/status: "empty"`，**不写 subsections、不建 MDX**；总量 11 章/103 课 → **16 章/140 课**，小节数 616 与"有 subsections 的 56 门"不变；prereq 边 54 → **142 条、0 悬空**（新增 88 条全部指向已存在的课，`npx tsc --noEmit` 与 `next lint` 退出码 0）。**Q15 裁决（章节顺序）**：选"按 §2.0 全量重排"——因 `order` 字段目前**没有任何消费方**（首页与侧栏都直接遍历 catalog 数组），仅改 `order` 不产生可见效果，故搬移数组元素并把 `order` 重编号 0..15，**关闭诊断报告 P3**；搬移采用"整块提取 + 按新序重组"，并由脚本逐块与 Temp 备份 diff（忽略 `order:` 行）证明 **11 个既有章块字节不变（BYTE-PRESERVATION PASS）**，即重排未夹带任何课程改动。新章序：introduction → math → classic → modern → estimation → nonlinear → discrete-sampled → implementation → mpc → robust → identification → intelligent → rl-control → multi-agent → safety-ftc → applications。**Q16 裁决（骨架课渲染）**：Prompt 的"关键检查"实测结论是骨架课返回 **404 而非 500、build 不失败**（按 Prompt 本可"记录即可"），但用户选择"现在做占位页"，故改写 `app/(wiki)/[chapter]/[lesson]/page.tsx`：新增 `findEntry(chapter, lesson)` 与 `LessonPlaceholder`，**仅当目录明确标记 `status === "empty"` 时短路到占位页**——已登记 `draft` 却读不到 MDX、或 MDX 编译失败的课仍然 404，避免真实故障被"尚未编写"掩盖；占位页全部 inline style（用 `var(--muted-foreground)` 等 CSS 变量，不依赖 Tailwind 工具类，规避 Windows 失效问题），渲染章节眉标 + `<h1>` 课题 + "本课尚未编写"卡片 + prereq 链接列表（目标同样未写时标注"（同样尚未编写）"）+ 返回课程目录；`generateMetadata` 同步按 status 分支，不再为骨架课调用会抛错的 `getLesson`。首页 `app/(wiki)/page.tsx` 经实测**无需改动**（空课程只是多渲染 37 个链接卡片，不报错）。**计划外补记（请用户行使否决权）**：发现 20 门历史骨架课（intelligent 4 / rl-control 8 / multi-agent 8）**缺 `status` 字段**，因而走 404 且在 build 日志刷 `MDX 文件读取失败` ENOENT，享受不到占位页；已回填 `status: "empty"`（回填前用脚本校验 `empty ⇒ 无 MDX`、`draft ⇒ MDX 存在` 双向成立），**build 的 ENOENT 日志由 20+ 降为 0**。**kalman-filter 双向注释**：modern 条目标"A6 待迁出（10 → 9 课，保留 LQG 一节）"、estimation 条目标"A6 待迁移"，两处均注明迁移前同 slug 并存不冲突（路由与 `getLesson` 都按 `(chapter, lesson)` 组合键取文件）；另在 rl-control 的 safe-rl / multi-agent-rl 与 safety-ftc 的 safe-rl 补 A6 迁移注释。**验收**：`npm run build` 退出码 0、**145/145** 页（= A4 的 108 + 37，恰为新增骨架课数）、ENOENT 日志 **0**；已有 **19 门 v1.3 课程页 curl 全 200** 且 H2==subsections、katex-error=0（page-check 10/10 + 9/9 PASS）；专项 `a5-page-check.mjs` **ALL PASS**——12 个占位页 200 + 恰好 1 个 `<h1>` + 含"本课尚未编写" + 每条预期 prereq 的 `href` 都在 HTML 里，4 门已写课未被占位页替换，3 个目录外路由（`/math/no-such-lesson` 等）仍 404，首页 16 章齐全且严格按 §2.0 升序。浏览器视觉验证时截图面不可用（`NATIVE_BROWSER_VIEWPORT_UNAVAILABLE`），改用无障碍快照确认 `/estimation/estimation-problem`：眉标"状态估计与滤波" → H1 课题 → 卡片 → 2 条 prereq（`math/probability-basics` 带"同样尚未编写"标注）→ 返回目录，侧栏 16 章按新序展开。**delivery-tracker**：新增 5 个章节表格（37 行全 `[ ]`）、章节小节按 §2.0 重排、统计 19/103 → **19/140（16 章）**，为 5 个新章各写一段 A5 说明并逐行标注迁移/交叉关系（kalman-filter、safe-rl、multi-agent-rl、least-squares-rls 抽自 adaptive-control-basics 的 RLS 节、controller-selection-guide 的前向 prereq）；改完由脚本核对 **140 行的 slug 与 title 与 catalog 逐一对齐、19 个打勾行与既有正文注释零丢失**。**A6/A8 交接**：① multi-agent 章标题仍是"多智能体控制"，§2.0 定名"多智能体与分布式控制"，A6 改名；② 三处 MDX/条目迁移（modern/kalman-filter → estimation、rl-control/safe-rl → safety-ftc、rl-control/multi-agent-rl → multi-agent），rl-control 目标 11 课 = 现存 8 − 移出 2 + 新增 5；③ **A8 的依赖图校验必须允许 introduction 章的前向 prereq 边**，否则导论章无法表达选型所需的方法族前置。**未处理/待裁决**：Q3/Q4/Q5/Q6 仍开放，Q14 剩余 5 处 classic 章历史死链未动，A4 第 4 步的 284 行 `📐` 引用批量插入仍等用户确认。）
  - 做什么：在 catalog.ts 中建立 `introduction`(3)、`estimation`(9)、`identification`(9)、`safety-ftc`(8)、`applications`(8) 的骨架条目，全部 `status: "empty"`
  - 涉及文件：`content/catalog.ts`、`.agent/delivery-tracker.md`、可能需要 `app/(wiki)/[chapter]/[lesson]/page.tsx`
  - 验收：`npm run build` 通过；空课程不产生 500（若产生需加"尚未编写"占位页）；已有 19 门 v1.3 课程页 curl 全部 200

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/semester-02-plan.md 的 2.0、2.1、
  2.5、2.11、2.15、2.16 节。

  前置条件：A2 已完成。

  任务：在 content/catalog.ts 中新增 5 个章节骨架：
    introduction (3 课) / estimation (9 课) / identification (9 课) /
    safety-ftc (8 课) / applications (8 课)
  按方案给出的 slug 与标题写入，填好 order / prereq / level / type / status="empty"。
  不写 subsections，不创建 MDX 文件。

  注意：estimation/kalman-filter 是从 modern/kalman-filter 迁入的，本条目只建骨架，
  实际 MDX 迁移留到 A6 处理，请在两处都加代码注释说明。

  关键检查：app/(wiki)/[chapter]/[lesson]/page.tsx 在课程 MDX 不存在时的行为。
  先用 curl 访问一个骨架课程的 URL（如 /estimation/estimation-problem）验证：
    - 若返回 404 且站点整体不受影响 -> 可接受，记录即可
    - 若返回 500 或导致 build 失败 -> 需要在 page.tsx 或 lib/content.ts 增加
      "本课尚未编写"占位页。占位页用 inline style 实现，不要依赖 Tailwind 工具类
      （Windows 环境下可能不生效）。占位页应显示课程标题、所属章节、以及"本课
      尚未编写，可先学习其前置课程"并列出 prereq 链接。
  同时检查首页 app/(wiki)/page.tsx 是否会因为空课程而报错或显示异常。

  验收：npm run build 通过；已有 19 门 v1.3 课程页 curl 全部 200。

  更新 .agent/delivery-tracker.md：新增 5 个章节表格（全部 [ ]）与新的总课程数；
  勾上 .agent/semester-02-plan.md 的 A5。
  ```

- [ ] **A6 · classic / modern / robust / mpc / nonlinear / intelligent / rl / multi-agent 章内重排与重命名**
  - 做什么：执行 P4、P5 的解决方案（详见 2.3、2.4、2.6、2.9、2.10、2.12、2.13、2.14）
  - 涉及文件：`content/catalog.ts`、对应 MDX（仅改小节结构与内部链接，不重写正文）、`content/modern/kalman-filter.mdx` → `content/estimation/`
  - 验收：**逐章验收**——每章 `npm run build` 通过 + 该章所有已有 MDX 课程页 curl 200 + H2 数 == subsections 数 + katex-error == 0；重复小节标题在 catalog 中清零

  > **进度快照（2026-09-26，勿据此勾选）**：**第 1 章 classic 已完成并逐章验收通过**，第 2–8 章未动，故本复选框保持未勾选（按 prompt 须第 8 章完成后才勾）。第 1 章实况：`frequency-response` → **`frequency-response-design`**（标题"频率响应设计法：回路整形与带宽"，Q19 裁决：§2.3 其余纯装饰性改名不做，避免 catalog 标题 ≠ MDX H1）；4 个小节逐字迁入 `frequency-domain-analysis`（H2 10 → 13），其中同名的"频域指标与时域指标的对应"去 H2 并入 fda 既有节，catalog 中该节名自此唯一；`stability-analysis` 提前到第 4 位；新增 `design-methods-comparison` 骨架（第 10 位）。全站 140 → **141 课**、616 → **615 小节**。验收实测：build 退出码 0 / 146 页 / classic 11 条路由无 fallback，`tsc --noEmit` 与 `next lint` 退出码 0，11 课全 200 且 H2 == subsections、katex-error 0，旧路由 404，死链扫描 dead=5 与 Q14 历史值逐条一致（零新增）。**遗留（详见 delivery-tracker 经典控制章的 A6 说明）**：① 3 个 ipywidgets 笔记本随搬移落到已交付的 fda 页（Q18 已知代价，实测 `ModuleNotFoundError`），fda 的 `[x]` 转为有条件通过，阶段 C 须按 fix-006 转 React——**Q3 的 `BodeMarginsExplorer` 归属建议因此需重审**（其推荐落点"在Bode图上读取裕度"已迁入 fda）；② 重排使 8 处"上一章/下一章"方位词失效（链接本身有效，A6 禁改正文故未动）；③ 2 处主题重叠与 2 处 Q5 死锚点未扩大。

  **推荐 Prompt（每章一次会话，逐章执行）：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/semester-02-plan.md 的 P4、P5，
  以及 2.3、2.4、2.6、2.9、2.10、2.12、2.13、2.14 各节；再读 .agent/fix-logs/INDEX.md。

  前置条件：A2、A3、A5 已完成。

  任务：执行章内重排与重命名。**分章逐个执行，每章完成并验收后再继续下一章。**
  本次会话只做第 <N> 章（见下表），做完即停并报告。

  章清单与动作：
  1. classic（2.3 表）：stability-analysis 提前到第 4；frequency-domain-analysis
     吸收 frequency-response 的"稳定性判据""在 Bode/Nyquist 图上读取裕度""频域指标
     与时域指标的对应"三个小节；frequency-response 重命名为 frequency-response-design、
     标题改"频率响应设计法：回路整形与带宽"；新增 design-methods-comparison 骨架。
     改完后 catalog 中不得再有"频域指标与时域指标的对应"同名小节出现两次。
  2. modern（2.4 表）：linear-system-theory 重命名为 lyapunov-modern、标题改
     "Lyapunov 方法与现代稳定性"、位置移到第 3；kalman-filter 迁移到 estimation 章
     （移动 MDX 文件 + 更新 catalog + 更新全仓站内链接）；controllability-observability
     的"对偶原理"标为主讲、state-observer 的改为引用；lqr-controller 的"Q 和 R 的
     选择"标为主讲；modern-case-study 中的 Kalman/LQG 步骤标注"待改写为引用
     estimation 章"（本次不改写正文）。
  3. nonlinear（2.6 表）：新增 passivity-control / iss-small-gain /
     switched-hybrid-systems / bifurcation-chaos 四课骨架；三课同名的"与其他非线性
     控制方法的对比"小节标注"待合并为章末集中对比表"（本次不合并正文）。
  4. robust（2.10 表）：uncertainty-modeling 移到第 2；robust-stability 移到第 3；
     新增 mu-analysis 骨架（第 6）；mu-synthesis 删除内部"不确定性建模"小节条目；
     robust-performance 移到第 8；新增 delay-robust-control 骨架（第 9）。
  5. mpc（2.9 表）：删除 constraint-handling / generalized-predictive-control /
     nonlinear-mpc 三课中名为"交互式可视化"的 catalog 小节条目（v1.2 遗留，v1.3 已
     要求交互组件内联）；prediction-model 的"模型辨识基础"小节标注"待移出到
     identification 章"；receding-horizon 的"显式MPC"小节标注"待移出为独立课"；
     新增 mpc-stability / explicit-mpc / economic-mpc 骨架；mpc-case-study 移到章末。
     **注意**：删 catalog 小节条目会破坏"H2 数 == subsections 数"验收，因此必须同步
     检查 MDX 中对应 H2 是否存在——若存在，把该节内容内联到相邻概念节旁（移动而非
     删除），并在 delivery-tracker 标注该课"结构已改，内容待 v1.3 复核"。
  6. intelligent（2.12 表）：genetic-algorithm 改名 metaheuristic-tuning、标题改
     "元启发式优化与控制器整定"；expert-system 改名 knowledge-driven-control、标题改
     "知识驱动控制"；新增 iterative-learning-control 骨架。
  7. rl-control（2.13 表）：移除 multi-agent-rl（迁至 multi-agent 章）、移除 safe-rl
     （迁至 safety-ftc 章）；新增 model-based-rl / imitation-offline-rl /
     rl-analysis-validation / sim-to-real / rl-vs-classical 骨架。
  8. multi-agent（2.14 表）：接收 multi-agent-rl；新增 consensus-under-constraints /
     swarm-coverage 骨架；章标题改为"多智能体与分布式控制"。

  每章完成后必须验收：npm run build 通过；该章所有已有 MDX 课程页 curl 200 且
  H2 数 == catalog subsections 数 且 katex-error == 0；全仓无新增失效链接。

  最后（第 8 章完成后）统一更新 .agent/delivery-tracker.md 全部章节结构与统计，
  并勾上 .agent/semester-02-plan.md 的 A6。

  禁止：不要重写任何课程的正文技术内容（第 5 步的 H2 结构移动除外，且只移动不改写）。
  ```

- [x] **A7 · 交付统计自动化（消除口径不一致）**（2026-09-26 完成。交付 `scripts/check-catalog.mjs`（约 400 行，仅用 `node:fs`/`node:path`/`node:url`，**未引入任何新 npm 依赖**）+ `package.json` 新增 `"check": "node scripts/check-catalog.mjs"` + 重新生成的 `OUTLINE.md`（146 → 245 行）。8 项核对全部实现，退出码语义实测：当前仓库 **PASS 12 / WARN 32 / FAIL 0 → 退出码 0**；HEAD 快照 **PASS 7 / WARN 30 / FAIL 56 → 退出码 1**。回归门槛 `npx tsc --noEmit`、`npx next lint`、`npm run build` 退出码全 0，build 146/146 页与 A6 持平。锚点规范化未 import `github-slugger`（它只是 `rehype-slug` 的传递依赖，不在 package.json，直接引会随 npm 提升策略漂移），改用内联实现并**实测等价**：全仓 56 个 MDX 的 615 条 H2 标题 + catalog 的 615 条 subsection 标题逐条比对，与真库输出 **0 处不一致**。）
  - 做什么：写 `scripts/check-catalog.mjs` 交叉核对 catalog / 文件系统 / tracker / 讨论日志 / 组件引用五处，输出唯一权威统计；`OUTLINE.md` 改为自动生成
  - 产出：`scripts/check-catalog.mjs`、`package.json`（新增 script）、重新生成的 `OUTLINE.md`
  - 验收：脚本能报出 0.1 节记录的三处矛盾；退出码语义正确；`--fix-outline` 生成的 OUTLINE.md 与实际一致

  > **A7 验收实测（2026-09-26）**：新增 `--root <dir>` 参数（prompt 未要求，为了能拿 `git archive HEAD` 的快照做回归测试——活仓库的 tracker 统计行已在 A5/A6 手工修对，矛盾 ①② 在活仓库已不复现，只有对 HEAD 才测得到）。对 HEAD 快照运行，**0.1 节三处矛盾全部被抓到**：① 统计行「课程总数」声明 83 / 实测 84；② 统计行「已完成数」声明 17 / 实测 `[x]` 19；③ OUTLINE 总章节数 10≠11、总模块数 79≠84、已完成 1≠0、待编写 78≠84。**并额外抓到第 4 处 §0.1 未记录的矛盾**：统计行「交互组件数」声明 33 / 实测 36。§0.2 的数字同样是错的——脚本实测讨论日志 **11 篇**（非 §0.2 写的 13 个 md 文件），有 MDX 但无日志 **45 门**（非 43 门；43 是从错误的 13 推出来的）。这本身就是 A7 要消灭的"统计靠手工"的第 4、第 5 个实例。
  >
  > `--fix-tracker-stats` 双向验证：对 HEAD 快照把旧格式行 `**统计**：17 / 83 课程已完成（33个交互组件已交付）` 正确改写成规范格式 `19 / 84 …（11 章；36 个交互组件文件，其中 35 个被课程正文引用）`；对活仓库（已一致）报"已是最新，无需写入"而不是误报失败。**统计行解析必须容忍格式漂移**——HEAD 用的是旧措辞，写死新格式的正则会直接"无法识别"从而漏掉矛盾 ①②，这是本条目执行中唯一一次返工。
  >
  > **计划外补记（用户预先授权自行决策，可否决）**：脚本第 3.3 节报出 **19 门已交付课程在 tracker 打了勾、但 catalog 里没有 `status` 字段**（A2 只加了字段声明，A3–A5 只给重组过的课填了值，47 门历史课一直空着）。选择**补数据而不是放宽检查**：把 tracker 打勾的 19 门填 `status: "v1.3"`、其余 28 门有 MDX 的填 `status: "draft"`。理由：① A7 的目标是"唯一权威来源"，只要 catalog 答不出"交付了几门"，tracker 就仍是事实权威，A7 等于没做成；② 不补的话 `npm run check` 永久红 19 条，无法当提交前门槛用；③ **可证明渲染无副作用**——全仓 grep 确认 `lesson.status` 的唯一消费方是 `app/(wiki)/[chapter]/[lesson]/page.tsx:29/38/146`，且只判 `=== "empty"`。补后 status 分布 `empty 85 / draft 37 / v1.3 19 = 141`，首次成为完整划分（无"(无)"）。写入用带守卫的一次性脚本：按 6 空格缩进 + 剥掉字符串字面量后数花括号来定位每课 span（**标题里有 `$\mathcal{H}_\infty$` 这类 LaTeX 花括号，不剥字符串会数错**），写后逐课比对证明"16 章 / 141 课 / 615 小节不变、47 门只有 status 一个字段变化、其余字段字节级不变、status 键 94 → 141"；实际改动 74 行 = 27 处紧凑格式替换 ×2 + 20 处展开格式插入。三类课程页渲染复验：`classic/system-modeling`(v1.3) h2=13/katex-error=0/无占位、`modern/state-space`(draft) h2=10/无占位、`math/linear-algebra-basics`(empty) 占位页命中/h2=0。
  >
  > **FAIL / WARN 分级（自行裁定，可否决）**：FAIL = 真实故障（MDX 缺失但 status≠empty 会 404、孤儿 MDX 正文不可达、tracker 行序/标题/章序错位、`[x]`↔status 不一致、统计行与实测不符、OUTLINE 与实测不符、MDX 引用了未实现的组件、fix-015 双注册表不同步、subsections **数量**与 H2 不符）；WARN = 已登记待裁决的既有负债（A6 迁移期跨章重复 slug 属设计、status=empty 却有 MDX、讨论日志缺失即 0.2 负债、Q3 孤儿组件、Q5 subsection **slug** 不符 27 门）。把 Q5 的 slug 不符定为 WARN 是刻意的：92 处死锚点若算 FAIL，`npm run check` 会永久红，门槛就废了——待裁决项应该可见但不该阻断。
  >
  > **A7 交代的后续（不属本条目）**：`OUTLINE.md` 现在由脚本生成，任何手工编辑都会在下次 `npm run check` 被判 FAIL；建议 E1 把它接进 CI。第 6 节实测 Q5 的死锚点为 **27 门课 / 81 个 subsection slug**——门数与 Q5 原记的 27 门一致，**锚点数从 92 漂移到 81**（Q5 是在 A3 重组前的 616 小节基线上数的，A3 删章迁课 + A6-1 改 fda/frequency-response-design 的 subsection 集合后基数变了），**Q5 裁决时应改用 81 这个新值**。其中 `classic/frequency-domain-analysis` 的「工程实例rc低通滤波器的频率分析」应为「工程实例」是 **A6-1 合并同名节新产生的**，A6 第 2–8 章与 Q5 裁决时须一并处理。

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/semester-02-plan.md 的 0.1 节与 P11。

  前置条件：A2 已完成（catalog 有 status 字段）。A3–A6 若未完成也可先做本条目，
  脚本需能适应目录变化。

  背景：当前存在三个互相矛盾的统计数字：catalog.ts 实际 84 课（重组前）、
  delivery-tracker.md 底部声明 "17/83"、实际 [x] 计数 19；OUTLINE.md 仍写
  "10 章/79 模块/已完成 1"。统计完全靠手工维护，已经错了。

  任务：写 Node 脚本 scripts/check-catalog.mjs，做到：
  1. 解析 content/catalog.ts，统计章节数、课程数、各章课程数、各 status / level /
     type 分布。
  2. 扫描 content/<chapter>/<lesson>.mdx，判断"MDX 是否存在"，与 catalog 交叉核对，
     报出：catalog 有但 MDX 缺失 / MDX 存在但 catalog 无条目 / 跨章重复 slug。
  3. 解析 .agent/delivery-tracker.md，统计 [x] 与 [ ]，与 catalog 的 status 字段
     交叉核对，报出所有不一致的课程。
  4. 统计 docs/discuss-log/semester-*/ 下的讨论日志篇数，报出"已有 MDX 但无讨论日志"
     的课程清单（这是 0.2 节记录的 43 课负债的自动化检测）。
  5. 统计 components/wiki/*-explorer.tsx 数量，与 MDX 中实际引用的组件名交叉核对，
     报出"已实现但未被任何 MDX 引用"和"MDX 引用但未实现"的组件。
  6. 校验 catalog.ts 中每课的 subsections 与对应 MDX 的 H2 序列是否逐条对应
     （数量相等 + 标题规范化后相等），报出差异明细。
  7. 以 --fix-outline 参数重新生成 OUTLINE.md（表格形式，含章 / 课 / 状态 / 难度 /
     类型 / 前置依赖），以 --fix-tracker-stats 参数更新 delivery-tracker.md 底部
     统计行。默认只读不写。
  8. 退出码：发现任何 FAIL 级不一致返回 1，仅 WARN 或全绿返回 0。
     输出人类可读、分类清晰，末尾给出统计摘要。

  约束：不要引入新的 npm 依赖，用 Node 20+ 内置能力（fs / path）。
  在 package.json 增加 "check": "node scripts/check-catalog.mjs"。

  完成后：运行一次并把完整输出贴出来，确认它抓到了 0.1 节记录的三处矛盾；
  然后跑 --fix-outline 让 OUTLINE.md 恢复正确；再跑 --fix-tracker-stats 让
  delivery-tracker.md 底部统计正确。
  勾上 .agent/semester-02-plan.md 的 A7。
  ```

- [x] **A8 · 前置依赖图校验与 UI 提示**（2026-09-26 完成。**Part 1**：`scripts/check-catalog.mjs` 新增第 9 节（9.0–9.8），148 条 prereq 边建图，实测**环 0 / 悬空 0 / 自环 0 / 重复 0**，前向边 10 条（导论设计豁免 6 + `FORWARD_ALLOWLIST` 命中 4 + 未登记 0）、章内倒置 2 条（`discrete-sampled`；**A8 新发现，P4 表未列，且该章不在 A6 的 8 章范围内** → 留 WARN 等 C5 拆分 / D2 新写消解）→ WARN，孤儿课 30 门 / 覆盖率 69-141 / 零 prereq 边的章 7 个 → WARN，拓扑层级 0..8 逐章打印、`--topo` 打印 141 行逐课明细；`OUTLINE.md` 表增「拓扑层级」「前置依赖」两列并增 2 条统计（245 → 247 行，脚本重新生成）。**Part 2**：新增 `lib/lesson-graph.ts`（课程页与首页共用的 catalog 派生视图，口径与第 9 节一致）+ `components/wiki/lesson-nav.tsx`（`PrereqCard` / `NextUpCard` / `ChapterPathLine`，**全部 inline style + CSS 变量，卡片内一律不用 h1/h2/h3**——`TableOfContents` 扫的是 `article h2, article h3`）；`lib/content.ts` 的 `getLesson` 增可选第三参 `extraComponents`，课程页用 `h1` 覆写把卡片挂在正文**首个 h1 之后**，56 个 MDX 一个没动（实测 56 个文件的首个 `# ` 行都在第 6 行以前，故"第一个 h1"恒等于课程标题）；首页每章标题下增一行学习路径（本课数 / 已交付 / 有正文 / 建议起点）。**验收实测**：`npm run check` 退出码 0（PASS 17 / WARN 36 / FAIL 0）；`rm -rf .next` 后 `npm run build` 退出码 0、**146/146** 页与 A6–A7 持平；`npx tsc --noEmit` 与 `npx next lint` 退出码 0（仅 2 个既有告警文件）；**5 门课程页**（`classic/frequency-domain-analysis`、`nonlinear/phase-plane` 两门已写 + `estimation/extended-kalman-filter`、`introduction/controller-selection-guide`、`classic/design-methods-comparison` 三门骨架，覆盖 v1.3/draft/empty 三种 status）curl 全 200，`data-lesson-nav="prereq"|"next"`、`前置课程`、`接下来学` grep 逐页命中且卡片确在首个 `<h1>` 之后，卡片内 **22 个不同链接目标逐个 curl 全 200**；首页 16 行 `data-chapter-path` 齐全。**新发现 Q20（prereq 数据偏斜，待裁决）见下方补记**。）
  - 做什么：基于 `prereq` 字段校验依赖图（无环、无悬空边、无章序违反）；课程页渲染"前置课程 / 接下来学"卡片；首页渲染章节学习路径
  - 涉及文件：`scripts/check-catalog.mjs`（扩展）、`app/(wiki)/[chapter]/[lesson]/page.tsx`、`app/(wiki)/page.tsx`、`lib/content.ts`
  - 验收：依赖校验退出码 0；随机 5 门课程页的前置链接可点击且指向正确；curl 200

  > **A8 自行裁定 ①（章序违反怎么判，用户预先授权自行决策，可否决）**：Prompt 要求"章序违反就报出"，但实测 10 条前向边里 **6 条是 introduction 章的设计**（`controller-selection-guide` 按 §2.1 要指向 5 个方法族，catalog.ts:33 的注释与 A5 的 Q15 冻结都写明导论章在章序第 0 位），另 **4 条是内容真实依赖与 §2.0 章序的冲突**（EKF ← Lyapunov 稳定性、H∞ 滤波 ← H∞ 基础、MHE ← 滚动时域、神经网络辨识 ← 神经网络控制）。裁定：**导论章整章豁免（但逐条打 INFO，数量变化肉眼可见）+ 其余前向边必须逐条登记 `FORWARD_ALLOWLIST` 并写明理由；未登记 → FAIL；登记条目在 catalog 中消失（改序或删边）→ 同样 FAIL**，防止名单腐化成死数据。不选"一律降 WARN"是因为 WARN 可被无视，而 Prompt 明说这条检查是"防止未来重犯的关键守卫"；不选"改 catalog 数据或重排章序"是因为 A8 未获改数据授权，且章序已由 Q15 裁决冻结。
  >
  > **A8 自行裁定 ②（"未编写"的前置课仍然可点）**：Prompt 写"用禁用样式但仍显示名称"。实测 85 门骨架课在 A5 之后**都有占位页**，点进去能看到它自己的前置链，读者可以一路往上追溯；做成不可点的死文本反而把这条路断了。故实现为**虚线边框 + `var(--muted-foreground)` 灰字**（视觉上是禁用态）但保留 `<a href>`；只有真正的悬空 prereq（catalog 查无此课，第 9.1 节会 FAIL）才渲染成非链接 `<span>`。
  >
  > **负向测试（A7 记的教训：只对着干净的当前仓库跑等于没测）**：写一次性脚本把真实 catalog 解析出来后注入 7 组缺陷（畸形 prereq、自环、重复 prereq、2 条悬空——分别命中"章不存在"与"课程不存在"两种提示、一个三元环并打印完整路径、1 条未登记前向边、1 条陈旧白名单条目、1 条指向迁出侧的边、3 处章内倒置），写进一个**只含 `content/catalog.ts` 的最小临时根目录**，用 A7 加的 `--root` 跑：**FAIL 64 / 退出码 1**，每条预期消息都出现；活仓库同一脚本 **FAIL 0 / 退出码 0**。两个坑：① 临时根不能用 `cmd //c mklink /J`（MSYS 与 cmd 会把 `D:/…` 路径嚼碎），且脚本里不要用 `execSync`（PostToolUse hook 判 HIGH 安全风险）；② 生成 `catalog.ts` 时必须输出 **TS 风格裸键**，因为 `parseCatalog` 会给裸键补引号，直接 `JSON.stringify` 会得到 `""slug""` 而解析失败。
  >
  > **迁移期并存 slug 的检查从"钝刀"改成显式名单**：最初按"同一 slug 出现在两章就 WARN"实现，产生 **6 条误报**——它把指向**正确一侧** `estimation/kalman-filter` 的边也判了。改成 `MIGRATION_OUT` 显式映射（`modern/kalman-filter`、`rl-control/safe-rl`、`rl-control/multi-agent-rl`），只在边指向**迁出侧**时 WARN；负向测试确认注入 `estimation/particle-filter -> modern/kalman-filter` 时能报出。**A6 第 3、8 章执行搬移时必须同步删改这张表**。孤儿课判定另补 slug 兜底（缺 `type: "case"` 时按 `-case`/`-case-study` 结尾识别，legacy 案例课都没填 type），孤儿数从虚高的 36 降到实测 **30**。
  >
  > **Q20（新发现，待裁决）：prereq 数据严重偏斜，"前置课程"卡片对已写课程几乎无话可说**。实测 141 门里 **69 门登记了 prereq，而这 69 门全部是骨架课——56 门有正文的课程 0 门有 prereq**；**7 个章零 prereq 边**（modern / nonlinear / mpc / robust / intelligent / rl-control / multi-agent，正是 A2 之前的老章，含 nonlinear 已交付的 8 门 v1.3）。因此已写课程页的"前置课程"卡片目前只能走**如实兜底**文案（"目录未登记本课的前置依赖。第一次读「X」建议从《Y》开始" + 指向建议起点课的可点链接）——验收要求的"前置链接可点击且指向正确"由此成立，但信息量远低于设计意图。第 9.7 节已把它打成一条聚合 WARN 并标注"见 Q20"。**候选方案**：(a) 把 A4 已实测的 **284 行数学依赖**落成 catalog `prereq`（纯结构化数据，可脚本校验；与 A4 第 4 步的 `📐` 正文插入是两件事，后者仍单独等裁决）；(b) 连 7 个零边章一起全量补（须逐章讨论，工作量大）；(c) 不补，卡片继续走兜底。**推荐 (a) 先行、(b) 随 A6 逐章重排时顺手补、(c) 不取**：A8 的 UI 已就位，缺的只是数据；数据不补，"前置课程"卡片对已交付的 19 门课永远只是一句道歉。
  >
  > **A8 交代的后续（不属本条目）**：① 第 9.4 节报出的 2 条章内倒置（`discrete-sampled` 的 `z-transform-analysis`[第 3 课] 与 `discretization-methods`[第 4 课] 都 prereq `discrete-time-freq`[第 6 课]）是 **A8 新发现，§1 的 P4 表里没有这两条**（P4 只列了 robust 的 mu-synthesis↔uncertainty-modeling、modern 的 linear-system-theory、classic 的 stability-analysis 等）。**且 `discrete-sampled` 不在 A6 的 8 章范围内**（A6 = classic / modern / robust / mpc / nonlinear / intelligent / rl-control / multi-agent，见 §2.3/2.4/2.6/2.9/2.10/2.12/2.13/2.14），所以别指望 A6 顺手消解它——正确的消解点是 **C5**（`sampling-quantization` / `digital-controller-design` 两处 A3 遗留拆分，`discrete-time-freq` 与 `discretization-methods` 的内容边界会在那里重画）或 **D2**（discrete-sampled 章 6 门新课，含新写 `discrete-time-freq`）。在 C5/D2 之前这 2 条 WARN 会一直在，属预期。② 首页 `data-chapter-path` 用 grep 数会得到 **32 而非 16**（Next.js 把同一份内容再序列化进 RSC flight payload；卡片文案同理会出现 2 次），核对时必须按 slug 去重或只数可见 HTML，这是 fix-016/018 同族的"读数可信度"问题又一实例；③ `lib/lesson-graph.ts` 的拓扑 rank 与脚本第 9.8 节是**两份独立实现**（一份 TS 供渲染、一份 mjs 供校验），口径已在文件头注明一致，改动任一侧必须同步另一侧——建议 E1 把 `npm run check` 接进 CI 时顺带加一条"两侧 rank 抽样比对"；④ `OUTLINE.md` 的列是**追加**而非插入，故第 7 节回读 OUTLINE 的 slug 正则无需改动，重新生成后 `npm run check` 直接通过。

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。前置条件：A2（catalog 元数据字段）与
  A3–A6（目录重组）已完成。先读 .agent/semester-02-plan.md 的 P3、P6、2.0 节。

  任务分两部分：

  Part 1 — 依赖图校验（扩展 scripts/check-catalog.mjs）：
  - 构建课程依赖有向图（prereq 边）
  - 检测环，报出环上的课程路径
  - 检测悬空边（prereq 指向 catalog 中不存在的课程）
  - **检测章序违反**：若课程 X 的某个 prereq 所在章的 order 大于 X 所在章的 order，
    报出。这正是 P3 记录的"mpc 排在 discrete 之前"问题的自动化检测，是防止
    未来重犯的关键守卫。
  - 输出每课的拓扑序位置，供人工复核章节顺序是否合理
  - 检测"孤儿课"：既无 prereq 也不是任何课的 prereq 且不是章首课或案例课

  Part 2 — UI 呈现：
  - 课程页顶部（标题下方）渲染"前置课程"卡片：列出 prereq 课程链接，标注其状态
    （已交付 / 已写待重构 / 未编写）。未编写的前置课程用禁用样式但仍显示名称，
    让读者知道路径存在。
  - 课程页底部渲染"接下来学"：在拓扑序中紧随其后的 2-3 门同章课程。
  - 首页每章标题下渲染一行学习路径提示（本课数 / 已交付数 / 建议起点课）。
  - **全部用 inline style 实现，不要依赖 Tailwind 工具类**（Windows 环境下 Tailwind
    类可能不生效，这是项目已记录的环境陷阱）。

  验收：npm run build 通过；node scripts/check-catalog.mjs 退出码 0；随机 curl 5 门
  课程页返回 200 并用 grep 确认新卡片的关键文本出现在 HTML 中。
  勾上 .agent/semester-02-plan.md 的 A8。
  ```

---

### 阶段 B · 角色团队升级

- [x] **B1 · 写入 6 个新角色人设**（2026-09-26 完成。`personas.md` 由 595 行扩到 **971 行**（`wc -l` 口径；+376），新增 **2 个层 / 6 名角色**：`## 验证团队 — 独立把关`（柯验·秦构·何疑）与 `## 体验与脉络 — 读者、历史与安全`（陆阅·许史·范安），插入位置在「工程团队」与「教学支持」之间，与 §3.8 的层序一致。团队规模 **14 → 20 名具名角色 + 1 类轮值**，B2 再 +2 名学生 → 22。清单条数：柯验 8、秦构 11、何疑 6、陆阅 7、许史 5、范安 5，共 42 条，**每一条都括注了 fix-log 编号 / 已记录事故 / P·Q·§·M 编号**，无一条是「确保数值正确」式的空泛职责。验收全部通过，见下方补记。）
  - 做什么：把 3.3 的柯验、秦构、何疑、陆阅、许史、范安完整人设写入 `personas.md`；补充新角色的互动模式
  - 涉及文件：`.agent/skills/wiki-discussion/personas.md`
  - 验收：6 个角色格式与现有 14 人一致；柯验 / 秦构 / 何疑三人的职责是可勾选清单且每项注明对应的 fix-log 编号或事故

  > **完成补记（2026-09-26，用户预先授权自行决策，可否决）**
  >
  > **① 五条硬性要求的落地位置**
  > - 要求 1（可勾选清单 + 逐项注源）：§3.3 的 6 + 9 + 6 = 21 条**全部照写、未缩减**，并在柯验处 +2 条（控件取值范围覆盖性、镜像脚本纪律）、秦构处 +2 条（cell 字符串逐字全等、九项硬门槛粘贴实际输出）、何疑处 0 条、陆阅处 0 条，合计 8 / 11 / 6 / 7 / 5 / 5。
  > - 要求 2（每角色一行「对应返工」）：6 人**统一使用 `**对应返工**：` 标签**。柯验 / 秦构有真实 fix-log 编号；何疑、陆阅、许史、范安无 fix-log，标签后第一句即写明「无对应 fix-log 编号；设立依据是……」，再给可核查的事故或缺口出处，不用「对应事故」「对应缺口」这类不一致的标签名。
  > - 要求 3（三处职责转移）：**写了 7 处**，双向落地——新角色一侧写在各自「与相邻角色的分工边界」，旧角色一侧在原有条目后追加 `> 职责转移（semester-02 B1）` 引用块：何仿（数值正确性审计 → 柯验，并新增「每个数字必须写清产出路径」的义务）、郑核（代码可运行性 → 秦构、数值核查 → 柯验；原「验证所有代码的可运行性」一行改为删除线 + 移交说明）、苏绘（交互组件实现 → 秦构，Phase 3 的「数值正确性」→ 柯验，并明确苏绘按 §3.6 属核心常设 4 人每课必到）。
  > - 要求 4（≥6 条新互动）：新增 **8 条**（第 12–19 条），必需的 6 条齐全，另补「柯验 vs 秦构」（谁修 vs 谁判）与「范安 vs 卫韧」（鲁棒 ≠ 安全）两条真实边界冲突。**顺带修掉了原文件的一个既有缺陷**：互动列表编号是 1–8、9（苏绘）、9（小初）、10（钱锐）——「9」重复，已重排为连续的 1–19。
  > - 要求 5（更新总数与分组）：新增 `## 团队全貌` 一节置于 H1 之后，含分层人数表（4 / 3 / 3 / 3 / 3 / 1 类 / 4 = **20 名具名**）、核心常设 4 人、章主责教授映射、有否决权的角色（柯验·何疑），以及「待补」清单（B2 → 22 人与 14 类轮值、B3–B7 → 同步 SKILL.md）。
  >
  > **② 自行裁定：把「互动示例」里的数字全部换成实测值**（用户预先授权自行决策，可否决）。初稿的第 12、13、18 条为了对话流畅编了几个数字（「基线反超 4%」「滑模比门限逻辑短 23%」「12 组工况」），**这正是柯验这个角色要抓的毛病**。已逐条回溯到原始记录并替换为实测值：第 12 条改为 `01-fuzzy-control-basics.md` 第 88 行的真实数据（原基线湿卵石 47.243 m vs 无 ABS 44.352 m、减压条件符号写成 `sd < -2.0`、重做后扫 96 组参数取 $s_{hi}=0.13$ / $s_{lo}=0.08$ / 减压 12000 / 增压 3000 N·m/s、三路 30.455 / 41.336 / 92.820 m、模糊只好 1%~3% 且 max $s$ 高 28%）；第 13 条改为 fix-014 的真实症状（轨迹从 A=1.05 起画不出 $A_0=4/(3\pi)=0.4244$、只判 Nyquist 穿越点不查覆盖性、「饱和 + K=1」假阳性）；第 18 条改为 fix-016 的真实读数（0.319033 → 6.380664 vs notebook 6.380676）。**教训**：写「红队角色」的人设时最容易顺手编一个像样的数字，而人设文件是后续所有课程的依据，编出来的数字会被当成既有事实引用。
  >
  > **③ 自行裁定：把「已记录教训」补成两处可核查的出处**（用户预先授权自行决策，可否决）。§3.3 第 553 行给秦构的一条清单写「已记录教训：实现了注册了但忘了引用」，未指明出处。回溯结果：该事故确实发生过——记录在**项目记忆**（`project-status.md` 的 `neural-network-control` 交付条目：「MDX 文件必须显式引用交互组件」），且已修好（实测 `NeuralNetworkExplorer` 现有 MDX 1 处、`lib/content.ts` 2 处、`mdx-components.tsx` 2 处引用）。但记忆记录无法从仓库自身核查，故**额外补一个至今未修、可在仓库里直接验的实例**：诊断报告 **Q3** 的 `bode-margins-explorer.tsx`（已实现、未注册、未引用，`npm run check` 报「36 个 explorer 中 1 个孤儿」）。同理，§3.3 第 550 行的 `useECharts` hydration crash 在**仓库内**只出现于计划自身（§3.3 与 B6 各一处），fix-log / tracker / 讨论日志均无记录——只在项目记忆的 `fuzzy-controller-design` 交付条目里；故照写但标注「此条尚无 fix-log 编号，B8 落地归因字段后应补登一条」，不伪装成有仓库内出处。**教训：计划里写「已记录」时必须注明记录在哪一层（fix-log / tracker / 讨论日志 / 项目记忆），否则后续读者无法核查，也容易被当成编造。**
  >
  > **④ 自行裁定：何疑的「5.3%」清单条目补上可核查的具体证据**（用户预先授权自行决策，可否决）。§3.3 原文只写「"超越 PID 5.3%"这类结论的显著性与样本量是否交代？」。实测该数字确实存在于 `content/intelligent/neural-network-control.mdx` 三处（L617 / L826 / L878：$J=0.054$ vs PID $0.057$），且该课 `train_nn()` 内写死 `np.random.seed(42)`、单次初始化单次运行、正文与 tracker 均未报告多 seed 下 $J$ 的分布——**这一条不是假想风险，是仓库里现存的一处未放行对比结论**。已把上述出处写进清单条目，供 B7 落地红队机制时直接作为第一个案例。
  >
  > **⑤ 移交 B3–B7：`SKILL.md` 有五处与新分工矛盾**（B1 只许改 `personas.md`，故未动）。已在 `## 团队全貌` 的「待补」清单里逐条登记：`:295`「苏绘负责设计，何仿负责实现，郑核负责验证」旧三段式作废；`:292`「所有代码必须可运行（郑核负责验证）」→ 秦构执行 M3；`:293`「郑核负责验证格式」→ 秦构；`:294`「郑核负责检查」代码位置 → 陆阅（节奏）+ 秦构（格式）；角色表人数标注与「讨论标记约定」缺 `[柯验] [秦构] [何疑] [陆阅] [许史] [范安]` 六个新标记。（`:297` 术语跨课一致性、`:298` 答案正确性核查仍归郑核与孙助，不变。）
  >
  > **⑥ 验收方式**：两个独立 Node 脚本（临时目录，用完即删）。`b1-verify.mjs` 核 8 组断言——① personas.md 引用的 13 个 fix-log 编号（002/003/004/005/006/011/012/013/014/015/016/017/018）**全部**存在于 `fix-logs/INDEX.md`，无虚构编号（未引用 007–010 的详情内容，因其详情文件缺失即 Q4）；② 6 名新角色的 `###` 标题都在；③ 每人 9 项必备字段齐全（对应返工 / 身份 / 背景 / 性格特征 / 口头禅 / 否决权 / 分工边界 / 在讨论中的角色 / 产物）、勾选项逐条有来源标注（42 条，未标来源 **0** 条）；④ 无空泛措辞（「确保数值正确」等 5 种，排除 `「」` 内的禁令引用后为 0）；⑤ 四处职责转移的正则都能命中、「职责转移」出现 7 次；⑥ 互动编号连续 1–19 无重复、6 条必需互动齐全；⑦ `## 团队全貌` 存在、各层人数合计 = 20 与声明一致、21 个 `###` 角色名与全貌表交叉核对无遗漏；⑧ SKILL.md 移交事项已登记。`b1-md.mjs` 逐行核 `**` / 反引号 / `$` / `「」` / `（）` 配对——**971 行全通过**（脚本内按 `split("\n")` 得 972，末尾换行导致差 1，行数一律以 `wc -l` 为准）。`git status` 确认本阶段只改了 `personas.md` 一个文件（其余 M 项均为 A1–A8 的既有未提交改动）。

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先完整阅读：
  - .agent/skills/wiki-discussion/personas.md（现有 14 角色 + 轮值专家的写法与格式）
  - .agent/skills/wiki-discussion/SKILL.md
  - .agent/fix-logs/INDEX.md 全 18 条，以及 014 / 015 / 016 / 017 / 018 五条的详情文件
  - .agent/semester-02-plan.md 的 0.3 节与 3.3 节

  任务：在 personas.md 中新增 6 个角色，严格沿用现有角色的文档结构与详略程度：
    柯验（数值仲裁工程师）、秦构（前端可视化工程师）、何疑（红队审稿人）、
    陆阅（学习体验设计师）、许史（控制史与方法论学者）、范安（功能安全与标准工程师）

  每个角色必须包含：身份 / 背景（学历 + 从业经历，具体到能解释其判断偏好）/
  性格特征 / 核心职责 / 口头禅 / 是否有否决权及否决条件 / 与相邻角色的分工边界。

  硬性要求：
  1. 柯验、秦构、何疑三人的"核心职责"必须是**可勾选的检查清单**（markdown
     checkbox 形式），且每一项都要注明它对应的历史 fix-log 编号或已记录事故。
     照 semester-02-plan.md 3.3 节列出的清单逐条写入，不要缩减。
     禁止写"确保数值正确"这类无法验证的职责描述。
  2. 每个角色都要写明"对应返工"一行，说明这个角色是为了解决哪几条 fix-log 或
     哪次事故而设立（照 0.3 节的归因数据）。
  3. 明确写出三处职责转移，避免与现有角色重叠：
     - 何仿 -> 柯验：数值正确性审计
     - 苏绘 -> 秦构：交互组件的实现（苏绘只负责可视化决策与视觉规范）
     - 郑核 -> 秦构 / 柯验：代码可运行性检查与数值核查（郑核聚焦签发与跨课一致性）
  4. 在 personas.md 末尾"角色互动模式"一节补充至少 6 条新角色的典型互动：
     何疑 vs 何仿（基线是否整定过）、柯验 vs 苏绘（组件读数与图示是否一致）、
     秦构 vs 郑核（硬门槛未过不得签发）、陆阅 vs 孙助（认知负荷与习题难度）、
     许史 vs 陈控/林矩（四大派的历史根源与真实分歧）、
     范安 vs 钱锐（"能证明安全"与"能证明收敛"是两回事）。
  5. 更新 personas.md 中任何提到角色总数或分组的地方。

  只修改 personas.md 这一个文件。
  ```

- [x] **B2 · 扩充学生团队与轮值专家表**（2026-09-26 完成。`personas.md` 971 → **1119 行**、`SKILL.md` 298 → **357 行**（均 `wc -l` 口径）。学生团队 4 → 6（**林码**·CS 硕士 / **岳自**·高中数学哨兵），轮值领域专家 7 → **14 类**，团队规模 **20 → 22 名具名 + 14 类轮值**，分层 7 → **8 个层**（苏绘拆出独立「可视化」层）。验收：`SKILL.md`「讨论标记约定」实测含 **22 个 `[具名]` 标记 + 14 个 `[领域-X]` 标记 + `[沉默-XXX]`**，硬性要求达成；`npm run check` 退出码 0、PASS 17 / WARN 36 / FAIL 0 与 A8 后完全一致。新发现 **Q22**（67 门课缺 `type`，恰好等于 A6 的 8 章范围，B3 的课型矩阵依赖它）见下方补记与 tracker。）
  - 做什么：学生 4 → 6（新增林码、岳自）；轮值领域专家 7 → 14 类；同步 SKILL.md 的角色表与讨论标记
  - 涉及文件：`.agent/skills/wiki-discussion/personas.md`、`.agent/skills/wiki-discussion/SKILL.md`
  - 验收：SKILL.md 的"讨论标记约定"包含全部 22 人 + 14 类轮值的标记

  > **完成补记（2026-09-26，用户预先授权自行决策，可否决）**
  >
  > **① 三条硬性要求的落地位置**
  > - 要求 1（学生 4 → 6）：在钱锐之后、`## 角色互动模式` 之前插入 `### 林码`、`### 岳自`，字段与现有 4 人一致（身份 / 背景 / 性格特征 / 典型困惑 / 在讨论中的角色 / 口头禅），另加 `**设立依据**：` 一行如实注明出处——两人**都无对应 fix-log 编号**，依据是 §3.4 原文 + catalog 实测现状，不伪装成有事故来源（B1 教训 ②）。Prompt 给的 6 条示例困惑全部照写，每人另补至 **7 条**。
  > - 要求 2（轮值 7 → 14 类）：表头改为 `| # | 领域 | 适用章节 | 专家画像 |`，新增 7 类逐行标「（B2 新增）」，画像按现有 7 类的详略程度写（行业出身 + 精通 X/Y/Z）。例：过程安全与化工装置 = 化工/石化装置 SIS 工程师，精通 SIL 定级（IEC 61511）、联锁逻辑与表决结构（1oo2 / 2oo3）、HAZOP、SIS 与 BPCS 的分层与独立性。另补两张表：**「章 → 轮值类匹配规则」**（8 行，覆盖 applications / implementation+discrete-sampled / mpc / safety-ftc / nonlinear / multi-agent / intelligent / robust）与**「与相邻角色的分工边界」**（范安 / 吴规 / 赵工 / 何疑），总规则 **惯例不等于合规**——行业惯例不能替代标准判定。
  > - 要求 3（SKILL.md 同步）：学生团队表 +2 行（岳自注明 **math 章必到**、林码注明 **learning 类课程必到**）；「讨论标记约定」重构为 8 个分组共 **22 个 `[具名]` 标记 + 14 个 `[领域-X]` 标记 + `[沉默-XXX]`**，原有三个流程标记保留；角色体系按 §3.8 重排为 8 个层——新增「验证团队（3人）」「体验与脉络（3人）」两层，「可视化设计（1人）」改名「可视化（1人）」，各层标题人数 4+3+3+3+2+1+6 = **22**，与 personas.md 的分层表逐层一致；frontmatter 与「概述」的「四个层面」改为「七个层面的 22 名角色（外加 14 类轮值领域专家）」。
  >
  > **② 自行裁定：Prompt 里的「29 课」是旧数，按 catalog 实测改为 23 门**（可否决）。§3.4 写林码服务 rl-control（11 课）+ intelligent（8 课）+ multi-agent（10 课）= 29 课；实测为 8 + 7 + 8 = **23 门 = 全库 141 门的 16%**，其中只有 intelligent 的 3 门有正文（fuzzy-control-basics / fuzzy-controller-design / neural-network-control，均已 v1.3），rl-control 与 multi-agent 的 **16 门全是骨架**，且这三章都在 A8 实测的「零 prereq 边的 7 个章」名单里。personas.md 按实测值写，并据此定位林码的价值：**他代表的是尚未写出来的那批课程的目标读者，主战场在 D 阶段而非复核存量**。plan 已冻结（Q13），更正只记在本批注与 tracker 的 B2 note 里。
  >
  > **③ 自行裁定：Prompt 只点了角色表/标记/人数三处，但 B1 移交的五处陈旧行号在同一文件，一并改掉**（可否决）。留着会让 SKILL.md 与自己新增的表互相矛盾。五处只改**角色名归属**（旧 `:292`–`:295` → 秦构 / 陆阅 / 柯验；`:297`–`:298` 的术语一致性与答案核查仍归郑核与孙助，不变；旧 `:279` 的「四个层面」→ 七层面 22 人），**未写入 M2 / M3 / M4 的机制正文**（那是 B5–B7 的领地），一律用「门槛清单见 personas.md 的秦构条目」这类指针，避免对尚未存在的机制做前向引用。Phase 2/3 的「参与者：全员」**原样保留**（B3 明确要替换它），只在 Phase 3 末尾加「本节尚未完整（B3–B7 待写入）」提示。顺带把 Phase 4 由 6 步改为 9 步，插入第 5 步**「签发前三道门」**（秦构粘贴九项硬门槛实际输出 / 柯验三方对账表全一致 / 何疑放行全部对比结论；math 章另需岳自到场，任一未过退回 Phase 2）与第 8 步**「产出 4 份交付档案」**——这两条 B1 已写进 personas.md 但 SKILL.md 的流程此前不含，属同一处矛盾。
  >
  > **④ 自行裁定：苏绘从「教学支持」层拆出为独立「可视化」层**（可否决）。B1 为减少改动把苏绘留在教学支持层内，与 §3.8 的分组表不一致；B2 本就要重排分层表，顺手消解（personas.md 的「待补」清单里原登记了这条差异，现划掉）。层数 7 → 8：教学支持 = 2（孙助、郑核）、可视化 = 1（苏绘），plan §3.8 / SKILL.md / personas.md 三处自此一致。**苏绘仍是核心常设 4 人之一、每课必到，职责与产物未变**，只是归属层变了。
  >
  > **⑤ 自行裁定：岳自缺席 → 郑核不得签发 math 章课程**（可否决）。写进 personas.md「冲突解决」第 8 条（原 7 条一字未动，第 8 条明确标为例外）与 SKILL.md「数学基础章节规则」第 2 条。理由：该章 16 课的「假设读者只有高中数学水平」规则**只有岳自一人能检验**——小初的背景第 1 行就写着「学过微积分、线性代数、概率论、信号与系统」，当不了这个哨兵（实测 math 章现状：16 课只有 `complex-numbers` 1 门有 MDX 且 `status: "draft"`，A4 实测的 top-6 被依赖课即岳自的「第一批考场」）。与秦构的九项前端硬门槛同型：**岳自同样无否决权**，只能阻断签发流程；其余章的岳自缺席按 §3.7 M1 标 `[沉默-岳自：本课非 math 章]`，不阻断。
  >
  > **⑥ 自查：又编造了一次引用，已改**（B1 教训 ② 的第二次出现）。初稿在何疑的「与林码」分工边界里写「何疑按清单第 4 条『基线是否是当前公认做法』判不公平」——回读何疑实际的 6 条清单（`personas.md:423`–`:429`），第 4 条是**指标挑选偏差**，6 条里**没有任何一条覆盖「基线是否有代表性」**。已改为如实点名这个缺口、交 B7 写 §3.7 M4 时补为第 7 条；新增的互动第 22 条（林码 vs 何疑）也照这个真实缺口写，不再假装有对应条目。**教训重申：写「红队 / 审计」角色的人设时，最容易顺手编一个像样的条目号或数字——而人设文件是后续所有课程的依据。**
  >
  > **⑦ 移交 B3：新发现 Q22 —— 67 / 141 门课缺 catalog 的 `type` 字段，且这个集合恰好等于 A6 的 8 章范围**。实测逐章：classic 10/11 缺（唯一有 `type` 的是 A6-1 新增的 design-methods-comparison）、modern 10、robust 8、mpc 8、nonlinear 8、intelligent 7、rl-control 8、multi-agent 8，合计 **67**（其中 7 个章整章无 `type`）；已 typed 的 74 门分布在 9 个章（`history`3 / `math`16 / `theory`30 / `case`11 / `impl`11 / `frontier`2 / `learning`1）。**为什么现在报**：B3 要把 §3.6 的课型矩阵写进 SKILL.md，矩阵的输入就是 `type`，47% 的课无法据此决定谁到场，B3 写出来会是半张表。候选：(a) **随 A6 逐章回填**（推荐——A6 本来就要改这 8 章的 catalog 条目，零额外遍历，8 章做完 Q22 自动清空）；(b) 单独开条目一次性补 67 门（B3 不必等 A6，但与 A6 改同一批行、易冲突）；(c) 不补，B3 对这 8 章降级为「按章名猜课型」（不推荐：等于把未校验的推断当数据用）。详见 tracker 的 Q22 条。
  >
  > **⑧ 验收方式**：两个临时 Node 脚本（用完即删）。`b2-count.mjs` 先从 `content/catalog.ts` 实测逐章课数与 `type` 分布——**所有写进 personas.md 的数字都出自它，未采用 plan 的旧数**；`b2-verify.mjs` 核 **12 组 / 157 条断言，全通过**：① 行数（1119 / 357，均较 B1 收尾增长）+ 两文件的「22 名具名角色 + 14 类轮值」声明 + 无「20 名具名角色」「1 类轮值」残留；② personas.md 恰好 **23** 个 `###` 角色标题（22 具名 + 领域应用专家），22 个名字逐个命中；③ 分层表 7 个具名层求和 = 22、「具名合计」行声明 22、轮值行声明 14 类、苏绘已独立成层、教学支持 = 2、学生 = 6 且含林码岳自；④ 轮值表恰好 **14** 个数据行、14 个类名齐全、「当前规模 14 类」声明、匹配规则表在；⑤ 林码 / 岳自 各 8 项字段齐全（含设立依据、口头禅、§3.7 M1 沉默标记约定）、典型困惑 ≥5 条（实测 7）、「23 门」「math 16 课必到」「math 章 1/16 有 MDX」三处实测断言；⑥ SKILL.md 恰好 22 个 `[具名]` + 14 个 `[领域-X]` 标记 + `[沉默-XXX]` + 原三个流程标记；⑦ SKILL.md 8 个层标题齐全、标题人数求和 = 22、旧「可视化设计（1人）」已改名、林码/岳自 表行与两条必到说明、14 个类名齐全；⑧ **陈旧引用清零**——旧 `SKILL.md:279` `:292` `:293` `:294` `:295` `:297` `:298`、`personas.md:738`、旧三段式、「郑核负责验证格式」、「四个层面」全部不再出现于任一文件；⑨ 典型互动连续 **1–22**（新增 20/21/22 齐全）、冲突解决连续 **1–8** 且第 8 条 = 岳自 math 章门槛；⑩ Phase 4 三道门 / 4 份档案 / catalog `status` 同步提醒 / Phase 3 指针 / 统计行与 OUTLINE 由脚本生成的提醒；⑪ 逐行 markdown 配对（`**` / 反引号 / `（）` / `「」` / `【】` / `$`）；⑫ 所有表格每行列数一致。`npm run check` 退出码 0，**PASS 17 / WARN 36 / FAIL 0 与 A8 后完全一致**，底部统计数字无一变化（B2 不动 catalog 与正文）。`git status --short .agent/skills/wiki-discussion/` 只有 `personas.md` 与 `SKILL.md` 两项，符合「只修改两个文件」的约束（plan 勾选与 tracker 补记是既有惯例允许的例外，在此声明）。
  > **验收中修掉的是 2 处脚本 bug，文件未改一个字**（B1 教训 ③：先分清是脚本 bug 还是文件 bug）：① 断言正则要求加粗在「23 门」之后立刻闭合，而实际文案是「共 **23 门 = 全库 141 门的 16%**」（加粗一直延伸到百分数）——断言过严，已放宽为只匹配到「23 门」为止、不再要求紧跟闭合加粗；② 反引号奇偶校验把 SKILL.md `:352` 判为 9 个（奇数），实际该行有一处「用单反引号包裹的 python 三反引号围栏名」的合法 CommonMark 写法（行内代码里再含三反引号），且 `git show HEAD:` 证实同一行在 B2 之前就存在（旧 `:293`）——改为按 CommonMark 的**等长 run 配对**规则计数后通过。
  > **B2 的两条写作教训**：① **计划里的人数/课数一律先实测再写**——§3.4 的 29 课与 catalog 的 23 门差 6 门，若照抄就会让林码的人设建立在一个不存在的规模上，而人设文件是后续所有课程的依据；② **改分层表时要连带检查「层归属」是否三处一致**——B1 把苏绘留在教学支持层是当时的省事选择，但它让 plan §3.8、SKILL.md、personas.md 三处口径不同，拖到 B2 才消解；此类「为减少改动而留下的归属差异」应当场登记在待补清单里（B1 已登记，故 B2 能一次找到）。

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/semester-02-plan.md 的 3.4、3.5 节，
  以及 .agent/skills/wiki-discussion/personas.md 的"学生团队"与"轮值角色"两节、
  .agent/skills/wiki-discussion/SKILL.md 的角色表（约第 22-92 行）与"讨论标记约定"
  （约第 225-259 行）。

  任务：
  1. personas.md 学生团队新增 2 人，格式与现有 4 人一致（身份 / 背景 / 性格特征 /
     典型困惑 / 在讨论中的角色）：
     - **林码**：CS 硕士，熟练 PyTorch，控制理论零基础。服务于 rl-control（11 课）、
       intelligent（8 课）、multi-agent（10 课）共 29 课。典型困惑要写具体，例如
       "这不就是带约束的 policy gradient 吗，为什么要引入 Lyapunov"、
       "reward shaping 和 LQR 的 Q 矩阵加权有什么区别"、
       "为什么要费劲辨识模型，端到端学不是更省事吗"。
     - **岳自**：自学转行者，只有高中数学 + 一点 Python，无大学数学。是 math 章
       16 课的**必到哨兵**，检验 SKILL.md 第 272-282 行"假设读者只有高中数学水平"
       这条规则是否真的成立。典型困惑例如"矩阵是什么，为什么要乘"、
       "e 的矩阵次方怎么算"、"什么是凸集，为什么要求凸"。
  2. personas.md 轮值领域专家表从 7 类扩到 14 类，新增：新能源与储能、半导体制造
     装备、暖通与楼宇自控、船舶与水下机器人、过程安全与化工装置、农业与温室、
     量化金融与供应链。每类给出"适用章节"与"专家画像"，参照现有 7 类的详略程度。
  3. SKILL.md 同步更新：
     - "学生团队"表增加 2 行（注明岳自是 math 章必到、林码是学习类课程必到）
     - "讨论标记约定"增加全部新角色标记：
       验证团队 [柯验] [秦构] [何疑]；体验与脉络 [陆阅] [许史] [范安]；
       学生 [林码] [岳自]；流程标记增加 [沉默-XXX]
     - "轮值"标记说明补充新增的 7 类
     - 第 3 节角色体系的人数统计与分组标题同步更新为 22 人 + 14 类轮值，
       并按 semester-02-plan.md 3.8 的分组表重排（新增"验证团队"与"体验与脉络"两层）

  只修改 personas.md 与 SKILL.md 两个文件。
  ```

- [x] **B3 · 建立课型 → 上场角色矩阵**（2026-09-26 完成。`SKILL.md` 357 → **490 行**（`wc -l` 口径），在「讨论流程」之前插入《角色上场规则（B3 起）》一节共 **96 行 / 6 个小节 / 5 张表**，并改写 Phase 1–4 四段正文的「参与者」行。验收：矩阵覆盖全部 **7 种课型**，上场人数由临时脚本**解析表格自动算出**——`math` 8 / `theory` 8–9 / `impl` 9 / `case` 9–10 / `frontier` 9–10 / `learning` 9 / `history` 9，**全部落在 7–10**；`npm run check` 退出码 0、PASS 17 / WARN 36 / FAIL 0 与 B2 后完全一致。新发现 5 处（§3.6 的 6 门示例课全不存在、`learning` 规模差 11 门、safety-ftc 主责的 plan 内部矛盾、陆阅档案核查与 §3.6 名册冲突、`implementation-case-study` 是兜底规则的活反例）见下方补记。）
  - 做什么：把 3.6 的矩阵写入 SKILL.md，替换当前 Phase 2/3 的"参与者：全员"；写入主责教授的按章匹配规则
  - 涉及文件：`.agent/skills/wiki-discussion/SKILL.md`
  - 验收：矩阵覆盖 7 种课型；每种课型的上场人数（核心 4 + 追加）在 7–10 人之间

  > **完成补记（2026-09-26，用户预先授权自行决策，可否决）**
  >
  > **① 六项任务的落地位置**（新增一节《角色上场规则（B3 起）》，现 `SKILL.md:122`–`:217`）
  > - 任务 1（核心常设 4 人）→ §1，3 列表（角色 / 为什么是这 4 人 / **实质发言的阶段**）。Prompt 给的四条理由逐条照写；**自行加了第三列**——「每课必到」若不分阶段就会被读成「每阶段都要长篇发言」，与 §3.7 M1 的发言配额直接冲突，故写明郑核在 Phase 1/4、苏绘在 Phase 1/2、孙助在 Phase 2/3/4、柯验在 Phase 1/2/3 各干什么，并规定 **Phase 1 的共识条目里必须包含苏绘 / 孙助 / 柯验 各自的一句话结论**（可视化双轨分配 / 习题覆盖点 / 数值对账口径）。`math` 章另加岳自（B2 的硬规矩）在此重申。
  > - 任务 2（课型矩阵）→ §2，4 列表（课型 / 追加角色 / **上场总人数** / catalog 现存的典型课程）。追加角色逐字照 §3.6；「典型课程」列**没有照抄 §3.6**，理由见 ③；「上场总人数」列是 §3.6 没有的，为任务 6 的自检而加。
  > - 任务 3（主责按章）→ §3，10 行覆盖 16 章。safety-ftc 一行与 §3.6 不同，见 ⑤。
  > - 任务 4（如何读取课型）→ §4：正常路径（`content/catalog.ts:14` 的 `LessonMeta.type`）+ 实测现状（**74 门有 type / 67 门缺**）+ **8 行兜底映射表**（章 slug / 默认 type / 依据 / 已知例外）+ 3 条优先级纪律。
  > - 任务 5（Phase 参与者）→ §5 的 4 行表（阶段 / 必须到场 / 可选），并**同步改写 Phase 1–4 四段正文的「参与者」行**（现 `:224` `:247` `:276` `:325`），四段都逐条列出必须/可选。Prompt 点名的两条已写死在正文：Phase 3 必含柯验（三方对账表）+ 何疑（含定量对比时；无对比则标 `[沉默-何疑：本课无对比结论]`）+ 秦构（九项硬门槛并粘贴实际输出）；Phase 4 必含秦构 + 郑核。
  > - 任务 6（自检规则）→ §6，4 条：7–10 人硬约束（附当前实测结果）/ 去重与区间计数口径 / **不得为凑人数加角色**（§3.1 第 1 条：说不清「他要拦下哪一类返工」就不加）/ 新增课型时必须同步给出的四项。
  >
  > **② 验收：7 种课型的上场人数逐个数**（Prompt 明确要求写进报告）
  > `math` = 核心 4 + 方数、岳自、小初、陆阅 = **8**；`theory` = 核心 4 + 主责教授、林矩、钱锐、李稳、何疑 = **9**，主责教授正是林矩时去重取 **8**；`impl` = 核心 4 + 秦构、周联、何仿、赵工、林码 = **9**；`case` = 核心 4 + 吴规、赵工、范安、何疑 = 8，加轮值 1–2 类 = **9–10**；`frontier` = 核心 4 + 钱锐、林码、许史、何疑 = 8，加轮值 1–2 类 = **9–10**；`learning` = 核心 4 + 林码、钱锐、何疑、何仿、赵工 = **9**；`history` = 核心 4 + 许史、陈控、林矩、李稳、陆阅 = **9**。**7 种全部落在 7–10，无一超限，也无一低于 7。**
  > 这组数字**不是手数**：临时脚本 `b3-verify.mjs` 解析 §2 表格的「追加角色」单元格 → 去 `**` 与括注 → 匹配 22 人白名单 → 与核心 4 人去重 → 轮值按 1–2 计区间 → 再与表内「上场总人数」声明比对，7 行全部一致。同一脚本另断言：矩阵覆盖 7 种课型、12 个围栏标记成对、Phase 1–4 无「参与者：全员」残留、误置围栏内的引用块已移出、§3 覆盖 16 章、§4 覆盖 8 个缺 type 的章、§5 覆盖 Phase 1–4 且含指定角色、5 张表逐表列数一致、规模行已改「分 8 个层」——**FAIL 0**。
  > `npm run check` 退出码 0，PASS 17 / WARN 36 / FAIL 0 与 B2 后完全一致，底部权威统计无一变化（B3 不动 catalog 与正文）。
  > **「只修改 SKILL.md 一个文件」的核查方式**：本仓库从未提交（HEAD 仍是 A1 之前的 `dd1b29f`），`git status` 无法区分本阶段与前阶段的改动，故改用 mtime——B3 时段内仓库里只有 `SKILL.md` 被改写（05:23），`personas.md` 04:40 / `delivery-tracker.md` 04:51 / 本 plan 04:55 都是 B2 留下的。plan 勾选与 tracker 补记是既有惯例允许的例外，在此声明。
  >
  > **③ 新发现：§3.6 点名的 6 门「典型课程」一门都不存在**。逐个查 catalog 的 141 门：`lyapunov-modern`、`iss-small-gain`、`mu-analysis`、`bifurcation-chaos`、`economic-mpc`、`rl-analysis-validation` **全部不存在**；它们分别是 A6 第 2 章的改名目标（现 `modern/linear-system-theory`）、第 3 章待新增骨架（`iss-small-gain`、`bifurcation-chaos`）、第 4 章（`mu-analysis`）、第 5 章（`economic-mpc`）、第 7 章（`rl-analysis-validation`）。**裁定**：Prompt 要求「每种课型给 2-3 门典型课程作为例子」，举不存在的 slug 会让读者点进去 404，故 §2 的示例列一律改用 **catalog 现存课程**（每型 3 门，均已实测存在），表下注明这 6 门与 A6 章的对应关系，A6 建好骨架后可换回原名。
  > **顺带查出 §3.6 与实际数据的另两处偏差**：① `math` 行示例写「math 全 16 课」，实测 16 课里只有 `complex-numbers` 1 门有 MDX（且 `status: "draft"`）；② `impl` 行示例写「implementation 全 10 课、**discrete-sampled**」，但实测带 `type: "impl"` 的是 **11 门**（implementation 10 门 + `safety-ftc/functional-safety-standards`），而 **discrete-sampled 全 10 课的 type 是 `theory` 而非 `impl`**——即 §3.6 把 discrete-sampled 当 impl 举例，与 catalog 实值不符。这处的**操作性后果已写进 SKILL.md §3 的注**：discrete-sampled 的 `theory` 课里「主责教授」槽位由周联占（该章主责是工程侧），林矩以协查身份在场、不重复计人。plan 冻结，偏差不回改。
  >
  > **④ 新发现：`learning` 课型的期望规模与实际数据差 11 门**（已写进 SKILL.md §2 表下注）。§3.6 写「rl-control **11 课**、intelligent 第 **4–8** 课」；实测 rl-control 是 **8** 课、intelligent 是 **7** 课（第 4–6 课为 `expert-system` / `genetic-algorithm` / `fuzzy-neural-network`，第 7 课是 `intelligent-case-study`），故 `learning` 应有 8 + 3 = **11 门**，而 catalog 里带 `type: "learning"` 的**只有 1 门**（`safety-ftc/safe-rl`，A6 迁移期的并存条目）。与 B2 记录的「§3.4 的 29 课是旧数」同一根因：**plan 的规模数字写于 A5 全量重排之前**。裁定同 B2——SKILL.md 一律按实测写，plan 不改。
  >
  > **⑤ 新发现：plan 自身矛盾 —— safety-ftc 的主责是谁**。§3.6 的主责表把 `robust、nonlinear、safety-ftc` 三章一起归给卫韧；§3.3 的范安条目第 1 条明写「主责 `safety-ftc` 章 8 课」、否决权一行写「无，但对 `safety-ftc` 章有内容主责权」；`personas.md` 的「章主责教授」一行已按 §3.3 写（safety-ftc → 范安主责、卫韧协查）。**裁定：SKILL.md §3 按 §3.3 落地**（范安主责 + 卫韧协查鲁棒性），理由是该章 8 课的主体是 SIL/ASIL 定级、SIS、CBF/FDI/FTC 与认证约束，不是卫韧的鲁棒/非线性专长；且 §3.3 给范安的是**内容主责权**，与「谁协查鲁棒性」不是同一层级，两者可并存。矛盾记在此处与 SKILL.md §3 的注里。
  >
  > **⑥ 新发现：陆阅的档案核查职责与 §3.6 的名册冲突**。B1 给陆阅的职责之一是「核查每课 4 份交付档案是否齐备」，但 §3.6 只把他派给 `math` 与 `history` 两种课型 → **另外 5 种课型没有他在场，档案核查无人执行**。**裁定（不动 §3.6 的名册）**：档案齐备性是**签发前置条件，不因课型而免除**；陆阅在场时由他核查、郑核复核；不在场时由郑核直接核查，并在出席表记 `[沉默-陆阅：本课非 math/history 课型，档案核查由郑核代执行]`。已写进 SKILL.md §5 的注、Phase 3 的「体验与脉络审校」条目与 Phase 4 参与者行。`personas.md` 一侧的措辞统一留给 **B4**（讨论日志固定结构），因为 B3 只许改 SKILL.md。
  >
  > **⑦ 新发现：兜底规则的第一个活反例 —— `implementation-case-study`**。9 门 `*-case-study` 实测：3 门 `type: "case"`（estimation / identification / safety-ftc）、**1 门 `type: "impl"`（implementation）**、5 门无 type（classic / modern / mpc / robust / intelligent）。**裁定**：§4 的优先级第 1 条写死「**catalog 的实值永远压过兜底表**」，并点名这个反例——不按「`*-case-study` → `case`」改判它（叙述服从测量）。若 A6 认为它本该是 `case`，那是**改 catalog 数据**，不是改判读规则。
  >
  > **⑧ 自行裁定：Q22 不构成 B3 的阻塞**（可否决）。B2 把 Q22（67 门缺 `type`）登记为「移交 B3 的前置阻塞」，`personas.md` 的待补清单也这么写。复核 B3 的 Prompt 后判定**不阻塞**：任务 4 本身就要求「若字段缺失，给出章 slug → 默认 type 的兜底映射表」，即 Prompt 已预见缺失并指定了处理方式。故 B3 照原计划完成，Q22 的推荐处理仍是 **(a) 随 A6 逐章回填**；§4 的兜底表是这段期间的**受制裁的临时口径**，并附三条纪律：catalog 实值优先 / 本表是推断不是数据（67 门补齐后整节废弃，不得被其他文档当已校验来源引用）/ 新增课程必须直接写 `type`（`npm run check` 不校验 `type`，写错不会被拦下）。
  > **兜底表 8 行逐行标注了依据等级**：属「§3.6 明写」的只有 3 处（各章 `*-case-study` → `case`、rl-control → `learning`、intelligent 第 4–6 课 → `learning`）；其余全是「B3 推断」——classic / modern / nonlinear / mpc / robust 的 `theory` 默认值、multi-agent 的 `theory` 默认值、intelligent 第 1–3 课的 `impl`、`multi-agent-cooperation` → `case`、`multi-agent-rl` → `learning`。**A6 回填 `type` 时必须逐条核对这些推断行。**
  >
  > **⑨ 自行裁定：两处口径对齐**（可否决）。① **否决口径**：plan §3.1 第 3 条说「只设 3 个否决点：郑核（质量签发）、柯验、何疑」，而 `personas.md:25` 与 B2 后的 SKILL.md 说「有否决权的只有 2 人」。两处**不矛盾，是计数口径不同**——柯验 / 何疑 行使**内容级否决权**（对账不一致 / 对比未放行 → 打回 Phase 2），郑核行使**签发级闸门**（不签就不算交付，不是内容否决）。已在 SKILL.md 的规模引用块里写清这个区分，不再让「2 人 vs 3 点」看起来像矛盾；`personas.md` 不改（B3 只许改 SKILL.md），措辞统一留给 B4。② **层数口径**：SKILL.md 的规模行原写「分 7 个层」，与 `personas.md:7` 和 plan §3.8 的「8 个层」不符（B2 改层数时漏了这一行），已改为「分 8 个层（7 个具名层 + 轮值层）」，并把「概述」的「七个层面」限定为「七个具名层面（外加轮值领域专家）」，与 frontmatter 的措辞一致。
  >
  > **⑩ 计划外补记：Prompt 只点了「参与者」行，但同一批矛盾还有 6 处，一并改掉**（可否决）。留着会让新增的《角色上场规则》与下方流程正文互相打脸。
  > - **Phase 1 正文**：第 1–7 步逐条加「按章主责 / 按课型必到」的条件（原 7 步是无条件的四位教授 + 周联 + 吴规 + 轮值，等于隐性全员）；新增第 8–10 步（苏绘 / 孙助 / 柯验 各一句话结论）与第 11 步的共识要求——否则 §1 那句「Phase 1 的共识条目里必须包含三人的一句话结论」在流程正文里没有落点。
  > - **Phase 2 正文**：第二轮学生反馈由 4 人扩到 6 人（补林码、岳自）并逐人标课型；第三轮补两步（苏绘定视觉规范：坐标轴固定范围 / `animation: false` / 控件选型；柯验列三方对账清单）；何仿一步补「写明每个数字的产出路径」（B1 的职责转移）。
  > - **Phase 3 正文**：新增「验证团队审校」（柯验 / 秦构 / 何疑）与「体验与脉络审校」（陆阅 / 许史 / 范安）两组条目，工程组标课型，学生审校由 3 人扩到 6 人并逐人标课型。**只写职责、产物与放行位置，判定细则一律用指针**（对账表格式见 `personas.md` 柯验条目、九项门槛清单见秦构条目、放行三条件见何疑条目与典型互动 12），M2 / M3 / M4 正文留给 B5 / B6 / B7，**不做前向引用**（B2 教训）。
  > - **修掉 B2 留下的一处渲染 bug**：Phase 3 末尾那条「本节尚未完整（B3–B7 待写入）」引用块**原本误置于代码围栏内**（围栏 165 开、191 闭，引用块在 190 行），会被当纯文本渲染、markdown 校验也查不出来。已移出围栏并改写为「B5–B7 待写入」，同时写明 B3 已完成的部分。
  > - **「使用方式」**：新增第 2 步「读取课型、定上场名单」（原 6 步 → 7 步），把 §1–§5 串成可执行顺序；第 3 步的轮值匹配规则改指 `personas.md` 的「轮值角色」节；第 6 步补「签发前先过 Phase 4 第 5 步的三道门」。
  > - **「讨论标记约定」**：`[沉默-XXX]` 的说明由「按 §3.6 应到而未到」改为指向本文件《角色上场规则》§2 / §5，并补一句**「`math` 章的岳自、九项硬门槛的秦构是例外：他们不能用标沉默代替到场」**（依据 `personas.md` 冲突解决第 7、8 条）。
  >
  > **⑪ 验收方式：两个临时 Node 脚本（用完即删）**。`b3-count.mjs` 从 `content/catalog.ts` 实测——§3.6 的 6 门示例课是否存在、逐 type 的课程清单（含 `status`）、9 门 `*-case-study` 的 type、intelligent / multi-agent / rl-control 的逐课 type 与标题、逐章缺 type 的课名；**SKILL.md 里的每一个数字与 slug 都出自它**。`b3-verify.mjs` 见 ②。两个脚本都用 `JSON.parse`，**未使用 `eval` / `execSync`**；解析 catalog 沿用 A7 记录的两个坑的解法（先 `indexOf("=")` 再找 `[`、滤掉整行 `//` 注释），并补第三个坑：**必须按括号深度截断到数组闭合处**，因为 `catalog.ts` 在数组之后还有别的导出，否则 `JSON.parse` 报 `Unexpected non-whitespace character after JSON`。
  >
  > **⑫ 教训**：① 延续 B2 教训 ①——**plan 里的课程 slug 与课数一律先实测再写**。这次三处偏差（6 门示例课 100% 不存在、`learning` 差 11 门、discrete-sampled 的课型与示例不符）是同一个根因：plan 写于 A5 重排之前。**B4–B8 再引用 plan 的课程名时同样要先查 catalog。** ② 新增——**兜底表 / 推断表必须自带「这是推断」标签与废弃条件**。§4 若不写明「本表是推断不是数据、67 门补齐后整节废弃、不得被其他文档当已校验来源引用」，下一阶段很可能把它当课型权威引用，把未校验的推断固化成数据（这正是 Q22 候选方案 (c) 被否的理由）。③ 新增——**引用块别写进代码围栏里**：B2 留的那条指针在围栏内，渲染成纯文本且逃过 markdown 配对校验，本次靠逐行围栏状态跟踪才查出来；凡在带围栏的小节末尾追加说明，先确认围栏已闭合。

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先完整阅读 .agent/skills/wiki-discussion/SKILL.md，
  特别是"讨论流程"一节（Phase 1-4，当前 Phase 2 与 Phase 3 都写"参与者：全员"），
  以及 .agent/semester-02-plan.md 的 3.1、3.6 节。

  前置条件：B1、B2 已完成（新角色人设已写入）。

  背景问题：候选角色池扩到 22 人后，若每课全员到会，讨论会冗长且出现凑数发言。
  需要改为"核心常设 + 按课型选配"。

  任务：在 SKILL.md 的"讨论流程"之前插入一节"角色上场规则"，内容包括：
  1. **核心常设 4 人**（每课必到）：郑核（主持 / 签发）、苏绘（可视化决策）、
     孙助（习题与翻译）、柯验（数值对账）。逐条说明为什么是这 4 人
     （郑核=签发责任；苏绘=每课都要做可视化决策；孙助=每课都要出习题；
     柯验=每课都有数值断言需要对账）。
  2. **课型 -> 追加角色矩阵**（7 种课型：math / theory / impl / case / frontier /
     learning / history），照 semester-02-plan.md 的 3.6 表写入，并为每种课型给
     2-3 门典型课程作为例子。
  3. **主责教授按章匹配规则**，照 3.6 节的表写入。
  4. **如何读取课型**：从 content/catalog.ts 的 LessonMeta.type 字段读取。
     若字段缺失，给出"章 slug -> 默认 type"的兜底映射表。
  5. 修改 Phase 1-4 每阶段的"参与者"行，从"全员"改为按矩阵确定的角色子集，
     并说明每阶段哪些角色是必须的、哪些可选。特别是：
     - Phase 3 必须包含柯验（数值三方对账）与何疑（红队审查，若本课含定量对比）
     - Phase 4 必须包含秦构（前端硬门槛）与郑核（签发）
  6. 加入一条自检规则："矩阵中每种课型的上场人数（核心 4 + 追加）应在 7-10 人
     之间，超出则精简追加角色。"

  只修改 SKILL.md 一个文件。改完后逐个数一遍 7 种课型的上场人数，确认都在 7-10
  之间，把结果写在报告里。
  ```

- [x] **B4 · 引入发言纪律与讨论日志固定结构**（2026-09-26 完成。`SKILL.md` 490 → **713 行**（`wc -l` 口径，+223），在「讨论流程」与「输出格式规范」之间插入两节：《发言纪律（B4 起）》`:351`–`:414`（4 小节）与《讨论日志固定结构（B4 起）》`:416`–`:562`（4 小节，含一份 95 行的 markdown 骨架模板）；另同步 5 处内部指针。验收：M1 四项逐条落地（配额 / 沉默标记 + 3 示例 / 禁止的发言类型 + ✗✓ 改写例 / 流程标记登记）；Prompt 的 10 项内容全部映射到骨架位置并列出**8 处与既有实践的取舍及理由**（取舍依据是对 11 篇日志的实测统计，不是印象）；重读 `02-phase-plane.md` 与 `01-fuzzy-control-basics.md` 后**采纳了既有实践里更好的两处**（Phase 4 汇总行的 P0/P1 分级、`[郑核-复核签发]` 标记）；`npm run check` 退出码 0、PASS 17 / WARN 36 / FAIL 0 与 B3 后完全一致；只改 SKILL.md 一个文件（mtime 实证）。新发现 4 处见下方补记。）
  - 做什么：把 3.7 M1 写入 SKILL.md；规定讨论日志的固定章节结构（含出席与沉默表）
  - 涉及文件：`.agent/skills/wiki-discussion/SKILL.md`
  - 验收：讨论日志结构与 `docs/discuss-log/semester-01/` 既有实践不冲突

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/skills/wiki-discussion/SKILL.md 的
  "讨论标记约定""输出格式规范""注意事项"三节，读 2 篇现有讨论日志
  （docs/discuss-log/semester-01/07-nonlinear/02-phase-plane.md 与
  docs/discuss-log/semester-01/08-intelligent/01-fuzzy-control-basics.md）了解既有实践，
  再读 .agent/semester-02-plan.md 的 3.7 M1 与 3.3 陆阅条目。

  任务：在 SKILL.md 中新增"发言纪律"与"讨论日志固定结构"两节：

  A. 发言纪律
  1. Phase 2 每角色每轮最多 3 条发言，超出必须合并为一条。
  2. 无实质贡献的角色显式标记 [沉默-<角色>：<原因>]，写入讨论日志的出席表。
     给出 3 个示例：[沉默-范安：本课无安全相关内容]、
     [沉默-许史：本课无历史脉络可补充]、[沉默-吴规：本课不涉及上游规划接口]。
  3. 明确禁止的发言类型："我同意 XX 的观点""这个很重要""说得对"等无信息发言。
     给出一组改写示例（把无信息发言改成有信息发言）：
       ✗ [小初] 我觉得这段讲得很好。
       ✓ [小初] 第 3 节从传递函数跳到状态空间时，没说清"状态"到底选哪几个变量，
         我第一遍以为是随便选的。
  4. 在"讨论标记约定"的"流程标记"下增加 [沉默-XXX] 标记说明。

  B. 讨论日志固定结构
  规定讨论日志必须包含以下章节（顺序固定）：
    1. 课程标识（章 / 课 slug、标题、学期 termNum、交付日期）
    2. 出席与沉默表（上场角色 + 沉默角色及原因）
    3. Phase 1 内容规划记录
    4. Phase 2 内容生成记录（三轮）
    5. Phase 3 审校记录
    6. 共识与待定清单
    7. **附录 A：柯验的数值三方对账表**（注明"这是全部实测数据的唯一留存副本"）
    8. **附录 B：秦构的前端硬门槛清单输出**
    9. **附录 C：何疑的红队放行记录**（若本课含定量对比）
    10. 郑核签发结论
  参照 nonlinear-characteristics 讨论日志附录 A 的既有做法保持一致性。

  重要：改完后重新读一遍那 2 篇现有讨论日志，确认新结构与既有实践不冲突。
  如有冲突，以既有实践中更好的部分为准，并在 SKILL.md 中说明取舍理由。

  只修改 SKILL.md 一个文件。
  ```

  > **完成补记（2026-09-26，用户预先授权自行决策，可否决）**
  >
  > **① 两节的落地位置与 M1 四项的对应**
  > - 《发言纪律（B4 起）》`SKILL.md:351`–`:414`，4 小节。M1-1 发言配额 → §1（2 行表：Phase 2 每轮最多 3 条 / 常态 1 条；Phase 1、3、4 每阶段最多 3 条）；M1-2 沉默机制 → §2（三个示例逐字照抄 + 第四个既有示例 `[沉默-岳自：本课非 math 章]` + 「原因必须可核查」的 ✗✓ 三例 + 岳自/秦构两个不得沉默的例外）；M1-3 禁止的发言类型 → §3（三类点名 + **B4 补的可操作判定标准**：「删掉后读者不损失任何可核查信息即为无信息发言」，可核查信息只有五种——数字含产出路径 / 小节名或屏位 / 反例 / 出处 / 可判定的判定标准；两组 ✗✓ 改写例，第一组照 M1 原文，第二组的 ✓ 取自 `02-phase-plane.md:86` 的实写）；M1-4 → §4 + 「讨论标记约定 → 流程标记」的 `[沉默-XXX]` 条目（原有的「正文由 B4 写入」前向引用已兑现并删除）。
  > - 《讨论日志固定结构（B4 起）》`:416`–`:562`，4 小节。§1 是一份 95 行的 `markdown` 骨架模板（顺序不可调）；§2 是 Prompt 的 10 项 → 骨架位置的映射表，每行附「与既有实践的关系」；§3 是 8 处取舍及理由；§4 是 10 条机器可校验的口径，并注明应进 E1 的 `scripts/verify-lesson.mjs`（与 M3 元规则同族），落地前由陆阅人工核、郑核复核。
  >
  > **② 10 项内容的落点**（§2 映射表）：1 课程标识 → 标题行 + **7 行**元数据（既有 6 行，新增「课型」）；2 出席与沉默表 → 新增 H2（既有 0/11），4 列 = 角色 / 状态 / 实质发言的阶段 / 沉默原因；3–5 → Phase 1 / Phase 2（三轮）/ Phase 3（**6 个**分组，比既有多出「验证团队」与「体验与脉络」，因这两层 B1 才设立）；6 共识与待定 → **不设顶层章节**，`[共识]` 留在 Phase 1 末尾（既有 11/11）、`[待定]` 新增强制出现在 Phase 4 签发前（既有 0/11，无待定也要写「无」）；7 附录 A → 拆 **A.1 三方对账表（柯验）+ A.2 实测数据总表（何仿出数，每行注明产出路径）**，「全部实测数据的唯一留存副本」这句注明挂在附录 A **整体**上；8 附录 B → 秦构九项硬门槛实际输出，既有的「附录 C：环境与工具链 / 浏览器端到端验证」并入；9 附录 C → 何疑红队放行记录（新增，无对比结论时写 `[沉默-何疑：…]`）；10 郑核签发 → 留在 Phase 4 内。既有「附录 B：旧稿错误 → 修正对照」**顺延为附录 D，一字不删**（它是 B5「叙述服从测量」的正例来源，也是 M5 fix-log 归因的原始素材）。
  >
  > **③ 8 处取舍的实测依据**（Prompt 要求「以既有实践中更好的部分为准并说明理由」；全部数字由临时脚本对 11 篇日志实测得出，非印象）：既有日志只在 `## Phase 1`–`## Phase 4` 四个 H2 上 11/11 一致，其余变体 = 元数据 2 种 / **附录 4 种形态**（A-B-C 三件套 4 篇、只有附录 A 1 篇、无字母的单个「附录」4 篇、整块缺失 2 篇）/ 附录 A 表头 2 种（3 列 3 篇、2 列 1 篇）/ 发言标记 2 种 / H2 冒号半角 10 篇全角 1 篇 / 标题形态 9-1-1 / `参与者：` 行 9 篇有 2 篇无 / `[郑核-签发]` 缺 1 篇 / Phase 2 三轮小标题缺 1 篇。**采纳既有更好部分 2 处**：Phase 4 的 `[郑核]` 汇总行按 `04-lyapunov-stability.md:118` 起的 9/11 篇形态写（按角色列条数 + 标 P0/P1 + 无 P0 时明写「无 P0 阻断项」，比「汇总 N 条」多出「有没有被阻断过」的可追溯性）；`[郑核-复核签发]` 保留为合法标记（既有实践见 `05-feedback-linearization.md:192`，签发后发现 3 处叙述被实测推翻 + 1 处全站级组件 bug 而重签），口径为「`[郑核-签发]` 仍恰好 1 次、复核签发不限次数但每次必须写明重签理由」，且它是 `[郑核-签发]` 的**变体而非第 5 个流程标记**，故 B2/B3 的「4 个流程标记」计数不变。**其余 6 处取多数派或按 Prompt 语义固定**：附录字母按 Prompt 语义重排（因为 B5/B6/B7 会把 M2/M3/M4 分别挂到 A.1/B/C 三个字母上，字母错位会让后续三阶段全部指错地方）；A.2 取 3 列表头（多出的「来源」列正是产出路径，没有它「可溯源」无法核查）；`参与者：` 行只在 Phase 1 写一次且不加修饰（既有 9/11 形态），各阶段到场情况改由出席表的「实质发言的阶段」列承载——重复写 `参与者：` 行**无法表达「到了但没发言」**；Phase 1 的发言顺序裁定为「三条一句话结论在 `[共识]` 之前、`[苏绘]` 的详细展开保留在 `[共识]` 之后（可选）」，因为 B3 已把那三条定为共识的**输入**，输入必须在结论之前，而既有 9/9 篇的「共识后紧跟苏绘展开」信息量更大（`02-phase-plane.md:36` 写出了两个组件的面板构成与硬约束），两者都保留且不违反配额（Phase 1 每角色最多 3 条，苏绘 2 条）；`交付清单：` 行由 3/11 升为必填（它是陆阅核查交付完整性的落点）。
  >
  > **④ 同步的 5 处内部指针**（只改 SKILL.md，未动 personas.md）：Phase 2 围栏内加发言配额提醒；Phase 4 第 6 步加「签发块前必须有 `[待定]`」、第 8 步加 **B4 口径澄清**；《角色上场规则》§5 末尾那条 B3 遗留的「`personas.md` 一侧的措辞待 B4 统一」改为已裁定 + 未同步说明；「讨论标记约定 → 流程标记」四个标记各加次数口径；「使用方式」第 4、5 步加《发言纪律》与《讨论日志固定结构》指针。
  >
  > **⑤ 验收实证**：重读 `02-phase-plane.md`（168 行）与 `01-fuzzy-control-basics.md`（180 行）**全文**后逐节比对，冲突全部落在上面 ③ 的 8 处取舍里，无未登记的冲突；结构校验脚本对 SKILL.md 跑出 **0 个真问题**（代码围栏 16 个成对且无嵌套、表格列数一致、剥离行内代码后 `**` 全部成对、无残留前向引用、10 项映射 / 8 处取舍 / 10 条口径齐备、骨架模板的 21 个标题逐条正确）；`npm run check` 退出码 **0**、PASS 17 / WARN 36 / FAIL 0，与 B3 后逐字一致；「只修改一个文件」由 mtime 实证——`find -newermt "2026-09-26 05:35"` 只返回 `SKILL.md` 与 `logs/dev.log`（dev 服务器日志，非源文件），`personas.md` 仍是 B2 的时间戳。
  >
  > **⑥ 新发现 4 处**（登记，均不阻断）
  > 1. **plan §3.7 M2 的一处描述与实测不符**：M2 说三方对账表要「参照 `nonlinear-characteristics` 讨论日志附录 A 的既有做法」，但该日志的附录 A（`:132`–`:134`）实际是 3 列的**实测数据总表** `| 来源 | 量 | 实测值 |`，不是 M2 自己规定的 5 列对账表。B4 的处理 = 两者都保留（A.1 + A.2），不按 M2 的字面把附录 A 换成对账表。**B5 落地 M2 时须沿用这个拆分，不要把 A.2 删掉**——它承担着郑核「无知识幻觉」核查的实际职能（同文件 `:112`）。与 B2 的「29 课 vs 实测 23 门」、B3 的「§3.6 的 6 门示例课全不存在」同族。
  > 2. **`personas.md` 陆阅条目的措辞仍未同步**：B1 写的是「核查 4 份交付档案（讨论日志 / 三方对账表 / 红队放行记录 / 九项硬门槛输出）是否齐备」，读起来像 4 个独立文件。**B4 裁定：这 4 份是同一个讨论日志文件里的 4 个部分**（Phase 1–4 正文 / 附录 A.1 / 附录 B / 附录 C），既有 11 篇本来就是这么放的，只是从未写明。口径已写进 SKILL.md 的 Phase 4 第 8 步，但 B4 的改动范围限定为单文件，故 personas.md 一侧留给下一次触及它的阶段（B5 会改 personas.md 的柯验段，可顺带）。
  > 3. **既有 11 篇日志里 `[孙助]` 与 `[柯验]` 在 Phase 1 出现 0 次**：`[孙助]` 的首次发言都在 Phase 2 第三轮，`[柯验]` 全文 0 次（B1 才设立的角色）。所以 B3 要求的三条一句话结论里，只有苏绘那条有既有实践支撑，孙助与柯验属**新增要求**。
  > 4. **结构最薄的日志与 Q21 是同一门课**：`03-neural-network-control.md` 57 行，Phase 2 与 Phase 3 之间只隔 4 行、无三轮小标题、无 Phase 3 分组、无附录、无 `[郑核-签发]`、无 `参与者：` 行——而它正是带着 Q21 那条未放行对比结论（「超越 PID 5.3%」）的课程。这是「结构不固定 ⇒ 档案齐备性无法机械化核查」的直接证据，已写进《讨论日志固定结构》的开篇依据。
  >
  > **⑦ 自行裁定项清单**（用户预先授权，可否决）：Phase 1/3/4 的配额（M1 只规定了 Phase 2）；「删掉后不损失可核查信息」这条判定标准与五种可核查信息；`[待定]` 强制出现且无待定写「无」；附录拆 A.1/A.2 并把字母按 Prompt 语义重排、既有附录 B 顺延为 D；采纳 P0/P1 分级与 `[郑核-复核签发]`；`交付清单：` 升为必填；Phase 1 发言顺序的「前置一句话 + 后置展开」双保留；`personas.md` 的同步推迟到 B5。

- [x] **B5 · 引入数值三方对账机制（柯验）**（2026-09-26 完成。`SKILL.md` 713 → **859 行**（`wc -l` 口径，+146），`personas.md` 1119 → **1146 行**（+27）。SKILL.md 新增《数值三方对账（B5 起）》一节（`:600`–`:708`，7 个小节）插在《讨论日志固定结构》与《输出格式规范》之间；Phase 3 柯验条目改写为**独立步骤 1→5**、Phase 4 第 5 步给出「对账表全部通过」的**四条操作定义**、《讨论日志固定结构》§4 追加第 **11–13** 条机器可校验口径（收尾行「这 10 条」→「这 13 条」）、A.1/A.2 骨架各加一段填写占位说明；另同步 8 处内部指针（角色体系柯验行与郑核行、《角色上场规则》Phase 4 行、Phase 1 第 10 条、Phase 2 第 13 条、Phase 3 郑核条目、Phase 4 参与者行、注意事项双轨制条目）。personas.md 柯验清单由 8 条重组为 **4 组 23 条**（A 必查陷阱 4 / B 通用一致性 4 / C 对账范围九类 9 / D 判定与反篡改 6）。验收：临时脚本 **51 组断言全通过**；三条验收项逐条命中；`npm run check` 退出码 0、**PASS 17 / WARN 36 / FAIL 0** 与 B4 后完全一致（B5 不动 catalog 与正文）；只改两个文件（mtime 实证）。**新发现 4 处**（M2 示例三行有两处数值列错位 + 一处伪造正文断言、M2 正例归因不准、B4 取舍 ② 引用错、B1 记录的「柯验 8 条」已过期）见下方补记。**收尾更正（第 5 处新发现）**：本条初记「858 行 / `:599`–`:708`」，系 SKILL.md 最后一次写入（8 处指针同步）**之前**的读数；收尾时以 `wc -l` 复核为 **859 行**、章节实际起于 **`:600`**（下一个 H2 在 `:710`），已按实测更正本文件、tracker、personas.md 与三份记忆共 **6 处**。这是 B1 教训 ④「行数一律以 `wc -l` 为准」的**第二次同族复发**——变体是「测量时点早于最后一次写入」，故纪律加一条：**行号与行数必须在全部编辑完成后、写记录之前复测一次**。）
  - 做什么：把 3.7 M2 写入 SKILL.md 的 Phase 3 与 Phase 4，规定对账表为强制产物与签发前置条件
  - 涉及文件：`.agent/skills/wiki-discussion/SKILL.md`、`.agent/skills/wiki-discussion/personas.md`（柯验职责段）
  - 验收：Phase 3 含对账表模板；Phase 4 签发条件含"对账表全部通过"；三条 fix-log 陷阱写入柯验必查项

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/skills/wiki-discussion/SKILL.md 的
  Phase 3 与 Phase 4、.agent/fix-logs/INDEX.md 的 014 / 016 / 018 三条及其详情文件、
  .agent/semester-02-plan.md 的 3.7 M2 与 3.3 柯验条目。

  前置条件：B1 已完成（柯验人设已写入 personas.md）。

  背景：fix-014（组件默认参数画不出正文手算例 A₀=4/(3π)，且交点检测只算 Nyquist
  穿越点导致无极限环时误报）、fix-016（rk4 抽稀后时间换算用 T/steps 而非
  T/(len-1)，使周期读数小 keep 倍）、fix-018（有记忆非线性预热末相位不等于扫描
  起始相位，导致间隙环面积少算 38%：0.52 vs 手算 0.84）三条都是同一类问题：
  正文数字、notebook 输出、组件默认读数三者不一致，而现有验收手段（页面 200、
  H2 数、katex-error）全部查不出来。

  任务：
  1. 在 SKILL.md 的 Phase 3 中新增独立步骤"数值三方对账"，由柯验执行，规定：
     - 必须产出对账表，给出 markdown 表格模板（列：# / 正文断言 / notebook 输出 /
       组件默认值读数 / 是否一致 / 备注），并用 semester-02-plan.md M2 中的三行
       真实例子填充示意。
     - 对账范围：正文中出现的**每一个**数值断言——手算结果、仿真读数、性能指标、
       极限环幅值与周期、稳态误差、超调量、增益 / 相位裕度、收敛时间、RMSE。
     - 任一不一致 -> 打回 Phase 2，禁止进入 Phase 4。
     - 对账表必须原样写入讨论日志附录 A，并注明"这是全部实测数据的唯一留存副本"。
  2. 在 Phase 4 的签发条件中增加一条："柯验的三方对账表全部通过"。
  3. 明确"叙述服从测量"原则的操作细则：测量与预期不符时，只允许 ① 改叙述，或
     ② 改实验设计（含重新整定基线），**不允许改数据**。给出 1 个正例
     （adaptive-control-basics 的 18 条修正：γ 过大导致振荡发散，遂把"γ 越大收敛
     越快"改写为"γ 存在上界"）和 1 个反例（把组件读数改成和正文一致 = 篡改测量
     以迁就叙述，属严重违规）。
  4. 在 personas.md 柯验的职责清单中，把上述对账范围逐项列为可勾选检查项，并
     特别写入三条从 fix-log 提炼的必查陷阱：
       - 交互组件的默认参数必须恰好复现正文手算例（fix-014）
       - 时间轴换算必须用 T/(len-1)，不能用 T/steps（fix-016）
       - 有记忆非线性（间隙 / 滞环）的预热末相位必须等于扫描起始相位（fix-018）
       另加：交点 / 极值 / 穿越点检测必须有覆盖性判据，否则会在解不存在时误报（fix-014）

  只修改 SKILL.md 与 personas.md 两个文件。
  ```

  > **完成补记（2026-09-26，用户预先授权自行决策，可否决）**
  >
  > **① §3.7 M2 的三行示例有两处数值列错位、一处伪造了「正文断言」——按实测更正后才写进 SKILL.md**（plan 冻结，不回改）。这是 B5 最重要的一条发现：**M2 本身就是防止「写出来的数当成算出来的数」的机制，而它的示例三行有两行半正是这种数**。逐行核对结果：
  > - **第 1 行**（`| 1 | A₀ = 4/(3π) = 0.4244 | 0.42441 | 0.4244 | ✅ |`）：组件列写 0.4244，**实测组件读数是 0.4241**（`content/nonlinear/describing-function.mdx:333` 明写「面板显示 A=0.4241、ω=1.4151」，差来自组件按 0.05 rad/s 网格找穿越点再用 60 步二分反解 A）；notebook 列写 0.42441，**实测 notebook 给的是时域仿真基波 0.445089（+4.87%）**（同文件 `:327`）——0.42441 这个数在两路里都不存在，它是手算值 0.424413 的四舍五入，被当成了「notebook 输出」。
  > - **第 2 行**（`| 2 | 极限环周期 T = 6.381 s | 6.380664 | 6.381 | ✅ |`）：**两个数值列整个写反了**——6.380664 是**组件**读数（fix-016 修完后的 PhasePlaneExplorer 实测），notebook 给的是 **6.380676**（`content/nonlinear/phase-plane.mdx:18`、`:150`–`:154`，5 组初值同值）；而 6.381 **谁都不是**，正文的渐近式值是 2π(1+μ²/16) = 6.381360（`:160`，相对误差 0.011%）。
  > - **第 3 行**（`| 3 | 间隙环面积 = 4cA = 0.84 | 0.839999 | 0.840 | ✅ |`）：**把两个不同的非线性混成了一行，并据此伪造了一条正文断言**。4cA 是**滞环**的环面积公式，默认参数（A=1.5、k=1、c=0.2）下 = **1.200000**，这才是正文断言的值（`nonlinear-characteristics.mdx:342`、`:649`、`:1524`，与解析差 7.4e-9）；**间隙**（2b=0.6、A=1）的环面积手算 = 0.18+0.48+0.18 = **0.84**、组件实测 0.839999（fix-018），但**正文从未断言过 0.84**。按 A.1「一行一个正文断言」的口径，间隙的 0.839999 应进 **A.2**（实测数据总表）而不占 A.1 的一行。
  > - **处置**：SKILL.md《数值三方对账》§2 的示例三行改用**实测值**填（0.424413 / 0.445089 / 0.4241；6.380676 / 6.380664；滞环 1.200000 三路同值），每格附 file:line，并把三行的备注写成 fix-014 / fix-016 / fix-018 的教训行；第 3 行的备注显式写明「间隙的 0.84 是手算值、正文并未断言它 → 进 A.2」。这是 B2「29 课 vs 实测 23 门」、B3「§3.6 的 6 门示例课全不存在」、B4「附录 A 参照错」之后**同一族的第 4 处**：plan 的示例数据没有经过实测。
  >
  > **② M2 的正例归因不准 → 拆成两个正例**。plan 写「`adaptive-control-basics` 讨论日志含 18 条『叙述服从测量』修正——正文原写『γ 越大收敛越快』，实测显示 γ 过大导致振荡发散，遂改写为『γ 存在上界』」。实测：γ 那段叙述**确实在正文里、也确实是测量驱动的**（`adaptive-control-basics.mdx:29` 的「直觉待拆」表行给出 0.00675 → 0.04060 per s 与 γ=200/1000 的残差、`:2039` 小结给出「γ 存在一个上界，上界由未建模动态的带宽决定」、`:2666` 给出 Rohrs 型实验 γ≤3 有界 / γ≥4 发散、发散时间 5.20 s → 0.76 s、dt 减半结果一致），**但它不在日志附录 B 那 18 条编号修正里**——它是「一开始就按实测写、所以从未被推翻」的例子，不是「写完后被测量改正」的例子。把两者混为一谈会让读者去 18 条里找不到这条。**处置**：SKILL.md §6 拆为**正例 A**（一开始就按实测写，附三处 file:line）与**正例 B**（写完后被推翻，从 `08-adaptive-control-basics.md:171`–`:190` 的 18 条里挑最能说明问题的 #8 编造/算错的三个数、#9 旧稿低估自己的实验、#10 实验根本没做过、#16 噪声标定的方法论级 bug）。
  >
  > **③ 更正 B4 交付文本里的两处引用错误**（B5 有权改 SKILL.md，故就地更正）。B4 的《讨论日志固定结构》§3 取舍 ② 写「表头两种：`| 来源 | 量 | 实测值 |` 见 01、02、**03-describing-function**；`| 项 | 值 |` 见 fuzzy 01」，同节开篇 blockquote 写「附录 A 表头 2 种」。**逐篇实测有 5 种**：`| 来源 | 量 | 实测值 |` **2 篇**（`01-nonlinear-characteristics.md:134`、`02-phase-plane.md:128`）、`| 实验 | 预测 | 实测 |` **3 篇**（`06-sliding-mode-control.md:133`、`07-backstepping.md:131`、`08-adaptive-control-basics.md:133`）、`| 编号 | 实验 | 关键结果 |` 1 篇（`03-describing-function.md:138`）、`| 实验 | 场景 | IOL | Jacobian | 结论 |` 1 篇（`05-feedback-linearization.md:142`）、`| 项 | 值 |` 1 篇（`08-intelligent/01-fuzzy-control-basics.md:122`）；另 `02-fuzzy-controller-design.md:147`–`:188` 是按 notebook 分组的 5 张性能表（无统一表头），`04-lyapunov-stability.md` 与 `03-neural-network-control.md` 整块无表格。即 B4 把 `03-describing-function` 归错了表头、把 2 篇写成 3 篇、并漏了 4 篇。**A.2 定为 3 列 `| 来源 | 量 | 实测值 |` 的裁决不变**，但理由从「3 篇优于 2 篇」换成不依赖篇数的说法（「来源」列就是产出路径，没有它可溯源无法核查）；并新增一条：`| 编号 | 实验 | 关键结果 |` **可接受为等价形态**（编号 E1b–E9b' 能反查到 cell），存量不回改。
  >
  > **④ B1 记录的「柯验清单 8 条、六人共 42 条」已过期**：B5 把柯验重组为 **4 组 23 条**（A 必查陷阱 4 / B 通用数值一致性 4 / C 对账范围九类 9 / D 判定与反篡改 6），故六人合计由 42 条变为 **57 条**。每条仍括注 fix-log 编号或已记录事故，无一条空泛职责。plan 冻结，更正只记在本补记与 tracker。
  >
  > **⑤ 自行裁定项清单**（用户预先授权，可否决）：
  > 1. **Phase 3 的「独立步骤」实现为柯验条目下的 1→5 编号子块，而不是新增第 7 个 `###` 分组**。理由：B4 的机器可校验口径第 6 条把 Phase 3 的 `###` 分组数**锁死为 6**，加第 7 个会立刻让 E1 的 `verify-lesson.mjs` 规则失效。Prompt 说的「独立步骤」在语义上要求的是「不可跳过、有明确起止」，编号子块同样满足（验收脚本实测 Phase 3 段落内 `###` 计数仍为 1）。
  > 2. **「对账表全部通过」给出四条可判定的操作定义**（A.1 存在且 6 列、数据行 ≥ 1；「一致?」列无 ❌；每个 ✅ 写了容差或统计窗口；A.1 行数与正文断言数同量级）。Prompt 只要求「增加一条签发条件」，但**没有判定定义的签发条件等于没有**——「全一致」在既有 11 篇里 0 次出现，正因为没人知道它长什么样。第 ④ 条（行数同量级）是防止「挑着对几条就算对完」。
  > 3. **新增《讨论日志固定结构》§4 第 11–13 条机器可校验口径**，并把收尾行「这 10 条」改为「这 13 条」。理由：B4 已确立元规则「清单每新增一项就要有能自动执行它的脚本」，M2 落地却不给可校验口径就会重演「附录 A 表头 5 种」那种漂移。第 13 条（**硬编码检测**）是新增的反篡改门槛，B5 已对 fix-014/016/018 的三个涉事组件实测：`0.424413`、`6.380664`、`6.380676`、`0.839999`、`0.84`、`1.200000` 等字面量 **0 命中**，即误报为 0、可直接当门槛用。
  > 4. **「一致」的判定标准写成三合法情形 + 五类 ❌ + 逐行容差**，明确拒绝「基本一致 / 大致吻合 / 量级相符」这类措辞，并规定**写不出容差的行不许判 ✅**。特别是把「方法固有偏差」单列为一类：描述函数只取基波导致的 +4.87% 不是实现错误，但**前提是正文已写明**；没写就先判 ❌、改叙述后转 ✅。没有这条，柯验的否决权会把一切正常的方法误差都打回，机制就会因为「太严」而被绕过。
  > 5. **对账范围显式包含习题与答案**（既有实践已经这么做：`03-describing-function.md:136` 的附录标题就写着「正文与习题引用的每个数字」），并给出四步枚举法（正则扫数字 → 判定是否断言 → 习题同范围 → 每断言指出 cell 与组件读数），使「每一个」可执行而非口号。
  > 6. **顺带更正 personas.md 四处陈旧内容**（超出 Prompt 点名的「柯验职责段」，但同属一个文件、留着会与新机制打脸）：① `:25` 的「详见 §3.7 的 M2 / M4 机制」→ M2 已落地为 SKILL.md《数值三方对账》；② `:30` 的「**B3** 需把课型矩阵写入 SKILL.md」是 B3 交付后遗留的未划掉待办；③ `:31` 的「**B4–B7** 需把 M1–M5 写入」改为进度行（M1 由 B4、M2 由 B5 已写入，M3/M4/M5 待 B6/B7/B8）；④ 何仿条目里「产出路径写进讨论日志」明确落到**附录 A.2**，并写明 B5 起这是硬性的（交不出路径的数字柯验直接判 ❌）。另把 B4 明确推迟到 B5 的**陆阅「交付完整性」措辞**同步为「4 份档案 = 同一日志文件里的 4 个部分」，并给 A.1 补上可数的齐备判据；郑核条目的「数值核查 → 柯验」补上「只核四条操作定义、不自己重算」。
  > 7. **秦构/何疑的 Phase 3 指针一字未动**（仍写「机制细则 = M3，由 B6 写入」「M4，由 B7 写入」），避免对尚未落地的机制做前向引用——这是 B2 定下的纪律。
  > 8. **A.1 / A.2 骨架各加一段 `<…>` 填写说明占位**。理由：附录 B / C 在 B4 的骨架里本来就有这种占位，A 组没有会让柯验与何仿在抄骨架时漏掉「一行一个断言 vs 一行一个测量」这个关键区别。
  >
  > **⑥ 验收方式**：三个临时 Node 脚本（用完即删）。`b5-tables.mjs` 枚举 11 篇日志里**每一张** markdown 表的表头、列数、行数与所属标题，产出「附录下表头形态去重」清单——③ 的 5 种形态与篇数更正全部出自它；`b5-mdcheck.mjs` 逐行核两文件的反引号 / `**` 配对与**每张表的列数一致性**（SKILL.md 20 张表、personas.md 4 张表全一致，围栏平衡），唯一告警是 SKILL.md 既有 `:853` 那行故意写的 ` ```python ` 字面量（B4 之前就在，非本次引入）；`b5-verify.mjs` 核 **51 组断言，全通过**：Phase 3 的独立步骤 1→5 齐全、6 列列名齐全、九类对账范围齐全、含「禁止进入 Phase 4」与「不许改数据」、**Phase 3 段落内 `###` 计数仍为 1**（未破坏 B4 口径第 6 条）；新节 7 个小节、6 列表头逐字命中、示例三行的实测值与 file:line 齐全、§6 三条处置齐全、正例含 `adaptive-control-basics.mdx:29` 与 18 条修正的日志行号、反例含硬编码检测的「0 命中」实测；Phase 4 含「三方对账表全部通过」与四条操作定义、含「郑核不自己重算数字」、含篡改测量的违规定性；§4 第 11–13 条与「这 13 条」收尾；A.1/A.2 骨架占位；③ 的两处更正生效且旧措辞不再出现（保留的「附录 A 表头 2 种」只出现在更正说明的引号里）；personas.md 柯验条目 4 组齐全、C 组恰好 9 个带圈数字项、**勾选项总数恰好 23**、产物段为 6 列 + A.1/A.2 分工、否决权段含「任一行 ❌」与四条操作定义指针、含「不得用 `[沉默-柯验：…]` 代替到场」；陈旧指针清零 5 条、M3/M4 指针未被误改。`npm run check` 退出码 0、PASS 17 / WARN 36 / FAIL 0、底部统计逐项与 B4 后一致（B5 不动 catalog 与正文）。
  >
  > **⑦ M2 落地的实证依据（为什么这一条机制非有不可）**：B5 对 11 篇日志做了统计——9/11 篇有附录、8 篇有数据总表、合计 **78 行**实测数据，但**含「一致?」这类判定列的表 0 张**，"对账"一词在 11 篇里出现 **0 次**，把组件默认读数记下来的只有 **2 篇共 10 行**。也就是说：三路数字都被测了、也都写下来了，**却从来没被放进同一行里对过**。fix-014/016/018 正是从这个缺口里漏出去的——它们发生时页面 200、图也画得出来、H2 数与 katex 检查全绿。这段统计已写进 SKILL.md《数值三方对账》的开篇依据。
  >
  > **「只修改 SKILL.md 与 personas.md 两个文件」的核查方式**：本仓库从未提交（HEAD 仍是 A1 之前的 `dd1b29f`），`git status` 无法区分本阶段与前阶段的改动，故改用 mtime——B5 时段内仓库里只有 `SKILL.md`（06:52）与 `personas.md`（06:51）被改写；`delivery-tracker.md` 与 `semester-02-plan.md` 的 06:12 是 B4 留下的，`logs/dev.log` 是开发服务器的输出。plan 勾选与 tracker 补记是既有惯例允许的例外，在此声明。

- [x] **B6 · 引入前端交付硬门槛（秦构）**
  - 做什么：把 3.7 M3 的九项清单写入两个 SKILL.md（wiki-discussion 的 Phase 4 与 v1.3-refactor 的 Step 2e），两处逐字一致
  - 涉及文件：`.agent/skills/wiki-discussion/SKILL.md`、`.agent/skills/v1.3-refactor/SKILL.md`
  - 验收：`diff` 两处清单逐字一致；每项都注明执行方式与对应 fix-log 编号

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读：
  - .agent/skills/wiki-discussion/SKILL.md 的 Phase 4 与"注意事项"
  - .agent/skills/v1.3-refactor/SKILL.md 的 Step 2e 与"注意事项"
  - .agent/fix-logs/INDEX.md 的 011 / 012 / 013 / 015 / 017 五条及其详情文件
  - .agent/semester-02-plan.md 的 3.7 M3

  前置条件：B1 已完成（秦构人设已写入 personas.md）。

  背景：fix-013 明确记录"本地 Python harness 不解析 MDX 故抓不到，页面表现为 404
  而非 500"；fix-015 记录组件双注册表（只改 mdx-components.tsx 会 500
  "Expected component X to be defined"）；fix-017 记录 notebook cell 占位符 % 转义
  问题"页面 200 / H2 数 / katex / 命令行 harness 全都查不出来，只有在浏览器里点开
  运行才暴露"。这些门槛目前仍是人工执行。

  任务：
  1. 在 wiki-discussion/SKILL.md 的 Phase 4 中新增"前端交付硬门槛清单"，照
     semester-02-plan.md 的 M3 九项逐字写入，每项注明：
       - 执行方式（具体命令，或人工检查点与判定标准）
       - 对应的 fix-log 编号
  2. 明确规定：清单任一项未通过，郑核不得签发，delivery-tracker 不得打勾。
  3. 在 v1.3-refactor/SKILL.md 的 Step 2e"验证"中，把当前简单的 3 条替换为**同一份**
     九项清单（两处必须逐字一致，避免规范漂移）。改完后 diff 两处确认。
  4. 在两个 SKILL.md 中都加入一条元规则："本清单每新增一项，必须同时新增一个能
     自动执行它的脚本或命令（归入 scripts/verify-lesson.mjs）；无法自动化的项必须
     写明人工检查步骤与判定标准。"
  5. 在两个 SKILL.md 中都补充 Windows 环境注意事项：
     - Tailwind 工具类可能不生效，需用 inline style 兜底
     - .next 缓存可能损坏，需 rm -rf .next 后重启
     - dev server 在 8080 端口（node scripts/serve.mjs），不是默认 3000
     - Jupyter kernel 在 8891，POST 请求需用 new ProxyHandler({}) 绕过系统代理，
       否则返回 502；execute 返回体形如 {"outputs":[...]}
  6. 在 personas.md 秦构的职责中，把九项清单列为可勾选检查项（若 B1 已写入则核对
     一致性即可）。

  只修改 wiki-discussion/SKILL.md、v1.3-refactor/SKILL.md、personas.md 三个文件。
  ```

  > **B6 完成补记（2026-09-26）**
  >
  > **① 交付形态：九项清单全仓恰好两份，100 行正文逐字复制。** `wiki-discussion/SKILL.md` 新增《前端交付硬门槛（B6 起）》一节（`:718`–`:820`，6 个小节 §1–§6）；`v1.3-refactor/SKILL.md` 的 Step 2e 改名为「验证（前端交付硬门槛，B6 起）」，承载**同一份 100 行正文**（`:98`–`:197`）。九项照 §3.7 M3 **逐字**抄入，每项下挂 `- 执行方式：` 与 `- fix-log：` 两行。第二份**不是手抄的**——用临时脚本从第一份切片后原地写入（`b6-sync.mjs`），从构造上排除抄写漂移；脚本用完即删（见 ⑤.1 的教训）。
  >
  > **② 验收实测**：按 §6 自己写下的命令跑三方 `diff`——`awk` 取本计划 §3.7 M3 的九行、`grep '^- \[ \] '` 取两个 SKILL.md 的九行，输出 `counts: plan=9 wiki=9 v13=9` + `THREE-WAY SAME`。再做**整块** diff（不止九行）：`sed -n '720,819p'` vs `sed -n '98,197p'` → `FULL BLOCK BYTE-IDENTICAL (100 lines)`。`npm run check` 退出码 **0**、PASS 17 / WARN 36 / FAIL 0，底部权威统计与 B5 后**逐字一致**（本阶段只改 `.agent/` 文档，不动 catalog / MDX / 组件，故未跑 `npm run build`——九项门槛是对**课程交付**的要求，不是对文档阶段的要求）。结构校验：两个 SKILL.md 的代码围栏各 16 / 10 个且**成对**，`personas.md` 0 个问题（反引号逐行成对、剥离行内代码后 `**` 全部成对、新增 13 行映射表每行 4 个 `|`）。
  >
  > **③ 自行裁定：不把九项扩成十二项**（用户预先授权自行决策，可否决）。秦构人设原有 11 条检查里有 **4 条不在九项内**（fix-013 JSX 逗号、fix-012 `$$` 独占行、fix-017 `%#`/占位符、fix-011 kernel id）。两条路：(A) 九项保持逐字不变，把这 4 条列为「同属硬门槛但不属九项」的独立小节；(B) 把清单扩成十二 / 十三项。**选 A**——「九项硬门槛」这个说法已被 SKILL.md、personas.md、tracker、项目记忆多处引用，扩项会让所有既有引用同时失效，而 A 既不丢任何检查项、也不动已固化的口径。落地为 §5《秦构人设里另外四条》+ personas.md 秦构条目新增的 13 行映射表。
  >
  > **④ 自行裁定：不在 personas.md 抄第二遍九项**（同上授权）。Prompt 任务 6 是「把九项清单列为可勾选检查项（若 B1 已写入则核对一致性即可）」——B1 已写入（1 条元条目括注九项），故按「核对一致性」执行，且**核对结果写成映射表而不是再抄一份清单**：抄了就成第三份副本，与 ①③ 的「恰好两份」自相矛盾。核对中发现并补齐 B1 的两处缺口：**九项第 8 项子项 4「默认参数复现正文手算例」在秦构原清单里完全没有**（fix-014 的直接教训却漏在人设外）；以及「同页 ≥ 2 个 notebook 时在浏览器点『▶ 全部运行』」（fix-011 的唯一暴露路径，九项也没写）。秦构清单 11 → **13** 项。
  >
  > **⑤ B6 新发现 5 处**（全部实测，非推测）：
  > 1. **九项里有两项现在没有可运行的工具**：`.agent/nc-verify.py`（第 5 项 cell 全等）与 `.agent/nc-explorer-check.mjs`（第 8 项子项 4 的镜像脚本）**都已不在仓库**——实测 `.agent/` 下 **0** 个 `.mjs`、**0** 个 `.py`。这两个是 fix-017 / fix-018 的配套产物，当初被当作一次性临时文件删掉了。已在 §1 写明「验证脚本必须**留在仓库里**（`scripts/verify-<lesson>.mjs|.py`），一次性临时文件不算门槛」，并在 §3 的自动化状况表里把这两项标成「**无工具**」。**教训：门槛工具本身必须是仓库产物，否则门槛在交付当天就失效。**
  > 2. **B5 引用了这个已不存在的脚本，共 3 处**：`SKILL.md:698`（《数值三方对账》§6 ③ 检测 2 的「现成范本」）、`personas.md:344`（柯验清单）、`personas.md:1125`（柯验 vs 秦构 的对话示例）。三处都在 B6 可改范围内，已全部更正为「历史范本……**已不在仓库**，需按课重建并留在 `scripts/`」，对话示例改成本课命名 `scripts/verify-phase-plane.mjs` 并在「落点」里写明更正理由。**这与 ⑤.1 同根**：B5 写「现成范本」时没有核它是否还在。
  > 3. **fix-013 指错了日志文件**：`.agent/fix-logs/2026-09-24-013.md:45` 写「排查 404 时先看 `logs/dev.log` 的 `MDX 编译失败` 记录」。实测 `lib/logger.ts:42` 的 `LOG_FILE = "app.log"`；`grep -c "MDX 编译失败"` 在 `logs/app.log` 有 **44** 条、在 `logs/dev.log` 有 **0** 条（`log()` 同时走 console 与文件，dev.log 只覆盖当次 dev server 的 stdout、跨重启不留存）。fix-log 属历史记录且不在 B6 可改范围，故**不改原文**，在 §1 第 2 项里写明正确文件与两者差别。
  > 4. **第 5 项（cell 逐字全等）抓不到 fix-017 的原形态**：拼接脚本同时污染 MDX 与验证脚本时两边仍然全等——fix-017 当时 `nc-verify.py` 报 `9/9 ALL MATCH` 而 bug 照样上线。所以「全等」**不足以**保证 notebook 能跑，必须叠加 `%#` / 占位符那条源码检查 + 浏览器真实执行。已写进 §1 第 5 项的警示行与 §5。
  > 5. **第 9 项若按全仓查会永远红**：`grep -rlE "ipywidgets|FloatSlider|IntSlider|interact\(" content/` 实测命中 **21 个** MDX（`classic/frequency-domain-analysis` 9 处、`classic/frequency-response-design` 9、`discrete-sampled/sampling-period-selection` 15、`implementation/realtime-control` 8，另有 8 门 modern、7 门 mpc、2 门 robust），是 A6 已登记的存量债务。门槛口径因此明确为**只按课查**，并写明「全仓红既不是本课的挡箭牌、也不是本课的罪状——按课查、按课判」。附带实测：36 个 `*-explorer.tsx` 中缺 `animation: false` 的 **0** 个、缺显式 `min:` 的 **0** 个（第 8 项子项 1、2 全仓当前合规）。
  >
  > **⑥ 其余交付**：**§2** 未通过即不得签发（含「秦构没有打回权、却能让签发不成立」「附录 B 必须逐项粘实际命令与实际输出，不接受『已检查』『应该没问题』」「存量债务不豁免本课」三条）；**§3** 元规则照 §3.7 M3 逐字引入 + 一张 7 行自动化状况表（第 6 项已由 `npm run check` 自动化报 FAIL、第 7 项只有 WARN 故不能阻断、第 2/3/4 项有命令无脚本、第 5 项与第 8 项子项 4 无工具，供 E1 收敛）；**§4** Windows 四条（Prompt 任务 5 逐条落地，另补「build 与 dev 共用 `.next`，跑第 1 项前必须先停 dev server」）；**§6** 两份副本的三方 `diff` 命令（`awk` 按标题取块、不依赖行号）。另在 SKILL.md 补四处指针：Phase 4 骨架新增「签发前置」括注行、附录 B 的填写要求由 1 行扩到 6 行（要求 §5 四条与浏览器项一并写入）、《讨论日志固定结构》§4 第 10 条由「B6 落地后按九项逐字核」改为「**B6 已落地**：按 §1 九项逐字核 + 含 §5 四条 + 任一项 ❌ 而仍有 `[郑核-签发]` → FAIL」、《注意事项》的「门槛清单见 personas.md 秦构条目」改为指向权威副本 §1。v1.3-refactor 侧另补：Step 2d 加一句与 2e 的分工、Step 3 打勾的前置条件（含既有的 catalog `status: "v1.3"` 约束）、Step 4 报告模板每课加两行（九项 N/9 + §5 四条）并新增「硬门槛实际输出」一节、《注意事项》的「注册两处」「构建验证」两条改写 + 新增「九项硬门槛」「Windows 环境」两条。
  >
  > **⑦ 行数与行号（全部编辑完成后复测，`wc -l` 口径）**：`wiki-discussion/SKILL.md` 859 → **970**（+111）；`v1.3-refactor/SKILL.md` 214 → **325**（+111）；`personas.md` 1146 → **1166**（+20）。B6 后 SKILL.md 的真实 H2 行号（现查 `grep -n "^## "`，注意 `:459`–`:554` 与 `:812`–`:855` 是围栏内的骨架模板、不是真 H2）：概述 14 / 角色体系 18 / 角色上场规则 122 / 讨论流程 218 / 发言纪律 377 / 讨论日志固定结构 442 / 数值三方对账 608 / **前端交付硬门槛 718** / 输出格式规范 821 / 讨论标记约定 867 / 使用方式 932 / 数学基础章节规则 944 / 注意事项 956。v1.3-refactor：Step 2d 81 / **Step 2e 96**（块 98–197）/ Step 3 201 / Step 4 208 / 组件模板 246 / 注意事项 315。personas.md 秦构条目 `:384`–`:451`。B5 定下的「行号与行数必须在全部编辑完成后、写记录之前复测」纪律本次照办。
  >
  > **「只修改三个文件」的核查方式**：本仓库从未提交（HEAD 仍是 A1 之前的 `dd1b29f`），`git status` 无法区分阶段，故用 mtime 实证——`find -newermt "2026-09-26 07:20"`（排除 `.git` / `.next` / `node_modules` / `logs`）**只返回三个文件**：`wiki-discussion/SKILL.md`（07:42）、`v1.3-refactor/SKILL.md`（07:45）、`personas.md`（07:49）；`semester-02-plan.md`（07:11）与 `delivery-tracker.md`（07:14）仍是 B5 的时间戳。plan 勾选与本补记、tracker 补记是既有惯例允许的例外，在此声明。

- [x] **B7 · 引入红队否决机制（何疑）**
  - 做什么：把 3.7 M4 写入 SKILL.md 的 Phase 3 与 Phase 4
  - 涉及文件：`.agent/skills/wiki-discussion/SKILL.md`、`.agent/skills/wiki-discussion/personas.md`
  - 验收：SKILL.md 含"定量对比放行三条件"；ABS 事故作为反面案例写入；Phase 4 签发条件含红队放行记录

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/skills/wiki-discussion/SKILL.md 的
  Phase 3 与 Phase 4、docs/discuss-log/semester-01/08-intelligent/01-fuzzy-control-basics.md、
  .agent/semester-02-plan.md 的 3.3 何疑条目与 3.7 M4。

  前置条件：B1 已完成（何疑人设已写入 personas.md）。

  背景事故（已记录在项目记忆与该课讨论日志中）：intelligent/fuzzy-control-basics
  最初把 ABS 对比基线的门限逻辑写成"每步继电器"，导致在湿卵石路面上该基线比
  无 ABS 还差——这是一个稻草人基线，使整节的对比结论失去说服力。修正方式是改为
  速率型三段逻辑并在三种路面上扫参后才算公平。教训："对比基线必须整定过"。

  任务：
  1. 在 SKILL.md 的 Phase 3 中新增"定量对比红队审查"步骤，由何疑执行，规定放行
     三条件：
     a) 基线在**同一被控对象、同一评价指标**下独立整定过，并记录整定方法与参数
        扫描范围
     b) 至少在 **3 组参数或 3 个工况**下对比，全部结果（含 A 输的场景）写入讨论
        日志附录 C
     c) 正文诚实列出 A 不如 B 的场景与适用边界
     任一条件不满足 -> 何疑行使否决，该结论不得写入正文。
  2. 明确适用范围：任何形如"A 优于 B""A 比 B 快 X%""A 更鲁棒"的定量或半定量断言，
     **包括交互组件与 notebook 输出的对比图**（图本身也是断言）。
  3. 给出 ABS 事故作为反面案例写入 SKILL.md（简要 3-5 行），并给出 1 个正面案例的
     标准写法（可参照 adaptive-control-basics 讨论日志中"三方对比"的记录方式）。
  4. 在 Phase 4 签发条件中增加"何疑红队放行记录已写入讨论日志附录 C"。
  5. 在 personas.md 何疑的职责中，把三条件列为可勾选检查项，并补充其他常见论证
     缺陷的检查项：指标挑选偏差（只报超调不报稳态误差）、只报均值不报方差、
     幸存者偏差（只展示调好的随机种子）、样本量不足、显著性未交代、
     失效场景敷衍带过（"局限性讨论"节是否真的在讨论局限）。
  6. 特别提示未来压力最大的一课：intelligent/intelligent-case-study 要在同一被控
     对象（倒立摆）上串联模糊 / NN / 元启发式 / 经典方法的完整对比，而已有记忆
     表明"Mamdani 模糊 PD 无法稳定倒立摆（rms≈21° vs PID 2.67°）"——何疑必须
     核查这个 21° 不是稻草人结果。把这条写入 personas.md 何疑条目。

  只修改 SKILL.md 与 personas.md 两个文件。
  ```

- [x] **B8 · fix-log 角色归因字段与回顾机制**（2026-09-26 交付，见 §3.7 M5 的 B8 批注）
  - 做什么：为 fix-log 模板增加归因三字段；INDEX.md 表头加列并回填现有 18 条；建立学期末回顾机制
  - 涉及文件：`.agent/skills/fix-tracker/SKILL.md`、`.agent/fix-logs/INDEX.md`
  - 验收：模板含 3 个新字段；INDEX.md 现有 18 条完成回填；回顾机制含明确触发条件

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/skills/fix-tracker/SKILL.md、
  .agent/fix-logs/INDEX.md（全 18 条）、任意 3 个 .agent/fix-logs/*.md 详情文件、
  .agent/semester-02-plan.md 的 0.3 节与 3.7 M5。

  前置条件：B1 已完成（新角色已设立，可作为归因对象）。

  任务：
  1. 在 fix-tracker/SKILL.md 的 fix-log 模板中新增三个字段：
     - **归因角色**：本该拦住这个 bug 但没有的角色（从升级后的 22 人池中选）
     - **拦截缺口**：该角色的检查清单里缺了哪一条
     - **清单更新**：已写入 SKILL.md / personas.md 的具体条目（若未写入则填"待补"）
  2. 在 INDEX.md 表格中增加"归因角色"一列，并对现有 18 条完成回填。参照
     semester-02-plan.md 的 0.3 节分类：
       011 / 013 / 015 / 017 -> 秦构（前端工程，当时该角色尚未设立）
       014 / 016 / 018       -> 柯验（数值对账，当时该角色尚未设立）
       001-010 / 012         -> 苏绘 + 何仿（交互组件设计规范，角色已存在但清单缺此项）
     回填时对每条注明"当时该角色尚未设立"或"当时已有该角色但清单缺此项"，
     这两种情况的改进方向不同（前者=新增角色，后者=补清单）。
  3. 在 fix-tracker/SKILL.md 中新增"归因回顾机制"一节：
     - 每学期末统计归因分布（按角色、按类别）
     - 触发条件：若某角色连续 3 条未拦住同类问题 -> 必须修改该角色的检查清单或
       拆分其职责，并把修改记录写入本文档
     - 给出回顾表的 markdown 格式（角色 / 归因条数 / 类别分布 / 是否触发拆分 /
       已采取的清单更新）
     - 用 0.3 节的数据给出第一次回顾的示例结果：秦构与柯验各 4 / 3 条，均为
       "角色尚未设立"，因此本学期已通过 B1 设立；苏绘 + 何仿 11 条，属"清单缺项"，
       已通过 v1.3 设计规范补齐（固定坐标轴 / 禁用动画 / 无 ipywidgets）
  4. 在 fix-tracker/SKILL.md 中明确：新增 fix-log 时必须填写归因三字段，缺失则
     郑核不得关闭该 fix 条目。

  只修改 fix-tracker/SKILL.md 与 .agent/fix-logs/INDEX.md 两个文件。
  ```

---

### 阶段 E · 质量基建（建议紧跟 A / B 之后，早做早受益）

- [x] **E1 · 自动化验收脚本（把 M3 九项变成一条命令）**
  - 做什么：写 `scripts/verify-lesson.mjs`，输入 `<chapter>/<lesson>`，自动执行九项门槛并输出分级报告
  - 产出：`scripts/verify-lesson.mjs`、`package.json`（新增 `verify` / `verify:all`）
  - 验收：对已交付的 19 门课跑一遍并贴出报告；对一门故意注入错误的课能报 FAIL

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/skills/v1.3-refactor/SKILL.md 的
  Step 2e（B6 已改为九项清单）、.agent/fix-logs/INDEX.md 的 011 / 012 / 013 / 015 / 017
  五条、.agent/semester-02-plan.md 的 3.7 M3 与 P11。

  背景：交付硬门槛目前是人工执行的九项清单，历史上多次因为漏检导致返工
  （fix-013 的 404、fix-015 的 500、fix-017 的 line magic 报错都逃过了当时的人工检查）。

  任务：写 scripts/verify-lesson.mjs，用法
    node scripts/verify-lesson.mjs <chapter>/<lesson>
    node scripts/verify-lesson.mjs --all
  逐项自动检查并输出分级报告（PASS / WARN / FAIL）：

  1. **MDX 语法预检**
     - JupyterNotebook 组件的 JSX 属性之间不得有逗号（fix-013 模式：扫 `}` 后紧跟 `,`）
     - 多行 display math 的 $$ 必须独占开 / 闭行（fix-012 模式：扫 `$$\begin` 与 `\end.*\$\$`）
     - 组件标签必须在 MDX 中显式出现（避免"实现了但忘了引用"）
  2. **结构一致性**：MDX 的 H2 序列必须与 catalog.ts 该课 subsections 逐条对应
     （数量相等 + 标题规范化后相等），报出差异明细。
  3. **Notebook cell 完整性**
     - setupCode 与 cells 中不得出现 ipywidgets / interact / FloatSlider / IntSlider / widgets.
     - cell 首行不得匹配 /^%[^\w]/ 或 /^%#/（fix-017 模式）
  4. **组件注册**：MDX 中引用的每个自定义组件，必须同时存在于 mdx-components.tsx
     与 lib/content.ts 的 components 映射中（fix-015 模式）。报出只注册了一处的组件。
     （E2 完成后本项改为校验单一来源模块被两处引用。）
  5. **组件规范**：扫描 components/wiki/*-explorer.tsx，检查
     - 是否 import 并使用 useECharts
     - option 中是否有 animation: false
     - xAxis / yAxis 是否设置了显式 min / max（固定坐标轴）
     - useECharts 的参数是否为 useMemo 产生的 EChartsOption 对象而非 callback
       （已记录的 hydration crash 模式）
  6. **数学渲染与可访问性**：若 dev server 已启动（探测 8080 端口），curl 课程页，
     检查 HTTP 200 且响应 HTML 中 katex-error 计数为 0。未启动则标 SKIPPED 并给出
     启动方法（node scripts/serve.mjs）。
  7. **交叉引用完整性**：MDX 中所有站内链接（/math/xxx、/<chapter>/<lesson>）必须
     指向 catalog 中存在的课程。报出悬空链接。特别检查所有 "📐 本文用到了" 引用行。
  8. **交付完整性**：该课是否存在对应讨论日志
     docs/discuss-log/semester-*/<chapIdx>-<chap*>/<lessonIdx>-<lessonSlug>.md。
     缺失报 WARN（不阻断，但要列出）。
  9. **习题 / 答案配对**：MDX 必须同时含"习题"与"答案"两个 H2，且答案条目数
     不少于习题条目数。

  输出：人类可读的分类报告，末尾给出统计（PASS / WARN / FAIL 各多少门课）。
  退出码：有 FAIL 返回 1，仅 WARN 或全 PASS 返回 0。
  在 package.json 增加 "verify": "node scripts/verify-lesson.mjs" 与
  "verify:all": "node scripts/verify-lesson.mjs --all"。

  约束：不要引入新的 npm 依赖，用 Node 20+ 内置能力（fs / path / child_process）。
  完成后对全部已写课程跑 --all，把完整报告贴出来，并按报告分类统计当前存量课程的
  健康度（哪些课可以直接进 C1 重构，哪些需要先修 FAIL 项）。

  勾上 .agent/semester-02-plan.md 的 E1。
  ```

  > **E1 完成补记（2026-09-26，用户预先授权自行决策，可否决）**
  >
  > **① 落地物**：`scripts/verify-lesson.mjs`（**902 行**，`wc -l`）+ `package.json` 新增 `verify` / `verify:all` 两条 script（Prompt 只要这两条；`--delivered` / `--root` / `--no-http` / `--quiet` 是脚本参数而非 npm script，故 19 门那条命令是 `npm run verify -- --delivered`）。**九项编号与 Prompt 逐项对齐、顺序不动**——D 阶段的门槛表（本文件《5.1 单课交付门槛》，E1 时点 `:2161`–`:2174`；**E2 更正**：E2 的批注块插在本行之后，该表已移到 `:2183`–`:2196`——表头 `:2183`、12 行门槛 `:2185`–`:2196`。E1 记过的那条教训「插入批注本身就移动了自己刚引用的行号」在 E2 又应验一次，此后引用这张表一律用节名，行号只在写下的时点有效）按编号引用「E1 第 2、6 项」「第 4、5 项」「第 1、3 项」「第 7 项」「第 8 项」「第 9 项」，重排会让那张表整体指错。**零新增 npm 依赖**，只用 `node:fs` / `node:path` / `node:http` / `node:url`；**不用 `execSync`**（Prompt 允许 child_process，但本仓 hook 把它列为高危，且第 6 项直接走 `node:http` 比 fork 一个 curl 更可控）。`parseCatalog` 与 `check-catalog.mjs` 各存一份（两脚本都要解析 `content/catalog.ts`），已在脚本注释里写明理由并移交 E3。
  >
  > **② 验收两半都过**（完整报告贴在 tracker 的 E1 note 里）：**19 门 `--delivered`** = 检查项 171 个、PASS 149 · WARN 20 · FAIL 2 · SKIPPED 0、退出码 1（dev server 在跑，故第 6 项 19 门全部实测而非 SKIPPED）；**注入错误的课能报 FAIL** = fixture `fx/bad-lesson` 注入 8 处缺陷 → 第 1/2/3/4/5/7/9 项 FAIL、第 8 项 WARN、第 6 项 SKIPPED、`PASS 0 · WARN 1 · FAIL 7 · SKIPPED 1`、退出码 **1**，对照组 `fx/good-lesson` → 0 FAIL、退出码 **0**，8 处缺陷逐一被点名并带 file:line 与 fix-log 归因。**fixture 保留为仓库产物 `.agent/e1-fixture/`**（自行裁定，见 ⑦a）：实测 `npm run check`（PASS 17 · WARN 36 · FAIL 0，与 A7 起逐字一致）与 `tsc --noEmit`（退出码 0、零输出）都不受它影响——两者都按根相对路径取 `content/` 与 `components/wiki/`；`tsconfig.json` 的 `include: ["**/*.tsx"]` 确实会编译 fixture 的三个组件，恰好它们类型合法。**（E2 更正 2026-09-26：这句的依据是错的，结论侥幸对）** TypeScript 的 include 通配默认跳过以点开头的目录。E2 实测：在 `.agent/tsc-probe.ts` 放一个故意的类型错误、同时在仓库根放同一份错误作对照，`npx tsc --noEmit` 只报出根目录那一个（`tsc-probe-control.ts(2,14): error TS2322: Type 'string' is not assignable to type 'number'.`，退出码 2），点号目录那个一声不响 → `.agent/e1-fixture/**` 压根不在类型检查范围内。旁证：fixture 的 `lib/content.ts` 导入 `@/components/wiki/good-explorer`，按 tsconfig 的 `@/*` → `./*` 会解析到仓库根下一个并不存在的文件，若真被编译必然报 TS2307，而当时 tsc 退出码 0。「fixture 不影响 tsc」的结论不变，但依据要从「恰好类型合法」改成「没被编译」——差别在于：前者会让人以为 fixture 里的组件受类型保护，实际上写坏了也没人拦。两个探针文件跑完即删。
  >
  > **③ 存量健康度（Prompt 要的分类结论）**：56 门有 MDX 的课 → **A 级 3 门**（0 FAIL 0 WARN）= `nonlinear/adaptive-control-basics`、`nonlinear/backstepping`、`nonlinear/sliding-mode-control`；**B 级 29 门**（仅 WARN）；**C 级 19 门**（唯一 FAIL 是 ipywidgets 存量债务）；**D 级 5 门**（有非债务 FAIL）。**直接回答 Prompt 的问题：A+B 共 32 门可以直接进 C1；C 级 19 门不是「先修再进 C1」而是「由 C1 修」——它们唯一的 FAIL 就是 C1 的重构目标本身；只有 D 级 5 门必须先修。** D 级逐门：`classic/classic-case-study`（第 7 项，死链 `/classic/pid-control`，即 Q14 残留的那一条）、`math/complex-numbers`（第 9 项，全课 7 个 H2 里没有「习题」也没有「答案」）、`mpc/mpc-principle` 与 `mpc/receding-horizon`（第 1+6 项，见 ④）、`nonlinear/describing-function`（第 5 项，见 ⑤）。C 级 19 门与 B6 手工 grep 出的「21 个 MDX 命中 ipywidgets」差 2 门，差的正是那两门 mpc——它们另有非债务 FAIL 故被归入 D 级；**两个数字都对，口径不同**（脚本按「全部 FAIL 项是否都只有 `[存量债务]` 文案」判 C 级）。
  >
  > **④ 新发现（Q6 精确化）：两门 mpc 课的正文在渲染时被整段吞掉。** `content/mpc/mpc-principle.mdx` 源码 8 个 H2、渲染后 `<h2>` 只有 **1** 个、HTML 里 **2** 处 `katex-error`；`content/mpc/receding-horizon.mdx` 源码 11 个 H2、渲染后只有 **2** 个、同样 2 处 `katex-error`。根因是 fix-012 的**闭合形态**：两课的 `:60` 与 `:73` 都写成 `\end{aligned}}$$`（闭合 `$$` 与前一行内容同行）。用仓库自己的 `micromark` + `micromark-extension-math` 实测九种形态确认：**闭合 `$$` 必须在行首**，否则 math-flow 永不关闭、其后全文被当数学内容吞掉；**开启 `$$` 后面带内容是合法的**（能正常渲染）。修法各一行：把闭合 `$$` 挪到下一行。两门都是 `status=draft`、不在 19 门已交付里，所以此前所有人工门槛都没碰到它们。**Q6 从「2 个 mpc 页面被截断」升级为有 file:line、有根因、有一行修法的条目。**
  >
  > **⑤ 新发现：一门已签发的课过不了 M3 第 5 项——这是「清单在纸面上存在、在实践里空转」的第一个实证。** `nonlinear/describing-function`（`status="v1.3"`）引用的两个组件，`components/wiki/describing-function-explorer.tsx:67` 与 `components/wiki/nyquist-limit-cycle-explorer.tsx:137` 都写成 `const option: echarts.EChartsOption = {`（裸对象字面量）再 `useECharts(option)`，**都不是 `useMemo` 产出**——正是 B8 预登为 **fix-019** 的 hydration 崩溃模式、也正是《前端交付硬门槛（B6 起）》§1 第 5 项明写的判据。而该课第 8 项 PASS：它有讨论日志，且 `docs/discuss-log/semester-01/07-nonlinear/03-describing-function.md:116` 就是 `[郑核-签发]`。**即它走完了完整的多角色流程并被签发，日志里 `useMemo` 出现 0 次**，仍带着一个九项清单里明写的违规上线。B6 批注 ③ 当时预言「第 5 项与第 8 项子项 4 目前没有可运行的工具 → 它们在纸面上存在、在实践里空转」，E1 把工具补上之后第一次抓到了实例。全仓另有 1 处同类：孤儿组件 `BodeMarginsExplorer`（`components/wiki/bode-margins-explorer.tsx:111` 的 `yAxis` 是 value 轴却缺 `min` / `max`）——Q3 长期在册的那个孤儿现在有了具体缺陷，**删或补都行，但不能维持现状**（~~它已在两个注册表里注册，任何课一旦引用就带着轴漂移上线~~ → **E2 更正 2026-09-26：括号里这句是编造的，实测为假**。`BodeMarginsExplorer` 在 E2 之前的 `mdx-components.tsx` 与 `lib/content.ts` 里各命中 **0** 次，全仓只出现在自己的实现文件 `components/wiki/bode-margins-explorer.tsx`（`:97` 定义、`:111` 违规轴）——即它**从未被任何注册表登记过**。所以真实后果与原注解相反：任何课一旦引用它，先撞上的是 fix-015 的 500「Expected component `BodeMarginsExplorer` to be defined」，轴漂移要等它被登记进单一来源之后才会浮现。E2 已把 `verify-lesson.mjs` 汇总里那句「孤儿交互组件（已实现**已注册**…）」改成「已实现、全仓无 MDX 引用」并追加逐组件的登记状态；E2 的单一来源 `lib/wiki-components.ts` **故意不登记它**（自行裁定：登记等于替 Q3 的「删或补」裁决预设答案）。**教训同 ③：写「已注册 / 已记录」这类断言前必须 grep 实测，否则是把推测当测量。**）
  >
  > **⑥ 新发现（Q25）：19 门已交付课里有 8 门没有讨论日志，且全部集中在 `classic` 章**（system-modeling / transfer-function / time-domain-analysis / stability-analysis / frequency-domain-analysis / root-locus / pid-controller / compensator-design）。全仓 `docs/discuss-log/` 下实测只有 **11** 个 `.md`，全在 `07-nonlinear`(8) 与 `08-intelligent`(3) 两个目录里。**已排除脚本假阴性**：`find docs/discuss-log -type f` 实测就是这 11 个文件，没有别处存放的 classic 日志。日志缺失本身不是新事实（§0.2 的「45 门有 MDX 但无日志」早已在册、`npm run check` 也报），**sharper 的部分是这 45 门里有 8 门已被标成 `v1.3` 并在 tracker 打勾**——B4 要求每课交付 4 份档案（讨论日志 + 柯验三方对账表 + 何疑红队放行记录 + 秦构九项硬门槛输出），这 8 门一份都没有，即 **classic 章的「已交付」状态是靠正文存在性给的、不是靠流程给的**。E1 按 Prompt 只报 WARN（第 8 项不阻断签发），是否升级为「8 门补做流程或降级 status」需用户裁决。
  >
  > **⑦ 七处自行裁定（用户预先授权自行决策，可否决）**：
  > **(a) fixture 保留、不删。** B6 立过规矩「验证脚本必须是仓库产物，不得放 `%TEMP%` 后删」；fixture 是验收第二半（「对一门故意注入错误的课能报 FAIL」）的唯一载体，删了这条验收就无法复现，而 C1 会反复用这道门。已在脚本头注释里写明复现命令与「它对 check / tsc 无害」的实测依据。
  > **(b) E1 不改任何 MDX 与组件正文。** ④ 的两行、⑤ 的两个 `useMemo`、③ 的死链都是内容改动，而 Prompt 把 E1 的产出限定为 `scripts/verify-lesson.mjs` 与 `package.json`；更关键的是按 B8 的规矩任何内容修复都要配一条带归因三字段的 fix-log（019 / 020 的详情文件至今还是 B8 遗留项），在工具阶段顺手改内容会同时破坏「只改 N 个文件」的 mtime 证据链与 fix-log 纪律。**建议交给 C1，或单开一条 Q6 + Q25 修复条目。**
  > **(c) 第 1 项 1b 的判据按实测写、不照抄 SKILL.md 与 Prompt 的字面表述。** Prompt 要求「扫 `$$\begin` 与 `\end.*\$\$`」，《前端交付硬门槛（B6 起）》§1 第 2 项与 fix-012 都写「`$$` 必须独占开 / 闭行」。**照字面实现会产生灾难性假阳性**：实测全仓 56 门课的 `$$` 共出现 **4590** 次，其中单行 `$$…$$` **1335** 行、裸 `$$` 独占行 **1912** 个，两者都合法（单行形态内含 `\begin{bmatrix}…\end{bmatrix}` 也合法，micromark 实测 h2 不缺、不吞后文）；字面扫 `$$\begin` 命中 **10 行 / 9 门课，全部是假阳性**；字面扫 `\end.*\$\$` 命中 **152 行 / 27 门课，其中只有 2 行是真违规**（假阳性率 98.7%）。故改为开 / 闭状态机：**单行合法；开行带内容 = WARN（实测能正常渲染，但它是硬违规的前置形态）；闭行带内容 = FAIL（真吞文）**。实测结果：真 FAIL **2 行 / 2 门**、WARN **6 行 / 5 门**（system-modeling 1、state-observer 1、feedback-linearization 2、两门 mpc 各 1）。**这条差异应回写进 SKILL.md §1 第 2 项与 fix-012**，登记为 **E1 移交项**——那两个文件不在 E1 范围内，且改 SKILL.md 要同步两份逐字相同的副本（B6 §6 的 diff 命令）。
  > **(d) 第 5 项的 category 轴不要求 min / max。** ECharts 里 `min` / `max` 只对 `value` / `log` 轴有效，category 轴的域由 `data` 数组决定；照 Prompt 字面「xAxis / yAxis 是否设置了显式 min / max」会把所有 category 轴判违规。实测全仓 124 个轴块：category 4（全有 `data`）、log 16、value 103，只有 1 个 value 轴缺 min / max（就是 ⑤ 的 `bode-margins-explorer.tsx:111`）。缺省 `type` 按 ECharts 默认判（xAxis → category、yAxis → value）。
  > **(e) 第 3 项的 ipywidgets 判 FAIL 但标 `[存量债务]` 并单列 C 级。** B6 定过口径「全仓红既不是本课的挡箭牌、也不是本课的罪状」；E1 让它计入 FAIL（否则 C1 的 19 门重构目标不会被任何命令报出来），但在健康度分级里单独成级，使 **C 级 = 「只有这一项 FAIL」= 可以直接进 C1**。
  > **(f) 脚本里不许出现硬编码的跨课统计。** 收尾自查抓到两处自己写死的数字：第 9 项的「全仓仅 `math/complex-numbers` 如此」与第 8 项的「全仓 45 门有 MDX 但无日志」。前者改为打印本课实际 H2 列表（跨课统计本来就由末尾「按项统计 FAIL」动态算出），后者改为按 `mdxByKey` 与 `logKeys` 现算；另把三处注释里的实测计数加上「E1 时点」前缀，并给 `useECharts` 与 `animation: false` 两项补了「剔除整行 `//` 注释后再判」（fixture 实测到这两个假阴性：只在注释里写一句 `animation:false` 就算设置过）。**这是 B3 那条教训（「兜底表 / 推断表必须自带『这是推断』标签与废弃条件」）在代码里的同型应用**，也与 B5「plan §3.7 的三行示例数据全部有误」、⑥ 的「45 门」同源：写死的数字一旦进文档就没人回头核它是否还等于实况。
  > **(g) A 级「全绿」在 `--no-http` 下是打折的，脚本自己声明这一点。** 第 6 项是唯一需要渲染结果的门槛，无 dev server 时标 SKIPPED 并打印启动命令；健康度分级里若 A 级含 SKIPPED 项会追加一行告警，防止把「没验」读成「验过」。本次两份报告都在 dev server 在线时跑的，SKIPPED 均为 0。
  >
  > **⑧ E1 的缺口与移交**：**(i)** 第 4 项现在核两个注册表，**E2 完成后要改成核单一来源模块被两处引用**（Prompt 自己点了这条）；**(ii)** 第 8 项按 Prompt 只查讨论日志「是否存在」，**B4 的 16 条日志结构机检口径未纳入**（`[共识]` / `[待定]` / `[郑核-签发]` / `[沉默-…]` 的次数、附录 A.1 与 C 的六列表头逐字一致等），那是 E3 / E4 的活，脚本启动时已打印这行口径声明；**(iii)** `parseCatalog` 的两份副本应在 **E3** 抽成 `scripts/lib-catalog.mjs`；**(iv)** B6 §6 的「两份九项清单三方 diff」目前仍是手工命令，**E3 可把它折进本脚本**；**(v)** 第 7 项的 `📐 本文用到了` 引用行实测全仓 **0** 条（另有其它 `📐` 装饰行 20 条）——A4 step 4「先只输出清单不插入引用」的结果，等 A4 那份待批清单被批准插入后本项才有实际检查对象；**(vi)** §5.1 门槛表第 5 行把「`npm run build` 通过」的自动化归给 E1，**但九项里没有一项跑 build**（第 6 项 curl 的是 dev server 的 SSR HTML，与生产构建不是同一件事：`next build` 会额外做类型检查与静态导出，dev 能起不代表 build 能过）。**该行应改为「E3 或 CI」，或由 E3 给 verify-lesson.mjs 加一个 `--build` 开关**——E1 不改这张表（plan 已冻结、且表在 D 阶段名下）。

- [x] **E2 · 消除组件双注册表（fix-015 根治）**（2026-09-26 完成）
  - 做什么：把组件映射抽成单一来源模块，`mdx-components.tsx` 与 `lib/content.ts` 都从它导入；若受 client/server 边界限制无法做到，则退化为自动一致性检查
  - 涉及文件：新建 `lib/wiki-components.ts`、`mdx-components.tsx`、`lib/content.ts`、`scripts/verify-lesson.mjs`（第 4 项）、`.agent/fix-logs/INDEX.md`
  - 验收：5 门含交互组件的课程页 curl 200 且能 grep 到组件渲染痕迹

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/fix-logs/2026-09-25-015.md、
  mdx-components.tsx、lib/content.ts，以及 .agent/semester-02-plan.md 的 P11。

  背景（fix-015）：组件注册表有两份——mdx-components.tsx 与 lib/content.ts 中
  compileMDX({components}) 的映射。课程页走后者且显式传参会覆盖前者，因此只改
  前者会导致页面 500 "Expected component X to be defined"。当前靠人工"两处同改"
  规避，这是可以根治的结构问题。

  任务：
  1. 新建 lib/wiki-components.ts，导出唯一的组件映射对象（含所有 components/wiki/
     下的交互组件与 JupyterNotebook 等基础设施组件）。
  2. 修改 mdx-components.tsx 与 lib/content.ts，两处都从 lib/wiki-components.ts 导入，
     不再各自内联映射。注意 mdx-components.tsx 可能还需保留 MDX 内置元素
     （h1/h2/table/code/blockquote 等）的自定义渲染，这部分保留在原处，只把 wiki
     自定义组件抽出去。
  3. 确认 "use client" / server component 边界与序列化限制不被破坏。
     mdx-components.tsx 与 lib/content.ts 的运行环境可能不同（后者可能在服务端
     编译 MDX），若服务端模块无法导入 client 组件，需要保留一层薄封装。
  4. 若第 3 步发现**无法真正做到单一来源**（Next.js 的 client/server 边界限制），
     则退而求其次：在 scripts/verify-lesson.mjs 中把"两处映射的 key 集合是否相等"
     作为 FAIL 级检查（E1 第 4 项的强化版），并在两个文件顶部各加一行注释指向
     对方与检查脚本。把这个折中方案的技术原因写清楚，记录到 fix-log。
  5. 验收：npm run build 通过；curl 5 门含交互组件的课程页
     （nonlinear/phase-plane、nonlinear/describing-function、
     intelligent/fuzzy-control-basics、classic/time-domain-analysis、
     nonlinear/adaptive-control-basics）全部 200，且响应 HTML 中能找到对应组件的
     渲染痕迹（grep 组件内的特征文本或 style）。
  6. 更新 .agent/fix-logs/INDEX.md：为 015 追加一条"根治记录"，说明现在的机制
     （单一来源 / 或自动一致性检查），归因角色填"秦构"。

  勾上 .agent/semester-02-plan.md 的 E2。
  ```

  > **E2 完成补记（2026-09-26，用户预先授权自行决策，可否决）**
  >
  > **① 落地物**：新建 `lib/wiki-components.ts`（**91 行**，`wc -l`；导出 `wikiComponents`，**37 个键** = HEAD 时两个注册表各自导入的 37 个组件，一个不多一个不少）；`mdx-components.tsx` 由 **81 行**（`git show HEAD:mdx-components.tsx`）压到 **15 行**，只留 import + 展开；`lib/content.ts` 由 **149 行** 压到 **93 行**，`compileMDX` 改传 `components: { ...wikiComponents, ...extraComponents }`（`extraComponents` 是 A8 为前置/接下来学卡片留的口子，未动）。**"新增组件必须两处同改"这条人工纪律自此作废**，改为在单一来源里加一行 import + 一行键名。**自行裁定扩了 3 个文件**（Prompt 的涉及文件清单之外，理由见 ⑤ 与 ⑧）：`scripts/check-catalog.mjs` 第 5 节、`.agent/e1-fixture/` 三个文件、`.agent/fix-logs/INDEX.md` 的 015 行本身。
  >
  > **② Prompt 第 3 步的结论：client / server 边界不构成障碍，第 4 步的退化方案没有启用。** 交付的是**真的单一来源**，不是"两处映射 key 集合是否相等"的一致性检查。技术理由：`lib/wiki-components.ts` **不能**带 `"use client"`——带了以后这个导出对象本身会变成一个 client reference，服务端 `lib/content.ts` 里的 `{ ...wikiComponents }` 展开就拿不到各个组件，引用任何自定义组件的页面都会 500；而各 explorer **自己**带 `"use client"`（`components/wiki/` 下 **44** 个 `.tsx` 里 **42** 个带，例外只有 `callout.tsx` 与 `lesson-nav.tsx`），所以一个**中立**模块 re-export 它们，服务端拿到的正是 `compileMDX` 需要的 client reference 形态。这条禁令写进了 `lib/wiki-components.ts` 的头部注释，并由三处机检守住（见 ⑤）。Prompt 第 3 步设想的"薄封装"因此不需要。
  >
  > **③ Prompt 第 2 步的但书不成立（实测）**：原 `mdx-components.tsx` 里 **0 个** MDX 内置元素渲染器——`git show HEAD:mdx-components.tsx` 的 81 行全是 `components/wiki/*` 的 import（第 2–38 行）与 `useMDXComponents` 里的 37 个键（第 42–78 行），没有 h1 / h2 / table / code / blockquote 中任何一个。Prompt 写的是"**可能**还需保留"，条件不成立，故无需保留任何原处渲染器。
  >
  > **④ 新发现：fix-015 记录的机理是错的（症状真、原因假），已连同更正写进 `INDEX.md` 的《根治记录 015》。** 015 行与 Prompt 的背景段都写"课程页走后者且显式传参会**覆盖**前者"。实测有两条各自独立的原因说明 `mdx-components.tsx` 对课程页**从未生效**，谈不上被覆盖：**(i)** `next-mdx-remote@4.4.1` 的 RSC 路径在 `node_modules/next-mdx-remote/dist/rsc.js` 里显式写 `providerImportSource: rsc ? undefined : '@mdx-js/react'`，注释是 "Disable the importSource option for RSC to ensure there's no `useMDXComponents` implemented."，随后 `compileMDX` 用 `React.createElement(Content, { components })` 且 `components` 默认 `{}` → **`useMDXComponents` 根本不会被调用**；**(ii)** `next.config.mjs` 虽接了 `@next/mdx`（`createMDX`）、`pageExtensions` 含 `mdx`，但仓库里 `content/` 之外没有任何 `.mdx` 文件、也没有任何模块 import 一个 `.mdx` → `@next/mdx` 无对象可作用。**即"双注册表"其实是"一份活的 + 一份死的"。** 这条错判有实际代价：它让人以为"两处都写就安全"，掩盖了"`mdx-components.tsx` 写什么都没用"，Q3 孤儿组件的登记状态也因此被误记（见 ⑨）。**保留 `mdx-components.tsx` 而不删**（自行裁定）：它是 `@next/mdx` 的约定入口，一旦有人新增 `.mdx` 页面就立刻生效，删掉等于把"已知无效"换成"将来静默失效"；文件顶部已写明这一点与它当前不生效的原因。
  >
  > **⑤ 新发现：`npm run check` 的 fix-015 门槛在重构后会静默变成恒真 PASS——比没有门槛更危险。** 只按 Prompt 改完两个消费方之后，`check-catalog.mjs` 第 5 节原有的 `halfReg` 判据照旧打印"被引用的交互组件在两个注册表中均已登记（fix-015）"，而**实际什么都没比**：它的 `registryNames()` 只匹配花括号形式的 import，重构后两个文件都只 `import { wikiComponents }`，解析出的集合是空的，空集合之间当然"同步"。已把第 5 节重写为实质检查（单一来源覆盖率 + 不带 `"use client"` + 两个消费方的导入/展开/内联残留），标题改为「components/wiki 组件 ↔ MDX 引用 ↔ 单一来源注册表（E2 起，fix-015 已根治）」。**现在的机检共三处，都是 FAIL 级**：`verify-lesson.mjs` 第 4 项（按课：本课引用的组件是否都登记在单一来源、单一来源是否存在且导出）、`verify-lesson.mjs` 末尾《附 · 组件注册结构》（全仓：存在 / 有 `export const wikiComponents` / 不带 `"use client"` / 两个消费方都导入并展开 / 无内联残留；`--all` 与 `--delivered` 计入退出码，单课运行只提示）、`check-catalog.mjs` 第 5 节（`npm run check` 退出码 1）。结构类缺陷放全仓附录而不是按课，是因为一个结构缺陷会让 56 门课全部 FAIL、把健康度分级彻底污染（自行裁定）。
  >
  > **⑥ 验收全过，非回归四项与 E1 逐字一致。** `npm run build` 退出码 **0**、**146** 个静态页全部预渲染——**这一步本身就是最强的注册表证明**：SSG 逐课执行 `compileMDX`，任何组件缺登记都会在构建期抛 "Expected component … to be defined"，不可能悄悄过去。Prompt 点名的 5 门页在**生产构建下** curl **全 200**（dev 下亦全 200），5 页共 **11** 个交互组件逐个在 HTML 里 grep 到"非正文来源"的特征文案（判据：该串出现在组件源码、出现在 HTML、且**不作为散文**出现在本课 MDX 里；组件标签 props 内的串不算散文，因为它本来就是组件的标题），5 页 katex 均在、h2 锚点均在、"Expected component" 命中 **0** 次。非回归：`npx tsc --noEmit` 退出码 **0**；`npm run check` **PASS 17 · WARN 36 · FAIL 0**（计数与 A7 起逐字一致，但第 5 节判据已换成实质检查）；`npm run verify -- --delivered` **19 门 / 171 项 / PASS 149 · WARN 20 · FAIL 2 · SKIPPED 0**；`npm run verify:all` **56 门 / 504 项 / PASS 399 · WARN 77 · FAIL 28 · SKIPPED 0**、健康度 **A 3 / B 29 / C 19 / D 5**——四项与 E1 交付时逐项相同。
  >
  > **⑦ 负向验证（A7 教训：只对着干净的当前仓库跑等于没测）**：对 `.agent/e1-fixture/` 注入 5 类缺陷，逐条确认门槛会响——注入 4（单一来源漏登记 `BadExplorer` / `HalfExplorer` 而 `bad-lesson.mdx` 引用了它们）→ 第 4 项 FAIL「组件已实现且被本课引用，却没登记进单一来源」，对照组 `fx/good-lesson` 第 4 项仍 PASS、退出码 0；注入 A（单一来源文件被删/改名）→ 第 4 项与附录都报，`check-catalog.mjs` 第 5 节同样 FAIL；注入 B（单一来源带 `"use client"`）→ 附录报出完整因果，`check-catalog.mjs` 同口径 FAIL；注入 C（消费方导入了却没展开）→ 报「映射为空」；注入 D（消费方不导入、退回内联）→ 报「注册表又分叉了（fix-015）」，B+C+D 叠加跑 `--all` → 附录 5 条、退出码 1。fixture 的 `mdx-components.tsx` **常驻**保留一条内联 import（注入 4b），使"内联残留"这条检查每次跑 fixture 都被行使。顺带修掉一个误报：消费方**没有**导入时原逻辑会同时报「导入了却没展开」，已改 `else if`（变异 D 单发实测只报一条）。fixture 从 10 个文件增到 **11** 个（新增 fixture 版 `lib/wiki-components.ts`）。
  >
  > **⑧ 自行裁定 8 条**（用户预先授权自行决策，可否决）：**(a)** 保留 `mdx-components.tsx` 而非删除（理由见 ④）；**(b)** 扩到 `scripts/check-catalog.mjs`——不在 Prompt 的涉及文件清单里，但不改就等于交付一个假绿门槛（⑤）；**(c)** 扩到 `.agent/e1-fixture/`——第 4 项语义已变，fixture 不改就会因过时原因 FAIL，负向验证随之失效；**(d)** 结构性检查放全仓附录而非按课（⑤ 末）；**(e)** **不**把 `BodeMarginsExplorer` 登记进单一来源——Q3 的裁决是"删或补"，登记等于替它预设答案，故让它继续既孤儿又未登记，`verify-lesson.mjs` 汇总与 `check-catalog.mjs` 第 5 节的 WARN 都会把这两个状态一起打出来；**(f)** 不加 `verify:delivered` 这类 npm script（E1 已定：`--delivered` 是脚本参数，19 门那条命令是 `npm run verify -- --delivered`）；**(g)** **扩到三份角色文档**——两个 SKILL.md 里那两份**逐字相同**的九项清单副本（`wiki-discussion/SKILL.md:767`–`:768` ↔ `v1.3-refactor/SKILL.md:118`–`:119`，改完重新 `diff` 仍 `TWIN-IDENTICAL`）、`v1.3-refactor/SKILL.md` 的 Step 2c 与《注意事项》、以及 `personas.md` 秦构清单 `:406` / `:414` / `:424`。Prompt 没点名它们，但它们承载的正是「新增组件要改哪几处」这条操作指令，不改就会继续指挥人去做一个已作废的「两处同改」。**B6 §6 的三方 diff 自此有一处设计内不一致**：第三方是本文件 §3.7 M3 / `:719`，那行仍是旧措辞，但它自带「（E2 后为单一来源）」注脚、且本文件自 Q13 起冻结 → 按注脚生效，解冻时回写；**(h)** **不建 fix-log 019 / 020 的详情文件**（理由见 ⑩-(iii)）。
  >
  > **⑨ 顺带更正 E1 留下的两处假陈述**（都是本阶段实测撞出来的，按 B5「叙述服从测量」就地更正、保留原文与更正标记）：**(i)** E1 批注 ②（本文件 `:1717`）称"`tsconfig.json` 的 include 确实会编译 fixture 的三个组件，恰好它们类型合法"——**依据是错的**。TypeScript 的 include 通配默认跳过点号目录：在 `.agent/tsc-probe.ts` 放一个故意的类型错误、同时在仓库根放同一份错误作对照，`npx tsc --noEmit` 只报根目录那一个（`tsc-probe-control.ts(2,14): error TS2322`，退出码 2），点号目录那个一声不响 → `.agent/e1-fixture/**` 压根不在类型检查范围内（旁证：fixture 的 `lib/content.ts` 导入 `@/components/wiki/good-explorer`，按 `@/*` → `./*` 会解析到仓库根下不存在的文件，若真被编译必报 TS2307，而 tsc 退出码 0）。结论"fixture 不影响 tsc"不变，但依据要从"恰好类型合法"改成"没被编译"——差别在于前者会让人以为 fixture 里的组件受类型保护。两个探针文件跑完即删。**(ii)** E1 批注 ⑤（本文件 `:1723`）称 `BodeMarginsExplorer`"已在两个注册表里注册，任何课一旦引用就带着轴漂移上线"——**实测为假**：它在 E2 之前的 `mdx-components.tsx` 与 `lib/content.ts` 里各命中 **0** 次，全仓只出现在自己的实现文件（`:97` 定义、`:111` 违规轴）。真实后果与原注解相反：一旦被人引用，先撞上的是 fix-015 的 **500**，轴漂移要等它被登记之后才会浮现。`verify-lesson.mjs` 汇总里那句「孤儿交互组件（已实现**已注册**…）」已改为「已实现、全仓无 MDX 引用」并追加逐组件的登记状态。**教训同 E1 批注 ③：写"已注册 / 已记录 / 已编译"这类断言前必须 grep 实测。**
  >
  > **⑩ E2 的缺口与移交**：**(i)** **更正（本项写下之后 E2 又改了文件，原陈述已不成立）**：本项原写"`personas.md` 秦构清单里那条未同步为『单一来源登记一处』、E2 未动 `personas.md`"——实测 E2 随后把三份承载该操作指令的角色文档一并改了（见 ⑧-(g)：两个 SKILL.md 的九项清单副本 + `v1.3-refactor` 的 Step 2c 与《注意事项》+ `personas.md:406` / `:414` / `:424`）。**真正仍未同步的只有本文件自己**：检查清单 `:719` 与《5.1 单课交付门槛》第 7 行（`:2191`）都还写着"双处注册"。二者均在 Q13 冻结范围内，`:719` 那行自带"（E2 后为单一来源）"注脚、按注脚生效，解冻时一并回写。**这一项与 ① 里那个 `:2161`–`:2174` 是同一类错误：批注在 12:27 写下、角色文档在 12:43–12:45 才改，写完就过时了。** **(ii)** `check-catalog.mjs` 的 `singleSourceKeys` 与 `verify-lesson.mjs` 的 `parseSingleSource` 是两份同功能解析逻辑，与 `parseCatalog` 的两份副本同病，**E3 应一并抽到 `scripts/lib-catalog.mjs`**（E1 移交项 (iii) 的范围因此扩大）。**(iii)** **B8 遗留项 019 / 020 的详情文件仍未建，E2 有意没顺手做**（自行裁定）：`fix-tracker/SKILL.md`《归因回顾机制》§5 对这两条的表述已被 E1 / E2 的实测推翻——020 写"组件实现并**注册**后忘了在 MDX 里引用，现存活实例 = `bode-margins-explorer.tsx`"，而该组件从未被登记（⑨-ii）；019 写实例出自 `intelligent/fuzzy-controller-design`，而 E1 抓到的活实例在 `describing-function-explorer.tsx:67` 与 `nyquist-limit-cycle-explorer.tsx:137`（`nonlinear/describing-function` 用）。照原文誊进详情文件等于新造两条假记录，**须先更正 §5 再建档**。**(iv)** E1 移交项 (vi)（§5.1 门槛表第 5 行把 build 归给 E1 而九项里没一项跑 build）**E2 未改那张表**（plan 冻结、表在 D 阶段名下），但 E2 的验收确实跑了一次完整 `npm run build`；该行仍应改为「E3 或 CI」，或由 E3 给 `verify-lesson.mjs` 加 `--build` 开关。

- [x] **E3 · Notebook cell 拼接标准化（fix-017 根治）**（2026-09-26 完成，批注见下方 ①–⑨）
  - 做什么：写 `scripts/nb-cells.mjs` 提供 extract / verify / assemble 三个能力，占位符统一为不含 `%` 的 `<<NBn>>`；内置静态检查；可选地通过 kernel API 实际执行验证
  - 产出：`scripts/nb-cells.mjs`、`package.json`（新增 `nb:verify`）
  - 验收：对全部已写课程跑静态检查并贴出报告；两个 SKILL.md 的人工检查表述被替换为工具调用

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/fix-logs/2026-09-25-017.md、
  .agent/fix-logs/2026-09-24-013.md、components/wiki/jupyter-notebook.tsx、
  scripts/jupyter_server.py、以及 content/nonlinear/nonlinear-characteristics.mdx 中
  JupyterNotebook 的实际写法。再读 .agent/semester-02-plan.md 的 P11 与 3.7 M3。

  背景（fix-017）：拼接脚本用 %%NBn%% 作占位符，经过一层 % 格式化被折叠成 %NBn%，
  导致 9 个 cell 首行从 `# 注释` 变成 `%# 注释`，IPython 当成 line magic 报
  UsageError。这个错误"页面 200 / H2 数 / katex / 命令行 harness 全都查不出来，
  只有在浏览器里点开运行才暴露"。修法是改用不含 % 的占位符（如 <<NB1>>），
  并新增"MDX cell 与 harness cell 字符串全等"校验作为交付门槛。
  背景（fix-011）：同页多个 Notebook 若共用 kernel id 命名空间，变量会互相覆盖，
  报出与本页代码无关的 ValueError。

  任务：写工具 scripts/nb-cells.mjs，提供三个子命令：
  a) **extract**：从指定 MDX 抽出所有 JupyterNotebook 的 setupCode 与 cells，
     输出 JSON（数组，保持顺序），含组件 id 与 kernel id 生成方式。
  b) **verify**：把抽出的 cells 逐条通过 Jupyter Kernel HTTP API（端口 8891）实际
     执行，报告每个 cell 的执行状态与 stderr。
     **Windows 关键注意**：系统代理会让 POST 返回 502，必须用
     `new ProxyHandler({})` 绕过。execute 返回体形如 {"outputs":[...]}，
     需检查其中是否含 error 类型的输出。
     若 kernel server 未运行，标注 SKIPPED 并给出启动方法。
  c) **assemble**：从 JSON 生成 MDX 中 JupyterNotebook 的 JSX 片段，占位符统一使用
     `<<NBn>>` 形式（不含 %），并对生成结果做**反向校验**（重新 extract 后与源
     JSON 逐字全等）。

  内置静态检查（不依赖 kernel 也能独立工作）：
    - cell 首行不得匹配 /^%[^\w]/ 或 /^%#/（fix-017 模式）
    - cell 与 setupCode 中不得出现 ipywidgets / interact / FloatSlider / IntSlider / widgets.
    - JSX 属性之间不得有逗号（fix-013 模式）
    - 同一 MDX 内多个 JupyterNotebook 的 id 前缀必须互不相同（fix-011 模式）

  在 package.json 增加 "nb:verify": "node scripts/nb-cells.mjs verify --all"。

  完成后：
  1. 对全部已写课程跑静态检查，贴出完整报告。
  2. 把这个工具写进 .agent/skills/v1.3-refactor/SKILL.md 的 Step 2e 与
     .agent/skills/wiki-discussion/SKILL.md 的 Phase 4 硬门槛清单，替换掉原先
     "人工检查 cell 首行"的表述，改为具体命令。
  3. 更新 .agent/fix-logs/INDEX.md：为 017 追加"根治记录"，归因角色填"秦构"。
  4. 勾上 .agent/semester-02-plan.md 的 E3。

  约束：不要引入新的 npm 依赖。
  ```

  > **E3 批注（2026-09-26 完成）**
  >
  > **① 落地物**：`scripts/nb-cells.mjs`（**648 行**，`wc -l`；extract / verify / assemble 三个子命令）+ `package.json` 新增 `nb:verify`（Prompt 只点这一条 script）。**自行裁定扩了 4 处**（理由见 ⑤）：`scripts/lib-mdx.mjs`（**483 行**）与 `scripts/lib-catalog.mjs`（**67 行**）两个共用解析层、`.agent/e3-fixture/`（**12 个文件** + 181 行 README，仓库产物）、两个 SKILL.md 的 §1–§6 twin block、`personas.md` 秦构清单。**零新增 npm 依赖**（只用 `node:fs` / `node:path` / `node:url` / `node:http`），也**不用 `execSync`**（同 E1：本仓 hook 列为高危，且走 `node:http` 直连 8891 比 fork curl 可控）。
  >
  > **② 核心口径（Prompt 没写、但是本条根治的要点）**：cell 代码写在反引号里，浏览器先按 **JS 模板字面量求值**再 POST 给内核，所以 **MDX 字面 ≠ 内核收到的代码**（`\n` 变真换行、`\lambda` 掉反斜杠、`\\n` 才是字面 `\n`）。实测 529 个代码块里 **80 个（15.1%）**有这种差异。017 原门槛「MDX cell 与 harness cell 全等」的**两边同源**（harness 的 cell 也是从同一份 MDX 抽的），同一套解析把两边一起污染时恒为全等——当时 `9/9 ALL MATCH` 而 bug 照样上线。故 S1/S2/S4/S5 一律作用于**求值后**的串，S6 再拿真内核当独立第三方证据。
  >
  > **③ 验收两半都过**：**(a) 全量报告**（56 门 · 182 notebook · 347 cell，内核在线）= 课程级 PASS 19 · WARN 7 · FAIL 30、退出码 1；按判据 `FAIL S2×44`、`FAIL S6×63`、`WARN S5×20`、`WARN S6×17`、`WARN S7×37`；**S0 / S1 / S3 / S4 命中数全是 0**，S8 四条结构前提全绿 → 017 那一类缺陷在现网已绝迹，且判据不是恒真（夹具里 `S0×4 S1×1 S2×2 S3×1 S4×1 S5×5 S7×1 S8×4` 逐条会红）。**(b) 两个 SKILL.md 的人工表述已换成命令**：§5「cell 逐字全等（工具 `nc-verify.py` 已不在仓库，需现场重建）」整条替换为 `npm run nb:verify`，twin block 改完重新 diff 仍 `TWIN-IDENTICAL ✓ 104 lines`。
  >
  > **④ 63 个 S6 error cell 的诚实分级**（不分级就会把存量债务当成 E3 的新发现）：**30 个是 ipywidgets**（16 `interact` NameError + 14 ModuleNotFoundError），即 S2×44 的运行时后果、A6 已登记债务、C1 的重构目标本身；**另 33 个是本工具第一次跑出来的新缺陷** = `setupCode` 缺 import / 跨 cell 依赖断裂 15（`feedback`×6、`La`×2、`tf`/`cp`/`sol`/`valid`/`min_energy_ode`/`plot_lambda_effect`/`plot_diophantine_convergence` 各 1）+ 库 API 漂移 5（`control.pole`×2、`scipy.signal.dcgain`、`bode(plot=)`、`forward_euler`）+ 数值/建模错 11 + 模板保真度 1（`robust/h-infinity-basics.mdx:444` 的 `print("\n结论…")` → 真换行落进 Python 字符串字面量 → SyntaxError）+ 纯运行时错 1（`discrete-sampled/z-transform-analysis.mdx:259` 的 `linefmt=colors[i]+'-'`，而 `colors=['blue',…]`，matplotlib 格式串只认单字母色码）。cell 是**同一内核顺序执行**（traceback 显示 `Cell In[2]`/`In[3]`，`In[1]` 是 setupCode），故那些 NameError 是真缺陷、不是工具孤立执行 cell 的假象。**后两类各 1 条都是「页面 200、点运行才炸」，与 017 同性质，静态判据查不出来。**
  >
  > **⑤ 自行裁定 5 条**（用户预先授权自行决策，可否决）：**(a)** 抽 `scripts/lib-mdx.mjs` / `lib-catalog.mjs`——不在 Prompt 的产出清单里，但 E1 移交项 (iii) 与 E2 移交项 (ii) 都点了它，不抽就是第 5 份解析副本；抽完三个脚本（`nb-cells` / `verify-lesson` / `check-catalog`）共用同一份 `RE_WIDGETS` / `RE_MAGIC_FIRST` / `RE_PLACEHOLDER`。**(b)** 建 `.agent/e3-fixture/` 为**仓库产物**而非临时文件（A7 规矩：只对着干净的当前仓库跑等于没测；B6 规矩：验证脚本与其测试数据都不得放 `%TEMP%` 后删）；含 `mock-kernel.mjs`（确定性触发内核回收 + 重放，真服务端要空闲 1800 秒才回收，等不到）与 `make-crlf.mjs`（CRLF 围栏回归用生成器而非提交 `.mdx`，因为编辑器另存 / `core.autocrlf` 会把它悄悄改回 LF 让测试静默失效）。**(c)** 判据从 Prompt 列的 4 条扩到 **S0–S8 九条**（新增 S0 结构、S5 保真度、S6 实跑、S7 未知属性、S8 结构前提）。**(d)** S0 里**空串 `setupCode`** 单独判一条 FAIL：服务端 `body.get("setup_code", DEFAULT_SETUP)` 的默认值只在**键缺失**时生效，键在而值为空串等于显式要求「什么都别 setup」。先实测再落判据——现网 182 个 notebook 里空串 0 个、纯空白 0 个、无 import 行 0 个，**加它对现网输出零回归**，属预防性收口。**(e)** **不修那 33 个新缺陷**：E3 的范围是工具与测量，改 MDX 正文属 A6 / C1；顺手改会让「工具第一次跑出来的基线」与「修完的状态」混成一份报告，再也分不清工具抓到了什么。
  >
  > **⑥ 顺带更正 Prompt 里两处与实测不符的表述**（按 B5「叙述服从测量」就地更正、不改原文）：**(i)**「**Windows 关键注意**：系统代理会让 POST 返回 502，必须用 `new ProxyHandler({})` 绕过」——**`ProxyHandler` 是 Python `urllib` 的东西，不是 Node 的**。Node 的 `http.request` 从不读代理环境变量，本工具的 S6 走 `node:http` 直连 `127.0.0.1:8891`，无需任何绕过；真正需要 `--noproxy '*'` 的是 `curl`（夹具 README §4 已按此写）。这条错表述源自项目记忆里那句 Python 侧的经验被误植到 Node 语境。**(ii)**「同一 MDX 内多个 `JupyterNotebook` 的 **id 前缀**必须互不相同（fix-011 模式）」——**这条没有检查对象**：`NOTEBOOK_ATTRS` 实测只有 `{cells, setupCode, title}`，全仓 `content/` 下带 `id=` / `notebookId=` / `kernelId=` 的 `<JupyterNotebook` **0 个**，id 是组件在运行时用模块级计数器生成的（`nb-${Date.now()}-${nbSeq++}`）。故改为 **S8 结构前提四条**：模块级 `nbSeq` ✓ / `newNotebookId()` ✓ / 无 `useRef` 计数器 ✓ / 服务端重复 id 兜底 ✓——查的是**生成机制**，不是查不到字的 MDX。
  >
  > **⑦ 撞出来三个既存文档缺陷（都已修，属 Prompt 涉及文件之外）**：**(i)** §6 的 `THREE-WAY SAME` 判据**自 E2 起就不可达**——E2 把「两处同改」换成单一来源后，第三方（本文件 §3.7 M3 / `:719`）注定与那两份不同步；照旧判据执行会反过来要求把 E2 的修复改回去。已换成 `TWIN-IDENTICAL`（只比两个 SKILL.md 副本）+ 一处**已登记的设计内分歧**。**(ii)** §5 的 fix-013 判据 ``grep -c '`},'`` 是**形态判据，不成立**：一个合法的 cell 分隔符与一个被禁的 JSX 属性逗号字面同形。实测在 `content/mpc/distributed-mpc.mdx:290` **假阳**，换一种空格写法又会**漏掉真缺陷**。已换成 S3（按 JSX 属性上下文判定）。**(iii)**（收尾同步记忆时用 §6 的命令复核才抓到）**`v1.3-refactor/SKILL.md:330` 的注意事项仍写「按 §6 做三方 `diff` 核对」**——§6 正文已在 (i) 里改成两份孪生，**指向它的活指令却没跟着改**，于是文件里同时存在「判定 = `TWIN-IDENTICAL`」与「按 §6 做三方核对」两种口径。已改为「按 §6 做同步核对（E3 起判定串是 `TWIN-IDENTICAL`……旧的三方全等自 E2 起就打不出来了）」；该行在孪生块之外，改完重跑 §6 仍 `TWIN-IDENTICAL ✓ 9 项`、`npm run check` 退出码 0 / PASS 17 · WARN 36 · FAIL 0。**教训：改一个判据时要 `grep` 出所有指向它的活指令，不能只改判据正文——「§6」这种按节号引用的指针不会随节内容变化而报警。**（`personas.md:31` 那句「三方 `diff` 实测 `THREE-WAY SAME`」是 B6 时点的进度记录，按 E2 移交项 (ii)/(iii) 的先例**有意不改**——改它等于篡改历史叙事。）**这三条与 E2 那个「fix-015 门槛静默空转」同类：写在清单里的判据本身也会失效，而且失效方式是假绿/假红，不报错。**
  >
  > **⑧ 本阶段自己的教训：md5 作非回归判据不成立。** 非回归四项里三项可复核——`npm run check` 退出码 0、md5 `aae7a07ed3d39df2`、PASS 17 · WARN 36 · FAIL 0，与 `npm run verify:all` 退出码 1、md5 `16cf8d243c47bdc5`、56 门 / A 3 · B 29 · C 19 · D 5 / 课程项 FAIL 28 + 组件规范违规 3，**两者都与 E2 时点逐字一致**；`npx tsc --noEmit` 退出码 0、零输出。**第四项 e1-fixture 的 md5 复现不出来**：E3 早先记下的 `993e7972…` 在 6 种调用组合（`--all` / `--no-http` / `--quiet` / `--delivered` / 绝对路径 `--root` 等）下各得 `97145bda` / `217ebef1` / `ac6f1b25` / `21b5309c`，无一命中；而那串 md5 **没写进任何文件**、脚本又是 untracked（git 里没基线可 diff）。已改用「实质项对齐 plan `:1717` / `:1792` 记录的预期」代替并逐项吻合（退出码 1、课程项 FAIL 7 + 组件规范违规 1 + 注册结构违规 1、对照组 `fx/good-lesson` 0 FAIL 为 B 级、第 6 项 SKIPPED）。两条通用教训：**(1)** md5 只对**固定调用形态**的命令有意义（npm script 形式两条都逐字复现了）；带自由 flag 的 ad-hoc 命令，输出含 root 路径回显与 dev server 探测行，flag 一变哈希就变，看着严谨实则不可复核。**(2)** 一个无法复现的判据 ≈ 没有判据——要么固化成 npm script，要么把预期值写进文件（`.agent/e3-fixture/README.md` 就是这么做的：每组夹具写死预期级别与判据计数）。**教训同 E1 批注 ③ / E2 批注 ⑨：写「逐字一致 / 已验证」这类断言前必须当场复跑。**
  >
  > **⑨ E3 的缺口与移交**：**(i)** **33 个新缺陷未修**（⑤-e），已按 ④ 五类分级；最该优先的是 `h-infinity-basics:444` 与 `z-transform-analysis:259` 那两条（整 cell 不出图）。**(ii)** **`scripts/` 下全部工具脚本与 `lib/wiki-components.ts` 目前都是 untracked**（`git status` 显示 `??`）：E1–E3 的三个门槛在 git 里没有任何历史，误删即不可恢复，也正是 ⑧ 那条 md5 无法复核的根因之一。**是否入库由用户裁定，E3 未自行 commit。** **(iii)** `RE_WIDGETS` 已三脚本共用，但**作用对象不同**：`verify-lesson.mjs` 第 3 项作用于 MDX 字面（`extractNotebookCode`），`nb-cells.mjs` 的 S2 作用于求值后的串（`extractNotebooks`），命中数因此不同（44 vs 各课 5/7 处）——**不是矛盾，是口径差异**，两处输出都应注明，E4 之后可统一。**(iv)** E1 移交项 (vi)（§5.1 门槛表第 5 行把 build 归给 E1 而九项里没一项跑 build）**E3 仍未改那张表**（plan 冻结、表在 D 阶段名下）；E3 也没给 `verify-lesson.mjs` 加 `--build`，因为 `nb:verify` 的职责是 cell 层。该行仍应改为「CI」。**(v)** E1 移交项 (ii)（第 8 项只查讨论日志「是否存在」，B4 的 16 条日志结构口径未纳入）**E3 未做**——那需要解析讨论日志的 `[共识]` / `[郑核-签发]` 等标记与附录表头，与 cell 无关，留给 E4 或 C 阶段。**(vi)** **B8 遗留项 019 / 020 的详情文件仍未建**（E2 移交，E3 未动；须先更正 `fix-tracker/SKILL.md`《归因回顾机制》§5，理由见 E2 批注 ⑩-iii）。

- [x] **E4 · 术语表与符号约定统一表**（2026-09-26 完成，批注见下方 ①–⑪）
  - 做什么：从 56 门已写课程抽取全部术语与数学符号，建立单一权威表；找出同一概念的多种叫法与同一符号的多种含义，给出裁决建议
  - 产出：`docs/semester-02/03-glossary.md`、`docs/semester-02/04-notation.md`；`personas.md` 与 `SKILL.md` 中郑核的检查项改为查表
  - 验收：郑核的"术语一致性"检查从人工判断变为可查表；冲突条目全部有裁决建议

  **推荐 Prompt：**
  ```
  项目：D:/Workspace/control-universe。先读 .agent/skills/wiki-discussion/personas.md
  中郑核的审查清单（"风格一致性：术语是否全课程统一？符号约定是否前后一致？"）、
  .agent/skills/wiki-discussion/SKILL.md 的 Phase 3 郑核审校项、
  .agent/semester-02-plan.md 的 P4（记录了多处同名小节重复）。

  任务：
  1. 扫描 content/**/*.mdx（56 门已写课程），抽取：
     a) **中英对照术语**：所有出现的专业术语及其英文原词（例如 描述函数/describing
        function、吸引域/region of attraction、抖振/chattering、
        可检测性/detectability、零动态/zero dynamics、到达律/reaching law）
     b) **数学符号**：所有 $...$ 与 $$...$$ 中的单字母符号及其在本课中的含义
  2. 生成 docs/semester-02/03-glossary.md：术语表，字段为
     中文标准译名 / 英文 / 别名（课程中出现过的其他译法）/ 出现课程 / 建议。
     重点标出"同一概念有多种译名"的条目，给出统一建议。
  3. 生成 docs/semester-02/04-notation.md：符号约定表，字段为
     符号 / 含义 / 出现课程 / 冲突情况 / 裁决建议。
     重点排查以下已知高风险冲突（但不限于）：
       - T：采样周期 / 时间常数 / 终端时间 / 转置
       - N：描述函数 / 预测时域 / 样本数
       - Q、R：LQR 中的状态权重与控制权重 vs Kalman 中的过程噪声与量测噪声（角色互换）
       - V：Lyapunov 函数 / 体积 / 电压
       - H：传递函数 / 哈密顿量 / H∞ 范数
       - S：灵敏度函数 / 滑模面 / 协方差
       - γ：自适应增益 / 折扣因子 / H∞ 性能界 / 到达律系数
       - μ：隶属度函数 / 结构化奇异值 / 摩擦系数
       - A：系统矩阵 / 振幅 / 描述函数实部
       - K：增益 / 刚度 / 卡尔曼增益 / 反馈增益矩阵
  4. 对每个冲突给出裁决建议：保留哪个、另一个改用哪个符号、需要在哪些课程中修改。
     **本次只输出建议，不修改任何 MDX。**
  5. 在 .agent/skills/wiki-discussion/personas.md 的郑核条目中，把"术语一致性"检查
     改为"对照 docs/semester-02/03-glossary.md 与 04-notation.md 核查"；
     在 SKILL.md 的 Phase 3 郑核审校项中加上这两个文件的引用。
  6. 在 SKILL.md 的"输出格式规范"中加一条：新课程引入新符号前，必须先查
     04-notation.md 确认无冲突；若有冲突，需在讨论日志中记录裁决过程。

  只新建这两个 docs 文件 + 修改 personas.md / SKILL.md 的引用。不改任何 MDX 正文。
  勾上 .agent/semester-02-plan.md 的 E4。
  ```

  > **E4 批注（2026-09-26 完成）**
  >
  > **① 落地物**（`wc -l`，全部编辑完成后复测）：**Prompt 清单内 4 个**——新建 `docs/semester-02/03-glossary.md`（**966 行**：§0 一页速览 / §1 口径 8 条 / §2 登记表 **314 行**（§2.1 有冲突 72 + §2.2 无冲突 242）/ §3 残渣签字表 **39 行** / §4 **52 条**冲突逐条裁决（§4.1 一英多中 37 + §4.2 一中多英 15 + §4.3 三分）/ §5 门槛盲区 10 条 / §6 抽取精度实测 / §7 移交 C1·A6 的正文缺陷清单 / §8 维护）；新建 `docs/semester-02/04-notation.md`（**656 行**：§0 / §1 口径 9 条 / §2 登记表 **107 行** / §3 冲突逐条裁决（§3.1 Prompt 点名的 10 组 / §3.2 A 级 3 组 5 行 / §3.3 B 级 68 行的六条通用规则 / §3.4 总裁决 + 21 项待修清单）/ §4 全大写连写判定表 ABBREV / §5 门槛盲区 8 条 / §6 维护）；`personas.md`（**1178 行**，行数不变）；`wiki-discussion/SKILL.md`（**1097 → 1118 行**）。**自行裁定扩了 4 处**（理由见 ⑨）：新建 `scripts/glossary.mjs`（**1203 行**；`scan` / `check` / `symbols` / `terms` / `conflicts` / `abbrs` / `rows` 七个子命令）+ `package.json` 两条 script（`npm run glossary` = `scan --all`、`npm run glossary:check` = `check`）；新建 `.agent/e4-fixture/`（**8 个文件**：README **160 行** + `unit-probe.mjs` **286 行** + `ok/` 与 `bad/` 各一份 mdx 与两张玩具登记表），保留为仓库产物；`scripts/lib-mdx.mjs` 由 **483 → 502 行**（给 `scanMdx()` 加 `skips` 附加返回值）。**零新增 npm 依赖**，不用 `execSync`。**`v1.3-refactor/SKILL.md` 一个字没动**（mtime 仍是 E3 的 16:09）：E4 的改动全部落在孪生块之外，改完重跑 §6 仍 `TWIN-IDENTICAL ✓ 9 项`、与 plan 之间仍只有第 6 项那一处已登记偏离（`6c6`），整段 §1–§6 切片两份各 **104 行**、md5 同为 `7e2ba04e3b6f720a843b5d1f0f85781c`。**一条 MDX 都没改**（Prompt 硬约束；21 项符号改动与 31 处术语缺陷全部写进 04 §3.4 与 03 §7 移交 C1/A6）。
  >
  > **② 验收两半都过**：**(a)「郑核的『术语一致性』检查从人工判断变为可查表」**——`personas.md` 郑核审查清单第 2 条整条重写：术语对照 03 的「中文标准译名 / 英文 / 别名」三列、符号对照 04 §2 登记表与 §3.3 六条通用规则、机器侧是 `npm run glossary:check`（**C1 未登记符号基 / C2 未裁决别名冲突 FAIL 即打回**，C1b/C2b/C4/C5 是 WARN，**C3 只是 INFO，不得当判据用**）；同条目下「仍归郑核」那行的 `SKILL.md:356` 指针改为节名并注明「E4 起该条的核查方式改为查表」；「在讨论中的角色」里「确保全课程术语、符号、风格统一」加了两张表为准。`SKILL.md` 侧四处：Phase 3 郑核条目新增三条子项（术语查 03 / 符号查 04 / 机器侧门槛）、李稳的 Phase 3 条目加同一指针、《输出格式规范》末尾新增《**E4 术语与符号规则（硬规则，郑核签发前必查）**》六条（**Prompt 第 6 项要求的「引入新符号前先查 04」就在这里**）、《注意事项》「术语和风格必须全课程一致」改为以两张表为准。**郑核的签发前置自此多一条命令，与九项前端硬门槛同级。**(b)「冲突条目全部有裁决建议」——03 的 **52 条**术语冲突在 §4 逐条裁决、全部由 §2/§3 签字（C2 实测 PASS：登记表 737 键 + NOISE 表 39 条）；04 的 **73 行**有冲突符号在 §3 逐条给建议（107 行里剩 34 行判「无」），Prompt 点名的 **10 组**（T / N / Q、R / V / H / S / γ / μ / A / K）在 §3.1 一组不漏。**分级可机械复核：34（无）+ 68（B 级）+ 5（A 级）= 107。**
  >
  > **③ 语料实测（2026-09-26）**：56 门 MDX、**56546 行**、**20109 处行内数学 + 2295 处块级数学**；**107 个符号基**（105 直接抽出 + `PM`/`GM` 由 ABBREV 块提升为独立基）；全大写连写 **67 种 / 1131 处**（2 种是缩写、65 种是矩阵/标量连乘）；`^T` 转置 **734 处 / 30 门**（单列，不计入 $T$——计入会让 `T` 从 1692 次涨到 2426 次，把"采样周期"这个真含义淹掉）；术语条目 **305 条**、中文侧 **348 条**、登记键 **737 个**；机械草稿 305 行里 **71 行（23%）需人工过手**（改判 57 + 删除 14），另有 6 组合并、28 行手写补登记。
  >
  > **④ 两个实质结论**：**(a) 术语侧没有硬伤**——52 条冲突里 **35 条是同位语残渣**（`……控制（LQR）`、`……方程（ARE）`）、**9 条是缺全称或简称/全称不一致**、只有 **8 条是真译名分歧**（03 §4.3）。没有一处达到"同一概念被两门课译成两个名字把读者绕晕"的级别。**(b) 符号侧没有一个基需要整体改名**——107 个基全部保留，裁决落点不是"换字母"而是"**定默认含义 + 规定必须写下标的场合**"。真正会让读者当场读错的是 **A 级 3 组 / 5 行**（`sliding-mode-control` 的 $s$、$\phi+\varphi$、$\epsilon+\varepsilon$）；**B 级 68 行**每门课内部自洽，靠 04 §3.3 的六条通用规则消歧。落到正文是 §3.4 那张 **21 项 / 16 门点名 / 约 68 处**清单（必修 14 项 13 门 54 处 + 可选 7 项 14 处；**其中 29 处是行级估算**，C1 落地时按行复核），**P0 只有 3 项 3 处**。
  >
  > **⑤ Prompt 点名的 10 组里，有一组被 E4 自己的判据否决了**：草稿把 $T$ 列为 A 级（理由「`compensator-design` 内 $T$ 兼指时间常数与采样周期」），**逐形态实测不成立**——该课采样周期一律带下标 $T_s$（8 处，`:777` 的 $T_s\leq 18$ ms、`:929` 习题的 $T_s=0.01$ s 等），裸 $T$ 只有时间常数一义（`:109` / `:280` / `:609`），§1-9 的条件 ②（至少一处是裸字母）不满足 → **降为 B 级**，处置从"必修改名"降为 §3.4 的**可选** #15。$\mu$ 也差一点升级：`fuzzy-control-basics` 同课两义（`:40` 的 $\mu\mathrm{s}$ 是微前缀、`:55` 的 $\mu_A(x)$ 是隶属度函数），但两处形状自证 → 仍 B 级，列必修 #13 的理由换成**抽取器卫生**（$\mu\mathrm{s}$ 会给符号基 $\mu$ 灌 2 次假命中）。**两次判断都留在 04 §3.2，就是为了说明判据不是摆设。** 其余裁决：$Q$/$R$ 的角色互换用**下标纪律**解（不换字母）；$N$ 的"Nyquist 圈数"义改 $\nu$；$H$ 的"H∞ 空间"义改花体 $\mathcal{H}$；$V$ 的"拉氏域电压"义改 $V_a(s)$；$S$、$\gamma$、$A$、$K$ 全部按 §3.3 通用规则处理。**另更正 Prompt 的一处口径**：Prompt 说「扫描 `content/**/*.mdx`（56 门已写课程）」——实测确为 56 门，但这与 `delivery-tracker.md` 的「19 / 141 已交付」是**两个口径**（前者 = 有 MDX 正文的，后者 = 过了九项门槛的），E4 抽的是前者。
  >
  > **⑥ 机器门槛 C1–C5 + 负向验证**：C1（04 登记表缺符号基）**FAIL** / C1b（04 死行）WARN / C2（03 未裁决别名冲突）**FAIL** / C2b（03 NOISE 死行）WARN / **C3（释义候选 ≥2 且跨 ≥3 门，实测 52 个）只是 INFO，不影响退出码，不得当判据用** / C4（数学环境里漏反斜杠的函数名——KaTeX 会把 `sin(x)` 渲染成 $s\cdot i\cdot n(x)$）WARN，现网存量 **7 处**（`max` 5 / `min` 2），修复归 C1/A6 / C5（ABBREV 表缺失或死条目）WARN。现网基线 **PASS 3 · WARN 1 · FAIL 0**、退出码 0；`rows notation --diff` 对账 **107 个符号基、跳过 0 行**、退出码 0。**判据编号 C1–C5 与九项前端硬门槛、`nb-cells` 的 S0–S8、`verify-lesson` 的九项都不通用**（第四套编号了），写报告必须说明是哪一套。**负向验证（A7：只对着干净的当前仓库跑等于没测）**：`.agent/e4-fixture/ok/` → 退出码 **0**（PASS 4 · WARN 0 · FAIL 0）；`bad/` → 退出码 **1**（PASS 0 · WARN 4 · FAIL 2）；`unit-probe.mjs` **86 条纯函数断言分 6 组，PASS 86 · FAIL 0**。夹具 README 把每条命令的**预期判定与退出码写死在文件里**（E3 的教训 (2)：一个无法复现的判据 ≈ 没有判据）。
  >
  > **⑦ 撞出来的既存缺陷与新发现 5 处**：**(1) 哨兵切片被正文劫持两次，且两次的输出都长得完全正常。** 04 开头那段「哨兵必须独占一行」的警告文字里写着全字面的哨兵，早期三处切片（REGISTER / NOISE / ABBREV）都用 `indexOf` 取**第一次**出现 → loader 读到的是警告文字自己，登记表被静默截空。已根治为 `sentinelSlice()`（判据：整行 trim 后等于哨兵），并加 F 组 10 条断言回归。**教训：文档里描述一个标记时，写全字面就等于在文件里放了第二个标记。** **(2) 登记表单元格里的裸 `|` 会静默撕碎一行。** `tableRows()` 按**原始** `|` 切分、不反转义，04 的 $\sigma$ 与 $\gamma$ 两行原先写了 `$|\mathrm{Re}(s)|$` 与 `$\|T_{zw}\|_\infty$`，第 3 列被挤走 → `rows notation --diff` 报「[缺行] \gamma / [缺行] \sigma」退出码 1。修法是登记格里一律写 `\lvert…\rvert` / `\lVert…\rVert`，**不是给 loader 加解转义**（加了会与 markdown 表格自身的 `\|` 语义打架）。**这是本轮唯一一次"绿变红"是红对了的**——门槛抓到的正是它该抓的事。**(3) 两份角色文档里所有指向 `SKILL.md` / `personas.md` 的行号指针都是过期的**（E4 之前就烂了，不是 E4 造成的）：`SKILL.md:338` ×5、`SKILL.md:354`、`personas.md:773` ×2，实测所指内容早已移位。已把**活指针**全部改成节名指针（《数学基础章节规则》第 2 条 / 《注意事项》「v1.3 — 可视化双轨制」条 / 本文件小初条目「背景」）；`personas.md:29` 那条 B1 时点的进度记录按 E2 移交项 (ii)/(iii) 的先例**有意不改**。**教训同 E3 新发现 ⑤：按行号引用的指针不会随内容移动而报警。** **(4) `npm run build` 会在 `next dev` 运行时把 `.next` 抢过去**，结果是**每个动态课程路由 500 而首页仍 200**、`logs/app.log` 里一条 MDX 错误都没有。本次非回归因此先报出「课程项 **FAIL 82**」（其中第 6 项 57 门 FAIL）。排查路径：`grep -c` 定位到第 6 项 → `curl` 三个课程页全 500 → `.next/BUILD_ID` 的 mtime 正是 build 的时刻 → 日志干净。处置：停 dev 进程树、`rm -rf .next`、重启 `npm run dev`，`verify:all` 随即回到 **FAIL 28**、md5 与 E3 记录的基线**逐字相同**。**规矩：dev server 在跑时不要 build，两者互斥。**（已写进**用户**记忆 `feedback-nextjs-cache.md`——它是跨项目通用的 Windows/Next.js 环境教训，故落在用户层不是项目层。）**(5) 自己的清理命令删掉了正在写的输出**：`rm -f $TEMP/e4-*` 把 `/tmp/e4-final-gates.txt` 一起删了（Git Bash 下 `/tmp` 就是 `%TEMP%`），而当时有个后台任务正在往里写，那份 `nb:verify` 结果只能重跑。**规矩：后台任务在跑时，任何清理用的通配都不得与它的输出路径同前缀。**
  >
  > **⑧ 本阶段自己的教训：一张「给人看的表」如果同时是门槛的输入，那它的每一处排版都是接口。** 03/04 既是文档又是 `glossary.mjs` 的数据源，于是出现了三类只在"文档身份"下无害、在"数据源身份"下致命的写法：哨兵全字面（⑦-1）、单元格里的裸 `|`（⑦-2）、以及"合并两行让表更好看"（03 §5-2：合并后 C2 看不出差别——它只读**键的集合**不读行数，所以**「登记表有 N 行」这个数没有意义，有意义的是键的集合**）。**通用教训：凡是把人读的 Markdown 表格当数据源，就要为它配一条 drift 门槛**——`rows notation --diff` 就是为此存在的（拿 04 的 `出现课程` 列与本轮扫描逐基对账，手改即报）；**03 还没有对应的 `--diff`**，所以 03 的「出现课程」列写错不会有任何门槛报警（已登记为 03 §5-10 盲区）。**同源的第二条教训：预期值写进文件之后，自己新增的断言会让它过期。** 夹具 README 里写着 `PASS 76 · FAIL 0`，而 `unit-probe.mjs` 实测打 **86**——F 组那 10 条是后加的，README 没跟着改。这不是小事：**一份写着错误预期值的 README，会让下一个人以为探针坏了**（E2：假 FAIL 会让人无视整张报告）。已就地更正，并在变异测试表上方补了基线口径说明（④⑤⑥ 三行的 `PASS 76` 是当时的基线，三个变异与 F 组无交集，故红的条数不变、绿的各加 10）。**教训：往夹具里加断言会移动所有以 PASS 总数写的预期值——加断言与改 README 必须是同一个动作。**
  >
  > **⑨ 自行裁定 25 条**（用户预先授权自行决策，可否决）：**(a)** 建 `scripts/glossary.mjs` 为仓库产物并加两条 npm script + 一条 drift 门槛——**Prompt 只说「新建两个 docs 文件」，这是本阶段最大的一处扩权**。理由：没有机器读表，两张表在下一次改 MDX 时就过期，而 A7/E2 的教训是「判据不响等于没有判据」；且验收要求「从人工判断变为可查表」，只给两张静态表并不构成"可查"（56546 行语料 vs 314 行登记表，人工比对本身就是原来那条判据失效的原因）。**(b)** 给 `lib-mdx.mjs` 加 `scanMdx().skips`——不另写一份「什么不是正文」的识别逻辑（E3 抽 lib-mdx 就是为了不再长副本）；用**附加返回值**而非改签名，既有 `{tags}` 解构不受影响。**(c)** **拒绝频次阈值**：早期版本给变体加过「≥2 次才算」，实测把冲突表从 **31 条整张滤成 0 条**——真分歧往往只出现一次。`solid()` 只保留为显示用的 `*` 标记。**(d)** `PM`/`GM` 当独立符号基，靠一张**实测出来的** ABBREV 表判定而不是硬编码两个字符串——全大写连写有 67 种，字面同形的「缩写 vs 连乘」只能人工判，判完要留档（§4）。**(e)** 「全称, 缩写」写法用 `enKey()`/`isInitialism()` 折成一个键，但**保留** `Evolution Strategies` 与 `Natural Evolution Strategies, NES` 的区分（前者不是后者的首字母缩略式）。**(f)** ABBREV 表放**根作用域**哨兵块（不放课程级），并由 C5 守着缺失与死条目。**(g)** **不**给 03 的 REGISTER 加 liveness 检查（C2c）：04 的符号表与 03 的 NOISE 表是**描述性**的（0 命中说明判据过时），而 03 §2 是**规定性**的（0 命中合法地意味着"还没有课程采纳这条建议"），加了会在交付当天报出一片假 WARN。**(h)** 加**只读**的 `rows` 子命令（机械生成登记表行 + `--diff` 对账），而**不**做「从扫描结果直接生成整份文档」的生成器——③ 实测：机械草稿 **71 行 / 305（23%）需人工过手**，自动生成会把这 23% 的错误固化成"权威表"。**(i)** C2 的键检查放宽到 `known ∪ noise`（否则每条同位语残渣都要在 §2 重复登记一遍）。**(j)** 粗体星号四个位置都放行（实测 15246 处短括注里 1236 处与 `*` 相邻：括外前侧 895 / 括外后侧 446 / 括内开头 14 / 括内结尾 29）。**不放行会抽样有偏**：放行前 205 条 / 38 冲突，放行后 305 条 / 52 冲突——少掉的 100 条全是`**多输入多输出**（MIMO）`这种**最正式的术语首次定义**。**(k)** 保留 `RE_SLASH` 尽管它的精确率实测为 0（一条真术语都没多抓到）——它的假阳全部由 §3 签字吸收，删了会让 §1-4 的归一化口径失去一个入口。**(l)** 保留 `RE_ZH_PAREN` 的 `[A-Z]` 要求（放宽成 `[A-Za-z]` 会多出 15 处、其中 14 处是 `kHz|快速`、`atm|安全阀` 这类单位与英文词注解，**93% 假阳**）。**(m)** 加「括内开头」这个 EMPH 槽位，尽管实测只有 14 处、当前贡献 0 条术语——四个位置只放行三个是不自洽的，且这是给 C/D 阶段约 85 门课留的口。**(n)** **不**从 REGISTER 的单元格分隔符里去掉 `,`（去掉会让「全称, 缩写」写法漏注册一个键）。**(o)** 03 §3 里保留一行**不是残渣**的指针行（`频率 | ——不在此表——`），代价是「NOISE 表 39 行」这个数含一行假条目（38 真 + 1 指针）；保留它能提醒读者"`频率` 差一点被误判"。**(p)** 03 §2 的 REGISTER 一个哨兵块内放**两张表**（§2.1 有冲突 / §2.2 无冲突）——`tableRows()` 会正确跳过每张表的分隔行**及其上方那一行表头**，所以合法；分两个块则要维护两处哨兵。**(q)** ABBREV 只登记 `PM` 与 `GM` 两条（其余 65 种全大写连写实测都是矩阵/标量连乘，登记进去会把两个基错合成零个）。**(r)** ~~不为哨兵陷阱加门槛~~ → **被 (t) 推翻**。**(s)** 引入 **A/B 级冲突分级**（Prompt 只要求「冲突情况 + 裁决建议」两列，没要求分级）：不分级就会得出「76 组冲突、全都要改」的结论，而实测绝大多数每门课内部自洽。**(t)** 把三处切片**全部**改成 `sentinelSlice()`（own-line 匹配）并加夹具与探针回归——**推翻 (r)**：这个陷阱本轮**实际触发了两次**，而两次的输出都长得完全正常（E2 新发现 ②：绿 ≠ 在测量）。**(u)** 给 A/B 判据补上**裸字母**这个条件（② 至少有一处无下标、无自变量、后面不紧跟单位），据此把 $T$ 从 A 级降级（⑤），并把降级与 $\mu$ 的临界未升**都写进 §3.2**——**判据要能被自己的数据否决才算判据**。**(v)** §3.4 的待修清单做成**一张合并表**（21 项），项数与门数是硬计数、处数凡估算一律标 `约` 并单列「29 处是行级估算」。**(w)** 符号裁决记录写进**已有的** Phase 3「教学支持（教学质量）」分组下郑核那条发言，**不新增小节**——《讨论日志固定结构》§4 第 6 条把 Phase 3 的 `###` 分组数锁死为 6、§1 的骨架是「10 项 + 附录 A/B/C/D」，加一节会让 B4 的 16 条结构口径全部指错。**(x)** 把两份角色文档里所有**活**的行号指针改成节名指针（⑦-3），但**有意不动** `personas.md:29` 的 B1 时点记录；同时把 E4 的查表规则**也加到李稳的 Phase 3 条目**（不只郑核）——符号约定的第一读者是写正文的人，不是审校的人。**(y)** §3.4 的 `fuzzy-control-basics` 一项按**处数**记 2 处（不是 1 行），据此把必修定为 54 处、总计 68 处。
  >
  > **⑩ 非回归（全部编辑完成后复跑，dev server 在 8080、内核在 8891 均在线）**：`npm run check` 退出码 **0**、md5 **`aae7a07ed3d39df2`**、PASS 17 · WARN 36 · FAIL 0——**与 A7 起逐字一致**；`npm run verify:all` 退出码 **1**、md5 **`16cf8d243c47bdc59b38446ae3ea4263`**、56 门、课程项 FAIL 28 + 全仓组件规范违规 3——**与 E2/E3 记录的基线逐字相同**（中途那次 FAIL 82 是 ⑦-4 的 `.next` 事故，修复后复跑即回到 28）；`npm run nb:verify` 退出码 **1**、56 门 · 182 notebook · 347 cell、课程级 **PASS 19 · WARN 7 · FAIL 30**、内核实跑 347 个 cell 其中 error 63 个、按判据 `S2×44`/`S6 FAIL×63 + WARN×17`/`S5×20`/`S7×37`、**S0/S1/S3/S4 全 0**、S8 四条结构前提全 ✓——**实质项逐条与 E3 记录的基线一致**（本次 1207 行、md5 `885e1115ddb430208f881bc4e7dc9751`；**E3 没存 md5，故只比实质项**，正是 E3 批注 ⑧ 那条教训的执行）；`npx tsc --noEmit` 退出码 **0**、零输出；`npm run build` 退出码 **0**（在 dev server 停掉后跑的，见 ⑦-4）。两套负向夹具也复跑了：`.agent/e1-fixture` → bad 小计 `PASS 0 · WARN 1 · FAIL 7 · SKIPPED 1`、good 小计 `PASS 7 · WARN 1 · FAIL 0 · SKIPPED 1`、退出码 **1**，与 plan `:1717` / `:1792` 记录的预期逐项吻合；`.agent/e3-fixture` → 课程级 `PASS 3 · WARN 1 · FAIL 4`、`S0×4 S1×1 S2×2 S3×1 S4×1 S5×5 S7×1 S8×4`、退出码 **1**，与该夹具 README 写死的预期逐字一致。**新增的 `glossary:check` / `rows --diff` / `unit-probe` / `e4-fixture` 四项见 ⑥，无历史基线可比。**
  >
  > **⑪ E4 的缺口与移交**：**(i)** **21 项符号改动（约 68 处，29 处是行级估算）与 31 处术语类正文缺陷一条都没修**（Prompt 硬约束），清单分别在 04 §3.4 与 03 §7，交 C1/A6，每条按 B8 开 fix-log 填归因三字段。**P0 只有 3 项 3 处**（`sliding-mode-control` 的 $s$、`adaptive-control-basics` 的 105:1、`stability-analysis` 的 $H\to\mathcal{H}$）。**(ii)** **03 没有 `rows terms --diff`**：03 的「出现课程」列不参与任何判定，写错无门槛报警（03 §5-10）。**(iii)** **03 的 REGISTER 没有 liveness 检查**（自行裁定 (g) 的代价）：过时的行不会被自动发现，需人工在每次大版本后通读（03 §8）。**(iv)** **C2 只比「归一化后完全相同」**，中文差一字的同义异写（`一阶加纯延迟（FOPDT）` vs `一阶加纯滞后（FOPTD）`、`看门狗` vs `看门狗定时器`）永远绿 → 已列入 03 §7-12 人工通读。**不要试图给 C2 加模糊匹配**：编辑距离阈值会把「匹配/不匹配」「滞后/滞环」这种**故意不同**的对儿也判成冲突，噪声会淹掉真信号。**(v)** 罗马数字列表标号（`（ii）`）会被当英文抽走，现只 1 条已进 §3；将来 `(i)/(ii)/(iii)` 变多需给 `RE_*_PAREN` 加守卫——**现在不加**，一条样本不足以定阈值（同 03 §1-5 的教训）。**(vi)** **C3 是 INFO，不得当判据用**，但它输出的「释义候选 ≥2 且跨 ≥3 门」52 个符号是人工复核释义的最短路径，04 §3 的多条裁决就是从它出发核的。**(vii)** C4 的 **7 处漏反斜杠函数名**是内容缺陷，E4 只报不改（同 (i)）。**(viii)** E3 移交项 **(iii)**（`RE_WIDGETS` 三脚本口径差异）**E4 未统一**——E4 不碰 notebook；**(ix)** E3 移交项 **(iv)**（《5.1 单课交付门槛》第 5 行 build 应改「CI」）、**(v)**（B4 的 16 条日志结构口径未机器化）、**(vi)**（组件渲染指纹折进第 4 项）、**(vii)**（fix-log 019/020 详情文件）**E4 均未做**，继续移交。**(x)** **plan 冻结带来的两处待回写**：`:587`「术语与符号在正文、图示、组件标签三处是否一致（对照 E4 的术语表与符号表）」与《5.1 单课交付门槛》第 10 行「术语与符号对照 03-glossary.md / 04-notation.md 无冲突 | 郑核 | 人工（E4 提供表）」——**两行在 E4 之前就已写好，实测无需改动即可生效**，但第 10 行的「人工」如今应读作「查表 + `npm run glossary:check`」，且《5.1》**没有一行对应 `glossary:check`**（E4 只写进了两个 SKILL.md）；两者都在冻结范围内，解冻时回写。**顺带第三次应验「插入批注本身就移动了自己刚引用的行号」**：《5.1 单课交付门槛》的表头在 E1 时点是 `:2161`、E2 批注插入后变成 `:2183`（E2 批注 ⑩-(i) 记录在案）、**E4 批注插入后变成 `:2223`**——E2 当时定的规矩「此后引用这张表一律用节名，行号只在写下的时点有效」正是为此，本批注全程只用节名。**(xi)** **`scripts/` 下全部工具脚本与 `lib/wiki-components.ts` 仍是 untracked**（E3 移交 (ii)，`git status` 显示 `??`）：E1–E4 的四个门槛在 git 里没有任何历史，误删即不可恢复，也正是 E3 那条 md5 无法复核的根因之一。**是否入库由用户裁定，E4 未自行 commit。** **(xii)** E4 不改任何 MDX 与组件正文（与 E1/E2/E3 同型）。

---

### 阶段 C · 存量偿债（已写但未交付的 37 课 + 缺讨论日志的 43 课）

> **分级偿还策略**（37 门 draft 课逐课过 v1.3 完整流程，需分级）：
>
> | 级别 | 含义 | 成本 | 适用 |
> |------|------|------|------|
> | **C1** | 完整 v1.3 重构 + 完整讨论日志（Phase 1–4 全流程） | 1 课 ≈ 1 会话 | 全部 37 门已写未交付课程 |
> | **C2** | 整课重写 | 1 课 ≈ 1–2 会话 | 仅对 E1 报告或通读全文确认存在**实质性技术错误**的课程 |
>
> **判定顺序**：先跑 E1 验收脚本 → FAIL 项与通读 MDX 时发现的实质性技术错误决定 C1 / C2（2026-10-16 用户裁决：取消 C0 补档层，直接逐课走 C1 完整流程，讨论日志随课补写）。历史上 `describing-function`、`phase-plane`、`nonlinear-characteristics` 三课属 C2（均因无讨论日志 + 多处技术错误而重写）。

- [x] **C1 · classic 章 v1.3 收尾（2 课）**（2026-10-16 第 1 课 frequency-response-design 已交付于 `wp/c1-classic-v13`：3 个 ipywidgets 组件化 + 柯验修正 6 组数值错误（含答案 10"Z-N 不稳定"结论反向的实质性错误）+ A6 遗留清理，build 146/146、check 退出码 0、讨论日志在 semester-02/02-classic/07。第 2 课 classic-case-study 同日交付：全量数值审计修正 5 组系统性错误（含超前设计方法论错误与蒙特卡洛失真表），红队放行。classic 章 11/11 打勾 ✓）
  - 范围：`frequency-response-design`（原 frequency-response，7 个 ipywidgets 待重构 + A6 已重定位）、`classic-case-study`
  - 验收：classic 章 11/11 打勾

- [ ] **C2 · modern 章 v1.3 重构（9 课，分 3 批）**（2026-10-16 第 1 课 state-space 已交付于 `wp/c2-modern-v13`：NB3 组件化 + 答案 10 极点错误修正 + S6 实跑新规全过。剩 8 课）
  - 批次：① `state-space` + `controllability-observability` + `lyapunov-modern`；② `state-feedback` + `state-observer` + `optimal-control-basics`；③ `lqr-controller` + `multivariable-systems` + `modern-case-study`
  - 验收：modern 章 9/9 打勾

- [ ] **C3 · estimation 章：kalman-filter 迁移 + 8 课新写（P0）**
  - 范围：`kalman-filter` 从 modern 迁入并按 v1.3 重构；新写 `estimation-problem`、`least-squares-ml`、`extended-kalman-filter`、`unscented-kalman-filter`、`particle-filter`、`h-infinity-filter`、`mhe-fusion`、`estimation-case-study`
  - 依赖：math 章的 `probability-basics`、`stochastic-processes` 至少要有可引用的骨架（否则 D1 需先做这两课）
  - 验收：estimation 章 9/9 打勾；`estimation-case-study` 通过何疑红队三条件

- [ ] **C4 · robust 章 v1.3 重构（8 课，分 3 批）**
  - 批次：① `robustness-concept` + `uncertainty-modeling` + `robust-stability`；② `h-infinity-basics` + `mixed-sensitivity` + `mu-synthesis`；③ `robust-performance` + `robust-case-study`
  - 验收：robust 章已写课程全部打勾（`mu-analysis`、`delay-robust-control` 归 D 阶段）

- [ ] **C5 · computer-control 迁移课程 v1.3 重构（6 课）**
  - 范围：`discrete-sampled/z-transform-analysis`、`discrete-sampled/discrete-stability-criteria`、`discrete-sampled/sampling-period-selection`、`implementation/digital-pid`、`implementation/computer-control-architecture`、`implementation/realtime-control`
  - 附加：完成 A3 遗留的两处拆分（`sampling-quantization` → `discrete-time-freq` + `embedded-implementation`；`digital-controller-design` → `discretization-methods` + 并入 `digital-pid`）
  - 验收：6 课打勾 + 2 处拆分完成且无内容丢失

- [ ] **C6 · mpc 章 v1.3 重构（8 课，分 3 批）**
  - 批次：① `mpc-principle` + `prediction-model` + `receding-horizon`；② `constraint-handling` + `generalized-predictive-control`；③ `nonlinear-mpc` + `distributed-mpc` + `mpc-case-study`
  - 前置：D2（math/convex-optimization）应先完成，否则 `constraint-handling` 的 KKT 内容仍无处引用
  - 验收：mpc 章 8 课打勾；A6 标注的两处"待移出"小节已处理

- [ ] **C7 · math/complex-numbers v1.3 复核 + intelligent 章收尾（4 课）**
  - 范围：`math/complex-numbers`（唯一已写的 math 课，需按 v1.3 复核并补讨论日志）、`intelligent/expert-system`→`knowledge-driven-control`、`intelligent/genetic-algorithm`→`metaheuristic-tuning`、`intelligent/fuzzy-neural-network`、`intelligent/intelligent-case-study`
  - 特别提示：`intelligent-case-study` 是何疑红队压力最大的一课（见 2.12）
  - 验收：intelligent 章 8/8 打勾（含 `iterative-learning-control`，归 D 阶段）

- [ ] **C8 · nonlinear 章章内治理（不新增课程）**
  - 范围：三课同名的"与其他非线性控制方法的对比"小节合并为章末集中对比表；两处"处理参数不确定性"明确分工；`modern/lyapunov-modern` 与 `nonlinear/lyapunov-stability` 的分工交叉引用补齐
  - 验收：catalog 中 nonlinear 章无重复小节标题；E1 第 2 项结构一致性通过

**C1–C8 通用推荐 Prompt 模板**（替换 `<>` 占位符后使用）：
```
项目：D:/Workspace/control-universe。请按序阅读：
1. .agent/skills/wiki-discussion/SKILL.md 与 personas.md（完整流程 + 升级后的 22 人
   角色体系 + 角色上场规则 + 发言纪律 + 讨论日志固定结构）
2. .agent/skills/v1.3-refactor/SKILL.md（重构决策流程 + Phase 4 前端硬门槛九项清单）
3. .agent/fix-logs/INDEX.md 全 18 条（郑核的回归检查要求）
4. .agent/delivery-tracker.md（当前进度）
5. .agent/semester-02-plan.md 的 <相关章节号，如 2.4、2.5> 节与 3.6 节（角色矩阵）、
   3.7 节（M2/M3/M4 机制）
6. docs/semester-02/03-glossary.md 与 04-notation.md（术语与符号权威表，若 E4 已就绪）
7. 若 E1 已就绪：先跑 node scripts/verify-lesson.mjs <chapter>/<lesson> 并把报告作为
   起点，FAIL 项必须先修

任务：按 wiki-discussion 技能的 Phase 1-4 完整流程，交付 <章 slug> 章的 <课程清单>。
课型为 <type>，按 3.6 矩阵上场角色为：核心常设（郑核 / 苏绘 / 孙助 / 柯验）+
<追加角色清单>。主责教授为 <姓名>。

本次交付的具体动作（来自 semester-02-plan.md <章节号>）：
  <逐条列出本课的结构调整 / 拆分 / 合并 / 重命名要求>

硬性要求（缺一不可）：
- Phase 3 必须产出**柯验的数值三方对账表**（正文数字 / notebook 输出 / 组件默认读数），
  原样写入讨论日志附录 A，并注明"这是全部实测数据的唯一留存副本"。
  任一行不一致 -> 打回 Phase 2。必查三条陷阱：组件默认参数复现手算例（fix-014）、
  时间换算用 T/(len-1)（fix-016）、有记忆非线性预热末相位对齐（fix-018）。
- 若本课含任何"A 优于 B"的定量对比，Phase 3 必须产出**何疑的红队放行记录**
  （讨论日志附录 C）：基线独立整定过 + ≥3 组工况 + 诚实列出 A 输的场景。
- Phase 4 必须逐条执行**秦构的前端硬门槛九项清单**并粘贴实际输出（讨论日志附录 B）。
- 交互组件必须：固定坐标轴（显式 min/max）、animation: false、useMemo 产生
  EChartsOption 对象直传 useECharts（**不是 callback**）、默认参数复现正文手算例、
  在两处注册表都注册（或 E2 后的单一来源）、在 MDX 中显式 <ComponentName /> 引用。
- 禁止 ipywidgets / interact / FloatSlider / IntSlider。
- notebook cell 拼接占位符不得含 %（用 <<NBn>>）；同一 MDX 内多个 Notebook 的
  kernel id 前缀必须互不相同。
- MDX 中 JSX 属性之间不得有逗号；多行 display math 的 $$ 必须独占开 / 闭行。
- 术语与符号必须对照 docs/semester-02/03-glossary.md 与 04-notation.md；
  引入新符号前先查表确认无冲突，有冲突需在讨论日志记录裁决。
- 需要较多篇幅的数学概念不在原地展开，改为引用 math 章对应课程
  （格式：> 📐 本文用到了…，详见 [标题](/math/<slug>)）。
  若目标 math 课尚未编写，在讨论日志的[待定]清单中记录，并给出最小自足解释。
- 讨论日志写入 docs/discuss-log/semester-02/<章序号>-<章slug>/<课序号>-<课slug>.md
  （第二学期 termNum = 02；目录不存在则创建）。
- 遵守"叙述服从测量"：测量与预期不符时只改叙述或改实验设计，**不改数据**。
- 完成后更新 .agent/delivery-tracker.md（打勾 + 重构摘要 + 底部统计，统计用
  node scripts/check-catalog.mjs --fix-tracker-stats 生成，不要手写）与
  .agent/semester-02-plan.md 的对应勾选框。
- 删除本次产生的临时脚本与中间产物。
- 按照分支维护计划维护分支。

节奏：**一次会话只交付 1 课**。若本条目列了多课，做完第 1 课并验收后停下来报告，
等用户确认再继续下一课。

环境注意：Windows；dev server 端口 8080（node scripts/serve.mjs）；Jupyter kernel
端口 8891，POST 需 new ProxyHandler({}) 绕过系统代理否则 502；Tailwind 类可能不
生效需 inline style 兜底；.next 缓存异常时 rm -rf .next 后重启。
```

---

### 阶段 D · 新内容生产（71 门新课）

> 全部走 C1–C8 的**同一份通用 Prompt 模板**，只需替换课型、上场角色、主责教授与"本次交付的具体动作"。
> 新课没有存量 MDX，因此模板中"重构"相关动作替换为"从零编写"，并额外要求：
> - **先写 catalog 的 subsections 再写正文**（否则 E1 第 2 项结构一致性无法通过）
> - **math 章课程必须验证"高中数学起步"**：岳自角色必到，任何用到大学数学的地方必须先引用 math 章更早的课程
> - 新章的第一课应先确立"本章的被控对象主线"（例如 estimation 章建议统一用一个非线性对象贯穿 9 课，便于第 9 课做公平对比）

- [ ] **D1 · math 章 15 门新课（P0，最高优先）**
  - 顺序建议（按被依赖次数排序，先做依赖最广的）：`linear-algebra-basics` → `eigen-decomposition` → `laplace-transform` → `ode-matrix-exponential` → `probability-basics` → `convex-optimization` → `matrix-decomposition` → `z-transform` → `fourier-analysis` → `variational-dp` → `stochastic-processes` → `diff-geometry` → `numerical-methods` → `graph-theory` → `game-theory-math`
  - 实际优先级应以 A4 产出的 `docs/semester-02/02-math-dependency-map.md` 的"被依赖次数排序"为准
  - 课型：`math`；上场角色：方数（主责）+ 岳自 + 小初 + 陆阅 + 核心常设 4
  - 验收：math 章 16/16 打勾；全仓 `📐` 引用无悬空链接（E1 第 7 项）

  **推荐 Prompt（每课一次会话，用 C 阶段通用模板 + 以下替换）：**
  ```
  课型为 math，按 3.6 矩阵上场角色为：核心常设（郑核 / 苏绘 / 孙助 / 柯验）+
  方数（主责）+ 岳自 + 小初 + 陆阅。

  本次交付的具体动作：从零编写 math/<slug>（标题见 semester-02-plan.md 2.2 表第 <n> 行）。

  math 章专属要求（覆盖通用模板中的对应项）：
  - **起点必须是高中数学**。岳自角色必到且必须在 Phase 2 提出至少 3 个"这里我不懂"
    的问题，每个问题都要在正文中得到回应。若某个前置概念超出高中数学，必须先引用
    math 章更早的课程（不能假设读者已修过大学数学）。
  - 先在 content/catalog.ts 写入本课的 subsections（H2 序列），再写正文，确保
    E1 第 2 项结构一致性一次通过。
  - 每个抽象概念必须配一个**具体的数值例子**（不是符号推导），并给出 notebook 复算。
  - 必须有一节明确说明"这个数学工具在控制理论中用来干什么"，并列出 2-3 门会用到
    它的课程链接（从 docs/semester-02/02-math-dependency-map.md 查）。
  - 交互组件优先做"参数变化 -> 几何直观变化"类（例如特征值滑块看相图变化、
    凸集参数看 KKT 条件、Sigma 点分布看 UKF 精度）。
  - 禁止把控制理论内容写进 math 章（保持正交性，SKILL.md 第 274 行）。
  ```

- [ ] **D2 · discrete-sampled 章 6 门新课（P0）**
  - 范围：`discrete-time-systems`、`difference-equation`、`discretization-methods`（若 C5 未完成拆分）、`discrete-time-freq`、`sampled-data-systems`、`discrete-optimal-control`、`event-triggered-control`
  - 课型：`theory` + `impl` 混合；主责：林矩（理论）+ 周联（工程）
  - 依赖：math/`z-transform`、math/`linear-algebra-basics`
  - 验收：discrete-sampled 章 10/10 打勾

- [ ] **D3 · implementation 章 6 门新课（P0）**
  - 范围：`pid-engineering-tuning`、`controller-discretization-practice`、`embedded-implementation`、`networked-control`、`industrial-bus-protocols`、`hil-rapid-prototyping`、`implementation-case-study`
  - 课型：`impl` / `case`；主责：周联；轮值专家：领域-半导体 / 领域-电机驱动
  - 验收：implementation 章 10/10 打勾

- [ ] **D4 · introduction 章 3 门新课（P1）**
  - 范围：`control-landscape`、`why-feedback-works`、`controller-selection-guide`
  - 课型：`history`；主责：许史
  - 依赖：**建议放在 D1–D3 之后**，因为 `controller-selection-guide` 需要引用全部章节
  - 验收：introduction 章 3/3 打勾；`controller-selection-guide` 的决策树覆盖全部 16 章

- [ ] **D5 · nonlinear 章 4 门新课（P1）**
  - 范围：`passivity-control`、`iss-small-gain`、`switched-hybrid-systems`、`bifurcation-chaos`
  - 课型：`theory` / `frontier`；主责：卫韧；岳自不上场，钱锐必到
  - 依赖：math/`diff-geometry`（passivity 与 switched 需要）、math/`convex-optimization`（ISS-LMI）
  - 验收：nonlinear 章 12/12 打勾；`iss-small-gain` 与 `robust/robustness-concept` 的小增益定理交叉引用一致

- [ ] **D6 · mpc 章 3 门新课（P1）**
  - 范围：`mpc-stability`、`explicit-mpc`、`economic-mpc`
  - 课型：`theory` / `frontier`；主责：方数；吴规必到（economic-mpc 的甲方视角）
  - 依赖：math/`convex-optimization`、nonlinear/`lyapunov-stability`、nonlinear/`switched-hybrid-systems`（explicit-mpc 的分段仿射结构）
  - 验收：mpc 章 11/11 打勾

- [ ] **D7 · robust 章 2 门新课（P1）**
  - 范围：`mu-analysis`（从 `mu-synthesis` 拆出）、`delay-robust-control`（吸收 classic 两处时滞小节并深化）
  - 课型：`theory`；主责：卫韧
  - 验收：robust 章 10/10 打勾；`mu-analysis` 与 `mu-synthesis` 无内容重复（E1 + 人工核对）

- [ ] **D8 · identification 章 9 门新课（P1）**
  - 范围：全章（见 2.11 表）
  - 课型：`theory` + `impl`；主责：方数；何仿必到（辨识本质是实验设计）；轮值专家：领域-化工过程
  - 依赖：math/`probability-basics`、math/`stochastic-processes`、math/`linear-algebra-basics`
  - 验收：identification 章 9/9 打勾；第 9 课的"从实测数据到可用于 MPC 的模型"必须与 `mpc/prediction-model` 的引用对齐

- [ ] **D9 · classic 章 1 门新课（P1）**
  - 范围：`design-methods-comparison`（时域 / 频域 / 根轨迹三种设计法的统一对比与选型）
  - 课型：`case`；主责：陈控；何疑必到（含三种方法的定量对比）
  - 验收：三种方法在**同一被控对象、同一设计指标**下对比，基线均独立整定过

- [ ] **D10 · intelligent 章 1 门新课（P2）**
  - 范围：`iterative-learning-control`
  - 课型：`learning`；主责：林矩 + 钱锐；林码必到
  - 验收：ILC 与 `nonlinear/adaptive-control-basics`、`rl-control/rl-basics` 的分工在正文中明确说明

- [ ] **D11 · rl-control 章 11 门新课（P2）**
  - 范围：全章（见 2.13 表；`multi-agent-rl` 与 `safe-rl` 已移出）
  - 课型：`learning`；主责：林矩 + 钱锐；**林码必到每课**；何疑必到 `rl-vs-classical` 与 `rl-control-case`
  - 依赖：math/`stochastic-processes`、math/`variational-dp`、math/`convex-optimization`、estimation 章
  - 验收：rl-control 章 11/11 打勾；`rl-vs-classical` 通过何疑红队三条件（LQR 与 MPC 基线必须整定过）

- [ ] **D12 · multi-agent 章 10 门新课（P2）**
  - 范围：全章（见 2.14 表）
  - 课型：`theory` + `learning`；主责：林矩 + 方数；林码必到 `multi-agent-rl`
  - 依赖：math/`graph-theory`、math/`game-theory-math`、estimation 章、`mpc/distributed-mpc`
  - 验收：multi-agent 章 10/10 打勾；跨章重复 slug 已清零（A7 脚本第 2 项检查）

- [ ] **D13 · safety-ftc 章 8 门新课（P2）**
  - 范围：全章（见 2.15 表）
  - 课型：`theory` + `case`；主责：卫韧 + **范安（内容主责）**；轮值专家：领域-过程安全
  - 依赖：math/`convex-optimization`（CBF-QP）、nonlinear/`lyapunov-stability`、`estimation/*`（FDI 观测器）、rl-control（safe-rl）
  - 验收：safety-ftc 章 8/8 打勾；范安确认无"不切实际的安全承诺"

- [ ] **D14 · applications 章 8 门新课（P2）**
  - 范围：全章（见 2.16 表），每课由对应轮值领域专家主导
  - 课型：`case`；主责：轮值领域专家；吴规 + 赵工 + 范安 + 何疑必到
  - 依赖：**建议最后做**，因为它要引用前面所有章节的方法
  - 验收：applications 章 8/8 打勾；每课的工程参数由轮值专家确认可核查（不得是无来源数字——这是 `describing-function` 重写的原因之一）

---

## 5. 验收门槛与统计口径

### 5.1 单课交付门槛（所有阶段通用）

一门课视为"交付完成"，必须同时满足：

| # | 门槛 | 执行者 | 自动化 |
|---|------|-------|--------|
| 1 | Phase 1–4 完整走通，讨论日志已写入 `docs/discuss-log/semester-02/...` | 郑核 | E1 第 8 项（WARN） |
| 2 | 柯验的三方对账表全部一致，已写入讨论日志附录 A | **柯验（否决权）** | 半自动 |
| 3 | 秦构的前端硬门槛九项全部通过，输出已写入附录 B | 秦构 | E1 + E3 |
| 4 | 若含定量对比：何疑红队三条件放行，记录已写入附录 C | **何疑（否决权）** | 人工 |
| 5 | `npm run build` 通过 | 秦构 | E1 |
| 6 | 课程页 curl 200，H2 数 == catalog subsections 数，katex-error == 0 | 秦构 | E1 第 2、6 项 |
| 7 | 交互组件：固定坐标轴 / `animation:false` / Option 对象直传 / 默认参数复现手算例 / 双处注册 / MDX 显式引用 | 秦构 + 柯验 | E1 第 4、5 项 |
| 8 | 无 ipywidgets；cell 首行无 `%#`；JSX 属性间无逗号；`$$` 独占行 | 秦构 | E1 第 1、3 项 + E3 |
| 9 | 所有 `📐` 数学引用指向 catalog 中真实存在的 math 课 | 陆阅 | E1 第 7 项 |
| 10 | 术语与符号对照 `03-glossary.md` / `04-notation.md` 无冲突 | 郑核 | 人工（E4 提供表） |
| 11 | 含"习题"与"答案"两节，答案条目数 ≥ 习题条目数，含推导步骤 | 孙助 + 郑核 | E1 第 9 项 |
| 12 | `delivery-tracker.md` 已打勾且统计由脚本生成（非手写） | 郑核 | A7 |

### 5.2 章节交付门槛

- [ ] 该章全部课程满足 5.1
- [ ] 该章无重复小节标题（E1 + A7 脚本第 6 项）
- [ ] 该章无内部依赖倒置（A8 脚本的章序违反检测退出码 0）
- [ ] 该章的"主线被控对象"在各课之间一致（若有），且案例课的对比基线均整定过
- [ ] 该章有至少一门 `*-case-study` 串联全章方法

### 5.3 学期级门槛（semester-02 收尾时）

- [ ] `node scripts/check-catalog.mjs` 退出码 0（无任何 FAIL）
- [ ] `npm run verify:all` 全绿（无 FAIL）
- [ ] `OUTLINE.md` 与 `delivery-tracker.md` 统计一致且由脚本生成
- [ ] 全部已交付课程有讨论日志或交付档案（0 门缺失）
- [ ] `.agent/fix-logs/` 新增条目全部填写归因三字段
- [ ] 完成 B8 的学期末归因回顾，输出回顾表（**机制已就绪**：B8 已在 `fix-tracker/SKILL.md`《归因回顾机制（B8 起）》给出 §1 五列表格式与 §2 三条触发条件 T1/T2/T3；本项是**执行**那次回顾，须等 C 或 D 阶段做完至少一章之后——B1 的 6 个新角色在此之前没机会拦截任何东西，T2「整学期零拦截 → 人设无效」无从判定）
- [ ] `introduction/controller-selection-guide` 覆盖全部已开章节
- [ ] 角色团队回顾：22 人中是否有角色整学期零贡献（考虑合并或删除）；6 个新角色是否真的拦住了对应类别的问题

### 5.4 统计口径（唯一权威来源）

自 A7 起，**禁止手写统计数字**。所有统计由 `scripts/check-catalog.mjs` 生成：

- 章节数、课程总数 = 解析 `content/catalog.ts`
- 已写课程数 = 扫描 `content/**/*.mdx`
- 已交付课程数 = `delivery-tracker.md` 中 `[x]` 计数（并与 catalog 的 `status:"v1.3"` 交叉校验）
- 交互组件数 = `components/wiki/*-explorer.tsx` 计数（并与 MDX 实际引用交叉校验）
- 讨论日志覆盖率 = `docs/discuss-log/` 篇数 / 已写课程数

---

## 附录 A：新旧目录映射表

### A.1 章节映射

| 旧章 | 新课 | 说明 |
|------|------|------|
| `math`(1) | `math`(16) | 扩容 |
| `classic`(10) | `classic`(11) | 去重 + 新增 2 课 |
| `modern`(10) | `modern`(9) + `estimation`(1) | kalman-filter 移出 |
| `robust`(8) | `robust`(10) | 重排 + 拆 μ + 新增时滞 |
| `computer-control`(8) | `discrete-sampled`(6) + `implementation`(4) | **整章拆分** |
| `mpc`(8) | `mpc`(11) | 拆出显式 MPC + 新增 3 |
| `nonlinear`(8) | `nonlinear`(12) | 新增 4 |
| `intelligent`(7) | `intelligent`(8) | 重定位 2 + 新增 ILC |
| `rl-control`(8) | `rl-control`(11) + `multi-agent`(1) + `safety-ftc`(1) | 移出 2 + 新增 5 |
| `discrete`(8) | **章取消** → `discrete-sampled`(4) + `implementation`(0) | 整章吸收，零迁移成本 |
| `multi-agent`(8) | `multi-agent`(10) | 接收 multi-agent-rl + 新增 2 |
| — | `introduction`(3) | **新增** |
| — | `estimation`(8) | **新增**（不含移入的 kalman-filter） |
| — | `identification`(9) | **新增** |
| — | `safety-ftc`(8) | **新增**（不含移入的 safe-rl） |
| — | `applications`(8) | **新增** |

### A.2 课程级迁移 / 重命名清单

| 旧路径 | 新路径 | 动作 |
|--------|--------|------|
| `computer-control/z-transform-basics` | `discrete-sampled/z-transform-analysis` | 迁移 + 改名 |
| `computer-control/discrete-stability` | `discrete-sampled/discrete-stability-criteria` | 迁移 + 改名 |
| `computer-control/sampling-period` | `discrete-sampled/sampling-period-selection` | 迁移 + 改名 |
| `computer-control/sampling-quantization` | `discrete-sampled/discrete-time-freq` + `implementation/embedded-implementation` | **拆分** |
| `computer-control/digital-controller-design` | `discrete-sampled/discretization-methods` + `implementation/digital-pid` | **拆分** |
| `computer-control/digital-pid` | `implementation/digital-pid` | 迁移（与上项合并） |
| `computer-control/computer-control-architecture` | `implementation/computer-control-architecture` | 迁移 |
| `computer-control/realtime-control` | `implementation/realtime-control` | 迁移 |
| `discrete/discrete-time-systems` | `discrete-sampled/discrete-time-systems` | 保留 slug（未写，零成本） |
| `discrete/difference-equation` | `discrete-sampled/difference-equation` | 保留 slug |
| `discrete/z-transform-analysis` | — | **删除**（与 computer-control 重复） |
| `discrete/discrete-stability-criteria` | — | **删除**（同上） |
| `discrete/digital-controller` | — | **删除**（同上） |
| `discrete/discrete-optimal-control` | `discrete-sampled/discrete-optimal-control` | 保留 slug |
| `discrete/sampled-data-systems` | `discrete-sampled/sampled-data-systems` | 保留 slug |
| `discrete/discrete-case-study` | — | **删除**（由 `implementation/implementation-case-study` 承接） |
| `modern/kalman-filter` | `estimation/kalman-filter` | 迁移 |
| `modern/linear-system-theory` | `modern/lyapunov-modern` | **改名**（名实对齐）+ 位置 2.8→2.3 |
| `classic/frequency-response` | `classic/frequency-response-design` | **改名**（重定位为设计法）+ 位置 1.8→1.7 |
| `classic/stability-analysis` | `classic/stability-analysis` | 位置 1.7→1.4 + 剥离频域内容 |
| `intelligent/genetic-algorithm` | `intelligent/metaheuristic-tuning` | **改名**（扩展选题） |
| `intelligent/expert-system` | `intelligent/knowledge-driven-control` | **改名**（时代化） |
| `rl-control/multi-agent-rl` | `multi-agent/multi-agent-rl` | 迁移（**去重**） |
| `rl-control/safe-rl` | `safety-ftc/safe-rl` | 迁移（归口 + 扩充） |
| `mpc/constraint-handling` 的"交互式可视化"小节 | — | **删除**（v1.2 遗留） |
| `mpc/generalized-predictive-control` 的"交互式可视化"小节 | — | **删除** |
| `mpc/nonlinear-mpc` 的"交互式可视化"小节 | — | **删除** |
| `mpc/receding-horizon` 的"显式MPC"小节 | `mpc/explicit-mpc` | **升格为独立课** |
| `mpc/prediction-model` 的"模型辨识基础"小节 | `identification/*` | **移出并改为引用** |
| `mu-synthesis` 的"不确定性建模"小节 | — | **删除**（改为引用 `robust/uncertainty-modeling`） |
| `nonlinear/{sliding-mode,backstepping,adaptive}` 的"与其他非线性控制方法的对比"小节 | 章末集中对比表 | **合并** |

---

## 附录 B：风险与取舍

| 风险 | 影响 | 缓解 |
|------|------|------|
| **规模翻倍（84→155）导致完成度下降** | 读者看到大量"尚未编写"占位，观感变差 | ① P0/P1/P2 分级，任何阶段停下都是一致状态；② A5 的占位页要做得体面（显示标题 + 前置课程链接）；③ 首页学习路径提示已交付数，让读者知道从哪开始 |
| **章节重命名导致外链失效** | 已分享出去的 URL 404 | 项目尚未上线（`docs/to-online/` 显示部署仍在需求阶段），当前是改名的**唯一低成本窗口**。上线后再改名需要维护重定向表 |
| **math 章 16 课是硬前置，拖慢主线** | 其他章的 `📐` 引用持续悬空 | ① D1 排在最前；② 引用规则允许"目标课未写时给出最小自足解释 + 记录[待定]"，不阻塞其他章；③ 按被依赖次数排序，先做依赖最广的 5 课 |
| **角色从 14 扩到 22，讨论变冗长** | 单课交付成本上升 | 3.6 的课型矩阵把实际上场人数压到 7–10 人，**比当前的"14 人全员"更少**；M1 的发言配额与沉默机制进一步压缩 |
| **37 门 draft 课均需完整讨论日志，成本高** | C1 周期拉长 | 一次会话只交付 1 课；日志按 M1 配额聚焦结论与三方对账表，不追求发言长度（2026-10-16 用户裁决取消 C0 补档层） |
| **新角色是"纸面角色"，实际不发挥作用** | 返工率不降 | B8 的归因闭环：每条新 fix-log 必须归因到角色，学期末统计。若某新角色整学期零拦截，说明人设无效，应删除或改造（5.3 最后一项） |
| **A3/A6 的大规模目录调整可能破坏现有 19 门已交付课程** | 已完成工作回退 | 每个条目都要求"逐章验收 + curl 200 + H2 数一致 + katex-error == 0"；E1 脚本先就绪可大幅降低风险；改动前 `git status` 确认干净，分章提交 |
| **术语表（E4）可能与已交付课程内容冲突** | 需要回头改 19 门课 | E4 只输出裁决建议不改正文；冲突按"新课遵守、旧课渐进对齐"处理，重大冲突（如同一符号在两章含义相反）单独开条目 |

---

## 附录 C：推荐执行顺序速查

```
第一步（基建，必须先做）
  A1 诊断报告固化
  A2 catalog 元数据字段
  A7 统计自动化脚本         <- 越早越好，后续每个条目都靠它验收
  E1 自动化验收脚本         <- 越早越好，是所有内容条目的安全网

第二步（结构重组，A7/E1 就绪后做）
  A3 computer-control + discrete 合并重组   <- 成本最低收益最高（discrete 零内容）
  A4 math 章扩容骨架 + 依赖图谱
  A5 新增 5 章骨架
  A6 章内重排与重命名（8 章，逐章做）
  A8 依赖图校验与 UI 提示

第三步（角色升级，与第二步可并行）
  B1 6 个新角色人设
  B2 学生 + 轮值专家扩充
  B3 课型角色矩阵
  B4 发言纪律 + 讨论日志结构
  B5 数值三方对账（柯验）
  B6 前端硬门槛（秦构）
  B7 红队否决（何疑）
  B8 fix-log 归因闭环

第四步（质量基建收尾）
  E2 消除双注册表
  E3 notebook cell 标准化
  E4 术语表与符号表

第五步（存量偿债，逐课推进）
  C1 classic 收尾（2 课）
  C5 computer-control 迁移课重构（6 课）
  C2 modern（9 课，3 批）
  C4 robust（8 课，3 批）
  C6 mpc（8 课，3 批）
  C7 math/complex-numbers + intelligent（5 课）
  C8 nonlinear 章内治理

第六步（新内容生产）
  D1 math 15 课        <- P0，其他章的引用都指向这里
  D3 implementation 6 课  <- P0
  D2 discrete-sampled 6 课 <- P0
  C3 estimation 9 课      <- P0（含 kalman 迁移）
  D9 classic 1 课
  D5 nonlinear 4 课
  D6 mpc 3 课
  D7 robust 2 课
  D8 identification 9 课
  D4 introduction 3 课    <- 放在主干完成后
  D10 intelligent 1 课
  D11 rl-control 11 课
  D12 multi-agent 10 课
  D13 safety-ftc 8 课
  D14 applications 8 课   <- 最后做，要引用前面所有章节

第七步（学期收尾）
  5.3 学期级门槛逐项检查 + B8 归因回顾 + 角色有效性回顾
```

---

**本方案完。**

