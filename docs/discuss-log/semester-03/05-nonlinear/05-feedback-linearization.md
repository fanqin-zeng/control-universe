# NONLINEAR-05 反馈线性化

- 日期：2026-10-18；学期：semester-03；类型：theory；模式：重构。
- 路径：nonlinear/feedback-linearization；起点：6382b170fa677e1f363c0250d121ac2dcd6c41fb。
- 旧稿及完整实验：.agent/semester-03/nonlinear-05/source-before.mdx、original-notebooks.json；旧semester-01日志不回写。
- 本日志角色表示结构化审查视角，不是实际外部专家或并行Agent。

## 出席与沉默表

郑核（主持/签发）、苏绘（图示）、孙助（习题）、柯验（独立数值）、卫韧（非线性主责）、林矩（坐标与控制）、李稳（理论读者）、赵工（工程读者）、何疑（比较）、秦构（实现验收），共10个视角。数值执行归秦构，柯验另用解析/独立积分仲裁。

[沉默-陈控：非线性主责由卫韧承担，线性控制核对由林矩承担。]
[沉默-方数：所需符号条件由林矩及独立符号核承担。]
[沉默-周联：本课理想对象的工程边界由赵工检查，无硬件接入。]
[沉默-何仿：保留原实验合同与代码，执行由秦构承担，柯验独立仲裁。]
[沉默-吴规：本课无真实规划器接口，输入限制由赵工核查。]
[沉默-陆阅：theory课型，阅读与档案检查由李稳及郑核代执行。]
[沉默-许史：本课核原定理与对象，未作控制史论述。]
[沉默-范安：不交付硬件或安全等级结论，模型边界由主责核查。]
[沉默-小初：本课选择李稳作为理论读者，保留具体卡点反馈。]
[沉默-钱锐：本课高级条件由林矩核查，比较由何疑仲裁。]
[沉默-林码：本课不引入学习算法或软件背景专属前置。]
[沉默-岳自：本课非math章，已列数学先修。]
[沉默-轮值：theory课型，无行业实现交付；机械臂仅作明确假设的动力学例。]

## Phase 1: 内容规划

卫韧：原稿有三项优先错误：全状态线性化的对合条件误用满秩分布，应检查少一阶的n−1维分布；跟踪手算例代入e=y−yd后符号反向；计算力矩惯性缩放下阻尼比与跟踪强迫项不对。先修复这些，再核旧实验和答案。

林矩：保留15个H2主题、四原Notebook/12cell、五题；相对阶定义保留邻域恒零要求。球梁的丢弃项在原点为三阶，光滑闭环Jacobian Hurwitz可证明局部指数稳定，不能说只能“论证级”。全局微分同胚需要给显式逆，不能只凭Jacobian非零。机械臂向量相对阶应为(2,…,2)，总和2n，不是单输出r=2n。

苏绘：开篇从托住电动摆杆的重力补偿进入“先补偿已知力，再设计加速度”；画真实SVG。保留零动态调参，改为可复核的解析闭环曲线，显示末时/隐藏状态与实际控制量，a=0切换到r=2解释，恢复默认。静态推导与实验不强制增加交互图。

孙助：学习目标为能计算Lie导数/相对阶、写正确跟踪反馈、区分输出与内部稳定、检查全状态线性化条件、说明近似与模型误差边界。原五题保留纠错；新增一题核惯性缩放的跟踪误差。

柯验：保留原四实验全部用途，干净内核逐cell运行。新增符号/答案核验与惯性缩放实验。零动态对独立矩阵指数；摆三实验对DOP853；球梁同初值独立积分并检查成功、终止时刻、约束距离。正文数值逐项列A.1，积分精度与机器精度分开。

何疑：摆控制器同一对象、同一增益比较只能说明本配置残差，不能宣称Jacobian普遍劣或误差无法随增益减小。保留正负镇定、正弦跟踪、慢外环三组，公开Jacobian更快工况；再以三档跟踪增益检查原强断言。模型缩放至少−10%、0、+10%，不以单个模型误差推出普遍鲁棒性。

秦构：原组件初值1.5与正文1不一致；提前停止却无末时说明，clamp掩盖数值，a=0被错误说成系统无解。将数值放纯模块供真实实现验证。保留全部旧标题ID，以共享渲染标题流水线与实际DOM验收。工作范围仅本课、组件、引用元数据和必要台账。

[共识] 保留15主题、四原实验和五题，按审计纠错；新增增益敏感性、模型缩放及答案核验，真实数值/页面通过后再签发。

## Phase 2: 内容生成

### 第一轮 — 概念讲解

按审计矩阵开始修改：先推导误差符号、对合条件、球梁局部线性部分与机械臂误差方程，再保留并修正实验。数值尚未实跑，不预填结果或签发。

### 第二轮 — 学生反馈

李稳：初稿仍容易把“输出线性”理解成“全状态都安全”。要求保留零动态的定义式和非零输出两组实验，a=0解释为需要换成r=2控制，而不是系统无解。二维对合条件的理由必须是由g张成的一维分布，不能再说满维空间自动对合。

赵工：机械臂失配中必须区分定值目标与加速轨迹。把重力误差写成随q变化的残差，明确正负号；球梁需要真实倾角全范围和输入峰值，丢弃项比值不能当稳定性证书。末采样点不能叫精确稳态。

### 第三轮 — 调整完善

卫韧：在现稿加入光滑闭环Hurwitz Jacobian的局部指数稳定论证；保留球梁完整模型的r=3系数2x1x4及邻域条件，解释为什么原点不能直接跳到r=4。正确的全状态条件引用Khalil第23讲第13页，明确少一阶分布。修复习题2的下一阶系数4x2+2x1²、习题4的x2=2sinh(2t)，并由显式逆确认全局坐标例。

