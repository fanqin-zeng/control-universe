# 数学依赖图谱（A4 交付物）

> 生成日期：2026-09-25 · 阶段：semester-02 A4
> 范围：全部 **56 门已写课程**（math 1 + classic 10 + modern 10 + robust 8 + discrete-sampled 5 + implementation 3 + mpc 8 + nonlinear 8 + intelligent 3）
> 方法：4 路并行只读扫描，逐课逐 H2 小节判定"实质性数学依赖"——即该节要么**就地长篇讲解**了某个数学概念（按 SKILL.md 第 272–282 行规则本应改为引用 math 章），要么**重度使用且零解释**。每行给出小节标题、正文原话/术语、以及 16 门 math 课中最匹配的一门。

## 0. 关键事实：`📐` 引用惯例仅 4 处按规范使用（2026-09-26 更正）

> **更正说明**：本节原文写"全仓 `📐` 字符出现次数为 **0**"，该测量是错的——Windows 下 Bash 的 `grep` 匹配不到这个 emoji（编码问题），必须用 Node 按码点 `\u{1F4D0}` 扫描才拿得到真值。A6 开工前的复核实测给出下列数字：**结论方向不变（规范引用几乎没被执行），但依据已更正**。

全仓 `content/**/*.mdx` 中 `📐`（U+1F4D0）实测出现 **20 次**，分布在 **16 个文件**。按用途分四类：

| 类别 | 处数 | 明细 |
|---|---|---|
| **符合 SKILL.md 规范**（`> 📐 …详见 [标题](/math/…)`） | **4** | 全部指向 `/math/complex-numbers`：`classic/transfer-function:63`、`nonlinear/describing-function:28`、`nonlinear/nonlinear-characteristics:38`、`nonlinear/phase-plane:29` |
| 跨课前置说明（链接指向**其他控制课**，不含 /math/） | 7 | `intelligent/fuzzy-control-basics:16`、`fuzzy-controller-design:18` 与 `:991`、`neural-network-control:20`、`nonlinear/adaptive-control-basics:20`、`backstepping:29`、`robust/robust-case-study:260` |
| 纯数学洞见旁注（无任何链接） | 7 | `classic/frequency-domain-analysis:124`（对数运算的同构映射）、`:565`、`:671`（Hilbert 变换）、`time-domain-analysis:81`（部分分式展开）、`discrete-sampled/z-transform-analysis:65`（符号约定）、`robust/mu-synthesis:96`（LFT）、`uncertainty-modeling:212`（互质分解） |
| JupyterNotebook 标题前缀 | 2 | `classic/frequency-domain-analysis:237`、`classic/root-locus:433` |

因此：

- A4 第 2 步"已有的 📐 引用行（全部摘出）"= **上表第一类的 4 行**（原文误记为空集）；
- A4 第 3 步"修正已有 📐 链接目标"= **仍是空操作**——这 4 行的目标 slug `complex-numbers` 与 §2.2 完全一致，无需修改。唯一与 math 章相关的存量错链是散文式的
  `nonlinear/feedback-linearization.mdx:17` 的 `/math/linear-algebra`（Q14 死链之一，**不带 📐**，所以不在上表内），本次已修正为 `/math/linear-algebra-basics`；
- A4 第 4 步的"缺失引用清单"= **下文第 1 节的全部行**（284 行依赖、56 课**全部**至少 1 行），其中 `complex-numbers` 的 25 行里有 4 行已被上述规范引用覆盖；
  按用户裁决**只列清单、不插入正文**。
- **A6 交接**：`nonlinear-characteristics:38` 与 `phase-plane:29` 还链接 `/modern/linear-system-theory`，A6 第 2 章把该课改名为 `lyapunov-modern` 时必须同步这两行。
- **工具教训**：涉及 emoji / 非 ASCII 的全仓统计一律用 Node 按码点扫描，不要用 Bash 的 `grep`；本次误判正是因为 `grep -ro '📐'` 静默返回 0 而不是报错。

## 1. 依赖明细

### 1.1 classic（10 课）+ math/complex-numbers

#### classic/system-modeling
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 从一个实际问题开始：汽车悬挂 | "这就是一个二阶线性常微分方程"；"多自由度系统的矩阵形式……转化为一阶向量微分方程 $\dot{\mathbf{x}} = A\mathbf{x} + B\mathbf{u}$" | ode-matrix-exponential |
| 电气系统建模 | "微分方程都是线性的——未知函数 $y(t)$ 和它的各阶导数都以一次幂出现"；"不满足叠加原理" | linear-algebra-basics |
| 耦合系统：直流电机 | "两个方程通过 $K_e\,\omega$ 和 $K_t\,i$ 耦合在一起，不能单独求解"（联立微分方程组） | ode-matrix-exponential |
| 深入讨论 | "线性化：从非线性到线性"；"$\sin\theta \approx \theta$（泰勒展开取第一项）" | numerical-methods |

#### classic/transfer-function
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 微分方程的困难 | "高阶微分方程的解析求解极其困难——你需要求特征方程的根（四次以上没有通用求根公式），再拼出通解" | ode-matrix-exponential |
| 拉普拉斯变换：把微分变代数 | "拉普拉斯变换的定义是一个积分"；"把信号 $f(t)$ 分解成一系列'广义指数分量' $e^{st}$ 的叠加"；"部分分式分解 + 查表反变换" | laplace-transform |
| 传递函数的定义 | "把极点画为 ×、零点画为 ○，标在复平面上"；"共轭复极点 $p = -\sigma \pm j\omega_d$" | complex-numbers |
| 传递函数好在哪里 | "不需要解微分方程，只看极点位置，就能判断稳定性" | eigen-decomposition |
| 二阶系统：最重要的范例 | "解特征方程 $s^2 + 2\zeta\omega_n s + \omega_n^2 = 0$"；"共轭极点从虚轴出发，沿着 $\omega_n$ 半径的圆弧向左移动" | complex-numbers |
| 从传递函数看频率响应 | "把 $s = j\omega$ 代入传递函数"；"$e^{j\omega t}$ 正是等幅正弦的复数表示（欧拉公式）" | fourier-analysis |
| 传递函数的局限 | "零极点对消……$G_b$ 内部有一个不稳定极点 $s = +1$"；"不可控/不可观模态" | eigen-decomposition |

#### classic/time-domain-analysis
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 典型输入信号 | 信号表列出"时域表达式 / 拉普拉斯变换"两列 | laplace-transform |
| 一阶系统的阶跃响应 | "用部分分式展开，把一个复杂分式拆成两个简单分式"；"查拉普拉斯逆变换表" | laplace-transform |
| 二阶系统阶跃响应 | "欠阻尼二阶系统有两个共轭复数极点 $s_{1,2} = -\zeta\omega_n \pm j\omega_d$" | laplace-transform |
| 高阶系统与主导极点 | "最靠近虚轴的极点主导了系统的动态响应" | eigen-decomposition |
| 工程实例：悬挂系统时域分析 | "取拉普拉斯变换（零初始条件）"（建模—反变换求时域解全流程） | laplace-transform |

