# Python 逐课兼容验收与待处理清单

2026-10-17；当前浏览器兼容清单。起点为DEP04，后续按课程交付合并实跑证据（见原始记录provenance）；MATH-03新增4个、MATH-04新增5个、MATH-05与MATH-06各新增6个、MATH-07、MATH-08与MATH-09各新增7个、MATH-10新增6个、MATH-11新增7个实验；各次实跑日期见对应报告。DEP04的自动发布授权仅限其原工作包，后续发布仍需用户逐次同意。本文不代表课程内容签发。

## 结果口径

含 notebook 的 62 课 / 238 个实验 / 411 个单元格全部纳入盘点。41 课全部可运行，12 课混合，9 课全部保留代码；启用 208 个实验，保留 30 个。实际执行 383 个单元格（含异常单元格），生成 144 张 PNG。原始记录中 210 个实验完整执行，发布门槛另将 2 个存在数学字形缺失的实验降级。已知依赖阻塞的实验预判跳过；异常实验在首个错误停止，后续单元格不伪记通过。

“可运行”表示在固定 Pyodide 0.27.7 / control 0.10.2 环境完整运行该实验默认 setup/cells，无 Python 异常且无缺字警告；不是该课程已完成学期重构，也不是对全部理论与数值断言重新签发。数学参考输出与控制库数值断言另在 python-expansion-probes.json 完成 30 项回归（含 6 项不支持验证）。

## 逐课清单

| 课程 | 可运行实验 / 总数 | 成功运行单元格 | 代码展示实验 |
|---|---|---|---|
| math/calculus-basics（微积分入门） | 6/6 | 6 | 无 |
| math/complex-numbers（复数基础） | 3/3 | 3 | 无 |
| classic/transfer-function（传递函数） | 2/2 | 2 | 无 |
| classic/time-domain-analysis（时域分析） | 2/2 | 2 | 无 |
| classic/stability-analysis（系统稳定性） | 4/4 | 4 | 无 |
| classic/frequency-domain-analysis（频域分析） | 3/6 | 3 | 3, 4, 6 |
| classic/root-locus（根轨迹） | 4/4 | 5 | 无 |
| classic/pid-controller（PID控制） | 5/5 | 5 | 无 |
| classic/classic-case-study（经典控制案例） | 6/6 | 6 | 无 |
| modern/state-space（状态空间） | 2/2 | 2 | 无 |
| modern/controllability-observability（可控性与可观性） | 3/3 | 3 | 无 |
| modern/lyapunov-modern（线性系统稳定性） | 3/3 | 8 | 无 |
| modern/state-feedback（状态反馈） | 2/2 | 2 | 无 |
| modern/state-observer（状态观测器） | 2/2 | 2 | 无 |
| modern/optimal-control-basics（最优控制） | 1/1 | 2 | 无 |
| modern/lqr-controller（LQR控制） | 1/1 | 4 | 无 |
| modern/multivariable-systems（多变量系统） | 1/1 | 6 | 无 |
| modern/modern-case-study（现代控制案例） | 3/5 | 6 | 3, 4 |
| nonlinear/nonlinear-characteristics（非线性系统） | 9/9 | 9 | 无 |
| nonlinear/phase-plane（相平面） | 12/12 | 25 | 无 |
| nonlinear/lyapunov-stability（Lyapunov稳定性） | 4/4 | 8 | 无 |
| nonlinear/describing-function（描述函数） | 6/6 | 21 | 无 |
| nonlinear/feedback-linearization（反馈线性化） | 4/4 | 12 | 无 |
| nonlinear/sliding-mode-control（滑模控制） | 5/5 | 17 | 无 |
| nonlinear/backstepping（反步设计） | 6/6 | 26 | 无 |
| nonlinear/adaptive-control-basics（自适应控制） | 9/9 | 38 | 无 |
| discrete-sampled/discrete-time-freq（采样与量化） | 2/3 | 3 | 3 |
| discrete-sampled/z-transform-analysis（Z域系统分析） | 2/3 | 3 | 1 |
| discrete-sampled/discrete-stability-criteria（离散系统稳定性） | 1/3 | 1 | 2, 3 |
| discrete-sampled/discretization-methods（离散化方法） | 1/3 | 1 | 1, 3 |
| discrete-sampled/sampling-period-selection（采样周期） | 0/3 | 0 | 1, 2, 3 |
| implementation/digital-pid（数字PID） | 3/3 | 4 | 无 |
| implementation/realtime-control（实时控制） | 0/1 | 0 | 1 |
| estimation/kalman-filter（卡尔曼滤波） | 1/3 | 2 | 2, 3 |
| robust/robustness-concept（鲁棒性） | 2/3 | 2 | 2 |
| robust/uncertainty-modeling（不确定性建模） | 2/3 | 3 | 3 |
| robust/robust-stability（鲁棒稳定性） | 2/3 | 3 | 2 |
| robust/robust-performance（鲁棒性能） | 2/2 | 4 | 无 |
| robust/h-infinity-basics（H∞控制） | 1/3 | 2 | 2, 3 |
| robust/mixed-sensitivity（混合灵敏度） | 2/2 | 4 | 无 |
| robust/mu-synthesis（μ综合） | 2/2 | 4 | 无 |
| robust/robust-case-study（鲁棒控制案例） | 1/2 | 2 | 2 |
| mpc/mpc-principle（预测控制原理） | 0/1 | 0 | 1 |
| mpc/prediction-model（预测模型） | 0/1 | 0 | 1 |
| mpc/receding-horizon（滚动优化） | 0/1 | 0 | 1 |
| mpc/constraint-handling（约束处理） | 0/1 | 0 | 1 |
| mpc/generalized-predictive-control（广义预测控制） | 0/1 | 0 | 1 |
| mpc/nonlinear-mpc（非线性预测控制） | 0/1 | 0 | 1 |
| mpc/mpc-case-study（预测控制案例） | 0/1 | 0 | 1 |
| intelligent/fuzzy-control-basics（模糊控制） | 9/9 | 32 | 无 |
| intelligent/fuzzy-controller-design（模糊控制器） | 6/6 | 12 | 无 |
| intelligent/neural-network-control（神经网络控制） | 5/5 | 8 | 无 |
| multi-agent/distributed-mpc（分布式预测控制） | 1/1 | 2 | 无 |
| math/linear-algebra-basics（线性代数基础） | 4/4 | 4 | 无 |
| math/eigen-decomposition（特征值与对角化） | 5/5 | 5 | 无 |
| math/matrix-decomposition（矩阵分解） | 6/6 | 6 | 无 |
| math/multivariable-calculus（多元微积分） | 6/6 | 6 | 无 |
| math/ode-matrix-exponential（微分方程与矩阵指数） | 7/7 | 7 | 无 |
| math/laplace-transform（拉普拉斯变换） | 7/7 | 7 | 无 |
| math/fourier-analysis（傅里叶分析） | 7/7 | 7 | 无 |
| math/z-transform（Z变换） | 6/6 | 6 | 无 |
| math/probability-basics（概率基础） | 7/7 | 7 | 无 |

