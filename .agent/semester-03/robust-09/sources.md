# ROBUST-09来源和可执行范围

检索日期2026-10-24。贯穿标量温度/误差模型为课程自建归一化教学例，非实机辨识；推导在正文给全，实际计算依赖Python-control/NumPy/SciPy与独立TS，版本见reconciliation.json。

- [Boyd等《Linear Matrix Inequalities in System and Control Theory》作者页面](https://web.stanford.edu/~boyd/lmibook/index.html)：二次储能、Schur补与有界实方法。本课直接展开标量Q_p，不声称运行通用LMI求解器。
- [Stanford EE363 LMI讲义](https://ee363.stanford.edu/archive/notes/lmi-cvx.pdf)：LMI/有界实可行性与Lyapunov的联系，方法背景。
- [MathWorks kalman官方说明](https://www.mathworks.com/help/control/ref/ss.kalman.html)：连续白噪声强度、最小稳态误差协方差目标；本课用独立SciPy CARE复核，不声称运行MATLAB。

本站代码许可沿用仓库既有许可；无复制第三方实现或增加依赖。正文区分准确模型内的确定性有限能量、独立Wiener随机合同、指定常数L族、有限脉冲与全尾部、Euler/保持输入ZOH；未执行一般动态H∞滤波、实机、参数不确定集或数字全链路认证。
