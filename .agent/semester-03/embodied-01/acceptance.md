# EMBODIED-01 具身智能系统

2026-10-24 用户指定继续 EMBODIED-01，rank 13。本课空占位，按 wiki-lesson-new 与共同 Phase 1–4 新写；角色为结构化审查视角，不冒充外部专家或独立 Agent。

隔离副本 D:/Workspace/control-universe-rank13-embodied01；候选 Next 18113、Jupyter 18913、Pages 18213，启动前查占用。不改共享启动脚本，不使用共享 .next/out，不停止其它会话进程。共享 catalog/注册/计划/台账只合入本课局部差异，不提交其它课程和用户批阅。

入口审计：catalog type=frontier，先修 robot-learning/robot-data 与 machine-learning/attention-transformers 开工尚未交付。本课为系统导览，不需要训练Transformer；局部定义观测、历史、策略、动作和轨迹数据，不使用未签发课程的实验或结论；原先修保留为完整学习路径。用户明确选课的顺序例外独立登记。

设计合同：读者能画出身体—环境—观测—策略—执行闭环，区分任务指令/策略动作/执行器输入，解释时间戳与动作单位如何影响闭环，用小型合成模型复算延迟和动作保持，区分作者实测与课程实验。贯穿问题是机器人将杯子移到指定位置，仿真仅为单轴理想速度接口；不模拟抓取接触，不训练大模型，不宣称真机性能。

H2：杯子为什么没有到位；系统由什么组成；观测与动作的接口；不同速度的闭环；一个可运行的最小系统；学习方法放在哪一层；怎样读前沿证据；小结；习题；参考答案。SVG信号图、两个原始Notebook、一个调参Explorer。三类算例覆盖接口单位、有限窗口轨迹和时间预算，四题覆盖结构/计算/边界/证据审查。

Phase 1–4 已完成，实际签发见讨论日志。十个H2、两Notebook两cell、一Explorer、一SVG、四题四答；未生产后续课。

实测证据（独立副本，以同目录日志为准）：

- `node verify-model.mjs`（在本课目录脚本按仓库根执行）：750配置，全部真实TS状态在固定轴内；`python oracle.py`：135750个标量对精确Fraction独立实现，最大误差7.438494264988549e-15；默认末时另对闭式核验。见verify-model.mjs、oracle.py、oracle-results.json。
- `node scripts/nb-cells.mjs verify embodied/embodied-systems --port 18913 --require-kernel`：exit0，2Notebook/2cell、S1–S8全绿、零Python error，见notebook.log。浏览器真实课程页点全部运行，两组原始输出与正文一致。
- `WIKI_VERIFY_PORT=18113 node scripts/verify-lesson.mjs embodied/embodied-systems`：exit0，PASS9/WARN0/FAIL0/SKIPPED0，HTTP200、H1=1、H2=10/10、katex-error=0，见page.log。
- 实际浏览器目录href与十个DOM标题ID逐条相等、重复ID0、破图0；d=4/H=5/恢复默认与表中读数一致；375px窄屏设置下实际文档/视口宽同为360，图内960px横滚、容器328px；页面无横向溢出。控制台warn/error为空。见browser-ui.json。
- Pyodide0.27.7固定Worker，原始setup与cell两实验均passed，0code-only，来源hash严格匹配；见browser-python.json。两个新Notebook已启用浏览器执行；只合入本课记录，不关闭别课既有待办。
- `node scripts/check-catalog.mjs`：exit0，PASS21/WARN2/FAIL0；WARN为旧课缺讨论日志、motion-planning跨章同slug，见check.log。
- `node scripts/check-semester03.mjs`：exit0；独立副本通过GIT_DIR读取原库历史、GIT_WORK_TREE指定副本，见semester.log。首次无.git的祖先核验失败已纠正，不放宽校验。
- 数学围栏检查、术语检查、`tsc --noEmit`均exit0；术语WARN为全仓既有工具告警，见math.log/glossary.log/types.log。
- `node node_modules/next/dist/bin/next build`：exit0，无MDX编译失败，见build.log；构建保留旧课Unicode KaTeX警告，不等同全站数学零WARN。

研究核阅日期2026-10-24，三项作者项目与代码实际版本见sources.json。本课没有下载/训练/部署这些模型，未把作者实测冒称课程复现。

提交仅包含本课独有文件和本课共享元数据差异。独立运行设置仅用于本地副本，公共端口脚本与Jupyter组件不纳入提交。master实际hash与推送结果在产生后追加，不预填；Pages未发布。

## master交付回执

课程提交：commit:3be96390783b2e6777c0ffe5eea431b999a34f19，已进入master；2026-10-24执行git push origin master成功（Everything up-to-date，其他并行会话已同步包含本提交的master）。git merge-base确认课程提交同时为master与origin/master祖先。仅本课文件和局部元数据进入课程提交；共享暂存区原有其它课程内容保留。最终回执另以文档提交登记，不发布Pages。

回执复验：node scripts/check-semester03.mjs，exit0，PASS semester-03 plan/checklist；原始输出见receipt-semester.log。
