# ML-01 学习问题与泛化

2026-10-24，用户指定继续ML-01，rank 2。只交付本课；暂缓未完成的IMPL-01–10，不依赖其未验收内容。沿用已交付概率与线性代数先修，监督学习/优化算法在后课展开。

并行约定：保留开工时所有其它课程、批阅、端口脚本修改；Next构建使用独立运行副本 D:/Workspace/control-universe-rank2-ml01，页面8192（8282被Windows拒绝绑定）、内核8992，不删除共享.next、不结束其它进程。共享catalog/注册表/checklist只局部修改，提交前核对差异。

Phase 1–4、真实验收与签发已完成；提交回执待实际master提交后登记。未发布Pages。

交付正文174行、8H2、两Notebook三cell、一个真实TS Explorer与内嵌SVG、四题四答。正文覆盖样本/损失/经验与总体风险、训练验证测试隔离、有限样本过拟合、条件关系变化与闭环边界。

| 命令/操作 | 实际结果 | 证据 |
|---|---|---|
| npm run check（共享目录最终） | exit0；PASS21/WARN2/FAIL0 | check.log；两WARN为既有重复slug和无旧日志债务 |
| 独立副本npm run build | exit0，无MDX失败 | build-final.log |
| 独立副本PAGES_BUILD=1/NEXT_PUBLIC_STATIC_EXPORT=true/NEXT_PUBLIC_BASE_PATH=/control-universe npm run build | exit0，静态页全部生成 | pages-build.log；仅本地预览，不推gh-pages |
| WIKI_VERIFY_PORT=8192 node scripts/verify-lesson.mjs machine-learning/learning-problem | exit0，九项PASS，HTTP200/H1=1/H2=8/KaTeX0 | verify.log |
| node scripts/nb-cells.mjs verify machine-learning/learning-problem --require-kernel --port 8992 --out .agent/semester-03/ml-01/notebooks.json | exit0，2Notebook/3cell/error0/SKIPPED0 | notebooks.log/json |
| node .agent/semester-03/ml-01/reconcile.mjs | exit0；297真实TS配置对独立NumPy，最大差3.019806626980426e-14；89991节点轴范围通过 | reconciliation.log/json、actual-ts.json、reference.py |
| 原始Pyodide逐课完整运行 | 2Notebook/3cell全passed，最终源hash一致 | pyodide.json |
| 最终静态课页两个“全部运行” | 三原始输出完整、图像生成、无error；实际console error为空 | browser-pages.json、desktop.png |
| 真实预设/滑块边界/默认恢复 | 四预设及a两端与独立结果一致 | browser-controls.json |
| 实际DOM标题/侧栏/图片/布局 | H1=1、H2=8、重复ID0、所有本站片段目标可用；375px的scrollWidth360，表内滚动 | browser-normal.json、browser-pages.json、browser-mobile.json、mobile.png |
| node .agent/semester-03/ml-01/validate.mjs | exit0；最终hash/原始输出/数值/手机/政策均通过 | validation.log |
| npm run glossary:check | exit0，PASS3/WARN2/FAIL0，既有全站提示 | glossary.log |
| npm run math:check | exit0，同行违规0 | math.log |
| node scripts/check-semester03.mjs | exit0；顺序例外仅放行IMPL-01–10 | semester-draft.log；签发/回执后另留最终输出 |
| node --test scripts/check-semester03.test.mjs scripts/mdx-headings.test.mjs | exit1：18通过/10历史顺序负向假设漂移；未算通过 | tests.log；独立任务QA01及test-debt.md |

最终正文SHA256：f184bf9b56618a920a42e9ff89d1aff2f3f8c420091581dbc3bd5f87a5bf1fc9。

开工时保留所有用户/并行修改。共享源码直接快照出现他课元数据/正文时刻不一致，独立构建改为已提交HEAD叠加ML-01；未通过临时构建不充当成功证据。普通IAB原生跨端口连接Failed to fetch归既有W09；严格原生内核及最终Pyodide实际页面分别验收，未冒称原生UI通过。旧Python待办与其他W任务保留。

提交投影以master 3880b2a为基线，仅叠加ML-01，单独运行check：PASS21/WARN2/FAIL0；Python政策校验exit0（84课，379实验可运行/16保留代码），见projection-check.log与projection-python-policy.log。共享目录当时另有IMPL-01草稿，其文件和暂存状态不带入本课提交。
