# 系统稳定性 · CLASSIC-04 讨论日志

- 日期：2026-10-18；模式：重构，wiki-lesson-refactor + semester-03-core。
- 起点master11187fb，分支wp/classic-04-stability；唯一交付classic/stability-analysis。
- baseline-source.json保存旧MDX SHA与共用渲染标题全集，baseline-check.log为事实基线。旧页面已实际打开；4Notebook、2Explorer仅本课调用，无独立旧日志可继承。
- 以下是既有角色的结构化审查视角，不冒充真实外部专家或独立Agent。证据目录.agent/semester-03/classic-04/。

## 出席与沉默表

| 角色 | 状态 | 职责 |
|---|---|---|
| 郑核 | 出席 | 主持/代实验合同及体验档案/签发 |
| 陈控 | 出席 | classic主责、代数与频域边界 |
| 林矩 | 出席 | 内部状态/虚轴重根/可稳定性 |
| 苏绘 | 出席 | 双轨分配、稳定域与时滞图规范 |
| 孙助 | 出席 | 原十题及答案保留 |
| 柯验 | 出席 | 独立计算、三方对账 |
| 秦构 | 出席 | 实现及原九项+四门槛 |
| 何疑 | 出席 | Padé/精确及方法比较限定 |
| 李稳 | 出席 | 学习顺序/术语/条件复述 |
| 钱锐 | 出席 | 零行与重根反例 |

[沉默-何仿：本课theory，实验合同由郑核代列，独立复核归柯验。]
[沉默-陆阅：本课非math/history，开篇与四档案由郑核代核。]
[沉默-周联、吴规、许史、范安、轮值专家、小初、赵工、林码、岳自：本课为有限维线性判据推导，非实现/案例/历史/学习/数学课；工程限制由陈控/秦构核，不作实际安全承诺。]

## Phase 1: 内容规划

[郑核] 审计确认原14H2和十题；保留正确Routh/Hurwitz推导、参数域、坐标平移、根轨迹频域桥梁、倒立摆及两种时滞对象。原开篇误把后续课程当先修，改从上一课车身扰动后能否衰减引入。目标：区分三种稳定概念；完成含零首元/零行的Routh；求增益和衰减域；核局部PD模型；区别精确时滞与近似边界。非目标：完整Lyapunov/Jury/Nyquist证明或实际小车控制部署。

[林矩] 原稿“大多数等价”、虚轴一律临界、双零根临界、系数负便结构不可稳定均需纠正。零输入Lyapunov稳定要求虚轴特征值半单；约分后输出稳定不能推出内部稳定。教学摆改为固定转轴、受转矩、忽略阻尼的局部模型，不能伪称完整小车角度传函。

[钱锐] 原“首元零但非零行”例实际是全零行；新增s³+2s+1真首元零例，保留原K6例移全零行。重复零行再用辅助多项式导数，不能用任意1e-10判断边界稳定。

[苏绘] 定义/特殊行用Notebook算精确式；两已有Explorer保留：三阶参数平面+局部PD域，时滞图改精确与一阶Padé临界线及指定点状态，不扫有限L网格冒充最大值。上下排列、固定轴、animation:false、inline、端点/恢复可测。

[何疑] 同一K、同一模型比较精确与近似，至少K1/2/5/10，含两者同判及Padé误判工况；限定解析模型而非宣称某算法普遍优越。频域方法比较仅信息类型，不编造速度排名。

[柯验] 先跑minimal.py：K5精确临界.4495249623s，Padé.4770329614s；K5/L.46应出现分歧。旧PM30/穿越1.3修为精确求根读数。实际TS计算须对独立Python求根/虚轴方程；Notebook原始setup/cell各自新内核，不能复用旧输出。

[郑核] 实验合同：连续时间、实系数、单位负反馈、零初值的输入输出判据与任意小初值内部判据分别说明；时间s/角频率rad/s；参数教学归一化。三阶a2=.5…10、a1/a0网格含边界；PD kp0…20/kd0…10。时滞K=.5…15、L0…3，精确边界从虚轴幅相方程求；不以有限网格作证明。无随机数，无训练；单组预算秒级。根容差1e-7、精确符号全等、临界量1e-9、图默认6位显示1e-6。

[孙助] 原十题全部保留：1普通表、2/3参数与虚轴、4平移、5PI/PD、6充要证明、7零行、8另一个时滞模型、9衰减域、10Hurwitz互核。答案6用Routh两向证明替代对复根作大小比较；答案8纠正“正反馈”笔误；答案9用根实部和/缺项证明，单个K7例不能证明全域。

