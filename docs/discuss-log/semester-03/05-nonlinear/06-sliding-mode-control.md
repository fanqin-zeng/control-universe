# NONLINEAR-06 滑模控制

- 学期：semester-03；课型：theory；模式：重构；日期：2026-10-18。
- 路径：nonlinear/sliding-mode-control；起点：a8dd52ec1261aef9499ddfba0d64dc02dbaf533f。
- 原稿/实验：.agent/semester-03/nonlinear-06/source-before.mdx、original-notebooks.json。
- 角色是结构化审查视角，不是实际外部专家或并行Agent；旧semester-01日志保留，不回写。

## 出席与沉默表

郑核、苏绘、孙助、柯验为核心；卫韧主责，林矩核推导，李稳核阅读，赵工核执行器，何疑核比较，秦构核实现，共10视角。

[沉默-陈控：非线性对象由卫韧主责，线性闭环由林矩核查。]
[沉默-方数：本课符号不等式由林矩与柯验独立核查。]
[沉默-周联：无硬件交付，执行器和采样由赵工核查。]
[沉默-何仿：原实验配置保留，秦构执行，柯验独立核。]
[沉默-吴规：无真实上位规划接口，参考轨迹是明确的教学配置。]
[沉默-陆阅：theory课型，李稳反馈和郑核档案核查承接。]
[沉默-许史：撤不可核的历史泛称，不讲控制史。]
[沉默-范安：不交付安全等级或硬件安全保证，正文限定执行器边界。]
[沉默-小初：本课选李稳复述理论主线。]
[沉默-钱锐：定理边界由主责和林矩承担，比较由何疑仲裁。]
[沉默-林码：无学习算法或软件背景专属前置。]
[沉默-岳自：非math章，已有明确数学先修。]
[沉默-轮值：本课为theory，buck只保留理想CCM计算，不交付行业方案。]

## Phase 1: 内容规划

卫韧：审计发现“滑动模态不依赖模型”“STA是r=2对象特例”“只许一阶积分”均过强或错误。匹配不确定性在理想滑动下消失，不等于名义切向动态消失；STA通常用于s对输入相对阶1。实验增益仅本组配置，不替代扰动正则性和增益定理。

林矩：未知b的充分条件需要统一输入/加速度单位，推rho=b/bhat后的完整sdot；边界层时变扰动应由卷积界得limsup，不能把sdot=0代进正弦扰动；电机ct平衡分母应是J0 Kp，Delta/beta仅积分项变化时间而非整体恢复下界。机器人耦合M要说明控制项归一化，不能任意对角力矩项就称逐项鲁棒。

苏绘：保留13个H2主题、五原Notebook/17cell和六题。替换两张旧概念图为可核SVG：负斜率滑面和sat/tanh/sgn曲线。保留四律四参数组件，导出真实计算模块；全步计算TV/带宽、绘图另抽稀，显示实际终时与恢复默认。

孙助：学习目标是能写s/名义与真实等效控制、证明到达上界、辨识归一化与匹配、读数值/采样局限、对比边界层和STA。原六题保留纠错；新增Notebook核全部手算/工程例和组件默认，不增加另一课。

柯验：沿用五实验参数和全部原工况；严格原始setup/cell，不改算法来制造好看结论。增加RK4各stage权重平均核验，区分端点采样的u与积分器实际施加的加权u；独立理想Filippov到达解、光滑sat/tanh DOP853、离散e/s递推、稳态/单位公式。到达实测为进入阈值带并保持，不冒称首次精确到零。

何疑：四律、四到达律、K扫描、六电机控制器均是固定配置观察，撤“综合最优/默认首选/只有一种自然选择”。至少保留三工况与落败/持平，电机恢复统一阈值并保留原自适应阈值另列；突变扰动不满足STA导数界，不签发总体保证。

秦构：原组件四步抽稀后算TV会漏换向，6s后仍做一次无记录更新，未到阈值却归因K不足，公式把二阶写成一阶。统一真实末时、全步指标、各律生效参数与默认算例。原NB5的大整型卷积用等价累计和求窗口计数，不改变指标但消除平方级运行代价。

[共识] 先保留并核正确内容，再按上述实际缺陷纠错；Phase2三轮、A/B/C/D、内核/Pyodide/独立实现/真实页面齐备后签发，只交付本课。

## Phase 2: 内容生成

### 第一轮 — 概念讲解

从推着有摩擦的滑块追赶位置指令进入“位置误差和速度误差如何合成s”，不把恒温器直接等同滑动。保留有限时间证明、二阶设计、到达律和四应用；推导统一e=x−xd、已知b归一化及单独的直接输入增益写法。原五实验及六题逐项保留，数值待实测。

### 第二轮 — 学生反馈

李稳：原稿把s为零和位置误差为零说得太接近。保留到达后e的指数尾，明确阈值带进入不是精确滑动；两种b写法必须在倒立摆与一般设计之间区分单位。RK4的端点记录与实际stage控制不一致，是最需要具体解释的实验现象。

赵工：恢复指标在加载刚发生时误差尚未出带，不能立即记已恢复而忽略随后跌落。统一0.002rad带应从首次出带后找连续0.3s；没出带记0，8s内未恢复须明确提示，不能只打印nans。六电机控制器的不同自适应带保留供历史对照，不再作为公平排名。

### 第三轮 — 调整完善

卫韧：补充电机名义sdot中的−20s，L=6/60只保留为实验配置标签，不假装满足含阶跃总扰动的导数界。机器人归一化切换项乘M后再推误差方程，buck限定理想CCM并核负载平均电流。Q5乘性运动学不确定性不套用加性正弦残差公式，Q4上限用严格2/3而非舍入后放宽。

