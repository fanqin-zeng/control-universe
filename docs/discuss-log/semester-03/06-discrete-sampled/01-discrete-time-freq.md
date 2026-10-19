# DISCRETE-01 采样与量化

课程ID DISCRETE-01；discrete-sampled/discrete-time-freq；2026-10-19；起点master 4185db7。已有draft正文按wiki-lesson-refactor，不沿用旧验收当实测。source-before.mdx完整快照，原3Notebook4cell。用户要求本机端口隔离：dev8180、Pages8181、kernel8981；四个临时配置文件只在工作区，严禁提交推送。用户批阅不动，本对话只交付本课。

课程路径：discrete-sampled/discrete-time-freq
课程标题：采样与量化
学期：semester-03
日期：2026-10-19
课型：theory
工作方式：重构
阶段：Phase 1–4

## 出席与沉默表

| 角色 | 状态 | 主责 |
|---|---|---|
| 郑核、苏绘、孙助、柯验 | 出席 | 主持/视觉/习题/独立数值 |
| 周联、林矩 | 出席 | 工程与理论 |
| 钱锐、李稳 | 出席 | 学生反馈 |
| 何疑、秦构 | 出席 | 红队与前端验收 |
| 何仿 | 缺席 | 合同由秦构代，柯验独立复核 |
| 陆阅 | 缺席 | 郑核代核首读和档案 |
| 轮值专家 | 缺席 | 无行业专门结论 |

## 出席与依据

10人：郑核、苏绘、孙助、柯验（核心）；周联（discrete-sampled工程主责）、林矩（理论）、钱锐、李稳、何疑（theory矩阵），秦构（前端执行）。角色为结构化审查视角，不冒充外部独立专家。[沉默-何仿：未上场，实验合同由秦构产出，柯验用独立数学/SciPy复核。][沉默-陆阅：郑核兼核首读与档案。][沉默-轮值专家：本课非case/frontier。]

## Phase 1：内容规划

[周联] 入口是数字温控器每隔一段时间读一次传感器、显示有限小数、输出保持到下次更新。从时间取点与幅度分格两件不同事出发。目标：解释带限与混叠，计算相位含义的基带等价；区分ZOH原始核及归一化响应；正确界定ADC误差和SNR；把采样/滤波/量化列成预算，而非套固定倍数。保留原九H2和19个H3、四题四答，所有旧标题ID复核；原4实验纠错保留并增加反馈量化与设计/答案核验。
[柯验] 原始严格内核在8981实跑：3Notebook4cell，NB3 cell2抛Improper transfer function。原文错误还包括95Hz正弦在fs100处与5Hz反相，却画成同相并说相加为10Hz；把2fmax叫Nyquist频率；ZOH的Ts常数当幅度衰减，wn*sqrt(1-2zeta²)错叫带宽；离线输出舍入冒充反馈极限环；fc400二阶滤波在500Hz不可能40dB；编码器脉冲却套ADC位数；量化步长不等于闭环稳态波动。这些先修再谈排版。
[林矩] 保留采样谱复制的1/Ts因子，明确基带严格带限条件、fs/2与2fmax术语、临界正弦反例。归一化ZOH的sinc与原脉冲核Ts分开；相位只在sinc正的第一瓣线性，不能把旧连续交越处损失直接叫离散PM。量化器用有限2^N级含饱和和端点约定，误差界只对不过载输入；SNR公式增加满量程正弦/均匀误差假设和20log幅比项。
[李稳] 希望第一幅图是传感器到控制器再到保持输出的真实图，而不是一上来脉冲串。负的混叠频率必须用相位反号解释，别让我以为出现负的振动次数。
[苏绘] 用真正SVG替换两段ASCII图；React实验台同时拖采样率与位数，连续曲线、真实采样点和保持量化输出同图。默认5Hz+.5sin95Hz、fs100、8bit、范围[-2,2]、窗口.4s；曲线在数学上是.5sin5而非10Hz。ZOH、量化反馈、滤波设计和数字化用Notebook，避免一页堆多个大型组件。
[秦构] 数值合同：采样率50–250Hz步10，位数3–12，默认100/8，N+1样点含零和末时刻.4；各轨迹记录实际t。独立核sin恒等式与有限量化器，量化阈值附近允许相邻舍入码但须满足q/2界，非阈值点逐码相等。闭环量化用一阶精确ZOH离散模型和明确PI更新顺序，比较无量化/8/12/16bit，不能单凭位数推出单调稳态波动。原综合例改可实现滤波D、离散t=kTs，并核真实极点；不更换增益后隐称原PID。
[何疑] 原4工况与失败需要保留为可检验对照：fs190临界、250无混叠、100混叠；离线舍入和闭环不同对象不排名；滤波fc400失败和满足衰减的fc50例都保留；过采样只有白噪声/固定带宽假设才+1bit，不给SigmaDelta包票。
[孙助] 原四题保留，修正滤波截止不等带限、测量量化误差不等闭环波动、带宽和交越实际求根；每个答案数字对应核验cell。后续去向是离散时间系统/离散化/采样周期与嵌入式实现，本课不顺带交付它们。
[共识] 九H2保持：采样过程、混叠、采样保持器、量化、设计实例、深入讨论、小结、习题、答案；H3保持旧名以免丢锚点，开篇用温控器。6Notebook7cell、一个双参数Explorer、两SVG；不执行旧semester02待拆分计划，学期3明确量化仍留本课，嵌入式课以后引用/深入。