#### classic/stability-analysis
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 稳定性的定义 | "特征方程的根（闭环极点）决定了系统的'自然频率'……所有模态都会衰减" | eigen-decomposition |
| Hurwitz判据 | "构造 Hurwitz 矩阵"；"$\Delta_i$ 是 $H$ 的左上角 $i \times i$ 子矩阵的行列式" | linear-algebra-basics |
| 从根轨迹看稳定性 | "将 $s = j\omega$ 代入特征方程，分别令实部和虚部为零" | complex-numbers |
| 从频域看稳定性 | "给系统输入不同频率的正弦信号，测量输出幅值和相位" | fourier-analysis |
| 时滞系统的稳定性 | "含时滞的闭环特征方程包含 $e^{-Ls}$ 项，这不是多项式——有无穷多个根"；"Padé 近似" | laplace-transform |

#### classic/root-locus
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 基本概念 | "闭环特征方程的根（即闭环极点）在 $s$ 平面上描绘出的轨迹" | eigen-decomposition |
| 根轨迹的数学基础 | "$KG(s) = -1$ 是一个复数方程。$-1$ 的极坐标形式是 $1 \cdot e^{j\pi}$"（幅值/相角条件） | complex-numbers |
| 绘制规则 | "令 $s = j\omega$ 代入特征方程，分离实部虚部分别为零" | complex-numbers |
| 完整绘制示例 | "$(j\omega)^3 + 6(j\omega)^2 + 8(j\omega) + K = 0$……实部：$-6\omega^2 + K = 0$" | complex-numbers |
| 从根轨迹读取时域性能 | "等阻尼比线：从原点出发的射线，与负实轴夹角 $\theta = \arccos\zeta$" | complex-numbers |
| 用根轨迹设计控制器 | "通过添加零点和极点（即设计控制器），可以'塑造'根轨迹的形状" | eigen-decomposition |

#### classic/pid-controller
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| PID控制律 | "对上面的式子取拉普拉斯变换（零初始条件）：$C(s) = K_p + K_i/s + K_d s$" | laplace-transform |
| 微分控制D：预判趋势，提前刹车 | "微分操作对高频分量有放大作用：$\frac{d}{dt}[\sin(\omega t)] = \omega \cos(\omega t)$" | fourier-analysis |
| PID的工程实现 | "后向差分近似积分，前向差分近似微分"；"采样周期选择：$T_s \approx t_r/10 \sim t_r/20$" | numerical-methods |

#### classic/frequency-response

> **A6 迁移说明（2026-09-26，仅标注、未改动下表数据）**：本课已由 A6 第 1 章重命名为 **`classic/frequency-response-design`**（标题"频率响应设计法：回路整形与带宽"），下表 7 行中的 4 行所在小节已**逐字迁入 `classic/frequency-domain-analysis`**——`在Nyquist图上读取裕度`、`稳定性判据`、`频域指标与时域指标的对应`（并入 fda 既有同名节，H2 被去掉）、以及未在本表出现的 `在Bode图上读取裕度`。因此后续执行"第 4 步插入 📐 引用"时，这 4 行的**目标课程应改为 fda**；留在本课的只有 `增益裕度与相位裕度`、`闭环频率响应`、`时滞对频率响应的影响`、`工程应用：Ziegler-Nichols 整定法` 4 行。本表按 A4 扫描时点原样保留，便于核对依赖行数的历史口径（284 行）。

| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 增益裕度与相位裕度 | "相位穿越频率 $\omega_g$：开环相位为 $-180°$ 时的频率" | fourier-analysis |
| 在Nyquist图上读取裕度 | "从原点到交点的向量 $G(j\omega_c)$ 与负实轴之间的夹角就是相位裕度" | complex-numbers |
| 稳定性判据 | "Nyquist 判据：$Z = P - N$……$N$ 是 Nyquist 曲线逆时针包围 $(-1, j0)$ 的圈数" | complex-numbers |
| 频域指标与时域指标的对应 | "$G(j\omega) = \frac{\omega_n^2}{-\omega^2 + j2\zeta\omega_n\omega}$" 推导 PM 与 ζ 关系 | complex-numbers |
| 闭环频率响应 | "谐振峰值 $M_r = \max_\omega |T(j\omega)|$"；"带宽 $\omega_b$：$-3$ dB 的频率" | fourier-analysis |
| 时滞对频率响应的影响 | "$e^{-j\omega L} = \cos(\omega L) - j\sin(\omega L)$" | complex-numbers |
| 工程应用：Ziegler-Nichols 整定法 | "临界频率 $\omega_u$……振荡周期 $T_u = 2\pi/\omega_u$" | fourier-analysis |

#### classic/frequency-domain-analysis

> **A6 补充（2026-09-26）**：本课已吸收 `classic/frequency-response`（现 `frequency-response-design`）的 4 个小节，H2 由 10 增至 **13**。新增小节的数学依赖仍登记在上表 `#### classic/frequency-response` 名下（`在Bode图上读取裕度` 未登记、`在Nyquist图上读取裕度` / `稳定性判据` / `频域指标与时域指标的对应` 3 行需改挂到本课），插入 📐 引用时请按新归属定位。

| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 频率响应函数 | "$C_1$ 是 $Y(s)$ 在 $s = j\omega$ 处的留数。用留数定理"；"利用欧拉公式化简" | laplace-transform |
| Bode 图 | 复数乘除→模加/辐角加减："$20\log|G(j\omega)| = 20\log|K| + \cdots$" | complex-numbers |
| Nyquist 图 | "Nyquist 判据的数学本质是复变函数中的幅角原理（Argument Principle）" | complex-numbers |
| 频域指标与时域指标的对应 | "带宽 $\omega_B$：幅频特性下降到 $-3$ dB 时的频率" | fourier-analysis |
| 工程实例 | "电容的阻抗 $Z_C = 1/(j\omega C)$ 随频率升高而降低"（相量阻抗） | complex-numbers |
| 深入讨论 | "时延的频率响应为 $e^{-j\omega\tau}$：幅值恒为 1，相位为 $-\omega\tau$" | fourier-analysis |

#### classic/compensator-design
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 超前校正 | "$\phi(\omega) = \arctan(\alpha T\omega) - \arctan(T\omega)$……利用 $\arctan(x) + \arctan(1/x) = \pi/2$"（复数辐角运算） | complex-numbers |
| 从根轨迹看校正 | "根轨迹上的点 $s$ 满足角度条件 $\sum \angle(s - z_i) - \sum \angle(s - p_i) = 180°$" | eigen-decomposition |
| 深入讨论 | "中频段以 $-20$ dB/dec 的斜率穿越 0 dB 线……相位约为 $-90°$"（频段整形/增益-相位关系） | fourier-analysis |

