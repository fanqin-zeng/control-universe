# 03 术语表（Glossary）——中英对照的单一权威表

> **这张表是机器读的，不只是给人看的。**
> `scripts/glossary.mjs check` 的 **C2** 判据把本文件 `REGISTER-START … REGISTER-END`
> 之间三列（中文标准译名 / 英文 / 别名）里的**每一个**分隔片段都当成一个"已登记的键"，
> 把 `NOISE-START … NOISE-END` 之间的第一列当成"已签字的残渣"。
> 一条别名冲突要判为**已裁决**，必须同时满足：
> ① 冲突键本身在两张表之一里；② 冲突里的**每一个变体**都在两张表之一里。
> 少一条 → `npm run glossary:check` 退出码 1。
>
> 所以：**改这张表就是改门槛**。删一行之前先跑 `node scripts/glossary.mjs conflicts`，
> 确认那行不是在给某条冲突签字。
>
> 姊妹文件：`04-notation.md`（数学符号约定，C1/C3/C5 判据）。
> 抽取脚本：`scripts/glossary.mjs`（口径见 §1）。负向夹具：`.agent/e4-fixture/`。

---

## §0 一页速览（2026-09-26 实测）

| 量 | 值 | 说明 |
|---|---|---|
| 扫描课程 | 56 门 | `content/**/*.mdx` |
| 抽取到的术语条目 | **305 条** | 一条 = 一个「中文 ⟷ 英文」配对 |
| 中文侧条目 | 348 条 | 同一中文可对多个英文，故 > 305 |
| 一英多中冲突 | **37 条** | 同一个英文键在语料里有 ≥2 种中文写法 |
| 一中多英冲突 | **15 条** | 同一个中文在语料里对 ≥2 个英文键 |
| 冲突合计 | **52 条** | 全部在 §4 逐条裁决，全部已由 §2/§3 签字 |
| 登记表条目（§2） | **314 行** | §2.1 有冲突的 72 行 + §2.2 无冲突的 242 行（含 1 行指向 §2.1 的说明行，不参与登记） |
| 残渣签字（§3） | **39 行** | 38 条真残渣 + 1 行给人看的说明（§5-8） |
| 登记键总数 | **737 个** | `check` 的 C2 实测输出，含三列按 `[、,;；/]` 拆出的每一段 |
| 机械草稿需人工过手的行 | **71 行 / 305（23%）** | 改判 57 + 删除 14；另有 6 组合并、28 行手写补登记，见 §6 |

**一句话结论**：语料里没有一处是"同一个概念被两门课译成两个名字然后读者被绕晕"级别的硬伤；
52 条冲突里 **35 条是同位语残渣**（`……控制（LQR）`、`……方程（ARE）`），
**9 条是缺全称或简称/全称不一致**，只有 **8 条是真译名分歧**，全部列在 §4.3。

---

## §1 口径：这张表量的是什么

| # | 口径 | 为什么这么定 |
|---|---|---|
| 1 | **只扫正文** | 围栏代码块、行内代码段、JSX 标签（含 `JupyterNotebook` 的 `setupCode`/`cells` 模板字面量）、frontmatter 全部由 `lib-mdx.mjs` 的 `scanMdx().skips` 掩掉。掩码等长且保换行，偏移对原文有效，行号不漂 |
| 2 | **术语只认「括号内纯拉丁」** | `（I 型系统）` 含汉字、`（Ts={Ts}s）` 含 `=` 与 `{}`，都不是中英对照 |
| 3 | **单位不在抽取阶段挡** | `（dB）`、`（Hz）` 是纯拉丁，会被抽出来。挡它就要另立一张单位表，两处维护。改由 §3 残渣表签字 |
| 4 | **别名冲突按「归一化后相同」判定** | 英文归一化 = 小写 + 去掉所有非 `[a-z0-9]`。故 `Loop Shaping` 与 `loop shaping` 同键；`Poincaré` 与截断产物 `Poincar` **也同键**（见 §5-6） |
| 5 | **不设频次阈值** | 早期版本给变体加过"≥2 次才算"的门槛，实测把冲突表从 31 条**整张滤成 0 条**——真分歧往往只出现一次。`solid()` 只保留为显示用的 `*` 标记 |
| 6 | **粗体星号四个位置都放行** | 实测 56 门课 15246 处短括注里 1236 处与 `*` 相邻：括外前侧 895、括外后侧 446、括内开头 14、括内结尾 29。`**术语**（English）` 是本语料最主流的定义写法，不放行会**抽样有偏**（放行前 205 条 / 38 冲突，放行后 305 条 / 52 冲突） |
| 7 | **符号按「基字母」登记，术语按「英文键」登记** | 裁决单位是"$T$ 是什么意思"，不是"$T_s$ 对不对" |
| 8 | **NOISE 是全局键控的** | 一个字符串进了 §3，就等于**永久**宣布它不是术语——将来任何以它为变体的冲突都会被 C2 直接放行。准入规则见 §3 表头 |

---

## §2 登记表（REGISTER）

`glossary.mjs` 把下面**两张表**当成同一张登记表读（`tableRows` 会正确跳过每一张表的分隔行
及其上方那一行表头，故一个哨兵块内放多张表是合法的）。

- **§2.1** = 52 条冲突涉及到的键，以及为它们补登记的独立术语
- **§2.2** = 其余条目，按英文键字母序

「出现课程」列的格式固定为 `N 门 / M 次`，取自本轮扫描，不要手改（改法见 §8）。

<!-- REGISTER-START -->

### §2.1 有冲突的条目（含为冲突变体补登记的独立术语）

`建议` 列里标 **补登记** 的行，其「中文 ⟷ 英文」配对**不来自语料**：语料里那个中文串
只是括注前的同位语（残渣），但它本身是个真术语，若不登记，C2 就无法给对应冲突签字，
而把它塞进 §3 又会永久毒化这个字符串（§1-8）。故在此独立成行，配对由人工给出。

| 中文标准译名 | 英文 | 别名（课程中出现过的其他译法） | 出现课程 | 建议 |
|---|---|---|---|---|
| 线性二次型调节器 | LQR、Linear Quadratic Regulator | 最优控制、线性二次型 | 6 门 / 9 次 | 统一为「线性二次型调节器（LQR）」。「最优控制」是上位词，另立条目；`mpc/mpc-principle`、`mpc/generalized-predictive-control` 里的「无限时域」「增广系统」是同位语残渣 → §4-1 |
| 比例积分微分控制器 | PID、Proportional-Integral-Derivative | — | 7 门 / 8 次 | 语料 7 门课**无一处**给 PID 写过中文全称，6 个中文变体全是同位语残渣 → §4-2。建议首现处补「比例积分微分控制器（PID）」 |
| 模型预测控制 | MPC、Model Predictive Control | — | 5 门 / 7 次 | 4 门课写法一致，无需改动；「有限时域/滚动优化/无限时域」是同位语 → §4-3 |
| 代数 Riccati 方程 | ARE、Algebraic Riccati Equation | — | 6 门 / 6 次 | 语料一律写「……Riccati 方程（ARE）」，抽取把限定词裁掉只剩「方程」→ §4-38。三条 Riccati 方程各自独立成行，别再共用「方程」 |
| 微分 Riccati 方程 | DRE、Differential Riccati Equation | — | 1 门 / 1 次 | `modern/lqr-controller` → §4-38 |
| 离散代数 Riccati 方程 | DARE、Discrete Algebraic Riccati Equation | — | 1 门 / 1 次 | `modern/lqr-controller` → §4-38 |
| 环路整形 | Loop Shaping、loop shaping | 回路整形法、频率整形 | 4 门 / 5 次 | 统一为「环路整形」；`robust/h-infinity-basics` 的「回路整形法」、`robust/robustness-concept` 的「频率整形」建议改 → §4-5 |
| 非线性规划 | NLP、Nonlinear Programming | 非凸非线性规划 | 3 门 / 5 次 | 「非凸非线性规划」是合法限定，保留为别名 → §4-7 |
| 零阶保持器 | ZOH、Zero-Order Hold | 零阶保持、采样保持器 | 4 门 / 5 次 | 统一为「零阶保持器」；`discrete-sampled/discrete-time-freq` 同一段里混用「零阶保持」与「采样保持器」→ §4-8 |
| 反算 | back-calculation、Back-calculation | 回溯法、反饱和、反算法 | 4 门 / 4 次 | **4 门课 4 个译名**，全语料最严重的一条。统一为「反算」→ §4-9、§7-2 |
| 无扰动切换 | bumpless transfer | — | 4 门 / 4 次 | 3 门一致；`implementation/computer-control-architecture` 的「输出不能突变」是解释句 → §4-10 |
| 动态矩阵控制 | DMC、Dynamic Matrix Control | 阶跃响应模型 | 2 门 / 4 次 | 「阶跃响应模型」保留为别名（DMC 确实用阶跃响应模型）→ §4-15 |
| 增益调度 | Gain Scheduling、gain scheduling | — | 3 门 / 4 次 | 3 门一致；「可考虑增益调度」是句法残渣 → §4-11 |
| 广义预测控制 | GPC、Generalized Predictive Control | — | 3 门 / 4 次 | 3 门一致；「多项式矩阵」是同位语，另立条目 → §4-14 |
| 基尔霍夫电压定律 | KVL、Kirchhoff's Voltage Law | — | 2 门 / 4 次 | 只有 `classic/system-modeling` 给过全称，其余 3 处（电枢回路/电气侧/电感支路）都是同位语，各自另立条目 → §4-12 |
| 二次规划 | QP、Quadratic Program | 凸二次规划 | 2 门 / 4 次 | 标准译名取「二次规划」，「凸二次规划」是 MPC 语境下的合法限定，保留为别名 → §4-16 |
| 速率单调调度 | RMS、Rate-Monotonic Scheduling | — | 2 门 / 4 次 | 注意 RMS 与「均方根 root-mean-square」同缩写，本语料 4 处全指调度 → §4-13、§7-3 |
| 实时迭代 | RTI、Real-Time Iteration | — | 2 门 / 4 次 | 「每步一次迭代」是解释句 → §4-17 |
| 多输入多输出 | MIMO、Multiple-Input Multiple-Output | — | 3 门 / 3 次 | `robust/mixed-sensitivity` 的「多变量」另立条目 → §4-18 |
| 双线性变换 | Tustin、Tustin's method | 双线性 | 3 门 / 3 次 | 标准译名补「变换」二字；`implementation/digital-pid` 的「离散化后」是残渣 → §4-19 |
| 操纵变量 | MV、Manipulated Variable | — | 2 门 / 3 次 | `mpc/generalized-predictive-control:570` 把 MV 注成「最小方差控制」，与「操纵变量」撞缩写 → §4-20、§7-4 |
| 递推最小二乘 | RLS、Recursive Least Squares | — | 2 门 / 3 次 | 「先用递推最小二乘」含动词，是残渣 → §4-21 |
| 持续激励 | PE、persistent excitation | — | 2 门 / 3 次 | 「并解释持续激励」是讨论日志里的指令句漏进正文 → §4-22、§7-5 |
| 模型参考自适应控制 | MRAC、Model Reference Adaptive Control | — | 1 门 / 3 次 | 「直接法」是教学分类标签，另立条目，**不得**再当 MRAC 的译名 → §4-23 |
| 自整定调节器 | STR、Self-Tuning Regulator | — | 1 门 / 3 次 | 「间接法」同上 → §4-24 |
| 积分饱和 | windup、integral windup | 累积误差 | 2 门 / 2 次 | 一英多中与一中多英两条冲突在同一行签字：`windup` 与 `integral windup` 是同物 → §4-25、§4-46 |
| 抗积分饱和 | anti-windup、Anti-windup | 抗饱和 | 2 门 / 2 次 | 统一为「抗积分饱和」；`nonlinear/nonlinear-characteristics` 的「抗饱和」建议改 → §4-26 |
| 预畸变 | pre-warping、Pre-warping | 预扭曲 | 2 门 / 2 次 | 两门课各写一个，统一为「预畸变」→ §4-27、§7-6 |
| 可编程逻辑控制器 | PLC、Programmable Logic Controller | — | 1 门 / 2 次 | 「离散制造」另立条目 → §4-28 |
| 分布式控制系统 | DCS、Distributed Control System | — | 1 门 / 2 次 | 「连续过程」另立条目 → §4-29 |
| 最大隶属度平均法 | MOM、Mean of Maximum | 最大隶属度法 | 2 门 / 2 次 | `intelligent/fuzzy-controller-design:949` 少写「平均」二字，`fuzzy-control-basics:741` 是对的 → §4-30、§7-7 |
| 反步法 | backstepping、Backstepping | 反向递推 | 2 门 / 2 次 | 统一为「反步法」；`mpc/nonlinear-mpc` 的「反向递推」建议改 → §4-31、§7-8 |
| 动态面控制 | DSC、Dynamic Surface Control | — | 1 门 / 2 次 | 「并解释动态面控制」是指令句漏进正文 → §4-32、§7-5 |
| 赫尔维茨 | Hurwitz | — | 2 门 / 2 次 | 两个中文变体（所有特征值实部为负 / 所有根位于左半平面）都是**定义句**，不是译名 → §4-33 |
| 超螺旋算法 | STA、Super-Twisting Algorithm | — | 1 门 / 2 次 | 「边界层」另立条目（它属于 tanh 边界层法，不是 STA 的译名）→ §4-34 |
| 鲁棒稳定性 | Robust Stability | 鲁棒稳定 | 2 门 / 2 次 | `robust/robustness-concept` 少「性」字，建议补齐 → §4-36 |
| 灵敏度函数 | Sensitivity Function、Sensitivity | — | 2 门 / 2 次 | 两门课一个写全称一个写简称，合并为一行 → §4-44 |
| 补灵敏度函数 | Complementary Sensitivity Function、Complementary Sensitivity | — | 2 门 / 2 次 | 同上 → §4-45 |
| 滚动优化 | Receding Horizon、receding horizon control | — | 2 门 / 3 次 | `mpc/receding-horizon:33` 写作「滚动优化（MPC）」，MPC 不是滚动优化的英文 → §4-42、§7-9 |
| 采样定理 | Nyquist-Shannon、Nyquist-Shannon sampling theorem | — | 1 门 / 1 次 | 语料写作「定理（Nyquist-Shannon）」，抽取裁掉了限定词 → §4-40 |
| 进化策略 | Evolution Strategies、ES | — | 1 门 / 2 次 | 与「自然进化策略（NES）」是**两个不同算法**，不可合并 → §4-48 |
| 自然进化策略 | Natural Evolution Strategies、NES | — | 1 门 / 1 次 | `intelligent/neural-network-control:363` 写作「进化策略（Natural Evolution Strategies, NES）」，漏「自然」→ §4-48、§7-10 |
| 线性二次高斯控制 | Linear Quadratic Gaussian、LQG | — | 1 门 / 1 次 | 语料写作「控制（Linear Quadratic Gaussian）」 → §4-49 |
| 线性二次型 | LQ、Linear Quadratic | — | 1 门 / 2 次 | LQ 是代价函数的形状，LQR 是用它设计的调节器，两者不能互注 → §4-50 |
| 有限时域 | Finite Horizon | — | 1 门 / 1 次 | **补登记**；语料只作为 MPC 的同位语出现 → §4-3 |
| 无限时域 | Infinite Horizon | — | 2 门 / 2 次 | **补登记**；`mpc/mpc-principle` 注给 LQR、`mpc/receding-horizon` 注给 MPC，同中文对两个英文 → §4-51 |
| 滞环 | hysteresis、hysteresis in frequency | — | 1 门 / 1 次 | `nonlinear/nonlinear-characteristics:934` 写作「滞后（hysteresis in frequency）」，同文件另有 13 处写「滞环」→ 应改「频率滞环」，移交 C1 → §4-39、§7-1 |
| 滞后 | phase lag、lag | — | 3 门 / 3 次 | **补登记**。裁决：「滞后」**只**用于相位滞后（phase lag）；磁滞/频率滞环一律写「滞环」→ §4-39 |
| 庞加莱截面 | Poincaré section、Poincaré | 相平面 | 1 门 / 1 次 | **补登记**。语料写作「相平面/Poincaré」，`/` 在这里是「或」，不是配对（§6 RE_SLASH） |
| 控制 | control | — | 1 门 / 2 次 | **补登记**。太泛，不能进 §3（否则将来任何含「控制」的冲突都会被静默放行）→ §4-1、§4-49 |
| 方程 | equation | — | 6 门 / 8 次 | **补登记**。「代数 Riccati 方程」被裁成「方程」→ §4-38 |
| 定理 | theorem | — | 3 门 / 3 次 | **补登记**。三条引文/人名都被裁成「定理」→ §4-40 |
| 嵌入式 | embedded | — | 2 门 / 2 次 | **补登记**。两个变体（TI C2000 DSP、PRO）都是产品名，进 §3 → §4-47 |
| 最优控制 | Optimal Control | — | 4 门 / 4 次 | **补登记**。LQR 的上位词 → §4-1 |
| 经典控制 | Classical Control | — | 1 门 / 1 次 | **补登记**。`modern/state-observer` 的「经典控制（PID）」是同位语 → §4-2 |
| 增广系统 | augmented system | — | 1 门 / 1 次 | **补登记** → §4-1 |
| 模拟 | analog | — | 1 门 / 1 次 | **补登记**。`implementation/computer-control-architecture` 的「模拟（ZOH）」是同位语；注意语料里「模拟」兼指 analog 与 simulation，两义未分 → §4-8 |
| 多项式矩阵 | polynomial matrix | — | 1 门 / 1 次 | **补登记** → §4-14 |
| 电枢回路 | armature circuit | — | 1 门 / 1 次 | **补登记** → §4-12 |
| 电气侧 | electrical side | — | 1 门 / 1 次 | **补登记** → §4-12 |
| 电感支路 | inductor branch | — | 1 门 / 1 次 | **补登记** → §4-12 |
| 离散制造 | discrete manufacturing | — | 1 门 / 1 次 | **补登记** → §4-28 |
| 连续过程 | continuous process | — | 1 门 / 1 次 | **补登记** → §4-29 |
| 直接法 | direct method | — | 1 门 / 2 次 | **补登记**。自适应控制里「直接法/间接法」是分类标签，不是 MRAC/STR 的译名 → §4-23 |
| 间接法 | indirect method | — | 1 门 / 2 次 | **补登记** → §4-24 |
| 频率 | frequency | — | 1 门 / 1 次 | **补登记**。`nonlinear/nonlinear-characteristics` 的「频率（Hz）」是同位语 → §4-6 |
| 增益 | gain | — | 1 门 / 2 次 | **补登记**。`classic/compensator-design` 的「增益（dB）」把单位当成了译名 → §4-10b |
| 幅值 | magnitude | — | 1 门 / 2 次 | **补登记**。同上，出自 `classic/frequency-domain-analysis` → §4-10b |
| 边界层 | boundary layer | — | 1 门 / 2 次 | **补登记**。滑模的 tanh 边界层法；`nonlinear/sliding-mode-control` 里它与 STA 并列出现 → §4-34、§4-52 |
| 多变量 | multivariable | — | 1 门 / 1 次 | **补登记** → §4-18 |
| 阶跃响应 | step response | — | 1 门 / 1 次 | **补登记** → §4-15 |
| 最小方差控制 | Minimum Variance Control | — | 1 门 / 1 次 | **补登记**。缩写 MVC，**不要**写 MV（MV = 操纵变量）→ §4-20 |

