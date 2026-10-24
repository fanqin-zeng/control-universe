# 控制实现章授权发布记录

2026-10-24，用户明确要求“将这些内容推送到github pages”。固定批准的master版本f5ad14ced9cc54f66760eb4cb14ed51fcff0b1e4，不自动纳入之后的并行开发。

独立发布工作树从origin/gh-pages de6069b43eb22902f4099c88e2aae48ba587ca9c建立，正常无冲突合入批准版本，生成4acd64ae008bd18555caefeb8e937a379dce6fa8并推送gh-pages。合并后的文件树与批准master相同，无强推，未切换主工作区或使用其默认索引暂存。

本地验收：npm run check退出0（PASS21/WARN2/FAIL0），14项Pages/路由/Python测试通过，npm run build:pages退出0；205课程、9旧入口及静态资源校验通过。out/release.json的sourceCommit为4acd64ae008bd18555caefeb8e937a379dce6fa8，sourceDirty=false。

证据位于.agent/semester-03/impl-10/pages-release-*.log、pages-release-candidate.json及pages-local-release.json。两项WARN为既有跨章motion-planning重名及存量正文缺日志。

发布运行：https://github.com/fanqin-zeng/control-universe/actions/runs/40084855966 。GitHub Pages API当前返回的正式地址为https://fanqin-zeng.github.io/control-universe/；旧文档中的fanqing-zeng为迁移前地址。

远端Actions构建、部署均success，实际公网release.json的sourceCommit=4acd64ae008bd18555caefeb8e937a379dce6fa8且sourceDirty=false。全站205课程、9旧入口、235次请求通过，不存在的地址404；课程H2、KaTeX、Python支持模式、CSS及字体检查通过。详见impl10-release-http.json及.agent/semester-03/impl-10/pages-actions*.json。

IMPL-09与IMPL-10共6组原始Notebook、12个单元格公网实跑通过，源码哈希与本地交付相同，输出逐数对账。IMPL-10正式课程页另运行3组/6cell，四图片、双图和输出齐全；故障drop的15无效/13降级及恢复默认实测通过，控制台无错误。公网未重新运行其它课程全部实验，235请求是页面/资源检查，不冒称全站所有Python已执行。证据见pages-public-impl09-python.json、pages-public-impl10-python.json、pages-public-dom.json、pages-public-controls.json、pages-public-validation.json和pages-public.png。

本次发布回执记入master，不自动再次同步gh-pages。主工作区与其它会话改动保留。
