# ML-06 注意力机制：验收与交付

2026-10-24，rank2；唯一目标machine-learning/attention-transformers。用户明确指定ML-06前，已完成ML-05交付d40982a与回执补核fc2b246。先修时序模型已交付；暂缓并行的IMPL-06至10。

设计合同先于正文，日志docs/discuss-log/semester-03/08-machine-learning/06-attention-transformers.md。十H2、一SVG、AttentionBasicsExplorer、两Notebook四cell、四题及答案。只实现给定Q/K/V的缩放点积算子；未训练完整Transformer，未比较RNN性能，不把权重当因果解释。

## 隔离与数值

完整archive独立副本D:/Workspace/control-universe-rank2-ml06，预览8216，严格kernel8992沿用本会话拥有的进程。project.py只叠加本课代码、证据与共享元数据的本课字段；不接管其它端口、正常共享索引或他人锁。共享开工检查原始输出见start日志；隔离目录统计另验收。

reconcile.mjs实际调用lib/attention-basics.ts的循环实现，reference.py用70位Decimal直接指数归一化的矩阵公式独立仲裁。18配置、431数值，最大差1.7763568394002505e-15，小于1e-11；162个绘图权重及行和、因果零权重、输出凸包、前缀未来扰动不变、末行两掩码持平均通过。额外验证稳定softmax平移、全屏蔽拒绝、非有限输入/错误形状/非正温度拒绝、key padding、联合排列与位置绑定。

CPython原始setup/cells、严格native kernel与实际Pyodide均完成2Notebook/4cell，error0。reference.json、raw-python.json、native.json、nb-strict.json/nb-strict.log、pyodide.json为原始证据。

源文件归一化LF的SHA256：c80dc2a1939d15b6281a830a3ee24c02ccf86393c2c0b1bf32e1a05816eb6416。

## 当前检查点

Phase1–4已完成；最终真实DOM十H2顺序/ID与catalog一致，重复ID/缺锚点/KaTeX错误0。两个页面实验运行完成，96浏览器数值最大误差8.881784197001252e-16、30控件读数在5.1e-9显示公差内。375px下scroll360/canvas295/SVG328，控制台error/warn0。desktop.png/mobile-chart.png为实际截图。

普通build与build:pages均exit0，Pages pass:true、205课/9旧路由，精确构建基线见gates.json。初次首屏verify探测超时SKIPPED不算验收；最终verify-pages.mjs以OS分配空闲临时端口只适配/control-universe前缀，不重写HTML/status，执行未改动verify-lesson，HTTP200、渲染无SKIPPED、exit0；实际浏览器另验证。无公共脚本改动。

初次目录发现本课Transformer大写slug，修为真实小写ID后重建，catalog-after-anchor.log PASS21/WARN2/FAIL0；WARN为既有motion-planning重名与10旧MDX缺日志。glossary PASS3/WARN3/FAIL0；math违规0。最终台账守卫与真实master回执接续记录，未预填hash。ML-07未开工、未发布Pages。

本地预览：http://127.0.0.1:8216/control-universe/machine-learning/attention-transformers/ 。全部命令与退出码见gates.json及同目录原始日志。

W09原生浏览器跨端口连接、W16冷加载、QA01旧负向套件与QA02旧样式隔离审计保留原责任范围；本课用严格原生及最终静态Pyodide分别验证。


最终签发后门槛：完整投影基线e6fc2b873fa389522af63a56309c000559e1cd1b+ML-06，npm run check exit0（PASS21/WARN2/FAIL0），node scripts/check-semester03.mjs exit0/PASS；与普通/Pages构建相同源码基线。本课字段外的并行改动不进入暂存；正常共享索引与他人锁不接管，不宣称工作区干净。真实master提交后另登记。
