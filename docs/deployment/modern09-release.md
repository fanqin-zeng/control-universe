# 现代控制章现有成果发布回执

用户明确要求“把已有的东西更新到github pages”，授权发布当前已验收 master `556fe037b709e5756d021546ee2feaabb09e1d7f`。相对上次 MODERN-01 发布，本次包含 MODERN-02 至 MODERN-09 及其配套修复、讨论日志和交付记录。

发布分支 gh-pages 以 no-ff 合并，提交 `9c8e988cd6cd10c1066c479f57799c76ef2514a4`，已推送 origin/gh-pages。GitHub Actions [39114400706](https://github.com/fanqing-zeng/control-universe/actions/runs/39114400706) 的 build/deploy 均 success；线上 release.json 的 sourceCommit 与之完全一致，sourceDirty=false。

站点：[控制宇宙](https://fanqing-zeng.github.io/control-universe/)。案例页：[现代控制案例](https://fanqing-zeng.github.io/control-universe/modern/modern-case-study/)。

验收：npm run check 退出0（PASS21/WARN2/FAIL0）；Pages/路由测试12/12；node scripts/check-semester03.mjs 退出0。CI另执行数学围栏、浏览器Python/降级策略测试和完整 build:pages，均成功。

公网 HTTP 脚本退出0：235次成功请求覆盖205课程、9旧入口及资源，缺失地址返回404；逐页核对H2、KaTeX和Python实验发布模式/worker指纹。浏览器检查案例页12个H2、6个运行入口、图片、公式错误0、交互端点/恢复。课程内观测器实验运行完成；公网审计页另完整执行该课6个实验/11单元格，全部通过，sourceHash/workerHash与当前策略一致。手机clientWidth=375、scrollWidth=375，目录能打开。此次公网Python复跑范围为案例课，其余课程沿用各课已固化的本地验收，未声称本次重跑全站Python。

证据：modern09-public-actions.json、modern09-public-http.json、modern09-public-browser.json、modern09-public-python.json、modern09-public-validation.json及页面/手机截图；聚合验证命令 node docs/deployment/modern09-public-check.mjs。全局 checklist 登记 DEP08。批阅文件的用户未提交修改未纳入发布或回执。回执只提交master，不因回执再次触发部署。
