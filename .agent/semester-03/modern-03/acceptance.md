# MODERN-03 线性系统稳定性验收

2026-10-18，起点master c3db03d。按wiki-lesson-refactor完整Phase1–4；讨论日志docs/discuss-log/semester-03/04-modern/03-lyapunov-modern.md。本对话仅本课，不发布gh-pages。

保留九主题、三例、十题和原三Notebook/八cell用途，扩为五Notebook/十一cell。开篇从弹簧小车释放与能量进入，SVG与固定三阻尼上下图对应问题；补唯一性、指数界和半正定证书的条件/反例，Q6就地推导，Q8输入环路和返回差域、离散精确/浮点语义分开。五H2缩短，catalog加实际PBH前置；OUTLINE由脚本重算，因此后继课程的拓扑层级随依赖自动变化，不是改写其他课。原26标题ID兼容、原旧地址保留308与静态跳转。

## 实测命令与证据

| 命令/检查 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-modern03.mjs | 退出0，实际原cell+独立闭式/解析，26旧ID/9H2/308 | reconciliation.log/json、reference.py、headings.json |
| node scripts/nb-cells.mjs verify modern/lyapunov-modern --require-kernel --out .agent/semester-03/modern-03/notebooks.json | 退出0，5份11cell，error0/SKIPPED0 | notebooks.log/json |
| 最终浏览器Pyodide | 5份11cell逐个passed，源指纹一致 | pyodide.json |
| node scripts/check-python-support.mjs | 退出0，306启用/27代码 | python-policy.log |
| npm run verify -- modern/lyapunov-modern | 退出0，PASS9/WARN0/FAIL0/SKIPPED0；200/9H2/KaTeX0/十题配对 | verify.log |
| npm run math:check | 退出0，同行围栏0 | math-check.log |
| npm run glossary:check | 退出0，PASS3/WARN2/FAIL0 | glossary.log |
| npm run build / npm run build:pages | 最终均退出0；无MDX错误；Pages205课/9旧入口 | build.log、pages-build.log |
| npm run check | 退出0，PASS21/WARN2/FAIL0；基线两项WARN保留登记 | check.log |
| node scripts/check-semester03.mjs | 各阶段更新，提交后再登记真实hash | checklist.log |
| 生产页面与手机实跑 | 通过：26旧ID/35目标/9H2；360与375px无整页溢出，桌面/手机运行完成，无warn/error | desktop.png、narrow.png |

原始起点3份/8cell已独立执行，baseline-notebooks.json非旧缓存。三阻尼×601节点解析响应差最大4.2988e−13，16方向×301证书界差7.9312e−15；exact矩阵、401频率返回差和六输入倍率见reconciliation.json。27行六列对账、六组审校、九项门槛、三条限定观察在讨论日志。

首次孤立Callout导致编译失败，手机发现一行Q9长矩阵撑宽整页，均修后重新验收；失败/先前指纹记录单列，不混同最终证据。聚合兼容账本73课/333实验/507cell，此次只重新执行本课五份，不宣称全站重新实跑。27待办原ID/原因/处置保留。

W08/W09/W10不关闭；不交付MODERN-04。三份用户proofreading改动不加入提交，日常直接master验收提交/推送。

整体验收：node scripts/verify-modern03-delivery.mjs退出0；5实验11cell/26旧ID/35目标/375px实际截图与最终源指纹一致，见delivery-validation.json。讨论日志Phase4据实际证据签发。普通构建及Pages构建均对最后两行矩阵排版版本重跑，未部署公网。
