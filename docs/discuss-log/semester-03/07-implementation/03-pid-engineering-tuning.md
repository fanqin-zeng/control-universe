# IMPL-03 · PID工程整定 · 学期3讨论记录

日期：2026-10-24。模式：新写；catalog为空且目标MDX不存在。rank 1，只交付此课。以下为结构化角色审查视角，不代表真实外部专家或独立Agent。

出席10人：郑核、苏绘、孙助、柯验、秦构、周联（implementation主责）、何仿、赵工、林码、何疑。
[沉默-林矩：本课只使用已交付的一阶系统与PI，理论条件由周联逐条核查。]
[沉默-陆阅：本课由郑核代核阅读体验与四份档案。]
其余角色不在impl矩阵追加范围；不凑数发言。

## Phase 1 内容规划

郑核：用户明确指定IMPL-03，先修digital-pid、time-domain-analysis已交付；不用尚未交付的系统辨识课。独立运行目录与索引隔离并行开发；原始baseline-check.log、baseline-semester.log保留。

周联：贯穿问题是恒温水箱升温迟缓、加热器触顶，如何从一次受控小阶跃到可回退的PI参数。目标：①从归一化阶跃提取K/T/L并知道失效条件；②把SIMC PI候选换成实际程序参数；③用固定合同与多个工况验收；④识别不可达目标并设计试运行/回退记录。PID是方法族，本例D=0；不把一阶模型强行加D。

赵工：试验前先写允许范围、停止条件、人工接管和恢复点；不指导在真实设备上寻找持续振荡。林码：模型时间常数T与积分时间Ti必须分清；图和程序都要写积分更新顺序。

苏绘：H2定为“先把要求写成验收合同 / 从阶跃试验得到模型 / 从模型得到PI候选 / 在约束下检验候选 / 整定到现场的交接 / 小结 / 习题 / 答案”。流程SVG；Notebook1复算识别、规则与答案；Notebook2运行固定三档×四工况；Explorer改变闭环时间参数与工况、显示y/u及指标。不在Notebook放滑条。

何仿：合同先冻结：教学生成数据而非现场测量；偏差量y为℃、u为归一化加热指令；K=2℃/指令，T=4s，L=.5s；零初态；Ts=.05s，0–30s，ZOH一阶精确步进，延迟为整数拍；PI先输出后条件积分；u∈[0,1]；候选λ=.5/1/2s。四工况：标称、延迟增至1.5s、不可达r=3℃、输入扰动-.2且确定性测量噪声.02sin(8t)。指标为离散左矩形IAE、采样超调百分比、含首拍变化的TV(u)、饱和拍数、末样误差。所有指标数值待测。

何疑：限定同一SIMC规则的参数敏感性观察，三档都预先给定、不宣称最优或优于其它方法；四工况全报告，含不可达失败。噪声是确定性测试信号，不是统计性能证据。λ增大也可能不能满足时限，不把“保守”当保证。

柯验：识别用解析响应反演独立核对，组件实际TS用Python十进制递推核对全部轨迹/指标；默认与边界λ、全部四工况都测。数值容差轨迹1e-10，页面四位小数5.1e-5；识别1e-12。原始MDX setup/cells真内核顺序运行，并在Pages Pyodide复跑；不得用另抄脚本代替原cell。

孙助：四题对应识别反演、λ与Ki换算、饱和/不可达、试验记录与判停。答案的数值同样在Notebook1计算。郑核：先执行最小实验，未得到证据前不填指标、不签发。

## Phase 2 内容生成

### 第一轮：概念讲解与最小实验

何仿：独立Decimal最小实验已实跑，原始结果见minimal-experiment.json。识别回到K=2/T=4/L=.5；默认标称IAE=2.4834697495932425、饱和21拍。先冻结该实现再扩写正文。周联：一阶模型只选PI；λ是候选设计参数，不把它当作实际闭环时间。

### 第二轮：学生反馈

赵工：第一版把u叫偏差量却只写0–1，非零加热工作点的负偏差怎么办？林码：T和Ti现在讲清楚了，但“饱和21拍”是通过条件吗？另外浏览器侧栏PI候选锚点保留大写，而实际渲染ID是小写，点击不能定位。

### 第三轮：调整完善