## 恢复检查点（2026-10-19）

[郑核] 本轮从master5bff9df继续未交付草稿，不把早期Phase1和基线记录冒充已验收。原文快照/原始失败仍保留，06–10生产不改变01未完成事实。本轮用户明确要求补齐并发布；四个本地端口及用户批阅不提交。共同SKILL/角色/固定日志结构继续适用。

## Phase 2: 内容生成

### 第一轮 — 概念讲解

[周联] 承接既有草稿六Notebook七cell；先实跑minimal.py得到带宽12.720196、fc400在500Hz衰减5.367359、fc50衰减40.000434、测速12位步长.153398、题4交越2.864064/带宽4.477537，以及五采样周期极点模含50ms的1.177455失败，初步数字与草稿一致。此脚本仅最小例，正式证据必须执行MDX原始代码及独立参考。

[苏绘] 原九H2/19H3、四题与原三实验主题保留，双参数Explorer补上混叠相位/有限ADC/保持读数，独立SVG替代两幅字符图；图例增加明确文字色和not-prose，固定坐标、动画关闭。

### 第二轮 — 学生反馈

[李稳] 中点量化为什么零输入会显示半步？应解释这是选定编码模型而非所有硬件的事实。二阶带宽旁突然出现zeta，需要在同段给本例值。

[钱锐] 50ms失败工况必须保留，不能只拿更快采样作成功对比。离线舍入不能算量化反馈极限环；真实反馈即使窗口不平也不能断言渐近周期。q/2只核不过载输入，量化边界的浮点零附近可能选择相邻码，要区分算法错误与阈值舍入。

### 第三轮 — 调整完善

[林矩] 在ADC定义后解释中点模型零无输出电平/输入零读q/2；二阶例补zeta.5。连续理想PID在题4只作频响计算，设计实验则加100rad/s极点并明确新控制器，不声称同一理想导数离散化成功。正弦95Hz在100Hz采样反相5Hz，合成仍5Hz而非10Hz，190Hz临界采样仍保留失败。

[孙助] 四题所有子问保留且给关键计算；精度问明确测量预算而非闭环波动。滤波截止不能作硬带限、保持相位估算不能作最终PM，明确交越与闭环带宽不同。

[柯验] 独立参考不调用control：高精度解析正弦/有限ADC，离线闭环用三根留数，反馈用精确分段状态更新，滤波用幅相解析式，PID用解析ZOH对象+代数Tustin控制器闭环四阶根/差分式。实际TS调用而非复制算法，量化临界点允许相邻码但严格不过载半步界。所有保留数值和曲线也需重测。

## Phase 3：内容审校

### 教授审校
[林矩] 逐项复核严格基带条件与临界正弦；谱复制1/Ts、归一化保持核、有限ADC端点和不过载误差条件正确。二阶对象的自然频率/共振/带宽分开；题4理想微分仅算连续频响，实验4明确100rad/s滤波新基线。九H2及十九H3的旧编译ID全部保留，见headings.json。