### §2.2 无冲突的条目（按英文键字母序）

| 中文标准译名 | 英文 | 别名（课程中出现过的其他译法） | 出现课程 | 建议 |
|---|---|---|---|---|
| （不译） | ACADO | — | 1 门 / 1 次 | 工具名不译。语料「实时（ACADO）」里的「实时」是同位语 |
| 交替方向乘子法 | Alternating Direction Method of Multipliers, ADMM、ADMM | — | 2 门 / 2 次 | — |
| 李雅普诺夫 | A. M. Lyapunov | — | 1 门 / 1 次 | 人名 |
| （不译） | ARM Cortex-M4 | — | 1 门 / 1 次 | 芯片型号。语料「典型值（ARM Cortex-M4）」是同位语 |
| 非对称多处理 | AMP、Asymmetric Multi-Processing | — | 1 门 / 1 次 | — |
| 模数转换器 | ADC、Analog-to-Digital Converter | — | 1 门 / 1 次 | — |
| 模拟输入 | AI、Analog Input | — | 1 门 / 1 次 | — |
| 模拟量与数字量通道 | AI/AO/DI/DO | — | 1 门 / 1 次 | 语料「点数和类型（AI/AO/DI/DO）」是同位语。英文列的 `/` 会被拆成 4 个键，正好把 AI/AO/DI/DO 一次登记全 |
| 混叠 | aliasing | — | 1 门 / 1 次 | — |
| 环形区域 | annulus | — | 1 门 / 1 次 | — |
| 前提部 | antecedent | — | 1 门 / 1 次 | 模糊规则的前件 |
| 抗混叠滤波器 | anti-aliasing filter | — | 1 门 / 1 次 | — |
| 模拟输出 | AO、Analog Output | — | 1 门 / 1 次 | — |
| 辐角 | argument | — | 1 门 / 1 次 | — |
| 幅角原理 | Argument Principle | — | 1 门 / 1 次 | — |
| 自整定 | Auto-tuning | — | 1 门 / 1 次 | — |
| 反电动势 | back-EMF | — | 1 门 / 1 次 | — |
| 间隙 | backlash | — | 1 门 / 1 次 | — |
| 仿真反向传播 | backpropagation through time, BPTT | — | 1 门 / 1 次 | — |
| 模型降阶 | balanced truncation | — | 1 门 / 1 次 | — |
| 球-梁系统 | ball-and-beam | — | 1 门 / 1 次 | — |
| 批次反应器 | batch reactor | — | 1 门 / 1 次 | — |
| 外部稳定性 | BIBO Stability | — | 1 门 / 1 次 | — |
| 平分法 | Bisector | — | 1 门 / 1 次 | 根轨迹分离角平分法 |
| 分离点 | breakaway point | — | 1 门 / 1 次 | — |
| 会合点 | break-in point | — | 1 门 / 1 次 | — |
| 预算服务器 | Budget Server | — | 1 门 / 1 次 | — |
| 布尔克哈特轮胎模型 | Burckhardt | — | 1 门 / 1 次 | 语料「轮胎模型（Burckhardt）」；Burckhardt 是人名 |
| 参数突跳 | bursting | — | 1 门 / 1 次 | 语料原文「猛推一把（bursting）」（`nonlinear/adaptive-control-basics:114`），机械草稿截成「猛推一」 |
| 缓存锁定 | cache lockdown | — | 1 门 / 1 次 | 机械草稿的「锁定」过短 |
| CARIMA 模型 | CARIMA | — | 1 门 / 1 次 | 语料「传递函数（CARIMA）」；CARIMA = Controlled AutoRegressive Integrated Moving Average |
| 倒立摆小车系统 | Cart-Pole / Inverted Pendulum on a Cart | — | 1 门 / 1 次 | — |
| （不译） | CasADi | — | 1 门 / 1 次 | 工具名。语料「学术（CasADi）」是同位语 |
| 控制流图 | CFG、Control Flow Graph | — | 1 门 / 1 次 | 语料「分析代码的控制流图（CFG）」是同位语 |
| 机会约束 | Chance Constraints | — | 1 门 / 1 次 | — |
| 抖振 | chattering | — | 1 门 / 1 次 | 与 dither（抖振激励）不是一回事，见下 |
| 抗饱和补偿 | clamping / back-calculation | — | 1 门 / 1 次 | 英文列的 `/` 会被拆成 `clamping` 与 `backcalculation` 两个键——这里正好替 §4-9 的 back-calculation 冲突签字（§5-4） |
| 控制李雅普诺夫函数 | CLF、Control Lyapunov Function | — | 1 门 / 1 次 | 语料「函数（CLF）」是截断 |
| 蛛网图 | cobweb | — | 1 门 / 1 次 | — |
| 重心法 | COG、Centroid、Center of Gravity | 开环下重心法 | 1 门 / 2 次 | 两条机械草稿行（`开环下重心法 \| COG`、`重心法 \| COG / Centroid`）合并 |
| 开环法 | Cohen-Coon | — | 1 门 / 1 次 | 整定法，人名 |
| 参考整形 | command shaping | — | 1 门 / 1 次 | — |
| 校正网络 | compensator | — | 1 门 / 1 次 | — |
| 一致性 | Consensus | — | 1 门 / 1 次 | 多智能体一致性 |
| 结论部 | consequent | — | 1 门 / 1 次 | 模糊规则的后件 |
| 约束裁剪 | Constraint Shedding | — | 1 门 / 1 次 | — |
| 延拓 | continuation | — | 1 门 / 1 次 | 数值延拓法 |
| 控制障碍函数 | Control Barrier Functions | — | 1 门 / 1 次 | — |
| 控制时域 | control horizon | — | 1 门 / 1 次 | — |
| 完全状态可控 | controllable | — | 1 门 / 1 次 | — |
| 可控标准型 | controllable canonical form | — | 1 门 / 1 次 | — |
| 控制加权 | control weighting | — | 1 门 / 1 次 | — |
| 信息物理系统 | CPS、Cyber-Physical System | — | 1 门 / 1 次 | — |
| 中央处理器 | CPU | — | 1 门 / 1 次 | 语料「控制器（CPU）」是同位语；CPU 不是控制器的译名 |
| 连续搅拌釜反应器 | CSTR | 连续搅拌反应釜 | 2 门 / 2 次 | C2 LQR 验收补登记：classic/system-modeling 与 mpc/mpc-case-study 为同一对象的译名变体，保留既有正文；标准译名沿用本行 |
| 确认等价 | certainty equivalence | — | 1 门 / 2 次 | — |
| 被控变量 | CV、Controlled Variable | — | 1 门 / 2 次 | — |
| 信息安全 | Cybersecurity | — | 1 门 / 1 次 | — |
| 数模转换器 | DAC、Digital-to-Analog Converter | — | 1 门 / 1 次 | — |
| 分布式时钟 | DC、Distributed Clock | — | 1 门 / 1 次 | EtherCAT 语境；与直流（direct current）同缩写，本语料只出现前者 |
| 可检测性 | Detectability、detectability | — | 2 门 / 2 次 | — |
| 解模糊化 | defuzzification | — | 1 门 / 1 次 | — |
| 微分先行 | Derivative on Measurement | — | 1 门 / 1 次 | — |
| 离散傅里叶变换 | DFT | — | 1 门 / 1 次 | — |
| 数字输入 | DI、Digital Input | — | 1 门 / 1 次 | — |
| 数字输入输出 | DI/DO | — | 1 门 / 1 次 | 语料「逻辑控制为主（DI/DO）」是同位语 |
| 直接数字设计 | Direct Design | — | 1 门 / 1 次 | — |
| 分布式MPC | Distributed MPC, DMPC | — | 1 门 / 1 次 | 建议中文侧加空格：「分布式 MPC」 |
| 抖振激励 | dither | — | 1 门 / 1 次 | 语料「少量的量化噪声（dither）」。与 chattering（抖振）同中文前缀但不同物，故译名加「激励」二字区分 |
| 数字输出 | DO、Digital Output | — | 1 门 / 1 次 | — |
| 双缓冲 | Double Buffering | — | 1 门 / 1 次 | — |
| 经济MPC | Economic MPC | — | 1 门 / 1 次 | 建议中文侧加空格：「经济 MPC」 |
| 等效控制 | equivalent control | — | 1 门 / 1 次 | — |
| （不译） | EtherCAT | — | 1 门 / 1 次 | 总线名。语料「个伺服电机（EtherCAT）」是同位语截断 |
| 扩展卡尔曼滤波 | EKF、Extended Kalman Filter | — | 1 门 / 2 次 | — |
| 仿真法 | Emulation | — | 1 门 / 2 次 | `discrete-sampled/discretization-methods:14/849` 明确用 Emulation 指「用连续仿真近似离散」，配对成立 |
| 功能块图 | FBD、Function Block Diagram | — | 1 门 / 1 次 | — |
| 可行性恢复 | Feasibility Recovery | — | 1 门 / 1 次 | — |
| 反馈线性化 | feedback linearization | — | 1 门 / 1 次 | — |
| 菲利波夫解 | Filippov | — | 1 门 / 1 次 | 语料「滑模（Filippov）」是同位语；Filippov 是人名 |
| 周期倍化 | flip、period doubling | — | 1 门 / 3 次 | `nonlinear/phase-plane:1791/1846/1860/2115` 一致。但同文件 1740–1741 有个 Python 变量也叫 `flip`（数符号变化次数），同名异物 → §7-11 |
| 磁场定向控制 | FOC、Field-Oriented Control | — | 1 门 / 1 次 | 语料「电流环（FOC）」是同位语 |
| 一阶加纯延迟 | FOPDT、First Order Plus Dead Time | — | 1 门 / 1 次 | 与下一条同义异写，**C2 抓不到**（中文差一字）→ §5-1、§7-12 |
| 一阶加纯滞后 | FOPTD、First Order Plus Time Delay | — | 1 门 / 1 次 | 同上。建议全语料统一为 FOPDT / 一阶加纯延迟 |
| 嵌入式 MPC 代码生成 | FORCES、NVIDIA MPC | — | 1 门 / 1 次 | 语料「代码生成（FORCES, NVIDIA MPC）」；两者都是产品名 |
| 浮点运算单元 | FPU、Floating-Point Unit | — | 1 门 / 1 次 | 语料「没有浮点运算单元（FPU）」含否定词 |
| 先画自由体图 | free-body diagram | — | 1 门 / 1 次 | 语料「先画自由体图（free-body diagram）」含动词；标准译名「自由体图 / 受力图」 |
| 全状态线性化 | full-state linearization | — | 1 门 / 1 次 | — |
| 泛函 | functional | — | 1 门 / 1 次 | — |
| 功能安全 | Functional Safety | — | 1 门 / 1 次 | — |
| 模糊关联矩阵 | fuzzy associative memory, FAMM | — | 1 门 / 1 次 | — |
| 模糊控制 | fuzzy control | — | 1 门 / 1 次 | — |
| 高斯 | Gaussian | — | 1 门 / 1 次 | — |
| 广义被控对象 | generalized plant | — | 1 门 / 1 次 | — |
| 生成函数 | generating function | — | 1 门 / 1 次 | — |
| 增益裕度 | GM、Gain Margin | — | 1 门 / 1 次 | 缩写歧义（GM 亦指广义模型）由 `04-notation.md` 的 ABBREV 表处置 |
| 稳定裕度 | GM/PM | — | 1 门 / 2 次 | 英文列的 `/` 会拆成 `gm` 与 `pm` 两个键 |
| 相位裕度 | PM、Phase Margin | — | 1 门 / 1 次 | 同上 |
| 广义最小方差控制 | GMV、Generalized Minimum Variance, GMV | — | 1 门 / 2 次 | — |
| （不译） | GPS | — | 1 门 / 1 次 | 语料「位置（GPS）」是同位语；标准译名「全球定位系统」，但缩写更常用 |
| （不译） | Gurobi | — | 1 门 / 1 次 | 商业求解器名。语料「商业求解器（Gurobi）」是同位语 |
| 分阶段优化 | Hierarchical Optimization | — | 1 门 / 1 次 | — |
| 同宿 | homoclinic | — | 1 门 / 1 次 | 同宿轨道 |
| 点火与熄灭现象 | ignition、extinction | — | 1 门 / 1 次 | 语料「"跳跃"现象（ignition/extinction）」（`mpc/mpc-case-study:722`） |
| 工业物联网 | IIoT | — | 1 门 / 1 次 | — |
| 虚轴 | imaginary axis | — | 1 门 / 1 次 | — |
| 虚部 | imaginary part | — | 1 门 / 1 次 | — |
| 虚数单位 | imaginary unit | — | 1 门 / 1 次 | — |
| 内模控制 | IMC、Internal Model Control | — | 1 门 / 1 次 | — |
| 内部稳定性 | Internal Stability | — | 1 门 / 1 次 | — |
| 完全鲁棒性 | invariance | — | 1 门 / 1 次 | — |
| 反向响应 | inverse response | — | 1 门 / 1 次 | — |
| 积分二次约束 | IQC、Integral Quadratic Constraint | — | 1 门 / 1 次 | — |
| 中断请求 | IRQ | — | 1 门 / 1 次 | — |
| 积分滑模 | ISM、Integral Sliding Mode | — | 1 门 / 1 次 | — |
| 中断服务程序 | ISR、Interrupt Service Routine | — | 1 门 / 2 次 | — |
| 独立看门狗 | IWDG | — | 1 门 / 1 次 | — |
| 抖动 | jitter | — | 3 门 / 3 次 | — |
| 卡尔曼滤波 | Kalman Filter | — | 1 门 / 1 次 | — |
| 基尔霍夫电流定律 | KCL、Kirchhoff's Current Law | — | 1 门 / 1 次 | 语料「电气（KCL）」是同位语；与 KVL 成对 |
| 克拉索夫斯基方法 | Krasovskii | — | 1 门 / 1 次 | 语料「最后才考虑变量梯度（Krasovskii）」是句法残渣；Krasovskii 是人名 |
| 乘积缩放 | Larsen | — | 1 门 / 3 次 | `intelligent/fuzzy-control-basics:385/388` 明确论证「乘积缩放 = Larsen 蕴含」（区别于 Sugeno 取小），配对成立 |
| 梯形图 | LD、Ladder Diagram | — | 1 门 / 1 次 | — |
| 线性分式变换 | LFT、Linear Fractional Transformation | — | 2 门 / 2 次 | — |
| 下线性分式变换 | lower LFT、lower linear fractional transformation | 下线形分式变换 | 1 门 / 1 次 | 语料写「线**形**」，是「线**性**」的错字 → §7-13 |
| 线性独立约束品性 | LICQ | — | 1 门 / 1 次 | — |
| 提升 | Lifting | — | 1 门 / 1 次 | MPC 的提升技术 |
| 线性矩阵不等式 | LMI、Linear Matrix Inequality | — | 3 门 / 3 次 | — |
| 线性参数变化 | LPV、Linear Parameter-Varying | — | 1 门 / 1 次 | — |
| 线性时不变 | LTI、Linear Time-Invariant | — | 2 门 / 3 次 | — |
| 单周期乘加 | MAC、Multiply-Accumulate | — | 1 门 / 1 次 | — |
| 匹配不确定性 | matched | 匹配 | 2 门 / 2 次 | 与「不匹配（unmatched）」成对；建议正文统一写「匹配不确定性 / 不匹配不确定性」 |
| 匹配条件 | matching conditions | — | 1 门 / 1 次 | — |
| 多自由度 | MDOF | — | 1 门 / 2 次 | — |
| 测量噪声 | measurement noise | — | 1 门 / 1 次 | — |
| 隶属度函数 | membership function, MF | — | 1 门 / 1 次 | — |
| 最小预测时域 | minimum costing horizon | — | 1 门 / 1 次 | — |
| 最小相位 | minimum phase | — | 1 门 / 1 次 | — |
| 混合灵敏度设计 | Mixed Sensitivity Design | — | 1 门 / 1 次 | — |
| 最大隶属度平均法 | MOM | — | — | 见 §2.1（此行仅为避免读者在此处找不到 MOM 而留的指针，**不参与登记**） |
| 模型预测启发控制 | MPHC | — | 1 门 / 1 次 | — |
| 修正罗德里格斯参数 | MRP、Modified Rodrigues Parameters | — | 1 门 / 1 次 | 语料「换成四元数（MRP）」是句法残渣 |
| 平均无故障时间 | MTBF | — | 1 门 / 1 次 | — |
| μ 综合 | musyn、μ-synthesis | — | 1 门 / 1 次 | 语料「综合（musyn）」是截断；`musyn` 是 MATLAB 函数名（`robust/mu-synthesis:222`） |
| 协商 | Negotiation | — | 1 门 / 1 次 | 分布式 MPC 语境 |
| 神经网络进化策略 | NN-ES | — | 1 门 / 1 次 | 语料「进化策略版（NN-ES）」（`intelligent/neural-network-control:474`） |
| 标称性能 | Nominal Performance | — | 1 门 / 1 次 | — |
| 非均匀采样 | non-uniform sampling | — | 1 门 / 1 次 | — |
| 完全状态可观 | observable | — | 1 门 / 1 次 | — |
| 可观标准型 | observable canonical form | — | 1 门 / 1 次 | — |
| 阶数 | order | — | 1 门 / 1 次 | — |
| 过参数化 | overparameterization | — | 1 门 / 1 次 | — |
| 过采样 | oversampling | — | 1 门 / 1 次 | — |
| 参数漂移 | parameter drift | — | 1 门 / 1 次 | — |
| 结构化不确定性 | parametric / structured | — | 1 门 / 1 次 | 英文列的 `/` 会拆成两个键 |
| 参数不确定性 | Parametric Uncertainty | — | 1 门 / 1 次 | — |
| 比例微分控制 | PD、Proportional-Derivative | — | 1 门 / 1 次 | 语料「保证动态品质（PD）」是句法残渣 |
| 分段仿射 | Piecewise Affine, PWA | — | 1 门 / 1 次 | — |
| 车辆编队 | platooning | — | 1 门 / 1 次 | 语料「N辆车编队（platooning）」含变量名 |
| 零极点图 | pole-zero map | — | 1 门 / 1 次 | — |
| 波波夫-别列维奇-豪塔斯判据 | Popov-Belevitch-Hautus、PBH | — | 1 门 / 1 次 | 语料「判据（Popov-Belevitch-Hautus）」是截断；正文可用「PBH 判据」 |
| 伪随机二进制序列 | PRBS | — | 1 门 / 1 次 | — |
| 最大预测时域 | prediction horizon | — | 1 门 / 1 次 | 与 control horizon（控制时域）成对 |
| 过程噪声 | process noise | — | 1 门 / 1 次 | — |
| 比例先行 | Proportional on Measurement | — | 1 门 / 1 次 | — |
| 纯反馈系统 | pure-feedback system | — | 1 门 / 1 次 | — |
| 四分之一车模型 | quarter-car model | — | 1 门 / 1 次 | — |
| 准滑动模态 | quasi-sliding mode | — | 1 门 / 1 次 | — |
| 随机游走 | random walk | — | 1 门 / 1 次 | — |
| 到达阶段 | reaching phase | — | 1 门 / 1 次 | — |
| 实轴 | real axis | — | 1 门 / 1 次 | — |
| 实部 | real part | — | 1 门 / 1 次 | — |
| 吸引域 | region of attraction | — | 1 门 / 1 次 | — |
| 回归量 | regressor | — | 1 门 / 1 次 | — |
| 调节器 | regulator | — | 1 门 / 1 次 | — |
| 继电器反馈整定 | relay feedback autotuning | — | 1 门 / 1 次 | — |
| 相对增益矩阵 | Relative Gain Array, RGA、RGA | — | 1 门 / 2 次 | — |
| 返回差 | Return Difference | — | 1 门 / 1 次 | — |
| 回差等式 | Return Difference Equality | — | 1 门 / 1 次 | — |
| 无轮辐轮 | rimless wheel | — | 1 门 / 1 次 | — |
| 强化学习 | RL、Reinforcement Learning | — | 1 门 / 1 次 | 语料「可用强化学习（RL）」含助动词 |
| 鲁棒控制 | Robust Control | — | 1 门 / 1 次 | — |
| 鲁棒性能 | Robust Performance | — | 2 门 / 2 次 | — |
| 鲁棒性 | Robustness | — | 1 门 / 1 次 | — |
| 根轨迹法 | Root Locus | — | 1 门 / 1 次 | — |
| 鲁道夫·卡尔曼 | Rudolf Kalman | — | 1 门 / 1 次 | 人名 |
| 实时操作系统 | RTOS | — | 1 门 / 2 次 | — |
| 鞍-结 | saddle-node | — | 1 门 / 1 次 | 与「鞍结分岔」写法不一致（中间有无连字符），建议统一为「鞍结」 |
| 鞍结分岔 | saddle-node bifurcation | — | 1 门 / 1 次 | — |
| 采样方法 | Scenario Approach | — | 1 门 / 1 次 | 与「场景优化理论」是同一理论的两种叫法，建议统一为「场景法 / 场景优化」 |
| 场景优化理论 | Scenario Optimization | — | 1 门 / 1 次 | — |
| 调度算法 | scheduling algorithm | — | 1 门 / 1 次 | **补登记**。语料「调度算法（Liu & Layland, 1973）」里的英文是引文不是译名；引文本身已在 §3 签字（含逗号的串只能签在 §3，§5-5） |
| 半严格反馈 | semi-strict feedback | — | 1 门 / 1 次 | — |
| 序列二次规划 | SQP、Sequential Quadratic Programming, SQP | — | 2 门 / 2 次 | — |
| 矩阵求逆引理 | Sherman-Morrison | — | 1 门 / 1 次 | — |
| 国际单位制 | SI | — | 1 门 / 1 次 | — |
| 安全完整性等级 | SIL | — | 1 门 / 1 次 | — |
| 单输入单输出 | SISO | — | 1 门 / 1 次 | — |
| 定位与建图 | SLAM | — | 1 门 / 1 次 | — |
| 滑动模态 | sliding mode dynamics | — | 1 门 / 1 次 | — |
| 滑动阶段 | sliding phase | — | 1 门 / 1 次 | 与 reaching phase（到达阶段）成对 |
| 滑模控制 | Sliding Mode Control, SMC | — | 1 门 / 1 次 | — |
| 信噪比 | SNR | — | 1 门 / 1 次 | — |
| 平方和规划 | SOS、Sum of Squares | — | 1 门 / 1 次 | 语料「数值方法（SOS）」是同位语 |
| （不译） | SPICE | — | 1 门 / 1 次 | 电路仿真工具名 |
| 结构化文本 | ST、Structured Text | — | 1 门 / 1 次 | — |
| 可稳定性 | Stabilizability | — | 1 门 / 1 次 | — |
| 镇定函数 | stabilizing function | — | 1 门 / 1 次 | 反步法用语 |
| 阶段代价 | stage cost | — | 1 门 / 1 次 | 与 terminal cost（终端代价）成对 |
| 标准形式 | standard form | — | 1 门 / 1 次 | — |
| 状态转移矩阵 | state transition matrix | — | 1 门 / 1 次 | — |
| 严格反馈系统 | strict-feedback system | — | 1 门 / 1 次 | — |
| 同步截面 | stroboscopic section | — | 1 门 / 1 次 | — |
| 结构化奇异值 | Structured Singular Value | — | 1 门 / 1 次 | 即 μ，见 `04-notation.md` 的 μ 条 |
| 系统辨识 | system identification | — | 1 门 / 1 次 | — |
| 三取二表决 | TMR | — | 1 门 / 4 次 | 标准译名是「三模冗余（TMR）」。语料 4 处一致写「三取二表决」（`implementation/computer-control-architecture:319/462/473/500`），是在解释表决机制而非给 TMR 的译名 → §7-14 |
| 紧耦合存储器 | TCM | — | 1 门 / 1 次 | — |
| 终端代价 | terminal cost | — | 1 门 / 1 次 | — |
| 时滞 | time delay | — | 1 门 / 1 次 | — |
| 两点边值问题 | TPBVP | — | 1 门 / 1 次 | — |
| 梯形 | trapezoidal | — | 1 门 / 1 次 | 隶属度函数形状 |
| 三角形 | triangular | — | 1 门 / 1 次 | 隶属度函数形状 |
| 时间敏感网络 | TSN | — | 1 门 / 1 次 | — |
| 整定函数 | tuning function | — | 1 门 / 1 次 | 语料「自适应（tuning function）」是同位语；反步法用语 |
| 无迹卡尔曼滤波 | UKF、Unscented Kalman Filter | — | 1 门 / 2 次 | 与 EKF（扩展卡尔曼滤波）成对 |
| 不确定性 | uncertainty | — | 1 门 / 1 次 | — |
| 一致性条件 | uniformity | — | 1 门 / 1 次 | — |
| 不匹配 | unmatched | — | 1 门 / 1 次 | 建议写全「不匹配不确定性」 |
| 未建模动态 | Unmodeled Dynamics | — | 1 门 / 1 次 | — |
| 非簧载质量 | unsprung mass | — | 1 门 / 1 次 | 语料「轮胎刚度和非簧载质量（unsprung mass）」是并列同位语 |
| 非结构化不确定性 | unstructured | — | 1 门 / 1 次 | — |
| 上线性分式变换 | upper LFT | 上线形分式变换 | 1 门 / 1 次 | 「线形」是「线性」的错字 → §7-13 |
| 领头车 | vehicle 0 | — | 1 门 / 1 次 | `mpc/distributed-mpc:63` 编队编号约定，配对成立 |
| 看门狗定时器 | Watchdog Timer、WDT | 看门狗 | 1 门 / 2 次 | 两条机械草稿行合并；C2 抓不到（中文差三字）→ §5-2 |
| 窗口看门狗 | WWDG | — | 1 门 / 1 次 | 与 IWDG（独立看门狗）成对 |
| 最坏情况执行时间 | Worst-Case Execution Time, WCET | — | 1 门 / 1 次 | — |
| 加权函数 | weighting functions | — | 1 门 / 1 次 | H∞ 设计用语 |
| 圆判据 | circle criterion | — | 1 门 / 1 次 | 机械草稿的 `圆判据 \| Lyapunov` 来自 RE_SLASH 的「或」误判（§6）：原文是「圆判据/Lyapunov 法」二选一，Lyapunov 不是圆判据的英文 |
| 零动态 | zero dynamics | — | 1 门 / 1 次 | — |
| 自适应增益 | adaptation gains | — | 1 门 / 1 次 | — |
| 自适应控制 | adaptive control | — | 1 门 / 1 次 | — |
| 仿射非线性系统 | affine system | — | 1 门 / 1 次 | — |

