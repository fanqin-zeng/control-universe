# MPC-10 移动水平估计验收

2026-10-24，rank6；目标mpc/mhe-fusion，catalog empty且旧/目标路径均无MDX，按wiki-lesson-new新写，唯一交付本课。十一H2、四题所有子问的完整答案、六参数MHE Explorer、窗口SVG、两Notebook四cell。区分滤波/平滑、到达先验与重复计数、约束QP/真值误差、估计接入MPC的条件。

`node scripts/verify-mpc10.mjs`退出0：实际生产TS枚举盒活动集，对独立SciPy原加权残差有界LS；1620配置和1620个有理KKT证书、6类非法参数拒绝。最大状态差6.044604727861724e-8、费用差9.947598300641403e-14，均低于预定1e-7；独立KKT残差最大1.5987211554602254e-14<1e-8。每次重新提取原setup/cell，四cell全部执行；numeric.json、raw-cells.log及reference.py保存证据。

严格`node scripts/nb-cells.mjs verify mpc/mhe-fusion --require-kernel --port 9126 --out .agent/semester-03/mpc-10/notebooks.json`退出0，2Notebook/4cell/error0，无SKIPPED。生产worker Pyodide同四cell全过、enabled2/codeOnly0，最终sourceHash见pyodide.json，官方工具合并支持策略。math:check退出0，glossary PASS4/WARN2/FAIL0，未改机器表放宽门槛。

普通与Pages两完整构建均exit0，无MDX编译失败；单课verify exit0/HTTP200/H1=1/H2=11/KaTeX0。实际Edge两类页面操作六参数与复位、容量0/不活动，执行两Notebook四cell并加载图及SVG，375px无全页横向溢出、无pageerror，截图已查看。最终候选刷新最新已提交master后重跑权威plain check、semester、Python支持和fix索引门槛，实际输出见各final.log；签发在门槛通过后，hash随后补录。隔离目录D:/Workspace/control-universe-rank6-mpc10；Next21496、内核9126、夹具21596、Pages21696。临时独立索引和原子引用更新；不暂存、重置或清理共享索引，不删除索引锁。共享文件仅合并本课条目；本会话未执行Pages发布，不生产MPC-11。

## master实际回执

交付提交`ebd2c5a1889b15d96a0a732971790e3b9e6f69fa`已进入master并推送origin master，原始远端确认见push.log。最终候选check PASS21/WARN2/FAIL0/exit0；semester/Python支持/fix门槛退出0，两个构建、严格内核、生产Pyodide、普通与Pages本地页面实际运行均有版本化证据。最终回执只更新本课勾选及hash，不制造分支/合并节点、不包含并行未提交工作。

本课暂存使用临时独立索引和原子引用更新，未暂存、重置或清理共享索引，未删除索引锁；不对并行期间全局索引哈希不变作声明。因此不把共享工作区既有暂存状态当作本课“干净工作区”声明。共享文件只更新本课条目，派生摘要若与并行未提交内容冲突则保留原工作区版本，提交树已通过隔离集成门槛。四个本课测试服务由本会话分别停止，未终止占用原端口组的服务；本会话未执行Pages发布、不生产MPC-11。
