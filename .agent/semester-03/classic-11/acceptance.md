# CLASSIC-11「经典控制案例」验收

本轮唯一目标classic/classic-case-study，起点master8215118，分支wp/classic-11-classic-case-study。按wiki-lesson-refactor及semester-03-core完成审计/保留映射、Phase1–4（三轮/六组）、十角色含电机驱动轮值、136行六列对账/九门槛/八条红队放行。日志docs/discuss-log/semester-03/03-classic/11-classic-case-study.md；fix-043记录历史漏出的问题。只交付本课，不修改用户两份proofreading文件。

## 内容与纠错

保留12H2、34H3、十题、六实验和P滑条用途，47旧ID以一个旧H1别名兼容，URL/prereq/catalog状态与小节不变。物理参数先展开：LaB+RaJ=.01001，纠正原误写.0101造成的101s为100.1s；统一负载分子尺度。撤旧PI长尾/错根、PID因式、GM噪声解释、擅放宽10%指标、最优结构/工业占比及统计保证；补温和PI反例和真实305V输入代价。反算方向、滤波复验、饱和四状态、实际ZOH/Tustin数字闭环均重核。

十题逐题审：Q1物理J展开、Q2完整根/名义对消、Q3欠定补条件、Q4伪等价、Q5变化后真实PM、Q6独立180rad/s假设、Q7有限DC网络Kv0/积分扩展解、Q8负载缩放及Routh方向、Q9同套Cz/完整数字PM、Q10原对象20不偷换5。MC三种子各120=360组，共同参数评价全部五候选；失败计数只含采样峰/网格调节时间/PM，不承诺全合同/饱和/全参数盒保证。

## 实际验收

下列最终命令均退出0，证据保存在本目录。

| 命令 / 证据 | 实际结果 |
|---|---|
| node scripts/verify-classic11.mjs；reconciliation.log/json/reference.py | 实际TS motorP对107K×601节点，含过阻尼/临界/欠阻尼，最大差1.7763568394002505e−15；独立电流/转速/控制器状态，4参数×5候选×1001节点×参考/电压/负载通道，最大差4.547473508864641e−13，七频点复响应核一致；六原setup/cell分别新kernel执行 |
| reference.json中的限幅独立复算 | Radau对原RK45转速，无反算最大差2.1677622612514824e−6，有反算1.0406038729038336e−5rad/s，均小于2e−4 |
| nb-cells verify classic/classic-case-study --require-kernel；notebooks-final.log/json | 6Notebook/6cell，EXECUTED，WARN0/FAIL0/SKIPPED0；原旧六cell也曾全通过，不能由此继承科学结论 |
| nb-cells extract/assemble；extracted.json/extract.log/assemble.log | 12求值后代码块反向逐字全等，临时roundtrip删除 |
| Pyodide实际原始setup/cell；browser-python.json | 六实验全部passed；Pyodide0.27.7；最终sourceHash=008c19835700fd32592e00625015b957680e552441a9edfb60e5f816977ca67c |
| finalize/write-report/preserve-debts/check-python-support；python-policy.log | 73课/325实验/498cell；298enabled/27code，473执行cell；72其它课和27待办完整记录/编号保留 |
| npm run build；npm run build:pages；npx tsc --noEmit | build.log/pages.log/types.log，均0；无MDX编译失败；205课程/9旧路由/306744460bytes |
| npm run verify -- classic/classic-case-study；page.log | 9PASS/WARN0/FAIL0/SKIPPED0；HTTP200/H1=1/H2=12/KaTeX错误0；全仓两旧组件提示不计本课 |
| node check-browser.mjs；browser-check.log/browser-results.json | 12真实H2逐序ID与共享编译管线全等、47旧ID/单alias/全部侧栏目标、无重复ID；16公式居中，三矩阵各两行；六Notebook、一canvas；滑条上下界/精确临界/恢复默认、课程内最后原实验运行完成，console=[] |
| 390px页面；narrow.png | 文档375=scroll375、文章343=scroll343；七实验/交互section341=scroll341，一图317px；650px表在343容器auto横滚。opening.png/interactive.png/matrix.png为桌面实看 |
| npm run math:check；npm run glossary:check | math.log：files0/tokens0；glossary.log：3PASS/2已知WARN/0FAIL，工业最常NOISE及7处旧函数名 |
| node --test pages/lesson-route/browser-python/python-release-decision；regression.log | 14PASS/0FAIL |
| node scripts/check-fix-logs.mjs；fix-check.log | 41实际条目/2预留，下一号044，索引与详情一致 |
| node check-scope-source.mjs；scope-source.log/json | 正文指纹三路一致；72原课/27待办全等，catalog不变，W06–09开放 |
| npm run check；check-final.log | 21PASS/2已登记WARN/0FAIL；本课原v1.3，旧台账状态不冒充本学期完成 |
| node scripts/check-semester03.mjs；semester-final.log | 学期计划/checklist通过，取得实际合并hash后再勾合并列 |

实际返修：共享MDX编译先抓散文小于号JSX问题；公式内误用HTML实体被Pages的KaTeX门槛拦住，改为LaTeX比较符。真实页面又发现矩阵换行显示不对，修为三处双斜杠，并实看MathML三矩阵各两行、截图确认。每次最终源码指纹变化都重新prepare、Pyodide原六实验运行、finalize再构建，未绕过拒绝门槛。

W06/W07/W08/W09与27全局Python待办保持开放，无未迁材料。下节按全局计划另起对话。

## 合并回执

本课验收后--no-ff合master，取得真实课程提交/合并hash后补入并勾checklist最后一列；本轮不推送gh-pages。