秦构：原四实验12cell全部保留用途；NB3新增三档带宽测试，NB5惯性三工况，NB6手算/答案/组件默认核验，共6实验15cell。初次编译抓到正文裸花括号及Callout收尾同行问题，已按MDX语法修复；既有旧锚点必须先映射到新标题才能编译，保留42旧ID，不删旧别名。严格内核已执行15cell；最终数字与页面等待独立验收，不预签。

苏绘：15个主题保留并改短标题。零动态图使用与正文一致x(0)=(1,0)，解析模型直接计算输出避免大数相消，不裁剪数值，只裁剪显示窗口；显示t=10的y、x1、u，按钮可恢复默认。SVG标出测量角度、补偿项和虚拟加速度。

## Phase 3: 内容审校

### 教授团队（学术准确性）

卫韧：已核对相对阶的邻域条件、n−1维分布对合、局部与全局坐标区别；球梁完整相对阶退化与三阶余项、Hurwitz间接法分开。机械臂限定全驱动关节坐标，向量相对阶总和2n，不把任务空间奇异当M奇异。惯性缩放含参考加速度强迫项，重力残差符号统一e=q−qd。

林矩：手算跟踪误差代入符号已改，Q2下一阶系数与Q4速度因子修正；Q5显式逆光滑而非仅靠Jacobian非零推全局。独立SymPy核9项符号恒等，计算细节在reference.py，不把有限积分当定理证明。

### 工程团队（实践可行性）

赵工：本课摆与球梁无输入限幅、噪声和参数辨识过程，因此不称硬件性能保证。零动态图明确巨大u不可实现；球梁完整倾角范围、峰值输入和分母距离公开。模型缩放的常数、同号与正对角增益条件写明，不外推一般鲁棒性。

### 验证团队（独立把关）

柯验：实际TS模块40工况20040点对独立expm，最大归一化误差7.05947e−12；原摆轨迹对误差坐标DOP853最大状态差4.63947e−9，球梁对z坐标DOP853差2.27644e−9。原四Notebook十二cell用途保留，新增三cell，六Notebook十五cell严格执行；输出取本次实跑，不继承历史日志数字。

何疑：不放行“Jacobian误差无法靠增益减小”和全域优劣结论，正文已删除。相同外环增益的三实验只能显示残差，不是最优控制器排名；新增带宽3/6/12和模型缩放−10%/0/+10%均保留，含持平与落败工况。放行范围见C。

秦构：原组件的初值、早停、clamp和a=0解释均已纠正。当前纯模块的真实实现被调用，默认/边界/恢复及最终构建和DOM待附录B记录齐备后才签发。

### 体验与脉络（读者、历史与安全）

郑核代陆阅：开篇以手托电动摆杆说明角度、重力转矩与电机补偿，再问“剩余输入能否决定加速度”，图中的测量、补偿和输出一一对应。先走输出主线，再读全状态及案例，未引入新的润色角色或修改SKILL。

### 教学支持（教学质量）

孙助：原五题去向完整，新增模型缩放题。基础Lie导数、相对阶退化、跟踪控制、零动态、坐标变换与失配边界均有题；原答案符号、系数和速度因子都进入Notebook6与独立符号核验。

### 学生审校（可读性）

李稳：能复述“输出每求一次导数就看输入是否出现；第一次出现且系数非零时可反解”。a=0改变输出结构，需要r=2反馈，不能说系统没解。原点邻域恒零与单点为零已用球梁和Q2区别。

赵工：同增益的图不能直接作两方案排名；计算力矩定值目标与加速轨迹的误差不同，输入约束检查仍需另外做。

## Phase 4: 内容定稿

[待定] 无影响本课正确性的未决项；W08/W09/W10及25项Python待办保持，未把它们算成本课已修。

郑核：柯验A.1共50条均通过，未显示的组件路线有明确原因；A.2原始输出齐备。卫韧/林矩的定理、符号与局部/全局边界已落实；何疑C表限定所有比较，孙助六题配对，苏绘真实SVG/默认和窄屏对应，秦构B九项及四补充全部通过。郑核代陆阅核查四份档案，真实浏览器并行工具栏/42旧ID与聚合验证齐备。

[郑核-签发] NONLINEAR-05「反馈线性化」Phase 1–4完成。仅本课，实际提交进入master后记录hash；本轮不发布Pages，不操作中文润色分支，不冒称用户已精读或外部专家已评审。

## 附录 A：数值证据

### A.1 三方对账表（柯验）

