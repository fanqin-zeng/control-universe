# EST-04 来源与复现边界

2026-10-24核对。新课入口MDX不存在、catalog为空；baseline-commit.txt固定6ebdfe534e647b416e230f9182803d5e895e2074。数学前置EST-03、多元微积分已交付，Lyapunov仅作条件阅读。数值不继承旧课缓存。

MathWorks官方R2026b《Extended Kalman Filters》：https://www.mathworks.com/help/fusion/ug/extended-kalman-filters.html 。核对非线性函数/状态Jacobian/噪声Jacobian的分工，以及笛卡尔状态对应距离/方位观测的建模。课程不使用MATLAB运行时，也未照搬该页演示轨迹或其性能数据；公式的具体参数、平方观测、精确矩与参考积分均为本课独立教学计算。几何角度使用atan2及主值残差。

实际Python环境SciPy1.18.1，NumPy高斯Hermite积分24点；网页Pyodide0.27.7由仓库既有worker提供。真实TS实现使用Simpson±12/4800段，Python对无穷区间按驻点分割自适应quad，线性化条件分布由精度形式独立计算，几何Jacobian对中心差分、角度对模运算。所有72配置完整留actual-ts.json/reference-controls.json，不报告随机排名、不涉及训练数据或实机复现。密度比较是同一先验/似然的一拍后验近似，不用不同测量任务的指标互相排名。

初版±8积分尾部误差超过1e-9，留reconciliation-first-tail.log；扩大积分范围而未放宽阈值后通过。接口只为当前有正方差、低维教学配置提供数值参考，不主张直接替代高维滤波或构成稳定性/安全证明。
