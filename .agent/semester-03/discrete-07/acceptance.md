# DISCRETE-07 采样周期交付验收

范围：只重构discrete-sampled/sampling-period-selection，Phase1–4日志见docs/discuss-log/semester-03/06-discrete-sampled/07-sampling-period-selection.md。起点master d12e59f，原稿/原标题/旧浏览器/原始失败输出保存在本目录。重构SKILL与共同门槛已读并执行；默认master直接提交推送，本次无Pages发布授权。

用户指定07，独立登记暂缓01；用户批阅文件、本地8180/8181/8981端口改动不提交，01未完成内容暂存隔离，交付后精确恢复。没有将01或08算作完成。

旧3Notebook/3cell因ipywidgets全部setup失败，S04历史FAIL复现，notebooks-before.json/log退出1。前两组理想微分不可离散化、数字频响变量/API、时间轴错误；Q1模型与给定裕度矛盾，Q3漏ADC，多率比较同时变数值步长及多项无依据保证，见source-audit.md与fix-068。原七H2、12H3、三实验对象/用途与四题均保留；旧H1 ID别名，20编译原标题ID及旧DOM目标全部保留。

本课采用显式tau.01s过滤PID新基线，不能把新结果归给旧理想PID。真实TS预算十四配置对60位mpmath，最大绝对误差7.28e−12（门槛1e−10）；二阶闭环完整响应、八周期根与裕度、100点扫描、三多率轨迹/指标/全部四题，对不导入control的独立状态/公式参考，相对缩放误差≤5.81e−13，门槛1e−8。1ms高阶TF递推原先误差略超1e−8，等价状态空间实现修正而不是放宽容差。本文所有约数按末位舍入，完整数值见reconciliation.json。

交互最终默认3ms、测量到输出总延迟1ms、执行预算.7ms，不能用d0暗示串行任务无耗时；5ms/d0是明确忽略其它延迟的纯算术例。预算预设含相位不够、超期、无交集和恢复。多率默认未胜同率，报告真实55500/1500/5550更新次数，非等算力或重新整定性能赛。末误差不冒充稳态，采样峰不冒充连续峰；无交越不伪填PM。

| 实际命令/操作 | 退出码/结果 | 证据 |
|---|---|---|
| npm run check（基线） | 0；PASS21/WARN2/FAIL0 | check-before.log |
| JUPYTER_PORT=8981 node scripts/verify-discrete07.mjs | 0；14真实TS配置与完整独立对账 | reconciliation.log/json、actual-ts.json、reference.py |
| node scripts/nb-cells.mjs verify discrete-sampled/sampling-period-selection --require-kernel --port 8981 --out .agent/semester-03/discrete-07/notebooks.json | 0；3Notebook4cell、error0、PASS1/WARN0/FAIL0/SKIPPED0 | notebooks.log/json |
| npm run build | 0；无MDX编译/运行失败 | build.log |
| WIKI_VERIFY_PORT=8183 npm run verify -- discrete-sampled/sampling-period-selection | 0；PASS8/WARN1/FAIL0/SKIPPED0、HTTP200、H1=1/H2=7、KaTeX0 | verify.log |
| 浏览器Pyodide逐课全部运行 | 3实验4cell均passed，源hash一致 | pyodide.json |
| 普通课程页全部运行与控件操作 | 所有输出与原生内核/浏览器数值一致；两滑块边界、四按钮和恢复实测 | browser-native.json |
| npm run build:pages | 0；205课/9旧路由、basePath=/control-universe | pages-build.log |
| 实际Pages本地课页全部运行 | 三实验四cell输出与原生/浏览器一致、SVG基路径加载 | browser-pages.json、desktop.png |
| 实际Chrome375px | innerWidth375/scrollWidth360、KaTeX0、两滑块可用，无整页横溢出 | browser-mobile.json、mobile.png |
| node .agent/semester-03/discrete-07/validate.mjs | 0；源hash、输出、旧ID/7H2同序、无重复ID/控制台错误、手机宽度核 | validation.log/json |
| npm run math:check | 0；同行块公式违规0 | math.log |
| npm run glossary:check | 0；PASS3/WARN2/FAIL0，两个提示为既有全站项 | glossary.log |
| node --test scripts/check-semester03.test.mjs scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs | 0；30/30，07例外不自动授权08 | tests.log |
| node scripts/check-python-support.mjs | 0；79课、365实验可运行/17保留代码 | python-policy.log |
| node scripts/check-fix-logs.mjs；node --test scripts/check-fix-logs.test.mjs | 0/0；66索引/66详情、两个预留、next069，16测试 | fix-check.log、fix-tests.log |

唯一课程WARN：后续阅读链接event-triggered-control尚为占位，归DISCRETE-10待交付；它不作为本课先修或已教内容，记录到计划，不伪清零。S04历史债务文件不倒改，当前完整性PASS作为07关闭证据。PY-012/013/014仅在本课实际浏览器实跑后关闭，其余17待办原task/category/next保留。W10仅本课三字符图改图文/SVG，不关闭全站；W08/W09和其它课程/润色债务保持原状态。

构建曾拦HTML注释残留与表格裸竖线使sinc成为MDX表达式，修后成功构建，无吞错；失败日志build-before-mdx-review.log/build-before-table-review.log不作为最终验收。术语检查也拦“带宽(rad/s)”被识为别名，改为明确单位栏后复验，不修改词表放宽门槛。

最终npm run check退出0：PASS21/WARN2/FAIL0，node scripts/check-semester03.mjs退出0；见check.log与semester-check.log。初次刷新前5项旧统计不一致保留refresh.log，OUTLINE与tracker由脚本更新后独立check复跑才放行。学期3生产完成56课，合入数先为55，等真实master提交后补记为56。真实master交付提交：82e95f1f6ee5797e6fd129b7d50b4a021db7a051。据真实提交勾合入列，本学期生产与合入均56课，semester-check.log回执merged=56。

最终截图复审拦下预算曲线横坐标换算差十倍（散点与数字正确、曲线错误）。曲线改为逐点调用samplingBudget，不重复公式，随后重建普通/Pages并重新核默认点落在线上、截图及两页面输出。desktop-before-curve-review.png保留反例，不用于最终签发。
