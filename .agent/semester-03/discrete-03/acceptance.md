# DISCRETE-03 验收记录

2026-10-19；新写「差分方程」，起点master d8c1eac。

完成：新写340行、9H2、3Notebook3cell、一SVG、四题四答。Phase1–4及审校/签发见 `docs/discuss-log/semester-03/06-discrete-sampled/03-difference-equation.md`。

最终MDX SHA-256（LF归一化）：`09a40f6f4124282ba43dab5159efc989eff225456bc717b0d074899354891056`。

| 命令或实际操作 | 退出码 / 关键结果 | 原始证据 |
|---|---|---|
| `JUPYTER_PORT=8981 node scripts/verify-discrete03.mjs` | 0；原始cell变量对独立Fraction精确闭式与增广矩阵幂逐点误差≤1e−12；Z有理恒等及根多项式核通过 | reconciliation.log/json、reference.py |
| `node scripts/nb-cells.mjs verify discrete-sampled/difference-equation --require-kernel --port 8981 --out .agent/semester-03/discrete-03/notebooks.json` | 0；S1–S7全绿、S6真实3cell，error0 | notebooks.log/json |
| `npm run build` | 0；全站静态课程生成，无MDX编译失败 | build.log |
| `WIKI_VERIFY_PORT=8183 npm run verify -- discrete-sampled/difference-equation` | 0；9项全PASS，WARN0/FAIL0/SKIPPED0；HTTP200、H1=1/H2=9、KaTeX错误0 | verify.log |
| 浏览器Pyodide逐课审计 | 3实验3cell全通过，无保留代码 | pyodide.json |
| 实际普通课程页全部运行 | 3实验全部产生输出，与原生文本一致；375px根宽360，无整页溢出；所有目录锚点存在、图片加载、控制台error0 | browser-native.json、mobile.png |
| `npm run build:pages` | 0；205课程、9旧入口、basePath=/control-universe | pages-build.log |
| 实际静态课程页全部运行 | 3实验全部完成，文本与原生一致；SVG使用正确/control-universe/images路径 | browser-pages.json、desktop.png |
| `node .agent/semester-03/discrete-03/validate.mjs` | 0；最终源hash一致、原生/Pyodide/两种页面文本逐字一致、9个实际标题ID同序、无重复ID | validation.log/json |
| `npm run math:check` | 0；同行块公式违规0 | math.log |
| `npm run glossary:check` | 0；PASS3/WARN2/FAIL0为已登记全站提示 | glossary.log |
| `node --test scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs` | 0；10/10 | tests.log |
| `node --test scripts/check-semester03.test.mjs` | 0；16/16，含逐课例外不自动授权后续课程 | order-tests.log |
| `node scripts/check-python-support.mjs` | 0；79课、352实验可运行、25旧实验保留代码 | python-policy.log |

最终统计和台账校验分别见check.log、semester-check.log。OUTLINE与tracker统计由脚本重算，首次刷新时旧统计产生FAIL原样保存在refresh.log，之后独立check复跑才作为放行证据。合入列须等真实master提交后补hash，不能以签发代替提交。

完整保留一阶a=1边界、重根先升后降序列及遗漏Z初值4→0反例。不同方程的图不作控制方法排名；复根与一般稳定性保留为后课范围。25项旧Python待办保持原有任务元数据，不借新课关闭旧债。

过程中纠正目录标题Z的大小写：catalog初始slug“用Z变换核对”与真实ID“用z变换核对”不符，已按共同渲染管线修正。随后数学审读补差分符号与ROC；早期构建单独留档（build-before-anchor-review.log、build-before-final-wording.log），只有最终build.log及绑定最终源hash的页面/内核证据用于签发。

用户明确“继续DISCRETE-03”，按计划§2.3登记本课暂缓DISCRETE-01的单课例外；先修DISCRETE-02与MATH-10已交付，不使用前课未验收实验。顺序守卫未修改，只补本课配置并更新回归测试，保证DISCRETE-02的例外本身不会授权DISCRETE-03，也不会自动放行DISCRETE-04。

工作区临时端口四文件、proofreading文件和DISCRETE-01草稿不提交。Pages仅作本地构建验收，未授权公网发布。

master交付提交：3a579d90706c37f7b12ab085fccfffdaf061b399。合入列据真实提交勾选，本学期生产完成52课，回执阶段semester-check.log显示merged=52。
