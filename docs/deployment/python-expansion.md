# Python 逐课兼容验收与待处理清单

2026-10-17；当前浏览器兼容清单。起点为DEP04，后续按课程交付合并实跑证据（见原始记录provenance）；MATH-03新增4个、MATH-04新增5个、MATH-05与MATH-06各新增6个、MATH-07、MATH-08与MATH-09各新增7个、MATH-10新增6个、MATH-11与MATH-12各新增7个、MATH-13与MATH-14各新增6个、MATH-15、MATH-16、MATH-17与MATH-18各新增7个实验，CLASSIC-01新增7个实验；各次实跑日期见对应报告。DEP04的自动发布授权仅限其原工作包，后续发布仍需用户逐次同意。本文不代表课程内容签发。

## 结果口径

含 notebook 的 134 课 / 540 个实验 / 839 个单元格全部纳入盘点。133 课全部可运行，1 课混合，0 课全部保留代码；启用 539 个实验，保留 1 个。实际执行 837 个单元格（含异常单元格），生成 261 张 PNG。原始记录中 539 个实验完整执行，发布门槛另将 2 个存在数学字形缺失的实验降级。已知依赖阻塞的实验预判跳过；异常实验在首个错误停止，后续单元格不伪记通过。

“可运行”表示在固定 Pyodide 0.27.7 / control 0.10.2 环境完整运行该实验默认 setup/cells，无 Python 异常且无缺字警告；不是该课程已完成学期重构，也不是对全部理论与数值断言重新签发。数学参考输出与控制库数值断言另在 python-expansion-probes.json 完成 30 项回归（含 6 项不支持验证）。

## 逐课清单

