# ROBUST-07 原始与官方来源

检索日期2026-10-24。

- [MathWorks mussv](https://www.mathworks.com/help/robust/ref/mussv.html)：结构编码、上下界而非一般精确值；bounds第一列上界、第二列下界。
- [MathWorks mussvextract](https://www.mathworks.com/help/robust/ref/mussvextract.html)：致奇异扰动检验、D/G乘子、纯复块缩放界。重复标量的正定D与full块的标量D不可写反。
- [MathWorks鲁棒稳定/性能与μ分析](https://www.mathworks.com/help/robust/ug/robust-stability-robust-performance-and-mu-analysis.html)：稳定半径与μ上下界的倒数方向、完整性能增广。
- [Young/Newlin/Doyle 1991原论文](https://doyle.caltech.edu/images/doyle/6/64/CDC1991u.pdf)：实/混合μ性质可与纯复μ不同，可能不连续，不能照搬一般谱半径下界或有限频网格结论。

本课用自主推导、可解析的A/(s+1)与标量性能增广教学模型，不是实机辨识数据。数值来自原MDX cell实际执行及真实TS/独立NumPy SVD、control正反馈、SymPy行列式核对。没有运行MATLAB mussv或通用混合μ求解器，没有用对角代理冒称上界。相邻mu-synthesis旧稿独立性/通用ρ界/D块错误只登记RB08，待ROBUST-08独立重构。
