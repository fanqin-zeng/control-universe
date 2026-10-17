# S01 结构迁移清单与来源、依赖审查

日期：2026-10-17。输入为 master `2e8a0f9` 的 catalog、学期3目标表、不可变起点快照及 I03 审计。范围仅审查，不改 catalog、课文、组件、线上路由或历史交付状态；不交付课程。S02/S03实施，S04整体验收。

## 交付清单与结论

- [可再生机器清单](s01-migration-inventory.json)：141来源逐条去向、56正文规范化hash、205课type/level/先修、148旧边逐条处置、30孤立课程、7零边章、迁移旧路径命中位置。
- [逐课审查](s01-dependency-review.md)：205行候选课型/难度/先修。计划仍规定路径、标题及来源，本表不成为线上第二目录。每课Phase 1复核，不能拿候选图代替教学验收。
- `node scripts/check-migration-review.mjs` 从实际文件重算并比对快照；显式 `--write` 仅在检查通过时更新清单。这是S01迁移前证据，S02实施后不可覆盖为新历史；届时本命令的来源原路径断言将失效，应新增迁移后验收而不是把历史清单伪装为实时门槛。

141来源各覆盖一次；138个有来源的目标加67新增=205；3组合并均为“有正文+空条目”或“两空条目”，无两份正文覆盖写入风险。56份正文仍全在原位；54原路径保留，2份需git mv。8个旧路径改变，6为空条目；保留133来源原路径。旧空条目85合并后为82个目标，加67新增=149个新写目标；56个重构目标均未完成本期生产。

正文hash以LF规范化比较git起点与当前文件：55份相同，只有 classic/stability-analysis 的I01两处setupCode闭合反引号发生变化，校验器精确比较这两处替换，额外改动即失败。不可变baseline原hash不改；迁移复制以当前已验收版本为准，不能回滚I01修复。S01未修改任何教学正文。

## 8个旧入口及资产操作

| 旧路径 | 目标 | 操作与去向 |
|---|---|---|
| modern/kalman-filter | estimation/kalman-filter（EST-03） | git mv唯一正文；合并目标空条目；draft沿用；旧入口308 |
| estimation/h-infinity-filter | robust/h-infinity-filter（ROBUST-09） | 移动empty元数据；旧入口308 |
| estimation/mhe-fusion | mpc/mhe-fusion（MPC-10） | 移动empty元数据；融合主题保留于EST-07并在MPC-10衔接 |
| mpc/distributed-mpc | multi-agent/distributed-mpc（MULTI-07） | git mv唯一正文；draft沿用；旧入口308 |
| rl-control/safe-rl | safety-ftc/safe-rl（SAFE-06） | 两empty合并；旧入口308 |
| rl-control/multi-agent-rl | multi-agent/multi-agent-rl（MULTI-08） | 两empty合并；旧入口308 |
| applications/auto-driving-control | autonomous-driving/vehicle-control（DRIVING-05） | empty迁移；保留车辆跟踪任务，旧入口308 |
| applications/robotics-control | robotics/robotics-case-study（ROBOT-10） | empty迁移；旧机器人主题进入综合案例，旧入口308 |

保留现有 `/modern/linear-system-theory` → `/modern/lyapunov-modern` 308，不新增跳转链或环。片段fragment不发送给服务器，单纯308不能修复锚点：纯移动正文先保持DOM ID，W04/W01修订时显式列旧ID兼容；不得承诺URL跳转能自动映射任意旧片段。

## 迁移调用点与执行责任

