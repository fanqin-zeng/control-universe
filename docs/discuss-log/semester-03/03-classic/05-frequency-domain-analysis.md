# 频域分析 · CLASSIC-05 讨论日志

- 日期：2026-10-18；学期semester-03；classic第5课，type=theory，重构模式。
- 起点master1962c3a；分支wp/classic-05-frequency；唯一目标classic/frequency-domain-analysis。
- 基线MDX SHA/全级标题/6原始Notebook见.agent/semester-03/classic-05/baseline-source.json，当前统计见baseline-check.log。原页面已实际打开，四Explorer只本课调用，无独立旧日志可继承。
- 执行wiki-lesson-refactor与semester-03-core；角色是既有结构化审查视角，不冒充外部专家或独立Agent。

## 出席与沉默表

| 角色 | 状态 | 职责 |
|---|---|---|
| 郑核 | 出席 | 主持、代实验合同/体验/档案、签发 |
| 陈控 | 出席 | 经典主责、幅相/裕度与教学 |
| 林矩 | 出席 | 开闭环、最小相位、隐藏模态与模型条件 |
| 苏绘 | 出席 | 双轨分配、复平面与读数规范 |
| 孙助 | 出席 | 九题保留与答案 |
| 柯验 | 出席 | 独立数值与原始实验对账 |
| 秦构 | 出席 | 四交互及九项+四门槛 |
| 何疑 | 出席 | 比较公平性与限定条件 |
| 李稳 | 出席 | 学习顺序与单位复述 |
| 钱锐 | 出席 | 穿越、无交点、近似/反例 |

[沉默-何仿：theory课，郑核代列数值合同，柯验负责独立核数。]
[沉默-陆阅：非math/history课型，郑核代核开篇与四档案。]
[沉默-周联、吴规、许史、范安、轮值专家、小初、赵工、林码、岳自：本课为LTI频率工具推导，非实现/案例/历史/学习/数学课；应用仅教学模型，不作舒适性或安全认证。]

## Phase 1: 内容规划

[郑核] 保留原13H2、全部九题及正确的正弦留数/Bode因子/PM推导/RC与路面主题。短化两个冗长H2，旧ID全部保留。目标五项：解释稳定系统正弦稳态；用幅相及单位画Bode；在条件内求裕度/完整Nyquist计数；区分开环穿越与闭环带宽及上升时间定义；核RC与含零点路面模型。先修为已交付传函/傅里叶，开篇承接时域和稳定课，不倒用根轨迹/PID。

[陈控] 原G=10/[(s+1)(s+2)(s+5)]在sqrt17处遗漏归一化因子10，负实轴交点应-10/126，GM22.007411dB而非2dB。DC为1且正频率幅值严格小于1，没有有限正增益穿越，不能硬填PM。原PM经验线推导量纲混乱，带宽表及题3平方根算错，题6串用上升时间与调节时间。

[林矩] GM/PM不是任意不确定性的保证，也不是临界点最短欧氏距离。全Nyquist需要闭合围线、方向、开环RHP数和虚轴缩进；非最小相位与开环不稳定不是同义。路面(cs+k)/(ms²+cs+k)含零点，所有正阻尼高频均−20dB/dec，临界也有位移放大峰，不能套无零点峰值或宣称舒适性/危险车速。

[苏绘] 四已有交互保留：标准二阶Bode和Nyquist统一默认ζ.5/wn8；带宽双图统一精确半功率与10–90%上升时间；RC标清ω(rad/s)与f(Hz)。修原重叠grid、Nyquist临界点在窗外、固定滑块宽撑屏；图窗固定、animation:false、inline、读数与恢复齐全。旧widgets改可独立运行的静态参数比较，调参继续用React。

[何疑] 比较只限同模型/固定归一化：ζ.3/.5/.707/1的带宽/上升、路面ζ.3/.707/1含高低频取舍，精确/渐近线至少三频段及同判/失配。不得从更大带宽推任意系统更快或更鲁棒；频域/时域只比较信息角度，不作能力排名。

[孙助] 九题原主题全部保留。题3重算半功率根；题4分别报粗估与真实幅相；题5说明K>0与积分极点缩进；题6补标准无零点、单位增益和10–90%定义；题7纠正同一归一化；题8全通与最小相位；题9必须把精确延迟相位和Padé相位分列，减增益可提高时滞裕度但牺牲速度。

[柯验] minimal.py先测：默认ζ.5时tr(10–90%)*ωn=1.637572947、ωB/ωn=1.272019650、乘积2.083024967，非旧3.9。路面ζ1仍有1.249387dB峰。原代码frequency_response返回幅值/相位/频率，angle(mag)全零；scipy猴子补丁margin已是dB却再log，freqresp元组被当复数、单位圆画在(-1,0)均需删除。用官方control0.10.2接口与独立复数/连续求根/状态空间核。

[郑核] 实验合同：因果连续LTI，正弦稳态须输入输出稳定、无该频率极点、零初值或衰减瞬态；反馈默认单位负反馈且不隐藏不稳定约消。ω单位rad/s、f=ω/(2π)，dB=20log10幅比。标准二阶ζ=.05…2/wn8，wn2…50；RC R100…10000Ω、C.1…10μF。频域原始对数点不抽稀，时间0…3s/601点；临界点/峰/半功率/上升时间连续求根，网格不冒充精确值；Nyquist完整缩进围线与多网格收敛对根数。无随机数/训练，原始代码单实验秒级，复数误差1e-8、根/指标1e-7、显示六位1e-6。

[共识] 苏绘保留四交互修几何与单位；孙助保留九题并修模型/定义；柯验先最小实验后实际TS与独立Python、全部原始setup/cell核。PY-001/002/003仅在本课实跑通过后移出待办并保留解决回执，其余27待办ID/记录不变；S04债务快照不回写。W06–W09仍待办，不生产下一课，不发布gh-pages。