#### classic/classic-case-study
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 建立被控对象模型 | "对两个方程做拉普拉斯变换（零初始条件），消去 $i_a$" | laplace-transform |
| 分析未校正系统 | "阻尼比 $\zeta = 0.5$ 对应的射线角度为 $\cos^{-1}(0.5) = 60°$" | complex-numbers |
| 鲁棒性检验 | "做蒙特卡洛分析：随机采样参数组合，统计性能指标的分布" | probability-basics |
| 工程实现细节 | "Tustin（双线性）$s = \frac{2}{T_s}\frac{z-1}{z+1}$……ZOH 等价 $z = e^{sT_s}$" | z-transform |
| 深入讨论 | "极点配置：选择状态反馈 $u = -Kx + r$，使闭环极点位于期望位置" | eigen-decomposition |

#### math/complex-numbers（自身向外引用点）
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 极坐标形式 | "$e^{i\omega t}$ 表示频率为 $\omega$ 的正弦振荡" | fourier-analysis |
| 复数在控制理论中的角色 | "传递函数 $G(s)$ 是复变量 $s$ 的函数"；极点与左半平面稳定性 | laplace-transform |

### 1.2 modern（10 课）

#### modern/state-space
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 状态变量的定义 | 状态向量 $\boldsymbol{x}(t)\in\mathbb{R}^n$、相似变换 $\boldsymbol{z}=T\boldsymbol{x}$ | linear-algebra-basics |
| 从物理系统建立状态空间模型 | 高阶微分方程拆成 n 个一阶方程、"矩阵A的特征值决定了系统的动态特性" | ode-matrix-exponential |
| 从传递函数到状态空间 | 可控标准型/可观标准型、通过相似变换相互联系 | linear-algebra-basics |
| 状态方程的求解 | 状态转移矩阵 $e^{At}$ 级数定义、$\mathcal{L}^{-1}\{(sI-A)^{-1}\}$、凯莱-哈密顿定理 | ode-matrix-exponential |
| 状态空间与传递函数的关系 | $G(s)=C(sI-A)^{-1}B+D$、对状态方程做拉普拉斯变换 | laplace-transform |

#### modern/controllability-observability
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 可控性 | 可控性矩阵 $\mathcal{C}=[B\ AB\ \cdots\ A^{n-1}B]$ 满秩、PBH 左特征向量 | linear-algebra-basics |
| 可观性 | 可观性矩阵 $\mathcal{O}$ 满秩、PBH 右特征向量 | linear-algebra-basics |
| 对偶原理 | 对偶系统 $(A^T,C^T,B^T)$、用转置证明秩相等 | linear-algebra-basics |
| 可控/可观分解与最小实现 | 四个子空间、分块结构、坐标变换（相似变换） | linear-algebra-basics |
| 深入讨论 | 可控性 Gramian、Lyapunov 方程 $AW_c+W_cA^T+BB^T=0$、$W_c$ 正定 | matrix-decomposition |

#### modern/state-feedback
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 状态反馈的基本概念 | 闭环矩阵 $A-BK$、特征多项式 $\det(sI-A_{cl})$ | eigen-decomposition |
| 极点配置问题 | 期望特征多项式 $p_d(s)$、可控标准型下比较系数 | eigen-decomposition |
| 一般系统的极点配置 | Ackermann 公式、Cayley-Hamilton 定理 | eigen-decomposition |
| 前馈补偿与参考跟踪 | $N=1/(-C(A-BK)^{-1}B)$（逆矩阵） | linear-algebra-basics |

#### modern/state-observer
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 全阶观测器的设计 | 误差动态 $\dot e=(A-LC)e$、配置 $A-LC$ 的特征值 | eigen-decomposition |
| 对偶原理 | $(A-LC)^T=A^T-C^TL^T$、转置 | linear-algebra-basics |
| 基于观测器的控制器——分离性原理 | 增广矩阵分块上三角、特征值=对角块特征值之并 | eigen-decomposition |
| 深入讨论 | 过程噪声 w、测量噪声 v、"最小化估计误差的方差" | probability-basics |

#### modern/optimal-control-basics
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 最优控制问题的数学表述 | 泛函 $J[u]$、终值代价 φ、运行代价 L | variational-dp |
| 变分法：对泛函求极值 | Euler-Lagrange 方程、变分 $\delta J=0$ | variational-dp |
| Hamilton函数与极小值原理 | $H=L+\lambda^Tf$、协态变量、Pontryagin 极小值原理、两点边值问题 | variational-dp |
| 最小时间问题与Bang-Bang控制 | $H=1+\lambda^Tf$、$u^*=\arg\min_{|u|\le1}$ | variational-dp |
| 线性二次型最优控制——引向LQR | 二次型性能指标 $x^TQx+u^TRu$、Q 半正定、R 正定、Riccati 方程 | matrix-decomposition |

#### modern/lqr-controller
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 为什么需要LQR | Q≥0（半正定）、R>0（正定）的二次型代价 | matrix-decomposition |
| 有限时间LQ问题 | Hamilton 函数、协态方程、TPBVP、Riccati 变换 $\lambda=P(t)x$ | variational-dp |
| 有限时间LQ问题 | 微分 Riccati 方程 $-\dot P=A^TP+PA-PBR^{-1}B^TP+Q$ | matrix-decomposition |
| 无穷时间LQR——代数Riccati方程 | ARE、唯一半正定解 P≥0、$K=R^{-1}B^TP$ | matrix-decomposition |
| LQR的鲁棒性 | 回差等式 $|1+G(j\omega)|^2\geq1$、Nyquist 图 | laplace-transform |
| LQR与参考跟踪 | $N=-1/(C(A-BK)^{-1}B)$（逆矩阵） | linear-algebra-basics |

#### modern/kalman-filter
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 随机系统模型 | 高斯白噪声、$E[w(t)w(\tau)^T]=Q\delta(t-\tau)$ | stochastic-processes |
| 卡尔曼滤波的结构 | 估计误差协方差矩阵 $P=E[\tilde x\tilde x^T]$、最小化 tr(P) | probability-basics |
| 卡尔曼增益的推导 | 对 tr(Ṗ) 关于 $K_f$ 求导（矩阵微分） | numerical-methods |
| 卡尔曼增益的推导 | 滤波 Riccati 方程 $\dot P=AP+PA^T-PC^TR^{-1}CP+Q$ | matrix-decomposition |
| 稳态卡尔曼滤波 | 滤波代数 Riccati 方程、可检测性 | matrix-decomposition |
| 对偶性：卡尔曼滤波vs LQR | 对偶替换规则 $A\to A^T, B\to C^T, Q\leftrightarrow R$ | matrix-decomposition |
| LQG控制 | 分离性原理 $\det(sI-A_{cl})=\det(sI-A+BK)\cdot\det(sI-A+K_fC)$ | eigen-decomposition |
| Q和R的选择 | 以实际噪声方差作为 R | probability-basics |

