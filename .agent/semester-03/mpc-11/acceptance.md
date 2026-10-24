# MPC-11 预测控制案例验收

2026-10-24，rank6，按wiki-lesson-refactor重构；起点draft/948行CSTR正文，旧稿/hash及旧Notebook、41个全级ID均版本化保留。12主题、5题15子问保留并纠错，9个主题位置别名；原CSTR示意图保留，部署ASCII换SVG。修正单位/平衡/精确ZOH/增量历史输入、QP实际约束与温度截断；撤回无有效原实测的活性/时常和20%鲁棒保证。新版本明确Nu1分块，不冒称等同旧Nu5控制器。

旧Notebook严格内核复现S2/S6各两项失败。新两Notebook四原cell的严格内核与生产worker Pyodide全过，enabled2/codeOnly0，最终sourceHash由官方工具合并；notebooks-before.json/log、notebooks.json/log、pyodide.json/log保存实际输出。S04历史清单不抹除，本课原执行债务以新验收关闭。

`node scripts/verify-mpc11.mjs`exit0：实际TS648QP配置/初态，324可行/324不可行；8闭环320实际输入对独立SLSQP原残差KKT与DOP853。最大动作差2.4158453015843406e-12、费用差7.712515071034431e-9、KKT6.643429065086721e-12，低于预先1e-5/1e-6；同输入独立积分状态差2.9388527877927118e-6<1e-5。Jacobian另用复步、ZOH对block expm。RK4由.005细化为.0025，不放宽容差。四个原setup/cell每次重新提取执行；numeric.json、raw-cells.log、reference.py、runtime.json可复现。

最终普通与Pages两个完整构建均exit0，无MDX编译失败；轴名移至侧面后两页面完整复测通过。单课verify exit0/HTTP200/H1=1/H2=12/KaTeX0；真实Edge两类页面41旧ID/全目录/唯一ID、六滑块/零阶跃/复位与四cell及图实跑完成，375px无全页溢出、无pageerror，截图已查看。最终候选刷新最新已提交master后重跑权威plain check、semester、Python支持和fix索引门槛，签发在实际通过后。math:check exit0；glossary PASS4/WARN2/FAIL0，未改机器表。fix090记录原始漏出问题和既有规范未执行归因；最终索引双向门槛待实际集成执行。

隔离D:/Workspace/control-universe-rank6-mpc11，Next21896/内核9136/夹具21996/Pages22096；独立缓存/临时索引，生产端口不变。不暂存、重置或清理共享索引，不删除其锁；共享文件仅合并本课条目。本会话未执行Pages发布，不自动生产其他课，真实提交hash随后补录。
