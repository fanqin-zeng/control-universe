# S02 目录骨架与纯资产迁移

日期：2026-10-17；起点master `4c06e93`。范围为S01已审查的结构落地，不新写/重构教学内容，不签发课程，不改角色。仅按计划搬移正文、更新元数据与确保本工作包可独立合入所需兼容。

## 实施与资产保留

- catalog落地21章205课、464条先修，完整type/level；导航导论第一、生产数学第一。旧29个v1.3、27个draft原样沿用，149新写目标保持empty，无伪造MDX/小节。
- `modern/kalman-filter.mdx`移至`estimation/kalman-filter.mdx`；`mpc/distributed-mpc.mdx`移至`multi-agent/distributed-mpc.mdx`。校验全部56份正文LF规范化hash与S01起点一致，两个移动文件Git识别为100% rename；614个原subsections未改。I01修复保留。
- 141来源全覆盖，三组合并保留唯一正文或empty状态；8个旧路径从catalog移除，133来源原路径仍在。新增67课及旧空条目合并后的82课共149课，均未提前生成正文。
- 464边无环/悬空/章内倒置，导航前向6条均为导论设计边；孤立课0，零边章0。两条真实采样先修保留；旧4条前向allowlist已按S01处置消解，删除陈旧登记，未关闭未登记边/环/悬空守卫。

S03原定承担的旧URL与旧tracker同步有一部分必须前置，否则S02独立合入会让旧页404或check失败。本次新增8条直接永久跳转，连同既有1条共9条；旧tracker同步21章205行并保留29个打勾及逐课历史备注，原整表与章级说明逐字留存于 [迁移前台账](s02-delivery-tracker-before.md)。OUTLINE只由`--fix-outline`生成，统计用`--fix-tracker-stats`生成。本期课程合并0/205。

S03未完成：仍须审查活跃引用、旧锚点与目录兼容，处理历史日志来源别名策略，并完成完整兼容验收。现有MDX旧路径引用通过直接308继续可达，未为改链接扰动教学正文。纯移动保留原标题/DOM ID；不声称308能改写fragment。W01/W04/W05不在本次关闭，S04也保持待办。

## 验收契约

新增 `node scripts/check-structure-migration.mjs` 验迁移后的目录顺序、205课元数据/先修、56原文hash、原小节、149空课、旧status、9条直接永久跳转及旧路径撤出。负向测试覆盖正文丢失/漂移、预签空课、丢旧入口、重定向环、删除采样先修、悬空边和丢小节。

S01是不可变历史，原校验在S02完成后改从真实提交`4c06e93`读取迁移前资产、复算并比对原快照；`--write`明确拒绝覆盖。S01测试也对历史提交复验，不在迁移后伪造原路径文件，不改S01清单/结论。迁移后实际目录用新S02校验。历史Git对象是这项取证的必要输入，浅克隆缺对象时应取回提交，不能绕过检查。

I03的36项基线保留；S02新增 [30项WARN快照](s02-warnings.json) 和下表审计。`check-warning-audit --live`仍先验I03完整记录，再在S02已完成时对新快照比较；新/变化/消失任何WARN均要求再审，不因“结构迁移”豁免。新增聚合成员变化与新警告负向测试。

## WARN变化与处置

36→30的原因：三组迁移重复slug、两条离散倒置、30孤立课程聚合WARN与7零边章聚合WARN共7项不再出现；新增1项 `motion-planning` 跨章同slug。它们为 `robotics/motion-planning` 与 `autonomous-driving/motion-planning`，分别是机器人运动规划和驾驶规划，计划明确保留独立课程；路由始终按两段路径定位，互不覆盖。该新WARN接受为命名提示，无需合并课程，不放宽检测器。checker原文仍带历史A6提示，不把它误认成旧迁移重复课未消解。

26页锚点WARN、35课缺日志、2个孤儿组件均保持待办；分布式MPC锚点WARN随路径迁入multi-agent，日志35课成员仅路径/顺序变化，没有新增缺档。I03原记录不重写为“全关闭”；消失项作为结构处置证据交S03/W03/S04核验，课程可学性仍须逐课Phase 1。

| S02序号 | 当前WARN/来源 | 去向与处置 |
|---|---|---|
| 1 | 新增：slug 跨章重复：motion-planning → robotics, autonomous-driving（路由按 (chapter,lesson) 组合键取文件，不冲突；A6 迁移期属预期） | S02接受：两个领域独立路径；不合并、不放宽检查 |
| 2 | BW-004：已有 MDX 但无讨论日志：**35 门**（占有正文课程的 63%） | 35个目标课按既有ID逐课补日志 |
| 3 | BW-005：已实现但无任何 MDX 引用（孤儿组件，Q3 类）：BodeMarginsExplorer → components/wiki/bode-margins-explorer.tsx（且未登记进 lib/wiki-components.ts，一旦被引用会先撞 fix-015 的 500） | W02，不因迁移假引用组件 |
| 4 | BW-006：已实现但无任何 MDX 引用（孤儿组件，Q3 类）：FirstOrderComparisonExplorer → components/wiki/first-order-comparison-explorer.tsx | W02，不因迁移假引用组件 |
| 5 | BW-007：classic/frequency-domain-analysis：1 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 6 | BW-008：classic/frequency-response-design：1 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 7 | BW-009：modern/state-observer：1 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 8 | BW-010：modern/optimal-control-basics：4 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 9 | BW-011：nonlinear/nonlinear-characteristics：3 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 10 | BW-012：nonlinear/phase-plane：6 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 11 | BW-013：nonlinear/lyapunov-stability：3 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 12 | BW-014：nonlinear/feedback-linearization：3 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 13 | BW-015：discrete-sampled/z-transform-analysis：4 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 14 | BW-017：discrete-sampled/discrete-stability-criteria：3 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 15 | BW-016：discrete-sampled/discretization-methods：2 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 16 | BW-018：implementation/digital-pid：3 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 17 | BW-027：robust/robustness-concept：2 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 18 | BW-028：robust/h-infinity-basics：1 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 19 | BW-029：robust/mu-synthesis：3 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 20 | BW-019：mpc/mpc-principle：3 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 21 | BW-020：mpc/prediction-model：1 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 22 | BW-021：mpc/receding-horizon：4 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 23 | BW-022：mpc/constraint-handling：1 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 24 | BW-024：mpc/generalized-predictive-control：8 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 25 | BW-025：mpc/nonlinear-mpc：6 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 26 | BW-023：mpc/mpc-case-study：1 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 27 | BW-030：intelligent/fuzzy-control-basics：2 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 28 | BW-031：intelligent/fuzzy-controller-design：3 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 29 | BW-032：intelligent/neural-network-control：3 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |
| 30 | BW-026：multi-agent/distributed-mpc：3 个 subsection slug 与 slugger 实值不符（侧栏死锚点，Q5 待裁决） | W01/W04；W05两页数学缺陷独立修复 |

