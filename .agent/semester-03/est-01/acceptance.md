# EST-01 状态估计框架

2026-10-24 用户明确指定继续 EST-01，rank 4；仅生产这一课。入口为空占位，按 wiki-lesson-new 与共同流程执行。必需先修：已交付的 modern/state-observer、math/stochastic-processes、discrete-sampled/discrete-time-systems。系统辨识与机器学习未完成课不作为前提。

隔离运行副本：D:/Workspace/control-universe-rank4-est01；预留 Next 18194、内核8994、浏览器实验夹具18394、Pages18494，启动前核查端口。共享目录的 .next、服务和端口配置不修改、不清理、不停止。共享文件只合入本课局部差异，提交排除其它会话与用户批阅。只推送master，Pages发布仍需另获具体版本授权。

Phase 1–4完成并签发：9H2、2Notebook/4cell、1Explorer、1SVG、四题四答。原生页网关请求由验收路由转发到8994；未占用或改动共享端口。Pages只做本地预览，不发布。

| 实际命令 / 操作 | 退出码与结果 | 版本化证据 |
|---|---|---|
| node .agent/semester-03/est-01/reconcile.mjs | 0；1216真实TS配置对独立Fraction枚举，最大差1.7763568394002505e-15；坐标边界通过 | reconciliation.log/json、actual-ts.json、reference.py/json |
| node scripts/nb-cells.mjs verify estimation/estimation-problem --require-kernel --port 8994 | 0；2Notebook/4cell，EXECUTED/error0/SKIPPED0 | notebooks.log/json |
| 原始Pyodide实验夹具完整执行 | 0；2实验/4cell全passed，最终正文hash一致 | pyodide.log/json |
| 独立副本npm run build | 0；210页生成，无MDX编译错误 | build.log |
| WIKI_VERIFY_PORT=18194 node scripts/verify-lesson.mjs estimation/estimation-problem | 0；PASS9/WARN0/FAIL0，HTTP200/H1=1/H2=9/KaTeX0 | verify.log |
| node .agent/semester-03/est-01/page-audit.cjs | 0；原生真实DOM、4cell输出、36控件状态+恢复、375px、浏览器错误均过 | browser-native.log/json、desktop/mobile-native.png |
| PAGES_BUILD=1 NEXT_PUBLIC_BASE_PATH=/control-universe NEXT_PUBLIC_STATIC_EXPORT=true npm run build | 0；静态构建 | pages-build.log |
| EST01_PAGE_URL=本地Pages预览 EST01_AUDIT_NAME=pages node …/page-audit.cjs | 0；正确基路径、4cell、36控件状态、375px、无错误 | browser-pages.log/json、desktop/mobile-pages.png |
| node …/visual-audit.cjs | 0；手机局部图与控件截图复核 | diagram-mobile.png、explorer-mobile.png、visual.log |
| node …/validate.mjs | 0；最终sourceHash、原始cell、严格内核、数值和两种实际页面交叉核对 | validation.log |
| node scripts/check-python-support.mjs | 0；pass=true，隔离交付口径86课/383可运行/16代码展示 | python-policy.log |
| npm run math:check；npm run glossary:check | 0；围栏违规0；术语PASS3/WARN2/FAIL0 | math.log、glossary.log |
| npm run check；node scripts/check-semester03.mjs | 0；PASS21/WARN2/FAIL0；计划通过 | check.log、semester-check.log；签发后另留projection检查 |

两项check WARN沿用motion-planning跨章同slug、19门旧课未补讨论日志；本课不改全站历史债务。正文最终LF规范化SHA256：12071d8731da82edcd2aa2c0693367677035b102c89ce99933ae5e1698588f6f。

失败记录：初始运行副本快照与稍后读取的HEAD不同步，缺并行IMPL-01新组件，首次build退出1，保留build-initial-snapshot.log。统一到9c11c8b后真实重跑通过。初次fixture源hash早于参考温度句修改，被finalizer拒绝后已重新生成并执行全部原始cell。刷新统计的首次exit1不冒充最终check通过。手机流程图改为双列SVG后，同步静态资源并重新核验最终Pages页面。

只叠加本课的提交投影另运行门槛；其他会话在共享目录的课程、注册与政策增量不纳入本课提交。真实master提交后再补hash。

提交投影最终门槛：projection-check.log为PASS21/WARN2/FAIL0，projection-python-policy.log为pass=true，projection-semester.log为PASS；均exit0。共享工作区当时shared-check.log为FAIL7（其它会话的tracker/status、BuckConverterExplorer注册和全局统计差异），shared-semester-check.log为其它生产任务跳过INTEL-01；未改这些课程或把它们纳入本课提交。

提交前并行ID-02已进入master，最终投影更新到52cfac9，保留其课程与回执；最终projection门槛再次通过（87课/385可运行/16代码展示）。前文86课口径对应早期9c11c8b构建快照。未把ID-02回退或删除。