#### modern/linear-system-theory
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| Lyapunov稳定性理论 | $V=x^TPx$ 正定、Lyapunov 方程 $A^TP+PA=-Q$ | matrix-decomposition |
| 内部稳定性与外部稳定性 | A 的特征值（内部稳定）vs G(s) 极点（BIBO） | eigen-decomposition |
| 可稳定性与可检测性 | $\text{rank}[sI-A\ B]<n$ 的不可控模式、秩条件 | linear-algebra-basics |
| Lyapunov方程与LQR的关系 | ARE 改写为 $(A-BK)^TP+P(A-BK)=-(Q+K^TRK)$ | matrix-decomposition |
| 深入讨论 | Schur 分解、离散 Lyapunov 方程 $A^TPA-P=-Q$ | matrix-decomposition |

#### modern/multivariable-systems
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| MIMO极点与零点 | 传输零点 det G(s)=0、Rosenbrock 系统矩阵降秩 | linear-algebra-basics |
| 交互分析与RGA | $\Lambda=K\circ(K^{-1})^T$、Hadamard 积 | linear-algebra-basics |
| 解耦控制 | $G(s)T(s)=\text{diag}$、$T=K^{-1}$ | linear-algebra-basics |
| 深入讨论 | 结构化奇异值 μ、"μ<1 保证鲁棒稳定" | matrix-decomposition |

#### modern/modern-case-study
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 第一步：建立状态空间模型 | 二阶 ODE 化为一阶状态方程、小角度线性化 sinθ≈θ | ode-matrix-exponential |
| 第二步：分析系统性质 | 开环极点 det(sI-A)、可控性矩阵 rank=4 | linear-algebra-basics |
| 第三步：状态反馈设计 | 解代数 Riccati 方程 | matrix-decomposition |
| 第四步：观测器设计 | $\dot e=(A-LC)e$、增广矩阵分块上三角 | eigen-decomposition |
| 第五步：处理噪声——卡尔曼滤波与LQG | $E[ww^T]=Q_n$、$E[vv^T]=R_n$ | probability-basics |
| 第六步：稳定性验证——Lyapunov方程 | $A_{cl}^TP+PA_{cl}=-Q$、"如果 P>0（正定）" | matrix-decomposition |
| 第七步：MIMO扩展——RGA分析 | $\Lambda=G_{ss}\circ(G_{ss}^{-1})^T$ | linear-algebra-basics |

### 1.3 robust（8 课）

#### robust/robustness-concept
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 不确定性的分类 | 加性/乘性不确定性 $G_p=G(1+\Delta_m)$、$|\Delta_m(j\omega)|\leq W_m(\omega)$ | laplace-transform |
| 灵敏度函数 | $M_S=\|S\|_\infty$ 是"Nyquist 曲线上离临界点(-1,0)最近距离的倒数" | complex-numbers |
| $\mathcal{H}_\infty$范数 | $\|G\|_\infty=\sup_\omega|G(j\omega)|$ | matrix-decomposition |
| 小增益定理 | $\|M\|_\infty\cdot\|\Delta\|_\infty<1$、M-Δ 反馈连接 | matrix-decomposition |
| 回顾：LQR的鲁棒性 | "Nyquist 曲线始终在以(-1,0)为圆心、半径为1的圆外" | complex-numbers |

#### robust/h-infinity-basics
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 从分析到综合 | 设计需求翻译为 $|S(j\omega)|<0.01$ 等频域约束 | laplace-transform |
| 加权函数 | $W_1(s)=\frac{s/M^{1/p}+\omega_b}{s+\omega_bA^{1/p}}$、低频/高频增益整形 | laplace-transform |
| 标准$\mathcal{H}_\infty$问题 | 分块矩阵、下线性分式变换 $T_{zw}=P_{11}+P_{12}K(I-P_{22}K)^{-1}P_{21}$ | matrix-decomposition |
| 求解方法概述 | 两个代数 Riccati 方程（DGKF）、"稳定半正定解" | matrix-decomposition |
| 求解方法概述 | LMI 方法"将 H∞ 问题转化为凸优化问题" | convex-optimization |
| 回路整形设计实例 | 共振峰 $|G(j\omega_n)|=1/(2\zeta)$、陷波滤波器零极点配置 | laplace-transform |

#### robust/mixed-sensitivity
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 混合灵敏度问题深入 | 三角不等式 $|S|+|T|\geq|S+T|=1$、Bode 积分定理 | complex-numbers |
| 广义被控对象构造 | 分块矩阵 $P(s)$、$(I+GK)^{-1}$ | linear-algebra-basics |
| 权重函数选择方法论 | 一阶权重的零点/极点、上界包络 $|S(j\omega)|<\gamma/|W_1(j\omega)|$ | laplace-transform |
| H∞综合求解方法 | 两个 ARE、半正定解、谱半径条件 $\rho(XY)<\gamma^2$ | matrix-decomposition |
| H∞综合求解方法 | LMI 凸优化、"凸优化保证全局最优" | convex-optimization |

#### robust/mu-synthesis
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 为什么H∞不够 | 小增益定理保守性 | matrix-decomposition |
| 结构化不确定性 | 块对角矩阵、上线形分式变换 $\mathcal{F}_u(G_u,\Delta)$、$\bar\sigma(\Delta)\leq1$ | matrix-decomposition |
| 结构化奇异值μ | $\mu=1/\min\{\bar\sigma(\Delta):\det(I-M\Delta)=0\}$、$\rho(M)\leq\mu\leq\bar\sigma(M)$ | matrix-decomposition |
| D-K迭代 | "联合优化(K,D)不是凸问题"、局部最优 | convex-optimization |
| 不确定性建模 | 复数化：$\delta\in[-1,1]$ 替换为 $\{z\in\mathbb{C}:|z|\leq1\}$ 复数圆盘 | complex-numbers |
| 设计实例 | Monte Carlo 随机采样 500 次、超调量的均值/直方图分布 | probability-basics |

#### robust/uncertainty-modeling
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 加性与乘性不确定性 | 频响界、"落在以G(jω)为圆心、Wa(ω)为半径的圆盘内" | laplace-transform |
| 互质分解不确定性 | $G=NM^{-1}$、Bezout 恒等式 $XM+YN=I$ | matrix-decomposition |
| LFT系统构造 | $\mathcal{F}_u(P,\Delta)=P_{22}+P_{21}\Delta(I-P_{11}\Delta)^{-1}P_{12}$ | matrix-decomposition |
| MIMO不确定性结构 | 块对角 Δ、最大奇异值 $\bar\sigma(T_O)$ | matrix-decomposition |
| 实参数不确定性的处理 | 复数化、"质量不可能变成复数" | complex-numbers |
| 不确定性验证 | Monte Carlo 随机采样、"性能满足率>99%" | probability-basics |

