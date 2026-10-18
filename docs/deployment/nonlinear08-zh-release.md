# NONLINEAR-08与中文润色授权发布

授权：2026-10-18用户要求本课完成后，快速审核并合入润色分支，再将全部修改更新到GitHub Pages。本次范围包括现代控制后续既有成果、NONLINEAR-01–08及29课数学/经典控制润色；不是未来持续自动发布授权。

NONLINEAR-08交付932a40b、回执8745142；润色分支截至261e9ed经审核合入master，合并847d9a424c9adb65a8508af1cd0adbbcd4f85293。审核证据见.agent/semester-03/zh-lang-edit/merges/261e9ed/acceptance.md。

发布源master为`3d089d9271d7ec31485aa37c6284d19f531f45b2`，合入gh-pages得到`7c6bf5a9fde629d6fd2baf4b409e42964b69c368`并推送。GitHub Actions [39139983933](https://github.com/fanqing-zeng/control-universe/actions/runs/39139983933)构建与部署成功；公网release.json确认同一SHA、sourceDirty=false。

公网HTTP验收覆盖205课程、9旧入口及静态资源，共235请求通过；不存在的课程返回404。正文13个H2、10个浏览器Notebook、KaTeX错误0；交互默认值、参考切换、提前终止后的窗口不足提示、恢复默认均核对。375px手机视口的内容宽度与滚动宽度均为360px，无横向溢出。微积分入门与系统建模的润色段落及页内Python运行完成。原始证据为本目录`nonlinear08-zh-public-*`文件；完整实验运行结果和最终断言另见validation.json。

本地验收：29课页面PASS261/WARN0/FAIL0/SKIPPED0，180份Notebook（181个单元格）代码与原分支一致，普通与Pages生产构建退出0。课程数值对账及Phase1–4见`.agent/semester-03/nonlinear-08/acceptance.md`及讨论日志。全局check最终PASS21/WARN2/FAIL0，semester03与Python支持策略检查退出0。

用户proofreading改动不纳入提交；不重置、不强推长期润色或发布分支。25项Python依赖待办与W14数值敏感性边界保留。

最终公网完整Python验收：10组实验、39个单元格全部passed，complete=true，源指纹与支持清单一致。`node docs/deployment/nonlinear08-zh-public-check.mjs`退出0，validation.json为pass=true；检查Actions、发布SHA、235请求、课程结构、手机宽度、交互终止与重置、两课润色及Python样例、全部实验输出。第一次自动断言发现浏览器状态采集早于React更新，重新逐步操作并在状态更新后采集，真实界面确认0.940s触阈值、窗口不足及重置读数；未修改产品代码或放宽断言。DEP09据此勾选完成。
