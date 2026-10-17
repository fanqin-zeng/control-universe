# MATH-12 随机过程验收

2026-10-18。本对话只交付本课，新写专用讨论SKILL完整Phase1–4。16个H2、6题步骤答案、7Notebook/7cell、1个双图AR过程Explorer；讨论docs/discuss-log/semester-03/02-math/12-stochastic-processes.md，45行逐量对账与原九项+四补充齐备。

## 教学与范围

电子秤每秒误差记录进入，区分轨迹与总体，再讲m/R/C、严格/宽平稳/均方遍历、白与独立、AR初始化/相关平均/谱、Markov链与周期、游走、向量协方差及Brownian。四条曲线是选定可能实现，不是采样数据或总体统计；二值二阶矩平稳初始化不保证完整分布平稳。谱取零均值宽平稳及协方差绝对可和，游走不套有限稳态公式；Brownian概率1连续且处处不可微，连续白噪声不当普通函数。补实际用到的已交付傅里叶先修，不生产MATH-13，不推Kalman增益或Ito积分。

## 实测命令

以下命令退出0，原始输出在本目录：

| 命令 | 结果 | 证据 |
|---|---|---|
| python minimal.py | 扩写前AR/链/矩阵最小例 | minimal.log |
| node scripts/verify-math12.mjs | 实际TS728组，与独立权重协方差矩阵/卷积路径一致；协方差Fourier谱与Kronecker矩阵解；7原始实验精确契约 | reconciliation.log/json、reference.py |
| nb-cells verify math/stochastic-processes --require-kernel --quiet | 7实验7cell/error0/SKIPPED0/EXECUTED | notebooks.log/json |
| nb-cells extract/assemble及逐字比较 | 7实验14代码块往返逐字一致 | extract/assemble/roundtrip.log、notebook-source.json |
| npm run verify -- math/stochastic-processes | PASS8/WARN1/FAIL0/SKIPPED0，HTTP200/H1=1/H2=16/KaTeX错误0 | page-verify.log |
| npm run check | PASS21/WARN2/FAIL0 | check-draft.log、check.log |
| npm run build / npx tsc --noEmit | 完整通过，无MDX编译失败 | build.log、types.log，最终build-final.log/types-final.log |
| npm run glossary:check | PASS3/WARN1/FAIL0，旧七处min/max提示不变 | glossary.log |
| npm run math:check | 24围栏独占行配平，12display | math-fences.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14/14 | regression.log |
| check-fix-logs / check-scope | 历史索引一致；62旧课结果及策略/30代码展示/其它已跟踪正文不变，W08仍待办 | fix-index.log、scope-check.json |
| check-log | 4阶段3轮6审校组10角色45对账9+4门槛4附录，A.1六列严格核对 | log-check.log |

## 数值与独立性

实际TS经AST导出调用。组件递推，独立参考用创新到状态的线性权重矩阵B乘完整输入协方差得到C=BDB^T，路径用冲激响应卷积求和，未复制递推自证。728组含a负/零/正、q上下界、两种初始化与13时刻，每组4×13个路径点；最大路径差1.3322676295501878e-15、方差差8.881784197001252e-16，低于预先绝对1e-10；UI四位5e-5。谱由γ的128项Fourier和独立积分核闭式及归一，矩阵稳态由Kronecker线性方程核符号解；Brownian由独立增量权重矩阵核min协方差。偏置R/C与随机常量原先直接打印数字已改真实离散枚举求矩并重跑，答案汇总引用这些已复算量。

默认a.5/q.75/X0=0，P1=.75/P2=.9375/P3=.984375，极限1；P12=16777215/16777216，四位舍入为1也不等于极限。二阶矩平稳按钮P0=P3=1，但X0±1与X1四值不同，不叫严格平稳初始化。负相关/无记忆/观察零与末端/a及q上下界/恢复默认均实页验证。白依赖反例8配置、随机游走16路径、链周期与矩阵残差均用原始cell复算，不使用随机单次样本冒充理论。

## 浏览器与范围

Pyodide七原始setup/cell完整成功（browser-python.json），清单63课/245实验/418cell，215启用、30保留代码，旧62课/Worker不变，不扩大Slycot支持。源码七标签、提取七、严格kernel七固定独立核对；W08公共扫描器缺口未改未勾，不能用同源扫描单个PASS自证覆盖。

真实16H2/ID顺序/侧栏一致、无重复；12块公式居中、长式自身auto滚动，390px正文client343=scroll343，两画布313宽。最终生产截图opening.png/narrow.png/experiment.png及browser-results.json已保存；四份档案日志/对账/红队/九项齐备。18新术语、局部符号、真实先修、旧tracker、自动OUTLINE、计划与全局checklist同步；全仓两WARN沿用登记基线，本页唯一WARN为下一课凸优化空页。自动OUTLINE/统计修正首次退出非0保留，独立check另验。

W06/W07/W08仍待办；用户proofreading两个原文件未编辑未暂存。不推送远端，不发布gh-pages。最终build、build:pages、tsc退出码均0；Pages导出205课/9旧路由，311841075字节。生产页7个浏览器实验、16H2、12公式居中、零KaTeX错误，答案实验运行完成，控制台warn/error为空，390px正文343=343，双画布313。browser-results.json pass=true。最终页面verify退出码0。合并回执见后附。

合并回执：课程提交 `312b524` 已通过 `--no-ff` 合入 master，课程合并提交 `e4404751d8455b8d2d16c63ce9e9d19c2f546227`。全局 checklist 六项完成；本对话仅交付 MATH-12。未推送远端、未发布 gh-pages。
