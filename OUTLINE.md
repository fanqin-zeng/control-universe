# 控制宇宙 - 课程大纲

> **本文件由 `npm run check -- --fix-outline` 自动生成，请勿手工编辑。**
> 唯一权威数据源：`content/catalog.ts`；核对脚本：`scripts/check-catalog.mjs`。
> 生成日期：2026-10-24

## 1. 控制导论 (introduction)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 1.1 | 反馈为什么有效 | why-feedback-works | ⬜ 骨架（占位页） | undergrad | history | 6 | classic/transfer-function |
| 1.2 | 控制理论地图 | control-landscape | ⬜ 骨架（占位页） | undergrad | history | 0 | — |
| 1.3 | 控制方法选型 | controller-selection-guide | ⬜ 骨架（占位页） | grad | history | 16 | introduction/why-feedback-works<br>introduction/control-landscape<br>classic/pid-controller<br>modern/state-feedback<br>mpc/mpc-principle<br>robust/h-infinity-basics<br>rl-control/rl-basics |

## 2. 数学基础 (math)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 2.1 | 微积分入门 | calculus-basics | ✅ 已交付 v1.3 | undergrad | math | 0 | — |
| 2.2 | 复数基础 | complex-numbers | ✅ 已交付 v1.3 | undergrad | math | 1 | math/calculus-basics |
| 2.3 | 线性代数基础 | linear-algebra-basics | ✅ 已交付 v1.3 | undergrad | math | 0 | — |
| 2.4 | 特征值与对角化 | eigen-decomposition | ✅ 已交付 v1.3 | undergrad | math | 2 | math/linear-algebra-basics<br>math/complex-numbers |
| 2.5 | 矩阵分解 | matrix-decomposition | ✅ 已交付 v1.3 | undergrad | math | 3 | math/eigen-decomposition |
| 2.6 | 多元微积分 | multivariable-calculus | ✅ 已交付 v1.3 | undergrad | math | 1 | math/calculus-basics<br>math/linear-algebra-basics |
| 2.7 | 微分方程与矩阵指数 | ode-matrix-exponential | ✅ 已交付 v1.3 | undergrad | math | 3 | math/calculus-basics<br>math/complex-numbers<br>math/eigen-decomposition |
| 2.8 | 拉普拉斯变换 | laplace-transform | ✅ 已交付 v1.3 | undergrad | math | 4 | math/calculus-basics<br>math/complex-numbers<br>math/ode-matrix-exponential |
| 2.9 | 傅里叶分析 | fourier-analysis | ✅ 已交付 v1.3 | undergrad | math | 2 | math/calculus-basics<br>math/complex-numbers |
| 2.10 | Z变换 | z-transform | ✅ 已交付 v1.3 | undergrad | math | 5 | math/laplace-transform |
| 2.11 | 概率基础 | probability-basics | ✅ 已交付 v1.3 | undergrad | math | 1 | math/calculus-basics |
| 2.12 | 随机过程 | stochastic-processes | ✅ 已交付 v1.3 | grad | math | 3 | math/probability-basics<br>math/linear-algebra-basics<br>math/fourier-analysis |
| 2.13 | 凸优化 | convex-optimization | ✅ 已交付 v1.3 | grad | math | 4 | math/matrix-decomposition<br>math/multivariable-calculus |
| 2.14 | 变分法与动态规划 | variational-dp | ✅ 已交付 v1.3 | grad | math | 5 | math/multivariable-calculus<br>math/ode-matrix-exponential<br>math/convex-optimization |
| 2.15 | 微分几何入门 | diff-geometry | ✅ 已交付 v1.3 | grad | math | 4 | math/multivariable-calculus<br>math/ode-matrix-exponential |
| 2.16 | 图论基础 | graph-theory | ✅ 已交付 v1.3 | undergrad | math | 4 | math/eigen-decomposition<br>math/ode-matrix-exponential |
| 2.17 | 博弈论基础 | game-theory-math | ✅ 已交付 v1.3 | grad | math | 5 | math/convex-optimization<br>math/probability-basics |
| 2.18 | 数值方法 | numerical-methods | ✅ 已交付 v1.3 | undergrad | math | 4 | math/matrix-decomposition<br>math/multivariable-calculus<br>math/ode-matrix-exponential |

## 3. 经典控制 (classic)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 3.1 | 系统建模 | system-modeling | ✅ 已交付 v1.3 | undergrad | theory | 4 | math/ode-matrix-exponential<br>math/multivariable-calculus |
| 3.2 | 传递函数 | transfer-function | ✅ 已交付 v1.3 | undergrad | theory | 5 | classic/system-modeling<br>math/laplace-transform |
| 3.3 | 时域分析 | time-domain-analysis | ✅ 已交付 v1.3 | undergrad | theory | 6 | classic/transfer-function |
| 3.4 | 系统稳定性 | stability-analysis | ✅ 已交付 v1.3 | undergrad | theory | 7 | classic/time-domain-analysis |
| 3.5 | 频域分析 | frequency-domain-analysis | ✅ 已交付 v1.3 | undergrad | theory | 6 | classic/transfer-function<br>math/fourier-analysis |
| 3.6 | 根轨迹 | root-locus | ✅ 已交付 v1.3 | undergrad | theory | 8 | classic/stability-analysis |
| 3.7 | PID控制 | pid-controller | ✅ 已交付 v1.3 | undergrad | theory | 8 | classic/time-domain-analysis<br>classic/stability-analysis |
| 3.8 | 校正网络 | compensator-design | ✅ 已交付 v1.3 | undergrad | theory | 9 | classic/frequency-domain-analysis<br>classic/root-locus |
| 3.9 | 回路整形 | frequency-response-design | ✅ 已交付 v1.3 | undergrad | theory | 10 | classic/frequency-domain-analysis<br>classic/compensator-design |
| 3.10 | 设计方法选型 | design-methods-comparison | ✅ 已交付 v1.3 | undergrad | theory | 11 | classic/pid-controller<br>classic/compensator-design<br>classic/frequency-response-design |
| 3.11 | 经典控制案例 | classic-case-study | ✅ 已交付 v1.3 | undergrad | case | 11 | classic/system-modeling<br>classic/pid-controller<br>classic/frequency-response-design |

