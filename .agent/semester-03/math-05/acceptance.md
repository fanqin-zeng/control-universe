# MATH-05 矩阵分解验收

2026-10-18；起点master 6e2396f；工作分支wp/math-05-matrix-decomposition。原目标无MDX，按wiki-lesson-new及共同流程完成Phase1–4。本对话仅交付这一节；角色均为结构化审查视角，不伪称真实专家、学生或独立Agent。

## 成果与教学审查

333行、14个H2、6题与步骤答案、6个原始Notebook/6cell、1个SvdSensitivityExplorer。以三条不一致测量贯穿投影、QR、最小二乘、Cholesky、SVD与伪逆；LU另用小矩阵解释消元。说明正定/半正定、矩形Q、置换约定、最小范数、条件数适用条件以及无噪截断偏差。先修保持已交付的特征值与对角化，不修改其它课程正文、不提前交付MATH-06。

Phase1合同先落盘，minimal.py实跑后才写数字；Phase2三轮反馈触发三角求解接口、秩/阈值和矩形Q等修正，Phase3六组进一步纠正标量/向量措辞及误差界适用域；Phase4签发与43行三方对账、原九项门槛见docs/discuss-log/semester-03/02-math/05-matrix-decomposition.md。定义/定理条件/全部数值与六题覆盖逐段人工复核，机器日志结构检查不替代语义核查。

## 实际验收

| 命令/操作 | 退出码 / 结果 | 本目录证据 |
|---|---|---|
| npm run check | 0，PASS21/WARN2/FAIL0；旧课无日志与同名课程WARN保留 | check.log |
| npm run build | 最终0，无MDX编译失败 | build.log；早期审校前成功构建另存build-before-final-review.log |
| npm run build:pages | 最终0，205课/9旧入口、301578259字节；仅本地产物 | pages-build.log |
| npm run verify -- math/matrix-decomposition | 最终0，PASS8/WARN1/FAIL0/SKIPPED0；HTTP200/H1=1/H2=14/14/KaTeX错误0，真实锚点/侧栏目标通过 | page-verify-final.log |
| node scripts/nb-cells.mjs verify math/matrix-decomposition --require-kernel --quiet --out .agent/semester-03/math-05/notebooks.json | 0，6Notebook/6cell/error0，无SKIPPED，原始setup/cell实际执行 | notebooks.log/json |
| node scripts/verify-math05.mjs | 0，216组实际TS与独立NumPy SVD/pinv/截断逐量≤1e-9，26136曲线点；6个原始Notebook附独立精确断言 | reconciliation.log/json、reference.py |
| nb-cells extract/assemble | 0，6Notebook/12代码块反向校验逐字全等，临时roundtrip.mdx删除 | notebook-source.json、extract.log、assemble.log |
| npm run math:check | 0，32个美元围栏分行配平，16个块级公式居中 | math-fences.log、browser-results.json |
| npm run glossary:check | 0，PASS3/WARN1/FAIL0；18术语登记，无新符号基，旧课7处min/max不变 | glossary.log |
| npx tsc --noEmit | 0 | types.log |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 0，14/14通过 | regression.log |
| 最终源码Pyodide逐课诊断 | 六个原始setup/cell均运行完成，6启用/0降级 | browser-python.json |
| node scripts/check-python-support.mjs | 0，56课/168启用/30展示；Worker未改，旧报告未重跑 | python-policy-final.log |
| 实际开发/生产页面 | 默认(1,1.1)/κ10，截断、去噪偏差、秩亏、旋转90度、阈值等号与恢复通过；生产六题答案实验运行完成，console warn/error为空 | browser-results.json、svd-experiment.png |
| 390×844窄屏 | 正文clientWidth=scrollWidth=343，画布正方形、长公式独立滚动，视口恢复 | browser-results.json、narrow.png |
| node .agent/semester-03/math-05/check-scope.mjs | 0，原55课实跑与策略记录、30条降级待办逐条未变；其它原正文未改 | scope-check.json |

唯一单课WARN是下一课math/multivariable-calculus仍为骨架，正文明确尚未交付，不作为本课必需前置；本课不关全站R01。

## 过程边界与复现说明

- sourceHash守卫因最后一轮条件数措辞修订而如实拒绝旧报告，保留pages-source-guard.log。最终在8082的public静态预览实跑六实验后合并，再构建通过；不伪造provenance，不放宽哈希检查，不重跑也不覆盖旧55课证据。
- NumPy参考使用真实svd/pinv和矩阵乘法，不抄TS解析公式。理论σ=τ等号处以1e-12吸收SVD浮点舍入，测试范围远大于该容差；页面精确秩和保留方向数分开，绝对阈值不冒称软件默认秩容差。
- 普通build在最终正文与catalog=v1.3后完整复跑，Pages测试了同一最终正文及组件。构建时停止指定Next进程；恢复8080后曾有根首页探测超时SKIPPED，保留page-verify-cold-start.log，预热后最终无SKIPPED。
- 一次缓存搬移命令被自动审核拦截，未执行；改为不移动缓存、直接启动现有构建对应的开发服务，真实页面复验通过。没有删除或移动用户数据。
- check修正命令先检查旧统计，报5FAIL后生成OUTLINE/tracker，退出1，保留check-fix.log；随后独立check退出0。不把自动修正与同次通过混写。
- 原30项Python降级原因/顺序不变，本课增加六个真实通过实验；兼容报告生成器补记本课。用户proofreading两份文件不动、不提交；不push、不发布gh-pages。

## 合入

待工作包提交并--no-ff合master后补真实hash；全局合并列此时保持未勾。本课合并后停止。
补充复核：node .agent/semester-03/math-05/check-log.mjs退出0，4阶段/3轮/6审校组/10角色/43对账行/9+4门槛；node scripts/check-semester03.mjs退出0。语义、数字覆盖与缺席理由已按日志人工逐项核查。源文件与变更范围的git diff --check退出0（原始工具日志保留工具输出中的对齐空格）。
