# 04 · 数学符号约定表

> **这张表是机器读的**。`node scripts/glossary.mjs check` 的 **C1 / C1b / C5** 直接解析本文件
> `<!-- REGISTER-START -->` … `| $\Psi$ | 指数极坐标映射（math/diff-geometry） | 1 门 / 1 次（MATH-15引入时） | 无冲突 | 仅本课局部反例：Jacobian可逆但角度周期，非全局坐标；不覆盖预测矩阵。 |
<!-- REGISTER-END -->` 之间的登记表，与
> `<!-- ABBREV-START -->` … `<!-- ABBREV-END -->` 之间的缩写判定表。
> **哨兵必须独占一行**：loader 走 `sentinelSlice()`，判据是「整行 trim 后等于哨兵」，
> 所以上面这样写全字面是安全的（引用行以 `>` 开头，不独占一行）。
> 早期版本用 `indexOf` 取第一次出现，本节这段警告文字自己把 loader 劫持了**两次**，见 §5-1。
> **ABBREV 块不只是文档，它改变符号抽取本身**：登记进去的全大写连写自成符号基，不再被拆成单字母。
> 改这两张表就是改门槛。
>
> 姊妹文件：`03-glossary.md`（中英术语对照与别名冲突，C2/C2b 判据）。
> 抽取脚本：`scripts/glossary.mjs`（口径见 §1）。负向夹具：`.agent/e4-fixture/`。
>
> **本文件只给裁决建议，不改任何 MDX 正文**（E4 的硬约束）。所有待修课程都移交 C1 / A6，
> 每条修复要按 B8 开 fix-log 并填归因三字段。

---

## §0 一页速览（2026-09-26 实测）

| 量 | 值 | 说明 |
|---|---|---|
| 扫描课程 | 56 门 | `content/**/*.mdx`，只扫正文（代码块 / 行内代码 / JSX 标签已掩掉） |
| 数学环境 | 20109 处行内 + 2295 处块级 | 符号只在数学环境里数 |
| 符号基 | **107 个** | 105 个直接抽出 + `PM`、`GM` 由 ABBREV 块提升为独立基 |
| 全大写连写 | **67 种 / 1131 处** | 其中 **2 种是缩写**（PM、GM），**65 种是矩阵/标量连乘**（`BK`、`TAT`、`PBR`…）→ §4 逐个判定 |
| `^T` 转置 | 734 处 / 30 门 | 单列统计，不计入 `T` 的次数（§1-6） |
| 登记表条目（§2） | **107 行** | 一条不多一条不少：多 → C1b WARN（死条目），少 → C1 FAIL |
| §2 里判为「有冲突」的行 | **73 行** | 剩 **34 行**判「无」（多为花体/黑板体，语义天然唯一）。分级可机械复核：34（无）+ 68（B 级）+ 5（A 级）= 107 |
| Prompt 点名的高危冲突 | **10 组 / 11 行** | T、N、Q/R、V、H、S、γ、μ、A、K → §3.1 逐条裁决（Q、R 各占一行，合成一组） |
| **A 级**冲突（同门课内**裸字母**两义） | **3 组 / 5 行** | $s$、$\phi+\varphi$、$\epsilon+\varepsilon$ → §3.2，只有这 3 组会让读者当场读错。判据见 §1-9；$T$ 原列 A 级，实测后**降级**为 B 级（§3.2-4） |
| **B 级**冲突（跨门课同字母不同义） | **68 行** | 每门课内部自洽，靠下标、自变量或上下文可消歧 → §3.3 给通用规则 |
| 需改正文 | **必修 14 项 / 13 门**（另 **可选 7 项**） | 逐项清单见 §3.4；处数合计 必修 54 + 可选 14 = **68 处**，其中 29 处是行级估算，C1 落地时按行复核 |

**一句话结论**：本语料的符号冲突**绝大多数是"同一个字母在不同章里指不同东西"**（B 级 68 行 / 107 行），
每门课内部是自洽的，读者不会当场读错，所以裁决落点不是"换字母"而是**"定默认含义 + 规定必须写下标的场合"**（§3.4）。
真正会让读者读错的是 **A 级 3 组 / 5 行**——同一门课里同一个裸字母同时指两个东西，或同一概念写了两种字形。
**没有一个符号基需要整体改名**：107 个基全部保留，改动只落在**个别义项**上
（$T$ 的"时间常数"义 → $\tau$、"相似变换"义 → $\mathcal{T}$，$\varphi$ → $\phi$，$\epsilon$ → $\varepsilon$，
$N$ 的"Nyquist 圈数"义 → $\nu$……）。落到正文是 §3.4 那张 21 项清单，全部移交 C1 / A6。

---

## §1 口径：这张表量的是什么

| # | 口径 | 为什么这么定 |
|---|---|---|
| 1 | **只扫正文** | 围栏代码块、行内代码段、JSX 标签（含 `JupyterNotebook` 的 `setupCode`/`cells` 模板字面量）、frontmatter 由 `lib-mdx.mjs` 的 `scanMdx().skips` 掩掉。掩码等长且保换行，偏移对原文有效、行号不漂 |
| 2 | **只在数学环境里数符号** | `$…$` 与 `$$…$$`。正文散文里的 `T`、`K` 是英文字母，不是符号 |
| 3 | **按「基字母」登记，不按带标变体** | 裁决单位是"$T$ 是什么意思"，不是"$T_s$ 对不对"。带标变体（`T_s`、`T_i`、`T_{zw}`）只作证据，跑 `node scripts/glossary.mjs symbols` 可逐个看到 |
| 4 | **删宏必须连参数一起删** | `\mathbb{R}` 的基是 `\mathbb{R}` 而不是 `R`；否则 `R`（LQR 控制权重）会被 `\mathbb{R}`（实数域）虚增 |
| 5 | **单字母下标是真符号，多字母花括号下标是文字标签** | `T_s` 里的 `s` 计入 `s` 的次数；`Q_{\text{lqr}}`、`\mu_{RS}` 里的 `lqr`/`RS` 不计入 |
| 6 | **`^T` 转置单列** | 734 处 `^T` 若计入 `T`，`T` 会从 1692 次涨到 2426 次，把"采样周期"这个真含义淹掉 |
| 7 | **全大写连写有歧义，靠 ABBREV 表判定** | `PM` 是相位裕度（缩写，1 个基），`BK` 是 $B\cdot K$（连乘，2 个基）。二者字面同形，只能人工判 → §4 |
| 8 | **`出现课程` 列写成 `N 门 / M 次`，照抄不要改** | 这一列由 `rows notation` 机械生成。`rows notation --diff` 会拿它与本轮扫描逐基对账，手改就报漂移 |
| 9 | **冲突分级看"同门课内是否有裸字母两义"，不看频次** | 频次高 ≠ 危险：$s$ 4845 次里绝大多数是复频率，只在 `sliding-mode-control` 一门课里撞上滑模面。**A 级**的判据是两条同时成立：① 同一门课内同一个字母承担两个含义；② 至少有一处是**裸字母**（无下标、无自变量、后面不紧跟单位），因此读者无法从形状判断。**B 级** = 其余一切跨课同字母不同义。`symbols` 的 `释义候选 ≥2 且跨 ≥3 门` 是 **C3 的 INFO**，它给的是核查清单，不是判据。这条判据实测做过两次判断，见 §3.2-4（$T$ 降级）与 §3.2-5（$\mu$ 临界未升） |

---

## §2 登记表（REGISTER）

按本轮出现次数降序。`出现课程` 列是机械生成值，改它之前先跑 `rows notation --diff`。

<!-- REGISTER-START -->

