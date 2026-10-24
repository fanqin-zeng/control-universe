# EST-04 扩展卡尔曼滤波：验收完成，待master回执

2026-10-24用户指定继续EST-04，rank4。入口无MDX，catalog=empty，计划为新写。唯一课程estimation/extended-kalman-filter；已交付先修EST-03、多元微积分、Lyapunov稳定性。后续UKF不作为前提，也不在本次生产。

使用wiki-lesson-new与既有Phase1—4，日志docs/discuss-log/semester-03/10-estimation/04-extended-kalman-filter.md。起点baseline-commit.txt。完成10H2、2Notebook4cell、1Explorer、SVG、四题四答；Phase1—4已完成并签发，数字以最终原始实验为准。

独立运行副本D:/Workspace/control-universe-rank4-est04；Next18564、Pages18664、内核19364、Pyodide夹具18364，启动前检查占用。共享master有并行草稿及暂存内容，不复位其索引；提交用私有索引和CAS，只叠加本课；不发布gh-pages。


最终正文279行；LF规范化sourceHash=8a6d1d5cac5b2c0c3de35b2d7c1f8e84a18cdf8170410ad98eb8d071149ceff5。四个课程资产指纹与实际构建副本相同，见source-fingerprints.json。

| 实际命令/操作 | 退出码及结果 | 证据 |
|---|---|---|
| reconcile.mjs真实TS对独立积分/精度形式/几何/模运算 | 0；72配置17352点，最大差1.5631940186722204e-13，容差1e-9 | reconciliation.json/log、reference.py/json、actual-ts.json |
| nb-cells verify --require-kernel --port19364 | 0；2Notebook4cell，EXECUTED/error0/SKIPPED0 | notebooks.json/log、extracted.json |
| 原始Pyodide完整执行 | 0；2Notebook4cell全部passed，最终sourceHash一致 | pyodide.json/log |
| 正常npm run build与完整npm run build:pages | 各0；无MDX编译失败 | build.log/pages-build.log/runtime-commands.json |
| verify-lesson estimation/extended-kalman-filter | 0；HTTP200/H1=1/H2=10/KaTeX0，九项PASS无FAIL | verify.log |
| 正常/静态真实页面 | 各0；4cell、72控件+恢复+重绘、375px、图片和精确锚点、console/pageerror0 | browser-native/pages.json及截图 |
| validate-final.mjs | 0；最终源码/原始cell/独立数值/两页/构建副本指纹交叉一致 | validation.log/source-fingerprints.json |
| math:check/glossary:check | 各0；适用术语/符号门槛通过，WARN另留日志 | math.log/glossary.log |
| catalog/semester/Python限定快照 | 各0（初次生成刷新可exit1，后续只读check必须0） | scope-commands.json、check/semester-check/python-policy.log |

普通和静态完整构建基线为6ebdfe534e647b416e230f9182803d5e895e2074叠加本课，最终提交前另按最新master重建限定快照再跑权威check/semester/python。共享工作区开工检查受其它课草稿/行格式影响而失败，保留opening日志，不冒充已通过；不改其它课程。首次积分尾部与启动时机失败留原始日志；最终审校把稳定性示例改为期望递推并补打印4/9，最终hash相关验收全部重跑，before-review只作历史记录。

真实master提交与推送结果待提交后追加；不发布gh-pages。
