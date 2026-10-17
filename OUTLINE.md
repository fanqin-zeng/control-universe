# 控制宇宙 - 课程大纲

> **本文件由 `npm run check -- --fix-outline` 自动生成，请勿手工编辑。**
> 唯一权威数据源：`content/catalog.ts`；核对脚本：`scripts/check-catalog.mjs`。
> 生成日期：2026-10-17

## 1. 导论与方法论地图 (introduction)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 1.1 | 控制理论全景图 | control-landscape | ⬜ 骨架（占位页） | undergrad | history | 0 | — |
| 1.2 | 反馈为什么有效 | why-feedback-works | ⬜ 骨架（占位页） | undergrad | history | 1 | classic/transfer-function |
| 1.3 | 控制器选型决策指南 | controller-selection-guide | ⬜ 骨架（占位页） | grad | history | 1 | introduction/control-landscape<br>classic/pid-controller<br>modern/state-feedback<br>mpc/mpc-principle<br>robust/h-infinity-basics<br>rl-control/rl-basics |

## 2. 数学基础 (math)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 2.1 | 复数基础 | complex-numbers | 🟨 有正文待审校 | undergrad | math | 0 | — |
| 2.2 | 向量、矩阵、秩与子空间 | linear-algebra-basics | ⬜ 骨架（占位页） | undergrad | math | 0 | — |
| 2.3 | 特征值、特征向量与对角化 | eigen-decomposition | ⬜ 骨架（占位页） | undergrad | math | 1 | math/linear-algebra-basics |
| 2.4 | 矩阵分解：SVD、Jordan、二次型与正定性 | matrix-decomposition | ⬜ 骨架（占位页） | undergrad | math | 2 | math/linear-algebra-basics<br>math/eigen-decomposition |
| 2.5 | 常微分方程与矩阵指数 | ode-matrix-exponential | ⬜ 骨架（占位页） | undergrad | math | 1 | math/linear-algebra-basics<br>math/complex-numbers |
| 2.6 | 拉普拉斯变换 | laplace-transform | ⬜ 骨架（占位页） | undergrad | math | 1 | math/complex-numbers |
| 2.7 | 傅里叶分析与频谱概念 | fourier-analysis | ⬜ 骨架（占位页） | undergrad | math | 1 | math/complex-numbers |
| 2.8 | Z 变换与离散时间信号 | z-transform | ⬜ 骨架（占位页） | undergrad | math | 2 | math/laplace-transform |
| 2.9 | 概率论与随机变量 | probability-basics | ⬜ 骨架（占位页） | undergrad | math | 0 | — |
| 2.10 | 随机过程、马尔可夫链与白噪声 | stochastic-processes | ⬜ 骨架（占位页） | grad | math | 1 | math/probability-basics |
| 2.11 | 凸优化：凸集、QP 与 KKT 条件 | convex-optimization | ⬜ 骨架（占位页） | grad | math | 1 | math/linear-algebra-basics |
| 2.12 | 变分法与动态规划（含贝尔曼方程） | variational-dp | ⬜ 骨架（占位页） | grad | math | 2 | math/ode-matrix-exponential |
| 2.13 | 微分几何入门：向量场、李导数、李括号 | diff-geometry | ⬜ 骨架（占位页） | grad | math | 2 | math/linear-algebra-basics<br>math/ode-matrix-exponential |
| 2.14 | 图论与网络拉普拉斯、代数连通性 | graph-theory | ⬜ 骨架（占位页） | undergrad | math | 2 | math/linear-algebra-basics<br>math/eigen-decomposition |
| 2.15 | 博弈论数学基础：纳什均衡与 LQ 博弈 | game-theory-math | ⬜ 骨架（占位页） | grad | math | 2 | math/convex-optimization |
| 2.16 | 数值方法与矩阵微积分：积分步长、刚性、条件数 | numerical-methods | ⬜ 骨架（占位页） | undergrad | math | 2 | math/linear-algebra-basics<br>math/ode-matrix-exponential |

