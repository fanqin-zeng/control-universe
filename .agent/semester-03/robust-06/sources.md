# ROBUST-06 来源与运行边界

检索日期2026-10-24，技术依据仅原作者/官方资料。

- [Python-control 0.10.2 mixsyn](https://python-control.readthedocs.io/en/0.10.2/generated/control.mixsyn.html)：S/KS/T位置与三返回值。
- [MATLAB mixsyn](https://www.mathworks.com/help/robust/ref/dynamicsystem.mixsyn.html)：S/KS/T位置、CL的加权输出意义。
- [augw](https://python-control.readthedocs.io/en/0.10.2/generated/control.augw.html)：输出维度与权重连接。
- [hinfsyn](https://python-control.readthedocs.io/en/0.10.2/generated/control.hinfsyn.html)：依赖Slycot sb10ad。本机find_spec(slycot)=None；本课未执行通用综合。
- [DGKF作者论文，IEEE TAC 1989](https://www.doyle.caltech.edu/images/doyle/2/20/TAC1989.pdf)：标准问题、归一化、稳定化ARE和谱半径条件。
- [MIT 6.245原授课讲义](https://ocw.mit.edu/courses/6-245-multivariable-control-systems-spring-2004/803667684d36e45f3df9a41d4e65f85c_lec5_6245_2004.pdf)：压床效应与积分条件；Caltech同主题讲义检索命中但打开502，不将其算作已读全文。

本课数字来自实际原始MDX cells、真实TS实现和独立control/SymPy/SciPy核对。全频驻点是有理标量幅平方驻点与端点的数值枚举，另以log频率优化核验，不是形式化区间证书。限定a/k网格仅网格候选，不宣称族内连续或通用H∞最优。稳定名义消去不保证失配鲁棒；9rad/s实测失稳。旧两控制器失稳只作诊断，没有用坏基线冒称算法优越。