秦构：保留五Notebook17cell用途，新增第六核验cell。NB1记录stage加权实际控制，NB5用等价累计和代替大整型卷积、统一事件恢复，组件保留全步TV/实际6s末时；两SVG替换旧概念图。编译拦截了新普通文字中未转义的小于号，已改为清楚中文；最终指纹将与原始内核/Pyodide重新对齐。

柯验：初次独立核48工况72048点最大状态差3.73e−12、平滑控制差1.40e−11，TV相对差5.65e−9；收紧测试容差为状态1e−7、TV相对1e−5并对终稿重跑。默认sat对连续DOP853的位置最大差约1.32e−4，步长减半约6.60e−5；保留一阶离散误差，不以代码自洽代替连续解验证。

## Phase 3: 内容审校

### 教授团队（学术准确性）

卫韧：复核到达域、Filippov集合值和名义切向动态，不把匹配不变性扩为模型无关。STA的s相对阶1与滑动阶数2分开；旧实验增益不称通用充分条件，阶跃不满足有限导数界。已知b归一化、直接输入k、力矩例的4倍因子逐处区分。

林矩：未知b的rho公式和有裕度充分条件由最坏边界36组代入核验；时变扰动用卷积/limsup而非瞬时平衡。Q4 Phi严格上限2/3，Q5乘性不确定性不套加性正弦传函。匹配投影消去扰动但保留f，独立符号和三维秩核4项通过。

### 工程团队（实践可行性）

赵工：电机额外线性误差反馈−20s、J0平衡分母、统一事件恢复窗口和积分项单独变化时间均明确。有限窗电压峰值低于24V只说明本配置未触限，不构成执行器余量通用保证。机器人切换项先经M归一化；buck为理想CCM的开关纹波，不称损耗和EMI自然消失。

### 验证团队（独立把关）

柯验：最终a4177570…原生六实验18cell全部执行；实际TS48工况72048点对独立e/s坐标递推，最大状态差3.72778e−12、平滑u差1.39054e−11，TV相对差5.64829e−9。sat/tanh另对连续DOP853，默认sat步长减半位置误差1.319664e−4→6.598285e−5；严格测试容差1e−7/1e−5并非根据图猜测。原始输出见A.2。

何疑：四律、四到达律、五K扫描和六电机控制器只放行固定配置观察，撤最优/默认首选/排他性断言。阈值进入、有扰动与无扰动精确零点、不同恢复带、不同尾窗不能混为同指标。C记录每组边界和落败/持平，不声称完成独立最优整定搜索。

秦构：全步TV与抽稀曲线分开，实际6s终时、不满足阈值不归因必然K不足、STA禁用无关K/Phi、恢复默认均落实。原五Notebook17cell用途保留，第六核验新增；等价累计和窗口计数保持原指标。最终页面及构建实际输出待B归档后签发。

### 体验与脉络（读者、历史与安全）

郑核代陆阅：从摩擦滑块的位置与速度可观察变化进入s，保留图示“先到面再沿面”的推理。开关温控不再直接当滑模证据；完整数学条件与工程约束分别解释，无新增语言角色或SKILL修改。

### 教学支持（教学质量）

孙助：原六题齐全，涵盖选面/等效控制、倒立摆量纲、有限时间证明、边界层、匹配性、幂次律；答案4不再把两上界当实际误差上下夹界，答案5不再跨模型套公式。手算工程数值统一由NB6复算。

### 学生审校（可读性）

李稳：能复述“到达s=0后，位置误差还要沿e'=−lambda e衰减”。理想有限时间、进入带并保持、最终上界与有限窗rms现在各有定义；RK4的端点u不能代表stage施加的u。

赵工：电机恢复明确未出带记0，观察窗未恢复明确提示；15/beta只约束v变化量，不能给整体误差恢复背书。

## Phase 4: 内容定稿

[待定] 无影响本课交付的未决项。原25项Python待办及W08/W09/W10维持原状态，不将本课通过扩为全站关闭。

[郑核-签发] 学术修改、50项A.1及原始A.2、何疑C六项、秦构B原九项及四补充、六题答案与D保留映射均已核实。最终源a4177570009f9fdb62ac8c520460d0bf3f2e82a74a146cbaca91c10d6f5b9362；原生与Pyodide均6实验18cell，48工况72048点与4符号/秩核验、真实页面及两构建通过。准予仅NONLINEAR-06进入master；真实commit另记checklist及acceptance，不发布Pages，不续做下一课。

## 附录 A：数值证据

### A.1 三方对账表（柯验）

