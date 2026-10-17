# GitHub Pages适配验收

2026-10-17；工作包wp/pages-static，起点98bf9d3。用户要求仅在每次明确同意后，把更新反合到Pages服务分支。本次只完成基础设施与本地验收，未推送任何分支，未修改远端Pages设置，未执行公开发布。

## 结果

Pages模式按/control-universe子路径导出205个课程入口，9个旧入口由静态兼容页保留查询与片段，额外包含首页和404。逐页核H2数量和KaTeX，所有HTML根路径链接/资源指向实际导出文件；227645571字节，约217MiB。浏览器在无Next/Python代理的8081静态服务器上，实测首页、站内Next导航、数学课滑块、明确的Python静态代码视图和旧URL实际跳转。控制台error/warn为空。

本地原运行模式仍使用8080/8891，生产构建与数学两课实际页面、9个notebook/9cell真实内核均通过。课程MDX与数值未改写，本工作包不新增课程交付。

## 实际命令

| 命令/检查 | 退出码/结果 | 原始证据 |
|---|---|---|
| npm run build:pages | 0 | pages-build.log；完整静态导出与post-audit |
| node scripts/verify-pages.mjs | 0 | static-audit.json；205课程、9旧入口、全站内部链接/资源存在 |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs | 0，10/10 | tests.log；静态Notebook不发请求、代码转义、项目前缀、原始JSX、侧栏尾斜杠、发布分支限制、真实MDX故障上抛 |
| npm run build | 0 | local-build.log；正常服务器模式完整构建 |
| npm run verify -- math/calculus-basics math/complex-numbers | 0 | local-verify.log；本地两课页面各项通过 |
| node scripts/nb-cells.mjs verify math/calculus-basics math/complex-numbers --require-kernel --quiet --out docs/deployment/local-notebooks.json | 0，9cell/error0 | local-notebooks.log/json；没有SKIPPED |
| npm run check | 0，PASS21/WARN2/FAIL0 | check.log；原两项WARN仍登记待逐课处理 |
| node scripts/check-semester03.mjs | 0 | checklist.log；DEP01完成，DEP02待用户批准首次发布，课程仍2/205 |
| 纯静态浏览器验收 | 通过 | browser-results.json/pages-preview.png；6个静态Notebook、0运行按钮；交互正常，旧入口保留query/hash与有效锚点 |

## 拦截与修正

首次静态审计实际失败：raw JSX的img不经过MDX组件映射，/images路径漏项目名前缀。新增rehypeBasePath处理实际HTML属性和字面量JSX href/src，保留代码示例不改，并加编译回归样本；初次输出留pages-initial.log，最终审计不得跳过资源存在性。另修复trailingSlash下侧栏当前课识别，使用共用路径标准化；新增对应回归测试。

源码与生成物分开：gh-pages保存批准的源码；Actions仅上传out。未交付占位仍如实显示，不伪造课程状态；静态版不把代码展示或ECharts运行当Python执行成功。在线版不对读者电脑发内核请求，不配置公开执行任意Python的代理。正常本地模式真实内核功能保留。

## 分支与未完成事项

已建立本地gh-pages于98bf9d3（用户已推到远端的基线），但不把本次未批准更新放入该分支。基础设施验收后合入master，发布候选以最终提交为准；随后请求用户明确批准，再反合gh-pages并推送。远端Settings/Pages选择GitHub Actions、github-pages环境允许gh-pages、Actions成功和真实公网访问都属于DEP02，当前不打勾。

本机没有gh CLI；尚未要求用户登录或提供凭据，也没有臆测GitHub Pages已经启用。正式发布需使用已登录账户完成设置并实测线上URL。工作区两份用户proofreading修改不包含在本次提交。
