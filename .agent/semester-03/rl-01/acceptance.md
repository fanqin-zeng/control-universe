# RL-01 强化学习问题

2026-10-24，用户指定继续RL-01，rank8。唯一目标rl-control/rl-basics；其余会话课程保持原状。开工master，存在大量并行与用户未提交修改，不清理、不整体暂存。共享catalog、注册表、计划和策略文件只按本课局部合并。

使用独立运行副本D:/Workspace/control-universe-rank8-rl01，页面/验收8198、内核8998、静态预览9198、原始Pyodide资源9298；启动前检查空闲，不碰共享.next/out、不停止别人的进程。本地Pages验收不代表发布。

Phase1：学习类9人池加林矩共10视角；秦构的前端工作由苏绘协作执行并独立记在附录B（秦构作为验收责任视角，不另算教学到会）。先修随机过程、变分法与动态规划、学习问题与泛化已交付。仅局部定义MDP/回报/策略，不借未交付的RL-02；不训练新算法。

## 实际交付与验收

九H2、两Notebook三cell、双图Explorer及内嵌SVG、四题四答。送餐任务贯穿交互时序、MDP联合核/充分状态、奖励与折扣回报、随机策略与信息分布、探索与利用、评估隔离、终止/截断及奖励漏洞。精确枚举是已知模型计算，未训练RL算法、未进行实机实验。

最终正文SHA256：`4dae41b790987294c387ff1123f3cae20b155db749af2923260907ba78d48a7b`。Notebook逐字抽取、原生执行、Pyodide证据与Python策略使用该最终源；仅桌面普通路由早期截图/浏览器普通DOM属于排版修正前，最终内容以Pages实测为准。

| 命令/操作 | 实际结果 | 持久证据 |
|---|---|---|
| 独立副本npm run build | exit0，生产编译及全页生成完成，无MDX失败；正文后续只做强调排版/答案标题修正，最终源码由下行Pages build再次完整编译 | build.log |
| PAGES_BUILD=1 / NEXT_PUBLIC_STATIC_EXPORT=true / NEXT_PUBLIC_BASE_PATH=/control-universe npm run build | exit0，210/210页面生成，最终正文与组件 | pages-build.log |
| WIKI_VERIFY_PORT=8198 npm run verify -- rl-control/rl-basics | exit0，九项PASS，HTTP200/H1=1/H2=9/KaTeX0，四题答案配对 | verify-final.log；最终导出HTML由preview.mjs直接提供，无尾斜杠重定向；实际Pages链接另用9198官方预览 |
| node scripts/nb-cells.mjs verify rl-control/rl-basics --require-kernel --port 8998 --out .agent/semester-03/rl-01/notebooks.json | exit0，2Notebook/3cell、error0、SKIPPED0 | notebooks.log/json |
| node .agent/semester-03/rl-01/reconcile.mjs | exit0，61206真实TS配置对独立Fraction路径枚举，最大差1.7763568394002505e-15，全部图轴范围内 | reconciliation.log/json，reference.py |
| 最终原始Pyodide实验 | 2Notebook/3cell全passed，最终hash一致 | pyodide.json |
| 最终Pages课页两个全部运行 | 三段原始输出完整，控制台error为空 | browser-pages.json；不使用原生UI失败冒充该成功 |
| 三预设/六滑块端点/默认恢复 | 与独立结果一致；按钮inline样式和图例位置已实看 | browser-controls.json、desktop.png |
| 375px实际DOM/图像/目录 | 实测clientWidth360/scrollWidth360，双图各宽294.67，SVG宽328，全部H2/侧栏片段可达，重复ID0 | browser-mobile.json、mobile.png |
| node .agent/semester-03/rl-01/validate.mjs | exit0，源hash/严格内核/数值/最终页面输出/375px/Python策略通过 | validation.log |
| node scripts/check-python-support.mjs（独立快照） | exit0，原86课383实验可运行/16保留代码；刷新HEAD后的结果另记最终证据 | python-policy.log |
| npm run glossary:check | exit0，PASS3/WARN3/FAIL0；C1b/C2b既有未命中、C4来自并行全站文本，不修改符号表消除提示 | glossary.log |
| npm run math:check | exit0，同行定界违规0 | math.log |
| node .agent/semester-03/rl-01/semester-projection.mjs | exit0，errors=[]，投影plan/checklist对真实仓库文件及真实master祖先校验 | semester-projection.json |

开工和交付期间共享目录包含多课在写的组件/注册表/catalog暂态；共享check-draft.log为FAIL7，不宣称全工作区绿色。本课独立快照check-projection.log为PASS21/WARN2/FAIL0；两个WARN是既有重复slug和历史缺日志债务。提交前刷新到最新已提交HEAD后叠加本课并再次执行check，最终结果及真实hash在下方追加。

普通IAB原生Notebook显示Failed to fetch，属于既有W09连接边界；严格原生内核与最终Pages Pyodide分别实跑通过，未关闭W09。首次网关未就绪、类型错误、资源缺失、代码保真失误、答案标题及静态301均记录repair-record.md，不把失败归入通过次数。保留所有其它课程/用户批阅/本地端口改动；不发布gh-pages、不生产RL-02。

## 提交前最终复核

提交投影已刷新到真实master `ffc674ea33f87fd15d57a4d47587c77fc347f12d`，保留并行ID-02、EST-01交付，再只叠加RL-01。`npm run check` exit0：PASS21/WARN2/FAIL0（check-final.log）；Python政策exit0：88课387实验可运行/16保留代码，未改变其它课程条目（python-policy-final.log）；投影学期校验对真实仓库与master祖先检查exit0、errors=[]（semester-projection.json）。

共享目录最新check exit1：另一课autonomous-driving/driving-system的status/台账暂未同步，以及并行新增组件令统计行90/实测91；本课台账被并行写入覆盖后已恢复，第二次检查不再报本课。详见check-shared-final.log。共享学期校验exit0（semester-shared-final.log）。不把独立快照结果宣称为当时全工作区结果。

Phase1–4均已实际完成，郑核已基于上述证据签发。只暂存本课明确文件；共享文件以最新HEAD加本课差异构造暂存内容，工作区中其它会话修改不带入。本地预览保留9198，其余本课临时服务交付后关闭；真实提交与推送回执在提交后追加，不预填hash。



最后一次通过的提交投影父版本：`3fb6dc4b123257c4bcb95410ae0cf8582d904bfe`；check-final.log为PASS21/WARN2/FAIL0，python-policy-final.log为{"pass": true, "lessons": 92, "enabled": 398, "codeOnly": 15}。独立暂存不清理其它会话暂存内容；提交后只同步未被并行暂存改动的本课索引项。
