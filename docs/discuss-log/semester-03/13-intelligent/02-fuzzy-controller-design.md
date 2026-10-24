# 模糊控制器 — 学期3讨论日志

- ID：INTEL-02；章节13 intelligent；课程02 fuzzy-controller-design；课型impl
- 日期：2026-10-24；重构；起点df72d0abdecd7c72041b91f50b6aeae6e5d6d8c9
- 角色是结构化审查视角，不是真实外部专家或独立Agent。

## 出席与沉默表

| 角色 | 状态 | 实质发言的阶段 | 沉默原因 / 备注 |
|---|---|---|---|
| 郑核 | 出席 | 1–4 | 按impl矩阵 |
| 苏绘 | 出席 | 1–4 | 按impl矩阵 |
| 孙助 | 出席 | 1–4 | 按impl矩阵 |
| 柯验 | 出席 | 1–4 | 按impl矩阵 |
| 秦构 | 出席 | 1–4 | 按impl矩阵 |
| 周联 | 出席 | 1–4 | 按impl矩阵 |
| 何仿 | 出席 | 1–4 | 按impl矩阵 |
| 林矩 | 出席 | 1–4 | 联合主责教授，模型与稳定性条件 |
| 林码 | 出席 | 1–4 | 按impl矩阵 |
| 何疑 | 出席 | 1–4 | 比较课追加红队 |

[沉默-赵工：控制10人规模，工程读者检查由林码结合周联逐项代核。]
[沉默-钱锐：本课为工程实现，不展开前沿研究。]
[沉默-陆阅：开篇与档案由郑核、学生代核。]
[沉默-轮值：教学简化对象，不作行业实机结论。]

## Phase 1: 内容规划

[郑核] 用户明确指定INTEL-02，保留14个H2、6组原实验主题与5道练习。旧正文和12个原cell留在baseline证据；不以旧v1.3标签代替验收。
[周联] 审计发现半间距三角支撑在相邻中心中点全部为零，旧程序静默输出0；Python ties-to-even与JS Math.round又不一致。先分开覆盖缺陷、规则死区和闭环整定，取消“模糊控制无法稳定倒立摆”的预设。模型更名为直接力矩单摆，保留方程参数。
[苏绘] 保留FuzzyTuningExplorer并暴露旧/覆盖修复/规则修复三种预设，固定轴和越界提示；六组notebook复算规则曲面、扫描、轨迹、积分、PID、结构，加测COG/BIS/MOM。不用ipywidgets。
[孙助] 五道原题保留去向：取整及对称性、缩放单位、无阻尼边界、局部斜率、TS符号；补稳定性和对比实验题。
[何仿] 合同：m=1kg、l=.5m、g=9.8，力矩限幅15Nm；默认20度/0rad每秒，T=6s，采样2ms、每拍保持力矩、RK4积分。报告全窗rms、末样角、末1s最大绝对角、真实控制序列TV、饱和比例；收敛验证减半步长。
[柯验] 调用真实TS计算，与独立Python高精度积分互核；精确Mamdani包络面积与一阶矩，不使用抄写TS自证。默认值与所有练习数值均需原cell输出；末样值不写稳态。
[何疑] PID与修复模糊各自同预算候选整定，锁定后至少三个未参与整定工况，含零输入持平、扰动或大初角失败；有限候选不外推方法优越。
[林码] 规则数组行=e、列=de；不要把反对称误写成负反馈充分条件。
[林矩] 清楚区分采样周期与积分步长、噪声敏感性及条件积分的更新次序；理想测角速度不等于实机差分。
[共识] 目标：解释覆盖与规则符号；按单位整定三因子；复算闭环和积分；公平比较；分清证据与稳定性证书。前置为INTEL-01和已交付PID/非线性基础，必要条件在本课重述。

## 附录 D：原稿审计与保留映射（开工）

| 原位置/资产 | 审计证据 | 保留/纠错/重写/迁移/拆分/删除 | 目标位置/去向 | 验证方式 |
|---|---|---|---|---|
| 14个H2与原URL | catalog和原稿一致 | 保留 | 同URL同H2 | 渲染ID与DOM |
| 6组Notebook/12cells | 重复实现及硬编码结论 | 纠错重写实现，保留主题 | 同6组实验并补全解模糊实验 | 干净内核与Pyodide |
| 半宽三角支撑 | x=.25等点分母为0 | 保留为故障示例，修复默认覆盖 | 规则/默认Explorer | 独立包络积分 |
| 规则平均取整 | Python与JS半整数不同 | 显式保留旧ties-even，新增加和规则 | 规则/结构实验 | n=5/7全表 |
| 21度硬上限/PID完胜/极限环 | 有限点、无证书 | 纠错 | 扫描/比较/稳定性 | 多工况及条件推导 |
| MOM/BIS文字而无cell | 实际无闭环实验 | 补算三方法，说明采样/平台定义 | 解模糊化 | 原cell |
| Lyapunov与TS稳定性 | 未证Vdot符号，各子系统稳定不充分 | 重写条件，保留教学主题 | 稳定性 | 解析反例 |
| 5道练习答案 | PD符号错误、隶属度与实现矛盾 | 逐题纠错，保留知识点 | 习题/答案 | Notebook输出 |

