# IMPL-04 · 控制器部署 · 学期3讨论记录

日期2026-10-24；rank1；新写，目标MDX不存在，无旧正文搬运。只交付本课。角色是结构化审查视角，不冒充真实外部专家。
出席10人：郑核、苏绘、孙助、柯验、秦构、周联（工程主责）、何仿、赵工、林码、何疑。
[沉默-林矩：本课局部一阶代数与离散极点由周联核条件，不新增理论课。]
[沉默-陆阅：由郑核代核可读性与四份档案。]
其余角色不属于本课impl矩阵追加范围。

## Phase 1 内容规划

郑核：用户明确指定IMPL-04；先修为离散化方法、控制系统架构、数值方法、数字PID，均已交付。新写材料不复制先修正文，聚焦从设计到程序的接口、系数、状态、字长、时序与验收；不提前交付嵌入式驱动或实时调度课程。

周联：贯穿对象为电机回路中的一阶补偿器C(s)=2/(.2s+1)，不是被控电机模型。四个目标：①生成并核对带符号约定的差分系数；②以状态与逐拍向量复现设计；③定义有限字长与舍入并检验零输入残留；④将真实输出延迟放回闭环，并给出部署/回退证据。独立的比例闭环反例必须明确不是该补偿器的闭环。

林码：分母a1与递推反馈系数的正负号最容易抄反；初始化不能只写“清零”。赵工：PC模拟通过不等于板上验收；样本时间戳、实际输出和旧参数/状态恢复必须记录。

苏绘：9个H2：部署前冻结接口 / 从连续补偿器到差分系数 / 系数和状态如何进入程序 / 有限字长的验证 / 把真实时序放回闭环 / 部署验收与回退 / 小结 / 习题 / 答案。SVG画采样到输出与状态提交；Explorer调采样周期、位数、阶跃/正负脉冲/零输入衰减，双曲线与误差读数；Notebook1系数/逐拍向量，Notebook2定点/残留，Notebook3闭环延迟。四题依次对应系数、状态、量化、时序/交接。

何仿：冻结计算合同：K=2、τ=.2s，默认Ts=.02s，双线性变换，无预扭曲，u[k]=a u[k−1]+b(e[k]+e[k−1])；80拍k=0..79，当前输入立即入式，输出时刻kTs。阶跃全1；正负脉冲k<20为1、20..39为−1、之后0；衰减输入全0，u[-1]=.25、e[-1]=0，另两工况双历史为0。教学定点为有符号16位、F=4/8/12（组件4..12）、系数和初值最近舍入/半值远离零，宽整数乘加后一次舍入与饱和，存储前才量化，不模拟某款芯片指令。Ts组件.01..1? 决定上限.1s（.01步长），离线核验.01/.02/.05/.1s；全部时域与容差待测。

何仿：独立时序反例：x[k+1]=A x[k]+B u[k]、A=e^(−Ts)、B=1−A，连续对象1/(s+1)，比例增益固定12，r=0、x0=.1，额外延迟状态v0=0；Ts=.02/.1/.2三工况，60拍；无额外延迟极点A−12B，额外一拍矩阵[[A,−12B],[1,0]]。只看这份固定增益对时序变化的敏感性，不作整定方法排名。

柯验：主补偿器用精确有理数/独立scipy.signal.bilinear+lfilter对照实际TS计算函数；固定整数路径逐点全等，浮点1e-11。闭环极点用独立矩阵eigvals及直接递推核对，默认/边界至少各一。原始MDX setup/cells真Jupyter、页面原生UI及Pages Pyodide执行，绝不SKIPPED签发。舍入后的指标误差5.1e-5。全部测量待执行。

何疑：限定实现敏感性观察，预先给出三输入、多字长、三周期时序反例；报告量化残留、可失稳和持平结果，禁止“某种方法总更好”。孙助：四题含符号约定、非零历史首拍、F=8零输入残留与一拍延迟；答案全部由相应Notebook复算。郑核：先运行最小例，再扩写，不先填实测数。

## Phase 2 内容生成
### 第一轮：最小实验与概念讲解
何仿：已先运行独立Fraction/整数与SciPy最小实验，见minimal-experiment.json；默认a=19/21、b=2/21、F8阶跃末拍1.98046875；零输入残留.01953125；Ts=.1的一拍延迟谱半径1.0686210664。再据实扩写正文，不预设结果。周联：明确补偿器与独立比例闭环是两个不同实验，不能把其中的稳定性结论混用。
### 第二轮：学生反馈
林码：连续严格真有理补偿器在t=0的阶跃值不是0吗，为何首拍却是2/21？孙助：零输入上界只有公式，半格误差怎么积成这个值需要一句推导。赵工：程序重放和板上重放已分开，但切换工况是否沿用上个状态也必须直说。
### 第三轮：调整完善
周联：在“系数和状态如何进入程序”补双线性变换后的直接项与连续t=0值区别，统一参考模型和输出时刻，不能拿精确ZOH判本例首拍。何仿：正文“有限字长”已明确每次切换工况从对应初态重跑；孙助反馈写入η误差递推、初态衰减和几何级数说明。修改不改变代码与测量合同，最终源码哈希后重新绑定真内核/浏览器证据。

秦构：原生浏览器初次发现新组件导入仍指向上一课模块；目录的名称登记检查不足以证明模块正确导出。修正本课注册路径与隔离快照生成函数，未改前课组件；修后真实DOM恢复H1=1/H2=9、canvas=1，默认/三输入/边界/恢复读数通过。原生三个Notebook实际运行六cell，JSON输出与三幅图出现。此为未交付草稿的Phase2修订，不虚报已上线返工。375px夹具文档宽度/滚动宽度360/360、chart331，指标表在360px容器内部滚动，无全局溢出。

## Phase 3 内容审校
### 教授组
周联：连续补偿器和离散递推的首拍约定、分母/正反馈符号、状态初值与更新顺序已明确。零输入舍入界附无饱和/|aq|<1条件与几何级数理由，未当跟踪误差通界。独立比例闭环用精确ZOH对象和二阶延迟矩阵核极点，不能从补偿器稳定推完整闭环稳定。
### 工程组
何仿：16位存储、F、宽乘加、最后一次舍入与饱和的顺序与代码一致，负半格使用远离零规则。36配置覆盖四周期/三字长/三输入，整数路径逐点核验；不声称CMSIS或处理器性能实测。赵工：PC/目标程序/板上/硬件在环层级边界、时间戳、异常判停、状态与版本回退均写入正文。
### 验证组
柯验：实际TS36配置共14976个数值对精确Fraction/整数与SciPy独立核验，最大误差2.220446049250313e-15；三个原始Notebook六cell真内核非SKIPPED，再在原生UI、Pyodide及Pages UI运行。108项内核量、207项表格/界面读数对账通过。秦构：首次注册路径错误已在Phase2修正；实际浏览器和两个构建均验证正确导出，H1=1/H2=9、数学错误0、死锚点0、重复ID0，生产新页console error0，SVG路径带basePath。
### 体验与脉络组
郑核代陆阅：开篇从电机“仿真稳、上板振”的可想象现象进入，明确要解释实际程序是否实现设计；先补偿器、再字长、再独立闭环，避免把两个实验混成一个。公式给符号/初值/时刻，SVG与曲线对应问题。原生及静态375px夹具均clientWidth=scrollWidth=360，canvas331；指标表内部滚动。四份档案同日志齐备。
### 教学支持组
孙助：四题覆盖系数符号/首拍、非零历史、定点舍入与范围、时序及交接；数值答案分别由NB1/NB2/NB3和独立解析核验。参考向量只定位给定输入下的错误，不冒称完整输入空间验证。
### 学生组
林码：能解释为什么双线性变换后的首拍不等于连续阶跃t=0值，能用old_u/old_e复述先读后写。赵工：知道零输入残留不等于线性极点不稳定；增加一拍要改闭环矩阵，回退也要匹配状态策略，不能只写回参数。
## Phase 4 定稿签发
郑核：理论条件、学生反馈闭环、习题、柯验三方对账、何疑限定观察与秦构九项门槛均有实际证据，签发本课。catalog/旧tracker同步v1.3，本期P1–P4及验收可勾；进入master列等待真实提交，不预填hash。只做本地预览，不发布gh-pages。