## 待处理实验

每项保留原始代码，并在该实验上方显示具体阻塞原因；同课其他已通过实验继续运行。未配置的依赖不因“import 能成功”而放行。

| ID | 课程 / 实验 | 分类 | 原因 | 后续处置 |
|---|---|---|---|
| PY-001 | classic/frequency-domain-analysis#3：🧪 不同增益下的 Bode 图与稳定裕度（源码 L524） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-002 | classic/frequency-domain-analysis#4：🧪 Nyquist 图上的稳定裕度（源码 L811） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-003 | classic/frequency-domain-analysis#6：🧪 相位裕度与超调量的对应关系（源码 L1154） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-004 | modern/modern-case-study#3：观测器设计与基于观测器的控制（源码 L473） | FONT | 绘图字形未通过验收：ẋ（U+1E8B)；当前字体不能完整显示数学符号，保留代码待字体适配。 | 补齐数学字符字体回退并重新验证布局/PNG；计算虽完成，显示未放行。 |
| PY-005 | modern/modern-case-study#4：卡尔曼滤波与 LQG 控制（源码 L619） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-006 | discrete-sampled/discrete-time-freq#3：实验 3（源码 L418） | RUNTIME | ValueError: Improper transfer function. `num` is longer than `den`. | 随该课 Phase 1–4 分析原代码/库版本差异，当前不修改课程数学内容。 |
| PY-007 | discrete-sampled/z-transform-analysis#1：实验 1（源码 L206） | RUNTIME | ValueError: 'blue-' is not a valid format string (unrecognized character 'l') | 随该课 Phase 1–4 分析原代码/库版本差异，当前不修改课程数学内容。 |
| PY-008 | discrete-sampled/discrete-stability-criteria#2：实验 2（源码 L393） | RUNTIME | ValueError: Time steps `T` must be multiples of sampling time | 随该课 Phase 1–4 分析原代码/库版本差异，当前不修改课程数学内容。 |
| PY-009 | discrete-sampled/discrete-stability-criteria#3：实验 3（源码 L641） | RUNTIME | ValueError: Improper transfer function. `num` is longer than `den`. | 随该课 Phase 1–4 分析原代码/库版本差异，当前不修改课程数学内容。 |
| PY-010 | discrete-sampled/discretization-methods#1：实验 1（源码 L187） | RUNTIME | ValueError: Unknown transformation method 'forward_euler' | 随该课 Phase 1–4 分析原代码/库版本差异，当前不修改课程数学内容。 |
| PY-011 | discrete-sampled/discretization-methods#3：实验 3（源码 L704） | RUNTIME | ValueError: Time steps `T` must match sampling time | 随该课 Phase 1–4 分析原代码/库版本差异，当前不修改课程数学内容。 |
| PY-012 | discrete-sampled/sampling-period-selection#1：实验 1（源码 L64） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-013 | discrete-sampled/sampling-period-selection#2：实验 2（源码 L240） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-014 | discrete-sampled/sampling-period-selection#3：实验 3（源码 L447） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-015 | implementation/realtime-control#1：实验 1（源码 L225） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-016 | estimation/kalman-filter#2： 动手实验：卡尔曼滤波仿真（源码 L357） | FONT | 绘图字形未通过验收：₁（U+2081)、₂（U+2082)；当前字体不能完整显示数学符号，保留代码待字体适配。 | 补齐数学字符字体回退并重新验证布局/PNG；计算虽完成，显示未放行。 |
| PY-017 | estimation/kalman-filter#3： 动手实验：Q/R 对卡尔曼滤波性能的影响（源码 L514） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-018 | robust/robustness-concept#2：实验 2（源码 L166） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-019 | robust/uncertainty-modeling#3：实验 3（源码 L453） | RUNTIME | IndexError: too many indices for array: array is 2-dimensional, but 3 were indexed | 随该课 Phase 1–4 分析原代码/库版本差异，当前不修改课程数学内容。 |
| PY-020 | robust/robust-stability#2：实验 2（源码 L289） | SOLVER | cvxpy 与求解器尚未完成 Pyodide 适配，保留代码供原生 Python 执行。 | 单独验证求解器的 WASM 支持或原生 Python 后端，当前不宣称支持。 |
| PY-021 | robust/h-infinity-basics#2：实验 2（源码 L325） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-022 | robust/h-infinity-basics#3：实验 3（源码 L424） | RUNTIME | SyntaxError: unterminated string literal (detected at line 50) (<unknown>, line 50) | 随该课 Phase 1–4 分析原代码/库版本差异，当前不修改课程数学内容。 |
| PY-023 | robust/robust-case-study#2：实验 2（源码 L455） | RUNTIME | AttributeError: module 'control' has no attribute 'pole' | 随该课 Phase 1–4 分析原代码/库版本差异，当前不修改课程数学内容。 |
| PY-024 | mpc/mpc-principle#1：实验 1（源码 L241） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-025 | mpc/prediction-model#1：实验 1（源码 L279） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-026 | mpc/receding-horizon#1：实验 1（源码 L128） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-027 | mpc/constraint-handling#1：实验 1（源码 L433） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-028 | mpc/generalized-predictive-control#1：实验 1（源码 L794） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-029 | mpc/nonlinear-mpc#1：实验 1（源码 L477） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |
| PY-030 | mpc/mpc-case-study#1：实验 1（源码 L297） | WIDGET | ipywidgets 交互需按课程计划迁移到 React Explorer，当前浏览器执行器不支持。 | 依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。 |

