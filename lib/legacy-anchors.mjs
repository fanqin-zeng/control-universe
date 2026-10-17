/** S04旧锚点兼容：历史catalog/源码预估ID → canonical DOM ID。只含别名，不复制目录。 */
export const legacyAnchors = {
  "multi-agent/distributed-mpc": {
    "为什么需要分布式MPC": "为什么需要分布式mpc",
    "ADMM分解算法": "admm分解算法",
    "数值例子": "数值例子5车编队仿真"
  },
  "classic/frequency-domain-analysis": {
    "工程实例rc低通滤波器的频率分析": "工程实例"
  },
  "classic/frequency-response-design": {
    "工程应用ziegler-nichols整定法": "工程应用ziegler-nichols-整定法"
  },
  "modern/state-observer": {
    "基于观测器的控制器——分离性原理": "基于观测器的控制器分离性原理"
  },
  "modern/optimal-control-basics": {
    "变分法：对泛函求极值": "变分法对泛函求极值",
    "Hamilton 函数与极小值原理": "hamilton-函数与极小值原理",
    "最小时间问题与 Bang-Bang 控制": "最小时间问题与-bang-bang-控制",
    "线性二次型最优控制——引向 LQR": "线性二次型最优控制引向-lqr"
  },
  "nonlinear/nonlinear-characteristics": {
    "什么是非线性系统？": "什么是非线性系统",
    "为什么线性化会失效？": "为什么线性化会失效",
    "何时需要非线性分析？": "何时需要非线性分析"
  },
  "nonlinear/phase-plane": {
    "Nullcline 与平衡点": "nullcline-与平衡点",
    "平衡点分类：迹-行列式平面": "平衡点分类迹-行列式平面",
    "手算例：非线性振子的完整相平面": "手算例非线性振子的完整相平面",
    "Poincaré-Bendixson 定理与极限环": "poincaré-bendixson-定理与极限环",
    "高维推广：Poincaré 截面与 Floquet 乘子": "高维推广poincaré-截面与-floquet-乘子",
    "分岔：相图的拓扑突变": "分岔相图的拓扑突变"
  },
  "nonlinear/lyapunov-stability": {
    "手算例子：非线性弹簧-质量系统": "手算例子非线性弹簧-质量系统",
    "LaSalle 不变集原理": "lasalle-不变集原理",
    "何时失效？": "何时失效"
  },
  "nonlinear/feedback-linearization": {
    "仿射非线性系统与lie-导数": "仿射非线性系统与lie导数",
    "输入输出线性化": "输入-输出线性化",
    "应用案例球梁系统": "应用案例球-梁系统"
  },
  "discrete-sampled/z-transform-analysis": {
    "Z变换的定义": "z-变换的定义",
    "Z变换的性质": "z-变换的性质",
    "逆Z变换": "逆-z-变换",
    "z平面与s平面的映射": "zzz-平面与-sss-平面的映射",
    "z-平面与-s-平面的映射": "zzz-平面与-sss-平面的映射"
  },
  "discrete-sampled/discrete-stability-criteria": {
    "z域稳定性条件": "z-域稳定性条件",
    "Jury稳定性判据": "jury-稳定性判据",
    "w变换与Routh判据": "w-变换与-routh-判据"
  },
  "discrete-sampled/discretization-methods": {
    "数字PID工程实现": "数字-pid-工程实现",
    "设计实例": "设计实例电机速度控制"
  },
  "implementation/digital-pid": {
    "PID改进结构": "pid-改进结构",
    "级联PID": "级联-pid",
    "数字PID调参": "数字-pid-调参"
  },
  "robust/robustness-concept": {
    "h-范数": "hmathcalh_inftyh-范数",
    "mathcalh_infty-范数": "hmathcalh_inftyh-范数",
    "回顾lqr的鲁棒性": "回顾lqr-的鲁棒性"
  },
  "robust/h-infinity-basics": {
    "标准h-问题": "标准-hmathcalh_inftyh-问题",
    "标准-mathcalh_infty-问题": "标准-hmathcalh_inftyh-问题"
  },
  "robust/mu-synthesis": {
    "为什么h-不够": "为什么-h-不够",
    "结构化奇异值": "结构化奇异值-μ",
    "鲁棒稳定性与鲁棒性能": "μ-鲁棒稳定性与鲁棒性能"
  },
  "mpc/mpc-principle": {
    "MPC的三大核心思想": "mpc的三大核心思想",
    "线性MPC的数学公式": "线性mpc的数学公式",
    "MPC与LQR的区别": "mpc与lqr的区别"
  },
  "mpc/prediction-model": {
    "CARIMA模型": "carima模型"
  },
  "mpc/receding-horizon": {
    "开环最优vs滚动优化": "开环最优-vs-滚动优化",
    "QP求解与实时性": "qp求解与实时性",
    "Warm-Starting策略": "warm-starting策略",
    "显式MPC": "显式mpc"
  },
  "mpc/constraint-handling": {
    "约束到QP标准形式的转化": "约束到qp标准形式的转化"
  },
  "mpc/generalized-predictive-control": {
    "CARIMA模型回顾": "carima-模型回顾",
    "Diophantine方程": "diophantine-方程",
    "j步ahead预测": "j-步-ahead-预测",
    "GPC代价函数": "gpc-代价函数",
    "GPC解析解": "gpc-解析解",
    "GPC与经典控制的关系": "gpc-与经典控制的关系",
    "GPC调参方法": "gpc-调参方法",
    "约束GPC": "约束-gpc"
  },
  "mpc/nonlinear-mpc": {
    "为什么需要NMPC": "为什么需要-nmpc",
    "NMPC优化问题": "nmpc-优化问题",
    "SQP求解": "sqp-求解",
    "Lyapunov-based NMPC": "lyapunov-based-nmpc",
    "数值例子": "数值例子非线性摆",
    "多稳态系统的NMPC": "多稳态系统的-nmpc"
  },
  "mpc/mpc-case-study": {
    "MPC控制器设计": "mpc-控制器设计"
  },
  "intelligent/fuzzy-control-basics": {
    "Mamdani型模糊控制器": "mamdani型模糊控制器",
    "Takagi-Sugeno型模糊控制器": "takagi-sugeno型模糊控制器"
  },
  "intelligent/fuzzy-controller-design": {
    "模糊PD控制器": "模糊pd控制器",
    "模糊PID控制器": "模糊pid控制器",
    "与常规PID的定量对比": "与常规pid的定量对比"
  },
  "intelligent/neural-network-control": {
    "前馈神经网络：结构与万能逼近": "前馈神经网络结构与万能逼近",
    "监督学习：用NN模仿PID": "监督学习用-nn-模仿-pid",
    "直接优化：让NN超越PID": "直接优化让-nn-超越-pid"
  }
};
