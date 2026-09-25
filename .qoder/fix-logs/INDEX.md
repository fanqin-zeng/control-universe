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
| 011 | 2026-09-23 | components/wiki/jupyter-notebook.tsx | 全站（多Notebook课程页） | BUG | 同页多个Notebook的kernel id都是`nb-<时间戳>-0`（useRef计数器是每实例的）→共用一个内核命名空间、变量互相覆盖，报出与本页代码无关的ValueError；改为模块级`nbSeq`生成唯一id |
| 012 | 2026-09-24 | content/nonlinear/backstepping.mdx | 全站（多行display math） | BUG | 多行公式把内容写在开/闭`$$`同一行（`$$\begin{aligned}`、`\end{aligned}$$`）→remark-math吞首行/不闭合，其后全文被当成一个数学块以katex-error原文渲染；规范化为`$$`独占开/闭行，并给浏览器验收加"h2数==catalog小节数、katex-error==0"两条断言 |
| 013 | 2026-09-24 | content/intelligent/fuzzy-control-basics.mdx | 全站（JupyterNotebook 组件写法） | BUG | `setupCode={`...`},` 收尾带逗号在 JSX 里非法（属性间只能用空白分隔）→next-mdx-remote 编译抛错、getLesson throw、页面表现为 404 而非 500；本地 Python harness 不解析 MDX 故抓不到。全文去掉 8 处逗号，并把"页面 200 且 h2 数==catalog"列为交付硬门槛 |
| 014 | 2026-09-25 | components/wiki/nyquist-limit-cycle-explorer.tsx | 全站（交互组件与正文手算例配对） | BOTH | 组件 -1/N(A) 轨迹从 A=1.05 起（继电器分支共用该下限）→ 默认参数下画不出正文手算例的交点 A0=4/(3π)=0.4244；交点检测只算 Nyquist 穿越点、不检查轨迹覆盖 → 不存在极限环时也误报。修法：轨迹起点按类型分开（relay 从 0.02）、默认改 relay、加覆盖性判据+二分反解 A/插值反解 ω、legend 随交点存在性变化 |
| 015 | 2026-09-25 | lib/content.ts | 全站（新增交互组件的课程页） | BUG | 组件注册表有两份：mdx-components.tsx 与 lib/content.ts 的 compileMDX components 映射，课程页走后者且显式传参会覆盖前者→只改 mdx-components.tsx 时页面 500 "Expected component X to be defined"；新增组件必须两处同改，并以 curl 课程页 200 为交付门槛 |
| 016 | 2026-09-25 | components/wiki/phase-plane-explorer.tsx | 相平面分析（Van der Pol 读数） | BUG | rk4 按 keep=round(steps/1200) 抽稀后返回，过零事件下标是输出点不是积分步，用 T/steps 换算时间使周期小 keep 倍（0.319 vs 6.381 s）→改用 dtStored=T/(len-1) 自洽换算，读数回到 6.380664 s 与 Notebook 1 一致 |
| 017 | 2026-09-25 | content/nonlinear/nonlinear-characteristics.mdx | 全站（JupyterNotebook cell 拼接流程） | BUG | 拼接脚本的占位符 `%%NBn%%` 经过一层 `%` 格式化被折叠成 `%NBn%`，9 个 cell 首行由 `# 注释` 变成 `%# 注释` → IPython 当成 line magic，一运行就 `UsageError: Line magic function '%#' not found`；改回 `#` 并新增"MDX cell 与 harness cell 字符串全等"校验脚本作为交付门槛 |
| 018 | 2026-09-25 | components/wiki/nonlinearity-explorer.tsx | 非线性系统特性（间隙环面积读数） | BUG | 有记忆非线性预热循环停在 t=6π（u≈0，下降支），上升支扫描却从 u=-A 起，prevY 带着 +b 残留把上升支钉高 1.0 → 环面积 0.520000 而手算 0.84（max\|y-u\| 仍正确，最难发现）；预热末相位改为与扫描起点重合 θ=-π/2，面积回到 0.839999 |