| 微积分 | calculus | — | MATH-01 首次登记 | 数学入门；单位不是英文别名 |
| 极限 | limit | — | MATH-01 首次登记 | 数学入门；单位不是英文别名 |
| 差商 | difference quotient | — | MATH-01 首次登记 | 数学入门；单位不是英文别名 |
| 导数 | derivative | — | MATH-01 首次登记 | 数学入门；单位不是英文别名 |
| 局部线性近似 | local linear approximation | — | MATH-01 首次登记 | 数学入门；单位不是英文别名 |
| 链式法则 | chain rule | — | MATH-01 首次登记 | 数学入门；单位不是英文别名 |
| 定积分 | definite integral | — | MATH-01 首次登记 | 数学入门；单位不是英文别名 |
| 原函数 | antiderivative | — | MATH-01 首次登记 | 数学入门；单位不是英文别名 |
| 不定积分 | indefinite integral | — | MATH-01 首次登记 | 数学入门；单位不是英文别名 |
| 微积分基本定理 | fundamental theorem of calculus | — | MATH-01 首次登记 | 数学入门；单位不是英文别名 |
| 牛顿—莱布尼茨公式 | Newton–Leibniz formula | — | MATH-01 首次登记 | 数学入门；单位不是英文别名 |
| 右端矩形和 | right Riemann sum | — | MATH-01 首次登记 | 数学入门；单位不是英文别名 |
| 无穷级数 | infinite series | — | MATH-02及前课修订登记 | 首现定义；适用条件见正文 |
| 部分和 | partial sum | — | MATH-02及前课修订登记 | 首现定义；适用条件见正文 |
| 绝对收敛 | absolute convergence | — | MATH-02及前课修订登记 | 首现定义；适用条件见正文 |
| 泰勒展开 | Taylor expansion | — | MATH-02及前课修订登记 | 首现定义；适用条件见正文 |
| 麦克劳林展开 | Maclaurin expansion | — | MATH-02及前课修订登记 | 首现定义；适用条件见正文 |
| 余项 | remainder | — | MATH-02及前课修订登记 | 首现定义；适用条件见正文 |
| 阶乘 | factorial | — | MATH-02及前课修订登记 | 首现定义；适用条件见正文 |
| 主辐角 | principal argument | — | MATH-02及前课修订登记 | 首现定义；适用条件见正文 |
| 模 | modulus | — | MATH-02及前课修订登记 | 首现定义；适用条件见正文 |
| 复数 | complex number | — | MATH-02及前课修订登记 | 首现定义；适用条件见正文 |
| 复平面 | complex plane | — | MATH-02及前课修订登记 | 首现定义；适用条件见正文 |
| 共轭复数 | complex conjugate | — | MATH-02及前课修订登记 | 首现定义；适用条件见正文 |
| 欧拉公式 | Euler formula | — | MATH-02及前课修订登记 | 首现定义；适用条件见正文 |
| 特征值 | eigenvalue | — | MATH-04新增定义 | 对应非零特征向量的倍率 |
| 特征向量 | eigenvector | — | MATH-04新增定义 | 不含零向量 |
| 特征空间 | eigenspace | — | MATH-04新增定义 | 包含零向量的齐次解空间 |
| 对角化 | diagonalization | — | MATH-04新增定义 | 写清所选数域 |
| 代数重数 | algebraic multiplicity | — | MATH-04新增定义 | 特征多项式根的重复次数 |
| 几何重数 | geometric multiplicity | — | MATH-04新增定义 | 特征空间维数 |
| 模态 | mode | — | MATH-04新增定义 | 本课指独立特征方向的演化项，不与滑动模态混用 |
| 正交投影 | orthogonal projection | — | MATH-05定义 | 剩余与投影空间正交 |
| 正交矩阵 | orthogonal matrix | — | MATH-05定义 | 实方阵；矩形的列正交不等于方阵正交 |
| LU分解 | LU decomposition | — | MATH-05定义 | 写清置换约定 |
| 置换矩阵 | permutation matrix | — | MATH-05定义 | 记录行交换 |
| QR分解 | QR decomposition | — | MATH-05定义 | 区分简约与完整形式 |
| Gram–Schmidt正交化 | Gram-Schmidt orthogonalization | — | MATH-05定义 | 减投影再归一化 |
| 残差 | residual | — | MATH-05定义 | 本课r=b−Ax |
| 最小二乘 | least squares | — | MATH-05定义 | 本课同权残差平方和 |
| 正规方程 | normal equations | — | MATH-05定义 | 推导条件不等于默认求解建议 |
| 对称正定矩阵 | symmetric positive definite matrix | — | MATH-05定义 | 非零向量二次型严格正 |
| 正半定 | positive semidefinite | 半正定 | MATH-05定义 | 允许非零向量二次型为零 |
| Cholesky分解 | Cholesky decomposition | — | MATH-05定义 | 本课要求实对称正定 |
| 奇异值分解 | singular value decomposition、SVD | — | MATH-05定义 | 任意实矩阵，含矩形与秩亏 |
| 奇异值 | singular value | — | MATH-05定义 | 非负，不与特征值混同 |
| Moore–Penrose伪逆 | Moore-Penrose pseudoinverse | 伪逆 | MATH-05定义 | 最小范数最小二乘选择 |
| 最小范数最小二乘解 | minimum-norm least-squares solution | — | MATH-05定义 | 在最优残差解中再选最小范数 |
| 二范数条件数 | 2-norm condition number | — | MATH-05定义 | 本课满列秩时σmax/σmin |
| 截断SVD | truncated SVD | — | MATH-05定义 | 本课严格σ>τ才保留 |
| 等高线 | contour line | — | MATH-06定义 | 高度相同的点形成的曲线 |
| 偏导数 | partial derivative | — | MATH-06定义 | 固定其它坐标，不是置零 |
| 可微性 | differentiability | — | MATH-06定义 | 统一线性近似及相对位移余项 |
| 全微分 | total differential | — | MATH-06定义 | 一阶线性部分，不等于有限真实变化 |
| 梯度 | gradient | — | MATH-06定义 | 本课按列向量约定 |
| 方向导数 | directional derivative | — | MATH-06定义 | 本课按单位方向、可微前提使用梯度公式 |
| 雅可比矩阵 | Jacobian matrix、Jacobian | — | MATH-06定义 | 行对应输出，列对应输入 |
| Hessian矩阵 | Hessian matrix、Hessian | 海森矩阵 | MATH-06定义 | 本课记H_h，不与其它H混用 |
| 混合偏导 | mixed partial derivative | — | MATH-06定义 | 交换顺序需条件 |
| 驻点 | stationary point | — | MATH-06定义 | 梯度为零，不保证极值 |
| 鞍点 | saddle point | — | MATH-06定义 | 相邻方向有升有降 |
| 二重积分 | double integral | — | MATH-06定义 | 高度或密度乘小面积再求和 |
| 微分方程 | differential equation | — | MATH-07定义 | 未知函数与导数的关系 |
| 常微分方程 | ordinary differential equation、ODE | — | MATH-07定义 | 单一自变量，未知函数可多个 |
| 初值问题 | initial value problem、IVP | — | MATH-07定义 | 方程与指定时刻的函数值 |
| 积分因子 | integrating factor | — | MATH-07定义 | 乘积求导转换，本课标量e^{at} |
| 矩阵指数 | matrix exponential | — | MATH-07定义 | 按矩阵乘幂的无穷级数，非逐元素 |
| 幂零矩阵 | nilpotent matrix | — | MATH-07定义 | 某次正整数幂为零 |
| 常数变易公式 | variation of constants formula | — | MATH-07定义 | 初值传播加输入积分 |
| 局部Lipschitz | locally Lipschitz | — | MATH-07定义 | 邻域内变化率差由状态差线性控制 |
| 齐次线性方程 | homogeneous linear equation | — | MATH-07定义 | 无外部输入项 |
| 非齐次线性方程 | inhomogeneous linear equation | — | MATH-07定义 | 带给定外部输入项 |
| 单边拉普拉斯变换 | unilateral Laplace transform、Laplace transform | 拉普拉斯变换 | MATH-08定义 | 从非负时间的加权积分定义 |
| 逆拉普拉斯变换 | inverse Laplace transform | — | MATH-08定义 | 本课由表和部分分式还原 |
| 收敛域 | region of convergence、ROC | — | MATH-08定义 | 本课采用绝对收敛范围 |
| 指数阶 | exponential order | — | MATH-08定义 | 最终由有限常数乘指数控制 |
| 分段连续 | piecewise continuous | — | MATH-08定义 | 有限段内连续且接缝单侧极限有限 |
| 线性性质 | linearity | — | MATH-08定义 | 共同收敛域内拆分加权积分 |
| 指数移位 | exponential shift | — | MATH-08定义 | 乘e^{-at}对应F(s+a)，非时间延迟 |
| 部分分式分解 | partial fraction decomposition | — | MATH-08定义 | 重根保留各阶分母项 |
| 时间延迟性质 | time-delay property | — | MATH-08定义 | 延迟前为零，变换乘e^{-τs} |
| 卷积 | convolution | — | MATH-08定义 | 本课单边积分0到t |
| 卷积定理 | convolution theorem | — | MATH-08定义 | 绝对收敛交换积分前提 |
| 传递函数 | transfer function | — | MATH-08定义 | 零初值输入输出映射 |
| 极点 | pole | — | MATH-08定义 | 有理式约分后分母的零点 |
| 初值定理 | initial-value theorem | — | MATH-08定义 | 右极限有限的普通函数，沿正实轴s趋无穷 |
| 终值定理 | final-value theorem | — | MATH-08定义 | 先查sF极点充分条件，不只算形式极限 |
<!-- REGISTER-END -->

