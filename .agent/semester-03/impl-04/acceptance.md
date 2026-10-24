# IMPL-04 控制器部署验收

本课新写，rank1。Phase1–4完成并签发；真实master提交回执见下。Phase1合同和阶段日志见docs/discuss-log/semester-03/07-implementation/04-controller-discretization-practice.md。

独立目录D:/Workspace/control-universe-rank1-impl04-validation，独立.next/out及Git索引，避开共享构建与暂存。计划使用8991验证内核、8191原生页、9193本地静态页，均先检查监听；9190/9191/9192既有预览不动。仅交付本课，不发布gh-pages。

共享工作区基线检查原始输出为baseline-check.log、baseline-semester.log。最终交付从最新已提交HEAD加本课改动构造独立快照，再运行原始目录与学期/Python策略门槛，避免把并行会话草稿写入本课提交。

正文LF SHA256：`4623dc2c4146ff57fe41ef88dbf9d752c1f9bbf8d6487447a75c0c1ba211a486`。独立TS/精确有理数与整数/SciPy核验36配置、14976数值，最大误差2.220446049250313e-15；原始内核108项、实际页面/表格207项核对。A.1共64行，完整原始数据及三幅图见本目录JSON。

命令/退出码：npm run build=0；npm run build:pages=0（205课/9旧路由）；npm run verify -- implementation/controller-discretization-practice=0（WIKI_VERIFY_PORT=8191）；node scripts/nb-cells.mjs verify implementation/controller-discretization-practice --require-kernel --port8991=0（6cell/error0）；node scripts/verify-controller-deployment.mjs=0；npm run math:check=0；npm run glossary:check=0；node scripts/check-python-support.mjs=0；node .agent/semester-03/impl-04/validate.mjs=0；阶段2学期检查errors=[]。原始stdout按同名log保留。

原生与Pages UI均执行3实验6cell，Pyodide报告同源码哈希3/3放行。H1=1/H2=9，katex/重复ID/死锚点/静态console错误均0，SVG路径包含/control-universe；两种375px夹具文档宽360/滚动360、图331。初稿注册导入路径错误已在Phase2修复并经浏览器/构建复核。

构建基线与最终提交父提交分别见build-origin.json/snapshot.json；后续并行课程不由本课重新签发，提交时基于最新HEAD重跑目录/学期/Python策略。预览http://127.0.0.1:9193/control-universe/implementation/controller-discretization-practice/；8991内核及8191原生服务器已释放，保留9193静态预览。未执行板上/硬件在环，未发布gh-pages。

真实master交付提交：`a142af0658eb2a6508548446988fa896b6b46956`，父提交`5aaa266e8595079b670437ef26df87298e83ca12`。采用独立索引与预期父提交原子更新master，未改写共享默认索引。最终原始catalog CLI：PASS21/WARN2/FAIL0，学期完整校验errors=[]，Python策略检查pass。两项WARN为既有跨章motion-planning重名及存量正文缺日志，未新增本课死锚点。本课进入master列在提交存在后据实回填，未发布Pages。