## 3. 经典控制 (classic)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 3.1 | 系统建模基础 | system-modeling | ✅ 已交付 v1.3 | — | — | 0 | — |
| 3.2 | 传递函数入门 | transfer-function | ✅ 已交付 v1.3 | — | — | 0 | — |
| 3.3 | 时域分析 | time-domain-analysis | ✅ 已交付 v1.3 | — | — | 0 | — |
| 3.4 | 系统稳定性分析 | stability-analysis | ✅ 已交付 v1.3 | — | — | 0 | — |
| 3.5 | 频域分析 | frequency-domain-analysis | ✅ 已交付 v1.3 | — | — | 0 | — |
| 3.6 | 根轨迹法 | root-locus | ✅ 已交付 v1.3 | — | — | 0 | — |
| 3.7 | 频率响应设计法：回路整形与带宽 | frequency-response-design | ✅ 已交付 v1.3 | — | — | 0 | — |
| 3.8 | PID控制器设计 | pid-controller | ✅ 已交付 v1.3 | — | — | 0 | — |
| 3.9 | 校正网络设计 | compensator-design | ✅ 已交付 v1.3 | — | — | 0 | — |
| 3.10 | 设计方法对比与选型 | design-methods-comparison | ⬜ 骨架（占位页） | undergrad | theory | 1 | classic/time-domain-analysis<br>classic/frequency-domain-analysis<br>classic/root-locus<br>classic/frequency-response-design<br>classic/pid-controller<br>classic/compensator-design |
| 3.11 | 经典控制综合案例 | classic-case-study | ✅ 已交付 v1.3 | — | — | 0 | — |

## 4. 现代控制 (modern)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 4.1 | 状态空间表示 | state-space | ✅ 已交付 v1.3 | — | — | 0 | — |
| 4.2 | 可控性与可观性 | controllability-observability | ✅ 已交付 v1.3 | — | — | 0 | — |
| 4.3 | Lyapunov 方法与现代稳定性 | lyapunov-modern | ✅ 已交付 v1.3 | — | theory | 0 | — |
| 4.4 | 状态反馈与极点配置 | state-feedback | ✅ 已交付 v1.3 | — | — | 0 | — |
| 4.5 | 状态观测器设计 | state-observer | ✅ 已交付 v1.3 | — | — | 0 | — |
| 4.6 | 最优控制基础 | optimal-control-basics | ✅ 已交付 v1.3 | — | — | 0 | — |
| 4.7 | LQR控制器 | lqr-controller | ✅ 已交付 v1.3 | — | — | 0 | — |
| 4.8 | 卡尔曼滤波 | kalman-filter | 🟨 有正文待审校 | — | — | 0 | — |
| 4.9 | 多变量系统分析 | multivariable-systems | ✅ 已交付 v1.3 | — | theory | 0 | — |
| 4.10 | 现代控制综合案例 | modern-case-study | 🟨 有正文待审校 | — | — | 0 | — |

