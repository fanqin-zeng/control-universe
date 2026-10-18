# DISCRETE-02 交付验收

日期：2026-10-19。目标：离散时间系统，新写一课；起点master 4185db7。讨论与签发见 `docs/discuss-log/semester-03/06-discrete-sampled/02-discrete-time-systems.md`。

正文SHA-256（LF归一化）：`d4f6ef192e1ff82e4dc69ea8b5f715ece0a73068559dfb7634300975217d7227`。

8H2、3Notebook/3cell、两SVG、四题四答。贯穿房间温差模型，教授视角审假设、学生视角核初值/同步更新/脉冲首项，Phase1–4及A/B/C/D完整。

| 命令/实际操作 | 退出码/结果 | 原始证据 |
|---|---|---|
| `JUPYTER_PORT=8981 node scripts/verify-discrete02.mjs` | 0；几何和、矩阵幂、SciPy与原始cell变量逐元素误差≤1e−12 | reconciliation.log/json、reference.py |
| `node scripts/nb-cells.mjs verify discrete-sampled/discrete-time-systems --require-kernel --port 8981 --out .agent/semester-03/discrete-02/notebooks.json` | 0；3Notebook3cell，S1–S7通过，S6真实内核error0 | notebooks.log/json |
| `npm run build` | 0；静态课程构建，无MDX编译失败 | build.log |
| `WIKI_VERIFY_PORT=8183 npm run verify -- discrete-sampled/discrete-time-systems` | 0；HTTP200、H1=1/H2=8、KaTeX错误0、8/8锚点 | verify.log |
| `npm run build:pages` | 0；205课程、9旧入口，basePath=/control-universe | pages-build.log |
| 浏览器逐课Pyodide审计 | 3实验3cell全通过 | pyodide.json |
| 真实课程页全部运行 | 原生与静态Pyodide各3cell，文本输出一致 | browser-native.json、browser-pages.json |
| `node .agent/semester-03/discrete-02/validate.mjs` | 0；源hash一致、数值文本一致、ID唯一、图片加载、375px无整页溢出、控制台error0 | validation.log/json |
| `npm run math:check` | 0；同行公式违规0 | math.log |
| `npm run glossary:check` | 0；PASS3/WARN2/FAIL0，已登记全站提示 | glossary.log |
| `node --test scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs` | 0；10/10 | tests.log |
| `node scripts/check-python-support.mjs` | 0；78课、349实验可运行、25代码保留 | python-policy.log |
| `node --test scripts/check-semester03.test.mjs` | 0；15/15，含显式换课例外与其它跳课仍被拒绝 | order-tests.log |
| `npm run check`（统计刷新后复跑） | 0；PASS21/WARN2/FAIL0 | check.log |
| `node scripts/check-semester03.mjs` | 0；计划与台账通过，当前合入50等待本课提交回执 | semester-check.log |

后课difference-equation仍空占位，verify仅作导航WARN；本课不借其省略必需定义。25项旧Python待办保留原任务元数据，无新不兼容项。Python策略仅新增本课，未改其它课程算法。

最终catalog/checklist检查输出见check.log、semester-check.log；合入列在真实master提交后补hash。Pages仅本地构建验收，本轮未发布。

顺序冲突处理：初次semester-check失败“跳过未合入前课 DISCRETE-02”。计划§2.3已有“用户明确换课时保留检查点”规则，但旧脚本未实现例外。用户本轮明确指定DISCRETE-02，故在计划的S3-ORDER-EXCEPTIONS表仅登记暂缓DISCRETE-01；校验要求目标/前课存在、依据与持久证据齐全，仍检查所有未获豁免的前课及本课Phase顺序。四个新增反例测试与原11测试全部通过，不把未完成的DISCRETE-01标成交付。归入P08，不更改导航顺序或前置依赖。

统计刷新命令首次退出1，原因是旧OUTLINE两行与tracker统计一行待更新；自动重算后独立运行check退出0，未掩盖失败输出（refresh.log保留）。

本地端口四处改动不提交：scripts/serve.mjs、scripts/serve-pages.mjs、scripts/verify-lesson.mjs、components/wiki/jupyter-notebook.tsx。用户proofreading修改保持。DISCRETE-01未完成草稿在git stash保存，交付后恢复至工作区；本课不夹带该课正文、组件、注册或签发。
