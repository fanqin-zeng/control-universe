# 批阅局部返修验收

2026-10-18，起点 master `6a57d07`，工作分支 `wp/math-intro-proofreading`。

用户要求按10月17日批阅改进两门数学课引入，过程中追加阅读10月18日批阅。本轮完成 W06、W07 与传递函数四图 W11；其余图示候选保留 W10。没有继续生产新课，没有更改 catalog、组件计算、原始实验或用户批阅文件，也没有发布 Pages。

| 命令 | 退出码 | 证据 |
|---|---|---|
| npm run check | 0 | check.log；21 PASS / 2 已登记 WARN / 0 FAIL |
| npm run verify -- math/linear-algebra-basics math/eigen-decomposition classic/transfer-function | 0 | verify.log；三课 HTTP200、H2/锚点与KaTeX检查通过 |
| node scripts/nb-cells.mjs verify math/linear-algebra-basics math/eigen-decomposition --require-kernel --out .agent/semester-03/intro-proofreading/notebooks.json | 0 | notebooks.log/json；9 原始cell，error=0 |
| node scripts/nb-cells.mjs verify classic/transfer-function --require-kernel --out .agent/semester-03/intro-proofreading/transfer-notebooks.json | 0 | transfer-notebooks.log/json；5 原始cell，error=0 |
| npm run math:check | 0 | math-check.log |
| npm run glossary:check | 0 | glossary.log |
| npm run build | 0 | build.log；205课程预渲染正常，无MDX编译失败；停止开发服务后构建，完成后恢复8080 |
| node scripts/check-semester03.mjs | 0 | checklist.log |
| node .agent/semester-03/intro-proofreading/check-preservation.mjs | 0 | preservation.log/json；忽略CRLF与源行号，三课全部标题与Notebook setup/cell内容未变 |

真实浏览器证据 browser.json、linear.png、eigen.png、feedback.png：两课数学引入可见，H2各12；传递函数H2为11，四个SVG均加载成功，正负号与反馈方向目视可辨。截图用于可读性与图形验收；严格内核实跑不冒充IAB直连网关已修复，W09仍待办。

讨论日志：docs/discuss-log/semester-03/02-math/intro-proofreading-2026-10-18.md；图示讨论与候选范围见 diagram-followup.md / diagram-candidates.json。候选35处、涉及18课，未完成重绘，W10保持未勾选。

开篇数值原始输出另存 intro-original-output.json/log：capture-intro.mjs 对两课第一份Notebook建立全新命名空间、执行原setup/cell、保存stdout，退出0。
