# CLASSIC-06「根轨迹」重构讨论

日期：2026-10-18；目标classic/root-locus；type=theory；起点master b403c1a，分支wp/classic-06-root-locus。按wiki-lesson-refactor与semester-03-core执行。本日志中的角色为既有结构化审查视角，不是外部专家或独立Agent；不调整团队。

| 角色 | 出席 | 本课职责 |
|---|---|---|
| 郑核 | 出席 | 主持、边界、四档案与签发 |
| 陈控 | 出席 | classic主责、几何规则与设计解释 |
| 林矩 | 出席 | 特征多项式、隐藏模态与近似条件 |
| 苏绘 | 出席 | 根平面与响应双轨规范 |
| 孙助 | 出席 | 七题去向、答案与术语 |
| 柯验 | 出席 | 独立根/响应、逐断言对账 |
| 秦构 | 出席 | 真实组件、构建/内核/页面九项 |
| 何疑 | 出席 | 零极点/PD比较及近似保证审查 |
| 李稳 | 出席 | 理论连贯、开闭环与阻尼概念 |
| 钱锐 | 出席 | 端点、重根、过度推广反例 |

theory核心四人与陈控/林矩、李稳/钱锐，另秦构/何疑验证，共10人。其余教授/工程/学生不为凑数到场，按阶段代核适用职责。

## Phase 1: 内容规划

[郑核] 准备审计已读原稿全篇、四Notebook五cell、RootLocusKExplorer实际实现、catalog/旧tracker、fix022/035–038与批阅开篇要求。baseline-source.json记录旧48全级标题/12H2/源hash；未找到独立旧本课日志，不能继承v1.3当本轮签发。旧组件仅本课调用待gitgrep复核。

[陈控] 学习目标五项：①从已交付稳定性与极点响应提出“增益变动时一组根怎样一起移动”；②按D+KN及幅角条件判点并算K；③正确筛分离候选、渐近线、虚轴端点；④区分极点几何指标与完整传函的真实性能；⑤用零点位置反例理解设计条件。保留七绘图规则、完整三阶手算、ζ=.5推导、PD/PI预览、广义轨迹和七题。非目标是PID整定、数字控制详细推导或完整硬件设计。

[林矩] 原错误优先级：组件按K区间伪造三阶阶跃，未求根，分离附近/临界曲线甚至初值错误；K0是D的根极限，不是约分后零传函极点等同“未控制”；虚轴根不自动BIBO/内部稳定；dK/ds候选须满足实轴段/K≥0/有限定义。原主导极点5倍与4/σ不能担保2%调节时间。Q5下界448/27真实ts3.996414s>3，K25也失败但邻近候选能通过，故不可签发旧连续区间。

[苏绘] 保留一个原注册Explorer，改为实际三阶闭环根平面+零初值单位阶跃两图。默认精确K=224/27，对齐正文ζ.5算例；滑块K0…60，精确分离/临界按钮及恢复。根图等比例方窗Re−8…2/Im−5…5，时间0…10s、y−4…6固定，截窗明确；K≥48不画“稳态1”标记。规则/等ζ圆弧/PD三工况用静态Notebook，避免强加新交互。

[孙助] 原七题主题全留，题4完整正K阻尼范围；题5保留原目标和4/σ候选推导，但改问“候选区间+四个真实响应验收+能否保证”，不要求读者用近似签发不真实区间；题7改成分析零点位置与反例，不诱导证明假定理。所有变更进D，不静默删题。九段H2可保留原结构，仅三个长题名缩短，H1按catalog根轨迹，并为四旧ID保别名。

[何疑] 不保留“加零点总更快更稳”“加极点总变坏”。同一对象1/[s(s+2)(s+4)]，新增零点−z时闭环s³+6s²+(8+K)s+Kz，Routh严格条件K>0且48+(6−z)K>0；z1/6/10含不改善/变坏。K1/10/40同K图只作限定观察，不当独立整定后的优胜排名；交代导数噪声/滤波极点代价。PI只能针对输入类型和闭环稳定性谈误差。

[柯验] minimal.py先用独立多项式根/留数复算：主分离−.8452994616/K3.0792014357；默认K224/27的根−14/3与−2/3±j2√3/3，完整三阶ts6.2438145103s，非简单二阶16.303%超调保证。数值合同：连续SISO、实系数严格真对象、单位负反馈、无隐藏不稳约消；归一化输入输出，s秒基准，K相对该模型归一化。零初始单位阶跃；React实际状态方程RK4内部dt=.001s、每.02s输出至10s，独立scipy.step/矩阵指数核全部501点；根残差≤1e-9、根坐标≤2e-7、响应≤2e-7，显示六位按末位。重复根不用简单留数式硬除；所有原始setup/cell新内核与Pyodide实跑。非线性/记忆/随机/训练不适用，K0单列输出0不报最终值1。

[沉默-何仿：本课theory不列出席；实验合同由郑核代收、柯验独立复算]
[郑核] 前置稳定性已交付；幅角依赖复数与传函，正文回顾，不把PID未来课当已知。历史1948与API来源用Illinois ECE486 lec10/11及control0.10.2 root_locus_map官方资料复核，写明软件版本。先实现第一稿再听学生反馈，不预签发。