| 符号 | 含义 | 出现课程 | 冲突情况 | 裁决建议 |
|---|---|---|---|---|
| $s$ | 复频率变量（Laplace 域）；作下标时表"采样"（$T_s$、$f_s$）；`sliding-mode-control` 里另指**切换函数/滑模面** $s(x)$ | 48 门 / 4845 次 | **A 级**：同一门课内既是复频率又是滑模面（该课有 45 处 `sI`/`G(s)`/`(s)` 与切换函数 $s$ 并存） | 复频率保留 $s$；滑模面统一写 $s(x)$ 或 $\sigma(x)$，且**首现处必须声明**。→ §3.2-1 数学章 `calculus-basics` 的 $s(t)$ 是位置，首现声明米，与复频率不混用。 |
| $x$ | 状态向量；作下标时是索引（$x_1,x_2$）或"阀芯"（$x_v$） | 49 门 / 4191 次 | 无实质冲突：全部读法都是"状态/位置" | 保留。向量场合建议写 $\boldsymbol{x}$（语料已混用两种写法，不强求） |
| $k$ | 离散时间索引（$u(k)$）；弹簧刚度（$\omega_n=\sqrt{k/m}$）；标量增益；波数 | 45 门 / 2607 次 | **B 级**：时间索引与刚度同字母 | 保留。规则：**离散系统的自变量一律 $k$**，刚度一律写 $k_s$ 或用 $K$（语料 `system-modeling` 已用 $k_1,k_2$ 表分段弹簧，可消歧） |
| $\omega$ | 角频率（rad/s）；作下标时分自然/穿越/相位穿越/谐振/阻尼（$\omega_n,\omega_c,\omega_g,\omega_r,\omega_d$）；电机场合是转子角速度 | 46 门 / 2491 次 | 无实质冲突：全部读法都是"角频率或角速度"，量纲相同 | 保留。**必须写下标**：裸 $\omega$ 只在"$\omega\to\infty$"这类极限语境里合法 |
| $K$ | 增益（比例/积分/微分 $K_p,K_i,K_d$）；状态反馈增益矩阵（$u=-Kx$）；Kalman 增益（$K_f$）；电机转矩/反电动势常数（$K_m,K_b,K_t$）；阀流量增益；回溯增益（$K_b$） | 49 门 / 2387 次 | **B 级**（Prompt 点名）：五种含义，其中 $K_b$ 在 `compensator-design` 是回溯增益、在 `classic-case-study` 是反电动势常数 | 保留 $K$ 作增益族，**但下标必须带语义**：$K_p/K_i/K_d$（PID）、$K$ 或 $K_{fb}$（状态反馈）、$K_f$（Kalman/终端）、$K_b$ **禁用**（回溯增益改 $K_{bt}$，反电动势改 $K_e$）。→ §3.1-10 |
| $A$ | 系统矩阵；描述函数幅值输入（$N(A)$）；活塞/表面积；邻接矩阵（`distributed-mpc`）；Routh 辅助多项式 $A(s)$（`stability-analysis`） | 46 门 / 2177 次 | **B 级**（Prompt 点名）：五种含义，但只有"系统矩阵"跨 ≥20 门 | 默认含义 = **系统矩阵**。其余场合**必须带下标或换字母**：描述函数幅值 → $a$（语料 `describing-function` 已同时用 $A$ 与 $a$，建议统一 $A$ 并在首现处声明）；面积 → $A_p$/$A_s$；邻接矩阵 → $A_{adj}$；辅助多项式 → $\Delta(s)$（Routh 表本来就叫辅助多项式，避开 $A$）。→ §3.1-9 |
| $u$ | 控制输入；`compensator-design` 里另指未限幅控制器输出（$v$ 与 $u$ 反过来用） | 47 门 / 1940 次 | **B 级**：抗饱和一节 $v$=未限幅、$u$=限幅后，与他处惯例相反但不矛盾 | 保留。$u$ 永远是"真正施加到对象上的量"，未限幅的一律写 $v$ 或 $u_{un}$ |
| $z$ | 离散域变量（$z^{-1}$ 延迟算子）；零点（$z_i,z_d$）；`backstepping` 里是误差坐标 $z_i$；`distributed-mpc` 里是共识变量 | 32 门 / 1704 次 | **B 级**：延迟算子与零点同字母（$z^{-1}$ vs $z_i$） | 保留。规则：**$z$ 单独出现 = 离散域变量**；零点必须写 $z_i$/$z_{zero}$；反步法的误差坐标建议改 $\varepsilon_i$ 或保留 $z_i$ 但在首现处声明（语料 `backstepping` 已声明，可不动） |
| $T$ | 采样周期（$T_s$、$T$）；时间常数（超前/滞后校正的 $T$）；终端时间（最优控制）；闭环传递函数（$T(s)$、$T_{zw}$）；转矩（$T_L,T_m$）；相似变换矩阵（$TAT^{-1}$）；转置（$^T$，734 处，单列不计） | 55 门 / 1692 次 | **B 级**（Prompt 点名）：出现最广的基（55/56 门），六种含义，但**没有一门课让裸 $T$ 承担两义**——`compensator-design` 的裸 $T$ 一律是时间常数、采样周期一律写 $T_s$（实测 8 处），`state-feedback`/`state-space` 的裸 $T$ 一律是相似变换矩阵（`TAT^{-1}` 实测 1 / 8 处，两课 $T_s$ 均 0 处）。撞的是**跨课**：同章 `sampling-period-selection` 的 $T$ 是采样周期。原列 A 级，实测后按 §1-9 判据**降级**，见 §3.2-4 | 默认含义 = **采样周期**，且**必须写 $T_s$**（裸 $T$ 只在通篇讲采样的课里合法）。时间常数 → $\tau$（语料 `\tau` 已有 28 门用作时间常数，天然可用）；终端时间 → $t_f$（语料 `time-domain-analysis`/`optimal-control-basics` 已用 $t_f$）；闭环传函 → 保留 $T(s)$/$T_{zw}$（鲁棒章专用，与采样章不重叠）；转矩 → $T_L$/$T_m$ 必须带下标；相似变换 → $\mathcal{T}$。→ §3.1-1 |
| $e$ | 误差（$e(t)$、$e_{ss}$）；自然对数底（$e^{At}$、$e^{-\zeta\omega_n t}$）；`controllability-observability` 里是标准基向量 $e_j$ | 46 门 / 1402 次 | **B 级**：误差与指数底同字母，且同一式子里可同时出现（$e^{-t}$ 与 $e(t)$） | 保留。规则：**误差写 $e(t)$ 或 $e_{ss}$（带自变量/下标），指数底永远写成 $\mathrm{e}$ 或紧跟指数的 $e^{(\cdot)}$**。语料现状可接受，因为 $e^{At}$ 的形状不会与 $e(t)$ 混 |
| $G$ | 传递函数/被控对象（$G(s)$、$G_p$）；控制器（$G_c$）；扰动通道（$G_d$）；`distributed-mpc` 里是通信图 | 40 门 / 1364 次 | **B 级**：五种含义但都带下标 | 保留。裸 $G$ = 被控对象；控制器一律 $C$ 或 $G_c$，**不要**在同一门课里混用两者（`robustness-concept` 用 $L=GC$，`h-infinity-basics` 用 $GK$，建议统一到 $L=GC$） |
| $t$ | 连续时间；作下标时是"时间"类指标（$t_s$ 调节时间、$t_r$ 上升时间、$t_p$ 峰值时间、$t_f$ 终端时间、$t_a$ 到达时间） | 50 门 / 1312 次 | 无实质冲突：全部读法都是时间 | 保留。**必须写下标**，裸 $t$ 只作积分/函数的自变量 |
| $B$ | 输入矩阵；粘性摩擦系数（`classic-case-study:87`）；`fuzzy-control-basics` 里是模糊规则结论部 B | 39 门 / 1151 次 | **B 级**：输入矩阵与摩擦系数同字母，且 `classic-case-study:868` 的 $(Js+B)\Omega$ 里两者同框 | 默认含义 = **输入矩阵**。摩擦系数 → $b$（小写，语料 `system-modeling` 已用 $b$ 表阻尼）或 $B_v$。→ §3.2-4 |
| $j$ | 虚数单位（$\pm j218.7$）；求和/语言值索引（$F_j$、$E_j$、$\mu_j$） | 42 门 / 1049 次 | **B 级**：虚数单位与索引同字母 | 保留。规则：**虚数单位永远紧跟数字或写成 $j\omega$**，索引永远写下标位置（$F_j$）。语料现状已满足，不改 |
| $\theta$ | 角度/俯仰角/转子角位置；未知参数向量（自适应控制 $\hat\theta,\tilde\theta$）；神经网络权重（`neural-network-control` 的 $\boldsymbol\theta_{NN}$） | 26 门 / 1049 次 | **B 级**：几何角与参数向量同字母，跨章不重叠（`root-locus`/`system-modeling` 用角，`adaptive-control-basics`/`neural-network-control` 用参数） | 保留。参数向量**必须加粗** $\boldsymbol\theta$（语料已这样做），几何角不加粗 |
| $C$ | 输出矩阵；控制器传递函数 $C(s)$；电容/热容（$C_h$） | 39 门 / 1000 次 | **B 级**：输出矩阵与控制器同字母，且 `classic-case-study:954` 的 $T(s)=CG_p/(1+CG_p)$ 里 $C$ 是控制器，而 `state-space` 里 $y=Cx$ 的 $C$ 是输出矩阵 | 默认含义 = **输出矩阵**（状态空间章）。控制器在经典章写 $C(s)$、在现代/鲁棒章写 $K$——**这条分裂是有意的**（经典章的控制器是传函，现代章的是增益矩阵），但每门课首现处必须声明。电容 → $C_h$/$C_e$ 带下标 数学章 `calculus-basics` 的 $C_0$ 是积分常数，语义下标及正文声明消歧。 |
| $P$ | Riccati/Lyapunov 方程的解（正定矩阵）；Nyquist 判据里的开环右半平面极点数；压力（$P_L$）；转移概率 | 29 门 / 980 次 | **B 级**：矩阵与"极点数"同字母，且 `frequency-domain-analysis` 的 $Z=P-N$ 里 $P$ 是标量计数 | 默认含义 = **正定矩阵**。极点数 → $n_p$ 或保留 $P$ 但**只在 Nyquist 一节内**（语料 `frequency-domain-analysis`/`stability-analysis` 已把它限定在判据陈述里，可不动）；压力 → $P_L$/$p$ |
| $a$ | 多项式系数（$a_0,a_1,\dots$）；加速度；`compensator-design` 的超前比 $\alpha$ 的替代写法；描述函数里的饱和幅值 | 38 门 / 972 次 | **B 级**：系数与加速度同字母 | 保留。系数一律带数字下标（$a_0,a_1$），加速度写 $\ddot x$ 或 $a_m$ |
| $c$ | 比热容（$c_p$）；阻尼系数；`compensator-design` 的滞后比 $\beta$ 的替代写法；输出向量行（$cA$） | 42 门 / 915 次 | **B 级**：四种含义 | 保留。比热容**必须**写 $c_p$；阻尼系数 → $b$ 或 $c_d$；输出矩阵的行 → $c_i$ 或 $C_i$ |
| $L$ | 开环传递函数 $L(s)=G(s)C(s)$；电感（$L_a$）；李导数（$L_fh$、$L_g s$）；观测器增益矩阵；长度/摆长/轴距 | 37 门 / 856 次 | **B 级**：五种含义，其中李导数与开环传函都在 `sliding-mode-control`/`feedback-linearization` 出现 | 保留。规则：**开环传函写 $L(s)$（带自变量）**，李导数写 $L_f$/$L_g$（带下标），电感写 $L_a$/$L_h$，观测器增益写 $L$ 且只在观测器一章。裸 $L$ 在非线性章 = 李导数算子，在经典章 = 开环传函，靠章内上下文消歧 |
| $n$ | 状态维数/阶数；作下标时表"自然"（$\omega_n$）；转速 | 49 门 / 856 次 | **B 级**：维数与自然频率下标同字母 | 保留。维数用裸 $n$；自然频率**必须**写 $\omega_n$；转速 → $n_{rpm}$ 或 $\omega$ |
| $y$ | 输出/被控变量；`phase-plane` 里是第二状态坐标 | 40 门 / 846 次 | 无实质冲突 | 保留 |
| $p$ | 极点（$p_1,p_2$）；输出维数；参数（灵敏度分析 $\Delta p/p$）；压力 | 32 门 / 826 次 | **B 级**：极点与输出维数同字母 | 保留。极点**必须**带数字下标；输出维数用裸 $p$ 且只在 MIMO 章（`multivariable-systems`）；压力 → $P_L$ |
| $N$ | 预测时域（$N_p$ 预测、$N_u$ 控制）；描述函数 $N(A)$；Nyquist 包围圈数；`modern-case-study` 的前馈增益（$u=-Kx+Nr$）；`system-modeling` 的种群总数；样本数 | 34 门 / 808 次 | **B 级**（Prompt 点名）：五种含义。最危险的是 `frequency-domain-analysis` 的 $Z=P-N$（圈数）与 MPC 章的 $N_p$（时域）都用 $N$ | 默认含义 = **预测时域**，且**必须带下标** $N_p$/$N_u$（裸 $N$ 在 MPC 章表示总时域；数学章 `calculus-basics` 首现定义为等分段数，不沿用控制时域含义）。描述函数保留 $N(A)$（带自变量，形状自证）；Nyquist 圈数 → 改 $\nu$ 或保留但只在判据陈述内；前馈增益 → $N_r$；种群总数 → $N_{tot}$。→ §3.1-2 |
| $b$ | 多项式分子系数（$b_0,b_1$）；阻尼系数；比例先行系数（PID 的 $b$）；`adaptive-control-basics` 的控制增益（$b$ 的符号决定自适应律）；虚部 | 43 门 / 796 次 | **B 级**：五种含义 | 保留。系数带数字下标；阻尼 → $b$ 或 $B$（同 §2 的 $B$ 裁决，建议统一小写 $b$）；比例先行 → $b_{PID}$ 或 $\beta$；控制增益 → $b$ 且只在自适应章 |
| $m$ | 质量；输入维数；作下标时表"最大/机械"（$M_p$ 超调、$\omega_m$、$K_m$） | 31 门 / 731 次 | **B 级**：质量与输入维数同字母 | 保留。质量用裸 $m$（建模章）；输入维数用 $m$ 且只在 MIMO 章；下标 $m$ 一律读"max/mechanical"，靠所在公式消歧 |
| $\Delta$ | 增量/差分（$\Delta u$、$\Delta x$、CARIMA 的 $\Delta=1-z^{-1}$）；不确定性块（$\Delta$、$\boldsymbol\Delta$、$\Delta_{mb}$）；Routh 判别式；`phase-plane` 的分类边界 | 33 门 / 730 次 | **B 级**：增量与不确定性块同字母，跨章不重叠（增量在 MPC/离散章，不确定性块在鲁棒章） | 保留。**鲁棒章的 $\Delta$ 必须加粗** $\boldsymbol\Delta$ 或写 $\Delta(s)$（语料 `mu-synthesis` 已用 $\boldsymbol\Delta$），增量场合永远写 $\Delta(\cdot)$ 形式 |
| $\alpha$ | 超前校正比（$\alpha>1$）；松弛因子；`system-modeling` 的增长率/反照率；$\mathcal{K}_\infty$ 函数；`mpc-principle` 终端集半径 | 27 门 / 684 次 | **B 级**：五种含义 | 保留。超前/滞后比 → $\alpha$（$\alpha>1$）/$\beta$（$\beta<1$）成对出现；增长率带下标 $\alpha_g$；$\mathcal{K}_\infty$ 函数保留 $\alpha$（形状 $\alpha(\cdot)$ 自证） |
| $V$ | Lyapunov 函数 $V(x)$；终端代价/值函数 $V_f$；容积（$V_0$、CSTR 的 $V$）；电压（$\omega(s)/V(s)$）；松弛变量权重 | 26 门 / 645 次 | **B 级**（Prompt 点名）：四种含义，Lyapunov 函数跨 11 门最多 | 默认含义 = **Lyapunov 函数**，写 $V(x)$（带自变量）。容积 → $V_0$/$V_R$ 带下标；电压 → $v$ 小写或 $V_a$（`system-modeling:290` 的 $V(s)$ 建议改 $V_a(s)$）。→ §3.1-4 |
| $f$ | 频率（$f_s$ 采样频率、Hz）；非线性漂移向量场 $f(x)$；GPC 的自由响应项 $f$；`mpc-nonlinear` 的 Hessian 梯度项 | 34 门 / 609 次 | **B 级**：频率与向量场同字母，且 `feedback-linearization`/`sliding-mode-control` 里 $f$ 是向量场、`sampling-period-selection` 里 $f_s$ 是频率 | 保留。频率**必须**写 $f_s$/$f_c$ 带下标（裸 $f$ 表频率只在"单位 Hz"语境合法）；向量场写 $f(x)$（带自变量）。两者形状不同，不改 数学章 `calculus-basics` 的 $f(x)$ 是一般标量函数，先定义自变量与观察点。 |
| $\lambda$ | 特征值/极点；协态变量（最优控制）；拉格朗日乘子；故障率（$\lambda$，MTBF $=1/\lambda$）；滑模收敛速率；`digital-pid` 的期望闭环时间常数 | 25 门 / 589 次 | **B 级**：六种含义，但协态与乘子本是同一概念 | 保留。特征值 → $\lambda_i$ 带下标；协态/乘子 → $\boldsymbol\lambda$ 加粗；故障率 → $\lambda_f$；时间常数 → 改 $\tau_c$（与 $\tau$ 的默认含义一致） |
| $g$ | 重力加速度（$mg l$、$mgl\sin\theta$）；非线性控制向量场 $g(x)$；稳态增益；相位穿越频率下标（$\omega_g$） | 30 门 / 572 次 | **B 级**：重力与向量场同字母，且 `backstepping`/`feedback-linearization` 里两者都可能出现在同一页 | 保留。重力加速度**统一写 $g$ 且不带自变量**；向量场写 $g(x)$（带自变量）；稳态增益 → $K_{ss}$（避免与 $g$ 混） 数学章 `calculus-basics` 的 $g(t)$ 是求导练习中的标量函数，首现定义。 |
| $r$ | 参考输入 $r(t)$；半径；相对阶；`uncertainty-modeling` 的重数 $r_i$；描述函数里的 $r=h/A$ | 35 门 / 553 次 | **B 级**：参考输入与半径同字母 | 保留。参考输入写 $r(t)$/$r$（带自变量或在反馈框图语境）；半径 → $R$ 大写或 $\rho$；相对阶 → $r$ 且只在非线性章 |
| $i$ | 电流（$i_a$ 电枢电流）；索引（$x_i$、$F_i$）；`fuzzy` 的语言值索引 | 33 门 / 545 次 | **B 级**：电流与索引同字母 | 保留。电流**必须**写 $i_a$/$i_L$ 带下标；索引用 $i$ 且永远在下标位置 |
| $d$ | 微分算子（$\mathrm{d}t$、$\frac{d}{dt}$）；纯延迟步数（CARIMA/GPC 的 $d$）；扰动；路面间距；`fuzzy` 的解模糊 | 40 门 / 542 次 | **B 级**：微分算子与延迟步数同字母 | 保留。微分算子**统一写直立体** $\mathrm{d}$（语料已部分这样做，`neural-network-control` 写 $\mathrm{d}t$、多数课写 $dt$）；延迟步数 → $d$ 且只在离散/MPC 章；扰动 → $d(t)$ 带自变量 |
| $M$ | 超调量 $M_p$；谐振峰值 $M_r$；灵敏度峰值 $M_S$；质量/惯量；互质分解的分子 $M$；μ 综合的 $M$ 矩阵；`describing-function` 的继电器幅值 | 31 门 / 534 次 | **B 级**：七种含义 | 保留。性能指标**必须**带下标（$M_p$/$M_r$/$M_S$）；互质因子写 $M(s)$ 带自变量；μ 综合的 $M$ 只在 `mu-synthesis`/`robust-performance`；质量 → $m$ 小写（见 $m$ 行） |
| $R$ | LQR 的控制权重矩阵；Kalman 的测量噪声协方差；电阻（$R_a$）；液阻（$R_h$）；`digital-pid` 的参考 | 38 门 / 529 次 | **B 级**（Prompt 点名，与 $Q$ 成对）：LQR 里 $R$ 是**权重**，Kalman 里 $R$ 是**噪声协方差**——角色与 $Q$ 互换 | 保留字母，**用下标锁死语义**：LQR 写 $Q_{lqr},R_{lqr}$（语料 `kalman-filter:801` 已经写 $Q_{\text{lqr}}$），Kalman 写 $Q_{proc},R_{meas}$ 或 $Q_w,R_v$。规则见 §3.1-3 |
| $\zeta$ | 阻尼比 | 29 门 / 478 次 | 无冲突 | 保留 |
| $\infty$ | 无穷（极限、$\mathcal{H}_\infty$、$\mathcal{K}_\infty$、积分上限） | 42 门 / 447 次 | 无冲突 | 保留 |
| $F$ | 外力 $F(t)$；GPC/预测模型的 $F_j$ 多项式；`mpc-principle` 的预测矩阵 $F$；流量 | 18 门 / 396 次 | **B 级**：外力与预测矩阵同字母 | 保留。外力写 $F(t)$ 带自变量；预测矩阵写 $F$ 且只在 MPC 章（语料 `constraint-handling` 用 $X=Fx+\Phi U$，`mpc-principle` 同）；流量 → $F_i$/$q$ 数学章 `calculus-basics` 的 $F(t)$ 是首现明确定义的原函数，不是外力。 |
| $W$ | 加权函数（$W_1,W_2,W_3$）；Gramian（$W_c,W_o$）；能量 | 12 门 / 395 次 | **B 级**：加权函数与 Gramian 同字母，跨章不重叠（加权在鲁棒章，Gramian 在 `controllability-observability`） | 保留。加权函数**必须**带数字下标；Gramian **必须**带 $c$/$o$ 下标 |
| $v$ | 未限幅控制器输出（抗饱和）；速度；解耦后的外部输入（$u=-Kx+Tv$）；测量噪声；`fuzzy` 的语言值 | 25 门 / 389 次 | **B 级**：四种含义 | 保留。速度写 $v$ 且只在建模章（建议 $v_{veh}$ 消歧）；未限幅输出写 $v$ 且只在抗饱和一节；外部输入 → $v$ 且带说明 数学章 `calculus-basics` 的 $v(t)$ 是速度，首现声明单位。 |
| $\delta$ | Dirac 冲激 $\delta(t)$；标量不确定性 $\delta_m,\delta_k$；边界层厚度；`system-modeling` 的转化效率；`sliding-mode` 的控制扰动 | 24 门 / 377 次 | **B 级**：五种含义 | 保留。冲激写 $\delta(t)$ 带自变量；不确定性写 $\delta$ 且只在鲁棒章；边界层 → $\varepsilon$ 或 $\phi$（语料 `sliding-mode-control` 用 $\phi$ 表边界层厚度，见 §3.2-2） |
| $S$ | 灵敏度函数 $S=1/(1+L)$；滑模面/切换面（部分课用 $S$ 而非 $s$）；协方差；太阳常数；截面积 | 18 门 / 353 次 | **B 级**（Prompt 点名）：灵敏度函数与滑模面同字母，且 `mixed-sensitivity` 的 $\lVert CS\rVert_\infty$ 里 $S$ 是灵敏度、`sliding-mode-control` 里 $S$ 可能是面 | 默认含义 = **灵敏度函数**。滑模面**统一小写** $s(x)$（见 $s$ 行），大写 $S$ 让给灵敏度；协方差 → $S_{cov}$ 或 $P$；太阳常数 → $S_0$ |
| $I$ | 单位矩阵（$sI-A$）；电流（$I_a$）；`system-modeling` 信息传播模型的感染人数 | 29 门 / 349 次 | **B 级**：单位矩阵与电流同字母 | 保留。单位矩阵写 $I$ 或 $I_n$（带维数下标更佳）；电流**必须**写 $I_a$/$I_L$ 带下标 数学章 `calculus-basics` 的 $I_N$ 是右端矩形和，首次给公式和单位，不是单位矩阵。 |
| $q$ | 流量（$q_L$）；广义坐标（`robotics` 语境的 $q_d,q_r$）；量化；`system-modeling` 的热流 | 17 门 / 338 次 | **B 级**：流量与广义坐标同字母 | 保留。流量**必须**写 $q_L$/$q_{in}$/$q_{out}$ 带下标；广义坐标写 $q$ 且只在机械建模语境 |
| $\tau$ | 时间常数；积分哑变量（$\int_0^t\cdots\mathrm{d}\tau$） | 28 门 / 335 次 | **B 级**：时间常数与积分哑变量同字母 | 保留，并**推荐**把 $T$（时间常数）迁到这里（见 $T$ 行）。积分哑变量语境形状自证（$\mathrm{d}\tau$） |
| $\partial$ | 偏导算子 | 21 门 / 332 次 | 无冲突 | 保留 |
| $J$ | 代价泛函 $J=\int(x^TQx+u^TRu)\mathrm{d}t$；转动惯量；Jacobian（$J^i$、$DP$） | 24 门 / 326 次 | **B 级**：代价与惯量同字母，跨章不重叠（代价在最优/MPC 章，惯量在建模章） | 保留。代价写 $J$ 或 $J(U)$ 带自变量；惯量写 $J$ 且只在机电建模；Jacobian **必须**写 $J^i$ 或 $\frac{\partial f}{\partial x}$ |
| $Q$ | LQR 的状态权重矩阵；Kalman 的过程噪声协方差；品质因数；流量 | 20 门 / 310 次 | **B 级**（Prompt 点名，与 $R$ 成对）：同一个 $Q$ 在 `lqr-controller` 是**设计自由度**、在 `kalman-filter` 是**给定的噪声统计量**——语义完全相反 | 同 $R$：用下标锁死。$Q_{lqr}$（权重，可调）vs $Q_{proc}$（过程噪声协方差，给定）。**首现处必须说明"这是权重还是噪声"**。→ §3.1-3 |
| $\pi$ | 圆周率；`describing-function` 的半波对称 | 29 门 / 298 次 | 无冲突 | 保留 |
| $D$ | 直通矩阵（$y=Cx+Du$）；特征多项式 $D(z)$、$D(s)$；μ 综合的缩放矩阵 $D$；`distributed-mpc` 的邻接度矩阵；微分算子 | 26 门 / 298 次 | **B 级**：五种含义 | 保留。直通矩阵写裸 $D$（状态空间章）；特征多项式写 $D(s)$/$D(z)$ 带自变量；缩放矩阵写 $D$ 且只在 μ 综合（建议加粗 $\boldsymbol D$） |
| $\sigma$ | 极点实部（$\sigma=\lvert\mathrm{Re}(s)\rvert$）；奇异值（$\bar\sigma,\underline\sigma$）；标准差；Stefan-Boltzmann 常数；神经网络激活函数 | 22 门 / 292 次 | **B 级**：五种含义 | 保留。奇异值**必须**写 $\bar\sigma(\cdot)$/$\underline\sigma(\cdot)$ 带上下划线与自变量；激活函数 → $\sigma(\cdot)$ 带自变量；极点实部 → $\sigma$ 且只在根轨迹/Bode 章 |
| $\gamma$ | $\mathcal{H}_\infty$ 性能界（$\lVert T_{zw}\rVert_\infty<\gamma$）；自适应增益；到达律系数（滑模 $\dot s=-\gamma\,\mathrm{sign}(s)$）；折扣因子；`system-modeling` 的死亡率 | 13 门 / 288 次 | **B 级**（Prompt 点名）：五种含义，但按章严格分区（鲁棒章=性能界、自适应章=增益、滑模章=到达律、RL 章=折扣） | 保留，**按章定默认**：鲁棒章 $\gamma$ = 性能界（标量，正）；自适应章 $\gamma$ = 增益（建议矩阵形式写 $\Gamma$，语料 `adaptive-control-basics:857` 已用 $\Gamma$）；滑模章 $\gamma$ = 到达律系数；死亡率 → $\gamma_d$。→ §3.1-7 |
| $\mu$ | 隶属度函数 $\mu_A(x)$；结构化奇异值 $\mu_{\boldsymbol\Delta}(M)$；摩擦系数；`fuzzy-control-basics:40` 的**微（micro）前缀**（$25.28\ \mu\mathrm{s}$） | 16 门 / 286 次 | **B 级**（Prompt 点名）：四种含义。最危险的是 `mu-synthesis` 的 $\mu$ 与 `fuzzy` 的 $\mu_A$ 都是"核心量"。**临界但未升 A 级**：`fuzzy-control-basics` 同课内 $\mu\mathrm{s}$（`:40`）与 $\mu_A(x)$（`:55`）并存，但两处都不裸——一个紧跟单位、一个带下标与自变量，形状自证，见 §3.2-5 | 保留。隶属度**必须**写 $\mu_A(x)$ 带集合下标与自变量；结构化奇异值**必须**写 $\mu_{\boldsymbol\Delta}(M)$ 带结构下标；摩擦系数 → $\mu_f$；**单位前缀 μ 建议改写为 `µ`（U+00B5）或直接写 $2.528\times10^{-5}$ s**——数学环境里的 $\mu\mathrm{s}$ 会被抽取器当成符号 μ。→ §3.1-8 |
| $U$ | 输入的 Laplace 变换 $U(s)$；MPC 的控制序列向量 $U=[u_0,\dots,u_{N_u-1}]^T$；`mpc-case-study` 的总传热系数×面积（$UA$） | 26 门 / 268 次 | **B 级**：像函数与控制序列同字母 | 保留。像函数写 $U(s)$ 带自变量；控制序列写 $U$ 或 $\boldsymbol U$ 且只在 MPC 章；传热系数 → 写 $(UA)$ 加括号或改 $U_{ht}$ |
| $PM$ | **相位裕度**（Phase Margin）。由 §4 的 ABBREV 块提升为独立符号基，不再拆成 $P\cdot M$ | 13 门 / 265 次 | 无冲突（$PM_0$/$PM_c$/$PM_d$/$PM_{min}$ 全是"某处的相位裕度"） | 保留。术语侧见 `03-glossary.md` §2.2 的「相位裕度」行（英文登记为 PM、Phase Margin） |
| $\phi$ | 相位（$\phi_m$ 最大超前角、$\phi(\omega)$）；**回归量** $\phi(x)$（自适应控制）；边界层厚度（滑模 tanh 法）；磁通 | 18 门 / 258 次 | **A 级**：`adaptive-control-basics` 用 $\phi$ 表回归量 105 次，同课第 2054 行又用 $\varphi$ 表同一个回归量 | 回归量统一 $\phi$（该课主流写法）；边界层厚度 → $\varepsilon$（避免与相位撞）；相位保留 $\phi_m$/$\phi(\omega)$。→ §3.2-2 |
| $l$ | 长度/摆长/轴距（$ml^2$、$mgl$）；`nonlinear-mpc` 的阶段代价 $\ell$（是**另一个基**，见 $\ell$ 行） | 12 门 / 238 次 | **B 级**：$l$ 与 $\ell$ 字形相近但被抽取器正确分成两个基 | 保留。长度用 $l$（或改 $L$ 会与开环传函撞，故不建议）；阶段代价**必须**用 $\ell$，不要用 $l$ |
| $w$ | w 变换（$z=\frac{w+1}{w-1}$）；神经网络权重（$w_i$）；扰动输入；`fuzzy` 的规则权重 | 17 门 / 226 次 | **B 级**：三种含义 | 保留。w 变换的 $w$ 只在 `discrete-stability-criteria`；权重**必须**写 $w_i$ 带下标；扰动 → $w(t)$ 带自变量或改 $d$ |
| $h$ | 对流换热系数（$hA$）；输出函数 $h(x)$（`describing-function` 的滞环继电器高度）；`fuzzy-controller-design` 的 $hA$ | 9 门 / 203 次 | **B 级**：换热系数与输出函数同字母 | 保留。换热系数写 $h$ 且只在 `system-modeling`；输出函数写 $h(x)$ 带自变量；继电器高度 → $h_0$ 数学章 `calculus-basics` 的 $h$ 是自变量增量，首现说明单位；不是换热系数。 |
| $\beta$ | 滞后校正比（$\beta<1$）；`system-modeling` 的捕食效率/传播率；流体体积弹性模量 $\beta_e$；`adaptive-control-basics` 的 $\beta_e$ | 13 门 / 183 次 | **B 级**：三种含义 | 保留。校正比 $\beta$ 与 $\alpha$ 成对；弹性模量**必须**写 $\beta_e$ |
| $H$ | 反馈通道传递函数 $H(s)$（传感器）；Hamiltonian 矩阵/函数（`state-space` 的凯莱-哈密顿、`phase-plane` 的首次积分 $H(x,y)$）；Hessian（`nonlinear-mpc` 的 $H^i$）；Routh 的 Hurwitz 矩阵（`stability-analysis:502`）；$\mathcal{H}_\infty$ 是**另一个基** | 18 门 / 173 次 | **B 级**（Prompt 点名）：五种含义 | 保留。传感器传函写 $H(s)$ 带自变量；Hamiltonian 写 $\mathcal{H}$ 或 $H(x,y)$ 带自变量；Hessian **必须**写 $H^i$ 或 $\nabla^2$；Hurwitz 矩阵 → $\mathcal{H}$（避开裸 $H$）。→ §3.1-5 |
| $E$ | 误差的像函数 $E(s)$；杨氏弹性模量；活化能（$e^{-E/(RT)}$）；模糊规则集 $E_j$；匹配不确定性 $\Delta A=BE$ | 15 门 / 163 次 | **B 级**：五种含义 | 保留。像函数写 $E(s)$ 带自变量；活化能写 $E$ 且只在 `mpc-case-study`；规则集**必须**写 $E_j$ 带下标 |
| $\Phi$ | 状态转移矩阵 $\Phi(t)=e^{At}$；MPC 的预测矩阵（$X=Fx+\Phi U$）；`fuzzy-controller-design` 的解模糊组合 | 13 门 / 130 次 | **B 级**：状态转移矩阵与预测矩阵同字母，跨章不重叠 | 保留。状态转移矩阵写 $\Phi(t)$ 带自变量；预测矩阵写 $\Phi$ 且只在 MPC 章（建议改 $\bar\Phi$ 以区别，非必须） |
| $X$ | $x$ 的 Laplace/Z 变换像函数 $X(z)$；$\mathcal{H}_\infty$ 的 Riccati 解 $X$；MPC 的预测状态序列 $X$；定点数表示 | 16 门 / 103 次 | **B 级**：像函数与 Riccati 解同字母 | 保留。像函数写 $X(z)$/$X(s)$ 带自变量；Riccati 解写 $X_\infty$ 或保留 $X$（鲁棒章专用）；预测序列写 $\boldsymbol X$ 加粗 |
| $Y$ | $y$ 的像函数 $Y(s)$；$\mathcal{H}_\infty$ 的第二条 Riccati 解 $Y$ | 16 门 / 102 次 | **B 级**：同 $X$ | 同 $X$：像函数带自变量，Riccati 解写 $Y_\infty$ |
| $\epsilon$ | 小正数/精度/安全余量（$\epsilon=5°\sim15°$） | 14 门 / 83 次 | **A 级**：与 $\varepsilon$ 是同一概念两种字形，且 `neural-network-control`（3:2）与 `nonlinear-characteristics`（7:1）**同门课内混用** | **统一为 $\varepsilon$**（更主流、KaTeX 渲染更清晰）。$\epsilon$ 让给"属于集合 $\in$"的视觉混淆场合。→ §3.2-3 |
| $\varepsilon$ | 小正数/阈值（积分分离阈值、正则化宽度、新息、边界层厚度、PE 强度下界） | 10 门 / 82 次 | 同上（与 $\epsilon$ 是一对） | 保留为**标准字形**。见 $\epsilon$ 行 |
| $\rho$ | 密度；惩罚参数（ADMM 的 $L_\rho$）；谱半径 $\rho(XY)$；`describing-function` 的 $\rho$ | 9 门 / 81 次 | **B 级**：四种含义 | 保留。谱半径**必须**写 $\rho(\cdot)$ 带自变量；惩罚参数写 $\rho$ 且只在 `distributed-mpc`；密度写 $\rho$ 且只在建模章 |
| $GM$ | **增益裕度**（Gain Margin）。由 §4 的 ABBREV 块提升为独立符号基，不再拆成 $G\cdot M$ | 7 门 / 78 次 | 无冲突（$GM_{dB}$、$GM_c$ 都是"某处的增益裕度"） | 保留。术语侧见 `03-glossary.md` §2.2 的「增益裕度」行（英文登记为 GM、Gain Margin） |
| $\mathcal{C}$ | 可控性矩阵 $\mathcal{C}=[B,AB,\dots,A^{n-1}B]$ | 5 门 / 68 次 | 无冲突 | 保留。**必须**用花体，以区别输出矩阵 $C$ |
| $O$ | 大 O 记号（$O(n^3)$、$O(N\cdot N_p)$） | 13 门 / 63 次 | **B 级**：与可观性矩阵 $\mathcal{O}$ 字形相近，但抽取器已正确分成两个基 | 保留。大 O 写 $O(\cdot)$ 带自变量；可观性矩阵**必须**用花体 $\mathcal{O}$（语料已如此） |
| $\xi$ | 中间变量（`state-space` 的规范型构造）；增广状态 $\xi(k)$（`generalized-predictive-control`） | 7 门 / 63 次 | 无实质冲突 | 保留 |
| $\mathcal{H}$ | $\mathcal{H}_\infty$ 范数/空间；Hamiltonian | 3 门 / 49 次 | **B 级**：范数与 Hamiltonian 同字母 | 保留。范数**必须**写 $\mathcal{H}_\infty$ 带下标；Hamiltonian 写 $\mathcal{H}(x,u,\lambda)$ 带自变量 |
| $\Omega$ | 电阻单位欧姆（$R=1\,\Omega$）；`classic-case-study` 的转子角速度 $\Omega$ | 8 门 / 48 次 | **B 级**：单位与角速度同字母，且 `pid-controller:687` 与 `classic-case-study:868` 分别在用 | 保留。**单位场合必须写 `\,\Omega` 且紧跟数字**；角速度建议改 $\omega_m$（与 $\omega$ 的默认含义一致），避免与单位撞 |
| $\mathcal{O}$ | 可观性矩阵 $\mathcal{O}=[C;CA;\dots;CA^{n-1}]$ | 5 门 / 42 次 | 无冲突 | 保留。**必须**用花体 |
| $\mathbb{R}$ | 实数域（$\mathbb{R}^n$、$\mathbb{R}^{p\times m}$） | 10 门 / 39 次 | 无冲突 | 保留。**必须**用黑板体（§1-4：否则 $R$ 会被虚增） |
| $\eta$ | 匹配不确定性（$\Delta f=g\cdot\eta(x,t)$）；效率 | 1 门 / 36 次 | 无冲突（只在 `sliding-mode-control`） | 保留 |
| $\Gamma$ | 自适应增益矩阵（$\Gamma=\Gamma^T>0$） | 1 门 / 35 次 | 无冲突 | 保留。**推荐**作为 $\gamma$（自适应增益）的矩阵形式标准写法 |
| $\Lambda$ | 相对增益矩阵 RGA（$\Lambda=G_{ss}\circ(G_{ss}^{-1})^T$）；正定对角阵 | 4 门 / 25 次 | **B 级**：RGA 与对角阵同字母 | 保留。RGA 写 $\Lambda$ 且只在多变量章；对角阵 → $\mathrm{diag}(\cdot)$ |
| $\mathcal{X}$ | 状态约束集；终端集 $\mathcal{X}_f$ | 3 门 / 23 次 | 无冲突 | 保留 |
| $\mathcal{F}$ | 线性分式变换 $\mathcal{F}_\ell(P,K)$、$\mathcal{F}_u(G_u,\Delta)$ | 5 门 / 23 次 | 无冲突 | 保留。**必须**带 $\ell$/$u$ 下标 |
| $Z$ | Nyquist 判据的闭环右半平面极点数（$Z=P-N$）；MPC 的决策向量 $Z=[X,U]$；配分函数 | 3 门 / 21 次 | **B 级**：极点数与决策向量同字母 | 保留。极点数写 $Z$ 且只在 Nyquist 一节；决策向量写 $\boldsymbol Z$ 加粗 |
| $\Sigma$ | 系统算子（$\Sigma:u\mapsto y$） | 1 门 / 21 次 | 无冲突 | 保留 |
| $\ell$ | 阶段代价 $\ell(x,u)$ | 3 门 / 18 次 | **B 级**：与 $l$（长度）字形相近 | 保留，并**规定阶段代价只能用 $\ell$**（见 $l$ 行） |
| $o$ | 可观性下标（$S_{c\bar o}$、$S_{\bar c o}$） | 2 门 / 15 次 | 无冲突 | 保留。**只在** `controllability-observability` 的子空间记号里使用 |
| $\mathcal{Z}$ | Z 变换算子 $\mathcal{Z}\{x[k]\}$、$\mathcal{Z}^{-1}$ | 3 门 / 14 次 | 无冲突 | 保留。**必须**用花体，以区别离散域变量 $z$ |
| $\mathcal{L}$ | Laplace 变换算子 $\mathcal{L}^{-1}\{\cdot\}$；Lagrange 函数 $\mathcal{L}=f+\boldsymbol\lambda^T g$ | 5 门 / 13 次 | **B 级**：变换算子与 Lagrange 函数同字母 | 保留。变换算子**必须**写 $\mathcal{L}\{\cdot\}$/$\mathcal{L}^{-1}\{\cdot\}$ 带花括号自变量；Lagrange 函数写 $\mathcal{L}$ 且只在 `optimal-control-basics` |
| $\mathcal{A}$ | 活跃约束索引集 $\mathcal{A}(U^*)$ | 1 门 / 11 次 | 无冲突 | 保留 |
| $\mathcal{R}$ | 状态空间的多面体划分区域 $\mathcal{R}_i$；$\mathcal{RH}_\infty$（实有理稳定传函类） | 2 门 / 10 次 | **B 级**：区域与 $\mathcal{RH}_\infty$ 同字母。抽取器把 `\mathcal{RH}` 读成全大写连写 `RH`（§4 已判**不登记**） | 保留。区域写 $\mathcal{R}_i$ 带下标；$\mathcal{RH}_\infty$ 保持整体写法，**不要**拆成 $\mathcal{R}\cdot H$ |
| $\kappa$ | 终端控制律 $\kappa_f(x)$；曲率 | 1 门 / 10 次 | 无冲突 | 保留 |
| $\varphi$ | 回归量（`adaptive-control-basics:2054`，与该课主流的 $\phi$ 指同一物）；描述函数的相位（`describing-function:43`） | 3 门 / 10 次 | **A 级**：见 $\phi$ 行 | `adaptive-control-basics:2054` 的 $\varphi\varphi^T$ **改为 $\phi\phi^T$**（同课第 112 行已是 $\int\phi\phi^{\mathsf T}$）。`describing-function` 的相位 $\varphi$ 保留（该课不用 $\phi$ 表相位）。→ §3.2-2 |
| $\nabla$ | 梯度算子（$\nabla V$、变量梯度法） | 3 门 / 9 次 | 无冲突 | 保留 |
| $\nu$ | v-gap 的下标（$d_\nu$）；泊松比 | 2 门 / 9 次 | 无冲突 | 保留。**推荐**作为 Nyquist 圈数的替代字母（见 $N$ 行） |
| $\psi$ | 航向角（$e_\psi$）；协态 | 3 门 / 7 次 | 无冲突 | 保留 |
| $\mathcal{N}$ | 正态分布 $\mathcal{N}(\mathbf 0,\sigma^2\mathbf I)$；邻居集合 $\mathcal{N}_i$ | 2 门 / 6 次 | **B 级**：分布与集合同字母 | 保留。分布**必须**写 $\mathcal{N}(\cdot,\cdot)$ 带两个参数；邻居集合**必须**写 $\mathcal{N}_i$ 带下标 |
| $\Theta$ | 参数可能范围（$\theta\in\Theta$） | 2 门 / 6 次 | 无冲突 | 保留 |
| $\mathcal{D}$ | 与 $\boldsymbol\Delta$ 交换的缩放矩阵集合 | 2 门 / 5 次 | 无冲突 | 保留 |
| $\mathcal{V}$ | 通信图的节点集 | 1 门 / 4 次 | 无冲突 | 保留 |
| $\mathcal{P}$ | 状态空间的多面体划分 $\{\mathcal{P}_i\}$；区间多项式族（Kharitonov） | 2 门 / 4 次 | **B 级**：划分与多项式族同字母 | 保留。划分写 $\mathcal{P}_i$ 带下标；多项式族写 $\mathcal{P}$ 且只在 `robust-stability` |
| $\mathcal{E}$ | 通信图的边集 | 1 门 / 3 次 | 无冲突 | 保留 |
| $\mathcal{U}$ | 输入约束集 | 2 门 / 2 次 | 无冲突 | 保留 |
| $\emptyset$ | 空集 | 1 门 / 2 次 | 无冲突 | 保留 |
| $\mathcal{G}$ | 通信图 $\mathcal{G}=(\mathcal{V},\mathcal{E})$；参数化对象集合 $\mathcal{G}=\{G(s,\theta):\theta\in\Theta\}$ | 2 门 / 2 次 | **B 级**：图与集合同字母，跨章不重叠 | 保留。图写 $\mathcal{G}=(\mathcal{V},\mathcal{E})$ 带成员；集合写 $\mathcal{G}=\{\cdot\}$ 带花括号 |
| $\mathcal{K}$ | $\mathcal{K}_\infty$ 函数类 | 1 门 / 1 次 | 无冲突 | 保留。**必须**写 $\mathcal{K}_\infty$ 带下标 |
| $\Pi$ | 投影算子 $\Pi_\Omega(\cdot)$（把自适应律限制在 $\Omega$ 内） | 1 门 / 1 次 | 无冲突 | 保留。**必须**写 $\Pi_\Omega$ 带集合下标 |

