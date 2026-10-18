# DISCRETE-06 验收记录

2026-10-19，起点master 547809e；重构离散化方法。Phase1–4、六组审校与A/B/C/D证据见docs/discuss-log/semester-03/06-discrete-sampled/06-discretization-methods.md，签发按最终证据登记，不继承旧稿状态。

原source-before.mdx、headings-before.json、browser-before.json及baseline-notebooks.json/log保留。原八H2、39标题主题、41旧课程ID、三Notebook四cell对象/用途和四题保留纠错；新增一Notebook一cell，共四Notebook五cell。数字PID材料尚未迁入IMPL-02，当前全文保留可读，本课不顺带交付该课。

正式H1为离散化方法，旧数字控制器设计ID用span保留；原离散化方法H2因与新H1同名，canonical改离散化方法-1，旧ID现在明确指向H1开篇，catalog同步真实H2目标。该歧义不伪装为同一段落定位；其它旧标题ID逐项复核。

用户明确指定06的单课例外独立登记，01草稿保留；已有差分方程、04/05与数值方法为起点。本地四处端口与用户proofreading排除提交，Pages仅本地验收，未授权发布。

最终MDX SHA256（LF归一化）：b4dd95e6f357b5bb1dfb5eb69832cc0fc9f536ce6308be0e188e1f5aea3046ed。

| 命令/操作 | 退出码与关键结果 | 原始证据 |
|---|---|---|
| JUPYTER_PORT=8981 node scripts/verify-discrete06.mjs | 0；真实TS十三配置、每方法21步对60位mpmath；最大乘数偏差1.11e−16，六AW轨迹对50位Decimal，电机完整响应与频响对独立状态/解析式，全部四题逐量核 | reconciliation.log/json、actual-ts.json、reference.py |
| node scripts/nb-cells.mjs verify discrete-sampled/discretization-methods --require-kernel --port 8981 --out .agent/semester-03/discrete-06/notebooks.json | 0；4Notebook5cell，原始setup/cell实跑，error0、PASS1/WARN0/FAIL0/SKIPPED0 | notebooks.log/json |
| npm run build | 0；静态课程生成，无MDX编译失败 | build.log |
| WIKI_VERIFY_PORT=8183 npm run verify -- discrete-sampled/discretization-methods | 0；九项全PASS，HTTP200，H1=1/H2=8，KaTeX错误0 | verify.log |
| 浏览器Pyodide逐课全部运行 | 四实验五cell全部passed，源hash相同 | pyodide.json |
| 实际普通课程页全部运行 | 五段输出与原生/Pyodide逐字一致，两个滑块Home/End、四预设和恢复实测，控制台error0 | browser-native.json |
| 实际Chrome375px | innerWidth375、scrollWidth360，无整页横向溢出，KaTeX错误0 | browser-mobile.json、mobile.png |
| npm run build:pages | 0；205课、9旧路由，basePath=/control-universe | pages-build.log |
| 实际静态课程页全部运行 | 四实验五cell文本与原生一致，SVG正确基路径加载 | browser-pages.json、desktop.png |
| node .agent/semester-03/discrete-06/validate.mjs | 0；源hash、三运行/两页面文本、八H2同序、旧ID保留、无重复ID及手机宽度核通过 | validation.log/json |
| npm run math:check | 0；同行块公式违规0 | math.log |
| npm run glossary:check | 0；PASS3/WARN2/FAIL0为既有全站提示 | glossary.log |
| node --test scripts/check-semester03.test.mjs scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs | 0；29/29，06例外不自动授权07 | tests.log |
| node scripts/check-python-support.mjs | 0；79课、362实验可运行、20保留代码 | python-policy.log |
| node scripts/check-fix-logs.mjs；node --test scripts/check-fix-logs.test.mjs | 0/0；65索引/65详情、两个预留、next068，16测试通过 | fix-check.log、fix-tests.log |

数值容差：TS乘数1e−12、长不稳定序列相对2e−12，其余响应/频响/交点1e−8；正文约数按末位舍入。实际AW完整轨迹最大误差5.69e−14，4146电机采样响应点≤6.4e−13、3000复频点≤1.9e−11，四PI方法500点/方法频响≤5.5e−14。存在的数值路线均真实执行，没有用“可运行”代替独立复算。

原基线三Notebook四cell中三cell报错；本课原对象/用途全部保留再修接口、频率变量、时间轴、反算、滤波和指标。原AW50V限幅工况不饱和，保留完全持平结果；新增0.6V持续不可达/释放两组，记录真实I，反算不宣称解决不可达目标。Q4保留原连续PI参数与差分式，明确数字bw11.198826未达精确10，再补同Ti的标量修正设计。PID材料本页未删除，不虚签IMPL-02。

PY-010/011据本课原生与浏览器全部实跑关闭，待办22→20；其余task/category/next元数据保留。W10仅本课错误Euler字符图已审/撤回，以正确条件、交互及流程SVG说明，其余候选不关闭。用户批阅、W08/W09和其它课债务不借此关闭。

最终全局check与学期守卫见check.log、semester-check.log；OUTLINE/tracker统计由脚本刷新，首次旧统计的失败保留refresh.log，独立check复跑后才放行。真实master提交后再补hash/勾合入列。

截图复审曾发现交互数值纵轴的半整数刻度导致四方法标签未显示。已改为明确的类别纵轴索引0..3，普通/静态产物重新构建并实跑，desktop.png复核四行标签完整；早期build-before-label-review.log/pages-before-label-review.log不用于最终签发。数学源hash与计算未变，最终页面证据仍重新采集。

最终`npm run check`退出0：PASS21/WARN2/FAIL0；`node scripts/check-semester03.mjs`退出0。本期生产完成55课，合入数先为54，等真实master提交后登记为55。七组P0修正均关闭、无本课阻断，正式签发见讨论日志Phase4。