## 4. 现代控制 (modern)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 4.1 | 状态空间 | state-space | ✅ 已交付 v1.3 | undergrad | theory | 6 | math/ode-matrix-exponential<br>classic/transfer-function |
| 4.2 | 可控性与可观性 | controllability-observability | ✅ 已交付 v1.3 | undergrad | theory | 7 | modern/state-space<br>math/matrix-decomposition |
| 4.3 | 线性系统稳定性 | lyapunov-modern | ✅ 已交付 v1.3 | undergrad | theory | 8 | modern/state-space<br>modern/controllability-observability<br>math/matrix-decomposition |
| 4.4 | 状态反馈 | state-feedback | ✅ 已交付 v1.3 | undergrad | theory | 9 | modern/controllability-observability<br>modern/lyapunov-modern |
| 4.5 | 状态观测器 | state-observer | ✅ 已交付 v1.3 | undergrad | theory | 10 | modern/controllability-observability<br>modern/state-feedback |
| 4.6 | 最优控制 | optimal-control-basics | ✅ 已交付 v1.3 | grad | theory | 7 | modern/state-space<br>math/variational-dp<br>math/convex-optimization |
| 4.7 | LQR控制 | lqr-controller | ✅ 已交付 v1.3 | grad | theory | 9 | modern/optimal-control-basics<br>modern/lyapunov-modern |
| 4.8 | 多变量系统 | multivariable-systems | ✅ 已交付 v1.3 | grad | theory | 7 | modern/state-space<br>classic/frequency-domain-analysis<br>math/matrix-decomposition |
| 4.9 | 现代控制案例 | modern-case-study | ✅ 已交付 v1.3 | grad | case | 11 | modern/state-feedback<br>modern/state-observer<br>modern/lqr-controller<br>modern/multivariable-systems |

## 5. 非线性控制 (nonlinear)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 5.1 | 非线性系统 | nonlinear-characteristics | ✅ 已交付 v1.3 | undergrad | theory | 7 | modern/state-space<br>math/ode-matrix-exponential |
| 5.2 | 相平面 | phase-plane | ✅ 已交付 v1.3 | undergrad | theory | 8 | nonlinear/nonlinear-characteristics<br>math/eigen-decomposition |
| 5.3 | Lyapunov稳定性 | lyapunov-stability | ✅ 已交付 v1.3 | grad | theory | 9 | nonlinear/phase-plane<br>modern/lyapunov-modern<br>math/multivariable-calculus |
| 5.4 | 描述函数 | describing-function | ✅ 已交付 v1.3 | grad | theory | 10 | nonlinear/nonlinear-characteristics<br>math/fourier-analysis<br>nonlinear/lyapunov-stability<br>classic/frequency-domain-analysis |
| 5.5 | 反馈线性化 | feedback-linearization | ✅ 已交付 v1.3 | grad | theory | 10 | nonlinear/lyapunov-stability<br>math/diff-geometry<br>modern/state-feedback |
| 5.6 | 滑模控制 | sliding-mode-control | ✅ 已交付 v1.3 | grad | theory | 10 | nonlinear/lyapunov-stability |
| 5.7 | 反步设计 | backstepping | ✅ 已交付 v1.3 | grad | theory | 10 | nonlinear/lyapunov-stability<br>math/multivariable-calculus |
| 5.8 | 自适应控制 | adaptive-control-basics | ✅ 已交付 v1.3 | grad | theory | 10 | nonlinear/lyapunov-stability<br>modern/state-feedback |
| 5.9 | 无源控制 | passivity-control | ✅ 已交付 v1.3 | grad | theory | 10 | nonlinear/lyapunov-stability<br>modern/multivariable-systems |
| 5.10 | 输入状态稳定性 | iss-small-gain | ✅ 已交付 v1.3 | grad | theory | 10 | nonlinear/lyapunov-stability<br>classic/frequency-domain-analysis |
| 5.11 | 切换与混杂系统 | switched-hybrid-systems | ✅ 已交付 v1.3 | grad | theory | 10 | nonlinear/lyapunov-stability |
| 5.12 | 分岔与混沌 | bifurcation-chaos | ✅ 已交付 v1.3 | grad | theory | 9 | nonlinear/phase-plane<br>math/numerical-methods |

