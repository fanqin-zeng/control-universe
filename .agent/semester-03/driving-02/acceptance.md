# DRIVING-02 车辆动力学

2026-10-24，用户指定继续DRIVING-02，rank14。新写 autonomous-driving/vehicle-dynamics，无既有正文。入口：已交付DRIVING-01、微分方程与矩阵指数；状态空间作为明确补充先修。只交付本课，不发布Pages。

隔离目录 D:/Workspace/control-universe-rank14-driving02，独立Next 18124、Jupyter18924、Pages18224、浏览器实验18324，开工核查均未监听。上一课Pages18214保留。共享仓库有其他会话暂存和陈旧索引状态，不重置、不删除index.lock，不把旧索引中的删除当作用户实际删除；HEAD与磁盘逐路径核查。提交使用独立Git索引和原子基线检查，保留并行课程提交。

本课合同：直路进入弯道→参考点/坐标/单位→后轴无侧滑几何→纵向力与附着→线性侧偏力→CG横向单轨模型→算例与边界→习题。10H2、两Notebook四cell、一Explorer、一SVG、四题四答。参数均为合成教学配置，无车辆标定/道路试验/控制算法优劣声明。正式签发与实际输出逐步追加。

## 实际验收与签发

Phase1–4已完成，四题四答、10H2、两Notebook四cell、一Explorer/SVG。数值合同及九项门槛见讨论日志A/B/C。

| 命令/操作 | 退出码与实际结果 | 证据 |
|---|---|---|
| python reference.py；node numeric-audit.cjs | 0；独立力/力矩+expm对真实TS，6工况2412轨迹量，最大误差3.033954421e−9；3213控件状态，μ响应不变而预算变化、几何反向/直线/静止、动态u0拒绝 | reference.json/numeric.json/numeric.log |
| nb-cells单课 --require-kernel --port 18924 | 0；2Notebook4cell，error0/SKIPPED0 | notebooks-final.log/json；extracted.json |
| browser-audit.cjs生产Pyodide | 0；2Notebook4cell全部原始输出通过 | pyodide.json/log |
| 隔离npm run build | 0；无MDX编译失败 | build.log |
| 独立distDir的PAGES_BUILD=1 npm run build | 0；完整静态导出 | pages-build.log |
| page-audit.cjs普通与Pages本地URL | 均0；10个H2精确顺序/ID，所有锚点/图片、正负零与恢复、四cell输出、375px、无pageerror | browser-native/pages.json/log及桌面/手机截图 |
| verify-scope.cjs七命令 | 全部0，逐命令真实退出码已保存 | commands.json；check.log/python-policy.log/math.log/glossary.log/semester.log/verify-final.log/notebooks-final.log |

隔离check为PASS21/WARN2/FAIL0；两个WARN是motion-planning跨章重名、旧课日志债务。glossary为PASS3/WARN3/FAIL0：\mathcal{U}登记未命中、NOISE残留16项未命中、既有四处max/min拼写；本课无新增未登记符号。math:check为files0/tokens0。Python策略在该快照为96课/409可运行/14代码展示，属于初始HEAD+本课口径，不能当所有并行会话的全局最终统计。

共享开始检查exit1，显示DRIVING-01旧tracker行与catalog不一致、组件统计在并行写入期间不一致；未将共享中间态算作本课通过。首次隔离semester检查exit1是本课顺序例外未包含旧快照中的MPC-01待回执状态，现已据用户换课指令补齐，只改本课例外；semester-first.log保留失败，修正后exit0。

正文LF SHA-256：c57e0d20843c5f95884f5b01c3b8f242b131ad7d8097e220324f53f259ab412a。资料和约定换算见sources.md；不是实车标定、论文实验复现或线上发布。

最终提交候选基线：bae122d38cad76d02da19513aa3aace7a9908710；publish-commands.json五项检查全部exit0。本课正文、组件、计算库与SVG逐字等于两种实际页面/构建的源，catalog结构比较确认其它课程完全保留。共享暂存区不作为输入，使用独立索引及原子基线校验提交。
