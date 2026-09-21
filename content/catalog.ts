export interface LessonMeta {
  slug: string;
  title: string;
}

export interface Chapter {
  slug: string;
  title: string;
  lessons: LessonMeta[];
}

export const catalog: Chapter[] = [
  {
    slug: "classic",
    title: "经典控制",
    lessons: [
      { slug: "transfer-function", title: "传递函数入门" },
      { slug: "system-modeling", title: "系统建模基础" },
      { slug: "time-domain-analysis", title: "时域分析" },
      { slug: "frequency-domain-analysis", title: "频域分析" },
      { slug: "root-locus", title: "根轨迹法" },
      { slug: "pid-controller", title: "PID控制器设计" },
      { slug: "stability-analysis", title: "系统稳定性分析" },
      { slug: "frequency-response", title: "频率响应法" },
      { slug: "compensator-design", title: "校正网络设计" },
      { slug: "classic-case-study", title: "经典控制综合案例" },
    ],
  },
  {
    slug: "modern",
    title: "现代控制",
    lessons: [
      { slug: "state-space", title: "状态空间表示" },
      { slug: "controllability-observability", title: "可控性与可观性" },
      { slug: "state-feedback", title: "状态反馈与极点配置" },
      { slug: "state-observer", title: "状态观测器设计" },
      { slug: "optimal-control-basics", title: "最优控制基础" },
      { slug: "lqr-controller", title: "LQR控制器" },
      { slug: "kalman-filter", title: "卡尔曼滤波" },
      { slug: "linear-system-theory", title: "线性系统理论" },
      { slug: "multivariable-systems", title: "多变量系统分析" },
      { slug: "modern-case-study", title: "现代控制综合案例" },
    ],
  },
  {
    slug: "robust",
    title: "鲁棒控制",
    lessons: [
      { slug: "robustness-concept", title: "鲁棒性概念" },
      { slug: "h-infinity-basics", title: "H∞控制基础" },
      { slug: "mixed-sensitivity", title: "混合灵敏度设计" },
      { slug: "mu-synthesis", title: "μ综合方法" },
      { slug: "robust-stability", title: "鲁棒稳定性分析" },
      { slug: "uncertainty-modeling", title: "不确定性建模" },
      { slug: "robust-performance", title: "鲁棒性能指标" },
      { slug: "robust-case-study", title: "鲁棒控制综合案例" },
    ],
  },
  {
    slug: "computer-control",
    title: "计算机控制",
    lessons: [
      { slug: "sampling-quantization", title: "采样与量化" },
      { slug: "z-transform-basics", title: "Z变换基础" },
      { slug: "digital-controller-design", title: "数字控制器设计" },
      { slug: "discrete-stability", title: "离散系统稳定性" },
      { slug: "digital-pid", title: "数字PID实现" },
      { slug: "sampling-period", title: "采样周期选择" },
      { slug: "computer-control-architecture", title: "计算机控制系统架构" },
      { slug: "realtime-control", title: "实时控制实现" },
    ],
  },
  {
    slug: "mpc",
    title: "预测控制",
    lessons: [
      { slug: "mpc-principle", title: "模型预测控制原理" },
      { slug: "prediction-model", title: "预测模型建立" },
      { slug: "receding-horizon", title: "滚动优化策略" },
      { slug: "constraint-handling", title: "约束处理" },
      { slug: "mpc-case-study", title: "MPC实现案例" },
      { slug: "generalized-predictive-control", title: "广义预测控制(GPC)" },
      { slug: "nonlinear-mpc", title: "非线性MPC" },
      { slug: "distributed-mpc", title: "分布式MPC" },
    ],
  },
  {
    slug: "nonlinear",
    title: "非线性控制",
    lessons: [
      { slug: "nonlinear-characteristics", title: "非线性系统特性" },
      { slug: "phase-plane", title: "相平面分析" },
      { slug: "describing-function", title: "描述函数法" },
      { slug: "lyapunov-stability", title: "李雅普诺夫稳定性" },
      { slug: "feedback-linearization", title: "反馈线性化" },
      { slug: "sliding-mode-control", title: "滑模控制" },
      { slug: "backstepping", title: "反步法设计" },
      { slug: "adaptive-control-basics", title: "自适应控制基础" },
    ],
  },
  {
    slug: "intelligent",
    title: "智能控制",
    lessons: [
      { slug: "fuzzy-control-basics", title: "模糊控制基础" },
      { slug: "fuzzy-controller-design", title: "模糊控制器设计" },
      { slug: "neural-network-control", title: "神经网络控制" },
      { slug: "expert-system", title: "专家控制系统" },
      { slug: "genetic-algorithm", title: "遗传算法优化" },
      { slug: "fuzzy-neural-network", title: "模糊神经网络" },
      { slug: "intelligent-case-study", title: "智能控制综合案例" },
    ],
  },
  {
    slug: "rl-control",
    title: "强化学习控制",
    lessons: [
      { slug: "rl-basics", title: "强化学习基础" },
      { slug: "q-learning", title: "Q-learning算法" },
      { slug: "dqn", title: "深度Q网络(DQN)" },
      { slug: "policy-gradient", title: "策略梯度方法" },
      { slug: "actor-critic", title: "Actor-Critic架构" },
      { slug: "rl-control-case", title: "RL控制应用案例" },
      { slug: "safe-rl", title: "安全强化学习" },
      { slug: "multi-agent-rl", title: "多智能体RL" },
    ],
  },
  {
    slug: "discrete",
    title: "离散控制",
    lessons: [
      { slug: "discrete-time-systems", title: "离散时间系统" },
      { slug: "difference-equation", title: "差分方程建模" },
      { slug: "z-transform-analysis", title: "Z变换分析" },
      { slug: "discrete-stability-criteria", title: "离散稳定性判据" },
      { slug: "digital-controller", title: "数字控制器设计" },
      { slug: "discrete-optimal-control", title: "离散最优控制" },
      { slug: "sampled-data-systems", title: "采样系统设计" },
      { slug: "discrete-case-study", title: "离散系统综合案例" },
    ],
  },
  {
    slug: "multi-agent",
    title: "多智能体控制",
    lessons: [
      { slug: "multi-agent-overview", title: "多智能体系统概述" },
      { slug: "consensus-control", title: "一致性控制" },
      { slug: "formation-control", title: "编队控制" },
      { slug: "distributed-optimization", title: "分布式优化" },
      { slug: "game-theory-basics", title: "博弈论基础" },
      { slug: "multi-agent-cooperation", title: "多智能体协同案例" },
      { slug: "distributed-estimation", title: "分布式估计" },
      { slug: "multi-agent-rl", title: "多智能体RL" },
    ],
  },
];