## 6. 离散控制 (discrete-sampled)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 6.1 | 采样与量化 | discrete-time-freq | ✅ 已交付 v1.3 | undergrad | theory | 7 | classic/frequency-domain-analysis<br>math/fourier-analysis |
| 6.2 | 离散时间系统 | discrete-time-systems | ✅ 已交付 v1.3 | undergrad | theory | 8 | discrete-sampled/discrete-time-freq<br>modern/state-space<br>math/z-transform |
| 6.3 | 差分方程 | difference-equation | ✅ 已交付 v1.3 | undergrad | math | 9 | discrete-sampled/discrete-time-systems<br>math/z-transform |
| 6.4 | Z域系统分析 | z-transform-analysis | ✅ 已交付 v1.3 | undergrad | theory | 10 | discrete-sampled/discrete-time-freq<br>discrete-sampled/difference-equation<br>classic/transfer-function |
| 6.5 | 离散系统稳定性 | discrete-stability-criteria | ✅ 已交付 v1.3 | undergrad | theory | 11 | discrete-sampled/z-transform-analysis<br>modern/lyapunov-modern |
| 6.6 | 离散化方法 | discretization-methods | ✅ 已交付 v1.3 | undergrad | theory | 11 | discrete-sampled/discrete-time-freq<br>discrete-sampled/discrete-time-systems<br>math/numerical-methods<br>discrete-sampled/z-transform-analysis |
| 6.7 | 采样周期 | sampling-period-selection | ✅ 已交付 v1.3 | undergrad | impl | 12 | discrete-sampled/discrete-stability-criteria<br>discrete-sampled/discretization-methods |
| 6.8 | 采样数据系统 | sampled-data-systems | ✅ 已交付 v1.3 | grad | theory | 13 | discrete-sampled/discretization-methods<br>discrete-sampled/sampling-period-selection |
| 6.9 | 离散最优控制 | discrete-optimal-control | ✅ 已交付 v1.3 | grad | theory | 12 | discrete-sampled/discrete-stability-criteria<br>modern/lqr-controller |
| 6.10 | 事件触发控制 | event-triggered-control | ✅ 已交付 v1.3 | grad | theory | 14 | discrete-sampled/sampled-data-systems<br>nonlinear/lyapunov-stability |

## 7. 控制实现 (implementation)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 7.1 | 控制系统架构 | computer-control-architecture | ✅ 已交付 v1.3 | undergrad | impl | 12 | discrete-sampled/discrete-time-freq<br>modern/state-space<br>discrete-sampled/discretization-methods |
| 7.2 | 数字PID | digital-pid | ✅ 已交付 v1.3 | undergrad | impl | 13 | classic/pid-controller<br>discrete-sampled/discretization-methods<br>implementation/computer-control-architecture<br>discrete-sampled/discrete-stability-criteria |
| 7.3 | PID工程整定 | pid-engineering-tuning | ⬜ 骨架（占位页） | undergrad | impl | 14 | implementation/digital-pid<br>classic/time-domain-analysis |
| 7.4 | 控制器部署 | controller-discretization-practice | ⬜ 骨架（占位页） | undergrad | impl | 14 | discrete-sampled/discretization-methods<br>implementation/computer-control-architecture<br>math/numerical-methods<br>implementation/digital-pid |
| 7.5 | 嵌入式控制 | embedded-implementation | ⬜ 骨架（占位页） | undergrad | impl | 15 | implementation/controller-discretization-practice |
| 7.6 | 实时控制 | realtime-control | 🟨 有正文待审校 | undergrad | impl | 16 | implementation/embedded-implementation<br>discrete-sampled/sampling-period-selection |
| 7.7 | 网络控制 | networked-control | ⬜ 骨架（占位页） | grad | impl | 17 | implementation/realtime-control<br>discrete-sampled/sampled-data-systems |
| 7.8 | 工业通信 | industrial-bus-protocols | ⬜ 骨架（占位页） | undergrad | impl | 17 | implementation/computer-control-architecture<br>implementation/realtime-control |
| 7.9 | 半实物仿真 | hil-rapid-prototyping | ⬜ 骨架（占位页） | undergrad | impl | 17 | implementation/controller-discretization-practice<br>implementation/realtime-control |
| 7.10 | 控制实现案例 | implementation-case-study | ⬜ 骨架（占位页） | undergrad | case | 18 | implementation/pid-engineering-tuning<br>implementation/industrial-bus-protocols<br>implementation/hil-rapid-prototyping |

## 8. 机器学习 (machine-learning)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 8.1 | 学习问题与泛化 | learning-problem | ✅ 已交付 v1.3 | undergrad | learning | 2 | math/probability-basics<br>math/linear-algebra-basics |
| 8.2 | 监督学习 | supervised-learning | ✅ 已交付 v1.3 | undergrad | learning | 5 | machine-learning/learning-problem<br>math/convex-optimization |
| 8.3 | 神经网络基础 | neural-networks | ⬜ 骨架（占位页） | undergrad | learning | 6 | machine-learning/supervised-learning<br>math/multivariable-calculus |
| 8.4 | 自动微分与训练 | autodiff-optimization | ⬜ 骨架（占位页） | undergrad | learning | 7 | machine-learning/neural-networks<br>math/numerical-methods |
| 8.5 | 时序模型 | sequence-models | ⬜ 骨架（占位页） | grad | learning | 8 | machine-learning/autodiff-optimization<br>math/stochastic-processes |
| 8.6 | 注意力机制 | attention-transformers | ⬜ 骨架（占位页） | grad | learning | 9 | machine-learning/sequence-models |
| 8.7 | 表征学习 | representation-learning | ⬜ 骨架（占位页） | grad | learning | 10 | machine-learning/autodiff-optimization<br>machine-learning/attention-transformers |
| 8.8 | 扩散与流匹配 | generative-models | ⬜ 骨架（占位页） | grad | learning | 8 | machine-learning/autodiff-optimization<br>math/stochastic-processes<br>math/ode-matrix-exponential |
| 8.9 | 学习实验评估 | learning-evaluation | ⬜ 骨架（占位页） | undergrad | learning | 6 | machine-learning/supervised-learning<br>math/probability-basics |