正文数值、原始输出和组件读数分清解析/有限网格/积分精度。组件仅显示零动态参数与末时状态，其它数量不假造组件路线。

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | 阻尼摆Lgh=0 | NB1/c1 0 | 不显示该导数 | ✅ | 解析及中心差分；绝对1e-9 |
| 2 | Lfh=x2=-0.4 | NB1/c1 -0.400000000012 | 不显示 | ✅ | x=(.7,-.4)；绝对1e-9 |
| 3 | LgLfh=1 | NB1/c1 .9999778783 | 不显示 | ✅ | 嵌套差分eps1e-6；正文公开误差，绝对5e-5 |
| 4 | Lf²h=−sin(.7)+.4 | NB1/c1 −.2442490654；解析−.2442176872 | 不显示 | ✅ | 嵌套差分绝对5e-5 |
| 5 | ad_f g=(-1,1) | NB1/c1 [-1,1] | 不显示 | ✅ | 中心差分绝对1e-8 |
| 6 | v=3对消后y″=3 | NB1/c2 u3.244218，y″3，差分误差1.53e-12 | 不显示 | ✅ | 绝对1e-8 |
| 7 | 抛物线轨迹误差低于1e-10 | NB1/c3 最大3.552714e-15 | 不显示 | ✅ | t0..2，200点，独立解析 |
| 8 | 跟踪符号e=y−yd | NB6 e.5,de−.7,u1.58；恒等式通过 | 不显示 | ✅ | 给定状态及参考的代入，绝对1e-12 |
| 9 | 零动态特征值−1/a | NB2/c1 斜率−1/−2/−4/+2/+1 | 默认−1.00 | ✅ | a1/.5/.25/−.5/−1；拟合1..5s绝对5e-5 |
| 10 | 快衰减相对误差不统一是1e−11 | NB2/c1 a.25最大2.94e-6 | 不显示 | ✅ | 不以积分容差充误差界 |
| 11 | a−.5时x1(8)=cosh16≈4.4e6 | NB2/c3 4443055.2604；NB6 4443055.260254 | a−.5可选，默认不显示 | ✅ | 相对1e-9；不是输出收敛的有限精度证据 |
| 12 | x2(8)=2sinh16 | NB6 8886110.520508 | 不显示 | ✅ | 修复旧漏乘2；解析绝对1e-6 |
| 13 | y(8)=e−16 | NB6 1.125351747e-7；NB2原积分8.7834e-5 | 不显示 | ✅ | 正文区分解析与大数相消；方法数值偏差已公开 |
| 14 | 组件默认t10 y | NB6 2.061153622e-9 | 2.061154e-9 | ✅ | a1 x0=(1,0)；6位指数显示绝对5e-16 |
| 15 | 组件默认t10 x1 | NB6 9.079779837e-5 | 9.079780e-5 | ✅ | 绝对5e-11 |
| 16 | 组件默认t10 u | NB6 9.079985896e-5 | 9.079986e-5 | ✅ | 绝对5e-11 |
| 17 | a=0应使用r=2而非系统无解 | Q4 a0时Lgh0、LgLfh1 | a0显示另一反馈律 | ✅ | 定义与空曲线分支，无伪造积分 |
| 18 | 全状态例det=(1+x1²)³ | NB6三状态验证；reference.py符号恒等 | 不显示 | ✅ | 解析恒等，局部条件 |
| 19 | z2=x2(1+x1²)，逆光滑 | NB6 三状态dz=[z2,.6] | 不显示 | ✅ | Q5数值绝对1e-12；符号另核 |
| 20 | Lf²lambda=x1x2(1+x1²)(2x2+1) | reference.py符号差0；NB6控制代回 | 不显示 | ✅ | 解析恒等不以采样代证明 |
| 21 | theta1rad时sin近似相对差18.8% | NB6 18.83951058% | 不显示 | ✅ | 相对真值；舍入.1个百分点 |
| 22 | theta1.5rad时相对差50.4% | NB6 50.37669564% | 不显示 | ✅ | 修旧50.6%；舍入.1个百分点 |
| 23 | 摆镇定IOL网格ts1.95s | NB3/c1 1.95244055 | 不显示 | ✅ | ±1rad，800点0..8，2%初值相对带，绝对.01s |
| 24 | 摆镇定Jac网格ts1.82s | NB3/c1 1.82227785 | 不显示 | ✅ | 同上，保留Jac更快 |
| 25 | Jac偏离设计轨迹.059rad | NB3/c1 .0590 | 不显示 | ✅ | 同上；绝对.0001rad |
| 26 | 跟踪IOL末段为积分精度 | NB3/c2 4.83859e-10rad | 不显示 | ✅ | 12<t≤20；不称机器精度 |
| 27 | Jac末段最大约3.7度 | NB3/c2 .06425981rad=3.68deg | 不显示 | ✅ | 12<t≤20，4000点；显示舍入 |
| 28 | Jac增益增加使误差减小 | NB3/c4 带宽3/6/12：.06426/.02238/.006459rad | 不显示 | ✅ | 同对象/参考/初值，绝对5e-6rad，有限配置观察 |
| 29 | 慢外环Jac超调约41% | NB3/c3 41.3343%，min−.6200rad | 不显示 | ✅ | theta0=1.5，wn.5，0..40，800点 |
| 30 | 初角割线刚度4.02 | NB6 4.020040107 | 不显示 | ✅ | rad/s² per rad；粗估而非沿途固定刚度 |
| 31 | 初角割线k0≈4.27，阻尼比≈.24 | NB3/c3 对应输出 | 不显示 | ✅ | 只描述初角割线，不声称固定闭环阻尼比 |
| 32 | 球梁r·thetadot²为原点三阶项 | reference.py真实变换导数恒等 | 不显示 | ✅ | 原点Jacobian为零，数学结构 |
| 33 | 球梁线性闭环(s+2)^4 | NB4增益16/32/24/8；NB6 roots近−2 | 不显示 | ✅ | 重根数值分裂不是理论极点改变 |
| 34 | 球梁网格ts约5.50s | NB4/c1 5.50 | 不显示 | ✅ | 1200点0..12，位置带.008m，绝对.01s |
| 35 | 球梁倾角范围[−.118,.350] | NB4/c1 −.117514/.350000 | 不显示 | ✅ | rad，舍入.001rad |
| 36 | 球梁最大输入8.066 | NB4/c1 8.066182635 | 不显示 | ✅ | rad/s²，网格峰值绝对.001 |
| 37 | 球梁mincos≈.939 | NB4/c1 .939372713 | 不显示 | ✅ | 当前轨迹分母距离，绝对.001 |
| 38 | 丢弃项峰值.2117 | NB4/c3 .211682646 | 不显示 | ✅ | m/s²，t≈.21，绝对5e-5 |
| 39 | 主项峰值3.3638 | NB4/c3 3.363827491 | 不显示 | ✅ | m/s²；两峰时间可不同，绝对5e-5 |
| 40 | 两峰值之比6.3% | NB4/c3 6.3% | 不显示 | ✅ | 不作全时瞬时界 |
| 41 | 带掩码瞬时最大比15.2% | NB4/c3 .152274688 | 不显示 | ✅ | t≤6且主项>.2m/s²；绝对.1个百分点 |
| 42 | 惯性+10%两个因子均1.049 | NB5 sqrt1.1=1.048808848 | 不显示 | ✅ | 常数缩放、定值目标、正对角增益；绝对.001 |
| 43 | 惯性三缩放末段误差 | NB5 −.1/0/+.1峰 .022518865/0/.017983749 | 不显示 | ✅ | qd=sin t，30<t≤40，闭式振幅误差<2e-6 |
| 44 | Q1控制u=v−Lf²h | NB6三状态代回v=.6 | 不显示 | ✅ | 绝对1e-12及符号核 |
| 45 | Q2下一系数4x2+2x1² | NB6 x1=0,x2=1时为4；符号恒等 | 不显示 | ✅ | 低阶系数非邻域恒零，不能据此跳阶 |
| 46 | Q3 u≈−9.950 | NB6 −9.949961458 | 不显示 | ✅ | theta.9,w.4；绝对.001 |
| 47 | Q3 uJ=−10.65，差约−.70 | NB6 −10.65/−.700038542 | 不显示 | ✅ | 绝对.001 |
| 48 | Q3相对真值差14.9% | NB6 14.89455921% | 不显示 | ✅ | theta.9，舍入.1个百分点 |
| 49 | Q3 theta1.4时近似差42% | NB6 42.06711488% | 不显示 | ✅ | 舍入1个百分点 |
| 50 | Q6 c1.1时强迫项−.1sin t | NB5闭式与积分峰 .01798375 | 不显示 | ✅ | 方程代数恒等，误差绝对2e-6 |

