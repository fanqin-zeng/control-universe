# MATH-18 数值方法验收

唯一交付math/numerical-methods，起点master ed7a876，工作分支wp/math-18-numerical-methods。新写专用SKILL与学期3共同约束；讨论日志docs/discuss-log/semester-03/02-math/18-numerical-methods.md按阶段持续记录。十名角色为既有结构化审查视角，不冒充真实外部专家或独立Agent；何仿沉默由郑核代核合同，柯验独立核数。

## 内容与范围

14H2、6题步骤答案、7原始Notebook各1cell、双图CoolingNumericsExplorer。热水冷却引入有限步计算，串起舍入/截断、条件数/残差、分解求解/最小二乘、包根/停止、差分求积、Euler/后退Euler/RK4、阶数/稳定域/刚性、自适应/事件/仿真审计。先修保持矩阵分解、多元微积分、微分方程与矩阵指数。杯子分钟、刚性双模态秒，给定模型不冒充真实温度保证；温度积分不等热量。W06/W07/W08不关闭，其它课程正文不改。

## 数值与独立性

- minimal.py/log先跑默认、边界、二分、积分。默认t4解析21.09893833332405℃，Euler20.234375，BE22.3411065386374，RK4 21.10242441707294；预算8/8闭式/32RHS。
- scripts/verify-math18.mjs经AST提取实际TS计算函数，Euler和RK4实际stage循环对reference.py的mpmath80位稳定函数幂；9个k×5个N=45组，全部N+1时间节点、201解析参考样点、全5减半误差点。最大差2.9006313624088356e−14<1e−9，8非法输入拒绝，轴域与零误差显式核。0…4min真实t=jh，无抽稀；log轴零误差用null不造正数。
- 七原始setup/cell各干净8891kernel，另核高精度消去、病态输入变化/LS、二分22次、解析积分、完整固定步序列、RK45事件与Radau双模态、六题答案合同；严格nb-cells EXECUTED/7cell/FAIL0/SKIPPED0。首轮NB7多一个右括号导致SyntaxError，修后全部重跑，初始失败保留。
- extract/assemble原始7Notebook/14block求值后反向全等；原始标签、提取、kernel、Pyodide、页面DOM独立计七。最终正文SHA与reconciliation/browser-python相同，source-consistency.json留证，W08仍待办。
- Pyodide0.27.7原始七实验全部通过，含Radau；合并后兼容69课/285Notebook/458cell、255启用/30代码展示。此前68课记录/政策与待办30逐字段不变，scope-check.json证明，Worker未改、不扩大Slycot支持。
- 附C五条六列红队记录：默认低误差仅同网格限定观察，预算不同；三k×五N全量保留，k0持平、k2/N4 BE与RK4持平，刚性大步RK4失败。条件阶数、求积、差分都明确适用范围，不作效率普遍排名。

## 实际验收

| 命令 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-math18.mjs | 45组全轨迹与独立高精度、7原始实验合同，退出0 | reconciliation.json/log |
| node scripts/nb-cells.mjs verify math/numerical-methods --require-kernel | 7cell EXECUTED/FAIL0/SKIPPED0，退出0 | notebooks.json/log |
| npm run verify -- math/numerical-methods | 无FAIL，退出0 | page-verify.log |
| npm run glossary:check | PASS3/WARN1/FAIL0，退出0；旧函数名WARN | glossary.log |
| npm run math:check | 同行美元围栏违规0，退出0；本课8独占围栏/4display | math-fences.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14通过/0失败，退出0 | regression.log |
| node scripts/check-fix-logs.mjs | 索引一致，退出0 | fix-index.log |
| node scripts/check-python-support.mjs | 69课/255启用/30代码展示，退出0 | python-support.log |
| npm run check（draft） | PASS21/WARN2/FAIL0，退出0 | check-draft.log |

生产最终状态、签发、实际合并回执后附。用户两份proofreading不编辑不暂存，本次不推送远端、不发布gh-pages。


## 最终交付状态复验

catalog=v1.3、旧tracker与全局checklist前五项同步。最终npm run check退出0，PASS21/WARN2/FAIL0（check-delivery.log）；motion-planning跨章同slug与34门存量正文缺日志为已登记旧WARN，不在本课扩围。初次fix-outline/stats仍按修改前统计报FAIL，生成后独立check全绿，不把修正命令中间结果伪记通过。

最终npm run build / npm run build:pages / npx tsc --noEmit均退出0，无MDX编译失败（build-delivery/pages-delivery/types-delivery.log）。Pages本地导出205课/9旧路由/318713803字节，visual版318714120仅历史；最终npm run verify -- math/numerical-methods退出0、PASS9/WARN0/FAIL0/SKIPPED0（page-delivery.log）。

browser-results.json finalDelivery=true：真实14H2顺序/ID/全部目录锚点/无重复ID，4display居中auto、KaTeX错误0，7Notebook；减半/振荡/零/上下端点/N4与64及64禁用/默认恢复通过。最终交付导出页答案在Pyodide实际完成，控制台warn/error空。390px配置文档375、正文343=scroll343、双canvas313×300/313×260。opening.png、narrow.png、interaction.png与narrow-chart.png人工查看清晰；两横轴名称下置居中，无裁切，零误差说明明确。窄屏滚动曾超过图表，按实际DOM位置重新定位后才留图，不把画面之外的区域算视觉验收。

source-consistency.json：最终正文SHA aa7c4aec92a0fddd9948d7d2f180d0d1f898d7b6c13c792e84a1b9a1d92b66a3，与独立复算及浏览器报告一致，原始/提取/kernel/Pyodide各7、H2十四/独占围栏8。scope-check证明此前68课兼容记录及30待办逐字段未改。check-log通过40行六列对账、九项+四条、五条红队放行及单次签发；结构检查不能代替已记录的语义与可见画面检查。

用户两份proofreading不编辑不暂存；W06/W07/W08与全站收官保持待办。本对话只交付MATH-18，没有推送远端、没有发布gh-pages。真实合并回执后附。


合并回执：课程提交 `36da790` 已用 `--no-ff` 合入 master，课程合并提交 `b4d3b8e22c63cbbf159fffaa2401d3998aa1c598`。全局checklist六项全部完成，数学章本期18课均已交付；只交付MATH-18，W06/W07/W08保持待办。没有推送远端、没有发布gh-pages。
