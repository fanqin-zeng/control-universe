# MATH-07 微分方程与矩阵指数验收

2026-10-18。本对话只交付本课，按wiki-lesson-new及共同规则完整执行Phase1–4；讨论见docs/discuss-log/semester-03/02-math/07-ode-matrix-exponential.md。正文330行、15个H2、7Notebook/7cell、6题步骤答案、1个串联水箱Explorer。

## 教学与范围

开篇先给纯水与两箱染料的可观察现象，再解释固定参考浓度、流向和混合假设；以已交付导数、积分、指数级数和特征值为基础。一阶解/积分因子→高阶状态化→矩阵级数→初值解→对角化/不可对角化→输入积分，最后给非唯一与有限时间发散边界。W06/W07旧开篇批阅仍待办，未修改其它课程正文；未生产MATH-08。

## 实测证据

下列命令退出0，原始输出与数据在本目录：

| 命令 | 结果 | 证据 |
|---|---|---|
| python .agent/semester-03/math-07/minimal.py | 写作前跑通冷却/水箱/对角化与输入积分 | minimal.log |
| node scripts/verify-math07.mjs | 实际TS261组/42021采样点与独立通用矩阵指数≤1e-10；37组自适应ODE交叉核对，最大差1.875499755499277e-12；七原始实验独立契约通过 | reconciliation.log/json、reference.py |
| node scripts/nb-cells.mjs verify math/ode-matrix-exponential --require-kernel --quiet --out .agent/semester-03/math-07/notebooks.json | 七实验/七cell/error0，无SKIPPED | notebooks.log/json |
| nb-cells extract/assemble | 七实验14代码块逐字往返一致 | extract.log、assemble.log、notebook-source.json |
| npm run verify -- math/ode-matrix-exponential | PASS8/WARN1/FAIL0/SKIPPED0，HTTP200、H1=1/H2=15、KaTeX错误0 | page-verify-final.log |
| npm run check（draft门槛） | PASS21/WARN2/FAIL0 | check-draft.log |
| npm run build（draft门槛） | 完整生产构建成功，无编译失败 | build.log |
| npx tsc --noEmit | 通过 | types.log |
| npm run glossary:check | PASS3/WARN1/FAIL0，旧7处min/max提示不变 | glossary.log |
| npm run math:check | 32围栏独占行配平 | math-fences.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14/14通过 | regression.log |
| node scripts/check-fix-logs.mjs | 索引一致 | fix-index.log |
| node .agent/semester-03/math-07/check-log.mjs | 四阶段/三轮/六审校组/十角色/38对账行/九项及附加四条/四附录 | log-structure.log |
| node .agent/semester-03/math-07/check-scope.mjs | 原57课结果与策略、原30项待处理和其它已跟踪正文不变 | scope-check.json |

A.1共38行；本文/答案数字、原始Notebook输出和存在的界面路线逐量核对。冷却与输入等非界面路线明确不适用，不伪称组件有持续注入模式。仅本课有七实验新放行；全量白名单现58课/211实验/384cell，181可运行、30保留代码，旧课未重跑。Worker未变，未扩大Slycot支持。

## 发现与修正

初次一般SciPy expm参考在速率相差约1e-12的近重根工况出现误差，最大1.6417357661391296e-6；保留reference-near-root-failure.log。独立参考改用60位mpmath通用矩阵指数，并与solve_ivp互证，最终实际TS稳定公式通过原1e-10容差。不是放宽容差、改模型或复制组件闭式自证。此发现仅限定本机版本与测过工况。

第一次页面verify发现catalog把subsections写成字符串，导致15个undefined锚点，page-verify-first.log保留真FAIL；改为title/slug对象后全部通过。实图发现图例默认颜色与两线不一致，补itemStyle统一蓝/棕。学生审校还修正范数未定义、输入衰减条件、持续注入的浓度标尺三处表达。一次8891短时连接拒绝后确认原网关可达并完整重跑，最终不留SKIPPED。

页面唯一WARN为后续拉普拉斯变换仍是空页；全仓两WARN沿用基线。统计修复命令先报告旧统计/OUTLINE差异再自动修复，独立check用于最终判定，不以修复命令首次退出值冒充成功。

## 页面与最终登记

开发页面实测默认、不同速率、t0/t8、速率两端、恢复；真实DOM15个H2、无重复ID、16块公式居中，390px屏正文client343=scroll343，长公式仅自身滚动。截图opening.png、experiment.png、narrow.png及browser-results.json。开发console仅热更新全页重载提示，生产结果另记。

最终登记后复验全部退出0：npm run check为PASS21/WARN2/FAIL0（check.log）；npm run build完整通过（build-final.log）；npm run build:pages通过205课/9旧入口/304691505字节（pages-build.log）；npx tsc --noEmit通过（types-final.log）；8080恢复后根页/课程均200，单课verify仍PASS8/WARN1/FAIL0/SKIPPED0（page-verify-delivery.log）。

生产导出页面七个Notebook均为浏览器模式、KaTeX错误0；不同速率按钮与恢复一致，第七个答案实验点击全部运行后在Pyodide 0.27.7完成，六题输出与精确参考一致，console无error/warn。browser-results.json最终pass=true；production字段保留独立生产页数据。experiment.png已由生产页面重拍，图例蓝/棕与线色一致。全局checklist本课六项均完成，合并栏已在实际合并后登记真实hash。

## 合并

合并记录：课程提交a1e0c74，已以--no-ff合入master，实际合并12bc125d414db3f5a8ffbdb54518357d064e84e9；全局checklist记录同一hash，本回执随后独立合入。

用户两份proofreading原文件未编辑、未暂存。本次不推送远端，不发布gh-pages；下一课由新对话执行。