### A.2 实测数据总表

| 来源 | 量 | 实测值 |
|---|---|---|
| reconciliation.json NB1/cell1/line1 | 原始文本 | 状态点 x0 = [ 0.7 -0.4] |
| reconciliation.json NB1/cell1/line3 | 原始文本 | L_g h 数值 = 0.0  手算 = 0 |
| reconciliation.json NB1/cell1/line4 | 原始文本 | L_f h 数值 = -0.40000000001150227  手算 = -0.4 |
| reconciliation.json NB1/cell1/line5 | 原始文本 | L_g L_f h 数值 = 0.9999778782798785  手算 = 1 |
| reconciliation.json NB1/cell1/line6 | 原始文本 | L_f^2 h 数值 = -0.24424906541753444  手算 = -0.244217687237691 |
| reconciliation.json NB1/cell1/line8 | 原始文本 | ad_f g 数值 = [-1.  1.]  手算 = [-1, 1] |
| reconciliation.json NB1/cell2/line1 | 原始文本 | 指令 v = 3.0 |
| reconciliation.json NB1/cell2/line2 | 原始文本 | 控制量 u = 3.244218 |
| reconciliation.json NB1/cell2/line3 | 原始文本 | 解析 y'' = L_f^2 h + L_g L_f h * u = 3.0 |
| reconciliation.json NB1/cell2/line4 | 原始文本 | 数值 y''（二阶差分）= 3.0 |
| reconciliation.json NB1/cell2/line5 | 原始文本 | 偏差 = 1.5347723092418164e-12 |
| NB1/cell3 | 实际图片base64长度 | 68536 |
| reconciliation.json NB1/cell3/line1 | 原始文本 | 最大偏差 = 3.552713678800501e-15 |
| reconciliation.json NB2/cell1/line1 | 原始文本 | 零动态直接仿真：log&#124;x1&#124; 的斜率应精确等于特征值 -1/a |
| reconciliation.json NB2/cell1/line2 | 原始文本 |      a       -1/a      log&#124;x1&#124;斜率         &#124;y&#124;max     &#124;y&#124;/&#124;x1&#124; 最大值 |
| reconciliation.json NB2/cell1/line3 | 原始文本 |   1.00     -1.000        -1.0000       2.22e-16         4.48e-14 |
| reconciliation.json NB2/cell1/line4 | 原始文本 |   0.50     -2.000        -2.0000       1.94e-16         3.16e-11 |
| reconciliation.json NB2/cell1/line5 | 原始文本 |   0.25     -4.000        -4.0000       1.11e-16         2.94e-06 |
| reconciliation.json NB2/cell1/line6 | 原始文本 |  -0.50      2.000         2.0000       3.38e-08         2.51e-13 |
| reconciliation.json NB2/cell1/line7 | 原始文本 |  -1.00      1.000         1.0000       3.98e-13         1.32e-15 |
| reconciliation.json NB2/cell1/line9 | 原始文本 | 稳定方向的x1接近零后，相对误差会放大；请读实际表格，而非把求解器容差当成误差界。 |
| reconciliation.json NB2/cell2/line1 | 原始文本 | 闭环仿真：v = -2y，x(0) = (1, 0) |
| reconciliation.json NB2/cell2/line2 | 原始文本 | a=+1.00  特征值 -1/a = -1.00  &#124;  y(8)=1.125e-07  x1(8)=+6.7081e-04  最小相位 |
| reconciliation.json NB2/cell2/line3 | 原始文本 | a=+0.25  特征值 -1/a = -4.00  &#124;  y(8)=1.125e-07  x1(8)=+2.2507e-07  最小相位 |
| reconciliation.json NB2/cell2/line4 | 原始文本 | a=-0.50  特征值 -1/a = +2.00  &#124;  y(8)=8.783e-05  x1(8)=+4.4431e+06  非最小相位 |
| reconciliation.json NB2/cell2/line5 | 原始文本 | a=-1.00  特征值 -1/a = +1.00  &#124;  y(8)=1.125e-07  x1(8)=+1.9873e+03  非最小相位 |
| NB2/cell2 | 实际图片base64长度 | 90316 |
| reconciliation.json NB2/cell3/line1 | 原始文本 | x1(8) 仿真 = 4443055.2604    解析 cosh(16) = 4443055.2603    相对误差 = 2.63e-11 |
| reconciliation.json NB2/cell3/line2 | 原始文本 | y(8)  仿真 = 8.7834e-05   解析 e^(-16)  = 1.1254e-07 |
| reconciliation.json NB2/cell3/line4 | 原始文本 | y(8) 对不上，不是控制律失效，而是浮点相消： |
| reconciliation.json NB2/cell3/line5 | 原始文本 |   y = x1 + a*x2 是两个约 1e6 量级数的相减，x1 的相对误差 1e-11 |
| reconciliation.json NB2/cell3/line6 | 原始文本 |   放大成 y 的绝对误差约 8.8e-05，远大于 e^(-16)=1.1e-07 本身。 |
| reconciliation.json NB2/cell3/line7 | 原始文本 | 工程启示：非最小相位系统里内部状态一旦发散，输出量的数值精度（乃至物理测量精度）都会崩塌。 |
| reconciliation.json NB3/cell1/line1 | 原始文本 | === 实验一：镇定，theta0 = +/-1.0 rad（约 +/-57 度），设计双重极点 -3 === |
| reconciliation.json NB3/cell1/line2 | 原始文本 | theta0=+1.0  IOL: ts= 1.95s  与设计解析解最大偏差 = 3.21e-10 rad |
| reconciliation.json NB3/cell1/line3 | 原始文本 |              Jac: ts= 1.82s  与设计解析解最大偏差 = 0.0590 rad |
| reconciliation.json NB3/cell1/line4 | 原始文本 | theta0=-1.0  IOL: ts= 1.95s  与设计解析解最大偏差 = 3.21e-10 rad |
| reconciliation.json NB3/cell1/line5 | 原始文本 |              Jac: ts= 1.82s  与设计解析解最大偏差 = 0.0590 rad |
| reconciliation.json NB3/cell1/line7 | 原始文本 | 残余项 R(theta) = G*(sin(theta) - theta)：闭环里没被抵消掉的部分 |
| reconciliation.json NB3/cell1/line8 | 原始文本 |  theta(rad)    R(rad/s^2)         等效附加刚度 |
| reconciliation.json NB3/cell1/line9 | 原始文本 |         0.2        -0.016           0.08 |
| reconciliation.json NB3/cell1/line10 | 原始文本 |         0.6        -0.424           0.71 |
| reconciliation.json NB3/cell1/line11 | 原始文本 |         1.0        -1.902           1.90 |
| reconciliation.json NB3/cell1/line12 | 原始文本 |         1.5        -6.030           4.02 |
| reconciliation.json NB3/cell1/line13 | 原始文本 | 设计的 k0 = 9.00，附加刚度与之同量级 -> 当前残差改变了设计误差方程 |
| reconciliation.json NB3/cell2/line1 | 原始文本 | === 实验二：跟踪 theta_d = 0.8*sin(1.5*t) === |
| reconciliation.json NB3/cell2/line2 | 原始文本 | IOL: 12<t<=20s max&#124;e&#124; = 4.839e-10 rad（本次积分容差下） |
| reconciliation.json NB3/cell2/line3 | 原始文本 | Jac: 12<t<=20s max&#124;e&#124; = 0.06426 rad = 3.68 度，rms = 0.04043 rad |
| NB3/cell2 | 实际图片base64长度 | 102144 |
| reconciliation.json NB3/cell3/line1 | 原始文本 | === 实验三：外环调慢（设计 omega_n=0.5, zeta=1，理论无超调），theta0=1.5 rad === |
| reconciliation.json NB3/cell3/line2 | 原始文本 |       IOL 越过目标的最大幅度 =   0.00%   2%调节时间 =  11.71s   theta_min = +0.0000 rad |
| reconciliation.json NB3/cell3/line3 | 原始文本 |  Jacobian 越过目标的最大幅度 =  41.33%   2%调节时间 =   5.96s   theta_min = -0.6200 rad |
| reconciliation.json NB3/cell3/line4 | 原始文本 | 初始角割线近似：附加刚度 4.02 使初角割线估计 k0 由 0.25 升至 4.27，zeta 由 1.00 降到 0.24 |
| NB3/cell3 | 实际图片base64长度 | 42604 |
| reconciliation.json NB3/cell4/line1 | 原始文本 | Jac bandwidth,max error,rms= 3.0 0.0642598145412474 0.040427547473243855 |
| reconciliation.json NB3/cell4/line1 | 原始文本 | Jac bandwidth,max error,rms= 6.0 0.02237971246078374 0.012779313890543473 |
| reconciliation.json NB3/cell4/line2 | 原始文本 | Jac bandwidth,max error,rms= 12.0 0.00645895774548233 0.0035539635420851834 |
| reconciliation.json NB4/cell1/line1 | 原始文本 | 初值: r=0.40 m, rdot=0.00, theta=0.35 rad (20.1 deg), thetadot=0.00 |
| reconciliation.json NB4/cell1/line2 | 原始文本 | t=12s 时: r=-0.00000, theta=0.00000, &#124;u&#124;max=8.066 |
| reconciliation.json NB4/cell1/line3 | 原始文本 | r 的网格2%调节时间 = 5.50 s |
| reconciliation.json NB4/cell1/line4 | 原始文本 | 梁倾角范围 = [-0.118, 0.350] rad (cos 最小值 0.939，远离奇异) |
| NB4/cell2 | 实际图片base64长度 | 79896 |
| reconciliation.json NB4/cell3/line1 | 原始文本 | 被丢弃项峰值 = 0.2117 m/s^2（出现在 t = 0.21 s） |
| reconciliation.json NB4/cell3/line2 | 原始文本 | 保留项峰值   = 3.3638 m/s^2 |
| reconciliation.json NB4/cell3/line3 | 原始文本 | 峰值之比     = 6.3% |
| reconciliation.json NB4/cell3/line4 | 原始文本 | t<=6s 且 &#124;z3&#124;>0.2 时段内的最大瞬时比值 = 15.2% |
| reconciliation.json NB4/cell3/line6 | 原始文本 | 两个峰值通常不在同一时刻；瞬时比值只在上述掩码内定义。 |
| reconciliation.json NB4/cell3/line7 | 原始文本 | 这些数只描述当前轨迹，不证明全时段比值<20%，也不确定吸引域。 |
| reconciliation.json NB5/cell1/line1 | 原始文本 | delta,frequency factor,damping factor,late peak,exact= -0.1 0.9486832980505138 0.9486832980505138 0.022518865261121467 0.022518867455552247 |
| reconciliation.json NB5/cell1/line2 | 原始文本 | delta,frequency factor,damping factor,late peak,exact= 0.0 1.0 1.0 0.0 0.0 |
| reconciliation.json NB5/cell1/line3 | 原始文本 | delta,frequency factor,damping factor,late peak,exact= 0.1 1.0488088481701516 1.0488088481701516 0.017983748804591995 0.01798375003164016 |
| NB5/cell1 | 实际图片base64长度 | 74188 |
| reconciliation.json NB5/cell1/line1 | 原始文本 | constant gravity residual: (hat_g-g)/M=.3, Kp=4 -> e_ss= 0.075 |
| reconciliation.json NB6/cell1/line1 | 原始文本 | Q3 sin,u,uJ,diff,pct= 0.7833269096274834 -9.9499614577649 -10.65 -0.7000385422351005 14.894559211300585 |
| reconciliation.json NB6/cell1/line2 | 原始文本 | angle,linearization percent,residual,secant stiffness= 0.2 0.6697909534468804 -0.015968030459265536 0.07984015229632768 |
| reconciliation.json NB6/cell1/line3 | 原始文本 | angle,linearization percent,residual,secant stiffness= 0.6 6.2619318012635095 -0.4242903192595753 0.7071505320992921 |
| reconciliation.json NB6/cell1/line4 | 原始文本 | angle,linearization percent,residual,secant stiffness= 1.0 18.839510577812124 -1.902348182305242 1.902348182305242 |
| reconciliation.json NB6/cell1/line5 | 原始文本 | angle,linearization percent,residual,secant stiffness= 1.4 42.06711488128312 -4.974603240138477 3.553288028670341 |
| reconciliation.json NB6/cell1/line6 | 原始文本 | angle,linearization percent,residual,secant stiffness= 1.5 50.37669563700873 -6.030060160751347 4.020040107167564 |
| reconciliation.json NB6/cell1/line7 | 原始文本 | Explorer a,t,x1,y,x2,u= 1.0 0.0 1.0 1.0 0.0 -2.0 |
| reconciliation.json NB6/cell1/line8 | 原始文本 | Explorer a,t,x1,y,x2,u= 1.0 8.0 0.0006708127206303045 1.1253517471925912e-07 -0.0006707001854555852 0.0006709250293222795 |
| reconciliation.json NB6/cell1/line9 | 原始文本 | Explorer a,t,x1,y,x2,u= 1.0 10.0 9.079779837134727e-05 2.061153622438558e-09 -9.079573721772483e-05 9.079985896352082e-05 |
| reconciliation.json NB6/cell1/line10 | 原始文本 | Explorer a,t,x1,y,x2,u= 0.5 0.0 1.0 1.0 0.0 -4.0 |
| reconciliation.json NB6/cell1/line11 | 原始文本 | Explorer a,t,x1,y,x2,u= 0.5 8.0 1.913097970227405e-06 1.1253517471925912e-07 -3.6011255910162917e-06 6.752117372461605e-06 |
| reconciliation.json NB6/cell1/line12 | 原始文本 | Explorer a,t,x1,y,x2,u= 0.5 10.0 4.3284226071209714e-08 2.061153622438558e-09 -8.244614489754232e-08 1.5664767887394799e-07 |
| reconciliation.json NB6/cell1/line13 | 原始文本 | Explorer a,t,x1,y,x2,u= 0.25 0.0 1.0 1.0 0.0 -8.0 |
| reconciliation.json NB6/cell1/line14 | 原始文本 | Explorer a,t,x1,y,x2,u= 0.25 8.0 2.2507033677435267e-07 1.1253517471925912e-07 -4.501406482203742e-07 9.002812964407311e-07 |
| reconciliation.json NB6/cell1/line15 | 原始文本 | Explorer a,t,x1,y,x2,u= 0.25 10.0 4.122307240628762e-09 2.061153622438558e-09 -8.244614472760815e-09 1.648922894552163e-08 |
| reconciliation.json NB6/cell1/line16 | 原始文本 | Explorer a,t,x1,y,x2,u= -0.5 0.0 1.0 1.0 -0.0 4.0 |
| reconciliation.json NB6/cell1/line17 | 原始文本 | Explorer a,t,x1,y,x2,u= -0.5 8.0 4443055.260253992 1.1253517471925912e-07 8886110.520507758 -39481462319119.3 |
| reconciliation.json NB6/cell1/line18 | 原始文本 | Explorer a,t,x1,y,x2,u= -0.5 10.0 242582597.70489514 2.061153622438558e-09 485165195.4097903 -1.1769263244817962e+17 |
| reconciliation.json NB6/cell1/line19 | 原始文本 | Explorer a,t,x1,y,x2,u= -1.0 0.0 1.0 1.0 -0.0 2.0 |
| reconciliation.json NB6/cell1/line20 | 原始文本 | Explorer a,t,x1,y,x2,u= -1.0 8.0 1987.3053247319972 1.1253517471925912e-07 1987.305324619462 -3947395.1481596623 |
| reconciliation.json NB6/cell1/line21 | 原始文本 | Explorer a,t,x1,y,x2,u= -1.0 10.0 14684.310529871833 2.061153622438558e-09 14684.310529869772 -215614291.42714465 |
| reconciliation.json NB6/cell1/line22 | 原始文本 | Q4 x1(8),x2(8),y(8)= 4443055.260253993 8886110.52050776 1.1253517471925912e-07 |
| reconciliation.json NB6/cell1/line23 | 原始文本 | exact critical 2percent settling= 3.0 1.944640567305797 |
| reconciliation.json NB6/cell1/line24 | 原始文本 | exact critical 2percent settling= 0.5 11.667843403834782 |
| reconciliation.json NB6/cell1/line25 | 原始文本 | tracking e,de,u= 0.49999999999999994 -0.7 1.58 |
| reconciliation.json NB6/cell1/line26 | 原始文本 | Q1,Q2,Q5 x,drift1,drift2,z,dz= -1.0 0.3 -3.4414709848078964 0.78 [-1.   0.6] [0.6 0.6] |
| reconciliation.json NB6/cell1/line27 | 原始文本 | Q1,Q2,Q5 x,drift1,drift2,z,dz= 0.7 -0.4 0.7702176872376909 -0.0719999999999999 [ 0.7   -0.596] [-0.596  0.6  ] |
| reconciliation.json NB6/cell1/line28 | 原始文本 | Q1,Q2,Q5 x,drift1,drift2,z,dz= 2.0 1.0 20.90929742682568 10.0 [2. 5.] [5.  0.6] |
| reconciliation.json NB6/cell1/line29 | 原始文本 | Q2 next coefficient at x1=0,x2=1= 4.0 |
| reconciliation.json NB6/cell1/line30 | 原始文本 | ball beam linear poles= [-2.0004383 +0.j         -1.99999997+0.00043827j -1.99999997-0.00043827j |
| reconciliation.json NB6/cell1/line31 | 原始文本 |  -1.99956176+0.j        ] |