| $\Psi$ | 指数极坐标映射（math/diff-geometry） | 1 门 / 1 次（MATH-15引入时） | 无冲突 | 仅本课局部反例：Jacobian可逆但角度周期，非全局坐标；不覆盖预测矩阵。 |
<!-- REGISTER-END -->

---

## §3 冲突逐条裁决

### §3.1 Prompt 点名的 10 组

**1. $T$ —— 采样周期 / 时间常数 / 终端时间 / 转置（+ 闭环传函 / 转矩 / 相似变换）**

出现最广的基：**55 门 / 1692 次**（56 门课里只有 1 门没用到 $T$）。实测到的七种读法：

| 读法 | 证据 | 门数 |
|---|---|---|
| 采样周期 | 变体 `T_s`(334 次)、`Ts`(33 次，实为 $T\cdot s$ 连乘) | 22 门（`discrete-sampled/*`、`implementation/*`、`mpc/*`） |
| 时间常数 | `classic/compensator-design:270` 的 $G_c(s)=\frac{1+\alpha Ts}{1+Ts}$（同形另见 `:893`、`:915`） | classic 章 |
| 终端时间 | `modern/optimal-control-basics`、`nonlinear/lyapunov-stability` 的 $\int_0^T$ | modern / nonlinear 章 |
| 闭环传递函数 | 变体 `T_{zw}`(29 次)、`classic-case-study:954` 的 $T(s)=CG_p/(1+CG_p)$ | 5 门（`robust/*`） |
| 转矩 | 变体 `T_L`(29)、`T_m` | 5 门 |
| 相似变换矩阵 | `TAT^{-1}`(18 次)，`modern/state-feedback:582`、`modern/state-space:106` | 2 门 |
| 转置 | `^T` **734 处 / 30 门**，§1-6 规定**不计入** $T$ | 30 门 |