| 调用面 | 已核对位置 | S02/S03执行及验收 |
|---|---|---|
| 唯一元数据 | content/catalog.ts | S02按目标21章205课导航顺序、逐课课型/难度/先修落地；保留已有subsections/status，149新写保持empty；章节order与数组一致 |
| 正文加载/静态路径/404 | lib/content.ts；app/(wiki)/[chapter]/[lesson]/page.tsx | getLesson按目录读文件；generateStaticParams跟catalog；先迁正文再移条目，禁止吞编译错；已写页200、empty200、未知404、旧路径308 |
| 首页/侧栏/前后课/路径图 | app/(wiki)/page.tsx；components/wiki/sidebar.tsx；lib/lesson-graph.ts；components/wiki/lesson-nav.tsx | 跟catalog派生，无第二手工目录；导航与生产顺序不同，导论豁免6条前向边；检查章首/末和移动页前后导航 |
| 本页目录/数学标题 | components/wiki/table-of-contents.tsx；lib/content.ts | 真实DOM取ID；W04/W01解决源码slug与KaTeX/全级重复标题差异，不能只改计数 |
| 旧入口 | next.config.mjs | S03新增8条直接308，保留既有1条；检查Location与最终200/empty、fragment命中、无重定向环 |
| MDX站内引用 | 机器清单references逐文件/行 | S03处理Kalman及分布式MPC实际链接；区分扩展阅读与硬先修；只改路径的引用不得顺带重写教学内容；跨章相对资源按迁后目录复核 |
| 组件/Notebook | lib/wiki-components.ts；mdx-components.tsx；components/wiki/jupyter-notebook.tsx | 单一注册表不改；MDX组件名/kernel标识随正文保留，移动后跑verify/严格nb；两个孤儿组件另属W02 |
| 旧交付台账/大纲 | .agent/delivery-tracker.md；OUTLINE.md | S03按线上catalog新顺序重排标题/路径，保留29个旧v1.3标记与原验收证据，新增empty不得打勾；大纲只用--fix-outline，统计只用--fix-tracker-stats；学期3课程行仍0完成 |
| 目录验收契约 | scripts/check-catalog.mjs | 4条旧FORWARD_ALLOWLIST逐条重审/移除，不能留下stale条目；MIGRATION_OUT三组并存规则在合并后重审；tracker章名/路径、旧日志映射、旧空课骨架守卫均须继续工作 |
| 页面/nb/术语 | scripts/verify-lesson.mjs；scripts/nb-cells.mjs；scripts/glossary.mjs；scripts/lib-catalog.mjs | 输入跟catalog；移动页与旧路径回归；术语两张机器读表保留历史归属，仅审查活跃引用；nb必须--require-kernel；W04修复锚点后更新共享契约 |
| 历史日志/报告/夹具 | docs/discuss-log/semester-*；.agent/semester-03-baseline.json；I01–I04证据；scripts/fixtures；.agent/e3-fixture | 保留历史原文及hash，不全仓替换；若日志文件名从旧来源解析，S03应支持来源别名以免凭空增加缺档；fixture故意错误与快照不跟线上批量重命名 |

机器清单references覆盖已跟踪content/app/components/lib/scripts/next.config/旧tracker/历史日志中8个完整旧路径的字面量命中；不是语法解析，不声称穷尽动态拼接。上表单独核对按slug拼接的调用。未命中不意味着可删资产；S03须在迁移后再全仓检索旧路径，区分活跃调用与历史证据。

## 依赖审查与边界

205课共464条候选边；全部先修在生产顺序前方，无环/悬空/同章倒置；导航顺序仅导论6条设计前向边。旧148边每条在机器清单标记直接保留、经前置链覆盖或边界调整，调整有独立理由，不靠删真实知识依赖压警告。

BW-033/034的DISCRETE-04/06→DISCRETE-01保留，采样移章首。另有旧边在目标顺序中形成新倒置：DISCRETE-05→06、IMPL-05→06、ID-03→EST-02、ID-09→MPC-02；逐条解释为“离散模型稳定性不依赖其连续离散化来源”“嵌入式基础先于实时调度”“辨识局部引入最小二乘”“辨识案例先验证模型，预测应用后读”。S02落地，逐课Phase 1再核正文是否偷用了未解释工具。

旧4条非导论跨章前向边：EST-04→NONLINEAR-03随章序消除；H∞滤波→H∞控制及MHE→滚动优化随迁章消除；ID-08→INTEL-05改机器学习训练/时序模型先修。四条allowlist旧理由均不再适用，S02移除或按最终图重登记，不能全关守卫。

MODERN-09旧正文对Kalman的要求与新章序不一致已显式登记于逐课审查：本次只确定确定性主线与扩展阅读边界，S03保留链接，课程Phase 1再决定内容迁移。保留日志原文的历史要求不能冒充新目录已满足。


