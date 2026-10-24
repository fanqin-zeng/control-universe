# EST-05 无迹卡尔曼滤波：验收完成，已进入master

2026-10-24用户指定继续EST-05，rank4。空占位新写，不沿用旧正文；先修KF和概率基础已交付。EKF为本课已交付对照，不增改先修图。

仅本课，完成10H2、2Notebook4cell、UnscentedKalmanExplorer、sigma点SVG；先执行最小实验，再扩写。Phase1—4已签发，所有数值以最终原始输出为准。

独立副本D:/Workspace/control-universe-rank4-est05；端口Next18584/Pages18684/Jupyter19384/fixture18384启动前逐一bind确认空闲。不改共享缓存、端口与索引。基线见baseline-commit.txt。开工check及semester输出/退出码留opening日志；其他课程草稿失败不代修。



最终正文260行；LF sourceHash=735b96e48b488b0735a940e21713bb53d58ca6273fc62396236e227ba03ad45c。四个课程资产指纹与构建副本一致，见source-fingerprints.json。

| 实际命令/操作 | 退出码与结果 | 原始证据 |
|---|---|---|
| reconcile.mjs，实际导出TS/独立Gaussian矩、precision、quad、GH | 0；72配置17352点，最大差1.5631940186722204e-13，阈值1e-9 | reconciliation.json/log、reference.py/json、actual-ts.json |
| nb-cells verify --require-kernel --port19384 | 0；EXECUTED/2Notebook4cell/error0/SKIPPED0 | notebooks.json/log、extracted.json |
| 原始setup/cell Pyodide完整执行 | 0；两Notebook均passed/4cell，最终sourceHash一致 | pyodide.json/log |
| npm run build与官方npm run build:pages | 各0，SSG完成，无MDX编译失败 | build.log/pages-build.log/runtime-commands.json |
| verify-lesson estimation/unscented-kalman-filter | 0；HTTP200/H1=1/H2=10/KaTeX0 | verify.log |
| 普通/静态真实页面原始cell与交互 | 各0；4cell/72控件+恢复+重绘/375px/精确标题锚点/图片/console及pageerror0 | browser-native/pages.json及截图 |
| validate-final.mjs | 0；最终源码/原始cell/数值/两页与构建副本指纹交叉相同 | validation.log/source-fingerprints.json |
| math:check/glossary:check | 各0，WARN原样保留 | math.log/glossary.log |
| 限定投影catalog/semester/Python策略 | 各0；首次生成刷新允许exit1，后续只读check必须0 | scope-commands.json、check/semester-check/python-policy.log |

完整构建使用已提交基线5413ca168ac86c41b3974375ae7f355022f7841e叠加本课，提交前另按最新master重新生成限定快照，跑权威npm run check/semester/python策略。共享开工check/semester失败保留opening日志，不改其它课草稿，不把全站旧课WARN说成本课独占成果。原始数据全部版本化，未用本机临时logs替代唯一交付证据。

真实master交付提交commit:61aaf292057ac2fa04414c9730d1ce9676b7f465，git push origin master退出0，详见push-main.json/log；不发布gh-pages。

提交差异复核：Python策略仅修改EST-05条目，报告只追加本课和合并元数据；发现notation头部说明中的同名标记被匹配，多插入本课符号行。追加修复收窄为独占行哨兵并删除说明处的本课重复行，保留原有其它内容，重跑术语检查；课程资产指纹不变。修复证据见notation-fix-gates.json。

符号表哨兵修复已进入master：commit:3cf0621900d36e317fd4e4c94ccab0d94e9a8249；术语检查exit0，数据表仅保留一条本课chi登记，不改课程源码。
