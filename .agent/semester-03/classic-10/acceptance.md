# CLASSIC-10「设计方法选型」验收

本轮唯一课程classic/design-methods-comparison。起点master3da6f88，分支wp/classic-10-design-methods-comparison；原empty/无MDX，依wiki-lesson-new及semester-03-core完整Phase1–4。十角色、三轮、六组、63行六列对账与九门槛/六条红队记录见docs/discuss-log/semester-03/03-classic/10-design-methods-comparison.md。只交付这一节，不发布gh-pages，不动两份用户proofreading文件。

## 首次生产结果

从已交付回路整形和恒温箱设定/功率限制引入，区分设计视角、控制器结构和共同验收合同。八节、六题、三原始Notebook；同一对象P4/PI11/PI21，在四份合同里分别两PI通过/全部通过/一PI通过/全部失败。给出输入不可达卷积界、稳定对消的完整PI状态、目标口径的连续进入时间、噪声T/CS通道及模型变化边界。没有独立最优整定或结构排行榜，不将线性越界响应当实际饱和效果。固定计算不强造Explorer，已有方法交互以课程链接承接。

## 实际验收

证据均位于本目录；下面各最终命令退出码0。

| 命令 / 证据 | 实测结果 |
|---|---|
| node scripts/verify-classic10.mjs；reference.py、reconciliation.log/json | 原始3setup/3cell逐个新kernel执行；独立SciPy状态空间对control，3候选×3幅值×2001节点×y/u，最大差1.509903313490213e−14；六频点复响应差<1e−10，四合同连续阈值/峰值一致 |
| nb-cells verify classic/design-methods-comparison --require-kernel；notebooks-final.log/json | EXECUTED，3Notebook/3cell，PASS1/WARN0/FAIL0/SKIPPED0；首轮图例警告修复后重跑 |
| nb-cells extract/assemble；extract.log/assemble.log/extracted.json | 3Notebook/6求值后代码块反向逐字全等，临时roundtrip删除 |
| 浏览器原始setup/cell；browser-python.json | 3/3passed；Pyodide0.27.7、numpy2.0.2、SciPy1.14.1、control0.10.2；最终sourceHash=c92b0fe4a7c8f6ba440f9571a165c08ba2fa31d5a6620619ec7a6a2cbbd805ac |
| finalize --merge/write-python-expansion-report/preserve-debts/check-python-support；python-policy.log | 全站73课/325实验/498cell，298enabled/27code，473执行cell；72原课及27待办对象/编号保留 |
| npm run build；npm run build:pages；npx tsc --noEmit | build.log/pages.log/types.log；无MDX编译失败，静态205课/9旧路由/311368846bytes |
| npm run verify -- classic/design-methods-comparison；page.log | 9PASS/WARN0/FAIL0/SKIPPED0；HTTP200/H1=1/H2=8/KaTeX错误0；全仓两旧组件提示不计本课 |
| node check-browser.mjs；browser-check.log/browser-results.json | 真实DOM八H2与共享编译管线逐序/ID相等，所有侧栏目标存在且ID唯一；七公式居中、五表列数一致，3Notebook/textarea；课程内原实验实际运行完成、console=[] |
| 390px生产页；narrow.png | 文章343=scroll343，文档375=scroll375，三Notebook341=scroll341；五表600px在343px容器内局部横滚。opening.png/experiment.png桌面正文及真实输出 |
| npm run math:check；npm run glossary:check | math.log：files0/tokens0；glossary.log：3PASS/2已知WARN/0FAIL，工业最常NOISE和7旧函数名 |
| node --test pages/lesson-route/browser-python/python-release-decision；regression.log | 14PASS/0FAIL |
| node check-scope-source.mjs；scope-source.log/json | 最终源码与严格内核/浏览器证据匹配，72其它课/27待办全等；catalog仅本课status/subsections变更，W06–09开放 |
| npm run check；check-final.log | 21PASS/2已登记WARN/0FAIL；OUTLINE和tracker统计由脚本更新为48/205 |
| node scripts/check-semester03.mjs；semester-final.log | 计划/checklist通过；真实合并后另附回执，合并列不预填 |

初轮check在--fix-outline/--fix-tracker-stats更新文件前报告旧统计47，重跑读取48后通过；学期检查发现日志头漏课程ID，补CLASSIC-10后通过。最终文字校订改变整页源码指纹，Pages门槛按设计拒绝旧浏览器指纹；重新prepare、原3实验Pyodide实跑并finalize后生产构建通过，未绕过检查。

W06/W07/W08/W09与27项全局Python待办继续开放。下一课CLASSIC-11需另起对话。

## 合并回执

验收后进行--no-ff合master；实际课程提交和合并hash取得后补入此处，并据真实hash勾checklist最后一列。

实际课程提交e0b62e95895393e6e9fd8ef05faadc66cba92996；--no-ff课程合并5194247ebad0d62c72b96e26ce67eb123f016f1f。取得真实hash后勾全局checklist最后一列，合并态check-merged.log和semester-merged.log分别核21PASS/2已知WARN/0FAIL与merged28。回执提交后--no-ff合master并删除本工作包分支；本轮未推送或发布。