独立核输出：{"pass_": true, "cases": 40, "points": 20040, "maxComponentRelativeError": 7.059469044938226e-12, "symbolicChecks": 9, "maxPendulumStateError": 4.639464368239032e-09, "maxBallStateError": 2.2764345408710085e-09, "pendulum": [{"kind": "IOL", "wn": 3, "x0": 1, "T": 8, "settling": 1.9524405506883604, "overshoot": 0}, {"kind": "Jac", "wn": 3, "x0": 1, "T": 8, "settling": 1.8222778473091366, "overshoot": 0}, {"kind": "IOL", "wn": 3, "x0": -1, "T": 8, "settling": 1.9524405506883604, "overshoot": null}, {"kind": "Jac", "wn": 3, "x0": -1, "T": 8, "settling": 1.8222778473091366, "overshoot": null}, {"kind": "IOL", "wn": 0.5, "x0": 1.5, "T": 40, "settling": 11.714643304130163, "overshoot": 0}, {"kind": "Jac", "wn": 0.5, "x0": 1.5, "T": 40, "settling": 5.957446808510638, "overshoot": 41.3342976425507}, {"kind": "IOL", "wn": 3, "tracking": true, "peak": 4.838591194378239e-10, "rms": 1.1092950318746339e-10}, {"kind": "Jac", "wn": 3, "tracking": true, "peak": 0.0642598145412474, "rms": 0.040427547473243855}, {"kind": "Jac", "wn": 6, "tracking": true, "peak": 0.02237971246078374, "rms": 0.012779313890543473}, {"kind": "Jac", "wn": 12, "tracking": true, "peak": 0.00645895774548233, "rms": 0.0035539635420851834}], "ball": {"dropPeak": 0.21168264568256362, "keptPeak": 3.363827491137978, "maskRatio": 0.1522746880597983, "minCos": 0.9393727128473789}, "ballRange": [-0.11751409569754649, 0.35], "ballMaxInput": 8.066182634986827}

