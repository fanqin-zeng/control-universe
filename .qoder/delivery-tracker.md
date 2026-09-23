# Wiki 交付记录

> 本文件记录各章节课程的交付状态。Phase 4 完成后，郑核负责在对应课程打勾。

---

## v1.3 交付专题

**版本特点**：
- 引入"可视化双轨制"：代码演示用 JupyterNotebook（静态出图），交互探索用 React 组件（ECharts）
- 废弃 ipywidgets 方案（轻量级 Jupyter 服务器不支持 widget 渲染）
- 新增 `useECharts` hook 和交互组件模板
- 交互组件设计规范：固定坐标轴、禁用动画、支持多种控件类型

**Checklist 说明**：
- `[x]` = 已完成（按 v1.3 标准审校）
- `[ ]` = 待完成

---

### 数学基础 (math)

| 课程 | 状态 |
|------|------|
| [ ] 复数基础 (complex-numbers) | |

### 经典控制 (classic)

| 课程 | 状态 |
|------|------|
| [x] 系统建模基础 (system-modeling) | v1.3: 2个交互组件（SuspensionExplorer + FirstOrderComparisonExplorer） |
| [x] 传递函数入门 (transfer-function) | v1.3: 2个交互组件（PoleZeroExplorer + StepBodeExplorer），2个静态JupyterNotebook |
| [x] 时域分析 (time-domain-analysis) | v1.3: 5个交互组件（ImpulseExplorer + FirstOrderStepExplorer + PerformanceMetricsExplorer + SecondOrderStepExplorer + SuspensionTimeExplorer），2个静态JupyterNotebook |
| [x] 频域分析 (frequency-domain-analysis) | v1.3: 4个交互组件（BodeZetaExplorer + NyquistZetaExplorer + BandwidthCorrespondenceExplorer + RCFilterBodeExplorer），2个静态JupyterNotebook |
| [x] 根轨迹法 (root-locus) | v1.3: 1个交互组件（RootLocusKExplorer），4个静态JupyterNotebook |
| [x] PID控制器设计 (pid-controller) | v1.3: 2个交互组件（PidDerivativeFilterExplorer + PidKiKdExplorer） |
| [x] 系统稳定性分析 (stability-analysis) | v1.3: 2个交互组件（StabilityThirdOrderExplorer + StabilityDelayExplorer） |
| [ ] 频率响应法 (frequency-response) | v1.3: 待重构（7个ipywidgets笔记本） |
| [x] 校正网络设计 (compensator-design) | v1.3: 4个交互组件（LeadCompensatorExplorer + LagCompensatorExplorer + LeadLagCompensatorExplorer + AntiWindupExplorer） |
| [ ] 经典控制综合案例 (classic-case-study) | |

### 现代控制 (modern)

| 课程 | 状态 |
|------|------|
| [ ] 状态空间表示 (state-space) | |
| [ ] 可控性与可观性 (controllability-observability) | |
| [ ] 状态反馈与极点配置 (state-feedback) | |
| [ ] 状态观测器设计 (state-observer) | |
| [ ] 最优控制基础 (optimal-control-basics) | |
| [ ] LQR控制器 (lqr-controller) | |
| [ ] 卡尔曼滤波 (kalman-filter) | |
| [ ] 线性系统理论 (linear-system-theory) | |
| [ ] 多变量系统分析 (multivariable-systems) | |
| [ ] 现代控制综合案例 (modern-case-study) | |

### 鲁棒控制 (robust)

| 课程 | 状态 |
|------|------|
| [ ] 鲁棒性概念 (robustness-concept) | |
| [ ] H∞控制基础 (h-infinity-basics) | |
| [ ] 混合灵敏度设计 (mixed-sensitivity) | |
| [ ] μ综合方法 (mu-synthesis) | |
| [ ] 鲁棒稳定性分析 (robust-stability) | |
| [ ] 不确定性建模 (uncertainty-modeling) | |
| [ ] 鲁棒性能指标 (robust-performance) | |
| [ ] 鲁棒控制综合案例 (robust-case-study) | |

### 计算机控制 (computer-control)

