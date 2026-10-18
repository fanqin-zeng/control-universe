# CLASSIC-04「系统稳定性」验收

唯一交付classic/stability-analysis；起点master11187fb，分支wp/classic-04-stability。按重构SKILL及共同Phase1–4；既有十角色是结构化审查视角，不冒充外部专家或独立Agent。完整日志docs/discuss-log/semester-03/03-classic/04-stability-analysis.md，A.1共118行六列对账，C三条限定观察/反例，D逐类来源/保留与传播。只合master，不发布gh-pages；两份用户批阅文件未编辑未暂存。

## 原稿审计与本课改动

baseline-source.json保留旧MDX SHA、14H2/54全级标题ID与四实验。原两Explorer只本课调用，无独立旧讨论日志。保留普通Routh/Hurwitz推导、参数域/平移、根轨迹频域预览、摆反馈、Padé公式与原十题，未拆分或迁出材料。H1与一个长H2短名保留两别名，54旧ID全部可达，URL/prereq不变。

纠正BIBO/内部渐近/零输入Lyapunov混用、虚轴半单与重根、伪首元零例和任意epsilon、重复零行、开环非Hurwitz被当对象不可稳定、双零根被当临界、完整小车力角模型被错误简化。改用固定转轴转矩摆J1/mgl9.8局部模型，说明单位与理想导数限制。频域只预览，给开环极点/围线/频带条件，修正K10的wc1.227064/PM25.389823度/GM9.542425dB。题3补下端K0、题4修行标、题6不用复数大小比较、题8负反馈、题9根实部和全域证明；十题全保留。

时滞G=Kexp(-Ls)/[s(s+2)]默认K5：精确首次边界.4495249623419709s，一阶Padé.47703296142690077s，L.46精确不稳/近似稳。严格区间不含边界，L0单独降阶。唯一正幅值解及正向穿越给全区间结论；minimal.py符号核Re(1/(ds/dL))=2(ω²+2)/(ω²(ω²+4))>0，不以局部根样本穷尽无穷根。题8的另一个1/(s+1)时滞对象单独计算，不套同边界。

## 数值与源一致性

lib/stability-analysis.ts由两Explorer真实调用；verify-classic04.mjs转译实际完整模块，与reference.py独立多项式根/复平面幅相方程brentq互核。20组a2（.5…10/.5）×每组5151三阶网格，2601PD点、12PD极点工况，146组K=.5…15/.1时滞边界全部通过，最大边界误差2.531308496145357e-13。边界/非法参数另核；不把网格最大值称精确最大时滞。

八原始Notebook：定义反例、Routh特殊行、参数/Hurwitz、平移、根轨迹频域、高阶/转矩摆、精确时滞、十题答案。原始setup/cell各自8891新内核实际执行，附加合同全部通过；Pyodide八组全过。原始标签/独立提取/严格内核/浏览器/生产DOM分别计8。最终MDX/reconciliation/browser-python同SHA dc5b9e96edc386a4eb74a55d503795a3b284bbdbde5e0fdb2b8d8986825f4190，112独占围栏/56display，8Notebook16代码块extract/assemble反向逐字全等。69其它课支持记录/政策与30待办逐字段不变；汇总70课/304Notebook/477cell，274启用/30代码展示。

## 最终实际验收

以下命令均退出0，输出持久化在本目录：

| 命令或动作 | 关键输出与文件 |
|---|---|
| python minimal.py；node scripts/verify-classic04.mjs | minimal.log/reconciliation.log/json；真实TS对独立参考，八原始setup/cell与合同 |
| nb-cells verify classic/stability-analysis --require-kernel --out … | notebooks.log/json；EXECUTED8/8，FAIL0/SKIPPED0 |
| nb-cells extract / assemble | extract.log/assemble.log；16块逐字反向全等；roundtrip已删除 |
| 浏览器逐课全部运行 | browser-python.json；8passed/0降级，最终源hash |
| npm run build；npm run build:pages；npx tsc --noEmit | build-delivery.log/pages-delivery.log/types-delivery.log；无MDX编译失败；205课/9旧路由/317525363字节 |
| npm run verify -- classic/stability-analysis | page-delivery.log；PASS9/WARN0/FAIL0/SKIPPED0；HTTP200/H1=1/H2=14/KaTeX错误0，两组件规范均过 |
| node check-browser.mjs（本目录） | browser-check.log/browser-results.json；生产14H2顺序/ID/目录、54旧ID/2别名、56居中auto公式、8实验；两组件共3图/5canvas图层；五滑块端点与恢复、无阻尼与双零根、答案实际Pyodide完成、console无warn/error |
| node check-source.mjs / check-scope.mjs / check-log.mjs（本目录） | source-check.log/scope-check.log/log-check.log；源一致性/69课与30待办不变/固定日志三轮六组与118行对账/唯一签发 |
| npm run math:check；npm run glossary:check | math-fences.log/glossary.log；无坏围栏，术语PASS3/WARN1/FAIL0（既有函数名WARN） |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | regression.log；14测试通过 |
| node scripts/check-fix-logs.mjs | fix-index.log；35详情/35索引+2预留一致，下一编号038；fix037及陈控检查项同步 |
| node scripts/check-semester03.mjs；npm run check -- --fix-outline --fix-tracker-stats；npm run check | semester-check.log检查通过；check-generated.log/check-delivery.log；PASS21/WARN2/FAIL0，已登记WARN |

生产窄屏390px：正文343=scroll343、文档375=scroll375，10section无溢出；3图共5canvas图层均317px宽。narrow.png红蓝图例与曲线一致、无标题/图例/坐标重叠；pd.png显示严格PD域、默认点及虚轴边界不含；opening.png为最终1280px成品，均实际查看。

保留失败与修复：page-draft.log首次PASS7/FAIL2来自轻量扫描误把数学L_作JSX，真实HTTP200；本课改用LaTeX lt、独立核8实验/两组件后page-review及最终verify全过，不宣称W08修复。narrow-draft.png记录首次标题/图例重叠；修top0/只列两项图例后发现默认图例色与线色不一致，又显式itemStyle并重建，最终以delivery构建日志和截图为准。中间build/final日志不是最终发布证据。构建其它旧课告警不在本课改动。

W06/W07/W08/W09均保持待办。严格直接内核与生产Pyodide不是原生IAB网关UI已修的证据。本对话至CLASSIC-04结束。

## 合并

正文、日志、台账与验收同提交；真实no-ff合master后回填本回执及checklist合并列。无gh-pages推送授权，不发布。

实际交付提交b4bd61b；课程no-ff合并e2ef9828b225e15b2fa7714e45589802605b86ea。全局checklist六格按真实合并回填，回执再次no-ff合master后删除工作分支。最终master复核见check-merged.log/semester-merged.log。