## 9. 系统辨识 (identification)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 9.1 | 系统辨识框架 | identification-framework | ✅ 已交付 v1.3 | undergrad | theory | 9 | discrete-sampled/discrete-time-systems<br>math/probability-basics |
| 9.2 | 辨识模型 | model-structures | ✅ 已交付 v1.3 | undergrad | theory | 10 | identification/identification-framework<br>discrete-sampled/difference-equation |
| 9.3 | 最小二乘辨识 | least-squares-rls | ⬜ 骨架（占位页） | undergrad | theory | 11 | identification/model-structures<br>math/matrix-decomposition<br>math/probability-basics |
| 9.4 | 持久激励 | persistent-excitation | ⬜ 骨架（占位页） | grad | theory | 12 | identification/least-squares-rls |
| 9.5 | 闭环辨识 | instrumental-variable | ⬜ 骨架（占位页） | grad | theory | 13 | identification/persistent-excitation<br>classic/transfer-function<br>math/stochastic-processes<br>classic/pid-controller |
| 9.6 | 频域辨识 | frequency-domain-id | ⬜ 骨架（占位页） | grad | theory | 11 | identification/model-structures<br>classic/frequency-domain-analysis<br>math/stochastic-processes<br>classic/frequency-response-design |
| 9.7 | 子空间辨识 | subspace-id | ⬜ 骨架（占位页） | grad | theory | 12 | identification/least-squares-rls<br>modern/controllability-observability<br>math/matrix-decomposition |
| 9.8 | 非线性辨识 | nonlinear-data-driven-id | ⬜ 骨架（占位页） | grad | learning | 13 | identification/persistent-excitation<br>machine-learning/autodiff-optimization<br>machine-learning/sequence-models<br>nonlinear/nonlinear-characteristics |
| 9.9 | 系统辨识案例 | identification-case-study | ⬜ 骨架（占位页） | grad | case | 14 | identification/instrumental-variable<br>identification/frequency-domain-id<br>machine-learning/learning-evaluation |

## 10. 状态估计 (estimation)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 10.1 | 状态估计框架 | estimation-problem | ✅ 已交付 v1.3 | undergrad | theory | 11 | modern/state-observer<br>math/stochastic-processes<br>discrete-sampled/discrete-time-systems |
| 10.2 | 统计估计 | least-squares-ml | ✅ 已交付 v1.3 | grad | theory | 12 | estimation/estimation-problem<br>math/convex-optimization<br>math/probability-basics |
| 10.3 | 卡尔曼滤波 | kalman-filter | 🟨 有正文待审校 | grad | theory | 13 | estimation/least-squares-ml<br>modern/controllability-observability<br>math/stochastic-processes |
| 10.4 | 扩展卡尔曼滤波 | extended-kalman-filter | ⬜ 骨架（占位页） | grad | theory | 14 | estimation/kalman-filter<br>math/multivariable-calculus<br>nonlinear/lyapunov-stability |
| 10.5 | 无迹卡尔曼滤波 | unscented-kalman-filter | ⬜ 骨架（占位页） | grad | theory | 14 | estimation/kalman-filter<br>math/probability-basics |
| 10.6 | 粒子滤波 | particle-filter | ⬜ 骨架（占位页） | grad | theory | 12 | estimation/estimation-problem<br>math/stochastic-processes<br>math/numerical-methods |
| 10.7 | 多传感器融合 | sensor-fusion | ⬜ 骨架（占位页） | grad | theory | 15 | estimation/kalman-filter<br>estimation/extended-kalman-filter |
| 10.8 | 状态估计案例 | estimation-case-study | ⬜ 骨架（占位页） | grad | case | 16 | estimation/sensor-fusion<br>estimation/particle-filter |

## 11. 鲁棒控制 (robust)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 11.1 | 鲁棒性 | robustness-concept | ✅ 已交付 v1.3 | grad | theory | 11 | classic/frequency-response-design<br>modern/state-space<br>modern/lqr-controller |
| 11.2 | 不确定性建模 | uncertainty-modeling | 🟨 有正文待审校 | grad | theory | 12 | robust/robustness-concept<br>math/matrix-decomposition |
| 11.3 | 鲁棒稳定性 | robust-stability | 🟨 有正文待审校 | grad | theory | 13 | robust/uncertainty-modeling<br>nonlinear/iss-small-gain |
| 11.4 | 鲁棒性能 | robust-performance | 🟨 有正文待审校 | grad | theory | 14 | robust/robust-stability<br>classic/frequency-domain-analysis |
| 11.5 | H∞控制 | h-infinity-basics | 🟨 有正文待审校 | grad | theory | 15 | robust/robust-performance<br>modern/lqr-controller<br>math/convex-optimization |
| 11.6 | 混合灵敏度 | mixed-sensitivity | 🟨 有正文待审校 | grad | theory | 16 | robust/h-infinity-basics<br>classic/frequency-response-design |
| 11.7 | 结构奇异值 | mu-analysis | ⬜ 骨架（占位页） | advanced | theory | 15 | robust/uncertainty-modeling<br>robust/robust-performance<br>math/matrix-decomposition |
| 11.8 | μ综合 | mu-synthesis | 🟨 有正文待审校 | advanced | theory | 16 | robust/mu-analysis<br>robust/h-infinity-basics |
| 11.9 | H∞滤波 | h-infinity-filter | ⬜ 骨架（占位页） | grad | theory | 16 | robust/h-infinity-basics<br>estimation/kalman-filter |
| 11.10 | 时滞系统控制 | delay-robust-control | ⬜ 骨架（占位页） | advanced | theory | 14 | robust/robust-stability<br>nonlinear/lyapunov-stability |
| 11.11 | 鲁棒控制案例 | robust-case-study | 🟨 有正文待审校 | grad | case | 17 | robust/mixed-sensitivity<br>robust/mu-synthesis |

