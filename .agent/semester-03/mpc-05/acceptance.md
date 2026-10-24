# MPC-05 递归可行性与稳定性验收

2026-10-24，用户指定MPC-05/rank6；起点catalog empty且无MDX，使用wiki-lesson-new，仅本课。十H2、四题四答、终端移位Explorer与真SVG、两Notebook四cell。读者从MPC04与Lyapunov进入；名义可行接续、费用抵消和稳定性上下界分层证明，含一步陷阱与失配反例，不把样本当理论极限或安全认证。

`node scripts/verify-mpc05.mjs` exit0：实际TS3536配置（含扰动分支与可行端点）对独立直接递推/HiGHS可行性/目标与对偶证书，3088本拍可行448不可行，最大KKT1.2434497875801753e−14、对偶差1.4210854715202004e−14；原始20QP另核复步梯度，源最大KKT7.834756626763674e−7、下降式残差4.9106756212793357e−14。reconciliation.json/log有原始值。

严格`nb-cells verify ... --require-kernel --port 9056` exit0，2Notebook4cell/error0/SKIPPED0；生产Pyodide同四cell全过无codeOnly，最终源hash由官方工具合并。普通build与带/control-universe的Pages静态build均exit0，无MDX编译失败；本课verify exit0/HTTP200/H1=1/H2=10/KaTeX0。真实Edge普通/Pages本地页面都跑到两实验末格与图，并核标题管线/目录目标/唯一ID/滑块/复位/平衡/无解/扰动/375px；browser-native/pages.json和实际查看截图保存。

math:check exit0；glossary最终PASS3/WARN3/FAIL0/exit0，不改术语表放宽门槛。初稿模板提取、转义、unused G和catalog小节schema错误已纠正并重跑适用门槛，不用失败记录冒充通过。最终提交候选刷新最新已提交master后，仅叠加本课并重跑权威plain check、semester、Python支持和fix索引门槛；实际结果见check-final/semester-final/python-policy-final/fix-final.log，签发在这些门槛通过之后。

隔离目录D:/Workspace/control-universe-rank6-mpc05，Next19496/内核9056/夹具19596/Pages19696；隔离缓存、单核构建与独立Git索引不改变生产端口/配置。共享索引与现有锁原样保留；共享文件只合并本课条目，不把其它会话未提交内容算作本课验收。主干并发推进时刷新重验，保留既有按完整源码键的标题缓存，不跳过检查。未发布Pages、不生产MPC-06。实际master提交与推送回执随后补录。

## master实际回执

交付提交`02e79e304684b094640581644d55ea14dffc0807`已进入master并推送origin master，原始远端确认见push.log。最终候选check PASS21/WARN2/FAIL0/exit0；semester/Python支持/fix门槛退出0，两个构建、严格内核、生产Pyodide、普通与Pages本地页面实际运行均有版本化证据。最终回执只更新本课勾选及hash，不制造分支/合并节点、不包含并行未提交工作。

原共享Git索引字节未修改，既有索引锁未删除；本课提交完全使用临时独立索引和原子引用更新。因此不把共享工作区既有暂存状态当作本课“干净工作区”声明。共享文件只更新本课条目，派生摘要若与并行未提交内容冲突则保留原工作区版本，提交树已通过隔离集成门槛。四个本课测试服务通过各自执行会话停止，未终止占用原端口组的服务；未发布Pages、不生产MPC-06。
