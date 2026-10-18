# DISCRETE-04 验收记录

2026-10-19；重构「Z域系统分析」，起点master 523e282。原稿、原始内核失败及旧ID基线分别留source-before.mdx、baseline-notebooks.json/log、headings-before.json与browser-before.json。

已完成：11H2、四组原题全部子题、5Notebook6cell、模态映射交互与SVG。31原标题主题保留，36个旧课程ID和一个旧框架ID均在实际DOM仍可达，四个短名标题使用显式旧别名；逐标题见source-audit.md，纠错传播见讨论日志附录D。

最终MDX SHA256（LF归一化）：c93ad61e9fafc0931a31a79fca1ac3b0c05a61c6538b1eb6c6ef51dde573bf6f。

| 命令/操作 | 退出码与结果 | 原始证据 |
|---|---|---|
| JUPYTER_PORT=8981 node scripts/verify-discrete04.mjs | 0；真实TS十配置210复点对60位mpmath最大偏差4.163336342344337e−16；二阶两方法1500复频点与200递推点、解析题解独立复算通过 | reconciliation.log/json、actual-ts.json、reference.py |
| node scripts/nb-cells.mjs verify discrete-sampled/z-transform-analysis --require-kernel --port 8981 --out .agent/semester-03/discrete-04/notebooks.json | 0；5Notebook6cell，真实内核error0；PASS1/WARN0/FAIL0/SKIPPED0 | notebooks.log/json |
| npm run build | 0；静态课程生成，无MDX编译失败 | build.log |
| WIKI_VERIFY_PORT=8183 npm run verify -- discrete-sampled/z-transform-analysis | 0；九项全PASS，HTTP200，H1=1/H2=11，KaTeX错误0 | verify.log |
| 浏览器Pyodide逐课实跑 | 5组6cell全部passed | pyodide.json |
| 普通实际课程页全部运行 | 5组6cell输出与原生逐字相同；三滑块边界、四预设和恢复默认实测，error0 | browser-native.json |
| Chrome375px布局 | innerWidth375、scrollWidth367、KaTeX错误0 | browser-mobile.json、mobile.png |
| npm run build:pages | 0；205课、9旧入口、basePath=/control-universe | pages-build.log |
| 实际静态课程页全部运行 | 5组6cell输出与原生逐字一致；SVG基路径正确，error0 | browser-pages.json、desktop.png |
| node .agent/semester-03/discrete-04/validate.mjs | 0；最终hash、原生/Pyodide/两页面文本一致；11H2同序、全部旧ID保留、无重复ID | validation.log/json |
| npm run math:check | 0；同行块公式违规0 | math.log |
| npm run glossary:check | 0；PASS3/WARN2/FAIL0为既有全站提示 | glossary.log |
| node --test scripts/check-semester03.test.mjs scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs | 0；27/27 | tests.log |
| node scripts/check-python-support.mjs | 0；79课，355实验可运行，24保留代码 | python-policy.log |
| node scripts/check-fix-logs.mjs | 0；63索引/63详情、两个预留、next066 | fix-check.log |
| node --test scripts/check-fix-logs.test.mjs | 0；16/16 | fix-tests.log |
| npm run check | 0；PASS21/WARN2/FAIL0；由脚本重算OUTLINE与tracker | check.log、refresh.log |
| node scripts/check-semester03.mjs | 0；台账/计划/单课顺序例外一致 | semester-check.log |

PY-007旧模态实验从代码展示恢复运行，从pending仅移除此项，其他24项task/category/next元数据保留。原始blue-失败证据保留；fix065登记ZOH漏1/a、错误离散幂及题2c等纠错与既有职责执行不足。必要索引门槛先报七项旧问题，fix-check-before.log原样留存；仅规范046主路径及059–064原文明确类型的frontmatter，未改历史正文，复跑全表通过。

IAB视口set未实际改变innerWidth，故375px证据改由真实Chrome产生，不冒充响应式通过；普通IAB实际实验运行通过。W09旧跨环境问题不顺带关闭。W10仅审核本课字符平面图改SVG，其余候选保留。早期build-before-layout-review.log不用于最终签发；最终证据均绑定上述hash。

用户明确指定DISCRETE-04，单独登记暂缓DISCRETE-01；已交付差分方程、Z变换和传递函数为主要起点，保持输入局部解释。只交付本课，DISCRETE-01草稿、用户proofreading与本地端口四文件排除提交。Pages仅本地构建，无公网发布授权。

master交付提交：149bac2092969d2d817f68f879a29376f073d7f4。本学期生产完成53课；合入列据真实提交勾选。git diff --check中原稿snapshot的三处历史行尾空格原样保留，不修饰原始审计证据；交付源码无新增行尾空格。