[共识] 苏绘保留两交互并改真边界与局部模型；孙助保留十题及正确推导；柯验先最小实验再完整原始内核、实际TS独立核数。两长H2缩短并保留旧锚点，全部旧标题可达；本课不交付其它课程，也不关闭W06–W09。

## Phase 2: 内容生成

### 第一轮 — 概念讲解

[陈控] 据审计先修改定义、Routh特殊情况及模型边界，保留原正确推导和十题结构。依次建立“看哪种响应—用哪个多项式—怎样处理边界—近似能证明什么”的主线。当前仅第一轮，不提前记录学生或签发结论。

### 第二轮 — 学生反馈

[李稳] 第一稿开篇已能复述“撤掉外力后偏差是否消失”，不再倒用根轨迹先修。但内部稳定一段若只说“半单”，初学者不懂；需给二重零根的角速度反例、一个不参与输出的增长状态，并让代码核验。相对稳定段须说清2是上确界，不能写能取到的最大sigma。

[钱锐] 第一稿已分开真正首元零与零行。建议原重复虚轴根例和题7简单虚轴根并排核，证实“0个RHP根”不等于严格稳定；再加A(s)=s²−1的零行反例，避免读者误以为零行只能产生纯虚根。精确时滞边界证明要补ds/dL在穿越时实部正，而不是找到一个jω就宣布全区间。

[孙助] 十题原稿均保留，但题3“临界值”还含下端K=0，答案只答K10不完整；须列两端。题8负反馈文字已纠正，原题的1/(s+1)时滞对象不能和交互1/[s(s+2)]共用边界。

### 第三轮 — 调整完善

[陈控] 据反馈添加隐藏状态、共振与Jordan/双零根实验；精确时滞写出隐式根导数并在多K穿越点核正号。保留十题，题3增K0的零根；K10的一对虚轴根保留。题9用全根实部和证明全域无解。

[苏绘] 两交互分别提供模型与单位；三阶默认a2=3/a1=5边界15，PD默认Kp12/Kd2，时滞默认K5/L.46。上下一列避免旧双栏在手机压窄。解析边界、当前点、严格不等号及恢复按钮必须同时可见。

[柯验] 改稿后执行原始八实验，不复用旧浮点Routh。符号表处理epsilon和全零行并保留事件记录；对近虚轴重根以精确因式分解判定，不让np.roots浮点误差冒充稳定性证书。组件只算已声明三阶/PD/时滞模型，不伪装成通用Routh求解器。

[秦构] 初次verify为PASS7/FAIL2：轻量扫描器把数学中的小于L_识别为JSX并吞掉后方时滞组件；真实页面HTTP200。按W08已知问题仅将该数学关系用LaTeX lt表达，数学意义不变，复核原始8标签及两组件各1，W08继续待办。失败输出保留page-draft.log，不伪记初次通过。

## Phase 3: 内容审校

### 教授团队（学术准确性）

[陈控] 保留原Routh/Hurwitz例题，必要系数条件限Hurwitz严格稳定；常规表与特殊行分开，首元零例改s³+2s+1，原K6例归全零行。根轨迹仅本例有0<K<30，不推成普遍单阈值；PM/GM按幅相方程复算，纠正旧近似。外部参考核对Illinois ECE486 Lecture7/18（2026-10-18），不把文献当本课实跑。

[林矩] 内部渐近/零输入Lyapunov/BIBO已分清，虚轴半单、双零根增长及隐藏状态实验形成反例；摆用固定转轴转矩模型，单位与小角度边界明确。PI族不能稳定不等于对象不可稳定。题6不再对复根作实数乘积大小比较；题9以根实部总和给全域证明。

### 工程团队（实践可行性）

本组按Phase1分工由郑核代审实验合同；独立数值审查归柯验。

[郑核] 代核：无随机种子；摆角度局部、理想导数/噪声滤波未部署；有限频带不能推全频稳定；精确时滞仅本课指定负反馈模型。严格L区间不含边界，L0降阶单独处理。没有把教学位移/角度例说成安全认证。

### 验证团队（独立把关）

[柯验] verify-classic04.mjs调用组件真实TS模块，独立Python多项式根核20×5151三阶节点、2601PD点及12极点工况，146时滞参数由独立幅相/多项式方程brentq求解，边界最大误差2.531308496145357e-13。8个页面原始setup/cell逐个新内核、8个Pyodide全过。minimal.py另符号化核Re(1/(ds/dL))=2(ω²+2)/(ω²(ω²+4))>0（ω>0），故每次穿越向右，而非只拿几个数值点作全域证明。A.1枚举正文与十答案的表、根、边界、裕度、分解；A.2存其它实测。虚轴重根用精确分解，不用浮点根的微小实部签发。

