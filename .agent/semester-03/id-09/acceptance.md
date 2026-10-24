# ID-09 系统辨识案例

2026-10-24用户指定rank3继续本课，空课新写，按wiki-lesson-new及case矩阵Phase1–4。仅交付本课；开工时评估先修为空，局部补足分区/冻结并用已交付ID08支撑，未补写另一课。

正文383行/11H2、4题4答案、3Notebook/3cell、1React Explorer、1SVG。覆盖水箱实验合同、时序、闭环OLS/IV、验证冻结、独立测试、H1/残差、三工况分布与拒绝。真实默认IV测试RMSE0.265683cm，变化对象测试0.297407cm虽过绝对门槛，却因改善−13.763%拒绝；不声称真实设备部署授权。

隔离D:/Workspace/control-universe-rank3-id09；动态kernel/Next端口，fixture/Pages绑定0核PID。共享.next、8080/8891和他人暂存保留。开工共享check退出1，6个并行状态/自动统计FAIL见opening-check.log；最终基于已提交HEAD只叠本课，未修其它课程草稿。

| 验收 | 实际结果 | 证据 |
|---|---|---|
| 独立数值 | 64配置、96重复、1834712量，maxError5.595524044110789e-14；16非法输入拒绝；QR/矩方程对NumPy lstsq/FFT与SciPy lfilter | actual-ts.json/log、numeric.json、reference.py |
| 冻结与坐标 | 测试对象变化不改训练/验证/选择；peak1.067280与maxGain1.127919均在1.5固定范围 | actual-ts.json/log |
| 原始内核 | EXECUTED，3Notebook/3cell，error0/SKIPPED0，exit0 | numeric-commands.json、notebooks.json/log |
| 实际Worker | 3实验passed/enabled，实际服务Worker hash相同；完整输出无truncated | pyodide.json、worker-served.json |
| 浏览器数值 | 1023量maxError2.109728750469842e-15，含全部96行，原始setup/cell逐字全等 | browser-numeric.json、notebook-expected.json、raw-python-output.txt |
| 双构建/单课 | 最终原生/Pages build exit0，verify exit0，无MDX失败 | build/pages/verify-commands.json及logs |
| 实页交互 | 两页HTTP200、3Notebook实跑、6预设/10端点/拒绝/恢复；11H2文本/ID/目录逐量对齐、无重复ID/KaTeX错误、两个canvas/SVG加载、375px无溢出/pageerror0 | browser-native/pages.json、截图、visual-review.json |
| 目录与治理 | check PASS21/WARN2/FAIL0；semester PASS；Python策略exit0；glossary PASS4/WARN2/FAIL0；math files0/tokens0；真实KaTeX59表达式 | check-commands.json、final-*.log、python-policy.log、math-render.json |
| 证据一致 | 最终sourceHash、原始cell、Worker字节、双页面DOM/素材/退出码全部核对 | validate.mjs、validation.log |

最终sourceHash `1178e1153544aa4eccaa925f7a8a2bbae74749208659d0350a3a5abb9ab16195`。构建基线build-base.txt；集成前目录/策略另按scope-base.txt最新HEAD复核。四份档案集中于讨论日志Phase1–4、A.1、B九项/四追加、C六列。OLS/IV同模型类、同训练预算、独立估计；无噪声持平、弱工具10/32拒绝与测试负改善均保留，条件分位不冒充总体性能或统计置信界。

首轮Notebook属性、Worker输出截断、表格窄屏和符号嵌套错误均已修复并重跑适用门槛，归因见讨论日志D；不把首次失败写作通过。资源、提交与正常push实际完成后追加回执，不发布Pages。

资源回收：自有端口内12个kernel已DELETE，health剩余0；核PID/命令行后关闭自有kernel与fixture服务，原生/Pages/浏览器由finally关闭；详kernels-closed.json和resources-closed.json。他人进程未操作。
