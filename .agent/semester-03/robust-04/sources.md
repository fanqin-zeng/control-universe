# ROBUST-04 来源与复现边界

检索核对日期：2026-10-24。下列均为官方技术文档；正文推导和数值为本课另行复算，不把文档示例输出当成本课实测。

- [鲁棒性能的增广反馈与μ度量](https://www.mathworks.com/help/robust/ug/measures-of-robust-performance.html)：性能满块、小增益等价；给定参数范围内最坏增益与增广μ不同。
- [mussv](https://www.mathworks.com/help/robust/ref/mussv.html)：结构、实/复块、计算上下界；有限频率FRD与连续模型范围不同。
- [mixsyn](https://www.mathworks.com/help/robust/ref/dynamicsystem.mixsyn.html)：参数顺序W1S/W2KS/W3T，标称混合灵敏度问题。
- [robgain](https://www.mathworks.com/help/robust/ref/dynamicsystem.robgain.html)：指定性能水平下的鲁棒性能裕度，上下界的方向以及频率向量只覆盖指定点。
- [musyn](https://www.mathworks.com/help/robust/ref/uss.musyn.html)：广义对象输入/输出分块、nmeas/ncont、D–K迭代与返回性能上界。

未使用MATLAB许可或运行Slycot综合；正文明确标注外部模板未执行，不给虚构控制器和优化后指标。浏览器必需实验只使用实际支持的NumPy/SciPy/control功能，全部原始setup/cells由严格原生内核和Pyodide执行。

独立参考reference.py：实际TS对control.feedback/传递函数极零点；所有500样本对独立控制传递多项式/根；完整LFT用SymPy恒等消元；已选可行D奇异值用Hermitian特征值复核。额外连续名义峰约4.210908仅在证据JSON作独立检查，不替换正文明确声明的1000点网格峰4.210744。
