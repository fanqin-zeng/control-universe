# S04 结构迁移验收与 W 项关闭

2026-10-17，起点master `8c9b07c`。本工作包处理结构验收前置W01–W05，不交付课程，不改角色团队，不改数值结论/组件默认值/Notebook代码；修复按fix-tracker归档030。用户校对文本不动。

## W05：两页 MPC 恢复完整渲染

mpc-principle与receding-horizon原`$$\boxed{\begin{aligned}`、`\end{aligned}}$$`改为开闭美元围栏各独占行。**末尾两个花括号均保留**，分别关闭aligned和boxed；不删除合法公式符号。与S03原文移除换行后逐字相同。生产H2恢复8/8、11/11，katex-error=0；build通过，verify第1/6项通过。完整两课verify仍退出1，仅第3项ipywidgets存量失败，归MPC-01/MPC-03逐课Phase1–4；不签发课程。

## W04：标题验收与页面共用契约

页面及检查器共用`lib/mdx-headings.mjs`的GFM/Math→KaTeX→Slug→旧ID兼容。Slug对全部级别标题去重；代码高亮不参与标题计算。`scripts/rendered-headings.mjs`使用页面同一个next-mdx-remote编译器提取真实标题HAST，不再用仅H2的源码slug预估。检查器发现编译异常必须失败，不能空标题降级。

verify第2项使用真实编译H2序列，第6项额外核生产DOM的标题ID序列/目标存在/重复ID，第7项检查真实编译ID集合（包括有效H3与旧别名）。check保留目录统计/图/注册/台账门槛，改用真实标题ID比较。永久测试包含数学标题、H3先占同名ID、同数量错误目标、丢目标、坏MDX、boxed美元符号保留；错误链接不能因HTTP200或H2数量相同通过。

## W01：26页目录与旧链接兼容

修正26页76个catalog subsection slug；标题、顺序、数量和614个H2内容不变。完整逐行before/after及实际标题ID见 [迁移矩阵](s04-anchor-migration.json)。与I03源码预估75处不同，本次76按最终DOM测量，保留原快照不改历史统计。

`lib/legacy-anchors.mjs`保留26页共78个旧catalog/源码预估别名，页面在目标标题内加入空aria-hidden span，canonical ID/标题文本不改；S03已有3条别名保留。全站真实DOM核对所有旧真实ID及新增别名均存在，无重复ID；26页与其余30页都核对。

唯一冲突：GPC的旧catalog `数值例子` 实际早被另一标题占用，目标H2真实ID是`数值例子-1`。保留原`数值例子`的既有真实含义，不抢占、不制造重复ID；侧栏明确改指`数值例子-1`，迁移矩阵记录这一歧义。历史真实fragment继续原定位；错误目录的意图不能覆盖其它原有标题。任意不存在或拼错的fragment不在兼容承诺内。

## W02：两个孤儿组件实际归档

两份源码移到`archive/unreferenced-components/*.tsx.txt`，保留原码，停止参与Next/TypeScript编译；FirstOrderComparisonExplorer撤销唯一运行注册，BodeMarginsExplorer原本未注册，不伪造MDX引用。生产组件45个、使用45个、孤儿0，单一注册表47项（含Notebook/Callout）。归档前后hash相同，恢复方法/用途判断见该目录README。

Bode裕度与现有频域组件任务重叠且存轴界缺陷；归一化RC/热冷却对比尚无经Phase1确认的课程任务，参数不会改变归一化曲线。本期没有投用理由，选择源码归档而非承诺未交付复用。未来需要时按对应课Phase1–4决定、修规范、注册并真实引用。预留fix019/020仍待核，不借归档伪造历史事故。

## W03：来源与依赖独立复核

S01原30个孤立来源逐项映射至当前目标且均有具体先修；7个原零边章的每个来源课均有具体先修，含迁章/合并去向。来源141无遗漏、56正文无丢失；205课464边无环/悬空/章内倒置/未解释前向边，导论6条设计前向边保留。生产次序不变，首课仍MATH-01。

