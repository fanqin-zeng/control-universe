# SAFE-01 控制安全验收

2026-10-24，用户明确指定继续 SAFE-01，rank 10。本课无既有正文，走 wiki-lesson-new 与共同流程；其它会话课程检查点保留。本课只需已交付的 classic/stability-analysis 与 nonlinear/lyapunov-stability；原估计和计算机控制架构先修改为后续阅读，本课局部定义测量误差与反应延迟，不借用并行草稿。

隔离副本：D:/Workspace/control-universe-rank10-safe01，基于开工时已提交 HEAD，不复制其它会话未完成课程。拟使用页面8200、内核9000、Pages预览9200，启动前检查占用，有冲突另选；不停止其它进程、不删除共享.next。仅本课文件和共享文件本课差异进入提交，Pages不发布。

开工共享 npm run check：exit 1，PASS18/WARN4/FAIL6：ResonanceRobustnessExplorer未实现，OUTLINE两项统计、tracker三项统计未同步；这是并行基线，不能冒充本课通过。check-semester03 exit0。

已完成Phase1–4并签发。9H2、四题四答、1Explorer/1SVG、2Notebook/3cell；精确先修只需稳定性与Lyapunov。

| 验收 | 命令与结果 |
|---|---|
| 独立数值 | `node scripts/verify-safety-stopping.mjs` exit0，192配置/76992轨迹量；真实TS对solve_ivp最大差2.132e−14，矩阵指数对解析601点最大差1.022e−14；习题Fraction精确核；零速停时0；非法输入6组拒绝 |
| 原始内核 | `node scripts/nb-cells.mjs verify safety-ftc/safety-overview --require-kernel --port 9000 --out .agent/semester-03/safe-01/kernel.json` exit0，2本3cell，S6全执行，error0，SKIPPED0；最终MDX已重测 |
| 浏览器Python | browser-python.json：最终sourceHash，enabled2/codeOnly0，3cell全部passed |
| 页面 | `WIKI_VERIFY_PORT=8200 node scripts/verify-lesson.mjs safety-ftc/safety-overview` exit0；200、9H2/1H1、KaTeX错误0；最终Pages DOM无重复ID、锚点一致 |
| 交互 | 减速度.5读数总4.4m/余量−2.7m/停4.2s；默认恢复1.4/.3/1.2；最终Pages零速路程0/停时0 |
| 窄屏 | 实际375px，pageWidth360、canvas299、SVG328，公式独立滚动；pages-dom.json/pages-narrow.png |
| 术语与公式 | glossary:check exit0 PASS3/WARN2/FAIL0；历史C4其它课4处登记保留；math检查exit0 files0/tokens0 |
| 普通构建 | rank10独立副本`npm run build`最终exit0，无MDX编译失败，完整输出build.txt |
| Pages本地 | 标准隔离配置`npm run build:pages` exit0；205课/9历史URL pass:true；9201实际页面两本“全部运行”均完成，输出pages-run.txt；新页面浏览器error=[] |

曾遇开发缓存vendor chunk缺失及自定义distDir改变静态导出目的目录；已只在本课隔离副本停dev、恢复标准配置并重建。未改变共享配置。IAB原生跨端口连接Failed to fetch仍按W09登记，不伪记通过；本课严格原始内核与最终Pages浏览器执行均通过。

进度：最终提交只提取最新master上的本课差异，完整共享文件不直接暂存；提交前精确候选树再跑npm run check、semester03、Python支持指纹和单课verify。真实提交hash在完成后登记；不预填、不发布gh-pages。

并行提交导致重复目录校验时，仅rank10隔离校验器复用按原始MDX、课程路径、原编译器源码、lib工具、lockfile与Node版本指纹保存的标题编译结果；首次和变更内容仍调用原compileMDX，只缓存成功结果。该临时加速器不进入提交，未跳过目录/图/状态/统计规则，不替代本课页面、严格内核、独立数值或构建实跑。
