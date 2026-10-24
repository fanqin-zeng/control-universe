# EST-08 来源与复现范围

2026-10-24读取Särkkä作者PDF：https://users.aalto.fi/~ssarkka/pub/cup_book_online_20131111.pdf ，Bayesian Filtering and Smoothing(2013) §4.3。沿用线性高斯KF/Joseph与创新条件分布；本课离散加速度模型、同步双位置、缺测/离群/门限与统计实验为自建教学简化，不复制分发原图/代码/PDF，不冒充作者原实验或工业实测。

数据：NumPy Generator(PCG64(seed))标准正态，种子0..19及43；先2初值扰动，再12×3加速度与两路观测扰动；数据生成脚本make-notebooks.py与lib/estimation-case-data.json全量存档。真实加速度标准差.2m/s²、观测噪声标准差1/2m。UI只暴露7/19/43，统计只用0..19。所有工况/Q/gate共用原始输入，无挑种子/训练/真值调参。基线同sensor1、prior/Q/gate，少sensor2信息；无门限与门限比较固定同一数据。

三Notebook6cell从源码原串独立执行；TS为手写2×2 Joseph，Python矩阵Joseph并对信息形式核验。门限9是给定启发式，不是作者或安全标准推荐。无随机数跨语言一致性假设，因为直接共用版本化输入。运行版本见environment.json。
