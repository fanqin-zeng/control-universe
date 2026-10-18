# NONLINEAR-07 反步设计验收

2026-10-18，起点c2bf522afc453bc746f171eacb99d54080030811，master直接交付。仅本课；不操作中文润色分支、不发布gh-pages、不提交用户proofreading文件。

保留12主题、原六实验26cell、六题；新增核验共7Notebook27cell。纠全局/工作域条件、二阶等价关系推广、PE平方积分、两估计器重复项、四阶负载静差、采样上界和饱和吸引域误称。组件公开ZOH-RK4口径、实际终时、全节点指标与恢复，增益图覆盖Kp65，窄屏图表纵排；新增SVG，保留41旧ID。完整Phase1–4、40项对账和资产去向见本期讨论日志。

| 命令/操作 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-nonlinear07.mjs | 退出0；真实TS36配置，全节点指标及198036绘图节点对账，独立误差坐标最大差1.395e−13、指标差3.331e−13 | reconciliation-final.log、reconciliation.json、reference.py |
| 同上独立数学核验 | 手算expm状态差3.038e−13；自适应两参考DOP853末态最大差3.586e−10；四阶静态残差2.177e−13；单/双估计器与机器人共4项符号恒等；同族n8算子2362 | 同上 |
| 机器人独立DOP853 | 输出角差1.88481e−5rad，小于事先声明2e−5；保留原RK4在8s加载节点的stage读取差异 | reference.py、reconciliation.json |
| node scripts/verify-nonlinear07.mjs --refresh-last | 退出0；对相同源/数值/组件指纹复用前六已执行结果，重跑第七原始代码及附加算术probe，再重算全部独立对账 | reconciliation-probe.log |
| node scripts/nb-cells.mjs verify nonlinear/backstepping --require-kernel --out .agent/semester-03/nonlinear-07/notebooks.json | 退出0；EXECUTED、7实验27cell、FAIL0/SKIPPED0 | notebooks.json/log |
| 本地Pyodide最终原始代码 | 7/7实验27cell全部通过，源指纹一致 | pyodide.json |
| node scripts/check-python-support.mjs | 退出0；73课356实验，331启用25保留 | python-policy.log |
| npm run build；npm run build:pages | 最终退出0/0、Compiled successfully；205课9旧入口 | build.log、pages-build.log |
| npm run verify -- nonlinear/backstepping | 退出0；PASS9/WARN0/FAIL0/SKIPPED0；HTTP200、H2 12/12、KaTeX错误0 | verify.log |
| 真实静态页面 | 默认/正弦/增益上下端/m下端/曲线开关/恢复；NB1/NB2/NB7同时运行完成；SVG及两PNG加载；console0；375px视口clientWidth=scrollWidth=360 | browser.json、desktop.png、narrow.png |
| npm run math:check；npm run glossary:check | 退出0/0；术语PASS3/WARN2/FAIL0（原C2b/C4） | math-check.log、glossary.log |
| node --test scripts/lesson-route.test.mjs scripts/mdx-headings.test.mjs scripts/pages.test.mjs | 退出0；17/17 | tests.log |
| node .agent/semester-03/nonlinear-07/validate.mjs | 退出0；最终源/纯模块/组件指纹、实验完整性、41旧ID、52目录目标及25Python待办不变式 | delivery-validation.json |

最终MDX SHA256：5b4789ec7a02aeee4baf7b389f4453a50f8d3e66664cb873d7394e80598c2535。完整原始输出在讨论日志A.2与reconciliation.json；默认误差与超调是含扰动采样控制的测量，标称ζ不是该曲线实测阻尼。

初次构建拦截数值模块抽取后SimResult类型导入遗漏，已补齐；修改前后运行时JavaScript逐字相同，type-import-proof.json记录前源与运行时hash。保留build-initial.log，不将该失败冒称通过。最终重建和浏览器均用修复后组件。

25项Python待办逐字保持，W08/W09/W10不提前关闭。无饱和峰值预算不称吸引域，未实现同带宽线性基线，未将固定配置比较扩为方法排名。

| 全局门槛 | 结果 | 证据 |
|---|---|---|
| npm run check | 退出0；PASS21/WARN2/FAIL0，既有WARN已登记 | check.log |
| node scripts/check-semester03.mjs | 退出0；PASS，提交前merged44 | checklist.log |

Phase4已签发，实际master提交回执待提交成功后填写。
