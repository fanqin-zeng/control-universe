# MODERN-05 状态观测器验收

2026-10-18，起点master 4bc9b75。对应wiki-lesson-refactor完整Phase1–4；日志docs/discuss-log/semester-03/04-modern/05-state-observer.md。本轮仅本课，不发布gh-pages，不动三份用户proofreading。

保留九主题、三例十题、原两实验用途及31旧标题ID。小车只测位置的引入与SVG，修Q2/5和例3根虚部，补可检测/已知D/分离性瞬态与实际输入、完整降阶z实现及偏差边界。真实组件对独立物理ODE全26档×401点，最大差2.4496e−12；Notebook矩阵指数对ODE最大差2.44694e−12。默认L27/142、连续速度误差峰值3.531643m/s，单频100rad/s增益1.388763s⁻¹；不当随机方差或实机保证。

| 命令/检查 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-modern05.mjs | 退出0，全题/实际原cell与独立ODE通过，31旧ID | reconciliation.log/json、reference.py |
| node scripts/nb-cells.mjs verify modern/state-observer --require-kernel --out .agent/semester-03/modern-05/notebooks.json | 最终严格内核5份5cell，FAIL0/SKIPPED0 | notebooks.log/json |
| 最终浏览器Pyodide | 5/5实验、5cell passed，最终源指纹一致 | pyodide.json |
| node scripts/check-python-support.mjs | 退出0，312启用/27保留代码 | python-policy.log |
| npm run verify -- modern/state-observer | 退出0，PASS9/WARN0/FAIL0/SKIPPED0；HTTP200/H2=9/KaTeX0 | verify.log |
| npm run math:check / npm run glossary:check | 退出0；两项既有术语WARN | math-check.log、glossary.log |
| npm run build / npm run build:pages | 均退出0；无MDX失败，Pages205课/9旧入口 | build.log、pages-build.log |
| npm run check / node scripts/check-semester03.mjs | 退出0，check PASS21/WARN2/FAIL0；计划通过 | check.log、checklist.log |
| 最终页面与手机 | DOM/旧ID/页内目标、滑块两端/复位、实际运行与PNG | browser.json、desktop.png、narrow.png |

初稿e1符号与固定轴裁剪由真实全点对账拦截，旧锚点插件不能以span代替目标heading的问题已修；原失败保留initial-*，修后重跑。最终逐字数字审计还纠正例3√4.71→√4.59，在原实验增加eig/DC断言。26行六列A1覆盖正文/答案/组件，六组审校和九项门槛/四条补充见日志。

兼容聚合73课/339实验/514cell，本轮仅实跑本课，未宣称全站重跑；27待办/W08/W09/W10不关闭。签发与master真实提交据最终验收记录更新。

最终整体验收node scripts/verify-modern05-delivery.mjs退出0：31旧ID、38目标、375px真实截图与最终源指纹相同。Phase4据实际证据签发。
