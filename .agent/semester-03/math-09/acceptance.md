# MATH-09 傅里叶分析验收

2026-10-18。本对话仅交付本课。新写专用讨论SKILL完整Phase1–4，日志docs/discuss-log/semester-03/02-math/09-fourier-analysis.md；15节、6题步骤答案、7Notebook/7cell、1个双图Explorer。

## 教学与范围

从风扇支架慢快振动进入，明确教学曲线而非实测；正交系数→幅相→方波截断→均方/Parseval→普通CTFT→稳定频响→DFT/FFT→采样窗口。强调Hz与rad/s、双边系数与单边幅值、有限和与理想跳变、混叠与泄漏、奈奎斯特边界正弦全零。只要求已交付微积分/复数；不生产MATH-10，W06/W07旧开篇批阅仍待处理。

## 实测验收

以下命令退出0，原始输出均在本目录：

| 命令 | 实测 | 证据 |
|---|---|---|
| python minimal.py | 写作前最小例通过 | minimal.log |
| node scripts/verify-math09.mjs | 实际TS114组/68514点对独立系数积分及复指数重构；36复积分；7原始实验精确契约通过 | reconciliation.log/json、reference.py |
| nb-cells verify math/fourier-analysis --require-kernel --quiet | 7实验/7cell/error0，SKIPPED0 | notebooks.log/json |
| nb-cells extract/assemble +逐字比较 | 7实验14代码块逐字一致 | extract/assemble/roundtrip.log、notebook-source.json |
| npm run verify -- math/fourier-analysis | PASS8/WARN1/FAIL0，HTTP200/H1=1/H2=15/KaTeX错误0 | page-verify.log |
| npm run check | PASS21/WARN2/FAIL0 | check-draft.log、check.log |
| npm run build | draft与最终完整构建通过，无MDX编译失败 | build.log、build-final.log |
| npx tsc --noEmit | 通过 | types.log、types-final.log |
| npm run glossary:check | PASS3/WARN1/FAIL0，旧min/max七处提示不变 | glossary.log |
| npm run math:check | 24围栏独占行配平 | math-fences.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14/14 | regression.log |
| node scripts/check-fix-logs.mjs | 历史索引一致 | fix-index.log |
| node .agent/semester-03/math-09/check-scope.mjs | 59旧课结果/策略、30待处理、其它已跟踪正文不变 | scope-check.json |
| node .agent/semester-03/math-09/check-log.mjs | 4阶段/3轮/6审校组/10角色/39对账/9+4门槛/4附录 | log-check.log |

## 数值独立性与修正

实际TS从AST提取执行；参考quad从原函数积分求复系数，再复指数重构；均方用分段数值积分，非复制TS闭式。36项复变换独立积分实/虚部，含零与正负频率。容差预先约定1e-10，UI四位数5e-5。方波网格峰仅标有限采样，未宣称连续精确极值。SymPy对复指数积分返回含arg的条件分支导致零频代入失败，原notebooks-first.json/log保留；在先证全实频率绝对界2及NB4界1/1/2后化简，并独立复积分复核。验收驱动自身一处多余括号也修复重跑，没有更改课程结果或放宽容差。

原始七实验Pyodide完整成功，browser-python.json保留报告；兼容清单60课/225实验/398cell，195启用、30仅展示，旧59课不重写。Worker不变，不扩大Slycot支持。

## 页面与登记

默认1.5000mm/均方.6250/RMS.7906，改相位90°得到1.0000；方波N3四分之一1.1035、N1=1.2732、N15=1.0212，跳点与周期端点为0，恢复一致。range的fill未触发状态，改Home/End真实键盘操作复验；browser-results.json保留有效读数。DFT大写slug初查死锚点已修为真实小写ID；15标题顺序/侧栏与真实DOM一致、无重复。12块公式居中，390px正文client343=scroll343，两画布313宽，长公式独立auto滚动。opening.png/narrow.png保留实页截图。

全仓两WARN沿用登记基线；本页唯一WARN是下一课Z变换空页。自动修正统计/OUTLINE首次退出非0保留，不冒充独立check成功。术语表补12条与局部符号约定；四份交付档案、旧tracker、计划与全局checklist已同步。

最终npm run build:pages退出0，205课/9旧入口/307661517字节；npx tsc --noEmit退出0。8080根页/课程均200，最终verify PASS8/WARN1/FAIL0/SKIPPED0（page-verify-delivery.log）。生产导出七实验均browser模式，第七实验实际点击全部运行完成并输出六题；console无error/warn，窄屏343=scroll343，browser-results.json最终pass=true。真实合并回执待实际合入后追加。用户proofreading原文件未编辑或暂存；不推送、不发布gh-pages。


实际合并回执：课程提交a9517a2，以--no-ff合入master，合并提交cb048267cdca44cb6e07978306534a21313e0c2d。全局checklist六项已完成并登记同一真实hash；此回执随后独立合入。
