# EST-02 统计估计

2026-10-24用户指定继续EST-02，rank4。入口为空占位，新写唯一一课：estimation/least-squares-ml。必需先修为已交付EST-01、概率基础与凸优化；辨识/实现/机器学习其它未签发课程不作为前提。

运行副本D:/Workspace/control-universe-rank4-est02；Next18204、严格内核19204、浏览器原始实验夹具18304、Pages18404，启动前检查占用。保留EST-01和其它会话资源；不修改共享端口、.next、环境或服务。共享文件仅合入本课局部变更，只提交推送master，不发布Pages。

Phase1–4完成并签发。正文272行、10H2、2Notebook/4cell、1Explorer、1SVG、四题四答；高斯模型等价条件、偏差/方差/一致性、先验失配与不同损失边界完整。

| 实际命令 / 操作 | 退出码与实测 | 证据 |
|---|---|---|
| node .agent/semester-03/est-02/reconcile.mjs | 0；75真实TS配置、9075曲线节点对独立Fraction最大差8.526512829121202e-14 | reconciliation.log/json、actual-ts.json、reference.py/json |
| node scripts/nb-cells.mjs verify estimation/least-squares-ml --require-kernel --port 19204 | 0；2Notebook/4cell，EXECUTED/error0/SKIPPED0 | notebooks.log/json |
| 原始Pyodide完整执行 | 0；2实验/4cell全passed，最终源码hash一致 | pyodide.log/json |
| 正常npm run build | 0；无MDX编译失败；ffc674e叠加本课 | build.log |
| WIKI_VERIFY_PORT=18204 node scripts/verify-lesson.mjs estimation/least-squares-ml | 0；HTTP200/H1=1/H2=10/KaTeX0，PASS9/WARN0/FAIL0 | verify.log |
| node …/page-audit.cjs | 0；原生实际DOM/四cell/75控件+恢复/375px/图片/锚点/无错误 | browser-native.log/json、native截图 |
| PAGES_BUILD=1 NEXT_PUBLIC_BASE_PATH=/control-universe NEXT_PUBLIC_STATIC_EXPORT=true npm run build | 0；3e87c23叠加本课，静态构建通过 | pages-build.log |
| EST02_PAGE_URL=本地Pages预览 EST02_AUDIT_NAME=pages node …/page-audit.cjs | 0；基路径、四cell、75控件与实际曲线重绘、375px均过 | browser-pages.log/json、pages及边界截图 |
| node …/validate.mjs | 0；最终源码、原始cell、严格内核、数值和两种页面交叉一致 | validation.log |
| npm run math:check；npm run glossary:check | 0；围栏违规0；术语PASS3/WARN2/FAIL0 | math.log、glossary.log |
| npm run check；node scripts/check-semester03.mjs | 0；PASS21/WARN2/FAIL0，计划PASS | check.log、semester-check.log；签发后提交投影另留证据 |
| node scripts/check-python-support.mjs | 0；静态快照94课/402可运行/15代码展示，包含其它会话已提交修复，不归本课关闭 | final-python-policy.log |

正文最终LF规范化SHA256：7b7c05b44dd7b3321157039177b16ab7deb4e42c1572b8f3430c512d1d63d0cb。四cell补打印权重、后验精度和偏差/方差后全部重跑；未使用旧hash签发。M3首次类型失败（缺markPoint.name）留build-first-typecheck.log，修正后正常与静态build通过。开工共享目录check受并行状态影响exit1，opening-check.log不算通过；本课独立投影另有成功证据。仅推master，Pages不发布。
