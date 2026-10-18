# NONLINEAR-06 滑模控制验收

2026-10-18，起点a8dd52ec1261aef9499ddfba0d64dc02dbaf533f，master直接交付。仅本课，不操作中文润色分支、不发布gh-pages、不提交用户proofreading文件。

保留13主题、原五实验17cell、六题和四应用；补滑面/控制律SVG、手算与默认值核验，共6Notebook18cell。纠不变性、输入增益/量纲、sat/tanh误差界、STA假设、RK4实际控制、电机静差和恢复比较；组件按实际6s终时和全步尾窗计算，44旧ID保留。Phase1–4及50项对账见本期讨论日志。

| 命令/操作 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-nonlinear06.mjs | 退出0；实际TS48工况72048点，状态差3.728e−12，平滑控制差1.391e−11，TV相对差5.649e−9；4符号/秩核验；连续DOP853与步长减半收敛 | reconciliation.json/log、reference.py |
| node scripts/nb-cells.mjs verify nonlinear/sliding-mode-control --require-kernel --out .agent/semester-03/nonlinear-06/notebooks.json | 退出0；EXECUTED、6实验18cell、FAIL0/SKIPPED0 | notebooks.json/log |
| 本地Pyodide最终原始代码 | 6/6实验18cell全部通过，最终指纹一致 | pyodide.json |
| node scripts/check-python-support.mjs | 退出0；73课355实验，330启用25保留 | python-policy.log |
| npm run build；npm run build:pages | 退出0/0，Compiled successfully；205课9旧入口 | build.log、pages-build.log |
| npm run verify -- nonlinear/sliding-mode-control | 退出0；PASS9/WARN0/FAIL0/SKIPPED0，HTTP200，H2 13/13，KaTeX错误0 | verify.log |
| 实际静态页面 | 四控制律、低增益边界与恢复；NB2/NB5/NB6同时完成；两SVG及两PNG加载；console0；375px视口clientWidth=scrollWidth=360 | browser.json、desktop.png、narrow.png |
| npm run math:check；npm run glossary:check | 退出0/0；术语PASS3/WARN2/FAIL0，原C2b/C4 | math-check.log、glossary.log |
| node --test scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs scripts/pages.test.mjs | 退出0；17/17 | tests.log |
| node .agent/semester-03/nonlinear-06/validate.mjs | 退出0；最终指纹、资产完整性、44旧ID及25Python待办不变式 | delivery-validation.json |

最终MDX SHA256：a4177570009f9fdb62ac8c520460d0bf3f2e82a74a146cbaca91c10d6f5b9362。恢复指标均是规定窗口的采样观察，STA配置不是普遍充分条件，未以有限仿真代替理想滑模证明。25项Python待办逐字保留，W08/W09/W10不提前关闭。

| 全局门槛 | 结果 | 证据 |
|---|---|---|
| npm run check | 退出0；PASS21/WARN2/FAIL0，既有WARN已登记 | check.log |
| node scripts/check-semester03.mjs | 退出0；PASS，提交前merged43 | checklist.log |

Phase4已签发，实际master提交回执待提交成功后填写。