周联：在“从阶跃试验得到模型”明确本例以环境温度为零点、输入从零开始；非零工作点须同时换算偏差限幅。何仿：在指标定义补充饱和计数含恰好触及，它不是本课自造的合格阈值。秦构：本课catalog小节slug用实际渲染的小写ID，重测全部锚点；组件Kp/Ki显示完整单位。未改变数值合同，原始Notebook与独立Decimal对账仍需最终源哈希复核。

## Phase 3 内容审校

### 教授组
周联：一阶局部、自衡、单调条件和失效对象已写明；SIMC来源为作者原文。λ不是实测闭环时间；Ti不是T的同义词；D为零不冒充完整PID模型辨识。实际延迟变化后不重新整定控制器，属于模型失配检验。
### 工程组
何仿：ZOH精确推进、延迟10/30拍、条件积分顺序、最终实际限幅、确定性噪声与15s过程输入扰动位置均对应源码。赵工：不可达目标全数保留，不能以防饱和替代容量；工作点偏差限幅、人工接管、状态跟踪、旧参数恢复均已说明。
### 验证组
柯验：实际TS函数28配置、67536个数值与42位Decimal独立复算，最大差异2.025046796916286e-13；Notebook原始setup/cells真内核执行4cell无error，页面原生UI、Pages UI及Pyodide也实际运行。全部正文实验表60个数字、默认/边界UI共116个数值核对通过。秦构：原生与Pages构建退出0，页面200，H1=1/H2=8，数学错误0、重复ID0、死锚点0；375px修后scrollWidth=clientWidth=360，图331px；静态新页console error=0。
### 体验与脉络组
郑核代陆阅：开篇是可想象的恒温水箱，观察变化→读者问题→先修深化；四份档案将在本日志内闭合。秦构首次375px夹具发现完整指标表宽513px溢出页面，已只给本课表增加独立横向滚动容器，必须重测后才能放行。不修改全局样式或其它会话课程。
### 教学支持组
孙助：四题依次覆盖模型反演、参数与单位换算、容量失败、现场判停与回退；数值答案由Notebook1及独立解析复算支持。第四题是解释/工程记录题，不伪装成可用固定数字作答的设备规范。
### 学生组
林码：现在能区分过程T、控制器Ti和设计λ；积分是输出后更新，首拍不混用上一课另一种约定。赵工：21拍只是此合同里的记录，不是自动通过阈值；目标不可达先查容量与要求。郑核代陆阅：从生活例到公式、算法、反例与交接顺序可独立阅读，四份档案齐备。
## Phase 4 定稿签发

郑核：理论条件、学生反馈闭环、习题答案、柯验逐量对账、何疑限定观察放行及秦构九项门槛均有实测支持，现签发本课。catalog与旧tracker同步v1.3；本期Phase1–4及验收可勾，进入master一栏等待真实提交hash，不预填。未执行公网发布。