> **§2 里那行「最大隶属度平均法 \| MOM \| — \| — \| 见 §2.1」是故意的指针行**，
> 「出现课程」列写 `—` 就是标记：它不给任何键签字（MOM 由 §2.1 的行登记）。
> 若将来 `rows glossary --diff` 上线，这类行需要被排除，见 §5-9。

---

## §3 残渣签字表（NOISE）

**准入规则**（§1-8 的操作化）：一个字符串进这张表，当且仅当它**在任何读法下都不是术语**——
即它属于下列六类之一。凡"可能是一个术语"的字符串（哪怕是抽取残渣）一律走 §2 的**补登记**，
不进这张表，因为 NOISE 是全局键控的：一旦签字，将来任何以它为变体的冲突都会被 C2 静默放行。

| 类别 | 例 |
|---|---|
| ① 句法残渣（含动词/助词/介词短语） | 先用递推最小二乘、可考虑增益调度、每步一次迭代 |
| ② 单位 | Hz、dB |
| ③ notebook 标号与其小节标题 | NB1、Notebook 4、实验结果、定量对比 |
| ④ 引文（人名 + 年份） | Bartlett, 1988 |
| ⑤ 产品型号 | TI C2000 DSP、PRO |
| ⑥ 数学函数名 / 列表标号 | tanh、ii |