#### robust/robust-stability
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 从稳定裕度到鲁棒稳定性 | 增益/相位不确定性、$|1+\delta|<GM$ | laplace-transform |
| 参数空间方法 | Routh 表、区间多项式、Kharitonov 4 个多项式 | eigen-decomposition |
| Lyapunov方法：二次稳定性 | 公共正定矩阵 $P>0$、$A(\theta)^TP+PA(\theta)<0$ | matrix-decomposition |
| Lyapunov方法：二次稳定性 | "仿射函数在凸多面体上的极值在顶点取到"、$2^p$ 个顶点 LMI | convex-optimization |
| 频域鲁棒分析 | Nyquist 曲线与临界点(-1,0)的距离 | complex-numbers |
| 实用方法：Monte Carlo仿真 | 随机采样 N 个点、置信度 $1-\beta$、$N\geq\frac{2}{\epsilon}(\ln\frac{1}{\beta}+1)$ | probability-basics |
| 深入讨论 | LMI 标准形式、"可行域是凸集"、内点法 | convex-optimization |

#### robust/robust-performance
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| μ鲁棒性能定理 | 增广结构 blkdiag、$\det(I-M\Delta)\neq0$、$\bar\sigma(M_{22})<1$ | matrix-decomposition |
| 三个条件的定量关系 | 最坏情况不确定性 $\Delta_{wc}$ | matrix-decomposition |
| 混合灵敏度与鲁棒性能的关系 | $\|T_{zw}\|_\infty<1$ 的传递函数形式 | laplace-transform |
| 性能权重的工程选择 | $W_p(s)=\frac{s/M+\omega_b}{s+\omega_bA}$、转折频率 | laplace-transform |
| 设计实例 | Monte Carlo 500 次采样、峰值的均值/95%分位 | probability-basics |

#### robust/robust-case-study
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 问题描述 | "拉普拉斯变换后求解 $G(s)=X_2(s)/F(s)$" | laplace-transform |
| 不确定性分析 | Δ=diag、LFT 增广对象 | matrix-decomposition |
| 设计需求 | 频域翻译 $|S(0)|<0.01$、权重转折频率 | laplace-transform |
| H∞混合灵敏度设计 | $\min_K\|[W_1S;W_2T;W_3KS]\|_\infty$、mixsyn 求解 | matrix-decomposition |
| μ分析验证 | $\sup_\omega\mu(M_{11}(j\omega))=0.85$、最坏情况 $\delta_m^*=0.7$ | matrix-decomposition |
| μ综合改进 | D-K 迭代 $\inf_D\|DMD^{-1}\|_\infty$ 的逐次收敛表 | matrix-decomposition |
| Monte Carlo验证 | 均匀采样 N=1000、超调均值/95%分位/超标率 | probability-basics |

### 1.4 mpc（8 课）

#### mpc/mpc-principle
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 线性MPC的数学公式 | "转化为标准的二次规划（QP）"、Hessian $H=2(\Phi^T\bar Q\Phi+\bar R)$ | convex-optimization |
| MPC与LQR的区别 | "无约束 QP 的最优解由 KKT 条件给出 $HU^*+f=0$" | convex-optimization |
| 稳定性分析 | 终端代价 $x^TP_f x$、终端约束集 $\{x:x^TP_fx\le\alpha\}$ | matrix-decomposition |

#### mpc/prediction-model
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 状态空间预测模型 | "$A_e$ 是块下三角矩阵，其特征值 = $A$ 的特征值 ∪ {1,…,1}"、PBH 判据 | eigen-decomposition |
| CARIMA模型 | $A(z^{-1}),B(z^{-1})$ 多项式、差分算子 $\Delta=1-z^{-1}$、Diophantine 方程 | z-transform |
| 模型辨识基础 | PRBS "具有近似白噪声的频谱特性"、最小二乘拟合 | stochastic-processes |

#### mpc/receding-horizon
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 滚动优化与稳定性 | "Riccati 方程的解 $P>0$ 保证 Lyapunov 函数递减" | matrix-decomposition |
| QP求解与实时性 | "$H$ 正定（保证凸性和唯一解）"、主动集法/内点法/ADMM | convex-optimization |
| 显式MPC | "最优解是 $x$ 的分段仿射（PWA）函数"、"多面体划分" | convex-optimization |

#### mpc/constraint-handling
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 约束到QP标准形式的转化 | 约束矩阵堆叠（半空间/多面体可行域） | convex-optimization |
| 硬约束与软约束 | 松弛变量 + 罚项的精确罚函数 QP | convex-optimization |
| 硬约束与软约束 | "$V$ 太大 → Hessian 矩阵条件数变差，QP 求解困难" | numerical-methods |
| 约束优化的最优性条件 | "KKT 条件（对凸 QP 是最优性的充要条件）"、互补松弛 | convex-optimization |
| 约束可行性与不可行性 | 可行性恢复 $\min \epsilon^2$ s.t. $AU\le b+\epsilon\mathbf 1$ | convex-optimization |
| 约束活性与工况变化 | "$U^*(x)$ 是分段仿射的" | convex-optimization |
| 深入讨论 | 非凸约束、序列凸化、混合整数 QP（MIQP）分支定界 | convex-optimization |

#### mpc/generalized-predictive-control
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| CARIMA 模型回顾 | $\frac{C(z^{-1})}{\Delta}\xi(k)$、差分算子 | z-transform |
| CARIMA 模型回顾（噪声模型部分） | "$\xi(k)$ 是零均值白噪声"、"随机游走"、谱密度 | stochastic-processes |
| Diophantine 方程 | "本质就是多项式长除法，把 $1/\tilde A$ 展开为 $z^{-1}$ 的幂级数" | z-transform |
| j 步 ahead 预测 | 下三角 Toeplitz 矩阵、条件期望 $E[\cdot\mid\text{data}]$ | z-transform |
| GPC 代价函数 | "$G^TG$ 的条件数变差"、"$\lambda I$ 保证可逆，和 Ridge 回归正则化完全一样" | numerical-methods |
| GPC 解析解 | $\Delta U^*=(G^TG+\Lambda)^{-1}G^T(W-f)$、矩阵求逆 $O(N_u^3)$ | convex-optimization |
| 约束 GPC | "加入约束后…需要求解 QP" | convex-optimization |
| 稳定性分析 | "P 是 Riccati 方程的解"、$\tilde A$ 的根在单位圆内 | matrix-decomposition |

#### mpc/mpc-case-study
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 建立被控对象模型 | "在工作点处做 Taylor 展开，保留一阶项"、Jacobian | numerical-methods |
| 离散化与预测模型 | "$A_d=e^{A_cT_s}$"、零阶保持器 | ode-matrix-exponential |
| MPC 控制器设计 | QP 构造、Bryson 规则 | convex-optimization |
| 约束设置 | 合并约束矩阵 $A_{\text{ineq}}$ | convex-optimization |
| 调参与分析 | "$A_c$ 的特征值 $\lambda_1\approx-1.1$，$\lambda_2\approx-0.12$" | eigen-decomposition |

