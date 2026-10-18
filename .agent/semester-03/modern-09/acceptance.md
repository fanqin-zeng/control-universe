# MODERN-09 现代控制案例验收

2026-10-18，起点master4c657b8059e6f6d434e03548b9b66a0a5d3f805d；wiki-lesson-refactor完整Phase1–4，仅本课，不发布gh-pages、不纳入三份用户proofreading。

统一均匀杆H(θ)、主线无摩擦、Qdiag1/1/10/10与R.1；保留12主题/七步链/八题/原五实验用途。修原前两实验点质量模型、双输入Af弹簧项与错误系数，明确G0有限非开环稳定；LQR/LQG/分离性/参数外推均加实际边界。原widget迁React运行时CARE、实际SDE/dY/sqrt(dt)与同一饱和输入，三图/复位/可读status。

本课如实报告指定LQR的4.61s未达原3s目标、60°的8s位置误差未入带、85°约.134389s角到π/2退出。它们是教学案例的验收结果，不把目标失败当作课程必须隐去的数据，也不宣称硬件安全已验收。

| 命令/检查 | 结果 | 证据 |
|---|---|---|
| node scripts/verify-modern09.mjs | 退出0，实际TS CARE对独立SciPy、123工况301绘图点/3001步统计对离散块矩阵；最大3.2357e−12，Notebook差2.14e−14 | reconciliation.log/json、reference.py |
| node scripts/nb-cells.mjs verify modern/modern-case-study --require-kernel --out .agent/semester-03/modern-09/notebooks.json | 退出0，6份11cell EXECUTED/FAIL0/SKIPPED0；原5用途保留 | notebooks.log/json |
| 最终源浏览器Pyodide | 六份十一cell passed、无缺字 | pyodide.json |
| node scripts/check-python-support.mjs | 退出0，326启用/25保留代码 | python-policy.log |
| npm run verify -- modern/modern-case-study | 退出0，HTTP200，12H2，katex-error0 | verify.log |
| npm run math:check / npm run glossary:check | 均退出0；后者PASS3/WARN2/FAIL0 | math-check.log、glossary.log |
| npm run build / npm run build:pages | 最终正文/组件构建退出0，v1.3状态登记后静态导出再完整构建退出0，205课/9旧入口 | build.log、pages-build.log |
| npm run check / node scripts/check-semester03.mjs | 退出0，check PASS21/WARN2/FAIL0 | check.log、checklist.log |
| 最终静态浏览器/手机 | 6份全部运行完成、PNG正常；两滑块四端点/恢复；三图、41旧ID/52目录目标；375/360px无整页溢出 | browser.json、desktop.png、narrow.png |
| node scripts/verify-modern09-delivery.mjs | 聚合验证退出0，同源指纹与25待办完整性 | delivery-validation.log/json |

A.1四十行、A.2/六组审校/原九项与四补充/红队六列表见本期日志。数值比较是相同Euler–Maruyama离散合同的复现，确定性另以solve_ivp/expm和符号核；不冒称连续SDE精确解或分布外统计保证。共同Brownian路径三种子dt.004/.002检查、九物理参数和四非线性初角全量留档。

原S04本课Notebook债务已解决，历史快照不回写。PY-004字形与PY-005 widget两项本地关闭，原记录python-resolved.json；其它25项原ID/原因/处置深相等，W08/W09/W10仍待办。Python聚合73课/351实验/528cell，只重跑本课。

初稿slug大小写、Python插公式的BEL字符及375px长行内增益/表格溢出均被实际门槛拦截并修复；initial-*/pre-sign-*保留。统计fix首次退出1反映修正前旧统计，随后自动生成OUTLINE/tracker并重跑退出0，不手改派生物。

真实交付进入master后回填提交号。

master交付提交：`3a29ccf820779fe8ef6ef9016bfaa27d49351d7d`；全局六列已勾，回执另提交。按主干策略推送origin/master；本轮gh-pages保持42eed1d509b90699fda0eff8d45f369d7dd7a210。