<!-- NOISE-START -->

| 变体 | 判定 | 依据（课程 / 出处） |
|---|---|---|
| 工业最常 | ① 句法残渣 | 「工业最常用」被截断；`classic/pid-controller` 等 7 门课的 PID 同位语 |
| 直接优化 | ① 句法残渣 | `intelligent/neural-network-control`（PID） |
| 某些指标上 | ① 句法残渣 | `intelligent/neural-network-control`（PID） |
| 不抵消非线性 | ① 句法残渣 | `nonlinear/backstepping`（PID） |
| 含积分 | ① 句法残渣 | `nonlinear/sliding-mode-control`（PID） |
| 理想回路整形 | ① 句法残渣（偏正短语） | `robust/robustness-concept`（Loop Shaping） |
| 滤波器通带内 | ① 句法残渣 | `discrete-sampled/discrete-time-freq`（Hz） |
| 快速 | ① 句法残渣（形容词） | `discrete-sampled/discretization-methods`（Hz） |
| 中速 | ① 句法残渣（形容词） | 同上 |
| 慢速 | ① 句法残渣（形容词） | 同上 |
| 频率 | ——**不在此表**—— | 是真术语，走 §2.1 补登记（`频率 \| frequency`） |
| 输出不能突变 | ① 句法残渣 | `implementation/computer-control-architecture`（bumpless transfer） |
| 可考虑增益调度 | ① 句法残渣 | `classic/pid-controller`（gain scheduling） |
| 验证时间线 | ① 句法残渣 | `implementation/realtime-control`（RMS） |
| 计算快 | ① 句法残渣 | `mpc/nonlinear-mpc`（QP） |
| 每步一次迭代 | ① 句法残渣 | `mpc/nonlinear-mpc`（RTI） |
| 先用递推最小二乘 | ① 句法残渣 | `nonlinear/adaptive-control-basics`（RLS） |
| 并解释持续激励 | ① 句法残渣 | `nonlinear/backstepping`（PE）；讨论日志的指令句漏进正文 → §7-5 |
| 并解释动态面控制 | ① 句法残渣 | `nonlinear/backstepping`（DSC）；同上 |
| 离散化后 | ① 句法残渣 | `implementation/digital-pid`（Tustin） |
| Hz | ② 单位 | 3 门 5 处；单位不是术语，抽取阶段不挡（§1-3） |
| dB | ② 单位 | 2 门 4 处（`classic/compensator-design`、`classic/frequency-domain-analysis`）；同上 |
| ii | ⑥ 罗马数字列表标号 | 语料「条件（ii）」是列举第二项，被当成 2 字母英文抽走 |
| NB1 | ③ notebook 标号 | `intelligent/fuzzy-controller-design` |
| NB2 | ③ notebook 标号 | 同上 |
| NB3 | ③ notebook 标号 | 同上 |
| Notebook 4 | ③ notebook 标号 | `nonlinear/sliding-mode-control` |
| 实验结果 | ③ notebook 小节标题 | `intelligent/fuzzy-controller-design`（NB1/NB2/NB3 三处共用） |
| 定量对比 | ③ notebook 小节标题 | 同上 |
| 无关 | ① 句法残渣（形容词） | `nonlinear/sliding-mode-control`（Notebook 4） |
| 无效 | ① 句法残渣（形容词） | 同上 |
| 所有特征值实部为负 | ① 定义句，非译名 | `nonlinear/lyapunov-stability`（Hurwitz） |
| 所有根位于左半平面 | ① 定义句，非译名 | `nonlinear/sliding-mode-control`（Hurwitz） |
| Bartlett, 1988 | ④ 引文 | `robust/robust-stability`；语料「定理（Bartlett, 1988）」。含逗号，**只能**在本表签字（§5-5） |
| Clarke & Mohtadi, 1989 | ④ 引文 | `mpc/generalized-predictive-control`；同上 |
| Liu & Layland, 1973 | ④ 引文 | `implementation/computer-control-architecture`；语料「调度算法（Liu & Layland, 1973）」。此条**不是**任何冲突的变体，签字只是为了让 §3 覆盖全部三类引文 |
| TI C2000 DSP | ⑤ 产品型号 | `implementation/computer-control-architecture` |
| PRO | ⑤ 产品名截断 | `mpc/nonlinear-mpc`；原文 `FORCES PRO（嵌入式）` 被括号截断 |
| tanh | ⑥ 数学函数名 | `nonlinear/sliding-mode-control`；边界层法用 tanh 替代 sign，函数名不是术语 |

<!-- NOISE-END -->

> 表里那行 `频率 | ——不在此表—— | …` 是**给人看的说明**，不是签字：
> `loadGlossaryRegister` 会把第一列原样 nk 进 noise 集合，所以「频率」确实被签了字。
> 但 §2.1 已经登记了 `频率 \| frequency`，C2 的 `known ∪ noise` 两个集合都命中，
> 判定结果相同。**已知这是一处不干净**：将来若要 NOISE 表严格只含残渣，
> 需要把这行删掉——删掉后 C2 仍会 PASS（§2.1 已签字），C2b 也不会 WARN（语料仍有「频率」）。
> 保留它的唯一理由是提醒读者「频率 差一点被误判成残渣」。见 §5-8。

---

## §4 52 条冲突逐条裁决

**读法**：`变体（次数/门数）` 后面 `→` 是裁决。三种归宿：
**登记**（写进 §2 成为标准译名或别名）· **补登记**（是真术语但配对错了，在 §2.1 独立成行）·
**残渣**（进 §3 签字）。

`复现`：`node scripts/glossary.mjs conflicts` 打印下面全部 52 条的原始证据（含各变体出自哪些课）。

### §4.1 一英多中（37 条）

**1. `lqr` —— 9 次 / 6 门**
`最优控制(4/4门)` → **补登记**（上位词）· `控制(1)` → **补登记** · `线性二次型调节器(1)` → **登记为标准译名** ·
`线性二次型(1)` → **登记**（另立 LQ 行，见 #50）· `增广系统(1)` → **补登记** · `无限时域(1)` → **补登记**
出处：`modern/kalman-filter`、`modern/lqr-controller`、`modern/optimal-control-basics`、`modern/state-space`、`mpc/generalized-predictive-control`、`mpc/mpc-principle`
裁决：标准译名 **线性二次型调节器（LQR）**。四门课写「最优控制」不算错（LQR 确是最优控制的一种），
但 `mpc/*` 两门课把 LQR 注成「无限时域」「增广系统」是把**性质**当成了**译名** → §7-15。

**2. `pid` —— 8 次 / 7 门**
`滞后(2)` → **补登记**（phase lag，与 PID 无关）· `工业最常(1)`/`直接优化(1)`/`某些指标上(1)`/`不抵消非线性(1)`/`含积分(1)` → **残渣**
`经典控制(1)` → **补登记**
裁决：标准译名 **比例积分微分控制器（PID）**。**7 门课无一给出中文全称**——这是全语料最普遍的缺口，
建议每门课首现处补一次 → §7-16。

**3. `mpc` —— 7 次 / 5 门**
`模型预测控制(4/4门)` → **登记为标准译名** · `有限时域(1)`/`滚动优化(1)`/`无限时域(1)` → **补登记**
裁决：标准译名 **模型预测控制（MPC）**，4 门课一致，无需改动。三个"变体"是 MPC 的性质，不是译名。

