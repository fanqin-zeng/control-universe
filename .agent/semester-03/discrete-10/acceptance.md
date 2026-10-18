# DISCRETE-10 事件触发控制验收

仅本课新写wiki-lesson-new Phase1–4，起点master3b6fd6c。Phase1–4和全部验收已完成，郑核据实签发；真实master hash待提交后登记。01草稿隔离，本地四处端口与用户批阅排除提交，不发布Pages。

核心：分清测量/发送/输入更新，旧读数误差与理想连续Lyapunov充分条件；周期检查不继承全时误差界，默认/持平/发散/漏检四工况完整报告。八H2/四题四答、一Explorer/SVG、两Notebook四cell。独立60位闭式事件段对实际TS17配置误差1.33e−15，195组合轴范围通过；原始solve_ivp实验36610变量对独立参考最大8.49e−12<1e−9。


| 实际命令/操作 | 退出码/实际结果 | 版本化证据 |
|---|---|---|
| npm run check（基线） | 0；PASS21/WARN2/FAIL0 | check-before.log |
| JUPYTER_PORT=8981 node scripts/verify-discrete10.mjs | 0；17真实TS/195轴组合/36610原始Notebook量独立对账 | reconciliation.log/json、actual-ts.json、axis-range.json、reference.py |
| node scripts/nb-cells.mjs verify discrete-sampled/event-triggered-control --require-kernel --port 8981 --out .agent/semester-03/discrete-10/notebooks.json | 0；两Notebook四cell，error0/FAIL0/SKIPPED0 | notebooks.log/json |
| npm run build | 0；无MDX编译/渲染失败 | build.log |
| WIKI_VERIFY_PORT=8183 npm run verify -- discrete-sampled/event-triggered-control | 0；九项PASS，HTTP200/H1=1/H2=8/KaTeX错误0 | verify.log |
| Pyodide逐课全部运行 | 两实验四cell passed，最终源hash一致 | pyodide.json |
| 普通课页全部运行与预设/边界/恢复 | 四预设、sigma两端、h选择、默认与漏检曲线复核 | browser-native.json、native.png、native-failure.png |
| npm run build:pages | 0；205课/9旧路由、basePath正确 | pages-build.log |
| 实际Pages本地课页全部运行 | 四cell输出一致，SVG加载正确基路径 | browser-pages.json、desktop.png |
| Chrome375px | width375/scrollWidth360，KaTeX0、控件和图例可读 | browser-mobile.json、mobile.png |
| node .agent/semester-03/discrete-10/validate.mjs | 0；源hash/输出/两真实DOM/目录/重复ID/图片/控制台/手机/轴范围核 | validation.log/json |
| node scripts/check-python-support.mjs | 0；82课/388实验，371可运行/17保留代码 | python-policy.log |
| npm run math:check | 0；同行违规0 | math.log |
| npm run glossary:check | 0；PASS3/WARN2/FAIL0，既有全站提示 | glossary.log |
| node --test scripts/check-semester03.test.mjs scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs | 0；33/33，10例外不放行IMPL-01 | tests.log |
| npm run check -- --fix-outline --fix-tracker-stats | 1；旧统计五FAIL后自动刷新，未当通过 | refresh.log |
| npm run check（刷新后独立复验） | 0；PASS21/WARN2/FAIL0 | check.log |
| node scripts/check-semester03.mjs | 0；生产完成59课，进入master列据真实提交再登记 | semester-check.log |

最终源hash fe21ff86218020ddde30d93116f08df60cecf1014de0efa27158a596db0d5892。独立TS最大误差1.33e−15、原始ODE最大8.49e−12，容差1e−9；两页面与原生/Pyodide输出一致。catalog全站62/205交付、75Explorer；学期3完成59课（不同口径）。17项Python待办task/category/next保留，既有全站WARN/W任务不关闭。仅本课交付，不发gh-pages；01草稿交付末恢复并核验，四处本地端口与用户批阅不提交。
