# EST-06 原始来源与复现范围

检索日期2026-10-24。课程为自主教学模型与小规模复算，不声称复现论文跟踪性能，不复制分发PDF正文。

- Arulampalam, Maskell, Gordon, Clapp, A Tutorial on Particle Filters for Online Nonlinear/Non-Gaussian Bayesian Tracking, IEEE TSP50(2),174–188,2002, DOI10.1109/78.978374，https://ahstat.github.io/images/2014-7-11-Introduction-particle-filters/arulampalam2002tutorial_particle_filters.pdf ：SIS/重采样/非Gaussian状态估计。
- Doucet/Johansen, A Tutorial on Particle Filtering and Smoothing: Fifteen Years Later, 2009，作者托管版 https://www.stats.ox.ac.uk/~doucet/doucet_johansen_tutorialPF.pdf ：一般重要性提议、bootstrap与退化边界。
- Douc/Cappé/Moulines, Comparison of Resampling Schemes for Particle Filtering,2005, https://arxiv.org/abs/cs/0507025 ：重采样方差比较的适用条件，不据教学个例宣称系统重采样普适占优。

仅引用并独立实现标量教学算法，未复制外部项目代码，因而不引入外部实现许可证。NumPy/SciPy、React/ECharts沿用仓库依赖。TS的xorshift/Box–Muller只为固定实验序列；Python多种子实验用PCG64，原始输出区分两种随机源。