## 12. 预测控制 (mpc)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 12.1 | 预测控制原理 | mpc-principle | ✅ 已交付 v1.3 | grad | theory | 13 | discrete-sampled/discrete-optimal-control<br>math/convex-optimization |
| 12.2 | 预测模型 | prediction-model | 🟨 有正文待审校 | grad | theory | 14 | mpc/mpc-principle<br>identification/model-structures |
| 12.3 | 滚动优化 | receding-horizon | 🟨 有正文待审校 | grad | theory | 15 | mpc/prediction-model<br>math/convex-optimization |
| 12.4 | 约束处理 | constraint-handling | 🟨 有正文待审校 | grad | theory | 16 | mpc/receding-horizon |
| 12.5 | 递归可行性与稳定性 | mpc-stability | ⬜ 骨架（占位页） | grad | theory | 17 | mpc/constraint-handling<br>nonlinear/lyapunov-stability |
| 12.6 | 广义预测控制 | generalized-predictive-control | 🟨 有正文待审校 | grad | theory | 16 | mpc/receding-horizon<br>identification/least-squares-rls |
| 12.7 | 显式预测控制 | explicit-mpc | ⬜ 骨架（占位页） | advanced | theory | 17 | mpc/constraint-handling<br>math/convex-optimization |
| 12.8 | 非线性预测控制 | nonlinear-mpc | 🟨 有正文待审校 | advanced | theory | 18 | mpc/mpc-stability<br>nonlinear/nonlinear-characteristics<br>math/numerical-methods |
| 12.9 | 经济预测控制 | economic-mpc | ⬜ 骨架（占位页） | advanced | theory | 19 | mpc/nonlinear-mpc<br>nonlinear/passivity-control |
| 12.10 | 移动水平估计 | mhe-fusion | ⬜ 骨架（占位页） | grad | theory | 16 | mpc/receding-horizon<br>estimation/sensor-fusion |
| 12.11 | 预测控制案例 | mpc-case-study | 🟨 有正文待审校 | grad | case | 17 | mpc/constraint-handling<br>mpc/generalized-predictive-control<br>identification/identification-case-study |

## 13. 智能控制 (intelligent)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 13.1 | 模糊控制 | fuzzy-control-basics | ✅ 已交付 v1.3 | undergrad | theory | 9 | classic/pid-controller<br>nonlinear/nonlinear-characteristics |
| 13.2 | 模糊控制器 | fuzzy-controller-design | ✅ 已交付 v1.3 | undergrad | impl | 10 | intelligent/fuzzy-control-basics |
| 13.3 | 专家控制 | expert-system | ⬜ 骨架（占位页） | undergrad | theory | 10 | intelligent/fuzzy-control-basics |
| 13.4 | 遗传算法 | genetic-algorithm | ⬜ 骨架（占位页） | undergrad | learning | 5 | math/convex-optimization<br>math/probability-basics |
| 13.5 | 神经网络控制 | neural-network-control | ✅ 已交付 v1.3 | grad | learning | 10 | machine-learning/autodiff-optimization<br>nonlinear/lyapunov-stability<br>modern/state-feedback |
| 13.6 | 模糊神经网络 | fuzzy-neural-network | ⬜ 骨架（占位页） | grad | learning | 11 | intelligent/fuzzy-controller-design<br>intelligent/neural-network-control |
| 13.7 | 迭代学习控制 | iterative-learning-control | ⬜ 骨架（占位页） | grad | theory | 12 | discrete-sampled/discrete-stability-criteria<br>modern/state-feedback |
| 13.8 | 智能控制案例 | intelligent-case-study | ⬜ 骨架（占位页） | grad | case | 11 | intelligent/fuzzy-controller-design<br>intelligent/neural-network-control<br>machine-learning/learning-evaluation |

