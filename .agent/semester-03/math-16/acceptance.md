# MATH-16 图论基础验收

唯一交付math/graph-theory；起点master fb2a40b，工作分支wp/math-16-graph-theory。使用新写专用讨论SKILL，Phase1–4日志docs/discuss-log/semester-03/02-math/16-graph-theory.md；角色是既有结构化审查视角，不冒充外部专家或独立Agent。

## 内容与范围

277行正文、16H2、6题步骤答案、7Notebook各1cell、GraphConsensusExplorer双图。四个库房的记录器交换偏差参考数，从节点/边、路径/连通、树/割、接收行邻接、度/拉普拉斯、关联矩阵/能量、零谱/代数连通度，接到固定图的连续/离散一致性及有向加权极限。明确物理温度与参考数、连续秒与离散轮、有限20轮与解析极限；有向出根/强连通/权平衡各自条件清楚。先修增已交付微分方程与矩阵指数；不写其它课、完整多智能体控制器或实际标定。

## 数值与独立性

minimal.py/log先确定默认首轮(.5,2,4,5.5)℃、20轮(2.87721786,2.94914197,3.05085803,3.12278214)℃、断图分量极限1与5，失稳w1.5/alpha.5分歧谱半径1.1513878189。TS实际邻居差分函数由AST提取执行，独立reference.py以关联矩阵BWB转置构造、eigvalsh、P矩阵幂核全21轮。735参数组含断边、权重端点、步长端点与所有观察轮；最大差1.0658141036401503e-14 < 预约1e-9，非法输入8组拒绝。UI四位5e-5，正文7位5e-8。

七原始setup/cell逐个干净kernel执行；reconciliation.json另核符号合同，有向pi转置L/保持量/列和与单向显式解残差。补充合同最初误把BFS列表当数量，改len后通过，原cell未出错；最终补显式首轮边能量8.5及初始分歧平方和20输出，避免UI数字只有参考脚本可查。nb-cells严格7cell EXECUTED/error0/SKIPPED0；extract/assemble7Notebook14block反向全等，临时roundtrip已删。

raw标签/提取/kernel/Pyodide各7，最终正文SHA与独立数值及浏览器报告一致见source-consistency.json；不以W08扫描缺口的单一PASS代替覆盖。Pyodide0.27.7七实验全过；兼容清单67课/271Notebook/444cell，241启用、30代码展示。原66课和待办30逐字段不变、Worker未改，见scope-check.json；不扩大Slycot支持。

## 页面与修正

开发页和生产本地Pages页分别实测默认/断边/失稳/末轮/恢复、生产全部滑块Home-End、真实16H2顺序/ID/全部目录锚点无重、KaTeX错误0及8display居中auto。初始窄屏长数值/三列向量撑宽372或366，改为可换行数值及拆开行内列向量后390px正文343=scroll343、双canvas313×160/313×280。生产答案按钮实际Pyodide运行完成，控制台warn/error为空，opening.png人工查看文字与通信图清晰。最终生产导出随交付状态再复验。

## 实际命令与证据

| 命令 | 实测 | 证据 |
|---|---|---|
| node scripts/verify-math16.mjs | 735组+7原始实验合同通过，退出0 | reconciliation.log/json |
| node scripts/nb-cells.mjs verify math/graph-theory --require-kernel | 7cell实际执行无error/SKIPPED，退出0 | notebooks.log/json |
| npm run verify -- math/graph-theory | PASS9/WARN0/FAIL0/SKIPPED0，退出0 | page-verify.log |
| npm run glossary:check | PASS3/WARN1/FAIL0，退出0；旧函数名警告 | glossary.log |
| npm run math:check | 围栏无同行违规，退出0；实际8display/16独占围栏 | math-fences.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14/14通过，退出0 | regression.log |
| node scripts/check-fix-logs.mjs | 索引一致，退出0 | fix-index.log |
| node .agent/semester-03/math-16/check-browser.mjs | 生产DOM/交互/窄屏/控制台通过，退出0 | browser-check.log/browser-results.json |
| npm run check | draft校验PASS21/WARN2/FAIL0，退出0；两WARN沿已登记基线 | check-draft.log |

早期check-draft-fix的两FAIL为新增组件统计未重算，fix-tracker-stats后独立check通过；早期verify的两个WARN为新空课缺subsections，补共享渲染H2后9项通过。保留实际修正对照，不把旧失败当最终结果。最终签发状态check/build/Pages/tsc与真实merge回执后附。

W06/W07/W08继续待办；两个用户proofreading文件不编辑、不暂存。未推送远端、未发布gh-pages。

## 最终交付状态复验

catalog=v1.3、旧tracker与全局checklist前五项同步；npm run check退出0：PASS21/WARN2/FAIL0。两WARN为已登记motion-planning跨章同slug与34门存量正文缺日志；不把本课验收扩大到全站旧课。

npm run build（build-delivery.log）、npm run build:pages（pages-delivery.log）、npx tsc --noEmit（types-delivery.log）均退出0，无MDX编译失败。Pages本地导出205课/9旧路由/316656547字节；早期316656002仅为draft历史。最终npm run verify -- math/graph-theory为PASS9/WARN0/FAIL0/SKIPPED0，退出0（page-delivery.log）。check-semester03通过，讨论固定骨架37行六列/9+4/单签发通过。

最终生产browser-results.json finalDelivery=true：16真实H2与目录ID/全部锚点、无重ID，8display居中auto、KaTeX错误0、7浏览器Notebook；按钮/所有滑块端点/默认恢复正确，答案cell在页面Pyodide运行完成并打印初始分歧平方和20。390px正文343=scroll343，canvas313×160/313×280；控制台warn/error空。opening.png与narrow.png人工查看清晰，初次窄屏截图未绘制的空白图已以实际绘制后截图替换，最终证据可见正文。最终source-consistency.json七标签/提取/kernel/Pyodide一致，最终源SHA一致。

scope-check证明其它66课兼容记录、30待办及其它课程正文未改，W06/W07/W08保持未完成。两个用户批阅文件不编辑不暂存；本对话只交付MATH-16，不推送远端、不发布gh-pages。实际合并回执如下。

合并回执：课程提交 `dc20fab` 已用 `--no-ff` 合入 master，课程合并提交 `942255b69c73be4a3d864b07a6ffe02833698830`。全局checklist六项全部完成，本对话仅交付MATH-16；未推送远端、未发布gh-pages。