## 附录 B：前端交付硬门槛实际输出（秦构）

证据根目录.agent/semester-03/nonlinear-05/，最终源5e3547bc…；以下均为实际运行，不用初次原生内核成功替代MDX页面验收。

| 原九项 | 实际命令/操作 | 输出与结果 |
|---|---|---|
| 1 build通过 | npm run build；npm run build:pages | 退出0/0，Compiled successfully；Pages205课/9旧入口；build.log/pages-build.log |
| 2 curl页面HTTP200 | curl预热；npm run verify -- nonlinear/feedback-linearization | 退出0，HTTP200；verify.log |
| 3 H2=catalog | verify+真实DOM+validate.mjs | H1=1，15H2逐项一致，42旧ID保留，所有侧栏目标存在，无重复ID |
| 4 KaTeX错误0 | verify与实际DOM | katex-error0 |
| 5 原始cell/严格执行 | node scripts/nb-cells.mjs verify nonlinear/feedback-linearization --require-kernel --out .agent/semester-03/nonlinear-05/notebooks.json | 退出0；EXECUTED、6Notebook/15cell、FAIL0/SKIPPED0；Pyodide6/6全部放行，最终指纹一致 |
| 6 单一注册 | verify第4项+check | ZeroDynamicsExplorer沿用lib/wiki-components.ts；未增注册副本 |
| 7 显式引用 | rg及verify | 正文显式ZeroDynamicsExplorer一次 |
| 8 固定轴/无动画/Option/默认 | verify第5项+实际TS+UI | x0..10/y−6..6；animation:false，useMemo EChartsOption；默认y2.061154e−9、x1 9.079780e−5、u9.079986e−5；a±2、0、−.1及恢复实际核 |
| 9 无widgets | strict S2 | PASS，无ipywidgets/interact |