## 14. 强化学习控制基础 (rl-control)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 14.1 | 强化学习问题 | rl-basics | ✅ 已交付 v1.3 | undergrad | learning | 6 | math/stochastic-processes<br>math/variational-dp<br>machine-learning/learning-problem |
| 14.2 | 价值函数与贝尔曼方程 | dynamic-programming | ⬜ 骨架（占位页） | undergrad | learning | 7 | rl-control/rl-basics<br>math/variational-dp |
| 14.3 | Q学习 | q-learning | ⬜ 骨架（占位页） | undergrad | learning | 8 | rl-control/dynamic-programming |
| 14.4 | 深度Q网络 | dqn | ⬜ 骨架（占位页） | grad | learning | 9 | rl-control/q-learning<br>machine-learning/autodiff-optimization |
| 14.5 | 策略梯度 | policy-gradient | ⬜ 骨架（占位页） | grad | learning | 8 | rl-control/dynamic-programming<br>machine-learning/autodiff-optimization |
| 14.6 | 演员评论家方法 | actor-critic | ⬜ 骨架（占位页） | grad | learning | 9 | rl-control/policy-gradient<br>rl-control/q-learning |
| 14.7 | PPO算法 | ppo | ⬜ 骨架（占位页） | grad | learning | 10 | rl-control/actor-critic |
| 14.8 | SAC与TD3 | sac-td3 | ⬜ 骨架（占位页） | grad | learning | 10 | rl-control/actor-critic<br>modern/optimal-control-basics |
| 14.9 | 离线强化学习 | offline-rl | ⬜ 骨架（占位页） | grad | learning | 11 | rl-control/sac-td3<br>machine-learning/learning-evaluation |
| 14.10 | 基于模型的强化学习 | model-based-rl | ⬜ 骨架（占位页） | grad | learning | 16 | rl-control/actor-critic<br>identification/nonlinear-data-driven-id<br>mpc/receding-horizon |
| 14.11 | 强化学习评估 | rl-evaluation | ⬜ 骨架（占位页） | grad | learning | 11 | rl-control/ppo<br>rl-control/sac-td3<br>machine-learning/learning-evaluation |
| 14.12 | 强化学习控制案例 | rl-control-case | ⬜ 骨架（占位页） | grad | case | 17 | rl-control/rl-evaluation<br>discrete-sampled/discrete-optimal-control<br>mpc/constraint-handling |

## 15. 多智能体控制 (multi-agent)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 15.1 | 多智能体系统 | multi-agent-overview | ✅ 已交付 v1.3 | grad | theory | 7 | math/graph-theory<br>modern/state-space |
| 15.2 | 一致性控制 | consensus-control | ⬜ 骨架（占位页） | grad | theory | 9 | multi-agent/multi-agent-overview<br>modern/lyapunov-modern |
| 15.3 | 分布式估计 | distributed-estimation | ⬜ 骨架（占位页） | grad | theory | 14 | multi-agent/consensus-control<br>estimation/kalman-filter |
| 15.4 | 分布式优化 | distributed-optimization | ⬜ 骨架（占位页） | grad | theory | 10 | multi-agent/consensus-control<br>math/convex-optimization |
| 15.5 | 控制中的博弈 | game-theory-basics | ⬜ 骨架（占位页） | grad | theory | 8 | multi-agent/multi-agent-overview<br>math/game-theory-math |
| 15.6 | 编队控制 | formation-control | ⬜ 骨架（占位页） | grad | theory | 10 | multi-agent/consensus-control<br>nonlinear/lyapunov-stability |
| 15.7 | 分布式预测控制 | distributed-mpc | 🟨 有正文待审校 | grad | theory | 18 | multi-agent/distributed-optimization<br>mpc/mpc-stability |
| 15.8 | 多智能体强化学习 | multi-agent-rl | ⬜ 骨架（占位页） | grad | learning | 12 | multi-agent/game-theory-basics<br>rl-control/actor-critic<br>rl-control/rl-evaluation |
| 15.9 | 多智能体协同案例 | multi-agent-cooperation | ⬜ 骨架（占位页） | grad | case | 19 | multi-agent/formation-control<br>multi-agent/distributed-mpc<br>multi-agent/multi-agent-rl |

## 16. 安全控制 (safety-ftc)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 16.1 | 控制安全 | safety-overview | ✅ 已交付 v1.3 | grad | theory | 10 | classic/stability-analysis<br>nonlinear/lyapunov-stability |
| 16.2 | 控制屏障函数 | control-barrier-functions | ⬜ 骨架（占位页） | grad | theory | 11 | safety-ftc/safety-overview<br>math/convex-optimization |
| 16.3 | 可达性分析 | reachability-analysis | ⬜ 骨架（占位页） | advanced | theory | 11 | safety-ftc/safety-overview<br>math/variational-dp |
| 16.4 | 故障诊断 | fault-detection-isolation | ⬜ 骨架（占位页） | grad | theory | 14 | safety-ftc/safety-overview<br>estimation/kalman-filter<br>identification/least-squares-rls |
| 16.5 | 容错控制 | fault-tolerant-control | ⬜ 骨架（占位页） | grad | theory | 15 | safety-ftc/fault-detection-isolation<br>robust/robust-stability |
| 16.6 | 安全强化学习 | safe-rl | ⬜ 骨架（占位页） | grad | learning | 17 | safety-ftc/control-barrier-functions<br>rl-control/rl-evaluation<br>mpc/constraint-handling |
| 16.7 | 功能安全 | functional-safety-standards | ⬜ 骨架（占位页） | grad | history | 16 | safety-ftc/safety-overview<br>implementation/embedded-implementation |
| 16.8 | 安全控制案例 | safety-case-study | ⬜ 骨架（占位页） | grad | case | 17 | safety-ftc/control-barrier-functions<br>safety-ftc/fault-tolerant-control<br>safety-ftc/functional-safety-standards |