| 课程 | 状态 |
|------|------|
| [ ] 采样与量化 (sampling-quantization) | |
| [ ] Z变换基础 (z-transform-basics) | |
| [ ] 数字控制器设计 (digital-controller-design) | |
| [ ] 离散系统稳定性 (discrete-stability) | |
| [ ] 数字PID实现 (digital-pid) | |
| [ ] 采样周期选择 (sampling-period) | |
| [ ] 计算机控制系统架构 (computer-control-architecture) | |
| [ ] 实时控制实现 (realtime-control) | |

### 预测控制 (mpc)

| 课程 | 状态 |
|------|------|
| [ ] 模型预测控制原理 (mpc-principle) | |
| [ ] 预测模型建立 (prediction-model) | |
| [ ] 滚动优化策略 (receding-horizon) | |
| [ ] 约束处理 (constraint-handling) | |
| [ ] MPC实现案例 (mpc-case-study) | |
| [ ] 广义预测控制(GPC) (generalized-predictive-control) | |
| [ ] 非线性MPC (nonlinear-mpc) | |
| [ ] 分布式MPC (distributed-mpc) | |

### 非线性控制 (nonlinear)

| 课程 | 状态 |
|------|------|
| [x] 非线性系统特性 (nonlinear-characteristics) | v1.3: 3个静态JupyterNotebook（Duffing振子对比、Stribeck摩擦曲线、PI饱和与抗积分饱和） |
| [ ] 相平面分析 (phase-plane) | |
| [x] 描述函数法 (describing-function) | v1.3: 2个交互组件（DescribingFunctionExplorer + NyquistLimitCycleExplorer），2个静态JupyterNotebook |
| [ ] 李雅普诺夫稳定性 (lyapunov-stability) | |
| [ ] 反馈线性化 (feedback-linearization) | |
| [ ] 滑模控制 (sliding-mode-control) | |
| [ ] 反步法设计 (backstepping) | |
| [ ] 自适应控制基础 (adaptive-control-basics) | |

### 智能控制 (intelligent)

| 课程 | 状态 |
|------|------|
| [ ] 模糊控制基础 (fuzzy-control-basics) | |
| [ ] 模糊控制器设计 (fuzzy-controller-design) | |
| [ ] 神经网络控制 (neural-network-control) | |
| [ ] 专家控制系统 (expert-system) | |
| [ ] 遗传算法优化 (genetic-algorithm) | |
| [ ] 模糊神经网络 (fuzzy-neural-network) | |
| [ ] 智能控制综合案例 (intelligent-case-study) | |

### 强化学习控制 (rl-control)

| 课程 | 状态 |
|------|------|
| [ ] 强化学习基础 (rl-basics) | |
| [ ] Q-learning算法 (q-learning) | |
| [ ] 深度Q网络(DQN) (dqn) | |
| [ ] 策略梯度方法 (policy-gradient) | |
| [ ] Actor-Critic架构 (actor-critic) | |
| [ ] RL控制应用案例 (rl-control-case) | |
| [ ] 安全强化学习 (safe-rl) | |
| [ ] 多智能体RL (multi-agent-rl) | |

### 离散控制 (discrete)

| 课程 | 状态 |
|------|------|
| [ ] 离散时间系统 (discrete-time-systems) | |
| [ ] 差分方程建模 (difference-equation) | |
| [ ] Z变换分析 (z-transform-analysis) | |
| [ ] 离散稳定性判据 (discrete-stability-criteria) | |
| [ ] 数字控制器设计 (digital-controller) | |
| [ ] 离散最优控制 (discrete-optimal-control) | |
| [ ] 采样系统设计 (sampled-data-systems) | |
| [ ] 离散系统综合案例 (discrete-case-study) | |

### 多智能体控制 (multi-agent)

| 课程 | 状态 |
|------|------|
| [ ] 多智能体系统概述 (multi-agent-overview) | |
| [ ] 一致性控制 (consensus-control) | |
| [ ] 编队控制 (formation-control) | |
| [ ] 分布式优化 (distributed-optimization) | |
| [ ] 博弈论基础 (game-theory-basics) | |
| [ ] 多智能体协同案例 (multi-agent-cooperation) | |
| [ ] 分布式估计 (distributed-estimation) | |
| [ ] 多智能体RL (multi-agent-rl) | |

---

**统计**：10 / 83 课程已完成（24个交互组件已交付）