## 附录 A.1 数值三方对账
| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | a=0.904761904762 | NB1/c1=0.9047619047619047 | 默认a或b同值 | ✅ | 独立Fraction/解析与SciPy核验；1e-12；重复答案同量复用 |
| 2 | b=0.0952380952381 | NB1/c1=0.09523809523809523 | 默认a或b同值 | ✅ | 独立Fraction/解析与SciPy核验；1e-12；重复答案同量复用 |
| 3 | library_a1=-0.904761904762 | NB1/c1=-0.9047619047619047 | 不适用：静态系数接口/半格/非零历史/存储边界计算，不提供对应交互控件 | ✅ | 独立Fraction/解析与SciPy核验；1e-12；重复答案同量复用 |
| 4 | first=0.0952380952381 | NB1/c1=0.09523809523809523 | 默认首拍同值 | ✅ | 独立Fraction/解析与SciPy核验；1e-12；重复答案同量复用 |
| 5 | stateFirst=0.369047619048 | NB1/c1=0.369047619047619 | 不适用：静态系数接口/半格/非零历史/存储边界计算，不提供对应交互控件 | ✅ | 独立Fraction/解析与SciPy核验；1e-12；重复答案同量复用 |
| 6 | A_F8=232 | NB1/c1=232 | 默认整数系数同值 | ✅ | 独立Fraction/解析与SciPy核验；1e-12；重复答案同量复用 |
| 7 | B_F8=24 | NB1/c1=24 | 默认整数系数同值 | ✅ | 独立Fraction/解析与SciPy核验；1e-12；重复答案同量复用 |
| 8 | positiveHalf=1 | NB1/c1=1 | 不适用：静态系数接口/半格/非零历史/存储边界计算，不提供对应交互控件 | ✅ | 独立Fraction/解析与SciPy核验；1e-12；重复答案同量复用 |
| 9 | negativeHalf=-1 | NB1/c1=-1 | 不适用：静态系数接口/半格/非零历史/存储边界计算，不提供对应交互控件 | ✅ | 独立Fraction/解析与SciPy核验；1e-12；重复答案同量复用 |
| 10 | maxStoredF12=7.99975585938 | NB1/c1=7.999755859375 | 不适用：静态系数接口/半格/非零历史/存储边界计算，不提供对应交互控件 | ✅ | 独立Fraction/解析与SciPy核验；1e-12；重复答案同量复用 |
| 11 | minStoredF12=-8 | NB1/c1=-8 | 不适用：静态系数接口/半格/非零历史/存储边界计算，不提供对应交互控件 | ✅ | 独立Fraction/解析与SciPy核验；1e-12；重复答案同量复用 |
| 12 | 默认 aq=0.90625 | NB2/c1默认=0.90625 | 默认实际TS=0.90625 | ✅ | Ts=.02,F8,step；k0..79；末拍不是稳态；表显六位5.1e-7 |
| 13 | 默认 bq=0.09375 | NB1/2整数B=24与S=2^8换算=0.09375 | 默认实际TS=0.09375 | ✅ | Ts=.02,F8,step；k0..79；末拍不是稳态；表显六位5.1e-7 |
| 14 | 默认 scale=256 | NB1/2整数B=24与S=2^8换算=256 | 默认实际TS=256 | ✅ | Ts=.02,F8,step；k0..79；末拍不是稳态；表显六位5.1e-7 |
| 15 | 默认 first=0.0952380952381 | NB2/c1默认=0.09523809523809523 | 默认实际TS=0.09523809523809523 | ✅ | Ts=.02,F8,step；k0..79；末拍不是稳态；表显六位5.1e-7 |
| 16 | 默认 fixedFirst=0.09375 | NB2/c1默认=0.09375 | 默认实际TS=0.09375 | ✅ | Ts=.02,F8,step；k0..79；末拍不是稳态；表显六位5.1e-7 |
| 17 | 默认 finalFloat=1.9992984625 | NB2/c1默认=1.999298462504657 | 默认实际TS=1.999298462504655 | ✅ | Ts=.02,F8,step；k0..79；末拍不是稳态；表显六位5.1e-7 |
| 18 | 默认 finalFixed=1.98046875 | NB2/c1默认=1.98046875 | 默认实际TS=1.98046875 | ✅ | Ts=.02,F8,step；k0..79；末拍不是稳态；表显六位5.1e-7 |
| 19 | 默认 maxError=0.0188297125047 | NB2/c1默认=0.01882971250465726 | 默认实际TS=0.01882971250465504 | ✅ | Ts=.02,F8,step；k0..79；末拍不是稳态；表显六位5.1e-7 |
| 20 | 默认 clipped=0 | NB2/c1默认=0 | 默认实际TS=0 | ✅ | Ts=.02,F8,step；k0..79；末拍不是稳态；表显六位5.1e-7 |
| 21 | 默认 deadbandBound=0.0208333333333 | NB2/c1默认=0.02083333333333333 | 默认实际TS=0.02083333333333333 | ✅ | Ts=.02,F8,step；k0..79；末拍不是稳态；表显六位5.1e-7 |
| 22 | F4/step finalFloat=1.99929846 | NB2/c1=1.999298462504657 | 非默认；实际TS切换F4/step=1.999298462504655 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 23 | F4/step finalFixed=1.81250000 | NB2/c1=1.8125 | 非默认；实际TS切换F4/step=1.8125 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 24 | F4/step maxError=0.25782434 | NB2/c1=0.2578243399378644 | 非默认；实际TS切换F4/step=0.2578243399378648 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 25 | F4/step clipped=0.00000000 | NB2/c1=0 | 非默认；实际TS切换F4/step=0 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 26 | F4/pulse finalFloat=-0.02874755 | NB2/c1=-0.02874754871186031 | 非默认；实际TS切换F4/pulse=-0.02874754871186016 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 27 | F4/pulse finalFixed=-0.25000000 | NB2/c1=-0.25 | 非默认；实际TS切换F4/pulse=-0.25 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 28 | F4/pulse maxError=0.38132275 | NB2/c1=0.3813227533989537 | 非默认；实际TS切换F4/pulse=0.3813227533989534 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 29 | F4/pulse clipped=0.00000000 | NB2/c1=0 | 非默认；实际TS切换F4/pulse=0 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 30 | F4/decay finalFloat=0.00008331 | NB2/c1=8.330757757194607e-05 | 非默认；实际TS切换F4/decay=8.330757757194527e-05 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 31 | F4/decay finalFixed=0.25000000 | NB2/c1=0.25 | 非默认；实际TS切换F4/decay=0.25 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 32 | F4/decay maxError=0.24991669 | NB2/c1=0.2499166924224281 | 非默认；实际TS切换F4/decay=0.2499166924224281 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 33 | F4/decay clipped=0.00000000 | NB2/c1=0 | 非默认；实际TS切换F4/decay=0 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 34 | F8/step finalFloat=1.99929846 | NB2/c1=1.999298462504657 | 默认=1.999298462504655 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 35 | F8/step finalFixed=1.98046875 | NB2/c1=1.98046875 | 默认=1.98046875 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 36 | F8/step maxError=0.01882971 | NB2/c1=0.01882971250465726 | 默认=0.01882971250465504 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 37 | F8/step clipped=0.00000000 | NB2/c1=0 | 默认=0 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 38 | F8/pulse finalFloat=-0.02874755 | NB2/c1=-0.02874754871186031 | 非默认；实际TS切换F8/pulse=-0.02874754871186016 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 39 | F8/pulse finalFixed=-0.03125000 | NB2/c1=-0.03125 | 非默认；实际TS切换F8/pulse=-0.03125 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 40 | F8/pulse maxError=0.02244402 | NB2/c1=0.0224440187010011 | 非默认；实际TS切换F8/pulse=0.02244401870100177 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 41 | F8/pulse clipped=0.00000000 | NB2/c1=0 | 非默认；实际TS切换F8/pulse=0 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 42 | F8/decay finalFloat=0.00008331 | NB2/c1=8.330757757194607e-05 | 非默认；实际TS切换F8/decay=8.330757757194527e-05 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 43 | F8/decay finalFixed=0.01953125 | NB2/c1=0.01953125 | 非默认；实际TS切换F8/decay=0.01953125 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 44 | F8/decay maxError=0.01944794 | NB2/c1=0.01944794242242805 | 非默认；实际TS切换F8/decay=0.01944794242242805 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 45 | F8/decay clipped=0.00000000 | NB2/c1=0 | 非默认；实际TS切换F8/decay=0 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 46 | F12/step finalFloat=1.99929846 | NB2/c1=1.999298462504657 | 非默认；实际TS切换F12/step=1.999298462504655 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 47 | F12/step finalFixed=1.99877930 | NB2/c1=1.998779296875 | 非默认；实际TS切换F12/step=1.998779296875 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 48 | F12/step maxError=0.00051917 | NB2/c1=0.0005191656296572589 | 非默认；实际TS切换F12/step=0.0005191656296550384 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 49 | F12/step clipped=0.00000000 | NB2/c1=0 | 非默认；实际TS切换F12/step=0 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 50 | F12/pulse finalFloat=-0.02874755 | NB2/c1=-0.02874754871186031 | 非默认；实际TS切换F12/pulse=-0.02874754871186016 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 51 | F12/pulse finalFixed=-0.02880859 | NB2/c1=-0.02880859375 | 非默认；实际TS切换F12/pulse=-0.02880859375 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 52 | F12/pulse maxError=0.00063118 | NB2/c1=0.0006311812117698601 | 非默认；实际TS切换F12/pulse=0.0006311812117700821 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 53 | F12/pulse clipped=0.00000000 | NB2/c1=0 | 非默认；实际TS切换F12/pulse=0 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 54 | F12/decay finalFloat=0.00008331 | NB2/c1=8.330757757194607e-05 | 非默认；实际TS切换F12/decay=8.330757757194527e-05 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 55 | F12/decay finalFixed=0.00122070 | NB2/c1=0.001220703125 | 非默认；实际TS切换F12/decay=0.001220703125 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 56 | F12/decay maxError=0.00113740 | NB2/c1=0.001137395547428054 | 非默认；实际TS切换F12/decay=0.001137395547428055 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 57 | F12/decay clipped=0.00000000 | NB2/c1=0 | 非默认；实际TS切换F12/decay=0 | ✅ | 80拍同初值，整数逐点全等；浮点1e-11，表八位舍入5.1e-9 |
| 58 | 零输入F8末拍对应整数U=5，保持round(aq×5)=5 | NB2/c1末拍.01953125×256=5；零输入循环已反复执行该舍入 | 切换decay实际TS末拍word=5；前后历史固定 | ✅ | 以代码和整数轨迹核保持；不是把末拍当作渐近极限 |
| 59 | Ts=0.02 pole=0.74258275 | NB3/c1=0.7425827529878188 | 不适用：独立闭环静态矩阵实验，不与前面的补偿器混用 | ✅ | 3周期全报，独立eigvals/精确对象核验；8位舍入5.1e-9；|p|/ρ<1判稳定 |
| 60 | Ts=0.02 rho=0.54090720 | NB3/c1=0.5409072048348353 | 不适用：独立闭环静态矩阵实验，不与前面的补偿器混用 | ✅ | 3周期全报，独立eigvals/精确对象核验；8位舍入5.1e-9；|p|/ρ<1判稳定 |
| 61 | Ts=0.1 pole=-0.23711357 | NB3/c1=-0.2371135655325256 | 不适用：独立闭环静态矩阵实验，不与前面的补偿器混用 | ✅ | 3周期全报，独立eigvals/精确对象核验；8位舍入5.1e-9；|p|/ρ<1判稳定 |
| 62 | Ts=0.1 rho=1.06862107 | NB3/c1=1.068621066406837 | 不适用：独立闭环静态矩阵实验，不与前面的补偿器混用 | ✅ | 3周期全报，独立eigvals/精确对象核验；8位舍入5.1e-9；|p|/ρ<1判稳定 |
| 63 | Ts=0.2 pole=-1.35650021 | NB3/c1=-1.356500209986236 | 不适用：独立闭环静态矩阵实验，不与前面的补偿器混用 | ✅ | 3周期全报，独立eigvals/精确对象核验；8位舍入5.1e-9；|p|/ρ<1判稳定 |
| 64 | Ts=0.2 rho=1.47486642 | NB3/c1=1.47486642210887 | 不适用：独立闭环静态矩阵实验，不与前面的补偿器混用 | ✅ | 3周期全报，独立eigvals/精确对象核验；8位舍入5.1e-9；|p|/ρ<1判稳定 |

