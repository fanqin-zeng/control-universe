# MODERN-06 最优控制验收

2026-10-18，起点master f690eb7。wiki-lesson-refactor完整Phase1–4，日志docs/discuss-log/semester-03/04-modern/06-optimal-control-basics.md。仅本课，不发布gh-pages，不纳入用户三份proofreading改动。

保留10主题/四例十题/原BVP与代价两cell用途，扩五实验六cell。小车按时停车的目标冲突引入与SVG；修例3输入解释/Q1完整代价/Q5和Q7轨迹/Q9链式，补正常PMP、必要与充分、端点与自由时间/奇异弧；组件实际TS全46档×401节点对独立Gramian积分与物理ODE，最大差3.4098e−13；Notebook BVP对独立数据最大逐量差7.3078e−10。固定T比较基线同初末态，短T输入越限则明确不可行。

| 命令/检查 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-modern06.mjs | 退出0，实际原cell、真实TS/独立数值、35旧ID | reconciliation.log/json、reference.py |
| node scripts/nb-cells.mjs verify modern/optimal-control-basics --require-kernel --out .agent/semester-03/modern-06/notebooks.json | 退出0，5份6cell EXECUTED、FAIL0/SKIPPED0 | notebooks.log/json |
| 最终浏览器Pyodide | 5/5实验6cell passed，最终源指纹一致 | pyodide.json |
| node scripts/check-python-support.mjs | 退出0，316启用/27保留代码 | python-policy.log |
| npm run verify -- modern/optimal-control-basics | 退出0，PASS9/WARN0/FAIL0/SKIPPED0；HTTP200/10H2/KaTeX0 | verify.log |
| npm run math:check / npm run glossary:check | 退出0，保留两项既有术语WARN | math-check.log、glossary.log |
| npm run build / npm run build:pages | 均退出0，无MDX失败，Pages205课/9旧入口 | build.log、pages-build.log |
| npm run check / node scripts/check-semester03.mjs | 退出0，check PASS21/WARN2/FAIL0；本期计划通过 | check.log、checklist.log |
| 生产页面及手机 | 实际DOM/旧ID/侧栏、三幅图与默认/边界/复位、原始Python运行和PNG | browser.json、desktop.png、narrow.png |

失败原输出initial-*单独保留：符号等价不等于结构相等，双积分器协态初稿符号错由实际H检查拦截，MDX裸比较符解析失败；修后按最终源码实跑，未降低容差。26行六列对账与六组审校、九项门槛和四条补充见讨论日志。

兼容聚合73课/343实验/518cell，本轮仅实跑本课；27原待办ID/原因/处置以及W08/W09/W10保留，不冒报全站重跑。Phase4在实际最终验收后签发，master实际回执随后登记。

最终node scripts/verify-modern06-delivery.mjs退出0，35旧ID/40目标、375px截图与最终源指纹一致。Phase4据此签发。本课旧日志不覆盖，用户三份proofreading不纳入。
