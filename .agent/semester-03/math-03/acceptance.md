# MATH-03 线性代数基础验收

2026-10-17；起点master 28140dc；工作分支wp/s3-math-linear-algebra。目标来源无MDX，按wiki-lesson-new及共同流程执行。本对话只交付这一节。

## 成果

新写12个H2、7题及步骤答案、4个Notebook/4cell、1个LinearMapExplorer。以两路输入合成输出贯穿向量、矩阵、乘法顺序、消元、秩、逆、内积范数和控制状态更新；不以未交付的微积分/特征值为先修。三轮反馈和四阶段、36组正文/答案对账及原九项门槛见docs/discuss-log/semester-03/02-math/03-linear-algebra-basics.md。

## 实际验收

| 命令 / 操作 | 退出码 / 结果 | 本目录证据 |
|---|---|---|
| npm run build | 0，无MDX编译失败 | build.log |
| npm run build:pages | 0；205课/9旧入口、298275679字节 | pages-build.log |
| npm run check | 0；PASS21/WARN2/FAIL0，34门无日志旧课与同名课WARN保留 | check.log |
| npm run verify -- math/linear-algebra-basics | 0；8PASS/1WARN/0FAIL；HTTP200、H1=1、H2=12/12及真实ID/侧栏目标一致、无重复ID、katex-error0 | page-verify.log |
| node scripts/nb-cells.mjs verify math/linear-algebra-basics --require-kernel --quiet --out .agent/semester-03/math-03/notebooks.json | 0；4Notebook/4cell/error0，无SKIPPED，原始setup实际执行 | notebooks.log/json |
| node scripts/verify-math03.mjs | 0；45组实际TS与独立SymPy、900网格端点逐量1e-10核对；4个页面原始Notebook及精确断言 | reconciliation.log/json，reference.py |
| nb-cells extract/assemble反向校验 | 0；4Notebook/8代码块逐字全等，临时roundtrip.mdx已删除 | notebook-source.json，extract.log，assemble.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 0，14/14 | regression.log |
| npx tsc --noEmit | 0 | types.log |
| npm run glossary:check | 0，PASS3/WARN1/FAIL0；其它旧课7处min/max不变 | glossary.log |
| 实际Pyodide逐课诊断 | 原始4setup/cell完整通过，4放行/0降级 | browser-python.json |
| node scripts/check-python-support.mjs | 0；54课/157启用/30展示；旧Worker哈希未变 | python-policy.log |
| 生产页面交互 | 默认/共线/恢复、负输入与七题答案Notebook实际点击运行；控制台error/warn0 | browser-results.json，matrix-experiment.png |
| 390×844窄屏 | 正文clientWidth=scrollWidth=343；canvas313×313；长公式独立滚动，视口已恢复 | browser-results.json，narrow.png |
| node scripts/check-semester03.mjs | 0；只更新MATH-03，合并后再填真实merge hash | checklist.log |

verify的唯一WARN为下一课math/eigen-decomposition仍是已登记骨架；正文明确该课尚未交付，未把它作为本课先修，也未将骨架标记为完成。未发布gh-pages，用户上次授权只覆盖字体修复cd1112b。

本次兼容清单合并仅新增MATH-03四个实验，历史实跑保留provenance。scripts/write-python-expansion-report.mjs的标题说明已改为当前累计清单，并明确DEP04授权不能沿用到新课；不改变执行策略或原30项待办。

## 过程中发现并关闭的事项

- 课堂反馈：共线措辞、滑块范围/数学列空间、主元/零行、求和读法、B局部定义、网格称谓、题2未介绍缩写，全部有落点；未伪造外部学生或独立Agent参与。
- check --fix在写回前检测到旧统计与OUTLINE，正常复跑已绿；保留check-fix.log。
- 网关进程退出导致补跑一次ECONNREFUSED；恢复后严格实跑成功，失败留kernel-restart.log。
- 将缓存备份放在out曾被TS全局glob扫描；已移至排除目录，完整构建重跑0；失败留build-cache-failure.log与pages-cache-failure.log。未改tsconfig或验收门槛。
- proofreading两份用户文件保持原样，未纳入提交。无新课程级未决项；R01全站其它债务继续保留。

## 合入

待真实--no-ff合入后记录。此处不预填hash。

日志结构复核：node .agent/semester-03/math-03/check-log.mjs退出0，4阶段/3轮/6审校组/10出席角色/36对账行/9门槛与附加项/4附录及唯一标记均通过；语义、数字覆盖和出席阶段由日志人工逐项核查。见log-structure.log。最终source-hash与Python白名单经check-python-support复核一致，原两门数学正文与Worker的git diff为空。