输入常量、80拍/60更新、状态布局、时间轴和位数是预先声明的合同，代码逐字保留。正文中首拍、默认读数、三个时序解释与答案重复引用对应行；golden/correct/wrong完整向量见reconciliation.json，原始UI流见native-notebook-ui.json与pages-notebook-ui.json。组件默认值无法展示的静态量明确标不适用；可交互的非默认量均实际调用组件计算函数，并检验可见UI边界与恢复。

## 附录 A.2 实测数据总表
| 来源 | 量 | 实测值 |
|---|---|---|
| NB1/c1 | a | 0.9047619047619047 |
| NB1/c1 | b | 0.09523809523809523 |
| NB1/c1 | library_a1 | -0.9047619047619047 |
| NB1/c1 | first | 0.09523809523809523 |
| NB1/c1 | stateFirst | 0.369047619047619 |
| NB1/c1 | A_F8 | 232 |
| NB1/c1 | B_F8 | 24 |
| NB1/c1 | positiveHalf | 1 |
| NB1/c1 | negativeHalf | -1 |
| NB1/c1 | maxStoredF12 | 7.999755859375 |
| NB1/c1 | minStoredF12 | -8 |
| NB1原始cell | golden | [0.09523809523809523, 0.2766439909297052, 0.393154087031638, 0.40332988826672006, 0.3172984703365562, 0.14422242554259845, 0.03524886120520812, 0.12712992204280735] |
| NB1原始cell | replayed | [0.09523809523809523, 0.2766439909297052, 0.393154087031638, 0.40332988826672006, 0.3172984703365562, 0.14422242554259845, 0.03524886120520812, 0.12712992204280735] |
| NB1原始cell | wrong | [0.19047619047619047, 0.36281179138321995, 0.4234963826800561, 0.38316339385338405, 0.2514335468197284, 0.03701130426546853, 0.03348641814494772, 0.22077342594066696] |
| actual-ts.json Ts=0.01/F4/step | a | 0.9512195121951219 |
| actual-ts.json Ts=0.01/F4/step | b | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F4/step | A | 15 |
| actual-ts.json Ts=0.01/F4/step | B | 1 |
| actual-ts.json Ts=0.01/F4/step | first | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F4/step | fixedFirst | 0.0625 |
| actual-ts.json Ts=0.01/F4/step | finalFloat | 1.962460766168749 |
| actual-ts.json Ts=0.01/F4/step | finalFixed | 1.5625 |
| actual-ts.json Ts=0.01/F4/step | maxError | 0.3999607661687492 |
| actual-ts.json Ts=0.01/F4/step | clipped | 0 |
| actual-ts.json Ts=0.01/F4/step | deadbandBound | 0.5 |
| actual-ts.json Ts=0.01/F4/pulse | a | 0.9512195121951219 |
| actual-ts.json Ts=0.01/F4/pulse | b | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F4/pulse | A | 15 |
| actual-ts.json Ts=0.01/F4/pulse | B | 1 |
| actual-ts.json Ts=0.01/F4/pulse | first | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F4/pulse | fixedFirst | 0.0625 |
| actual-ts.json Ts=0.01/F4/pulse | finalFloat | -0.1109074084444802 |
| actual-ts.json Ts=0.01/F4/pulse | finalFixed | -0.5 |
| actual-ts.json Ts=0.01/F4/pulse | maxError | 0.3890925915555198 |
| actual-ts.json Ts=0.01/F4/pulse | clipped | 0 |
| actual-ts.json Ts=0.01/F4/pulse | deadbandBound | 0.5 |
| actual-ts.json Ts=0.01/F4/decay | a | 0.9512195121951219 |
| actual-ts.json Ts=0.01/F4/decay | b | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F4/decay | A | 15 |
| actual-ts.json Ts=0.01/F4/decay | B | 1 |
| actual-ts.json Ts=0.01/F4/decay | first | 0.2378048780487805 |
| actual-ts.json Ts=0.01/F4/decay | fixedFirst | 0.25 |
| actual-ts.json Ts=0.01/F4/decay | finalFloat | 0.004575094123183659 |
| actual-ts.json Ts=0.01/F4/decay | finalFixed | 0.25 |
| actual-ts.json Ts=0.01/F4/decay | maxError | 0.2454249058768163 |
| actual-ts.json Ts=0.01/F4/decay | clipped | 0 |
| actual-ts.json Ts=0.01/F4/decay | deadbandBound | 0.5 |
| actual-ts.json Ts=0.01/F8/step | a | 0.9512195121951219 |
| actual-ts.json Ts=0.01/F8/step | b | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F8/step | A | 244 |
| actual-ts.json Ts=0.01/F8/step | B | 12 |
| actual-ts.json Ts=0.01/F8/step | first | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F8/step | fixedFirst | 0.046875 |
| actual-ts.json Ts=0.01/F8/step | finalFloat | 1.962460766168749 |
| actual-ts.json Ts=0.01/F8/step | finalFixed | 1.9609375 |
| actual-ts.json Ts=0.01/F8/step | maxError | 0.03233604125519762 |
| actual-ts.json Ts=0.01/F8/step | clipped | 0 |
| actual-ts.json Ts=0.01/F8/step | deadbandBound | 0.04166666666666666 |
| actual-ts.json Ts=0.01/F8/pulse | a | 0.9512195121951219 |
| actual-ts.json Ts=0.01/F8/pulse | b | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F8/pulse | A | 244 |
| actual-ts.json Ts=0.01/F8/pulse | B | 12 |
| actual-ts.json Ts=0.01/F8/pulse | first | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F8/pulse | fixedFirst | 0.046875 |
| actual-ts.json Ts=0.01/F8/pulse | finalFloat | -0.1109074084444802 |
| actual-ts.json Ts=0.01/F8/pulse | finalFixed | -0.11328125 |
| actual-ts.json Ts=0.01/F8/pulse | maxError | 0.03882266036084975 |
| actual-ts.json Ts=0.01/F8/pulse | clipped | 0 |
| actual-ts.json Ts=0.01/F8/pulse | deadbandBound | 0.04166666666666666 |
| actual-ts.json Ts=0.01/F8/decay | a | 0.9512195121951219 |
| actual-ts.json Ts=0.01/F8/decay | b | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F8/decay | A | 244 |
| actual-ts.json Ts=0.01/F8/decay | B | 12 |
| actual-ts.json Ts=0.01/F8/decay | first | 0.2378048780487805 |
| actual-ts.json Ts=0.01/F8/decay | fixedFirst | 0.23828125 |
| actual-ts.json Ts=0.01/F8/decay | finalFloat | 0.004575094123183659 |
| actual-ts.json Ts=0.01/F8/decay | finalFixed | 0.0390625 |
| actual-ts.json Ts=0.01/F8/decay | maxError | 0.03448740587681634 |
| actual-ts.json Ts=0.01/F8/decay | clipped | 0 |
| actual-ts.json Ts=0.01/F8/decay | deadbandBound | 0.04166666666666666 |
| actual-ts.json Ts=0.01/F12/step | a | 0.9512195121951219 |
| actual-ts.json Ts=0.01/F12/step | b | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F12/step | A | 3896 |
| actual-ts.json Ts=0.01/F12/step | B | 200 |
| actual-ts.json Ts=0.01/F12/step | first | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F12/step | fixedFirst | 0.048828125 |
| actual-ts.json Ts=0.01/F12/step | finalFloat | 1.962460766168749 |
| actual-ts.json Ts=0.01/F12/step | finalFixed | 1.962646484375 |
| actual-ts.json Ts=0.01/F12/step | maxError | 0.0009215381800711242 |
| actual-ts.json Ts=0.01/F12/step | clipped | 0 |
| actual-ts.json Ts=0.01/F12/step | deadbandBound | 0.0025 |
| actual-ts.json Ts=0.01/F12/pulse | a | 0.9512195121951219 |
| actual-ts.json Ts=0.01/F12/pulse | b | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F12/pulse | A | 3896 |
| actual-ts.json Ts=0.01/F12/pulse | B | 200 |
| actual-ts.json Ts=0.01/F12/pulse | first | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F12/pulse | fixedFirst | 0.048828125 |
| actual-ts.json Ts=0.01/F12/pulse | finalFloat | -0.1109074084444802 |
| actual-ts.json Ts=0.01/F12/pulse | finalFixed | -0.11083984375 |
| actual-ts.json Ts=0.01/F12/pulse | maxError | 0.0009215381800711242 |
| actual-ts.json Ts=0.01/F12/pulse | clipped | 0 |
| actual-ts.json Ts=0.01/F12/pulse | deadbandBound | 0.0025 |
| actual-ts.json Ts=0.01/F12/decay | a | 0.9512195121951219 |
| actual-ts.json Ts=0.01/F12/decay | b | 0.04878048780487804 |
| actual-ts.json Ts=0.01/F12/decay | A | 3896 |
| actual-ts.json Ts=0.01/F12/decay | B | 200 |
| actual-ts.json Ts=0.01/F12/decay | first | 0.2378048780487805 |
| actual-ts.json Ts=0.01/F12/decay | fixedFirst | 0.23779296875 |
| actual-ts.json Ts=0.01/F12/decay | finalFloat | 0.004575094123183659 |
| actual-ts.json Ts=0.01/F12/decay | finalFixed | 0.0048828125 |
| actual-ts.json Ts=0.01/F12/decay | maxError | 0.0004253300279772887 |
| actual-ts.json Ts=0.01/F12/decay | clipped | 0 |
| actual-ts.json Ts=0.01/F12/decay | deadbandBound | 0.0025 |
| actual-ts.json Ts=0.02/F4/step | a | 0.9047619047619047 |
| actual-ts.json Ts=0.02/F4/step | b | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F4/step | A | 14 |
| actual-ts.json Ts=0.02/F4/step | B | 2 |
| actual-ts.json Ts=0.02/F4/step | first | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F4/step | fixedFirst | 0.125 |
| actual-ts.json Ts=0.02/F4/step | finalFloat | 1.999298462504655 |
| actual-ts.json Ts=0.02/F4/step | finalFixed | 1.8125 |
| actual-ts.json Ts=0.02/F4/step | maxError | 0.2578243399378648 |
| actual-ts.json Ts=0.02/F4/step | clipped | 0 |
| actual-ts.json Ts=0.02/F4/step | deadbandBound | 0.25 |
| actual-ts.json Ts=0.02/F4/pulse | a | 0.9047619047619047 |
| actual-ts.json Ts=0.02/F4/pulse | b | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F4/pulse | A | 14 |
| actual-ts.json Ts=0.02/F4/pulse | B | 2 |
| actual-ts.json Ts=0.02/F4/pulse | first | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F4/pulse | fixedFirst | 0.125 |
| actual-ts.json Ts=0.02/F4/pulse | finalFloat | -0.02874754871186016 |
| actual-ts.json Ts=0.02/F4/pulse | finalFixed | -0.25 |
| actual-ts.json Ts=0.02/F4/pulse | maxError | 0.3813227533989534 |
| actual-ts.json Ts=0.02/F4/pulse | clipped | 0 |
| actual-ts.json Ts=0.02/F4/pulse | deadbandBound | 0.25 |
| actual-ts.json Ts=0.02/F4/decay | a | 0.9047619047619047 |
| actual-ts.json Ts=0.02/F4/decay | b | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F4/decay | A | 14 |
| actual-ts.json Ts=0.02/F4/decay | B | 2 |
| actual-ts.json Ts=0.02/F4/decay | first | 0.2261904761904762 |
| actual-ts.json Ts=0.02/F4/decay | fixedFirst | 0.25 |
| actual-ts.json Ts=0.02/F4/decay | finalFloat | 8.330757757194527e-05 |
| actual-ts.json Ts=0.02/F4/decay | finalFixed | 0.25 |
| actual-ts.json Ts=0.02/F4/decay | maxError | 0.2499166924224281 |
| actual-ts.json Ts=0.02/F4/decay | clipped | 0 |
| actual-ts.json Ts=0.02/F4/decay | deadbandBound | 0.25 |
| actual-ts.json Ts=0.02/F8/step | a | 0.9047619047619047 |
| actual-ts.json Ts=0.02/F8/step | b | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F8/step | A | 232 |
| actual-ts.json Ts=0.02/F8/step | B | 24 |
| actual-ts.json Ts=0.02/F8/step | first | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F8/step | fixedFirst | 0.09375 |
| actual-ts.json Ts=0.02/F8/step | finalFloat | 1.999298462504655 |
| actual-ts.json Ts=0.02/F8/step | finalFixed | 1.98046875 |
| actual-ts.json Ts=0.02/F8/step | maxError | 0.01882971250465504 |
| actual-ts.json Ts=0.02/F8/step | clipped | 0 |
| actual-ts.json Ts=0.02/F8/step | deadbandBound | 0.02083333333333333 |
| actual-ts.json Ts=0.02/F8/pulse | a | 0.9047619047619047 |
| actual-ts.json Ts=0.02/F8/pulse | b | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F8/pulse | A | 232 |
| actual-ts.json Ts=0.02/F8/pulse | B | 24 |
| actual-ts.json Ts=0.02/F8/pulse | first | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F8/pulse | fixedFirst | 0.09375 |
| actual-ts.json Ts=0.02/F8/pulse | finalFloat | -0.02874754871186016 |
| actual-ts.json Ts=0.02/F8/pulse | finalFixed | -0.03125 |
| actual-ts.json Ts=0.02/F8/pulse | maxError | 0.02244401870100177 |
| actual-ts.json Ts=0.02/F8/pulse | clipped | 0 |
| actual-ts.json Ts=0.02/F8/pulse | deadbandBound | 0.02083333333333333 |
| actual-ts.json Ts=0.02/F8/decay | a | 0.9047619047619047 |
| actual-ts.json Ts=0.02/F8/decay | b | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F8/decay | A | 232 |
| actual-ts.json Ts=0.02/F8/decay | B | 24 |
| actual-ts.json Ts=0.02/F8/decay | first | 0.2261904761904762 |
| actual-ts.json Ts=0.02/F8/decay | fixedFirst | 0.2265625 |
| actual-ts.json Ts=0.02/F8/decay | finalFloat | 8.330757757194527e-05 |
| actual-ts.json Ts=0.02/F8/decay | finalFixed | 0.01953125 |
| actual-ts.json Ts=0.02/F8/decay | maxError | 0.01944794242242805 |
| actual-ts.json Ts=0.02/F8/decay | clipped | 0 |
| actual-ts.json Ts=0.02/F8/decay | deadbandBound | 0.02083333333333333 |
| actual-ts.json Ts=0.02/F12/step | a | 0.9047619047619047 |
| actual-ts.json Ts=0.02/F12/step | b | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F12/step | A | 3706 |
| actual-ts.json Ts=0.02/F12/step | B | 390 |
| actual-ts.json Ts=0.02/F12/step | first | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F12/step | fixedFirst | 0.09521484375 |
| actual-ts.json Ts=0.02/F12/step | finalFloat | 1.999298462504655 |
| actual-ts.json Ts=0.02/F12/step | finalFixed | 1.998779296875 |
| actual-ts.json Ts=0.02/F12/step | maxError | 0.0005191656296550384 |
| actual-ts.json Ts=0.02/F12/step | clipped | 0 |
| actual-ts.json Ts=0.02/F12/step | deadbandBound | 0.001282051282051282 |
| actual-ts.json Ts=0.02/F12/pulse | a | 0.9047619047619047 |
| actual-ts.json Ts=0.02/F12/pulse | b | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F12/pulse | A | 3706 |
| actual-ts.json Ts=0.02/F12/pulse | B | 390 |
| actual-ts.json Ts=0.02/F12/pulse | first | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F12/pulse | fixedFirst | 0.09521484375 |
| actual-ts.json Ts=0.02/F12/pulse | finalFloat | -0.02874754871186016 |
| actual-ts.json Ts=0.02/F12/pulse | finalFixed | -0.02880859375 |
| actual-ts.json Ts=0.02/F12/pulse | maxError | 0.0006311812117700821 |
| actual-ts.json Ts=0.02/F12/pulse | clipped | 0 |
| actual-ts.json Ts=0.02/F12/pulse | deadbandBound | 0.001282051282051282 |
| actual-ts.json Ts=0.02/F12/decay | a | 0.9047619047619047 |
| actual-ts.json Ts=0.02/F12/decay | b | 0.09523809523809523 |
| actual-ts.json Ts=0.02/F12/decay | A | 3706 |
| actual-ts.json Ts=0.02/F12/decay | B | 390 |
| actual-ts.json Ts=0.02/F12/decay | first | 0.2261904761904762 |
| actual-ts.json Ts=0.02/F12/decay | fixedFirst | 0.226318359375 |
| actual-ts.json Ts=0.02/F12/decay | finalFloat | 8.330757757194527e-05 |
| actual-ts.json Ts=0.02/F12/decay | finalFixed | 0.001220703125 |
| actual-ts.json Ts=0.02/F12/decay | maxError | 0.001137395547428055 |
| actual-ts.json Ts=0.02/F12/decay | clipped | 0 |
| actual-ts.json Ts=0.02/F12/decay | deadbandBound | 0.001282051282051282 |
| actual-ts.json Ts=0.05/F4/step | a | 0.7777777777777778 |
| actual-ts.json Ts=0.05/F4/step | b | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F4/step | A | 12 |
| actual-ts.json Ts=0.05/F4/step | B | 4 |
| actual-ts.json Ts=0.05/F4/step | first | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F4/step | fixedFirst | 0.25 |
| actual-ts.json Ts=0.05/F4/step | finalFloat | 1.999999995759038 |
| actual-ts.json Ts=0.05/F4/step | finalFixed | 1.9375 |
| actual-ts.json Ts=0.05/F4/step | maxError | 0.08807833324865766 |
| actual-ts.json Ts=0.05/F4/step | clipped | 0 |
| actual-ts.json Ts=0.05/F4/step | deadbandBound | 0.125 |
| actual-ts.json Ts=0.05/F4/pulse | a | 0.7777777777777778 |
| actual-ts.json Ts=0.05/F4/pulse | b | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F4/pulse | A | 12 |
| actual-ts.json Ts=0.05/F4/pulse | B | 4 |
| actual-ts.json Ts=0.05/F4/pulse | first | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F4/pulse | fixedFirst | 0.25 |
| actual-ts.json Ts=0.05/F4/pulse | finalFloat | -9.716810190038447e-05 |
| actual-ts.json Ts=0.05/F4/pulse | finalFixed | -0.125 |
| actual-ts.json Ts=0.05/F4/pulse | maxError | 0.2343868402063347 |
| actual-ts.json Ts=0.05/F4/pulse | clipped | 0 |
| actual-ts.json Ts=0.05/F4/pulse | deadbandBound | 0.125 |
| actual-ts.json Ts=0.05/F4/decay | a | 0.7777777777777778 |
| actual-ts.json Ts=0.05/F4/decay | b | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F4/decay | A | 12 |
| actual-ts.json Ts=0.05/F4/decay | B | 4 |
| actual-ts.json Ts=0.05/F4/decay | first | 0.1944444444444444 |
| actual-ts.json Ts=0.05/F4/decay | fixedFirst | 0.1875 |
| actual-ts.json Ts=0.05/F4/decay | finalFloat | 4.638552268011309e-10 |
| actual-ts.json Ts=0.05/F4/decay | finalFixed | 0.125 |
| actual-ts.json Ts=0.05/F4/decay | maxError | 0.1249999995361448 |
| actual-ts.json Ts=0.05/F4/decay | clipped | 0 |
| actual-ts.json Ts=0.05/F4/decay | deadbandBound | 0.125 |
| actual-ts.json Ts=0.05/F8/step | a | 0.7777777777777778 |
| actual-ts.json Ts=0.05/F8/step | b | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F8/step | A | 199 |
| actual-ts.json Ts=0.05/F8/step | B | 57 |
| actual-ts.json Ts=0.05/F8/step | first | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F8/step | fixedFirst | 0.22265625 |
| actual-ts.json Ts=0.05/F8/step | finalFloat | 1.999999995759038 |
| actual-ts.json Ts=0.05/F8/step | finalFixed | 1.9921875 |
| actual-ts.json Ts=0.05/F8/step | maxError | 0.007812495759037974 |
| actual-ts.json Ts=0.05/F8/step | clipped | 0 |
| actual-ts.json Ts=0.05/F8/step | deadbandBound | 0.008771929824561403 |
| actual-ts.json Ts=0.05/F8/pulse | a | 0.7777777777777778 |
| actual-ts.json Ts=0.05/F8/pulse | b | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F8/pulse | A | 199 |
| actual-ts.json Ts=0.05/F8/pulse | B | 57 |
| actual-ts.json Ts=0.05/F8/pulse | first | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F8/pulse | fixedFirst | 0.22265625 |
| actual-ts.json Ts=0.05/F8/pulse | finalFloat | -9.716810190038447e-05 |
| actual-ts.json Ts=0.05/F8/pulse | finalFixed | -0.0078125 |
| actual-ts.json Ts=0.05/F8/pulse | maxError | 0.007715331898099615 |
| actual-ts.json Ts=0.05/F8/pulse | clipped | 0 |
| actual-ts.json Ts=0.05/F8/pulse | deadbandBound | 0.008771929824561403 |
| actual-ts.json Ts=0.05/F8/decay | a | 0.7777777777777778 |
| actual-ts.json Ts=0.05/F8/decay | b | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F8/decay | A | 199 |
| actual-ts.json Ts=0.05/F8/decay | B | 57 |
| actual-ts.json Ts=0.05/F8/decay | first | 0.1944444444444444 |
| actual-ts.json Ts=0.05/F8/decay | fixedFirst | 0.1953125 |
| actual-ts.json Ts=0.05/F8/decay | finalFloat | 4.638552268011309e-10 |
| actual-ts.json Ts=0.05/F8/decay | finalFixed | 0.0078125 |
| actual-ts.json Ts=0.05/F8/decay | maxError | 0.007812499536144773 |
| actual-ts.json Ts=0.05/F8/decay | clipped | 0 |
| actual-ts.json Ts=0.05/F8/decay | deadbandBound | 0.008771929824561403 |
| actual-ts.json Ts=0.05/F12/step | a | 0.7777777777777778 |
| actual-ts.json Ts=0.05/F12/step | b | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F12/step | A | 3186 |
| actual-ts.json Ts=0.05/F12/step | B | 910 |
| actual-ts.json Ts=0.05/F12/step | first | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F12/step | fixedFirst | 0.22216796875 |
| actual-ts.json Ts=0.05/F12/step | finalFloat | 1.999999995759038 |
| actual-ts.json Ts=0.05/F12/step | finalFixed | 1.99951171875 |
| actual-ts.json Ts=0.05/F12/step | maxError | 0.000488277009037974 |
| actual-ts.json Ts=0.05/F12/step | clipped | 0 |
| actual-ts.json Ts=0.05/F12/step | deadbandBound | 0.0005494505494505495 |
| actual-ts.json Ts=0.05/F12/pulse | a | 0.7777777777777778 |
| actual-ts.json Ts=0.05/F12/pulse | b | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F12/pulse | A | 3186 |
| actual-ts.json Ts=0.05/F12/pulse | B | 910 |
| actual-ts.json Ts=0.05/F12/pulse | first | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F12/pulse | fixedFirst | 0.22216796875 |
| actual-ts.json Ts=0.05/F12/pulse | finalFloat | -9.716810190038447e-05 |
| actual-ts.json Ts=0.05/F12/pulse | finalFixed | -0.00048828125 |
| actual-ts.json Ts=0.05/F12/pulse | maxError | 0.0005428125918552351 |
| actual-ts.json Ts=0.05/F12/pulse | clipped | 0 |
| actual-ts.json Ts=0.05/F12/pulse | deadbandBound | 0.0005494505494505495 |
| actual-ts.json Ts=0.05/F12/decay | a | 0.7777777777777778 |
| actual-ts.json Ts=0.05/F12/decay | b | 0.2222222222222222 |
| actual-ts.json Ts=0.05/F12/decay | A | 3186 |
| actual-ts.json Ts=0.05/F12/decay | B | 910 |
| actual-ts.json Ts=0.05/F12/decay | first | 0.1944444444444444 |
| actual-ts.json Ts=0.05/F12/decay | fixedFirst | 0.194580078125 |
| actual-ts.json Ts=0.05/F12/decay | finalFloat | 4.638552268011309e-10 |
| actual-ts.json Ts=0.05/F12/decay | finalFixed | 0.00048828125 |
| actual-ts.json Ts=0.05/F12/decay | maxError | 0.0004882807861447732 |
| actual-ts.json Ts=0.05/F12/decay | clipped | 0 |
| actual-ts.json Ts=0.05/F12/decay | deadbandBound | 0.0005494505494505495 |
| actual-ts.json Ts=0.1/F4/step | a | 0.6000000000000001 |
| actual-ts.json Ts=0.1/F4/step | b | 0.4 |
| actual-ts.json Ts=0.1/F4/step | A | 10 |
| actual-ts.json Ts=0.1/F4/step | B | 6 |
| actual-ts.json Ts=0.1/F4/step | first | 0.4 |
| actual-ts.json Ts=0.1/F4/step | fixedFirst | 0.375 |
| actual-ts.json Ts=0.1/F4/step | finalFloat | 2 |
| actual-ts.json Ts=0.1/F4/step | finalFixed | 1.9375 |
| actual-ts.json Ts=0.1/F4/step | maxError | 0.0625 |
| actual-ts.json Ts=0.1/F4/step | clipped | 0 |
| actual-ts.json Ts=0.1/F4/step | deadbandBound | 0.08333333333333333 |
| actual-ts.json Ts=0.1/F4/pulse | a | 0.6000000000000001 |
| actual-ts.json Ts=0.1/F4/pulse | b | 0.4 |
| actual-ts.json Ts=0.1/F4/pulse | A | 10 |
| actual-ts.json Ts=0.1/F4/pulse | B | 6 |
| actual-ts.json Ts=0.1/F4/pulse | first | 0.4 |
| actual-ts.json Ts=0.1/F4/pulse | fixedFirst | 0.375 |
| actual-ts.json Ts=0.1/F4/pulse | finalFloat | -3.564404555507518e-09 |
| actual-ts.json Ts=0.1/F4/pulse | finalFixed | -0.0625 |
| actual-ts.json Ts=0.1/F4/pulse | maxError | 0.09802105947261464 |
| actual-ts.json Ts=0.1/F4/pulse | clipped | 0 |
| actual-ts.json Ts=0.1/F4/pulse | deadbandBound | 0.08333333333333333 |
| actual-ts.json Ts=0.1/F4/decay | a | 0.6000000000000001 |
| actual-ts.json Ts=0.1/F4/decay | b | 0.4 |
| actual-ts.json Ts=0.1/F4/decay | A | 10 |
| actual-ts.json Ts=0.1/F4/decay | B | 6 |
| actual-ts.json Ts=0.1/F4/decay | first | 0.15 |
| actual-ts.json Ts=0.1/F4/decay | fixedFirst | 0.1875 |
| actual-ts.json Ts=0.1/F4/decay | finalFloat | 4.467247756150483e-19 |
| actual-ts.json Ts=0.1/F4/decay | finalFixed | 0.0625 |
| actual-ts.json Ts=0.1/F4/decay | maxError | 0.0625 |
| actual-ts.json Ts=0.1/F4/decay | clipped | 0 |
| actual-ts.json Ts=0.1/F4/decay | deadbandBound | 0.08333333333333333 |
| actual-ts.json Ts=0.1/F8/step | a | 0.6000000000000001 |
| actual-ts.json Ts=0.1/F8/step | b | 0.4 |
| actual-ts.json Ts=0.1/F8/step | A | 154 |
| actual-ts.json Ts=0.1/F8/step | B | 102 |
| actual-ts.json Ts=0.1/F8/step | first | 0.4 |
| actual-ts.json Ts=0.1/F8/step | fixedFirst | 0.3984375 |
| actual-ts.json Ts=0.1/F8/step | finalFloat | 2 |
| actual-ts.json Ts=0.1/F8/step | finalFixed | 1.99609375 |
| actual-ts.json Ts=0.1/F8/step | maxError | 0.006031250000000155 |
| actual-ts.json Ts=0.1/F8/step | clipped | 0 |
| actual-ts.json Ts=0.1/F8/step | deadbandBound | 0.004901960784313725 |
| actual-ts.json Ts=0.1/F8/pulse | a | 0.6000000000000001 |
| actual-ts.json Ts=0.1/F8/pulse | b | 0.4 |
| actual-ts.json Ts=0.1/F8/pulse | A | 154 |
| actual-ts.json Ts=0.1/F8/pulse | B | 102 |
| actual-ts.json Ts=0.1/F8/pulse | first | 0.4 |
| actual-ts.json Ts=0.1/F8/pulse | fixedFirst | 0.3984375 |
| actual-ts.json Ts=0.1/F8/pulse | finalFloat | -3.564404555507518e-09 |
| actual-ts.json Ts=0.1/F8/pulse | finalFixed | -0.00390625 |
| actual-ts.json Ts=0.1/F8/pulse | maxError | 0.008177309472614636 |
| actual-ts.json Ts=0.1/F8/pulse | clipped | 0 |
| actual-ts.json Ts=0.1/F8/pulse | deadbandBound | 0.004901960784313725 |
| actual-ts.json Ts=0.1/F8/decay | a | 0.6000000000000001 |
| actual-ts.json Ts=0.1/F8/decay | b | 0.4 |
| actual-ts.json Ts=0.1/F8/decay | A | 154 |
| actual-ts.json Ts=0.1/F8/decay | B | 102 |
| actual-ts.json Ts=0.1/F8/decay | first | 0.15 |
| actual-ts.json Ts=0.1/F8/decay | fixedFirst | 0.15234375 |
| actual-ts.json Ts=0.1/F8/decay | finalFloat | 4.467247756150483e-19 |
| actual-ts.json Ts=0.1/F8/decay | finalFixed | 0.00390625 |
| actual-ts.json Ts=0.1/F8/decay | maxError | 0.00390625 |
| actual-ts.json Ts=0.1/F8/decay | clipped | 0 |
| actual-ts.json Ts=0.1/F8/decay | deadbandBound | 0.004901960784313725 |
| actual-ts.json Ts=0.1/F12/step | a | 0.6000000000000001 |
| actual-ts.json Ts=0.1/F12/step | b | 0.4 |
| actual-ts.json Ts=0.1/F12/step | A | 2458 |
| actual-ts.json Ts=0.1/F12/step | B | 1638 |
| actual-ts.json Ts=0.1/F12/step | first | 0.4 |
| actual-ts.json Ts=0.1/F12/step | fixedFirst | 0.39990234375 |
| actual-ts.json Ts=0.1/F12/step | finalFloat | 2 |
| actual-ts.json Ts=0.1/F12/step | finalFixed | 1.999755859375 |
| actual-ts.json Ts=0.1/F12/step | maxError | 0.000244140625 |
| actual-ts.json Ts=0.1/F12/step | clipped | 0 |
| actual-ts.json Ts=0.1/F12/step | deadbandBound | 0.0003052503052503053 |
| actual-ts.json Ts=0.1/F12/pulse | a | 0.6000000000000001 |
| actual-ts.json Ts=0.1/F12/pulse | b | 0.4 |
| actual-ts.json Ts=0.1/F12/pulse | A | 2458 |
| actual-ts.json Ts=0.1/F12/pulse | B | 1638 |
| actual-ts.json Ts=0.1/F12/pulse | first | 0.4 |
| actual-ts.json Ts=0.1/F12/pulse | fixedFirst | 0.39990234375 |
| actual-ts.json Ts=0.1/F12/pulse | finalFloat | -3.564404555507518e-09 |
| actual-ts.json Ts=0.1/F12/pulse | finalFixed | -0.000244140625 |
| actual-ts.json Ts=0.1/F12/pulse | maxError | 0.0003648094726146356 |
| actual-ts.json Ts=0.1/F12/pulse | clipped | 0 |
| actual-ts.json Ts=0.1/F12/pulse | deadbandBound | 0.0003052503052503053 |
| actual-ts.json Ts=0.1/F12/decay | a | 0.6000000000000001 |
| actual-ts.json Ts=0.1/F12/decay | b | 0.4 |
| actual-ts.json Ts=0.1/F12/decay | A | 2458 |
| actual-ts.json Ts=0.1/F12/decay | B | 1638 |
| actual-ts.json Ts=0.1/F12/decay | first | 0.15 |
| actual-ts.json Ts=0.1/F12/decay | fixedFirst | 0.150146484375 |
| actual-ts.json Ts=0.1/F12/decay | finalFloat | 4.467247756150483e-19 |
| actual-ts.json Ts=0.1/F12/decay | finalFixed | 0.000244140625 |
| actual-ts.json Ts=0.1/F12/decay | maxError | 0.0002441406249999996 |
| actual-ts.json Ts=0.1/F12/decay | clipped | 0 |
| actual-ts.json Ts=0.1/F12/decay | deadbandBound | 0.0003052503052503053 |
| NB3/独立矩阵 Ts=0.02 | A | 0.9801986733067553 |
| NB3/独立矩阵 Ts=0.02 | B | 0.0198013266932447 |
| NB3/独立矩阵 Ts=0.02 | pole | 0.7425827529878188 |
| NB3/独立矩阵 Ts=0.02 | rho | 0.5409072048348353 |
| NB3/独立矩阵 Ts=0.02 | noDelayEnd | 1.756675290620136e-09 |
| NB3/独立矩阵 Ts=0.02 | delayedEnd | 5.170427324188602e-17 |
| NB3/独立矩阵 Ts=0.1 | A | 0.9048374180359595 |
| NB3/独立矩阵 Ts=0.1 | B | 0.09516258196404043 |
| NB3/独立矩阵 Ts=0.1 | pole | -0.2371135655325256 |
| NB3/独立矩阵 Ts=0.1 | rho | 1.068621066406837 |
| NB3/独立矩阵 Ts=0.1 | noDelayEnd | 3.143287241450547e-39 |
| NB3/独立矩阵 Ts=0.1 | delayedEnd | 0.2182406802189482 |
| NB3/独立矩阵 Ts=0.2 | A | 0.8187307530779818 |
| NB3/独立矩阵 Ts=0.2 | B | 0.1812692469220181 |
| NB3/独立矩阵 Ts=0.2 | pole | -1.356500209986236 |
| NB3/独立矩阵 Ts=0.2 | rho | 1.47486642210887 |
| NB3/独立矩阵 Ts=0.2 | noDelayEnd | 8814383.043906646 |
| NB3/独立矩阵 Ts=0.2 | delayedEnd | -169318328.4810779 |
| actual-ts.json/reference.json | 36组×80点的t/input/float/fixed/word | 完整数组保留；14976数值通过；整数路径逐点全等 |
| notebooks.json/pyodide.json/UI流 | 原setup及6cell | 三Notebook全部执行；原生/Pages UI三幅输出图 |

