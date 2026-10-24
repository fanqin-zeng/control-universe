# ROBUST-10来源与可执行范围

检索日期2026-10-24。标量a>0/k>=0的一阶负反馈DDE为课程自建归一化教学模型；默认a1/k2/tau.5、连续历史phi恒1、无外扰、0–12秒。不是实机辨识或通用时滞谱求解器。

- [MathWorks Padé官方接口](https://www.mathworks.com/help/control/ref/dynamicsystem.pade.html)：有限阶有理逼近以及与原延迟模型的相位/响应对照。课程只执行自己给出的首阶模型，不冒称运行MATLAB。
- [SciPy Lambert W官方接口](https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.lambertw.html)：多值复分支、分支点附近数值限制。课程−20..20分支只作见证，解析交叉判据承担稳定证明。
- [Adıvar与Akın Bohner，Halanay type inequalities on time scales with applications，arXiv:1102.2120v2](https://arxiv.org/html/1102.2120)：引言Lemma1回顾经典Halanay不等式，Theorem1讨论有界变化延迟；本课直接给出a>k、连续有界时滞/连续历史/零外扰条件与标量指数比较推导，不复现论文其它推广。

源码许可沿用仓库既有许可，无复制第三方实现/新依赖。实际TS历史RK4与独立SciPy DOP853分段稠密历史、Padé矩阵指数、复频响/非线性根/SymPy核验见reconciliation.json；原生及Pyodide运行所有页面setup/cell。常时滞、小增益充分证书、有限Padé近似、Halanay时变证书、有限仿真窗口分开，不代签任意变化时滞、丢包、预测器或实机安全。