**为什么判 B 级而不是 A 级**：`classic/compensator-design` 的裸 $T$ 是时间常数，采样周期一律写 $T_s$；
`pid-controller` 与 `discrete-sampled/sampling-period-selection` 的 $T$/$T_s$ 是采样周期——**跨门课**，不是同门课。
按 §1-9 判据，A 级要求「同门课内同一裸字母两义」，这里不满足，故判 B 级。
草稿曾把它列 A 级候选（理由是「`compensator-design` 内部 $T$ 同时出现在超前网络与采样交叉引用里」），
逐形态实测后不成立，降级过程与数据记在 §3.2-4。

**裁决**：默认含义 = **采样周期**，且**必须写 $T_s$**。迁移方案：
- 时间常数 → $\tau$（该基已有 28 门 / 335 次在用，语义正好）
- 终端时间 → $t_f$（`time-domain-analysis` 变体 `t_f`(73 次) 已在用）
- 闭环传函 → **保留** $T(s)$/$T_{zw}$（鲁棒章专用，与采样章零重叠，改了反而增加迁移成本）
- 转矩 → **保留** $T_L$/$T_m$（必须带下标，裸 $T$ 禁用）
- 相似变换 → $\mathcal{T}$（只 2 门 18 处，迁移成本最低）
- 转置 → 维持 $^T$（LaTeX 惯例，不动）

**待修课程**：`modern/state-feedback` 与 `modern/state-space`（$T$ → $\mathcal{T}$，18 处，必修）；
`classic/compensator-design`（$T$ → $\tau$，约 6 处，**可选**，见 §3.2-4）。

**2. $N$ —— 描述函数 / 预测时域 / 样本数（+ Nyquist 圈数 / 前馈增益 / 种群总数）**

**34 门 / 808 次**，六种读法，按章严格分区：