| 课程 | 可运行实验 / 总数 | 成功运行单元格 | 代码展示实验 |
|---|---|---|---|
| math/calculus-basics（微积分入门） | 6/6 | 6 | 无 |
| math/complex-numbers（复数基础） | 3/3 | 3 | 无 |
| classic/transfer-function（传递函数） | 5/5 | 5 | 无 |
| classic/time-domain-analysis（时域分析） | 7/7 | 7 | 无 |
| classic/stability-analysis（系统稳定性） | 8/8 | 8 | 无 |
| classic/frequency-domain-analysis（频域分析） | 9/9 | 9 | 无 |
| classic/root-locus（根轨迹） | 6/6 | 7 | 无 |
| classic/pid-controller（PID控制） | 6/6 | 6 | 无 |
| classic/classic-case-study（经典控制案例） | 6/6 | 6 | 无 |
| modern/state-space（状态空间） | 5/5 | 5 | 无 |
| modern/controllability-observability（可控性与可观性） | 6/6 | 6 | 无 |
| modern/lyapunov-modern（线性系统稳定性） | 5/5 | 11 | 无 |
| modern/state-feedback（状态反馈） | 5/5 | 6 | 无 |
| modern/state-observer（状态观测器） | 5/5 | 5 | 无 |
| modern/optimal-control-basics（最优控制） | 5/5 | 6 | 无 |
| modern/lqr-controller（LQR控制） | 5/5 | 8 | 无 |
| modern/multivariable-systems（多变量系统） | 4/4 | 9 | 无 |
| modern/modern-case-study（现代控制案例） | 6/6 | 11 | 无 |
| nonlinear/nonlinear-characteristics（非线性系统） | 5/5 | 5 | 无 |
| nonlinear/phase-plane（相平面） | 14/14 | 27 | 无 |
| nonlinear/lyapunov-stability（Lyapunov稳定性） | 6/6 | 10 | 无 |
| nonlinear/describing-function（描述函数） | 7/7 | 22 | 无 |
| nonlinear/feedback-linearization（反馈线性化） | 6/6 | 15 | 无 |
| nonlinear/sliding-mode-control（滑模控制） | 6/6 | 18 | 无 |
| nonlinear/backstepping（反步设计） | 7/7 | 27 | 无 |
| nonlinear/adaptive-control-basics（自适应控制） | 10/10 | 39 | 无 |
| discrete-sampled/discrete-time-freq（采样与量化） | 6/6 | 7 | 无 |
| discrete-sampled/z-transform-analysis（Z域系统分析） | 5/5 | 6 | 无 |
| discrete-sampled/discrete-stability-criteria（离散系统稳定性） | 5/5 | 6 | 无 |
| discrete-sampled/discretization-methods（离散化方法） | 4/4 | 5 | 无 |
| discrete-sampled/sampling-period-selection（采样周期） | 3/3 | 4 | 无 |
| implementation/digital-pid（数字PID） | 4/4 | 8 | 无 |
| implementation/realtime-control（实时控制） | 4/4 | 8 | 无 |
| estimation/kalman-filter（卡尔曼滤波） | 3/3 | 6 | 无 |
| robust/robustness-concept（鲁棒性） | 4/4 | 4 | 无 |
| robust/robust-performance（鲁棒性能） | 3/3 | 5 | 无 |
| robust/h-infinity-basics（H∞控制） | 4/4 | 5 | 无 |
| robust/mixed-sensitivity（混合灵敏度） | 3/3 | 5 | 无 |
| robust/mu-synthesis（μ综合） | 3/3 | 6 | 无 |
| robust/robust-case-study（鲁棒控制案例） | 1/2 | 2 | 2 |
| mpc/mpc-principle（预测控制原理） | 2/2 | 3 | 无 |
| mpc/prediction-model（预测模型） | 2/2 | 6 | 无 |
| mpc/receding-horizon（滚动优化） | 3/3 | 6 | 无 |
| mpc/constraint-handling（约束处理） | 3/3 | 6 | 无 |
| mpc/generalized-predictive-control（广义预测控制） | 3/3 | 6 | 无 |
| mpc/nonlinear-mpc（非线性预测控制） | 2/2 | 4 | 无 |
| mpc/mpc-case-study（预测控制案例） | 2/2 | 4 | 无 |
| intelligent/fuzzy-control-basics（模糊控制） | 10/10 | 33 | 无 |
| intelligent/fuzzy-controller-design（模糊控制器） | 6/6 | 14 | 无 |
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
| math/stochastic-processes（随机过程） | 7/7 | 7 | 无 |
| math/convex-optimization（凸优化） | 6/6 | 6 | 无 |
| math/variational-dp（变分法与动态规划） | 6/6 | 6 | 无 |
| math/diff-geometry（微分几何入门） | 7/7 | 7 | 无 |
| math/graph-theory（图论基础） | 7/7 | 7 | 无 |
| math/game-theory-math（博弈论基础） | 7/7 | 7 | 无 |
| math/numerical-methods（数值方法） | 7/7 | 7 | 无 |
| classic/system-modeling（系统建模） | 7/7 | 7 | 无 |
| classic/compensator-design（校正网络） | 6/6 | 6 | 无 |
| classic/frequency-response-design（回路整形） | 6/6 | 6 | 无 |
| classic/design-methods-comparison（设计方法选型） | 3/3 | 3 | 无 |
| nonlinear/passivity-control（无源控制） | 3/3 | 3 | 无 |
| nonlinear/iss-small-gain（输入状态稳定性） | 3/3 | 3 | 无 |
| nonlinear/switched-hybrid-systems（切换与混杂系统） | 4/4 | 4 | 无 |
| nonlinear/bifurcation-chaos（分岔与混沌） | 4/4 | 5 | 无 |
| discrete-sampled/discrete-time-systems（离散时间系统） | 3/3 | 3 | 无 |
| discrete-sampled/difference-equation（差分方程） | 3/3 | 3 | 无 |
| discrete-sampled/sampled-data-systems（采样数据系统） | 2/2 | 4 | 无 |
| discrete-sampled/discrete-optimal-control（离散最优控制） | 2/2 | 4 | 无 |
| discrete-sampled/event-triggered-control（事件触发控制） | 2/2 | 4 | 无 |
| identification/identification-framework（系统辨识框架） | 2/2 | 3 | 无 |
| machine-learning/learning-problem（学习问题与泛化） | 2/2 | 3 | 无 |
| implementation/computer-control-architecture（控制系统架构） | 2/2 | 4 | 无 |
| identification/model-structures（辨识模型） | 2/2 | 4 | 无 |
| estimation/estimation-problem（状态估计框架） | 2/2 | 4 | 无 |
| autonomous-driving/driving-system（自动驾驶系统） | 2/2 | 4 | 无 |
| robot-learning/robot-data（机器人数据） | 3/3 | 3 | 无 |
| multi-agent/multi-agent-overview（多智能体系统） | 2/2 | 4 | 无 |
| machine-learning/supervised-learning（监督学习） | 2/2 | 4 | 无 |
| rl-control/rl-basics（强化学习问题） | 2/2 | 3 | 无 |
| robotics/robot-models（机器人系统） | 2/2 | 3 | 无 |
| embodied/embodied-systems（具身智能系统） | 2/2 | 2 | 无 |
| safety-ftc/safety-overview（控制安全） | 2/2 | 3 | 无 |
| applications/power-electronics（电力电子控制） | 3/3 | 4 | 无 |
| estimation/least-squares-ml（统计估计） | 2/2 | 4 | 无 |
| identification/least-squares-rls（最小二乘辨识） | 3/3 | 4 | 无 |
| machine-learning/neural-networks（神经网络基础） | 2/2 | 4 | 无 |
| implementation/pid-engineering-tuning（PID工程整定） | 2/2 | 4 | 无 |
| robust/uncertainty-modeling（不确定性建模） | 4/4 | 5 | 无 |
| embodied/multimodal-observation（多模态感知） | 2/2 | 2 | 无 |
| robot-learning/imitation-learning（模仿学习） | 4/4 | 4 | 无 |
| rl-control/dynamic-programming（价值函数与贝尔曼方程） | 2/2 | 4 | 无 |
| autonomous-driving/vehicle-dynamics（车辆动力学） | 2/2 | 4 | 无 |
| identification/persistent-excitation（持久激励） | 3/3 | 3 | 无 |
| implementation/controller-discretization-practice（控制器部署） | 3/3 | 6 | 无 |
| machine-learning/autodiff-optimization（自动微分与训练） | 2/2 | 4 | 无 |
| robust/robust-stability（鲁棒稳定性） | 4/4 | 5 | 无 |
| estimation/extended-kalman-filter（扩展卡尔曼滤波） | 2/2 | 4 | 无 |
| implementation/embedded-implementation（嵌入式控制） | 3/3 | 6 | 无 |
| machine-learning/sequence-models（时序模型） | 2/2 | 4 | 无 |
| identification/instrumental-variable（闭环辨识） | 3/3 | 3 | 无 |
| machine-learning/attention-transformers（注意力机制） | 2/2 | 4 | 无 |
| estimation/unscented-kalman-filter（无迹卡尔曼滤波） | 2/2 | 4 | 无 |
| mpc/mpc-stability（递归可行性与稳定性） | 2/2 | 4 | 无 |
| identification/frequency-domain-id（频域辨识） | 3/3 | 3 | 无 |
| implementation/networked-control（网络控制） | 3/3 | 6 | 无 |
| machine-learning/representation-learning（表征学习） | 2/2 | 4 | 无 |
| identification/subspace-id（子空间辨识） | 3/3 | 3 | 无 |
| estimation/particle-filter（粒子滤波） | 3/3 | 6 | 无 |
| implementation/industrial-bus-protocols（工业通信） | 3/3 | 6 | 无 |
| identification/nonlinear-data-driven-id（非线性辨识） | 3/3 | 3 | 无 |
| estimation/sensor-fusion（多传感器融合） | 3/3 | 6 | 无 |
| mpc/explicit-mpc（显式预测控制） | 2/2 | 4 | 无 |
| machine-learning/generative-models（扩散与流匹配） | 2/2 | 4 | 无 |
| implementation/hil-rapid-prototyping（半实物仿真） | 3/3 | 6 | 无 |
| estimation/estimation-case-study（状态估计案例） | 3/3 | 6 | 无 |
| implementation/implementation-case-study（控制实现案例） | 3/3 | 6 | 无 |
| identification/identification-case-study（系统辨识案例） | 3/3 | 3 | 无 |
| machine-learning/learning-evaluation（学习实验评估） | 2/2 | 4 | 无 |
| robust/mu-analysis（结构奇异值） | 3/3 | 5 | 无 |
| mpc/economic-mpc（经济预测控制） | 2/2 | 4 | 无 |
| mpc/mhe-fusion（移动水平估计） | 2/2 | 4 | 无 |
| robust/h-infinity-filter（H∞滤波） | 3/3 | 5 | 无 |
| robust/delay-robust-control（时滞系统控制） | 3/3 | 5 | 无 |