### 工程审校
[周联] 模拟测速量程与编码器计数分开；滤波器通带、阻带和相位分别核算。0.25rad/s是量化预算而非总精度。PI先算u再更新I，0..20s与18..20s指标窗口明示；无执行器饱和，不外推真实硬件表现。

### 验证审校
[柯验] 实际TS210配置对60位正弦解析式和有限ADC，误差1.38e-14；真实Notebook11043量对解析留数/高精度闭环递推、Tustin代数四阶多项式与频响，最大绝对差5.38e-9。一般量容差1e-9；PID短周期传递函数消去相近系数造成浮点误差，用1e-8+1e-10乘参考绝对值，远小于正文六位展示精度。量化阈值允许相邻码但半步界不放宽；非阈值逐码核。严格内核六Notebook七cell，SKIPPED0，错误0。原生/Pyodide与两页面文本数值相符。

[秦构] 普通build、Pages build、verify九项、33自动测试、check PASS21/WARN2/FAIL0、fix索引、math/术语与Python策略通过。桌面与Chrome375px目检，控件上下界与恢复默认、图例、真实DOM目录和图片路径通过。fill改变range的DOM值未触发React状态，所以实际用Home/End键复验，读数8/4096级正确；不把无效fill当通过。

[何疑] 采样三工况含190Hz临界失败；PID五周期不重调参数，保留50ms失稳。位数四组含无量化基线，离线与反馈没有伪装成同一对象的优劣比较；固定窗口不冒充极限环证明。滤波两截止仅核同阶幅相，不宣称更低截止必然更好。

### 体验与脉络审校
[郑核] 代陆阅按首读顺序核温控器例子、采样与量化的两件事、负频率相位含义、零输入的中点编码。公开教材与API来源已打开核对：ADI MT-002/MT-001、python-control0.10.2 sample_system（2026-10-19）；原文未复制长段。四份教学档案核正文/习题/数值证据/组件分配，与现有课程术语和符号保持一致，不扩展润色流程。

### 教学支持审校
[孙助] 四题全部子问有答，94Hz和8.726646ms为严格界，不能说存在最小/最大可取值；10/14位预算重新验算。0.0244140625的末位显示舍入差异在容差内。旧量化主题保留本课，后续实现课只展开硬件，不因计划中的迁移备注先删基础。

### 学生审校
[李稳] 我能把采样说成“隔多久读一次”、量化说成“能记多少档”；提高位数补不了漏掉的频率。95Hz折成负5Hz说明相位反号，两个5Hz相加不能变10Hz。[钱锐] 读数误差界不是输出波动界；50ms失败和有限窗口条件已在正文旁保留。

## Phase 4：定稿签发

[待定] 无影响本课正确性的未决项；W14/W15等既有全站事项继续登记，不随本课关闭。用户批阅和四处本地端口排除提交，历史01备份stash保留。

[郑核-签发] 根据附录A–D和acceptance.md实际证据，DISCRETE-01重构Phase1–4完成，准予进入master；用户本轮已明确授权随后发布Pages，公网结果另记部署回执，不提前填发布成功。

交付清单：九H2/十九H3、四题四答、六Notebook七cell、一Explorer、两SVG、独立验证、fix-069、catalog/tracker/plan/checklist及润色生产状态。真实master提交后再补合入列与hash。

## 附录 A：柯验对账