[共识] 保留正确推导和全部原实验目的，优先去伪曲线和不真实性能保证；苏绘一交互双图、孙助七题去向、柯验原始代码/真实TS/独立SciPy全核。四旧锚点保留、其余课程不改；W06/W07/W08/W09和27Python待办继续开放。本对话仅CLASSIC-06，验收后no-ff合master，不发布gh-pages。

## Phase 2: 内容生成

### 第一轮 — 概念讲解

[陈控] 开始第一稿：从自动窗帘电机停位时“推得更用力为何反而来回晃”引入，说明这是教学归一化对象不是电机参数辨识。保留三阶算例和七规则，明确D+KN、K0端点、主导近似边界、PD/PI条件；第一轮不记学生已接受。


### 第二轮 — 学生反馈

[李稳] 第一稿已能从电机停位问题解释为什么要看整族根，但K0时“根还在/传函为零”需要用D+KN和约分后的T分开说。几何ζ=1只是实负根约定，不是三阶“过阻尼比”；ζ.5极点虽然衰减率相差7倍，仍不能把无零点二阶的16.3%超调当真实三阶值。请在默认例旁写出实际根与完整响应。

[钱锐] 旧Q5的连续候选区间已被K25反例否定，不该另报一个粗扫“精确区间”。题干应要求候选+验收，保留原交点推导但明显贴近似标签。PD同K图不可拿来宣布优胜；z10把稳定范围缩到12，PI原对象已有积分器，阶跃误差早已为零。普通虚轴点、重原点和负反馈符号也要分别核。

[苏绘] 旧生产静态页仍在out，实际打开核12H2/4实验5cell/默认K10；原交互只有一幅按区间伪造的响应，没有根平面。新稿保留旧图的教学目的，以根平面+完整响应替换，显式标有限窗口、当前根与重根重叠。

### 第三轮 — 调整完善

[陈控] 按反馈把D+KN作为定义主体，默认精确K224/27并列三根；候选区域和实际响应分开。保留Q5原近似代数推导，题干改“用四工况验收候选”，不再要求从粗估推出精确范围。Q7给z1/6/10解析条件与反例，PI按终值定理和输入类型写。

[孙助] 原四实验绘制/等ζ圆弧/选K/PD两cell全部保留目的，拆成六Notebook：规则复算、几何与性能、ζ候选、PD两cell、PI/广义、七题答案。答案全量复算，重复根用状态空间不套简单留数；可视图与原参数均保留。

[柯验] 为Q5采用简单稳定极点的独立留数误差e(t)加连续穿越根，并用E(T)=Σ|r|exp(Re(p)T)<.02认证尾部。复对每段振荡的极值与误差带穿越，不让时间采样漏窄小出带。只把四候选作为反例/观察，不声称完整K可行域。实际TS根/全501输出点另对独立状态空间expm，近分离、K0/48/60、K224/27都要覆盖。


[秦构-修后记录] 首次harness原始标签6/独立提取4不一致，实际是轻量扫描将数学0<K当JSX吞后续实验；局部改LaTeX lt/gt后六组均可提取，未放宽W08。初稿表格包装还把两段以绝对值开头的display误包成div，已从数学块移除；真实编译/公式DOM再核，不以正则行数当成功。

## Phase 3: 内容审校

### 教授团队（学术准确性）

[陈控] 规则在固定实系数、正增益、互素N/D和固定阶数下陈述；K0作为D+KN端点和T0通道分开，虚轴模态不当BIBO稳定。主例精确分离K16√3/9、候选筛选排除负K，边界48/正稳定范围；相角用atan2，入射向量与运动方向差180度。正确推导保留，没有用“重构”删除原算例。
[林矩] 几何阻尼是每个根的量，负实根按1计；五倍衰减率只是候选。题4精确上界43.776，题5原实部线交点448/27与880/27保留为候选，但完整响应K25不达标，不再签发假连续区间。零点重心符号修正，PD/PI稳定范围由Routh而非直觉得出；等阶退化/隐藏模态/离散单位圆条件明确。

### 工程团队（实践可行性）

[沉默-周联：theory未列出席，郑核代核工程边界]
[郑核] 开篇自动窗帘电机只提供可观察停位问题，G是教学归一化对象；1/s指位置积分不是转子惯性，滞后不冒称纯延迟。理想PD导数有高频噪声/可实现性问题，实际滤波需添极点重验；不据教学K推荐硬件参数。PI零误差限稳定闭环与指定多项式输入，原对象已有积分器。

### 验证团队（独立把关）

[柯验] verify-classic06.mjs转译实际lib/root-locus.ts，reference.py独立np.roots/scipy状态空间step互核127增益×501全响应点、601背景增益全部三根；根误差1.3463293258020315e-8，响应误差7.240505417449583e-11，特征残差3.481659405224491e-13。含重根附近±1e-8、K0/48两侧/60、精确默认，非法参数拒绝。六原始setup/七cell各新内核执行，Pyodide6passed/0code；没有拿抽取全等当独立数学证明。
[何疑] C逐条降级限定观察：同K的P/PD图没有独立调优，不作普遍优胜排名；给K1/10/40且z10失稳。近似区间的四点含通过与失败交错，完整三阶与无零点二阶默认指标不同，不能把尾部保证或有限扫描混成全域最优。无随机方法，不缺多种子。
[秦构] 原Explorer入口与注册保持，根和响应均调用同一真实模块，根图等比例方窗、时间与y范围固定、无animation/smooth伪形状。前端九项与生产截图按B逐项登记，未测项不预签。

