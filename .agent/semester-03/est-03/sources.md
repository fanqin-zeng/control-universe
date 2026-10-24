# EST-03原始来源与复现边界

2026-10-24核对。沿用旧稿范围而非继承其结论；旧稿在source-before.mdx，来源commit在baseline-commit.txt。当前术语/符号核对docs/semester-02/04-notation.md，首现明确噪声强度与LQR权重。

- SciPy官方solve_continuous_are：https://docs.scipy.org/doc/scipy/reference/generated/scipy.linalg.solve_continuous_are.html 。实际执行SciPy1.18.1，按文档ARE的矩阵位置核对(A.T,C.T,Qproc,Rmeas)，不交换Q/R。
- John C. Doyle, Guaranteed margins for LQG regulators, IEEE TAC23(4),1978,756–757, DOI10.1109/TAC.1978.1101812；Caltech作者机构归档：https://authors.library.caltech.edu/records/e39yd-evs06 ；原论文PDF：https://murray.cds.caltech.edu/images/murray.cds/b/b4/Guaranteed_margins_for_LQG_regulators_-_doyle.pdf 。只引用其反例所支持的“无统一继承裕度”，不把它误说成每个具体LQG都不鲁棒。

其余公式为课内推导；独立TS计算与SciPy/ODE、quartic、Kronecker和协方差迭代交叉核对。仿真是教学Euler–Maruyama复现，非原论文复现，未声称真实系统实测。
