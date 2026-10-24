# EST-07 原始来源与复现边界

检索2026-10-24；自主标量教学模型与确定性矩阵实验，不复制论文图表/代码，不冒充作者导航或SLAM性能复现。

- Särkkä, Bayesian Filtering and Smoothing, Cambridge,2013，§4.3 Gaussian/Kalman更新，https://users.aalto.fi/~ssarkka/pub/cup_book_online_20131111.pdf 。矩阵联合条件化为基础；本课相关标量、白化、共享先验和对齐例自行推导并复算。
- Julier/Uhlmann, General Decentralized Data Fusion with Covariance Intersection, Handbook of Multisensor Data Fusion ch12,2001，§12.3/Appendix12.A，https://dsp-book.narod.ru/HMDF/2379ch12.pdf 。CI定义、未知cross与一致性前提，避免重复信息；本课只给标量Cauchy界和固定权重/网格，不声称实现一般矩阵优化器。
- Julier/Uhlmann, A non-divergent estimation algorithm in the presence of unknown correlations, ACC1997, DOI10.1109/ACC.1997.609105，仅用于文献脉络，算法内容以上述作者章节为读取来源。

不复制分发PDF正文；无外部代码许可引入。NumPy/SciPy与React/ECharts沿用仓库依赖。无随机实验；所有比较绑定同一prior/观测/噪声合同，actualMSE为解析联合误差二阶矩而非单次残差。
