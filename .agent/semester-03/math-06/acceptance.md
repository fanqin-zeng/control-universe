# MATH-06 多元微积分验收

2026-10-18。本对话只交付本课；按新写专用讨论SKILL完成Phase1–4，见docs/discuss-log/semester-03/02-math/06-multivariable-calculus.md。283行、13个H2、6题步骤答案、6Notebook/6cell、1个双图交互组件。

## 批阅与教学

已阅读用户proofreading-2026-10-17.txt新增意见。本课以登山地图和已有单变量求导为入口，先交代位置、方向、步长与高度，再引出术语；opening.png保留实页。通用原则固化到共享讨论规则及P06；旧课开篇意见分别登记W06/W07，仍为待办，本次未修改其他课程正文。保留可微性、驻点及二阶判别退化的反例，有限步预测与真实值明确分开。

## 命令与证据

下列命令均退出0，原始输出位于本目录：

| 命令/验证 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-math06.mjs | 六原始实验通过；实际TS288组与独立SymPy参考一致，11808剖面点/104544等高线点 | reconciliation.log/json、reference.py |
| node scripts/nb-cells.mjs verify math/multivariable-calculus --require-kernel --quiet --out .agent/semester-03/math-06/notebooks.json | 6实验/6cell/error0，无SKIPPED | notebooks.log/json |
| nb-cells extract/assemble | 6实验12代码块逐字往返一致 | extract.log、assemble.log、notebook-source.json |
| npm run verify -- math/multivariable-calculus | PASS8/WARN1/FAIL0/SKIPPED0；200、H1=1、H2=13/13、katex-error0 | page-verify-final.log |
| npm run check | PASS21/WARN2/FAIL0 | check.log |
| npm run glossary:check | PASS3/WARN1/FAIL0；107条注册、53条解析；旧min/max提示不变 | glossary.log |
| npm run math:check | 块级数学围栏通过 | math-fences.log |
| npm run build | 完整生产构建通过 | build.log |
| npm run build:pages | 205课/9旧入口/302806957字节 | pages-build.log |
| npx tsc --noEmit | 通过 | types.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14/14通过 | regression.log |
| node scripts/check-fix-logs.mjs | 历史索引通过 | fix-index.log |

最初build发现ECharts line.symbol接口不接受首尾数组，失败输出保留build-arrow-type-failure.log；改为合法markLine后完整重建与生产页面验证通过。统计修复命令先发现5项旧统计差异再修正，check-fix.log保留原过程；独立check成功。页面唯一WARN为下一课常微分方程尚为空页，已知非阻断；两项全仓WARN沿用基线。

## 浏览器与兼容性

六个最终MDX原始setup/cell均在Pyodide 0.27.7通过，browser-python.json保留报告。生产导出页面实际运行第六个答案实验，输出与精确分数一致；console无error/warn，默认恢复一致。驻点、东北/西南、步长0及0.5、390px窄屏均实测，正文宽343=scroll343，长公式仅在自身滚动。截图opening.png、experiment.png、narrow.png及browser-results.json可复查。

兼容清单按最终sourceHash合并，现为57课/204实验/377cell，174可运行、30仅展示。scope-check.json确认旧56课结果与策略、30项待处理原样保留，未声称重跑旧课。worker未改，未扩大Slycot支持。

## 合并与范围

合并记录：待实际合并后填写。

只修改本课、相关登记、全局checklist和批阅跟踪；用户两份proofreading原文件未编辑、未暂存。未推送远端，未更新gh-pages。下一课需新对话执行。