组件为零参考镇定，NB2为正弦跟踪，统计窗口各列清楚；数值带、Filippov解和最终界不混用。组件没有显示的量写清原因。

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | 到达上界|s0|/(k−D) | NB1 s0=4.5,eta1.7，2.647058824s | 不显示理想到达界 | ✅ | 理论归一化模型；NB6独立复算 |
| 2 | 阈值带进入不是精确到达 | NB1 2.2609s；NB6理想精确2.269639216 | sat默认2.2662s | ✅ | 三者不同模型/阈值；原始数字保留不强行对等 |
| 3 | 到达后e指数衰减 | NB1拟合斜率−2.9949 | 显示轨迹，不显示拟合斜率 | ✅ | λ3，有限步长拟合容差.01，非精确恒等测量 |
| 4 | 端点与stage控制平均不同 | NB1 RK4端点误差1.1592/1.1493/1.1400 | 不显示RK4实验 | ✅ | dt1e−3/1e−4/1e−5；0.2s窗口，舍入5e−5 |
| 5 | RK4 stage平均误差随步长减小 | NB1 .006309/.000761/.000055 | 不显示 | ✅ | 同上；不推所有高阶方法定理 |
| 6 | Euler数值带随dt缩小 | NB1 band/dt 2.2934/2.2983/2.2982/2.2988 | 组件固定dt，不显示扫描 | ✅ | dt2e−4/1e−4/5e−5/2e−5；t>3，显示舍入 |
| 7 | Euler离散TV与步长相关 | NB1 TV·dt约10.8756/10.8730/10.8737/10.8728 | 默认TV另为sat | ✅ | 不同控制律、尾窗、步长不横向假配对 |
| 8 | 未知b充分不等式 | NB6 rho.5/1/2、A−3/0/3、符号及d端点36组通过 | 不显示未知b | ✅ | B2,D.3,eta.2，数学恒等与边界核 |
| 9 | 摆归一化g/l=19.6,b4 | NB6 19.6/4 | 不显示摆模型 | ✅ | m1,l.5,g9.8，绝对1e−12 |
| 10 | 摆k.5,D.1→eta1.6 | NB6 1.6 | 不显示 | ✅ | k为N·m；eta为rad/s²，绝对1e−12 |
| 11 | 摆s0=2.5，上界1.5625s | NB6 2.5/1.5625 | 不显示 | ✅ | θ0.5,w0，绝对1e−12 |
| 12 | 摆0.6s指数尾剩约5% | NB6 exp(−3)=.0497870684 | 不显示 | ✅ | 从到达状态起的比例，舍入.001 |
| 13 | 摆保守角界.01rad=.573deg | NB6 .01/.572957795 | 不显示 | ✅ | Phi.05/lambda5，最终界前提，舍入.001deg |
| 14 | 摆精细角界.002rad=.115deg | NB6 .002/.114591559 | 不显示 | ✅ | 力矩扰动同乘4后相消，舍入.001deg |
| 15 | 边界层界PhiD/K=.0075 | NB2 .0075，测得.007446 | 默认尾窗band.007442488 | ✅ | NB2正弦跟踪6..8与组件镇定4..6区别；均小于界，允许O(dt)偏差 |
| 16 | NB2四律固定配置精度 | NB2 rms 9.793e−6/9.051e−4/9.100e−4/9.657e−6 | 组件非同参考，不假配对 | ✅ | sgn/sat/tanh/STA，dt5e−5，6<t≤8，保留观察范围 |
| 17 | NB2四律离散TV | NB2 144372.35/6.19/6.19/6.36 | 不显示跟踪实验 | ✅ | 同上；TV为节点和，非能量或硬件损耗 |
| 18 | STA实验alpha/beta | NB2 1.837117/1.65 | STA切换后1.837/1.650 | ✅ | L1.5的实验配置，非通用充分条件，显示舍入 |
| 19 | 组件默认进入带2.2662 | NB6 2.2662 | 2.2662s | ✅ | s绝对值<.02连续.2s，dt2e−4；绝对1e−7s |
| 20 | 组件默认band | NB6 .00744248846135 | 7.442488e−3 | ✅ | 4<t≤6最大|s|；绝对5e−10 |
| 21 | 组件默认rms | NB6 .000831326388647 | 8.313264e−4 | ✅ | 5<t≤6；绝对5e−11 |
| 22 | 组件默认TV | NB6 1.85554752269 | 1.8555 | ✅ | 4<t≤6全步；绝对5e−5 |
| 23 | 组件实际末时6s | NB6 6，30000步 | 6.0s | ✅ | 无提前终止与额外未记录一步；精确 |
| 24 | 到达律无扰动解析时间 | NB3 2.6471/1.4722/2.1213 | 不显示其它到达律 | ✅ | const/exp/power s0=4.5；有扰动阈值时间不作等号 |
| 25 | 常值到达区间 | NB3 [2.250,3.214]s | 不显示 | ✅ | epsilon1.7，D.3；无噪声/无饱和理想上界 |
| 26 | 幂次最终带.0225 | NB3 .0225，e量级.0075 | 不显示 | ✅ | D.3,k2,alpha.5，最终界并非正弦rms |
| 27 | 四到达律有限窗观察 | NB3带进入2.6423/1.3901/2.0311/1.5655 | 不显示 | ✅ | dt5e−5，阈值.02保持.1s，非最优搜索 |
| 28 | 匹配秩条件 | NB4 ranks1/2/2，rankB1 | 不显示 | ✅ | 三组2×2实例；Q5另以独立3×3秩核 |
| 29 | 两扰动严格裕度阈值.6 | NB4 Dm+lambdaDu=.6 | 不显示不匹配对象 | ✅ | .3+3·.1；K.3不满足充分条件不等于永远失稳 |
| 30 | 本例不匹配残差不随K消失 | NB4 K1/2/4/8 rms均约.01631 | 不显示 | ✅ | 6..8有限窗；不是所有对象的普遍不变式 |
| 31 | 不匹配理想正弦幅值 | NB4 .023570226，周期rms .016666667 | 不显示 | ✅ | Du.1,lambda3,w3；有限窗rms.01631可不同 |
| 32 | 匹配/不匹配数值机理 | NB4 rms.016310 vs预测.016308，尾窗最大差3.436e−6 | 不显示 | ✅ | 原始dt5e−5，容差5e−6；预测非全状态轨迹等同 |
| 33 | 电机名义/真实参数不同 | NB5 J0 .01/J .011、B0 .1/B .12 | 不显示电机模型 | ✅ | 原配置+10%惯性，TC.05,Kt.5，保留无辨识前提 |
| 34 | 加载加速度13.64 | NB5原对象 .15/.011=13.63636 | 不显示 | ✅ | rad/s²；与控制器归一化15区分，舍入.01 |
| 35 | CT静止平衡−.0375 | NB5/NB6 −.15/(.01·400)=−.0375 | 不显示 | ✅ | 若w=0且tanh摩擦为0；不等于8s末值，绝对1e−12 |
| 36 | 负载名义量15 | NB5/NB6 .15/.01=15 | 不显示 | ✅ | STA积分变量单位rad/s²；绝对1e−12 |
| 37 | v若独自变15所需时间 | NB5/NB6 15/6.6=2.272727、15/66=.227273 | 不显示 | ✅ | 不是整体恢复下界，严格限定内部变量 |
| 38 | 电机统一事件恢复 | NB5 PID1.2269/CT未恢复/sgn0/sat0/STA6 2.7720/STA60 .3138s | 不显示 | ✅ | .002rad保持.3s，8s窗，未出带记0，绝对1e−4s |
| 39 | 电机6控制器固定窗误差 | NB5 postrms .0007672/.03545/.00003217/.0009146/.007551/4.768e−10 | 不显示 | ✅ | 5.5<t≤8；不作普遍排名，显示舍入 |
| 40 | 电压限幅本次未触发 | NB5最大1.21V<24V | 不显示 | ✅ | 指定工况，不能推出所有负载余量；舍入.01V |
| 41 | 航天器s0/eta/上界 | NB6 .0436332313/.002/21.81661565s | 不显示 | ✅ | J20,D.01,k.05,lambda.5,θ5deg；绝对1e−8 |
| 42 | buck占空比.5 | NB6 12/24=.5 | 不显示 | ✅ | 理想CCM周期稳态非一般动态等效控制，绝对1e−12 |
| 43 | buck峰峰纹波.6A | NB6 .6 | 不显示 | ✅ | 100µH/100kHz/12V，绝对1e−12 |
| 44 | buckCCM检查 | NB6平均2.4A>半纹波.3A | 不显示 | ✅ | 指定无损负载5Ω，不能抹去EMI损耗 |
| 45 | Q1 lambda5/eta.5 | NB6 5/.5/时间倍数2 | 不显示 | ✅ | D.5,k1的归一化例，绝对1e−12 |
| 46 | Q4 Phi两严格上限 | NB6 .1与2/3=.6666667 | 不显示 | ✅ | lambda10,k2,D.3,b1；严格小于，舍入不放宽2/3 |
| 47 | Q4在Phi2/3时细s界.1 | NB6 .09999999999999999 | 不显示 | ✅ | 纠旧固定.015，绝对1e−12 |
| 48 | Q5三维秩1/2 | reference.py独立S秩1/2 | 不显示 | ✅ | 第三行不确定匹配、第一行不匹配，精确整数秩 |
| 49 | Q6无扰动到达sqrt3 | NB6 1.73205080757s | 不显示 | ✅ | s0=3,k2,alpha.5；绝对1e−10 |
| 50 | Q6有扰动最终带.0225 | NB6 .0225 | 不显示 | ✅ | D.3,k2,alpha.5；不与任意Phi作无条件比较 |

