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
| [x] 非线性系统特性 (nonlinear-characteristics) | v1.3 重写: 1个交互组件（NonlinearityExplorer 六种非线性的 u-y 回线+时间波形，按类型固定坐标轴，默认滞环 A=1.5/c=0.2 复现环面积 4cA=1.200000；间隙 settle 相位陷阱见讨论日志附录 C），9个静态JupyterNotebook（叠加原理定量破坏 / 振幅依赖周期+Lindstedt+软弹簧逃逸 / 滞环·间隙·Stribeck / 谐波产生与双频互调 / 线性化误差带 / 跳跃共振与谐波平衡三分支 / 多平衡点与鞍结分岔 / PI三种幅值处理 / 粘滑极限环与吸引域）；讨论日志 docs/discuss-log/course-01/07-nonlinear/01-nonlinear-characteristics.md（含11条旧稿错误对照） |
| [x] 相平面分析 (phase-plane) | v1.3 重写: 2个交互组件（PhasePlaneExplorer 五系统相平面 + TraceDetExplorer 迹-行列式平面，默认参数复现手算例，见 fix-logs 016），12个静态JupyterNotebook组件（NB10 拆上/下：Van der Pol 极限环 / 迹-行列式分类+2000抽查 / 非双曲中心三情形 / Duffing 手算例全程核对 / 鞍点流形与吸引域 / μ扫描张弛振荡 / 极限环孤立性 / 真假中心对照 / Lotka-Volterra 首次积分 / 受迫Duffing截面+Floquet+延拓 / 无轮辐轮混合系统）；讨论日志 docs/discuss-log/course-01/07-nonlinear/02-phase-plane.md；顺带修复组件双注册表问题（fix-logs 015） |
| [x] 描述函数法 (describing-function) | v1.3 重写: 2个交互组件（DescribingFunctionExplorer + NyquistLimitCycleExplorer，后者修正 -1/N 轨迹范围与交点存在性判断，见 fix-logs 014），6个静态JupyterNotebook（21 cell：波形畸变与复数惯例 / 五个闭式核对与串联≠乘积 / 手算例仿真仲裁与泄漏指标L / Routh交叉核对与双交点算例 / 三个应用案例 / 四种失效模式）；讨论日志 docs/discuss-log/course-01/07-nonlinear/03-describing-function.md |
| [x] 李雅普诺夫稳定性 (lyapunov-stability) | v1.3: 1个交互组件（LyapunovExplorer），4个静态JupyterNotebook；讨论日志 docs/discuss-log/course-01/07-nonlinear/04-lyapunov-stability.md |
| [x] 反馈线性化 (feedback-linearization) | v1.3: 1个交互组件（ZeroDynamicsExplorer），4个静态JupyterNotebook（Lie导数验证 / 零动态定义式仿真 / 倒立摆IOL-vs-Jacobian三组实验 / 球-梁近似IOL）；讨论日志 docs/discuss-log/course-01/07-nonlinear/05-feedback-linearization.md（含实测修正附录）；顺带修复全站级 kernel id 冲突（fix-logs 011） |
| [x] 滑模控制 (sliding-mode-control) | v1.3: 1个交互组件（SlidingModeExplorer），5个静态JupyterNotebook（到达条件与等效控制 / 四种控制律抖振对比 / 四种到达律 / 匹配性K扫描 / 电机六控制器），2张按实测重算的概念图；讨论日志 docs/discuss-log/course-01/07-nonlinear/06-sliding-mode-control.md |
| [x] 反步法设计 (backstepping) | v1.3: 1个交互组件（BacksteppingExplorer），6个静态JupyterNotebook（结构判定/手算复核/复杂度与DSC/自适应/柔性关节机器人/七律对比与可达域），1张按实测重画的概念图；讨论日志 docs/discuss-log/course-01/07-nonlinear/07-backstepping.md |
| [x] 自适应控制基础 (adaptive-control-basics) | v1.3: 1个交互组件（MracExplorer，三面板固定坐标轴，JS↔Python 交叉验证 Rohrs 临界增益 3/4 与发散时刻），9个静态JupyterNotebook（V̇恒等式 / 手算与PE流形 / γ两面性 / 高阶匹配条件 / RLS与协方差windup / STR除零保护 / 噪声与四种修正 / 机械臂负载突变 / 飞行器爬升三方对比），1张matplotlib计算概念图；讨论日志 docs/discuss-log/course-01/07-nonlinear/08-adaptive-control-basics.md（含18条"叙述服从测量"修正） |

### 智能控制 (intelligent)

| 课程 | 状态 |
|------|------|
| [x] 模糊控制基础 (fuzzy-control-basics) | v1.3: 1个交互组件（FuzzyExplorer，三面板固定坐标轴：隶属度与Σμ / 控制面与理想增益线 / 聚合与三种解模糊化），9个静态JupyterNotebook（单位划分闭式 / 算子2×2闭环 / 三解模糊化与离散化 / FAMM量化与等效增益 / 静差与积分 / 零阶Sugeno等价2×2与TS严格稳定 / 洗衣机决策面 / ABS三路面与路面切换 / 在线成本），1张matplotlib计算概念图（四联管线）；讨论日志 docs/discuss-log/course-01/08-intelligent/01-fuzzy-control-basics.md（含ABS基线整定与8条"叙述服从测量"修正） |
| [x] 模糊控制器设计 (fuzzy-controller-design) | v1.3: 1个交互组件（FuzzyTuningExplorer，四滑块实时闭环仿真：n/Ge/Gce/Gu，双ECharts固定坐标轴θ∈[-30,30]°与u∈[-16,16] N·m），6个静态JupyterNotebook（规则表构造 / 比例因子敏感性扫描 / 闭环仿真与PID对比 / 模糊PID与积分消除 / 规则库PD/P/PD-like模式对比 / 解模糊化COG vs BIS vs MOM），14个小节（引言→被控对象→规则库→比例因子→模糊PD→模糊PID→PID对比→规则库结构→解模糊化→稳定性→工程要点→小结→习题→答案）；讨论日志 docs/discuss-log/course-01/08-intelligent/02-fuzzy-controller-design.md（含附录A完整实验数据，核心发现：Mamdani模糊PD无法稳定倒立摆，rms≈21° vs PID的2.67°） |
| [x] 神经网络控制 (neural-network-control) | v1.3: 1个交互组件（NeuralNetworkExplorer，控制器类型切换PID/NN-Sup/NN-ES + 初始角度滑块5°–45°，双ECharts固定坐标轴θ∈[-50,50]°与u∈[-16,16] N·m），5个静态JupyterNotebook（NN前向传播与控制曲面 / 监督学习训练 / 进化策略优化 / 四种控制器全面对比 / 鲁棒性测试），12个小节（引言→模糊失败回顾→NN结构→监督学习→直接优化→定量对比→鲁棒性→稳定性→工程要点→小结→习题→答案）；讨论日志 docs/discuss-log/course-01/08-intelligent/03-neural-network-control.md（核心发现：NN-Supervised≈PID，NN-ES在J上超越PID 5.3%，NN远优于模糊控制2.7° vs 21°） |
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

**统计**：17 / 83 课程已完成（33个交互组件已交付）