[何疑] Padé与精确对比固定同K/同对象，K1/2/5/10/15保留全部边界；K5的L.2/.46/.6有持平与误判。三阶/PD同族不同参数仅限定稳定域，三种方法只比较所需信息与能回答的问题，无运行速度排名。C逐条核边界与代价。

[秦构] 原生严格内核已EXECUTED，无S6跳过；轻量扫描误报保留初次失败，数学lt修复后两个Explorer均被登记检查，page-review.log为PASS9/WARN0/FAIL0/SKIPPED0。生产构建与真实DOM/参数/恢复/窄屏验收尚在进行，未签发。

### 体验与脉络（读者、历史与安全）

[郑核] 代陆阅逐段核：开篇承已交付车身受力例提出外力撤销后的偏差，术语后置。定义新增半单用双零根/Jordan的t项解释；移位衰减界与频域GM/PM分开。原系统建模/时域课程是起点，频域/根轨迹只预览。四份档案在签发前齐备再核；不作桥梁坍塌等无依据灾难承诺。

### 教学支持（教学质量）

[孙助] 十题逐题覆盖：1一般Routh，2/3参数端点与频率，4坐标平移，5PI/PD，6双向证明，7零行，8另一时滞对象，9全域衰减界，10Hurwitz。题3补K0，题8始终负反馈，题9不能用单点样例替全域。答案Notebook逐项输出已过。

[郑核] 符号裁决：a_i只指特征多项式系数，σ为实部平移量而非标准差；J为转动惯量，L为时滞，摆质心距用小写l，避免长度L与延迟L混用。N_cw明确顺时针方向，P/Z计右半平面极点/零点；ε是正无穷小而非某个固定浮点量。新增含义用课内作用域并记符号约定，glossary门槛无FAIL。fix037登记现有团队未执行的稳定性边界检查，角色不扩编。

### 学生审校（可读性）

[李稳] 现在能从上一课提问复述：先问初始偏差与持续输入，再选多项式；0个RHP不等于严格稳定。sigma2和时滞临界值都是上确界不能取。14节顺序保留，旧推导与十题未丢失。

[钱锐] 对照新增例：s²−1全零行含右实根、重复虚轴例两次零行、题7简单虚轴模态均有实算；边界判定不再由任意epsilon替换。精确时滞两侧局部复根.44/.46验证穿越方向，但正文全区间结论依靠唯一幅值解和正向穿越证明，不拿有限续接样本声称穷尽无穷根。

## Phase 4: 内容定稿

参与者：郑核、陈控、林矩、苏绘、孙助、柯验、何疑、秦构、李稳、钱锐。

[秦构] 最终build/build:pages/tsc均退出0，205课/9旧路由/317525363字节；最终页面verify PASS9/WARN0/FAIL0/SKIPPED0。生产14H2与目录顺序/真实ID逐项相等，54旧ID含2别名可达、无重复，56公式居中且独立横滚；8Notebook/两交互/3图（5canvas图层）独立核数。五滑块首尾、默认恢复、无阻尼/双零根通过。截图发现图标题/图例重叠与颜色不一致，修top0/两项图例/显式itemStyle后重新构建，最终narrow.png图文无重叠且红蓝一致；pd.png与opening.png已实际查看。390px正文343=scroll343/文档375=scroll375、10section无溢出，浏览器warn/error为空。

[柯验] A.1共118行覆盖所有保留表/根/边界与十题。真实TS20×5151三阶节点、2601PD点/12极点工况、146边界对独立根/幅相求解通过；最大边界误差2.531308496145357e-13。八原始setup/cell各自严格内核与浏览器Pyodide全过，原始标签/提取/内核/浏览器/DOM分别8，112独占围栏/56display。源文件、reconciliation与browser-python同SHA dc5b9e96edc386a4eb74a55d503795a3b284bbdbde5e0fdb2b8d8986825f4190。生产页十题答案“全部运行”实际完成。

[何疑] C三条全部限定观察/反例放行。同K同对象的精确/Padé含持平与失效，P/PD限定局部转矩模型，方法对比未作性能排名；未用单个K样例证明全域。

[孙助] 十题/答案保留，题3两端、题4行标、题6证明、题8负反馈和题9全域结论已关闭；D原资产逐类有去向，无迁出材料。

[郑核] 代陆阅核日志/A/B/C及D齐全，开篇具体车身对象与撤力后的变化由李稳复述；不把后续频域/根轨迹课当已学。69其它课支持记录/政策、30待处理实验逐字段不变；W06/W07/W08/W09继续待办，原生IAB网关UI问题不冒充已修，两用户批阅文件未编辑未暂存。

