# CLASSIC-02 传递函数验收

起点master 1eef5a9，工作分支wp/classic-02-transfer-function。唯一课程classic/transfer-function，按重构专用SKILL与共同Phase1–4执行，日志docs/discuss-log/semester-03/03-classic/02-transfer-function.md。用户两份批阅文件保留，未编辑未暂存。本课验收后只合master，发布另行授权。

## 审计与纠错

旧稿SHA ab7ddc54957801c3df37273d00d1676fda694122a7a82a7e008fe4d7e364ef94；11H2、25全级标题ID、2Notebook/2cell、两组件只本课调用，起点check为PASS21/WARN2/FAIL0。旧页面已实际打开核查；无独立旧讨论日志可继承。

保留全部九题与正确推导、变换表、三种连接、RLC/电机、摆工作点、辨识及局限。补外力柔度1/k与q=ky/F0归一化，纠正频响峰/截止、外力与路面输入、BIBO与自由响应、非单位反馈1/H推广、0−/0+、电荷与电压坐标。对消固定Ga→Gb，输出对中间扰动通道为Gb；交换顺序后扰动通道为Ga，不能混用。附录D全部去向不跨课交付，fix-035记录归因且不增删角色。

三处H2缩短为变换回顾/二阶模型/频率响应；H1改传递函数，4旧ID别名与21保留ID组成旧25全集。原URL、先修、九题不删除。两组件默认ζ.5/wn8，极点真实边界、单调/振荡条件、无阻尼提示，新增可访问名称与恢复按钮；上下两图、明确固定轴/真实时间、读数区分末样与极限，inline样式兜底。

## 数值与原始代码

scripts/verify-classic02.mjs AST提取并调用实际TS calculatePoles/computeStepResponse/computeBodeMagnitude。独立reference.py使用scipy状态空间阶跃及复频代入，27参数组（含0/.05/.5/.95/.999/1/1.001/1.05/2及wn.5/8/20）×401时间点，24组×401频率点；最大差step2.6645352591003757e−14、频响9.592326932761353e−14dB、极点1.4210854715202004e−14s⁻¹，非法参数拒绝。全点时间轴一起对照，不抄TS解析解生成Python参考。

五原始Notebook各1cell：变换/模型、电机反馈、二阶频响、对消状态与通道、九题。8891独立干净内核运行全部setup与cell后附加合同通过；nb-cells严格EXECUTED、error0/FAIL0/SKIPPED0；extract/assemble5Notebook10block反向全等。首轮附加合同发现错误预填小数与无序特征值顺序假设，按解析式改期望/排序，保留first-failure日志，没有放宽门槛；题6超调正文改48.6397%。默认wn8/zeta.5、极点−4±j6.9282032；频率峰5.6568542、−3dB10.1761572rad/s；读数完整原始stdout保留reconciliation.json。

Pyodide实际5组全部成功，sourceHash与原始MDX及数值报告待最终一致性核。兼容汇总70课/295Notebook/468cell、265启用/30代码保留；只替换本课记录，暂不改变Slycot边界。既有W06/W07/W08/W09保持待办，原生IAB网关UI连接问题不冒充已修；严格kernel和生产Pyodide分别核实。

## 门槛进度

已运行math:check退出0（无同行围栏）、glossary:check退出0（PASS3/WARN1/FAIL0，既有函数名WARN）、14回归测试全部通过、fix索引退出0。最终build、生产UI、全局check、日志签发和真实合并回执完成后补录，不预填。

## 最终验收与签发

Phase1–4已完成，日志57行六列A.1、原九项+四条B、三条六列C和完整D通过check-log。五份原始代码的MDX/source/严格kernel/浏览器计数各为5，源SHA8265e2dfe22e0eb265e7c27cc1dcf99b9d1bcbacf0174d5e047b8024acfcedd0三处相等。此前69课兼容报告/政策及30待办逐字段未变，另课正文未动，两组件仅本课调用；W06/W07/W08/W09保留。

生产真实DOM11H2顺序与目录逐项对齐，25旧ID全覆盖（4别名+21canonical）、无重复；64display居中auto、KaTeX错误0、五Notebook，所有表格每行列数一致。默认两组件ζ.5/wn8；极点−4.0000±j6.9282，t1 q=.979007/3s末样.999999/采样峰1.162971。无阻尼/临界/过阻尼、四滑块端点及默认恢复通过，实际页面答案Pyodide“全部运行”完成，warn/error日志空。

390px视口文档375=scroll375、正文343=scroll343，所有section无溢出，两canvas309×380/309×530。opening/narrow/poles.png已人工查看。首轮极点叉号使用开放path导致不可见，改闭合实心叉号后完整重build/build:pages/tsc并reload生产页；poles.png已确认两红叉可见，未用数值正确替代视觉验收。最终导出318131505字节，先前318131371是修叉号前产物。

| 实际命令 | 实际结果（退出码） | 持久输出 |
|---|---|---|
| node scripts/verify-classic02.mjs | 27×401时间点、24×401频率点、5原始实验附加合同通过（0） | reconciliation.log/json |
| node scripts/nb-cells.mjs verify classic/transfer-function --require-kernel --out … | EXECUTED/5cell/error0/FAIL0/SKIPPED0（0） | notebooks.log/json |
| nb-cells extract / assemble | 5Notebook/10block反向全等（0），临时roundtrip已删 | extract/assemble.log |
| npm run verify -- classic/transfer-function | HTTP200/H1=1/H2=11/KaTeX错误0，PASS9/WARN0/FAIL0/SKIPPED0（0） | page-delivery.log |
| npm run build / npm run build:pages / npx tsc --noEmit | 最后代码全部通过（均0），无MDX编译失败；205课/9旧路由/318131505字节 | build-final/pages-final/types-final.log |
| npm run math:check / npm run glossary:check | 无同行围栏（0）；PASS3/WARN1/FAIL0（0），旧函数名WARN | math-fences/glossary.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 14通过/0失败（0） | regression.log |
| npm run check -- --fix-outline --fix-tracker-stats | 自动OUTLINE/统计同步，PASS21/WARN2/FAIL0（0） | check-fix.log |
| npm run check | PASS21/WARN2/FAIL0（0），已登记motion-planning与32旧正文缺日志 | check-delivery.log |
| node scripts/check-semester03.mjs | checklist有序、前19课已合入，本课前五列完成（0） | checklist.log |
| check-browser/check-source/check-scope/check-log及check-fix-logs | 真实DOM、源hash/5计数、69旧课+30待办不变、四阶段/57对账/九项门槛、fix索引一致（均0） | 对应check日志 |

郑核已签发，下一课CLASSIC-03「时域分析」另起对话；只合master，不推送远端、不发布gh-pages。开发8080恢复。真实合并提交在完成后回填以下回执。
