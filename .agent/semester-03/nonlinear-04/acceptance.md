# NONLINEAR-04 描述函数验收

2026-10-18，起点42c4f921d98ab89282667428f7b796e8291d869c。master直接交付，仅本课；不操作中文润色分支、不发布gh-pages、不提交用户proofreading文件。

保留12主题、原六Notebook/21cell与六题，补恒温器反馈SVG和独立手算核验，共七Notebook/22cell、两交互图。区分HB候选与实际周期轨道，撤销不成立的圆判据全局保证，修正双根网格值、临界解族、复数/阈值语义及有限谐波指标；保留原数值实验用途并增加步长与连续事件积分核验。20旧标题ID兼容。

| 命令/操作 | 实际结果 | 证据 |
|---|---|---|
| node scripts/verify-nonlinear04.mjs | 退出0；实际TS的390个DF工况、4608个HB工况对独立Python；最大DF差1.6377200853e-14，HB残差4.9886571813e-13；七实验原始代码运行并核验连续解与步长 | reconciliation.json/log、reference.py |
| node scripts/nb-cells.mjs verify nonlinear/describing-function --require-kernel --out .agent/semester-03/nonlinear-04/notebooks.json | 退出0；EXECUTED，7Notebook/22cell，FAIL0/SKIPPED0 | notebooks.json/log |
| 本地Pyodide | 7/7、22cell全部通过，最终源指纹一致 | pyodide.json |
| npm run verify -- nonlinear/describing-function | 退出0；PASS9/WARN0/FAIL0/SKIPPED0，HTTP200，H2 12/12，KaTeX错误0 | verify.log |
| npm run build；npm run build:pages | 退出0/0；完整生产及静态导出 | build.log、pages-build.log |
| npm run math:check；npm run glossary:check | 退出0/0；术语PASS3/WARN2/FAIL0，既有C2b/C4 | math-check.log、glossary.log |
| node --test scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs scripts/pages.test.mjs | 退出0；17/17 | tests.log |
| node scripts/check-python-support.mjs | 退出0；73课、327启用、25保留 | python-policy.log |
| 实际静态页面 | 复数/增益端点、HB无解/临界/候选、两恢复默认、Notebook1和7工具栏运行完成；console0、375px无整页溢出 | browser.json、desktop.png、narrow.png |
| node .agent/semester-03/nonlinear-04/validate.mjs | 退出0；最终指纹、7标签/7提取/22cell、旧ID、DOM、25待办原样保留 | delivery-validation.json |
| npm run check；node scripts/check-semester03.mjs | 退出0/0；PASS21/WARN2/FAIL0；提交前merged41，回执后复核42 | check.log、checklist.log |

最终MDX SHA256：9a74cda596829687829f8857400c5dc7192727427a6d82562bcbb83052568fc2。初次验证发现轻量MDX提取器将数学内紧邻的“小于号+K”当作JSX，曾漏提取两个实验；本课加入空格并交叉核对字面标签、提取数和真实页面数，最终完整7/22；另一次过零保护缩进错误已修复并全量重跑，不将早期失败当最终通过。

Phase4签发依据见本期日志A/B/C/D及聚合验证。S04本课组件规范债务关闭；W08/W09/W10、原25项Python待办保持。既有v1.3重构不重复增加全局交付课数。实际master提交回执待写。
