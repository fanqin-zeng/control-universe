# CLASSIC-09「回路整形」验收

本轮唯一课程classic/frequency-response-design，起点master90dfdbc，分支wp/classic-09-frequency-response-design。按wiki-lesson-refactor及semester-03-core完成准备审计、Phase1–4，十个既有角色视角、三轮/六组、128行六列对账、九门槛及六项红队记录见docs/discuss-log/semester-03/03-classic/09-frequency-response-design.md。无其它课交付，不发布gh-pages；两份用户proofreading文件未改或暂存。

## 内容与保留

原10H2主题、全部原H3用途与十一题保留。标题短名回路整形，两工程H2短名、第三步改提高裕度；39旧ID（38标题加原S04别名）以总5别名/4新增兼容，URL/status/prereq不变。三原交互注册保持，标准二阶精确极值/带宽，ζ≥1超调0；延迟精确临界、连续灵敏度峰、K110无限峰及不稳定形式模值显式区分，新增默认恢复与临界按钮。

补跟踪/输出扰动/输入扰动/噪声的S/T/GS/CS频段合同，纠正GMdB倍率、临界等号/裕度正值判稳推广、S/T交越.5及复数互补必峰。增益例修漏1/10，证明PM45上界K11.088932与Kv要求K100冲突，给可复验滞后候选；ZN正确分子Kp(TiTd s²+Ti s+1)，旧“更正”仍错，保留其失败测量。题3欠定显式补模型，题5时间缩放严格反例，题7完整五阶超调58.959569%而非二阶估计20.5%，题9交越√3，题11渐近相位不作临界判断。无源行业“标准”改需求合同，不冒充实机/全局最优。

## 实际验收

| 命令 / 证据 | 退出码与结果 |
|---|---|
| node scripts/verify-classic09.mjs；reconciliation.log/json、reference.py | 0；200K/142ζ各401频率节点、五延迟；真实TS对独立control/SciPy，幅值最大相对差1.126412e-13、连续峰相对差6.187642e-12、二阶指标绝对差3.951459e-7；全部六原始setup/cell新内核执行 |
| nb-cells verify classic/frequency-response-design --require-kernel；notebooks-final.log/json | 0；EXECUTED6Notebook/6cell，WARN0/FAIL0/SKIPPED0 |
| nb-cells extract/assemble；extract.log/assemble.log/extracted.json | 0；12求值后原代码块反向逐字全等，临时roundtrip删除 |
| 浏览器原始setup/cell；browser-python.json | 六实验passed/0code，最终源码hash2d0ab54ec9b8838b746ea895af44057be9f67eac64de411ecb4417cd72946733 |
| finalize --merge/write-report/preserve-debts/check-python-support | 0；72课/322Notebook/495cell，295enabled/27code、470成功cell；71原课及27待办完整对象/编号不变 |
| npm run build；npm run build:pages；npx tsc --noEmit | 均0；build.log/pages.log/types.log，无MDX编译失败；205课/9旧路由/310879454bytes |
| npm run verify -- classic/frequency-response-design；page.log | 0；9PASS/WARN0/FAIL0，HTTP200/H1=1/H2=10/KaTeX错误0；全仓另两旧组件提示不计本课 |
| node check-browser.mjs；browser-check.log/browser-results.json | 0；实际DOM10H2/全部39旧ID/5别名，18居中公式/各表列数一致；6Notebook/textarea、5canvas、三滑条端点/恢复、两精确临界按钮；课程内最后实验运行完成；console=[] |
| 390px生产页；narrow.png | 文章343=scroll343、文档375=scroll375；6Notebook341=scroll341，5图宽343；opening.png/interactive.png桌面视口；公式独立滚动 |
| npm run math:check；math.log | 0；同行display围栏files0/tokens0 |
| npm run glossary:check；glossary.log | 0；3PASS/2已知WARN/0FAIL，工业最常NOISE及7处旧函数名 |
| node --test pages/lesson-route/browser-python/python-release-decision；regression.log | 0；14PASS/0FAIL |
| node check-scope-source.mjs；scope-source.json | 0；最终源码hash三路一致，71原Python记录/27待办不变，catalog仅本课subsections变更，W06–09开放 |
| npm run check；check-final.log | 0；21PASS/2已登记WARN/0FAIL |
| node scripts/check-semester03.mjs；semester-final.log | 0；前五列完成，合并列不预填，待真实合并回执 |

本课只说明指定条件下的模型结果；有限采样峰不冒充连续精确峰值，不稳定形式模值不冒充H∞性能。W06/W07/W08/W09及27全局Python待办继续开放。

## 合并回执

验收后--no-ff合master；真实课程提交与合并hash在完成合并后追加，全局checklist据此勾最后一列。下一课CLASSIC-10需另起对话。
