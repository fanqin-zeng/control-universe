# DISCRETE-01「采样与量化」交付验收

2026-10-19恢复旧草稿，恢复起点master 5bff9df；早期草稿起点4185db7。按wiki-lesson-refactor完整Phase1–4，本课日志在docs/discuss-log/semester-03/06-discrete-sampled/01-discrete-time-freq.md。只交付本课。用户明确授权验收后发布GitHub Pages，公网回执另存docs/deployment/discrete01-release.md。

旧九H2/十九H3及全部ID、四题全部子问与三Notebook主题保留，原始失败保存在source-before.mdx/baseline-notebooks.json。补正混叠相位、ZOH归一化、带宽、有限ADC、量化反馈和可实现PID等，见fix-069。六Notebook七cell、一Explorer、两SVG。

| 实际命令/操作 | 退出码/结果 | 证据 |
|---|---|---|
| node scripts/verify-discrete01.mjs | 0；210实际TS配置、11043原始Notebook量对独立60位解析参考 | reconciliation.log/json、actual-ts.json、reference.py |
| node scripts/nb-cells.mjs verify discrete-sampled/discrete-time-freq --require-kernel --port 8981 --out .agent/semester-03/discrete-01/notebooks.json | 0；六Notebook七cell，S6实际执行，错误0/SKIPPED0 | notebooks.log/json |
| npm run build | 0；无MDX编译失败 | build.log |
| WIKI_VERIFY_PORT=8183 npm run verify -- discrete-sampled/discrete-time-freq | 0；九项通过，HTTP200/H1=1/H2=9/KaTeX0 | verify.log |
| 实际原生课程页六个全部运行 | 全部完成，输出对账一致，控制台error0 | browser-native.json、native.png |
| 实际Pyodide逐课全部运行 | 六Notebook七cell全部passed，源hash一致 | pyodide.json |
| npm run build:pages | 0；205课/9旧路由，basePath正确 | pages-build.log |
| 实际本地Pages六个全部运行与控件上下界/恢复 | 七cell输出一致，SVG正确路径；ADC8/4096级边界 | browser-pages.json、desktop.png |
| Chrome375px手机检查 | width375，无页面横溢，KaTeX0，控件图例目检通过 | browser-mobile.json、mobile.png |
| node .agent/semester-03/discrete-01/headings.mjs | 0；全部旧编译标题ID保留，9H2完全相同 | headings.log/json |
| node .agent/semester-03/discrete-01/validate.mjs | 0；源hash/原生/Pyodide/实际DOM与输出/图片/手机校验通过 | validation.log/json |
| npm run math:check | 0；display公式围栏同行违规0 | math.log |
| npm run glossary:check | 0；PASS3/WARN2/FAIL0，既有全站提示 | glossary.log |
| node --test scripts/check-semester03.test.mjs scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs | 0；33/33 | tests.log |
| node scripts/check-python-support.mjs | 0；82课/391Notebook/577cell，375可运行/16保留代码 | python-policy.log |
| node scripts/check-fix-logs.mjs | 0；新增069索引详情一致 | fix.log |
| npm run check -- --fix-outline --fix-tracker-stats | 首轮1；旧统计五FAIL后自动刷新，不当通过 | refresh.log |
| npm run check（独立复验） | 0；PASS21/WARN2/FAIL0 | check.log |

源hash：5807620c875b15c5aa2b4f1096f2aa83aeb4c021aea18ab8b245a56d089a887e。TS最大误差1.38e−14；原始Notebook最大绝对差5.38e−9（短周期PID浮点传递函数消去），一般容差1e−9，PID用1e−8+1e−10×参考绝对值；页面六位打印比较容许2e−6舍入。独立参考不调用control/scipy，使用解析正弦、闭环留数、精确ZOH递推、代数Tustin四阶多项式根及高精度频响。

PY-006因本课原不可实现PID实际修复且六实验浏览器全通过而关闭；其余16项task/category/next元数据保留。全站v1.3=63/205、MDX83、Explorer76；学期3生产完成60课，为不同统计口径。四处本地端口与用户proofreading不提交，原01备份stash保留；W14/W15不随本课关闭。交付真实master hash及Pages公网结果由全局checklist回执登记。