## 5. 状态估计与滤波 (estimation)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 5.1 | 估计问题框架：从观测器到最优估计 | estimation-problem | ⬜ 骨架（占位页） | undergrad | theory | 1 | modern/state-observer<br>math/probability-basics |
| 5.2 | 最小二乘、加权最小二乘与极大似然估计 | least-squares-ml | ⬜ 骨架（占位页） | undergrad | theory | 1 | math/linear-algebra-basics<br>math/probability-basics |
| 5.3 | 卡尔曼滤波 | kalman-filter | ⬜ 骨架（占位页） | undergrad | theory | 2 | estimation/estimation-problem<br>estimation/least-squares-ml<br>math/stochastic-processes<br>modern/lqr-controller |
| 5.4 | 扩展卡尔曼滤波 EKF：线性化误差、收敛条件与失效场景 | extended-kalman-filter | ⬜ 骨架（占位页） | grad | theory | 3 | estimation/kalman-filter<br>nonlinear/lyapunov-stability |
| 5.5 | 无迹卡尔曼滤波 UKF：Sigma 点选取与二阶精度 | unscented-kalman-filter | ⬜ 骨架（占位页） | grad | theory | 4 | estimation/extended-kalman-filter<br>math/probability-basics |
| 5.6 | 粒子滤波与蒙特卡洛方法：多峰后验、粒子退化与重采样策略 | particle-filter | ⬜ 骨架（占位页） | grad | theory | 3 | estimation/kalman-filter<br>math/stochastic-processes |
| 5.7 | H∞滤波与鲁棒估计 | h-infinity-filter | ⬜ 骨架（占位页） | grad | theory | 3 | estimation/kalman-filter<br>robust/h-infinity-basics |
| 5.8 | 移动水平估计 MHE 与多传感器融合 | mhe-fusion | ⬜ 骨架（占位页） | grad | theory | 3 | estimation/kalman-filter<br>math/convex-optimization<br>mpc/receding-horizon |
| 5.9 | 估计综合案例：非线性系统的滤波器选型与定量对比 | estimation-case-study | ⬜ 骨架（占位页） | grad | case | 5 | estimation/extended-kalman-filter<br>estimation/unscented-kalman-filter<br>estimation/particle-filter |

## 6. 非线性控制 (nonlinear)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 6.1 | 非线性系统特性 | nonlinear-characteristics | ✅ 已交付 v1.3 | — | — | 0 | — |
| 6.2 | 相平面分析 | phase-plane | ✅ 已交付 v1.3 | — | — | 0 | — |
| 6.3 | 描述函数法 | describing-function | ✅ 已交付 v1.3 | — | — | 0 | — |
| 6.4 | 李雅普诺夫稳定性 | lyapunov-stability | ✅ 已交付 v1.3 | — | — | 0 | — |
| 6.5 | 反馈线性化 | feedback-linearization | ✅ 已交付 v1.3 | — | — | 0 | — |
| 6.6 | 滑模控制 | sliding-mode-control | ✅ 已交付 v1.3 | — | — | 0 | — |
| 6.7 | 反步法设计 | backstepping | ✅ 已交付 v1.3 | — | — | 0 | — |
| 6.8 | 自适应控制基础 | adaptive-control-basics | ✅ 已交付 v1.3 | — | — | 0 | — |

## 7. 离散与采样数据系统 (discrete-sampled)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 7.1 | 离散时间系统与状态空间 | discrete-time-systems | ⬜ 骨架（占位页） | undergrad | theory | 1 | modern/state-space |
| 7.2 | 差分方程建模与脉冲传递函数 | difference-equation | ⬜ 骨架（占位页） | undergrad | theory | 2 | discrete-sampled/discrete-time-systems |
| 7.3 | Z变换基础 | z-transform-analysis | 🟨 有正文待审校 | undergrad | theory | 1 | discrete-sampled/discrete-time-freq |
| 7.4 | 数字控制器设计 | discretization-methods | 🟨 有正文待审校 | undergrad | theory | 2 | discrete-sampled/discrete-time-freq<br>discrete-sampled/z-transform-analysis |
| 7.5 | 离散系统稳定性 | discrete-stability-criteria | 🟨 有正文待审校 | undergrad | theory | 3 | discrete-sampled/z-transform-analysis<br>discrete-sampled/discretization-methods |
| 7.6 | 采样与量化 | discrete-time-freq | 🟨 有正文待审校 | undergrad | theory | 0 | — |
| 7.7 | 采样周期选择 | sampling-period-selection | 🟨 有正文待审校 | undergrad | theory | 4 | discrete-sampled/discrete-time-freq<br>discrete-sampled/discretization-methods<br>discrete-sampled/discrete-stability-criteria |
| 7.8 | 采样数据系统理论：提升法、精确离散模型与采样间性能 | sampled-data-systems | ⬜ 骨架（占位页） | grad | theory | 3 | discrete-sampled/discrete-time-systems<br>discrete-sampled/discretization-methods |
| 7.9 | 离散最优控制：DARE、离散 LQR 与动态规划 | discrete-optimal-control | ⬜ 骨架（占位页） | grad | theory | 2 | modern/optimal-control-basics<br>discrete-sampled/discrete-time-systems |
| 7.10 | 事件触发与自触发控制 | event-triggered-control | ⬜ 骨架（占位页） | grad | theory | 5 | discrete-sampled/sampling-period-selection |