## Phase 2: 内容生成

### 第一轮 — 概念讲解

[周联] 原均匀三角支撑使用相邻中心中点当脚点，覆盖临界点为零；原平均规则在ZO周围保持ZO后件。修复覆盖和加和规则后，沿用同一Ge/Gce/Gu即可得到3.669619度rms；三个实现分开作因果对照，不改对象来制造效果。
[苏绘] 默认控制器保留两图、四个滑块，增加三版本和恢复默认，指标用全序列，图框溢出明确提示。
[何仿] 六组实验独立嵌入完整setup，COG对线性包络分段精确积分，原实验主题全部保留；增加真正的BIS/MOM闭环cell。初次生成路径多退一级导致ENOENT，修正生成器根目录后重生；误启动旧版验收已中止并保留baseline-interrupted.log，不计作通过。新稿6组14cell严格内核已通过。

### 第二轮 — 学生反馈

[林码] 旧稿“上一课所有实验开环”已不符合INTEL-01；现在从上一课闭环继续。平均规则的取整要明说，P-like后件只依赖行并不保证整个min/max推理只依赖e。局部斜率还要乘物理尺度；轴向差商不证明完整二维可微。
[郑核] 代陆阅核开篇：铰接杆向右偏、向左回摆、电机力矩和防止过冲对应明确，不再先下方法排名。要求保留旧H3链接，但在错误标题下明确撤回旧结论。
[孙助] 保留五题，纠正TS反馈符号和取整推导，新增稳定凸组合反例题。

### 第三轮 — 调整完善

[周联] 正文把末样角、末窗最大绝对角和数学稳态分开；加入采样保持/条件积分的更新顺序。Lyapunov原候选导数含两倍重力项，不能由写出候选宣称稳定；另列无扰/无饱和补偿律的有条件证明，明确不是Mamdani证书。
[林矩] 两个Hurwitz矩阵的凸组合可不稳定，TS须公共证书或其它适用条件。原Mamdani不可微所以无法证明稳定、所有快速不稳定系统都不适用等断言全部撤回。
[秦构] 首次真实HTTP发现Markdown表中的裸小于号被MDX视作标签，页面500；改为数学表达后重验，不用代码静态通过替代页面验证。
[柯验] 已有原生14cell通过，仍待独立包络积分、实际TS调用、浏览器与构建；未预填Phase3/4。

## Phase 3: 内容审校

### 教授团队（学术准确性）

[林矩] 复核单摆J=.25、重力系数19.6与力矩系数4；误差符号一致。旧反对称即负反馈、没有I必有静差、局部稳定规则凸组合全局稳定均不成立。替换为明确反例和有条件Wdot推导。轴向差商与物理斜率/二维可微性分开，保留完整阈值和定义。

### 工程团队（实践可行性）

[周联] 采样2ms、拍内保持和RK4一致；真实控制序列不补初始0，TV和末1s窗口定义一致。肩形、力矩限幅、条件积分更新有显式次序，理想角速度与真实差分区分。n3边界未达标，组件并不暗示修复规则对所有参数都有效。
[何仿] 六实验14cell产出规则/覆盖、三种缩放、三版本因果对照、积分/饱和、各9组训练＋5测试、结构/三解模糊/稳定矩阵反例；原六主题与原五题知识点全部保留，另增一题。

### 验证团队（独立把关）

[柯验] 调用lib/fuzzy-controller.ts实际导出的infer/simulateFuzzy；396组三设计/四个n/三规则模式含域外和非对称输入，对不导入生产或helper的SciPy quad核对。最初自适应积分漏掉极窄斜片，加入等宽三角的解析交点和各截断层跨中心断点后，最大差9.44e-15；没有放宽2e-8阈值。三组逐拍DOP853最大指标差1.18e-9。原生/Pyodide504个数值逐量相同。默认组件读数到六位与NB一致；旧半宽不连续模式的JS/Python轨迹末样有约1.16e-4度差，单列2e-4度容差，不声称其六位逐位相同。
[秦构] 实际页面H1=1/H2=14/KaTeX错误0、2canvas；三预设与四滑块min/max及默认恢复均实测，console error0。375px同源iframe的body/document均360，无重复ID，框图加载，目录目标全部存在。原生Notebook1实际按钮最终返回stdout，无运行中标记；初次并行初始化多余空闲内核只在本任务9007释放。生产构建/Pages余项完成后再签发。
[何疑] 强结论撤回；9对9候选搜索和锁定5工况公开，包括零持平、35度rms失败和恒扰动末窗失败。三版本/三规则/三解模糊只放行固定实现的因果/消融观察，不拿未整定P/D/MOM作方法优越性基线。

