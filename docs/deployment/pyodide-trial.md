# 浏览器 Python 试验与支持清单

> 本文保留 DEP03 数学两课试验的历史记录。后续全课程逐实验支持范围以 [python-expansion.md](python-expansion.md) 为准。

2026-10-17；工作包 wp/pyodide-trial。用户授权：先在本地验收数学两课、python-control 常用功能和 Slycot 兼容性，验收通过则直接发布 gh-pages。本次授权仅覆盖本工作包；以后仍逐次取得发布同意。

## 交付范围

Pages 上 math/calculus-basics 与 math/complex-numbers 的 9 个 notebook 启用可编辑单元格、逐格/全部运行、文本与 PNG 输出、错误提示、重置与停止。其余课程继续代码展示；本地 npm run dev 继续使用真实 Jupyter。课程正文、算法和数值断言未改动，本次是执行基础设施试验，不新增课程交付。

这是 notebook 式界面配浏览器 CPython/WebAssembly，未实现完整 Jupyter 协议或 JupyterLab；未声称支持任意 pip 包、ipywidgets、GPU、系统进程或原生系统库。

## 固定环境

Pyodide 0.27.7 / Python 3.12.7 / NumPy 2.0.2 / SciPy 1.14.1 / SymPy 1.13.3 / Matplotlib 3.8.4 / python-control 0.10.2。24 个资源共 51615139 字节（约 49.2 MiB），按需加载；所有运行时、依赖及 control wheel 随站点同源发布，SHA256 清单在 scripts/pyodide-assets.json。首次构建从官方 Pyodide CDN / PyPI 下载，读者正常运行无需访问它们；只有验收台的 Slycot 安装探测另访问 PyPI。

固定这个版本是为了建立可复现的兼容性基线，不代表它是最新版本。浏览器测试环境与版本见 pyodide-local-results.json 的 userAgent / versions 输出。

## 已实测支持

| 功能 | 实测边界与断言 |
|---|---|
| 数学两课 9 个单元格 | 直接解析当前 MDX 的 setup/cells，分别运行；与 Python 3.13.12 / SymPy 1.14.0 的参考输出逐项比较，文本忽略空白，数值相对/绝对容差 1e-9 |
| tf、poles、zeros、dcgain | 二阶 SISO，极点 -1/-1、无零点、直流增益 1 |
| step_response、impulse_response、forced_response | 一阶系统，与指数函数解析值对账 |
| feedback、series、parallel | 负反馈极点 -2，直流增益 0.5；串并联直流增益 1/2 |
| frequency_response、bode_plot、nyquist_plot、margin | 固定频率网格；G=1/[s(s+1)^2] 增益裕度 2，相位裕度在 20–25 度 |
| ss、ctrb、obsv | 二阶系统可控/可观矩阵满秩 |
| tf ↔ ss | SISO 转换；极点与直流增益保持一致，不外推为 MIMO 支持 |
| place | SciPy 方法，闭环极点 -4/-5 |
| lqr / CARE | 显式 method='scipy'；闭环稳定，Riccati 残差范数 <1e-8 |
| sample_system、dlqr / DARE | ZOH，采样间隔 0.1；离散闭环极点模 <1，DARE 残差 <1e-8 |
| root_locus_map | 3 个增益、两条根轨迹；零增益极点 -2/-1 |
| MIMO 状态空间频响 | 2×2 对角系统，在 ω=1 的复数响应与解析值一致 |
| lqe | 显式 method='scipy'；观测器稳定、Riccati 残差 <1e-8 |
| Matplotlib | Agg 后端输出 PNG；实测生成一张图，plt.show() 可用 |
| 单元格状态 | 同一 notebook 变量保留，不同 notebook 使用不同字典；重置清空该字典 |

## 已实测不支持

| 功能 | 实测结果 |
|---|---|
| Slycot import | ModuleNotFoundError |
| micropip.install('slycot==0.7.1') | 实际访问 PyPI 后报 Can't find a pure Python 3 wheel；不是网络错误。0.7.1 的公开发行文件无 Pyodide/WebAssembly wheel |
| hinfsyn | ControlSlycot：缺少 sb10ad |
| h2syn | 缺少 Slycot 子程序 |
| mixsyn | 经 hinfsyn 路径报缺少 Slycot |
| 状态空间 minreal | 缺少 Slycot |
| MIMO tf → ss | 当前转换实现要求 Slycot，报不支持 |

