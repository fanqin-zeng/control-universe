# 经典控制章交付后的 Pages 发布

2026-10-18，用户要求“把已有的东西更新到github pages”，授权发布当时master `bbab75b`。将该提交以--no-ff合入gh-pages得到 `0dad5f04b701f443752e10529720e07bcb46b918`，git push origin gh-pages退出0，未强推。用户两份未提交proofreading文件不在提交中。

本轮覆盖CLASSIC-01–CLASSIC-11全部已验收成果；数学18课仍保留。课程总数205、v1.3交付48；Python清单73课/325实验/498cell，298可运行/27保留代码。逐课数值与本地页面验收见.agent/semester-03/classic-01到classic-11/acceptance.md；最新版本check21PASS/2已知WARN/0FAIL、普通及Pages构建/六原始内核和Pyodide实验均通过。发布不代表未交付课程或W06–09/27Python待办清零。

GitHub Actions：[39097917426](https://github.com/fanqing-zeng/control-universe/actions/runs/39097917426) 的 build、deploy 均成功，线上 release.json 的源码提交与发布提交一致，sourceDirty=false。

| 验收 | 实测结果 | 证据 |
|---|---|---|
| Actions | 构建、部署成功 | [actions](classic11-public-actions.json) |
| 全站 HTTP | 205 课程页、9 旧入口、235 成功请求；不存在的地址返回 404 | [数据](classic11-public-http.json)、[日志](classic11-public-http.log) |
| 公网页面 | 案例课 12 个 H2、47 个旧锚点、16 个居中公式、KaTeX 错误 0；组件默认值、临界阻尼与重置正常 | [浏览器数据](classic11-public-browser.json) |
| 浏览器 Python | 案例课六份原始实验、选型课三份原始实验全部通过，源码指纹匹配清单；课程页内负载与限幅实验输出曲线 | [案例课](classic11-public-python.json)、[选型课](classic10-public-python.json) |
| 回归与窄屏 | 传递函数与微积分正文颜色正常；首页经典控制 11/11；390px 下正文无横向溢出；课程警告/错误日志为空 | [页面](classic11-public-page.png)、[曲线](classic11-public-plot.png)、[窄屏](classic11-public-narrow.png) |
| 证据交叉校验 | 发布版本、请求数、锚点、数值、实验指纹与窄屏断言全部通过 | [脚本](classic11-public-check.mjs)、[结果](classic11-public-validation.json)、[日志](classic11-public-validation.log) |

公网地址：[控制宇宙](https://fanqing-zeng.github.io/control-universe/)。本轮仅对上述九份原始实验进行了公网实际运行，全站 HTTP 验收不等于其余实验全部重新运行。

发布回执与全局 checklist 仅合入 master，避免为记录变更再触发部署；gh-pages 保持上述已验收版本。后续内容更新仍需逐次获得用户发布授权。
