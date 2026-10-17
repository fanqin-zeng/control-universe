# 首次 GitHub Pages 发布

2026-10-17；用户明确批准 master 提交 `237b6ff725e5a80b2520becca395013d733ffa8c`。

- 发布分支：`gh-pages`，通过 `git merge --no-ff 237b6ff` 得到 `1100137399bf9e0defa03e939c965aa107a06cdf`，`git push -u origin gh-pages` 退出码 0。
- 站点：https://fanqing-zeng.github.io/control-universe/
- Actions：https://github.com/fanqing-zeng/control-universe/actions/runs/39021769319
- GitHub REST 创建 Pages：HTTP 201，`build_type=workflow`。
- `github-pages` 环境启用 custom branch policies，仅允许 `gh-pages`；删除自动生成的 `master` 许可返回 HTTP 204。没有新增外部访问者或凭据。

## 验收

全部通过，DEP02 可完成。Actions 在 2026-10-17 09:40:27 UTC（北京时间 17:40:27）完成，build/deploy 均为 success；原始状态见 [first-release-actions.json](first-release-actions.json)。

| 验收 | 实际结果 | 证据 |
|---|---|---|
| 云端 npm ci / check / 10 项回归测试 / build:pages / artifact / deploy | 各步骤 success | first-release-actions.json |
| `node scripts/verify-public-pages.mjs 1100137399bf9e0defa03e939c965aa107a06cdf` | 退出码 0；235 次成功请求，205 课/9 旧入口均 200；另测未知路径 404 | first-release-http.json |
| 线上版本 | sourceCommit=1100137…，sourceDirty=false，basePath=/control-universe，pythonExecution=false | 同上 release 字段 |
| 页面结构/资源 | 所有有正文课程的 H2 数与 catalog 对齐、无 katex-error；首页 JS/CSS、KaTeX CSS/woff2 字体、PNG 图片 200 | 同上逐 URL 记录 |
| 浏览器 | 首页进入微积分；演示时间 0→0.05 s、速度 0→0.10 m/s；h 从 0.50→0.55，差商 4.5000→4.5500；站内进入复数课，实部 3→3.1，模变为 5.0606；控制台 error/warn=0 | first-release-browser.json；first-release-home.png；first-release-calculus.png |
| Python 展示边界 | 公网显示明确本地执行提示和代码，不显示 Python 运行按钮；执行限制与已通过的静态组件测试一致 | first-release-browser.json |
| 旧地址真实跳转 | modern/kalman-filter → estimation/kalman-filter；?from=legacy 与有效中文锚点均保留 | first-release-browser.json |
| `npm run check` | 退出码 0，PASS21/WARN2/FAIL0；两项存量 WARN 未变化 | first-release-check.log |
| `node scripts/check-semester03.mjs` | 退出码 0，23 任务/20 完成，课程仍 2/205 | first-release-checklist.log |

浏览器验收是从外部 HTTPS 站点访问，不依赖本地 8080/8891。静态站仍如实展示未编写课程占位。两份用户 proofreading 文件未纳入发布记录提交。

## 后续发布约定

本记录、验收脚本与 checklist 的提交属于 master 上的发布记录更新；不自动同步到 gh-pages。以后每个上线版本仍需用户明确同意，再合入并推送 gh-pages。