| 读法 | 证据 | 门数 |
|---|---|---|
| 预测时域 | 变体 `N_p`(181)、`N_u`(119) | 10 门（`mpc/*` 全部 + `sampling-period-selection`） |
| 描述函数 | `N(A)`，`nonlinear/describing-function`、`nonlinear-characteristics` | 2 门 |
| Nyquist 包围圈数 | `classic/frequency-domain-analysis:544`「$N$：Nyquist 曲线**逆时针**包围 $(-1,j0)$ 的圈数」、`:760` 的 $Z=P-N$ | 2 门 |
| 前馈增益 | `modern/modern-case-study:262` 的 $u=-K\boldsymbol x+Nr$ | 1 门 |
| 种群总数 | `classic/system-modeling:620` 的 $\dot I=\beta I(N-I)-\gamma I$ | 1 门 |
| 滤波系数 / 微分增益上限 | 「$N=10\sim100$」，`classic/pid-controller`、`implementation/digital-pid` | 2 门 |

**裁决**：默认含义 = **预测时域**，且**必须带下标** $N_p$/$N_u$。
描述函数保留 $N(A)$（带自变量，形状自证）；Nyquist 圈数 → **改 $\nu$**（该基已有 2 门在用，且 $Z=P-N$ 改 $Z=P-\nu$ 后与 $\nu$ 的"计数"语义相符）；前馈增益 → $N_r$；种群总数 → $N_{tot}$；微分滤波上限 → $N_f$。

**待修课程**：`classic/frequency-domain-analysis`、`classic/stability-analysis`（$N$ → $\nu$，各约 4 处）、`modern/modern-case-study`（$N$ → $N_r$，约 10 处）。

**3. $Q$、$R$ —— LQR 权重 vs Kalman 噪声（角色互换）**

这是 Prompt 点名里**语义最危险**的一组：同一个符号对 $(Q,R)$ 在两门课里角色完全相反。

| | `modern/lqr-controller` | `modern/kalman-filter` |
|---|---|---|
| $Q$ | 状态**权重**矩阵（设计自由度，越大越在意偏差） | 过程**噪声协方差**（给定的统计量，不可调） |
| $R$ | 控制**权重**矩阵（设计自由度，越大越省能量） | 测量**噪声协方差**（给定的统计量，不可调） |
| 方程 | ARE：$A^TP+PA-PBR^{-1}B^TP+Q_{lqr}=0$（`kalman-filter:801` 原文已带下标） | DRE：$\dot P=AP+PA^T-K_fCP-PC^TK_f^T+Q+K_fRK_f^T$（`kalman-filter:141`） |

`kalman-filter:801` 已经自发写了 $Q_{\text{lqr}}$ ——说明作者在写到那一行时自己也被绕了一下。

**裁决**：**保留字母，用下标锁死语义**（换字母的方案不可行：$Q,R$ 是 LQR/Kalman 的行业标准记号，改了会与所有教材冲突）。
- LQR/最优控制章：$Q$、$R$，首现处必须写「$Q\succeq0$ 是**状态权重**（设计自由度）」
- Kalman/估计章：$Q$、$R$，首现处必须写「$Q$ 是**过程噪声协方差**（给定）」
- **两章交叉引用时**（如 `kalman-filter:801` 引 ARE）：必须写 $Q_{lqr}$、$R_{lqr}$
- 建议：MPC 章的代价权重统一写 $\bar Q$、$\bar R$（`mpc-principle` 已用 $\bar Q$，见 `HU^*+f=0$ … $(\Phi^T\bar Q\Phi+\bar R)^{-1}$`）

**待修课程**：无（下标已存在或可由首现处声明解决）。移交 C1 的只有**"首现处必须声明是权重还是噪声"**这条写作规范，属 SKILL.md 的产出规则（§6 已写入）。

**4. $V$ —— Lyapunov / 体积 / 电压（+ 值函数 / 松弛权重）**

**26 门 / 645 次**，变体 `V_2`(28) `V_f`(24) `V_1`(15) `V_n`(8) `V_i`(4) `V^k`(4) `V_t`(3) `V_{ref}`(3)。

| 读法 | 证据 |
|---|---|
| Lyapunov 函数 | `V(x)` 出现在 11 门（`nonlinear/lyapunov-stability`、`backstepping`、`sliding-mode-control`、`adaptive-control-basics`、`mpc/*`、`robust/robust-stability`、`discrete-sampled/discrete-stability-criteria`、`intelligent/fuzzy-control-basics`、`modern/linear-system-theory`、`nonlinear/phase-plane`、`nonlinear-characteristics`） |
| 终端代价 / 值函数 | `V_f`(24)，`mpc/nonlinear-mpc:326`、`mpc/receding-horizon` |
| 容积 | `mpc/mpc-case-study:69` 的 $\rho C_p V\frac{dT}{dt}$；`classic/system-modeling:410` 的 $C_h=V_0/\beta_e$ |
| 电压 | `classic/system-modeling:290` 的 $\omega(s)/V(s)=K/(Rs)$、`:291` 的 $K_t/(RB+K^2)$ |
| 松弛变量权重 | `mpc/constraint-handling` 的「松弛变量的权重——**必须足够大**」 |

**裁决**：默认含义 = **Lyapunov 函数**，写 $V(x)$ 带自变量。
- 终端代价保留 $V_f$（与 $V(x)$ 同族，下标已消歧）
- 容积 → $V_0$/$V_R$（`mpc-case-study` 的裸 $V$ 建议改 $V_R$，约 5 处）
- 电压 → **改 $V_a$**（`system-modeling:290-291` 的 $V(s)$ 与 Lyapunov 章的 $V(x)$ 形状太像，2 处）
- 松弛权重 → $w_s$（避免占用 $V$）

**待修课程**：`mpc/mpc-case-study`（$V$ → $V_R$）、`classic/system-modeling`（$V(s)$ → $V_a(s)$）。

**5. $H$ —— 传递函数 / 哈密顿量 / H∞ 范数（+ Hessian / Hurwitz 矩阵）**

**18 门 / 173 次**。注意 $\mathcal{H}_\infty$ 是**另一个基**（$\mathcal{H}$，3 门 / 49 次），抽取器已正确分开——所以 Prompt 说的"$H$ = H∞ 范数"在本语料里其实**不冲突**。

| 读法 | 证据 |
|---|---|
| 反馈通道传递函数 | `classic/transfer-function:236`「前向通道为 $G(s)$，反馈通道（传感器）为 $H(s)$」、`:256`「单位反馈（$H(s)=1$）」、`:493` |
| Hamiltonian / 首次积分 | `modern/state-space:457`「凯莱-哈密顿定理」；`nonlinear/phase-plane:413` 的解析首次积分 $H(x,y)$、`:1270` 的 $H(0)$ vs $H(40)$ 漂移表 |
| Hessian | `mpc/nonlinear-mpc:187`「$H^i$ 是 Hessian（或 Hessian 近似）」 |
| Hurwitz 矩阵 | `classic/stability-analysis:502`「$\Delta_i$ 是 $H$ 的左上角 $i\times i$ 子矩阵的行列式」 |
| $\mathcal{H}_\infty$ | `robust/h-infinity-basics:8/34/36`、`mixed-sensitivity`、`robustness-concept`（花体，独立基） |

**裁决**：保留 $H$，**四种读法形状各异**（$H(s)$ / $H(x,y)$ / $H^i$ / 裸 $H$），已可消歧。
- 传感器传函：必须写 $H(s)$ 带自变量
- Hamiltonian：建议改 $\mathcal{H}$（与 $\mathcal{H}_\infty$ 同族，`phase-plane` 的 $H(x,y)$ → $\mathcal{H}(x,y)$，约 8 处）
- Hessian：必须写 $H^i$ 或 $\nabla^2 J$
- Hurwitz 矩阵：**必须改 $\mathcal{H}$**（`stability-analysis:502` 的裸 $H$ 与同章 Routh 表的其他记号无关联，读者无从判断，1 处）

**待修课程**：`classic/stability-analysis`（$H$ → $\mathcal{H}$，1 处，**P0**：这是本组唯一"读者无法从形状判断"的场合）、`nonlinear/phase-plane`（$H$ → $\mathcal{H}$，可选）。

**6. $S$ —— 灵敏度函数 / 滑模面 / 协方差（+ 太阳常数 / 截面积）**

**18 门 / 353 次**，变体 `KS`(31) `S_p`(6) `CS`(5) `S_{co}`(4)。

| 读法 | 证据 |
|---|---|
| 灵敏度函数 | `classic/frequency-response-design:512`「$S(s)$ 的物理意义：输出对扰动的敏感程度」；`classic/compensator-design:825` 的 $S=1/(1+G)$；`robust/*` 的 $\|W_1S\|_\infty$、$\|CS\|_\infty$ |
| 滑模面 | `nonlinear/sliding-mode-control` 的切换面（该课主流写法是小写 $s$，见 $s$ 行） |
| 协方差 | `modern/kalman-filter` 的 $S$（新息协方差） |
| 太阳常数 / 截面积 | `classic/system-modeling`「太阳常数」、「截面积以避免混淆」 |

**裁决**：默认含义 = **灵敏度函数**。
- 滑模面**统一小写** $s(x)$（见 §3.2-1）——这是 $S$ 与 $s$ 两个基的联合裁决
- 新息协方差 → $S_{innov}$ 或 $\Sigma_v$
- 太阳常数 → $S_0$；截面积 → $A_c$（语料原文已注明"截面积以避免混淆"）

**待修课程**：无（灵敏度函数已是绝对主流，其余读法都带下标或语境隔离）。

**7. $\gamma$ —— 自适应增益 / 折扣因子 / H∞ 性能界 / 到达律系数（+ 死亡率）**

**13 门 / 288 次**，出现在 `robust/*`（6 门）、`nonlinear/*`（4 门）、`classic/system-modeling`、`mpc/generalized-predictive-control`、`mpc/prediction-model`。

| 读法 | 证据 |
|---|---|
| $\mathcal{H}_\infty$ 性能界 | `robust/h-infinity-basics:125`「$\|T_{zw}\|_\infty=\|\mathcal{F}_\ell(P,K)\|_\infty<\gamma$，且 $\gamma$ 尽可能小」 |
| 自适应增益 | `nonlinear/adaptive-control-basics`「**自适应增益**（adaptation gains）」×2；矩阵形式已用 $\Gamma$（`:857`） |
| 到达律系数 | `nonlinear/sliding-mode-control` 的 $\dot s=-\gamma\,\mathrm{sign}(s)$；`adaptive-control-basics:1629` 的 $\Pi_\Omega(-\gamma\,\mathrm{sign}(b)\,e\phi)$ |
| 折扣因子 | `mpc/generalized-predictive-control`、`mpc/prediction-model` 的 GPC 折扣预测 |
| 死亡率 | `classic/system-modeling:485` 的 $-\gamma y$、`:620` 的 $\gamma=0.1\,\text{day}^{-1}$ |

**裁决**：**按章定默认**，不换字母（$\gamma$ 在这五个场合都是行业标准记号）。
- 鲁棒章：$\gamma$ = 性能界（正标量）
- 自适应章：标量增益 $\gamma$，**矩阵增益必须写 $\Gamma$**（语料已如此，`:857` 明写 $\Gamma=\Gamma^T>0$）
- 滑模章：$\gamma$ = 到达律系数（正标量）
- MPC 章：折扣因子 $\gamma\in(0,1]$ —— **建议改 $\lambda_{disc}$ 或 $\rho$**，因为 $\gamma$ 在 MPC 章还与 `mpc-case-study` 的其他量撞；但 GPC 文献惯例就是 $\gamma$，故**列为可选**
- 死亡率 → $\gamma_d$（`system-modeling` 的 Lotka-Volterra/SIR 模型内，2 处）

**待修课程**：无强制项。`classic/system-modeling` 的 $\gamma$ → $\gamma_d$ 为可选。

**8. $\mu$ —— 隶属度 / 结构化奇异值 / 摩擦系数（+ 微前缀）**

**16 门 / 286 次**。

| 读法 | 证据 |
|---|---|
| 隶属度函数 | `intelligent/fuzzy-control-basics:55`「**隶属度函数**（membership function, MF）$\mu_A:X\to[0,1]$」；`fuzzy-controller-design`、`neural-network-control` |
| 结构化奇异值 | `robust/mu-synthesis`、`robust-case-study:390-391` 的 $\sup\mu_{RS}$、$\sup\mu_{RP}$；`robust-performance` |
| 摩擦系数 | `nonlinear/nonlinear-characteristics` |
| **微（micro）前缀** | `intelligent/fuzzy-control-basics:40` 的 `$19.38 \to 25.28\ \mu\mathrm{s}$` |

**最后一行是抽取器的一个真问题**：单位前缀 $\mu\mathrm{s}$ 写在数学环境里，被当成符号 $\mu$ 计入 286 次。它不影响裁决（$\mu$ 的四个读法靠形状已可分），但**污染了频次列**。

**裁决**：
- 隶属度**必须**写 $\mu_A(x)$ 带集合下标与自变量
- 结构化奇异值**必须**写 $\mu_{\boldsymbol\Delta}(M)$ 带结构下标（$\mu_{RS}$/$\mu_{RP}$ 这类多字母花括号下标按 §1-5 是文字标签，不计入 $\mu$）
- 摩擦系数 → $\mu_f$
- **单位前缀**：`fuzzy-control-basics:40` 的 `\mu\mathrm{s}` **改为 `\,µs`（U+00B5 MICRO SIGN）或把整个数量移出数学环境**（写成"25.28 µs"）。移交 C1，1 处。

**待修课程**：`intelligent/fuzzy-control-basics:40`（微前缀，实测 2 处 / 全在这一行，P1）。

**9. $A$ —— 系统矩阵 / 振幅 / 描述函数实部（+ 面积 / 邻接矩阵 / 辅助多项式）**

**46 门 / 2177 次**，变体 `A^T`(100) `A_0`(64) `AB`(48) `A_p`(47) `PA`(44) `A_1`(40)。

| 读法 | 证据 |
|---|---|
| 系统矩阵 | 绝对主流，`modern/*` 全部 + `mpc/*` 全部 + `nonlinear/*` 全部 |
| 描述函数输入振幅 | `nonlinear/describing-function:615`「记 $r=h/A$、$c=4M/(\pi A)$，则 $N=c(\sqrt{1-r^2}-jr)$」；`:1377`「设峰值为 $A_p$」 |
| 面积 / 活塞面积 | `classic/system-modeling:410` 的 $L_h=\rho l/A$、`:814` 的 $q_L=A_p\dot x$；「活塞面积」 |
| 邻接矩阵 | `mpc/distributed-mpc:209`「**邻接矩阵** $A$：$A_{ij}=1$ 若 $(i,j)\in\mathcal{E}$」 |
| Routh 辅助多项式 | `classic/stability-analysis:277`「辅助多项式用 $s^4$ 行：$A(s)=s^4+2s^2+1$」、`:279` 的 $A'(s)=4s^3+4s$ |
| 离散化后的矩阵 | `A_d=e^{AT}`（`discretization-methods`） |

