# 学期3优化计划

立项日期：2026-10-17。性质：运作方式更新、结构治理、全量逐课重构/新写。角色团队保持学期2的 22 名具名角色 + 14 类轮值专家，不做增删或改人设。

## 1. 范围与事实基线

本次交付计划、技能、全局 checklist 和计划一致性校验；尚未实施 catalog 结构迁移，也不交付任何课程。后续先完成必要结构/质量基建，再从数学第一课开始，严格一个对话一节课。学期2未完成项目进入本期来源映射，不再另外跑一条相互竞争的 C/D 排期；历史计划、日志和交付标记保留。

2026-10-17 `npm run check` 实测：16章141课，56课有MDX（29课v1.3、27课draft），85课占位；21篇日志覆盖21课，35课有正文但缺日志；614个小节；47个Explorer、45个被引用、2个孤儿；148条先修边，无环/悬空，覆盖69/141课，30个孤立点、7章零先修边。PASS 17 / WARN 36 / FAIL 0。现状与旧 AGENTS 快照不同，以实测为准。

[不可变来源快照](semester-03-baseline.json) 记录起点 commit、141条路径/标题/状态、56份MDX的SHA-256，供迁移和覆盖核对。它是历史证据；运行站点的唯一元数据来源仍为 `content/catalog.ts`。

三份文件各司其职：本计划规定目标范围与顺序；[全局 checklist](semester-03-checklist.md) 是本期进度唯一入口；旧 delivery-tracker 与 catalog 继续遵守旧校验契约，不能用旧 v1.3 状态代替本期完成。本计划的目标表在迁移前不是线上目录事实，不手工修改 OUTLINE。

## 2. 运作方式

### 2.1 全局 checklist

所有本期工作先登记唯一 ID，再实施：治理/调研/结构/工具/发布任务用任务表；每课用独立行跟踪 Phase 1、2、3、4、验收、合并。补研究、返工、阻塞处理及变更裁决也必须新增任务行，禁止散落在对话里。课程子问题详记本课讨论日志，以 ID 链接回全局表；不复制第二份课程进度。

- `[ ]` 未完成，`[x]` 有证据完成；进行中、阻塞和下一步写证据栏。禁止用勾表示“计划会做”。
- 按 P1→P2→P3→P4→验收→合并顺序打勾。每个阶段完成后更新；没有实跑不能勾验收，没有真实合并 hash 不能勾合并。
- 证据使用仓库内持久文件路径加可选锚点；命令输出、退出码、基线差异在日志，合并记录用 `commit:<hash>`。本机临时 logs 不能充当唯一交付证据。
- 新增/拆分/移动/撤销目标先修改本计划和 checklist，保持稳定 ID，保留来源映射及变更理由。课程撤销不能直接删掉来源记录，须明确合并去向。
- `node scripts/check-semester03.mjs` 校验目标唯一性、141来源全覆盖、56正文保留、模式、课名/章名、台账一致性和勾选顺序；它不代替真实数值、教学或浏览器验收。

### 2.2 两套讨论技能

| 入口 | 触发条件 | 本期优化 |
|---|---|---|
| [wiki-lesson-new](skills/wiki-lesson-new/SKILL.md) | 新增或占位，未沿用任何正文 | 起点与先修合同；目标/H2/算例/练习对应；先跑最小实验，再扩写；从干净环境验证首次可学可跑 |
| [wiki-lesson-refactor](skills/wiki-lesson-refactor/SKILL.md) | 沿用任一旧正文，含迁移、合并、拆分 | 起点审计、保留/纠错/迁移矩阵；独立复算旧数值；变更传播；旧URL/锚点/材料去向和回归核查 |
| [共同流程](skills/wiki-discussion/references/semester-03-core.md) | 两者必读 | 共用 Phase 1–4、日志骨架、M1–M5；三轮生成、六组审校、三方对账、九项门槛、红队放行、实际签发与合并 |

原 wiki-discussion 保留作为角色矩阵与规范权威，不另复制 personas，不新增角色；旧 v1.3-refactor 保留服务历史，学期3统一走上述两入口。计划“模式”是起点判断；后续发现已有正文必须重新判定，不能为了使用新写流程忽略旧材料。

### 2.3 一个对话一节课

默认选择全局 checklist 中生产顺序最前的未合入课程。本期首课 **MATH-01：微积分入门**。先修与基础设施阻塞时记录原因，只处理该课所必需的已登记阻塞，不顺带交付第二课。讨论未完继续同一课程；用户明确换课时保留检查点。课程合入后停止，下一对话再取下一课。

推荐新写 Prompt：

> 继续学期3，读取 semester-03-plan.md 和全局 checklist，选择生产顺序最前的未合入课程。确认无正文后，按 wiki-lesson-new 及共同流程完成这一节的 Phase 1–4、真实验收、日志与台账，验收后 --no-ff 合入 master。本对话只交付这一节，不自动开始下一节。

推荐重构 Prompt：

> 继续学期3课程 <ID>。读取计划/全局 checklist，按 wiki-lesson-refactor 先审计全部源正文、代码与旧日志，决定本课具体重构范围，再执行完整 Phase 1–4。保留内容去向和旧链接，数值独立复算；真实验收后同步日志/台账并 --no-ff 合入 master。本对话只交付这一个目标课。

## 3. 结构诊断与取舍

### 3.1 保留骨干，修正边界

经典、现代、非线性、离散、实现、辨识、估计、鲁棒、预测控制仍承担系统建模、分析与设计主干，不以热点替代。现目录的问题主要是命名过长、知识重复、先修边不足，以及把学习算法和应用领域挤在同一章：