**4. `zoh` —— 5 次 / 4 门**
`零阶保持器(2/2门)` → **登记为标准译名** · `零阶保持(1)`/`采样保持器(1)` → **登记为别名** · `模拟(1)` → **补登记**
裁决：标准译名 **零阶保持器**。`discrete-sampled/discrete-time-freq` 一段里「零阶保持」与「采样保持器」混用
—— 严格说采样保持器（S/H）与零阶保持器（ZOH）不是同一器件，建议改为「零阶保持器」→ §7-17。

**5. `loopshaping` —— 5 次 / 4 门**
`环路整形(2/2门)` → **登记为标准译名** · `回路整形法(1)`/`频率整形(1)` → **登记为别名** · `理想回路整形(1)` → **残渣**
裁决：标准译名 **环路整形**。`robust/*` 两门课各写一个 → §7-18。

**6. `hz` —— 5 次 / 3 门**
键 `Hz` → **残渣（单位）** · `滤波器通带内(1)`/`快速(1)`/`中速(1)`/`慢速(1)` → **残渣** · `频率(1)` → **补登记**
裁决：单位不进术语表。抽取阶段挡它需要另立一张单位表，两处维护不划算（§1-3）。

**7. `nlp` —— 5 次 / 3 门**
`非线性规划(4次/3门)` → **登记为标准译名** · `非凸非线性规划(1)` → **登记为别名**
裁决：无需改动。"非凸"是合法限定。

**8. `backcalculation` —— 4 次 / 4 门（全语料最严重的真分歧）**
`反算(1)` → **登记为标准译名** · `回溯法(1)`/`反饱和(1)`/`反算法(1)` → **登记为别名**（待修）
出处：`classic/classic-case-study`「反算」· `classic/compensator-design`「回溯法」·
`classic/pid-controller`「反饱和」· `discrete-sampled/discretization-methods`「反算法」
裁决：标准译名 **反算（back-calculation）**。**4 门课 4 个译名**，且「反饱和」与 anti-windup 的常见译法撞车
（本表把 anti-windup 定为「抗积分饱和」，勉强错开）→ §7-2，优先级最高。

**9. `bumplesstransfer` —— 4 次 / 4 门**
`无扰动切换(3/3门)` → **登记为标准译名** · `输出不能突变(1)` → **残渣**
裁决：无需改动。

**10. `db` —— 4 次 / 2 门**
键 `dB` → **残渣（单位）** · `增益(2)`/`幅值(2)` → **补登记**
裁决：同 #6。注意 `classic/compensator-design` 写「增益（dB）」、`classic/frequency-domain-analysis` 写「幅值（dB）」，
两门课都没错（dB 既可以量增益也可以量幅值），错的是把单位写在译名位置 → §7-19。

**11. `gainscheduling` —— 4 次 / 3 门**
`增益调度(3/3门)` → **登记为标准译名** · `可考虑增益调度(1)` → **残渣**
裁决：无需改动。

**12. `kvl` —— 4 次 / 2 门**
`基尔霍夫电压定律(1)` → **登记为标准译名** · `电枢回路(1)`/`电气侧(1)`/`电感支路(1)` → **补登记**
裁决：`classic/system-modeling` 与 `modern/state-space` 各自在讲电路方程时把 KVL 注给了当时讨论的那个支路。
标准译名 **基尔霍夫电压定律（KVL）**，配对建议补进两门课 → §7-20。

**13. `rms` —— 4 次 / 2 门**
`速率单调调度(3次/1门)` → **登记为标准译名** · `验证时间线(1)` → **残渣**
裁决：标准译名 **速率单调调度（RMS，Rate-Monotonic Scheduling）**。
风险：RMS 在工程里更常指均方根（root-mean-square）。本语料 4 处全指调度，暂无冲突，
但 `04-notation.md` 应记一笔 → §7-3。

**14. `gpc` —— 4 次 / 3 门**
`广义预测控制(3/3门)` → **登记为标准译名** · `多项式矩阵(1)` → **补登记**
裁决：无需改动。

**15. `dmc` —— 4 次 / 2 门**
`动态矩阵控制(2/2门)` → **登记为标准译名** · `阶跃响应模型(1)` → **登记为别名** · `阶跃响应(1)` → **补登记**
裁决：无需改动。「阶跃响应模型」确实是 DMC 的别名（DMC 用阶跃响应系数建模）。

**16. `qp` —— 4 次 / 2 门**
`凸二次规划(2次/1门)` → **登记为别名** · `二次规划(1)` → **登记为标准译名** · `计算快(1)` → **残渣**
裁决：标准译名取**二次规划（QP）**——更短、更通用；MPC 语境下强调凸性时写「凸二次规划」。

**17. `rti` —— 4 次 / 2 门**
`实时迭代(3次/2门)` → **登记为标准译名** · `每步一次迭代(1)` → **残渣**
裁决：无需改动。

**18. `mimo` —— 3 次 / 3 门**
`多输入多输出(2/2门)` → **登记为标准译名** · `多变量(1)` → **补登记**
裁决：标准译名 **多输入多输出（MIMO）**。`robust/mixed-sensitivity` 的「多变量」是形容词用法，另立条目。

**19. `tustin` —— 3 次 / 3 门**
`双线性(2/2门)` → **登记为别名** · `离散化后(1)` → **残渣**
裁决：标准译名 **双线性变换（Tustin）**——语料一律只写「双线性」，缺「变换」二字，建议补 → §7-21。

**20. `mv` —— 3 次 / 2 门**
`操纵变量(2次/1门)` → **登记为标准译名** · `最小方差控制(1)` → **补登记**
裁决：MV **只**指操纵变量（Manipulated Variable）。`mpc/generalized-predictive-control:570`
写「最小方差控制 (MV)」是**错的**，最小方差控制的缩写应是 MVC → §7-4，优先级高（同一门课内 MV 两义）。

**21. `rls` —— 3 次 / 2 门**
`递推最小二乘(2/2门)` → **登记为标准译名** · `先用递推最小二乘(1)` → **残渣**
裁决：无需改动。

**22. `pe` —— 3 次 / 2 门**
`持续激励(2/2门)` → **登记为标准译名** · `并解释持续激励(1)` → **残渣**
裁决：无需改动。「并解释……」是讨论日志里的指令句漏进了正文 → §7-5。

**23. `mrac` —— 3 次 / 1 门**
`直接法(2次)` → **补登记** · `模型参考自适应控制(1)` → **登记为标准译名**
裁决：标准译名 **模型参考自适应控制（MRAC）**。`nonlinear/adaptive-control-basics` 用「直接法/间接法」
给自适应控制分类（直接法 = MRAC 一族，间接法 = STR 一族），这是**教学分类标签**，不是译名，
不能把「直接法」当 MRAC 的别名 → §7-22。

**24. `str` —— 3 次 / 1 门**
`间接法(2次)` → **补登记** · `自整定调节器(1)` → **登记为标准译名**
裁决：标准译名 **自整定调节器（STR）**。同 #23。

**25. `windup` —— 2 次 / 2 门**
`累积误差(1)` → **登记为别名** · `积分饱和(1)` → **登记为标准译名**
裁决：标准译名 **积分饱和（integral windup）**，`windup` 单独出现时也译「积分饱和」。
`classic/compensator-design` 的「累积误差」建议改 → §7-23。

**26. `antiwindup` —— 2 次 / 2 门**
`抗积分饱和(1)` → **登记为标准译名** · `抗饱和(1)` → **登记为别名**
裁决：标准译名 **抗积分饱和（anti-windup）**。`nonlinear/nonlinear-characteristics` 的「抗饱和」建议改
（"抗饱和"字面更像 anti-saturation）→ §7-24。

**27. `prewarping` —— 2 次 / 2 门**
`预畸变(1)` → **登记为标准译名** · `预扭曲(1)` → **登记为别名**
裁决：标准译名 **预畸变（pre-warping）**。`discrete-sampled/z-transform-analysis` 的「预扭曲」建议改 → §7-6。

**28. `plc` —— 2 次 / 1 门**
`可编程逻辑控制器(1)` → **登记为标准译名** · `离散制造(1)` → **补登记**
裁决：无需改动。

**29. `dcs` —— 2 次 / 1 门**
`分布式控制系统(1)` → **登记为标准译名** · `连续过程(1)` → **补登记**
裁决：无需改动。

**30. `mom` —— 2 次 / 2 门**
`最大隶属度平均法(1)` → **登记为标准译名** · `最大隶属度法(1)` → **登记为别名**
裁决：标准译名 **最大隶属度平均法（MOM，Mean of Maximum）**——「平均」二字不能省，
否则与「最大隶属度法」字面上无法区分它取的是均值。`intelligent/fuzzy-controller-design:949` 需改 → §7-7。

**31. `backstepping` —— 2 次 / 2 门**
`反向递推(1)` → **登记为别名** · `反步法(1)` → **登记为标准译名**
裁决：标准译名 **反步法（backstepping）**。`mpc/nonlinear-mpc` 的「反向递推」建议改
（"反向递推"与 backward recursion 撞车）→ §7-8。

**32. `dsc` —— 2 次 / 1 门**
`并解释动态面控制(1)` → **残渣** · `动态面控制(1)` → **登记为标准译名**
裁决：无需改动。同 #22，指令句漏进正文 → §7-5。

**33. `hurwitz` —— 2 次 / 2 门**
`所有特征值实部为负(1)`/`所有根位于左半平面(1)` → **残渣（定义句）**
裁决：标准译名 **赫尔维茨（Hurwitz）**。两处原文都是「矩阵 Hurwitz（所有特征值实部为负）」这种
**术语 + 定义**的合法写法，抽取器把定义当成了译名。语料本身无需改动。

**34. `sta` —— 2 次 / 1 门**
`超螺旋算法(1)` → **登记为标准译名** · `边界层(1)` → **补登记**
裁决：标准译名 **超螺旋算法（STA，Super-Twisting Algorithm）**。
「边界层」属 tanh 边界层法（见 #52），不是 STA 的译名，两者在 `nonlinear/sliding-mode-control` 同段并列。

**35. `notebook4` —— 2 次 / 1 门**
键 `Notebook 4` → **残渣（notebook 标号）** · `无关(1)`/`无效(1)` → **残渣**
裁决：`nonlinear/sliding-mode-control` 里「……与 Notebook 4 无关/无效」被抽成了中英对照。语料无需改动。

**36. `robuststability` —— 2 次 / 2 门**
`鲁棒稳定性(1)` → **登记为标准译名** · `鲁棒稳定(1)` → **登记为别名**
裁决：标准译名 **鲁棒稳定性**（名词）。`robust/robustness-concept` 的「鲁棒稳定」建议补「性」字 → §7-25。

### §4.2 一中多英（15 条）

**38. `方程` —— 8 次 / 6 门**
`ARE(6/6门)` → **登记**（代数 Riccati 方程）· `DRE(1)` → **登记**（微分 Riccati 方程）· `DARE(1)` → **登记**（离散代数 Riccati 方程）
键 `方程` → **补登记**（equation）
裁决：三条 Riccati 方程**各自独立成行**，不共用「方程」。这不是译名分歧，是抽取把限定词裁掉了。
语料无需改动，但 `modern/lqr-controller` 同页出现 ARE/DRE/DARE 三个缩写，建议在页首给一张对照表 → §7-26。

**39. `滞后` —— 3 次 / 3 门**
`PID(2/2门)` → **登记**（见 #2）· `hysteresis in frequency(1)` → **登记**（滞环）
键 `滞后` → **补登记**（phase lag、lag）
裁决：**「滞后」只用于相位滞后**；磁滞/频率滞环一律写「滞环」。
`nonlinear/nonlinear-characteristics:934` 写作「滞后（hysteresis in frequency）」，而同文件另有 **13 处**
（342/370/378/393/431/444/452/612/614/649/1524/1565/1701）写「滞环」，1083/1856 用「滞后」指相位滞后
—— **同一文件内两义混用**，934 应改为「频率滞环」→ §7-1，优先级高。

**40. `定理` —— 3 次 / 3 门**
`Nyquist-Shannon(1)` → **登记**（采样定理）· `Clarke & Mohtadi, 1989(1)`/`Bartlett, 1988(1)` → **残渣（引文）**
键 `定理` → **补登记**（theorem）
裁决：无需改动语料。注意两条引文含逗号，**只能**在 §3 签字（§5-5）。

**41. `实验结果` —— 3 次 / 1 门**
`NB1(1)`/`NB2(1)`/`NB3(1)` → **残渣（notebook 标号）** · 键 `实验结果` → **残渣**
裁决：`intelligent/fuzzy-controller-design` 的 notebook 小节标题。语料无需改动。

