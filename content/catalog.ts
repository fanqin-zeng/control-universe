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
          "math/ode-matrix-exponential",
          "math/convex-optimization"
        ],
        "level": "grad",
        "type": "math",
        "status": "v1.3",
        "subsections": [
          {
            "slug": "小车怎样分几步回家",
            "title": "小车怎样分几步回家"
          },
          {
            "slug": "从一个数到一条函数",
            "title": "从一个数到一条函数"
          },
          {
            "slug": "一次变分",
            "title": "一次变分"
          },
          {
            "slug": "欧拉拉格朗日方程",
            "title": "欧拉拉格朗日方程"
          },
          {
            "slug": "端点不能随意省略",
            "title": "端点不能随意省略"
          },
          {
            "slug": "最优不只是驻点",
            "title": "最优不只是驻点"
          },
          {
            "slug": "把过程分成几步",
            "title": "把过程分成几步"
          },
          {
            "slug": "剩余代价与最优性原理",
            "title": "剩余代价与最优性原理"
          },
          {
            "slug": "bellman递推",
            "title": "Bellman递推"
          },
          {
            "slug": "二次代价的倒推",
            "title": "二次代价的倒推"
          },
          {
            "slug": "沿最优策略向前走",
            "title": "沿最优策略向前走"
          },
          {
            "slug": "协态与哈密顿量",
            "title": "协态与哈密顿量"
          },
          {
            "slug": "连续时间的hjb",
            "title": "连续时间的HJB"
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
        "slug": "diff-geometry",
        "title": "微分几何入门",
        "prereq": [
          "math/multivariable-calculus",
          "math/ode-matrix-exponential"
        ],
        "level": "grad",
        "type": "math",
        "status": "v1.3",
        "subsections": [
          {
            "slug": "搬运车怎样侧着挪",
            "title": "搬运车怎样侧着挪"
          },
          {
            "slug": "局部坐标与流形",
            "title": "局部坐标与流形"
          },
          {
            "slug": "切向量与切空间",
            "title": "切向量与切空间"
          },
          {
            "slug": "约束怎样给出切空间",
            "title": "约束怎样给出切空间"
          },
          {
            "slug": "长度与坐标刻度",
            "title": "长度与坐标刻度"
          },
          {
            "slug": "坐标变换与微分",
            "title": "坐标变换与微分"
          },
          {
            "slug": "向量场与流",
            "title": "向量场与流"
          },
          {
            "slug": "沿向量场求导",
            "title": "沿向量场求导"
          },
          {
            "slug": "李括号与运动顺序",
            "title": "李括号与运动顺序"
          },
          {
            "slug": "独立方向不等于全能",
            "title": "独立方向不等于全能"
          },
          {
            "slug": "分布与可积性",
            "title": "分布与可积性"
          },
          {
            "slug": "旋转矩阵也有几何",
            "title": "旋转矩阵也有几何"
          },
          {
            "slug": "几何语言怎样用于控制",
            "title": "几何语言怎样用于控制"
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
        "slug": "graph-theory",
        "title": "图论基础",
        "prereq": [
          "math/eigen-decomposition",
          "math/ode-matrix-exponential"
        ],
        "level": "undergrad",
        "type": "math",
        "status": "v1.3"
,
        "subsections": [
          {
                    "slug": "四个房间怎样统一读数",
                    "title": "四个房间怎样统一读数"
          },
          {
                    "slug": "节点与边",
                    "title": "节点与边"
          },
          {
                    "slug": "路径与连通",
                    "title": "路径与连通"
          },
          {
                    "slug": "生成树与割",
                    "title": "生成树与割"
          },
          {
                    "slug": "邻接矩阵的方向",
                    "title": "邻接矩阵的方向"
          },
          {
                    "slug": "度与拉普拉斯矩阵",
                    "title": "度与拉普拉斯矩阵"
          },
          {
                    "slug": "关联矩阵与能量",
                    "title": "关联矩阵与能量"
          },
          {
                    "slug": "零特征值告诉什么",
                    "title": "零特征值告诉什么"
          },
          {
                    "slug": "代数连通度",
                    "title": "代数连通度"
          },
          {
                    "slug": "连续时间的一致性",
                    "title": "连续时间的一致性"
          },
          {
                    "slug": "离散更新的步长",
                    "title": "离散更新的步长"
          },
          {
                    "slug": "有向图的一致性",
                    "title": "有向图的一致性"
          },
          {
                    "slug": "控制里的网络边界",
                    "title": "控制里的网络边界"
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
        "slug": "game-theory-math",
        "title": "博弈论基础",
        "prereq": [
          "math/convex-optimization",
          "math/probability-basics"
        ],
        "level": "grad",
        "type": "math",
        "status": "v1.3"
,
        "subsections": [
          {
                    "slug": "两户充电怎样互相影响",
                    "title": "两户充电怎样互相影响"
          },
          {
                    "slug": "谁选择什么",
                    "title": "谁选择什么"
          },
          {
                    "slug": "最佳响应",
                    "title": "最佳响应"
          },
          {
                    "slug": "纳什均衡",
                    "title": "纳什均衡"
          },
          {
                    "slug": "均衡与共同目标",
                    "title": "均衡与共同目标"
          },
          {
                    "slug": "混合策略",
                    "title": "混合策略"
          },
          {
                    "slug": "零和与极小极大",
                    "title": "零和与极小极大"
          },
          {
                    "slug": "均衡何时存在",
                    "title": "均衡何时存在"
          },
          {
                    "slug": "势函数",
                    "title": "势函数"
          },
          {
                    "slug": "更新不一定收敛",
                    "title": "更新不一定收敛"
          },
          {
                    "slug": "先后行动与信息",
                    "title": "先后行动与信息"
          },
          {
                    "slug": "控制中的博弈",
                    "title": "控制中的博弈"
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
        "slug": "numerical-methods",
        "title": "数值方法",
        "prereq": [
          "math/matrix-decomposition",
          "math/multivariable-calculus",
          "math/ode-matrix-exponential"
        ],
        "level": "undergrad",
        "type": "math",
        "status": "v1.3",
        "subsections": [
          {
                    "slug": "热水多久接近室温",
                    "title": "热水多久接近室温"
          },
          {
                    "slug": "误差从哪里来",
                    "title": "误差从哪里来"
          },
          {
                    "slug": "条件数与残差",
                    "title": "条件数与残差"
          },
          {
                    "slug": "线性方程怎么解",
                    "title": "线性方程怎么解"
          },
          {
                    "slug": "找零点与停止条件",
                    "title": "找零点与停止条件"
          },
          {
                    "slug": "差分与积分",
                    "title": "差分与积分"
          },
          {
                    "slug": "从微分方程到递推",
                    "title": "从微分方程到递推"
          },
          {
                    "slug": "阶数与步长",
                    "title": "阶数与步长"
          },
          {
                    "slug": "稳定域与刚性",
                    "title": "稳定域与刚性"
          },
          {
                    "slug": "自适应与事件",
                    "title": "自适应与事件"
          },
          {
                    "slug": "怎样审计仿真读数",
                    "title": "怎样审计仿真读数"
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
                    "slug": "从按下车身开始",
                    "title": "从按下车身开始"
          },
          {
                    "slug": "受力与平衡位置",
                    "title": "受力与平衡位置"
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
                    "slug": "机电类比",
                    "title": "机电类比"
          },
          {
                    "slug": "直流电机",
                    "title": "直流电机"
          },
          {
                    "slug": "模型验证与简化",
                    "title": "模型验证与简化"
          },
          {
                    "slug": "跨领域建模",
                    "title": "跨领域建模"
          },
          {
                    "slug": "建模方法论总结",
                    "title": "建模方法论总结"
          },
          {
                    "slug": "工作点与线性化",
                    "title": "工作点与线性化"
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
            "slug": "变换回顾",
            "title": "变换回顾"
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
            "slug": "二阶模型",
            "title": "二阶模型"
          },
          {
            "slug": "频率响应",
            "title": "频率响应"
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
            "slug": "主导极点",
            "title": "主导极点"
          },
          {
            "slug": "路面阶跃响应",
            "title": "路面阶跃响应"
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
            "slug": "倒立摆反馈",
            "title": "倒立摆反馈"
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
            "slug": "bode裕度",
            "title": "Bode裕度"
          },
          {
            "slug": "nyquist-图",
            "title": "Nyquist 图"
          },
          {
            "slug": "nyquist裕度",
            "title": "Nyquist裕度"
          },
          {
            "slug": "稳定性判据",
            "title": "稳定性判据"
          },
          {
            "slug": "频域与时域",
            "title": "频域与时域"
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
            "slug": "幅角条件",
            "title": "幅角条件"
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
            "slug": "极点与性能",
            "title": "极点与性能"
          },
          {
            "slug": "零极点设计",
            "title": "零极点设计"
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
            "slug": "比例控制",
            "title": "比例控制"
          },
          {
            "slug": "积分控制",
            "title": "积分控制"
          },
          {
            "slug": "微分控制",
            "title": "微分控制"
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
            "slug": "电机转速控制",
            "title": "电机转速控制"
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
            "slug": "电机位置控制",
            "title": "电机位置控制"
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
            "slug": "增益设计",
            "title": "增益设计"
          },
          {
            "slug": "临界整定",
            "title": "临界整定"
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
        "subsections": [
          {
            "slug": "先分清三个问题",
            "title": "先分清三个问题"
          },
          {
            "slug": "把需求写成合同",
            "title": "把需求写成合同"
          },
          {
            "slug": "同一对象的三组候选",
            "title": "同一对象的三组候选"
          },
          {
            "slug": "需求改变后的选择",
            "title": "需求改变后的选择"
          },
          {
            "slug": "何时换一种工具",
            "title": "何时换一种工具"
          },
          {
            "slug": "交付前的复核",
            "title": "交付前的复核"
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
          "classic/compensator-design",
          "classic/frequency-response-design"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
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
            "slug": "从运动看稳定",
            "title": "从运动看稳定"
          },
          {
            "slug": "二次型证书",
            "title": "二次型证书"
          },
          {
            "slug": "内部与外部稳定",
            "title": "内部与外部稳定"
          },
          {
            "slug": "可稳定与可检测",
            "title": "可稳定与可检测"
          },
          {
            "slug": "lqr证书",
            "title": "LQR证书"
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
          "modern/controllability-observability",
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
            "slug": "状态怎样反馈",
            "title": "状态怎样反馈"
          },
          {
            "slug": "极点配置问题",
            "title": "极点配置问题"
          },
          {
            "slug": "一般坐标配置",
            "title": "一般坐标配置"
          },
          {
            "slug": "参考跟踪",
            "title": "参考跟踪"
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
            "slug": "为什么要估计状态",
            "title": "为什么要估计状态"
          },
          {
            "slug": "全阶观测器",
            "title": "全阶观测器"
          },
          {
            "slug": "对偶原理",
            "title": "对偶原理"
          },
          {
            "slug": "分离性原理",
            "title": "分离性原理"
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
            "slug": "为什么要定义代价",
            "title": "为什么要定义代价"
          },
          {
            "slug": "任务与代价",
            "title": "任务与代价"
          },
          {
            "slug": "变分法",
            "title": "变分法"
          },
          {
            "slug": "极小值原理",
            "title": "极小值原理"
          },
          {
            "slug": "最短时间",
            "title": "最短时间"
          },
          {
            "slug": "线性二次型",
            "title": "线性二次型"
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
            "slug": "lqr解决什么",
            "title": "LQR解决什么"
          },
          {
            "slug": "有限时域",
            "title": "有限时域"
          },
          {
            "slug": "无穷时域",
            "title": "无穷时域"
          },
          {
            "slug": "输入端裕度",
            "title": "输入端裕度"
          },
          {
            "slug": "权重怎么选",
            "title": "权重怎么选"
          },
          {
            "slug": "参考跟踪",
            "title": "参考跟踪"
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
            "slug": "通道如何耦合",
            "title": "通道如何耦合"
          },
          {
            "slug": "极点与零点",
            "title": "极点与零点"
          },
          {
            "slug": "相对增益",
            "title": "相对增益"
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
            "slug": "建立模型",
            "title": "建立模型"
          },
          {
            "slug": "检查可控可观",
            "title": "检查可控可观"
          },
          {
            "slug": "设计状态反馈",
            "title": "设计状态反馈"
          },
          {
            "slug": "估计状态",
            "title": "估计状态"
          },
          {
            "slug": "噪声与lqg",
            "title": "噪声与LQG"
          },
          {
            "slug": "验证稳定性",
            "title": "验证稳定性"
          },
          {
            "slug": "双输入扩展",
            "title": "双输入扩展"
          },
          {
            "slug": "边界检验",
            "title": "边界检验"
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
        "status": "v1.3"
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
    "slug": "从哪里看见非线性",
    "title": "从哪里看见非线性"
  },
  {
    "slug": "叠加原理",
    "title": "叠加原理"
  },
  {
    "slug": "常见非线性",
    "title": "常见非线性"
  },
  {
    "slug": "分类与工具",
    "title": "分类与工具"
  },
  {
    "slug": "谐波与互调",
    "title": "谐波与互调"
  },
  {
    "slug": "局部近似",
    "title": "局部近似"
  },
  {
    "slug": "多种运动",
    "title": "多种运动"
  },
  {
    "slug": "限幅与积分",
    "title": "限幅与积分"
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
            "slug": "位置和速度",
            "title": "位置和速度"
          },
          {
            "slug": "向量场",
            "title": "向量场"
          },
          {
            "slug": "零导数线",
            "title": "零导数线"
          },
          {
            "slug": "平衡点分类",
            "title": "平衡点分类"
          },
          {
            "slug": "线性化边界",
            "title": "线性化边界"
          },
          {
            "slug": "duffing算例",
            "title": "Duffing算例"
          },
          {
            "slug": "分界线",
            "title": "分界线"
          },
          {
            "slug": "闭轨与极限环",
            "title": "闭轨与极限环"
          },
          {
            "slug": "模型案例",
            "title": "模型案例"
          },
          {
            "slug": "截面与乘子",
            "title": "截面与乘子"
          },
          {
            "slug": "分支与失稳",
            "title": "分支与失稳"
          },
          {
            "slug": "方法边界",
            "title": "方法边界"
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
            "slug": "为什么看能量",
            "title": "为什么看能量"
          },
          {
            "slug": "稳定性定义",
            "title": "稳定性定义"
          },
          {
            "slug": "直接法",
            "title": "直接法"
          },
          {
            "slug": "非线性弹簧",
            "title": "非线性弹簧"
          },
          {
            "slug": "lasalle原理",
            "title": "LaSalle原理"
          },
          {
            "slug": "线性化与证书",
            "title": "线性化与证书"
          },
          {
            "slug": "怎样构造函数",
            "title": "怎样构造函数"
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
            "slug": "适用边界",
            "title": "适用边界"
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
            "slug": "开关为何会振荡",
            "title": "开关为何会振荡"
          },
          {
            "slug": "只保留基波",
            "title": "只保留基波"
          },
          {
            "slug": "五种描述函数",
            "title": "五种描述函数"
          },
          {
            "slug": "寻找候选振荡",
            "title": "寻找候选振荡"
          },
          {
            "slug": "振幅会被拉回吗",
            "title": "振幅会被拉回吗"
          },
          {
            "slug": "应用案例",
            "title": "应用案例"
          },
          {
            "slug": "四类失效",
            "title": "四类失效"
          },
          {
            "slug": "怎样交叉检查",
            "title": "怎样交叉检查"
          },
          {
            "slug": "适用边界",
            "title": "适用边界"
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
          "math/fourier-analysis",
          "nonlinear/lyapunov-stability",
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
            "slug": "先补上重力",
            "title": "先补上重力"
          },
          {
            "slug": "沿状态求导",
            "title": "沿状态求导"
          },
          {
            "slug": "相对阶",
            "title": "相对阶"
          },
          {
            "slug": "输出线性化",
            "title": "输出线性化"
          },
          {
            "slug": "零动态",
            "title": "零动态"
          },
          {
            "slug": "全状态线性化",
            "title": "全状态线性化"
          },
          {
            "slug": "变换坐标",
            "title": "变换坐标"
          },
          {
            "slug": "倒立摆",
            "title": "倒立摆"
          },
          {
            "slug": "球梁",
            "title": "球梁"
          },
          {
            "slug": "计算力矩",
            "title": "计算力矩"
          },
          {
            "slug": "两种线性化",
            "title": "两种线性化"
          },
          {
            "slug": "适用边界",
            "title": "适用边界"
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
          "math/diff-geometry",
          "modern/state-feedback"
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
            "slug": "先选想要的运动",
            "title": "先选想要的运动"
          },
          {
            "slug": "滑面与到达",
            "title": "滑面与到达"
          },
          {
            "slug": "设计二阶控制",
            "title": "设计二阶控制"
          },
          {
            "slug": "倒立摆手算",
            "title": "倒立摆手算"
          },
          {
            "slug": "抖振与平滑",
            "title": "抖振与平滑"
          },
          {
            "slug": "到达律",
            "title": "到达律"
          },
          {
            "slug": "匹配条件",
            "title": "匹配条件"
          },
          {
            "slug": "应用案例",
            "title": "应用案例"
          },
          {
            "slug": "方法的适用条件",
            "title": "方法的适用条件"
          },
          {
            "slug": "适用边界",
            "title": "适用边界"
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
          {"slug":"先设计期望速度","title":"先设计期望速度"},
          {"slug":"严格反馈结构","title":"严格反馈结构"},
          {"slug":"二阶递推","title":"二阶递推"},
          {"slug":"手算与核验","title":"手算与核验"},
          {"slug":"高阶递推","title":"高阶递推"},
          {"slug":"自适应递推","title":"自适应递推"},
          {"slug":"柔性关节案例","title":"柔性关节案例"},
          {"slug":"二阶增益比较","title":"二阶增益比较"},
          {"slug":"适用边界","title":"适用边界"},
          {"slug":"小结","title":"小结"},
          {"slug":"习题","title":"习题"},
          {"slug":"答案","title":"答案"}
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
              "slug": "未知参数与控制目标",
              "title": "未知参数与控制目标"
            },
            {
              "slug": "一阶mrac",
              "title": "一阶MRAC"
            },
            {
              "slug": "跟踪与参数收敛",
              "title": "跟踪与参数收敛"
            },
            {
              "slug": "高阶mrac",
              "title": "高阶MRAC"
            },
            {
              "slug": "辨识与自整定",
              "title": "辨识与自整定"
            },
            {
              "slug": "噪声与鲁棒化",
              "title": "噪声与鲁棒化"
            },
            {
              "slug": "两个应用模型",
              "title": "两个应用模型"
            },
            {
              "slug": "怎样选择方法",
              "title": "怎样选择方法"
            },
            {
              "slug": "适用边界",
              "title": "适用边界"
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
        "subsections": [
          {
                    "slug": "引言",
                    "title": "引言"
          },
          {
                    "slug": "给小车记能量账",
                    "title": "给小车记能量账"
          },
          {
                    "slug": "无源性的定义",
                    "title": "无源性的定义"
          },
          {
                    "slug": "阻尼反馈能保证什么",
                    "title": "阻尼反馈能保证什么"
          },
          {
                    "slug": "把目标位置变成能量最低点",
                    "title": "把目标位置变成能量最低点"
          },
          {
                    "slug": "无源系统的互联",
                    "title": "无源系统的互联"
          },
          {
                    "slug": "实现中的边界",
                    "title": "实现中的边界"
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
          "modern/multivariable-systems"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "iss-small-gain",
        "title": "输入状态稳定性",
        "subsections": [
          { "slug": "引言", "title": "引言" },
          { "slug": "从无扰动到有扰动", "title": "从无扰动到有扰动" },
          { "slug": "输入状态稳定性的定义", "title": "输入状态稳定性的定义" },
          { "slug": "用lyapunov函数估计误差", "title": "用Lyapunov函数估计误差" },
          { "slug": "两个系统相互影响", "title": "两个系统相互影响" },
          { "slug": "小增益条件", "title": "小增益条件" },
          { "slug": "条件没通过怎么办", "title": "条件没通过怎么办" },
          { "slug": "小结", "title": "小结" },
          { "slug": "习题", "title": "习题" },
          { "slug": "答案", "title": "答案" }
        ],
        "prereq": [
          "nonlinear/lyapunov-stability",
          "classic/frequency-domain-analysis"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "switched-hybrid-systems",
        "title": "切换与混杂系统",
        "subsections": [
          { "slug": "引言", "title": "引言" },
          { "slug": "模式与切换规则", "title": "模式与切换规则" },
          { "slug": "稳定模式也会切坏", "title": "稳定模式也会切坏" },
          { "slug": "共同lyapunov函数", "title": "共同Lyapunov函数" },
          { "slug": "驻留时间", "title": "驻留时间" },
          { "slug": "状态跳变的模型", "title": "状态跳变的模型" },
          { "slug": "zeno现象", "title": "Zeno现象" },
          { "slug": "建模与仿真检查", "title": "建模与仿真检查" },
          { "slug": "小结", "title": "小结" },
          { "slug": "习题", "title": "习题" },
          { "slug": "答案", "title": "答案" }
        ],
        "prereq": [
          "nonlinear/lyapunov-stability"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "bifurcation-chaos",
        "title": "分岔与混沌",
        "subsections": [
          { "slug": "引言", "title": "引言" },
          { "slug": "平衡点怎样消失", "title": "平衡点怎样消失" },
          { "slug": "对称分支", "title": "对称分支" },
          { "slug": "振荡怎样出现", "title": "振荡怎样出现" },
          { "slug": "从连续到逐步更新", "title": "从连续到逐步更新" },
          { "slug": "周期倍化", "title": "周期倍化" },
          { "slug": "混沌与预测", "title": "混沌与预测" },
          { "slug": "读懂分岔图", "title": "读懂分岔图" },
          { "slug": "受迫系统的跳跃", "title": "受迫系统的跳跃" },
          { "slug": "数值检查", "title": "数值检查" },
          { "slug": "小结", "title": "小结" },
          { "slug": "习题", "title": "习题" },
          { "slug": "答案", "title": "答案" }
        ],
        "prereq": [
          "nonlinear/phase-plane",
          "math/numerical-methods"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
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
        "status": "v1.3"
      },
      {
        "slug": "discrete-time-systems",
        "title": "离散时间系统",
        "subsections": [
          {
            "slug": "从读数到递推",
            "title": "从读数到递推"
          },
          {
            "slug": "初值和输入各做了什么",
            "title": "初值和输入各做了什么"
          },
          {
            "slug": "离散状态空间",
            "title": "离散状态空间"
          },
          {
            "slug": "从脉冲到输入输出",
            "title": "从脉冲到输入输出"
          },
          {
            "slug": "模型的边界",
            "title": "模型的边界"
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
          "math/z-transform"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "difference-equation",
        "title": "差分方程",
        "subsections": [
          {
            "slug": "从递推到差分",
            "title": "从递推到差分"
          },
          {
            "slug": "先解一阶方程",
            "title": "先解一阶方程"
          },
          {
            "slug": "输入怎样改变解",
            "title": "输入怎样改变解"
          },
          {
            "slug": "二阶方程与特征根",
            "title": "二阶方程与特征根"
          },
          {
            "slug": "重根为什么多一个k",
            "title": "重根为什么多一个k"
          },
          {
            "slug": "用z变换核对",
            "title": "用Z变换核对"
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
          "discrete-sampled/discrete-time-systems",
          "math/z-transform"
        ],
        "level": "undergrad",
        "type": "math",
        "status": "v1.3"
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
        "status": "v1.3"
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
        "status": "v1.3"
      },
      {
        "slug": "discretization-methods",
        "title": "离散化方法",
        "subsections": [
          {
            "slug": "离散化方法-1",
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
        "status": "v1.3"
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
        "status": "v1.3"
      },
      {
        "slug": "sampled-data-systems",
        "title": "采样数据系统",
        "subsections": [
          {
            "slug": "两次更新之间",
            "title": "两次更新之间"
          },
          {
            "slug": "精确采样模型",
            "title": "精确采样模型"
          },
          {
            "slug": "闭环与延迟",
            "title": "闭环与延迟"
          },
          {
            "slug": "采样会漏掉什么",
            "title": "采样会漏掉什么"
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
          "discrete-sampled/discretization-methods",
          "discrete-sampled/sampling-period-selection"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "discrete-optimal-control",
        "title": "离散最优控制",
        "prereq": [
          "discrete-sampled/discrete-stability-criteria",
          "modern/lqr-controller"
        ],
        "subsections": [
          {
            "slug": "只剩几次调整",
            "title": "只剩几次调整"
          },
          {
            "slug": "从最后一步倒推",
            "title": "从最后一步倒推"
          },
          {
            "slug": "向前执行",
            "title": "向前执行"
          },
          {
            "slug": "从有限步到长期",
            "title": "从有限步到长期"
          },
          {
            "slug": "输入有上限",
            "title": "输入有上限"
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
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "event-triggered-control",
        "title": "事件触发控制",
        "prereq": [
          "discrete-sampled/sampled-data-systems",
          "nonlinear/lyapunov-stability"
        ],
        "subsections": [
          {
            "slug": "消息一定要按时发吗",
            "title": "消息一定要按时发吗"
          },
          {
            "slug": "旧读数还能用多久",
            "title": "旧读数还能用多久"
          },
          {
            "slug": "为什么误差不能太大",
            "title": "为什么误差不能太大"
          },
          {
            "slug": "按周期检查事件",
            "title": "按周期检查事件"
          },
          {
            "slug": "少发消息也有代价",
            "title": "少发消息也有代价"
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
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
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
        "status": "v1.3"
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
        "status": "v1.3"
      },
      {
        "slug": "pid-engineering-tuning",
        "title": "PID工程整定",
        "subsections": [
          {
            "slug": "先把要求写成验收合同",
            "title": "先把要求写成验收合同"
          },
          {
            "slug": "从阶跃试验得到模型",
            "title": "从阶跃试验得到模型"
          },
          {
            "slug": "从模型得到pi候选",
            "title": "从模型得到PI候选"
          },
          {
            "slug": "在约束下检验候选",
            "title": "在约束下检验候选"
          },
          {
            "slug": "整定到现场的交接",
            "title": "整定到现场的交接"
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
          "implementation/digital-pid",
          "classic/time-domain-analysis"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "v1.3"
      },
      {
        "slug": "controller-discretization-practice",
        "title": "控制器部署",
        "subsections": [
          {
            "slug": "部署前冻结接口",
            "title": "部署前冻结接口"
          },
          {
            "slug": "从连续补偿器到差分系数",
            "title": "从连续补偿器到差分系数"
          },
          {
            "slug": "系数和状态如何进入程序",
            "title": "系数和状态如何进入程序"
          },
          {
            "slug": "有限字长的验证",
            "title": "有限字长的验证"
          },
          {
            "slug": "把真实时序放回闭环",
            "title": "把真实时序放回闭环"
          },
          {
            "slug": "部署验收与回退",
            "title": "部署验收与回退"
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
          "discrete-sampled/discretization-methods",
          "implementation/computer-control-architecture",
          "math/numerical-methods",
          "implementation/digital-pid"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "v1.3"
      },
      {
        "slug": "embedded-implementation",
        "title": "嵌入式控制",
        "subsections": [
          {
            "slug": "从温控箱读数到接口合同",
            "title": "从温控箱读数到接口合同"
          },
          {
            "slug": "adc码值与工程量",
            "title": "ADC码值与工程量"
          },
          {
            "slug": "逐拍计算与pwm输出",
            "title": "逐拍计算与PWM输出"
          },
          {
            "slug": "量化进入反馈以后",
            "title": "量化进入反馈以后"
          },
          {
            "slug": "样本交接与时间戳",
            "title": "样本交接与时间戳"
          },
          {
            "slug": "从主机验证到板上验收",
            "title": "从主机验证到板上验收"
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
          "implementation/controller-discretization-practice"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "v1.3"
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
        "status": "v1.3"
      },
      {
        "slug": "networked-control",
        "title": "网络控制",
        "subsections": [
          {
            "slug": "远程读数为什么会变旧",
            "title": "远程读数为什么会变旧"
          },
          {
            "slug": "模型和事件顺序",
            "title": "模型和事件顺序"
          },
          {
            "slug": "信息年龄与接收策略",
            "title": "信息年龄与接收策略"
          },
          {
            "slug": "一拍时延改变了什么",
            "title": "一拍时延改变了什么"
          },
          {
            "slug": "丢包与乱序实验",
            "title": "丢包与乱序实验"
          },
          {
            "slug": "从时间戳到故障处理",
            "title": "从时间戳到故障处理"
          },
          {
            "slug": "python复算与轨迹",
            "title": "Python复算与轨迹"
          },
          {
            "slug": "常见误区",
            "title": "常见误区"
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
          "implementation/realtime-control",
          "discrete-sampled/sampled-data-systems"
        ],
        "level": "grad",
        "type": "impl",
        "status": "v1.3"
      },
      {
        "slug": "industrial-bus-protocols",
        "title": "工业通信",
        "subsections": [
          {
            "slug": "接通线路之后",
            "title": "接通线路之后"
          },
          {
            "slug": "先分清三个层次",
            "title": "先分清三个层次"
          },
          {
            "slug": "一帧请求与响应",
            "title": "一帧请求与响应"
          },
          {
            "slug": "寄存器不等于工程量",
            "title": "寄存器不等于工程量"
          },
          {
            "slug": "把轮询放进时间预算",
            "title": "把轮询放进时间预算"
          },
          {
            "slug": "交互实验与失败边界",
            "title": "交互实验与失败边界"
          },
          {
            "slug": "can与工业以太网",
            "title": "CAN与工业以太网"
          },
          {
            "slug": "联调记录与故障路径",
            "title": "联调记录与故障路径"
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
          "implementation/computer-control-architecture",
          "implementation/realtime-control"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "v1.3"
      },
      {
        "slug": "hil-rapid-prototyping",
        "title": "半实物仿真",
        "subsections": [
          {
            "slug": "先替换哪一半",
            "title": "先替换哪一半"
          },
          {
            "slug": "从模型到实物的验证层次",
            "title": "从模型到实物的验证层次"
          },
          {
            "slug": "接口与时间合同",
            "title": "接口与时间合同"
          },
          {
            "slug": "步长不是运行速度",
            "title": "步长不是运行速度"
          },
          {
            "slug": "可运行的虚拟台架",
            "title": "可运行的虚拟台架"
          },
          {
            "slug": "超期和故障注入",
            "title": "超期和故障注入"
          },
          {
            "slug": "怎样准备真正的hil",
            "title": "怎样准备真正的HIL"
          },
          {
            "slug": "验收证据与停止条件",
            "title": "验收证据与停止条件"
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
          "implementation/controller-discretization-practice",
          "implementation/realtime-control"
        ],
        "level": "undergrad",
        "type": "impl",
        "status": "v1.3"
      },
      {
        "slug": "implementation-case-study",
        "title": "控制实现案例",
        "subsections": [
          {
            "slug": "从能运行到可验收",
            "title": "从能运行到可验收"
          },
          {
            "slug": "一页实现合同",
            "title": "一页实现合同"
          },
          {
            "slug": "逐拍执行顺序",
            "title": "逐拍执行顺序"
          },
          {
            "slug": "量化后的pi",
            "title": "量化后的PI"
          },
          {
            "slug": "默认结果先对账",
            "title": "默认结果先对账"
          },
          {
            "slug": "注入失效再验收",
            "title": "注入失效再验收"
          },
          {
            "slug": "追踪一条故障记录",
            "title": "追踪一条故障记录"
          },
          {
            "slug": "交付与实机入口",
            "title": "交付与实机入口"
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
          "implementation/pid-engineering-tuning",
          "implementation/industrial-bus-protocols",
          "implementation/hil-rapid-prototyping"
        ],
        "level": "undergrad",
        "type": "case",
        "status": "v1.3"
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
        "status": "v1.3",
        "subsections": [{"slug": "从房间温升提出问题", "title": "从房间温升提出问题"}, {"slug": "把经验写成学习问题", "title": "把经验写成学习问题"}, {"slug": "训练误差与总体风险", "title": "训练误差与总体风险"}, {"slug": "三份数据各做什么", "title": "三份数据各做什么"}, {"slug": "复杂度与过拟合", "title": "复杂度与过拟合"}, {"slug": "工况变化与控制边界", "title": "工况变化与控制边界"}, {"slug": "习题", "title": "习题"}, {"slug": "答案", "title": "答案"}]
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
        "status": "v1.3",
        "subsections": [{"slug": "两种标签对应两种任务", "title": "两种标签对应两种任务"}, {"slug": "线性回归从损失出发", "title": "线性回归从损失出发"}, {"slug": "用正则化约束斜率", "title": "用正则化约束斜率"}, {"slug": "从分数到分类概率", "title": "从分数到分类概率"}, {"slug": "交叉熵如何训练", "title": "交叉熵如何训练"}, {"slug": "训练与预测的接口", "title": "训练与预测的接口"}, {"slug": "实验结果与使用边界", "title": "实验结果与使用边界"}, {"slug": "习题", "title": "习题"}, {"slug": "答案", "title": "答案"}]
      },
      {
        "slug": "neural-networks",
        "title": "神经网络基础",
        "subsections": [
          {
            "slug": "两台水泵的指示灯",
            "title": "两台水泵的指示灯"
          },
          {
            "slug": "从一个神经元到一层",
            "title": "从一个神经元到一层"
          },
          {
            "slug": "非线性不能省略",
            "title": "非线性不能省略"
          },
          {
            "slug": "手算一次前向传播",
            "title": "手算一次前向传播"
          },
          {
            "slug": "移动折点观察函数",
            "title": "移动折点观察函数"
          },
          {
            "slug": "xor的表示与边界",
            "title": "XOR的表示与边界"
          },
          {
            "slug": "参数如何学习",
            "title": "参数如何学习"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          },
          {
            "slug": "继续学习",
            "title": "继续学习"
          }
        ],
        "prereq": [
          "machine-learning/supervised-learning",
          "math/multivariable-calculus"
        ],
        "level": "undergrad",
        "type": "learning",
        "status": "v1.3"
      },
      {
        "slug": "autodiff-optimization",
        "title": "自动微分与训练",
        "subsections": [
          {
            "slug": "温升预测开始学参数",
            "title": "温升预测开始学参数"
          },
          {
            "slug": "计算图保存局部关系",
            "title": "计算图保存局部关系"
          },
          {
            "slug": "反向传播累加贡献",
            "title": "反向传播累加贡献"
          },
          {
            "slug": "实现最小自动微分",
            "title": "实现最小自动微分"
          },
          {
            "slug": "训练循环与数据隔离",
            "title": "训练循环与数据隔离"
          },
          {
            "slug": "学习率与停止原因",
            "title": "学习率与停止原因"
          },
          {
            "slug": "小批量与工程接口",
            "title": "小批量与工程接口"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          },
          {
            "slug": "继续学习",
            "title": "继续学习"
          }
        ],
        "prereq": [
          "machine-learning/neural-networks",
          "math/numerical-methods"
        ],
        "level": "undergrad",
        "type": "learning",
        "status": "v1.3"
      },
      {
        "slug": "sequence-models",
        "title": "时序模型",
        "subsections": [{"slug": "停热以后仍有余温", "title": "停热以后仍有余温"},
{"slug": "先规定预测时刻", "title": "先规定预测时刻"},
{"slug": "窗口与循环状态", "title": "窗口与循环状态"},
{"slug": "沿时间反向传播", "title": "沿时间反向传播"},
{"slug": "截断梯度保留状态", "title": "截断梯度保留状态"},
{"slug": "一步预测与自由滚动", "title": "一步预测与自由滚动"},
{"slug": "门控模型与工程接口", "title": "门控模型与工程接口"},
{"slug": "习题", "title": "习题"},
{"slug": "答案", "title": "答案"},
{"slug": "继续学习", "title": "继续学习"}],
        "prereq": [
          "machine-learning/autodiff-optimization",
          "math/stochastic-processes"
        ],
        "level": "grad",
        "type": "learning",
        "status": "v1.3"
      },
      {
        "slug": "attention-transformers",
        "title": "注意力机制",
        "subsections": [
          {
            "slug": "从记忆状态到查阅记录",
            "title": "从记忆状态到查阅记录"
          },
          {
            "slug": "查询键与值",
            "title": "查询键与值"
          },
          {
            "slug": "缩放点积与稳定计算",
            "title": "缩放点积与稳定计算"
          },
          {
            "slug": "因果掩码挡住未来",
            "title": "因果掩码挡住未来"
          },
          {
            "slug": "位置与排列",
            "title": "位置与排列"
          },
          {
            "slug": "多头和transformer",
            "title": "多头和Transformer"
          },
          {
            "slug": "预测合同与计算代价",
            "title": "预测合同与计算代价"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          },
          {
            "slug": "继续学习",
            "title": "继续学习"
          }
        ],
        "prereq": [
          "machine-learning/sequence-models"
        ],
        "level": "grad",
        "type": "learning",
        "status": "v1.3"
      },
      {
        "slug": "representation-learning",
        "title": "表征学习",
        "subsections": [
          {
            "slug": "亮度变化遮住横向偏差",
            "title": "亮度变化遮住横向偏差"
          },
          {
            "slug": "编码器与任务接口",
            "title": "编码器与任务接口"
          },
          {
            "slug": "从重构学习一个方向",
            "title": "从重构学习一个方向"
          },
          {
            "slug": "冻结表征再训练探针",
            "title": "冻结表征再训练探针"
          },
          {
            "slug": "任务方向与验证选择",
            "title": "任务方向与验证选择"
          },
          {
            "slug": "对比学习与增强边界",
            "title": "对比学习与增强边界"
          },
          {
            "slug": "迁移与部署的边界",
            "title": "迁移与部署的边界"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          },
          {
            "slug": "继续学习",
            "title": "继续学习"
          }
        ],
        "prereq": [
          "machine-learning/autodiff-optimization",
          "machine-learning/attention-transformers"
        ],
        "level": "grad",
        "type": "learning",
        "status": "v1.3"
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
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "加噪与噪声预测",
            "title": "加噪与噪声预测"
          },
          {
            "slug": "反向采样的含义",
            "title": "反向采样的含义"
          },
          {
            "slug": "条件流匹配",
            "title": "条件流匹配"
          },
          {
            "slug": "高斯流与数值采样",
            "title": "高斯流与数值采样"
          },
          {
            "slug": "实验与边界",
            "title": "实验与边界"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          },
          {
            "slug": "继续学习",
            "title": "继续学习"
          }
        ]
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
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "先冻结实验协议",
            "title": "先冻结实验协议"
          },
          {
            "slug": "切分数据与泄漏",
            "title": "切分数据与泄漏"
          },
          {
            "slug": "验证集选择阈值",
            "title": "验证集选择阈值"
          },
          {
            "slug": "测试指标与代价",
            "title": "测试指标与代价"
          },
          {
            "slug": "配对比较与不确定性",
            "title": "配对比较与不确定性"
          },
          {
            "slug": "失败场景与复现",
            "title": "失败场景与复现"
          },
          {
            "slug": "习题",
            "title": "习题"
          },
          {
            "slug": "答案",
            "title": "答案"
          },
          {
            "slug": "继续学习",
            "title": "继续学习"
          }
        ]
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
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "辨识任务",
            "title": "辨识任务"
          },
          {
            "slug": "数据与实验",
            "title": "数据与实验"
          },
          {
            "slug": "模型与准则",
            "title": "模型与准则"
          },
          {
            "slug": "贯穿算例",
            "title": "贯穿算例"
          },
          {
            "slug": "验证与边界",
            "title": "验证与边界"
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
        "slug": "model-structures",
        "title": "辨识模型",
        "prereq": [
          "identification/identification-framework",
          "discrete-sampled/difference-equation"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "从递推到延迟算子",
            "title": "从递推到延迟算子"
          },
          {
            "slug": "输入与噪声两条通道",
            "title": "输入与噪声两条通道"
          },
          {
            "slug": "多项式模型",
            "title": "多项式模型"
          },
          {
            "slug": "同一水箱的两种噪声假设",
            "title": "同一水箱的两种噪声假设"
          },
          {
            "slug": "阶次延迟与状态表示",
            "title": "阶次延迟与状态表示"
          },
          {
            "slug": "怎样选择候选",
            "title": "怎样选择候选"
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
        "slug": "least-squares-rls",
        "title": "最小二乘辨识",
        "prereq": [
          "identification/model-structures",
          "math/matrix-decomposition",
          "math/probability-basics"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "把动态数据排成回归",
            "title": "把动态数据排成回归"
          },
          {
            "slug": "批量最小二乘",
            "title": "批量最小二乘"
          },
          {
            "slug": "带先验的递推",
            "title": "带先验的递推"
          },
          {
            "slug": "遗忘因子与交互探索",
            "title": "遗忘因子与交互探索"
          },
          {
            "slug": "信息不足与数值保护",
            "title": "信息不足与数值保护"
          },
          {
            "slug": "噪声假设与闭环边界",
            "title": "噪声假设与闭环边界"
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
        "slug": "persistent-excitation",
        "title": "持久激励",
        "prereq": [
          "identification/least-squares-rls"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "信息藏在哪个方向",
            "title": "信息藏在哪个方向"
          },
          {
            "slug": "从满秩到持久激励",
            "title": "从满秩到持久激励"
          },
          {
            "slug": "四种输入与回归量",
            "title": "四种输入与回归量"
          },
          {
            "slug": "参数为什么逐渐可辨",
            "title": "参数为什么逐渐可辨"
          },
          {
            "slug": "交互观察信息窗口",
            "title": "交互观察信息窗口"
          },
          {
            "slug": "幅值与噪声的代价",
            "title": "幅值与噪声的代价"
          },
          {
            "slug": "实际试验怎样检查",
            "title": "实际试验怎样检查"
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
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "反馈怎样带来相关",
            "title": "反馈怎样带来相关"
          },
          {
            "slug": "一个有时序的闭环例",
            "title": "一个有时序的闭环例"
          },
          {
            "slug": "最小二乘趋向哪里",
            "title": "最小二乘趋向哪里"
          },
          {
            "slug": "工具变量的两个条件",
            "title": "工具变量的两个条件"
          },
          {
            "slug": "交互检查总体矩",
            "title": "交互检查总体矩"
          },
          {
            "slug": "同一批记录的有限样本实验",
            "title": "同一批记录的有限样本实验"
          },
          {
            "slug": "还有哪些闭环路线",
            "title": "还有哪些闭环路线"
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
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "先把频率和记录说清",
            "title": "先把频率和记录说清"
          },
          {
            "slug": "从dft比值到互谱估计",
            "title": "从DFT比值到互谱估计"
          },
          {
            "slug": "相干度能说明什么",
            "title": "相干度能说明什么"
          },
          {
            "slug": "贯穿算例与交互实验",
            "title": "贯穿算例与交互实验"
          },
          {
            "slug": "记录长度与窗的代价",
            "title": "记录长度与窗的代价"
          },
          {
            "slug": "噪声位置决定偏差",
            "title": "噪声位置决定偏差"
          },
          {
            "slug": "一次可复核的实验流程",
            "title": "一次可复核的实验流程"
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
        "slug": "subspace-id",
        "title": "子空间辨识",
        "prereq": [
          "identification/least-squares-rls",
          "modern/controllability-observability",
          "math/matrix-decomposition"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "从状态到一串脉冲响应",
            "title": "从状态到一串脉冲响应"
          },
          {
            "slug": "hankel矩阵为何低秩",
            "title": "Hankel矩阵为何低秩"
          },
          {
            "slug": "用svd得到一个实现",
            "title": "用SVD得到一个实现"
          },
          {
            "slug": "交互检查阶次与弱模态",
            "title": "交互检查阶次与弱模态"
          },
          {
            "slug": "一般输入为何要先消去",
            "title": "一般输入为何要先消去"
          },
          {
            "slug": "从子空间恢复输入输出模型",
            "title": "从子空间恢复输入输出模型"
          },
          {
            "slug": "带噪声时怎样验证",
            "title": "带噪声时怎样验证"
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
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "非线性放在哪里",
            "title": "非线性放在哪里"
          },
          {
            "slug": "把动态预测写成回归",
            "title": "把动态预测写成回归"
          },
          {
            "slug": "一步预测与自由滚动",
            "title": "一步预测与自由滚动"
          },
          {
            "slug": "先规定数据与选择规则",
            "title": "先规定数据与选择规则"
          },
          {
            "slug": "交互检查拟合与外推",
            "title": "交互检查拟合与外推"
          },
          {
            "slug": "非线性特征也要有激励",
            "title": "非线性特征也要有激励"
          },
          {
            "slug": "三工况重复实验",
            "title": "三工况重复实验"
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
        "slug": "identification-case-study",
        "title": "系统辨识案例",
        "prereq": [
          "identification/instrumental-variable",
          "identification/frequency-domain-id",
          "machine-learning/learning-evaluation"
        ],
        "level": "grad",
        "type": "case",
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "把工程问题写成验收合同",
            "title": "把工程问题写成验收合同"
          },
          {
            "slug": "记录与时序先审计",
            "title": "记录与时序先审计"
          },
          {
            "slug": "闭环候选怎样估计",
            "title": "闭环候选怎样估计"
          },
          {
            "slug": "验证选择与测试放行",
            "title": "验证选择与测试放行"
          },
          {
            "slug": "频域证据与残差检查",
            "title": "频域证据与残差检查"
          },
          {
            "slug": "交互复核整条链路",
            "title": "交互复核整条链路"
          },
          {
            "slug": "重复记录与失败边界",
            "title": "重复记录与失败边界"
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
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "估计任务与信息边界",
            "title": "估计任务与信息边界"
          },
          {
            "slug": "状态和噪声模型",
            "title": "状态和噪声模型"
          },
          {
            "slug": "用不确定性描述估计",
            "title": "用不确定性描述估计"
          },
          {
            "slug": "预测与测量修正",
            "title": "预测与测量修正"
          },
          {
            "slug": "条件与失效边界",
            "title": "条件与失效边界"
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
        "slug": "least-squares-ml",
        "title": "统计估计",
        "prereq": [
          "estimation/estimation-problem",
          "math/convex-optimization",
          "math/probability-basics"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "估计量与误差",
            "title": "估计量与误差"
          },
          {
            "slug": "最小二乘",
            "title": "最小二乘"
          },
          {
            "slug": "噪声不同怎样加权",
            "title": "噪声不同怎样加权"
          },
          {
            "slug": "从似然得到估计",
            "title": "从似然得到估计"
          },
          {
            "slug": "先验与后验",
            "title": "先验与后验"
          },
          {
            "slug": "检验估计的条件",
            "title": "检验估计的条件"
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
        "status": "v1.3"
      },
      {
        "slug": "extended-kalman-filter",
        "title": "扩展卡尔曼滤波",
        "subsections": [
          {
            "slug": "从读数到非线性模型",
            "title": "从读数到非线性模型"
          },
          {
            "slug": "误差为何要线性化",
            "title": "误差为何要线性化"
          },
          {
            "slug": "预测与校正的完整递推",
            "title": "预测与校正的完整递推"
          },
          {
            "slug": "一拍算例",
            "title": "一拍算例"
          },
          {
            "slug": "近似的后验与失败例",
            "title": "近似的后验与失败例"
          },
          {
            "slug": "多维测量与工程实现",
            "title": "多维测量与工程实现"
          },
          {
            "slug": "稳定性和适用边界",
            "title": "稳定性和适用边界"
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
          "estimation/kalman-filter",
          "math/multivariable-calculus",
          "nonlinear/lyapunov-stability"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "unscented-kalman-filter",
        "title": "无迹卡尔曼滤波",
        "subsections": [
  {
    "slug": "问题与模型",
    "title": "问题与模型"
  },
  {
    "slug": "sigma点与两套权重",
    "title": "sigma点与两套权重"
  },
  {
    "slug": "无迹变换怎样传播矩",
    "title": "无迹变换怎样传播矩"
  },
  {
    "slug": "预测与校正的完整递推",
    "title": "预测与校正的完整递推"
  },
  {
    "slug": "一拍校正的手算与复算",
    "title": "一拍校正的手算与复算"
  },
  {
    "slug": "交互探索与公平比较",
    "title": "交互探索与公平比较"
  },
  {
    "slug": "数值与实现边界",
    "title": "数值与实现边界"
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
          "estimation/kalman-filter",
          "math/probability-basics"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
      },
      {
        "slug": "particle-filter",
        "title": "粒子滤波",
        "subsections": [
  {
    "slug": "从单高斯到带权粒子",
    "title": "从单高斯到带权粒子"
  },
  {
    "slug": "bayes递推与重要性权重",
    "title": "Bayes递推与重要性权重"
  },
  {
    "slug": "bootstrap粒子滤波的逐拍步骤",
    "title": "bootstrap粒子滤波的逐拍步骤"
  },
  {
    "slug": "四个粒子的手算更新",
    "title": "四个粒子的手算更新"
  },
  {
    "slug": "ess与系统重采样",
    "title": "ESS与系统重采样"
  },
  {
    "slug": "交互观察分布函数",
    "title": "交互观察分布函数"
  },
  {
    "slug": "多种子与逐拍实验",
    "title": "多种子与逐拍实验"
  },
  {
    "slug": "实现边界与小结",
    "title": "实现边界与小结"
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
          "estimation/estimation-problem",
          "math/stochastic-processes",
          "math/numerical-methods"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
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
        "subsections": [
  {
    "slug": "两次读数是否两份信息",
    "title": "两次读数是否两份信息"
  },
  {
    "slug": "同一状态的联合观测",
    "title": "同一状态的联合观测"
  },
  {
    "slug": "独立噪声的信息相加",
    "title": "独立噪声的信息相加"
  },
  {
    "slug": "相关噪声与白化更新",
    "title": "相关噪声与白化更新"
  },
  {
    "slug": "交互实验与一致性",
    "title": "交互实验与一致性"
  },
  {
    "slug": "共享先验与未知相关性",
    "title": "共享先验与未知相关性"
  },
  {
    "slug": "时间坐标与非线性对齐",
    "title": "时间坐标与非线性对齐"
  },
  {
    "slug": "实现流程与边界",
    "title": "实现流程与边界"
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
        "status": "v1.3"
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
        "subsections": [
  {
    "slug": "从小车需求到验收合同",
    "title": "从小车需求到验收合同"
  },
  {
    "slug": "模型单位与时间轴",
    "title": "模型、单位与时间轴"
  },
  {
    "slug": "先算清第一拍",
    "title": "先算清第一拍"
  },
  {
    "slug": "把单拍接成逐拍融合",
    "title": "把单拍接成逐拍融合"
  },
  {
    "slug": "创新门限能做什么",
    "title": "创新门限能做什么"
  },
  {
    "slug": "交互检查误差与报告协方差",
    "title": "交互检查误差与报告协方差"
  },
  {
    "slug": "多种子核查与失败记录",
    "title": "多种子核查与失败记录"
  },
  {
    "slug": "从教学仿真到运行系统",
    "title": "从教学仿真到运行系统"
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
        "status": "v1.3"
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
          "modern/state-space",
          "modern/lqr-controller"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
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
        "status": "v1.3"
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
        "status": "v1.3"
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
        "status": "v1.3"
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
        "status": "v1.3"
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
        "status": "v1.3"
      },
      {
        "slug": "mu-analysis",
        "title": "结构奇异值",
        "subsections": [
          {
            "slug": "从定位台误差到结构问题",
            "title": "从定位台误差到结构问题"
          },
          {
            "slug": "结构集合与归一化",
            "title": "结构集合与归一化"
          },
          {
            "slug": "结构奇异值的定义",
            "title": "结构奇异值的定义"
          },
          {
            "slug": "三个可手算的结构",
            "title": "三个可手算的结构"
          },
          {
            "slug": "缩放上界与扰动下界",
            "title": "缩放上界与扰动下界"
          },
          {
            "slug": "从单频到鲁棒稳定性",
            "title": "从单频到鲁棒稳定性"
          },
          {
            "slug": "鲁棒性能与计算边界",
            "title": "鲁棒性能与计算边界"
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
          "robust/robust-performance",
          "math/matrix-decomposition"
        ],
        "level": "advanced",
        "type": "theory",
        "status": "v1.3"
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
          "math/convex-optimization"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
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
        "status": "v1.3"
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
        "status": "v1.3"
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
        "status": "v1.3"
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
        "subsections": [{"slug": "从本拍有解到下一拍", "title": "从本拍有解到下一拍"}, {"slug": "问题与可行集", "title": "问题与可行集"}, {"slug": "终端三条件", "title": "终端三条件"}, {"slug": "移位证明", "title": "移位证明"}, {"slug": "值函数下降", "title": "值函数下降"}, {"slug": "标量算例", "title": "标量算例"}, {"slug": "交互式可视化", "title": "交互式可视化"}, {"slug": "实现与失效边界", "title": "实现与失效边界"}, {"slug": "习题", "title": "习题"}, {"slug": "答案", "title": "答案"}],
        "status": "v1.3"
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
        "status": "v1.3"
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
        "subsections": [{"slug": "从每拍求解到离线分区", "title": "从每拍求解到离线分区"}, {"slug": "参数化的约束qp", "title": "参数化的约束QP"}, {"slug": "活跃集怎样生成区域", "title": "活跃集怎样生成区域"}, {"slug": "五区域手算例", "title": "五区域手算例"}, {"slug": "边界与退化", "title": "边界与退化"}, {"slug": "交互式可视化", "title": "交互式可视化"}, {"slug": "在线查找与部署", "title": "在线查找与部署"}, {"slug": "等价与稳定的边界", "title": "等价与稳定的边界"}, {"slug": "习题", "title": "习题"}, {"slug": "答案", "title": "答案"}],
        "status": "v1.3"
      },
      {
        "slug": "nonlinear-mpc",
        "title": "非线性预测控制",
        "subsections": [{"slug": "为什么需要-nmpc", "title": "为什么需要 NMPC"}, {"slug": "非线性预测模型", "title": "非线性预测模型"}, {"slug": "nmpc-优化问题", "title": "NMPC 优化问题"}, {"slug": "sqp-求解", "title": "SQP 求解"}, {"slug": "实时迭代方案", "title": "实时迭代方案"}, {"slug": "lyapunov-based-nmpc", "title": "Lyapunov-based NMPC"}, {"slug": "稳定性分析", "title": "稳定性分析"}, {"slug": "数值例子非线性摆", "title": "数值例子：非线性摆"}, {"slug": "多稳态系统的-nmpc", "title": "多稳态系统的 NMPC"}, {"slug": "交互式可视化", "title": "交互式可视化"}, {"slug": "软件工具", "title": "软件工具"}, {"slug": "工业应用", "title": "工业应用"}, {"slug": "深入讨论", "title": "深入讨论"}, {"slug": "小结", "title": "小结"}, {"slug": "习题", "title": "习题"}, {"slug": "答案", "title": "答案"}],
        "prereq": [
          "mpc/mpc-stability",
          "nonlinear/nonlinear-characteristics",
          "math/numerical-methods"
        ],
        "level": "advanced",
        "type": "theory",
        "status": "v1.3"
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
        "subsections": [{"slug": "从库存跟踪到经济目标", "title": "从库存跟踪到经济目标"}, {"slug": "经济阶段成本与最优稳态", "title": "经济阶段成本与最优稳态"}, {"slug": "两时段储水问题", "title": "两时段储水问题"}, {"slug": "一个可复算的经济计划", "title": "一个可复算的经济计划"}, {"slug": "交互式可视化", "title": "交互式可视化"}, {"slug": "耗散性与旋转成本", "title": "耗散性与旋转成本"}, {"slug": "终端项不能随意删除", "title": "终端项不能随意删除"}, {"slug": "周期运行与稳定边界", "title": "周期运行与稳定边界"}, {"slug": "实现合同与预测误差", "title": "实现合同与预测误差"}, {"slug": "习题", "title": "习题"}, {"slug": "答案", "title": "答案"}],
        "status": "v1.3"
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
        "status": "v1.3",
        "subsections": [
          {
            "slug": "送餐前要不要充电",
            "title": "送餐前要不要充电"
          },
          {
            "slug": "一次交互的先后顺序",
            "title": "一次交互的先后顺序"
          },
          {
            "slug": "把任务写成mdp",
            "title": "把任务写成MDP"
          },
          {
            "slug": "奖励与整段回报",
            "title": "奖励与整段回报"
          },
          {
            "slug": "策略改变未来数据",
            "title": "策略改变未来数据"
          },
          {
            "slug": "最小实验与评估",
            "title": "最小实验与评估"
          },
          {
            "slug": "边界与常见误解",
            "title": "边界与常见误解"
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
        "slug": "dynamic-programming",
        "title": "价值函数与贝尔曼方程",
        "prereq": [
          "rl-control/rl-basics",
          "math/variational-dp"
        ],
        "level": "undergrad",
        "type": "learning",
        "status": "v1.3",
        "subsections": [
          {
            "slug": "从送餐回报到状态价值",
            "title": "从送餐回报到状态价值"
          },
          {
            "slug": "给定策略的两种价值",
            "title": "给定策略的两种价值"
          },
          {
            "slug": "回报的一步分解",
            "title": "回报的一步分解"
          },
          {
            "slug": "反复送餐的循环模型",
            "title": "反复送餐的循环模型"
          },
          {
            "slug": "解出给定策略的价值",
            "title": "解出给定策略的价值"
          },
          {
            "slug": "最优方程与策略改进",
            "title": "最优方程与策略改进"
          },
          {
            "slug": "值迭代与停止证书",
            "title": "值迭代与停止证书"
          },
          {
            "slug": "实验与适用边界",
            "title": "实验与适用边界"
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
        "subsections": [
          {
            "title": "从三辆小车出发",
            "slug": "从三辆小车出发"
          },
          {
            "title": "对象和信息分开建模",
            "slug": "对象和信息分开建模"
          },
          {
            "title": "局部反馈怎样连成整体",
            "slug": "局部反馈怎样连成整体"
          },
          {
            "title": "一致不等于完成任务",
            "slug": "一致不等于完成任务"
          },
          {
            "title": "通信结构改变结果",
            "slug": "通信结构改变结果"
          },
          {
            "title": "从理想协议走向实现",
            "slug": "从理想协议走向实现"
          },
          {
            "title": "习题",
            "slug": "习题"
          },
          {
            "title": "答案",
            "slug": "答案"
          }
        ],
        "prereq": [
          "math/graph-theory",
          "modern/state-space"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
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
        "subsections": [
          {
            "slug": "小车停得住吗",
            "title": "小车停得住吗"
          },
          {
            "slug": "稳定与安全",
            "title": "稳定与安全"
          },
          {
            "slug": "把危险写成约束",
            "title": "把危险写成约束"
          },
          {
            "slug": "停车距离预算",
            "title": "停车距离预算"
          },
          {
            "slug": "从约束到可行行动",
            "title": "从约束到可行行动"
          },
          {
            "slug": "监测与回退",
            "title": "监测与回退"
          },
          {
            "slug": "安全论证与后续路线",
            "title": "安全论证与后续路线"
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
          "classic/stability-analysis",
          "nonlinear/lyapunov-stability"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3"
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
        "status": "v1.3",
        "subsections": [
  {
    "slug": "引言",
    "title": "引言"
  },
  {
    "slug": "机构与自由度",
    "title": "机构与自由度"
  },
  {
    "slug": "构型与任务",
    "title": "构型与任务"
  },
  {
    "slug": "状态与测量",
    "title": "状态与测量"
  },
  {
    "slug": "输入与动力学",
    "title": "输入与动力学"
  },
  {
    "slug": "滑台算例",
    "title": "滑台算例"
  },
  {
    "slug": "模型边界",
    "title": "模型边界"
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
        "subsections": [
          {
            "slug": "搬杯子之前先读懂记录",
            "title": "搬杯子之前先读懂记录"
          },
          {
            "slug": "一次尝试怎样成为轨迹",
            "title": "一次尝试怎样成为轨迹"
          },
          {
            "slug": "按可用时间配对观测与动作",
            "title": "按可用时间配对观测与动作"
          },
          {
            "slug": "动作数字必须带着执行语义",
            "title": "动作数字必须带着执行语义"
          },
          {
            "slug": "先划分轨迹再生成窗口",
            "title": "先划分轨迹再生成窗口"
          },
          {
            "slug": "只用训练数据确定变换",
            "title": "只用训练数据确定变换"
          },
          {
            "slug": "数据覆盖和公开资料的边界",
            "title": "数据覆盖和公开资料的边界"
          },
          {
            "slug": "从原日志到可交付数据",
            "title": "从原日志到可交付数据"
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
          "machine-learning/learning-problem",
          "math/probability-basics"
        ],
        "level": "grad",
        "type": "learning",
        "status": "v1.3"
      },
      {
        "slug": "imitation-learning",
        "title": "模仿学习",
        "subsections": [
          {
            "slug": "从搬杯子到学动作",
            "title": "从搬杯子到学动作"
          },
          {
            "slug": "行为克隆的输入输出",
            "title": "行为克隆的输入输出"
          },
          {
            "slug": "从示范拟合一个策略",
            "title": "从示范拟合一个策略"
          },
          {
            "slug": "离线误差与闭环偏移",
            "title": "离线误差与闭环偏移"
          },
          {
            "slug": "在访问过的状态上问专家",
            "title": "在访问过的状态上问专家"
          },
          {
            "slug": "新增数据也有表达能力边界",
            "title": "新增数据也有表达能力边界"
          },
          {
            "slug": "同一画面可以有多种动作",
            "title": "同一画面可以有多种动作"
          },
          {
            "slug": "训练与部署的验收合同",
            "title": "训练与部署的验收合同"
          },
          {
            "slug": "方法边界与资料",
            "title": "方法边界与资料"
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
          "robot-learning/robot-data",
          "machine-learning/supervised-learning"
        ],
        "level": "grad",
        "type": "learning",
        "status": "v1.3"
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
        "status": "v1.3"
,
        "subsections": [
          {
            "title": "杯子为什么没有到位",
            "slug": "杯子为什么没有到位"
          },
          {
            "title": "系统由什么组成",
            "slug": "系统由什么组成"
          },
          {
            "title": "观测与动作的接口",
            "slug": "观测与动作的接口"
          },
          {
            "title": "不同速度的闭环",
            "slug": "不同速度的闭环"
          },
          {
            "title": "一个可运行的最小系统",
            "slug": "一个可运行的最小系统"
          },
          {
            "title": "学习方法放在哪一层",
            "slug": "学习方法放在哪一层"
          },
          {
            "title": "怎样读前沿证据",
            "slug": "怎样读前沿证据"
          },
          {
            "title": "小结",
            "slug": "小结"
          },
          {
            "title": "习题",
            "slug": "习题"
          },
          {
            "title": "答案",
            "slug": "答案"
          }
        ]
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
        "status": "v1.3",
        "subsections": [
          {
            "title": "夹爪挡住杯子之后",
            "slug": "夹爪挡住杯子之后"
          },
          {
            "title": "三种模态各知道什么",
            "slug": "三种模态各知道什么"
          },
          {
            "title": "先把观测对齐",
            "slug": "先把观测对齐"
          },
          {
            "title": "怎样合成位置读数",
            "slug": "怎样合成位置读数"
          },
          {
            "title": "迟到和相关误差",
            "slug": "迟到和相关误差"
          },
          {
            "title": "从传感器到学习表征",
            "slug": "从传感器到学习表征"
          },
          {
            "title": "怎样验证多模态有用",
            "slug": "怎样验证多模态有用"
          },
          {
            "title": "小结",
            "slug": "小结"
          },
          {
            "title": "习题",
            "slug": "习题"
          },
          {
            "title": "答案",
            "slug": "答案"
          }
        ]
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
          "modern/state-space"
        ],
        "level": "undergrad",
        "type": "theory",
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "先约定运行范围",
            "title": "先约定运行范围"
          },
          {
            "slug": "把车辆放回闭环",
            "title": "把车辆放回闭环"
          },
          {
            "slug": "消息必须带什么",
            "title": "消息必须带什么"
          },
          {
            "slug": "从延迟算停车预算",
            "title": "从延迟算停车预算"
          },
          {
            "slug": "监控与回退也在系统里",
            "title": "监控与回退也在系统里"
          },
          {
            "slug": "闭环测试要看什么",
            "title": "闭环测试要看什么"
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
        "slug": "vehicle-dynamics",
        "title": "车辆动力学",
        "prereq": [
          "autonomous-driving/driving-system",
          "math/ode-matrix-exponential",
          "modern/state-space"
        ],
        "level": "grad",
        "type": "theory",
        "status": "v1.3",
        "subsections": [
          {
            "slug": "引言",
            "title": "引言"
          },
          {
            "slug": "坐标与状态",
            "title": "坐标与状态"
          },
          {
            "slug": "无侧滑的转弯几何",
            "title": "无侧滑的转弯几何"
          },
          {
            "slug": "纵向力与附着预算",
            "title": "纵向力与附着预算"
          },
          {
            "slug": "轮胎怎样产生侧向力",
            "title": "轮胎怎样产生侧向力"
          },
          {
            "slug": "从力与力矩得到横向模型",
            "title": "从力与力矩得到横向模型"
          },
          {
            "slug": "算例与模型边界",
            "title": "算例与模型边界"
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
          "classic/pid-controller",
          "modern/state-feedback",
          "classic/frequency-response-design",
          "discrete-sampled/sampling-period-selection"
        ],
        "level": "grad",
        "type": "case",
        "status": "v1.3",
        "subsections": [
          {
                    "title": "供电问题与能量通路",
                    "slug": "供电问题与能量通路"
          },
          {
                    "title": "从开关状态到平均模型",
                    "slug": "从开关状态到平均模型"
          },
          {
                    "title": "稳态与纹波预算",
                    "slug": "稳态与纹波预算"
          },
          {
                    "title": "平均模型怎样核验",
                    "slug": "平均模型怎样核验"
          },
          {
                    "title": "电压反馈怎样闭环",
                    "slug": "电压反馈怎样闭环"
          },
          {
                    "title": "采样限幅与保护",
                    "slug": "采样限幅与保护"
          },
          {
                    "title": "习题",
                    "slug": "习题"
          },
          {
                    "title": "答案",
                    "slug": "答案"
          }
]
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