W03的结构处置关闭；逐课Phase1仍须核查具体讲解是否偷用未解释知识，现有MODERN-09等旧正文的教学边界留到本课，不以图无环替代教学可学性。没有给任何课程勾Phase或合并列。

## 生产回归与保留债务

生产build成功后，`verify-structure-acceptance`核全部205课程路径（56正文/149占位）、9个直接308/查询参数/最终200及未知404。全部56正文真实H2/侧栏/旧ID/别名/数学/ID唯一性通过；源码仅允许从真实S03提交推导的URL和两页围栏换行，按JS模板换行语义规范化LF后的Notebook setup/cell代码全部不变。两归档源码hash与S03提交相同。详见 [生产证据](s04-acceptance-results.json)。这是HTTP/SSR及实际编译验收，不冒充浏览器拖动或课程数值实验。

`verify:all`实跑56课，PASS446/WARN42/FAIL16/SKIPPED0，另有2处全仓组件规范违规，退出1。第1/2/6/7项FAIL均0，结构、公式渲染和交叉引用全绿；剩余为14课ipywidgets、math/complex-numbers习题配对、nonlinear/describing-function组件规范。后者的DescribingFunctionExplorer/NyquistLimitCycleExplorer使用useECharts参数形式问题与数学课习题债务都留给MATH-02/NONLINEAR-04，14课按 [逐课债务表](s04-course-debts.json) 绑定现有ID，禁止冒充整站课程交付通过。未把149空课算已写课程。

本次不执行S6数值交付：没有新数值或Notebook修改，原setup错误/ipywidgets等债务见S02/I04证据，之后课程必须严格内核验收。R01全站教学/数值收官仍未完成。W05的关闭只要求渲染技术修复，不要求本对话重写两门课。

check最终PASS21/WARN2/FAIL0：剩余仅35课缺日志（逐课Phase1–4）及robotics/autonomous-driving各自独立motion-planning同slug提示（路径唯一，接受项）。I03的35项技术/结构WARN逐项加关闭证据，BW-004保持待处理；原36项/26页JSON与S02的30项快照均不覆盖。live审计使用新S04快照，任何新增/变化/消失仍须登记，不降低门槛。

## 实际验收记录

| 命令 | 退出码/实际结果 |
|---|---|
| npm run build | 0；s04-build.log，编译/类型/预渲染成功，原Hook/img lint提示保留 |
| node scripts/verify-structure-acceptance.mjs | 0；747项检查通过，全部205路径、56正文、9旧入口 |
| npm run verify -- mpc/mpc-principle mpc/receding-horizon --quiet | 1（存量债务）；PASS14/WARN2/FAIL2，第1/6项通过，均为第3项widget失败 |
| npm run verify:all -- --quiet | 1（教学/组件存量债务）；PASS446/WARN42/FAIL16，另组件规范2处，结构/渲染/链接FAIL0 |
| npm run check -- --fix-outline --fix-tracker-stats | 生成前统计差异退出1；生成后复跑0；OUTLINE只由脚本生成，tracker保留29旧v1.3/205，不代表本期完成 |
| npm run check | 0；PASS21/WARN2/FAIL0，s04-check.log |
| node scripts/check-structure-migration.mjs | 0；保留来源/状态/题名/课型/难度/先修，只放行可推导的锚点slug及围栏修复 |
| node scripts/check-warning-audit.mjs --live | 0；I03完整、35项关闭，S04实时2项无变化 |
| node scripts/check-semester03.mjs | 0；治理18/21，课程0/205合并 |
| node scripts/check-fix-logs.mjs | 0；索引28/详情28/预留2，下一编号031 |
| 全部相关node:test | 0；s04-tests.log；87通过/0失败/0跳过，含真实编译与负向回归 |
| npm run glossary:check | 0；s04-glossary.log，保留函数名排版WARN |
| git diff --check / --cached --check | 0；日志仅去行尾空白，未暂存用户校对文本 |

测试后恢复8080开发服务及8891网关。S04连同W01–W05已验收；使用工作包分支`--no-ff`合入master并删除分支，真实合并hash由最终交付消息及Git记录提供。下一对话可从MATH-01开始，本对话不生产课程。
