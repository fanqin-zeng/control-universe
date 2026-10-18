# GitHub Pages 发布约定

2026-10-17。公网地址：https://fanqing-zeng.github.io/control-universe/ 。首次发布记录见 [first-release.md](first-release.md)。

## 分支与同意

- master：课程和基础设施的日常主干。推送master不部署。
- gh-pages：额外的长期**源码**发布分支，由GitHub Actions构建out/并上传Pages artifact；不把整份源码当静态文件发布。
- wp/*：按工作包开发，验收合入master。每次用户明确同意具体版本后，才允许把该版本反合到gh-pages，并推送gh-pages。
- 不自动合并、不按时间同步、不强推覆盖发布分支。用户没有同意时，连首次发布也停在具体可审阅版本。

首次授权：2026-10-17 用户明确同意发布 master 的 237b6ff；以 --no-ff 合入 gh-pages 得到 1100137399bf9e0defa03e939c965aa107a06cdf，已推送 origin/gh-pages。以后每次更新仍需用户明确同意具体版本。

## 静态站能力

正文、KaTeX、导航、旧地址和React/ECharts实验支持静态站。Pages不能托管服务端 Jupyter；通过逐课实跑的实验由 Pyodide 在读者浏览器运行，支持范围与待办见 [python-expansion.md](python-expansion.md)。不兼容实验显示原始setup与cell代码及具体原因，不请求读者的127.0.0.1:8891。本地npm run dev保持真实内核运行模式。课程数值验收仍使用本地严格内核，静态发布不代替课程质量门槛。

## 本地验收

1. 停止运行中的Next开发/生产服务，避免与build共享.next。
2. npm run check
3. node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs
4. npm run build:pages（含全部目录HTML、内部资源/根路径和旧入口验收）
5. npm run preview:pages，浏览 http://localhost:8081/control-universe/ ；这不是Next服务器，也没有Python执行代理。
6. 本地开发回归时使用npm run build与npm run verify -- math/calculus-basics math/complex-numbers，最终恢复npm run dev。

静态导出的out/仅包含可公开的站点资源，源码中的.agent、proofreading、Python运行时不被上传。out/release.json记录构建所用源码提交、basePath和时间；不记录任何凭据。build日志中的sourceCommit只表示构建时HEAD，未提交改动的本地试构建不代表已发布版本。

## 用户同意后的首次发布

确认用户同意的master提交及工作区后，执行：

```powershell
git checkout gh-pages
git merge --no-ff <用户同意的master提交> -m "release: approved wiki update"
git push -u origin gh-pages
git checkout master
```

在仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**（不是Deploy from a branch）。工作流位于.github/workflows/pages.yml，push触发只列gh-pages；手工dispatch也仅允许gh-pages。github-pages环境的Deployment branches应仅允许gh-pages；如账户支持环境Required reviewers，可再配置用户作为复核人。这里只写部署配置，不更改仓库公开性或额外授予第三方访问。

首次已通过 GitHub REST API 配置 build_type=workflow；github-pages 环境仅允许 gh-pages 分支。使用 Git 已保存的 GitHub 认证，凭据仅在进程内使用，未写入文件或输出。失败时先修工作包再申请发布新版本，不绕开同意流程。

发布成功后检查Actions对应SHA/部署URL，再实测公网首页、数学两课、旧URL/锚点、CSS/字体与交互；不能以本地build通过宣称公网已上线。以后版本回滚也只在用户同意后合入/revert发布分支并推送。

依据：
- https://nextjs.org/docs/14/app/building-your-application/deploying/static-exports
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

本地适配证据见 acceptance.md；首次远端部署、版本核验与公网截图见 first-release.md。


最新授权发布（2026-10-18）：用户要求将已有内容更新到Pages，master `98492e1`以`--no-ff`合入gh-pages得到`f01e0bbb52308a9cf277f1f2ff65b377c7e73cac`并推送。Actions成功，205课程/9旧入口/235成功请求及数学章18课公网、最新七Python实验通过。详见[数学章发布记录](math18-release.md)；后续仍逐次获同意再发布。
