# NONLINEAR-01 非线性系统验收

2026-10-18，起点master5104b104d289ffd947da6819feebb337e7d8144f。使用wiki-lesson-refactor与共同流程完整Phase1–4，仅本课。日常直接提交master，不发布gh-pages，不纳入用户三份proofreading文件。

由抽屉间隙/推力上限引入，纠正原文连续性、THD跳变、回线耗能、零初态、局部稳定/完整吸引域及PI积分推导等问题。保留六类交互模型、五类基础教学目的、七题与答案，整合为11短H2、5份Notebook/5cell、SVG。旧长跳跃/粘滑扫描不直接沿用结论，完整快照和后续审查队列见source-before.mdx、followup.md及W13；未称其已交付。

| 命令/检查 | 退出/结果 | 证据 |
|---|---|---|
| node scripts/verify-nonlinear01.mjs | 0；实际TS analyse对Python闭式支路/FFT核30组，最大支路误差2.78e-17；全部图形数据在实际SPEC轴范围内；事件周期/能量积分9组、PI步长减半9组 | reconciliation.log/json、reference.py |
| node scripts/nb-cells.mjs verify nonlinear/nonlinear-characteristics --require-kernel --out .agent/semester-03/nonlinear-01/notebooks.json | 0；5份5cell EXECUTED，无FAIL/SKIPPED | notebooks.log/json |
| npm run verify -- nonlinear/nonlinear-characteristics | 0；HTTP200、11H2/真实ID、公式错误0、旧ID兼容 | verify.log |
| npm run math:check / npm run glossary:check | 0；术语PASS3/WARN2/FAIL0，已知WARN不新增 | math-check.log、glossary.log |
| npm run build / npm run build:pages | 0；最终正文/组件生产构建，205课/9旧入口导出 | build.log、pages-build.log |
| node scripts/check-python-support.mjs | 0；73课347实验/524cell，322启用/25保留代码；只重跑本课 | python-policy.log、pyodide.json |
| node --test scripts/lesson-route.test.mjs scripts/pages.test.mjs | 0；12/12 | route-pages-tests.log |
| 最终静态页实际运行 | 五工具栏全部运行完成，SVG及三PNG加载；默认恢复/类型切换及滑块边界；375/360px无整页溢出；控制台无warn/error | browser.json、desktop.png、narrow.png |
| npm run check / node scripts/check-semester03.mjs | 提交前最终输出，必须退出0 | check.log、checklist.log |

原43锚点均保留，52个渲染ID无重复；22个侧栏/TOC目标核对。原v1.3状态只表示历史已交付，本期checklist另记签发。

最后增加教材出处后，首次Pages指纹闸门拦截过期浏览器证明（pre-final-pages-build.log退出1）。最终MDX重新完整Pyodide实跑，再生成白名单并完成build/build:pages；没有绕过指纹校验。开发服务停机造成旧标签连接错误，重新打开静态页完成验收；W09保持原未决状态。生成Python摘要时发现工具重新编号，已恢复并深比较全部25项原ID/原因/处置，未扩大本课到基础设施改造。

Phase3六组、A.1逐量对账/A.2全部原始结果、B九项及四补充、C四组限定比较、D旧材料去向见本期讨论日志。保留原学期1日志不回写。W08/W09/W10及W13仍待办。

真实交付进入master后登记commit。

master交付提交：9d6d31e22b460a1102d3dbf6d8672770939f4be8；本期六列已勾。按主干策略正常推送origin/master；gh-pages保持9c8e988cd6cd10c1066c479f57799c76ef2514a4，本轮未发布。