### 体验与脉络（读者、历史与安全）

[郑核] 代陆阅核开篇，杆的偏角、速度与电机动作具体对应。错误工程标题改为正确标题，旧ID用span别名保留，避免读者只扫标题读到撤回结论。正文无实机安全和全球最优承诺；四档案在本日志及证据目录。

### 教学支持（教学质量）

[孙助] 原5题分别保留取整/尺度/比例阻尼/局部斜率/TS后件；纠正原负后件正反馈，补凸组合反例题。全部数值定位NB1和NB6，不再手填与程序不同的隶属度。

### 学生审校（可读性）

[林码] 能按预设逐项排查覆盖、规则和整定，不再把“无效参数”归因于方法本性。末样、末窗与稳态分开；饱和、理想测量及有限候选边界可以从正文复述。代码在每个Notebook都含完整setup，不依赖另一个内核变量。

## Phase 4: 内容定稿

[郑核] 汇总并关闭林矩学术4组、周联实现3组、柯验数值4组、秦构前端3组、何疑比较3组、孙助题解2组、林码/可读性2组，共21组纠错与澄清，均在Phase2/3及附录D落点；无P0阻断项。
[待定] 无本课未决项。后续INTEL课程的旧继承断言仍应复核，未在本次越界改动。
[郑核-签发] 附录A.1的86行对账、B九项与C六条记录完整通过；源程序与独立参考、真实内核/浏览器/最终页面及构建一致。签发。
交付清单：MDX实测1082行、14H2、6Notebook14cell、1原名Explorer＋纯计算模块、1SVG、6题答案；唯一注册沿用，catalog原v1.3保持、tracker更新。真实master提交生成后另补hash，不预填合并。

## 附录 A：数值证据（全部实测数据的唯一留存副本）