| 四补充 | 实际输出 |
|---|---|
| kernel ID全局唯一S8 | strict结构PASS；原NB1、新NB5、NB6同时运行均完成；browser.json |
| cell首行无magic S1 | PASS |
| display math独占行 | npm run math:check退出0；verify显示114个$$且配平、无同行违规 |
| JSX属性无逗号S3 | strict/verify PASS |

其它实际结果：17/17路由/标题/Pages测试；glossary PASS3/WARN2/FAIL0（原C2b/C4）；Python policy退出0，73课354实验329启用25保留。原25待办与pending-before.json逐字相同。页面SVG及两张运行PNG均加载；console warn/error0。375px视口clientWidth=scrollWidth=360，desktop.png/narrow.png真实截图已检查。validate.mjs退出0，源/纯模块/组件指纹、6标签=6提取=6页面实验、15cell及旧锚点一致。全局check退出0 PASS21/WARN2/FAIL0；check-semester03退出0，提交前merged42，实际提交回执后43。

## 附录 C：红队放行记录（何疑）

| 正文对比断言 | 基线整定 | ≥3工况 | 失败/持平 | 放行? | 备注 |
|---|---|---|---|---|---|
| 同增益下IOL与Jac补偿的指定轨迹 | 同一外环增益，未称各自最优 | ±1镇定、正弦跟踪、慢外环 | Jac镇定更快；小角/精确模型可接近 | ✅ | 仅观察残差，禁止方法排名；无噪声/饱和/失配 |
| Jac误差随本组三档带宽减小 | 3/6/12外环频率明确 | 三个带宽同初值/参考/窗口 | 原“增益无效”断言被推翻 | ✅ | 不保证任意加大增益；未测输入/噪声代价，正文说明 |
| 惯性缩放改变加速轨迹误差 | 相同Kp=Kd4，隔离常数惯性缩放 | −.1/0/+.1 | 0无误差、两非零缩放有误差 | ✅ | 不是一般参数鲁棒性排名 |
| 零动态正负与a0分支 | 同一y反馈、初值和时域 | 40非零a及a0 | a0需换r2控制，无伪响应 | ✅ | 解析解及定义；显示窗裁切非数值截断 |
| 球梁丢弃项与保留项 | 同一真实轨迹，未独立比较优化器 | 非算法优劣，不适用整定扫描 | 近零分母不纳入瞬时比 | ✅ | 限定观察，不把6.3%/15.2%作全域误差或稳定界 |

