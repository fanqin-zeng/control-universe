# NONLINEAR-10 输入状态稳定性验收

2026-10-19；起点master 66d4f6f2c68387378ccb649aeb4823b53d51a9f3。空占位新写，wiki-lesson-new及共同流程，单课Phase1–4。用户批阅、长期润色分支和Pages发布分支均不改动。

正文10H2、3Notebook3cell、四题四答；IssSmallGainExplorer、真实计算lib/iss.ts和耦合SVG。由线性误差积分解引入ISS，非线性标量给直接界和V界，再以二维系统证明小增益幅度估计，保留临界、失败与反号仍稳定的边界；时间/状态均归一化，不冒充实车数据。

## 数值与运行证据

| 验收 | 命令/执行方式与结果 | 证据 |
|---|---|---|
| 原始Notebook与独立数值 | node scripts/verify-nonlinear10.mjs，退出0；实际TS9配置3609绘图节点对独立增广矩阵expm，最大绝对差5.244e-13<1e-7；原始setup/cells全部执行，stdout留存 | reconciliation.json/log、actual-ts.json、reference.py |
| 严格内核 | node scripts/nb-cells.mjs verify nonlinear/iss-small-gain --require-kernel --out .agent/semester-03/nonlinear-10/notebooks.json，退出0；EXECUTED，3实验3cell、error0、FAIL0、SKIPPED0 | notebooks.json/log |
| 浏览器Python原代码 | complete=true，3/3实验3/3cell passed；与原生stdout逐字一致，最终源指纹一致 | pyodide.json、validation.json |
| 单课HTTP及编译结构 | WIKI_VERIFY_PORT=8083 npm run verify -- nonlinear/iss-small-gain，退出0；PASS9/WARN0/FAIL0/SKIPPED0，HTTP200、H1=1/H2=10、KaTeX0、四题四答 | verify.log |
| 真实页面 | 默认/g两端/临界g1/反号g1.2/关闭扰动/恢复均核对；同时运行3组实验全完成；375px宽度与滚动宽度均360；图片加载、目录目标和唯一ID通过，无console告警错误 | browser.json、desktop.png、mobile.png |
| 数值/页面联合复核 | node .agent/semester-03/nonlinear-10/validate.mjs，退出0，pass=true | validation.json |
| 最终普通构建 | npm run build退出0，Compiled successfully及210/210路由生成，无MDX编译失败 | build.log |
| 最终Pages本地构建 | npm run build:pages退出0；verify-pages pass=true，205课/9旧入口 | pages-build.log |
| 全局目录与统计 | 自动重算大纲及tracker后npm run check退出0，PASS21/WARN2/FAIL0，51/205旧交付台账、66Explorer；25旧稿日志债与跨章同slug为已登记WARN | catalog-refresh.log、check.log |
| 数学排版/术语 | math:check、glossary:check退出0；术语PASS3/WARN2/FAIL0，既有C2b/C4 | math-check.log、glossary.log |
| 相关基建回归 | node --test scripts/lesson-route.test.mjs scripts/check-semester03.test.mjs scripts/verify-lesson-port.test.mjs退出0，17/17通过 | tests.log |

不得以本地build宣称公网发布。支持策略通过finalize-python-support增量合并最终源真实结果，75课程363Notebook，338放行、25代码展示；保留25待办原有task/category/next，不宣称它们重新执行或已修复。最终源指纹cc2ed16116d7d8490fde8c68ab4cc2766444a977d79aa47168a8acf8bb7ae659。

最后将实验台“幅度证书”替换成已在正文解释的“小增益条件”，只改界面文案，原数值和Notebook代码不变；最终普通/Pages构建和交互状态完整复验后保存截图。全局首次刷新前5项统计FAIL已由自动大纲/统计重算解除；一次复查启动早于刷新完成而仍读到旧统计，最终顺序等待刷新结束后重新check退出0，未放宽门槛。

真实交付提交已进入master：b90b4ed1366e2b72380295c6daf0119347102810。回执同步全局合入列，semester03已进入master课程48节；下一课NONLINEAR-11另开对话，不自动续写。用户未提交批阅保持原样，未合并润色分支、未推送gh-pages。
