# 来源与模型合同

检索：2026-10-24。Kong、Pfeiffer、Schildbach、Borrelli，2015，*Kinematic and Dynamic Vehicle Models for Autonomous Driving Control Design*，DOI 10.1109/IVS.2015.7225830。

已读论文PDF：https://nuhuo08.github.io/control/IV_KinematicMPC_jason.pdf 。作者单位为UC Berkeley/ETH；原作者站 https://borrelli.me.berkeley.edu/pdfpub/IV_KinematicMPC_jason.pdf 当日浏览工具未能访问，正文指向可读的论文副本，不伪称原作者站可达。

使用范围：§II的两类模型、参考点/速度定义、轮胎侧偏关系与低速分母奇异。本文后轴运动学和CG线性模型由几何/力平衡自行推导：论文运动学采用CG速率和侧偏角；论文动力学轮胎力方程的2倍因子与本文整轴总刚度的约定不同，不能逐字拼接。没有复现论文车辆、实验、MPC或精度比较，不把其特定性能结论当作本课结果。

CommonRoad官方模型项目 https://gitlab.lrz.de/tum-cps/commonroad-vehicle-models 仅作可追溯的后续阅读线索；网页可访问但模型PDF当日抓取超时，未据未读内容给出本课具体公式或数字。

代码及算例为自建合成教学实验；使用本仓库既有numpy/scipy和浏览器Pyodide，不复制第三方车辆代码或数据，无额外模型权重、安装、训练或数据许可证依赖。数值参考是独立从轴力/力矩构造状态算子后计算增广矩阵指数，而实际TS实现用显式A/B和RK4，二者对账见numeric.json。
