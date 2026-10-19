# 网页Python字体统一发布

2026-10-19用户明确要求统一为初始化代码字体并推送GitHub Pages。修复master：391158304043d57e3c6d67a2f6f4a54ccee07f19；gh-pages发布提交：35464555d8263829b5daca2d3ce65541c323fa24；通过普通no-ff合并、正常推送，无强推。

只改BrowserNotebook显示样式；初始化pre、全部编辑cell、文字及错误输出使用同一既有等宽字体组合。未改课程代码/Python策略/worker，四处本地端口和用户proofreading排除提交。本地构建与真实DOM证据见.agent/semester-03/python-code-font/acceptance.md。运行源码树content/components/lib/public/scripts/.github与master一致（git diff退出0）。

[Actions 39179906899](https://github.com/fanqing-zeng/control-universe/actions/runs/39179906899)的build/deploy均success。公网release.json匹配发布SHA且sourceDirty=false。

| 公网实际验收 | 结果 |
|---|---|
| node scripts/verify-public-pages.mjs 35464555d8263829b5daca2d3ce65541c323fa24 docs/deployment/python-code-font-public-http.json | exit0；205课/9旧入口/235请求全部通过，未知页404 |
| 采样与量化实际DOM字体 | 六初始化pre、七textarea、一个运行输出pre，共14元素font-family完全一致，等于修改前初始化字体；public-browser.json |
| 实际全部运行按钮抽测 | 实验1运行完成、输出与原数值一致，控制台error0/KaTeX0；public-browser.json |
| 目检与联合校验 | 初始化代码/编辑框/输出字体一致；python-code-font-public.png；node .agent/semester-03/python-code-font/validate-public.mjs exit0，public-validation.json pass=true |

所有BrowserNotebook共享本次样式，未修改课程或Python执行链；不把单实验抽测声称为全站数值重跑。源码提交已进入master并推送，gh-pages已发布；本回执仅文档追记至master，不再次部署。四处本地端口和用户批阅保持原状。fix-070归档，DEP13更新全局checklist。
