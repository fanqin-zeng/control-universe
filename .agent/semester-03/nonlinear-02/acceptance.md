# NONLINEAR-02 相平面验收

2026-10-18，起点master104126b7b2f5c2c8d231138ce173e767ffcf99b9。按wiki-lesson-refactor与共同技能完整Phase1–4，仅本课。直接master交付，不发布gh-pages，不纳入用户三份proofreading文件。

秋千同位置不同速度引入，保留原十二Notebook/六题及两交互，补拖块摩擦局部核验与答案复算，共14Notebook/27cell、15短H2、SVG。纠正双曲重根/奇异Jacobian、零导数线/PB条件、有限积分到全局/混沌的过推、阻尼比与冲击状态/夹角；实验print与正文同步纠错。两组件修实际末样时间/负参数径向解/临界无阻尼分界轨迹与窄屏表格。

| 命令/检查 | 退出/结果 | 证据 |
|---|---|---|
| node scripts/verify-nonlinear02.mjs | 0；真实TS15相图+28迹行列式对独立DOP853/矩阵指数/径向闭式；默认阈值反向稳定流形核 | reconciliation.log/json、component-final.json、reference.py |
| node scripts/nb-cells.mjs verify nonlinear/phase-plane --require-kernel --out .agent/semester-03/nonlinear-02/notebooks.json | 0；EXECUTED，14份/27cell，FAIL0/SKIPPED0 | notebooks.log/json |
| npm run verify -- nonlinear/phase-plane | 0；HTTP200、15H2、katex-error0、组件单注册 | verify.log |
| npm run math:check / npm run glossary:check | 0；术语PASS3/WARN2/FAIL0 | math-check.log、glossary.log |
| npm run build / npm run build:pages | 0；205课/9旧入口 | build.log、pages-build.log |
| node scripts/check-python-support.mjs | 0；73课349实验/526cell，324启用/25保留代码 | python-policy.log、pyodide.json |
| node --test scripts/lesson-route.test.mjs scripts/pages.test.mjs | 0；12/12 | route-pages-tests.log |
| 实际静态页交互 | 三实际工具栏全部完成（NB1/摩擦/答案复核）；两组件参数边界与恢复、360/375px均无整页溢出、控制台warn/error0 | browser.json、desktop.png、narrow.png |
| npm run check / node scripts/check-semester03.mjs | 0；check PASS21/WARN2/FAIL0；学期checklist退出0 | check.log、checklist.log |

原25渲染ID全部保留，正文渲染39ID/完整静态DOM41ID无重复；共享标题管线与实际DOM逐一核对。日常v1.3计数维持49门，本期交付须单独打勾。本课数值轨迹含NB4/NB5原本发散测试中的37次求解停止：均显式输出last time，不当完整时域成功/精确无穷/完整吸引域。求解器执行输出与课程解释的边界分别记录。

W13本课拖块模型只审坐标/平衡偏移/三速度三扰动T400局部结果，NONLINEAR-12跳跃与分支来源仍待审。25项Python待办ID、原因和下一步保持；W08/W09/W10不关闭。Phase3六组、A.1六列表/A.2原始输出、B九门槛与四补充、C限定比较/D保留映射见本期讨论日志；历史semester-01日志不改。

Phase4已签发；本课实际交付提交进入master后再登记hash/勾合并列。

最终聚合验证：node .agent/semester-03/nonlinear-02/validate.mjs退出0；完整MDX/两TS指纹、14/27原始运行、25项待办不变、34页内目标、全部旧ID、三工具栏及两窄屏断言均通过。实际组件最大状态误差5.73e-7，独立反向稳定流形对默认二分阈值差5.50e-12。

正文与原始实验的print说明在审校中多次同步纠错，最终每次源变更均重跑浏览器原代码；早期报告仅作过程档案，最终验收只认pyodide.json/reconciliation.json及delivery-validation.json中的当前指纹。原HTTP60s长实验请求曾超时，本课独立脚本预算增至600s；未缩短T400或删失败工况。默认临界摆的首次RK4失败保留pre-fix-reconciliation.log。