## 附录 B 九项前端硬门槛
| # | 原技能九项硬门槛 | 实际输出与证据 |
|---|---|---|
| 1 | ✅ npm run build通过 | build-results.json/build.log：退出0；独立快照完整预渲染；build-origin.json记录基线和正文哈希 |
| 2 | ✅ curl课程页HTTP 200 | native-verify.log：HTTP200；真实原生/Pages页均加载完整正文；Pages构建路由检查通过 |
| 3 | ✅ 渲染H2与catalog一致 | native-dom.json/pages-dom.json：H1=1/H2=9，对应subsections=9 |
| 4 | ✅ katex-error元素数为0 | 两份DOM均0；math:check退出0 |
| 5 | ✅ MDX与验证脚本cell逐字全等且真内核执行 | nb-cells verify --require-kernel --port8991退出0，S0–S8无FAIL，S6六cell非SKIPPED；镜像脚本直接extract原始setup/cell |
| 6 | ✅ 新增组件在lib/wiki-components.ts登记 | ControllerDeploymentExplorer的实际模块导出已由浏览器与生产构建核验；初稿误路径已修正，不把名称登记当作充分证据 |
| 7 | ✅ 新增组件MDX显式引用 | <ControllerDeploymentExplorer />显式引用；真实DOM canvas=1 |
| 8 | ✅ 固定轴/animation:false/Option对象/默认复现 | x=[0,80Ts]、y=[−2.5,2.5]显式边界；useMemo<EChartsOption>传useECharts；真实TS36配置、默认及UI边界/恢复通过 |
| 9 | ✅ notebook无ipywidgets等不支持组件 | nb-cells S2无FAIL；Pyodide3/3实验放行、6/6cell通过，页面实际运行三幅图 |

