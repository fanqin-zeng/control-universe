# RLEARN-02 模仿学习

2026-10-24用户指定继续RLEARN-02，rank12；本对话只交付本课。起点master 4ecc78b70a3151fe663c33e016c606df7d6a4382。保留开工时306条工作区/索引状态，不重置公共index，不使用其它服务端口，不清理共享.next。

新写：content/robot-learning/imitation-learning.mdx无旧正文。实际先修为已交付robot-learning/robot-data与machine-learning/supervised-learning；原自动微分课尚未交付，本课采用均值及直线闭式拟合，不要求神经网络/自动微分。保持原目标ID，登记用户指定顺序例外。

隔离副本D:/Workspace/control-universe-rank12-rlearn02；页面8203，原生内核9002，均先核对空闲；8202为上一课预览，保留。最终提交使用独立index，只合入本课共享行/对象及资产，保留他人暂存条目。

实际隔离副本初始归档基线为f58b591d4349823e366c3b0dbea9cc8a85871475（base-commit.txt）；上面的4ecc78为开工观察时点，不是构建基线。最终完整候选构建基线为4ed302698915b30c3228a60753bb450d13cf56ed，叠加本课明确文件。所有检查在这个隔离副本执行，不把共享工作区其它会话的中间态算作本课通过。

## 原始执行与交互验收

正文sourceHash：285adfb1b287fb527051ce1d9850d03f0c459b7a5ec41183ef2ecae22186ead9。正文、策略实现与浏览器四个实验一致；最终术语定义编辑后已重新执行，旧hash的结果不充当最终证据。

| 命令/实际范围 | 输出与退出码 | 证据 |
|---|---|---|
| node reference.py、node verify.mjs | 真实TS递推对独立Python解析轨迹450组/4112点；最大差1.3322676295501878e-15；exit0 | minimal-results.json、actual-ts.json、reconciliation.json/log |
| node scripts/nb-cells.mjs verify robot-learning/imitation-learning --require-kernel --port 9002 --out .agent/semester-03/rlearn-02/notebooks.json | 4Notebook/4cell；S1–S8结构前提通过，error0/SKIPPED0；exit0 | notebooks.log/json |
| node browser.cjs --audit（原始浏览器Pyodide） | 4实验原始cell全部passed；与四个干净原生Python进程stdout仅统一换行即逐字相同；exit0 | pyodide.json、browser-audit.log、reconciliation.json |
| node browser.cjs（实际页面） | H1=1、H2=11、真实ID/侧栏一一对应、重复ID0、katex-error0；五预设/六滑块端点/恢复默认读数一致；四个全部运行；390px无整页溢出；console/pageerror空；exit0 | browser.json、browser-page.log、截图 |
| WIKI_VERIFY_PORT=8203 node scripts/verify-lesson.mjs robot-learning/imitation-learning | 生产九项PASS、SKIPPED0；早期draft检查渲染项SKIPPED，不当作全绿；exit0 | verify-draft.log、verify-production.log |
| npm run check -- --fix-outline --fix-tracker-stats，再npm run check | 先生成OUTLINE与台账统计，后权威检查PASS21/WARN2/FAIL0；最终check退出0 | check-refresh.log、check.log |
| NEXT_PUBLIC_STATIC_EXPORT=true npm run build | 浏览器Python模式完整生产构建；210/210静态页生成完成；EXIT_CODE=0 | build.log |
| node scripts/check-semester03.mjs（GIT_DIR指向主仓库，只读核验真实历史） | PASS semester-03 plan/checklist；EXIT_CODE=0 | semester-candidate.log |
| node scripts/check-python-support.mjs | pass:true，99门/420 enabled/14 codeOnly；exit0 | python-policy.log |
| node scripts/glossary.mjs check、rows glossary | PASS3/WARN3/FAIL0；三条新术语各1门/1次，登记英文及别名；exit0 | glossary.log、glossary-rows.log |
| node scripts/format-display-math.mjs --check | files0/tokens0；本课四组独占行display数学；exit0 | math.log |
| node audit-projection.mjs | 其它课程元数据、注册键、术语、计划行、台账行、Python开关/证据逐项不变；exit0 | audit-projection.log |

单cell原生进程墙钟31.8–39.2ms，包含Python启动，不是训练速度比较。全部自建确定性标量数据，无随机种子、数据下载或训练硬件要求。默认候选是手工参数，不冒称训练网络。单轮去重标签聚合不冒称完整DAgger复现；碰撞例只检查截面点。

## 已登记提示与并行隔离

check两项WARN为跨章motion-planning同名及16门旧正文缺日志；glossary三项WARN为旧登记未命中符号、旧NOISE和旧课max/min漏反斜杠。构建中的既有lint/数学严格模式提示没有被改为本课缺陷。开工共享check失败与后续共享学期检查ML-03尚在写证据的失败已留原日志，未修改他课；已提交组合的候选学期检查通过。

初次注册脚本漏匹配带MDXComponents类型注解的注册表，造成500，修复后才执行通过；手机SVG初版字小，已改竖向四节点并目视复核。最后一次启动曾通过serve包装器错误落到8080，立即失败未占用；改为直接next命令指定8203后才继续验收。普通生产构建虽exit0且页面九项PASS，但未继承浏览器模式开关，浏览器实验断言0/4；保留build-native-mode.log/browser-native-mode.log，显式设置NEXT_PUBLIC_STATIC_EXPORT=true重构建后才复验实验。

最终master组合、提交回执与push状态在实际操作完成后追加；完整构建的基线与后来仅合入的并行回执/元数据检查分别记录，不声称对未构建组合重新构建。

最终组合检查基线：3b54cd51cf71de061cebc1995d066d865a0ebbec；check-final.log、semester-final.log、audit-final.log、python-policy-final.log均exit0。完整构建仍以build-origin.json列出的4ed3026组合为准；后续并行课内容未冒称重构建，本课正文/共享运行时未变。