1. 导论放导航首位，面向选路；生产放最后，以免反复引用尚未定稿课程。数学从高中起点补微积分和多元微积分，共18课；细化到何种证明与例题留给逐课 Phase 1。
2. 卡尔曼滤波由 modern 迁入 estimation，与已有空条目合一；现代控制保留确定性状态观测器，避免两章重复讲同一推导。
3. H∞滤波放鲁棒章，MHE放预测章，解决先修倒置；状态估计章保留多传感器融合，MHE旧条目中的融合主题在这两处衔接，不能丢失。
4. 分布式MPC迁入多智能体章；安全RL只在安全章，多智能体RL只在多智能体章。RL基础只讲通用算法，指向这两课，不保留重复正文。
5. 数学Z变换负责数学工具；离散控制的Z域分析负责控制系统应用。离散章先采样量化，再系统与稳定性，修复已有两条章内逆序。辨识最小二乘讲动态模型/激励/闭环偏差，估计最小二乘讲统计估计，目标不同。
6. 新增机器学习章，补神经网络、训练、表征和生成建模先修；智能控制保留模糊、专家、神经控制等方法脉络及适用边界，新增迭代学习控制并明确它与RL的差别，不包装成当代具身智能总章。
7. 原 applications 的机器人/驾驶课程分别迁入对应专章，其余六类工程应用保留。飞行器姿态控制统一“领域中的控制任务”命名；微电网控制涵盖可再生能源接入与储能协调；生物医学/半导体等原条目的主题在执行时做范围审计，禁止单靠缩标题静默删掉主题。

### 3.2 学习技术调研与课程归属

调研截止 **2026-10-17**；以下选取可核验的一手论文、作者项目和官方技术报告作为代表路线，不宣称覆盖所有方法或列出最新排行榜。课到执行时复查版本和证据，不能把公司的演示当通用能力证明。