### A.1 三方对账表

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | fs100，95Hz折回−5Hz，合成0.5sin5Hz | 实验1：−5Hz、幅值0.5；250无混叠、190高频样值零 | −5.0Hz；幅值0.5；临界按钮与提高采样率实测 | ✅ | 0..0.4s；210配置实际TS，sin误差<1e−12 |
| 2 | ADC默认256级，q=.015625，半步.0078125 | 实验1/3打印；饱和输出1.9921875，过载误差1.0078125 | 256/q=.015625/界=.007813；3/12位边界8/4096级 | ✅ | V=2；非过载；展示6位，阈值相邻码仍核误差界 |
| 3 | ZOH Nyquist幅2/π，−3.922dB；二阶带宽12.720196 | 实验2：.636620/−3.922398/12.720196，四周期相位 | 不适用：组件只演示时域采样量化 | ✅ | 解析sinc与带宽方程；1e−9 |
| 4 | fc400在500Hz5.367dB；fc50在20/500Hz .109780/40.000434dB；50rad/s相位−13.003284° | 实验5一致，两个截止三个频点完整幅相见reconciliation | 不适用：无滤波频响控件 | ✅ | 独立复数二阶Butterworth，1e−9 |
| 5 | 1000Hz保持损失1.432394°；估算48.567606° | 实验5同值 | 不适用：预算用Notebook | ✅ | 固定50rad/s，不当最终离散PM |
| 6 | ±3000rpm=±100π；量化预算至少11位；12位q=.153398、半步.076699 | 实验5：11/.153398/.076699 | 不适用：电机预算独立量程 | ✅ | 总量程200πrad/s，严格<.25 |
| 7 | 8/12/16/24位SNR49.9/74.0/98.1/146.3dB，半幅−6.02；过采样4可+6.02 | 实验5：49.925712/74.008112/98.090511/146.255311；实验6：6.020600 | 不适用：无SNR控件 | ✅ | 满量程正弦/均匀弱相关假设；固定带宽白噪声条件 |
| 8 | 1/5/10/20ms稳定，50ms极点模1.177455失稳 | 实验4五rho与末样值，50ms末样−477.447723 | 不适用：无PID控件 | ✅ | 同一滤波PID/Tustin+对象ZOH；1e−8+1e−10相对容差 |
| 9 | 量化反馈不同于离线舍入，不由q推出极限环 | 实验3两cell保留四反馈/三离线工况和18..20s读数 | 组件仅演示记录/保持，不声称反馈性能 | ✅ | 11043量含四条2001点真实反馈轨迹；离线留数独立核 |
| 10 | 题1 fs>94，47在60折−13 | 实验6：−13 | 不适用：独立习题 | ✅ | 严格带限/正弦相位 |
| 11 | 题2 2.864789°/52.135211°/Ts<.008726646s | 实验6同值 | 不适用：独立习题 | ✅ | 固定20rad/s；不是最终PM |
| 12 | 题3至少10位，12位q=.048828125，半步.0244140625，量程缩4倍 | 实验6同值 | 不适用：独立量程 | ✅ | .1°C单次量化预算；舍入末位容差 |
| 13 | 题4交越2.864064、带宽4.477537、保持1.282720°、至少14位 | 实验6同值 | 不适用：连续频响习题 | ✅ | 独立复数rational根；1e−9 |
| 14 | 16k/1k/100Hz调度比16/10；fs100周期10ms | 实验参数整数比与1/fs解析复核 | fs100时真实样点间隔.01s | ✅ | 仅整除调度示例，无通用合格保证 |

### A.2 实测数据总表

