# MODERN-08 多变量系统验收

2026-10-18，起点master fc8cf57f075aeeec7dcdbc9f4800b7a00429b6d5。使用wiki-lesson-refactor完整Phase1–4，本对话只交付此课，不发布gh-pages；保留用户三份proofreading未提交修改。

保留8H2/三例八题/原一Notebook六cell与29旧ID。新增供暖耦合SVG入口、固定其他输出的RGA推导/对角单位缩放/近奇异方向、静态逆瞬态与连续峰及频率/适当性、一般D项符号复核，修过强交互措辞/稳态存在条件/MPC需先配对误解。原核心正确纠错不当本期新增。

| 命令/检查 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-modern08.mjs | 退出0，真实TS全2116组×501点对独立SciPy ODE；最大差5.0911e−10，Notebook矩阵指数四时刻/峰/稳态对ODE差7.3808e−12 | reconciliation.log/json、reference.py |
| node scripts/nb-cells.mjs verify modern/multivariable-systems --require-kernel --out .agent/semester-03/modern-08/notebooks.json | 退出0，4实验9cell EXECUTED，error0/FAIL0/SKIPPED0 | notebooks.log/json |
| 浏览器Pyodide最终源 | 4/4实验9cell passed | pyodide.json |
| node scripts/check-python-support.mjs | 退出0，323启用/27保留代码 | python-policy.log |
| npm run verify -- modern/multivariable-systems | 退出0，HTTP200，H2=8，KaTeX错误0，PASS9/WARN0/FAIL0/SKIPPED0 | verify.log |
| npm run math:check / npm run glossary:check | 退出0；后者PASS3/WARN2/FAIL0 | math-check.log、glossary.log |
| npm run build / npm run build:pages | 均退出0，205课/9旧入口 | build.log、pages-build.log |
| npm run check / node scripts/check-semester03.mjs | 目录与本期台账退出0，check PASS21/WARN2/FAIL0 | check.log、checklist.log |
| 最终页面与手机 | 原四实验逐一全部运行、PNG正常；375/360px无整页横向溢出；两滑块四端点/恢复；29旧ID、37目录目标 | browser.json、desktop.png、narrow.png |
| node scripts/verify-modern08-delivery.mjs | 聚合通过，最终源指纹一致 | delivery-validation.log/json |

四份档案、40行三方对账、六组审校、原九项及四补充与红队六列表见docs/discuss-log/semester-03/04-modern/08-multivariable-systems.md。首次术语FAIL由中文紧邻术语被识别成新别名，改标准表达后复验，不改扫描器；initial-glossary.log保留。

兼容清单现为73课/350实验/525cell，本轮只重跑此课；27待办ID/原因/处置与W08/W09/W10保留。真实提交进入master后回填hash。
