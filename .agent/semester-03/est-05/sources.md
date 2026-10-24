# EST-05 来源与复现边界

检索2026-10-24；只引用，未复制再分发PDF。课程公式与手算自主组织，实验为教学小模型，不是作者性能复现。

- Julier/Uhlmann, Unscented Filtering and Nonlinear Estimation, Proc. IEEE 92(3), 401–422, 2004, DOI10.1109/JPROC.2003.823141。 https://www3.nd.edu/~lemmon/courses/ee67033/pubs/unscented-filter-julier-proceedings-2004.pdf ：UT动机，均值协方差近似及分布局限。
- Särkkä, Optimal Filtering 2009讲义，Algorithm3.12，https://users.aalto.fi/~ssarkka/course_k2009/full_course_booklet.pdf ：加性UKF预测加Q后重新生成测量sigma点。
- Särkkä/Svensson, Bayesian Filtering and Smoothing 2nd ed.,2023作者在线版§8.7–8.8，https://users.aalto.fi/~ssarkka/pub/bfs_book_2023_online.pdf ：Gaussian假设、UT精度限制。整本web读取超大小限制，检索返回的§8.7–8.8内容用于定位，不声称完整通读。
- MathWorks官方算法说明，https://www.mathworks.com/help/control/ug/extended-and-unscented-kalman-filter-algorithms-for-online-state-estimation.html ：缩放权重、加性/非加性噪声与平方根实现边界（动态官方文档，访问日期如上）。

默认alpha1/beta2/kappa0便于手算，非调参推荐。无外部实现依赖；NumPy/SciPy只用于课程数值，React/ECharts沿用仓库依赖。既有extended-kalman模块只提供相同EKF及教学参考曲线，不复制修改旧课。用独立自适应积分复核该参考与新UKF输出。