## 待处理实验

每项保留原始代码，并在该实验上方显示具体阻塞原因；同课其他已通过实验继续运行。未配置的依赖不因“import 能成功”而放行。

| ID | 课程 / 实验 | 分类 | 原因 | 后续处置 |
|---|---|---|---|
| PY-001 | robust/robust-case-study#2：实验 2（源码 L455） | RUNTIME | AttributeError: module 'control' has no attribute 'pole' | 随该课 Phase 1–4 分析原代码/库版本差异，当前不修改课程数学内容。 |

Slycot 的合成探测仍确认 hinfsyn/h2syn/mixsyn/状态空间 minreal/MIMO tf→ss 不支持；表中只登记实际课程实验出现的阻塞，不按章节名称推断依赖，也不凭空登记未使用的 Slycot 实验。完整的负例见前次试验及本次 probes JSON。

## 执行与渲染

每课使用新 Worker，各 notebook 有独立变量字典，单元格按源代码顺序执行。原有 Jupyter inline 后端声明在浏览器映射到 Agg/PNG，不改课程源代码或数值算法。同源发布 Noto Sans CJK SC 字体及 SIL OFL 许可，弥补浏览器无法读取操作系统中文字体的问题。运行时资源约 65 MiB，首次按需加载。

lib/python-support.json 是由浏览器记录生成的执行白名单；MDX 编译按课程/实验序号注入策略，未登记默认代码展示。构建检查课程源哈希（LF 规范化）、Worker 哈希、实际执行记录及每页渲染的两种模式数量；改源或 Worker 后须重新实跑。正常 npm run dev 仍接本地 Jupyter。

原始全量输出：python-expansion-local.json（图片仅记 MIME/长度，文本长输出注明截断）；早期中文缺字发现记录：python-expansion-initial-partial.json，明确为未完成初查，不作为放行证据。待办机器表：python-expansion-pending.json。

重跑：node scripts/prepare-python-expansion.mjs；本地静态服务打开 python-expansion.html，点击逐课运行全部课程，下载 JSON 后执行 node scripts/finalize-python-support.mjs <报告路径>、node scripts/write-python-expansion-report.mjs、node scripts/check-python-support.mjs。单课可用 python-expansion.html?lesson=chapter/lesson 运行，再用 finalize-python-support.mjs <单课报告路径> --merge 合并；其余课程源哈希须不变，Worker 变化必须全量重跑。本流程不替代课程写作/重构的讨论 SKILL。

## 验收与发布

逐课浏览器执行完成；页面验收、构建和远端发布结果在交付记录 python-expansion-delivery.md 登记。只有实际通过的实验启用运行。
