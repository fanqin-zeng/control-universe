# DISCRETE-08 采样数据系统验收

范围：仅新写discrete-sampled/sampled-data-systems，采用wiki-lesson-new与共同Phase1–4。起点master e7447dc；原为空占位、无正文，证据见source-audit.md及browser-before.json。用户指定08，独立登记暂缓01；不交付09/10，不发布Pages。讨论日志在docs/discuss-log/semester-03/06-discrete-sampled/08-sampled-data-systems.md。

教学主线：连续对象/采样/保持→一段精确解→Phi/Gamma积分→状态反馈/一拍延迟→旋转输出漏采→完整状态Schur到连续指数衰减的有条件证明。默认一阶对象K2/T.5s/x0=1，四题四答案；新SVG与一个React交互，两Notebook四cell。不使用未交付01作为前置，局部定义补足。

独立数值：原始cell的scipy增广矩阵指数、分段solve_ivp、二阶根与旋转矩阵，对不导入scipy/control的mpmath60位解析式；39493个量最大误差2.95e−12，阈值1e−9。实际调用纯TS十三配置全部节点/段内曲线/保持输入对高精度解析，最大绝对误差2.67e−15，阈值1e−10。临界按数学ln3严格边界解释，UI明确“临界附近（按显示精度）”；采样零的数值残差按1e−12绝对容差核，不硬将实验结果置零。

初稿顺读发现Notebook先于相关矩阵解释，已把NB1放在延迟推导之后、NB2放在两拍测量解释之后，并改清小球绕圈入口。源hash变化后严格内核/独立数值/浏览器/两页面与构建重新执行，不继承旧hash。图例初次截图未显示，改显式legend数据/文字色及双轴整数间隔后重构建；状态/输入左右轴明确，.1..1.5s范围所有TS检查轨迹不越固定轴。

最终课程源hash：2822cbfcd1607ea1d9ba2c1d248363e0a9c4669cb37013e5cffe74cfc37013eb。独立数值、原始内核、Pyodide与两实际页面/手机验收均通过，全局与学期守卫结果见文末。

| 实际命令/操作 | 当前结果 | 证据 |
|---|---|---|
| npm run check（基线） | 0；PASS21/WARN2/FAIL0 | check-before.log |
| JUPYTER_PORT=8981 node scripts/verify-discrete08.mjs | 0；十三实际TS、39493个量独立核 | reconciliation.log/json、actual-ts.json、reference.py |
| node scripts/nb-cells.mjs verify discrete-sampled/sampled-data-systems --require-kernel --port 8981 --out .agent/semester-03/discrete-08/notebooks.json | 0；两Notebook四cell、error0、PASS1/WARN0/FAIL0/SKIPPED0 | notebooks.log/json |
| npm run build | 0；无MDX编译/运行失败 | build.log |
| WIKI_VERIFY_PORT=8183 npm run verify -- discrete-sampled/sampled-data-systems | 0；九项PASS，HTTP200/H1=1/H2=7/KaTeX错误0 | verify.log |
| 逐课Pyodide全部运行 | 两实验四cell全passed，最终源hash一致 | pyodide.json |
| 普通课程页全部运行、滑块/四预设/恢复 | 输出按1e−9容差与原生/Pyodide相同，默认/边界/图例/曲线复核 | browser-native.json、native.png |
| npm run build:pages | 0；205课/9旧路由，basePath=/control-universe | pages-build.log |
| 实际Pages本地课页全部运行 | 两实验四cell输出一致，SVG正确基路径加载 | browser-pages.json、desktop.png |
| 实际Chrome375px | innerWidth375/scrollWidth360、KaTeX0，无整页横溢出；控件/图例/双轴可读 | browser-mobile.json、mobile.png |
| node .agent/semester-03/discrete-08/validate.mjs | 0；最终源hash、两页面/三运行输出、7H2同序、目录目标/无重复ID/控制台错误/图片和手机宽度核 | validation.log/json |
| node scripts/check-python-support.mjs | 0；80课、384实验中367可运行/17保留代码 | python-policy.log |
| npm run math:check | 0；同行违规0 | math.log |
| npm run glossary:check | 0；PASS3/WARN2/FAIL0，既有全站提示 | glossary.log |
| node --test scripts/check-semester03.test.mjs scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs | 0；31/31，08例外不自动授权09 | tests.log |
| node scripts/check-fix-logs.mjs | 0；66索引/66详情、两个预留、next069 | fix-check.log |

本课为新课，迭代内拦下的稿件问题记在讨论日志，没有捏造历史fix投诉或新增069。全站W08/W09/W10、S04历史债务与其它课程保持原状态。新增两实验的Pyodide支持必须与最终源hash绑定，其余17保留代码待办的task/category/next保留。用户批阅和四个本地端口文件不提交，01草稿隔离后在交付末恢复。


最终`npm run check`退出0：PASS21/WARN2/FAIL0；`node scripts/check-semester03.mjs`退出0，见check.log/semester-check.log。首次自动刷新前的五项旧统计FAIL保留refresh.log；OUTLINE/tracker脚本刷新后独立复验才放行，不把第一次刷新视作绿。本课verify九项全部PASS，最终validate退出0。学期3生产完成57课，合入数先为56，待真实master提交后登记为57。catalog总v1.3为60/205，73交互组件，与学期3生产口径区分。

Phase4已据实际证据签发，实际master交付提交：33a3931c0e3f33192d1edb43d9f3eecabd432cb5。合入列据真实提交勾选，semester-check.log回执merged=57，学期3生产/合入均57课。本次仅本地Pages格式验收，没有推送gh-pages或发布公网。
