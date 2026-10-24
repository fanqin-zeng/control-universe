# EST-06 粒子滤波：验收完成，已进入master

2026-10-24用户指定继续EST-06，rank4。catalog空占位且无正文，新写；先修估计问题/随机过程/数值计算已交付，UKF只作动机延续。

仅本课；Phase1—4已完成并签发。完成10H2、3Notebook6cell、ParticleFilterExplorer、纵向SVG。原始cell、独立概率计算、随机多种子及两种实页必须实跑。

独立副本D:/Workspace/control-universe-rank4-est06；Next19646/Pages19746/Jupyter19846/fixture19946已bind确认可用，启动前再验。保留并行源码/共享索引与共享缓存，基线见baseline-commit.txt。开工共享检查如受其它课程草稿影响则原样记录，不代修其它课。


最终正文362行；LF sourceHash=b6581a1f13a73ec2ea60a5c27aacd5e783984c40d6f5df65c3ce6444e91e404e。四个课程资产指纹与构建副本一致，见source-fingerprints.json。

| 实际命令/操作 | 退出码与结果 | 原始证据 |
|---|---|---|
| reconcile.mjs，实际TS对独立SciPy权重/祖先/quad | 0；114配置，标量最大差8.065034751147948e-12<1e-9，CDF最大差8.899779690985099e-9<1e-6 | reconciliation.json/log、reference.py/json、actual-ts.json |
| 三Notebook原始代码与独立逐拍参考 | 0；90单拍/30逐拍×20，801点矩阵对2001点FFT最大差8.242295734817138e-15 | original-python.json/log、monte-carlo.json、sequential.json、independent-sequential.json |
| nb-cells verify --require-kernel --port19846 | 0；EXECUTED/3Notebook6cell/error0/SKIPPED0 | notebooks.json/log、extracted.json |
| 原始setup/cell Pyodide完整执行 | 0；3Notebook均passed/6cell，最终sourceHash一致 | pyodide.json/log |
| npm run build与官方npm run build:pages | 各0；SSG完成，无MDX编译失败 | build.log/pages-build.log/runtime-commands.json |
| verify-lesson estimation/particle-filter | 0；HTTP200/H1=1/H2=10/KaTeX0 | verify.log |
| 普通/静态真实页面原始cell与交互 | 各0；6cell/114控件+恢复+重绘/375px/精确标题与ID/侧栏目标/图片/console及pageerror0 | browser-native/pages.json及PNG |
| validate-final.mjs | 0；源码/原始cell/contract/随机数据/两实页与构建副本指纹交叉相同 | validation.log/source-fingerprints.json |
| math:check/glossary:check | 各0，WARN原样保留 | math.log/glossary.log |
| 限定投影catalog/semester/Python策略 | 各0；首次刷新生成允许exit1，随后只读check必须0 | scope-commands.json、check/semester-check/python-policy.log |

完整构建基线为已提交02e79e304684b094640581644d55ea14dffc0807叠加本课，最终提交前另按最新master重新生成限定快照，再跑权威npm run check/semester/Python/术语/数学门槛。共享开工检查失败留opening日志，不修改其它课程草稿或共享索引，不把全站WARN说成本课独占成果。首次小于N的数学写法被目录扫描误识别，已改LaTeX反斜杠lt并让最终hash相关验收重跑；before-review仅留历史失败，不作最终通过。

真实master交付提交commit:7a7377f21f6b1538b3fb0e3cd19dd82260472484，git push origin master退出0，详见push-main.json/log；不发布gh-pages。

提交投影父提交3f014392284f52fd77bfdb5305e39fe656f89884；最终npm run check为PASS21/WARN2/FAIL0，semester/Python/术语/数学门槛全部exit0。提交语义差异已核：catalog其它课程、注册表其它条目、checklist其它行保持不变，Python策略与合并报告均只变更EST-06课条目。共享运行依赖与已构建基线相比无变化。commit-scope-audit.json记录实际审计。