## 附录 A.1 数值三方对账

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | K=2 | NB1/c1=2 | 不适用：模型反演/习题静态计算，组件不提供此项读数 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 2 | T=4 | NB1/c1=4 | 不适用：模型反演/习题静态计算，组件不提供此项读数 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 3 | L=0.5 | NB1/c1=0.5 | 不适用：模型反演/习题静态计算，组件不提供此项读数 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 4 | q1=0.283468689426 | NB1/c1=0.283468689426 | 不适用：模型反演/习题静态计算，组件不提供此项读数 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 5 | q2=0.632120558829 | NB1/c1=0.632120558829 | 不适用：模型反演/习题静态计算，组件不提供此项读数 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 6 | t1=1.83333333333 | NB1/c1=1.83333333333 | 不适用：模型反演/习题静态计算，组件不提供此项读数 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 7 | t2=4.5 | NB1/c1=4.5 | 不适用：模型反演/习题静态计算，组件不提供此项读数 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 8 | y1=0.226774951541 | NB1/c1=0.226774951541 | 不适用：模型反演/习题静态计算，组件不提供此项读数 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 9 | y2=0.505696447063 | NB1/c1=0.505696447063 | 不适用：模型反演/习题静态计算，组件不提供此项读数 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 10 | Kp=1.33333333333 | NB1/c1=1.33333333333 | 默认SIMC增益同值 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 11 | Ti=4 | NB1/c1=4 | 默认SIMC增益同值 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 12 | Ki=0.333333333333 | NB1/c1=0.333333333333 | 默认SIMC增益同值 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 13 | exerciseKp=0.8 | NB1/c1=0.8 | 不适用：模型反演/习题静态计算，组件不提供此项读数 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 14 | exerciseKi=0.2 | NB1/c1=0.2 | 不适用：模型反演/习题静态计算，组件不提供此项读数 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 15 | capacity=2 | NB1/c1=2 | 不适用：模型反演/习题静态计算，组件不提供此项读数 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 16 | unreachableGap=1 | NB1/c1=1 | 不适用：模型反演/习题静态计算，组件不提供此项读数 | ✅ | identification；原始值见reconciliation.json，解析容差1e-12；页面舍入5.1e-5 |
| 17 | λ=0.5/nominal iae=2.3857 | NB2/c1=2.38573113386 | 非默认；实际TS切换λ=0.5/nominal：2.38573113386 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 18 | λ=0.5/nominal overshoot=0.0000 | NB2/c1=0 | 非默认；实际TS切换λ=0.5/nominal：0 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 19 | λ=0.5/nominal tv=1.5577 | NB2/c1=1.55771316368 | 非默认；实际TS切换λ=0.5/nominal：1.55771316368 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 20 | λ=0.5/nominal saturated=34.0000 | NB2/c1=34 | 非默认；实际TS切换λ=0.5/nominal：34 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 21 | λ=0.5/nominal finalError=0.0002 | NB2/c1=0.000177612121577 | 非默认；实际TS切换λ=0.5/nominal：0.000177612121577 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 22 | λ=0.5/delay iae=6.0891 | NB2/c1=6.08911971463 | 非默认；实际TS切换λ=0.5/delay：6.08911971463 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 23 | λ=0.5/delay overshoot=19.6152 | NB2/c1=19.6152029739 | 非默认；实际TS切换λ=0.5/delay：19.6152029739 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 24 | λ=0.5/delay tv=8.6594 | NB2/c1=8.65942433063 | 非默认；实际TS切换λ=0.5/delay：8.65942433063 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 25 | λ=0.5/delay saturated=58.0000 | NB2/c1=58 | 非默认；实际TS切换λ=0.5/delay：58 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 26 | λ=0.5/delay finalError=-0.1516 | NB2/c1=-0.151616127002 | 非默认；实际TS切换λ=0.5/delay：-0.151616127002 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 27 | λ=0.5/unreachable iae=39.0451 | NB2/c1=39.0450589512 | 非默认；实际TS切换λ=0.5/unreachable：39.0450589512 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 28 | λ=0.5/unreachable overshoot=0.0000 | NB2/c1=0 | 非默认；实际TS切换λ=0.5/unreachable：0 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 29 | λ=0.5/unreachable tv=1.0000 | NB2/c1=1 | 非默认；实际TS切换λ=0.5/unreachable：1 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 30 | λ=0.5/unreachable saturated=600.0000 | NB2/c1=600 | 非默认；实际TS切换λ=0.5/unreachable：600 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 31 | λ=0.5/unreachable finalError=1.0013 | NB2/c1=1.0012534534 | 非默认；实际TS切换λ=0.5/unreachable：1.0012534534 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 32 | λ=0.5/noise iae=2.7527 | NB2/c1=2.75266042552 | 非默认；实际TS切换λ=0.5/noise：2.75266042552 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 33 | λ=0.5/noise overshoot=0.0000 | NB2/c1=0 | 非默认；实际TS切换λ=0.5/noise：0 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 34 | λ=0.5/noise tv=6.4591 | NB2/c1=6.45906936538 | 非默认；实际TS切换λ=0.5/noise：6.45906936538 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 35 | λ=0.5/noise saturated=33.0000 | NB2/c1=33 | 非默认；实际TS切换λ=0.5/noise：33 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 36 | λ=0.5/noise finalError=0.0050 | NB2/c1=0.00499624843029 | 非默认；实际TS切换λ=0.5/noise：0.0049962484303 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 37 | λ=1/nominal iae=2.4835 | NB2/c1=2.48346974959 | 默认读数：2.48346974959 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 38 | λ=1/nominal overshoot=0.0000 | NB2/c1=0 | 默认读数：0 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 39 | λ=1/nominal tv=1.5000 | NB2/c1=1.49999927188 | 默认读数：1.49999927188 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 40 | λ=1/nominal saturated=21.0000 | NB2/c1=21 | 默认读数：21 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 41 | λ=1/nominal finalError=0.0002 | NB2/c1=0.000173567924789 | 默认读数：0.00017356792479 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 42 | λ=1/delay iae=3.5599 | NB2/c1=3.55991109353 | 非默认；实际TS切换λ=1/delay：3.55991109353 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 43 | λ=1/delay overshoot=1.6056 | NB2/c1=1.60558421811 | 非默认；实际TS切换λ=1/delay：1.60558421811 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 44 | λ=1/delay tv=2.4828 | NB2/c1=2.48276282003 | 非默认；实际TS切换λ=1/delay：2.48276282003 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 45 | λ=1/delay saturated=41.0000 | NB2/c1=41 | 非默认；实际TS切换λ=1/delay：41 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 46 | λ=1/delay finalError=0.0016 | NB2/c1=0.00162612628081 | 非默认；实际TS切换λ=1/delay：0.00162612628081 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 47 | λ=1/unreachable iae=39.0451 | NB2/c1=39.0450589512 | 非默认；实际TS切换λ=1/unreachable：39.0450589512 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 48 | λ=1/unreachable overshoot=0.0000 | NB2/c1=0 | 非默认；实际TS切换λ=1/unreachable：0 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 49 | λ=1/unreachable tv=1.0000 | NB2/c1=1 | 非默认；实际TS切换λ=1/unreachable：1 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 50 | λ=1/unreachable saturated=600.0000 | NB2/c1=600 | 非默认；实际TS切换λ=1/unreachable：600 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 51 | λ=1/unreachable finalError=1.0013 | NB2/c1=1.0012534534 | 非默认；实际TS切换λ=1/unreachable：1.0012534534 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 52 | λ=1/noise iae=3.0273 | NB2/c1=3.0273496793 | 非默认；实际TS切换λ=1/noise：3.0273496793 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 53 | λ=1/noise overshoot=0.0000 | NB2/c1=0 | 非默认；实际TS切换λ=1/noise：0 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 54 | λ=1/noise tv=4.8818 | NB2/c1=4.88180436304 | 非默认；实际TS切换λ=1/noise：4.88180436304 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 55 | λ=1/noise saturated=20.0000 | NB2/c1=20 | 非默认；实际TS切换λ=1/noise：20 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 56 | λ=1/noise finalError=0.0062 | NB2/c1=0.00622386702864 | 非默认；实际TS切换λ=1/noise：0.00622386702864 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 57 | λ=2/nominal iae=2.5011 | NB2/c1=2.50110898594 | 非默认；实际TS切换λ=2/nominal：2.50110898594 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 58 | λ=2/nominal overshoot=0.0073 | NB2/c1=0.00731581587213 | 非默认；实际TS切换λ=2/nominal：0.00731581587214 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 59 | λ=2/nominal tv=1.3000 | NB2/c1=1.29999995593 | 非默认；实际TS切换λ=2/nominal：1.29999995593 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 60 | λ=2/nominal saturated=0.0000 | NB2/c1=0 | 非默认；实际TS切换λ=2/nominal：0 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 61 | λ=2/nominal finalError=-0.0000 | NB2/c1=-8.68504623832e-06 | 非默认；实际TS切换λ=2/nominal：-8.68504623797e-06 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 62 | λ=2/delay iae=3.1421 | NB2/c1=3.14211425448 | 非默认；实际TS切换λ=2/delay：3.14211425448 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 63 | λ=2/delay overshoot=3.0084 | NB2/c1=3.00840415558 | 非默认；实际TS切换λ=2/delay：3.00840415558 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 64 | λ=2/delay tv=1.6320 | NB2/c1=1.6320483796 | 非默认；实际TS切换λ=2/delay：1.6320483796 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 65 | λ=2/delay saturated=11.0000 | NB2/c1=11 | 非默认；实际TS切换λ=2/delay：11 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 66 | λ=2/delay finalError=0.0002 | NB2/c1=0.00017030701069 | 非默认；实际TS切换λ=2/delay：0.00017030701069 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 67 | λ=2/unreachable iae=39.0460 | NB2/c1=39.0460140449 | 非默认；实际TS切换λ=2/unreachable：39.0460140449 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 68 | λ=2/unreachable overshoot=0.0000 | NB2/c1=0 | 非默认；实际TS切换λ=2/unreachable：0 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 69 | λ=2/unreachable tv=1.0194 | NB2/c1=1.01935889913 | 非默认；实际TS切换λ=2/unreachable：1.01935889913 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 70 | λ=2/unreachable saturated=582.0000 | NB2/c1=582 | 非默认；实际TS切换λ=2/unreachable：582 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 71 | λ=2/unreachable finalError=1.0013 | NB2/c1=1.00125664621 | 非默认；实际TS切换λ=2/unreachable：1.00125664621 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 72 | λ=2/noise iae=3.4586 | NB2/c1=3.45857051078 | 非默认；实际TS切换λ=2/noise：3.45857051078 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 73 | λ=2/noise overshoot=0.0700 | NB2/c1=0.069973888321 | 非默认；实际TS切换λ=2/noise：0.069973888321 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 74 | λ=2/noise tv=3.3437 | NB2/c1=3.34370360639 | 非默认；实际TS切换λ=2/noise：3.34370360639 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 75 | λ=2/noise saturated=0.0000 | NB2/c1=0 | 非默认；实际TS切换λ=2/noise：0 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |
| 76 | λ=2/noise finalError=0.0120 | NB2/c1=0.0120127316109 | 非默认；实际TS切换λ=2/noise：0.0120127316109 | ✅ | 固定0–30s、Ts=.05；末样非稳态；高精度容差1e-10，表格舍入5.1e-5 |

