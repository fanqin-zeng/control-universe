# EST-03 卡尔曼滤波：验收完成，待master回执

2026-10-24用户明确指定继续EST-03，rank4。仅重构estimation/kalman-filter；EST-01与EST-02已交付。保留其它会话草稿、暂存区、端口与服务。使用独立运行副本D:/Workspace/control-universe-rank4-est03；Next18544、内核19214、实验夹具18314、Pages18644，启动前检查占用。

入口审计：原稿909行、12个H2、3Notebook各1cell、10题含全部子问。source-before.mdx保存原始正文；baseline-commit.txt固定起点。旧modern/kalman-filter已由S02迁移，目标URL及原12个H2锚点保留。本轮使用wiki-lesson-refactor，Phase1—4已完成并签发。

主要缺陷：Luenberger被误说不能处理噪声；高斯最优性和线性最优性未区分；连续白噪声被当逐点方差；对偶交换Q/R错误；可检测/可稳定条件错置；LQG鲁棒保证错误；sim噪声缺sqrt(dt)且时间轴错位；缺plt导入/ipywidgets；答案2推导与7建模需纠错；2/10极点原舍入复算确认可接受；答案4把过程噪声说成惩罚函数。S04存量Notebook债务由本课负责，不借机关闭其它课。

最终正文444行、12H2、3Notebook6cell、1Explorer、1SVG、原10题全部子问。sourceHash（LF）=6205a0fad4c8ce16ac09bf11522d73b6ff47730969d7f3be9271d21aacd5131e。

| 命令/操作 | 实测退出码及结果 | 证据 |
|---|---|---|
| reconcile.mjs真实TS对独立数值 | 0；15配置1515点，最大差5.346834086594754e-13，容差1e-10 | reconciliation.json/log、reference.py/json |
| nb-cells verify --require-kernel --port19214 | 0；EXECUTED/6cell/error0/SKIPPED0 | notebooks.json/log、extracted.json |
| Pyodide原始实验 | 0；3Notebook6cell、最终sourceHash一致 | pyodide.json/log |
| 正常npm run build与npm run build:pages | 各0；无MDX编译失败 | build.log/pages-build.log/runtime-commands.json |
| verify-lesson estimation/kalman-filter | 0；HTTP200/12H2/KaTeX0，PASS9/WARN0/FAIL0 | verify.log |
| native18544与Pages18644真实页面 | 各0；六cell/15控件+恢复/重绘/375px/旧URL/图片/锚点/浏览器错误0 | browser-native/pages.json及截图 |
| validate-final.mjs | 0；最终源hash/原始cell/严格内核/数值/两页面交叉一致 | validation.log |
| math:check/glossary:check | 各0；中文与符号WARN按日志记录 | math.log/glossary.log |

最终普通与静态构建为bae122d38cad76d02da19513aa3aace7a9908710叠加本课，仅私有副本运行。最新master提交前另以CAS父提交重建元数据投影、跑catalog/semester/python门槛，记录commit-gates.json。共享check开工FAIL属于并行草稿，不作已通过证据。端口18214冲突保留原进程改18544，脚本初始化等待与第一次ODE失败均留日志。fix079归因既有规则执行不足；2/10原极点舍入复算可接受，未虚报错误。

真实master提交与推送结果待提交后追加；不发布gh-pages。

签发前独立投影catalog PASS21/WARN2/FAIL0、semester PASS、Python策略PASS，scope-commands.json记录实际退出码。最终Pages完整命令生成205课/9兼容入口，artifact约298MB；仅本地预览。首次遗漏Pages后处理与CRLF/LF验证脚本问题保留失败证据，已复验关闭。