### A.1 三方对账表（柯验）

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | J、重力及力矩系数 | 0.25 / 19.6 / 4 | 模型常量同真实TS | ✅ | NB1 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 2 | 设计合同：m,l,g,T,Ts,初角,力矩限幅 | 1kg / .5m / 9.8 / 6s / .002s / 20° / 15Nm | 同默认参数；声明输入，非估计量 | ✅ | 全部setup与NB3；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 3 | Ravg[3,2]与Rsum[3,2] | 2 / 3 | 真实TS ruleIndex全表 | ✅ | NB1 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 4 | 半整数2.5取偶/取上 | 2 / 3 | roundEven实调用 | ✅ | NB1 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 5 | n7向上取整反例和 | 7≠6 | 规则级反例 | ✅ | NB1 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 6 | 旧/新在.25处隶属度和 | 0 / 1 | infer.area与独立积分 | ✅ | NB1 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 7 | Ge20度到.8、30度到1 | 2.291831180523293 / 1.9098593171027443 | 不适用：默认Explorer未展示该实验 | ✅ | NB1 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 8 | 单比例恢复力阈值 | 4.9 | 不适用：默认Explorer未展示该实验 | ✅ | NB1 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 9 | Phi(.1,0) | 0.12068965517241377 | 真实TS infer | ✅ | NB1 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 10 | 归一化割线斜率 | 1.2068965517241377 | 真实TS infer | ✅ | NB1 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 11 | h=.0001轴向差商 | 1.4996001399559307 | 真实TS infer | ✅ | NB1 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 12 | 固定九候选双方选中参数 | (3,.25,12) / (60,10,6) | 真实TS31配置复算锁定组 | ✅ | NB5 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 13 | Ge=1.0 rms | 6.003034 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB2 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 14 | Ge=2.0 rms | 3.669619 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB2 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 15 | Ge=3.0 rms | 2.926155 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB2 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 16 | Gce=0.2 rms | 3.018930 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB2 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 17 | Gce=0.5 rms | 3.669619 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB2 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 18 | Gce=0.8 rms | 4.400988 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB2 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 19 | Gu=8.0 rms | 4.109428 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB2 cell3；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 20 | Gu=12.0 rms | 3.669619 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB2 cell3；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 21 | Gu=20.0 rms | 3.322348 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB2 cell3；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 22 | legacy rms | 21.056544 | JS与Python切换敏感；217指标复核，容差2e-4 | ✅ | NB3 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 23 | legacy tv | 579.108873 | JS与Python切换敏感；217指标复核，容差2e-4 | ✅ | NB3 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 24 | legacy maxU | 10.505797 | JS与Python切换敏感；217指标复核，容差2e-4 | ✅ | NB3 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 25 | coverage rms | 17.115352 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB3 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 26 | coverage tv | 10.171108 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB3 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 27 | coverage maxU | 2.497740 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB3 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 28 | repaired rms | 3.669619 | 3.669619°（真实默认UI） | ✅ | NB3 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 29 | repaired tv | 6.455382 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB3 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 30 | repaired maxU | 6.443686 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB3 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 31 | load=1 Ki=0.0 final | 2.275858 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB4 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 32 | load=1 Ki=0.0 tail | 2.275945 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB4 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 33 | load=1 Ki=2.0 final | 0.958418 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB4 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 34 | load=1 Ki=2.0 tail | 1.039582 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB4 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 35 | load=1 Ki=8.0 final | -0.048926 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB4 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 36 | load=1 Ki=8.0 tail | 0.065002 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB4 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 37 | TEST zero fuzzy rms | 0.000000 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 38 | TEST zero fuzzy tail | 0.000000 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 39 | TEST zero fuzzy tv | 0.000000 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 40 | TEST zero PID rms | 0.000000 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 41 | TEST zero PID tail | 0.000000 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 42 | TEST zero PID tv | 0.000000 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 43 | TEST small fuzzy rms | 1.257126 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 44 | TEST small fuzzy tail | 0.000000 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 45 | TEST small fuzzy tv | 10.486374 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 46 | TEST small PID rms | 1.124298 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 47 | TEST small PID tail | 0.082440 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 48 | TEST small PID tv | 13.555419 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 49 | TEST large fuzzy rms | 5.452849 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 50 | TEST large fuzzy tail | 0.000000 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 51 | TEST large fuzzy tv | 22.183416 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 52 | TEST large PID rms | 4.379882 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 53 | TEST large PID tail | 0.196105 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 54 | TEST large PID tv | 25.238649 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 55 | TEST gravity fuzzy rms | 2.695884 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 56 | TEST gravity fuzzy tail | 0.000000 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 57 | TEST gravity fuzzy tv | 17.782831 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 58 | TEST gravity PID rms | 2.304943 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 59 | TEST gravity PID tail | 0.146076 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 60 | TEST gravity PID tv | 20.734403 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 61 | TEST load fuzzy rms | 3.097970 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 62 | TEST load fuzzy tail | 1.407186 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 63 | TEST load fuzzy tv | 15.410230 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 64 | TEST load PID rms | 2.378026 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 65 | TEST load PID tail | 0.289003 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 66 | TEST load PID tv | 19.722573 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB5 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 67 | PD rms | 3.669619 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB6 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 68 | PD tail | 0.000000 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB6 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 69 | PD tv | 6.455382 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB6 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 70 | P rms | 16.587020 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB6 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 71 | P tail | 25.917651 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB6 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 72 | P tv | 214.196581 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB6 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 73 | D rms | 122.072250 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB6 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 74 | D tail | 173.134836 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB6 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 75 | D tv | 9.239778 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB6 cell1；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 76 | COG rms | 3.669619 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB6 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 77 | COG tail | 0.000000 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB6 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 78 | COG tv | 6.455382 | 真实TS同配置，217指标复核；非默认组不冒称默认读数 | ✅ | NB6 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 79 | BIS rms | 3.770013 | 不适用：组件固定COG；独立原生/Pyodide互核 | ✅ | NB6 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 80 | BIS tail | 0.000002 | 不适用：组件固定COG；独立原生/Pyodide互核 | ✅ | NB6 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 81 | BIS tv | 6.390132 | 不适用：组件固定COG；独立原生/Pyodide互核 | ✅ | NB6 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 82 | MOM rms | 6.217119 | 不适用：组件固定COG；独立原生/Pyodide互核 | ✅ | NB6 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 83 | MOM tail | 7.479000 | 不适用：组件固定COG；独立原生/Pyodide互核 | ✅ | NB6 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 84 | MOM tv | 675.008904 | 不适用：组件固定COG；独立原生/Pyodide互核 | ✅ | NB6 cell2；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 85 | PD线性化极点 | -13.8973666 / -10.1026334 | 不适用：默认Explorer未展示该实验 | ✅ | NB6 cell3；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |
| 86 | 两局部矩阵及均值矩阵谱 | (-1,-1) / (-1,-1) / (4,-6) | 不适用：默认Explorer未展示该实验 | ✅ | NB6 cell3；角度deg/力矩Nm，rms全6s，tail末1s，非旧模式1e-6，legacy2e-4；原生/Pyodide同打印数 |

### A.2 实测数据总表（何仿）

