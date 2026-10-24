# ID-01 系统辨识框架

2026-10-24 用户指定继续 ID-01，rank 3。新写一课；此前未完成课暂缓，不依赖控制实现或机器学习未签发正文。必需先修为已交付的离散时间系统与概率基础，最小二乘在本课局部定义，完整算法留给 ID-03。

隔离约定：独立运行副本 D:/Workspace/control-universe-rank3-id01，Next 端口 8193、Jupyter 8993、Pages 8293（使用前核查占用）。不修改共享端口脚本、不清理共享 .next、不停止他人进程。共享文件仅合入本课局部差异；保留 IMPL-01、ML-01 和用户批阅。仅提交推送 master，不发布 Pages。

实际端口：8993内核；18193原生课页；18393浏览器实验夹具；18493 Pages本地预览。原定8293被Windows拒绝绑定，未抢占其它会话资源。

Phase 1–4已完成，9 H2、两Notebook三cell、一SVG、四题四答。主例为确定性无噪声合成水箱；边界例是仅重复记录同一稳态导致秩亏。没有真实水箱数据或控制部署声明，没有算法性能排名。

| 验收命令/操作 | 退出码与实测 | 持久证据 |
|---|---|---|
| python .agent/semester-03/id-01/reference.py | 0；原始cell与独立Fraction解析一致 | reconciliation.log/json |
| node scripts/nb-cells.mjs verify identification/identification-framework --require-kernel --port 8993 | 0；2Notebook/3cell/error0/SKIPPED0 | notebooks.log/json |
| 隔离副本npm run build | 0；无MDX编译失败 | build.log |
| WIKI_VERIFY_PORT=18193 node scripts/verify-lesson.mjs identification/identification-framework | 0；PASS8/WARN1/FAIL0，HTTP200/H1=1/H2=9/KaTeX0 | verify.log |
| node .agent/semester-03/id-01/browser-audit.cjs | 0；Pyodide全部3cell通过 | pyodide.log/json |
| node .agent/semester-03/id-01/page-audit.cjs | 0；原生页全部运行、锚点/重复ID/图片/375px/错误均过 | browser-native.log/json、desktop.png、mobile.png |
| 隔离副本PAGES_BUILD=1 NEXT_PUBLIC_BASE_PATH=/control-universe NEXT_PUBLIC_STATIC_EXPORT=true npm run build | 0；静态构建通过 | pages-build.log |
| ID01_PAGE_URL=本地静态预览 ID01_AUDIT_NAME=pages node .agent/semester-03/id-01/page-audit.cjs | 0；静态页三cell输出、正确basePath图片/桌面/375px均过 | browser-pages.log/json、desktop-pages.png、mobile-pages.png |
| node scripts/check-python-support.mjs | 0；pass=true | python-policy.log |
| npm run math:check | 0；files0/tokens0 | math.log |
| node scripts/glossary.mjs check | 0；PASS3/WARN2/FAIL0 | glossary.log |
| npm run check（自动更新大纲/统计后另跑） | 0；PASS21/WARN2/FAIL0 | check.log；refresh.log退出1仅记录刷新，未冒充通过 |
| node scripts/check-semester03.mjs | 0；换课例外已登记，本课不依赖并行未交付课 | semester-progress.log；签发后另跑 |

verify的唯一WARN是三处明确后续阅读指向尚未编写的辨识课程，不是先修；全仓两WARN沿用既有登记。开工时全仓check受并行组件注册与统计更新影响退出1，原始输出保留，最终通过另证。初次构建的小节类型错误已修正，最终build.log只记修正后的真实执行。

正文LF规范化SHA-256：8fcdc8d7e4e058d575eaa84f504903c56016331ef27da7ccb21a8e6feb36b1fb。真实交付提交后再登记hash；只推master，不发布gh-pages。

提交隔离复核：在HEAD上仅叠加ID-01的完整源文件与共享文件局部差异，重新生成OUTLINE及tracker统计；staged-check.log为PASS21/WARN2/FAIL0，staged-python-policy.log为pass=true（83课/377可运行/16代码展示，是隔离提交口径）。staged-semester.log退出0；隔离目录无.git，验证历史master祖先时显式GIT_DIR指向原仓库，仅作只读验证。共享工作区已出现其它课程的未提交元数据与证明，未将其纳入本课提交。全仓工作区统计与本课提交隔离口径可因并行工作不同，不混写。
