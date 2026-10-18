# NONLINEAR-11 切换与混杂系统验收

2026-10-19；起点master 35056f2836c2184b093e58d76d81f540587a6216。空占位新写，执行wiki-lesson-new及共同讨论流程，单课Phase1–4。用户批阅保持，未合并润色分支、未推送gh-pages。

正文11H2、4Notebook4cell、四题四答；SwitchedHybridExplorer、实际计算lib/switched.ts及恒温器SVG。从模式记忆到周期切换反例、共同函数/最小驻留证明，再到弹跳事件与Zeno，数学结论区别规定周期规则和任意切换，不把有限仿真当无限时间证明。

## 实际验收

| 验收 | 命令/方式与结果 | 证据 |
|---|---|---|
| 独立数值及原始代码 | node scripts/verify-nonlinear11.mjs，退出0；真实TS九配置7209节点对独立SciPy expm最大绝对差4.092726157978177e-12<1e-8；原始四setup/cell完整执行 | reconciliation.json/log、actual-ts.json、reference.py |
| 严格内核 | node scripts/nb-cells.mjs verify nonlinear/switched-hybrid-systems --require-kernel --out .agent/semester-03/nonlinear-11/notebooks.json，退出0；EXECUTED，4实验4cell，error0/FAIL0/SKIPPED0 | notebooks.json/log |
| 浏览器Python原代码 | 最终源complete=true，4/4实验4/4cell passed，教学stdout相同，全部图像实际生成 | pyodide.json、validation.json |
| HTTP与编译结构 | WIKI_VERIFY_PORT=8083 npm run verify -- nonlinear/switched-hybrid-systems，退出0；PASS9/WARN0/FAIL0/SKIPPED0，HTTP200、H1=1/H2=11、KaTeX0、四题四答 | verify.log |
| 实际页面 | 默认/快切.2/慢切8/键盘tau1/恢复均核对；同页4实验并行全完成，ID唯一、目录目标存在、SVG加载，console告警错误0；375px实测宽/滚动宽均360 | browser.json、desktop.png、mobile.png |
| 联合复核 | node .agent/semester-03/nonlinear-11/validate.mjs，退出0、pass=true | validation.json |
| 最终生产构建 | npm run build，退出0；Compiled successfully，210/210路由，无MDX编译失败 | build.log |
| 最终Pages本地构建 | npm run build:pages，退出0；verify-pages pass=true、205课/9旧入口 | pages-build.log |
| 数学排版/术语 | npm run math:check及npm run glossary:check退出0；新增七术语，术语PASS3/WARN2/FAIL0，既有C2b/C4 | math-check.log、glossary.log |
| 相关基建回归 | node --test scripts/lesson-route.test.mjs scripts/check-semester03.test.mjs scripts/verify-lesson-port.test.mjs，退出0，17/17通过 | tests.log |

最终源指纹a3e63bca5bf55d29e9cab3f7448c32e52e4b949a483629f4531b3e746002df34。最末逐式审查发现符号更名有残留，已统一r并重新执行原始代码、独立数值、严格内核、两种构建和浏览器验收。前三实验stdout逐字相同；第四实验教学数值也逐字相同，唯一诊断差是事件求根误差原生3.553e-15秒、Pyodide3.997e-15秒，均小于先定1e-8容差，未改其他数值判据。原始诊断保留两路记录。

支持策略增量合并最终源实跑结果：76课367Notebook，342放行、25代码展示；既有25待办task/category/next完整保留，不宣称重新验过或关闭。独立8083生产验收服务已核对进程命令后停止；既有8081/8082/8891保留。

全局npm run check退出0，PASS21/WARN2/FAIL0；52/205交付、77正文、67Explorer。自动大纲/统计重算命令先校验旧统计，产生5FAIL并写入正确统计，catalog-refresh.log完整保留；等待其完成后最终check全绿。两个WARN为既有25旧稿日志债与跨章同slug。合入列在真实提交后补回执。

学期与支持策略最终门槛：node scripts/check-semester03.mjs退出0（提交前merged48，本课合入列尚未虚填）；node scripts/check-python-support.mjs退出0，76课/342放行/25代码展示。git diff --check退出0。验收脚本与原始证据随课提交，不含用户未提交批阅。