### A.2 实测数据总表

| 来源 | 量 | 实测值 |
|---|---|---|
| reconciliation.json NB1/cell1/line1 | 原始输出 | eta = K - D = 1.70,  s(0) = 4.5000,  解析上界 t_r <= &#124;s(0)&#124;/eta = 2.6471 s |
| reconciliation.json NB1/cell1/line2 | 原始输出 | 阈值带进入时刻 = 2.2609 s；理想精确到达与此不是同一指标 |
| reconciliation.json NB1/cell1/line3 | 原始输出 | 滑动阶段 log&#124;x&#124; 斜率 = -2.9949，理论 -lambda = -3.0（滑动模态 e' = -lambda*e 成立） |
| reconciliation.json NB1/cell2/line1 | 原始输出 | 滑动段内 u 的 0.2s 窗口平均，应等于 u_eq - d（等效控制自动吸收扰动） |
| reconciliation.json NB1/cell2/line2 | 原始输出 | 积分格式            dt    max&#124;mean(u)-(u_eq-d)&#124; |
| reconciliation.json NB1/cell2/line3 | 原始输出 | euler        1e-03                   0.0124  stage-weighted error=0.012395 |
| reconciliation.json NB1/cell2/line4 | 原始输出 | euler        1e-04                   0.0009  stage-weighted error=0.000887 |
| reconciliation.json NB1/cell2/line1 | 原始输出 | euler        1e-05                   0.0001  stage-weighted error=0.000136 |
| reconciliation.json NB1/cell2/line2 | 原始输出 | rk4          1e-03                   1.1592  stage-weighted error=0.006309 |
| reconciliation.json NB1/cell2/line1 | 原始输出 | rk4          1e-04                   1.1493  stage-weighted error=0.000761 |
| reconciliation.json NB1/cell2/line1 | 原始输出 | rk4          1e-05                   1.1400  stage-weighted error=0.000055 |
| reconciliation.json NB1/cell2/line2 | 原始输出 | 比较端点控制平均与积分器实际stage加权控制平均；二者不可混用。 |
| reconciliation.json NB1/cell2/line3 | 原始输出 | 固定窗口与步长残差不是任意高阶方法失效的定理。 |
| reconciliation.json NB1/cell3/line1 | 原始输出 |        dt      max&#124;s&#124;   max&#124;s&#124;/dt       TV(u)   TV(u)*dt |
| reconciliation.json NB1/cell3/line2 | 原始输出 |     2e-04   4.587e-04      2.2934    54377.94    10.8756 |
| reconciliation.json NB1/cell3/line3 | 原始输出 |     1e-04   2.298e-04      2.2983   108729.94    10.8730 |
| reconciliation.json NB1/cell3/line1 | 原始输出 |     5e-05   1.149e-04      2.2982   217473.94    10.8737 |
| reconciliation.json NB1/cell3/line1 | 原始输出 |     2e-05   4.598e-05      2.2988   543641.94    10.8728 |
| reconciliation.json NB1/cell3/line2 | 原始输出 | => max&#124;s&#124;/dt 近似常数：带宽是 O(dt) 的纯数值现象； |
| reconciliation.json NB1/cell3/line3 | 原始输出 |    TV(u)*dt 近似常数：切换次数随 dt->0 发散，说明理想切换在物理上不可实现 |
| NB1/cell4 | 图片base64长度 | 108868 |
| reconciliation.json NB2/cell1/line1 | 原始输出 | STA 实验增益: alpha=1.837, beta=1.650  (L=&#124;d'&#124;<=1.50) |
| reconciliation.json NB2/cell1/line3 | 原始输出 |    控制律     到达t_r     稳态rms&#124;e&#124;     稳态max&#124;e&#124;      max&#124;s&#124;    TV(u)2s     u变号   max&#124;u&#124; |
| reconciliation.json NB2/cell1/line1 | 原始输出 |    sgn    1.7971    9.793e-06    1.641e-05   1.150e-04  144372.35   19208     4.54 |
| reconciliation.json NB2/cell1/line1 | 原始输出 |    sat    1.8066    9.051e-04    1.291e-03   7.446e-03       6.19       1     3.32 |
| reconciliation.json NB2/cell1/line1 | 原始输出 |   tanh    1.8149    9.100e-04    1.298e-03   7.500e-03       6.19       1     3.32 |
| reconciliation.json NB2/cell1/line1 | 原始输出 |    sta    2.4281    9.657e-06    1.387e-05   2.230e-08       6.36       1     3.43 |
| reconciliation.json NB2/cell2/line1 | 原始输出 | 理论对照： |
| reconciliation.json NB2/cell2/line2 | 原始输出 |   边界层保守界 &#124;e_ss&#124; <= Phi/lambda = 0.01667 |
| reconciliation.json NB2/cell2/line3 | 原始输出 |   精细界 &#124;s_ss&#124; <= Phi*D/K = 0.00750  ->  &#124;e_ss&#124; <= 0.002500 |
| reconciliation.json NB2/cell2/line4 | 原始输出 |   实测 sat 的 max&#124;s&#124; = 0.00745，与 Phi*D/K 之比 = 0.993 |
| reconciliation.json NB2/cell2/line5 | 原始输出 |   指定正弦/时间窗口与最终带上界分开；上界不要求被轨迹达到。 |
| reconciliation.json NB2/cell2/line7 | 原始输出 | 结论：sgn 精度最高但 TV(u) 达 1e5 量级（2s 内换号约 2 万次）； |
| reconciliation.json NB2/cell2/line8 | 原始输出 |       sat/tanh 把 TV(u) 降到个位数，代价是稳态误差抬高约两个量级； |
| reconciliation.json NB2/cell2/line9 | 原始输出 |       这里只比较当前四组增益、步长与窗口，不作通用最优结论。 |
| NB2/cell3 | 图片base64长度 | 125476 |
| reconciliation.json NB3/cell1/line1 | 原始输出 |     到达律     解析t_r     实测t_r             扰动区间   max&#124;u&#124;      TV到达段     稳态rms&#124;e&#124; |
| reconciliation.json NB3/cell1/line2 | 原始输出 |   const    2.6471    2.6423    [2.250,3.214]    2.476       1.18    2.556e-04 |
| reconciliation.json NB3/cell1/line1 | 原始输出 |     exp    1.4722    1.3901            (数值解)    8.503       8.73    4.500e-06 |
| reconciliation.json NB3/cell1/line2 | 原始输出 |   power    2.1213    2.0311            (数值解)    3.245       3.37    1.902e-03 |
| reconciliation.json NB3/cell1/line1 | 原始输出 |   mixed       nan    1.5655            (无闭式)    3.745       3.68    9.000e-06 |
| reconciliation.json NB3/cell2/line1 | 原始输出 | 纯幂次律残差带: 平衡时 k&#124;s&#124;^alpha=&#124;d&#124; => &#124;s&#124;_res=(D/k)^(1/alpha)=0.0225 |
| reconciliation.json NB3/cell2/line2 | 原始输出 |   对应误差量级 &#124;e&#124; ~ &#124;s&#124;_res/lambda = 0.0075（实测 rms&#124;e&#124;=1.90e-03，同量级） |
| reconciliation.json NB3/cell2/line3 | 原始输出 |   幂次最终带界与有限窗rms不是同一个量；mixed的理想滑动需足够常值裕度。 |
| reconciliation.json NB3/cell2/line5 | 原始输出 | 指数律最快(t_r=1.39s)但峰值最大(max&#124;u&#124;=8.50)； |
| reconciliation.json NB3/cell2/line6 | 原始输出 | mixed 律 t_r=1.57s、峰值 3.75、精度 9.0e-06，当前配置观察值，不作最优排名 |
| NB3/cell3 | 图片base64长度 | 113364 |
| reconciliation.json NB4/cell1/line1 | 原始输出 | xdot = A x + B u,  A = [[0.0, 1.0], [0.0, -0.5]] , B = [[0.0], [1.0]] |
| reconciliation.json NB4/cell1/line2 | 原始输出 | 匹配条件: 存在 E 使 dA = B E  <=>  rank[B, dA] = rank[B] |
| reconciliation.json NB4/cell1/line4 | 原始输出 | 不确定性                                  rank[B,dA]  rank[B]       判定 |
| reconciliation.json NB4/cell1/line5 | 原始输出 | dA1 阻尼不确定 (第2行第2列=-0.2)                        1        1       匹配 |
| reconciliation.json NB4/cell1/line6 | 原始输出 | dA2 耦合到 x1 通道 (第1行第2列=0.3)                     2        1      不匹配 |
| reconciliation.json NB4/cell1/line7 | 原始输出 | dA3 x1 自身不确定 (第1行第1列=0.2)                      2        1      不匹配 |
| reconciliation.json NB4/cell1/line9 | 原始输出 | => 只有落在 B 的列空间（即 x2 方程）里的不确定性才是匹配的 |
| reconciliation.json NB4/cell2/line1 | 原始输出 | 滑动条件 K > Dm + lambda*Du = 0.60 |
| reconciliation.json NB4/cell2/line3 | 原始输出 |      K      仅匹配 rms&#124;e&#124;       仅不匹配 rms&#124;e&#124;       两者都有 rms&#124;e&#124;      TV(u)匹配      TV(u)不匹配 |
| reconciliation.json NB4/cell2/line1 | 原始输出 |    0.3       3.566e-01           0.37019           0.38882          0.9           0.2 |
| reconciliation.json NB4/cell2/line1 | 原始输出 |    1.0       4.432e-06           0.01631           0.01631      64374.8       64946.9 |
| reconciliation.json NB4/cell2/line1 | 原始输出 |    2.0       1.859e-06           0.01631           0.01631     144377.9      144950.0 |
| reconciliation.json NB4/cell2/line1 | 原始输出 |    4.0       1.912e-06           0.01631           0.01631     304387.9      304956.0 |
| reconciliation.json NB4/cell2/line1 | 原始输出 |    8.0       2.431e-06           0.01631           0.01631     624408.0      624968.0 |
| reconciliation.json NB4/cell3/line1 | 原始输出 | K=2.0, 仅不匹配扰动: |
| reconciliation.json NB4/cell3/line2 | 原始输出 |   实测稳态 rms&#124;e&#124;            = 0.016310 |
| reconciliation.json NB4/cell3/line3 | 原始输出 |   由 e'=-lambda e+d_u 预测    = 0.016308 |
| reconciliation.json NB4/cell3/line4 | 原始输出 |   最大偏差 max&#124;e-e_pred&#124;      = 3.436e-06  <- 机理确认 |
| reconciliation.json NB4/cell3/line5 | 原始输出 |   解析幅值 Du/sqrt(lambda^2+w^2) = 0.023570 (w=3), 对应 rms = 0.016667 |
| reconciliation.json NB4/cell3/line7 | 原始输出 | 同样 K=2.0, 仅匹配扰动有限窗 rms&#124;e&#124; = 1.859e-06 |
| reconciliation.json NB4/cell3/line8 | 原始输出 | K 从 1 加到 8: 不匹配残差 0.01631 -> 0.01631 (不变), |
| reconciliation.json NB4/cell3/line9 | 原始输出 |               而 TV(u) 64947 -> 624968 (约 10 倍) |
| reconciliation.json NB4/cell3/line10 | 原始输出 | => 在本例理想滑动的面上方程里，不匹配扰动仍保留；数字实现另有步长偏差。 |
| NB4/cell4 | 图片base64长度 | 102524 |
| reconciliation.json NB5/cell1/line1 | 原始输出 | STA(L=6): alpha=3.674, beta=6.60;  STA(L=60): alpha=11.619, beta=66.00 |
| reconciliation.json NB5/cell1/line3 | 原始输出 | 控制器                     过渡max&#124;e&#124;      加载前rms      加载跌落      加载后rms      恢复时间      TV(u)  max&#124;u&#124; |
| reconciliation.json NB5/cell1/line1 | 原始输出 |   common band=0.002 rad, hold=.3s, event recovery=1.2269s; original band=0.0057513 |
| reconciliation.json NB5/cell1/line2 | 原始输出 | PID                       0.0169   2.876e-03    0.0098   7.672e-04     0.866        1.9    0.59 |
| reconciliation.json NB5/cell1/line1 | 原始输出 |   common band=0.002 rad, hold=.3s, event recovery=未在8s窗口内恢复; original band=0.00915802 |
| reconciliation.json NB5/cell1/line2 | 原始输出 | 计算力矩                      0.0222   4.579e-03    0.0368   3.545e-02       nan        1.5    0.58 |
| reconciliation.json NB5/cell1/line1 | 原始输出 |   common band=0.002 rad, hold=.3s, event recovery=未出带，记0s; original band=0.002 |
| reconciliation.json NB5/cell1/line2 | 原始输出 | 计算力矩+sgn                  0.0000   5.644e-06    0.0000   3.217e-05     0.000   199879.0    1.21 |
| reconciliation.json NB5/cell1/line1 | 原始输出 |   common band=0.002 rad, hold=.3s, event recovery=未出带，记0s; original band=0.002 |
| reconciliation.json NB5/cell1/line2 | 原始输出 | 计算力矩+sat                  0.0005   7.431e-08    0.0009   9.146e-04     0.000        1.5    0.59 |
| reconciliation.json NB5/cell1/line1 | 原始输出 |   common band=0.002 rad, hold=.3s, event recovery=2.7720s; original band=0.002 |
| reconciliation.json NB5/cell1/line2 | 原始输出 | 计算力矩+STA(L=6)             0.0089   8.685e-04    0.0191   7.551e-03     2.772        2.2    0.59 |
| reconciliation.json NB5/cell1/line1 | 原始输出 |   common band=0.002 rad, hold=.3s, event recovery=0.3138s; original band=0.002 |
| reconciliation.json NB5/cell1/line2 | 原始输出 | 计算力矩+STA(L=60)            0.0004   4.449e-09    0.0049   4.768e-10     0.314       34.0    0.59 |
| reconciliation.json NB5/cell2/line1 | 原始输出 | 机理核对： |
| reconciliation.json NB5/cell2/line2 | 原始输出 |   纯计算力矩静止平衡 e = -T_LOAD/(J0*Kp) = -0.0375 rad；有限8s末值不等于平衡 |
| reconciliation.json NB5/cell2/line3 | 原始输出 |   STA 积分项速率上限 = beta，抵消负载需 v 变化 15.00 rad/s^2： |
| reconciliation.json NB5/cell2/line4 | 原始输出 |     L=6  (beta=6.6) => 仅v独自变化相应量的时间 2.27 s |
| reconciliation.json NB5/cell2/line5 | 原始输出 |     L=60 (beta=66.0) => 仅v独自变化相应量的时间 0.23 s |
| reconciliation.json NB5/cell2/line6 | 原始输出 |   电压峰值 1.21 V，远小于限幅 24.0 V（本工况执行器余量充足） |
| NB5/cell3 | 图片base64长度 | 146420 |
| reconciliation.json NB6/cell1/line1 | 原始输出 | Q1 lambda,eta,time multiplier= 5.0 0.5 2.0 |
| reconciliation.json NB6/cell1/line2 | 原始输出 | pendulum g/l,b,eta,s0,tr,decay= 19.6 4.0 1.6 2.5 1.5625 0.049787068367863944 |
| reconciliation.json NB6/cell1/line3 | 原始输出 | pendulum conservative/fine rad,degree= 0.01 0.5729577951308232 0.0020000000000000005 0.11459155902616468 |
| reconciliation.json NB6/cell1/line4 | 原始输出 | Q4 Phi limits, fine s at Phi=2/3= 0.1 0.6666666666666666 0.09999999999999999 |
| reconciliation.json NB6/cell1/line5 | 原始输出 | Q6 tr,residual band= 1.7320508075688772 0.0225 |
| reconciliation.json NB6/cell1/line6 | 原始输出 | space s0,eta,tr= 0.04363323129985824 0.002 21.81661564992912 |
| reconciliation.json NB6/cell1/line7 | 原始输出 | buck duty,ripple,mean current,half ripple= 0.5 0.6 2.4 0.3 |
| reconciliation.json NB6/cell1/line8 | 原始输出 | motor equilibrium, nominal load, v-only scales= -0.0375 15.0 2.272727272727273 0.22727272727272727 |
| reconciliation.json NB6/cell1/line9 | 原始输出 | ideal exact reach, bound= 2.26963921600694 2.6470588235294117 |
| reconciliation.json NB6/cell1/line10 | 原始输出 | Explorer default reach,band,rms,tv,last= 2.2662 0.0074424884613545515 0.0008313263886469036 1.8555475226907796 6.0 |
| reconciliation.json NB6/cell1/line11 | 原始输出 | input gain inequality boundary checks= 36 |

独立核原始结果：{"pass_": true, "cases": 48, "points": 72048, "maxStateDifference": 3.727779450104372e-12, "maxSmoothDifference": 1.390532133882516e-11, "maxTVRelativeDifference": 5.648288574044376e-09, "continuous": {"sat": 0.00013196640411783367, "sat_refinement": [0.00013196640411783367, 6.598284560366263e-05], "tanh": 0.00013151815572265413}, "symbolicChecks": 4, "idealReach": 2.26963921600694, "reachBound": 2.6470588235294117, "motorEquilibrium": -0.0375}

## 附录 B：前端交付硬门槛实际输出（秦构）

证据根目录.agent/semester-03/nonlinear-06/，最终源a4177570…；均为实际执行。

| 原九项 | 实际命令/操作 | 输出与结果 |
|---|---|---|
| 1 build通过 | npm run build；npm run build:pages | 退出0/0，Compiled successfully；205课9旧入口；build.log/pages-build.log |
| 2 curl页面HTTP200 | curl预热；npm run verify -- nonlinear/sliding-mode-control | 退出0，HTTP200；verify.log |
| 3 H2=catalog | verify+真实DOM+validate.mjs | 13H2逐项一致，44旧ID保留，56目录目标均存在，无重复ID |
| 4 KaTeX错误0 | verify与实际DOM | katex-error0 |
| 5 原始cell/严格执行 | node scripts/nb-cells.mjs verify nonlinear/sliding-mode-control --require-kernel --out .agent/semester-03/nonlinear-06/notebooks.json | 退出0；EXECUTED，6Notebook18cell，FAIL0/SKIPPED0；Pyodide6/6，最终指纹一致 |
| 6 单一注册 | verify第4项+check | SlidingModeExplorer沿用lib/wiki-components.ts；无副本 |
| 7 显式引用 | rg及verify | 正文显式SlidingModeExplorer一次 |
| 8 固定轴/无动画/Option/默认 | verify第5项+实际TS+UI | 相图x±2/速度±8，时图t0..6/y±6；animation:false、useMemo EChartsOption、inline布局；默认到达2.2662、带7.442488e−3、rms8.313264e−4、TV1.8555；四律及K.5/D.6边界、STA禁用K/Phi、恢复逐项通过 |
| 9 无widgets | strict S2 | PASS，无ipywidgets/interact |

| 四补充 | 实际输出 |
|---|---|
| kernel ID全局唯一S8 | strict PASS；NB2/NB5/NB6同时运行完成；browser.json |
| cell首行无magic S1 | PASS |
| display math独占行 | npm run math:check退出0；verify显示74个$且配平、无同行违规 |
| JSX属性无逗号S3 | strict/verify PASS |

其它实测：17/17路由/标题/Pages测试；术语PASS3/WARN2/FAIL0（既有C2b/C4）。Python policy退出0：73课355实验、330启用25保留，原25待办与pending-before.json逐字相同。两SVG及两输出PNG加载，console warn/error0；375px视口clientWidth=scrollWidth=360，desktop.png/narrow.png已检查。validate.mjs退出0：源/纯模块/组件指纹、6标签=6提取=6页面实验、18cell与旧ID完整。全局check退出0 PASS21/WARN2/FAIL0；check-semester03退出0，提交前merged43，真实提交后再登记。

## 附录 C：红队放行记录（何疑）

| 正文对比断言 | 基线整定 | ≥3工况 | 失败/持平 | 放行? | 备注 |
|---|---|---|---|---|---|
| Euler/RK4端点与实际施加控制的诊断 | 同对象/初值/窗口，非方法最优排名 | 两方法×三步长，另四步长带宽 | 端点RK4错误大，但stage加权误差随细化减小 | ✅ | 只纠记录口径，撤只许一阶方法的定理 |
| 四律精度与TV | 原四组增益，未独立最优搜索 | 四律，同对象与正弦任务 | STA较慢，sat/tanh有限误差，sgn TV大 | ✅ | 固定配置观察，六秒组件镇定另列，不称默认赢家 |
| 四到达律 | 原参数保留，不同峰值预算公开 | 常值/指数/幂次/混合 | 指数峰值高、power留界、mixed无闭式 | ✅ | 无扰动精确零点不与有扰动带进入当等号 |
| 匹配/不匹配K扫描 | 同输出、滑面、对象、两个扰动 | K .3/1/2/4/8，各三扰动组合 | K.3有限窗未达，K增大不删除面上du | ✅ | 不外推所有不匹配对象；有限窗rms不等于整周期值 |
| 六电机控制器 | 原增益保留，无最优搜索 | 一个明确对象/加载事件，属于限定观察 | CT8s未恢复，STA6慢，PID统一带1.2269，sat未出带 | ✅ | 不作方法优劣排名；原自适应带与统一带分列，阶跃破坏STA导数界 |
| 组件离散与连续解 | 实际TS对独立e/s离散及DOP853 | 48工况，默认sat两步长，sat/tanh连续 | 保留一阶误差，未以同算法复制自证 | ✅ | 实际全步TV，边界参数K不足不伪称必然失稳 |

## 附录 D：审计与保留映射

| 原资产 | 审计证据 | 处理 | 当前去向 | 验证 |
|---|---|---|---|---|
| 13H2/44旧ID | source-before、baseline-headings | 主题保留，短标题、别名 | 本课/catalog/legacy-anchors | 真实编译与DOM |
| NB1四cell | 端点控制误当stage施加控制，绝对方法禁令 | 原实验保留，增加stage平均与实际末时 | NB1 | 原始运行/Filippov解 |
| NB2三cell | 四律固定配置被扩为通用排名 | 保留，说明窗口与STA条件 | NB2 | 原始运行、连续光滑核 |
| NB3三cell | 无扰动解析与扰动阈值混用 | 保留四律，撤综合最优 | NB3 | 解析/实际输出 |
| NB4四cell | K低有限窗未达被当“压不住”，有限窗rms混整周期 | 保留全部K和三扰动组合，限定本滑面 | NB4 | 原始输出/投影/正弦解 |
| NB5三cell | 恢复带不一致、大整型卷积、错误静差与恢复下界 | 保留六控制器，等价累计和、统一事件恢复 | NB5 | 原始运行/平衡代数 |
| 六题及答案 | b量纲、时变边界层、Q4舍入、Q5跨模型 | 保留纠错，不删题 | 原六题/NB6 | 独立数学与实跑 |
| 两旧概念图 | 需要可核曲线和轴意义 | 替换为理想解/控制映射SVG | 两新SVG；旧素材文件未删 | 实际加载/窄屏 |
| 原四律组件 | TV抽稀、末步额外更新、未入带误归因、缺重置 | 导出真实纯模块；全步指标、真实末时和生效参数 | SlidingModeExplorer/sliding-mode.ts | 48工况72048点及UI |
| 名义滑动/不确定性/应用四例 | 模型无关、STA阶数、机器人M、buck混称 | 保留并明确假设/单位/范围 | 对应原主题 | 来源/符号与手算 |

无原实验、习题或应用案例迁出/悬空；原文件全文及旧日志保留。未迁另一课；25Python待办和W08/W09/W10不提前关闭。

运行合同：NB1默认x0=(1.5,0)、lambda3/K2/D.3、0..6s，RK4主轨dt1e−4，平均实验Euler/RK4 dt1e−3/1e−4/1e−5与四步长数值带，窗口.2s；NB2正弦参考.5sin2t、扰动.3sin5t，dt5e−5、0..8、尾窗6..8；NB3同对象0..6、dt5e−5、四原增益，到达带.02持续.1s；NB4 lambda3、Dm.3/Du.1、K五值、dt5e−5、0..8、尾窗6..8；NB5 J0/J=.01/.011、B0/B=.1/.12、Tc.05、Kt.5、±24V、加载.15N·m@4s、dt5e−5、0..8，原带与统一.002rad带均保留。组件零参考、dt2e−4、0..6，全步指标/每20步图点。确定性实验无随机种子；每cell预算180s，全部在预算内完成。