旧148边处置统计：82直接保留、56经先修链覆盖、10边界调整。10项如下，均为候选结构决定，课程Phase 1复核正文边界：

| 旧边映射 | 候选调整理由 |
|---|---|
| EST-03 → MODERN-07 | LQR对偶为扩展；滤波推导由统计估计/可检测性与概率支撑，不要求先设计LQR |
| EST-05 → EST-04 | UKF以sigma点传播替代Jacobian线性化；EKF作为比较阅读，不是算法必需先修 |
| EST-06 → EST-03 | 粒子滤波由概率递推/采样起步，不以线性高斯Kalman为唯一入口 |
| EST-08 → EST-05 | 案例选择EKF融合与粒子滤波基线；UKF扩展比较需Phase1再登记 |
| DISCRETE-05 → DISCRETE-06 | 稳定性判据适用于已给定离散模型，无需先学连续模型离散化；保留Z域/线性稳定性工具，解除目标顺序新倒置 |
| IMPL-05 → IMPL-06 | 嵌入式先学部署和硬件，实时调度下一课引入；实时约束细节不得在本课未经解释先用 |
| ID-03 → EST-02 | 辨识章先于估计章，最小二乘在辨识局部引入；统计估计另讲似然/不确定性，不循环依赖 |
| ID-03 → NONLINEAR-08 | RLS直接由最小二乘递推，不强制先学自适应控制器；控制应用列扩展 |
| ID-08 → INTEL-05 | 原神经控制前向边改ML-04/05训练与时序模型，不依赖控制器设计 |
| ID-09 → MPC-02 | 先完成模型验证与激励案例；MPC预测应用作为后续阅读，不能反向要求尚未生产课程 |

## W03审查记录与关闭边界

I03的30个孤立来源均为“缺失真实先修”，无一因独立开读可合理维持孤立；部分learning/type原来未填，属附加课型缺失，不是把它改成case就能忽略工具要求。下表逐项列目标和新增候选，机器清单保留原source身份。两条旧multi-agent-rl指同一目标但逐来源都保留。

W03保持未完成：S01完成审查部分，S02仍须把图写入catalog并实测无环/悬空/未登记前向边；课程可学性留逐课Phase 1。不能因为表格齐全就关闭运行目录的30孤立/7零边WARN。

| 孤立来源 | 目标ID | 判断/候选先修 |
|---|---|---|
| modern/controllability-observability | MODERN-02 | 缺失真实先修；MODERN-01;MATH-05 |
| modern/lyapunov-modern | MODERN-03 | 缺失真实先修；MODERN-01;MATH-05 |
| modern/kalman-filter | EST-03 | 缺失真实先修；EST-02;MODERN-02;MATH-12 |
| modern/multivariable-systems | MODERN-08 | 缺失真实先修；MODERN-01;CLASSIC-05;MATH-05 |
| nonlinear/phase-plane | NONLINEAR-02 | 缺失真实先修；NONLINEAR-01;MATH-04 |
| nonlinear/describing-function | NONLINEAR-04 | 缺失真实先修；NONLINEAR-01;CLASSIC-05 |
| nonlinear/backstepping | NONLINEAR-07 | 缺失真实先修；NONLINEAR-03;MATH-06 |
| mpc/generalized-predictive-control | MPC-06 | 缺失真实先修；MPC-03;ID-03 |
| mpc/nonlinear-mpc | MPC-08 | 缺失真实先修；MPC-05;NONLINEAR-01;MATH-18 |
| mpc/distributed-mpc | MULTI-07 | 缺失真实先修；MULTI-04;MPC-05 |
| robust/mixed-sensitivity | ROBUST-06 | 缺失真实先修；ROBUST-05;CLASSIC-09 |
| robust/mu-synthesis | ROBUST-08 | 缺失真实先修；ROBUST-07;ROBUST-05 |
| robust/robust-stability | ROBUST-03 | 缺失真实先修；ROBUST-02;NONLINEAR-10 |
| robust/uncertainty-modeling | ROBUST-02 | 缺失真实先修；ROBUST-01;MATH-05 |
| robust/robust-performance | ROBUST-04 | 缺失真实先修；ROBUST-03;CLASSIC-05 |
| intelligent/fuzzy-controller-design | INTEL-02 | 缺失真实先修；INTEL-01 |
| intelligent/expert-system | INTEL-03 | 缺失真实先修；INTEL-01 |
| intelligent/genetic-algorithm | INTEL-04 | 缺失真实先修；MATH-13;MATH-11 |
| intelligent/fuzzy-neural-network | INTEL-06 | 缺失真实先修；INTEL-02;INTEL-05 |
| rl-control/q-learning | RL-03 | 缺失真实先修；RL-02 |
| rl-control/dqn | RL-04 | 缺失真实先修；RL-03;ML-04 |
| rl-control/actor-critic | RL-06 | 缺失真实先修；RL-05;RL-03 |
| rl-control/safe-rl | SAFE-06 | 缺失真实先修；SAFE-02;RL-11;MPC-04 |
| rl-control/multi-agent-rl | MULTI-08 | 缺失真实先修；MULTI-05;RL-06;RL-11 |
| multi-agent/formation-control | MULTI-06 | 缺失真实先修；MULTI-02;NONLINEAR-03 |
| multi-agent/distributed-optimization | MULTI-04 | 缺失真实先修；MULTI-02;MATH-13 |
| multi-agent/game-theory-basics | MULTI-05 | 缺失真实先修；MULTI-01;MATH-17 |
| multi-agent/multi-agent-cooperation | MULTI-09 | 缺失真实先修；MULTI-06;MULTI-07;MULTI-08 |
| multi-agent/distributed-estimation | MULTI-03 | 缺失真实先修；MULTI-02;EST-03 |
| multi-agent/multi-agent-rl | MULTI-08 | 缺失真实先修；MULTI-05;RL-06;RL-11 |