重复引用（默认五读数、三个延迟超调、答案）的同量断言复用对应行；输入参数、窗口、采样数与数组长度为实验合同，原代码与notebooks.json保留。边界λ=.25及3和四工况UI逐量检查见native-interactions.json、validation.json。组件不计算阶跃反演，所以未伪造第三路。容量2、不可达下界1的解析式与NB1闭合。

## 附录 A.2 实测数据总表

| 来源 | 量 | 实测值 |
|---|---|---|
| Notebook1/c1及独立解析 | K | 2 |
| Notebook1/c1及独立解析 | T | 4 |
| Notebook1/c1及独立解析 | L | 0.5 |
| Notebook1/c1及独立解析 | q1 | 0.2834686894262107 |
| Notebook1/c1及独立解析 | q2 | 0.6321205588285577 |
| Notebook1/c1及独立解析 | t1 | 1.833333333333333 |
| Notebook1/c1及独立解析 | t2 | 4.5 |
| Notebook1/c1及独立解析 | y1 | 0.2267749515409686 |
| Notebook1/c1及独立解析 | y2 | 0.5056964470628461 |
| Notebook1/c1及独立解析 | Kp | 1.333333333333333 |
| Notebook1/c1及独立解析 | Ti | 4 |
| Notebook1/c1及独立解析 | Ki | 0.3333333333333333 |
| Notebook1/c1及独立解析 | exerciseKp | 0.8 |
| Notebook1/c1及独立解析 | exerciseKi | 0.2 |
| Notebook1/c1及独立解析 | capacity | 2 |
| Notebook1/c1及独立解析 | unreachableGap | 1 |
| actual-ts.json λ=0.25/nominal | iae | 2.079832817209589 |
| actual-ts.json λ=0.25/nominal | overshoot | 0 |
| actual-ts.json λ=0.25/nominal | tv | 1.707982768274849 |
| actual-ts.json λ=0.25/nominal | saturated | 40 |
| actual-ts.json λ=0.25/nominal | finalError | 7.541596651283733e-06 |
| actual-ts.json λ=0.25/delay | iae | 6.647048253488624 |
| actual-ts.json λ=0.25/delay | overshoot | 24.63603916093067 |
| actual-ts.json λ=0.25/delay | tv | 11 |
| actual-ts.json λ=0.25/delay | saturated | 291 |
| actual-ts.json λ=0.25/delay | finalError | 0.2279885406579316 |
| actual-ts.json λ=0.25/unreachable | iae | 39.04505895118903 |
| actual-ts.json λ=0.25/unreachable | overshoot | 0 |
| actual-ts.json λ=0.25/unreachable | tv | 1 |
| actual-ts.json λ=0.25/unreachable | saturated | 600 |
| actual-ts.json λ=0.25/unreachable | finalError | 1.001253453396897 |
| actual-ts.json λ=0.25/noise | iae | 2.325085936002878 |
| actual-ts.json λ=0.25/noise | overshoot | 0.2440009924157049 |
| actual-ts.json λ=0.25/noise | tv | 7.920222980225184 |
| actual-ts.json λ=0.25/noise | saturated | 41 |
| actual-ts.json λ=0.25/noise | finalError | 0.003277520461715144 |
| actual-ts.json λ=0.5/nominal | iae | 2.385731133863277 |
| actual-ts.json λ=0.5/nominal | overshoot | 0 |
| actual-ts.json λ=0.5/nominal | tv | 1.557713163677708 |
| actual-ts.json λ=0.5/nominal | saturated | 34 |
| actual-ts.json λ=0.5/nominal | finalError | 0.0001776121215772974 |
| actual-ts.json λ=0.5/delay | iae | 6.089119714633142 |
| actual-ts.json λ=0.5/delay | overshoot | 19.61520297390391 |
| actual-ts.json λ=0.5/delay | tv | 8.659424330633751 |
| actual-ts.json λ=0.5/delay | saturated | 58 |
| actual-ts.json λ=0.5/delay | finalError | -0.1516161270019387 |
| actual-ts.json λ=0.5/unreachable | iae | 39.04505895118903 |
| actual-ts.json λ=0.5/unreachable | overshoot | 0 |
| actual-ts.json λ=0.5/unreachable | tv | 1 |
| actual-ts.json λ=0.5/unreachable | saturated | 600 |
| actual-ts.json λ=0.5/unreachable | finalError | 1.001253453396897 |
| actual-ts.json λ=0.5/noise | iae | 2.752660425524372 |
| actual-ts.json λ=0.5/noise | overshoot | 0 |
| actual-ts.json λ=0.5/noise | tv | 6.459069365379548 |
| actual-ts.json λ=0.5/noise | saturated | 33 |
| actual-ts.json λ=0.5/noise | finalError | 0.004996248430295114 |
| actual-ts.json λ=0.75/nominal | iae | 2.440390939397227 |
| actual-ts.json λ=0.75/nominal | overshoot | 0 |
| actual-ts.json λ=0.75/nominal | tv | 1.502708957932516 |
| actual-ts.json λ=0.75/nominal | saturated | 27 |
| actual-ts.json λ=0.75/nominal | finalError | 0.0001800441152138843 |
| actual-ts.json λ=0.75/delay | iae | 4.007433309120308 |
| actual-ts.json λ=0.75/delay | overshoot | 6.937256399066283 |
| actual-ts.json λ=0.75/delay | tv | 3.582430513708607 |
| actual-ts.json λ=0.75/delay | saturated | 47 |
| actual-ts.json λ=0.75/delay | finalError | -0.001428358616020864 |
| actual-ts.json λ=0.75/unreachable | iae | 39.04505895118903 |
| actual-ts.json λ=0.75/unreachable | overshoot | 0 |
| actual-ts.json λ=0.75/unreachable | tv | 1 |
| actual-ts.json λ=0.75/unreachable | saturated | 600 |
| actual-ts.json λ=0.75/unreachable | finalError | 1.001253453396897 |
| actual-ts.json λ=0.75/noise | iae | 2.957311945468567 |
| actual-ts.json λ=0.75/noise | overshoot | 0 |
| actual-ts.json λ=0.75/noise | tv | 5.538810853305239 |
| actual-ts.json λ=0.75/noise | saturated | 28 |
| actual-ts.json λ=0.75/noise | finalError | 0.005492837089995151 |
| actual-ts.json λ=1/nominal | iae | 2.483469749593246 |
| actual-ts.json λ=1/nominal | overshoot | 0 |
| actual-ts.json λ=1/nominal | tv | 1.499999271881546 |
| actual-ts.json λ=1/nominal | saturated | 21 |
| actual-ts.json λ=1/nominal | finalError | 0.0001735679247896194 |
| actual-ts.json λ=1/delay | iae | 3.559911093532177 |
| actual-ts.json λ=1/delay | overshoot | 1.605584218108502 |
| actual-ts.json λ=1/delay | tv | 2.482762820027601 |
| actual-ts.json λ=1/delay | saturated | 41 |
| actual-ts.json λ=1/delay | finalError | 0.001626126280807938 |
| actual-ts.json λ=1/unreachable | iae | 39.04505895118903 |
| actual-ts.json λ=1/unreachable | overshoot | 0 |
| actual-ts.json λ=1/unreachable | tv | 1 |
| actual-ts.json λ=1/unreachable | saturated | 600 |
| actual-ts.json λ=1/unreachable | finalError | 1.001253453396897 |
| actual-ts.json λ=1/noise | iae | 3.027349679304503 |
| actual-ts.json λ=1/noise | overshoot | 0 |
| actual-ts.json λ=1/noise | tv | 4.881804363037467 |
| actual-ts.json λ=1/noise | saturated | 20 |
| actual-ts.json λ=1/noise | finalError | 0.006223867028642083 |
| actual-ts.json λ=1.5/nominal | iae | 2.549472735965277 |
| actual-ts.json λ=1.5/nominal | overshoot | 0 |
| actual-ts.json λ=1.5/nominal | tv | 1.499999331903394 |
| actual-ts.json λ=1.5/nominal | saturated | 11 |
| actual-ts.json λ=1.5/nominal | finalError | 0.0001324757056578862 |
| actual-ts.json λ=1.5/delay | iae | 3.548533503086682 |
| actual-ts.json λ=1.5/delay | overshoot | 0 |
| actual-ts.json λ=1.5/delay | tv | 1.846343112231455 |
| actual-ts.json λ=1.5/delay | saturated | 31 |
| actual-ts.json λ=1.5/delay | finalError | 0.000336159831803684 |
| actual-ts.json λ=1.5/unreachable | iae | 39.04505895118903 |
| actual-ts.json λ=1.5/unreachable | overshoot | 0 |
| actual-ts.json λ=1.5/unreachable | tv | 1 |
| actual-ts.json λ=1.5/unreachable | saturated | 600 |
| actual-ts.json λ=1.5/unreachable | finalError | 1.001253453396897 |
| actual-ts.json λ=1.5/noise | iae | 3.270369341418759 |
| actual-ts.json λ=1.5/noise | overshoot | 0 |
| actual-ts.json λ=1.5/noise | tv | 4.064469762819551 |
| actual-ts.json λ=1.5/noise | saturated | 10 |
| actual-ts.json λ=1.5/noise | finalError | 0.00850553150880895 |
| actual-ts.json λ=2/nominal | iae | 2.501108985944443 |
| actual-ts.json λ=2/nominal | overshoot | 0.007315815872144249 |
| actual-ts.json λ=2/nominal | tv | 1.29999995592775 |
| actual-ts.json λ=2/nominal | saturated | 0 |
| actual-ts.json λ=2/nominal | finalError | -8.685046237966176e-06 |
| actual-ts.json λ=2/delay | iae | 3.142114254479433 |
| actual-ts.json λ=2/delay | overshoot | 3.008404155576239 |
| actual-ts.json λ=2/delay | tv | 1.632048379598225 |
| actual-ts.json λ=2/delay | saturated | 11 |
| actual-ts.json λ=2/delay | finalError | 0.0001703070106904292 |
| actual-ts.json λ=2/unreachable | iae | 39.04601404489462 |
| actual-ts.json λ=2/unreachable | overshoot | 0 |
| actual-ts.json λ=2/unreachable | tv | 1.01935889912555 |
| actual-ts.json λ=2/unreachable | saturated | 582 |
| actual-ts.json λ=2/unreachable | finalError | 1.0012566462129 |
| actual-ts.json λ=2/noise | iae | 3.45857051078477 |
| actual-ts.json λ=2/noise | overshoot | 0.06997388832099549 |
| actual-ts.json λ=2/noise | tv | 3.343703606389751 |
| actual-ts.json λ=2/noise | saturated | 0 |
| actual-ts.json λ=2/noise | finalError | 0.01201273161092375 |
| actual-ts.json λ=3/nominal | iae | 3.500018008238677 |
| actual-ts.json λ=3/nominal | overshoot | 0 |
| actual-ts.json λ=3/nominal | tv | 0.7857061045308238 |
| actual-ts.json λ=3/nominal | saturated | 0 |
| actual-ts.json λ=3/nominal | finalError | 9.57512918420278e-06 |
| actual-ts.json λ=3/delay | iae | 3.577394259599508 |
| actual-ts.json λ=3/delay | overshoot | 0.9453617234742584 |
| actual-ts.json λ=3/delay | tv | 1.075279334295996 |
| actual-ts.json λ=3/delay | saturated | 0 |
| actual-ts.json λ=3/delay | finalError | -1.21722898811516e-05 |
| actual-ts.json λ=3/unreachable | iae | 39.05073672928025 |
| actual-ts.json λ=3/unreachable | overshoot | 0 |
| actual-ts.json λ=3/unreachable | tv | 1.114034738737435 |
| actual-ts.json λ=3/unreachable | saturated | 555 |
| actual-ts.json λ=3/unreachable | finalError | 1.001259405828106 |
| actual-ts.json λ=3/noise | iae | 4.802653487749073 |
| actual-ts.json λ=3/noise | overshoot | 0 |
| actual-ts.json λ=3/noise | tv | 2.335341857957902 |
| actual-ts.json λ=3/noise | saturated | 0 |
| actual-ts.json λ=3/noise | finalError | 0.02371083962968945 |
| actual-ts.json/reference.json | 28组×601点完整时间/y/u/r轨迹 | 原始数组保留，67536数值对照通过；未抽稀时间轴 |
| notebooks.json | 原setup/cells执行 | 2 Notebook / 4 cell / error 0 / S6非SKIPPED |
| pyodide.json | 同哈希浏览器Python | 2/2放行、4/4 cell通过，图片输出2幅 |

