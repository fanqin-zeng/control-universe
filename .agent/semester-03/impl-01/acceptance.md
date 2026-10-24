# IMPL-01 控制系统架构验收

本课按wiki-lesson-refactor完成起点审计、保留矩阵、Phase1–4、真实数值与页面验收，郑核据证据签发。真实master交付提交为 `58811f8fe3defeff14261bb1ccc5f8ab1dcfa685`，已据实登记进入master列。

本课文件范围：正文、独立预算计算/Explorer/唯一注册、两SVG、讨论日志、本目录证据、catalog本课状态、tracker本课行、checklist本课行、自动OUTLINE与Python运行记录本课条目、fix-071。保留现有用户运行端口脚本、Notebook组件和批阅修改；不带入并行ML/ID课程内容。

rank1资源：预览/生产8191、严格内核8991、静态Pages9191；独立构建快照 `D:/Workspace/control-universe-rank1-impl01-validation`。快照以起点master的应用源码和元数据为底，只覆盖本课源文件、注册及本课浏览器执行白名单，node_modules用Junction复用；构建产物位于快照自己的.next/out，不清理主工作区缓存。测试快照的Jupyter API仅为端口隔离改为8991，交付不改共享组件的用户端口。

| 命令/操作 | 实际结果 | 证据 |
|---|---|---|
| 开工 npm run check | 0；PASS21/WARN2/FAIL0，63门v1.3 | 会话实跑；最终check另存 |
| JUPYTER_PORT=8991 node scripts/verify-impl01.mjs | 0；1701组实际TS对Decimal，原始cell对独立符号积分/逐时刻调度 | reconciliation.log/json、actual-ts.json、reference.py |
| node scripts/nb-cells.mjs verify implementation/computer-control-architecture --require-kernel --port 8991 --out .agent/semester-03/impl-01/notebooks.json | 0；2实验4cell，error0/FAIL0，无跳过 | notebooks.log/json |
| 浏览器逐课Pyodide实跑 | 2实验4cell passed，最终源hash一致 | pyodide.json |
| npm run build（独立快照） | 0；205课程、无MDX编译失败 | build.log |
| WIKI_VERIFY_PORT=8191 npm run verify -- implementation/computer-control-architecture | 0；九项PASS，H1=1/H2=9/KaTeX0 | verify.log |
| 生产页全部运行/控件与边界/恢复 | 四cell输出一致，1701配置及两滑块端点/四预设核验 | browser-native.json、chart.png |
| 375px同源iframe内容视口 | 内容宽360/scrollWidth360，无横向溢出；不冒充真机测试 | browser-mobile.json、mobile.png |
| npm run math:check | 0 | math.log |
| npm run glossary:check | 0；PASS3/WARN2/FAIL0，全站既有提示保留 | glossary.log |
| node scripts/check-fix-logs.mjs | 0；69索引/69详情，预留2 | fix-check.log |

已知过程失败：第一次Pages快照缺少两份基线数学参考JSON，prepare阶段退出1；补入原HEAD版本后重跑，不能把该次失败当通过。根目录刷新统计曾在其它会话同时更新catalog时检测到旧统计，refresh.log记录退出1；它只执行了自动刷新，最终需独立重验。

最终验收追加：

| 命令/操作 | 实际结果 | 证据 |
|---|---|---|
| npm run build:pages（独立快照） | 0；205课/9旧路由，basePath正确 | pages-build.log |
| Pages9191实际页面全部运行 | 两实验四cell均运行完成，图片前缀正确 | browser-pages.json、pages.png |
| node .agent/semester-03/impl-01/validate.mjs | 0；源hash、28旧ID、两DOM/侧栏/唯一ID/输出、1701配置、窄屏全核 | validation.log/json |
| npm run check（刷新后独立重验） | 0；PASS21/WARN2/FAIL0 | check.log |
| node scripts/check-python-support.mjs | 0；全站85课，381可运行实验、16代码保留 | python-policy.log |

最终源hash：2fe65b070be5588f49e7ca9fd72dcc43e0e05a9a206a62478534d4826127a64c。新增一Explorer、两SVG、两Notebook四cell，原九H2与28旧标题ID均保留。独立TS最大误差1.7763568394002505e-15，原始cell22量最大误差2.220446049250313e-16；所有物理时间预算均为教学假设，不是实机WCET或安全认证。

最终提交仅包含本课；自动统计与OUTLINE对本课提交树另行生成，工作区中其它会话新增的课程与元数据仍保留。不发布gh-pages，不开始IMPL-02。

Windows拒绝绑定8291（EACCES）；未终止任何其它会话服务，静态预览改为9191。

## 并行会话与提交范围

提交前全工作区npm run check退出0、Python支持检查退出0。全局node scripts/check-semester03.mjs一度因并行会话新增任务QA-ML01（不符合既有任务ID格式）退出1，原输出保存在semester-check.log；本课不修改该任务或放宽规则。

以master起点加本课改动构造提交元数据，调用同一个validateSemester03并保留真实文件/提交证据检查，scoped-semester-check.json的errors为空。该提交范围check-catalog重验记录在scoped-check.log（全工作区check.log另存）。OUTLINE与旧tracker统计由现有脚本对本课提交范围生成，未手改数字。

首次scoped-refresh.log在生成前因旧统计退出1；已刷新后独立重验，不把刷新时的FAIL当通过。此类基线差异与Pages缺引用文件、8291拒绝绑定都是本次过程记录；最终通过证据以独立重验输出为准。

并行ID-01已先行提交，当前提交范围以3880b2a62c3e428aa4185db8b8d1cb3161643cf6为父基线重新生成元数据，保留其完整交付，不回退其记录。本课源码构建/浏览器验收起点仍记af7c206，具体范围见staging-base.json。更新后的scoped-semester-check.json errors=[]、merged61（本课回执尚未计入）；scoped-check.log独立重验退出0。

ML-01亦已完成独立提交与回执。最终暂存基线刷新为28e24b075cdf4ed81458fca671fe2e923ef311fb；重新生成本课元数据并执行scoped-check（PASS21/WARN2/FAIL0）、scoped-python-policy（85课/381可运行/16代码保留）及scoped-semester-check（errors=[]、merged62，尚未含本课回执），保留两条并行交付历史。

真实master交付提交：58811f8fe3defeff14261bb1ccc5f8ab1dcfa685。提交逐路径审查只含IMPL-01；共享Python策略/执行记录逐课程语义比对确认其它课程无变化。原始工具stdout的行末空白保留，代码与文档的git diff --check通过。

## 回执后的最终校验

- `node scripts/check-semester03.mjs`：退出0，merged63，见semester-check-final.log。
- 同一校验函数按真实HEAD与本课回执行构造提交范围、保留文件/提交可读检查：errors=[]，见scoped-semester-check-final.json。
- `npm run check`（本课独立快照，当前HEAD加本课已提交元数据）：退出0，PASS21/WARN2/FAIL0，见check-final-scoped.log。
- 最后一次共享工作区`npm run check`退出1：并行新增的第79个Explorer使全局统计行暂时仍报78，另有ID-02新稿尚未登记等WARN；见check-final.log。不修改或提交这些在写课程，先前全工作区PASS不冒充这个新时点的结果。

仅保留9191本地静态预览；本课8991内核已停止，8191生产服务已停止，主工作区.next/out未清理。静态预览是验收快照，不是公网发布。