| 原零边章 | 审查处置 |
|---|---|
| modern | 状态空间接线代/微分方程，随后可控可观、稳定性、设计按工具衔接；Kalman移估计 |
| nonlinear | 状态空间→非线性/相平面→稳定性→各设计方法；几何工具单列 |
| mpc | 离散最优/凸优化/估计→预测与约束→稳定性→扩展方法；分布式移多智能体 |
| robust | 频域/多变量→不确定性→稳定性/性能→H∞/μ；滤波需估计基础 |
| intelligent | 模糊与专家走经典主线；神经路线接机器学习；迭代学习接离散稳定性 |
| rl-control | 概率/动态规划→价值与策略→深度方法→评估；安全与多智能体移专章 |
| multi-agent | 图论/状态空间→一致性→分布式估计/优化与编队；博弈和RL按各自工具接入 |

## 验收

| 命令 | 退出码 | 实际结果 |
|---|---|---|
| npm run check | 0 | PASS17 / WARN36 / FAIL0；运行目录未变 |
| node scripts/check-migration-review.mjs --write | 0 | sources141 / mdx56 / movedSources8 / movedMdx2 / targets205 / oldEdges148 / candidateEdges464 / isolated30 / zeroChapters7 / forward6 |
| node scripts/check-migration-review.mjs | 0 | 重算结果与持久清单一致；56正文未出现未登记漂移 |
| node --test scripts/check-migration-review.test.mjs scripts/check-semester03.test.mjs scripts/check-warning-audit.test.mjs | 0 | tests33 / pass33 / fail0 / skipped0；含漏课、重复、悬空、环、删采样先修、非法课型/难度等负向用例 |
| node scripts/check-warning-audit.mjs --live | 0 | current36 / newOrChanged0 / resolvedCandidates0；全部WARN仍按原任务跟踪 |
| node scripts/check-semester03.mjs | 0 | doneTasks10/21；merged0/205 |
| node scripts/check-fix-logs.mjs | 0 | indexed27 / details27 / reserved2；未新增bug修复记录 |
| git diff --check；git diff --cached --check | 0 | 无空白错误；仅显式暂存S01文件 |


本次未改页面/运行代码/正文，因此不重跑生产build、浏览器或kernel课程验收；既有W01–W05债务保留，S02/S03/S04未完成，课程合并仍0/205。S01关闭意味着迁移输入和风险处置已可审查，绝不代表结构已经上线。
