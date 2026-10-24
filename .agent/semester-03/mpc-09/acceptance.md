# MPC-09 经济预测控制验收

2026-10-24，rank6；从catalog empty且无MDX按wiki-lesson-new新写，唯一交付目标mpc/economic-mpc。十一H2、四题完整答案、六参数Explorer、原生SVG、两Notebook四cell。以分时储水进入经济目标，区分同尺度费用、常价严格耗散、旋转终端修正与周期运行；含价格和需求失配反例。

当前检查点：`node scripts/verify-mpc09.mjs`退出0。实际生产TS覆盖5120配置，2112可行/3008不可行，6种非法参数拒绝；对独立SciPy原目标的最大动作差4.045299162314109e-8、费用差7.41669889947616e-8，低于预定1e-7。独立有理最优性证书逐配置成立；KKT最大1.7763568394002505e-15，另有144组精确存储/终端恒等式。每次核验重新提取原始setup/cell，四cell实际执行，输出见raw-cells.log与numeric.json。

严格内核`node scripts/nb-cells.mjs verify mpc/economic-mpc --require-kernel --port 9116 --out .agent/semester-03/mpc-09/notebooks.json`退出0，2Notebook/4cell/error0，无SKIPPED。生产Pyodide同四cell全过、enabled2/codeOnly0，最终源码hash见pyodide.json，官方工具合并支持策略。math:check退出0；glossary PASS4/WARN2/FAIL0，未改机器表放宽门槛。

普通与Pages两个构建均退出0，无MDX编译失败；单课verify HTTP200/H1=1/H2=11/KaTeX0。实际Edge两类页面均操作参数/不可行/复位，执行两实验四cell并加载SVG和图，375px无全页横向溢出、无pageerror，截图已查看。最终候选刷新最新已提交master后重跑权威plain check、semester、Python支持与fix索引门槛，实际结果见对应final.log；签发待这些门槛实际通过，hash随后补录。隔离目录D:/Workspace/control-universe-rank6-mpc09；Next21096、内核9116、夹具21196、Pages21296。原始共享索引和锁不用于本课暂存/重置/清理；共享文件只合并本课条目。本会话未执行Pages发布，不生产MPC-10。
