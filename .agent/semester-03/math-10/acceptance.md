# MATH-10 Z变换验收

2026-10-18。本对话只交付本课，新写专用讨论SKILL完整Phase1–4；日志docs/discuss-log/semester-03/02-math/10-z-transform.md。14个H2、6题步骤答案、6Notebook/6cell、1个序列与加权和Explorer。

## 教学与范围

从房间停止加热后的每分钟温差记录进入，明确简化模型与归一化单位。由几何级数到双边Z、ROC同分式不同序列、单边延迟初值、递推卷积、极点单位圆、BIBO与终值条件、离散频响及连续模态采样。a为负只是数学扩展，q=y[-1]不等于y0，加权和不是热量；不将z=e^(sTs)冒充任意传递函数离散化。不生产MATH-11；W06/W07旧开篇批阅仍待办，proofreading两个用户文件未改未暂存。

## 实测命令

下表命令均退出0，原始输出位于本目录；第一次缺标题、内核暂不可达的失败另留存，不作为通过证据。

| 命令 | 结果 | 证据 |
|---|---|---|
| python minimal.py | 扩写前最小例通过 | minimal.log |
| node scripts/verify-math10.mjs | 实际TS1923组/24999点与70位独立参考一致；9复级数点/9单位圆积分反演；6原始实验精确契约 | reconciliation.log/json、reference.py |
| nb-cells verify math/z-transform --require-kernel --quiet | 6实验6cell/error0/SKIPPED0/EXECUTED | notebooks.log/json |
| nb-cells extract/assemble及逐字比较 | 6实验12代码块逐字相等 | extract/assemble/roundtrip.log、notebook-source.json |
| npm run verify -- math/z-transform | PASS8/WARN1/FAIL0/SKIPPED0；HTTP200/H1=1/H2=14/KaTeX错误0 | page-verify.log |
| npm run check | PASS21/WARN2/FAIL0 | check-draft.log、check.log |
| npm run build / npx tsc --noEmit | 均通过，无MDX编译失败 | build.log、types.log；最终build-final.log、types-final.log |
| npm run glossary:check | PASS3/WARN1/FAIL0，旧七处min/max提示不变 | glossary.log |
| npm run math:check | 围栏独占行且配平，18围栏9公式 | math-fences.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14/14 | regression.log |
| check-fix-logs / check-scope | 历史索引一致；60旧课结果及策略/30待处理/其它已跟踪正文不变 | fix-index.log、scope-check.json |
| check-log | 4阶段3轮6审校组10角色38对账9+4门槛4附录 | log-check.log |

## 数值与边界

实际TS由AST提取执行；独立参考70位mpmath逐步状态乘a、权重除r后求和，不复制Math.pow实现，尾项以高精度无限解减有限和；含a0/±1、r上下界、N0/12、近圆两侧2^-20。绝对容差1e-10、UI四位数5e-5先约定未放宽。9个ROC内复点直接长级数与闭式核对，scipy.quad单位圆积分反演k0…8，核负频率符号。六原始setup/cell各独立kernel，并追加数值契约；38行A.1逐量覆盖正文及答案，17项截断不冒充完整和。

同号边界N8有限和9、无限不收敛；交替边界N8=1/N7=0而不收敛，分式1/2不冒充普通和；r=|a|严格拒绝；负a/r尾项可为负。零状态H的ROC与阶跃输出ROC分开，终值反例−1极点不满足条件。默认1.9961、无限2.0000、尾.0039；恢复一致，N0=1.0000/N12=1.9998，负尾项实页−.0013。

## 审校修正与页面

page-verify-first.log保留新稿缺显式H1导致前置卡未挂载的FAIL；补一级标题后通过。终值限定右侧有理序列，因果/线性/时不变、绝对可和均补局部定义；初值q索引、无量纲求和及有符号尾项有学生反馈和具体修改。内核最终复跑曾短暂ECONNREFUSED，kernel-unavailable.log/json记录严格失败；待服务恢复后重跑六实验无SKIPPED，未绕过严格门槛。

真实DOM14H2顺序/ID与catalog、侧栏一致且无重复，9display居中、长式独立auto滚动。390px正文client343=scroll343，画布313宽。截图opening.png/narrow.png与有效交互browser-results.json留证；最终生产截图会覆盖预览截图。术语表补7条、符号表按局部语境登记；日志/对账/红队/九项四档齐备。

Pyodide六原始实验全部成功（browser-python.json）；兼容清单61课/231实验/404cell，201启用、30保留代码。旧60课原始结果与白名单不动，Worker不变，不扩大Slycot支持。全仓两个WARN沿用登记；本页唯一WARN为下一课概率基础仍空页。首次自动OUTLINE/统计修复退出非0保留，独立check另验。

## 最终登记与合并

最终npm run build、npm run build:pages、npx tsc --noEmit均退出0；Pages导出205课/9旧入口/309096053字节（pages-build.log）。8080根页/课程200，最终verify仍PASS8/WARN1/FAIL0/SKIPPED0（page-verify-delivery.log）。最终MDX哈希与原生kernel及Pyodide报告相同（source-consistency.json）。生产页6个实验均browser模式，第六答案实验实际点击全部运行完成，输出与独立参考一致；console无error/warn，窄屏343=scroll343，browser-results.json pass=true。opening.png/narrow.png已覆盖为最终生产截图并目视检查，正文可读、标题与前置卡正常。实验截图experiment.png留存。

实际合并hash在完成后追加。不推送远端，不发布gh-pages。
