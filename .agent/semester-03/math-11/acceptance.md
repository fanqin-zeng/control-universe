# MATH-11 概率基础验收

2026-10-18。只交付本课，按新写专用讨论SKILL完整Phase1–4。正文15个H2、6题步骤答案、7Notebook/7cell、1个感应灯条件概率Explorer；讨论docs/discuss-log/semester-03/02-math/11-probability-basics.md，40行逐量对账与原九项+四补充齐备。

## 教学与边界

从门口感应灯/猫经过与访客判断进入，先数四格期望次数再讲条件反转、贝叶斯与基础比例；继续分布/密度/矩/协方差/二项正态/样本/平均。强调万次是期望标尺而非实测、密度不是点概率、零分母条件未定义、零协方差不等于独立、iid与有限矩条件、共同误差不会被平均消除。无随机抽样、无算法性能排名，不生产MATH-12。真实使用连续面积，catalog补已交付微积分入门先修；原有目标映射不变。

## 实测命令

下表命令退出0，原始输出位于本目录：

| 命令 | 实测 | 证据 |
|---|---|---|
| python minimal.py | 扩写前最小事件表与共因例通过 | minimal.log |
| node scripts/verify-math11.mjs | 实际TS220组对精确潜在事件树；256基础样本配置/32共同误差配置；正态独立积分；七原始实验精确契约 | reconciliation.log/json、reference.py |
| nb-cells verify math/probability-basics --require-kernel --quiet | 7实验7cell/error0/SKIPPED0/EXECUTED | notebooks.log/json |
| nb-cells extract/assemble及逐字比较 | 7实验14代码块往返逐字一致 | extract/assemble/roundtrip.log、notebook-source.json |
| npm run verify -- math/probability-basics | PASS8/WARN1/FAIL0/SKIPPED0；HTTP200/H1=1/H2=15/KaTeX错误0 | page-verify.log |
| npm run check | PASS21/WARN2/FAIL0 | check-draft.log、check.log |
| npm run build / npx tsc --noEmit | 均通过，无MDX编译失败 | build.log、types.log；最终build-final.log/types-final.log |
| npm run glossary:check | PASS3/WARN1/FAIL0，旧min/max七处提示不变 | glossary.log |
| npm run math:check | 26围栏独占行配平，13display | math-fences.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14/14 | regression.log |
| check-fix-logs / check-scope | 历史索引一致；61旧课结果/策略、30代码展示及其它已跟踪正文不变 | fix-index.log、scope-check.json |
| check-log | 4阶段3轮6审校组10角色40对账9+4门槛4附录 | log-check.log |

## 独立性与实跑

实际TS通过AST导出调用，参考Fraction以D→B事件树枚举后对B条件归一化；不是再抄一份Bayes函数。测试先验/两种条件概率全边界、零概率条件、极小先验，给定绝对容差1e-10，UI四位小数5e-5、百分两位.005百分点、期望次数一位.05次。二项以32路径概率积核组合公式；样本用[-1,0a,0b,1]四种等可能基础结果的4^4=256配置（数值样本可重复），独立验证E[s²]=.5与平均方差.125；共同误差32配置精确给平均方差1.25、单次2/协方差1。正态另用60位mpmath核scipy.quad，面积.6826894921370859、密度.19947114020071635、归一1/方差4。没有种子或随机单次频率冒充理论。

原始七setup/cell每个干净kernel执行，加精确契约，Pyodide七实验全部运行成功（browser-python.json）。兼容清单62课/238实验/411cell，208启用、30保留代码，旧61课不重写，Worker不变，不扩大Slycot支持。

## 新发现W08与处置

首次nb-cells报6实验PASS，而源码实际7标签。独立数量核对发现display中的a<X被轻量扫描器误当JSX，吞掉CDF实验；此前六个通过不作为全课通过。本课改为数学排版a < X，源码/提取均七个，随后七原始实验全部重跑；固定验收脚本同时断言raw标签7与提取7。scanner-count.json内存还原原写法复现7对6，notebooks-first.json/log保留初始六个结果。公共解析器未改，补强与全仓漏检审计已登记全局W08待办，详见scanner-followup.md；不把本课排版规避记成工具已修。W06/W07旧开篇批阅仍待办。

## 页面与登记

实页默认亮灯.0585、后验.1538/15.38%、期望四格90/10/495/9405；先验.1后验.6667；无区分信息后验.0100；零分母显示无定义；纯误报后验0；无误报且条件非空后验1；滑块上下界与恢复通过。真实15H2/侧栏ID顺序一致、无重复；13块公式居中且长式独立auto滚动，390px正文343=scroll343、画布313宽。最终生产截图opening.png/narrow.png及交互browser-results.json会留证。

26新术语与局部符号登记；全局两个WARN沿用已登记基线，本页唯一WARN为下一课随机过程空页。自动OUTLINE/统计修正首次退出非0保留，独立check另验。全局任务新增W08，因此任务29/已完成23；课程合并数在实际合入后更新。不推送远端、不发布gh-pages；用户proofreading两个文件未编辑未暂存。

最终npm run build、npm run build:pages、npx tsc --noEmit均退出0；Pages205课/9旧入口/310381829字节（pages-build.log）。8080根页/课程均200，page-verify-delivery.log仍PASS8/WARN1/FAIL0/SKIPPED0。source-consistency.json确认最终MDX与原生kernel/Pyodide源哈希相同。生产DOM七browser实验，含先前漏提的CDF实验；第七答案实验实际点击全部运行完成，输出与独立参考一致；console无error/warn，13display居中，390px正文343=scroll343。browser-results.json最终pass=true，opening.png/narrow.png/experiment.png均为生产页实际截图，前两图已目视确认可读。

实际合并hash待合入后追加。