## 8. 控制工程实现 (implementation)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 8.1 | 数字PID实现 | digital-pid | 🟨 有正文待审校 | undergrad | impl | 4 | discrete-sampled/discretization-methods<br>discrete-sampled/discrete-stability-criteria |
| 8.2 | PID 工程整定：ZN、Cohen–Coon、继电反馈自整定与实测对比 | pid-engineering-tuning | ⬜ 骨架（占位页） | undergrad | impl | 5 | classic/pid-controller<br>implementation/digital-pid |
| 8.3 | 控制器离散化实战：从连续设计到定点化部署 | controller-discretization-practice | ⬜ 骨架（占位页） | undergrad | impl | 5 | discrete-sampled/discretization-methods<br>implementation/digital-pid |
| 8.4 | 计算机控制系统架构 | computer-control-architecture | 🟨 有正文待审校 | undergrad | impl | 3 | discrete-sampled/discrete-time-freq<br>discrete-sampled/discretization-methods |
| 8.5 | 实时控制实现 | realtime-control | 🟨 有正文待审校 | undergrad | impl | 5 | discrete-sampled/sampling-period-selection<br>implementation/computer-control-architecture<br>implementation/digital-pid |
| 8.6 | 嵌入式实现：定点 / 浮点、数值精度、DMA 与驱动 | embedded-implementation | ⬜ 骨架（占位页） | undergrad | impl | 6 | discrete-sampled/discrete-time-freq<br>implementation/realtime-control |
| 8.7 | 网络控制系统 NCS——延迟、丢包、带宽与时钟同步 | networked-control | ⬜ 骨架（占位页） | grad | impl | 6 | implementation/computer-control-architecture<br>implementation/realtime-control |
| 8.8 | 工业总线与协议——CAN / EtherCAT / Modbus / PROFINET 的控制视角 | industrial-bus-protocols | ⬜ 骨架（占位页） | undergrad | impl | 4 | implementation/computer-control-architecture |
| 8.9 | 半实物仿真、快速原型与自动代码生成 | hil-rapid-prototyping | ⬜ 骨架（占位页） | grad | impl | 7 | implementation/embedded-implementation<br>implementation/controller-discretization-practice |
| 8.10 | 实现综合案例：同一控制器在 MCU / SoC / PLC 三种平台的移植与实测 | implementation-case-study | ⬜ 骨架（占位页） | grad | impl | 7 | implementation/embedded-implementation<br>implementation/realtime-control<br>implementation/digital-pid |

## 9. 预测控制 (mpc)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 9.1 | 模型预测控制原理 | mpc-principle | 🟨 有正文待审校 | — | — | 0 | — |
| 9.2 | 预测模型建立 | prediction-model | 🟨 有正文待审校 | — | — | 0 | — |
| 9.3 | 滚动优化策略 | receding-horizon | 🟨 有正文待审校 | — | — | 0 | — |
| 9.4 | 约束处理 | constraint-handling | 🟨 有正文待审校 | — | — | 0 | — |
| 9.5 | MPC实现案例 | mpc-case-study | 🟨 有正文待审校 | — | — | 0 | — |
| 9.6 | 广义预测控制(GPC) | generalized-predictive-control | 🟨 有正文待审校 | — | — | 0 | — |
| 9.7 | 非线性MPC | nonlinear-mpc | 🟨 有正文待审校 | — | — | 0 | — |
| 9.8 | 分布式MPC | distributed-mpc | 🟨 有正文待审校 | — | — | 0 | — |