**裁决**：默认含义 = **系统矩阵**。
- 描述函数振幅 → **保留 $A$**（描述函数章专用，$N(A)$ 的形状自证；`describing-function:1377` 已用 $A_p$ 表峰值，可）
- 面积/活塞面积 → **必须**写 $A_p$/$A_c$/$A_s$ 带下标（`system-modeling:410` 的裸 $A$ 建议改 $A_c$，1 处）
- 邻接矩阵 → **改 $A_{adj}$**（`distributed-mpc:209` 与同课的 MPC 增广矩阵 $A_e$ 撞车风险高，3 处）
- 辅助多项式 → **改 $\Delta(s)$**（Routh 表的辅助多项式在中文教材里常写 $A(s)$，但 `stability-analysis` 同章 $\Delta$ 已用作判别式，两者不撞；$A(s)$ 与系统矩阵 $A$ 撞，2 处）

**待修课程**：`classic/system-modeling`（1 处，可选）、`mpc/distributed-mpc`（$A$ → $A_{adj}$，3 处，P1）、`classic/stability-analysis`（$A(s)$ → $\Delta(s)$，2 处，可选）。

**10. $K$ —— 增益 / 刚度 / 卡尔曼增益 / 反馈增益矩阵**

**49 门 / 2387 次**（第二广的基），变体 `K_p`(343) `BK`(157) `K_i`(143) `K_d`(135) `K_f`(84) `K_v`(51) `K_b`(43) `K^{-1}`(37) `K_u`(33)。

| 读法 | 证据 |
|---|---|
| PID 三增益 | $K_p$/$K_i$/$K_d$，`classic/pid-controller:39`、`implementation/digital-pid` |
| 状态反馈增益矩阵 | $u=-Kx$（8 门）、$A+BK$（5 门：`controllability-observability`、`kalman-filter`、`multivariable-systems`、`state-feedback`、`state-observer`） |
| Kalman / 终端增益 | $K_f$（5 门：`discretization-methods`、`kalman-filter`、`linear-system-theory`、`state-observer`、`mpc-principle`）；`kalman-filter:742` 的 $K_f=PR^{-1}C^T$ |
| 电机常数 | $K_m$（转矩）、$K_b$（反电动势）、$K_t$、$K_v$（速度误差系数） |
| **回溯增益** | `classic/compensator-design:763`「$K_b$ 是回溯增益」 |
| 刚度 | 小写 $k$（见 $k$ 行）；大写 $K$ 在 `system-modeling:709` 的 $\frac{LJ}{K}$ 里是**电机转矩常数** |
| 阀流量增益 / 压力-流量系数 | `system-modeling:812` 的 $q_L=K_qx_v-K_cP_L$ |
| 根轨迹增益 | `compensator-design:164` 的 $KG(s)$ |

**$K_b$ 是本组唯一的真撞车**：`compensator-design:763` 的 $K_b$ = 回溯增益，`classic-case-study:74` 的 $e_b=K_b\omega$ 里 $K_b$ = 反电动势常数。**跨门课**，判 B 级。

**裁决**：保留 $K$ 作增益族，**下标必须带语义**：
- $K_p$/$K_i$/$K_d$（PID）、$K$（状态反馈矩阵）、$K_f$（Kalman / MPC 终端）
- $K_m$/$K_t$/$K_e$（电机：转矩 / 转矩 / 反电动势）——**反电动势改 $K_e$**，把 $K_b$ 让给回溯增益（`classic-case-study` 3 处）
- 回溯增益 → $K_b$（back-calculation，与 `03-glossary.md` §2.1 的「反算 back-calculation」裁决一致）
- 阀系数 → $K_q$/$K_c$（已带下标，可）
- 根轨迹增益 → $K$（$KG(s)$ 形状自证）
- 刚度 → 小写 $k$（见 $k$ 行）

**待修课程**：`classic/classic-case-study`（$K_b$ → $K_e$，3 处，P2）。

### §3.2 A 级冲突：同一门课内**裸字母**两义（3 组 / 5 行）

判据见 §1-9：① 同门课内同字母两义，且 ② 至少一处是裸字母（无下标、无自变量、后面不紧跟单位）。
只有满足这两条才会让读者**当场读错**（不需要跨课对比、也不需要看一眼形状就能踩坑）。
下面 3 组是全部；另有两次"按判据判过、结论是不升 A 级"的记录，见本节 4、5 两条——**记下来是因为判据只有在其否决过主张时才是可检验的**。

**1. $s$ —— 复频率 vs 滑模面（`nonlinear/sliding-mode-control`）**

实测：该课有 **45 处** `sI` / `G(s)` / `(s)` 形态的 Laplace 域表达式，同时第 45–61 行定义「切换函数与切换面」$s(x)$ 并对它求导（`:61`「对切换函数求导」）。**同一门课、同一字母、两种含义**。

裁决：复频率保留 $s$（48 门 4845 次，动不了）；滑模面统一写 $s(x)$ **带自变量**，或改 $\sigma(x)$。
建议取**前者**（$s(x)$），因为滑模文献的通行记号就是 $s$，改 $\sigma$ 会与教材冲突，且 $\sigma$ 已被极点实部/奇异值/激活函数占用。
**待修**：`nonlinear/sliding-mode-control` 首现处补一句「本课用 $s(x)$ 表切换函数，与 Laplace 变量 $s$ 无关」——**1 处声明即可，不必改公式**。P0。

**2. $\phi$ vs $\varphi$ —— 同一门课内同一个回归量写了两种字形（`nonlinear/adaptive-control-basics`）**

实测：该课 `\phi` **105 次**（`:47` 定义「$\phi(x)$ 是已知的**回归量**」、`:112` 的 $\int\phi\phi^{\mathsf T}$、`:645` 的 PE 定义），`\varphi` **1 次**（`:2054` 的 $\int_{t}^{t+2\pi}\varphi\varphi^{\mathsf T}\mathrm d\tau$，注释说的是同一件事：「PE 强度…回归量的信息量」）。

裁决：统一 $\phi$。**待修**：`adaptive-control-basics:2054` 的 `\varphi\varphi^{\mathsf T}` → `\phi\phi^{\mathsf T}`，**1 处**。P0。
（`nonlinear/describing-function:43` 的 $\varphi$ 表描述函数相位，该课不用 $\phi$ 表相位，**保留**。）

**3. $\epsilon$ vs $\varepsilon$ —— 同一概念两种字形，2 门课内混用**

实测：`\varepsilon` 10 门 / 82 次，`\epsilon` 14 门 / 83 次；**同门课内两者都出现的有 2 门**：
`intelligent/neural-network-control`（`\varepsilon` 3 处 : `\epsilon` 2 处）、`nonlinear/nonlinear-characteristics`（7 : 1）。
两者语义完全同类（小正数、阈值、精度、正则化宽度、边界层厚度）。

裁决：**统一 $\varepsilon$**（KaTeX 下 `\varepsilon` 渲染为 ε、`\epsilon` 渲染为 ϵ，后者在正文里更易与 $\in$ 混）。
**待修**：上述 2 门课的 `\epsilon` → `\varepsilon`，共 3 处。P1。
其余 12 门只用 `\epsilon` 的课（`compensator-design` 的安全余量 $\epsilon=5°\sim15°$ 等）**列为可选**——单课内部自洽，不会让读者读错。

**4. $T$ —— 原列 A 级，实测后降级为 B 级（判据否决了草稿自己的主张）**

草稿给的理由是「`compensator-design` 内 $T$ 兼指时间常数与采样周期语境」。逐形态实测后不成立：

| 含义 | 该课的写法 | 实测 |
|---|---|---|
| 时间常数（超前/滞后校正） | **裸 $T$** | `:109` 的 $s=-1/(\alpha T)$、`:280` 同一零点、`:609` 的零点/极点对照；全课裸 $T$ 只有这一义 |
| 采样周期 | $T_s$，**带下标** | 8 处（`:777` 的 $T_s\leq 18$ ms、`:929` 习题的 $T_s=0.01$ s 等） |
| 相似变换矩阵 | 裸 $T$ | `state-space` 的 `TAT^{-1}` 8 处、`state-feedback` 1 处；两课的 $T_s$ 实测 **0 处**，"采样"一词分别出现 0 / 2 次 |

即**没有任何一门课让裸 $T$ 承担两义**：`compensator-design` 的采样周期一律带下标 $T_s$，
它本来就在执行 §3.1-1 的规则；`state-feedback`/`state-space` 根本不谈采样。
按 §1-9 的条件 ② 不满足 → **B 级**。撞的只是**跨课默认含义**（同章 `sampling-period-selection` 的 $T$ 是采样周期），
所以处置从"必修改名"降为 §3.4 的**可选** #15（改 $\tau$，或首现处补一句声明，二者皆可）。

**5. $\mu$ —— 同课两义、但两处都不裸，判为 B 级（临界记录）**

`intelligent/fuzzy-control-basics` 同课内确实两义：`:40` 的 $19.38\to 25.28\ \mu\mathrm{s}$ 是**微（micro）前缀**，
`:55` 的 $\mu_A:X\to[0,1]$ 是**隶属度函数**。但条件 ② 不满足：前者后面紧跟单位 `\mathrm{s}`，
后者带集合下标与自变量，两者形状自证，读者不会当场读错 → **B 级**。
仍列 §3.4 必修 #13（P1），但理由换成**抽取器卫生**：数学环境里的 $\mu\mathrm{s}$（实测 2 处，全在 `:40` 一行）
会给符号基 $\mu$ 灌 2 次假命中，让 §2 的 `16 门 / 286 次` 含 2 次根本不是"符号 μ"的计数。

### §3.3 B 级冲突的通用规则（68 行）

§2 里判为「B 级」的 **68 行**（含 $T$——原列 A+B 双级，实测后按 §1-9 判据降级，见 §3.2-4），**每门课内部都是自洽的**，读者不会当场读错。它们不需要逐个改正文，
需要的是**一条写作规则**，写进 SKILL.md（§6 已写）：

1. **一个字母在一门课里只有一个默认含义**；跨章换义时，首现处必须声明。
2. **带自变量的形状优先**：$V(x)$、$N(A)$、$H(s)$、$f(x)$、$\mathcal{L}\{\cdot\}$、$\rho(\cdot)$、$O(\cdot)$ 靠形状自证，不必换字母。
3. **必须写下标的场合**（裸字母禁用）：$\omega$、$t$、$K$、$M$、$W$、$I$、$q$、$E$、$F$、$N$（$N_p$/$N_u$）、$T$（$T_s$）。
4. **花体/黑板体是消歧工具，不是装饰**：$\mathcal{C}$ vs $C$、$\mathcal{O}$ vs $O$、$\mathcal{H}$ vs $H$、$\mathcal{Z}$ vs $z$、$\mathbb{R}$ vs $R$ —— 这五对已经靠字形分开，抽取器也正确分成两个基。
5. **加粗 = 向量/矩阵**：$\boldsymbol\theta$（参数向量）vs $\theta$（角度）、$\boldsymbol\Delta$（不确定性块）vs $\Delta$（增量）、$\boldsymbol X$（预测序列）vs $X(z)$（像函数）。
6. **默认含义由"门数"决定，不由"次数"决定**：$T$ 的默认是采样周期（22 门）而不是转置（30 门但 §1-6 已单列）；$A$ 的默认是系统矩阵（>20 门）。

### §3.4 总裁决：为什么不换字母

Prompt 要求「哪个保留、另一个换成什么符号、哪些课程需要改」。实测后的结论是：**107 个符号基一个都不整体改名**。
下面这张表把 §2 的 107 行按处置分完，行数可以直接从「冲突情况」列机械复核：

| §2 的行怎么处置 | 行数 | 理由 |
|---|---|---|
| 判「无冲突」，原样保留 | **34** | 多为花体/黑板体与单义符号，语义天然唯一 |
| 仅 B 级：保留字母 + 强制下标 / 带自变量 / 按章定默认 | **68** | 换字母会与教材和行业标准记号冲突，读者迁移成本远高于"多看一眼下标"（§3.3 的六条通用规则）。含 $T$——原列 A+B 双级，实测后按 §1-9 判据降级（§3.2-4） |
| 仅 A 级：首现处补一句声明 | **1**（$s$） | `sliding-mode-control` 里 $s(x)$ 与 Laplace 的 $s$ 同课并存，一句声明即可，**不必改公式** |
| 仅 A 级：统一字形 | **4**（$\phi+\varphi$、$\epsilon+\varepsilon$） | 同一概念两种字形是纯噪声，没有任何一方有教材依据 |
| **合计** | **107** | 34 + 68 + 1 + 4 |

**待修清单（21 项）**——E4 不改任何 MDX，下面每一项都移交 C1 / A6，落地时按 B8 开 fix-log 并填归因三字段。
「处数」列里标 `约` 的是 §3.1 各条的行级估算（同一字母在一门课里可能有多义，逐处归属要 C1 落地时判定），
未标 `约` 的是已数到行的实测值。

**必修 14 项 / 13 门 / 合计 54 处（实测 31 + 估算 23）**