#### mpc/nonlinear-mpc
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 非线性预测模型 | "用数值积分（Euler、RK4 等）将连续模型离散化"、RK4 四阶段公式内联展开 | numerical-methods |
| NMPC 优化问题 | "QP（凸二次规划）vs NLP（非线性规划）"、"可能局部最优" | convex-optimization |
| SQP 求解 | Gauss-Newton "$H=J^TJ$ 正定"、LICQ、超线性收敛 | convex-optimization |
| 稳定性分析 | 离散 Riccati 方程、$V_f(x)=x^TPx$ | matrix-decomposition |

#### mpc/distributed-mpc
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| ADMM分解算法 | 增广拉格朗日函数 $L_\rho$、对偶变量更新 | convex-optimization |
| 收敛性分析 | "凸性：$f_i$ 和 $g$ 是凸函数"、收敛速度 $O(1/k)$ | convex-optimization |
| 通信拓扑影响 | 邻接矩阵、"拉普拉斯矩阵 $L=D-A$"、"代数连通度（第二小特征值 $\lambda_2(L)$）" | graph-theory |
| 路口协调案例 | "非凸约束（'或'逻辑），需线性化或用指示变量处理" | convex-optimization |

### 1.5 nonlinear（8 课）

#### nonlinear/lyapunov-stability
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 李雅普诺夫间接法 | "所有特征值实部为负（Hurwitz）"、Lyapunov 方程 $A^TP+PA=-Q$ | eigen-decomposition |
| 李雅普诺夫函数的构造方法 | 二次型 $V=x^TPx$、"$P>0$ 用 Sylvester 判据（顺序主子式全正）" | matrix-decomposition |

#### nonlinear/feedback-linearization
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 仿射非线性系统与Lie导数 | 漂移/控制向量场、$L_f\lambda$、Lie 括号 $[f,g]$、$\mathrm{ad}_f g$ | diff-geometry |
| 相对阶严格定义 | $L_gL_f^{k}h\equiv0$ 且 $L_gL_f^{r-1}h(x_0)\ne0$、"退化点" | diff-geometry |
| 输入-输出线性化 | $u=(v-L_f^rh)/L_gL_f^{r-1}h$、"这不是近似，是恒等式" | diff-geometry |
| 零动态与内部稳定性 | 零动态特征值、最小相位/非最小相位 | eigen-decomposition |
| 全状态线性化 | "对合（involutive）"、Frobenius 定理 | diff-geometry |
| 坐标变换到Brunovsky标准型 | "全局微分同胚"、变换雅可比行列式 $1+x_1^2\ne0$ | diff-geometry |
| 应用案例：球-梁系统 | "相对阶退化"：$L_gL_f^2h=2x_1x_4$ 在平衡点处恰好等于 0 | diff-geometry |
| 应用案例：机器人计算力矩控制 | "$L_gL_fh=M^{-1}(q)$ 处处非奇异（因为 $M$ 正定）" | diff-geometry |

#### nonlinear/sliding-mode-control
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 滑模控制的基本概念 | "$\dot s=L_fs(x)+L_gs(x)u$，其中 $L_fs$、$L_gs$ 是 Lie 导数" | diff-geometry |
| 二阶系统的滑模控制器设计 | "RK4 的中间阶段跨越不连续面，平均值失真且不随 dt 收敛"、抖振带宽度正比于 $dt$ | numerical-methods |
| 匹配与不匹配不确定性 | "$\Delta(x,t)\in\mathrm{span}\{g(x)\}$"、秩条件、"B 的列空间" | linear-algebra-basics |

#### nonlinear/backstepping
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 手算例子 | "4 阶中心差分的截断误差正比于 $dt^4$…细 $dt$ 段反而上升（浮点舍入放大）"的 U 形曲线 | numerical-methods |
| 应用案例 | $\lvert\partial u/\partial x\rvert$ 被 $g_2=200$ 放大到 $2.4\times10^4$、零阶保持期间控制量误差 | numerical-methods |
| 局限性讨论 | "对采样周期远比线性控制器敏感"：1 kHz rms 恶化、200 Hz 与 50 Hz 发散 | numerical-methods |

#### nonlinear/adaptive-control-basics
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 自适应控制的基本概念 | "噪声直接被积分成参数随机游走"、协方差 windup | stochastic-processes |
| 手算例子：一阶系统的MRAC设计 | "步长收敛性检验：如果结果随步长改变，说明看到的是数值假象" | numerical-methods |
| 手算例子：一阶系统的MRAC设计 | PE 度量：窗口积分的最小特征值 $\lambda_{\min}$ | eigen-decomposition |
| 高阶系统的MRAC设计 | "P 的特征值均正 => P > 0" | eigen-decomposition |
| 自整定调节器（STR） | 矩阵求逆引理（Sherman-Morrison）："矩阵加一个秩一更新" | linear-algebra-basics |
| 自整定调节器（STR） | "精确离散化（零阶保持）：$\alpha=e^{-aT_s}$" | ode-matrix-exponential |
| 处理参数不确定性 | "零均值噪声的积分是随机游走——方差不收敛"、白噪声按 $\sqrt{2\tau_n/dt}$ 缩放 | stochastic-processes |
| 应用案例 | "白噪声强度基准：幅度按 sqrt(DT_REF/dt) 缩放，保证与步长无关" | stochastic-processes |

#### nonlinear/describing-function
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 描述函数的定义与滤波假设 | 傅里叶级数系数 $a_n,b_n$ 积分式、"把高次谐波全部丢掉，只留基波" | fourier-analysis |
| 描述函数的定义与滤波假设 | "复数惯例核对"：$b_1+ja_1$ 写反则实虚部整个调位 | complex-numbers |
| 常见非线性的描述函数 | "每个闭式与 40000 点傅里叶积分逐点相减" | fourier-analysis |
| 谐波平衡与极限环预测 | "谐波平衡条件 $N(A)G(j\omega)=-1$"、$-1/N(A)$ 轨迹 | fourier-analysis |
| 极限环的稳定性判据 | Loeb 判据的 Nyquist 读法 | fourier-analysis |
| 应用案例 | 实测基波幅值/THD 与预测对比 | fourier-analysis |
| 何时失效 | "三次谐波被放大 25%"；"切换频率 $\approx1/(2dt)$ 随步长发散" | fourier-analysis |