## 10. 鲁棒控制 (robust)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 10.1 | 鲁棒性概念 | robustness-concept | 🟨 有正文待审校 | — | — | 0 | — |
| 10.2 | H∞控制基础 | h-infinity-basics | 🟨 有正文待审校 | — | — | 0 | — |
| 10.3 | 混合灵敏度设计 | mixed-sensitivity | 🟨 有正文待审校 | — | — | 0 | — |
| 10.4 | μ综合方法 | mu-synthesis | 🟨 有正文待审校 | — | — | 0 | — |
| 10.5 | 鲁棒稳定性分析 | robust-stability | 🟨 有正文待审校 | — | — | 0 | — |
| 10.6 | 不确定性建模 | uncertainty-modeling | 🟨 有正文待审校 | — | — | 0 | — |
| 10.7 | 鲁棒性能指标 | robust-performance | 🟨 有正文待审校 | — | — | 0 | — |
| 10.8 | 鲁棒控制综合案例 | robust-case-study | 🟨 有正文待审校 | — | — | 0 | — |

## 11. 系统辨识与数据驱动建模 (identification)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 11.1 | 辨识问题框架：模型集、准则与验证 | identification-framework | ⬜ 骨架（占位页） | undergrad | theory | 1 | math/probability-basics<br>modern/state-space |
| 11.2 | 最小二乘与递推最小二乘 | least-squares-rls | ⬜ 骨架（占位页） | undergrad | theory | 2 | estimation/least-squares-ml<br>nonlinear/adaptive-control-basics |
| 11.3 | 持久激励条件与参数可辨识性 | persistent-excitation | ⬜ 骨架（占位页） | grad | theory | 3 | identification/least-squares-rls<br>math/linear-algebra-basics |
| 11.4 | 模型族：ARX / ARMAX / OE / BJ 与状态空间模型 | model-structures | ⬜ 骨架（占位页） | grad | theory | 3 | discrete-sampled/difference-equation<br>math/z-transform |
| 11.5 | 工具变量法与闭环辨识 | instrumental-variable | ⬜ 骨架（占位页） | grad | theory | 3 | identification/least-squares-rls<br>classic/pid-controller |
| 11.6 | 频域辨识与谱分析（含实测扫频、窗函数与噪声抑制） | frequency-domain-id | ⬜ 骨架（占位页） | grad | theory | 2 | math/fourier-analysis<br>classic/frequency-response-design |
| 11.7 | 子空间辨识 N4SID / MOESP | subspace-id | ⬜ 骨架（占位页） | advanced | theory | 4 | identification/model-structures<br>math/matrix-decomposition |
| 11.8 | 非线性与灰盒辨识、神经网络辨识、符号回归 | nonlinear-data-driven-id | ⬜ 骨架（占位页） | advanced | frontier | 1 | nonlinear/nonlinear-characteristics<br>intelligent/neural-network-control |
| 11.9 | 辨识综合案例：从实测数据到可用于 MPC 的模型（含阶次选择与残差检验） | identification-case-study | ⬜ 骨架（占位页） | grad | case | 4 | identification/model-structures<br>identification/persistent-excitation<br>mpc/prediction-model |

## 12. 智能控制 (intelligent)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 12.1 | 模糊控制基础 | fuzzy-control-basics | ✅ 已交付 v1.3 | — | — | 0 | — |
| 12.2 | 模糊控制器设计 | fuzzy-controller-design | ✅ 已交付 v1.3 | — | — | 0 | — |
| 12.3 | 神经网络控制 | neural-network-control | ✅ 已交付 v1.3 | — | — | 0 | — |
| 12.4 | 专家控制系统 | expert-system | ⬜ 骨架（占位页） | — | — | 0 | — |
| 12.5 | 遗传算法优化 | genetic-algorithm | ⬜ 骨架（占位页） | — | — | 0 | — |
| 12.6 | 模糊神经网络 | fuzzy-neural-network | ⬜ 骨架（占位页） | — | — | 0 | — |
| 12.7 | 智能控制综合案例 | intelligent-case-study | ⬜ 骨架（占位页） | — | — | 0 | — |

