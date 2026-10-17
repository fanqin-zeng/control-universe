# 数学章完整交付后的 Pages 发布

2026-10-18，用户明确要求“把已有的东西更新到github pages”，授权发布当前master `98492e1`。按既有发布约定，将该提交以`--no-ff`合入gh-pages，发布提交`f01e0bbb52308a9cf277f1f2ff65b377c7e73cac`，`git push origin gh-pages`退出0，未强推。

覆盖截至MATH-18的已验收成果：数学章18课，47门v1.3课程；兼容清单69课/285Notebook/458cell、255实验启用/30代码展示。源码分支由Actions构建out并部署，运行方式仍为浏览器Pyodide；不兼容实验保留明确说明。

发布前本地证据沿用本次刚完成的 `.agent/semester-03/math-18/acceptance.md`：最终check PASS21/WARN2/FAIL0、build/build:pages/tsc退出0、页面9PASS、七原始内核与Pyodide实验、45组独立数值对照。用户两份proofreading未纳入提交。此次发布不关闭W06/W07/W08或全站收官R01。

GitHub Actions：[39071925396](https://github.com/fanqing-zeng/control-universe/actions/runs/39071925396)。build/deploy均已success，见math18-public-actions.json。


## 公网验收

| 项目 | 实际结果 | 版本化证据 |
|---|---|---|
| 云端安装/全局check/公式围栏/14项回归/静态构建/上传/部署 | Actions全部success，head_sha为f01e0bb… | math18-public-actions.json |
| `node scripts/verify-public-pages.mjs f01e0bbb52308a9cf277f1f2ff65b377c7e73cac docs/deployment/math18-public-http.json` | 退出0，235次成功请求，205课/9旧入口200，未知入口404；首页JS/CSS、KaTeX字体、PNG可达；有正文页H2与catalog相同、KaTeX错误0，全部实验运行/降级标签与政策一致 | math18-public-http.json |
| release.json版本 | sourceCommit=f01e0bbb52308a9cf277f1f2ff65b377c7e73cac，sourceDirty=false，browser-verified-notebooks，Pyodide0.27.7 | 同上release字段 |
| 公网浏览器首页/最新课 | 首页数学18课/已交付18；站内进入数值方法，14H2、4display居中auto、7Notebook；默认/振荡边界/无冷却/恢复读数正确 | math18-public-browser.json |
| 公网Python原始实验 | 专用验收页原始7setup/cell全部通过，sourceHash与本地最终MDX一致；页面六题答案另一次实际运行完成，无本地8891依赖 | math18-public-python.json；math18-public-browser.json |
| 旧课字体回归 | 传递函数白底深色正文/标题/粗体，KaTeX错误0；最新课与旧课控制台warn/error均空 | math18-public-browser.json |
| 视觉 | 公网最新课开篇及双图人工查看清晰，与本地验收一致 | math18-public-page.png |

浏览器验收中的summary元素通过原生role定位未匹配，改用已观察的summary元素展开后保存JSON；此定位尝试不计作失败实验，七原始实验完整成功。部署前短暂看到首页旧数学3课，部署后重新加载确认18课，并核对release.json的准确版本，不拿缓存旧页宣称更新。

DEP05可完成；发布记录以工作分支合入master保存，不再为这份记录自动触发第二次发布。gh-pages保持f01e0bb，该提交已经包含用户授权时的master98492e1。未推送master、未暂存用户两份proofreading；下次站点内容更新仍需用户明确同意。本次发布不代表全站旧债清零。