| # | 课程 | 改什么 | 处数 | 级别 | 依据 |
|---|---|---|---|---|---|
| 1 | `nonlinear/sliding-mode-control` | 首现处补一句「本课用 $s(x)$ 表切换函数，与 Laplace 变量 $s$ 无关」 | 1 | P0 | §3.2-1 |
| 2 | `nonlinear/adaptive-control-basics` | `:2054` 的 $\varphi\varphi^{\mathsf T}$ → $\phi\phi^{\mathsf T}$ | 1 | P0 | §3.2-2 |
| 3 | `classic/stability-analysis` | Hurwitz 矩阵 $H$ → $\mathcal{H}$（本组唯一"读者无法从形状判断"的场合） | 1 | P0 | §3.1-5 |
| 4 | `intelligent/neural-network-control` | $\epsilon$ → $\varepsilon$（同课 $\varepsilon$ 3 处 : $\epsilon$ 2 处） | 2 | P1 | §3.2-3 |
| 5 | `nonlinear/nonlinear-characteristics` | $\epsilon$ → $\varepsilon$（同课 7 : 1） | 1 | P1 | §3.2-3 |
| 6 | `modern/state-feedback` | 相似变换 $T$ → $\mathcal{T}$（`TAT^{-1}`） | 与 #7 合计 18 | P1 | §3.1-1 |
| 7 | `modern/state-space` | 同上（`:106`） | ↑ | P1 | §3.1-1 |
| 8 | `classic/frequency-domain-analysis` | Nyquist 包围圈数 $N$ → $\nu$（`:544`、`:766`） | 约 4 | P1 | §3.1-2 |
| 9 | `classic/stability-analysis` | 同上 | 约 4 | P1 | §3.1-2 |
| 10 | `modern/modern-case-study` | 前馈增益 $N$ → $N_r$（`:262` 的 $u=-K\boldsymbol x+Nr$） | 约 10 | P1 | §3.1-2 |
| 11 | `mpc/mpc-case-study` | 容积 $V$ → $V_R$（`:69` 的 $\rho C_p V\frac{dT}{dt}$） | 约 5 | P1 | §3.1-4 |
| 12 | `classic/system-modeling` | 电压 $V(s)$ → $V_a(s)$（`:290-291`） | 2 | P1 | §3.1-4 |
| 13 | `intelligent/fuzzy-control-basics` | `:40` 的 $\mu\mathrm{s}$ 里 $\mu$ 是**微前缀**不是隶属度 → `\micro` 或 `\mathrm{\mu}`（实测 2 处，全在这一行） | 2 | P1 | §3.1-8 |
| 14 | `mpc/distributed-mpc` | 邻接矩阵 $A$ → $A_{adj}$（`:209`，与同课增广矩阵 $A_e$ 撞车风险高） | 3 | P1 | §3.1-9 |

**可选 7 项 / 新增点名 3 门（另 12 门泛称）/ 合计 14 处（实测 8 + 估算 6，另 2 项未计）**

| # | 课程 | 改什么 | 处数 | 级别 | 依据 |
|---|---|---|---|---|---|
| 15 | `classic/compensator-design` | 时间常数 $T$ → $\tau$（`:109`、`:280`、`:609` 的 $\frac{1+\alpha Ts}{1+Ts}$ 一族），**或**首现处补一句「本课 $T$ 是时间常数」——二者皆可，因该课采样周期一律写 $T_s$（8 处），读者不会读错 | 约 6 | P2 | §3.2-4 |
| 16 | `nonlinear/phase-plane` | 解析首次积分 $H$ → $\mathcal{H}$（`:413`；该课不与传递函数 $H(s)$ 同课并存） | 未计 | P2 | §3.1-5 |
| 17 | `classic/system-modeling` | 死亡率 $\gamma$ → $\gamma_d$（`:485`、`:620`） | 2 | P2 | §3.1-7 |
| 18 | `classic/system-modeling` | 截面积 $A$ → $A_c$（`:410` 的 $L_h=\rho l/A$） | 1 | P2 | §3.1-9 |
| 19 | `classic/stability-analysis` | Routh 辅助多项式 $A(s)$ → $\Delta(s)$（`:277`、`:279`；中文教材常写 $A(s)$，故列可选） | 2 | P2 | §3.1-9 |
| 20 | `classic/classic-case-study` | 反电动势 $K_b$ → $K_e$，把 $K_b$ 让给回溯增益 | 3 | P2 | §3.1-10 |
| 21 | 其余 12 门只用 $\epsilon$ 的课 | $\epsilon$ → $\varepsilon$（单课内部自洽，读者不会读错，故列可选） | 未计 | P2 | §3.2-3 |

**合计 21 项 / 16 门点名**（必修 13 门 + 可选新增 `compensator-design`、`phase-plane`、`classic-case-study` 3 门；
`system-modeling` 与 `stability-analysis` 已在必修点名，不重复计），另有 #21 泛称的 12 门。
处数合计 必修 54 + 可选 14 = **68 处**，其中 29 处（估算 23 + 6）是行级估算，C1 落地时按行复核。
P0 只有 3 项（#1–#3，共 3 处），因为它们是本表里唯一"读者当场就会读错"的场合。

---

## §4 全大写连写判定表（ABBREV）

**这张表改变符号抽取本身**：`loadAbbrevSet()` 只认第一列里满足 `/^[A-Z0-9]{2,}$/` 的串，
把它们当作**独立的符号基**，不再拆成单字母。所以

- 登记 `PM` ⇒ `PM` 的 265 处从 `P`（1245→980 次）与 `M`（877→534 次）里**扣掉**，`PM` 自己成为独立的基；
- **不**登记 `BK` ⇒ `BK` 的 161 处继续给 `B` 与 `K` 各加 161 次（这是**对的**，因为 `BK` 真的是 $B\cdot K$）。

**C5 判据**：缺表 → WARN；表里有条目本轮 0 命中 → WARN（同 C1b 的「绿 ≠ 在测量」）。
跑 `node scripts/glossary.mjs abbrs` 可看到本轮全部 67 种连写的逐个证据。

<!-- ABBREV-START -->

| 全大写连写 | 判定 | 依据 |
|---|---|---|
| PM | **是缩写**：相位裕度（Phase Margin），不是 $P\cdot M$ | 265 处 / 13 门。`classic/classic-case-study:199` `$PM \geq 50°$`；`classic/compensator-design:164`「读取当前相位裕度 $PM_0$」。带标变体 `PM_0`(23)、`PM_c`(23)、`PM_d`(19)、`PM_{min}`(4) 全是"某处的相位裕度" |
| GM | **是缩写**：增益裕度（Gain Margin），不是 $G\cdot M$ | 78 处 / 7 门。`classic/classic-case-study:200` `$GM \geq 10$ dB`；`classic/frequency-domain-analysis:308`「$GM > 6$ dB 通常认为可接受」。带标变体 `GM_{dB}`(3)、`GM_c`(1) |

<!-- ABBREV-END -->

**判定为「不是缩写」的 65 种**（继续按单字母拆，理由：它们全是矩阵/标量连乘，拆开才是真含义）：

| 类别 | 连写（括号为处数） | 说明 |
|---|---|---|
| 状态反馈闭环 | `BK`(161) `AB`(48) `TAT`(9) `TB`(6) `BB`(5) `BR`(5) `PBB`(4) `KB`(1) `DK`(1) `BT`(1) `BA`(1) | $A+BK$、可控性矩阵 $[B,AB,\dots]$、相似变换 $TAT^{-1}$、Gramian 里的 $BB^T$ |
| 观测器 / Kalman | `PA`(62) `PC`(41) `CP`(23) `AP`(18) `PBR`(19) `CT`(5) `XB`(1) `PR`(1) | `kalman-filter:141` 的 DRE：$\dot P=AP+PA^T-K_fCP-PC^TK_f^T+Q+K_fRK_f^T$ |
| 可观性 | `LC`(73) `CA`(36) `TC`(2) | 观测器增益 $LC$、可观性矩阵 $[C;CA;CA^2;\dots]$ |
| H∞ / μ 综合 | `KS`(31) `GK`(29) `GC`(25) `DMD`(12) `XA`(3) `AY`(2) `YA`(2) `RH`(3) `XY`(1) `XM`(1) `YN`(1) `NM`(1) | $W_3KS$、$I+GK$、$L=GC$、$\bar\sigma(DMD^{-1})$、两条 $\mathcal{H}_\infty$ Riccati、Bezout 恒等式 $XM+YN=I$ |
| 经典控制 | `DP`(25) `KG`(11) `ML`(5) `GH`(1) `CG`(1) `CGH`(1) | 相平面里 Poincaré 映射的 Jacobian $DP(s^*)$、根轨迹增益 $KG(s)$、$\frac{G}{1+GH}$、$\frac{CG}{1+CGH}$ |
| 机电 / 过程 | `RC`(15) `UA`(11) `RT`(10) `LJ`(6) `RB`(5) `LB`(1) `RJ`(1) | $RC\dot v_o+v_o=v_i$、换热项 $UA(T-T_c)$、Arrhenius 的 $E/(RT)$、$\frac{LJ}{K}$、$RB+K^2$ |
| 描述函数 / 整定 | `NG`(6) `KL`(5) `KN`(3) `KK`(4) `MK`(1) `MA`(1) | $KN(A)<3$（Routh 稳定条件）、$\sqrt{2MA_p}$、Ziegler-Nichols 的 $\frac{0.9}{KL}$ |
| MPC / 其他 | `PB`(13) `AR`(5) `CB`(5) `CS`(5) `AW`(3) `BN`(2) `AT`(2) `HU`(1) `BE`(1) `CL`(1) `RS`(1) `RP`(2) | $HU^*+f=0$、增广矩阵 $\begin{bmatrix}A&0\\CA&1\end{bmatrix}$、$\|CS\|_\infty$、$AW_c+W_cA^T+BB^T=0$、匹配条件 $\Delta A=BE$ |

三处**顺带发现的正文缺陷 / 抽取器行为**（不改，移交 C1 或记录在案）：

- `robust/mixed-sensitivity:366` 的 `$CL$`——作者想写"闭环系统"，全语料只此一处，`03-glossary.md` §7 已判它是缺陷（应为 $T$ 或写明"闭环传递函数"）。**不登记进 ABBREV**：登记等于把一个缺陷固化成约定。
- `robust/robust-case-study:390-391` 的 `$\mu_{RS}$`、`$\sup\mu_{RP}$`——`RS`/`RP` 是 `\mu` 的**多字母花括号下标**（文字标签，§1-5），不是符号。它们出现在这张连写清单里只是抽取器的字面行为，**不登记**。
- `robust/uncertainty-modeling:206` 的 `$\mathcal{RH}_\infty$`——被连写检测读成 `RH`。真正的基是 `\mathcal{R}`（§2 里 2 门 / 10 次）。**不登记 `RH`**，否则会凭空造出第 108 个基。

---

## §5 门槛盲区（这张表和 C1/C1b/C5 都看不见的东西）

E2 的教训：「绿 ≠ 在测量」。下面每一条都是**门槛判为 PASS 但实际有问题**的情形。

**1. 哨兵定位曾被正文劫持两次（已根治，有回归测试）。** 早期三处切片（REGISTER / NOISE / ABBREV）都用
`text.indexOf(START)` 取**第一次**出现。本文件头部为了警告"别在正文写全哨兵"，自己把完整的
`<!-- ABBREV-START -->` 写了一遍，于是切片从头部那句警告开始。**第一次**切到同一句里的 END →
得到**空集**：PM/GM 被拆回 $P\cdot M$、$G\cdot M$，`P` 虚高 265 次、`M` 虚高 343 次、`G` 虚高 78 次，
而 `check` 只会 WARN「没有 ABBREV 判定表」，**不会告诉你原因**。把警告改成只写名字后，
**第二次**是从头部切到**真** END，把 §0/§1/§2/§3 的全部表格都当成了 ABBREV 块——而全文件恰好只有
PM、GM 两行的第 1 列匹配 `^[A-Z0-9]{2,}$`，**输出与正确切片一模一样**。
判据静默失效却给出正确数字，是最难发现的那类坏（E2：「绿 ≠ 在测量」）。§5-1 自己又写了一遍字面，同一个坑踩第二次。
**根治**：三处切片统一改走 `scripts/glossary.mjs` 的 `sentinelSlice()`，判据是「整行 trim 后等于哨兵」。
散文里的哨兵永远不独占一行，所以正文怎么引用都安全，不必再靠"只写名字"这种纪律。
**回归测试固化在夹具里**：`.agent/e4-fixture/ok/docs/semester-02/04-notation.md` 的头部**故意**写全两个字面哨兵（第 7 行），
真哨兵在第 41 行。实测：若退回 `indexOf`，ABBREV 切片会从第 7 行开始、吞掉 **28 行**无关表格，
而解析结果**仍是** `{PM, GM}`——正是"判据失效但输出正确"，靠跑一遍 `check` 永远发现不了；
`sentinelSlice()` 下切片是干净的 **6 行**。unit-probe 的 **F 组**（F1–F5）钉住这条判据，
**B3/B4**（PM/GM 不拆成 $P\cdot M$、$G\cdot M$）是它的集成侧守卫。

**2. 「含义」列和「冲突情况」列不参与任何判定。** C1 只读第一列（符号基），
`rows notation --diff` 只读第三列（`N 门 / M 次`）。所以**含义写错、冲突判错，门槛一律 PASS**。
这两列的正确性靠人工复核（§6 的节奏）+ §3 的逐条证据行号。

**3. `冲突情况` 列的「无」是人工判断，不是测量结果。** 34 行判「无」的依据是
"我读遍了 `symbols` 给的释义候选与原文行，没找到第二种读法"——这是**阴性结论**，
无法证明。若将来新增课程给某个基引入第二义，`check` 不会报警（C3 只对
"释义候选 ≥2 且跨 ≥3 门" 报 INFO，而 INFO 不影响退出码，且候选串是括注前的中文碎片，噪声很大）。

**4. A/B 级分级也是人工判断。** §0 的「A 级 3 组 / 5 行 · B 级 68 行」里，A 级的 3 组都有行号级证据
（`sliding-mode-control` 的 45 处 Laplace 表达式、`adaptive-control-basics` 的 105:1、
`\epsilon`/`\varepsilon` 的 2 门混用），**B 级里可能还藏着没被发现的 A 级**。
判据（§1-9）本轮已经否决过一次主张——$T$ 从 A 级降级（§3.2-4），$\mu$ 差一点升级（§3.2-5），
这两条记录留着就是为了说明判据不是摆设。
发现方法：对每个基跑 `symbols`，看它的**课程列表里是否有两门课属于同一章**且释义候选明显不同，
再逐形态确认是否有**裸字母**承担两义。本轮只对 Prompt 点名的 10 组 + 频次前 40 的基做了这件事。

**5. `^T` 的 734 处是"数出来单列"的，不是"从 $T$ 里减掉"的。** §1-6 说"不计入 $T$"，
准确的说法是：抽取器把 `^T` 识别为转置记号并单独计数，`T` 的 1692 次里**不含**它。
若将来有人写 `A^{\top}` 或 `A^{T}` 之外的转置记法（如 `A'`），会被当成新符号或漏计。

**6. `PM`/`GM` 的 265/78 次是"提升后"的数，提升前 $P$/$M$/$G$ 的数不同。**
§2 里 `P` 是 29 门 / 980 次、`M` 是 31 门 / 534 次、`G` 是 40 门 / 1364 次。
若有人删掉 ABBREV 块里的 `PM` 行，这三个数会分别变回 1245 / 877 / 1442，
且 `rows notation --diff` **会报漂移**（这是好事：ABBREV 块的改动是可检测的）。

