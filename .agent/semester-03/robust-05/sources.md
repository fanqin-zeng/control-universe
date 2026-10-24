# ROBUST-05 来源与运行边界

检索日期2026-10-24，仅采用技术原始来源/官方文档：

- [DGKF作者原论文，IEEE TAC 1989](https://www.doyle.caltech.edu/images/doyle/2/20/TAC1989.pdf)：标准问题、归一化、稳定化ARE解与谱半径耦合；收稿1988不等于发表年。
- [MathWorks hinfsyn](https://www.mathworks.com/help/robust/ref/dynamicsystem.hinfsyn.html)：广义对象输入输出顺序、内部稳定化与给定γ可行性、求解器条件。
- [Python control hinfsyn](https://python-control.readthedocs.io/en/latest/generated/control.hinfsyn.html)：依赖Slycot sb10ad；本机/浏览器本课未运行该综合接口，不以手调冒充。
- [MIT 16.30 LQR讲义](https://ocw.mit.edu/courses/16-30-feedback-control-systems-fall-2010/55d0aa6e1e4631a0c3366fb68028ae50_MIT16_30F10_lec18.pdf)：连续时间全状态反馈的返回差/指定输入回路裕度；非任意输出S或任意估计器闭环保证。

滤波器中心模比、原失稳、候选/失配、连续峰值与所有题解由本课独立计算支持，未采用外部示例数值。原始MDX setup/cells分别严格原生8995及Pyodide执行。reference.py直接调用实际TS结果，对独立control实现与全部实驻点/连续优化/SymPy检查；并没有复写TS算法自证。实际软件版本由运行报告记录。

科学边界：连续峰为标量有理幅频函数全部驻点及端点的数值枚举，不是形式化区间计算；React扫描读数不冒充全频范数。原不稳定参数的频率代数值不具有稳定H∞或稳态解释。名义候选需更低带宽，9/11rad/s失配失败，不宣称全不确定集合鲁棒性能。
