# MPC-03 滚动优化验收

2026-10-24用户明确指定继续MPC-03，rank6，仅交付mpc/receding-horizon。原端口组被占用，改用Next18696/内核9016/夹具18796/静态18896，不中止占用者。隔离副本D:/Workspace/control-universe-rank6-mpc03，独立.next；ignored public/pyodide预置；node_modules为依赖junction，Next cpus1为环境配置不提交。测试路由将8891/8981转到本课9016，不改生产端口。Git使用临时索引/提交树与原子引用更新，原共享索引及锁不修改，不声明工作区全绿或无他人暂存内容。

## 范围与保留

起点commit/hash见baseline.json，原稿source-before.mdx完整保留；旧标题管线结果headings-before.json。按重构专用Phase1–4，日志 `docs/discuss-log/semester-03/12-mpc/03-receding-horizon.md`。保留原11H2、全部H3/H4及URL、五题全部子问目标、原.9/.1/Ts.5/Np10/Nu5/20步实验主题。旧失败widget替换为一个React Explorer和静态QP实验，不保留Nu>Np非法参数组合；ASCII时序换SVG。

主要修正：脉冲/增量执行混用；当前/未来费用与堆叠不一致；a2/N2临界极点、同次计划末输入0；终端不变/可容许/下降条件及Nu短尾部移位非封闭；LQR绝对尾输入到增量的转换；H/f/输入答案；未实测热启动倍数/求解器毫秒/显式区域数量与硬实时承诺；自行车积分模型时间常数和Bryson单位解释。

## 实际验收

| 命令/链路 | 结果 | 版本化原始证据 |
|---|---|---|
| npm run build | exit0，Compiled successfully，210页生成，无MDX编译error | build.log |
| PAGES_BUILD=1 NEXT_PUBLIC_BASE_PATH=/control-universe NEXT_PUBLIC_STATIC_EXPORT=true npm run build | exit0，210页，本地静态导出含Pyodide | pages-build.log |
| WIKI_VERIFY_PORT=18696 npm run verify -- mpc/receding-horizon | exit0，HTTP200，H1=1/H2=11，katex-error0 | verify.log |
| node scripts/nb-cells.mjs verify mpc/receding-horizon --require-kernel --port 9016 --out .../notebooks.json | exit0，3Notebook/6cell，error0，S6无SKIPPED，S1–S8对应检查通过 | notebooks.log/json、extracted.json |
| node scripts/verify-mpc03.mjs | exit0，160组实际TS对独立Fraction；原20QP对独立BVLS；题1有理DP、车辆幂零积分 | reconciliation-run.log/json、reference.py、actual-ts.json |
| 生产worker Pyodide实际执行 | 3Notebook/6cell全passed，无codeOnly | pyodide.json/log、browser-audit.cjs |
| 普通生产页面真实运行 | exit0，三实验末输出/静态图/SVG/图表/滑块/复位/超时拒绝均通过 | browser-native.json/log、page-audit.cjs |
| /control-universe静态页面真实运行 | exit0，实际浏览器Python六格与上述图形交互通过 | browser-pages.json/log |
| DOM/锚点/窄屏 | 全部旧ID及目录目标存在，无重复ID或pageerror，H2=11，375/375无全页横溢 | browser-*.json、desktop-top/explorer/mobile-*.png |
| npm run math:check | exit0，files0/tokens0 | math.log |
| npm run glossary:check | exit0，PASS3/WARN3/FAIL0，既有全站WARN保留 | glossary.log |
| npm run check（开发副本） | exit0，PASS21/WARN2/FAIL0；原两WARN均已登记 | check.log |

独立核验最大差：160组组件1.7763568394002505e−15；原20QP SLSQP对BVLS为2.4721382458903207e−6，小于事前1e−5。默认首输入1、预测[.2,.36,.488,.5904]；+.4状态偏移后测量.6，新输入1.4120365263222407。无偏移/负偏移新输入1.8240730526444815/2。题1未来费用U[−1.5545157588063918,−.7204025779111857,−.28251081486713164]，当前费用U[−1.4729241877256318,−.5776173285198556,0]。

原20步末样本.9998885936391427不冒称稳态；未测试OSQP/qpOASES/Gurobi/FORCESPRO性能，未运行实车。超时按钮是确定性逻辑演示，不是实测求解延迟或通用安全回退。

## 集成与交接

最终候选只从已提交master刷新并行变更，再重放本课共享行和本课Python proof；原始全局门槛见check-final.log、semester-final.log、python-policy-final.log、fix-final.log。构建及浏览器对应baseline快照加本课最终正文/组件，后续并行新课只做集成元数据检查，不声称重新构建或核验了它们。

check-catalog为未修改的权威脚本；同一进程的重试仅复用其现有以课程/完整源串为键的标题缓存，所有检查重新执行。--fix-outline/--fix-tracker-stats自动生成后plain检查退出0才提交；OUTLINE不手编。scope.json是确切路径清单；没有把共享工作区的其它修改或暂存纳入提交。

fix编号081，详情见fix-record.txt；并行未合入编号按现有规则显式预留，不代提交其详情。独立中文润色PLAN只将本课移交为已生产/待润色，不代做专项任务。最终master hash及推送回执在提交后登记；不推gh-pages，不继续MPC-04。

## master实际回执

交付提交`6a4c72492c0efab975de1eb701d527ed0c274571`已进入master并推送origin master，原始远端确认见push.log。最终候选check PASS21/WARN2/FAIL0/exit0；semester/Python支持/fix门槛退出0，两个构建、严格内核、生产Pyodide、普通与Pages本地页面实际运行均有版本化证据。最终回执只更新本课勾选及hash，不制造分支/合并节点、不包含并行未提交工作。

原共享Git索引字节未修改，既有索引锁未删除；本课提交完全使用临时独立索引和原子引用更新。因此不把共享工作区既有暂存状态当作本课“干净工作区”声明。共享文件只更新本课条目，派生摘要若与并行未提交内容冲突则保留原工作区版本，提交树已通过隔离集成门槛。四个本课测试服务通过各自执行会话停止，未终止占用原端口组的服务；未发布Pages、不生产MPC-04。
