export interface SubsectionMeta {
  slug: string;
  title: string;
}

export interface LessonMeta {
  slug: string;
  title: string;
  subsections?: SubsectionMeta[];
  /** 依赖课程路径，形如 "math/laplace-transform"；A8 的依赖图校验以此建边。 */
  prereq?: string[];
  level?: "undergrad" | "grad" | "advanced";
  /** 课型，决定 semester-02-plan 3.6 节角色矩阵中除核心 4 人外还要谁上场。 */
  type?: "math" | "theory" | "impl" | "case" | "frontier" | "learning" | "history";
  /** empty=目录占位无 MDX；draft=有 MDX 但未过 v1.3 审校；v1.3=delivery-tracker 中已打勾。 */
  status?: "empty" | "draft" | "v1.3";
}

export interface Chapter {
  slug: string;
  title: string;
  /** 章序号，0 起。未填时以 catalog 数组下标为准，A3–A6 重排章节时再填。 */
  order?: number;
  lessons: LessonMeta[];
}

// 学期3 S02：导航顺序；生产顺序见 semester-03-plan。状态保留历史交付口径。
export const catalog: Chapter[] = [
  {
    "slug": "introduction",
    "title": "控制导论",
    "order": 0,
    "lessons": [
      {
        "slug": "why-feedback-works",
        "title": "反馈为什么有效",
        "prereq": [
          "classic/transfer-function"
        ],
        "level": "undergrad",
        "type": "history",
        "status": "empty"
      },
      {
        "slug": "control-landscape",
        "title": "控制理论地图",
        "level": "undergrad",
        "type": "history",
        "status": "empty"
      },
      {
        "slug": "controller-selection-guide",
        "title": "控制方法选型",
        "prereq": [
          "introduction/why-feedback-works",
          "introduction/control-landscape",
          "classic/pid-controller",
          "modern/state-feedback",
          "mpc/mpc-principle",
          "robust/h-infinity-basics",
          "rl-control/rl-basics"
        ],
        "level": "grad",
        "type": "history",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "math",
    "title": "数学基础",
    "order": 1,
    "lessons": [
      {
        "slug": "calculus-basics",
        "title": "微积分入门",
        "level": "undergrad",
        "type": "math",
        "status": "v1.3",
        "subsections": [
          {
            "slug": "问题从哪里来",
            "title": "问题从哪里来"
          },
          {
            "slug": "函数与变化量",
            "title": "函数与变化量"
          },
          {
            "slug": "极限的意思",
            "title": "极限的意思"
          },
          {
            "slug": "导数与局部近似",
            "title": "导数与局部近似"
          },
          {
            "slug": "基本求导规则",
            "title": "基本求导规则"
          },
          {
            "slug": "积分与累积",
            "title": "积分与累积"
          },
          {
            "slug": "微积分的联系",
            "title": "微积分的联系"
          },
          {
            "slug": "测量与采样边界",
            "title": "测量与采样边界"
          },
          {
            "slug": "无穷级数",
            "title": "无穷级数"
          },
          {
            "slug": "泰勒展开",
            "title": "泰勒展开"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ]
      },
      {
        "slug": "complex-numbers",
        "title": "复数基础",
        "subsections": [
          {
            "slug": "为什么需要复数",
            "title": "为什么需要复数"
          },
          {
            "slug": "复数的定义",
            "title": "复数的定义"
          },
          {
            "slug": "复数的四则运算",
            "title": "复数的四则运算"
          },
          {
            "slug": "复平面",
            "title": "复平面"
          },
          {
            "slug": "极坐标形式",
            "title": "极坐标形式"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "level": "undergrad",
        "type": "math",
        "status": "v1.3",
        "prereq": [
          "math/calculus-basics"
        ]
      },
      {
        "slug": "linear-algebra-basics",
        "title": "线性代数基础",
        "subsections": [
          { "title": "两路输入怎么配合", "slug": "两路输入怎么配合" },
          { "title": "向量把数放在一起", "slug": "向量把数放在一起" },
          { "title": "矩阵怎样作用于向量", "slug": "矩阵怎样作用于向量" },
          { "title": "矩阵相乘与先后顺序", "slug": "矩阵相乘与先后顺序" },
          { "title": "消元求解方程组", "slug": "消元求解方程组" },
          { "title": "秩与解的可能", "slug": "秩与解的可能" },
          { "title": "行列式与逆矩阵", "slug": "行列式与逆矩阵" },
          { "title": "转置内积与长度", "slug": "转置内积与长度" },
          { "title": "控制里为什么常见矩阵", "slug": "控制里为什么常见矩阵" },
          { "title": "小结", "slug": "小结" },
          { "title": "习题", "slug": "习题" },
          { "title": "答案", "slug": "答案" }
        ],
        "level": "undergrad",
        "type": "math",
        "status": "v1.3"
      },
      {
        "slug": "eigen-decomposition",
        "title": "特征值与对角化",
        "subsections": [
          { "title": "反复更新会怎样", "slug": "反复更新会怎样" },
          { "title": "保持直线的向量", "slug": "保持直线的向量" },
          { "title": "怎样求特征值", "slug": "怎样求特征值" },
          { "title": "特征向量有多少", "slug": "特征向量有多少" },
          { "title": "换一组坐标", "slug": "换一组坐标" },
          { "title": "用对角化算多步", "slug": "用对角化算多步" },
          { "title": "重根不保证对角化", "slug": "重根不保证对角化" },
          { "title": "旋转与复特征值", "slug": "旋转与复特征值" },
          { "title": "从倍率看长期变化", "slug": "从倍率看长期变化" },
          { "title": "小结", "slug": "小结" },
          { "title": "习题", "slug": "习题" },
          { "title": "答案", "slug": "答案" }
        ],
        "prereq": [
          "math/linear-algebra-basics",
          "math/complex-numbers"
        ],
        "level": "undergrad",
        "type": "math",
        "status": "v1.3"
      },
      {
        "slug": "matrix-decomposition",
        "title": "矩阵分解",
        "subsections": [
          { "title": "为什么把矩阵拆开", "slug": "为什么把矩阵拆开" },
          { "title": "正交向量与投影", "slug": "正交向量与投影" },
          { "title": "LU与消元", "slug": "lu与消元" },
          { "title": "QR与正交化", "slug": "qr与正交化" },
          { "title": "最小二乘在求什么", "slug": "最小二乘在求什么" },
          { "title": "用QR求最小二乘", "slug": "用qr求最小二乘" },
          { "title": "正定矩阵与Cholesky", "slug": "正定矩阵与cholesky" },
          { "title": "奇异值分解", "slug": "奇异值分解" },
          { "title": "伪逆与最小范数", "slug": "伪逆与最小范数" },
          { "title": "小奇异值与截断", "slug": "小奇异值与截断" },
          { "title": "分解怎样选择", "slug": "分解怎样选择" },
          { "title": "小结", "slug": "小结" },
          { "title": "习题", "slug": "习题" },
          { "title": "答案", "slug": "答案" }
        ],
        "prereq": [
          "math/eigen-decomposition"
        ],
        "level": "undergrad",
        "type": "math",
        "status": "v1.3"
      },
      {
        "slug": "multivariable-calculus",
        "title": "多元微积分",
        "subsections": [
          { "title": "从地图上看坡度", "slug": "从地图上看坡度" },
          { "title": "两个变量怎样趋近", "slug": "两个变量怎样趋近" },
          { "title": "固定一个方向求导", "slug": "固定一个方向求导" },
          { "title": "全微分估计变化", "slug": "全微分估计变化" },
          { "title": "梯度与方向导数", "slug": "梯度与方向导数" },
          { "title": "沿路径使用链式法则", "slug": "沿路径使用链式法则" },
          { "title": "雅可比组织多路变化", "slug": "雅可比组织多路变化" },
          { "title": "二阶导数与局部形状", "slug": "二阶导数与局部形状" },
          { "title": "驻点不一定是极值", "slug": "驻点不一定是极值" },
          { "title": "把面积上的量加起来", "slug": "把面积上的量加起来" },
          { "title": "小结", "slug": "小结" },
          { "title": "习题", "slug": "习题" },
          { "title": "答案", "slug": "答案" }
        ],
        "prereq": [
          "math/calculus-basics",
          "math/linear-algebra-basics"
        ],
        "level": "undergrad",
        "type": "math",
        "status": "v1.3"
      },
      {
        "slug": "ode-matrix-exponential",
        "title": "微分方程与矩阵指数",
        "prereq": [
          "math/calculus-basics",
          "math/complex-numbers",
          "math/eigen-decomposition"
        ],
        "level": "undergrad",
        "type": "math",
        "status": "v1.3",
        "subsections": [
          {"title": "两只水箱里的染料", "slug": "两只水箱里的染料"},
          {"title": "微分方程描述变化", "slug": "微分方程描述变化"},
          {"title": "初值选出一条轨迹", "slug": "初值选出一条轨迹"},
          {"title": "先解一阶方程", "slug": "先解一阶方程"},
          {"title": "外部输入怎样累积", "slug": "外部输入怎样累积"},
          {"title": "把高阶方程写成一阶", "slug": "把高阶方程写成一阶"},
          {"title": "矩阵指数从级数来", "slug": "矩阵指数从级数来"},
          {"title": "矩阵指数给出初值解", "slug": "矩阵指数给出初值解"},
          {"title": "可对角化时怎样算", "slug": "可对角化时怎样算"},
          {"title": "重根也能求解", "slug": "重根也能求解"},
          {"title": "有输入时使用积分", "slug": "有输入时使用积分"},
          {"title": "解的存在与模型边界", "slug": "解的存在与模型边界"},
          {"title": "小结", "slug": "小结"},
          {"title": "习题", "slug": "习题"},
          {"title": "答案", "slug": "答案"}
        ]
      },
      {
        "slug": "laplace-transform",
        "title": "拉普拉斯变换",
        "prereq": [
          "math/calculus-basics",
          "math/complex-numbers",
          "math/ode-matrix-exponential"
        ],
        "level": "undergrad",
        "type": "math",
        "status": "v1.3",
        "subsections": [
          {"title": "从衰减曲线算总影响", "slug": "从衰减曲线算总影响"},
          {"title": "给积分加一个权重", "slug": "给积分加一个权重"},
          {"title": "复变量与收敛域", "slug": "复变量与收敛域"},
          {"title": "常用变换怎样得到", "slug": "常用变换怎样得到"},
          {"title": "线性与指数移位", "slug": "线性与指数移位"},
          {"title": "导数怎样变成代数", "slug": "导数怎样变成代数"},
          {"title": "解一个初值问题", "slug": "解一个初值问题"},
          {"title": "分式怎样还原", "slug": "分式怎样还原"},
          {"title": "延迟怎样进入变换", "slug": "延迟怎样进入变换"},
          {"title": "卷积对应相乘", "slug": "卷积对应相乘"},
          {"title": "从方程得到传递函数", "slug": "从方程得到传递函数"},
          {"title": "初值与终值的条件", "slug": "初值与终值的条件"},
          {"title": "小结", "slug": "小结"},
          {"title": "习题", "slug": "习题"},
          {"title": "答案", "slug": "答案"}
        ]
      },
      {
        "slug": "fourier-analysis",
        "title": "傅里叶分析",
        "prereq": [
          "math/calculus-basics",
          "math/complex-numbers"
        ],
        "level": "undergrad",
        "type": "math",
        "status": "v1.3",
        "subsections": [
          {"title": "振动里有哪些频率", "slug": "振动里有哪些频率"},
          {"title": "周期与角频率", "slug": "周期与角频率"},
          {"title": "正交性怎样分离分量", "slug": "正交性怎样分离分量"},
          {"title": "傅里叶级数的系数", "slug": "傅里叶级数的系数"},
          {"title": "幅值与相位", "slug": "幅值与相位"},
          {"title": "截断与跳变", "slug": "截断与跳变"},
          {"title": "均方值与能量", "slug": "均方值与能量"},
          {"title": "非周期信号的傅里叶变换", "slug": "非周期信号的傅里叶变换"},
          {"title": "延迟与卷积", "slug": "延迟与卷积"},
          {"title": "频率响应从哪里来", "slug": "频率响应从哪里来"},
          {"title": "DFT与FFT", "slug": "dft与fft"},
          {"title": "采样与有限窗口", "slug": "采样与有限窗口"},
          {"title": "小结", "slug": "小结"},
          {"title": "习题", "slug": "习题"},
          {"title": "答案", "slug": "答案"}
        ]
      },
      {
        "slug": "z-transform",
        "title": "Z变换",
        "prereq": [
          "math/laplace-transform"
        ],
        "level": "undergrad",
        "type": "math",
        "status": "v1.3",
        "subsections": [
          {"title": "每分钟记录的温差", "slug": "每分钟记录的温差"},
          {"title": "序列与单位脉冲", "slug": "序列与单位脉冲"},
          {"title": "把加权积分换成求和", "slug": "把加权积分换成求和"},
          {"title": "收敛域不能省略", "slug": "收敛域不能省略"},
          {"title": "同一分式的不同序列", "slug": "同一分式的不同序列"},
          {"title": "延迟与初值", "slug": "延迟与初值"},
          {"title": "从递推式求解序列", "slug": "从递推式求解序列"},
          {"title": "卷积与零状态映射", "slug": "卷积与零状态映射"},
          {"title": "极点与单位圆", "slug": "极点与单位圆"},
          {"title": "单位圆上的频率响应", "slug": "单位圆上的频率响应"},
          {"title": "连续时间与离散时间", "slug": "连续时间与离散时间"},
          {"title": "小结", "slug": "小结"},
          {"title": "习题", "slug": "习题"},
          {"title": "答案", "slug": "答案"}
        ]
      },
      {
        "slug": "probability-basics",
        "title": "概率基础",
        "prereq": ["math/calculus-basics"],
        "level": "undergrad",
        "type": "math",
        "status": "v1.3",
        "subsections": [
          {"title": "感应灯为什么会误报", "slug": "感应灯为什么会误报"},
          {"title": "事件与概率", "slug": "事件与概率"},
          {"title": "条件概率换了分母", "slug": "条件概率换了分母"},
          {"title": "全概率与贝叶斯", "slug": "全概率与贝叶斯"},
          {"title": "独立不是互斥", "slug": "独立不是互斥"},
          {"title": "随机变量与分布", "slug": "随机变量与分布"},
          {"title": "密度不是点概率", "slug": "密度不是点概率"},
          {"title": "期望与方差", "slug": "期望与方差"},
          {"title": "两个变量一起变化", "slug": "两个变量一起变化"},
          {"title": "常见分布", "slug": "常见分布"},
          {"title": "样本不等于总体", "slug": "样本不等于总体"},
          {"title": "平均值为什么更稳", "slug": "平均值为什么更稳"},
          {"title": "小结", "slug": "小结"},
          {"title": "习题", "slug": "习题"},
          {"title": "答案", "slug": "答案"}
        ]
      },
      {
        "slug": "stochastic-processes",
        "title": "随机过程",
        "prereq": [
          "math/probability-basics",
          "math/linear-algebra-basics",
          "math/fourier-analysis"
        ],
        "level": "grad",
        "type": "math",
        "status": "v1.3",
        "subsections": [
          {"title": "电子秤的一串读数", "slug": "电子秤的一串读数"},
          {"title": "一条轨迹与一族随机量", "slug": "一条轨迹与一族随机量"},
          {"title": "均值与相关函数", "slug": "均值与相关函数"},
          {"title": "平稳不等于不变", "slug": "平稳不等于不变"},
          {"title": "白噪声与独立", "slug": "白噪声与独立"},
          {"title": "带记忆的误差模型", "slug": "带记忆的误差模型"},
          {"title": "从零开始与二阶矩平稳", "slug": "从零开始与二阶矩平稳"},
          {"title": "平均值还剩多少波动", "slug": "平均值还剩多少波动"},
          {"title": "频谱里的时间关联", "slug": "频谱里的时间关联"},
          {"title": "马尔可夫链", "slug": "马尔可夫链"},
          {"title": "随机游走为什么漂移", "slug": "随机游走为什么漂移"},
          {"title": "向量过程与协方差传播", "slug": "向量过程与协方差传播"},
          {"title": "连续时间的布朗运动", "slug": "连续时间的布朗运动"},
          {"title": "小结", "slug": "小结"},
          {"title": "习题", "slug": "习题"},
          {"title": "答案", "slug": "答案"}
        ]
      },
      {
        "slug": "convex-optimization",
        "title": "凸优化",
        "prereq": [
          "math/matrix-decomposition",
          "math/multivariable-calculus"
        ],
        "level": "grad",
        "type": "math",
        "status": "v1.3",
        "subsections": [
          {
            "slug": "两台电暖器怎么分功率",
            "title": "两台电暖器怎么分功率"
          },
          {
            "slug": "把要求写成优化问题",
            "title": "把要求写成优化问题"
          },
          {
            "slug": "凸集里的线段",
            "title": "凸集里的线段"
          },
          {
            "slug": "凸函数的弦与切线",
            "title": "凸函数的弦与切线"
          },
          {
            "slug": "局部最优为什么够用",
            "title": "局部最优为什么够用"
          },
          {
            "slug": "梯度与曲率",
            "title": "梯度与曲率"
          },
          {
            "slug": "功率分配的精确解",
            "title": "功率分配的精确解"
          },
          {
            "slug": "拉格朗日函数与下界",
            "title": "拉格朗日函数与下界"
          },
          {
            "slug": "kkt条件",
            "title": "KKT条件"
          },
          {
            "slug": "约束资格与强对偶",
            "title": "约束资格与强对偶"
          },
          {
            "slug": "投影梯度法",
            "title": "投影梯度法"
          },
          {
            "slug": "停止前检查什么",
            "title": "停止前检查什么"
          },
          {
            "slug": "控制问题中的凸结构",
            "title": "控制问题中的凸结构"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ]
      },
      {
        "slug": "variational-dp",
        "title": "变分法与动态规划",
        "prereq": [
          "math/multivariable-calculus",
          "math/ode-matrix-exponential"
        ],
        "level": "grad",
        "type": "math",
        "status": "empty"
      },
      {
        "slug": "diff-geometry",
        "title": "微分几何入门",
        "prereq": [
          "math/multivariable-calculus",
          "math/ode-matrix-exponential"
        ],
        "level": "grad",
        "type": "math",
        "status": "empty"
      },
      {
        "slug": "graph-theory",
        "title": "图论基础",
        "prereq": [
          "math/eigen-decomposition"
        ],
        "level": "undergrad",
        "type": "math",
        "status": "empty"
      },
      {
        "slug": "game-theory-math",
        "title": "博弈论基础",
        "prereq": [
          "math/convex-optimization"
        ],
        "level": "grad",
        "type": "math",
        "status": "empty"
      },
      {
        "slug": "numerical-methods",
        "title": "数值方法",
        "prereq": [
          "math/matrix-decomposition",
          "math/multivariable-calculus",
          "math/ode-matrix-exponential"
        ],
        "level": "undergrad",
        "type": "math",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "classic",
    "title": "经典控制",
    "order": 2,
    "lessons": [
      {
        "slug": "system-modeling",
        "title": "系统建模",
        "subsections": [
          {
            "slug": "为什么需要数学建模",
            "title": "为什么需要数学建模"
          },
          {
            "slug": "从一个实际问题开始汽车悬挂",
            "title": "从一个实际问题开始：汽车悬挂"
          },
          {
            "slug": "旋转机械系统",
            "title": "旋转机械系统"
          },
          {
            "slug": "电气系统建模",
            "title": "电气系统建模"
          },
          {
            "slug": "机电类比同一个数学不同的物理",
            "title": "机电类比：同一个数学，不同的物理"
          },
          {
            "slug": "耦合系统直流电机",
            "title": "耦合系统：直流电机"
          },
          {
            "slug": "模型验证与简化",
            "title": "模型验证与简化"
          },
          {
            "slug": "跨领域建模控制理论远不止机械和电气",
            "title": "跨领域建模：控制理论远不止机械和电气"
          },
          {
            "slug": "建模方法论总结",
            "title": "建模方法论总结"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "math/ode-matrix-exponential",
          "math/multivariable-calculus"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "transfer-function",
        "title": "传递函数",
        "subsections": [
          {
            "slug": "方程有了然后呢",
            "title": "方程有了，然后呢？"
          },
          {
            "slug": "微分方程的困难",
            "title": "微分方程的困难"
          },
          {
            "slug": "拉普拉斯变换把微分变代数",
            "title": "拉普拉斯变换：把微分变代数"
          },
          {
            "slug": "传递函数的定义",
            "title": "传递函数的定义"
          },
          {
            "slug": "传递函数好在哪里",
            "title": "传递函数好在哪里"
          },
          {
            "slug": "二阶系统最重要的范例",
            "title": "二阶系统：最重要的范例"
          },
          {
            "slug": "从传递函数看频率响应",
            "title": "从传递函数看频率响应"
          },
          {
            "slug": "传递函数的局限",
            "title": "传递函数的局限"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "classic/system-modeling",
          "math/laplace-transform"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "time-domain-analysis",
        "title": "时域分析",
        "subsections": [
          {
            "slug": "为什么需要时域分析",
            "title": "为什么需要时域分析"
          },
          {
            "slug": "典型输入信号",
            "title": "典型输入信号"
          },
          {
            "slug": "一阶系统的阶跃响应",
            "title": "一阶系统的阶跃响应"
          },
          {
            "slug": "二阶系统阶跃响应",
            "title": "二阶系统阶跃响应"
          },
          {
            "slug": "动态性能指标",
            "title": "动态性能指标"
          },
          {
            "slug": "高阶系统与主导极点",
            "title": "高阶系统与主导极点"
          },
          {
            "slug": "工程实例悬挂系统时域分析",
            "title": "工程实例：悬挂系统时域分析"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "classic/transfer-function"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "stability-analysis",
        "title": "系统稳定性",
        "subsections": [
          {
            "slug": "为什么需要稳定性分析",
            "title": "为什么需要稳定性分析"
          },
          {
            "slug": "稳定性的定义",
            "title": "稳定性的定义"
          },
          {
            "slug": "routh判据",
            "title": "Routh判据"
          },
          {
            "slug": "routh判据的特殊情况",
            "title": "Routh判据的特殊情况"
          },
          {
            "slug": "routh判据的应用",
            "title": "Routh判据的应用"
          },
          {
            "slug": "hurwitz判据",
            "title": "Hurwitz判据"
          },
          {
            "slug": "从根轨迹看稳定性",
            "title": "从根轨迹看稳定性"
          },
          {
            "slug": "从频域看稳定性",
            "title": "从频域看稳定性"
          },
          {
            "slug": "工程实例倒立摆的稳定性",
            "title": "工程实例：倒立摆的稳定性"
          },
          {
            "slug": "时滞系统的稳定性",
            "title": "时滞系统的稳定性"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "classic/time-domain-analysis"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "frequency-domain-analysis",
        "title": "频域分析",
        "subsections": [
          {
            "slug": "为什么需要频域分析",
            "title": "为什么需要频域分析"
          },
          {
            "slug": "频率响应函数",
            "title": "频率响应函数"
          },
          {
            "slug": "bode-图",
            "title": "Bode 图"
          },
          {
            "slug": "在bode图上读取裕度",
            "title": "在Bode图上读取裕度"
          },
          {
            "slug": "nyquist-图",
            "title": "Nyquist 图"
          },
          {
            "slug": "在nyquist图上读取裕度",
            "title": "在Nyquist图上读取裕度"
          },
          {
            "slug": "稳定性判据",
            "title": "稳定性判据"
          },
          {
            "slug": "频域指标与时域指标的对应",
            "title": "频域指标与时域指标的对应"
          },
          {
            "slug": "工程实例",
            "title": "工程实例：RC 低通滤波器的频率分析"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "classic/transfer-function",
          "math/fourier-analysis"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "root-locus",
        "title": "根轨迹",
        "subsections": [
          {
            "slug": "为什么需要根轨迹法",
            "title": "为什么需要根轨迹法"
          },
          {
            "slug": "基本概念",
            "title": "基本概念"
          },
          {
            "slug": "根轨迹的数学基础",
            "title": "根轨迹的数学基础"
          },
          {
            "slug": "绘制规则",
            "title": "绘制规则"
          },
          {
            "slug": "完整绘制示例",
            "title": "完整绘制示例"
          },
          {
            "slug": "从根轨迹读取时域性能",
            "title": "从根轨迹读取时域性能"
          },
          {
            "slug": "用根轨迹设计控制器",
            "title": "用根轨迹设计控制器"
          },
          {
            "slug": "广义根轨迹",
            "title": "广义根轨迹"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "classic/stability-analysis"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "pid-controller",
        "title": "PID控制",
        "subsections": [
          {
            "slug": "为什么需要pid控制器",
            "title": "为什么需要PID控制器"
          },
          {
            "slug": "pid控制律",
            "title": "PID控制律"
          },
          {
            "slug": "比例控制p看见误差立即行动",
            "title": "比例控制P：看见误差，立即行动"
          },
          {
            "slug": "积分控制i记住历史消除残差",
            "title": "积分控制I：记住历史，消除残差"
          },
          {
            "slug": "微分控制d预判趋势提前刹车",
            "title": "微分控制D：预判趋势，提前刹车"
          },
          {
            "slug": "各项作用的物理直觉",
            "title": "各项作用的物理直觉"
          },
          {
            "slug": "pid参数整定方法",
            "title": "PID参数整定方法"
          },
          {
            "slug": "pid的工程实现",
            "title": "PID的工程实现"
          },
          {
            "slug": "工程实例直流电机转速控制",
            "title": "工程实例：直流电机转速控制"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "classic/time-domain-analysis",
          "classic/stability-analysis"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "compensator-design",
        "title": "校正网络",
        "subsections": [
          {
            "slug": "为什么需要校正网络",
            "title": "为什么需要校正网络"
          },
          {
            "slug": "校正的基本思路",
            "title": "校正的基本思路"
          },
          {
            "slug": "超前校正",
            "title": "超前校正"
          },
          {
            "slug": "滞后校正",
            "title": "滞后校正"
          },
          {
            "slug": "超前-滞后校正",
            "title": "超前-滞后校正"
          },
          {
            "slug": "校正方法的比较",
            "title": "校正方法的比较"
          },
          {
            "slug": "从根轨迹看校正",
            "title": "从根轨迹看校正"
          },
          {
            "slug": "工程实例电机速度控制设计",
            "title": "工程实例：电机速度控制设计"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "classic/frequency-domain-analysis",
          "classic/root-locus"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "frequency-response-design",
        "title": "回路整形",
        "subsections": [
          {
            "slug": "为什么需要频率响应法",
            "title": "为什么需要频率响应法"
          },
          {
            "slug": "增益裕度与相位裕度",
            "title": "增益裕度与相位裕度"
          },
          {
            "slug": "闭环频率响应",
            "title": "闭环频率响应"
          },
          {
            "slug": "时滞对频率响应的影响",
            "title": "时滞对频率响应的影响"
          },
          {
            "slug": "工程实例从bode图设计增益",
            "title": "工程实例：从Bode图设计增益"
          },
          {
            "slug": "工程应用ziegler-nichols-整定法",
            "title": "工程应用：Ziegler-Nichols整定法"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "classic/frequency-domain-analysis",
          "classic/compensator-design"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "design-methods-comparison",
        "title": "设计方法选型",
        "prereq": [
          "classic/pid-controller",
          "classic/compensator-design",
          "classic/frequency-response-design"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "classic-case-study",
        "title": "经典控制案例",
        "subsections": [
          {
            "slug": "问题描述",
            "title": "问题描述"
          },
          {
            "slug": "建立被控对象模型",
            "title": "建立被控对象模型"
          },
          {
            "slug": "设计指标",
            "title": "设计指标"
          },
          {
            "slug": "分析未校正系统",
            "title": "分析未校正系统"
          },
          {
            "slug": "控制器设计",
            "title": "控制器设计"
          },
          {
            "slug": "验证设计",
            "title": "验证设计"
          },
          {
            "slug": "鲁棒性检验",
            "title": "鲁棒性检验"
          },
          {
            "slug": "工程实现细节",
            "title": "工程实现细节"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "classic/system-modeling",
          "classic/pid-controller",
          "classic/frequency-response-design"
        ],
        "level": "undergrad",
        "type": "case",
        "status": "v1.3"
      }
    ]
  },
  {
    "slug": "modern",
    "title": "现代控制",
    "order": 3,
    "lessons": [
      {
        "slug": "state-space",
        "title": "状态空间",
        "subsections": [
          {
            "slug": "为什么需要状态空间表示",
            "title": "为什么需要状态空间表示"
          },
          {
            "slug": "状态变量的定义",
            "title": "状态变量的定义"
          },
          {
            "slug": "从物理系统建立状态空间模型",
            "title": "从物理系统建立状态空间模型"
          },
          {
            "slug": "从传递函数到状态空间",
            "title": "从传递函数到状态空间"
          },
          {
            "slug": "状态方程的求解",
            "title": "状态方程的求解"
          },
          {
            "slug": "状态空间与传递函数的关系",
            "title": "状态空间与传递函数的关系"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "math/ode-matrix-exponential",
          "classic/transfer-function"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "controllability-observability",
        "title": "可控性与可观性",
        "subsections": [
          {
            "slug": "为什么需要可控性与可观性",
            "title": "为什么需要可控性与可观性"
          },
          {
            "slug": "可控性",
            "title": "可控性"
          },
          {
            "slug": "可观性",
            "title": "可观性"
          },
          {
            "slug": "对偶原理",
            "title": "对偶原理"
          },
          {
            "slug": "可控可观分解与最小实现",
            "title": "可控/可观分解与最小实现"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "modern/state-space",
          "math/matrix-decomposition"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "lyapunov-modern",
        "title": "线性系统稳定性",
        "subsections": [
          {
            "slug": "为什么需要-lyapunov-理论",
            "title": "为什么需要 Lyapunov 理论"
          },
          {
            "slug": "lyapunov-稳定性理论",
            "title": "Lyapunov 稳定性理论"
          },
          {
            "slug": "内部稳定性与外部稳定性",
            "title": "内部稳定性与外部稳定性"
          },
          {
            "slug": "可稳定性与可检测性",
            "title": "可稳定性与可检测性"
          },
          {
            "slug": "lyapunov-方程与-lqr-的关系",
            "title": "Lyapunov 方程与 LQR 的关系"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "modern/state-space",
          "math/matrix-decomposition"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "state-feedback",
        "title": "状态反馈",
        "subsections": [
          {
            "slug": "状态反馈的基本概念",
            "title": "状态反馈的基本概念"
          },
          {
            "slug": "极点配置问题",
            "title": "极点配置问题"
          },
          {
            "slug": "一般系统的极点配置",
            "title": "一般系统的极点配置"
          },
          {
            "slug": "前馈补偿与参考跟踪",
            "title": "前馈补偿与参考跟踪"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "modern/controllability-observability",
          "modern/lyapunov-modern"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "state-observer",
        "title": "状态观测器",
        "subsections": [
          {
            "slug": "为什么需要状态观测器",
            "title": "为什么需要状态观测器"
          },
          {
            "slug": "全阶观测器的设计",
            "title": "全阶观测器的设计"
          },
          {
            "slug": "对偶原理",
            "title": "对偶原理"
          },
          {
            "slug": "基于观测器的控制器分离性原理",
            "title": "基于观测器的控制器——分离性原理"
          },
          {
            "slug": "降阶观测器",
            "title": "降阶观测器"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "modern/controllability-observability",
          "modern/state-feedback"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "optimal-control-basics",
        "title": "最优控制",
        "subsections": [
          {
            "slug": "为什么需要最优控制",
            "title": "为什么需要最优控制"
          },
          {
            "slug": "最优控制问题的数学表述",
            "title": "最优控制问题的数学表述"
          },
          {
            "slug": "变分法对泛函求极值",
            "title": "变分法：对泛函求极值"
          },
          {
            "slug": "hamilton-函数与极小值原理",
            "title": "Hamilton 函数与极小值原理"
          },
          {
            "slug": "最小时间问题与-bang-bang-控制",
            "title": "最小时间问题与 Bang-Bang 控制"
          },
          {
            "slug": "线性二次型最优控制引向-lqr",
            "title": "线性二次型最优控制——引向 LQR"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "modern/state-space",
          "math/variational-dp",
          "math/convex-optimization"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "lqr-controller",
        "title": "LQR控制",
        "subsections": [
          {
            "slug": "为什么需要-lqr",
            "title": "为什么需要 LQR"
          },
          {
            "slug": "有限时间-lq-问题",
            "title": "有限时间 LQ 问题"
          },
          {
            "slug": "无穷时间-lqr代数-riccati-方程",
            "title": "无穷时间 LQR——代数 Riccati 方程"
          },
          {
            "slug": "lqr-的鲁棒性",
            "title": "LQR 的鲁棒性"
          },
          {
            "slug": "q-和-r-的选择",
            "title": "Q 和 R 的选择"
          },
          {
            "slug": "lqr-与参考跟踪",
            "title": "LQR 与参考跟踪"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "modern/optimal-control-basics",
          "modern/lyapunov-modern"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "multivariable-systems",
        "title": "多变量系统",
        "subsections": [
          {
            "slug": "为什么需要多变量分析",
            "title": "为什么需要多变量分析"
          },
          {
            "slug": "mimo-极点与零点",
            "title": "MIMO 极点与零点"
          },
          {
            "slug": "交互分析与-rga",
            "title": "交互分析与 RGA"
          },
          {
            "slug": "解耦控制",
            "title": "解耦控制"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "modern/state-space",
          "classic/frequency-domain-analysis",
          "math/matrix-decomposition"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "modern-case-study",
        "title": "现代控制案例",
        "subsections": [
          {
            "slug": "问题描述",
            "title": "问题描述"
          },
          {
            "slug": "第一步建立状态空间模型",
            "title": "第一步：建立状态空间模型"
          },
          {
            "slug": "第二步分析系统性质",
            "title": "第二步：分析系统性质"
          },
          {
            "slug": "第三步状态反馈设计",
            "title": "第三步：状态反馈设计"
          },
          {
            "slug": "第四步观测器设计",
            "title": "第四步：观测器设计"
          },
          {
            "slug": "第五步处理噪声卡尔曼滤波与-lqg",
            "title": "第五步：处理噪声——卡尔曼滤波与 LQG"
          },
          {
            "slug": "第六步稳定性验证lyapunov-方程",
            "title": "第六步：稳定性验证——Lyapunov 方程"
          },
          {
            "slug": "第七步mimo-扩展rga-分析",
            "title": "第七步：MIMO 扩展——RGA 分析"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "modern/state-feedback",
          "modern/state-observer",
          "modern/lqr-controller",
          "modern/multivariable-systems"
        ],
        "level": "grad",
        "type": "case",
        "status": "draft"
      }
    ]
  },
  {
    "slug": "nonlinear",
    "title": "非线性控制",
    "order": 4,
    "lessons": [
      {
        "slug": "nonlinear-characteristics",
        "title": "非线性系统",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "什么是非线性系统",
            "title": "什么是非线性系统？"
          },
          {
            "slug": "常见非线性类型",
            "title": "常见非线性类型"
          },
          {
            "slug": "非线性的分类",
            "title": "非线性的分类"
          },
          {
            "slug": "为什么线性化会失效",
            "title": "为什么线性化会失效？"
          },
          {
            "slug": "何时需要非线性分析",
            "title": "何时需要非线性分析？"
          },
          {
            "slug": "实例与案例",
            "title": "实例与案例"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "modern/state-space",
          "math/ode-matrix-exponential"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "phase-plane",
        "title": "相平面",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "相平面与向量场",
            "title": "相平面与向量场"
          },
          {
            "slug": "nullcline-与平衡点",
            "title": "Nullcline 与平衡点"
          },
          {
            "slug": "平衡点分类迹-行列式平面",
            "title": "平衡点分类：迹-行列式平面"
          },
          {
            "slug": "线性化何时失效",
            "title": "线性化何时失效"
          },
          {
            "slug": "手算例非线性振子的完整相平面",
            "title": "手算例：非线性振子的完整相平面"
          },
          {
            "slug": "鞍点分界线与吸引域",
            "title": "鞍点分界线与吸引域"
          },
          {
            "slug": "poincaré-bendixson-定理与极限环",
            "title": "Poincaré-Bendixson 定理与极限环"
          },
          {
            "slug": "应用案例",
            "title": "应用案例"
          },
          {
            "slug": "高维推广poincaré-截面与-floquet-乘子",
            "title": "高维推广：Poincaré 截面与 Floquet 乘子"
          },
          {
            "slug": "分岔相图的拓扑突变",
            "title": "分岔：相图的拓扑突变"
          },
          {
            "slug": "局限性讨论",
            "title": "局限性讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "nonlinear/nonlinear-characteristics",
          "math/eigen-decomposition"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "lyapunov-stability",
        "title": "Lyapunov稳定性",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "稳定性定义",
            "title": "稳定性定义"
          },
          {
            "slug": "李雅普诺夫直接法",
            "title": "李雅普诺夫直接法"
          },
          {
            "slug": "手算例子非线性弹簧-质量系统",
            "title": "手算例子：非线性弹簧-质量系统"
          },
          {
            "slug": "lasalle-不变集原理",
            "title": "LaSalle 不变集原理"
          },
          {
            "slug": "李雅普诺夫间接法",
            "title": "李雅普诺夫间接法"
          },
          {
            "slug": "李雅普诺夫函数的构造方法",
            "title": "李雅普诺夫函数的构造方法"
          },
          {
            "slug": "吸引域估计",
            "title": "吸引域估计"
          },
          {
            "slug": "应用案例",
            "title": "应用案例"
          },
          {
            "slug": "何时失效",
            "title": "何时失效？"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "nonlinear/phase-plane",
          "modern/lyapunov-modern",
          "math/multivariable-calculus"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "describing-function",
        "title": "描述函数",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "描述函数的定义与滤波假设",
            "title": "描述函数的定义与滤波假设"
          },
          {
            "slug": "常见非线性的描述函数",
            "title": "常见非线性的描述函数"
          },
          {
            "slug": "谐波平衡与极限环预测",
            "title": "谐波平衡与极限环预测"
          },
          {
            "slug": "极限环的稳定性判据",
            "title": "极限环的稳定性判据"
          },
          {
            "slug": "应用案例",
            "title": "应用案例"
          },
          {
            "slug": "何时失效",
            "title": "何时失效"
          },
          {
            "slug": "与其他非线性方法的接口",
            "title": "与其他非线性方法的接口"
          },
          {
            "slug": "局限性讨论",
            "title": "局限性讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "nonlinear/nonlinear-characteristics",
          "classic/frequency-domain-analysis"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "feedback-linearization",
        "title": "反馈线性化",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "仿射非线性系统与lie导数",
            "title": "仿射非线性系统与Lie导数"
          },
          {
            "slug": "相对阶严格定义",
            "title": "相对阶严格定义"
          },
          {
            "slug": "输入-输出线性化",
            "title": "输入-输出线性化"
          },
          {
            "slug": "零动态与内部稳定性",
            "title": "零动态与内部稳定性"
          },
          {
            "slug": "全状态线性化",
            "title": "全状态线性化"
          },
          {
            "slug": "坐标变换到brunovsky标准型",
            "title": "坐标变换到Brunovsky标准型"
          },
          {
            "slug": "应用案例倒立摆镇定",
            "title": "应用案例：倒立摆镇定"
          },
          {
            "slug": "应用案例球-梁系统",
            "title": "应用案例：球-梁系统"
          },
          {
            "slug": "应用案例机器人计算力矩控制",
            "title": "应用案例：机器人计算力矩控制"
          },
          {
            "slug": "与jacobian线性化的对比",
            "title": "与Jacobian线性化的对比"
          },
          {
            "slug": "局限性讨论",
            "title": "局限性讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "nonlinear/lyapunov-stability",
          "math/diff-geometry"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "sliding-mode-control",
        "title": "滑模控制",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "滑模控制的基本概念",
            "title": "滑模控制的基本概念"
          },
          {
            "slug": "二阶系统的滑模控制器设计",
            "title": "二阶系统的滑模控制器设计"
          },
          {
            "slug": "手算例子倒立摆镇定",
            "title": "手算例子：倒立摆镇定"
          },
          {
            "slug": "抖振现象与抑制策略",
            "title": "抖振现象与抑制策略"
          },
          {
            "slug": "到达律方法",
            "title": "到达律方法"
          },
          {
            "slug": "匹配与不匹配不确定性",
            "title": "匹配与不匹配不确定性"
          },
          {
            "slug": "应用案例",
            "title": "应用案例"
          },
          {
            "slug": "与其他非线性控制方法的对比",
            "title": "与其他非线性控制方法的对比"
          },
          {
            "slug": "局限性讨论",
            "title": "局限性讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "nonlinear/lyapunov-stability"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "backstepping",
        "title": "反步设计",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "严格反馈系统",
            "title": "严格反馈系统"
          },
          {
            "slug": "二阶系统的反步法设计",
            "title": "二阶系统的反步法设计"
          },
          {
            "slug": "手算例子",
            "title": "手算例子"
          },
          {
            "slug": "n阶系统的反步法设计",
            "title": "n阶系统的反步法设计"
          },
          {
            "slug": "处理参数不确定性",
            "title": "处理参数不确定性"
          },
          {
            "slug": "应用案例",
            "title": "应用案例"
          },
          {
            "slug": "与其他非线性控制方法的对比",
            "title": "与其他非线性控制方法的对比"
          },
          {
            "slug": "局限性讨论",
            "title": "局限性讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "nonlinear/lyapunov-stability",
          "math/multivariable-calculus"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "adaptive-control-basics",
        "title": "自适应控制",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "自适应控制的基本概念",
            "title": "自适应控制的基本概念"
          },
          {
            "slug": "模型参考自适应控制mrac",
            "title": "模型参考自适应控制（MRAC）"
          },
          {
            "slug": "手算例子一阶系统的mrac设计",
            "title": "手算例子：一阶系统的MRAC设计"
          },
          {
            "slug": "高阶系统的mrac设计",
            "title": "高阶系统的MRAC设计"
          },
          {
            "slug": "自整定调节器str",
            "title": "自整定调节器（STR）"
          },
          {
            "slug": "处理参数不确定性",
            "title": "处理参数不确定性"
          },
          {
            "slug": "应用案例",
            "title": "应用案例"
          },
          {
            "slug": "与其他非线性控制方法的对比",
            "title": "与其他非线性控制方法的对比"
          },
          {
            "slug": "局限性讨论",
            "title": "局限性讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "nonlinear/lyapunov-stability",
          "modern/state-feedback"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "passivity-control",
        "title": "无源控制",
        "prereq": [
          "nonlinear/lyapunov-stability",
          "modern/multivariable-systems"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "iss-small-gain",
        "title": "输入状态稳定性",
        "prereq": [
          "nonlinear/lyapunov-stability",
          "classic/frequency-domain-analysis"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "switched-hybrid-systems",
        "title": "切换与混杂系统",
        "prereq": [
          "nonlinear/lyapunov-stability"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "bifurcation-chaos",
        "title": "分岔与混沌",
        "prereq": [
          "nonlinear/phase-plane",
          "math/numerical-methods"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "discrete-sampled",
    "title": "离散控制",
    "order": 5,
    "lessons": [
      {
        "slug": "discrete-time-freq",
        "title": "采样与量化",
        "subsections": [
          {
            "slug": "采样过程",
            "title": "采样过程"
          },
          {
            "slug": "混叠",
            "title": "混叠"
          },
          {
            "slug": "采样保持器",
            "title": "采样保持器"
          },
          {
            "slug": "量化",
            "title": "量化"
          },
          {
            "slug": "设计实例",
            "title": "设计实例"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "classic/frequency-domain-analysis",
          "math/fourier-analysis"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "discrete-time-systems",
        "title": "离散时间系统",
        "prereq": [
          "discrete-sampled/discrete-time-freq",
          "modern/state-space",
          "math/z-transform"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "difference-equation",
        "title": "差分方程",
        "prereq": [
          "discrete-sampled/discrete-time-systems",
          "math/z-transform"
        ],
        "level": "undergrad",
        "type": "math",
        "status": "empty"
      },
      {
        "slug": "z-transform-analysis",
        "title": "Z域系统分析",
        "subsections": [
          {
            "slug": "z-变换的定义",
            "title": "Z变换的定义"
          },
          {
            "slug": "常用变换对",
            "title": "常用变换对"
          },
          {
            "slug": "z-变换的性质",
            "title": "Z变换的性质"
          },
          {
            "slug": "逆-z-变换",
            "title": "逆Z变换"
          },
          {
            "slug": "zzz-平面与-sss-平面的映射",
            "title": "z平面与s平面的映射"
          },
          {
            "slug": "脉冲传递函数",
            "title": "脉冲传递函数"
          },
          {
            "slug": "差分方程实现",
            "title": "差分方程实现"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "discrete-sampled/discrete-time-freq",
          "discrete-sampled/difference-equation",
          "classic/transfer-function"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "discrete-stability-criteria",
        "title": "离散系统稳定性",
        "subsections": [
          {
            "slug": "z-域稳定性条件",
            "title": "z域稳定性条件"
          },
          {
            "slug": "jury-稳定性判据",
            "title": "Jury稳定性判据"
          },
          {
            "slug": "w-变换与-routh-判据",
            "title": "w变换与Routh判据"
          },
          {
            "slug": "采样周期对稳定性的影响",
            "title": "采样周期对稳定性的影响"
          },
          {
            "slug": "离散系统的稳定裕度",
            "title": "离散系统的稳定裕度"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "discrete-sampled/z-transform-analysis",
          "modern/lyapunov-modern"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "discretization-methods",
        "title": "离散化方法",
        "subsections": [
          {
            "slug": "离散化方法",
            "title": "离散化方法"
          },
          {
            "slug": "直接数字设计",
            "title": "直接数字设计"
          },
          {
            "slug": "数字-pid-工程实现",
            "title": "数字PID工程实现"
          },
          {
            "slug": "设计实例电机速度控制",
            "title": "设计实例"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "discrete-sampled/discrete-time-freq",
          "discrete-sampled/discrete-time-systems",
          "math/numerical-methods",
          "discrete-sampled/z-transform-analysis"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "sampling-period-selection",
        "title": "采样周期",
        "subsections": [
          {
            "slug": "采样周期的影响",
            "title": "采样周期的影响"
          },
          {
            "slug": "采样周期选择方法",
            "title": "采样周期选择方法"
          },
          {
            "slug": "多速率采样系统",
            "title": "多速率采样系统"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "discrete-sampled/discrete-stability-criteria",
          "discrete-sampled/discretization-methods"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "draft"
      },
      {
        "slug": "sampled-data-systems",
        "title": "采样数据系统",
        "prereq": [
          "discrete-sampled/discretization-methods",
          "discrete-sampled/sampling-period-selection"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "discrete-optimal-control",
        "title": "离散最优控制",
        "prereq": [
          "discrete-sampled/discrete-stability-criteria",
          "modern/lqr-controller"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "event-triggered-control",
        "title": "事件触发控制",
        "prereq": [
          "discrete-sampled/sampled-data-systems",
          "nonlinear/lyapunov-stability"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "implementation",
    "title": "控制实现",
    "order": 6,
    "lessons": [
      {
        "slug": "computer-control-architecture",
        "title": "控制系统架构",
        "subsections": [
          {
            "slug": "计算机控制系统的硬件组成",
            "title": "计算机控制系统的硬件组成"
          },
          {
            "slug": "软件架构与实时性",
            "title": "软件架构与实时性"
          },
          {
            "slug": "通信系统与网络",
            "title": "通信系统与网络"
          },
          {
            "slug": "系统架构类型",
            "title": "系统架构类型"
          },
          {
            "slug": "工程选型方法",
            "title": "工程选型方法"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "discrete-sampled/discrete-time-freq",
          "modern/state-space",
          "discrete-sampled/discretization-methods"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "draft"
      },
      {
        "slug": "digital-pid",
        "title": "数字PID",
        "subsections": [
          {
            "slug": "三种实现形式",
            "title": "三种实现形式"
          },
          {
            "slug": "pid-改进结构",
            "title": "PID改进结构"
          },
          {
            "slug": "级联-pid",
            "title": "级联PID"
          },
          {
            "slug": "数字-pid-调参",
            "title": "数字PID调参"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "classic/pid-controller",
          "discrete-sampled/discretization-methods",
          "implementation/computer-control-architecture",
          "discrete-sampled/discrete-stability-criteria"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "draft"
      },
      {
        "slug": "pid-engineering-tuning",
        "title": "PID工程整定",
        "prereq": [
          "implementation/digital-pid",
          "classic/time-domain-analysis"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "empty"
      },
      {
        "slug": "controller-discretization-practice",
        "title": "控制器部署",
        "prereq": [
          "discrete-sampled/discretization-methods",
          "implementation/computer-control-architecture",
          "math/numerical-methods",
          "implementation/digital-pid"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "empty"
      },
      {
        "slug": "embedded-implementation",
        "title": "嵌入式控制",
        "prereq": [
          "implementation/controller-discretization-practice"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "empty"
      },
      {
        "slug": "realtime-control",
        "title": "实时控制",
        "subsections": [
          {
            "slug": "实时系统的基本概念",
            "title": "实时系统的基本概念"
          },
          {
            "slug": "任务调度算法",
            "title": "任务调度算法"
          },
          {
            "slug": "中断处理与优先级",
            "title": "中断处理与优先级"
          },
          {
            "slug": "嵌入式实现技巧",
            "title": "嵌入式实现技巧"
          },
          {
            "slug": "性能优化",
            "title": "性能优化"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "implementation/embedded-implementation",
          "discrete-sampled/sampling-period-selection"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "draft"
      },
      {
        "slug": "networked-control",
        "title": "网络控制",
        "prereq": [
          "implementation/realtime-control",
          "discrete-sampled/sampled-data-systems"
        ],
        "level": "grad",
        "type": "impl",
        "status": "empty"
      },
      {
        "slug": "industrial-bus-protocols",
        "title": "工业通信",
        "prereq": [
          "implementation/computer-control-architecture",
          "implementation/realtime-control"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "empty"
      },
      {
        "slug": "hil-rapid-prototyping",
        "title": "半实物仿真",
        "prereq": [
          "implementation/controller-discretization-practice",
          "implementation/realtime-control"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "empty"
      },
      {
        "slug": "implementation-case-study",
        "title": "控制实现案例",
        "prereq": [
          "implementation/pid-engineering-tuning",
          "implementation/industrial-bus-protocols",
          "implementation/hil-rapid-prototyping"
        ],
        "level": "undergrad",
        "type": "case",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "machine-learning",
    "title": "机器学习",
    "order": 7,
    "lessons": [
      {
        "slug": "learning-problem",
        "title": "学习问题与泛化",
        "prereq": [
          "math/probability-basics",
          "math/linear-algebra-basics"
        ],
        "level": "undergrad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "supervised-learning",
        "title": "监督学习",
        "prereq": [
          "machine-learning/learning-problem",
          "math/convex-optimization"
        ],
        "level": "undergrad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "neural-networks",
        "title": "神经网络基础",
        "prereq": [
          "machine-learning/supervised-learning",
          "math/multivariable-calculus"
        ],
        "level": "undergrad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "autodiff-optimization",
        "title": "自动微分与训练",
        "prereq": [
          "machine-learning/neural-networks",
          "math/numerical-methods"
        ],
        "level": "undergrad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "sequence-models",
        "title": "时序模型",
        "prereq": [
          "machine-learning/autodiff-optimization",
          "math/stochastic-processes"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "attention-transformers",
        "title": "注意力机制",
        "prereq": [
          "machine-learning/sequence-models"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "representation-learning",
        "title": "表征学习",
        "prereq": [
          "machine-learning/autodiff-optimization",
          "machine-learning/attention-transformers"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "generative-models",
        "title": "扩散与流匹配",
        "prereq": [
          "machine-learning/autodiff-optimization",
          "math/stochastic-processes",
          "math/ode-matrix-exponential"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "learning-evaluation",
        "title": "学习实验评估",
        "prereq": [
          "machine-learning/supervised-learning",
          "math/probability-basics"
        ],
        "level": "undergrad",
        "type": "learning",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "identification",
    "title": "系统辨识",
    "order": 8,
    "lessons": [
      {
        "slug": "identification-framework",
        "title": "系统辨识框架",
        "prereq": [
          "discrete-sampled/discrete-time-systems",
          "math/probability-basics"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "model-structures",
        "title": "辨识模型",
        "prereq": [
          "identification/identification-framework",
          "discrete-sampled/difference-equation"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "least-squares-rls",
        "title": "最小二乘辨识",
        "prereq": [
          "identification/model-structures",
          "math/matrix-decomposition",
          "math/probability-basics"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "persistent-excitation",
        "title": "持久激励",
        "prereq": [
          "identification/least-squares-rls"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "instrumental-variable",
        "title": "闭环辨识",
        "prereq": [
          "identification/persistent-excitation",
          "classic/transfer-function",
          "math/stochastic-processes",
          "classic/pid-controller"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "frequency-domain-id",
        "title": "频域辨识",
        "prereq": [
          "identification/model-structures",
          "classic/frequency-domain-analysis",
          "math/stochastic-processes",
          "classic/frequency-response-design"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "subspace-id",
        "title": "子空间辨识",
        "prereq": [
          "identification/least-squares-rls",
          "modern/controllability-observability",
          "math/matrix-decomposition"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "nonlinear-data-driven-id",
        "title": "非线性辨识",
        "prereq": [
          "identification/persistent-excitation",
          "machine-learning/autodiff-optimization",
          "machine-learning/sequence-models",
          "nonlinear/nonlinear-characteristics"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "identification-case-study",
        "title": "系统辨识案例",
        "prereq": [
          "identification/instrumental-variable",
          "identification/frequency-domain-id",
          "machine-learning/learning-evaluation"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "estimation",
    "title": "状态估计",
    "order": 9,
    "lessons": [
      {
        "slug": "estimation-problem",
        "title": "状态估计框架",
        "prereq": [
          "modern/state-observer",
          "math/stochastic-processes",
          "discrete-sampled/discrete-time-systems"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "least-squares-ml",
        "title": "统计估计",
        "prereq": [
          "estimation/estimation-problem",
          "math/convex-optimization",
          "math/probability-basics"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "kalman-filter",
        "title": "卡尔曼滤波",
        "subsections": [
          {
            "slug": "为什么需要卡尔曼滤波",
            "title": "为什么需要卡尔曼滤波"
          },
          {
            "slug": "随机系统模型",
            "title": "随机系统模型"
          },
          {
            "slug": "卡尔曼滤波的结构",
            "title": "卡尔曼滤波的结构"
          },
          {
            "slug": "卡尔曼增益的推导",
            "title": "卡尔曼增益的推导"
          },
          {
            "slug": "稳态卡尔曼滤波",
            "title": "稳态卡尔曼滤波"
          },
          {
            "slug": "对偶性卡尔曼滤波-vs-lqr",
            "title": "对偶性：卡尔曼滤波 vs LQR"
          },
          {
            "slug": "lqg-控制",
            "title": "LQG 控制"
          },
          {
            "slug": "q-和-r-的选择",
            "title": "Q 和 R 的选择"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "estimation/least-squares-ml",
          "modern/controllability-observability",
          "math/stochastic-processes"
        ],
        "level": "grad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "extended-kalman-filter",
        "title": "扩展卡尔曼滤波",
        "prereq": [
          "estimation/kalman-filter",
          "math/multivariable-calculus",
          "nonlinear/lyapunov-stability"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "unscented-kalman-filter",
        "title": "无迹卡尔曼滤波",
        "prereq": [
          "estimation/kalman-filter",
          "math/probability-basics"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "particle-filter",
        "title": "粒子滤波",
        "prereq": [
          "estimation/estimation-problem",
          "math/stochastic-processes",
          "math/numerical-methods"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "sensor-fusion",
        "title": "多传感器融合",
        "prereq": [
          "estimation/kalman-filter",
          "estimation/extended-kalman-filter"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "estimation-case-study",
        "title": "状态估计案例",
        "prereq": [
          "estimation/sensor-fusion",
          "estimation/particle-filter"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "robust",
    "title": "鲁棒控制",
    "order": 10,
    "lessons": [
      {
        "slug": "robustness-concept",
        "title": "鲁棒性",
        "subsections": [
          {
            "slug": "什么是鲁棒性",
            "title": "什么是鲁棒性"
          },
          {
            "slug": "不确定性的分类",
            "title": "不确定性的分类"
          },
          {
            "slug": "灵敏度函数",
            "title": "灵敏度函数"
          },
          {
            "slug": "hmathcalh_inftyh-范数",
            "title": "H∞范数"
          },
          {
            "slug": "小增益定理",
            "title": "小增益定理"
          },
          {
            "slug": "回顾lqr-的鲁棒性",
            "title": "回顾：LQR的鲁棒性"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "classic/frequency-response-design",
          "modern/multivariable-systems"
        ],
        "level": "grad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "uncertainty-modeling",
        "title": "不确定性建模",
        "subsections": [
          {
            "slug": "加性与乘性不确定性",
            "title": "加性与乘性不确定性"
          },
          {
            "slug": "互质分解不确定性",
            "title": "互质分解不确定性"
          },
          {
            "slug": "lft-系统构造",
            "title": "LFT系统构造"
          },
          {
            "slug": "mimo-不确定性结构",
            "title": "MIMO不确定性结构"
          },
          {
            "slug": "实参数不确定性的处理",
            "title": "实参数不确定性的处理"
          },
          {
            "slug": "不确定性验证",
            "title": "不确定性验证"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "robust/robustness-concept",
          "math/matrix-decomposition"
        ],
        "level": "grad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "robust-stability",
        "title": "鲁棒稳定性",
        "subsections": [
          {
            "slug": "从稳定裕度到鲁棒稳定性",
            "title": "从稳定裕度到鲁棒稳定性"
          },
          {
            "slug": "参数空间方法",
            "title": "参数空间方法"
          },
          {
            "slug": "lyapunov-方法二次稳定性",
            "title": "Lyapunov方法：二次稳定性"
          },
          {
            "slug": "频域鲁棒分析",
            "title": "频域鲁棒分析"
          },
          {
            "slug": "实用方法monte-carlo-仿真",
            "title": "实用方法：Monte Carlo仿真"
          },
          {
            "slug": "方法对比与决策流程",
            "title": "方法对比与决策流程"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "robust/uncertainty-modeling",
          "nonlinear/iss-small-gain"
        ],
        "level": "grad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "robust-performance",
        "title": "鲁棒性能",
        "subsections": [
          {
            "slug": "从鲁棒稳定性到鲁棒性能",
            "title": "从鲁棒稳定性到鲁棒性能"
          },
          {
            "slug": "μ-鲁棒性能定理",
            "title": "μ鲁棒性能定理"
          },
          {
            "slug": "三个条件的定量关系",
            "title": "三个条件的定量关系"
          },
          {
            "slug": "混合灵敏度与鲁棒性能的关系",
            "title": "混合灵敏度与鲁棒性能的关系"
          },
          {
            "slug": "性能权重的工程选择",
            "title": "性能权重的工程选择"
          },
          {
            "slug": "设计实例",
            "title": "设计实例"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "robust/robust-stability",
          "classic/frequency-domain-analysis"
        ],
        "level": "grad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "h-infinity-basics",
        "title": "H∞控制",
        "subsections": [
          {
            "slug": "从分析到综合",
            "title": "从分析到综合"
          },
          {
            "slug": "加权函数",
            "title": "加权函数"
          },
          {
            "slug": "标准-hmathcalh_inftyh-问题",
            "title": "标准H∞问题"
          },
          {
            "slug": "求解方法概述",
            "title": "求解方法概述"
          },
          {
            "slug": "回路整形设计实例",
            "title": "回路整形设计实例"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "robust/robust-performance",
          "modern/lqr-controller",
          "math/convex-optimization"
        ],
        "level": "grad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "mixed-sensitivity",
        "title": "混合灵敏度",
        "subsections": [
          {
            "slug": "混合灵敏度问题深入",
            "title": "混合灵敏度问题深入"
          },
          {
            "slug": "广义被控对象构造",
            "title": "广义被控对象构造"
          },
          {
            "slug": "权重函数选择方法论",
            "title": "权重函数选择方法论"
          },
          {
            "slug": "h-综合求解方法",
            "title": "H∞综合求解方法"
          },
          {
            "slug": "设计实例",
            "title": "设计实例"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "robust/h-infinity-basics",
          "classic/frequency-response-design"
        ],
        "level": "grad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "mu-analysis",
        "title": "结构奇异值",
        "prereq": [
          "robust/uncertainty-modeling",
          "robust/robust-performance",
          "math/matrix-decomposition"
        ],
        "level": "advanced",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "mu-synthesis",
        "title": "μ综合",
        "subsections": [
          {
            "slug": "为什么-h-不够",
            "title": "为什么H∞不够"
          },
          {
            "slug": "结构化不确定性",
            "title": "结构化不确定性"
          },
          {
            "slug": "结构化奇异值-μ",
            "title": "结构化奇异值μ"
          },
          {
            "slug": "μ-鲁棒稳定性与鲁棒性能",
            "title": "μ鲁棒稳定性与鲁棒性能"
          },
          {
            "slug": "d-k-迭代",
            "title": "D-K迭代"
          },
          {
            "slug": "不确定性建模",
            "title": "不确定性建模"
          },
          {
            "slug": "设计实例",
            "title": "设计实例"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "robust/mu-analysis",
          "robust/h-infinity-basics"
        ],
        "level": "advanced",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "h-infinity-filter",
        "title": "H∞滤波",
        "prereq": [
          "robust/h-infinity-basics",
          "estimation/kalman-filter"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "delay-robust-control",
        "title": "时滞系统控制",
        "prereq": [
          "robust/robust-stability",
          "nonlinear/lyapunov-stability"
        ],
        "level": "advanced",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "robust-case-study",
        "title": "鲁棒控制案例",
        "subsections": [
          {
            "slug": "问题描述",
            "title": "问题描述"
          },
          {
            "slug": "不确定性分析",
            "title": "不确定性分析"
          },
          {
            "slug": "设计需求",
            "title": "设计需求"
          },
          {
            "slug": "h-混合灵敏度设计",
            "title": "H∞混合灵敏度设计"
          },
          {
            "slug": "μ-分析验证",
            "title": "μ分析验证"
          },
          {
            "slug": "μ-综合改进",
            "title": "μ综合改进"
          },
          {
            "slug": "monte-carlo-验证",
            "title": "Monte Carlo验证"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "robust/mixed-sensitivity",
          "robust/mu-synthesis"
        ],
        "level": "grad",
        "type": "case",
        "status": "draft"
      }
    ]
  },
  {
    "slug": "mpc",
    "title": "预测控制",
    "order": 11,
    "lessons": [
      {
        "slug": "mpc-principle",
        "title": "预测控制原理",
        "subsections": [
          {
            "slug": "mpc的三大核心思想",
            "title": "MPC的三大核心思想"
          },
          {
            "slug": "线性mpc的数学公式",
            "title": "线性MPC的数学公式"
          },
          {
            "slug": "mpc与lqr的区别",
            "title": "MPC与LQR的区别"
          },
          {
            "slug": "稳定性分析",
            "title": "稳定性分析"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "discrete-sampled/discrete-optimal-control",
          "math/convex-optimization",
          "estimation/kalman-filter"
        ],
        "level": "grad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "prediction-model",
        "title": "预测模型",
        "subsections": [
          {
            "slug": "状态空间预测模型",
            "title": "状态空间预测模型"
          },
          {
            "slug": "阶跃响应模型",
            "title": "阶跃响应模型"
          },
          {
            "slug": "carima模型",
            "title": "CARIMA模型"
          },
          {
            "slug": "三种模型的对比",
            "title": "三种模型的对比"
          },
          {
            "slug": "模型辨识基础",
            "title": "模型辨识基础"
          },
          {
            "slug": "模型失配与鲁棒性",
            "title": "模型失配与鲁棒性"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "mpc/mpc-principle",
          "identification/model-structures"
        ],
        "level": "grad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "receding-horizon",
        "title": "滚动优化",
        "subsections": [
          {
            "slug": "开环最优-vs-滚动优化",
            "title": "开环最优vs滚动优化"
          },
          {
            "slug": "滚动优化的数学机制",
            "title": "滚动优化的数学机制"
          },
          {
            "slug": "预测时域与控制时域",
            "title": "预测时域与控制时域"
          },
          {
            "slug": "滚动优化与稳定性",
            "title": "滚动优化与稳定性"
          },
          {
            "slug": "qp求解与实时性",
            "title": "QP求解与实时性"
          },
          {
            "slug": "warm-starting策略",
            "title": "Warm Starting策略"
          },
          {
            "slug": "显式mpc",
            "title": "显式MPC"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "mpc/prediction-model",
          "math/convex-optimization"
        ],
        "level": "grad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "constraint-handling",
        "title": "约束处理",
        "subsections": [
          {
            "slug": "约束类型与数学表达",
            "title": "约束类型与数学表达"
          },
          {
            "slug": "约束到qp标准形式的转化",
            "title": "约束到QP标准形式的转化"
          },
          {
            "slug": "硬约束与软约束",
            "title": "硬约束与软约束"
          },
          {
            "slug": "约束优化的最优性条件",
            "title": "约束优化的最优性条件"
          },
          {
            "slug": "约束可行性与不可行性",
            "title": "约束可行性与不可行性"
          },
          {
            "slug": "约束活性与工况变化",
            "title": "约束活性与工况变化"
          },
          {
            "slug": "工程中的约束处理策略",
            "title": "工程中的约束处理策略"
          },
          {
            "slug": "交互式可视化",
            "title": "交互式可视化"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "mpc/receding-horizon"
        ],
        "level": "grad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "mpc-stability",
        "title": "递归可行性与稳定性",
        "prereq": [
          "mpc/constraint-handling",
          "nonlinear/lyapunov-stability"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "generalized-predictive-control",
        "title": "广义预测控制",
        "subsections": [
          {
            "slug": "carima-模型回顾",
            "title": "CARIMA模型回顾"
          },
          {
            "slug": "diophantine-方程",
            "title": "Diophantine方程"
          },
          {
            "slug": "j-步-ahead-预测",
            "title": "j步ahead预测"
          },
          {
            "slug": "gpc-代价函数",
            "title": "GPC代价函数"
          },
          {
            "slug": "gpc-解析解",
            "title": "GPC解析解"
          },
          {
            "slug": "数值例子-1",
            "title": "数值例子"
          },
          {
            "slug": "gpc-与经典控制的关系",
            "title": "GPC与经典控制的关系"
          },
          {
            "slug": "gpc-调参方法",
            "title": "GPC调参方法"
          },
          {
            "slug": "约束-gpc",
            "title": "约束GPC"
          },
          {
            "slug": "稳定性分析",
            "title": "稳定性分析"
          },
          {
            "slug": "交互式可视化",
            "title": "交互式可视化"
          },
          {
            "slug": "工业应用",
            "title": "工业应用"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "mpc/receding-horizon",
          "identification/least-squares-rls"
        ],
        "level": "grad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "explicit-mpc",
        "title": "显式预测控制",
        "prereq": [
          "mpc/constraint-handling",
          "math/convex-optimization"
        ],
        "level": "advanced",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "nonlinear-mpc",
        "title": "非线性预测控制",
        "subsections": [
          {
            "slug": "为什么需要-nmpc",
            "title": "为什么需要NMPC"
          },
          {
            "slug": "非线性预测模型",
            "title": "非线性预测模型"
          },
          {
            "slug": "nmpc-优化问题",
            "title": "NMPC优化问题"
          },
          {
            "slug": "sqp-求解",
            "title": "SQP求解"
          },
          {
            "slug": "实时迭代方案",
            "title": "实时迭代方案"
          },
          {
            "slug": "lyapunov-based-nmpc",
            "title": "Lyapunov-based NMPC"
          },
          {
            "slug": "稳定性分析",
            "title": "稳定性分析"
          },
          {
            "slug": "数值例子非线性摆",
            "title": "数值例子"
          },
          {
            "slug": "多稳态系统的-nmpc",
            "title": "多稳态系统的NMPC"
          },
          {
            "slug": "交互式可视化",
            "title": "交互式可视化"
          },
          {
            "slug": "软件工具",
            "title": "软件工具"
          },
          {
            "slug": "工业应用",
            "title": "工业应用"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "mpc/mpc-stability",
          "nonlinear/nonlinear-characteristics",
          "math/numerical-methods"
        ],
        "level": "advanced",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "economic-mpc",
        "title": "经济预测控制",
        "prereq": [
          "mpc/nonlinear-mpc",
          "nonlinear/passivity-control"
        ],
        "level": "advanced",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "mhe-fusion",
        "title": "移动水平估计",
        "prereq": [
          "mpc/receding-horizon",
          "estimation/sensor-fusion"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "mpc-case-study",
        "title": "预测控制案例",
        "subsections": [
          {
            "slug": "问题描述",
            "title": "问题描述"
          },
          {
            "slug": "建立被控对象模型",
            "title": "建立被控对象模型"
          },
          {
            "slug": "离散化与预测模型",
            "title": "离散化与预测模型"
          },
          {
            "slug": "mpc-控制器设计",
            "title": "MPC控制器设计"
          },
          {
            "slug": "约束设置",
            "title": "约束设置"
          },
          {
            "slug": "闭环仿真",
            "title": "闭环仿真"
          },
          {
            "slug": "调参与分析",
            "title": "调参与分析"
          },
          {
            "slug": "工程实现细节",
            "title": "工程实现细节"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "mpc/constraint-handling",
          "mpc/generalized-predictive-control",
          "identification/identification-case-study"
        ],
        "level": "grad",
        "type": "case",
        "status": "draft"
      }
    ]
  },
  {
    "slug": "intelligent",
    "title": "智能控制",
    "order": 12,
    "lessons": [
      {
        "slug": "fuzzy-control-basics",
        "title": "模糊控制",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "模糊集合与隶属度函数",
            "title": "模糊集合与隶属度函数"
          },
          {
            "slug": "模糊推理机制",
            "title": "模糊推理机制"
          },
          {
            "slug": "解模糊化方法",
            "title": "解模糊化方法"
          },
          {
            "slug": "mamdani型模糊控制器",
            "title": "Mamdani型模糊控制器"
          },
          {
            "slug": "takagi-sugeno型模糊控制器",
            "title": "Takagi-Sugeno型模糊控制器"
          },
          {
            "slug": "应用案例",
            "title": "应用案例"
          },
          {
            "slug": "与其他控制方法的对比",
            "title": "与其他控制方法的对比"
          },
          {
            "slug": "局限性讨论",
            "title": "局限性讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "classic/pid-controller",
          "nonlinear/nonlinear-characteristics"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "fuzzy-controller-design",
        "title": "模糊控制器",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "被控对象与设计问题",
            "title": "被控对象与设计问题"
          },
          {
            "slug": "规则库设计",
            "title": "规则库设计"
          },
          {
            "slug": "比例因子整定",
            "title": "比例因子整定"
          },
          {
            "slug": "模糊pd控制器",
            "title": "模糊PD控制器"
          },
          {
            "slug": "模糊pid控制器",
            "title": "模糊PID控制器"
          },
          {
            "slug": "与常规pid的定量对比",
            "title": "与常规PID的定量对比"
          },
          {
            "slug": "规则库结构的影响",
            "title": "规则库结构的影响"
          },
          {
            "slug": "解模糊化方法对闭环的影响",
            "title": "解模糊化方法对闭环的影响"
          },
          {
            "slug": "稳定性分析",
            "title": "稳定性分析"
          },
          {
            "slug": "工程实践要点",
            "title": "工程实践要点"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "intelligent/fuzzy-control-basics"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "v1.3"
      },
      {
        "slug": "expert-system",
        "title": "专家控制",
        "prereq": [
          "intelligent/fuzzy-control-basics"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "genetic-algorithm",
        "title": "遗传算法",
        "prereq": [
          "math/convex-optimization",
          "math/probability-basics"
        ],
        "level": "undergrad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "neural-network-control",
        "title": "神经网络控制",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "从模糊控制的失败说起",
            "title": "从模糊控制的失败说起"
          },
          {
            "slug": "前馈神经网络结构与万能逼近",
            "title": "前馈神经网络：结构与万能逼近"
          },
          {
            "slug": "监督学习用-nn-模仿-pid",
            "title": "监督学习：用NN模仿PID"
          },
          {
            "slug": "直接优化让-nn-超越-pid",
            "title": "直接优化：让NN超越PID"
          },
          {
            "slug": "定量对比",
            "title": "定量对比"
          },
          {
            "slug": "鲁棒性测试",
            "title": "鲁棒性测试"
          },
          {
            "slug": "稳定性问题",
            "title": "稳定性问题"
          },
          {
            "slug": "工程实践要点",
            "title": "工程实践要点"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "machine-learning/autodiff-optimization",
          "nonlinear/lyapunov-stability",
          "modern/state-feedback"
        ],
        "level": "grad",
        "type": "learning",
        "status": "v1.3"
      },
      {
        "slug": "fuzzy-neural-network",
        "title": "模糊神经网络",
        "prereq": [
          "intelligent/fuzzy-controller-design",
          "intelligent/neural-network-control"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "iterative-learning-control",
        "title": "迭代学习控制",
        "prereq": [
          "discrete-sampled/discrete-stability-criteria",
          "modern/state-feedback"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "intelligent-case-study",
        "title": "智能控制案例",
        "prereq": [
          "intelligent/fuzzy-controller-design",
          "intelligent/neural-network-control",
          "machine-learning/learning-evaluation"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "rl-control",
    "title": "强化学习控制基础",
    "order": 13,
    "lessons": [
      {
        "slug": "rl-basics",
        "title": "强化学习问题",
        "prereq": [
          "math/stochastic-processes",
          "math/variational-dp",
          "machine-learning/learning-problem"
        ],
        "level": "undergrad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "dynamic-programming",
        "title": "价值函数与贝尔曼方程",
        "prereq": [
          "rl-control/rl-basics",
          "math/variational-dp"
        ],
        "level": "undergrad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "q-learning",
        "title": "Q学习",
        "prereq": [
          "rl-control/dynamic-programming"
        ],
        "level": "undergrad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "dqn",
        "title": "深度Q网络",
        "prereq": [
          "rl-control/q-learning",
          "machine-learning/autodiff-optimization"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "policy-gradient",
        "title": "策略梯度",
        "prereq": [
          "rl-control/dynamic-programming",
          "machine-learning/autodiff-optimization"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "actor-critic",
        "title": "演员评论家方法",
        "prereq": [
          "rl-control/policy-gradient",
          "rl-control/q-learning"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "ppo",
        "title": "PPO算法",
        "prereq": [
          "rl-control/actor-critic"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "sac-td3",
        "title": "SAC与TD3",
        "prereq": [
          "rl-control/actor-critic",
          "modern/optimal-control-basics"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "offline-rl",
        "title": "离线强化学习",
        "prereq": [
          "rl-control/sac-td3",
          "machine-learning/learning-evaluation"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "model-based-rl",
        "title": "基于模型的强化学习",
        "prereq": [
          "rl-control/actor-critic",
          "identification/nonlinear-data-driven-id",
          "mpc/receding-horizon"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "rl-evaluation",
        "title": "强化学习评估",
        "prereq": [
          "rl-control/ppo",
          "rl-control/sac-td3",
          "machine-learning/learning-evaluation"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "rl-control-case",
        "title": "强化学习控制案例",
        "prereq": [
          "rl-control/rl-evaluation",
          "discrete-sampled/discrete-optimal-control",
          "mpc/constraint-handling"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "multi-agent",
    "title": "多智能体控制",
    "order": 14,
    "lessons": [
      {
        "slug": "multi-agent-overview",
        "title": "多智能体系统",
        "prereq": [
          "math/graph-theory",
          "modern/state-space"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "consensus-control",
        "title": "一致性控制",
        "prereq": [
          "multi-agent/multi-agent-overview",
          "modern/lyapunov-modern"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "distributed-estimation",
        "title": "分布式估计",
        "prereq": [
          "multi-agent/consensus-control",
          "estimation/kalman-filter"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "distributed-optimization",
        "title": "分布式优化",
        "prereq": [
          "multi-agent/consensus-control",
          "math/convex-optimization"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "game-theory-basics",
        "title": "控制中的博弈",
        "prereq": [
          "multi-agent/multi-agent-overview",
          "math/game-theory-math"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "formation-control",
        "title": "编队控制",
        "prereq": [
          "multi-agent/consensus-control",
          "nonlinear/lyapunov-stability"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "distributed-mpc",
        "title": "分布式预测控制",
        "subsections": [
          {
            "slug": "为什么需要分布式mpc",
            "title": "为什么需要分布式MPC"
          },
          {
            "slug": "车辆编队问题建模",
            "title": "车辆编队问题建模"
          },
          {
            "slug": "admm分解算法",
            "title": "ADMM分解算法"
          },
          {
            "slug": "收敛性分析",
            "title": "收敛性分析"
          },
          {
            "slug": "通信拓扑影响",
            "title": "通信拓扑影响"
          },
          {
            "slug": "数值例子5车编队仿真",
            "title": "数值例子"
          },
          {
            "slug": "路口协调案例",
            "title": "路口协调案例"
          },
          {
            "slug": "软件工具",
            "title": "软件工具"
          },
          {
            "slug": "工业应用",
            "title": "工业应用"
          },
          {
            "slug": "深入讨论",
            "title": "深入讨论"
          },
          {
            "slug": "小结",
            "title": "小结"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          }
        ],
        "prereq": [
          "multi-agent/distributed-optimization",
          "mpc/mpc-stability"
        ],
        "level": "grad",
        "type": "theory",
        "status": "draft"
      },
      {
        "slug": "multi-agent-rl",
        "title": "多智能体强化学习",
        "prereq": [
          "multi-agent/game-theory-basics",
          "rl-control/actor-critic",
          "rl-control/rl-evaluation"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "multi-agent-cooperation",
        "title": "多智能体协同案例",
        "prereq": [
          "multi-agent/formation-control",
          "multi-agent/distributed-mpc",
          "multi-agent/multi-agent-rl"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "safety-ftc",
    "title": "安全控制",
    "order": 15,
    "lessons": [
      {
        "slug": "safety-overview",
        "title": "控制安全",
        "prereq": [
          "nonlinear/lyapunov-stability",
          "estimation/estimation-problem",
          "classic/stability-analysis",
          "implementation/computer-control-architecture"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "control-barrier-functions",
        "title": "控制屏障函数",
        "prereq": [
          "safety-ftc/safety-overview",
          "math/convex-optimization"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "reachability-analysis",
        "title": "可达性分析",
        "prereq": [
          "safety-ftc/safety-overview",
          "math/variational-dp"
        ],
        "level": "advanced",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "fault-detection-isolation",
        "title": "故障诊断",
        "prereq": [
          "safety-ftc/safety-overview",
          "estimation/kalman-filter",
          "identification/least-squares-rls"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "fault-tolerant-control",
        "title": "容错控制",
        "prereq": [
          "safety-ftc/fault-detection-isolation",
          "robust/robust-stability"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "safe-rl",
        "title": "安全强化学习",
        "prereq": [
          "safety-ftc/control-barrier-functions",
          "rl-control/rl-evaluation",
          "mpc/constraint-handling"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "functional-safety-standards",
        "title": "功能安全",
        "prereq": [
          "safety-ftc/safety-overview",
          "implementation/embedded-implementation"
        ],
        "level": "grad",
        "type": "history",
        "status": "empty"
      },
      {
        "slug": "safety-case-study",
        "title": "安全控制案例",
        "prereq": [
          "safety-ftc/control-barrier-functions",
          "safety-ftc/fault-tolerant-control",
          "safety-ftc/functional-safety-standards"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "robotics",
    "title": "机器人控制",
    "order": 16,
    "lessons": [
      {
        "slug": "robot-models",
        "title": "机器人系统",
        "prereq": [
          "modern/state-space"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "rigid-body-motion",
        "title": "刚体运动",
        "prereq": [
          "robotics/robot-models",
          "math/diff-geometry"
        ],
        "level": "grad",
        "type": "math",
        "status": "empty"
      },
      {
        "slug": "kinematics",
        "title": "机器人运动学",
        "prereq": [
          "robotics/rigid-body-motion",
          "math/matrix-decomposition"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "dynamics",
        "title": "机器人动力学",
        "prereq": [
          "robotics/kinematics",
          "math/multivariable-calculus",
          "math/ode-matrix-exponential"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "motion-planning",
        "title": "机器人运动规划",
        "prereq": [
          "robotics/kinematics",
          "math/convex-optimization"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "trajectory-tracking",
        "title": "轨迹跟踪",
        "prereq": [
          "robotics/dynamics",
          "robotics/motion-planning",
          "nonlinear/feedback-linearization"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "impedance-control",
        "title": "阻抗控制",
        "prereq": [
          "robotics/dynamics",
          "nonlinear/passivity-control"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "contact-control",
        "title": "接触控制",
        "prereq": [
          "robotics/impedance-control",
          "safety-ftc/control-barrier-functions"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "legged-control",
        "title": "足式机器人控制",
        "prereq": [
          "robotics/contact-control",
          "mpc/nonlinear-mpc"
        ],
        "level": "advanced",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "robotics-case-study",
        "title": "机器人控制案例",
        "prereq": [
          "robotics/trajectory-tracking",
          "robotics/contact-control",
          "estimation/sensor-fusion"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "robot-learning",
    "title": "机器人学习",
    "order": 17,
    "lessons": [
      {
        "slug": "robot-data",
        "title": "机器人数据",
        "prereq": [
          "robotics/trajectory-tracking",
          "machine-learning/learning-evaluation"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "imitation-learning",
        "title": "模仿学习",
        "prereq": [
          "robot-learning/robot-data",
          "machine-learning/autodiff-optimization"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "offline-online-learning",
        "title": "离线到在线学习",
        "prereq": [
          "robot-learning/imitation-learning",
          "rl-control/offline-rl"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "residual-learning",
        "title": "残差学习控制",
        "prereq": [
          "robot-learning/offline-online-learning",
          "nonlinear/lyapunov-stability"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "sim-to-real",
        "title": "仿真到现实",
        "prereq": [
          "robot-learning/offline-online-learning",
          "robust/uncertainty-modeling"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "locomotion-learning",
        "title": "运动技能学习",
        "prereq": [
          "robot-learning/sim-to-real",
          "robotics/legged-control",
          "rl-control/ppo"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "manipulation-learning",
        "title": "操作技能学习",
        "prereq": [
          "robot-learning/imitation-learning",
          "robotics/contact-control"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "human-in-the-loop",
        "title": "人机协同学习",
        "prereq": [
          "robot-learning/offline-online-learning",
          "safety-ftc/safe-rl"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "learning-with-mpc",
        "title": "学习与预测控制",
        "prereq": [
          "robot-learning/residual-learning",
          "rl-control/model-based-rl",
          "mpc/nonlinear-mpc"
        ],
        "level": "advanced",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "robot-learning-evaluation",
        "title": "机器人学习评估",
        "prereq": [
          "robot-learning/sim-to-real",
          "robot-learning/human-in-the-loop",
          "rl-control/rl-evaluation"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "embodied",
    "title": "具身智能",
    "order": 18,
    "lessons": [
      {
        "slug": "embodied-systems",
        "title": "具身智能系统",
        "prereq": [
          "robot-learning/robot-data",
          "machine-learning/attention-transformers"
        ],
        "level": "grad",
        "type": "frontier",
        "status": "empty"
      },
      {
        "slug": "multimodal-observation",
        "title": "多模态感知",
        "prereq": [
          "embodied/embodied-systems",
          "machine-learning/representation-learning"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "action-representations",
        "title": "动作表示",
        "prereq": [
          "embodied/embodied-systems",
          "robotics/trajectory-tracking"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "generalist-policies",
        "title": "通用机器人策略",
        "prereq": [
          "embodied/multimodal-observation",
          "embodied/action-representations",
          "robot-learning/imitation-learning"
        ],
        "level": "grad",
        "type": "frontier",
        "status": "empty"
      },
      {
        "slug": "diffusion-flow-policies",
        "title": "扩散与流策略",
        "prereq": [
          "embodied/action-representations",
          "machine-learning/generative-models"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "vla",
        "title": "视觉语言动作模型",
        "prereq": [
          "embodied/generalist-policies",
          "machine-learning/attention-transformers"
        ],
        "level": "advanced",
        "type": "frontier",
        "status": "empty"
      },
      {
        "slug": "world-models",
        "title": "世界模型",
        "prereq": [
          "embodied/multimodal-observation",
          "machine-learning/sequence-models",
          "machine-learning/generative-models"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "world-model-control",
        "title": "世界模型控制",
        "prereq": [
          "embodied/world-models",
          "rl-control/model-based-rl",
          "mpc/receding-horizon"
        ],
        "level": "advanced",
        "type": "frontier",
        "status": "empty"
      },
      {
        "slug": "hierarchical-reasoning",
        "title": "分层决策",
        "prereq": [
          "embodied/vla",
          "embodied/world-model-control"
        ],
        "level": "advanced",
        "type": "frontier",
        "status": "empty"
      },
      {
        "slug": "embodied-evaluation",
        "title": "具身智能评估",
        "prereq": [
          "embodied/diffusion-flow-policies",
          "embodied/hierarchical-reasoning",
          "robot-learning/robot-learning-evaluation"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "autonomous-driving",
    "title": "自动驾驶",
    "order": 19,
    "lessons": [
      {
        "slug": "driving-system",
        "title": "自动驾驶系统",
        "prereq": [
          "modern/state-space",
          "safety-ftc/safety-overview"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "vehicle-dynamics",
        "title": "车辆动力学",
        "prereq": [
          "autonomous-driving/driving-system",
          "math/ode-matrix-exponential"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "localization-prediction",
        "title": "定位与运动预测",
        "prereq": [
          "autonomous-driving/vehicle-dynamics",
          "estimation/sensor-fusion",
          "machine-learning/sequence-models"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "motion-planning",
        "title": "自动驾驶规划",
        "prereq": [
          "autonomous-driving/localization-prediction",
          "math/convex-optimization"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "vehicle-control",
        "title": "车辆跟踪控制",
        "prereq": [
          "autonomous-driving/motion-planning",
          "mpc/nonlinear-mpc",
          "nonlinear/feedback-linearization",
          "classic/pid-controller"
        ],
        "level": "grad",
        "type": "theory",
        "status": "empty"
      },
      {
        "slug": "learning-planning",
        "title": "学习型驾驶策略",
        "prereq": [
          "autonomous-driving/motion-planning",
          "robot-learning/imitation-learning",
          "machine-learning/attention-transformers"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "rl-decision",
        "title": "驾驶决策强化学习",
        "prereq": [
          "autonomous-driving/learning-planning",
          "rl-control/sac-td3"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "driving-world-models",
        "title": "驾驶世界模型",
        "prereq": [
          "autonomous-driving/localization-prediction",
          "embodied/world-models"
        ],
        "level": "advanced",
        "type": "frontier",
        "status": "empty"
      },
      {
        "slug": "driving-vla",
        "title": "驾驶视觉语言动作模型",
        "prereq": [
          "autonomous-driving/learning-planning",
          "embodied/vla"
        ],
        "level": "advanced",
        "type": "frontier",
        "status": "empty"
      },
      {
        "slug": "closed-loop-evaluation",
        "title": "闭环驾驶评估",
        "prereq": [
          "autonomous-driving/vehicle-control",
          "autonomous-driving/rl-decision",
          "autonomous-driving/driving-world-models",
          "autonomous-driving/driving-vla",
          "machine-learning/learning-evaluation"
        ],
        "level": "grad",
        "type": "learning",
        "status": "empty"
      },
      {
        "slug": "driving-safety",
        "title": "驾驶安全与回退",
        "prereq": [
          "autonomous-driving/closed-loop-evaluation",
          "safety-ftc/reachability-analysis",
          "safety-ftc/functional-safety-standards"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      }
    ]
  },
  {
    "slug": "applications",
    "title": "工程应用",
    "order": 20,
    "lessons": [
      {
        "slug": "power-electronics",
        "title": "电力电子控制",
        "prereq": [
          "implementation/digital-pid",
          "modern/state-feedback",
          "classic/frequency-response-design",
          "discrete-sampled/sampling-period-selection"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      },
      {
        "slug": "process-control",
        "title": "过程控制",
        "prereq": [
          "identification/identification-case-study",
          "mpc/mpc-case-study",
          "implementation/pid-engineering-tuning"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      },
      {
        "slug": "aerospace-attitude",
        "title": "飞行器姿态控制",
        "prereq": [
          "modern/lqr-controller",
          "nonlinear/feedback-linearization",
          "estimation/sensor-fusion",
          "nonlinear/sliding-mode-control"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      },
      {
        "slug": "energy-storage-microgrid",
        "title": "微电网控制",
        "prereq": [
          "mpc/economic-mpc",
          "multi-agent/distributed-mpc",
          "applications/power-electronics"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      },
      {
        "slug": "biomedical-control",
        "title": "生物医学控制",
        "prereq": [
          "identification/identification-case-study",
          "estimation/sensor-fusion",
          "safety-ftc/safety-overview"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      },
      {
        "slug": "semiconductor-equipment",
        "title": "半导体装备控制",
        "prereq": [
          "classic/frequency-response-design",
          "implementation/realtime-control",
          "robust/mixed-sensitivity"
        ],
        "level": "grad",
        "type": "case",
        "status": "empty"
      }
    ]
  }
];