| 来源 | 量 | 实测值 |
|---|---|---|
| NB1 cell1 | 原始标准输出 | n= 5 average rules= [[0, 0, 1, 2, 2], [0, 1, 2, 2, 2], [1, 2, 2, 2, 3], [2, 2, 2, 3, 4], [2, 2, 3, 4, 4]] symmetry error= 0 |
| NB1 cell1 | 原始标准输出 | n= 7 average rules= [[0, 0, 1, 2, 2, 2, 3], [0, 1, 2, 2, 2, 3, 4], [1, 2, 2, 2, 3, 4, 4], [2, 2, 2, 3, 4, 4, 4], [2, 2, 3, 4, 4, 4, 5], [2, 3, 4, 4, 4, 5, 6], [3, 4, 4, 4, 5, 6, 6]] symmetry error= 0 |
| NB1 cell1 | 原始标准输出 | sum rules n=5= [[0, 0, 0, 1, 2], [0, 0, 1, 2, 3], [0, 1, 2, 3, 4], [1, 2, 3, 4, 4], [2, 3, 4, 4, 4]] |
| NB1 cell1 | 原始标准输出 | average[3,2]= 2 sum[3,2]= 3 |
| NB1 cell1 | 原始标准输出 | half-even round(2.5)= 2 half-up= 3 |
| NB1 cell1 | 原始标准输出 | n7 half-up example= 7 |
| NB1 cell1 | 原始标准输出 | old= True coverage sum at .25= 0.0 |
| NB1 cell1 | 原始标准输出 | old= False coverage sum at .25= 1.0 |
| NB1 cell1 | 原始标准输出 | Ge20= 2.291831180523293 Ge30= 1.9098593171027443 J= 0.25 gravity= 19.6 torque coefficient= 4.0 |
| NB1 cell1 | 原始标准输出 | proportional threshold= 4.9 |
| NB1 cell1 | 原始标准输出 | Phi(.1,0)= 0.12068965517241377 secant= 1.2068965517241377 axis h=.0001= 1.4996001399559307 |
| NB1 cell1 | 原始标准输出 | physical axis difference quotient= 35.99040335894234 |
| NB1 cell2 | 原始标准输出 | legacy surface min/max= -0.9166666666666666 0.9166666666666666 oddness= 2.220446049250313e-16 |
| NB1 cell2 | 原始标准输出 | repaired surface min/max= -0.8333333333333334 0.8333333333333334 oddness= 7.771561172376096e-16 |
| NB2 cell1 | 原始标准输出 | Ge=1.0 rms=6.003034 final=0.004847 tail=0.022160 tv=3.981501 maxU=3.981868 saturation=0.000000 gaps= 0 |
| NB2 cell1 | 原始标准输出 | Ge=2.0 rms=3.669619 final=0.000000 tail=0.000000 tv=6.455382 maxU=6.443686 saturation=0.000000 gaps= 0 |
| NB2 cell1 | 原始标准输出 | Ge=3.0 rms=2.926155 final=-0.000000 tail=0.000000 tv=11.644844 maxU=10.000000 saturation=0.000000 gaps= 0 |
| NB2 cell2 | 原始标准输出 | Gce=0.2 rms=3.018930 final=-0.000000 tail=0.000000 tv=11.726192 maxU=6.443686 saturation=0.000000 gaps= 0 |
| NB2 cell2 | 原始标准输出 | Gce=0.5 rms=3.669619 final=0.000000 tail=0.000000 tv=6.455382 maxU=6.443686 saturation=0.000000 gaps= 0 |
| NB2 cell2 | 原始标准输出 | Gce=0.8 rms=4.400988 final=0.000042 tail=0.000401 tv=6.811040 maxU=6.443686 saturation=0.000000 gaps= 0 |
| NB2 cell3 | 原始标准输出 | Gu=8.0 rms=4.109428 final=0.000000 tail=0.000000 tv=4.302656 maxU=4.295790 saturation=0.000000 gaps= 0 |
| NB2 cell3 | 原始标准输出 | Gu=12.0 rms=3.669619 final=0.000000 tail=0.000000 tv=6.455382 maxU=6.443686 saturation=0.000000 gaps= 0 |
| NB2 cell3 | 原始标准输出 | Gu=20.0 rms=3.322348 final=0.000000 tail=0.000000 tv=11.142576 maxU=10.739476 saturation=0.000000 gaps= 0 |
| NB3 cell1 | 原始标准输出 | legacy rms=21.056544 final=20.281672 tail=21.921256 tv=579.108873 maxU=10.505797 saturation=0.000000 gaps= 0 |
| NB3 cell1 | 原始标准输出 | coverage rms=17.115352 final=17.394058 tail=17.502079 tv=10.171108 maxU=2.497740 saturation=0.000000 gaps= 0 |
| NB3 cell1 | 原始标准输出 | repaired rms=3.669619 final=0.000000 tail=0.000000 tv=6.455382 maxU=6.443686 saturation=0.000000 gaps= 0 |
| NB3 cell2 | 原始标准输出 | sample period=0.004 rms=3.668074 final=0.000000 tail=0.000000 tv=6.455952 maxU=6.443686 saturation=0.000000 gaps= 0 |
| NB3 cell2 | 原始标准输出 | sample period=0.002 rms=3.669619 final=0.000000 tail=0.000000 tv=6.455382 maxU=6.443686 saturation=0.000000 gaps= 0 |
| NB3 cell2 | 原始标准输出 | sample period=0.001 rms=3.670368 final=0.000000 tail=0.000000 tv=6.455078 maxU=6.443686 saturation=0.000000 gaps= 0 |
| NB3 cell2 | 原始标准输出 | These runs change the held-input sampling period; they are not a continuous-time certificate. |
| NB4 cell1 | 原始标准输出 | load=1 Ki=0.0 rms=4.853490 final=2.275858 tail=2.275945 tv=5.741659 maxU=6.443686 saturation=0.000000 gaps= 0 |
| NB4 cell1 | 原始标准输出 | load=1 Ki=2.0 rms=4.390071 final=0.958418 tail=1.039582 tv=5.769325 maxU=6.445082 saturation=0.000000 gaps= 0 |
| NB4 cell1 | 原始标准输出 | load=1 Ki=8.0 rms=3.960911 final=-0.048926 tail=0.065002 tv=5.682547 maxU=6.449271 saturation=0.000000 gaps= 0 |
| NB4 cell1 | 原始标准输出 | saturation stress, Ki=8 rms=11.726070 final=-0.771225 tail=0.864160 tv=17.116663 maxU=15.000000 saturation=0.004333 gaps= 0 |
| NB4 cell1 | 原始标准输出 | Conditional integration blocks only accumulation further into saturation; no claim of global stability. |
| NB5 cell1 | 原始标准输出 | TRAIN fuzzy 1.0 0.25 12.0 score= 4.581371261440707 |
| NB5 cell1 | 原始标准输出 | TRAIN fuzzy 1.0 0.5 12.0 score= 6.1048241050915335 |
| NB5 cell1 | 原始标准输出 | TRAIN fuzzy 1.0 1.0 12.0 score= 9.45358488674063 |
| NB5 cell1 | 原始标准输出 | TRAIN fuzzy 2.0 0.25 12.0 score= 3.2654405933288833 |
| NB5 cell1 | 原始标准输出 | TRAIN fuzzy 2.0 0.5 12.0 score= 3.7987263750913427 |
| NB5 cell1 | 原始标准输出 | TRAIN fuzzy 2.0 1.0 12.0 score= 4.950448899817358 |
| NB5 cell1 | 原始标准输出 | TRAIN fuzzy 3.0 0.25 12.0 score= 3.0281398133985156 |
| NB5 cell1 | 原始标准输出 | TRAIN fuzzy 3.0 0.5 12.0 score= 3.1590514775167233 |
| NB5 cell1 | 原始标准输出 | TRAIN fuzzy 3.0 1.0 12.0 score= 3.9729188857676 |
| NB5 cell1 | 原始标准输出 | TRAIN PID (20.0, 10.0, 3.0) score= 3.406819481537238 |
| NB5 cell1 | 原始标准输出 | TRAIN PID (20.0, 10.0, 6.0) score= 4.163533099153926 |
| NB5 cell1 | 原始标准输出 | TRAIN PID (20.0, 10.0, 9.0) score= 4.986345667176103 |
| NB5 cell1 | 原始标准输出 | TRAIN PID (40.0, 10.0, 3.0) score= 2.985488470852246 |
| NB5 cell1 | 原始标准输出 | TRAIN PID (40.0, 10.0, 6.0) score= 3.245700507778686 |
| NB5 cell1 | 原始标准输出 | TRAIN PID (40.0, 10.0, 9.0) score= 3.762761268176313 |
| NB5 cell1 | 原始标准输出 | TRAIN PID (60.0, 10.0, 3.0) score= 2.971280049549772 |
| NB5 cell1 | 原始标准输出 | TRAIN PID (60.0, 10.0, 6.0) score= 2.8542480740645106 |
| NB5 cell1 | 原始标准输出 | TRAIN PID (60.0, 10.0, 9.0) score= 3.1395928788251117 |
| NB5 cell1 | 原始标准输出 | FROZEN fuzzy= (3.0, 0.25, 12.0) PID= (60.0, 10.0, 6.0) |
| NB5 cell2 | 原始标准输出 | TEST zero fuzzy rms=0.000000 final=0.000000 tail=0.000000 tv=0.000000 maxU=0.000000 saturation=0.000000 gaps= 0 |
| NB5 cell2 | 原始标准输出 | TEST zero PID rms=0.000000 final=0.000000 tail=0.000000 tv=0.000000 maxU=0.000000 saturation=0.000000 gaps= 0 |
| NB5 cell2 | 原始标准输出 | TEST small fuzzy rms=1.257126 final=0.000000 tail=0.000000 tv=10.486374 maxU=6.006585 saturation=0.000000 gaps= 0 |
| NB5 cell2 | 原始标准输出 | TEST small PID rms=1.124298 final=-0.068506 tail=0.082440 tv=13.555419 maxU=10.475466 saturation=0.000000 gaps= 0 |
| NB5 cell2 | 原始标准输出 | TEST large fuzzy rms=5.452849 final=0.000000 tail=0.000000 tv=22.183416 maxU=10.000000 saturation=0.000000 gaps= 0 |
| NB5 cell2 | 原始标准输出 | TEST large PID rms=4.379882 final=-0.162959 tail=0.196105 tv=25.238649 maxU=15.000000 saturation=0.009667 gaps= 0 |
| NB5 cell2 | 原始标准输出 | TEST gravity fuzzy rms=2.695884 final=0.000000 tail=0.000000 tv=17.782831 maxU=10.000000 saturation=0.000000 gaps= 0 |
| NB5 cell2 | 原始标准输出 | TEST gravity PID rms=2.304943 final=-0.120962 tail=0.146076 tv=20.734403 maxU=15.000000 saturation=0.003000 gaps= 0 |
| NB5 cell2 | 原始标准输出 | TEST load fuzzy rms=3.097970 final=1.407186 tail=1.407186 tv=15.410230 maxU=10.000000 saturation=0.000000 gaps= 0 |
| NB5 cell2 | 原始标准输出 | TEST load PID rms=2.378026 final=0.240154 tail=0.289003 tv=19.722573 maxU=15.000000 saturation=0.003333 gaps= 0 |
| NB5 cell2 | 原始标准输出 | Finite candidate sets, fixed window, ideal measurements; no universal method ranking. |
| NB6 cell1 | 原始标准输出 | PD rms=3.669619 final=0.000000 tail=0.000000 tv=6.455382 maxU=6.443686 saturation=0.000000 gaps= 0 |
| NB6 cell1 | 原始标准输出 | P rms=16.587020 final=2.641583 tail=25.917651 tv=214.196581 maxU=8.134172 saturation=0.000000 gaps= 0 |
| NB6 cell1 | 原始标准输出 | D rms=122.072250 final=173.134836 tail=173.134836 tv=9.239778 maxU=4.897511 saturation=0.000000 gaps= 0 |
| NB6 cell2 | 原始标准输出 | COG rms=3.669619 final=0.000000 tail=0.000000 tv=6.455382 maxU=6.443686 saturation=0.000000 gaps= 0 |
| NB6 cell2 | 原始标准输出 | static asymmetric input (.37,-.12) COG 0.17627757609606257 |
| NB6 cell2 | 原始标准输出 | BIS rms=3.770013 final=0.000000 tail=0.000002 tv=6.390132 maxU=6.390132 saturation=0.000000 gaps= 0 |
| NB6 cell2 | 原始标准输出 | static asymmetric input (.37,-.12) BIS 0.3287856444554734 |
| NB6 cell2 | 原始标准输出 | MOM rms=6.217119 final=4.340201 tail=7.479000 tv=675.008904 maxU=10.504452 saturation=0.000000 gaps= 0 |
| NB6 cell2 | 原始标准输出 | static asymmetric input (.37,-.12) MOM 0.5 |
| NB6 cell3 | 原始标准输出 | A1 eigenvalues= [-1. -1.] |
| NB6 cell3 | 原始标准输出 | A2 eigenvalues= [-1. -1.] |
| NB6 cell3 | 原始标准输出 | average eigenvalues= [ 4. -6.] |
| NB6 cell3 | 原始标准输出 | PD poles= [-13.8973666 -10.1026334] |
| NB6 cell3 | 原始标准输出 | TS identical consequents at e=-.2 de=.1 = -7.4 |
| NB6 cell3 | 原始标准输出 | Positive gain on e=-theta gives restoring torque; local stable rules alone do not certify a blend. |