**42. `滚动优化` —— 3 次 / 2 门**
`Receding Horizon(2/2门)` → **登记** · `MPC(1)` → **登记**（见 #3）
键 `滚动优化` → **登记为标准译名**
裁决：`mpc/receding-horizon:33` 写作「滚动优化（MPC）」——MPC 不是滚动优化的英文，
应改为「滚动优化（Receding Horizon）」→ §7-9。

**43. `持续激励` —— 3 次 / 2 门**
`PE(1)`/`persistent excitation(1)`/`persistent excitation, PE(1)` → 全部**登记**（同一行的英文列 + 别名）
裁决：无需改动。第三个变体是「全称, 缩写」写法，`enKey()` 会把它折成 `pe`，与前两个同键。

**44. `灵敏度函数` —— 2 次 / 2 门**
`Sensitivity(1)`/`Sensitivity Function(1)` → 合并为**一行登记**
裁决：标准英文取全称 **Sensitivity Function**，简称 Sensitivity 作别名。
`classic/frequency-response-design` 用简称、`robust/robustness-concept` 用全称，建议统一为全称 → §7-27。

**45. `补灵敏度函数` —— 2 次 / 2 门**
`Complementary Sensitivity(1)`/`Complementary Sensitivity Function(1)` → 合并为**一行登记**
裁决：同 #44，标准英文 **Complementary Sensitivity Function** → §7-27。

**46. `积分饱和` —— 2 次 / 2 门**
`integral windup(1)`/`windup(1)` → 合并为**一行登记**（见 #25）
裁决：无需改动，两者同物。

**47. `嵌入式` —— 2 次 / 2 门**
`TI C2000 DSP(1)`/`PRO(1)` → **残渣（产品型号）** · 键 `嵌入式` → **补登记**（embedded）
裁决：`FORCES PRO（嵌入式）` 被括号截断成 `PRO`，是抽取器的问题不是语料的问题。
建议正文把产品名与属性分开写（「FORCES PRO 这类嵌入式代码生成工具」）→ §7-28。

**48. `进化策略` —— 2 次 / 1 门**
`Evolution Strategies(1)` → **登记** · `Natural Evolution Strategies, NES(1)` → **登记**（自然进化策略）
键 `进化策略` → **登记为标准译名**
裁决：**这是真分歧，且不能合并**——ES 与 NES 是两个不同算法。
`intelligent/neural-network-control:363` 写作「进化策略（Natural Evolution Strategies, NES）」，
漏了「自然」二字，导致 NES 被注成了 ES 的中文名 → 应改为「自然进化策略（NES）」→ §7-10，优先级高。
（`enKey()` 有意**不**把 `Natural Evolution Strategies, NES` 折进 `Evolution Strategies`：
折叠掉就等于把这条真冲突埋了。见 `unit-probe` 的 D6 断言。）

**49. `控制` —— 2 次 / 1 门**
`Linear Quadratic Gaussian(1)` → **登记**（线性二次高斯控制）· `LQR(1)` → **登记**（见 #1）
键 `控制` → **补登记**（control）
裁决：`modern/kalman-filter` 里「……控制（LQG）」与「……控制（LQR）」并存。
建议正文写全「线性二次高斯控制（LQG）」→ §7-29。

**50. `线性二次型` —— 2 次 / 1 门**
`LQR(1)` → **登记**（见 #1）· `LQ(1)` → **登记**（线性二次型）
键 `线性二次型` → **登记**（#1 的别名 + 独立 LQ 行）
裁决：**LQ ≠ LQR**：LQ 指代价函数的形状（Linear Quadratic），LQR 指用它设计出的调节器。
`modern/optimal-control-basics` 同页两个缩写都出现，建议明确区分 → §7-30。

**51. `无限时域` —— 2 次 / 2 门**
`LQR(1)`/`MPC(1)` → 均已**登记**
键 `无限时域` → **补登记**（Infinite Horizon）
裁决：这不是译名分歧——LQR 是无限时域的，MPC 是有限时域的，两门课各自在讲自己那个的性质。
但 `mpc/receding-horizon` 把「无限时域」注给 MPC 是**反的**（MPC 的卖点恰恰是有限时域 + 滚动优化）
→ 需人工核对原文 → §7-31。

**52. `边界层` —— 2 次 / 1 门**
`STA(1)` → **登记**（见 #34）· `tanh(1)` → **残渣（函数名）**
键 `边界层` → **补登记**（boundary layer）
裁决：标准译名 **边界层（boundary layer）**，指滑模控制里用 tanh 替代 sign 的连续化手段。
语料无需改动。

### §4.3 52 条冲突的三分：8 条分歧 + 9 条缺全称 + 35 条残渣

按修复优先级排序。**这 8 条是 E4 唯一的实质产出**：其余 9 条是全称/简称缺失（语料本身没写错译名，
只是没给英文全称），35 条是同位语残渣（错的是抽取精度，不是语料）。

| 优先 | 冲突 | 现状 | 裁决 | 待修课程 |
|---|---|---|---|---|
| **P0** | #20 `mv` | 同一门课里 MV 既指操纵变量又指最小方差控制 | MV = 操纵变量；最小方差控制用 MVC | `mpc/generalized-predictive-control:570` |
| **P0** | #48 `进化策略` | NES 被注成「进化策略」，与 ES 混同 | NES = 自然进化策略 | `intelligent/neural-network-control:363` |
| **P0** | #39 `滞后` | 同一文件内「滞后」兼指 phase lag 与 hysteresis | 滞后 = phase lag；hysteresis = 滞环 | `nonlinear/nonlinear-characteristics:934` |
| **P1** | #8 `back-calculation` | 4 门课 4 个译名 | 统一为「反算」 | `classic/compensator-design`、`classic/pid-controller`、`discrete-sampled/discretization-methods` |
| **P1** | #42 `滚动优化` | 「滚动优化（MPC）」英文对错 | 滚动优化 = Receding Horizon | `mpc/receding-horizon:33` |
| **P2** | #31 `backstepping` | 反步法 / 反向递推 | 统一为「反步法」 | `mpc/nonlinear-mpc` |
| **P2** | #30 `mom` | 最大隶属度法漏「平均」 | 统一为「最大隶属度平均法」 | `intelligent/fuzzy-controller-design:949` |
| **P2** | #27 `pre-warping` | 预畸变 / 预扭曲 | 统一为「预畸变」 | `discrete-sampled/z-transform-analysis` |

另有 **9 条**不是分歧而是**缺全称/简称全称不一**：#2 PID（7 门课零全称）、#12 KVL、#13 RMS、
#19 Tustin（缺「变换」）、#23 MRAC 与 #24 STR（被写成「直接法/间接法」）、
#36 鲁棒稳定性（缺「性」）、#44 Sensitivity 与 #45 Complementary Sensitivity（简称/全称不一）。
见 §7-16 起。

剩下 **35 条**是同位语残渣：抽取器把括注前面那几个字当成了译名，而它们其实是当时正在讨论的对象
（`……Riccati 方程（ARE）` 里的「方程」、`工业最常用（PID）` 里的「工业最常」）。
这 35 条语料本身没有错，错的是抽取精度——已全部由 §2.1 的补登记行与 §3 的残渣行签字。

35 + 9 + 8 = 52。

---

## §5 门槛盲区（这张表和 C2 都看不见的东西）

E2 的教训：「绿 ≠ 在测量」。下面每一条都是 **C2 判为 PASS 但实际有问题** 的情形。

**1. 中文差一个字就不算冲突。** C2 只比「归一化后完全相同」。
`一阶加纯延迟（FOPDT）` 与 `一阶加纯滞后（FOPTD）` 是同义异写，中文差一字、英文差一字母，
两条都**不构成冲突**，C2 永远绿。同类：`看门狗` 与 `看门狗定时器`。
→ 这类只能靠人工通读，已列入 §7-12。**不要试图给 C2 加模糊匹配**：编辑距离阈值会把
「匹配/不匹配」「滞后/滞环」这种**故意不同**的对儿也判成冲突，噪声会淹掉真信号。

**2. 合并行是人工做的，机器不知道。** `Watchdog Timer` 与 `Watchdog Timer, WDT` 在机械草稿里是两行，
合并成一行后 C2 看不出差别（它只读键的集合，不读行数）。所以"登记表有 N 行"这个数**没有意义**，
有意义的是"键的集合"。

**3. NOISE 是全局键控的。** 一个字符串进了 §3，就等于永久宣布它在**任何**冲突里都是残渣。
今天签字的 38 条真残渣都满足"任何读法下都不是术语"，但**将来加行时必须重新过一遍准入规则**（§3 表头）。
反面例子：`Poincar` 差一点被签进 §3——签了就等于宣布它永远不是术语，
而 C/D 阶段约 85 门课里只要有人写「庞加莱截面（Poincaré）」，那条冲突就会被静默放行。
现在它走 §2.1 补登记，安全。

**4. 英文列的 `/` 与 `、` 等价，都会被拆开。** `clamping / back-calculation` 一格注册两个键。
这在 #9 里正好帮上忙（替 back-calculation 冲突签了字），但也意味着
**在英文列写 `A/B` 表示"或"会误注册两个键**。§2 里凡用 `/` 的地方（`GM/PM`、`AI/AO/DI/DO`、
`Cart-Pole / Inverted Pendulum on a Cart`）都是**有意**让两个键都进表。

**5. 含逗号的英文串只能在 §3 签字，不能在 §2 的英文列。** 这是 `loadGlossaryRegister` 的一处不对称：
REGISTER 的三列会按 `[、,;；/]` 拆，NOISE 的第一列**不拆**。
所以 `Clarke & Mohtadi, 1989` 写进 §2 会被拆成 `Clarke & Mohtadi` 与 `1989` 两个键（都不是原串），
写进 §3 才是原串。
「全称, 缩写」形式（`Model Predictive Control, MPC`）不受影响，因为 `enKey()` 会先把它折成 `mpc`。
**不建议改这个不对称**：拆逗号是为了让「全称, 缩写」写法自动注册两个键，改了会漏。

**6. 非 ASCII 字母会被抽取截断，但归一化会折回来。** `RE_SLASH` 的英文字符类是 `[A-Za-z][A-Za-z \-]{1,30}`，
不含 `é`，所以 `Poincaré` 被抽成 `Poincar`。但 `normEn` 先小写再去掉所有非 `[a-z0-9]`，
`Poincaré` 与 `Poincar` **都**归一到 `poincar`，所以裁决不受影响。
草稿的「英文」列会显示截断后的形状（难看但无害）。

**7. 罗马数字列表标号会被当英文抽走。** 「条件（ii）」里的 `ii` 通过了"≥2 个拉丁字母"的守卫。
今天只有 1 条，已进 §3。若将来 `(i)/(ii)/(iii)` 这类列举变多，需要给 `RE_*_PAREN` 加一条
"纯罗马数字不算"的守卫——**现在不加**，因为一条样本不足以定阈值（同 §1-5 的教训）。

**8. §3 里有一行不是残渣。** `频率 | ——不在此表—— | …` 那行会被 loader 原样 nk 进 noise 集合。
它不改变任何判定（§2.1 已登记 `频率`，`known ∪ noise` 两个集合都命中），但它让
「NOISE 表 39 行」这个数**含一行假条目**（38 条真残渣 + 这一行）。这是有意的取舍：保留它能提醒读者"频率 差一点被误判"。
若要数字干净，删掉那行即可（删后 C2 仍 PASS、C2b 仍不 WARN，已实测推理，未实测运行）。

**9. REGISTER 没有 liveness 检查。** `04-notation.md` 有 C1b（0 命中的符号基 → WARN）、
§3 有 C2b（0 命中的残渣 → WARN），但 **§2 没有 C2c**。
理由：04 的符号登记表与 03 的 NOISE 表是**描述性**的（记录语料里有什么），0 命中说明判据过时了；
而 §2 是**规定性**的（规定应该写什么），0 命中合法地意味着"还没有课程采纳这条建议"。
加了 C2c 会在 E4 交付当天就报出一片假 WARN。→ 代价：§2 里过时的行不会被自动发现，
需要人工在每次大版本后通读一遍（§8）。

**10. §2 的「出现课程」列不参与任何判定。** 它是给人看的证据。
`rows notation --diff` 已为 04 实现了这一列的自动核对，**03 还没有**。
所以本文件里这一列写错了不会有任何门槛报警。生成方式见 §8。

---

## §6 抽取精度实测：为什么这张表不能自动生成

`node scripts/glossary.mjs rows glossary` 产出的机械草稿有 **305 行**，终稿 §2 有 **314 行**。逐行双向对账（脚本测量，非估算）：

