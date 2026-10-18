# NONLINEAR-12 分岔与混沌验收

2026-10-19；起点master 6d345d1。空占位按wiki-lesson-new与共同讨论Phase1–4，仅交付本课。用户三份未提交批阅保持，不合润色分支、不发布Pages。

正文13H2、4Notebook5cell、五题五答、BifurcationExplorer及摆SVG。从电机带摆的平衡消失进入折叠/叉形/Hopf，逐步定义Logistic不动点、乘子和周期2，解释有限指数和例外；受迫Duffing以真实周期射击验证稳定性。未把点云当混沌证明，未把有限扫频当全局分支认证。

## 验收证据

| 检查 | 实际执行及结果 | 文件 |
|---|---|---|
| 原始代码与独立数值 | node scripts/verify-nonlinear12.mjs退出0；14组真实TS共140014轨道点，前20步对80位高精度最大误差4.1370129544304746e-11<1e-8；全部逐步多项式残差最大2.220446049250313e-16<5e-16，稳定周期对高精度根<1e-10；三种初态17424点云同样核状态域/转移残差。Hopf由独立Radau对径向闭式核；Duffing由Radau及有限差分DP独立对增广DOP853 | reconciliation.json/log、reference.py、actual-ts.json、actual-cloud.json |
| 严格内核 | node scripts/nb-cells.mjs verify nonlinear/bifurcation-chaos --require-kernel --out .agent/semester-03/nonlinear-12/notebooks.json退出0，EXECUTED，4实验5cell、error0/FAIL0/SKIPPED0 | notebooks.json/log |
| 浏览器原始Python | 最终同源4实验5cell passed，四实验全部stdout与原生逐字一致，三张图实际生成 | pyodide.json、validation.json |
| 单课HTTP/真实编译 | WIKI_VERIFY_PORT=8083 npm run verify -- nonlinear/bifurcation-chaos退出0，PASS9/WARN0/FAIL0/SKIPPED0，HTTP200、H1=1/H2=13、KaTeX0、五题五答 | verify.log |
| 真实交互与布局 | 默认、周期1/4、窗口、不规则、特殊不动点、键盘r3临界、初态.05/.95、恢复均实际操作；四实验同页全部运行完成；图像加载、目录目标存在、ID唯一；375px实际宽/滚动宽均360，无console告警错误 | browser.json、desktop.png、controls.png、mobile.png |
| 联合核验 | node .agent/semester-03/nonlinear-12/validate.mjs退出0，pass=true；教学stdout与独立Duffing乘子核对通过 | validation.json |
| 最终普通构建 | npm run build退出0，Compiled successfully、210/210路由；无MDX编译失败 | build.log |
| 最终Pages本地构建 | npm run build:pages退出0，verify-pages pass=true、205课/9旧入口 | pages-build.log |
| 数学/术语 | npm run math:check退出0；npm run glossary:check最终退出0，PASS3/WARN2/FAIL0。新增九术语与vartheta符号；首次符号缺登记FAIL已修，不放宽规则，既有C2b/C4保留 | math-check.log、glossary.log |
| 基建回归 | node --test scripts/lesson-route.test.mjs scripts/check-semester03.test.mjs scripts/verify-lesson-port.test.mjs退出0，17/17通过 | tests.log |
| Python支持策略 | node scripts/check-python-support.mjs退出0，77课程371Notebook，346放行、25代码展示。finalize-python-support增量合并最终源结果，既有25待办task/category/next原样保留 | python-support.log、lib/python-support.json |
| W13来源审计 | python .agent/semester-03/nonlinear-12/w13-audit.py退出0，四种驻留/步长/网格的完整状态+相位方向扫频成功，原每点残差保留；source-audit.md登记旧程序峰值重置及局部/全局边界 | source-audit.md、w13-audit.json/log/py |

最终正文源指纹70a3771e9e52ef3b8264123051d3ad2ddb07ee47474da9e9233c11bba803d77f。长期混沌轨道未宣称与无限精度逐点接近；核的是高精度短程、每步方程残差、稳定周期和有限日志求和合同。界面明确时序和有限指数同从丢弃2000步后起算，窗口不是串联。

W13完成含义是指定旧材料已审并处置：NB6扫频初态/相位/谱窗/近似稳定性，NB7按模2pi平衡及零根，NB9继承NONLINEAR-02的局部审查而非旧全局吸引域主张。细网格跳跃观察区间升频[2.25,2.275]、降频[1.65,1.675]；未冒充精确折叠点。T120粗网格周期残差约7.02e-4等较差场景保留，见source-audit.md。无需改变历史来源快照。

本轮只停止核对命令后确认属于自己的8083生产服务（PID31356）；既有8081/8082/8891保留。全局npm run check最终退出0，PASS21/WARN2/FAIL0，53/205交付、78正文、68Explorer。首次自动大纲/统计刷新先校验旧统计产生5FAIL后写入正确值，完整catalog-refresh.log保留；等待完成再运行check全绿。两个WARN仍是25旧稿日志债与跨章同slug，未降低门槛。master回执在真实提交后补入。

最终学期门槛node scripts/check-semester03.mjs退出0，45任务/37完成，提交前merged49（本课不虚填hash）；Python支持门槛退出0。代码与文档空白检查排除原始.log后通过；原始verify.log保留工具PASS列尾空格。所有最终结果与源指纹关联，截图人工检视确认正文/图形可读。