原始完整输出（含图像）native-outputs.json；浏览器原始pyodide-download.json；source/setup逐字符串转移证明pyodide.json、refresh-proof.mjs；396积分与3保持输入参考reference.json，217指标/504数值validation.json。旧默认原始程序baseline-run.py实跑rms21.10/末样21.69/TV915，baseline-default.log；原文字称“稳态”保留为负例，不追认该术语。

## 附录 B：前端交付硬门槛实际输出（秦构）

以下均为实际执行，命令的完整stdout见本课证据目录；原编号保留。

| # | 原九项门槛 | 实际命令/证据 | 关键输出与退出码 | 判定 |
|---|---|---|---|---|
| 1 | npm run build通过 | build-final.log、pages-build-final.log | 两次生产编译成功；build exit0；Pages205课/9旧入口pass，exit0 | ✅ |
| 2 | curl课程页HTTP200 | WIKI_VERIFY_PORT=18207 node scripts/verify-lesson.mjs intelligent/fuzzy-controller-design；verify.log | PASS9/WARN0/FAIL0/SKIPPED0，HTTP200；browser-native.json、browser-pages.json | ✅ |
| 3 | 页面H2数等于catalog | 同命令＋实际DOM | H1=1/H2=14；顺序和ID与渲染编译管线完全一致 | ✅ |
| 4 | katex-error为0 | 同命令＋两套375px DOM | katexErrors=0 | ✅ |
| 5 | cell字符串全等并实际内核运行 | node scripts/nb-cells.mjs verify intelligent/fuzzy-controller-design --port 9007 --require-kernel | 6Notebook/14cell/ERROR0/SKIPPED0，exit0；原始outputs另存native-outputs.json | ✅ |
| 6 | 组件唯一来源注册 | npm run check及verify.log注册附录 | 沿用FuzzyTuningExplorer原名与lib/wiki-components.ts原注册，无新增注册表，PASS | ✅ |
| 7 | MDX显式引用组件 | verify.log、正文 | FuzzyTuningExplorer显式引用1次，PASS | ✅ |
| 8 | 固定坐标、无动画、Option及默认值 | components/wiki/fuzzy-tuning-explorer.tsx；scripts/verify-intel02.mjs；实际交互 | x0..6/y角±30/u±16；animation:false；useMemo Option；默认rms3.669619/TV6.455382/maxU6.443686；四控件min/max与恢复默认实测；exit0 | ✅ |
| 9 | 无ipywidgets家族 | 同nb-cells S2 | S1–S7全绿，S2无FAIL；exit0 | ✅ |