| 来源 | 量 | 实测值 |
|---|---|---|
| 原始实验1 | 全部打印输出 | fs=250 Hz, Nyquist=125.0 Hz, signed alias=95.0 Hz<br>fs=100 Hz, Nyquist=50.0 Hz, signed alias=-5.0 Hz<br>100 Hz: net amplitude=.500000 at 5 Hz; not 10 Hz<br>fs=190 Hz, Nyquist=95.0 Hz, signed alias=-95.0 Hz<br>Default 8-bit ADC: levels=256, q=0.015625, half-step=0.007812<br> |
| 原始实验2 | 全部打印输出 | Natural frequency=10 rad/s; -3 dB bandwidth=12.720196 rad/s<br>Nyquist normalized hold: magnitude=0.636620, dB=-3.922398<br>Ts=0.001 s, hold phase at bandwidth=0.364407 deg<br>Ts=0.005 s, hold phase at bandwidth=1.822034 deg<br>Ts=0.010 s, hold phase at bandwidth=3.644068 deg<br>Ts=0.050 s, hold phase at bandwidth=18.220339 deg<br> |
| 原始实验3 | 全部打印输出 | Offline 8 bit: q=0.015625, max quantization error=0.007812, output span over last 2s=1.218750<br>Offline 12 bit: q=0.000977, max quantization error=0.000488, output span over last 2s=1.208984<br>Offline 16 bit: q=0.000061, max quantization error=0.000031, output span over last 2s=1.208130<br>Overload x=3: output=1.992188, error=1.007812; half-step=0.007812<br>Feedback None: y(20)=1.000000, max abs error over 18..20s=0.000000, span=0.000000<br>Feedback 8: y(20)=1.000226, max abs error over 18..20s=0.000539, span=0.000765<br>Feedback 12: y(20)=1.000014, max abs error over 18..20s=0.000034, span=0.000048<br>Feedback 16: y(20)=1.000001, max abs error over 18..20s=0.000002, span=0.000003<br>Finite-window values are not a proof of an asymptotic limit cycle or a universal bit-to-error ratio.<br> |
| 原始实验4 | 全部打印输出 | Ts=0.001 s, max pole modulus=0.997901, stable=True, final sample=0.996481<br>Ts=0.005 s, max pole modulus=0.989541, stable=True, final sample=0.996517<br>Ts=0.010 s, max pole modulus=0.979165, stable=True, final sample=0.996562<br>Ts=0.020 s, max pole modulus=0.958660, stable=True, final sample=0.996650<br>Ts=0.050 s, max pole modulus=1.177455, stable=False, final sample=-477.447723<br> |
| 原始实验5 | 全部打印输出 | fc=400 Hz: attenuation at20/500Hz=0.000027/5.367359 dB, phase at50rad/s=-1.612223 deg<br>fc=50 Hz: attenuation at20/500Hz=0.109780/40.000434 dB, phase at50rad/s=-13.003284 deg<br>Hold loss=1.432394 deg, fixed-frequency margin estimate=48.567606 deg<br>Minimum bits for quantization budget=.25 rad/s: 11<br>12 bit: q=0.153398 rad/s, half-step=0.076699 rad/s<br>N=8 levels=256 ideal full-scale SNR=49.925712 dB<br>N=12 levels=4096 ideal full-scale SNR=74.008112 dB<br>N=16 levels=65536 ideal full-scale SNR=98.090511 dB<br>N=24 levels=16777216 ideal full-scale SNR=146.255311 dB<br>Half-amplitude SNR change=-6.020600 dB<br> |
| 原始实验6 | 全部打印输出 | Q1: fs>94; signed alias of47Hz at fs60= -13<br>Q2: phase=2.864789 deg, estimate=52.135211 deg, strict period bound=0.008726646 s<br>Q3: minimum bits= 10<br>Q3: q=0.048828125 C, bound=0.024414062 C, range ratio=4.0<br>Q4: wc=2.864064 rad/s, wb=4.477537 rad/s, hold phase=1.282720 deg<br>Q4: minimum bits= 14<br>Oversampling4 independent white-noise variance ratio=.25, SNR gain=6.020600 dB<br> |

完整数组和11043逐量对账在reconciliation.json；参考reference.py不调用control/scipy，浮点容差与阈值处理见验证审校。

## 附录 B：秦构九项硬门槛

| # | 原门槛 | 实际命令/输出 | 结果 |
|---|---|---|---|
| 1 | npm run build 通过 | npm run build，exit0，First Load JS；build.log无MDX失败 | ✅ |
| 2 | curl 课程页 → HTTP 200 | WIKI_VERIFY_PORT=8183 npm run verify -- discrete-sampled/discrete-time-freq，exit0，HTTP200；verify.log | ✅ |
| 3 | 页面 H2 数 == catalog.ts 该课 subsections 数 | verify.log与browser-native/pages：9=9，H1=1；headings.json旧ID保留 | ✅ |
| 4 | katex-error 元素数 == 0 | 两页DOM及375px：0；validation.json | ✅ |
| 5 | MDX 中每个 JupyterNotebook 的 cell 字符串与验证脚本中的 cell 逐字全等 | nb-cells verify --require-kernel --port8981，exit0；六Notebook七cell，S6非SKIPPED | ✅ |
| 6 | 新增组件已在 lib/wiki-components.ts 注册 | verify.log单一来源78组件，SamplingQuantizationExplorer import+键，未改注册消费端 | ✅ |
| 7 | 新增组件已在 MDX 中用 <ComponentName /> 显式引用 | verify/check与DOM：SamplingQuantizationExplorer一个实际canvas | ✅ |
| 8 | 每个交互组件：固定坐标轴 / animation:false / Option对象 / 默认复现 | 源码x0..0.4/y−2..2；useMemo→useEChartsOption；真实TS210配置与浏览器预设/上下界/恢复默认 | ✅ |
| 9 | Notebook 中无 ipywidgets 依赖 | nb-cells S2无命中；严格内核和Pyodide六组全pass | ✅ |