## 17. 机器人控制 (robotics)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 17.1 | 机器人系统 | robot-models | ✅ 已交付 v1.3 | undergrad | theory | 7 | modern/state-space |
| 17.2 | 刚体运动 | rigid-body-motion | ⬜ 骨架（占位页） | grad | math | 8 | robotics/robot-models<br>math/diff-geometry |
| 17.3 | 机器人运动学 | kinematics | ⬜ 骨架（占位页） | grad | theory | 9 | robotics/rigid-body-motion<br>math/matrix-decomposition |
| 17.4 | 机器人动力学 | dynamics | ⬜ 骨架（占位页） | grad | theory | 10 | robotics/kinematics<br>math/multivariable-calculus<br>math/ode-matrix-exponential |
| 17.5 | 机器人运动规划 | motion-planning | ⬜ 骨架（占位页） | grad | theory | 10 | robotics/kinematics<br>math/convex-optimization |
| 17.6 | 轨迹跟踪 | trajectory-tracking | ⬜ 骨架（占位页） | grad | theory | 11 | robotics/dynamics<br>robotics/motion-planning<br>nonlinear/feedback-linearization |
| 17.7 | 阻抗控制 | impedance-control | ⬜ 骨架（占位页） | grad | theory | 11 | robotics/dynamics<br>nonlinear/passivity-control |
| 17.8 | 接触控制 | contact-control | ⬜ 骨架（占位页） | grad | theory | 12 | robotics/impedance-control<br>safety-ftc/control-barrier-functions |
| 17.9 | 足式机器人控制 | legged-control | ⬜ 骨架（占位页） | advanced | theory | 19 | robotics/contact-control<br>mpc/nonlinear-mpc |
| 17.10 | 机器人控制案例 | robotics-case-study | ⬜ 骨架（占位页） | grad | case | 16 | robotics/trajectory-tracking<br>robotics/contact-control<br>estimation/sensor-fusion |

## 18. 机器人学习 (robot-learning)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 18.1 | 机器人数据 | robot-data | ✅ 已交付 v1.3 | grad | learning | 3 | machine-learning/learning-problem<br>math/probability-basics |
| 18.2 | 模仿学习 | imitation-learning | ⬜ 骨架（占位页） | grad | learning | 8 | robot-learning/robot-data<br>machine-learning/autodiff-optimization |
| 18.3 | 离线到在线学习 | offline-online-learning | ⬜ 骨架（占位页） | grad | learning | 12 | robot-learning/imitation-learning<br>rl-control/offline-rl |
| 18.4 | 残差学习控制 | residual-learning | ⬜ 骨架（占位页） | grad | learning | 13 | robot-learning/offline-online-learning<br>nonlinear/lyapunov-stability |
| 18.5 | 仿真到现实 | sim-to-real | ⬜ 骨架（占位页） | grad | learning | 13 | robot-learning/offline-online-learning<br>robust/uncertainty-modeling |
| 18.6 | 运动技能学习 | locomotion-learning | ⬜ 骨架（占位页） | grad | learning | 20 | robot-learning/sim-to-real<br>robotics/legged-control<br>rl-control/ppo |
| 18.7 | 操作技能学习 | manipulation-learning | ⬜ 骨架（占位页） | grad | learning | 13 | robot-learning/imitation-learning<br>robotics/contact-control |
| 18.8 | 人机协同学习 | human-in-the-loop | ⬜ 骨架（占位页） | grad | learning | 18 | robot-learning/offline-online-learning<br>safety-ftc/safe-rl |
| 18.9 | 学习与预测控制 | learning-with-mpc | ⬜ 骨架（占位页） | advanced | learning | 19 | robot-learning/residual-learning<br>rl-control/model-based-rl<br>mpc/nonlinear-mpc |
| 18.10 | 机器人学习评估 | robot-learning-evaluation | ⬜ 骨架（占位页） | grad | learning | 19 | robot-learning/sim-to-real<br>robot-learning/human-in-the-loop<br>rl-control/rl-evaluation |

## 19. 具身智能 (embodied)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 19.1 | 具身智能系统 | embodied-systems | ✅ 已交付 v1.3 | grad | frontier | 10 | robot-learning/robot-data<br>machine-learning/attention-transformers |
| 19.2 | 多模态感知 | multimodal-observation | ⬜ 骨架（占位页） | grad | learning | 11 | embodied/embodied-systems<br>machine-learning/representation-learning |
| 19.3 | 动作表示 | action-representations | ⬜ 骨架（占位页） | grad | learning | 12 | embodied/embodied-systems<br>robotics/trajectory-tracking |
| 19.4 | 通用机器人策略 | generalist-policies | ⬜ 骨架（占位页） | grad | frontier | 13 | embodied/multimodal-observation<br>embodied/action-representations<br>robot-learning/imitation-learning |
| 19.5 | 扩散与流策略 | diffusion-flow-policies | ⬜ 骨架（占位页） | grad | learning | 13 | embodied/action-representations<br>machine-learning/generative-models |
| 19.6 | 视觉语言动作模型 | vla | ⬜ 骨架（占位页） | advanced | frontier | 14 | embodied/generalist-policies<br>machine-learning/attention-transformers |
| 19.7 | 世界模型 | world-models | ⬜ 骨架（占位页） | grad | learning | 12 | embodied/multimodal-observation<br>machine-learning/sequence-models<br>machine-learning/generative-models |
| 19.8 | 世界模型控制 | world-model-control | ⬜ 骨架（占位页） | advanced | frontier | 17 | embodied/world-models<br>rl-control/model-based-rl<br>mpc/receding-horizon |
| 19.9 | 分层决策 | hierarchical-reasoning | ⬜ 骨架（占位页） | advanced | frontier | 18 | embodied/vla<br>embodied/world-model-control |
| 19.10 | 具身智能评估 | embodied-evaluation | ⬜ 骨架（占位页） | grad | learning | 20 | embodied/diffusion-flow-policies<br>embodied/hierarchical-reasoning<br>robot-learning/robot-learning-evaluation |