## 附录 D：原资产去向与纠错

| 原位置/资产 | 审计证据 | 处理 | 目标位置/去向 | 验证方式 |
|---|---|---|---|---|
| 15个H2主题与42旧ID | source-before/baseline-headings | 保留、短标题、旧别名 | 当前15H2与legacy-anchors | 真实编译与DOM |
| 原NB1三cell | original-notebooks | 保留方向差分/恒等式/轨迹用途，公开差分误差 | NB1 | 原始内核/Pyodide、解析 |
| 原NB2三cell | 原零流形、闭环、浮点相消 | 保留且撤相对误差统一容差说法 | NB2 | 干净内核、矩阵指数 |
| 原NB3三cell | 同增益比较与过强结论 | 保留三实验，改首次入带采样定义；增三带宽cell | NB3四cell | 误差坐标DOP853、正文边界 |
| 原NB4三cell | 球梁完整对象与比值 | 保留，纠三阶/局部稳定、角范围、掩码解释 | NB4 | 独立z坐标DOP853 |
| 原五题及答案 | 跟踪符号、Q2系数、Q4速度、Q5对合 | 保留纠错，增第六题 | 六题/答案/NB6 | 符号与数值 |
| 全状态定理 | 满维对合为空条件 | 纠为n−1维分布，引用原讲义 | 全状态一节 | Khalil23第13页 |
| 计算力矩案例 | 向量相对阶、阻尼缩放、强迫项、重力符号 | 保留纠错，新增三缩放实验 | 计算力矩/NB5 | 解析传递函数与积分 |
| 原零动态组件 | 初值1.5、早停无说明、clamp、a0无解 | 改同初值解析曲线及真实末值/恢复 | 实际TS模块与组件 | 40工况20040点及浏览器 |
| 坐标例和应用范围 | 仅Jacobian推出全局、任务奇异混淆 | 给显式逆、限定关节坐标 | 当前例与边界 | 符号/显式逆/来源 |

无内容迁移到另一课，无原实验或习题悬空；历史日志不回写。原始输出、有限仿真与理论证明分开。最终构建、实际页面与聚合验证均已完成；仅待实际master提交回执。

实际运行合同复核：NB1 x0=(.7,−.4)，v3，短时.02s/max_step1e−4与2s/200点；NB2定义式0..6/601点，斜率1..5s，闭环0..8/801点，rtol1e−11/atol1e−13；NB3 G12/B2，镇定0..8与慢环0..40各800点，跟踪0..20/4000点、统计12..20，rtol=atol=1e−9；NB4 G9.81，x0=(.4,0,.35,0)，0..12/1200点、相同1e−9容差，瞬时比掩码t≤6且主项>.2；NB5三缩放0..40/4001点、统计30..40，rtol1e−10/atol1e−12。均为确定性模型，无随机种子。独立DOP853采用更紧容差及不同坐标；未做硬件限幅或噪声实验。各原始setup/cell执行预算180秒，全部在预算内。
