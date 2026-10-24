# ID-05 闭环辨识

2026-10-24用户指定rank3继续ID-05，空课新写，使用wiki-lesson-new及既有Phase1–4；只交付本课。ID-04仅维护一句“下一课尚未交付”的过时提示，推导/实验/习题均不改，原3Notebook回归并更新hash证明，不重新签发旧课。先修ID-04、传递函数、随机过程、PID均已交付。

范围：严格因果单增益回路、LS长记录目标、工具正交/相关条件、错误/无工具、正确ARX及路线边界；解析交互不冒充有限数据估计，32重复同记录实验不冒充统计定理。Phase1–4及本课验收已完成，真实提交后追加回执。

隔离目录D:/Workspace/control-universe-rank3-id05；kernel/native按系统空闲端口选择、fixture/Pages由Node直接绑定端口0并回执PID与根目录。地址见ports.json/fixture-port.json/pages-port.json；不改共享.next和端口脚本，不停止他人服务。共享Git索引保留，使用专用索引只提交本课差异；推master不发布Pages。

开工共享check PASS19/WARN2/FAIL7；学期检查RL-02并行行格式未就绪，保留opening日志。以最新HEAD叠本课的隔离门槛为最终验收，不擅改其他课程刷绿。

交付正文267行/11H2、4题/4答案、3 Notebook/3cell、1解析Explorer、1SVG；同步catalog、旧tracker、全局checklist、自动OUTLINE、术语和Python策略。ID-04仅改一句时态提示，原代码按old-source-base.txt与HEAD比较，3Notebook/3cell浏览器完整回归。

| 最终验收 | 实际结果 | 版本化证据（本目录） |
|---|---|---|
| 真实TS与独立模型 | 1458总体配置/18曲线、96条完整记录、2374638量，maxError2.9976021664879227e-15<1e-10；6类非法输入拒绝 | actual-ts.json/log、reference.py、reconciliation.json/log |
| 实际浏览器模拟摘要 | 45项对独立滤波参考，maxError3.885780586188048e-15<1e-10 | browser-numeric.json/log |
| 新课严格内核 | EXECUTED；3Notebook/3cell，error0/SKIPPED0，exit0 | notebooks.json/log |
| 两课浏览器Worker | 新课3/3与旧课原3/3均passed且enabled，实际Worker hash另抓取核 | pyodide.json、old-pyodide.json、worker-served.json |
| 原生/Pages构建 | 两次exit0，无MDX编译失败，最后SVG已纳入重建 | build/pages-commands.json、build.log、pages-build.log |
| 课程页面 | exit0，PASS9/WARN0/FAIL0；HTTP200/H1=1/H2=11/KaTeX0 | verify.log、verify-commands.json |
| 两实际页面 | 全部Notebook运行、5预设、ρ边界/无定义组合/恢复、真实标题ID/侧栏/图片/375px、无pageerror | browser-native/pages.json/log及截图 |
| 全局目录与学期 | exit0，check PASS21/WARN2/FAIL0；学期PASS | final-check.log、final-semester.log |
| Python策略 | exit0；本次快照111课、462enabled、7codeOnly；并行提交后更新以最终日志为准 | python-policy.log |
| 术语/公式 | exit0，术语PASS3/WARN3/FAIL0；公式files0/tokens0 | final-glossary.log、final-math.log |
| 证据交叉核 | pass=true；两课hash、旧cell保留、新原始cell、独立数值、两页及实际SVG字节一致 | validate.mjs、validation.log |

ID-05 sourceHash `94c732f0d0d10ef419aaa5e43243926b81563ddf677253a7c1627d102df22589`；ID-04互链sourceHash `bea3acfb500ac86d09fa8890f0b9752a709e5a96f62a19cd52aeef100f51002e`。Worker以worker-served.json/两份原始浏览器报告一致值为准。原始cell只统一CRLF/LF后比较，不改语句。

构建基线为build-base.txt所记76ae270加本课；最终目录/策略/进度基线为scope-base.txt，若HEAD推进则重新从HEAD叠本课，保留其它课程提交。其它课的未提交草稿不带入；不把共享工作区称为全站通过。

初期目录名/import残留及静态.mjs MIME问题修复后重新执行；框图分支重叠已改并重建。混用Pages缓存的原生复验失败不算通过，最后两模式按顺序独立重建与全量实测成功。失败日志保留，讨论日志D记录处置。

资源回收见kernels-closed.json/resources-closed.json：6个本任务遗留内核DELETE后余0，自己的内核与夹具PID关闭；原生和Pages预览由Popen finally关闭。未停他人进程，未改共享端口脚本或.next。共享Git索引保留，提交使用本任务专用索引。