[待定] 无 P0 阻断项。W08仅在本课用数学lt语法避免误报，未修全站扫描器；W09严格直接内核/Pyodide验收不等于原生IAB连接已修。其余已登记全站WARN保留。

[郑核-签发] 学术条件、118行对账、红队与原九项+四条均有实际证据，批准唯一CLASSIC-04交付。生成台账后check已PASS21/WARN2/FAIL0，合并前最终check必须再次退出0，失败则撤回签发；合并列只在真实no-ff后填写。

交付清单：本课MDX、两Explorer/共用真实计算模块、catalog/自动OUTLINE、2旧ID别名、八原始实验/独立数值/生产UI证据、讨论日志、符号约定、fix037与既有角色清单、Python支持本课记录、全局checklist/计划/旧tracker。下一课另起对话，不自动发布gh-pages。

## 附录 A：数值三方对账

### A.1 三方对账表（柯验）

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | 共振响应 | (sin(t)-t cos(t))/2，初值与微分方程符号验证 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；精确符号/有理数全等 |
| 2 | 隐藏状态例传函与内部特征值 | 1/(s+1)；-1和+1 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；精确符号/有理数全等 |
| 3 | 双零根Jordan状态转移 | [[1,t],[0,1]] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；精确符号/有理数全等 |
| 4 | 主例四阶表s^4行 | [1, 3, 5] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 5 | 主例四阶表s^3行 | [2, 4, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 6 | 主例四阶表s^2行 | [1, 5, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 7 | 主例四阶表s^1行 | [-6, 0, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 8 | 主例四阶表s^0行 | [5, 0, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 9 | 主例四阶右半平面根数 | 2 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 10 | 正系数非充分表s^4行 | [1, 1, 1] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；精确符号/有理数全等 |
| 11 | 正系数非充分表s^3行 | [1, 1, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；精确符号/有理数全等 |
| 12 | 正系数非充分表s^2行 | [eps, 1, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；精确符号/有理数全等 |
| 13 | 正系数非充分表s^1行 | [(eps - 1)/eps, 0, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；精确符号/有理数全等 |
| 14 | 正系数非充分表s^0行 | [1, 0, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；精确符号/有理数全等 |
| 15 | 正系数非充分右半平面根数 | 2 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；精确符号/有理数全等 |
| 16 | 正系数非充分特殊行处理 | [('epsilon', 2)] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB1原始setup/cell，reconciliation.json notebooks[0].outputs；精确符号/有理数全等 |
| 17 | 真零首元表s^3行 | [1, 2] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 18 | 真零首元表s^2行 | [eps, 1] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 19 | 真零首元表s^1行 | [(2*eps - 1)/eps, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 20 | 真零首元表s^0行 | [1, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 21 | 真零首元右半平面根数 | 2 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 22 | 真零首元特殊行处理 | [('epsilon', 2)] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 23 | K6零行表s^3行 | [1, 2] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 24 | K6零行表s^2行 | [3, 6] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 25 | K6零行表s^1行 | [6, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 26 | K6零行表s^0行 | [6, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 27 | K6零行右半平面根数 | 0 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 28 | K6零行特殊行处理 | [('zero-row', 1, '3*s**2 + 6', '3*(s**2 + 2)')] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 29 | 重复虚轴表s^5行 | [1, 2, 1] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 30 | 重复虚轴表s^4行 | [1, 2, 1] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 31 | 重复虚轴表s^3行 | [4, 4, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 32 | 重复虚轴表s^2行 | [1, 1, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 33 | 重复虚轴表s^1行 | [2, 0, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 34 | 重复虚轴表s^0行 | [1, 0, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 35 | 重复虚轴右半平面根数 | 0 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 36 | 重复虚轴特殊行处理 | [('zero-row', 3, 's**4 + 2*s**2 + 1', '(s**2 + 1)**2'), ('zero-row', 1, 's**2 + 1', 's**2 + 1')] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 37 | 零行实根反例表s^2行 | [1, -1] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 38 | 零行实根反例表s^1行 | [2, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 39 | 零行实根反例表s^0行 | [-1, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 40 | 零行实根反例右半平面根数 | 1 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 41 | 零行实根反例特殊行处理 | [('zero-row', 1, 's**2 - 1', '(s - 1)*(s + 1)')] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB2原始setup/cell，reconciliation.json notebooks[1].outputs；精确符号/有理数全等 |
| 42 | Q1a表s^3行 | [1, 11] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 43 | Q1a表s^2行 | [6, 6] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 44 | Q1a表s^1行 | [10, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 45 | Q1a表s^0行 | [6, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 46 | Q1a右半平面根数 | 0 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 47 | Q1b表s^4行 | [1, 10, 25] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 48 | Q1b表s^3行 | [2, 8, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 49 | Q1b表s^2行 | [6, 25, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 50 | Q1b表s^1行 | [-1/3, 0, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 51 | Q1b表s^0行 | [25, 0, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 52 | Q1b右半平面根数 | 2 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 53 | Q1c表s^3行 | [1, 1] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 54 | Q1c表s^2行 | [1, 10] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 55 | Q1c表s^1行 | [-9, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 56 | Q1c表s^0行 | [10, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 57 | Q1c右半平面根数 | 2 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 58 | Q7表s^5行 | [1, 3, 2] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 59 | Q7表s^4行 | [1, 3, 2] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 60 | Q7表s^3行 | [4, 6, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 61 | Q7表s^2行 | [3/2, 2, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 62 | Q7表s^1行 | [2/3, 0, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 63 | Q7表s^0行 | [2, 0, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 64 | Q7右半平面根数 | 0 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 65 | Q7特殊行处理 | [('zero-row', 3, 's**4 + 3*s**2 + 2', '(s**2 + 1)*(s**2 + 2)')] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 66 | Q10表s^3行 | [1, 6] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 67 | Q10表s^2行 | [4, 12] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 68 | Q10表s^1行 | [3, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 69 | Q10表s^0行 | [12, 0] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 70 | Q10右半平面根数 | 0 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 71 | [2, 5, 7, 3]的Hurwitz Δ1 | 5 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；精确符号/有理数全等 |
| 72 | [2, 5, 7, 3]的Hurwitz Δ2 | 29 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；精确符号/有理数全等 |
| 73 | [2, 5, 7, 3]的Hurwitz Δ3 | 87 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；精确符号/有理数全等 |
| 74 | [1, 4, 6, 12]的Hurwitz Δ1 | 4 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 75 | [1, 4, 6, 12]的Hurwitz Δ2 | 12 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 76 | [1, 4, 6, 12]的Hurwitz Δ3 | 144 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；精确符号/有理数全等 |
| 77 | 应用三阶K0第一列 | [1, 3, 2, 2] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；精确符号/有理数全等 |
| 78 | 应用三阶K3第一列 | [1, 3, 1, 3] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；精确符号/有理数全等 |
| 79 | 应用三阶K6第一列 | [1, 3, 6, 6] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；精确符号/有理数全等 |
| 80 | 应用三阶K9第一列 | [1, 3, -1, 9] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；精确符号/有理数全等 |
| 81 | 应用三阶严格范围 | 0<K<6；K6根-3/±j√2，K0含0 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB3原始setup/cell，reconciliation.json notebooks[2].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 82 | 相对稳定例原根与sigma1 | -2±3j；平移z²+2z+10 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 83 | 衰减界可行范围 | sigma<2；2不可取 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB4原始setup/cell，reconciliation.json notebooks[3].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 84 | 根轨迹例严格范围 | 0<K<30；K30= -6/±j√5 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 85 | 根轨迹实轴区间 | [-1,0]和(-∞,-5] | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 86 | 根轨迹渐近线中心与角度 | -2；60/180/300度 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 87 | 根轨迹分离点 | -0.47247476834805346 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 88 | wc(K10) | 1.2270638838477832 rad/s | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 89 | PM(K10) | 25.38982326335376度 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 90 | wg(K10) | 2.23606797749979 rad/s | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 91 | GM(K10) | 幅比3；9.542425094393248dB | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 92 | 高阶对照RHP数 | 2 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB5原始setup/cell，reconciliation.json notebooks[4].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 93 | 三阶默认a2=3/a1=5边界 | 15 | 稳定域探索默认计算atFive=15（真实TS；浏览器另核6位） | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 94 | 摆开环根 | ±3.1304951684997055 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 95 | 摆P Kp9.8双零根 | 0,0；一般初速度产生线性增长 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 96 | 摆默认PD根 | -1±j1.0954451150103321 | 稳定域探索默认PD极点=-1±j1.095445（真实TS；浏览器另核） | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 97 | 摆PD严格范围 | Kd>0且Kp>9.8 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 98 | 摆P Kp12/Kd0 | ±j1.4832396974191326，不渐近稳定 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB6原始setup/cell，reconciliation.json notebooks[5].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 99 | Q2严格区间及上端临界频率 | 0<K<70；sqrt10=3.1622776601683795 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 100 | Q3严格区间与两端 | 0<K<10；K0=0/-1/-2/-3，K10=(s²+1)(s²+6s+10) | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 101 | Q3临界虚轴根 | K0为0；K10为±j | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 102 | Q4平移及原分解 | z³+2z+12；(s+3)(s²+5)，实部不全小于-1 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 103 | Q5开环根 | ±2 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 104 | Q5 PI与PD范围 | PI s²项0不能严格稳定；PD Kp>4/Kd>0 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 105 | Q6三阶第一列 | 1,a,(ab-c)/a,c；充要ab>c | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 106 | Q7因式与根 | (s+1)(s²+1)(s²+2)；-1/±j/±j√2 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 107 | Q8 L0范围 | K>-1；若限K>0均满足负反馈稳定 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 108 | Q8 Padé闭环多项式及根 | s²+2s+16；-1±j√15 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 109 | Q9严格范围 | 0<K<15 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 110 | Q9平移与全域不可行 | z⁴+2z²+4z+K-7；四原根实部和-4，不可全小于-1 | 不适用：静态代数或非默认参数，无对应交互读数 | ✅ | NB8原始setup/cell，reconciliation.json notebooks[7].outputs；符号全等；小数显示按末位舍入（根/裕度1e-6） |
| 111 | 时滞K1精确频率/精确边界/Padé边界 | 0.485868271757rad/s；2.742469394361s；3.236067977500s | 非默认K，真实TS146组另核 | ✅ | NB7原始setup/cell，reconciliation.json notebooks[6].outputs；边界1e-9s/频率1e-9rad/s；显示1e-6 |
| 112 | 时滞K2精确频率/精确边界/Padé边界 | 0.910179721125rad/s；1.256584511671s；1.414213562373s | 非默认K，真实TS146组另核 | ✅ | NB7原始setup/cell，reconciliation.json notebooks[6].outputs；边界1e-9s/频率1e-9rad/s；显示1e-6 |
| 113 | 时滞K5精确频率/精确边界/Padé边界 | 1.839881737269rad/s；0.449524962342s；0.477032961427s | 默认K5：1.839882/.449525/.477033；其它K为非默认，真实TS146组另核 | ✅ | NB7原始setup/cell，reconciliation.json notebooks[6].outputs；边界1e-9s/频率1e-9rad/s；显示1e-6 |
| 114 | 时滞K10精确频率/精确边界/Padé边界 | 2.863221791476rad/s；0.212951660080s；0.219803902719s | 非默认K，真实TS146组另核 | ✅ | NB7原始setup/cell，reconciliation.json notebooks[6].outputs；边界1e-9s/频率1e-9rad/s；显示1e-6 |
| 115 | 时滞K15精确频率/精确边界/Padé边界 | 3.623913071587rad/s；0.139156984592s；0.142183063361s | 非默认K，真实TS146组另核 | ✅ | NB7原始setup/cell，reconciliation.json notebooks[6].outputs；边界1e-9s/频率1e-9rad/s；显示1e-6 |
| 116 | K5/L0.2精确与Padé状态 | 两者稳 | 非默认L，浏览器端点另核 | ✅ | NB7原始setup/cell，reconciliation.json notebooks[6].outputs；解析区间；不取边界 |
| 117 | K5/L0.46精确与Padé状态 | 精确不稳/Padé稳 | 默认.46显示精确不稳定/Padé严格稳定 | ✅ | NB7原始setup/cell，reconciliation.json notebooks[6].outputs；解析区间；不取边界 |
| 118 | K5/L0.6精确与Padé状态 | 两者不稳 | 非默认L，浏览器端点另核 | ✅ | NB7原始setup/cell，reconciliation.json notebooks[6].outputs；解析区间；不取边界 |

A.1同时核列出的表的每个非零项、补零、符号与事件；输入参数/题号/阶次并非性能断言。对非默认实验不伪造默认组件读数；虚轴边界按符号分解而非浮点微小实部判。正文数值扫描与本表逐段复核，所保留表/答案均列入，原始输出在固定证据文件。

### A.2 实测数据总表（原始证据）

| 来源 | 量 | 实测值 |
|---|---|---|
| NB1–NB8原始setup/cell | 全部stdout/附加合同 | reconciliation.json notebooks[0…7].outputs/contractOutputs；每组pass=true |
| 实际TS对独立多项式根 | 三阶/PD/时滞全域采样 | 20×5151节点、2601PD点、12极点工况、146边界；最大边界误差2.531308496145357e-13 |
| NB7复根局部续接 | L.44/.46根 | 原始输出含残差<1e-9、两侧实部异号；只作指定局部根验证 |
| 浏览器原始代码 | 八实验 | browser-python.json；8passed/0降级，最终hash与MDX一致 |

## 附录 B：秦构前端硬门槛实际输出

原九项保留编号与名称；输出在.agent/semester-03/classic-04/。

| # | 原九项 | 实际命令/动作 | 实际输出 | 通过 |
|---|---|---|---|---|
| 1 | npm run build 通过 | npm run build；npm run build:pages；npx tsc --noEmit | 均退出0；205课/9旧路由/317525363字节；build-delivery.log/pages-delivery.log/types-delivery.log | ✅ |
| 2 | curl 课程页 → HTTP 200 | npm run verify -- classic/stability-analysis | 退出0，HTTP200；page-delivery.log | ✅ |
| 3 | 页面 H2 数 == catalog.ts 该课 subsections 数 | 单课verify + check-browser.mjs | 退出0；H1=1/H2=14、真实ID/顺序/目录逐条对齐，54旧ID含2别名可达 | ✅ |
| 4 | katex-error 元素数 == 0 | 同上 | 退出0；katex-error=0，56display居中auto | ✅ |
| 5 | MDX 中每个 JupyterNotebook 的 cell 字符串与验证脚本中的 cell 逐字全等 | nb-cells verify --require-kernel；extract/assemble；check-source.mjs | 均退出0；EXECUTED8Notebook/8cell，FAIL0/SKIPPED0，16block反向逐字全等；原始/提取/内核/Pyodide/DOM各自8 | ✅ |
| 6 | 新增组件已在 `lib/wiki-components.ts` 登记（**E2 起单一来源，fix-015 已根治**；本项在 B6 九项里排第 6、在 `verify-lesson.mjs` 里排第 4，两套编号不通用） | npm run check；单课verify | 退出0；单一来源65登记，旧两组件注册不变 | ✅ |
| 7 | 新增组件已在 MDX 中用 <ComponentName /> 显式引用 | rg Explorer content/classic/stability-analysis.mdx | StabilityThirdOrderExplorer及StabilityDelayExplorer各1显式引用，两者只本课调用 | ✅ |
| 8 | 每个交互组件：固定坐标轴 ✅ / animation: false ✅ / useECharts 收到 Option 对象 ✅ / 默认参数复现正文手算例 ✅ | 读实际源码；verify-classic04.mjs；check-browser.mjs | 退出0；真实EChartsOption/useMemo/useECharts；固定轴/animation:false/inline；真实TS对独立根/幅相方程；默认/五滑块边界/恢复/临界/窄屏/颜色视觉通过 | ✅ |
| 9 | notebook 中无 ipywidgets / interact / FloatSlider / IntSlider 引用 | 严格nb-cells S2 | 退出0；无ipywidgets/interact/FloatSlider/IntSlider | ✅ |

附加四条同属硬门槛：

- 每页kernel id全局唯一：严格S8/模块nbSeq/newNotebookId/服务端重复id兜底通过，8原始实验分别新内核，无变量串扰；notebooks.log退出0。
- cell首行不得以%开头：S1/S4通过；notebooks.log退出0。
- $$独占开闭行：math:check退出0；112独占围栏/56居中auto块，引用围栏独立保留。
- JSX属性之间不得有逗号：S3与实际MDX编译/最终生产构建均退出0；初次数学L_误报记录在page-draft.log，局部lt语法后两组件都被正确检查，W08仍待办。

额外门槛：glossary PASS3/WARN1/FAIL0退出0（既有函数名WARN）；14回归全过退出0；fix索引35详情/35索引+2预留一致退出0。check-source/scope/browser/log均实际执行，不以旧v1.3或SKIPPED代替本期验收。

## 附录 C：何疑红队放行记录

| # | 对比断言（原句 + file:line） | 基线整定与扫描范围（a） | 组数与落败场景（b） | 正文的边界与代价（c） | 放行? |
|---|---|---|---|---|---|
| 1 | “精确模型已经不稳定，Padé却仍判稳定” content/classic/stability-analysis.mdx:1016 | 同K同单位负反馈Kexp(-Ls)/[s(s+2)]；精确幅相方程/一阶Padé多项式独立求边界 | K1/2/5/10/15，K5的L.2/.46/.6含同稳/误判/同不稳；未挑样本 | 只对指定模型；近似不能签发原系统；边界不取、时滞与增益交换的代价需另核 | ✅ 限定观察/反例 |
| 2 | “不要从等价性推断实际计算耗时相同” content/classic/stability-analysis.mdx:583 | 同一特征多项式Routh/Hurwitz；只比较信息表达，不作速度/精度排名 | 主四阶、三阶[2,5,7,3]、Q10三组；结果相同，无胜负结论 | 理论等价不推耗时或普遍优越；列输入/输出类型、频域需开环极点和频带信息 | ✅ 限定观察/反例 |
| 3 | “纯比例控制无法使倒立摆渐近稳定” content/classic/stability-analysis.mdx:828 | 同J1/mgl9.8局部转矩模型；固定线性化、零输入；P为Kd0子族 | Kp8/9.8/12且Kd0，默认PD12/2及负阻尼12/-2：增长/双零/等幅/衰减/失稳均保留 | 限定局部线性模型，PD有理想导数/噪声滤波代价；不声称实际小车全局稳定 | ✅ 限定观察/反例 |

## 附录 D：原稿审计、保留与变更传播

| 原位置/资产 | 审计证据 | 保留/纠错/重写/迁移/拆分/删除 | 目标位置/去向 | 验证方式 |
|---|---|---|---|---|
| 开篇/先修 | 倒用频域、根轨迹、PID已学；五次以上绝无解析解 | 改由上一课车身撤力提问，限定一般根式公式 | 同首节 | 李稳复述；catalog先修不变 |
| 稳定定义/极点表 | 三种定义“大多等价”，虚轴一律临界；隐藏状态漏检 | 保留模态直觉，补输入/初值/最小实现及虚轴半单 | 定义节/NB1 | 共振方程/隐藏特征值/Jordan符号验证 |
| 普通Routh/Hurwitz表与主例 | 递推正确，符号变号被说成根随参数移动；必要条件作充分 | 保留正确表格及全部计算，补常规条件与静态计数 | 原Routh/Hurwitz节 | 原始符号表、行列式、求根互核 |
| 特殊行 | 非零行例实为全零；重复零行用了任意epsilon | 保留K6及重复虚轴原多项式；改分类并加真首元零/实根对称反例 | 特殊节/NB2 | 正epsilon符号首项、全零行辅助导数与因式 |
| 参数域/相对稳定Notebook | 网格与浮点误判边界、最大sigma写可取 | 保留K域和s=z−sigma，明确严格区间上确界 | 应用节/NB3/4 | 端点/零行/平移多项式 |
| 三阶Explorer | 固定双栏窄屏压窄、无恢复；PD图无模型声明 | 保留两图，局部转矩模型/单位、当前点及恢复、上下布局 | 同注册名/真实lib/stability-analysis.ts | 20×5151+2601点、12PD根、浏览器端点/恢复 |
| 根轨迹/频域/高阶Notebook | 泛化K小就稳、无模型保证；PM/GM数值失准 | 保留原三阶示例与高阶对照，频域预览带方向与围线条件 | 原两H2/NB5 | 幅相连续根/原始Routh/实际页公式 |
| 倒立摆 | 假称小车力角模型；双零根临界；加阻尼便不摆动 | 改为固定转轴转矩局部模型，保留P/PD分析 | 倒立摆反馈/NB6 | 极点/双零根解/单位/适用域 |
| 时滞推导与Explorer | .477是近似却当精确最大；有限L网格截断，没处理L0 | 保留一二阶Padé式和原K5展开，增加精确幅相边界与反例；真曲线代网格最大值 | 时滞节/NB7/同Explorer名 | 146独立边界、两侧根续接/穿越导数、UI默认与端点 |
| 深入讨论/结构稳定性/描述函数 | 非Hurwitz便对象不可稳定、描述函数说成精确等效 | 保留Jury/鲁棒性/非线性主题，限制结论 | 同节 | 陈控/林矩条件审校，不生产后续课 |
| 十题与答案 | 题3遗漏下端、题4表行标错、题6复根大小证明、题8正反馈笔误、题9单样本证明 | 原十题保留，修条件与步骤，题3两端齐 | 原习题/答案/NB8 | 严格内核与Pyodide逐题复算 |
| URL/全部旧标题/旧日志 | baseline-source.json旧54ID，4Notebook只本课；无独立旧日志 | 原URL/先修保留，H1与一个长H2缩短，2别名保旧全集；4原实验教学目的保留并扩8 | 原路径与注册名 | 共用真实渲染管线+生产DOM/侧栏+scope |
| 本轮轻量扫描/窄屏图例 | page-draft.log误报数学为JSX；narrow-draft.png标题图例重叠 | 仅本课数学lt语法与图标题top0/两项图例/显式itemStyle图例色修复 | 同正文/时滞组件 | 原始8标签独立计数/最终verify/生产重建截图 |

无迁出材料、无未完成拆分、未删除来源课程；W06/W07/W08/W09保持待办。模型参数传播覆盖正文→原始setup/cell→真实TS→默认UI→A表及支持策略；任何正文变更都以最终hash重验。
