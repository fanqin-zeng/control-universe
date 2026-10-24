# IMPL-02 数字PID验收

仅本课。按wiki-lesson-refactor完成原文/代码审计、保留去向、Phase1–4、数值与真实页面验收；提交回执在实际提交后登记。起点master为9c11c8b7567cb959a4ebca16d7f1360b9f6c6c81。

最终正文保留八H2、原主题、四题用途及36旧ID，新增单拍Explorer、级联SVG，四Notebook八cell。修正位置式复杂度、离散法/初态条件、滤波α/N/Tustin、c=0、反算符号/单位/时序、分离状态、无扰切换历史、ZN规则、不可达题与级联闭环。

rank1隔离资源：实际内核8991，原生开发/生产8191（已停），Pages本地9190；保留先前IMPL-01的9191，不抢其它会话端口。独立构建目录D:/Workspace/control-universe-rank1-impl02-validation，node_modules用Junction，其余应用/元数据从HEAD归档并覆盖本课；不清理主工作区.next/out。测试副本的Notebook API单独指8991，交付不改共享组件端口。

| 命令/操作 | 退出码与实际输出 | 证据 |
|---|---|---|
| 开工npm run check | 1；并行MPC草稿表格MDX未完成 | check-baseline.log |
| 开工node scripts/check-semester03.mjs | 0，merged63 | semester-baseline.log |
| node .agent/semester-03/impl-02/audit-source.mjs | 0；原三Notebook四cell可运行，但旧分离/级联末误差未达目标 | source-runtime.log/json |
| JUPYTER_PORT=8991 node scripts/verify-impl02.mjs | 0；真实TS750组对Decimal，原始cell107量对独立解析/卷积；pid_tick原文执行 | reconciliation.log/json、reference.py、actual-ts.json |
| node scripts/nb-cells.mjs verify implementation/digital-pid --require-kernel --port 8991 --out .agent/semester-03/impl-02/notebooks.json | 0；4Notebook/8cell，error0/FAIL0/SKIPPED0 | notebooks.log/json |
| 浏览器逐课Pyodide实跑 | 4实验/8cell passed，最终源hash相同 | pyodide.json |
| npm run build（隔离快照） | 0，无MDX编译失败 | build.log |
| WIKI_VERIFY_PORT=8191 npm run verify -- implementation/digital-pid | 0，八H2对应，HTTP200、KaTeX0、本课组件实际引用/注册 | verify.log |
| 原生实际页面全部运行、控件端点/恢复 | 四实验运行，三滑块端点、c两预设与恢复对账 | browser-native.json、interactive.png |
| npm run build:pages（隔离快照） | 0；205课程/9兼容路由、basePath正确 | pages-build.log |
| Pages9190页面实际全部运行 | 四实验/八cell，真实DOM输出与独立数值一致 | browser-pages.json |
| 375px同源iframe | 真实内容宽360/scrollWidth360，KaTeX0、图片成功；不是物理真机 | browser-mobile.json、mobile.png |
| npm run math:check | 0 | math.log |
| npm run glossary:check | 0，既有WARN保留 | glossary.log |
| node scripts/check-python-support.mjs（隔离） | 0；85课，382可运行/16代码保留 | python-policy.log |
| npm run check（隔离提交范围） | 0；PASS21/WARN2/FAIL0，统计由现有脚本生成 | scoped-check.log |
| node .agent/semester-03/impl-02/validate.mjs | 最终结果见validation.json | validation.log/json |

数值最大误差：TS对Decimal8.881784197001252e−16，原始cell对独立结果1.5631940186722204e−13。A.1有111行，包含107个自动核量及四项打印系数核查；三工况全量结果进入红队表，只有限定参数观察，不宣称最优方法排名。

## 过程失败与并行边界

首次草稿IMC算例误写8/3，实际输出4/3使独立检查失败，已纠正并重跑。分段公式转义首次渲染错误，在真实DOM发现后修复。verify的旧轻量扫描将数学0<KbTs<2误识成组件并吞掉Explorer；本课改用等价LaTeX的lt，未改共享脚本；原失败输出保留verify-scanner-first-failure.log。

开发服务器曾在写入测试副本共享注册表时HMR暂态报组件未定义，初次挂载出现Jupyter连接失败；生产页重新挂载后四实验全部运行，最终独立Pages新页无浏览器error。browser-native保留开发页跨重载日志，不把历史error静默清空；最终浏览器错误判断用新Pages页。

本课创建fix记录时撞上并行分配的072：本课改为074。已从MPC会话原始写入调用恢复其072完整内容，hash与来源元数据在parallel-recovery.json；072、073不纳入本课提交。共享fix检查的072索引/详情原始不一致如实保留在fix-check.log，本课不改另一课未完记录；本课提交范围独立检查另存。

源码构建基线与提交元数据基线分别记录在build-base.json和staging-base.json。并行ID-02先进入master后，提交范围须刷新到真实HEAD，不能用旧快照回退它；Python策略/报告按课程语义合入，仅修改本课。共享工作区的临时全站失败与本课隔离检查分别报告，不混为全站完成。

本次不发布gh-pages。下一课IMPL-03另开对话。

## 最终提交范围校验

本课最终父提交为24e505210d11eb803d911637b6a0e7609bcd0d54，完整保留此前已进入master的并行交付。源码检查基线与回执追赶分别见staging-base.json及可能存在的receipt-forward.json。

- 隔离提交范围`npm run check`退出0：PASS21/WARN2/FAIL0，见scoped-check.log。自动OUTLINE与tracker统计只在此范围由既有脚本生成。
- Python策略检查退出0：95课，408可运行、14代码保留，见python-policy.log；其它课程记录与HEAD逐条语义相等后才允许暂存。
- 本课提交范围fix检查退出0，73索引/73详情/2预留。为避免074先提交造成编号空洞，用技能已有预留表暂存并行072/073编号，不带入对方详情；说明在parallel-number-allocation.md。共享工作区已有对方在写索引/详情，原样保留。
- 共享工作区最终`npm run check`退出1（check-final-working.log）：并行RL/驾驶等课的catalog与tracker尚未同步、统计与OUTLINE在写。没有修改那些课程来制造通过，也未把隔离通过称为全工作区通过。
- 过程中的旧快照缺少刚合入的估计课、并发刷新统计导致失败，已重新归档真实HEAD并独立重验。最终只以最后完成的scoped-check.log为准。

源LF SHA256为cf379be9dc4e53e6eecbb7c93a920ce50f912358151180011810470f49c6a939。四实验八cell真实页面输出共248量一致，旧36ID全部保留，最终Pages新页error0。仅9190本地静态预览保留；本轮其它临时浏览器页已关闭，8191原生服务已停止。




最终目录检查直接执行原scripts/check-catalog.mjs；重复运行由私有Node进程复用该模块现有标题缓存，源码+课程键变化会重新编译，任一校验依赖变化会拒绝复用。判定规则和实际CLI退出码未修改，运行记录见catalog-runs.json。原始旧文与工具stdout保留原空白；其它新代码/文档git diff --check通过。共享索引的过期预留/排序/字段同步见index-normalization.md，未改其它课修复详情。


真实master交付回执：`d6600ebe3d487e6fce87624afc0fa7acf2146e99`。独立索引提交，比较预期父提交后原子更新master；本课提交没有改写共享默认索引，也未提交其它会话的在写文件。课程进入master列据此回填；Pages只保留本地9190预览，未发布。8991验证内核已释放。
