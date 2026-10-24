# MPC-06 广义预测控制验收

2026-10-24，用户指定MPC-06/rank6，按wiki-lesson-refactor Phase1–4，仅本课。16H2/64原H2-H3/73旧ID、五题全部子问保留。纠正有限Diophantine方向/系数、总离散延迟、阶跃系数与历史自由响应、C整形/非平稳谱、MV不可消方差、题3矩阵与GMV/LQ/PI/稳定条件；修正旧80/60拍实验，新增Explorer/真SVG，3Notebook6cell。

`node scripts/verify-mpc06.mjs` exit0，1444组真实TS参数对独立绝对输入状态空间延迟链/保持映射与QR最小二乘，32恒等式对Fraction长除法；380原始闭环QP逐次独立核对。最大预测差1.0436096431476471e−14、解差2.021405265395515e−11、梯度残差3.497341305447321e−13、闭环计划差1.4432899320127035e−14，均在事前容差内。3组零λ未提供唯一动作，与独立秩检验相符。原始输出见reconciliation.json/log。

严格`nb-cells verify ... --require-kernel --port 9076` exit0，3Notebook6cell/S1–S8通过/error0/SKIPPED0；生产worker Pyodide同六cell全部通过无codeOnly，proof绑定最终sourceHash并用官方工具合并清单。S04本课Notebook完整性债务已实测关闭，原审计快照保留。普通build与带/control-universe的Pages静态build均exit0，无MDX编译失败；本课verify exit0/HTTP200/H1=1/H2=16/KaTeX0。普通及Pages真实Edge浏览器均执行三个实验至末格和图，旧ID/目录/唯一ID/五控件/复位/零权秩亏/零G/窗口/375px全部通过；截图已实际查看。

math:check exit0/files0/tokens0；glossary PASS4/WARN2/FAIL0/exit0，既有全站WARN保留。最终提交候选从最新已提交master刷新、只叠本课，执行未修改权威plain check、semester/Python支持/fix索引门槛；check-final/semester-final/python-policy-final/fix-final.log为最终依据，全部通过后才签发。遇主干并发推进重新刷新重验，标题缓存按完整源码键，不跳过门槛。

隔离目录D:/Workspace/control-universe-rank6-mpc06；原生19896/内核9076/夹具19996/Pages20096。独立缓存/单核构建/ignored Pyodide副本不进入生产端口或Next配置；正式提交使用私有索引，保留共享暂存、锁及其他课程修改，语义合并仅本课条目。MATLAB示例仅官方API语义核读，未声称本机执行；无真实设备或鲁棒性实测声明。未发布Pages、不生产MPC-07。实际提交与推送回执随后补录。

集成门槛附记：最新已提交master包含2026-10-24-083.md（IMPL-06），但INDEX仍把083当预留，导致全局fix门槛失败。本课仅根据已提交详情机械补齐日期/类型/原归因/链接并撤掉过期预留，不改IMPL-06正文或详情、不重签该课程。来源parent与范围保存在index-083-reconciliation.json；重新跑全局门槛。