| 技术线 | 代表一手资料 | 与控制的关系及局限 | 课程归属 |
|---|---|---|---|
| 无模型连续控制 | [PPO](https://arxiv.org/abs/1707.06347)、[SAC](https://arxiv.org/abs/1801.01290)、[RSL-RL作者代码](https://github.com/leggedrobotics/rsl_rl) | 策略优化与采样效率取舍；足式机器人是重要应用。训练回报不等于真实系统稳定性证书 | RL基础讲算法；机器人学习讲运动技能与部署 |
| 离线RL与数据分布 | [IQL](https://arxiv.org/abs/2110.06169) | 固定数据集学习面对分布外动作与评估难题，离线高分不能保证上线安全 | RL离线学习、机器人离线到在线、驾驶评估 |
| 模型式RL与规划 | [DreamerV3作者项目](https://danijar.com/project/dreamerv3/)、[TD-MPC2](https://arxiv.org/abs/2310.16828) | 学习动力学后在想象中优化策略或用潜在模型在线规划；模型误差会随闭环滚动积累 | RL模型式方法；具身世界模型控制；机器人学习与MPC |
| 模仿学习与生成策略 | [Diffusion Policy](https://diffusion-policy.cs.columbia.edu/)、[π0.5官方说明](https://www.pi.website/blog/pi05) | 从示范学习多模态动作；扩散/流匹配是策略表示与训练方式，并不自动构成RL | 机器人模仿学习；具身动作表示、扩散与流策略 |
| 跨本体数据与通用策略 | [Open X-Embodiment/RT-X](https://robotics-transformer-x.github.io/)、[Octo](https://octo-models.github.io/) | 数据接口、动作标准化和多机器人迁移成为核心；不同本体动作不能简单拼接 | 机器人数据；具身通用策略 |
| 视觉语言动作模型 VLA | [OpenVLA](https://openvla.github.io/)、[Gemini Robotics 2（2026-07-30）](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/)、[π0.5](https://www.pi.website/blog/pi05) | 视觉/语言条件到动作；2026代表路线已延伸全身控制、具身推理与端侧部署，但仍有灵巧操作和泛化局限。架构不等于训练范式，延迟/动作频率/安全回退需单独评估 | 具身VLA、分层决策、闭环评估 |
| VLA后训练与经验学习 | [π*0.6（2025-11-17）](https://www.pi.website/blog/pistar06)、[驾驶闭环后训练（2026）](https://developer.nvidia.com/blog/how-to-post-train-autonomous-vehicle-models-in-closed-loop-with-nvidia-alpamayo/) | 从监督/示范基础策略接入离线及在线经验，或在仿真中闭环优化；需要区分基础模型训练与任务后训练的数据、奖励和计算预算 | 机器人离线到在线/人机协同；驾驶学习策略和评估 |
| 视频世界模型到动作与规划 | [Cosmos Policy（2026-01）](https://arxiv.org/abs/2601.16163) | 视频模型微调用于动作、未来状态及价值预测和规划；这说明WM与策略可共建，不能据生成视频质量推出控制成功率 | 具身世界模型、世界模型控制与实验评估 |
| 人在回路的真实机器人学习 | [HIL-SERL作者项目](https://hil-serl.github.io/)、[论文](https://arxiv.org/abs/2410.21845) | 人类示范/干预可支持在线RL，但干预成本、奖励设计与硬件风险仍是约束 | 机器人人机协同学习；安全控制 |
| 驾驶世界模型 WM | [Wayve GAIA-2](https://wayve.ai/thinking/gaia-2/)、[技术报告](https://wayve.ai/wp-content/uploads/2025/03/GAIA_2_Technical_Report.pdf) | 动作条件、多视角生成世界可支持场景生成与测试；逼真视频不等于动力学正确，也不自动等于可部署控制器 | 驾驶世界模型、闭环评估；具身WM讲共同原理 |
| 驾驶推理与VLA | [NVIDIA Alpamayo技术说明](https://developer.nvidia.com/blog/building-autonomous-vehicles-that-reason-with-nvidia-alpamayo/) | 推理、轨迹动作与仿真/数据共同参与研发；研究模型能力与量产自动驾驶认证是不同证据层级 | 自动驾驶的学习策略、驾驶VLA与安全回退 |
| 建筑、储能与能源调度 | [CityLearn v2（2024）](https://arxiv.org/abs/2405.03848) | 热舒适、电池与需求响应构成受约束序贯决策；环境同时支持规则、MPC和RL基线，需比较约束违反和数据成本 | 微电网控制；RL案例与多智能体协同的可选实验 |
| 科学装置控制 | [等离子体磁控制原论文（2022）](https://doi.org/10.1038/s41586-021-04301-9)、[作者后续工作（2024）](https://deepmind.google/research/publications/30578/) | 从模拟训练到实验装置磁控制，体现高动态系统应用；特定装置实验不等于普适安全或可直接搬用 | RL控制案例的扩展阅读；鲁棒/安全控制的适用边界讨论 |

由上述路线作出的课程设计判断：VLA 是感知/语言到动作的模型范式，WM 是学习环境演化的模型；它们可以服务RL、模仿、规划、数据生成与测试。因此分为“强化学习控制基础 → 机器人控制 → 机器人学习 → 具身智能 → 自动驾驶”几条相连主线。机器人控制提供解析模型和经典基线，机器人学习聚焦技能获取与迁移，具身智能聚焦通用多模态策略和世界模型，自动驾驶聚焦车辆/交通闭环及安全。每条都有计算预算、失败场景和可复现实验，不按厂商模型逐个开课。

工程应用还覆盖过程、电力、储能等领域。它们可以采用RL，但每课先以领域约束和可信基线判断是否需要学习控制，不把“有RL论文”当必选方案。当前课程范围保留这些领域的控制基础，RL扩展由该课审计决定并回填 checklist。

### 3.3 命名、顺序与依赖规则

章名尽量4–8字、硬上限10字，不用冒号副标题、不用不并列的“X与Y”。课名最多16字，范围与算法清单放简介/H2，不堆在标题。必要通用缩写如PID、LQR保留。

目标 **21章205课 = 56课重构 + 149课新写**。相对141条基线，合并3组重复后为138课，再增67课；旧56份正文全部映射到56个目标，149新写中82课来自旧空条目、67课是新增。新增不是本次已完成产出。

下表“导航序”是最终显示顺序，“生产批次”是执行顺序。生产从数学开始，导论最后收口；其余从上到下逐课。入口依赖是章级边界合同，逐课的精确 prereq 在 Phase 1 分析后写回 catalog，检查无环、悬空或未解释前向边；不能拿整章全部课程当默认先修。

<!-- S3-CHAPTERS-BEGIN -->
| 导航序 | 生产批次 | slug | 章名 | 课数 | 入口依赖/边界 |
|---|---|---|---|---|---|
| 02 | 01 | math | 数学基础 | 18 | 高中数学；从函数与微积分补桥 |
| 03 | 02 | classic | 经典控制 | 11 | 数学基础的微积分、微分方程、变换 |
| 04 | 03 | modern | 现代控制 | 9 | 线性代数、微分方程、经典控制 |
| 05 | 04 | nonlinear | 非线性控制 | 12 | 现代控制、微分几何、Lyapunov方法 |
| 06 | 05 | discrete-sampled | 离散控制 | 10 | 现代控制、数学Z变换与数值方法 |
| 07 | 06 | implementation | 控制实现 | 10 | 离散控制、经典控制、数值方法 |
| 08 | 07 | machine-learning | 机器学习 | 9 | 概率、优化、线性代数与数值方法 |
| 09 | 08 | identification | 系统辨识 | 9 | 离散控制、概率、最小二乘基础在本章引入；神经辨识依赖机器学习 |
| 10 | 09 | estimation | 状态估计 | 8 | 状态观测器、概率、随机过程与离散控制 |
| 11 | 10 | robust | 鲁棒控制 | 11 | 现代控制、频域设计、状态估计 |
| 12 | 11 | mpc | 预测控制 | 11 | 离散最优控制、凸优化、系统辨识和状态估计 |
| 13 | 12 | intelligent | 智能控制 | 8 | 非线性控制、优化与机器学习 |
| 14 | 13 | rl-control | 强化学习控制基础 | 12 | 动态规划、概率、机器学习、最优控制与离散控制 |
| 15 | 14 | multi-agent | 多智能体控制 | 9 | 图论、博弈论、状态估计、预测控制与强化学习 |
| 16 | 15 | safety-ftc | 安全控制 | 8 | 非线性稳定性、优化、状态估计与强化学习 |
| 17 | 16 | robotics | 机器人控制 | 10 | 微分几何、现代与非线性控制、估计、预测控制与安全控制 |
| 18 | 17 | robot-learning | 机器人学习 | 10 | 机器人控制、强化学习、机器学习与安全控制 |
| 19 | 18 | embodied | 具身智能 | 10 | 机器学习、机器人控制和机器人学习；不是强化学习的同义词 |
| 20 | 19 | autonomous-driving | 自动驾驶 | 11 | 车辆建模在本章引入；估计、预测控制、安全控制、学习与世界模型 |
| 21 | 20 | applications | 工程应用 | 6 | 基础控制、辨识估计、鲁棒控制、预测控制；按行业选择学习路线 |
| 01 | 21 | introduction | 控制导论 | 3 | 导航排第一，生产在全部课程后收口；不作为基础课的必需先修 |
<!-- S3-CHAPTERS-END -->

## 4. 逐课目标与来源映射

<!-- S3-LESSONS-BEGIN -->
### 数学基础（math）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| MATH-01 | math/calculus-basics | 微积分入门 | 新写 | — |
| MATH-02 | math/complex-numbers | 复数基础 | 重构 | math/complex-numbers |
| MATH-03 | math/linear-algebra-basics | 线性代数基础 | 新写 | math/linear-algebra-basics |
| MATH-04 | math/eigen-decomposition | 特征值与对角化 | 新写 | math/eigen-decomposition |
| MATH-05 | math/matrix-decomposition | 矩阵分解 | 新写 | math/matrix-decomposition |
| MATH-06 | math/multivariable-calculus | 多元微积分 | 新写 | — |
| MATH-07 | math/ode-matrix-exponential | 微分方程与矩阵指数 | 新写 | math/ode-matrix-exponential |
| MATH-08 | math/laplace-transform | 拉普拉斯变换 | 新写 | math/laplace-transform |
| MATH-09 | math/fourier-analysis | 傅里叶分析 | 新写 | math/fourier-analysis |
| MATH-10 | math/z-transform | Z变换 | 新写 | math/z-transform |
| MATH-11 | math/probability-basics | 概率基础 | 新写 | math/probability-basics |
| MATH-12 | math/stochastic-processes | 随机过程 | 新写 | math/stochastic-processes |
| MATH-13 | math/convex-optimization | 凸优化 | 新写 | math/convex-optimization |
| MATH-14 | math/variational-dp | 变分法与动态规划 | 新写 | math/variational-dp |
| MATH-15 | math/diff-geometry | 微分几何入门 | 新写 | math/diff-geometry |
| MATH-16 | math/graph-theory | 图论基础 | 新写 | math/graph-theory |
| MATH-17 | math/game-theory-math | 博弈论基础 | 新写 | math/game-theory-math |
| MATH-18 | math/numerical-methods | 数值方法 | 新写 | math/numerical-methods |

### 经典控制（classic）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| CLASSIC-01 | classic/system-modeling | 系统建模 | 重构 | classic/system-modeling |
| CLASSIC-02 | classic/transfer-function | 传递函数 | 重构 | classic/transfer-function |
| CLASSIC-03 | classic/time-domain-analysis | 时域分析 | 重构 | classic/time-domain-analysis |
| CLASSIC-04 | classic/stability-analysis | 系统稳定性 | 重构 | classic/stability-analysis |
| CLASSIC-05 | classic/frequency-domain-analysis | 频域分析 | 重构 | classic/frequency-domain-analysis |
| CLASSIC-06 | classic/root-locus | 根轨迹 | 重构 | classic/root-locus |
| CLASSIC-07 | classic/pid-controller | PID控制 | 重构 | classic/pid-controller |
| CLASSIC-08 | classic/compensator-design | 校正网络 | 重构 | classic/compensator-design |
| CLASSIC-09 | classic/frequency-response-design | 回路整形 | 重构 | classic/frequency-response-design |
| CLASSIC-10 | classic/design-methods-comparison | 设计方法选型 | 新写 | classic/design-methods-comparison |
| CLASSIC-11 | classic/classic-case-study | 经典控制案例 | 重构 | classic/classic-case-study |

### 现代控制（modern）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| MODERN-01 | modern/state-space | 状态空间 | 重构 | modern/state-space |
| MODERN-02 | modern/controllability-observability | 可控性与可观性 | 重构 | modern/controllability-observability |
| MODERN-03 | modern/lyapunov-modern | 线性系统稳定性 | 重构 | modern/lyapunov-modern |
| MODERN-04 | modern/state-feedback | 状态反馈 | 重构 | modern/state-feedback |
| MODERN-05 | modern/state-observer | 状态观测器 | 重构 | modern/state-observer |
| MODERN-06 | modern/optimal-control-basics | 最优控制 | 重构 | modern/optimal-control-basics |
| MODERN-07 | modern/lqr-controller | LQR控制 | 重构 | modern/lqr-controller |
| MODERN-08 | modern/multivariable-systems | 多变量系统 | 重构 | modern/multivariable-systems |
| MODERN-09 | modern/modern-case-study | 现代控制案例 | 重构 | modern/modern-case-study |

### 非线性控制（nonlinear）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| NONLINEAR-01 | nonlinear/nonlinear-characteristics | 非线性系统 | 重构 | nonlinear/nonlinear-characteristics |
| NONLINEAR-02 | nonlinear/phase-plane | 相平面 | 重构 | nonlinear/phase-plane |
| NONLINEAR-03 | nonlinear/lyapunov-stability | Lyapunov稳定性 | 重构 | nonlinear/lyapunov-stability |
| NONLINEAR-04 | nonlinear/describing-function | 描述函数 | 重构 | nonlinear/describing-function |
| NONLINEAR-05 | nonlinear/feedback-linearization | 反馈线性化 | 重构 | nonlinear/feedback-linearization |
| NONLINEAR-06 | nonlinear/sliding-mode-control | 滑模控制 | 重构 | nonlinear/sliding-mode-control |
| NONLINEAR-07 | nonlinear/backstepping | 反步设计 | 重构 | nonlinear/backstepping |
| NONLINEAR-08 | nonlinear/adaptive-control-basics | 自适应控制 | 重构 | nonlinear/adaptive-control-basics |
| NONLINEAR-09 | nonlinear/passivity-control | 无源控制 | 新写 | — |
| NONLINEAR-10 | nonlinear/iss-small-gain | 输入状态稳定性 | 新写 | — |
| NONLINEAR-11 | nonlinear/switched-hybrid-systems | 切换与混杂系统 | 新写 | — |
| NONLINEAR-12 | nonlinear/bifurcation-chaos | 分岔与混沌 | 新写 | — |

### 离散控制（discrete-sampled）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| DISCRETE-01 | discrete-sampled/discrete-time-freq | 采样与量化 | 重构 | discrete-sampled/discrete-time-freq |
| DISCRETE-02 | discrete-sampled/discrete-time-systems | 离散时间系统 | 新写 | discrete-sampled/discrete-time-systems |
| DISCRETE-03 | discrete-sampled/difference-equation | 差分方程 | 新写 | discrete-sampled/difference-equation |
| DISCRETE-04 | discrete-sampled/z-transform-analysis | Z域系统分析 | 重构 | discrete-sampled/z-transform-analysis |
| DISCRETE-05 | discrete-sampled/discrete-stability-criteria | 离散系统稳定性 | 重构 | discrete-sampled/discrete-stability-criteria |
| DISCRETE-06 | discrete-sampled/discretization-methods | 离散化方法 | 重构 | discrete-sampled/discretization-methods |
| DISCRETE-07 | discrete-sampled/sampling-period-selection | 采样周期 | 重构 | discrete-sampled/sampling-period-selection |
| DISCRETE-08 | discrete-sampled/sampled-data-systems | 采样数据系统 | 新写 | discrete-sampled/sampled-data-systems |
| DISCRETE-09 | discrete-sampled/discrete-optimal-control | 离散最优控制 | 新写 | discrete-sampled/discrete-optimal-control |
| DISCRETE-10 | discrete-sampled/event-triggered-control | 事件触发控制 | 新写 | discrete-sampled/event-triggered-control |

### 控制实现（implementation）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| IMPL-01 | implementation/computer-control-architecture | 控制系统架构 | 重构 | implementation/computer-control-architecture |
| IMPL-02 | implementation/digital-pid | 数字PID | 重构 | implementation/digital-pid |
| IMPL-03 | implementation/pid-engineering-tuning | PID工程整定 | 新写 | implementation/pid-engineering-tuning |
| IMPL-04 | implementation/controller-discretization-practice | 控制器部署 | 新写 | implementation/controller-discretization-practice |
| IMPL-05 | implementation/embedded-implementation | 嵌入式控制 | 新写 | implementation/embedded-implementation |
| IMPL-06 | implementation/realtime-control | 实时控制 | 重构 | implementation/realtime-control |
| IMPL-07 | implementation/networked-control | 网络控制 | 新写 | implementation/networked-control |
| IMPL-08 | implementation/industrial-bus-protocols | 工业通信 | 新写 | implementation/industrial-bus-protocols |
| IMPL-09 | implementation/hil-rapid-prototyping | 半实物仿真 | 新写 | implementation/hil-rapid-prototyping |
| IMPL-10 | implementation/implementation-case-study | 控制实现案例 | 新写 | implementation/implementation-case-study |

### 机器学习（machine-learning）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| ML-01 | machine-learning/learning-problem | 学习问题与泛化 | 新写 | — |
| ML-02 | machine-learning/supervised-learning | 监督学习 | 新写 | — |
| ML-03 | machine-learning/neural-networks | 神经网络基础 | 新写 | — |
| ML-04 | machine-learning/autodiff-optimization | 自动微分与训练 | 新写 | — |
| ML-05 | machine-learning/sequence-models | 时序模型 | 新写 | — |
| ML-06 | machine-learning/attention-transformers | 注意力机制 | 新写 | — |
| ML-07 | machine-learning/representation-learning | 表征学习 | 新写 | — |
| ML-08 | machine-learning/generative-models | 扩散与流匹配 | 新写 | — |
| ML-09 | machine-learning/learning-evaluation | 学习实验评估 | 新写 | — |

### 系统辨识（identification）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| ID-01 | identification/identification-framework | 系统辨识框架 | 新写 | identification/identification-framework |
| ID-02 | identification/model-structures | 辨识模型 | 新写 | identification/model-structures |
| ID-03 | identification/least-squares-rls | 最小二乘辨识 | 新写 | identification/least-squares-rls |
| ID-04 | identification/persistent-excitation | 持久激励 | 新写 | identification/persistent-excitation |
| ID-05 | identification/instrumental-variable | 闭环辨识 | 新写 | identification/instrumental-variable |
| ID-06 | identification/frequency-domain-id | 频域辨识 | 新写 | identification/frequency-domain-id |
| ID-07 | identification/subspace-id | 子空间辨识 | 新写 | identification/subspace-id |
| ID-08 | identification/nonlinear-data-driven-id | 非线性辨识 | 新写 | identification/nonlinear-data-driven-id |
| ID-09 | identification/identification-case-study | 系统辨识案例 | 新写 | identification/identification-case-study |

### 状态估计（estimation）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| EST-01 | estimation/estimation-problem | 状态估计框架 | 新写 | estimation/estimation-problem |
| EST-02 | estimation/least-squares-ml | 统计估计 | 新写 | estimation/least-squares-ml |
| EST-03 | estimation/kalman-filter | 卡尔曼滤波 | 重构 | modern/kalman-filter;estimation/kalman-filter |
| EST-04 | estimation/extended-kalman-filter | 扩展卡尔曼滤波 | 新写 | estimation/extended-kalman-filter |
| EST-05 | estimation/unscented-kalman-filter | 无迹卡尔曼滤波 | 新写 | estimation/unscented-kalman-filter |
| EST-06 | estimation/particle-filter | 粒子滤波 | 新写 | estimation/particle-filter |
| EST-07 | estimation/sensor-fusion | 多传感器融合 | 新写 | — |
| EST-08 | estimation/estimation-case-study | 状态估计案例 | 新写 | estimation/estimation-case-study |

### 鲁棒控制（robust）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| ROBUST-01 | robust/robustness-concept | 鲁棒性 | 重构 | robust/robustness-concept |
| ROBUST-02 | robust/uncertainty-modeling | 不确定性建模 | 重构 | robust/uncertainty-modeling |
| ROBUST-03 | robust/robust-stability | 鲁棒稳定性 | 重构 | robust/robust-stability |
| ROBUST-04 | robust/robust-performance | 鲁棒性能 | 重构 | robust/robust-performance |
| ROBUST-05 | robust/h-infinity-basics | H∞控制 | 重构 | robust/h-infinity-basics |
| ROBUST-06 | robust/mixed-sensitivity | 混合灵敏度 | 重构 | robust/mixed-sensitivity |
| ROBUST-07 | robust/mu-analysis | 结构奇异值 | 新写 | — |
| ROBUST-08 | robust/mu-synthesis | μ综合 | 重构 | robust/mu-synthesis |
| ROBUST-09 | robust/h-infinity-filter | H∞滤波 | 新写 | estimation/h-infinity-filter |
| ROBUST-10 | robust/delay-robust-control | 时滞系统控制 | 新写 | — |
| ROBUST-11 | robust/robust-case-study | 鲁棒控制案例 | 重构 | robust/robust-case-study |

### 预测控制（mpc）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| MPC-01 | mpc/mpc-principle | 预测控制原理 | 重构 | mpc/mpc-principle |
| MPC-02 | mpc/prediction-model | 预测模型 | 重构 | mpc/prediction-model |
| MPC-03 | mpc/receding-horizon | 滚动优化 | 重构 | mpc/receding-horizon |
| MPC-04 | mpc/constraint-handling | 约束处理 | 重构 | mpc/constraint-handling |
| MPC-05 | mpc/mpc-stability | 递归可行性与稳定性 | 新写 | — |
| MPC-06 | mpc/generalized-predictive-control | 广义预测控制 | 重构 | mpc/generalized-predictive-control |
| MPC-07 | mpc/explicit-mpc | 显式预测控制 | 新写 | — |
| MPC-08 | mpc/nonlinear-mpc | 非线性预测控制 | 重构 | mpc/nonlinear-mpc |
| MPC-09 | mpc/economic-mpc | 经济预测控制 | 新写 | — |
| MPC-10 | mpc/mhe-fusion | 移动水平估计 | 新写 | estimation/mhe-fusion |
| MPC-11 | mpc/mpc-case-study | 预测控制案例 | 重构 | mpc/mpc-case-study |

### 智能控制（intelligent）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| INTEL-01 | intelligent/fuzzy-control-basics | 模糊控制 | 重构 | intelligent/fuzzy-control-basics |
| INTEL-02 | intelligent/fuzzy-controller-design | 模糊控制器 | 重构 | intelligent/fuzzy-controller-design |
| INTEL-03 | intelligent/expert-system | 专家控制 | 新写 | intelligent/expert-system |
| INTEL-04 | intelligent/genetic-algorithm | 遗传算法 | 新写 | intelligent/genetic-algorithm |
| INTEL-05 | intelligent/neural-network-control | 神经网络控制 | 重构 | intelligent/neural-network-control |
| INTEL-06 | intelligent/fuzzy-neural-network | 模糊神经网络 | 新写 | intelligent/fuzzy-neural-network |
| INTEL-07 | intelligent/iterative-learning-control | 迭代学习控制 | 新写 | — |
| INTEL-08 | intelligent/intelligent-case-study | 智能控制案例 | 新写 | intelligent/intelligent-case-study |

### 强化学习控制基础（rl-control）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| RL-01 | rl-control/rl-basics | 强化学习问题 | 新写 | rl-control/rl-basics |
| RL-02 | rl-control/dynamic-programming | 价值函数与贝尔曼方程 | 新写 | — |
| RL-03 | rl-control/q-learning | Q学习 | 新写 | rl-control/q-learning |
| RL-04 | rl-control/dqn | 深度Q网络 | 新写 | rl-control/dqn |
| RL-05 | rl-control/policy-gradient | 策略梯度 | 新写 | rl-control/policy-gradient |
| RL-06 | rl-control/actor-critic | 演员评论家方法 | 新写 | rl-control/actor-critic |
| RL-07 | rl-control/ppo | PPO算法 | 新写 | — |
| RL-08 | rl-control/sac-td3 | SAC与TD3 | 新写 | — |
| RL-09 | rl-control/offline-rl | 离线强化学习 | 新写 | — |
| RL-10 | rl-control/model-based-rl | 基于模型的强化学习 | 新写 | — |
| RL-11 | rl-control/rl-evaluation | 强化学习评估 | 新写 | — |
| RL-12 | rl-control/rl-control-case | 强化学习控制案例 | 新写 | rl-control/rl-control-case |

### 多智能体控制（multi-agent）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| MULTI-01 | multi-agent/multi-agent-overview | 多智能体系统 | 新写 | multi-agent/multi-agent-overview |
| MULTI-02 | multi-agent/consensus-control | 一致性控制 | 新写 | multi-agent/consensus-control |
| MULTI-03 | multi-agent/distributed-estimation | 分布式估计 | 新写 | multi-agent/distributed-estimation |
| MULTI-04 | multi-agent/distributed-optimization | 分布式优化 | 新写 | multi-agent/distributed-optimization |
| MULTI-05 | multi-agent/game-theory-basics | 控制中的博弈 | 新写 | multi-agent/game-theory-basics |
| MULTI-06 | multi-agent/formation-control | 编队控制 | 新写 | multi-agent/formation-control |
| MULTI-07 | multi-agent/distributed-mpc | 分布式预测控制 | 重构 | mpc/distributed-mpc |
| MULTI-08 | multi-agent/multi-agent-rl | 多智能体强化学习 | 新写 | rl-control/multi-agent-rl;multi-agent/multi-agent-rl |
| MULTI-09 | multi-agent/multi-agent-cooperation | 多智能体协同案例 | 新写 | multi-agent/multi-agent-cooperation |

### 安全控制（safety-ftc）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| SAFE-01 | safety-ftc/safety-overview | 控制安全 | 新写 | safety-ftc/safety-overview |
| SAFE-02 | safety-ftc/control-barrier-functions | 控制屏障函数 | 新写 | safety-ftc/control-barrier-functions |
| SAFE-03 | safety-ftc/reachability-analysis | 可达性分析 | 新写 | safety-ftc/reachability-analysis |
| SAFE-04 | safety-ftc/fault-detection-isolation | 故障诊断 | 新写 | safety-ftc/fault-detection-isolation |
| SAFE-05 | safety-ftc/fault-tolerant-control | 容错控制 | 新写 | safety-ftc/fault-tolerant-control |
| SAFE-06 | safety-ftc/safe-rl | 安全强化学习 | 新写 | rl-control/safe-rl;safety-ftc/safe-rl |
| SAFE-07 | safety-ftc/functional-safety-standards | 功能安全 | 新写 | safety-ftc/functional-safety-standards |
| SAFE-08 | safety-ftc/safety-case-study | 安全控制案例 | 新写 | safety-ftc/safety-case-study |

### 机器人控制（robotics）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| ROBOT-01 | robotics/robot-models | 机器人系统 | 新写 | — |
| ROBOT-02 | robotics/rigid-body-motion | 刚体运动 | 新写 | — |
| ROBOT-03 | robotics/kinematics | 机器人运动学 | 新写 | — |
| ROBOT-04 | robotics/dynamics | 机器人动力学 | 新写 | — |
| ROBOT-05 | robotics/motion-planning | 机器人运动规划 | 新写 | — |
| ROBOT-06 | robotics/trajectory-tracking | 轨迹跟踪 | 新写 | — |
| ROBOT-07 | robotics/impedance-control | 阻抗控制 | 新写 | — |
| ROBOT-08 | robotics/contact-control | 接触控制 | 新写 | — |
| ROBOT-09 | robotics/legged-control | 足式机器人控制 | 新写 | — |
| ROBOT-10 | robotics/robotics-case-study | 机器人控制案例 | 新写 | applications/robotics-control |

### 机器人学习（robot-learning）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| RLEARN-01 | robot-learning/robot-data | 机器人数据 | 新写 | — |
| RLEARN-02 | robot-learning/imitation-learning | 模仿学习 | 新写 | — |
| RLEARN-03 | robot-learning/offline-online-learning | 离线到在线学习 | 新写 | — |
| RLEARN-04 | robot-learning/residual-learning | 残差学习控制 | 新写 | — |
| RLEARN-05 | robot-learning/sim-to-real | 仿真到现实 | 新写 | — |
| RLEARN-06 | robot-learning/locomotion-learning | 运动技能学习 | 新写 | — |
| RLEARN-07 | robot-learning/manipulation-learning | 操作技能学习 | 新写 | — |
| RLEARN-08 | robot-learning/human-in-the-loop | 人机协同学习 | 新写 | — |
| RLEARN-09 | robot-learning/learning-with-mpc | 学习与预测控制 | 新写 | — |
| RLEARN-10 | robot-learning/robot-learning-evaluation | 机器人学习评估 | 新写 | — |

### 具身智能（embodied）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| EMBODIED-01 | embodied/embodied-systems | 具身智能系统 | 新写 | — |
| EMBODIED-02 | embodied/multimodal-observation | 多模态感知 | 新写 | — |
| EMBODIED-03 | embodied/action-representations | 动作表示 | 新写 | — |
| EMBODIED-04 | embodied/generalist-policies | 通用机器人策略 | 新写 | — |
| EMBODIED-05 | embodied/diffusion-flow-policies | 扩散与流策略 | 新写 | — |
| EMBODIED-06 | embodied/vla | 视觉语言动作模型 | 新写 | — |
| EMBODIED-07 | embodied/world-models | 世界模型 | 新写 | — |
| EMBODIED-08 | embodied/world-model-control | 世界模型控制 | 新写 | — |
| EMBODIED-09 | embodied/hierarchical-reasoning | 分层决策 | 新写 | — |
| EMBODIED-10 | embodied/embodied-evaluation | 具身智能评估 | 新写 | — |

### 自动驾驶（autonomous-driving）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| DRIVING-01 | autonomous-driving/driving-system | 自动驾驶系统 | 新写 | — |
| DRIVING-02 | autonomous-driving/vehicle-dynamics | 车辆动力学 | 新写 | — |
| DRIVING-03 | autonomous-driving/localization-prediction | 定位与运动预测 | 新写 | — |
| DRIVING-04 | autonomous-driving/motion-planning | 自动驾驶规划 | 新写 | — |
| DRIVING-05 | autonomous-driving/vehicle-control | 车辆跟踪控制 | 新写 | applications/auto-driving-control |
| DRIVING-06 | autonomous-driving/learning-planning | 学习型驾驶策略 | 新写 | — |
| DRIVING-07 | autonomous-driving/rl-decision | 驾驶决策强化学习 | 新写 | — |
| DRIVING-08 | autonomous-driving/driving-world-models | 驾驶世界模型 | 新写 | — |
| DRIVING-09 | autonomous-driving/driving-vla | 驾驶视觉语言动作模型 | 新写 | — |
| DRIVING-10 | autonomous-driving/closed-loop-evaluation | 闭环驾驶评估 | 新写 | — |
| DRIVING-11 | autonomous-driving/driving-safety | 驾驶安全与回退 | 新写 | — |

### 工程应用（applications）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| APP-01 | applications/power-electronics | 电力电子控制 | 新写 | applications/power-electronics |
| APP-02 | applications/process-control | 过程控制 | 新写 | applications/process-control |
| APP-03 | applications/aerospace-attitude | 飞行器姿态控制 | 新写 | applications/aerospace-attitude |
| APP-04 | applications/energy-storage-microgrid | 微电网控制 | 新写 | applications/energy-storage-microgrid |
| APP-05 | applications/biomedical-control | 生物医学控制 | 新写 | applications/biomedical-control |
| APP-06 | applications/semiconductor-equipment | 半导体装备控制 | 新写 | applications/semiconductor-equipment |

### 控制导论（introduction）

| ID | 目标路径 | 课名 | 模式 | 基线来源 |
|---|---|---|---|---|
| INTRO-01 | introduction/why-feedback-works | 反馈为什么有效 | 新写 | introduction/why-feedback-works |
| INTRO-02 | introduction/control-landscape | 控制理论地图 | 新写 | introduction/control-landscape |
| INTRO-03 | introduction/controller-selection-guide | 控制方法选型 | 新写 | introduction/controller-selection-guide |

<!-- S3-LESSONS-END -->

## 5. 执行阶段与门槛

所有阶段对应全局 checklist 中的任务 ID，不在本计划再设置第二套完成复选框。

| 阶段 | 全局任务 | 工作与完成定义 |
|---|---|---|
| P 立项 | P01–P05 | 实测快照、调研与结构方案、两技能、全局台账校验、试走技能；本次完成可检查设计，不提前计入课交付 |
| I 开课前基建 | I01–I04 | 解决吞MDX编译错误的构建门槛；核对历史fix索引冲突标记；查清36 WARN并逐项登记处置；确保内核/验收可复现。不得通过清空课程规避错误 |
| S 结构落地 | S01–S04 | 完整映射、课型/难度与逐课先修审查；catalog 21章骨架与纯路径迁移；旧URL/必要锚点/引用和旧台账同步；check+build+迁移页/回归验收后合入 |
| W 基线风险处置 | W01–W05 | I03逐项审计后登记：锚点修复、孤儿组件去向、先修审查、真实DOM锚点门槛、两页MPC渲染修复；具体依赖和关闭条件见I03台账，S04前完成对应门槛 |
| C 逐课交付 | 每课唯一ID行 | 从MATH-01顺序进行，56重构/149新写，Phase1–4、实际验收和合并全部完成；具体缺陷在每课审计时才定 |
| R 收官 | R01–R03 | 全站check/verify:all/nb/术语/build及链接回归；来源与章节覆盖复核；fix归因回顾、统计和semester03标签 |

结构迁移不等于重构：只能搬移资产、改元数据/引用和重定向，保留56份正文的原始教学内容，不能在一个结构对话里代签多课。合并有正文+空条目时保留正文和正确状态；两空条目合一仍是empty；S3课程行仍全部未完成。旧路径不能先删再等新课交付，重定向目标必须可达且保留原可读内容。共享组件移动前核调用者；空目录不需要伪造MDX。

质量基建每项有实际失败样本与通过证据，内容交付按当前 AGENTS 与共同技能执行。build 的 exit=0 不足以覆盖 Q26 类吞错；旧课编译错误若阻塞全站门槛，先登记并修复阻塞，不能把全站未验记成通过。纯技术修复可在 I 任务处理；涉及教学结论的修订仍须课程讨论流程，单独一课一对话。

WARN 分为已知待处理/本课新增/阻塞；全局表登记实际明细文件及处理任务，不能笼统写“旧WARN全部可忽略”。本次快照有36项，后续结构会改变数量，以每次实测为准。旧 plan 的 Q 编号不重新编号，本期新增问题用 S3-Q001 起顺序登记到全局表。

I03审计明细与35课日志/30条孤立课程去向在 [semester-03/i03-warn-audit.md](semester-03/i03-warn-audit.md)。36项WARN原文固化为不可变证据，本期新增技术问题S3-Q001指源码slug预估与最终DOM不同；它由W04处理，不改冻结Q5口径。I03完成仅代表审计登记，底层问题仍须由W/S/逐课任务验收关闭。

S01迁移输入审查见 [结构清单](semester-03/s01-migration-review.md) 与 [205课候选先修](semester-03/s01-dependency-review.md)。141来源/56正文全部保留，8个旧入口改变、2份正文移动；148旧边逐条登记处置，候选图464边无环/悬空/未解释前向边，保留两条采样先修。S02按该审查落地课型/难度和先修，S03处理旧入口/引用/台账；仍由catalog提供线上元数据，逐课Phase 1复核教学依赖。W03仅完成审查部分，不提前关闭；S01未更改本计划目标范围或课程生产顺序。

S02已实施21章205课与464先修边，正文56份逐字保留，149空课和29个旧v1.3状态不变。为保证独立合入后可用，S03中必要的旧URL永久跳转和旧tracker/自动大纲同步前置到S02；S03仍负责锚点、引用与完整兼容验收，S04不提前关闭。迁移后30项WARN的实际审计及新发现存量notebook失败见 [S02记录](semester-03/s02-structure-migration.md)，I03/S01不可变快照保留；S01校验转对历史提交取证，迁移后用 `node scripts/check-structure-migration.mjs`。

S03迁移兼容已完成，见 [验收记录](semester-03/s03-compatibility.md)：统一9条旧入口与历史日志身份映射，规范化8份正文的10处课程URL，在渲染层保留分布式MPC的3个旧片段，全部迁移前渲染ID保留。只改引用/兼容，不改教学内容；旧台账状态与历史证据保留。W01/W04/W05的全站锚点和MPC正文渲染问题不由S03代签，S04仍待其相应门槛完成。

工作包分支沿用 `wp/<阶段>-<内容>`，计划为 `wp/s3-planning`，后续结构或单课用 `wp/s3-structure`、`wp/s3-math-calculus-basics` 等。从master开始；每课验收后立即 `--no-ff` 合入master，多课包未完可留分支。只暂存本任务文件，用户已有未提交修改不动；不自动push。

## 6. 目标清单与范围变更

上面的课程表是本期目标范围唯一清单，课程具体 H2/算例/习题/保留或重写方案均留到执行时讨论。source 用分号表示合并来源，`—` 表示新增；来源与新写/重构由基线有无正文判定。

本期暂不引入新角色、重新定义catalog状态枚举、制作另一套线上目录数据源或批量生成课文。结构落地中若出现新约束，新增全局任务与 S3-Q 记录，说明证据、候选、对顺序/来源的影响；用户目标范围改变时更新本计划、清单与映射，不能擅自修改冻结的学期2诊断。

变更记录：2026-10-17 初版立项；21章205课，141条基线全覆盖。实际校验与交付记录见全局 checklist 的 P04/P05 证据。

S04结构验收完成：W01–W05已按实际条件关闭，21章205课、56正文/149空课、464先修边，生产路径/真实锚点/数学/旧入口通过；check为PASS21/WARN2/FAIL0。全站verify仍有课程内容与组件存量债务，逐课登记，R01不提前关闭。参见 [S04证据](semester-03/s04-structure-acceptance.md)。下一对话从MATH-01微积分入门开始，新写技能与一个对话一节课节奏不变。

MATH-01微积分入门已完成新写Phase 1–4和实际验收，详见[本课验收](semester-03/math-01/acceptance.md)与全局checklist；目标范围/来源/顺序不变，本对话不生产MATH-02。check的35门日志债务成员不变，新增有日志正文令占比63%→61%，两项WARN复审见[逐课快照](semester-03/math-01/warnings.json)，不覆盖I03/S04历史快照。
