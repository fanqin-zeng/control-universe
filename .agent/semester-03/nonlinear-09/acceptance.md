# NONLINEAR-09 无源控制验收

2026-10-18，起点master fca2707。空课新写，按wiki-lesson-new与共同流程完成一节课；不修改用户批阅、不自动合并润色分支、不发布Pages。

产物：10个H2、3Notebook/3cell、四题四答、能量流SVG、PassivityExplorer及其真实计算模块。先修为已交付Lyapunov稳定性及多变量系统。内容用带三次刚度的小车贯穿，区分物理储能/期望储能、无源/渐近稳定、目标整形/阻尼、连续理想模型/数字实现边界。

| 命令/验收 | 实际结果 | 证据 |
|---|---|---|
| node scripts/verify-nonlinear09.mjs | 退出0；5配置2505绘图节点，实际TS对独立Python DOP853最大绝对差2.853e-10；能量账最大误差6.503e-11；原始setup/cells实跑 | reconciliation.json/log、actual-ts.json、model.py、reference.py |
| node scripts/nb-cells.mjs verify nonlinear/passivity-control --require-kernel --out .agent/semester-03/nonlinear-09/notebooks.json | 退出0；EXECUTED，3实验3cell、FAIL0/SKIPPED0/error0 | notebooks.json/log |
| 本地Pyodide全部原始实验 | complete=true，3/3实验、3/3cell通过；stdout与原生逐字一致 | pyodide.json、validation.json |
| WIKI_VERIFY_PORT=8083 npm run verify -- nonlinear/passivity-control | 退出0；PASS9/WARN0/FAIL0/SKIPPED0，HTTP200、10H2对齐、KaTeX0、注册/轴/习题配对通过 | verify.log |
| npm run build | 退出0，完整生产构建成功 | build.log |
| npm run build:pages | 退出0，205课程/9旧入口、资源路径通过；仅本地构建，未发布 | pages-build.log |
| 真实浏览器课程页 | 默认/阻尼两端/无耗散/关闭整形/恢复通过；3实验同时运行完成，console无warn/error；375px无整页横溢；真实标题ID、侧栏目标与图片通过 | browser.json、desktop.png、mobile.png |
| node .agent/semester-03/nonlinear-09/validate.mjs | 退出0、pass=true，源指纹与完整输出及浏览器状态断言 | validation.json |
| npm run check（先自动重算大纲与统计） | 退出0、PASS21/WARN2/FAIL0，50/205已交付，25旧稿日志债及重复slug为原有WARN | check.log |
| npm run math:check / glossary:check | 退出0/0，术语PASS3/WARN2/FAIL0，既有C2b/C4 | math-check.log、glossary.log |
| node --test scripts/lesson-route.test.mjs scripts/check-semester03.test.mjs scripts/verify-lesson-port.test.mjs | 退出0，17/17测试通过 | tests.log |

开发中门槛拦截：Notebook首次误用字符串数组、第三Notebook缺闭合导致抽取少一份，均修复并按预期3份重跑；首次catalog小节类型误填字符串被构建拒绝，改为SubsectionMeta对象后完整重建。没有将失败或部分执行记作通过，不改基础校验器放宽检查。

支持政策已用本课真实Pyodide结果增量合并；总74课、360Notebook、335浏览器放行、25代码展示。25项待办的内容不变；保留其原有task/category/next处置字段，不宣称旧实验重新执行。学期3及真实master提交回执另登记全局checklist。

并行环境补充：8080由用户润色工作区服务占用，未结束其进程；verify工具增加WIKI_VERIFY_PORT（默认8080，限制合法端口），在独立8083生产服务重验，原HTTP门槛不变。见fix-064；端口占用后的那次旧页H2失败不是本课通过证据。最终源补充手算直接输出后，原生/Pyodide与构建均重新执行。

交付已进入master：`aa691ca7d211255d2713c9856f5be10c02380b65`。后续回执更新全局合入列与真实hash；学期3已进入master课程47节。Pages未推送，长期润色分支未自动合并；用户未提交批阅保持原样。