## 13. 强化学习控制 (rl-control)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 13.1 | 强化学习基础 | rl-basics | ⬜ 骨架（占位页） | — | — | 0 | — |
| 13.2 | Q-learning算法 | q-learning | ⬜ 骨架（占位页） | — | — | 0 | — |
| 13.3 | 深度Q网络(DQN) | dqn | ⬜ 骨架（占位页） | — | — | 0 | — |
| 13.4 | 策略梯度方法 | policy-gradient | ⬜ 骨架（占位页） | — | — | 0 | — |
| 13.5 | Actor-Critic架构 | actor-critic | ⬜ 骨架（占位页） | — | — | 0 | — |
| 13.6 | RL控制应用案例 | rl-control-case | ⬜ 骨架（占位页） | — | — | 0 | — |
| 13.7 | 安全强化学习 | safe-rl | ⬜ 骨架（占位页） | — | — | 0 | — |
| 13.8 | 多智能体RL | multi-agent-rl | ⬜ 骨架（占位页） | — | — | 0 | — |

## 14. 多智能体控制 (multi-agent)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 14.1 | 多智能体系统概述 | multi-agent-overview | ⬜ 骨架（占位页） | — | — | 0 | — |
| 14.2 | 一致性控制 | consensus-control | ⬜ 骨架（占位页） | — | — | 0 | — |
| 14.3 | 编队控制 | formation-control | ⬜ 骨架（占位页） | — | — | 0 | — |
| 14.4 | 分布式优化 | distributed-optimization | ⬜ 骨架（占位页） | — | — | 0 | — |
| 14.5 | 博弈论基础 | game-theory-basics | ⬜ 骨架（占位页） | — | — | 0 | — |
| 14.6 | 多智能体协同案例 | multi-agent-cooperation | ⬜ 骨架（占位页） | — | — | 0 | — |
| 14.7 | 分布式估计 | distributed-estimation | ⬜ 骨架（占位页） | — | — | 0 | — |
| 14.8 | 多智能体RL | multi-agent-rl | ⬜ 骨架（占位页） | — | — | 0 | — |

## 15. 安全、容错与认证控制 (safety-ftc)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 15.1 | 控制安全概论：失效模式、危害分析（HAZOP/FMEA）与安全目标 | safety-overview | ⬜ 骨架（占位页） | undergrad | theory | 4 | classic/stability-analysis<br>implementation/computer-control-architecture |
| 15.2 | 控制屏障函数 CBF：安全集不变性与 CBF-QP | control-barrier-functions | ⬜ 骨架（占位页） | grad | theory | 2 | nonlinear/lyapunov-stability<br>math/convex-optimization |
| 15.3 | 可达性分析与形式化验证（Hamilton–Jacobi 可达性、区间方法、zonotope） | reachability-analysis | ⬜ 骨架（占位页） | advanced | frontier | 3 | nonlinear/lyapunov-stability<br>math/variational-dp |
| 15.4 | 故障检测与诊断 FDI：残差生成、观测器组与统计检验 | fault-detection-isolation | ⬜ 骨架（占位页） | grad | theory | 3 | modern/state-observer<br>estimation/kalman-filter |
| 15.5 | 容错控制 FTC：被动 / 主动容错与控制重构 | fault-tolerant-control | ⬜ 骨架（占位页） | grad | theory | 4 | safety-ftc/fault-detection-isolation<br>modern/state-feedback |
| 15.6 | 功能安全标准：ISO 26262 / IEC 61508 / DO-178C 的控制视角 | functional-safety-standards | ⬜ 骨架（占位页） | undergrad | impl | 7 | safety-ftc/safety-overview<br>implementation/embedded-implementation |
| 15.7 | 安全强化学习 | safe-rl | ⬜ 骨架（占位页） | advanced | learning | 3 | rl-control/policy-gradient<br>safety-ftc/control-barrier-functions<br>math/convex-optimization |
| 15.8 | 安全综合案例：从危害分析到 CBF 护栏到认证证据的完整链路 | safety-case-study | ⬜ 骨架（占位页） | grad | case | 8 | safety-ftc/control-barrier-functions<br>safety-ftc/fault-tolerant-control<br>safety-ftc/functional-safety-standards |