## 附录 B 九项前端硬门槛

| # | 原技能九项硬门槛 | 实际输出与证据 |
|---|---|---|
| 1 | ✅ npm run build 通过 | build-results.json：npm run build退出0；独立目录完整预渲染 |
| 2 | ✅ curl课程页HTTP 200 | native-verify.log：课程页HTTP200；静态页实际浏览器加载与Pages构建路由检查通过 |
| 3 | ✅ 渲染后H2与catalog小节数一致 | native-verify.log/pages-dom.json：H1=1、H2=8；subsections=8 |
| 4 | ✅ katex-error元素数为0 | native-dom.json/pages-dom.json：0 |
| 5 | ✅ MDX与验证脚本cell字符串逐字全等且真内核运行 | notebooks.log/notebooks.json：S0–S8无FAIL、4cell真跑、error0；验证脚本extract原始MDX不另抄cell |
| 6 | ✅ 新增组件已在lib/wiki-components.ts登记 | PidTuningExplorer单一来源注册；native-verify.log注册结构PASS |
| 7 | ✅ 新增组件MDX显式引用 | 本课MDX含<PidTuningExplorer />，DOM canvas=1 |
| 8 | ✅ 固定轴/animation:false/Option对象/默认参数 | 两Y轴及X轴显式min/max，useMemo<EChartsOption>传useECharts；实际TS28配置及页面默认/边界/恢复见validation.json |
| 9 | ✅ notebook无ipywidgets等不支持组件 | nb-cells S2无FAIL；Pages两个Notebook实际执行，非代码保留 |

