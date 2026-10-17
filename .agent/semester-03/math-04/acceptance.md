# MATH-04 特征值与对角化验收

2026-10-18；起点master 12a1524；分支wp/math-04-eigen-decomposition。目标原无MDX，执行wiki-lesson-new与共同流程，一个对话仅交付本课。角色为结构化审查视角，不伪称真实专家、学生或独立Agent参与。

## 成果与教学核查

255行、12个H2、6题及步骤答案、5个原始Notebook/5cell、1个EigenIterationExplorer。以两路读数反复混合贯穿特征对、特征方程、特征空间、基底变换与幂；I/J/R分别澄清重根、缺方向、数域条件。默认p=1/q=1/2/k=3/初值(2,0)，输出(1.125,.875)。先修线性代数基础和复数基础均已交付；不修改其它课程正文。

Phase1合同先落盘，minimal.py实跑后才写数字；Phase2三轮反馈修正数域分裂条件、旋转措辞、趋一致/趋零和diag记号；Phase3六组、Phase4签发、34行三方对账及原九项门槛见docs/discuss-log/semester-03/02-math/04-eigen-decomposition.md。定义、维数/重数和全部数值逐段人工核查；机器日志结构检查不能代替教学和条件审查。

## 实际验收

| 命令/操作 | 退出码 / 结果 | 本目录证据 |
|---|---|---|
| npm run check | 0，PASS21/WARN2/FAIL0，已登记的无日志旧课及同名课WARN保留 | check.log |
| npm run build | 0，无MDX编译失败 | build.log |
| npm run build:pages | 0，205课/9旧入口，299554965字节；本地产物，不代表公网已发布 | pages-build.log |
| npm run verify -- math/eigen-decomposition | 最终0，PASS8/WARN1/FAIL0/SKIPPED0；HTTP200/H1=1/H2=12/12、真实ID/侧栏目标、KaTeX错误0 | page-verify-final.log |
| node scripts/nb-cells.mjs verify math/eigen-decomposition --require-kernel --quiet --out .agent/semester-03/math-04/notebooks.json | 0，5Notebook/5cell/error0，无SKIPPED，原始setup执行 | notebooks.log/json |
| node scripts/verify-math04.mjs | 0，180组实际TS与独立SymPy矩阵乘幂逐量1e-10核对，每组9步轨迹；五个页面原始Notebook另有精确断言 | reconciliation.log/json，reference.py |
| nb-cells extract / assemble反向校验 | 0，5Notebook/10代码块逐字全等，临时roundtrip.mdx删除 | notebook-source.json，extract.log，assemble.log |
| npm run math:check | 0，所有块级公式围栏分行；本课26个美元围栏配平，13个块级公式居中 | math-fences.log，browser-results.json |
| npm run glossary:check | 0，PASS3/WARN1/FAIL0；本课七术语登记，无新符号基；旧课min/max七处不变 | glossary.log |
| npx tsc --noEmit | 0 | types.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 0，14/14通过 | regression.log |
| 实际Pyodide逐课诊断 | 本课5个原始setup/cell全部通过、5启用/0降级；Worker不变，未重跑历史课程 | browser-python.json |
| node scripts/check-python-support.mjs | 0，55课/162启用/30展示；保持历史输出和provenance | python-policy-final.log |
| 浏览器开发/生产页面 | 默认/负倍率/增长/衰减/恢复、步数0/8通过；生产页5个浏览器实验入口，六题答案Notebook实际运行完成；console warn/error为空 | browser-results.json，eigen-experiment.png |
| 390×844窄屏 | 正文clientWidth=scrollWidth=343，长公式独立滚动，视口恢复 | browser-results.json，narrow.png |

页面唯一WARN是两条后续骨架链接：math/ode-matrix-exponential、math/matrix-decomposition，正文明确推导留待后课、下一课尚未交付。没有将其作为已掌握先修或趁机交付第二课。

## 过程记录与边界

- 初次catalog保持empty，页面按规则渲染占位，H2=0导致真实失败；进入draft后重跑通过，失败保留page-verify-placeholder.log。不是吞MDX编译错误。
- check的fix命令先检查旧统计，再自动修正OUTLINE/tracker，所以该次退出1（5项旧统计不一致），见check-fix.log；随后独立check退出0。没有隐藏失败或降低门槛。
- 为避免dev/build共享.next，停指定Next进程后构建；Pages缓存搬到明确的node_modules/.cache/math04-pages-next，恢复8080开发服务。冷启动首轮verify超时SKIPPED留page-verify-cold-start.log，预热后最终无SKIPPED。
- Python只合并本课五个浏览器实跑记录；现有30项待办原因/顺序不变。兼容报告的生成器同步补记本课，发布仍逐版本授权。普通build与Pages均测试了同一正文与组件；最终仅catalog从draft切到v1.3及台账签发，最终真实页面再验。
- 用户proofreading两文件不动、不提交。全站R01仍未完成；不发布gh-pages、不push远端。本课合并后停止。

## 合入

待本工作包提交并--no-ff合master后记录真实hash；此时全局合并列保持未勾。
补充复核：node .agent/semester-03/math-04/check-log.mjs退出0，4阶段/3轮/6审校组/10角色/34对账行/9+4门槛均匹配；node scripts/check-semester03.mjs退出0。scope-check.json确认原54课浏览器实跑及策略记录、30条待办逐条保持原样，未修改其它已有课程正文。