### 体验与脉络（读者、历史与安全）

[沉默-陆阅：本课非math/history；中文体验及四档案由郑核代核]
[郑核] 开篇先读者熟悉的电机停位现象，问增益大为何晃，再接前课的稳定性和频域；没有“旋钮”等无对象标签。七规则/完整例/极点性能/设计/广义的原顺序保留，三长H2缩短与H1对齐；4旧ID别名，其余旧ID不改。正文历史1948前后已按Illinois原讲义核，不添加人物轶事；官方control0.10.2接口直链可访问。
[沉默-许史：无新历史争论，郑核核一条归属来源]
[沉默-范安：无安全系统设计，工程边界由郑核代核]

### 教学支持（教学质量）

[孙助] 七题全部有答案/原始代码：二阶/三阶规则、零点会合、阻尼范围、近似候选验收、双积分稳定化、零点反例。Q5和Q7改题原因在D，避免让学生证明假结论；Q5仍练原交点代数。符号约定区分分离增益Kd与PD导数系数K_d、零点坐标−z、G与KG、几何ζ与系统性能；术语门槛未降低。
[郑核] 四档案是同一日志的Phase1–4/A.1/B/C，D另核资产；catalog与自动OUTLINE唯一来源，旧tracker和全局checklist同步，fix039及陈控清单有归因；Python其他69课与27待办原字段/编号不变，不回写S04历史快照。

### 学生审校（可读性）

[李稳] 能把默认点复述为“这个K对应全部三个根，ζ=.5只描述那对根”；另一根虽快也要检查留数。知道4/σ给候选线、不是三阶调节时间公式；Q5表能解释为什么K增大时最后一次出带会跳到另一振荡峰。
[钱锐] 已核K0/分离/48/60端点合同，不把红点重合当少了一根，也不把K0的零输出当内部渐近稳定。能用z10/K40和PIz2反例否定“任何左半平面零点都更稳”和“加积分必有零误差”。

## Phase 4: 定稿与签发

[待定] 无 P0 阻断项。W06/W07/W08/W09与27个Python待办继续跟踪，不影响本课明确边界的交付；未宣称原生IAB网关已修。

[郑核-签发] 已核92行六列对账、C三项限定观察、B原九项与四补充、七题/答案和D来源去向。最终原始新内核/Pyodide、真TS独立参考、构建/生产DOM与图文、check均已通过；准予CLASSIC-06定稿。checklist前五格按实际完成勾选，合并格在真实no-ff后登记hash。

交付清单：本课MDX；原Explorer实际三阶根/响应与纯核心；catalog短标题/旧ID别名/自动OUTLINE；讨论日志/旧tracker/全局checklist/本期计划回执；数值与浏览器证据；fix039和既有陈控清单；Python支持政策。只交付这一课，合master，不发布gh-pages。

## 附录 A：柯验数值三方对账