## 20. 自动驾驶 (autonomous-driving)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 20.1 | 自动驾驶系统 | driving-system | ✅ 已交付 v1.3 | undergrad | theory | 7 | modern/state-space |
| 20.2 | 车辆动力学 | vehicle-dynamics | ⬜ 骨架（占位页） | grad | theory | 8 | autonomous-driving/driving-system<br>math/ode-matrix-exponential |
| 20.3 | 定位与运动预测 | localization-prediction | ⬜ 骨架（占位页） | grad | theory | 16 | autonomous-driving/vehicle-dynamics<br>estimation/sensor-fusion<br>machine-learning/sequence-models |
| 20.4 | 自动驾驶规划 | motion-planning | ⬜ 骨架（占位页） | grad | theory | 17 | autonomous-driving/localization-prediction<br>math/convex-optimization |
| 20.5 | 车辆跟踪控制 | vehicle-control | ⬜ 骨架（占位页） | grad | theory | 19 | autonomous-driving/motion-planning<br>mpc/nonlinear-mpc<br>nonlinear/feedback-linearization<br>classic/pid-controller |
| 20.6 | 学习型驾驶策略 | learning-planning | ⬜ 骨架（占位页） | grad | learning | 18 | autonomous-driving/motion-planning<br>robot-learning/imitation-learning<br>machine-learning/attention-transformers |
| 20.7 | 驾驶决策强化学习 | rl-decision | ⬜ 骨架（占位页） | grad | learning | 19 | autonomous-driving/learning-planning<br>rl-control/sac-td3 |
| 20.8 | 驾驶世界模型 | driving-world-models | ⬜ 骨架（占位页） | advanced | frontier | 17 | autonomous-driving/localization-prediction<br>embodied/world-models |
| 20.9 | 驾驶视觉语言动作模型 | driving-vla | ⬜ 骨架（占位页） | advanced | frontier | 19 | autonomous-driving/learning-planning<br>embodied/vla |
| 20.10 | 闭环驾驶评估 | closed-loop-evaluation | ⬜ 骨架（占位页） | grad | learning | 20 | autonomous-driving/vehicle-control<br>autonomous-driving/rl-decision<br>autonomous-driving/driving-world-models<br>autonomous-driving/driving-vla<br>machine-learning/learning-evaluation |
| 20.11 | 驾驶安全与回退 | driving-safety | ⬜ 骨架（占位页） | grad | case | 21 | autonomous-driving/closed-loop-evaluation<br>safety-ftc/reachability-analysis<br>safety-ftc/functional-safety-standards |

## 21. 工程应用 (applications)

| 序号 | 课程 | Slug | 状态 | 难度 | 类型 | 拓扑层级 | 前置依赖 |
|------|------|------|------|------|------|---------|---------|
| 21.1 | 电力电子控制 | power-electronics | ✅ 已交付 v1.3 | grad | case | 13 | classic/pid-controller<br>modern/state-feedback<br>classic/frequency-response-design<br>discrete-sampled/sampling-period-selection |
| 21.2 | 过程控制 | process-control | ⬜ 骨架（占位页） | grad | case | 18 | identification/identification-case-study<br>mpc/mpc-case-study<br>implementation/pid-engineering-tuning |
| 21.3 | 飞行器姿态控制 | aerospace-attitude | ⬜ 骨架（占位页） | grad | case | 16 | modern/lqr-controller<br>nonlinear/feedback-linearization<br>estimation/sensor-fusion<br>nonlinear/sliding-mode-control |
| 21.4 | 微电网控制 | energy-storage-microgrid | ⬜ 骨架（占位页） | grad | case | 20 | mpc/economic-mpc<br>multi-agent/distributed-mpc<br>applications/power-electronics |
| 21.5 | 生物医学控制 | biomedical-control | ⬜ 骨架（占位页） | grad | case | 16 | identification/identification-case-study<br>estimation/sensor-fusion<br>safety-ftc/safety-overview |
| 21.6 | 半导体装备控制 | semiconductor-equipment | ⬜ 骨架（占位页） | grad | case | 17 | classic/frequency-response-design<br>implementation/realtime-control<br>robust/mixed-sensitivity |

---

## 统计

- **总章节数**: 21
- **总模块数**: 205
- **已交付 v1.3**: 81（status = v1.3）
- **有正文待审校**: 16（status = draft，已完成初稿但未做 v1.3 可视化重构）
- **骨架占位**: 108（status = empty，渲染占位页）
- **无 status 字段**: 0
- **未完成 v1.3**: 124（= draft 16 + empty 108 + 无 status 0）
- **有 MDX 正文**: 97
- **catalog 小节总数**: 1083
- **讨论日志**: 103 篇（覆盖 81 门；有 MDX 无日志 16 门）
- **交互组件**: 91 个文件（被正文引用 91，孤儿 0）
- **prereq 边**: 472 条（环 0 · 悬空 0 · 前向 6 = 导论豁免 6 + 白名单命中 0 · 章内倒置 0 · 孤儿课 0）
- **prereq 覆盖率**: 202 / 205 门登记了前置；零 prereq 边的章 0 个
- **拓扑层级**: 0..21（表中「拓扑层级」= 最长前置链长度，0 表示无需前置即可开读；逐课层级也可用 `npm run check -- --topo` 打印）

