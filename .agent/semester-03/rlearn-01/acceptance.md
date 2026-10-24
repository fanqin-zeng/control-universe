# RLEARN-01 机器人数据

2026-10-24 用户指定继续 RLEARN-01，rank 12；本对话只交付这一课。

起点 master 9c11c8b7567cb959a4ebca16d7f1360b9f6c6c81。保留所有其他会话和用户修改；共享文件只改本课行，提交采用 HEAD 投影的本课补丁，避免带入并行课程。构建副本 D:/Workspace/control-universe-rank12-rlearn01，页面 8202，内核 9002（先查空闲再启动），不使用或清理共享 .next，不停止他人服务。

原 catalog 前置 robotics/trajectory-tracking、machine-learning/learning-evaluation 均为空，不能假定读者已学。本课讨论的是数据合同与审计，不需要轨迹控制律或学习评估算法；实际先修改为已交付 machine-learning/learning-problem 与 math/probability-basics。轨迹、动作、训练/验证/测试、时间因果在正文局部定义；不交付原两门先修。

Phase 1–4、签发和本课验收已完成，正文10H2、五题五答、三个原始Notebook/三个cell、一个内嵌SVG。没有连续调参任务，Phase1明确使用静态数据审计路线，不新增Explorer或共享注册表修改。

| 命令/操作 | 实际结果 | 版本化证据 |
|---|---|---|
| python examples.py与原始MDX独立进程复算 | 确定性对齐、窗口与变换全部核对 | minimal-results.json、reconciliation.json/log、examples.py、reconcile.mjs |
| node scripts/nb-cells.mjs verify robot-learning/robot-data --require-kernel --port 9002 --out .agent/semester-03/rlearn-01/notebooks.json | exit0；3Notebook/3cell/error0/SKIPPED0 | notebooks.log/json |
| 原始Pyodide完整运行 | 3实验全部passed；原生Python与浏览器stdout仅统一换行后逐字相等 | pyodide.json、browser-audit.log、reconciliation.json |
| 独立副本npm run check | exit0；PASS21/WARN2/FAIL0 | projection-check-final.log；两WARN为旧重复slug与旧日志覆盖债务 |
| 独立副本NEXT_PUBLIC_STATIC_EXPORT=true npm run build | exit0；无MDX编译失败 | build.log；标准Next生产构建，未发布Pages |
| WIKI_VERIFY_PORT=8202 node scripts/verify-lesson.mjs robot-learning/robot-data | exit0；PASS9/WARN0/FAIL0/SKIPPED0，HTTP200/H1=1/H2=10/KaTeX0 | verify-production.log |
| 本课真实生产页三个“全部运行” | 完整输出与原始cell相符；无browser/console error | browser-production.log、browser.json、page-console.json |
| 真实DOM与窄屏/截图 | 10个H2及全部侧栏锚点可用；无重复ID；390px document宽=scroll宽，SVG=article=358px；已目视复核截图 | headings.json、dom.json、browser.json、desktop/mobile.png及局部图 |
| npm run glossary:check / npm run math:check | 均exit0；glossary PASS3/WARN3/FAIL0，同行display违规0 | glossary.log、math.log |
| GIT_DIR指向主库，独立副本node scripts/check-semester03.mjs | exit0；真实历史commit可达，计划/checklist一致 | projection-semester.log；这是只读历史核对，不操作主库index |
| node scripts/check-python-support.mjs | exit0，含本课三实验enabled | projection-python.log；保留已有code-only实验及他课记录 |

正文SHA256（LF归一化）：38c11fff4929e9564448a77280cb2aa280967f2f6b20b344a404a0c875f8280d。浏览器证据覆盖该精确源hash。

共享工作区初次check为FAIL6（他课组件/状态和自动统计瞬时不同步），后续shared-check-draft.log仍有他课FAIL；共享semester存在INTEL-01顺序例外缺口。全部如实保留，不修改他课正文或签发。投影是master起点叠加本课，单独check退出0；提交使用独立index承载这一投影，避免把其它会话的共享文件修改带入。自动修复命令首次会报告修前统计差异，随后重新运行check的PASS输出才是最终证据。

原生开发页默认8891不能复用rank12内核；本课原生内核严格验收使用9002，生产页Pyodide在浏览器执行。未声称默认8891页面原生连接已通过，也不修改其它会话正在调整的端口基础设施。

master提交、推送及真实hash在完成后追加。未发布Pages。

并行提交合流复核：ID-02在本课期间进入master，最终提交投影基线更新到 `52cfac9b01bcd5b89f01d9bdd77b96ea54982ffa`。project.mjs仅提取RLEARN-01的共享行/对象，保留已提交ID-02正文、元数据与浏览器证明；audit-projection.mjs逐项证明其它课程及其记录不变（scoped-audit.log）。在该组合版本重新执行check：PASS21/WARN2/FAIL0；生产build退出0；semester退出0；glossary PASS3/WARN2/FAIL0；Python政策87课/386实验enabled/16保留代码。共享最终check另为PASS19/WARN2/FAIL5，见shared-check-final.log，未将其写成通过。

真实master交付：commit:4909e2e73d53c87a1925ec8baff647c1e0b79e93，父提交c5d7cb70b08e95f96e38d3cf5f86ef086875ca34。三个原始Notebook及正文源hash不变；首次交付使用独立index，六个已被其它会话暂存的共享条目原样保留。最终的组合/构建基线及其范围分别见commit-projection.json、concurrent-rebase.json与build.log；完整构建基于52cfac9，随后主干新增的无关课程通过逐对象保留、Python政策和批量历史证据核验合流，未冒称对每次后续提交都重新全站构建。