## 生产页面和内核复验

先停止原开发包装服务及其子进程，避免构建与dev共享`.next`；`npm run build`真实退出0。启动生产`next start`于8080及同一8891网关后，全部205个新目录路径HTTP200（56正文、149占位），9旧入口全部308且Location直接命中最终200，未知路径404，结果见 [路由证据](s02-route-results.json)。这是生产HTTP/SSR回归，不冒充浏览器交互或全部课程数值验收。测试后恢复原8080开发服务和8891网关。

两迁移页verify第1/6项均通过：Kalman H2=12/12、分布式MPC H2=13/13，均katex-error=0。完整verify仍退出1：Kalman notebook含ipywidgets；分布式MPC有3个既有锚点偏差，二者均无历史日志。不能写成两课整体通过。

严格在线nb退出1：4 notebooks/5静态cells，实际跑3cells（其中执行cell的error=0，但setup失败单独记FAIL）。Kalman第1个setup `NameError: plt`、第3个setup缺ipywidgets，另有两项widget静态FAIL及字体WARN；分布式MPC两cell均OK，仅language属性被忽略WARN。不能用“cell error=0”掩盖setup失败。

用`git show 4c06e93`取迁移前两份正文、旧catalog和Notebook组件到临时夹具，在同一真实网关执行相同严格nb，再逐课程比对findings的级别/代码/消息（仅stderr临时路径不参与比较）：迁移前后完全一致。夹具因未包含服务器源码额外出现全仓S8提示，仅属于夹具覆盖范围，非线上回归；两次均已执行核心S6且退出1。夹具已逐文件删除，证据 [迁移前](s02-notebook-before.json)、[迁移后](s02-notebook-results.json) 保留。

债务归属：EST-03 Phase 1处理plt导入、ipywidgets转React、字体与日志；MULTI-07处理无效language属性/日志；其锚点归W01/W04并于本课回归。两份正文保持draft，无教学签发。W03目录图条件通过，但任务独立处置与教学可学性复核未被本次代签。

验收日志仅规范化行尾空白，不改输出内容或失败状态。

## 实际验收命令

| 命令 | 退出码 | 结果/证据 |
|---|---|---|
| npm run check -- --fix-outline --fix-tracker-stats | 首轮1，生成后复跑0 | 初次统计/大纲不一致为生成前状态；最终check PASS20/WARN30/FAIL0，见s02-check-output.txt |
| node scripts/check-structure-migration.mjs | 0 | 21章205课、56正文、149empty、464边、9跳转 |
| node scripts/check-migration-review.mjs | 0 | 4c06e93迁移前历史证据与S01快照一致；未覆盖 |
| npm run build | 0 | s02-build.log；编译/类型/预渲染完成，无MDX编译错误；既有Hook/img lint提示保留 |
| 生产HTTP回归 | 0 | s02-route-results.json；205×200、9×308→200、未知404 |
| npm run verify -- estimation/kalman-filter multi-agent/distributed-mpc --quiet | 1（存量失败） | s02-page-verify.log；PASS14/WARN3/FAIL1；两页渲染与数学通过 |
| node scripts/nb-cells.mjs verify estimation/kalman-filter multi-agent/distributed-mpc --require-kernel --quiet --out .agent/semester-03/s02-notebook-results.json | 1（存量失败） | s02-notebook-verify.log；setup错误与widget债务留到EST-03，不算通过 |
| 同命令改旧两路径并加--root临时夹具 | 1（对照复现） | s02-notebook-before.log/json；与迁移后课程findings一致 |
| node --test scripts/check-structure-migration.test.mjs scripts/check-migration-review.test.mjs scripts/check-migration-warnings.test.mjs scripts/check-semester03.test.mjs scripts/check-warning-audit.test.mjs scripts/lesson-route.test.mjs | 0 | s02-tests.log；51通过、0失败、0跳过 |
| node scripts/check-warning-audit.mjs --live | 0 | I03历史36项完整；liveBaseline=S02/current30/newOrChanged0/resolvedCandidates0 |
| node scripts/check-semester03.mjs | 0 | 治理11/21，课程合并0/205 |
| node scripts/check-fix-logs.mjs | 0 | indexed27/details27/reserved2；纯结构工作无新增fix归因 |
| npm run glossary:check | 0 | s02-glossary.log；PASS3/WARN1/FAIL0，函数名排版存量WARN保留 |
| git diff --check；git diff --cached --check | 0 | 无空白错误，仅显式暂存本工作包文件；用户校对文本不动 |

S02完成；下一项S03，W01–W05/S04仍按全局清单推进，不开始MATH-01。
