# ROBUST-02 不确定性建模

2026-10-24用户指定继续ROBUST-02，rank5。已有正文重构，一对话一课，按Phase1–4；保留10H2、四题全部子问及原三组Notebook用途。Phase1–4已完成，签发见课程日志。

起点master 3e87c235f04cb3c07395594bd8b66efc4effb164；旧正文LF SHA256 8a032b0a1e88636753a9875a1b2bd7e5729d5831d1b2dc44e07b74dd6f04e2f0.

隔离副本D:/Workspace/control-universe-rank5-robust02；计划原生18695、Pyodide18795、Pages18895、Jupyter8995，启动前检查。仅使用副本独立构建目录和显式端口；不清理共享.next、不改共享端口脚本，不处理其他会话暂存。

先修为已交付ROBUST-01与矩阵分解，LFT在本课定义，μ综合为后续阅读。用户明确指定本课，按计划登记暂缓前课。本课仅仿真与建模教学，不发布Pages。

## 最终验收

| 命令/范围 | 实际结果 | 证据 |
|---|---|---|
| nb-cells verify robust/uncertainty-modeling --require-kernel --port8995 | 退出0，4Notebook/5cell、error0、SKIPPED0 | notebooks.json/log |
| 实际TS + 独立reference.py | 退出0，180参数；最大差6.67e-16，力平衡差8.89e-16 | actual-ts.json/log、reconciliation.json/log |
| Pyodide真实Worker | 4/4Notebook，5/5cell，release codeOnly0 | pyodide.json、pyodide-retry.log |
| 生产构建：原生、静态 | 两次最终构建退出0 | build-final.log、pages-build-final.log |
| verify-lesson原生18695 | 退出0，PASS8/WARN1/FAIL0 | verify-final.log |
| 浏览器原生/Pages18895 | 两页面均200；h1=1/h2=10/KaTeX错误0；旧锚点、片段链接、SVG、四滑块、恢复、g1持平、默认六数、375px宽均通过 | browser-native.json、browser-pages.json；desktop/mobile/explorer PNG |
| 原始标题编译 | 历史ID全部保留 | headings-before/after.json |
| 提交投影npm run check、semester、math、glossary、python、fix | 单独日志校验，以最终staged-validation.json为准 | projection与staged日志 |

边界：500点拟合只保证合成20样本网格；全参数全频声明由独立解析不等式支撑。MSD反三角界只ρ<1可用；MIMO为固定归一化坐标的端口观察、非性能排名；ν-gap只验证特例拓扑条件。保留原10H2与四题全部子问，不以MC替代安全/鲁棒保证。

并行现场：共享check-start.log退出1、check-working.log存在其它课程打勾/统计未同步，semester-working.log含其它会话证据格式未定稿，fix-working.log含其它课072文档不一致；不越权修改。以最新已提交master加本课增量形成独立提交树，重生成OUTLINE与tracker统计并完成六项校验。默认索引不用于提交，不携带其他课程未完成源码。仅在独立副本构建服务；期间误在根目录启动的一次构建已立即终止（build.log），最终验收均为隔离副本结果。

本地Pages预览不代表发布；本次不更新gh-pages。

验收WARN处置：verify第7项链接/robust/mu-analysis为尚未写正文的后续课；开篇明确标“后续阅读，不当作已知知识”，不是先修或必读跳转，本课局部定义足够。保留该导航与WARN，不改他课状态。

术语WARN逐项处置：C1b为全站登记的\mathcal{U}本轮无匹配，本课用显式参数区间；C2b旧NOISE条目17项未命中，不以其作内容判据；C4全站旧max/min共4处未反斜杠，本课新式已规范。C1/C2失败项为0。两项catalog WARN为跨章同slug与其它存量无日志，均已登记，与本课无新增债务。
