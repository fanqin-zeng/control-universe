# ML-05 时序模型：验收与交付

2026-10-24，rank2；唯一课程 machine-learning/sequence-models。新写，Phase1合同先于正文，阶段讨论见 docs/discuss-log/semester-03/08-machine-learning/05-sequence-models.md。

## 范围与并行隔离

用户明确指定ML-05，暂缓IMPL-05至10，保留其他会话工作。先修ML-04与随机过程已交付。本课十H2、循环展开SVG、SequenceModelsExplorer、两Notebook四cell、四题及答案。门控机制只作介绍；未训练完整GRU/LSTM，也不宣称模型或闭环性能排名。

独立完整git archive快照：D:/Workspace/control-universe-rank2-ml05；预览端口8214，严格内核8992。project.py只叠加本课文件与共享元数据中的本课字段。开工共享工作区check有6项FAIL，另有RL-02表格在制列数问题，原始start日志保留；不改他课解决。隔离投影catalog检查PASS21/WARN2/FAIL0。共享正常索引及他人可能持有的index.lock不接管，交付使用独立索引与HEAD比较交换。

## 数值与运行证据

- reconcile.mjs实际调用lib/sequence-models.ts的循环反向；reference.py用Fraction闭式多项式及解析导数独立仲裁，不复制循环反向算法。
- 288配置，12392数值，最大绝对误差7.450580596923828e-9，逐量容差1e-10+1e-12*abs(ref)通过；大绝对误差来自大数。5952绘图原值，范围[-1,1475.8918800354004]；显示采用有符号log10(1+abs(value))，原值读数不变。
- 默认h=[0,1,.5,.25,.125]，L=.0078125，完整梯度.09375，K2截断.0625；末两步错误重置得到0。一次学习率.1更新a=.490625。
- CPython原始setup/cells、严格本机kernel与真实Pyodide均执行2Notebook/4cell，error0。reference.json、raw-python.json、native.json、nb-strict.json、pyodide.json均持久保存。
- 源文件归一化LF的SHA256：e9cd0dff58d5dbf76f6983fa5933ece460afa9462d78656804396695a1b2dcb0。

## 交付状态

已完成Phase1–4与所有适用验收。实际页面10个H2/目录ID一致，重复ID/缺锚点/KaTeX错误0；两实验运行完成，310输出数值与独立参考一致（最大差6.66e-16），35控件读数通过；375px下scrollWidth360、canvas295、SVG328，控制台error/warn0。desktop.png与mobile-chart.png为实际截图。

普通build与build:pages均exit0，后者pass:true、205课/9旧路由。精确构建基线efa51818be8f52c0533c3e91962e18cb6fc2f7d9+ML-05；其它会话EST-04提交后，最终目录/学期检查投影至3511708f0c6d046f7277c51a6e532de1855813d5+ML-05，均exit0，本课源码不变。目录PASS21/WARN2/FAIL0；既有motion-planning重名、11旧MDX缺日志WARN保留。glossary PASS3/WARN3/FAIL0；数学围栏违规0。不是最新整仓重新构建的声明。

精确命令/退出码见gates.json；原始日志build.log/build-pages.log/final-check.log/final-semester.log/verify.log/glossary.log/math.log与本课nb-strict.json、reconcile.log、validation.log对应。真实提交后登记hash；尚未发布Pages。

本地预览：http://127.0.0.1:8214/control-universe/machine-learning/sequence-models/ 。下一课ML-06未开工。

既有W09原生浏览器跨端口连接、W16冷加载、QA01旧负向测试、QA02旧隔离样式审计不在本课修复范围；本课原始严格kernel与实际静态浏览器分别验收。


最终源码投影更新：IMPL-05入master后在ae222132ba6b5a6deca0b91d7467a4cfd1c2d2c9+ML-05重跑catalog，PASS21/WARN2/FAIL0、exit0；其回执5413ca168ac86c41b3974375ae7f355022f7841e仅变更过程文档，metadata-fast-forward.json记录全部路径，本课源码和已通过的catalog树不变，学期守卫另重跑。普通与Pages构建仍诚实标记原精确基线。