**7. 连写清单里的处数会随 ABBREV 块变化。** §4 表格里 `PM`(265)、`GM`(78) 是提升**前**的连写处数，
提升后它们不再出现在 `abbrs` 的"未判定"清单里（会标 `[缩写]`）。
所以 §4 的 65 种"不是缩写"清单 + 2 种"是缩写" = 67 种，这个加法**只在 ABBREV 块恰好登记 PM/GM 时成立**。

**8. 符号基没有别名冲突概念。** `03-glossary.md` 有 C2（术语别名冲突全裁决），
04 这边**没有对应判据**：同一个基的两个含义不会被机器发现，只有 C3 的 INFO 给线索。
理由：术语的"标准译名"是唯一答案，符号的"含义"天然多值，强行判冲突会把 107 行里 73 行判成 FAIL。

---

## §6 维护

**重新生成机械列**（改了 MDX 之后）：

```bash
node scripts/glossary.mjs symbols      # 逐符号的证据（课程 / 释义候选 / 带标变体 / 原文行）
node scripts/glossary.mjs abbrs        # 全大写连写的逐个证据（判 PM 是缩写还是 P·M 连乘靠这张表）
node scripts/glossary.mjs rows notation        # 打印登记表机械列的草稿（只读，107 行）
node scripts/glossary.mjs rows notation --diff # 核对 §2 的「N 门 / M 次」是否还与本轮扫描一致
node scripts/glossary.mjs check        # 门槛：C1 未登记的符号基 / C1b 死条目 / C5 缩写表
npm run glossary:check                 # 同上（package.json 别名）
```

**新增一门课之后的标准流程**：

1. 跑 `npm run glossary:check`。绿 → 跳到第 4 步。
2. C1 FAIL（有未登记的符号基）→ 跑 `node scripts/glossary.mjs symbols`，找到那个基的证据行，
   在 §2 加一行，填齐五列。**含义列必须给出门数最多的那个读法**，其余读法写进「冲突情况」列。
3. C5 WARN（出现了新的全大写连写）→ 跑 `node scripts/glossary.mjs abbrs`，
   逐个判"是缩写还是连乘"：是缩写 → 加进 ABBREV 块；是连乘 → 加进 §4 的 65 种清单（哪一类）。
   **注意：ABBREV 块一改，§2 全部基的频次都会变**，必须重跑 `rows notation` 并把 §2 的第三列整体刷新。
4. 跑 `rows notation --diff`，确认 §2 的「N 门 / M 次」没有漂移。
5. **引入新符号之前**（SKILL.md「输出格式规范」已把这条写成硬规则）：
   查 §2 看这个字母是否已被占用、被谁占用；若与本课的含义冲突，按 §3.3 的六条规则处理
   （加下标 / 换花体 / 加粗 / 换字母），并把裁决写进讨论日志的「符号约定」小节。

**人工通读的节奏**：§2 的「含义」「冲突情况」「裁决建议」三列没有门槛保护（§5-2、§5-3），
每写完一章（约 8–10 门课）通读一遍 §2，重点看新增基和频次变化 >20% 的基。

**不要做的事**：

- 不要给「含义」列加自动填充——`symbols` 的「释义候选」是括注前的中文碎片（`**前提部**（antecedent`、
  `否渐近稳定`），精度不足以当含义，只能当线索
- 不要为了消除 B 级冲突而大规模换字母（§3.4：107 个基全部保留，必修只 14 项 / 54 处，且多数是补下标与补声明）
- 不要把 `Ts`(33)、`Nr`(10) 这类连写当"下标丢了下划线"——实测它们是真连乘
  （`compensator-design:270` 的 $\frac{1+\alpha Ts}{1+Ts}$ 是 $T\cdot s$；`modern-case-study:262` 的 $Nr$ 是 $N\cdot r$）
- 不要把 `.agent/e4-fixture/{ok,bad}/docs/` 里的玩具登记表抄进本文件（夹具是负向测试，`bad` 根**必须**保持红）

MATH-01校订与MATH-02局部符号：$a_k$ 为级数项、$R_n(x)$ 为泰勒余项；$z=a+bi$ 中a/b为实数坐标，i为虚数单位（索引改用k），r为模，θ为辐角，Arg为(-π,π]主值。首次定义后只在本课对应公式语境使用，不覆盖控制章R矩阵、r参考输入和i电流的约定。
MATH-04局部约定：A为离散更新矩阵，P为特征向量基底矩阵，D为对应特征值组成的对角矩阵，z为该基底下坐标；J为剪切教学矩阵，R为旋转教学矩阵，H为习题方阵，B为习题对角矩阵；λ为特征值，p/q为两个每步特征倍率，c为初始模态系数，k为整数步数。均在首次出现处定义，按§3.3第⑤条使用本课语境，不覆盖其它章P协方差、D直通、J代价/惯量、R权重和z变换变量。
MATH-05局部约定：A为3×2测量矩阵，M/N为LU示例方阵，L/U为三角因子（SVD段U重新明确为左奇异向量矩阵），P为置换矩阵，Q/R为QR因子，G为对称正定矩阵，C为Cholesky因子，V/Σ为SVD右基底/缩放矩阵，x/b/r为未知量/测量/残差，w为代入中间量，q为单位投影向量，s为教学矩阵较小奇异值，δ为噪声，τ为绝对截断阈值，κ₂为二范数条件数；按§3.3第⑤条在本课相应段落首现声明，不覆盖控制章Q/R权重、C输出、U控制序列、P协方差、τ时间常数与s拉普拉斯变量。
MATH-06局部约定：h(x,y)是归一化地形高度，x/y为平面坐标，p为站位向量，Δ为位移向量，dx/dy为全微分输入，dh为线性预测，r(Δ)/r₂(Δ)为余项，d为单位方向，∇h按列向量，J_g为g的雅可比（输出按行），H_h为h的Hessian，D为二阶判别行列式；F为路径反例，s(x,y)为马鞍函数，t为路径参数，N为每边网格数，dA为面积微元。按§3.3第②/⑤条带自变量/语义下标并局部声明，不覆盖控制章h采样、p极点、D直通、H反馈、s复频率与r参考输入。


### MATH-07局部约定（2026-10-18）

math/ode-matrix-exponential中，t/s为分钟/积分时刻，x₁/x₂是除以固定参考浓度的比例；持续注入实验沿用同一标尺。Q为体积流量，V₁/V₂为体积，a=Q/V₁、b=Q/V₂为min^-1，A为常系数水箱矩阵；温度T用°C，z是温差，冷却系数1/2用min^-1。振动、幂零和对角化小例另用归一化时间；B是对角化例矩阵，P/Λ为特征向量/特征值，N/K为局部幂零矩阵，f为外部输入，G为输入矩阵，u为输入信号，L为局部Lipschitz界。矩阵指数反例中的P/Q仅在该段作两方阵，不与流量Q或随后特征向量矩阵P混算（规则②/⑤局部消歧）；范数取最大绝对行和。所有e^{At}以A常数为前提，不用于一般时变A(t)。


### MATH-08局部约定（2026-10-18）

math/laplace-transform统一采用单边普通函数变换，初值f(0⁺)是右极限，不与0⁻或冲激项混写。t为时间、T为有限积分截止、r为卷积/换元的积分时刻，组件r=a+σ只在实现内表示总衰减系数；s=σ+jω、j²=−1，信号f与变换F成对。开篇分钟标尺下a/σ单位min^-1、ω用rad/min，无量纲信号F带分钟；方程系数单位由导数阶数配平。τ在延迟段为延迟时长，在传递函数段为时间常数，两者不混算（规则②/⑤）；U是给定输入变换，G在卷积段是第二函数变换，在传递函数段是零初值映射。ROC与代数式一并声明，α/β为线性组合常数、M/c为指数阶界、ω₀为正弦角频率。数值例中的固定1/2等按各局部模型解释，不能将不同初值移入U。


### MATH-09局部约定（2026-10-18）

math/fourier-analysis中t用秒、教学位移x用mm，T为基本周期，f₀/fs用Hz，ω/ω₀用rad/s；UI相位用度，公式用弧度，j²=−1。a₀/2=c₀为均值，cₙ=(aₙ−jbₙ)/2、单边幅值2|cₙ|限n>0；零幅值相位不可辨识。方波N为奇谐波项数、最高频率2N−1 Hz，跳点取左右中点0。均方单位mm²、RMS用mm，平方积分不自动等于机械能量。普通CTFT正向无常数、逆向1/(2π)，X单位为信号单位乘秒；H为稳定因果核的频响、H_L为单边加权积分，虚轴属于ROC才可连接。DFT另用N为样本数（在该段重新定义），正向不归一化、逆向1/N；实信号单边幅值仅内部格翻倍，DC/奈奎斯特端点只除N。r为卷积积分时刻，τ为延迟；按规则②/⑤局部消歧，不覆盖控制章x状态、T采样周期与N预测步长。


### MATH-10局部约定（2026-10-18）

math/z-transform中k/m/N为记录索引、求和索引、有限截止编号（含0到N），Ts为采样间隔分钟，tk=kTs。主例x为温差除以固定1°C，a为无量纲每步比例；负a仅作相对参考交替的数学扩展。z=re^{jθ}是无量纲复变量，r>0为半径，θ用弧度/步，物理ω用rad/min，θ=ωTs；组件仅θ0正实切片，图点不随r改变。δ[k]是Kronecker单位脉冲序列，1[k]是阶跃；X/Y/U为双边变换，带+为从k0起的单边变换，q=y[-1]不是y[0]。h/H为零状态脉冲响应/传递函数，u为每步加入量而非未经换算的功率；M为输入幅值界。τ为连续衰减时间常数，s为连续模态复增长率，不能用模态映射冒充一般传递函数离散化。按规则②/⑤局部消歧，不覆盖状态变量z、控制权重r、预测时域N及其它课q向量。


### MATH-11局部约定（2026-10-18）

math/probability-basics中Ω为样本空间，A/B/D为事件，D访客、B亮灯、上标c为补集，P为概率而非控制矩阵；组件p/t/f分别先验、有访客亮灯概率、无访客亮灯概率。10000为期望次数标尺，非实测样本量。X/Y/K/U/V为随机变量，x为取值，FX为CDF、fX为密度、E为期望、Var/Cov为方差/协方差；μ为均值、σ为标准差、ρ为相关系数，N(μ,σ²)第二参数为方差。测距X以mm，方差/协方差以mm²，密度以1/mm；U,V反例与均匀分布变量另声明无量纲。n为样本数/伯努利次数（分段重定义），k为成功数，barx为样本均值、barXn为随机样本平均，s²为n−1样本方差；C为共同随机误差、ηi为独立噪声，ε为正误差门限，a/b为线性变换常数或区间端点，依局部段落消歧。按规则②/⑤声明，不覆盖状态X、协方差P、状态矩阵A/B、输出C与复频率s。


### MATH-12局部约定（2026-10-18）

math/stochastic-processes中k/j为离散时间编号，每步1秒；Xk/Wk为电子秤误差/新扰动（g），m为总体均值、Pk为方差（g²）、C(k,j)为自协方差、R(k,j)为未中心化自相关、γℓ为宽平稳协方差时差序列。a为每步记忆比例、q为创新方差、P∞为解析不动点；二阶矩平稳初始化不表示完整分布平稳。δkj为Kronecker符号，L为白而不独立反例的共同幅值、εk为符号，随机常量例A只在该段使用。SX(θ)是以rad/步定义的离散功率谱，逆积分1/(2π)，不直接当Hz谱。Markov节T按当前行/下一列、pk为行概率向量、π为平稳分布、r为开门概率；向量节x/m为列向量，A为对角状态转移矩阵，Q/P为噪声/状态协方差矩阵、上标T为转置，同刻分量相关不等于跨时相关。Bt为标准Brownian、D为取样差分矩阵、σ在物理缩放时用g/√s，方差σ²t用g²。按规则②/⑤局部声明，不覆盖控制输入u、权重R/Q、误差矩阵C或上课事件A。

### MATH-13局部约定（2026-10-18）

math/convex-optimization中u为二维静态电暖器功率，r为给定请求，b为总上限，均用kW；f/p为半平方误差目标及最优值（kW²），不是能耗或概率。C为可行集，g/h为不等式/等式函数，L为拉格朗日函数时带参数，q为对偶下界而非随机过程创新方差。λ/μ为总功率/非负约束乘子（kW），ν为一般等式乘子，τ为投影阈值；1为全1列向量。η为无量纲迭代步长，k为迭代编号不是物理秒；PiC为欧氏投影，Gη为映射残差，L=1在算法节指梯度Lipschitz常数。H/c/d为QP系数，T转置，星号精确最优而非末迭代。按规则②/⑤局部声明，不覆盖状态x、概率P或控制代价权重惯例。

### MATH-14局部约定（2026-10-18）

math/variational-dp中x为归一化小车位置，u为归一化每步位移；离散k0…N，u仅0…N−1，连续另用t与xdot=u，不当同一采样模型。J为半平方和/积分泛函，ell为阶段代价，phi为终端代价，q/r/s为非负状态/严格正动作/非负终端权重（s不是复频率）。V为最优剩余代价，Pk为标量值函数系数而非协方差；K为该步增益，使用Pk+1；p为协态即边际代价，H为Hamilton量，不同于上一课QP Hessian。变分节L为代价密度，eta为端点允许扰动函数、epsilon为扰动幅度不是步长，a/b为直线路径系数。全部量归一化；连续与离散始终保留1/2，无噪声随机窗。按规则②/⑤局部声明，不改变其它课矩阵和物理单位。

### MATH-15局部约定（2026-10-18）

math/diff-geometry中M为光滑流形，TpM为切空间，p为位置点；c为约束，D为Jacobian，Phi/Psi为坐标映射。圆例R为半径m，theta角度rad，a为弧长坐标；ds²为长度平方而非复频率。搬运车z=(x,y,theta)，平移m/时间s/朝向rad；f/g按1m/s与1rad/s基准数值表示直行/转向场，v/omega在控制组合式为相对基准无量纲系数。epsilon是各段时长s（公式按1s归一数值），总4epsilon；括号固定Dg f−Df g，时间先后f→g→−f→−g，主项epsilon²[f,g]，曲线归一量按1m/1s基准。h输出，Lf是方向导数；分布是切子空间族不是概率。SO3节R改指旋转矩阵，Omega为机体角速度反对称矩阵，dotR=R Omega；该段另述恒角速度。控制接口另用x1/x2，relative-degree系数2x1只在非零邻域可除。按规则②/⑤局部声明，不覆盖其它课权重R、概率P或谱符号。