## Phase 2: 内容生成

### 第一轮 — 概念讲解

[陈控] 先修改幅相语义、归一化错误、Nyquist条件与频时指标，再保留九题重算答案；正确的留数推导与各因子渐近线继续沿用。当前只进入第一轮，不预记学生反馈或签发。

### 第二轮 — 学生反馈

[李稳] 第一稿已能从车身经过周期路面复述“幅值比/相位差”，但二阶H与用于PM推导的开环G很容易看成同一个传函。四交互前须直接写模型/默认值，带宽必须相对直流，10–90%必须与上一课0–100%区分。RC同时标ω和f，以免红线1000被误读1000Hz。

[钱锐] G(0)=1例没有有限正增益穿越，不能让软件inf/NaN显示成“无穷安全”。Nyquist正频率半支并不能计数；要实跑缩进完整围线与RHP极点数，并展示开环不稳但闭环稳的例子。反相全通幅值同为1，证明只有幅值信息不足。

[孙助] 九题保留后，题6定性比较被旧表推成错误精确时间，已改模型及上升定义；题9的精确延迟和Padé必须同频并列，不让读者以为它们完全相同。原正弦留数、五环节、三组回路、路面/RC主题应保留去向。

### 第三轮 — 调整完善

[陈控] 增加明确开闭环合同：二阶H=wn²/(s²+2ζwns+wn²)，PM来自L=wn²/[s(s+2ζwn)]。修GM漏因子、半功率二次根、题4近似相位与精确值；保留所有原题主题。

[秦构] 四已有入口改同默认ζ.5/wn8；Bode双网格定高分离，Nyquist保−1与原点单位圆、正负支且坐标等比例，RC固定频窗覆盖全部滑块转折。所有组件恢复/可访问名称/百分比宽度，纯计算独立导出供真实TS核验。

[柯验] 官方control0.10.2 frequency_response文档确认返回mag/phase/omega，margin返回线性GM；删除scipy对象猴子补丁和重复log。保留原六实验目的，改八组主题实验加九题复算共九Notebook；精确式、API、独立scipy与完整Nyquist围线均实际运行再签。


[柯验-修后复核] 原始答案复算实验第一次合同失败，是实验里将题3的ζ.3抄成.4、题6带宽抄成ωn；并非正文根式错误。已按原题修参数、重新执行全部九原始setup/cell与合同；Q3得到7.268447rad/s，Q6为1.041512/.104151s。严核一度health探测不可达，保留notebooks-final.log失败记录；随后health200与notebooks-delivery.log实际EXECUTED9/9，无SKIPPED。术语检查新增“峰值(dB)”被当译名，改单位表达后全绿门槛恢复；不放宽全局门槛。

## Phase 3: 内容审校

### 教授团队（学术准确性）

[陈控] 从归一化分母复算GM，12.6倍率与22.007411dB分开。无有限正穿越的PM不解读为无穷安全；单位圆在原点，临界点−1是另一个点。正弦留数推导、五环节渐近线、PM二阶精确推导与九题保留；粗估均有适用域。题9补正幅值解唯一和穿越方向证明，三工况只是验证不是证明。

[林矩] Nyquist约定顺时针右半平面围线、Z=P+Ncw；完整缩进两组R/epsilon计数与闭环根核。P1的2/(s−1)闭环稳定是反例，不能把PM正或单交点右侧当一般定理。路面分子cs+k不能套标准二阶H，三阻尼都有正峰且最终−20dB/dec。

### 工程团队（实践可行性）

[沉默-周联：本轮非整定工程交付，由郑核代核模型接口与单位]
[郑核] RC R/C单位与rad/s、Hz转换显式；路面仅位移传递，未给人体/轮胎/加速度模型，不作舒适性或危险车速排名。延迟增益降低换容限有响应代价，Padé是近似，不能替精确模型签发；传感噪声/饱和/采样未建模，不据此推荐硬件参数。

### 验证团队（独立把关）

[柯验] verify-classic05.mjs转译真正lib/frequency-domain.ts，独立reference.py用scipy.signal.freqs和状态空间expm/step求值。120组二阶各601频点、3组各601时间点、9组RC各601频点，最大误差2.4726887204451486e-12；边界、非法参数、恢复另核。九原始Notebook逐一新8891内核执行原始setup/cell及合同，Pyodide最终hash一致，附录A逐项列实际输出。频率网格不替连续半功率根，时间末样不替极限。

[何疑] C三组限定观察均列模型、≥3工况及代价：标准二阶固定ζ时间缩放、三阻尼路面峰与高频取舍、精确时延/Padé同频误差。反例含临界阻尼路面仍有峰、K5延迟失稳；不发布普遍优越性或车辆安全结论。

[秦构] 页面与最终生产证据见B及browser-results.json。四旧入口仅本课调用，注册名不变。真实TS/原始内核/浏览器Python各自验，不用同源extract全等冒充独立数学复算。构建先因未使用导入失败，修后重建；只在通过后允许Phase4。

### 体验与脉络（读者、历史与安全）

[沉默-陆阅：本轮由郑核与两位学生代核中文体验，不增加出席角色]
[郑核] 开篇承接系统稳定性，具体对象是恒速经过周期起伏的车身与RC电压：读者问幅度衰减/相位错开，先现象后术语。正文先频率函数再图再判据再模型条件；三长H2缩短并保留别名。无历史优先权或人物归因新断言；安全边界写在路面例旁，不拿位移峰给危险车速。
[沉默-许史：无新增控制史主张；郑核核引用边界]
[沉默-范安：无安全系统设计结论；工程代核不越出教学模型]

### 教学支持（教学质量）

