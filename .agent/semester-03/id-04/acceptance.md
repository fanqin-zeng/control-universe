# ID-04 持久激励

用户指定2026-10-24，rank3；空课新写。范围仅本课、组件/纯计算实现/SVG、注册、catalog、术语、日志、进度及Python证明；旧课不改源，避免传播hash与重复交付。

按wiki-lesson-new和既有wiki-discussion Phase1–4，10人结构化审查，不冒充真实外部专家。先修ID-03与矩阵分解均已交付。Phase1–4与本课验收已完成；真实提交后追加回执。

隔离目录D:/Workspace/control-universe-rank3-id04；独占8994内核、18194原生、18394实验夹具、18494 Pages。使用前检查端口；本地API改写不进入源码提交。保留共享索引和其他会话修改，使用专用Git索引；只推master，不发布Pages。

实际夹具使用18396并显式传本课固定fixture（原18394返回其他清单，不作验收依据）；Pages固定18497被他课占用后避开，最终用Node绑定系统空闲端口3366，见pages-port.json。pages-audit.py只管理自身Popen产生的进程；关闭后不保留预览服务。未改共享端口脚本，未停他人18497进程。

开工共享check失败7项，学期检查的ML-03并行证据未完成；原始输出见opening-check.log/opening-semester.log。最终以HEAD叠本课的隔离门槛判定，不擅改他课刷绿。

最终课程11个H2、4题/4答案、3 Notebook/3cell、1 Explorer、1 SVG；FIR是明确的两参数方向教学模型，不冒充水箱完整闭环实验。期初十节草案的题答合节被门槛否决后拆为11节，内容均保留。

独立数值：实际TS1056配置×65行，theta对加权增广lstsq、P对Fraction信息和闭式逆、窗口对eigvalsh；470982量，maxError1.3642420526593924e-12<预定1e-10，7类非法输入拒绝。详见actual-ts.cjs/json/log、reference.py、reconciliation.json/log。初次双精度逆参考触及1e-10后改精确参考，未放宽容差。

原始Notebook严格内核3/3执行、error0、SKIPPED0，见notebooks.json/log；最终MDX浏览器3/3 passed且enabled，见pyodide.json；实际服务Worker hash单独抓取核对，见worker-served.json。源hash `ca12941e50596fc2ecc2c3b58d6e0f9206c2e0f156afcda8b1dcca7b548f412d`，Worker `c2240df9b66c9edb1c9589b37bfef9c68cd8f1e65166e4166577fd8fed6368f3`。

前端适用验收均保留原始命令及退出码于*-commands.json。普通页与Pages页实际执行全部Notebook，测试4工况、A0/1、λ.9/1、L16、恢复默认、DOM标题/ID/侧栏/重复ID、KaTeX、SVG和375px。手机表格溢出和图例留白修正后复测，未用放宽屏宽绕过。

课程verify仅保留下一课instrumental-variable为空课的进一步阅读WARN；全局术语WARN为符号/噪声候选覆盖和既有裸max/min提示，本课不新增冲突。讨论日志附录A/B/C/D含完整对账、九门槛、红队边界及实施修正，不将共享并行工作区的未完成草稿称为全站通过。

| 最终门槛 | 实测结果 | 证据 |
|---|---|---|
| 独立数值/原始cell | 1056配置、470982量；maxError1.3642420526593924e-12<1e-10 | reconciliation.json/log |
| 严格内核/浏览器Worker | 3Notebook/3cell均执行，error0、SKIPPED0，enabled3 | notebooks.json、pyodide.json |
| 生产/Pages构建 | 两次exit0，无MDX编译失败 | build/pages-commands.json、build.log、pages-build.log |
| 课程验收 | exit0，PASS8/WARN1/FAIL0，HTTP200/H1=1/H2=11/KaTeX0 | verify.log/json命令回执 |
| 两实际页面 | 全部运行、4工况、边界/恢复、真实ID/TOC、SVG、375px、无pageerror | browser-native/pages.json及截图 |
| 目录/学期 | exit0，PASS21/WARN2/FAIL0；学期PASS | final-check.log、final-semester.log |
| Python策略 | exit0，105课、437enabled、12codeOnly | python-policy.log |
| 术语/公式 | exit0，术语PASS3/WARN3/FAIL0；公式files0/tokens0 | final-glossary.log、final-math.log |
| 证据交叉核验 | pass=true，sourceHash/原始cell/数值/两页一致 | validation.log |

生产与Pages实际构建基线为build-base.txt所记c1af10c加本课；最终目录、策略和进度门槛基线为5e67d2d加本课，后来并行回执以最新HEAD保留。仅元数据标记从draft改为v1.3不改正文/计算/页面，若HEAD推进则重新叠加本课差异，不回退其它课。

资源回收见resources-closed.json：自己的3个Python服务停止；8994上12个遗留Notebook内核先DELETE回收，最终原生与Pages预览由对应Popen进程关闭。共享Git索引的他人内容保留，不批量git add/reset/clean。

真实交付提交：`56344abe4733ae622a29ab94728ab9895159176b`，已进入master。共享Git索引保留，本课使用私有索引与master旧值比较后原子更新；回执补充最终检查输出。
