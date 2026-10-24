# MULTI-01 多智能体系统

2026-10-24，用户指定继续MULTI-01，rank 9。仅交付本课，保留其它会话检查点；不发布Pages。

起点：catalog空占位，无源MDX。先修math/graph-theory、modern/state-space均已交付；本课就地解释同步采样与零阶保持，不依赖未完成的实现、学习、辨识、估计、鲁棒、MPC、智能及RL课程。

资源隔离：D:/Workspace/control-universe-rank9-multi01为HEAD快照加本课投影；不操作共享.next，不停止其它进程。页面8199、内核8999、Pages预览8499（原8299被Windows拒绝绑定），启动前检查监听与实际绑定。共享文件只修改MULTI-01对应段落。

## 设计合同

读者问题：三辆仓储小车在各自独立车道行驶，只收到邻居速度，怎样把速度调到一致？共同速度能否等于指定速度？通信断开会怎样？

| 目标 | H2 | 实验/可视化 | 习题 |
|---|---|---|---|
| 识别对象、局部状态、信息与共同任务 | 从三辆小车出发；对象和信息分开建模 | 通信/物理双层SVG | 1 |
| 写出依赖邻居信息的反馈及整体模型 | 局部反馈怎样连成整体 | 3车单步Notebook、Explorer | 2 |
| 区分一致、跟踪、编队与最优 | 一致不等于完成任务 | 任务表与无leader反例 | 3 |
| 解释拓扑、采样与保证的边界 | 通信结构改变结果；从理想协议走向实现 | 断图/有向/临界/过大步长Notebook与Explorer | 4 |

实验合同：教学速度积分器，v=[0,1,5] m/s，gamma=1 s^-1，周期h=alpha/gamma，alpha默认.25、控件范围.05–.70；20次同步更新，无噪声/时延/限幅/碰撞模型。三种固定图：双向链、切断2–3、单向1→2→3；定义a_ij为j发给i。界面第1步为默认读数，曲线显示0–20步。不是车辆实机控制器。

数值口径：Notebook原始setup/cells真实执行；TS实现对独立谱分解/矩阵幂、Fraction手算互核；单步与均值容差1e-12，全轨迹1e-9，打印四位容差5e-5。正文末样值与理论极限分开。比较只作同协议信息/周期变化的限定观察，不声称算法排名。

Phase 1–4与真实验收已完成，签发见本课日志。真实提交hash待提交后追加。

| 验收 | 实际结果 | 证据 |
|---|---|---|
| 独立投影npm run check | exit0；PASS21/WARN2/FAIL0，旧重复slug及其它旧课无日志债务 | projection-check.log |
| 普通生产/Pages静态构建 | 均exit0，205课程生成，无MDX编译失败 | build.log、pages-build.log |
| 课程verify | exit0，HTTP200、H1=1、H2=8、KaTeX0 | verify-final.log |
| 严格原始Notebook | exit0，两Notebook四cell，0error、0SKIPPED；8999 | notebooks.log/json |
| 真实TS与独立参考 | exit0，135组8505点，最大差2.3092638912203256e-14；全图固定轴内 | reconciliation.log/json、actual-ts.json、reference.py |
| 原始Pyodide | 两实验四cell全passed，源hash一致 | pyodide.json |
| 普通/Pages实际页面 | 各两次全部运行，四原始输出及绘图完成，error=[] | page-python-normal.json、page-python-pages.json |
| 操作/布局/链接 | 两页面各7操作，默认/边界/恢复通过；375px无页面横溢；重复ID/缺失本页片段0 | controls-normal/pages.json、browser-normal/pages.json、mobile-normal/pages.json、PNG |
| 学期与Python政策 | exit0；完整历史检查及本课原始证据注册；旧16代码保留项不关闭 | semester-final.log、python-policy.log、register.log |
| 术语、块级公式 | 均exit0；全站词表WARN保留，同行公式违规0 | glossary.log、math.log |
| 聚合验证 | exit0；源hash、独立数值、内核/浏览器、手机与政策 | validation.log、validate.mjs |

源SHA256：d3213cccc4da9c1abad301fbb4f9d9e25eb9f8cf4aa5b6c481703a561b8d0ff4。

普通原生UI仅在本次Playwright请求中转发8891→8999，以避开共享硬编码资源；未修改共享Jupyter组件。Pages两组原始实验使用真实Pyodide。snapshot的历史检查用GIT_DIR指向仓库只读历史；不以“快照无git”引起的首次失败冒充通过。

初稿subsections误用id导致首次build失败，修为契约slug后重建通过；8299绑定拒绝后用8499。折叠details内innerText为空是验收脚本读取问题，改textContent后原始实验通过。未变更Notebook计算迁就输出。共享目录的并行课程/端口/用户批阅不纳入本课提交。

共享目录首次最终check在其它会话切换状态窗口返回FAIL4：RL/驾驶条目status已变而tracker尚未同步，以及自动OUTLINE两处计数漂移；没有修改它们来伪造通过。本课提交投影排除其它会话未提交状态，完整npm run check退出0，详见projection-check.log。
