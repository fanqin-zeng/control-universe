# INTEL-01 模糊控制

2026-10-24 用户明确指定 INTEL-01，rank7；从已有正文重构，本对话只交付此课。起点 HEAD 58811f8fe3defeff14261bb1ccc5f8ab1dcfa685。独立副本 D:/Workspace/control-universe-rank7-intel01；独占端口 Next18197、Jupyter8997、实验18397、Pages18497（开工均未监听）。不修改共享端口脚本、不清理共享.next、不停止其它会话服务。

按 wiki-lesson-refactor、semester-03-core 与 wiki-discussion Phase1–4 执行。源正文归档 source-before.mdx，原9实验提取 notebooks-before.json。保留12 H2、全部6题/答案、倒立摆/洗衣机/ABS/在线成本主题、旧URL与锚点。纠正凸组合条件、划分覆盖范围、积分精确性、MOM定义、有限时域推断与方法排名、认证泛化；用独立积分参考对实际TS函数核对，不以同源脚本互证。

当前：Phase1–4与实际验收通过，郑核已签发，待真实master提交回执。Pages仅本地验收，未发布。其他会话暂存与未提交文件不属于本课。

最终范围副本 D:/Workspace/control-universe-rank7-intel01-final 由已提交master加本课局部差异组成，基线见scoped-base.json；只更新本课的计划/清单/台账/Python记录，保留其它会话内容和暂存。用户批阅、共享端口脚本、中文润色分支与gh-pages排除。

交付：原12H2/全部旧H3、48旧生成ID、6题所有子问、原9Notebook32cell与四联图均保留；新增默认值/条件反例实验后共10Notebook33cell，以及洗衣机生活入口SVG。生产计算移到lib/fuzzy-inference.ts，沿用原组件名与注册；MOM改全部最高采样点均值，补默认恢复、宽重叠/无覆盖提示及窄屏。12宽表局部滚动。

主要纠错：归一化凸组合条件；覆盖与单位划分区别；FAMM统一行角度列角速度，规则/表头/习题/打印同步；面积与一阶矩积分、平顶与非零支撑；采样相邻差不冒充连续曲面跳变；有限仿真不推出极限环、方法排名、Mamdani不能证明稳定或认证不可能。原资产去向见讨论日志附录D。

## 实际验收

以下命令均退出0，完整输出在本目录；原生/浏览器证据保留原始结果，不把SKIPPED当通过。

| 命令/方式 | 实测结果 | 证据 |
|---|---|---|
| npm run check（提交范围副本） | PASS21/WARN2/FAIL0 | scoped-check.log |
| node scripts/check-semester03.mjs | 21章205课、来源和阶段顺序有效 | scoped-semester.log |
| node scripts/check-fix-logs.mjs | PASS；并行72–74在范围快照预留，不收入其它课未提交记录 | scoped-fix-check.log |
| npm run math:check / glossary:check | 块公式files0/tokens0；术语FAIL0，现存WARN保留 | scoped-math.log、scoped-glossary.log |
| WIKI_VERIFY_PORT=18197 node scripts/verify-lesson.mjs intelligent/fuzzy-control-basics | PASS9/WARN0/FAIL0/SKIPPED0 | verify.log |
| node scripts/nb-cells.mjs verify intelligent/fuzzy-control-basics --port 8997 --require-kernel | 33cell/error0，无SKIPPED；仅loc=best图例负载WARN | notebooks.log、notebooks-verified.json |
| 原9实验起点严格执行 | 32cell/error0 | baseline-kernel.log/json |
| node scripts/verify-intel01.mjs | 868真实TS配置、6非对称/边界点、10实验输出 | reconciliation.log/json、reference.json、actual-ts.json |
| python .agent/semester-03/intel-01/dynamics-reference.py | 28独立ODE工况、4恒扰动平衡 | dynamics-reference.log/json |
| 原始浏览器Pyodide实验 | 10/10放行、33cell无error | pyodide-download.json、pyodide.json |
| 原生/Pyodide逐量对账 | 1125确定性数值完全一致；计时分开报告 | validation.json/log |
| npm run build / build:pages | MDX正常；静态导出205课/9旧入口 | build-final.log、pages-build-final.log |
| node scripts/check-python-support.mjs | PASS；本课10实验可运行 | scoped-python-policy.log、refresh.log |
| 实际原生/375px/Pages DOM与参数操作 | H1=1,H2=12,katex-error=0,3canvas，两图加载，48旧ID保留 | browser-native.json、browser-mobile.json、browser-pages.json |
| 375px同源iframe | document/body宽360px，无整页溢出 | browser-mobile.json |
| Pages默认值实验实际UI | 运行完成，basePath资源正常 | browser-pages.json |
| node .agent/semester-03/intel-01/validate.mjs | pass=true | validation.json/log |

三方默认值n5、h/s1、x5、601网格：COG=-30/11≈-2.727273、Bisector=-15/8=-1.875、MOM=0。独立TS参考最大差1.34e-13；双输入自适应积分参考最大离散差1.01e-7Nm。独立连续反馈DOP853与课内dt1e-4保持输入RK4语义不同，rms容差标称0.006°/摄动0.012°，不冒充同一离散系统。四恒扰动平衡角0.310345/0.813109/1.762455/4.150872°。

## 证据边界与并行处理

末轮表格滚动与散文改动不改变任何setup/cell字符串。refresh-proof.mjs逐字符串核浏览器原fixture；reconciliation-final.json对source-tested.mdx作同样核对后登记最终源hash。原始下载与原生输出保留。计时实验只报告当次机器与负载，不保证1kHz预算；所有方法比较只放行原模型/固定候选下的有限观察，未声称真实车辆或认证优势。

首次共享快照带入其它会话未完成组件，check.log中的计数FAIL不属于本课；scoped-check.log为只含已提交master与本课差异的有效验收。首次并发原生复跑触发30s超时，保留loaded-timeout.log；清理仅8997闲置UI内核后串行重测通过，没有扩大超时。build.log的首次lint错误已修复，最终结果为build-final.log。第一次viewport override没有改变目标页，未当作手机通过；实际375px首次测得616px，修12张宽表后360px。

本课日志docs/discuss-log/semester-03/13-intelligent/01-fuzzy-control-basics.md含A三方对账/B九项/C红队有限观察/D原资产去向。fix-075与林矩审查清单已同步。真实master提交/推送hash产生后再追加，不预填。


## master 回执

真实交付提交：commit:3d2360804c416a0081ef295196ecf7ef8f5799ce；父提交676c46b89f068e5ed2c6f9c1be4cd49d76542b5c。独立索引只合入本课差异，实测保留141项其它会话暂存条目。课程回执以该已进入master的提交为准，后续文档回执单独追加。Pages未发布。
