# DISCRETE-05 验收记录

2026-10-19，起点master c9c6b24；重构离散系统稳定性。Phase1–4、六组审校与A/B/C/D档案见docs/discuss-log/semester-03/06-discrete-sampled/05-discrete-stability-criteria.md。签发与真实master回执按最终证据登记，不继承旧draft状态。

完整原稿source-before.mdx、原始内核baseline-notebooks.json/log、原标题headings-before.json、原实际页面browser-before.json。原9H2、38标题主题、41课程ID、三组旧实验四cell、四题全部保留纠错，新增两组补核，共5Notebook6cell。所有最终证据须绑定最终源hash。

最终MDX SHA256（LF归一化）：28f262c87f829fd58fdb9aac11c979d562e073086fd839c3a8f598548670ee2b。

| 命令/操作 | 退出码与关键结果 | 原始证据 |
|---|---|---|
| JUPYTER_PORT=8981 node scripts/verify-discrete05.mjs | 0；真实TS十三配置、每组51步对独立60位mpmath根/矩阵幂；最大根偏差4.440892098500626e−16；六Ts完整响应、三阶两增益、滤波PID与题解由独立状态/解析频响/SymPy复核 | reconciliation.log/json、reference.py、actual-ts.json |
| node scripts/nb-cells.mjs verify discrete-sampled/discrete-stability-criteria --require-kernel --port 8981 --out .agent/semester-03/discrete-05/notebooks.json | 0；5Notebook6cell、error0、PASS1/WARN0/FAIL0/SKIPPED0；原始setup也实跑 | notebooks.log/json |
| npm run build | 0；全站课程生成，无MDX编译失败 | build.log |
| WIKI_VERIFY_PORT=8183 npm run verify -- discrete-sampled/discrete-stability-criteria | 0；九项全PASS、HTTP200，H1=1/H2=9、KaTeX错误0 | verify.log |
| 浏览器Pyodide逐课运行 | 5Notebook6cell全部passed，最终源hash相同 | pyodide.json |
| 实际普通课程页全部运行 | 六个输出与原生/Pyodide逐字一致，控制台error0；两滑块Home/End、四预设/恢复实测 | browser-native.json |
| 实际Chrome375px | innerWidth375、scrollWidth360，无整页溢出，KaTeX错误0 | browser-mobile.json、mobile.png |
| npm run build:pages | 0；205课、9旧入口、basePath=/control-universe | pages-build.log |
| 实际Pages本地静态页全部运行 | 五组全部运行、六输出与原生一致，SVG使用/control-universe/images路径 | browser-pages.json、desktop.png |
| node .agent/semester-03/discrete-05/validate.mjs | 0；最终源hash、原生/Pyodide/两页面文本、9H2同序、旧ID保留、无重复ID和手机宽度通过 | validation.log/json |
| npm run math:check | 0；同行块公式违规0 | math.log |
| npm run glossary:check | 0；PASS3/WARN2/FAIL0为已登记全站提示 | glossary.log |
| node --test scripts/check-semester03.test.mjs scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs | 0；28/28；05例外不自动授权06 | tests.log |
| node scripts/check-python-support.mjs | 0；79课、359实验可运行、22项保留代码 | python-policy.log |
| node scripts/check-fix-logs.mjs；node --test scripts/check-fix-logs.test.mjs | 0/0；64索引/64详情、两个预留、next067；16测试通过 | fix-check.log、fix-tests.log |

数值容差：TS根1e−12，长不稳定递推相对2e−12；正常响应/频响/交点1e−8，库FRD裕度插值1e−7。正文约数按末位舍入。原合并传递函数低频相消导致约3.8e−6实部误差，改分开求对象/控制器频响后最大绝对误差约2.4e−10；没有扩大容差迁就结果。最终源的相位分支展开与独立参考对本例负物理相位选支相互核验，保留早期错误报告reconciliation-before-phase-branch.json/log，不用它签发。

原始基线为3Notebook4cell、其中三cell报错；本次保留原对象/用途再修API、t=kTs、滤波和频率变量，未用新实验替代旧实验。题3近似估计损失10.421682°的落败工况保留；K10连续已不稳的反例保留，另标K1新例而非隐改参数。名义与结构稳定性、单位圆状态与BIBO、离散鲁棒适用条件均纠正；原w映射本来正确，明确保留。

PY-008/PY-009本课旧实验实跑后关闭，待办24→22，其余task/category/next元数据全部保留。W08不等号扫描旧缺陷以本课LaTeX lt表达避开，5Notebook6cell抽取与页面数必须同时核；W08未宣称全局修复。W09既有跨环境连接事项、用户批阅与其它课程不借此关闭。早期build和pages-before-output-audit日志不作最终签发证据。

最终全局check与学期守卫见check.log、semester-check.log；OUTLINE与tracker统计由脚本重算，首次刷新旧统计的失败留refresh.log，另跑独立check后才放行。合入列仅等真实master提交后补hash。

`npm run check`最终退出0：PASS21/WARN2/FAIL0；`node scripts/check-semester03.mjs`退出0。签发见讨论日志Phase4；本期生产完成54课，合入数需等实际提交后再从53变54。

用户明确指定DISCRETE-05，独立登记暂缓DISCRETE-01；已交付04与Lyapunov为起点，局部解释采样/保持，不使用未验收01数值。本对话仅交付05；本地端口四文件、用户proofreading与01草稿排除提交。Pages仅本地构建，另行授权才发布。

master交付提交：8aa700be5d624925f7814f6a460db1d9c38b25b3。据真实提交勾合入列，本学期生产及合入均54课；semester-check.log回执merged=54。原source-before.mdx历史空格原样保留，交付代码无新增行尾空格。