Slycot 的合成探测仍确认 hinfsyn/h2syn/mixsyn/状态空间 minreal/MIMO tf→ss 不支持；表中只登记实际课程实验出现的阻塞，不按章节名称推断依赖，也不凭空登记未使用的 Slycot 实验。完整的负例见前次试验及本次 probes JSON。

## 执行与渲染

每课使用新 Worker，各 notebook 有独立变量字典，单元格按源代码顺序执行。原有 Jupyter inline 后端声明在浏览器映射到 Agg/PNG，不改课程源代码或数值算法。同源发布 Noto Sans CJK SC 字体及 SIL OFL 许可，弥补浏览器无法读取操作系统中文字体的问题。运行时资源约 65 MiB，首次按需加载。

lib/python-support.json 是由浏览器记录生成的执行白名单；MDX 编译按课程/实验序号注入策略，未登记默认代码展示。构建检查课程源哈希（LF 规范化）、Worker 哈希、实际执行记录及每页渲染的两种模式数量；改源或 Worker 后须重新实跑。正常 npm run dev 仍接本地 Jupyter。

原始全量输出：python-expansion-local.json（图片仅记 MIME/长度，文本长输出注明截断）；早期中文缺字发现记录：python-expansion-initial-partial.json，明确为未完成初查，不作为放行证据。待办机器表：python-expansion-pending.json。

重跑：node scripts/prepare-python-expansion.mjs；本地静态服务打开 python-expansion.html，点击逐课运行全部课程，下载 JSON 后执行 node scripts/finalize-python-support.mjs <报告路径>、node scripts/write-python-expansion-report.mjs、node scripts/check-python-support.mjs。单课可用 python-expansion.html?lesson=chapter/lesson 运行，再用 finalize-python-support.mjs <单课报告路径> --merge 合并；其余课程源哈希须不变，Worker 变化必须全量重跑。本流程不替代课程写作/重构的讨论 SKILL。

## 验收与发布

逐课浏览器执行完成；页面验收、构建和远端发布结果在交付记录 python-expansion-delivery.md 登记。只有实际通过的实验启用运行。