#### nonlinear/phase-plane
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 相平面与向量场 | "向量场是在平面上每一点画一个箭头 $f(x)$"、相轨迹（流线） | diff-geometry |
| 平衡点分类：迹-行列式平面 | $\tau=\operatorname{tr}J$、$\delta=\det J$；"三个数完全决定局部相图" | eigen-decomposition |
| 线性化何时失效 | Hartman-Grobman 定理、"纯虚特征值…非线性中心是脆弱对象" | eigen-decomposition |
| 鞍点分界线与吸引域 | 沿特征方向的进出轨道 | eigen-decomposition |
| 高维推广：Poincaré 截面与 Floquet 乘子 | "Floquet 乘子 = Poincaré 映射 Jacobian 的特征值"、变分方程 $\dot\Phi=A(t)\Phi$ | eigen-decomposition |
| 分岔：相图的拓扑突变 | "一个乘子穿过 $-1$：周期倍化分岔"（Floquet 乘子） | eigen-decomposition |
| 局限性讨论 | "轨迹相交的假象：步长太大时流线会交叉…积分器精度不足的直接信号" | numerical-methods |

#### nonlinear/nonlinear-characteristics
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 常见非线性类型 | 双频输入产生"和频与差频"：$x^3$ 展开出 $2\omega_1-\omega_2$ 等分量 | fourier-analysis |
| 为什么线性化会失效？ | 泰勒展开只保留前两项；"非双曲平衡点，Hartman-Grobman 定理不适用" | eigen-decomposition |
| 何时需要非线性分析？ | "不连续点上线性化不存在，且仿真会出问题（刚性、Zeno、事件抖振）" | numerical-methods |

### 1.6 discrete-sampled（5 门已写）

#### discrete-sampled/z-transform-analysis
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| Z 变换的定义 | "理想采样信号的拉普拉斯变换 X*(s)=Σx(kTs)e^{−skTs}"，令 z=e^{sTs} | z-transform |
| 常用变换对 | 几何级数求和推导变换对 | z-transform |
| Z 变换的性质 | 延迟定理、初值/终值定理 | z-transform |
| 逆 Z 变换 | 部分分式法逐项查表求逆 | z-transform |
| $z$ 平面与 $s$ 平面的映射 | s=σ+jω ⇒ z=e^{sTs}：模与幅角、左半平面↔单位圆内 | complex-numbers |
| 脉冲传递函数 | ZOH 等效需"计算 G(s)/s 的拉普拉斯逆变换" | laplace-transform |
| 差分方程实现 | 脉冲传递函数化为差分方程直接编程实现 | z-transform |
| 深入讨论 | Tustin 双线性变换的频率扭曲与预扭曲校正 | z-transform |

#### discrete-sampled/discrete-stability-criteria
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| z 域稳定性条件 | 全部极点 \|z_i\|<1；共轭复极点 re^{±jθ} 对应振荡 | z-transform |
| Jury 稳定性判据 | Jury 表中的二阶行列式，逐行构造并判符号 | linear-algebra-basics |
| w 变换与 Routh 判据 | 双线性变换 z=(w+1)/(w−1) 把单位圆内映射为 w 左半平面 | complex-numbers |
| 采样周期对稳定性的影响 | ZOH 相位滞后 PM_d≈PM_c−(ω_gc·Ts/2)(180/π) | fourier-analysis |
| 离散系统的稳定裕度 | 在离散频率点求幅频/相频 | fourier-analysis |
| 深入讨论（Schur-Cohn） | 由多项式系数构造矩阵、计算一系列行列式/顺序主子式 | linear-algebra-basics |
| 深入讨论（离散 Lyapunov） | 离散 Lyapunov 方程 AᵀPA−P=−Q，P>0 ⟺ 特征值在单位圆内 | eigen-decomposition |

#### discrete-sampled/discrete-time-freq
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 采样过程 | 冲激串的傅里叶级数展开、频谱复制、Nyquist-Shannon 采样定理 | fourier-analysis |
| 混叠 | ω₀ 与 ω₀+kω_s 采样后不可区分；抗混叠低通滤波器 | fourier-analysis |
| 采样保持器 | ZOH 传递函数 G(s)=(1−e^{−sTs})/s 推导 | laplace-transform |
| 量化 | 量化误差/舍入噪声、SNR=6.02N+1.76 dB | numerical-methods |
| 量化（噪声模型） | 量化误差近似均匀分布随机变量，方差 σ_q²=q²/12 | probability-basics |
| 设计实例 | 带宽约束 ω_b·Ts<0.1；动态范围定 ADC 位数 | fourier-analysis |
| 深入讨论 | 过采样与 Σ-Δ 调制 | fourier-analysis |

#### discrete-sampled/discretization-methods
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 离散化方法（数值积分观点） | "本质上是选择不同的数值积分方法"：前向/后向欧拉、Tustin=梯形积分 | numerical-methods |
| 离散化方法（s↔z 映射） | 稳定域映射、频率畸变、零极点匹配法 | z-transform |
| 直接数字设计 | ZOH 等效、deadbeat 设计 | z-transform |
| 数字 PID 工程实现 | 微分滤波离散化为一阶递推 | z-transform |
| 设计实例：电机速度控制 | s 域抵消极点、由 \|L(jω_c)\|=1 解穿越频率 | laplace-transform |
| 深入讨论 | 数值积分精度对比表 O(Ts)/O(Ts²)；定点缩放、"移位代替除法" | numerical-methods |

#### discrete-sampled/sampling-period-selection
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 采样周期的影响 | H_ZOH(jω) 的幅值衰减与半步延迟 | fourier-analysis |
| 采样周期选择方法 | Shannon 定理 f_s>2f_max；相位裕度约束 | fourier-analysis |
| 深入讨论 | 非均匀采样产生"频谱泄漏" | fourier-analysis |

### 1.7 implementation（3 门已写）

#### implementation/digital-pid
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 三种实现形式 | 位置式/增量式差分方程 | z-transform |
| PID 改进结构 | 不完全微分一阶滤波及其离散化递推 | z-transform |
| 数字 PID 调参 | 一阶加纯滞后对象、IMC 整定、等效滞后 L'=L+Ts/2 | laplace-transform |

#### implementation/computer-control-architecture
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 通信系统与网络 | 通信时延引入相位滞后 Δφ=−ω_gc·τ_d | fourier-analysis |
| 系统架构类型 | 可靠度 R(t)=e^{−λt}、MTBF、并联冗余与 TMR | probability-basics |

#### implementation/realtime-control
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 实时系统的基本概念 | 抖动消耗相位裕度 Δφ_jitter=ω_gc·ΔT/2 | fourier-analysis |
| 嵌入式实现技巧 | 定点数 Q 格式、溢出保护、sin 查表 + 线性插值 | numerical-methods |
| 性能优化 | "递推计算：避免矩阵求逆"；"稀疏矩阵：O(n³) 降到 O(n)" | linear-algebra-basics |

### 1.8 intelligent（3 门已写）