[孙助] 九题对应：RC单位/渐近线/二阶峰与半功率/组合环节/Nyquist范围/固定模型频时缩放/裕度归一化/全通/延迟近似。题6明确首次10–90%，题4粗估与精确分开，题7与正文同算，题9精确/Padé分列。术语表不放宽，局部符号约定已补；原始输出留档。
[郑核] 四份档案代核：课程catalog/自动OUTLINE一致，符号局部约定同步，历史fix038与既有角色清单同步，Python三待办解决保留回执、其余27逐字段不变；不改冻结S04历史快照。

### 学生审校（可读性）

[李稳] 能复述：幅比看输入输出振幅之比，相位看同频波形错开；H响应的峰不是开环L的裕度。读图先认单位，半功率是相对直流；RC1000rad/s对应159.154943Hz，不是1000Hz。
[钱锐] 看正频半支不能数闭环不稳定根；图窗外还有围线。已看到P1而闭环稳反例与临界边界不取；能区分两个时延相位表，也能说明跨模型带宽不推出固定上升时间。

## Phase 4: 定稿与签发

[待定] 无 P0 阻断项。W06/W07/W08/W09与其余27 Python待办仍由全局清单跟踪，不阻塞本课边界完整的签发；不声称修好原生IAB网关。

[郑核-签发] 已核94行六列对账、C三项限定比较、B九项及四补充、九题配对和D来源覆盖。严格内核/真实TS独立参考/浏览器Python、生产DOM/截图/构建与check门槛均通过，同意CLASSIC-05按本课限定模型定稿。checklist前五格据实际完成勾选，合并格只在真实no-ff之后填hash。

交付清单：本课MDX；四既有Explorer与真实计算核心；catalog三短H2/旧ID别名与自动OUTLINE；讨论日志/旧tracker/全局checklist；数值与浏览器证据；fix038与陈控检查项；三PY债务解决回执及支持政策。仅一课，只合master，不发布gh-pages。

## 附录 A：柯验数值三方对账

### A.1 对账表

