# MODERN-04 状态反馈验收

2026-10-18，起点 master b049453。对应 wiki-lesson-refactor 完整 Phase 1–4，日志 docs/discuss-log/semester-03/04-modern/04-state-feedback.md。本轮仅本课，不发布 gh-pages。

保留八主题、五例、十题、原两份 Notebook 用途和27旧标题锚点。从小车定位引入，区分参考位置与控制力；修正 Ackermann 伴随型证明、Q6可控矩阵、Q7频率因子、Q10块列证明，补前馈与零点的适用条件。交互比较统一终值并同时显示位置与施力，保留原始未补偿响应。新增真实计算模块由实际组件调用，独立物理ODE核对19档×501节点，最大差1.1494e−11；Notebook矩阵指数最大差1.1483e−11。电机超调4.321391826%，最后2%穿越.421618403s，未用近似公式代替验收。

| 命令/检查 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-modern04.mjs | 退出0，五份六cell；28行断言与独立复算 | reconciliation.log/json、reference.py |
| node scripts/nb-cells.mjs verify modern/state-feedback --require-kernel --out .agent/semester-03/modern-04/notebooks.json | 退出0，EXECUTED；FAIL0/SKIPPED0 | notebooks.log/json |
| 最终浏览器Pyodide | 5/5实验、6cell通过；最终源指纹一致 | pyodide.json |
| node scripts/check-python-support.mjs | 退出0，309启用/27保留代码 | python-policy.log |
| npm run verify -- modern/state-feedback | 退出0，PASS9/WARN0/FAIL0/SKIPPED0，HTTP200/8H2/KaTeX0 | verify.log |
| npm run math:check / npm run glossary:check | 退出0；已有两项术语WARN保留 | math-check.log、glossary.log |
| npm run build / npm run build:pages | 均退出0；205课/9旧入口验收通过 | build.log、pages-build.log |
| npm run check / node scripts/check-semester03.mjs | 目录退出0，PASS21/WARN2/FAIL0；计划见checklist.log | check.log、checklist.log |
| 生产页面与手机交互 | 实际DOM、旧锚点、默认/端点/复位、Python与图像 | browser.json、desktop.png、narrow.png |

初稿S0模板字符串错误、裸比较符MDX错误、SymPy结构等式断言失败均保留原始失败文件，修后重跑。生产检查发现图例颜色与曲线不符、公式H3目录显示NNN，修配色和纯中文标题，保留旧别名，最终重新核指纹和构建。一次Pages构建早于新指纹合并，门槛正确拦截，原输出存stale-policy-build.log，合并真实浏览器结果后重建，不修改门槛。

兼容聚合73课/336实验/511cell，309启用/27保留代码；本轮仅实跑本课，27待办ID/原因/任务不变，W08/W09/W10仍开放。三份用户proofreading不加入提交。最终delivery验证退出0、27旧ID/34目标通过后，Phase4已签发；master真实回执另记。

整体验收：node scripts/verify-modern04-delivery.mjs退出0；desktop.png与narrow.png为最终生产预览实际截图。

## master回执

课程提交 `d58259df22e3c214f372da5472ce4764bff71bb8` 已直接进入master。全局checklist依真实hash勾选旧“合并”列；本回执普通提交后与课程一起推送origin master。gh-pages保持42eed1d，本轮未发布。
