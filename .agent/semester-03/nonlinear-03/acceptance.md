# NONLINEAR-03 Lyapunov稳定性验收

2026-10-18，起点ea0dda8b07eae30bcf5d1e0c009ccc0c8abb06fc，master直接交付。只交付本课；不操作中文润色分支，不发布gh-pages，不提交用户proofreading文件。

从抽屉储能/损耗进入直接法与LaSalle，保留13主题、四构造法、三案例的数学用途、原四Notebook八cell及五题；纠正稳定性包含反向、Q1(c)算术、圆外不收敛强断言、摆展开角非全局正定/非径向无界、平面PD/移动关节跟踪/临界清除角的过推。增SVG、探索器能量图/真实末时/多圈显示/恢复默认、两核验实验和第六题，共六Notebook十cell/六题。13短H2，17旧ID兼容。

| 命令/操作 | 退出码/结果 | 证据 |
|---|---|---|
| node scripts/verify-nonlinear03.mjs | 0；195组292695点独立核，最大状态差3.34401475e-8；六符号恒等、P残差0、PD全801点expm差3.28432e-12 | reconciliation.json/log、reference.py |
| node scripts/nb-cells.mjs verify nonlinear/lyapunov-stability --require-kernel --out .agent/semester-03/nonlinear-03/notebooks.json | 0；EXECUTED，6Notebook/10cell，FAIL0/SKIPPED0 | notebooks.json/log |
| 本地Pyodide原始代码 | 6/6全部通过，指纹对应最终源；25待办逐字保留 | pyodide.json、pending-before.json |
| npm run verify -- nonlinear/lyapunov-stability | 0；HTTP200/H2 13/KaTeX错误0/九项PASS | verify.log |
| npm run build；npm run build:pages | 0/0；完整205课与9旧入口 | build.log/pages-build.log |
| npm run math:check；npm run glossary:check | 0/0；术语PASS3/WARN2/FAIL0 | math-check.log/glossary.log |
| node --test scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs scripts/pages.test.mjs | 0；17/17 | tests.log |
| node scripts/check-python-support.mjs | 0；73课351实验，326启用25保留 | python-policy.log |
| 实际静态页 | 默认/零阻尼/正负边界/高能跨圈/恢复，三个工具栏运行完成，console0，375px无整页溢出 | browser.json、desktop.png/narrow.png |
| node .agent/semester-03/nonlinear-03/validate.mjs | 0；最终指纹/原实验保留/DOM/待办不变式通过 | delivery-validation.json |
| npm run check；node scripts/check-semester03.mjs | 0/0；PASS21/WARN2/FAIL0，本期merged41，课程提交已验证在master | check.log/checklist.log |

最终源SHA256：40088b2f4556739b937752aea7291aa1f6b3ff5ccf2af68d6fcc02c891cd9a5b。早期旧锚点映射失配与375px表格撑页均已修正；SymPy判等采用化简差为零，避免将表达式结构比较误作数学判等。历史日志不回写，实际原始输出及A/B/C/D见本期讨论日志。

W08/W09/W10和原25Python待办保持；全局v1.3数量不因本期重构重复增长。Phase4已签发，实际课程交付提交已进入master：15e7512a3361343fee8b75c80693c9f3f6310d6e；全局checklist六列已勾。本轮推送origin/master，gh-pages与独立中文润色分支不动。