附加门槛：S8模块级nbSeq/newNotebookId/重复id兜底全过；S1首行无magic、S3无JSX属性逗号、S4无残留占位。npm run math:check exit0（files0/tokens0）；glossary:check exit0（既有WARN不伪造清零）。页面42旧ID通过真实DOM逐项核对，6错误H3改正确标题并给别名，重复ID0；375px视口body/document360，SVG加载且Pages basePath正确；侧栏目标无悬空；console error0。原生UI及Pages UI分别真实运行NB1，全部输出正常。

构建首次因ES5目标下Set直接展开失败，改Array.from(Set)后build-final.log通过；公式表裸小于号导致的初次MDX500已改数学表达。第一次误启动旧版内核验收中断，不记为通过；旧默认独立Python执行baseline-default.log exit0支持21.10/21.69/915负例。所有已修失败保留实际日志。

## 附录 C：红队放行记录

| # | 对比断言（原句 + file:line） | 基线整定与扫描范围（a） | 组数与落败场景（b） | 正文的边界与代价（c） | 放行? |
|---|---|---|---|---|---|
| 1 | “Mamdani控不住倒立摆/有硬上限”旧引言 | 旧实现有覆盖和死区缺陷 | 修复同尺度默认rms3.669619，直接反驳普适断言 | 原强结论撤回；本课非实机/非全局证书 | 否决旧句；修复说明放行 |
| 2 | 本组锁定PID非零测试rms更小，模糊PD TV较小；与常规PID的定量对比 | 同模型/采样/限幅/条件积分/指标，双方各9候选；参数族及域不同，公开评分 | 零持平、10°/35°/重力/恒负载5组；模糊35°rms和恒负载tail失败 | 固定候选与6s窗口；PID饱和与指标取舍、无I对照区别、无噪声延迟证据明确 | 放行限定观察 |
| 3 | 三实现因果对照；模糊PD控制器 | 同Ge/Gce/Gu对象，只换覆盖/规则 | legacy/coverage/repaired3组，旧版失败保留 | 消融观察，无方法类排名 | 放行限定观察 |
| 4 | PD/P/D规则实验；规则库结构的影响 | 不声称独立整定，固定规则和尺度 | 3组，P/D末窗失败、完整指标输出 | 两输入退化不等于纯线性P/D，无普适结论 | 放行限定观察 |
| 5 | COG/BIS/MOM固定参数实验；解模糊化方法对闭环的影响 | 共用完整包络、对象和采样；未单独整定 | 3组，MOM未满足rms/tail/TV目标 | 不外推MOM必然抖振，定义平台均值与精确积分 | 放行限定观察 |
| 6 | Ge/Gce/Gu有限扫描；比例因子整定 | 每次固定其它因子，非全局优化 | 各3组含Ge1等未达rms目标 | 不再称Gce/Gu无效，尺度不等于常增益 | 放行限定观察 |

### 附录D关闭说明

原稿、6组12cell完整源保存在baseline-source.mdx.txt及baseline-notebooks.json；本轮六组主题全部保留，重写重复和错误实现为各Notebook可独立运行的完整setup，新补2cell覆盖原来没有可执行代码的解模糊与稳定性反例。14H2、原5题所有知识点、42旧ID/URL去向已逐项核对；另增第6题。无拆分、无待迁材料。下游neural-network-control等旧课继承的强结论属于后续INTEL-05范围，本课未擅改其它课程。


最终范围复验：基线52a8b02391f069abb87fd0fd30c9e605bc72bfa1的已提交master加INTEL-02，scoped-check PASS21/WARN2/FAIL0、scoped-semester PASS、scoped-fix PASS、scoped-python PASS；scoped-verify-final PASS9/WARN0/FAIL0/SKIPPED0，退出码均0。首次冷编译探测出现SKIPPED的scoped-verify.log保留，warm后HTTP200与scoped-verify-final才作有效验收。native build首次Set迭代ES5类型错误已改Array.from；最终Pages再次完整导出205课程及9旧路由。
