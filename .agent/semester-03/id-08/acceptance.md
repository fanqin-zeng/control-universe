# ID-08 非线性辨识

2026-10-24用户指定rank3继续本课，空课新写；按wiki-lesson-new及既有learning矩阵Phase1–4。先修持续激励、自动微分、时序模型、非线性系统均已交付。只交付ID-08。

正文302行/11H2、4题/4答案、3Notebook/3cell、1React Explorer、1SVG。覆盖非线性结构、固定特征NARX、一步/自由滚动、非线性激励、数据分区/选择与外推。只运行小型特征最小二乘，不声称训练神经网络或真实设备标定；保留验证好却外推失败、二值特征共线与零输入拒绝。

隔离D:/Workspace/control-universe-rank3-id08；内核/native动态空闲端口，fixture/Pages绑定端口0并核PID/根目录。共享.next、8080/8891、他人修改与共享Git暂存保留。开工共享check PASS19/WARN2/FAIL6，原始opening-check.log；最终基于最新HEAD叠本课验收，不称共享草稿全站通过。

| 验收 | 实际结果 | 本目录证据 |
|---|---|---|
| 实际TS/独立数值 | 72配置、96重复记录、195120量，maxError6.217248937900877e-15<1e-9；14非法输入；QR vs NumPy SVD，真/预测轨迹另对lfilter | actual-ts.json/log、reference.py、reconciliation.json/log |
| 数据隔离与轴界 | 改测试幅值后训练/验证全记录、两模型系数/验证预测/指标及选择完全相同；peak输出3.920271<5，maxRMSE1.889604<2 | actual-ts.json/log |
| 实际浏览器数值 | 840分布读数差5.995204332975845e-15<1e-9，验证选择全等 | browser-numeric.json、pyodide.json |
| 原始严格内核 | EXECUTED，3Notebook/3cell、error0/SKIPPED0、exit0 | notebooks.json/log、numeric-commands.json |
| 最终源码Worker | 3/3 passed/enabled，实际抓取Worker hash比对，不以模拟运行替代 | pyodide.json/log、worker-served.json |
| 双构建 | 修复hook导入、ρ消歧与短图例后的最终原生/Pages各exit0，无MDX编译失败 | build/pages-commands.json、build.log/pages-build.log |
| 单课verify | exit0、HTTP200、11H2/KaTeX0、习题/答案与前端规范通过 | verify.log、verify-commands.json |
| 两实际页面 | 全部Notebook运行、6预设/控件端点/秩失败/恢复、实际标题ID/目录/重复ID、SVG/两个canvas、375px均过；pageerror0，最终截图已查看 | browser-native/pages.json/log、各截图、visual-review.json |
| 目录/学期 | check PASS21/WARN2/FAIL0、学期exit0，v1.3切换后重跑 | final-check.log、final-semester.log、check-commands.json |
| 策略/术语/公式 | Python策略exit0；术语PASS4/WARN2/FAIL0，公式files0/tokens0 | python-policy.log、final-glossary.log、final-math.log |
| 证据交叉核 | 最终sourceHash、原始cell、实际Worker、双页DOM/控件/素材与退出码 | validate.mjs、validation.log |

最终sourceHash `be270b8ce732ef1b403df8ede13ab421c1d1ef32d7eed749008f497c6da5d85d`，Worker取worker-served.json/pyodide.json相同值；源与cell只统一CRLF/LF。构建基线build-base.txt，提交前目录/策略基线scope-base.txt；其他课程已提交成果保留，未提交草稿不带入。

讨论日志A.1逐断言六列表、B原九项/四附加门槛、C六列红队放行完整。三工况32种子、两模型全指标/选择均披露；线性持平、三次外推落败保留，测试不回选；经验分位不当置信区间，结构复杂度不同不作通用算法排名。

首次hook遗漏的生产构建exit1保留initial-build-missing-hook.log/initial-build-commands.json；修复后最终两模式重新构建并实测，不用失败当成功。符号ρ消歧后Worker按最终hash再跑，短图例修复后双模式实页再验。

资源回收：两轮自己的共9个遗留kernel DELETE至0，内核/夹具核PID后关闭，原生/Pages/浏览器finally关闭；first-cycle与当前ports/kernels/resources回执都保留。私有索引/CAS保留共享暂存，正常push master，不发布Pages；真实提交后补hash回执。

真实交付提交：`c76c82bb6ea2b2e32bed6ad95fa2315c80d50e0a`，已进入master。共享Git索引保留，本课使用私有索引与master旧值比较后原子更新；回执补充最终检查输出。
