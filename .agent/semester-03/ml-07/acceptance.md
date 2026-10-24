# ML-07 表征学习：验收与交付

2026-10-24，rank2；唯一目标machine-learning/representation-learning。先修ML-04/06已交付，暂缓并行实现课IMPL-06至10。按新写技能先落Phase1合同，再最小实验、正文与三轮反馈。

十H2、一编码器SVG、一RepresentationBasicsExplorer、两Notebook四cell、四题及答案。实际学习受限线性PCA编码器、训练冻结线性探针、验证选择七方向；只计算单正单负对比损失，不声称训练完整视觉网络或SimCLR。

## 并行隔离与数值

完整archive副本D:/Workspace/control-universe-rank2-ml07；预览8232，严格kernel8992由本会话启动。project.py只叠加本课代码、证据和共享元数据中本课字段；正常共享索引及他人锁不接管，不宣称全工作区干净。开工共享检查输出保留start-check.log/start-semester.log，交付门槛另在完整提交快照加本课执行。

reconcile.mjs实际调用lib/representation-basics.ts的中心化、闭式PCA与标量最小二乘；reference.py用NumPy eigh、矩阵正交投影及lstsq独立仲裁，对比损失用Decimal70位直接指数公式。18组A/B/标准化配置、126候选探针另加18PCA探针、5个额外PCA输入（旋转/平移/零）、27组对比参数，7795量最大差3.552713678800501e-15<1e-10；1872绘图坐标均在固定轴范围内。分类|score|≤1e-12按零归+1，消除对称点舍入判类不一致。

默认PCA重构.125、验证准确率.5；七角验证选择90度，重构2、验证MSE.0625/准确率1、测试MSE.25/准确率1。只在选择后固定模型并翻转测试传感坐标x2，真实标签不变，选定模型MSE6.25/准确率0，PCA仍MSE1/准确率.5。此为学生反馈触发的接口失败审计，未用于选参。标准化/等方差重根明确不唯一，第一轴只作重复性约定。

CPython原始setup/cells、严格native kernel、实际Pyodide全部2Notebook/4cell无error。原始证据reference.json/ts-cases.json/raw-python.json/native.json/nb-strict.json/nb-strict.log/pyodide.json；源文件LF归一化SHA256为ebbad188d4d6039ce6612b1847f27d5d2fac9a3b6e3450c9720d45d77b5234d9。

## 当前检查点

Phase1–4已完成。最终两实验运行完成，378浏览器数值max2.220446049250313e-16、42控件读数在5.1e-9显示公差内；十H2顺序/ID与catalog一致，重复ID/缺目标/KaTeX0，控制台error/warn0。375px下scroll360、canvas294×294、SVG328；桌面canvas480×480，图形单位比例一致。desktop.png/mobile-chart.png为最终实际截图。

手机末端刻度拥挤修为固定间隔1.5、方向线置于标记下层，同类颜色一致；修改后重跑普通build与build:pages，均exit0，Pages pass:true、205课/9旧路由。精确源码基线19ce1c403883ab1a1573259e806118477448f146+ML-07；最终目录/台账若随并行HEAD更新，单独记录，不冒称最新整仓重建。原始算法和MDX指纹不变。

verify-pages.mjs仅用OS分配空闲端口适配/control-universe前缀，不重写HTML或状态，执行未修改verify-lesson，HTTP200/渲染无SKIPPED、exit0；真实浏览器另外独立核验。catalog.log PASS21/WARN2/FAIL0；glossary PASS4/WARN2/FAIL0；math围栏违规0。本课未修改公共检查脚本或术语门槛。

控件再次采集时旧闭包写入旧数组，严格验证发现空controls文件并失败；原输出validation-before-controls.log保留，重建采集函数后重复六组真实操作再通过，未放宽判据。最终命令和退出码见gates.json及原始日志。

本地预览：http://127.0.0.1:8232/control-universe/machine-learning/representation-learning/ 。最终台账守卫/真实master回执接续登记，ML-08未开工、未发布Pages。

W09原生浏览器跨端口连接、W16冷加载、QA01旧负向套件、QA02旧隔离样式审计保留既有范围；本课严格原生与最终静态Pyodide分别验证。


首次定稿目录与本期守卫基线：13e128c903580cd997e460240ff7a05726cdf305+ML-07（含并行ID-06已交付源码）；npm run check exit0（PASS21/WARN2/FAIL0），check-semester03 exit0/PASS，final-glossary/final-math均exit0。本课MDX/算法/最终图形源码与19ce1c4构建投影相同，其它新课程源码未冒称已在本课再次构建；各精确基线见gates.json。定稿归档发现P2角色显式记录缺项，实际返回第三轮补核并复核Phase3，过程透明写入日志，内容与数值不变。真实master hash提交后另登记。


最终提交基线：并行IMPL-07源码与回执进入master后，HEAD保护阻止旧投影提交；完整刷新到12e6c037ae36379dd401c4b85513284409e706c7+ML-07，保留所有已提交并行成果，再跑check（PASS21/WARN2/FAIL0）、semester、glossary（PASS4/WARN2/FAIL0）、math，均exit0。concurrent-refresh.json记录变更范围与本课源码指纹；本课算法/MDX/最终图形源码不变，生产构建仍按19ce1c4精确基线记录。


真实交付提交已进入master并推送origin：`ca233d4adad1ba7956039bec8e1227aab699722c`。使用独立索引、明确路径及HEAD比较交换，正常共享索引未重置；未宣称全工作区干净，不发布Pages。回执追加提交只登记本课实际hash、完成勾选与交付后守卫。


交付后回执守卫：以ca233d4完整已提交树加本课真实hash勾选运行check-semester03，receipt-semester.log exit0/PASS；验证交付hash确已进入master。正文/算法/图形与先前通过的数值、构建及页面证据不变。下一课ML-08未开工。