| # | 正文断言 | notebook 输出 | 组件默认值读数 | 一致? | 备注 |
|---|---|---|---|---|---|
| 1 | 默认半功率带宽 | 10.1761571961 rad/s | 同值按六位显示；Bode/带宽组件真实TS已与scipy互核 | ✅ | NB6；ζ.5/wn8；指标1e-7、显示1e-6；连续根，不取网格首点 |
| 2 | 默认峰频 | 5.65685424949 rad/s | 同值按六位显示；Bode/带宽组件真实TS已与scipy互核 | ✅ | NB6；ζ.5/wn8；指标1e-7、显示1e-6；连续根，不取网格首点 |
| 3 | 默认峰值 | 1.24938736608 dB | 同值按六位显示；Bode/带宽组件真实TS已与scipy互核 | ✅ | NB6；ζ.5/wn8；指标1e-7、显示1e-6；连续根，不取网格首点 |
| 4 | 默认连续超调 | 16.3033534822 % | 同值按六位显示；Bode/带宽组件真实TS已与scipy互核 | ✅ | NB6；ζ.5/wn8；指标1e-7、显示1e-6；连续根，不取网格首点 |
| 5 | 默认首次10–90%上升 | 0.204696618416 s | 同值按六位显示；Bode/带宽组件真实TS已与scipy互核 | ✅ | NB6；ζ.5/wn8；指标1e-7、显示1e-6；连续根，不取网格首点 |
| 6 | 默认tr*wb | 2.08302496651 无量纲 | 同值按六位显示；Bode/带宽组件真实TS已与scipy互核 | ✅ | NB6；ζ.5/wn8；指标1e-7、显示1e-6；连续根，不取网格首点 |
| 7 | 默认H(j8) | 模1，相位−90度 | Bode 1.000000/−90；Nyquist(0,−1) | ✅ | NB6；复数1e-8；UI默认实核 |
| 8 | RC默认 tau | 0.001 | RC默认同值六位显示 | ✅ | NB7；1000Ω/1μF/1000rad/s；1e-8/显示1e-6 |
| 9 | RC默认 omega0 | 1000 | RC默认同值六位显示 | ✅ | NB7；1000Ω/1μF/1000rad/s；1e-8/显示1e-6 |
| 10 | RC默认 f0 | 159.15494309189532 | RC默认同值六位显示 | ✅ | NB7；1000Ω/1μF/1000rad/s；1e-8/显示1e-6 |
| 11 | RC默认 db | -3.0102999566398125 | RC默认同值六位显示 | ✅ | NB7；1000Ω/1μF/1000rad/s；1e-8/显示1e-6 |
| 12 | RC默认 phase | -45 | RC默认同值六位显示 | ✅ | NB7；1000Ω/1μF/1000rad/s；1e-8/显示1e-6 |
| 13 | 正弦稳态与Bode复算：Bode example 1 13.850202958898675 22.82912275072981 -59.17233770 | Bode example 1 13.850202958898675 22.82912275072981 -59.17233770013197 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB1原始setup/cell；reconciliation.json notebooks[0].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 14 | 正弦稳态与Bode复算：Bode example 5 6.995797057561649 16.8967440491245 -70.3461759419 | Bode example 5 6.995797057561649 16.8967440491245 -70.3461759419467 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB1原始setup/cell；reconciliation.json notebooks[0].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 15 | 正弦稳态与Bode复算：Bode example 20 1.717128245578852 4.696054642499648 -123.8261617 | Bode example 20 1.717128245578852 4.696054642499648 -123.82616175818528 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB1原始setup/cell；reconciliation.json notebooks[0].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 16 | 正弦稳态与Bode复算：RC normalized sine 0.1 0.9950371902099892 -5.710593137499643 | RC normalized sine 0.1 0.9950371902099892 -5.710593137499643 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB1原始setup/cell；reconciliation.json notebooks[0].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 17 | 正弦稳态与Bode复算：RC normalized sine 1 0.7071067811865476 -45.0 | RC normalized sine 1 0.7071067811865476 -45.0 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB1原始setup/cell；reconciliation.json notebooks[0].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 18 | 正弦稳态与Bode复算：RC normalized sine 10 0.09950371902099893 -84.28940686250037 | RC normalized sine 10 0.09950371902099893 -84.28940686250037 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB1原始setup/cell；reconciliation.json notebooks[0].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 19 | 归一化与裕度：G(0), phase crossing, complex response | G(0), phase crossing, complex response: 1.0 4.123105625617661 (-0.07936507936507936-0j) | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB2原始setup/cell；reconciliation.json notebooks[1].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 20 | 归一化与裕度：GM linear/dB, PM, wpc,wgc | GM linear/dB, PM, wpc,wgc: 12.600000000000001 22.00741090235126 inf 4.123105625617661 nan | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB2原始setup/cell；reconciliation.json notebooks[1].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 21 | 归一化与裕度：all crossings | all crossings: (array([12.6]), array([], dtype=float64), array([0.83135411]), array([4.12310563]), array([], dtype=float64), array([2.27053076])) | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB2原始setup/cell；reconciliation.json notebooks[1].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 22 | 归一化与裕度：closed poles | closed poles: [-5.60297589+0.j         -1.19851206+1.46051379j -1.19851206-1.46051379j] | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB2原始setup/cell；reconciliation.json notebooks[1].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 23 | 增益与Bode交点：family a,b,K / GM dB / PM / wc / poles 1 10 10 20.82785370316450 | family a,b,K / GM dB / PM / wc / poles 1 10 10 20.827853703164504 47.4039396296765 0.7844079147578316 [-10.10860673+0.j          -0.44569663+0.88916282j | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB3原始setup/cell；reconciliation.json notebooks[2].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 24 | 增益与Bode交点：family a,b,K / GM dB / PM / wc / poles 1 10 50 6.848453616444125 | family a,b,K / GM dB / PM / wc / poles 1 10 50 6.848453616444125 13.570879082046162 2.102034066196525 [-10.50113871+0.j          -0.24943065+2.16775754j | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB3原始setup/cell；reconciliation.json notebooks[2].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 25 | 增益与Bode交点：family a,b,K / GM dB / PM / wc / poles 1 10 110 0.0 0.0 3.162277 | family a,b,K / GM dB / PM / wc / poles 1 10 110 0.0 0.0 3.1622776601683795 [-1.10000000e+01+0.j         -1.11022302e-16+3.16227766j | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB3原始setup/cell；reconciliation.json notebooks[2].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 26 | 增益与Bode交点：family a,b,K / GM dB / PM / wc / poles 1 10 150 -2.6939714779491 | family a,b,K / GM dB / PM / wc / poles 1 10 150 -2.6939714779491233 -5.051198193339843 3.685567219223368 [-11.29094013+0.j           0.14547007+3.64195361j | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB3原始setup/cell；reconciliation.json notebooks[2].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 27 | 增益与Bode交点：family a,b,K / GM dB / PM / wc / poles 1 2 5 1.5836249209524946  | family a,b,K / GM dB / PM / wc / poles 1 2 5 1.5836249209524946 5.022684214294856 1.288513428864357 [-2.90416086+0.j         -0.04791957+1.31124804j -0.04791957-1.31124804j] | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB3原始setup/cell；reconciliation.json notebooks[2].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 28 | 增益与Bode交点：family a,b,K / GM dB / PM / wc / poles 1 2 6 0.0 0.0 1.414213562 | family a,b,K / GM dB / PM / wc / poles 1 2 6 0.0 0.0 1.414213562373095 [-3.00000000e+00+0.j          2.92300906e-16+1.41421356j | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB3原始setup/cell；reconciliation.json notebooks[2].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 29 | 增益与Bode交点：family a,b,K / GM dB / PM / wc / poles 1 2 10 -4.43697499232713  | family a,b,K / GM dB / PM / wc / poles 1 2 10 -4.43697499232713 -12.997208015488695 1.8022033046069246 [-3.30890732+0.j          0.15445366+1.73155703j  0.15445366-1.73155703j] | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB3原始setup/cell；reconciliation.json notebooks[2].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 30 | 增益与Bode交点：Routh strict intervals | Routh strict intervals: 0<K<110; 0<K<6. Equality is a boundary. | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB3原始setup/cell；reconciliation.json notebooks[2].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 31 | Nyquist完整围线：K,R,eps,Ncw,Z | K,R,eps,Ncw,Z: 5 1000.0 0.001 -0.0 0 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB4原始setup/cell；reconciliation.json notebooks[3].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 32 | Nyquist完整围线：K,R,eps,Ncw,Z | K,R,eps,Ncw,Z: 10 1000.0 0.001 2.0 2 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB4原始setup/cell；reconciliation.json notebooks[3].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 33 | Nyquist完整围线：P=1, K=2, Ncw,Z | P=1, K=2, Ncw,Z: -1.0 0.0 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB4原始setup/cell；reconciliation.json notebooks[3].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 34 | Nyquist完整围线：K,R,eps,Ncw,Z | K,R,eps,Ncw,Z: 5 10000.0 0.0001 -0.0 0 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB4原始setup/cell；reconciliation.json notebooks[3].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 35 | Nyquist完整围线：K,R,eps,Ncw,Z | K,R,eps,Ncw,Z: 10 10000.0 0.0001 2.0 2 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB4原始setup/cell；reconciliation.json notebooks[3].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 36 | Nyquist完整围线：P=1, K=2, Ncw,Z | P=1, K=2, Ncw,Z: -1.0 0.0 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB4原始setup/cell；reconciliation.json notebooks[3].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 37 | Nyquist完整围线：Plot is a clipped frequency trace; winding above uses the full c | Plot is a clipped frequency trace; winding above uses the full closed contour. K=6 is excluded from winding. | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB4原始setup/cell；reconciliation.json notebooks[3].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 38 | 稳定判据与API核对：50/[s(s+1)(s+10)] margins 2.2 6.848453616444125 13.5708790820461 | 50/[s(s+1)(s+10)] margins 2.2 6.848453616444125 13.570879082046162 3.1622776601683795 2.102034066196525 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB5原始setup/cell；reconciliation.json notebooks[4].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 39 | 稳定判据与API核对：omega, abs, phase degrees 0.1 49.74937210407785 -96.283531835183 | omega, abs, phase degrees 0.1 49.74937210407785 -96.28353183518314 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB5原始setup/cell；reconciliation.json notebooks[4].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 40 | 稳定判据与API核对：omega, abs, phase degrees 1.0 3.5179877236514594 -140.7105931374 | omega, abs, phase degrees 1.0 3.5179877236514594 -140.71059313749967 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB5原始setup/cell；reconciliation.json notebooks[4].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 41 | 稳定判据与API核对：omega, abs, phase degrees 10.0 0.035179877236514584 140.71059313 | omega, abs, phase degrees 10.0 0.035179877236514584 140.71059313749964 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB5原始setup/cell；reconciliation.json notebooks[4].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 42 | 稳定判据与API核对：allpass 0.1 0.9999999999999999 -1.145877395366972 | allpass 0.1 0.9999999999999999 -1.145877395366972 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB5原始setup/cell；reconciliation.json notebooks[4].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 43 | 稳定判据与API核对：allpass 1 0.9999999999999999 -11.421186274999286 | allpass 1 0.9999999999999999 -11.421186274999286 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB5原始setup/cell；reconciliation.json notebooks[4].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 44 | 稳定判据与API核对：allpass 10 1.0 -90.0 | allpass 10 1.0 -90.0 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB5原始setup/cell；reconciliation.json notebooks[4].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 45 | 稳定判据与API核对：allpass 100 1.0 -168.57881372500074 | allpass 100 1.0 -168.57881372500074 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB5原始setup/cell；reconciliation.json notebooks[4].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 46 | 二阶频时指标：z,tr*wn,wb/wn,product,Mr,Mr dB,MP%,PM,wc/wn | z,tr*wn,wb/wn,product,Mr,Mr dB,MP%,PM,wc/wn: 0.3 1.32133997956603 1.453689462308528 1.9208180044221035 1.7471413945365304 4.846561069116191 37.232610492658644 33.272490961303106 0.9143691069094814 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB6原始setup/cell；reconciliation.json notebooks[5].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 47 | 二阶频时指标：z,tr*wn,wb/wn,product,Mr,Mr dB,MP%,PM,wc/wn | z,tr*wn,wb/wn,product,Mr,Mr dB,MP%,PM,wc/wn: 0.5 1.6375729473283513 1.272019649514069 2.0830249665143303 1.1547005383792517 1.2493873660830008 16.303353482158048 51.827292372987756 0.786151377757423 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB6原始setup/cell；reconciliation.json notebooks[5].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 48 | 二阶频时指标：z,tr*wn,wb/wn,product,Mr,Mr dB,MP%,PM,wc/wn | z,tr*wn,wb/wn,product,Mr,Mr dB,MP%,PM,wc/wn: 0.707 2.147707267242651 1.0001510113987793 2.1480315955212457 1.000000045602003 3.9609395684496666e-07 4.325493120391749 65.5246301806323 0.6436629803323733 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB6原始setup/cell；reconciliation.json notebooks[5].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 49 | 二阶频时指标：z,tr*wn,wb/wn,product,Mr,Mr dB,MP%,PM,wc/wn | z,tr*wn,wb/wn,product,Mr,Mr dB,MP%,PM,wc/wn: 1 3.3579085614779873 0.6435942529057583 2.161130651950275 1 0.0 0 76.34541525402449 0.4858682717566456 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB6原始setup/cell；reconciliation.json notebooks[5].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 50 | 二阶频时指标：PM to exact zeta and MP 30 0.2686424829560618 41.637315113012576 | PM to exact zeta and MP 30 0.2686424829560618 41.637315113012576 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB6原始setup/cell；reconciliation.json notebooks[5].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 51 | 二阶频时指标：PM to exact zeta and MP 45 0.4204482076264568 23.321228386238214 | PM to exact zeta and MP 45 0.4204482076264568 23.321228386238214 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB6原始setup/cell；reconciliation.json notebooks[5].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 52 | 二阶频时指标：PM to exact zeta and MP 60 0.6123724356957948 8.773211934181454 | PM to exact zeta and MP 60 0.6123724356957948 8.773211934181454 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB6原始setup/cell；reconciliation.json notebooks[5].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 53 | 二阶频时指标：PM to exact zeta and MP 75 0.9493266376824355 0.0075658378286028 | PM to exact zeta and MP 75 0.9493266376824355 0.007565837828602883 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB6原始setup/cell；reconciliation.json notebooks[5].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 54 | 二阶频时指标：default z=.5,wn=8 | default z=.5,wn=8: [1.] [-90.] | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB6原始setup/cell；reconciliation.json notebooks[5].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 55 | RC与路面模型：RC rad/s,abs,dB,deg | RC rad/s,abs,dB,deg: 10 0.9999500037496876 -0.0004342727686263609 -0.572938697683486 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB7原始setup/cell；reconciliation.json notebooks[6].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 56 | RC与路面模型：RC rad/s,abs,dB,deg | RC rad/s,abs,dB,deg: 100 0.9950371902099892 -0.04321373782642559 -5.710593137499643 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB7原始setup/cell；reconciliation.json notebooks[6].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 57 | RC与路面模型：RC rad/s,abs,dB,deg | RC rad/s,abs,dB,deg: 1000 0.7071067811865476 -3.0102999566398116 -45.0 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB7原始setup/cell；reconciliation.json notebooks[6].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 58 | RC与路面模型：RC rad/s,abs,dB,deg | RC rad/s,abs,dB,deg: 10000 0.09950371902099893 -20.043213737826427 -84.28940686250037 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB7原始setup/cell；reconciliation.json notebooks[6].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 59 | RC与路面模型：RC rad/s,abs,dB,deg | RC rad/s,abs,dB,deg: 100000 0.009999500037496873 -40.00043427276863 -89.42706130231652 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB7原始setup/cell；reconciliation.json notebooks[6].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 60 | RC与路面模型：R1000 C1uF | R1000 C1uF: T=.001 s, wc=1000 rad/s, fc= 159.15494309189535 Hz | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB7原始setup/cell；reconciliation.json notebooks[6].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 61 | RC与路面模型：road z,c for m250 k16000, peak rad/s,dB,high decade slope | road z,c for m250 k16000, peak rad/s,dB,high decade slope: 0.3 1200.0 7.441477754848547 5.997151147289652 -20.000000189943034 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB7原始setup/cell；reconciliation.json notebooks[6].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 62 | RC与路面模型：road z,c for m250 k16000, peak rad/s,dB,high decade slope | road z,c for m250 k16000, peak rad/s,dB,high decade slope: 0.707 2828.0 6.289473539026664 2.0903245943886892 -20.00000002153004 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB7原始setup/cell；reconciliation.json notebooks[6].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 63 | RC与路面模型：road z,c for m250 k16000, peak rad/s,dB,high decade slope | road z,c for m250 k16000, peak rad/s,dB,high decade slope: 1 4000 5.6568542028085895 1.2493873660830008 -19.99999992475848 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB7原始setup/cell；reconciliation.json notebooks[6].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 64 | RC与路面模型：Road model has a numerator zero; even z=1 has a resonance. No ve | Road model has a numerator zero; even z=1 has a resonance. No vehicle safety conclusion follows from displacement alone. | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB7原始setup/cell；reconciliation.json notebooks[6].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 65 | 时延与Padé：w, base, exact, Pade (deg) 0.1 -95.71059313749964 -98.5753821131 | w, base, exact, Pade (deg) 0.1 -95.71059313749964 -98.57538211315376 -98.57478550582894 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB8原始setup/cell；reconciliation.json notebooks[7].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 66 | 时延与Padé：w, base, exact, Pade (deg) 1 -135.0 -163.64788975654116 -163.072 | w, base, exact, Pade (deg) 1 -135.0 -163.64788975654116 -163.07248693585296 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB8原始setup/cell；reconciliation.json notebooks[7].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 67 | 时延与Padé：w, base, exact, Pade (deg) 2 -153.43494882292202 -210.7307283360 | w, base, exact, Pade (deg) 2 -153.43494882292202 -210.73072833600435 -206.565051177078 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB8原始setup/cell；reconciliation.json notebooks[7].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 68 | 时延与Padé：w, base, exact, Pade (deg) 5 -168.69006752597977 -311.9295163086 | w, base, exact, Pade (deg) 5 -168.69006752597977 -311.9295163086856 -271.3704510177996 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB8原始setup/cell；reconciliation.json notebooks[7].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 69 | 时延与Padé：K,wc,exact delay limit, exact PM at tau .5,Pade poles 0.5 0.4550 | K,wc,exact delay limit, exact PM at tau .5,Pade poles 0.5 0.45508986056181383 2.5131690233459163 52.4928353246229 [-4.2932776+0.j         -0.3533612+0.58393529j -0.3533612-0.58393529j] | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB8原始setup/cell；reconciliation.json notebooks[7].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 70 | 时延与Padé：K,wc,exact delay limit, exact PM at tau .5,Pade poles 1 0.786151 | K,wc,exact delay limit, exact PM at tau .5,Pade poles 1 0.7861513777576367 1.15061414365557 29.305714371026482 [-4.53284247+0.j         -0.23357877+0.90988431j -0.23357877-0.90988431j] | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB8原始setup/cell；reconciliation.json notebooks[7].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 71 | 时延与Padé：K,wc,exact delay limit, exact PM at tau .5,Pade poles 5 2.127190 | K,wc,exact delay limit, exact PM at tau .5,Pade poles 5 2.1271901209248747 0.20658512726711137 -35.76111601273144 [-5.77326227+0.j          0.38663113+1.82064885j  0.38663113-1.82064885j] | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB8原始setup/cell；reconciliation.json notebooks[7].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 72 | 九题答案复算：Q1 RC T=.001; wc1000 rad/s; fc 159.15494309189535 | Q1 RC T=.001; wc1000 rad/s; fc 159.15494309189535 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 73 | 九题答案复算：100 -0.04321373782642559 -5.710593137499643 | 100 -0.04321373782642559 -5.710593137499643 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 74 | 九题答案复算：1000 -3.0102999566398116 -45.0 | 1000 -3.0102999566398116 -45.0 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 75 | 九题答案复算：10000 -20.043213737826427 -84.28940686250037 | 10000 -20.043213737826427 -84.28940686250037 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 76 | 九题答案复算：Q2 normalized gain,corner,asymptote at corner | Q2 normalized gain,corner,asymptote at corner: 10.0 10 0.0 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 77 | 九题答案复算：Q3 u,bandwidth 2.1132130528261763 7.268447311541469 | Q3 u,bandwidth 2.1132130528261763 7.268447311541469 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 78 | 九题答案复算：Q3 resonance rad/s,linear,dB | Q3 resonance rad/s,linear,dB: 4.527692569068709 1.7471413945365304 4.846561069116191 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 79 | 九题答案复算：Q4 exact dB,phase at 1 | Q4 exact dB,phase at 1: 22.838229733067358 -57.455695312195324 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 80 | 九题答案复算：Q5 wg,Kcrit | Q5 wg,Kcrit: 3.1622776601683795 70.00000000000001 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 81 | 九题答案复算：Q5 K,poles | Q5 K,poles: 0 [-5. -2.  0.] | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 82 | 九题答案复算：Q5 K,poles | Q5 K,poles: 35 [-6.29468225+0.j        -0.35265887+2.3314975j -0.35265887-2.3314975j] | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 83 | 九题答案复算：Q5 K,poles | Q5 K,poles: 70 [-7.00000000e+00+0.j          1.27675648e-15+3.16227766j | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 84 | 九题答案复算：Q5 K,poles | Q5 K,poles: 100 [-7.45724397+0.j        0.22862199+3.654793j  0.22862199-3.654793j] | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 85 | 九题答案复算：Q6 fixed z=.5 bandwidth2/20 | Q6 fixed z=.5 bandwidth2/20 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 86 | 九题答案复算：tr2,tr20,MP | tr2,tr20,MP: 1.0415124832571714 0.10415124832571714 16.303353482158048 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 87 | 九题答案复算：Q7 wg,Re,GMlinear,GMdB | Q7 wg,Re,GMlinear,GMdB: 4.123105625617661 -0.07936507936507936 12.6 22.00741090235126 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 88 | 九题答案复算：Q8 omega,abs,deg | Q8 omega,abs,deg: 0 1.0 0.0 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 89 | 九题答案复算：Q8 omega,abs,deg | Q8 omega,abs,deg: 10 1.0 -90.0 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 90 | 九题答案复算：Q8 omega,abs,deg | Q8 omega,abs,deg: 10000000000.0 1.0 -179.99999988540844 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 91 | 九题答案复算：Q9 | Q9: 0.1 -95.71059313749964 -98.57538211315376 -98.57478550582894 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 92 | 九题答案复算：Q9 | Q9: 1 -135.0 -163.64788975654116 -163.07248693585296 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 93 | 九题答案复算：Q9 | Q9: 2 -153.43494882292202 -210.73072833600435 -206.565051177078 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |
| 94 | 九题答案复算：Q9 | Q9: 5 -168.69006752597977 -311.9295163086856 -271.3704510177996 | 不适用：静态实验或非默认参数；对应模型默认值已另列 | ✅ | NB9原始setup/cell；reconciliation.json notebooks[8].outputs；参数/单位随输出；舍入末位，复数1e-8/指标1e-7 |

### A.2 实测数据总表（原始证据）

- minimal.py/minimal.log：正文标准二阶四行/路面三行/GM/PM/时延表初算。
- reference.py → verify-classic05.mjs → reconciliation.json：真实完整TS、独立scipy、九原始新内核及合同；不是复制前端公式自证。headings.json为页面共用Math→KaTeX→slug管线，73旧ID全可达。
- notebooks.json / notebooks-delivery.log：严格EXECUTED9/9、FAIL0/SKIPPED0；extracted.json与assemble-delivery.log：18block反向逐字全等，不替代数学核算。
- browser-python.json：最终5934740fc9c3d16013f732b13d8afc855b854aa91669f83c2d746ee2da8d038e，9passed/0code；政策同步同hash。
- browser-results.json与截图：生产DOM、默认/边界/恢复、窄屏/旧锚点、实际答案实验；source-consistency.json/scope-check.json核范围和三方源。
- 接口原始来源：control0.10.2 frequency_response / stability_margins官方文档（正文链接），幅角原理参考Illinois ECE486 lec18（正文链接）；定义不由软件返回inf反推。

## 附录 B：秦构前端硬门槛实际输出

| # | 原始门槛（原编号） | 实际命令/动作 | 实际输出 | 通过? |
|---|---|---|---|---|
| 1 | npm run build 通过 | npm run build；npm run build:pages；npx tsc --noEmit | 均exit0；build-delivery-final.log/pages-delivery-final.log/types-delivery-final.log；205课/9旧路由/317266510字节 | ✅ |
| 2 | curl 课程页 → HTTP 200 | npm run verify -- classic/frequency-domain-analysis | exit0；HTTP200；page-delivery.log | ✅ |
| 3 | 页面 H2 数 == catalog.ts 该课 subsections 数 | 单课verify；check-browser.mjs | exit0；13H2顺序/ID/目录；73旧ID含3新增别名可达 | ✅ |
| 4 | katex-error 元素数 == 0 | 同上 | exit0；katex-error0；89display居中/auto | ✅ |
| 5 | MDX 中每个 JupyterNotebook 的 cell 字符串与验证脚本中的 cell 逐字全等 | nb-cells verify --require-kernel；extract/assemble；check-source.mjs | exit0；EXECUTED9Notebook/9cell；FAIL0/SKIPPED0；18block反向全等；源hash最终一致 | ✅ |
| 6 | 新增组件已在 `lib/wiki-components.ts` 登记（**E2 起单一来源，fix-015 已根治**；本项在 B6 九项里排第 6、在 `verify-lesson.mjs` 里排第 4，两套编号不通用） | npm run check；单课verify | exit0；65组件单一注册来源；四既有注册入口不改 | ✅ |
| 7 | 新增组件已在 MDX 中用 <ComponentName /> 显式引用 | rg Explorer 本课MDX；check-scope.mjs | 四原Explorer各1显式引用，均只本课调用 | ✅ |
| 8 | 每个交互组件：固定坐标轴 ✅ / animation: false ✅ / useECharts 收到 Option 对象 ✅ / 默认参数复现正文手算例 ✅ | verify-classic05.mjs；check-browser.mjs；实际截图 | exit0；120×601复数/3×601时间/9×601RC；5滑块端点/4恢复/默认；固定轴/animation:false/Option/useMemo/inline；390px无溢出；RC刻度已视觉修复 | ✅ |
| 9 | notebook 中无 ipywidgets / interact / FloatSlider / IntSlider 引用 | nb-cells严格检查 | exit0；无ipywidgets/interact/Slider；关闭PY001–003，27余项原记录/ID不变 | ✅ |

补充① 源/政策：check-source.mjs，最终hash5934740fc9c3d16013f732b13d8afc855b854aa91669f83c2d746ee2da8d038e，178独占围栏；source-check.log退出0。
补充② 范围：check-scope.mjs，69其它课执行记录/政策与27剩余债务逐字段全等，四调用课仅本课，W06–09仍待办；scope-check.log退出0。
补充③ 生产浏览器：browser-results.json/browser-check.log及opening.png/narrow.png/nyquist-boundary.png/rc-narrow.png；实际查看颜色、非零相位/临界点/同尺度单位圆、红半功率线与紧凑刻度，不拿DOM宽度替代视觉；答案原始Pyodide完成，console无warn/error。
补充④ 质量工具：14回归测试通过，术语PASS3/WARN1/FAIL0（既有函数名告警）、math围栏无坏项；check PASS21/WARN2/FAIL0、fix038索引/详情一致，见验收记录。未把W项或其它课旧WARN记成本课修复。


## 附录 C：何疑红队放行记录

| # | 对比断言（原句 + file:line） | 基线整定与扫描范围（a） | 组数与落败场景（b） | 正文的边界与代价（c） | 放行? |
|---|---|---|---|---|---|
| 1 | 固定ζ、只缩放ωn时，完整响应的时间轴精确反向缩放，带宽越大相应上升时间越短；跨不同模型或阻尼比时，没有一个通用乘积常数。 content/classic/frequency-domain-analysis.mdx:747 | 同单位直流无零点标准二阶，首次10–90%，保持ζ | ζ.3/.5/.707/1含临界阻尼；另wn2/8/50，乘积随ζ变 | 固定模型时间缩放才有带宽快慢；不宣称跨模型常数 | ✅ 限定观察/反例 |
| 2 | 三种方案都有位移放大峰；更大阻尼可降低该峰，但高频位移传递的系数$c/m$更大。不能据这张位移图排名舒适性，尚缺加速度、轮胎与人体指标。 content/classic/frequency-domain-analysis.mdx:1025 | 同m250/k16000路面(cs+k)/(ms²+cs+k)，仅位移传递 | ζ.3/.707/1；ζ1仍有峰、高频系数随c增大，含代价 | 不能据位移排名舒适或安全；无噪声/轮胎/人体指标 | ✅ 限定观察/反例 |
| 3 | 精确时延相位为$-.5\omega$弧度；一阶Padé相位为$-2\arctan(.25\omega)$，二者都要加到$-90^\circ-\arctan\omega$上，**不能把精确相位表当作Padé结果**。 content/classic/frequency-domain-analysis.mdx:1459 | 同K/[s(s+1)]、τ.5，精确延迟对一阶Padé | 频率.1/1/2/5；K.5/1/5含失稳，误差高频扩大 | 固定族唯一穿越与正向穿越证明；近似不可替精确稳定 | ✅ 限定观察/反例 |

## 附录 D：原稿审计、保留与变更传播

| 原位置/资产 | 审计证据 | 保留/纠错/重写/迁移/拆分/删除 | 目标位置/去向 | 验证方式 |
|---|---|---|---|---|
| 原正弦留数/频率函数 | baseline-source.json；旧完整MDX读审 | 保留稳定瞬态推导，补模型与单位 | 频率响应函数、NB1 | 原式+复数API |
| 原五环节与组合Bode | 原稿标准归一化 | 保留正确渐近线，修幅相API | Bode图/NB1、NB3 | 控制API+复数 |
| 原GM算例与Nyquist判断 | 漏分母常数10 | 纠错−.079365/12.6/22.007411 | Bode裕度/Nyquist图/题7/NB2 | 同源变更全传播 |
| 原Nyquist定义与裕度几何 | 半支/单位圆中心/局部距离混淆 | 补完整围线、P/Z、RHP反例 | Nyquist图/裕度/NB4/5 | 两R/epsilon计数+闭环根 |
| 原六Notebook #1/#2 | 旧源hash与API失效 | 保留演示目的，重写为官方API | NB1正弦/Bode；NB2归一化 | 新内核/Pyodide |
| 原六Notebook #3/#4 | widgets/元组误用/圆心错误 | 保留增益族与Nyquist裕度目的 | NB3两族阈值；NB4完整围线 | 静态复算+两交互 |
| 原六Notebook #5/#6 | 裕度与PM/超调代码 | 保留并按合同重写 | NB5稳定/API；NB6频时指标 | 独立三方+原始运行 |
| 原四Explorer | 四者仅本课调用 | 改真实共用纯计算、单位/坐标/布局 | 仍四原注册入口，不添孤儿 | 实际TS全网格+DOM/截图 |
| 原频域与时域 | tr定义混用/错误近似链 | 保留精确PM推导，修表和适用域 | 频域与时域/NB6 | 连续根/状态空间 |
| 原RC与悬挂 | Hz/rad混标/分子零点被忽略 | 保留两例，修三阻尼峰与高频 | 工程实例/NB7 | RC频率表/独立优化 |
| 原深入讨论/时延 | 精确与Padé混表、降低增益被误判 | 保留非最小相位/时延主题，补精确条件 | 深入讨论/NB8、题8/9 | 全通复数/边界证明 |
| 原九题全部 | original题干/答案逐题读审 | 九题全留；题6限定模型/定义 | 习题/答案/NB9 | 原参数复算+门槛 |
| 旧全级标题/三长H2 | 73原ID，含数学标题 | 三H2短名+3别名，不迁URL | legacy-anchors/catalog/OUTLINE | 共用管线+实际生产DOM |
| PY-001/002/003 | 原三widgets代码展示 | 本轮解决，保留历史映射 | resolved-python-debts.json | 九组Pyodide全部passed；27原记录不动 |
| 未迁材料 | 本课无拆课/外移 | 无未迁片段，不删来源 | 不生产下一课 | check-scope |

W06/W07/W08/W09仍待办；直接内核与Pyodide通过不表示原生IAB网关UI的遗留问题已经修复。只合master，未授权gh-pages发布。
