# Wiki修复日志索引

| # | 日期 | 文档 | 章节 | 类型 | 摘要 |
|---|------|------|------|------|------|
| 001 | 2026-09-22 | classic/time-domain-analysis.mdx | 一阶系统的阶跃响应 | BOTH | 缺少动态控件→新增FirstOrderStepExplorer交互组件，拖动T滑块感受各指标含义 |
| 002 | 2026-09-22 | classic/time-domain-analysis.mdx | 一阶系统的阶跃响应 | BOTH | 横坐标轴动态缩放→改为固定范围(30s)，让T/3T/4T标注线随参数变化而移动 |
| 003 | 2026-09-22 | classic/time-domain-analysis.mdx | 一阶系统的阶跃响应 | BOTH | 标注线渐入动画→禁用animation，拖动时即时响应无闪烁 |
| 004 | 2026-09-22 | classic/system-modeling.mdx | 阻尼的关键作用 | BUG | ipywidgets不可用→改用React交互组件SuspensionExplorer，带ζ滑块实时响应 |
| 005 | 2026-09-23 | transfer-function, time-domain-analysis | StepBodeExplorer/ImpulseExplorer/SuspensionTimeExplorer/PoleZeroExplorer | BUG | 四个组件违反Fix-002（动态坐标轴）→改为固定xAxis/yAxis常量，确保曲线在稳定参考系中移动 |
| 006 | 2026-09-23 | classic/frequency-domain-analysis.mdx | 频域分析 | BOTH | 4个ipywidgets笔记本→转为React组件（BodeZetaExplorer/NyquistZetaExplorer/BandwidthCorrespondenceExplorer/RCFilterBodeExplorer），符合Fix-002/003/004 |
| 007 | 2026-09-23 | classic/root-locus.mdx | 增益 K 如何影响阶跃响应 | BUG | ipywidgets不可用→改用React交互组件RootLocusKExplorer，带K滑块展示过阻尼/分离点/欠阻尼/临界稳定/不稳定五种状态，固定时间轴(0-10s)，禁用动画 |
| 008 | 2026-09-23 | classic/pid-controller.mdx | PID控制器参数调节 | BUG | 2个ipywidgets笔记本→转为React组件（PidDerivativeFilterExplorer单Tf滑块+PidKiKdExplorer双Ki/Kd滑块），固定坐标轴，禁用动画 |
| 009 | 2026-09-23 | classic/stability-analysis.mdx | 系统稳定性分析 | BUG | 2个ipywidgets笔记本→转为React组件（StabilityThirdOrderExplorer单a2滑块展示三阶系统稳定域+StabilityDelayExplorer单K滑块展示时滞稳定性），固定坐标轴，禁用动画 |
| 010 | 2026-09-23 | classic/compensator-design.mdx | 校正网络设计 | BUG | 4个ipywidgets笔记本→转为React组件（LeadCompensatorExplorer单K滑块展示超前校正Bode图+LagCompensatorExplorer单K滑块展示滞后校正Bode图+LeadLagCompensatorExplorer单K滑块展示超前-滞后校正+AntiWindupExplorer单u_limit滑块展示抗饱和仿真），固定坐标轴，禁用动画 |
