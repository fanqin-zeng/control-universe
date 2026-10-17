# MATH-02验收与MATH-01批阅修订

2026-10-17，起点master 3158b0c，工作分支wp/s3-math-complex-numbers。本对话新增交付仅MATH-02；MATH-01按用户两次授权修订。proofreading两份文件只读，不纳入提交；开工时用户已从微积分正文删除的量纲自检段保持删除。

## 交付与反馈回应

- MATH-01：先观察小车再提导数/积分问题，修正“积分部分”，新建可播放/暂停/拖动/重置的MotionIntroExplorer；车辆与位置/速度曲线实时联动。按追加要求补无穷级数、部分和、泰勒余项、五种常见展开及范围，补2题和Notebook。最终13个H2、10题、6个Notebook；旧34组数值本次重跑。
- MATH-02：保留全部原6个H2及原H3、正确的四则/极坐标算例，纠正象限与零点角度，修共轭错字，补分母非零条件；欧拉公式承接前课级数，删越级ODE证明。最终8个H2、6题、3个Notebook。复数图保留原组件名，实际计算导出供Python独立核验；正方形画布避免角度图被拉伸，负角弧、原点、重置正常。
- Phase1–4、改动矩阵及逐量表见docs/discuss-log/semester-03/02-math/02-complex-numbers.md。用户反馈归因fix031，中文开篇检查补入共同技能，不改角色团队。

## 实际验收与原始输出

| 命令或操作 | 退出码/结果 | 原始输出 |
|---|---|---|
| npm run build | 0，无MDX编译失败 | build.log；全站生产构建，旧组件lint提示不冒充全站无提示 |
| npm run check | 0，PASS21/WARN2/FAIL0 | check.log；31个v1.3，47个Explorer均引用 |
| npm run verify -- math/calculus-basics math/complex-numbers | 0，两课各PASS9/WARN0/FAIL0 | page-verify.log；HTTP200/H1=1；H2分别13/8、顺序/ID/侧栏目标一致，无重复ID，katex-error0 |
| node scripts/nb-cells.mjs verify math/calculus-basics math/complex-numbers --require-kernel --quiet --out .agent/semester-03/math-02/notebooks.json | 0，9 notebook/9 cell/error0 | notebooks.log / notebooks.json；无SKIPPED，setup与cell真实独立内核执行 |
| node scripts/verify-math02.mjs | 0 | reconciliation.json/log；实际Complex/Motion TS对独立Python，所有页面原始求值setup/cell执行，环境与源哈希留存 |
| node scripts/verify-calculus-basics.mjs --out .agent/semester-03/math-02/calculus-reconciliation.json | 0 | calculus-reconciliation.json/log；保留原课全部数字及6个Notebook重新核验；旧math-01证据不覆盖 |
| nb-cells extract两课，再assemble反向抽取 | 0，9 notebook/18代码块逐字全等 | notebook-source.json、extract.log、assemble.log；临时roundtrip.jsx已删除 |
| npm run glossary:check | 0，PASS3/WARN1/FAIL0 | glossary.log；唯一WARN仍为其它旧课7处min/max排版 |
| node scripts/check-fix-logs.mjs | 0，29条详情/索引、2预留，下一号032 | fix-index.log；原编号与预留不改 |
| 浏览器生产两课 | 通过 | browser-results.json；运动播放推进、暂停与拖时刻/端点/回起点，复数默认/第二象限/原点/负角/重置；390像素clientWidth=scrollWidth=341，复数canvas313×313，运动canvas313；恢复原视口 |

最终生产控制台为空；browser-results保留早期草稿MDX错误和Fast Refresh提示作为historicalConsole，按最终build完成时间隔开，不能把历史故障删掉冒充从未失败，也不把已修的草稿错误算成当前生产错误。motion-intro.png、motion-narrow.png、complex-narrow.png为真实浏览器截图。

WARN复审见warnings.json：原35门无日志旧课中仅math/complex-numbers完成，其余34个成员逐字相同，占比60%；motion-planning跨章同名按路由组合消歧。历史I03/S04/MATH01快照不改写。R01全站课程债务继续待处理，不以两课验收代签全站。

草稿阶段修正：Taylor小数笔误以实际输出更正；Markdown表格绝对值改用lvert/rvert防止拆单元格；轴列表改显式字面量以接受现有门槛；复数H2最初文字误记7→9，实测来源6→最终8，以source-audit和真实DOM为准。没有放宽检查或带着失败签发。

## 合入

课程与批阅修订提交72f8787；已--no-ff合入master，真实课程合并提交0af1920a5f103b4c2340c73f107480fe5f158bc5。确认后才勾MATH-02合并列；回执沿用同一工作包分支提交后再合回master。不push，不继续MATH-03。

浏览器额外实际点击“核对六题答案”的全部运行按钮，完成标记In[✓]及六题输出留在browser-answers.txt；不是只检查按钮存在。