### A.1 对账表

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | 默认精确增益K224/27 | 8.296296296296296 | 8.296296 | ✅ | NB2/3；归一化K，显示1e-6 |
| 2 | 默认第1个根 | [-4.666666666666666, 0] | 同值六位显示，红点/复根读数 | ✅ | NB2/3；s⁻¹；真TS对独立根，2e-7/显示1e-6 |
| 3 | 默认第2个根 | [-0.6666666666666667, -1.1547005383792517] | 同值六位显示，红点/复根读数 | ✅ | NB2/3；s⁻¹；真TS对独立根，2e-7/显示1e-6 |
| 4 | 默认第3个根 | [-0.6666666666666667, 1.1547005383792517] | 同值六位显示，红点/复根读数 | ✅ | NB2/3；s⁻¹；真TS对独立根，2e-7/显示1e-6 |
| 5 | 默认有限y(10s) | 1.0004126256112733 | 1.000413 | ✅ | NB2原始ct.step_response；零初值单位阶跃；10s/501显示点；误差2e-7，非极限 |
| 6 | 规则与主例复算：main derivative candidate s,K | main derivative candidate s,K: -3.1547005383792515 -3.0792014356780038 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 7 | 规则与主例复算：main derivative candidate s,K | main derivative candidate s,K: -0.8452994616207485 3.079201435678004 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 8 | 规则与主例复算：main K,poles | main K,poles: 0 [-4. -2.  0.] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 9 | 规则与主例复算：main K,poles | main K,poles: 3.0792014356780038 [-4.30940108 -0.84529948 -0.84529945] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 10 | 规则与主例复算：main K,poles | main K,poles: 8.296296296296296 [-4.66666667+0.j         -0.66666667+1.15470054j -0.66666667-1.15470054j] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 11 | 规则与主例复算：main K,poles | main K,poles: 10 [-4.76081783+0.j         -0.61959108+1.31018561j -0.61959108-1.31018561j] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 12 | 规则与主例复算：main K,poles | main K,poles: 48 [-6.00000000e+00+0.j          3.48679419e-16+2.82842712j | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 13 | 规则与主例复算：main K,poles | main K,poles: 60 [-6.25466446+0.j          0.12733223+3.09461262j  0.12733223-3.09461262j] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 14 | 规则与主例复算：main centroid/asymptote degrees | main centroid/asymptote degrees: -2.0 [60.0, 180.0, 300.0] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 15 | 规则与主例复算：angle test 135/45 and K | angle test 135/45 and K: 135.0 45.0 2.0 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 16 | 规则与主例复算：K48 factor | K48 factor: [ 1  6  8 48] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 17 | 几何指标与完整响应：default K,poles,y(0),y(10) | default K,poles,y(0),y(10): 8.296296296296296 [-4.66666667+0.j         -0.66666667+1.15470054j -0.66666667-1.15470054j] 0.0 1.000412625611278 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 18 | 几何指标与完整响应：default full settling/MP%,tailT,tailBound,crossings | default full settling/MP%,tailT,tailBound,crossings: (6.243814510346707, 15.537305251184547, 16.0, 3.0168980281582023e-05, 5) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 19 | 几何指标与完整响应：5% second-order zeta,angle degrees | 5% second-order zeta,angle degrees: 0.6901067305598217 46.36144189013903 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 20 | 几何指标与完整响应：exact 45degree zeta | exact 45degree zeta: 0.7071067811865475 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 21 | 选择阻尼候选：zeta .5 point,K,omega_n | zeta .5 point,K,omega_n: (-0.6666666666666666+1.1547005383792515j) (8.296296296296298-4.440892098500626e-16j) 1.3333333333333333 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 22 | 选择阻尼候选：vector magnitudes | vector magnitudes: 1.3333333333333333 1.763834207376394 3.527668414752788 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 23 | 选择阻尼候选：vector angles | vector angles: 120.00000000000001 40.893394649130904 19.106605350869096 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 24 | 选择阻尼候选：K,poles,individual geometric zeta | K,poles,individual geometric zeta: 1 [-4.11490754 -1.74589831 -0.13919415] [np.float64(1.0), np.float64(1.0), np.float64(1.0)] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 25 | 选择阻尼候选：K,poles,individual geometric zeta | K,poles,individual geometric zeta: 3 [-4.30277564 -1.         -0.69722436] [np.float64(1.0), np.float64(1.0), np.float64(1.0)] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 26 | 选择阻尼候选：K,poles,individual geometric zeta | K,poles,individual geometric zeta: 3.0792014356780038 [-4.30940108 -0.84529948 -0.84529945] [np.float64(1.0), np.float64(1.0), np.float64(1.0)] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 27 | 选择阻尼候选：K,poles,individual geometric zeta | K,poles,individual geometric zeta: 8.296296296296296 [-4.66666667+0.j         -0.66666667+1.15470054j -0.66666667-1.15470054j] [np.float64(1.0), np.float64(0.49999999999999983), np.float64(0.49999999999999983)] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 28 | 选择阻尼候选：K,poles,individual geometric zeta | K,poles,individual geometric zeta: 10 [-4.76081783+0.j         -0.61959108+1.31018561j -0.61959108-1.31018561j] [np.float64(1.0), np.float64(0.42750966831181647), np.float64(0.42750966831181647)] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 29 | 选择阻尼候选：K,poles,individual geometric zeta | K,poles,individual geometric zeta: 47 [-5.97713036+0.j         -0.01143482+2.80413523j -0.01143482-2.80413523j] [np.float64(1.0), np.float64(0.004077808451024173), np.float64(0.004077808451024173)] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 30 | 选择阻尼候选：K,poles,individual geometric zeta | K,poles,individual geometric zeta: 48 [-6.00000000e+00+0.j          3.48679419e-16+2.82842712j | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 31 | 选择阻尼候选：default separated decay ratio | default separated decay ratio: 7.000000000000001 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 32 | 选择阻尼候选：Two-pole formula MP%,not exact third-order | Two-pole formula MP%,not exact third-order: 16.303353482158048 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 33 | 选择阻尼候选：default full third-order | default full third-order: (6.243814510346707, 15.537305251184547, 16.0, 3.0168980281582023e-05, 5) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 34 | 零点位置与PD观察：zero z,centroid,K upper | zero z,centroid,K upper: 1 -2.5 inf | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 35 | 零点位置与PD观察：zero z,centroid,K upper | zero z,centroid,K upper: 6 0.0 inf | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 36 | 零点位置与PD观察：zero z,centroid,K upper | zero z,centroid,K upper: 10 2.0 12.0 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 37 | 零点位置与PD观察：same K,z,poles,ts/MP/tail | same K,z,poles,ts/MP/tail: 1 None [-4.11490754 -1.74589831 -0.13919415] (28.9489141258781, 0.0, 64.0, 0.00015210659482085433, 1) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 38 | 零点位置与PD观察：same K,z,poles,ts/MP/tail | same K,z,poles,ts/MP/tail: 1 1 [-3.53208889 -2.34729636 -0.12061476] (32.093813234637004, 0.0, 64.0, 0.0004262945517913089, 1) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 39 | 零点位置与PD观察：same K,z,poles,ts/MP/tail | same K,z,poles,ts/MP/tail: 1 10 [-4.4920333 +0.j        -0.75398335+1.2875063j -0.75398335-1.2875063j] (5.461690856793106, 15.045394059377607, 8.0, 0.0029512197381565907, 5) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 40 | 零点位置与PD观察：same K,z,poles,ts/MP/tail | same K,z,poles,ts/MP/tail: 10 None [-4.76081783+0.j         -0.61959108+1.31018561j -0.61959108-1.31018561j] (5.997133265192901, 21.46288275087979, 16.0, 6.002114178235069e-05, 5) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 41 | 零点位置与PD观察：same K,z,poles,ts/MP/tail | same K,z,poles,ts/MP/tail: 10 1 [-2.65013549+2.69592813j -2.65013549-2.69592813j -0.69972902+0.j        ] (4.235799176178168, 0.0, 8.0, 0.0014363010324819172, 1) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 42 | 零点位置与PD观察：same K,z,poles,ts/MP/tail | same K,z,poles,ts/MP/tail: 10 10 [-5.84669587+0.j         -0.07665206+4.13494883j -0.07665206-4.13494883j] (49.44868283172106, 83.06329323239449, 128.0, 4.85474849249147e-05, 131) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 43 | 零点位置与PD观察：same K,z,poles,ts/MP/tail | same K,z,poles,ts/MP/tail: 40 None [-5.80832172+0.j         -0.09583914+2.62249609j -0.09583914-2.62249609j] (39.78708796399461, 81.09076663286551, 64.0, 0.0020051784818538093, 67) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 44 | 零点位置与PD观察：same K,z,poles,ts/MP/tail | same K,z,poles,ts/MP/tail: 40 1 [-2.53823094+6.07199124j -2.53823094-6.07199124j -0.92353811+0.j        ] (1.3796248225929548, 19.457949722404603, 4.0, 0.0021251178850081372, 5) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 45 | 零点位置与PD观察：same K,z,poles,ts/MP/tail | same K,z,poles,ts/MP/tail: 40 10 [ 0.56636662+7.4671757j  0.56636662-7.4671757j -7.13273324+0.j       ] None | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 46 | 零点位置与PD观察：Same-K illustration, not independently tuned ranking. z1 at  | Same-K illustration, not independently tuned ranking. z1 at K1 is slower; z10 at K40 is unstable. Ideal derivative needs filtering in hardware. | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 47 | PI与广义轨迹：PI z,positive K upper | PI z,positive K upper: 0.1 44.4 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 48 | PI与广义轨迹：PI z,K,poles | PI z,K,poles: 0.1 1 [-4.11232119+0.j         -1.76077569+0.j         -0.06345156+0.09891605j | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 49 | PI与广义轨迹：PI z,K,poles | PI z,K,poles: 0.1 10 [-4.74960293+0.j         -0.57085096+1.26930774j -0.57085096-1.26930774j | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 50 | PI与广义轨迹：PI z,K,poles | PI z,K,poles: 0.1 40 [-5.79074945+0.j         -0.05366453+2.60277995j -0.05366453-2.60277995j | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 51 | PI与广义轨迹：PI z,positive K upper | PI z,positive K upper: 1 12 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 52 | PI与广义轨迹：PI z,K,poles | PI z,K,poles: 1 1 [-4.08846952+0.j         -1.88240244+0.j         -0.01456402+0.36017089j | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 53 | PI与广义轨迹：PI z,K,poles | PI z,K,poles: 1 10 [-4.64030909+0.j         -1.31776546+0.j         -0.02096272+1.27864248j | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 54 | PI与广义轨迹：PI z,K,poles | PI z,K,poles: 1 40 [-5.61778481+0.j          0.34803146+2.54602058j  0.34803146-2.54602058j | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 55 | PI与广义轨迹：PI z,positive K upper | PI z,positive K upper: 2 -24 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 56 | PI与广义轨迹：PI z,K,poles | PI z,K,poles: 2 1 [-4.06064703+0.j        -2.        +0.j         0.03032351+0.4953248j | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 57 | PI与广义轨迹：PI z,K,poles | PI z,K,poles: 2 10 [-4.49493967+0.j         -2.        +0.j          0.24746984+1.47087819j | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 58 | PI与广义轨迹：PI z,K,poles | PI z,K,poles: 2 40 [-5.3812949 +0.j          0.69064745+2.63745356j  0.69064745-2.63745356j | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 59 | PI与广义轨迹：For stable PI, original plant type1 becomes type2 | For stable PI, original plant type1 becomes type2: ramp error0; original P already has step error0. | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 60 | PI与广义轨迹：parameter s^2+alpha*s+1 roots | parameter s^2+alpha*s+1 roots: 0 [-0.+1.j  0.-1.j] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 61 | PI与广义轨迹：parameter s^2+alpha*s+1 roots | parameter s^2+alpha*s+1 roots: 1 [-0.5+0.8660254j -0.5-0.8660254j] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 62 | PI与广义轨迹：parameter s^2+alpha*s+1 roots | parameter s^2+alpha*s+1 roots: 4 [-3.73205081 -0.26794919] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 63 | PI与广义轨迹：positive feedback 1/[s(s+2)],K,poles | positive feedback 1/[s(s+2)],K,poles: 0 [-2.  0.] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 64 | PI与广义轨迹：positive feedback 1/[s(s+2)],K,poles | positive feedback 1/[s(s+2)],K,poles: 1 [-2.41421356  0.41421356] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 65 | PI与广义轨迹：positive feedback 1/[s(s+2)],K,poles | positive feedback 1/[s(s+2)],K,poles: 4 [-3.23606798  1.23606798] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 66 | PI与广义轨迹：At K0, characteristic D remains but the reduced input-output | At K0, characteristic D remains but the reduced input-output transfer is zero. No hidden unstable cancellation may be discarded. | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 67 | 七题答案复算：Q1 centroid,breakK,all positive K stable | Q1 centroid,breakK,all positive K stable: -3.0 9 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 68 | 七题答案复算：Q1 K,poles 1 [-5.82842712 -0.17157288] | Q1 K,poles 1 [-5.82842712 -0.17157288] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 69 | 七题答案复算：Q1 K,poles 9 [-3.+3.7252903e-08j -3.-3.7252903e-08j] | Q1 K,poles 9 [-3.+3.7252903e-08j -3.-3.7252903e-08j] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 70 | 七题答案复算：Q1 K,poles 20 [-3.+3.31662479j -3.-3.31662479j] | Q1 K,poles 20 [-3.+3.31662479j -3.-3.31662479j] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 71 | 七题答案复算：Q2 candidates s,K | Q2 candidates s,K: -4.154700538379251 -3.079201435678004 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 72 | 七题答案复算：Q2 candidates s,K | Q2 candidates s,K: -1.845299461620749 3.079201435678004 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 73 | 七题答案复算：Q2 centroid,wcrit,Kcrit | Q2 centroid,wcrit,Kcrit: -3 4.795831523312719 192 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 74 | 七题答案复算：Q3 s,K | Q3 s,K: -0.5857864376269049 0.1715728752538099 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 75 | 七题答案复算：Q3 s,K | Q3 s,K: -3.414213562373095 5.82842712474619 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 76 | 七题答案复算：Q3 centroid | Q3 centroid: 1 complex arc circle center/radius: -2 1.4142135623730951 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 77 | 七题答案复算：Q4 break s,K | Q4 break s,K: -1.5694991259569395 16.900894327379042 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 78 | 七题答案复算：Q4 zeta .5 K | Q4 zeta .5 K: (43.775999999999996+3.552713678800501e-15j) angles: 120.00000000000001 36.586775553629465 23.413224446370535 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 79 | 七题答案复算：Q4 magnitudes | Q4 magnitudes: 2.4 3.4871191548325386 5.230678732248808 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 80 | 七题答案复算：Q4 crossing K,w | Q4 crossing K,w: 240 4.898979485566356 third pole: -7.6 decay ratio: 6.333333333333333 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 81 | 七题答案复算：Q5 candidate K bounds | Q5 candidate K bounds: 16.59259259259259 32.592592592592595 boundary zeta: 0.6324555320336759 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 82 | 七题答案复算：Q5 K,actual ts/MP/tail | Q5 K,actual ts/MP/tail: 16.59259259259259 (3.9964139692462184, 0.0, 8.0, 0.00011060620148048368, 1) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 83 | 七题答案复算：Q5 K,actual ts/MP/tail | Q5 K,actual ts/MP/tail: 20 (2.90846929539933, 0.17592119185260688, 8.0, 1.5302864276968844e-05, 1) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 84 | 七题答案复算：Q5 K,actual ts/MP/tail | Q5 K,actual ts/MP/tail: 25 (3.058923818783033, 2.2158098969458226, 8.0, 1.9269125934680583e-05, 3) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 85 | 七题答案复算：Q5 K,actual ts/MP/tail | Q5 K,actual ts/MP/tail: 32.592592592592595 (2.9879512959612464, 7.30124196423122, 8.0, 3.548811730519962e-05, 3) | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 86 | 七题答案复算：Q6 K,original poles | Q6 K,original poles: 1 [-4.06064703+0.j         0.03032351+0.4953248j  0.03032351-0.4953248j] PDzero2 poles: [-3.87512979+0.j       -0.0624351 +0.715691j -0.0624351 -0.715691j] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 87 | 七题答案复算：Q6 K,original poles | Q6 K,original poles: 10 [-4.49493967+0.j          0.24746984+1.47087819j  0.24746984-1.47087819j] PDzero2 poles: [-2.92069642+0.j         -0.53965179+2.56055811j -0.53965179-2.56055811j] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 88 | 七题答案复算：Q6 K,original poles | Q6 K,original poles: 40 [-5.3812949 +0.j          0.69064745+2.63745356j  0.69064745-2.63745356j] PDzero2 poles: [-0.89037069+5.93761858j -0.89037069-5.93761858j -2.21925863+0.j        ] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 89 | 七题答案复算：Q6 centroid and departure degrees | Q6 centroid and departure degrees: -1.3333333333333333 [-90, 90] | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 90 | 七题答案复算：Q7 z,centroid,strict upper | Q7 z,centroid,strict upper: 1 -2.5 inf | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 91 | 七题答案复算：Q7 z,centroid,strict upper | Q7 z,centroid,strict upper: 6 0.0 inf | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |
| 92 | 七题答案复算：Q7 z,centroid,strict upper | Q7 z,centroid,strict upper: 10 2.0 12.0 | 不适用：静态计算或非默认参数；默认与实际TS路线另列 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；各参数/单位随行；根2e-7/连续ts1e-7/显示末位舍入，近似式不当精确值 |

### A.2 实测数据总表（原始证据）

- minimal.py/minimal.log：原稿反例与精确候选初算；其中MPsample明确采样峰，不当精确峰。正文最终数值采用原始Notebook的连续事件/尾部核算，非取旧缓存。
- reference.py/verify-classic06.mjs、reconciliation.json/reconciliation-final.log：127×501全响应点/601组全根、非法参数与重根附近；六原始setup/七cell及合同；默认K、3根与y10三方同值。
- Q5 settling函数对简单稳定根独立部分分式，连续求误差带穿越，半步复核事件数/根；T处Σabs(r)exp(Re(p)T)<.005，T后单调包络不再出带。临界/不稳定返回不可用，重复根不硬除。只报告明确四K点，不声称全域可行域。
- notebooks.json/notebooks-final.log：严格EXECUTED6Notebook/7cell，FAIL0/SKIPPED0；extracted.json/assemble-final.log：13block反向逐字全等。
- browser-python.json：最终hash 094e2e8f0314526e5b7f4ad2ee593d6204fc17cf3ad518cdc487809bc39ea29a，六passed；政策同hash，69其它课不变，27待办保留原字段/ID与上课解决回执。
- headings.json/生产browser-results.json及截图：共用渲染管线与实际DOM、旧48ID、70display/140围栏；前端实际结果在B。

## 附录 B：秦构前端硬门槛实际输出

| # | 原始门槛（原编号） | 实际命令/动作 | 实际输出 | 通过? |
|---|---|---|---|---|
| 1 | npm run build 通过 | npm run build；npm run build:pages；npx tsc --noEmit | 均exit0；build-final.log/pages-final.log/types-final.log；205课/9旧路由/317408055字节 | ✅ |
| 2 | curl 课程页 → HTTP 200 | npm run verify -- classic/root-locus | exit0；HTTP200；page-final.log | ✅ |
| 3 | 页面 H2 数 == catalog.ts 该课 subsections 数 | 单课verify；check-browser.mjs | exit0；12H2顺序/ID/目录；48旧ID含4别名全部可达 | ✅ |
| 4 | katex-error 元素数 == 0 | 同上 | exit0；katex-error0；70display居中/auto | ✅ |
| 5 | MDX 中每个 JupyterNotebook 的 cell 字符串与验证脚本中的 cell 逐字全等 | nb-cells verify --require-kernel；extract/assemble；check-source.mjs | exit0；EXECUTED6Notebook/7cell，FAIL0/SKIPPED0；13block反向全等；源hash一致 | ✅ |
| 6 | 新增组件已在 `lib/wiki-components.ts` 登记（**E2 起单一来源，fix-015 已根治**；本项在 B6 九项里排第 6、在 `verify-lesson.mjs` 里排第 4，两套编号不通用） | npm run check；单课verify | exit0；65组件单一注册；既有RootLocusKExplorer注册不改 | ✅ |
| 7 | 新增组件已在 MDX 中用 <ComponentName /> 显式引用 | rg Explorer 本课MDX；check-scope.mjs | 原Explorer各1显式引用，只本课调用，未新增孤儿 | ✅ |
| 8 | 每个交互组件：固定坐标轴 ✅ / animation: false ✅ / useECharts 收到 Option 对象 ✅ / 默认参数复现正文手算例 ✅ | verify-classic06.mjs；check-browser.mjs；实际截图 | exit0；真TS对独立根/scipy状态空间；默认/端点/重根/虚轴/恢复；两EChartsOption/useMemo/useECharts，固定轴/animation:false/inline；390px无溢出，根图方窗等比例 | ✅ |
| 9 | notebook 中无 ipywidgets / interact / FloatSlider / IntSlider 引用 | nb-cells严格检查 | exit0；无ipywidgets/interact/Slider；全部六实验两运行路线成功 | ✅ |

补充① 源一致性：check-source.mjs，最终hash094e2e8f0314526e5b7f4ad2ee593d6204fc17cf3ad518cdc487809bc39ea29a，140独占围栏/70display、6原始/提取/内核/Pyodide/DOM实验与7cell分别核；source-check.log退出0。
补充② 范围：check-scope.mjs，69其它课记录/政策与27待办原字段/编号不变，保留前课PY001–003解决回执；W06–09仍开；scope-check.log退出0。
补充③ 浏览器：browser-results.json/browser-check.log；实际查看opening.png/narrow.png/boundary-response.png，默认真根与曲线/坐标同义、重根重合、K0零输出、K48持续振荡不标稳态、K60RHP；答案原始Pyodide完成，console无warn/error。
补充④ 质量：14回归通过；术语PASS3/WARN1/FAIL0、数学围栏无坏项；check PASS21/WARN2/FAIL0，学期清单通过；fix039/角色既有检查项同步。遗留W项未借本课关闭。


## 附录 C：何疑红队放行记录

| # | 对比断言（原句 + file:line） | 基线整定与扫描范围（a） | 组数与落败场景（b） | 正文的边界与代价（c） | 放行? |
|---|---|---|---|---|---|
| 1 | 若改为零点−z，条件变为$48+(6-z)K\gt 0$。z1/6/10分别给重心−2.5/0/+2；z10只在$0\lt K\lt 12$稳定，比原来的0…48还窄。下面同K1/10/40的响应比较只展示固定候选的变化，不是经过独立整定的控制器优劣排名：z1在K1反而收敛更慢，z10在K40失稳。PD理想导数还会放大高频噪声，实际滤波引入的额外极点须重新分析。 content/classic/root-locus.mdx:613 | 同对象1/[s(s+2)(s+4)]，同K固定候选，无独立整定；仅限定观察不作排名 | z1/6/10；K1/10/40，z1/K1更慢，z10/K40失稳 | 限定观察/反例；理想PD噪声/滤波代价；不能声称任何零点都更快更稳 | 放行 |
| 2 | 不能将上述候选框签发为真实可行区间。完整三阶复算如下： content/classic/root-locus.mdx:1121 | 同题4三阶、零初值单位阶跃，2%末次穿越，对比4/σ几何候选 | K448/27/20/25/880/27：3.996414/2.908469/3.058924/2.987951s，含两失败 | 限定观察/反例；只否定近似保证，不把四点或扫描当精确全域 | 放行 |
| 3 | 对应的自然频率 $\omega_n = &#124;s&#124; = 4/3 \approx 1.33$ rad/s。第三个极点 $p_3 = -6 - 2(-2/3) = -14/3 \approx -4.67$，实部衰减率比为7，只构成主导近似候选。完整三阶仍有第三模态；不能把二阶超调16.303353%直接当本系统精确结果。 content/classic/root-locus.mdx:523 | 同主例K224/27，几何ζ.5；完整三阶对无零点二阶近似 | 另K1/10/40数据在NB4；含无超调/有超调/慢模态；默认真实三阶MP与16.303353%不同 | 限定观察/反例；五倍衰减率仅候选，留数/零点/初值/评价窗口决定近似误差 | 放行 |

## 附录 D：原稿审计、保留与变更传播

| 原位置/资产 | 审计证据 | 保留/纠错/重写/迁移/拆分/删除 | 目标位置/去向 | 验证方式 |
|---|---|---|---|---|
| 原开篇/单位反馈/定义 | 旧静态页及baseline-source.json，K0混同 | 保留问题定位，具体电机停位引入；补D+KN与K0/隐藏约消 | 开篇/基本概念 | 原式、K0反例/DOM |
| 原幅角/atan反正切例 | 象限用商反正切错误 | 保留几何解释，改atan2 | 幅角条件/NB1 | 135/45/模K2 |
| 原七规则 | 分离/虚轴候选条件省略、入射方向模糊 | 保留全部，补正K/实轴/重数/两侧 | 绘制规则/NB1 | 独立根/解析筛选 |
| 原三阶完整示例 | 原参数/正确多项式推导 | 保留原0/−2/−4及推导；精确Kd替舍入区间 | 完整示例/NB1 | Kd16√3/9、48因式/根 |
| 原Notebook1绘根轨迹 | root_locus自动图/手填近似点 | 保留目的，改root_locus_map显式增益/实际点 | NB1 | 官方0.10.2、新内核/Pyodide |
| 原Notebook2几何等ζ/ωn | 原半圆角度画到右半平面 | 保留等ζ/ωn目的，半圆改左半面 | NB2 | 图/连续指标/单位 |
| 原Notebook3选ζK | 原图只有标记未数值验收 | 保留精确ζ.5代数与候选K | NB3/Explorer | 实际根与完整响应 |
| 原Notebook4两cell PD | 单K图诱导优胜 | 两cell目的均保留；扩K1/10/40、z1/6/10 | NB4两cell | 含更慢/失稳，C限定观察 |
| 原Explorer | 分段拼假曲线，无实际求根 | 完整重写实现，原入口不变 | 根平面+完整三阶响应 | 真TS对127×501与601背景根 |
| 原设计/主导/PD/PI | 近似当保证、重心符号/零误差推广 | 保留设计流程、修模型边界与反例 | 极点性能/零极点设计/NB2–5 | 连续事件/尾部、Routh |
| 原广义/正反馈/深入讨论 | 非仿射/离散条件缺失，Bode普遍对应 | 保留主题，补适用条件 | 广义/NB5、深入讨论 | 参数二阶/正反馈直接根 |
| 原七题与答案 | Q4省实根段，Q5/Q7假保证 | 七主题全保留；Q5改候选+完整验收；Q7改零点位置反例，原错误证明移除并说明 | 习题/答案/NB6 | 七题配对，所有数值实跑 |
| H1/三长H2、48旧ID | baseline-source/rendered pipeline | 根轨迹H1与catalog一致；三短H2+4别名 | catalog/legacy-anchors/自动OUTLINE | 共用管线+真实DOM |
| 其它调用/未迁材料 | gitgrep组件仅本课、无独立旧日志 | 无拆课/外移，注册不变、无未迁片段 | 本课内完整交付 | check-scope；不生产下一课 |

W06/W07/W08/W09仍为待办。直接内核和生产Pyodide通过不代替原生IAB网关UI已修证据；本轮不发布gh-pages。

补充修后记录：check-generated.log发现全局轻量扫描把Python ts<T当组件T；改等价T>ts后六原始实验和严格内核/Pyodide全量重跑，最终源hash如A.2。首次browser-check读取到hydration前空href列表，最终在图表已加载后重取目录链接与canvas，再作独立断言；不降低锚点要求。