四补充：inline style兜底；模块级nbSeq+newNotebookId，六实例全部运行无串扰；math:check display围栏独占行（exit0）；nb-cells S3属性无逗号（exit0）。手机375px无页面横溢，SVG实际加载，控制台error0。Pages build exit0，205课/9旧路由。33/33测试、glossary PASS3/WARN2/FAIL0、fix索引exit0。validation.mjs实际输出pass true。全部原始命令与退出码见acceptance.md。

## 附录 C：何疑红队放行

| # | 对比断言（原句 + file:line） | 基线整定与扫描范围（a） | 组数与落败场景（b） | 正文的边界与代价（c） | 放行? |
|---|---|---|---|---|---|
| 1 | 什么是混叠：提高位数不能补回漏失频率 | 固定5+.5sin95，fs250/100/190，不整定 | 三组含190临界失败与100混叠 | 仅样值等价、有限窗口非理想重建 | 放行 |
| 2 | 量化对控制系统的影响：离线记录与真实反馈不同 | 原离线G/PI保留；反馈单独明确一阶对象及PI，不伪称同模型对决 | 离线8/12/16；反馈None/8/12/16，有限窗口保持未宣称极限环 | 范围/误差/窗口与无饱和写明；更多位数不是通用输出精度保证 | 放行 |
| 3 | 设计实例：50ms数字闭环失稳 | 固定滤波PID，不随周期调参，ZOH+Tustin | 五组含50ms失稳 | 明确新基线、计算预算与非通用上限 | 放行 |
| 4 | 抗混叠滤波：低截止增加低频相位滞后 | 同阶Butterworth，fc400/50，20/500Hz及50rad/s，扫解析频率 | 两截止×三频点，fc400阻带落败；fc50相位代价 | 限定幅相观察，无跨控制器性能排名；通过幅值预算不等于闭环通过 | 放行 |
| 5 | 深入讨论：过采样4倍SNR可加6.02dB | 固定信号带宽、独立白噪声解析功率预算，非方法调参 | 原采样/4倍；相关误差反例明示 | 相关/固定误差不保证缩小；需低通和降采样 | 放行 |

## 附录 D：保留与变更映射

| 原位置/资产 | 审计证据 | 保留/纠错/重写/迁移/拆分/删除 | 目标位置/去向 | 验证方式 |
|---|---|---|---|---|
| 采样过程三H3 | source-before | 保留并纠错Nyquist两个名称/谱复制系数/严格条件 | 原三H3、同ID | headings.json，实验1临界反例 |
| 混叠三H3、旧混叠实验 | 原95Hz同相/10Hz错误 | 纠错反相5Hz，保留三率对比，新增参数控件 | 实验1+Explorer | 原生/Pyodide/210TS |
| 采样保持器三H3、旧保持实验 | Ts尺度和带宽公式错误 | 纠错归一化/相位支路/真实带宽 | 实验2 | 独立sinc/方程根 |
| 量化三H3、旧离线实验 | 无限round、离线图不是真反馈 | 保留离线比较，有限ADC补端点饱和，另补真实反馈 | 实验3两cell | 留数/精确更新、范围和过载实测 |
| 设计实例H3、原PID离散cell | baseline-notebooks Improper transfer function | 保留对象与采样主题，理想D改明确滤波基线；预算纠错 | 实验4/5，原设计实例 | 代数Tustin/ZOH/复数滤波与严格内核 |
| 深入讨论四H3 | 原过采样/ΣΔ/编码器泛化 | 保留主题补条件与后续去向 | 原四H3 | 来源核对/整数比/假设审查 |
| 小结/四题四答全部子问 | source-before | 保留问题学习目标，纠错数值和量化界含义 | 原H2、实验6 | 独立频响根/预算核 |
| 两段字符示意 | 源快照 | 图形重画，内容保留 | sampling-pipeline/sampling-spectra.svg | 两实际页面/375px/路径加载 |
| 旧URL、9H2/19H3 ID | 源快照编译 | 全保留，无重定向变更 | 同课程URL与全部旧锚点 | headings.mjs无missing；实际DOM目标存在 |

无未迁材料需先删源；基础量化留在本课，硬件细节留implementation后续计划。日志/资产数量均以脚本实测为准。