“不支持”限定本次固定版本与已发布 wheel；不等于证明未来不能自行移植 Slycot。未测试 cvxpy、额外优化求解器、深度学习或其余课程的全量 356 cells；不能把本清单解释为全站兼容。18 个历史 notebook 的 ipywidgets 仍按课程重构计划处置，本任务不改写它们。

## 本地验收

- [pyodide-local-results.json](pyodide-local-results.json)：真实浏览器 Worker 30/30 项符合预期，其中 6 项是明确的失败预期；Slycot wheel 安装失败独立记录，不能将它计作“支持”。
- [pyodide-ui-results.json](pyodide-ui-results.json)：实际课程页面的微积分 6 / 复数 3 个 notebook 全部完成；编辑 print(2+3) 得 5，重置恢复原代码并清空输出；ValueError 显示；while True 无限循环可停止，并可重新初始化运行；控制台 error/warn=0。
- [pyodide-calculus.png](pyodide-calculus.png)、[pyodide-complex.png](pyodide-complex.png)：本地页面截图。另见 pyodide-plot.png：实际课程单元格中 import control、dcgain 得 1.0，并显示 Matplotlib PNG。
- npm run build:pages：退出码 0；205 课程、9 旧入口静态审计通过，279290823 字节，低于 1 GiB。见 pyodide-build.log。
- npm run check：退出码 0，PASS21/WARN2/FAIL0，存量 WARN 不变。见 pyodide-check.log。
- node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs：退出码 0，12/12；包含数学路由限定、静态其他课程不请求 Jupyter、停止/超时拒绝在途请求及新建 Worker。见 pyodide-tests.log。
- npx tsc --noEmit：退出码 0。
- npm run verify -- math/calculus-basics math/complex-numbers：退出码 0，本地真实 Jupyter 页面模式回归通过，见 pyodide-local-jupyter-pages.log。

重跑：先 node scripts/prepare-pyodide.mjs；构建后 npm run preview:pages，在 /control-universe/python-lab.html 点击“运行全部验收”，可下载完整 JSON。本机 Python 参考重建用 node scripts/python-math-reference.mjs；源文件哈希按 LF 规范化，CI 不依赖安装原生 Python。改数学源文件后必须重建、审阅参考并重跑浏览器，不悄悄使用旧输出。

## 运行约束

同页共享一个按需创建的 Worker，任务串行；各 notebook 变量字典独立，但模块、虚拟文件系统和解释器共享，不是恶意代码之间的安全隔离。执行发生在浏览器，不能直接读用户本地磁盘；未把现有无认证 Jupyter 网关暴露公网。180 秒看门狗或手工停止会终止本页 Worker、拒绝在途任务并清空所有变量，再次运行会重建。支持清单只覆盖上面的测试样本，不是完整 Python 环境承诺。

当前不需要购买阿里云服务器；Slycot 类实验后续可接完整原生 Python 后端，但不能因这一部分受限而宣称浏览器整体不可用。

## 发布

本地验收通过后按本次授权发布：源码 43180de，经 --no-ff 合入 master 得 9e750a7，再合入 gh-pages 得 e6f74f0e3766888f4ef40c4675d9cc5f79567d90；gh-pages/master 推送均退出码 0。Actions：[39023386607](https://github.com/fanqing-zeng/control-universe/actions/runs/39023386607)。云端 build/deploy 均 success，见 pyodide-public-actions.json。公网 release.json sourceCommit 精确匹配 e6f74f0…、sourceDirty=false、pythonExecution=browser-math-trial。公网完整清单再次 30/30 符合预期，Slycot 0.7.1 安装明确失败，见 pyodide-public-results.json。

node scripts/verify-public-pages.mjs e6f74f0e3766888f4ef40c4675d9cc5f79567d90 docs/deployment/pyodide-public-http.json：退出码 0，235 次成功请求、205 课程和9旧入口、未知路径404，见 pyodide-public-http.json。

公网实际课程页面亦完成微积分 6 / 复数 3 个 notebook，站内导航正常、控制台 error/warn=0；输出见 pyodide-public-ui.json，截图见 pyodide-public-course.png / pyodide-public-complex.png，验收台截图见 pyodide-public-lab.png。DEP03 完成。

发布后的验收记录只在 master 更新，不触发新的站点发布；保留首次发布证据，verify-public-pages 支持指定新的输出路径。

参考：[Pyodide 0.27.7](https://pyodide.org/en/0.27.7/usage/index.html)、[Worker](https://pyodide.org/en/0.27.7/usage/webworker.html)、[hinfsyn 依赖](https://python-control.readthedocs.io/en/stable/generated/control.hinfsyn.html)。
