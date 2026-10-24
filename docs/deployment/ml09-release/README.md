# DEP17：机器学习 ML-01—09 授权发布

2026-10-24，用户在 ML-09 交付后要求“将这些内容推送到github pages”。本次固定批准的 master `9160c9b975f248f822f4a3d05bbfd0fabb23d015`，包含机器学习九课及该提交已有内容。之后并行会话的课程提交未自动纳入。

从远端 gh-pages `b6a37b164c06da306c40b34a165dfded768dd4fd` 在独立克隆目录正常 no-ff 合入批准版本，得到 `99945e1fd8f2abe94ed7db92e889d79223692979`。发布树与批准 master 完全相同，未回退已有发布，未强推。主工作区、共享索引和其他会话的端口均保留；临时预览使用独立端口 8242。

本地实际执行：`npm run check`、`node scripts/check-semester03.mjs`、`npm run math:check`、四组发布测试、`npm run build:pages` 和基于静态预览的 ML-09 单课验收，全部退出 0。目录检查 PASS21/WARN2/FAIL0，两项既有 WARN 为跨章 motion-planning 重名与历史课程缺讨论日志；未用发布任务消除它们。14 项测试全通过，静态构建校验 205 课程页、9 旧入口及资源。本地 release.json 精确匹配发布 SHA，sourceDirty=false。证据见 local-gates.json、对应日志、local-release.json、local-lesson.log。

[Actions 40085991078](https://github.com/fanqin-zeng/control-universe/actions/runs/40085991078) 的 build、deploy 均 success，head_sha 精确匹配发布版本。公网 [ML-09：学习实验评估](https://fanqin-zeng.github.io/control-universe/machine-learning/learning-evaluation/) 已上线；公网 release.json 的 sourceCommit=99945e1、sourceDirty=false。actions.json、actions-jobs.json 保存远端状态；Actions 查询仅在进程内使用 Git 已保存认证，未输出或保存凭据。

| 实际公网验收 | 结果与证据 |
|---|---|
| 全站 HTTP | 205 课程、9 旧入口，共 235 成功请求；CSS/JS/KaTeX 字体及资源正常，未知路由 404；public-http.json、public-http-final.log |
| 九课原始 Python | 18 Notebook / 35 cell 全部页内显示运行完成，每 cell 有输出，无 Traceback；public-courses.json/log/cjs |
| 标题、锚点与布局 | 九课 H1=1，H2 的文本和 ID 与批准源码渲染管线逐项相同，重复 ID/丢失锚点/KaTeX 错误均 0，图片加载完成，375px 无横向溢出；public-courses.json |
| 控制台与运行边界 | 九课 pageerror/console error 均 0，本地 loopback 请求 0；浏览器 Pyodide 实跑，无本地 Jupyter 依赖 |
| ML-09 数值 | 新课 2 Notebook / 4 cell 的 372 个数值与独立 Fraction 参考逐项比较，最大误差 2.220446049250313e-16；public-ml09-numeric.json、check-public-numeric.cjs |
| ML-09 控件 | 11 个配置状态与课程交付时的完整读数逐字相同，恢复默认通过；public-controls.json；public-ml09-mobile.png 已目视检查，图例、坐标与文字可读 |

首两次全站 HTTP 校验使用批准快照内仍指向旧 fanqing-zeng 域名的脚本，/release.json 返回 404；Node 在断言退出时还触发 Windows libuv 关闭断言。保留 public-http.log、public-http-retry.log；改用正式 fanqin-zeng 域名的等价校验脚本 public-http.mjs 后完整重跑通过。这是验收入口旧域名问题，未修改批准的课程源码，也未把失败当作已通过。

source-manifest.json 固化九课 LF 源码哈希、运行策略和 workerHash。ML-01—08 本次实际执行原始页内实验，但未重新开展其独立数学仲裁；本次数值逐项仲裁范围明确为 ML-09 的 372 个输出数值。全站 HTTP 不代表全站所有 Python 已重跑。日常构建和严格原生内核沿用本课既有验收，本次发布另完整重跑静态构建。

发布综合结论见 validation.json。DEP17 和本目录证据在 master 追加回执，不再触发 Pages；本次获准快照之后的并行课程提交继续留在 master。