#### intelligent/fuzzy-control-basics
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 模糊集合与隶属度函数 | "归一化的加权和是凸组合"，输出"保证落在各个 c_i 的凸包内" | convex-optimization |
| 解模糊化方法 | 重心法积分；梯形积分在漏折点时的误差实测 | numerical-methods |
| Mamdani型模糊控制器 | 最小二乘拟合求等效增益、R² | linear-algebra-basics |
| Takagi-Sugeno型（局部线性模型） | "规则库是一组'局部线性模型'"；线性化矩阵、最小二乘拟合结论部参数 | linear-algebra-basics |
| Takagi-Sugeno型（增益调度） | "用 Q=diag(50,1), R=1 解 Riccati" 得各规则局部 LQR 增益，直接使用未加解释 | convex-optimization |
| Takagi-Sugeno型（严格稳定性证明） | "V=x²/2…Vdot<0 ⇒ 全局渐近稳定" | ode-matrix-exponential |
| 应用案例 | 四分之一车模型、前向欧拉 dt=10⁻⁴ 仿真制动距离 | ode-matrix-exponential |

#### intelligent/fuzzy-controller-design
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 被控对象与设计问题 | 倒立摆非线性微分方程模型、Euler 积分 dt=10⁻⁴ | ode-matrix-exponential |
| 稳定性分析 | 能量型 Lyapunov 函数证 V̇<0；TS 型"用分段 Lyapunov + 凸组合性质证明全局稳定性" | convex-optimization |

#### intelligent/neural-network-control
| 小节(H2标题) | 依赖概念(正文中的原话或术语) | math slug |
|---|---|---|
| 前馈神经网络（网络结构） | W₁∈R^{n_h×2} 的矩阵-向量乘法 | linear-algebra-basics |
| 前馈神经网络（输入归一化） | 用训练区间的均值与标准差归一化 | probability-basics |
| 监督学习：用 NN 模仿 PID | 反向传播梯度公式（含 Hadamard 积）、梯度下降与 Adam | numerical-methods |
| 直接优化：让 NN 超越 PID | "60,000 步的 Euler 积分反向传播"；NES 高斯随机扰动 ε_k~N(0,σ²I) | probability-basics |
| 稳定性问题 | "线性化 + 特征值｜局部保证" | eigen-decomposition |

## 2. 每门 math 课被依赖次数排序

下表由脚本从第 1 节表格逐行统计得出（解析 284 行、0 行无法归类）：

| 排名 | math 课程 | 依赖行数 | 涉及课程数 | 涉及章节 |
|---|---|---|---|---|
| 1 | `matrix-decomposition` | 37 | 20 | modern, mpc, nonlinear, robust |
| 2 | `eigen-decomposition` | 31 | 21 | classic, discrete-sampled, intelligent, modern, mpc, nonlinear, robust |
| 3 | `fourier-analysis` | 28 | 14 | classic, discrete-sampled, implementation, math, nonlinear |
| 4 | `convex-optimization` | 27 | 13 | intelligent, mpc, robust |
| 5 | `laplace-transform` | 27 | 20 | classic, discrete-sampled, implementation, math, modern, robust |
| 6 | `linear-algebra-basics` | 26 | 17 | classic, discrete-sampled, implementation, intelligent, modern, nonlinear, robust |
| 7 | `complex-numbers` | 25 | 15 | classic, discrete-sampled, nonlinear, robust |
| 8 | `numerical-methods` | 20 | 17 | classic, discrete-sampled, implementation, intelligent, modern, mpc, nonlinear |
| 9 | `z-transform` | 17 | 7 | classic, discrete-sampled, implementation, mpc |
| 10 | `probability-basics` | 14 | 12 | classic, discrete-sampled, implementation, intelligent, modern, robust |
| 11 | `ode-matrix-exponential` | 11 | 8 | classic, intelligent, modern, mpc, nonlinear |
| 12 | `diff-geometry` | 9 | 3 | nonlinear |
| 13 | `stochastic-processes` | 6 | 4 | modern, mpc, nonlinear |
| 14 | `variational-dp` | 5 | 2 | modern |
| 15 | `graph-theory` | 1 | 1 | mpc |
| 16 | `game-theory-math` | 0 | 0 | — |
| — | **合计** | **284** | — | — |

**读法与三点结论：**

1. **头部 6 门覆盖 176/284 ≈ 62% 的依赖行**（`matrix-decomposition`、`eigen-decomposition`、`fourier-analysis`、`convex-optimization`、`laplace-transform`、`linear-algebra-basics`）。这 6 门写完后，全仓大多数"数学跳步"痛点即被覆盖，是 B 阶段 math 扩容的第一梯队。
2. **"涉及课程数"与"依赖行数"要一起看**：`eigen-decomposition`（21 课）与 `laplace-transform`（20 课）是**横向铺得最广**的两门——几乎每章都要用；而 `z-transform`（17 行但仅 7 课）、`diff-geometry`（9 行但仅 3 课，全在 nonlinear）、`variational-dp`（5 行仅 2 课，全在 modern）是**纵向扎得深**的类型，收益集中在少数章节，可延后但不能省。
3. **已写的 `complex-numbers` 被依赖 25 行 / 15 课，却只有 4 处规范 `📐` 引用指向它**（`transfer-function`、`describing-function`、`nonlinear-characteristics`、`phase-plane`，覆盖率 4/25 ≈ 16%；2026-09-26 更正——原文写"没有任何一处"，是 §0 那次 grep 失效的连带错误）——说明引用惯例缺失不是"新课没写"造成的，而是存量课程基本上没执行 SKILL.md 的规则，只有少数几课顺手写了。这是第 3 节插入清单的主要价值所在。

## 3. 缺失引用清单与插入策略

第 1 节全部行即为缺失引用清单（全仓 `📐` 引用 0 处，见第 0 节）。按用户裁决，
**本次只输出清单、不向正文插入任何引用行**；批量插入留待用户确认后的独立改动。

插入时的建议批次（按"读者损失 × 修改面"排序）：
1. **就地长篇讲解型**（最该插）：`nonlinear/feedback-linearization` 的 Lie 导数/李括号/微分同胚 6 节、`nonlinear/describing-function` 的傅里叶级数 6 节、`modern/optimal-control-basics` 的变分法 4 节、`discrete-sampled/z-transform-analysis` 的 Z 变换 5 节——这些节目前把 math 课该讲的内容整段讲了一遍。
2. **重度使用零解释型**：`mpc/constraint-handling` 的 KKT/凸集 5 节、`modern/kalman-filter` 的白噪声/协方差 3 节、`robust/*` 的 Riccati/正定/LFT 各节。
3. **一句话带过型**：其余行，插一行 `📐` 引用即可。

## 4. math 章编写优先级

以第 2 节排序为准；另两条修正：
- `game-theory-math` 被依赖 **0** 次（它唯一的服务对象 `multi-agent/game-theory-basics` 尚未编写）；`graph-theory` 仅 **1** 行（`mpc/distributed-mpc` 的"通信拓扑影响"一节），其余服务对象是尚未编写的 multi-agent 全章 8 课——这两门可放到最后，等 multi-agent 章开工前再写；
- `numerical-methods` 被依赖次数虽居中，但它是 fix-016/fix-018 一类"仿真读数可信度"问题的共同语言，且几乎每门含仿真的课都欠它一句引用，建议提前到第一批。