## 16. 控制应用专题 (applications)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 16.1 | 自动驾驶纵向与横向控制 | auto-driving-control | ⬜ 骨架（占位页） | grad | case | 1 | classic/pid-controller<br>modern/state-feedback<br>mpc/mpc-principle |
| 16.2 | 工业机器人与协作机器人控制 | robotics-control | ⬜ 骨架（占位页） | grad | case | 1 | nonlinear/feedback-linearization<br>modern/state-feedback |
| 16.3 | 电力电子与并网逆变器控制 | power-electronics | ⬜ 骨架（占位页） | grad | case | 5 | classic/frequency-response-design<br>discrete-sampled/sampling-period-selection<br>implementation/digital-pid |
| 16.4 | 化工过程与精馏塔控制 | process-control | ⬜ 骨架（占位页） | grad | case | 6 | classic/compensator-design<br>mpc/constraint-handling<br>implementation/pid-engineering-tuning |
| 16.5 | 航空航天与姿态控制 | aerospace-attitude | ⬜ 骨架（占位页） | grad | case | 2 | modern/state-feedback<br>nonlinear/sliding-mode-control<br>math/eigen-decomposition |
| 16.6 | 新能源、储能与微电网控制 | energy-storage-microgrid | ⬜ 骨架（占位页） | grad | case | 6 | applications/power-electronics<br>multi-agent/consensus-control |
| 16.7 | 生物医学控制：药物输注、假肢与手术机器人 | biomedical-control | ⬜ 骨架（占位页） | grad | case | 3 | classic/time-domain-analysis<br>estimation/kalman-filter<br>identification/identification-framework |
| 16.8 | 半导体制造装备控制：光刻机双工件台与纳米定位 | semiconductor-equipment | ⬜ 骨架（占位页） | grad | case | 6 | classic/frequency-response-design<br>nonlinear/nonlinear-characteristics<br>implementation/realtime-control |

---

## 统计

- **总章节数**: 16
- **总模块数**: 141
- **已交付 v1.3**: 29（status = v1.3）
- **有正文待审校**: 27（status = draft，已完成初稿但未做 v1.3 可视化重构）
- **骨架占位**: 85（status = empty，渲染占位页）
- **无 status 字段**: 0
- **未完成 v1.3**: 112（= draft 27 + empty 85 + 无 status 0）
- **有 MDX 正文**: 56
- **catalog 小节总数**: 614
- **讨论日志**: 21 篇（覆盖 21 门；有 MDX 无日志 35 门）
- **交互组件**: 47 个文件（被正文引用 45，孤儿 2）
- **prereq 边**: 148 条（环 0 · 悬空 0 · 前向 10 = 导论豁免 6 + 白名单命中 4 · 章内倒置 2 · 孤儿课 30）
- **prereq 覆盖率**: 69 / 141 门登记了前置；零 prereq 边的章 7 个（modern、nonlinear、mpc、robust、intelligent、rl-control、multi-agent）
- **拓扑层级**: 0..8（表中「拓扑层级」= 最长前置链长度，0 表示无需前置即可开读；逐课层级也可用 `npm run check -- --topo` 打印）

