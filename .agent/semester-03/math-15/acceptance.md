# MATH-15 微分几何入门验收

唯一交付math/diff-geometry；起点master2684978，工作分支wp/math-15-diff-geometry。新写专用讨论SKILL，四阶段日志docs/discuss-log/semester-03/02-math/15-diff-geometry.md。角色仅为既有审查视角，不冒充真实外部专家或独立Agent。

## 内容与范围

16H2、6题步骤答案、7Notebook各1cell、BracketMotionExplorer双图。从书架旁双轮差速搬运车不能直接侧滑的具体问题进入，局部坐标/圆周切空间/正则约束/度量/推前/场与流/Lie导数及括号/秩与局部边界/分布及Frobenius/SO3/相对阶接口。正则、常秩、邻域和局部/全局条件明确；不交付完整反馈线性化、一般可控性定理或实机控制器，不修改其它课程。先修保持已交付多元微积分与微分方程/矩阵指数。

## 数值与独立性

- 最小例先实跑minimal.py/log：epsilon=.5、theta0=0，净位移(.0612087190548,−.2397127693021)m；二阶(0,−.25)m，误差长度.06206717654m，总2s。保留有限动作前向残余，不称精确横移。
- 实际TS计算导出由AST提取执行，reference.py独立用solve_ivp四段运动与dense_output核全部101节点/时间/选时位姿、净位移/二阶项/误差/归一量。120参数组含四段交界、起止、正负朝向/时长上下界；81点曲线另用二维生成矩阵expm作参考，未抄三角差公式。最大差9.547918011776346e-15 < 预约1e-9；正文7位5e-8，UI四位5e-5。
- 七原始setup/cell各独立kernel运行，符号与精确断言核圆/坐标/周期/流/括号/分布/SO3/相对阶；完整版本与输出在reconciliation.json。严格nb-cells七cell EXECUTED、error0、SKIPPED0；extract/assemble七Notebook十四block相等，临时roundtrip已删。
- raw标签/提取/kernel/Pyodide分别数7，最终源码SHA一致见source-consistency.json，不能拿W08有缺口扫描器单一PASS冒充完整覆盖。
- Pyodide0.27.7七实验7/7成功；兼容清单66课/264实验/437cell、234启用/30代码展示。原65课及待办30逐字段不变、Worker不变（scope-check），不扩大Slycot支持。
- browser-dev.json：默认/缩小动作/观察转向/朝北/滑块端点/恢复；16H2及真实ID无重、7display居中auto、KaTeX错误0；390px正文343=scroll343，几何canvas313×313/下图313×240，控制台warn/error空。37.5%按钮精度与生产车头箭头另在最终生产复验记录。

## 实际命令

| 命令 | 结果 | 证据 |
|---|---|---|
| npm run verify -- math/diff-geometry | PASS9/WARN0/FAIL0/SKIPPED0，退出0 | page-verify.log |
| node scripts/nb-cells.mjs verify math/diff-geometry --require-kernel | 7cell在线实跑无error，退出0 | notebooks.log/json |
| node scripts/verify-math15.mjs | 120组101节点/81曲线点+7原始实验合同，退出0 | reconciliation.log/json |
| npm run glossary:check | PASS3/WARN1/FAIL0；补Psi符号基后通过，旧函数名警告 | glossary.log |
| npm run math:check | 14围栏独占行配平 | math-fences.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14/14通过，退出0 | regression.log |
| node scripts/check-fix-logs.mjs | 退出0，索引一致 | fix-index.log |

首轮build TypeScript拒绝line.symbol端点数组，build-first-failure.log保留；修为折线+scatter箭头，types-repair.log退出0，完整构建必须重新通过才签发。最终build/Pages/tsc、check、生产截图与合并回执后附。W06/W07/W08继续待办，两个用户批阅文件不编辑不暂存。未推送远端、不发布gh-pages。

正文实测272行；16H2、14独占行美元围栏、7display、7Notebook。

## 最终交付状态复验

签发后catalog=v1.3、tracker与全局checklist同步。npm run check退出0：PASS21/WARN2/FAIL0，两WARN沿已登记基线；check-semester03退出0。最终npm run build / build:pages / npx tsc --noEmit均退出0，无MDX编译失败。Pages本地导出205课/9旧路由/315632355字节（pages-delivery.log），此前draft315632569仅留历史。最终npm run verify -- math/diff-geometry为PASS9/WARN0/FAIL0/SKIPPED0，退出0。

最终独立生产标签browser-results.json pass=true：h1=1/H2=16、7浏览器实验、7display居中auto、KaTeX错误0；默认/缩小动作/观察37.5%时刻.750s/恢复正确，答案原始cell在Pyodide运行完成；控制台warn/error为空。旧标签兼用开发页留下的历史Fast Refresh警告单独保留priorTabHistoricalLogs，未当作生产标签错误或删除证据。390px正文343=scroll343、几何canvas313×313、第二图313×240。opening.png人工查看正文清晰，arrow-repair.png查看车头箭头与线段方向一致，narrow.png存档。原始7标签/提取/kernel/Pyodide一致，源SHA核source-consistency.json；37行三方对账、九项+四条与四份档案齐备。

W06/W07/W08不关闭；两个用户批阅文件不编辑不暂存。未推送远端、未发布gh-pages。