| 类别 | 行数 | 处置 |
|---|---|---|
| 「中文标准译名」列**正确** | 234 | 原样进 §2.2 |
| 「中文标准译名」列是**同位语残渣**，但英文键是真术语 | 57 | 人工改判 cells[0]（例：`实时 \| ACADO` → `（不译） \| ACADO`；`方程 \| ARE…` → `代数 Riccati 方程 \| ARE…`） |
| 「中文标准译名」列是残渣，**英文键也不是术语** | 14 | 整行删除，两个串进 §3（`Hz`、`dB`、`ii`、`NB1/2/3`、`Notebook 4`、`Bartlett, 1988`、`Clarke & Mohtadi, 1989`、`Liu & Layland, 1973`、`Lyapunov`、`PRO`、`tanh`、`TI C2000 DSP`） |
| **合计需人工过手** | **71 行 / 305（23%）** | |
| 真**合并**（两条草稿行 → 一行） | 6 组 12 行 | 持续激励（PE / persistent excitation）、积分饱和（windup / integral windup）、灵敏度函数（Sensitivity / Sensitivity Function）、补灵敏度函数（同）、重心法（COG / COG · Centroid）、看门狗定时器（Watchdog Timer / WDT） |
| 手写**补登记**（草稿里没有对应行） | 28 行 | 语料只写了中文没写英文括注、或英文被抽取器判为残渣的条目（见下方清单） |
| §2.2 的**说明行** | 1 行 | `最大隶属度平均法 \| MOM` 指向 §2.1，不参与登记 |

账目闭合：`305 − 14（删除）− 6（合并吸收）+ 1（说明行）+ 28（补登记）= 314`。

28 行补登记的英文键：`Finite Horizon`、`Infinite Horizon`、`phase lag / lag`、`control`、`equation`、
`theorem`、`embedded`、`Optimal Control`、`Classical Control`、`augmented system`、`analog`、
`polynomial matrix`、`armature circuit`、`electrical side`、`inductor branch`、`discrete manufacturing`、
`continuous process`、`direct method`、`indirect method`、`frequency`、`gain`、`magnitude`、
`boundary layer`、`multivariable`、`step response`、`Minimum Variance Control`、`scheduling algorithm`、
`circle criterion`。它们存在的唯一理由是**替 §4 的冲突变体签字**（§5-3：不能进 §3，因为任何一个
将来都可能被某门课当成真术语写进括注）。

**三个抽取分支各自的精度**（`terms` 输出里 `form` 字段区分）：

| 分支 | 正则 | 命中 | 独占命中里的真术语 | 精度 | 去留 |
|---|---|---|---|---|---|
| `中文（English）` | `RE_EN_PAREN` | 主力 | —— | 高 | 保留 |
| `English（中文）` | `RE_ZH_PAREN` | 71 | —— | 高 | 保留 |
| `中文/English` | `RE_SLASH` | 7 条独占 | **0** | **0%** | **仍保留** |

`RE_SLASH` 精度 0% 却保留，是因为它 7 条独占命中全是 `/` 表「或」的误判
（`自适应/tuning function`、`用相平面/Poincaré`、`圆判据/Lyapunov`、`最后才考虑变量梯度/Krasovskii`、
`换成四元数/MRP`、`必须用滑模/Filippov`、`边界层/tanh`），
而 C/D 阶段还要写约 85 门课，`零阶保持器/ZOH` 这种**真**斜杠配对迟早会出现。
删掉它 = 门槛对将来的写法失效（E2：判据依赖被检对象的字面形状 ⇒ 静默少测）。
`unit-probe` 的 E3 钉住这条正向能力。

同一理由也适用于 `RE_ZH_PAREN` 的 `[A-Z]` 首字母限制：放宽成 `[A-Za-z]` 后命中从 71 涨到 86，
多出的 15 处里只有 `dB（分贝）` 1 条是真术语，其余 14 条（`kHz（快速）`、`atm（安全阀）`、
`dec（高频）`、`start（每步从零开始）`…）**93% 是假阳**，还会凭空造出 kHz/dB/start 三条冲突。
`unit-probe` 的 E14 钉住这条。

**结论**：机械草稿能给出「哪些键有冲突」和「每个变体出自哪门课」——这部分是可信的、可复现的。
但**"哪个变体才是标准译名"必须人工判**，因为它要求读懂括注前面那几个字到底是译名还是同位语。
这就是 E4 的产出不写成生成脚本的原因：`rows` 只生成机械列，裁决留在文件里。

---

## §7 移交 C1 / A6 的正文缺陷清单

**E4 不改任何 MDX 正文**（Prompt 硬约束）。下面 31 条是扫描过程中发现的正文问题，
按 E4 的口径只能记录、不能修。每条修复都要按 B8 开 fix-log 并填归因三字段
（本该拦住它的角色 / 拦截缺口 / 清单更新）。

| # | 缺陷 | 位置 | 建议改法 |
|---|---|---|---|
| 1 | 「滞后」兼指 phase lag 与 hysteresis，同文件内两义混用 | `nonlinear/nonlinear-characteristics:934`（同文件另有 13 处写「滞环」） | 改为「频率滞环（hysteresis in frequency）」 |
| 2 | back-calculation 四个译名 | `classic/compensator-design`「回溯法」· `classic/pid-controller`「反饱和」· `discrete-sampled/discretization-methods`「反算法」 | 统一为「反算」 |
| 3 | RMS 缩写与均方根撞车（本语料暂无实害） | `implementation/computer-control-architecture`、`implementation/realtime-control` | 首现处写全「速率单调调度（RMS, Rate-Monotonic Scheduling）」 |
| 4 | MV 同页两义 | `mpc/generalized-predictive-control:570`「最小方差控制 (MV)」 | 改为「最小方差控制（MVC）」 |
| 5 | 讨论日志的指令句漏进正文 | `nonlinear/backstepping`「并解释持续激励」「并解释动态面控制」 | 删掉「并解释」三字 |
| 6 | pre-warping 两个译名 | `discrete-sampled/z-transform-analysis`「预扭曲」 | 改为「预畸变」 |
| 7 | MOM 漏「平均」 | `intelligent/fuzzy-controller-design:949`「最大隶属度法」 | 改为「最大隶属度平均法」（`fuzzy-control-basics:741` 是对的） |
| 8 | backstepping 两个译名 | `mpc/nonlinear-mpc`「反向递推」 | 改为「反步法」 |
| 9 | 「滚动优化（MPC）」英文对错 | `mpc/receding-horizon:33` | 改为「滚动优化（Receding Horizon）」 |
| 10 | NES 被注成「进化策略」，与 ES 混同 | `intelligent/neural-network-control:363` | 改为「自然进化策略（Natural Evolution Strategies, NES）」 |
| 11 | Python 变量 `flip` 与术语「周期倍化（flip）」同名异物 | `nonlinear/phase-plane:1740-1741`（术语在 1791/1846/1860/2115） | 变量改名 `n_flips` 或 `sign_changes` |
| 12 | FOPDT / FOPTD 同义异写 | 见 §2.2 两行 | 统一为 FOPDT /「一阶加纯延迟」 |
| 13 | 「线**形**分式变换」错字（应为「线**性**」） | §2.2 的 下线性分式变换 / 上线性分式变换 两行所指原文 | 改错字 |
| 14 | TMR 译作「三取二表决」 | `implementation/computer-control-architecture:319/462/473/500` | 首现处补「三模冗余（TMR）」，机制解释保留 |
| 15 | LQR 被注成「无限时域」「增广系统」 | `mpc/mpc-principle`、`mpc/generalized-predictive-control` | 性质与译名分开写 |
| 16 | PID 全语料 7 门课零中文全称 | 见 §4-2 的 7 门课 | 每门课首现处补「比例积分微分控制器（PID）」 |
| 17 | 「采样保持器」与「零阶保持器」混用（严格说不是同一器件） | `discrete-sampled/discrete-time-freq` | 改为「零阶保持器」 |
| 18 | Loop Shaping 三个译名 | `robust/h-infinity-basics`「回路整形法」、`robust/robustness-concept`「频率整形」「理想回路整形」 | 统一为「环路整形」 |
| 19 | 把单位写在译名位置 | `classic/compensator-design`「增益（dB）」、`classic/frequency-domain-analysis`「幅值（dB）」 | 改为「增益，单位 dB」或「幅值（dB 表示）」 |
| 20 | KVL 只在 1 门课给过全称 | `modern/state-space`（另有 3 处注给支路名） | 补「基尔霍夫电压定律（KVL）」 |
| 21 | Tustin 缺「变换」二字 | 3 门课均写「双线性」 | 改为「双线性变换（Tustin）」 |
| 22 | 「直接法/间接法」被当成 MRAC/STR 的译名 | `nonlinear/adaptive-control-basics` | 明确写「直接法（MRAC 一类）」，别让括注紧跟缩写 |
| 23 | windup 译作「累积误差」 | `classic/compensator-design` | 改为「积分饱和」 |
| 24 | anti-windup 译作「抗饱和」 | `nonlinear/nonlinear-characteristics` | 改为「抗积分饱和」 |
| 25 | 「鲁棒稳定」缺「性」 | `robust/robustness-concept` | 改为「鲁棒稳定性」 |
| 26 | ARE/DRE/DARE 同页三缩写无对照表 | `modern/lqr-controller` | 页首加一张三行对照表 |
| 27 | Sensitivity / Sensitivity Function 简称全称不一 | `classic/frequency-response-design`、`robust/robustness-concept` | 统一为全称 |
| 28 | 产品名与属性写在同一个括注里，导致抽取截断 | `mpc/nonlinear-mpc`「FORCES PRO（嵌入式）」 | 改为「FORCES PRO 这类嵌入式代码生成工具」 |
| 29 | LQG 无中文全称 | `modern/kalman-filter` | 补「线性二次高斯控制（LQG）」 |
| 30 | LQ 与 LQR 同页未区分 | `modern/optimal-control-basics` | 明确 LQ 指代价函数形状、LQR 指调节器 |
| 31 | 「无限时域」注给 MPC（MPC 的卖点是有限时域） | `mpc/receding-horizon` | 人工核对原文语义后改 |

另有 3 处**非术语**的正文缺陷，扫描时顺带发现，一并移交：
`robust/mixed-sensitivity:366` 正文里出现 `$CL$`（应为 $T$ 或写明"闭环传递函数"）；
`implementation/computer-control-architecture:506` 把 TMR 排成 `\text{MTBF}_{TMR}`（下标位置错）；
数学环境里漏反斜杠的裸函数名 7 处（`max` 5 处、`min` 2 处），由 **C4** 报 WARN，清单跑
`node scripts/glossary.mjs check` 可见。

---

## §8 维护

**重新生成机械列**（改了 MDX 之后）：

```bash
node scripts/glossary.mjs terms       # 逐术语的证据（中英变体 / 课程）
node scripts/glossary.mjs conflicts   # 逐条别名冲突的证据（变体频次 + 各自出自哪门课）
node scripts/glossary.mjs rows glossary   # 打印登记表机械列的 markdown 草稿（只读）
node scripts/glossary.mjs check       # 门槛：未裁决的别名冲突 → 退出码 1
npm run glossary:check                # 同上（package.json 别名）
```

**新增一门课之后的标准流程**：

1. 跑 `npm run glossary:check`。绿 → 结束。
2. 红 → 跑 `node scripts/glossary.mjs conflicts`，找到未裁决的冲突。
3. 对冲突里的**每一个**变体做三选一：
   - 它是标准译名或合法别名 → 写进 §2 对应行的三列之一
   - 它是真术语但配对错了 → §2.1 加一行**补登记**
   - 它在任何读法下都不是术语 → §3 加一行，**必须**写明属于六类中的哪一类
4. 重跑 `npm run glossary:check`，确认 C2 PASS 且 **C2b 不 WARN**
   （C2b WARN 说明 §3 里有条目在本轮语料 0 命中，即残渣判定已过时）。

**加 §3 行之前必须自问**（§5-3）：
> "这个字符串将来有没有可能被某门课**当成术语**写进括注？"
> 只要有这个可能，就走 §2.1 补登记，不要进 §3。

**加 §2 行之前必须自问**：
> "英文列里有没有逗号？" 有 → 它会被拆开，确认拆出来的每一段都是你想要的键；
> 若原串含逗号且必须整体登记（引文、`全称, 缩写` 之外的形式），只能进 §3（§5-5）。

**人工通读的节奏**：§2 没有 liveness 检查（§5-9），所以过时的行不会被自动发现。
建议每完成一个阶段（C、D）通读一遍 §2.1，把已无课程使用的建议行删掉。

**不要做的事**：
- 不要给变体加频次阈值（§1-5：会把整张冲突表滤成 0 条）
- 不要给 C2 加模糊匹配（§5-1：会把故意不同的对儿判成冲突）
- 不要为了"数字好看"删 §2.1 的补登记行（它们是 C2 唯一的签字来源）
- 不要把 `.agent/e4-fixture/{ok,bad}/docs/` 里的玩具登记表复制进本目录
  （夹具的表是**故意**小/故意错的，复制过来等于删掉负向测试）

---

*E4 交付物之一。姊妹文件 `04-notation.md`。生成脚本 `scripts/glossary.mjs`（口径注释在文件头）。*
*本文件的所有数字来自 2026-09-26 对 56 门课的实测；语料变动后按 §8 重新生成。*
