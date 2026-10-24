# ROBUST-08来源与可执行边界

检索日期2026-10-24，官方文档页面显示R2026b。文档解释接口与算法，不代表本机安装或运行MATLAB；外部模板未执行。页面实际运行的是精确限定静态族P/K/D、原PI诊断及全部题解，代码见extracted.json，原生control版本与独立核对见reconciliation.json。

- [D-K迭代](https://www.mathworks.com/help/robust/ug/d-k-iteration-process.html)：D/G分析、动态拟合后指标与K步的差别，拟合可能抬高指标。
- [musyn](https://www.mathworks.com/help/robust/ref/uss.musyn.html)：P的输入输出末通道约定、第二输出CLperf为μ上界、第三输出info。
- [mussv](https://www.mathworks.com/help/robust/ref/mussv.html)：重复实/复标量与满块结构编码，返回上下界，频点数据按点计算。
- [augw](https://www.mathworks.com/help/robust/ref/dynamicsystem.augw.html)：S/KS/T权重次序核对；正文直接给出Pmu，完整保留不确定对象。

本站代码许可沿用仓库既有许可；未复制第三方实现，无新依赖或第三方源码。所有示例是课程教学模型，不冒称实机辨识、通用混合μ求解或全局最优。
