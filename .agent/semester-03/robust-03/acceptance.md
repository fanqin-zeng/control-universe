# ROBUST-03 鲁棒稳定性验收

2026-10-24用户指定ROBUST-03，rank5；Phase1–4已完成，签发详见课程讨论日志。起点master 04bc05846dfb102de11734b3d08f23adddb1e5f0，原正文LF SHA256 6b4eaefd9305c47c0ed9c44a9246e15a641a354ac4bcb4a1e0ae095271d07a06。

唯一课程robust/robust-stability；保留10H2、原3Notebook的4cell教学用途、四题全部子问与历史标题ID。隔离副本D:/Workspace/control-universe-rank5-robust03；预留原生18995、Pyodide19095、静态19195、Jupyter8995，已检查无监听。只用独立distDir，不清理共享缓存、不改共享端口脚本。

审计重点：裕度不是倒数对称区间；Kharitonov固定次数和升降幂；LMI证书/不可行性与冻结参数、切换参数的边界；固定控制器iid验证的二项式置信上界；原题K10必须按原对象答，不改题凑稳定。

## 最终验收

| 命令/范围 | 实际结果 | 证据 |
|---|---|---|
| nb-cells verify robust/robust-stability --require-kernel --port8995 | 退出0，4Notebook5cell/error0/SKIPPED0 | notebooks.json/log |
| 实际TS与reference.py | 退出0，100组参数；全5000物理三状态对账 | actual-ts.json/log、reconciliation.json/log |
| Pyodide真实Worker | 4/4Notebook、5/5cell、release codeOnly0 | pyodide.json、pyodide-final.log |
| 原生/静态生产构建 | 最终均退出0，无MDX编译错误 | build-accepted.log、pages-build-accepted.log |
| verify-lesson原生18995 | 退出0，PASS9/WARN0/FAIL0 | verify-final.log |
| 真实原生/Pages19195 | 两页面200，h1=1/h2=10/KaTeX0；旧锚点、链接片段、SVG、默认六读数、3滑块/恢复/临界按钮全过；375px文档宽375 | browser-native.json、browser-pages.json；桌面/移动端PNG |
| 标题编译/数学围栏 | 全旧ID保留、files0/tokens0 | headings-before/after.json、math.log |
| 提交投影check/semester/math/glossary/python/fix | 完整六项逐命令退出码见最终staged-validation.json | staged-*.log |

数值最大误差：实际TS标量2.61e-15、全部极点1.51e-14、5000样本物理状态2.78e-16。精确Fraction/SymPy、60位Decimal与独立二项CDF反演核系数、矩阵与置信界。保留原10H2、四题12子问与全部历史标题ID；3Notebook4cell用途保留，新增题解Notebook1cell。

边界：公共二次条件充分保证冻结/任意快变，但无P不能反推冻结不稳；本振子阈值是解析特例，不是一般求解器。零失败界只适用于预先固定控制器/分布/N的iid验证。可选本地cvxpy模板在本机未执行（未安装依赖），本页必需实验全部使用可实跑的解析2×2证书/矩阵回代，未宣称通用SDP的浏览器适配。原PY-004只在本课解除。

失败与并行现场：check-start.log有其它并行课程catalog/tracker未同步；semester-start.log有其它会话RL-02计划表尚在编辑中的列格式，不越权修他课。初次两张表造成375px文档宽400，五表局部滚动后复验375；失败日志保留，只有accepted为最终成功。初始wrong link与别名预检错误均已修正。核对起点至验收时master的Jupyter、内容编译/标题、PythonWorker无变化，本课私有API8995和distDir不进入提交。

术语检查C1/C2均通过。C1b的mathcal P/U未命中是机器抽取提示，本课显式定义mathcal P；C2b旧NOISE未命中、C4全站旧max/min4处仅WARN，原处置保留，本课新函数写法规范。目录WARN的跨章同slug及其它旧课无日志已登记，不计本课新债务。

独立提交只从已提交master叠加本课完整文件与自己的共享元数据行，OUTLINE和tracker统计由官方脚本重生成。默认Git索引不用于构造提交，避免并行暂存污染。无Pages发布。