额外：npm run build:pages退出0，205课/9旧路由；math:check退出0，glossary:check PASS3/WARN3/FAIL0；术语三个WARN为既有残渣/不命中提示，未更改术语表降低门槛。两个构建的既有lint/KaTeX WARN按原输出保留，不属于本课新增编译失败。最终catalog及学期检查在独立快照上再次运行，原始日志保留。

## 附录 C 红队放行

| 对比结论 | 基线独立整定? | ≥3 工况? | 落败/持平工况? | 边界写回正文? | 放行? |
|---|---|---|---|---|---|
| 同一SIMC规则三档固定参数敏感性；不是方法排名 | 限定观察：没有独立搜索最优参数，不宣称方法胜出 | ✅ 四工况全部12行，原始数组保留 | ✅ 标称更快伴随延迟超调/噪声TV代价；全部不可达失败；更大λ超调非单调 | ✅ 窗口、约束、模型失配及确定性噪声限制写回正文 | ✅ 何疑放行此限定观察；不放行泛化性能排名 |

## 附录 D 来源与变更

SIMC PI采用Skogestad 2003原始论文与作者说明，检索2026-10-24：https://skoge.folk.ntnu.no/publications/2003/tuningPID/README.html 。本课仅转述一阶对象的PI规则，不采用串联PID的D参数，不将其鲁棒性研究结论移植成此离散限幅回路的保证。

何疑：不需要统计显著性推断；这里不抽样、不比较学习算法。若未来宣称某整定法最优，应另立相同预算与独立整定基线，不能引用本表当结论。
