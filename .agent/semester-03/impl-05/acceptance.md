# IMPL-05 嵌入式控制验收

新写单课，rank1；Phase1–4完成并签发，真实master提交回执见下。设计合同见docs/discuss-log/semester-03/07-implementation/05-embedded-implementation.md。

源正文不存在；旧tracker“接收量化部分”经审计为历史提示，当前采样与量化课已保留该材料。本课重新设计ADC端点标定、PWM抽象时隙与样本交接，不删除、搬迁或复用旧正文。

隔离目录D:/Workspace/control-universe-rank1-impl05-validation；独立.next/out及Git索引，不将并行草稿带入提交。使用端口前检查监听。计划原生8191、内核8991、本地Pages预览9194；不发布gh-pages。基线原始输出见baseline-check.log/baseline-semester.log。

正文LF SHA256：`d0d62e83fee35976aa0cacafb7327c13d1c546b3cbaec66bba8cf3841819e97a`。9个H2、3Notebook/6cell、1Explorer、1SVG、4题及答案。独立Decimal55位与实际TS27配置/19308数值，最大绝对差8.526512829121202e-14；含原始内核总19490数值、正文表/实际UI463项核验；A.1共65行。

命令/退出码：npm run build=0；npm run build:pages=0；WIKI_VERIFY_PORT=8191 npm run verify -- implementation/embedded-implementation=0；node scripts/nb-cells.mjs verify implementation/embedded-implementation --require-kernel --port8991=0（6cell/error0）；node scripts/verify-embedded-control.mjs=0；node .agent/semester-03/impl-05/validate.mjs=0；npm run math:check=0；npm run glossary:check=0；check-python-support=0。原始日志均在本目录。

实际原生UI、Pyodide审计与Pages UI分别执行完整3实验6cell；各UI有三幅真实图输出。H1=1/H2=9、katex/重复ID/死锚点/静态console错误均0。PostCSS实际配置含于快照，LF/CRLF等价已核、构建时字节一致；编译CSS与DOM证据见css-verification.json。桌面正文656.67px，375px夹具文档360/360、图299、表容器328/表496.85。

共享基线有并行草稿造成catalog FAIL6及semester RL-02暂时列数错误，原始输出保留；最终使用最新HEAD+本课合成元数据运行原始校验，不改或签发他课。构建基线见build-origin.json，交付基线以snapshot.json为准；两者差异仅归于并行其它课程，不冒称本课已重建后来版本。

预览：http://127.0.0.1:9194/control-universe/implementation/embedded-implementation/ 。保留9194本地静态预览，8191/8991及私有目录检查进程在任务后释放；不发布gh-pages。主机接口模型可复算；目标编译器、芯片驱动、板上时序与HIL均未执行。

真实master交付提交：`ae222132ba6b5a6deca0b91d7467a4cfd1c2d2c9`，父提交`3511708f0c6d046f7277c51a6e532de1855813d5`。采用独立索引与预期父提交原子更新master，未改写共享默认索引。最终原始catalog CLI：PASS21/WARN2/FAIL0，学期完整校验errors=[]，Python策略检查pass。两项WARN为既有跨章motion-planning重名及存量正文缺日志，未新增本课死锚点。本课进入master列在提交存在后据实回填，未发布Pages。