额外：npm run build:pages退出0，205课/9旧路由、basePath=/control-universe；glossary:check PASS3/WARN3/FAIL0，既有残渣不命中提示未通过改术语表隐藏。原生及Pages 375px夹具均文档360/360、图331、表内滚动。Pages新页console error0；源码与Notebook证明同LF哈希。构建既有lint/KaTeX WARN按原stdout保留。本课没有修改全局渲染/路由/数学/内核基础设施。最终catalog与学期门槛将以最新HEAD加本课再次执行，不能继承共享草稿基线的失败或当作全站无债务。

## 附录 C 红队放行
| 对比结论 | 基线独立整定? | ≥3 工况? | 落败/持平工况? | 边界写回正文? | 放行? |
|---|---|---|---|---|---|
| 固定实现/时序敏感性，非方法/平台排名 | 限定观察：无最优或方法胜出声明，不移植芯片性能 | ✅ 三输入×三位数全表；时序三周期完整保留 | ✅ 零输入残留；短周期两者稳定、长周期两者失稳；.1s新增一拍使模型失稳 | ✅ 舍入/饱和/初值/窗口、独立实验及硬件未执行边界写入正文 | ✅ 何疑仅放行这些局部观察，不放行泛化排名 |

## 附录 D 来源与变更
2026-10-24查阅官方SciPy bilinear文档（不自动预扭曲）与Arm CMSIS-DSP v1.15.0 DF1文档（反馈系数符号约定须转换）。本课教学整数模型不是CMSIS内核性能/精度测试，不声称硬件在环通过。

何疑：未选择最优调参基线，不把误差曲线归因为平台普遍优劣；固定增益12只检查时序反例。极点判断与仿真末点分开，未用单条稳定曲线冒充鲁棒或安全保证。
