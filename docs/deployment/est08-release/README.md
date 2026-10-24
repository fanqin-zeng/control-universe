# DEP15：EST-01—08与已提交快照授权发布完成

用户在EST-08交付后明确要求“将这些内容推送到github pages”。固定获准master `bd2b41c31a38cbddfde3e2b1355a7eb6da413708`，包含EST-01—08及该提交已有内容；并行会话随后的新提交未自动纳入。旧gh-pages `4a4dc5f333416ce79c7c3320f81a3a3eb8f91b84`正常no-ff合入得到 `de6069b43eb22902f4099c88e2aae48ba587ca9c`，内容树与获准master完全一致，未强推。发布在独立worktree完成，主工作区/共享索引保留。

规范仓库为[fanqin-zeng/control-universe](https://github.com/fanqin-zeng/control-universe)，公网[https://fanqin-zeng.github.io/control-universe/](https://fanqin-zeng.github.io/control-universe/)。GitHub API确认build_type=workflow；source.branch保留GitHub遗留master配置，但实际工作流的push和dispatch均只允许gh-pages，未启用master自动发布。规范地址已在发布约定首段更正，历史地址记录保留。

[Actions 40084455425](https://github.com/fanqin-zeng/control-universe/actions/runs/40084455425) build与deploy均success。公网release.json精确匹配发布SHA，sourceDirty=false；不能以本地构建代替远端结论。

| 实际命令/操作 | 结果与证据 |
|---|---|
| npm run check；npm run math:check | 各exit0，check PASS21/WARN2/FAIL0，既有WARN未抹除；check.log/math.log/local-gates.json |
| node --test pages/lesson-route/browser-python/python-release-decision | exit0，14测试通过，失败/跳过0；tests.log |
| 官方npm run build:pages | exit0，完整205目录页/9旧入口/资源校验，干净发布SHA；pages-build.log/local-release.json；本地仅Node进程限制CPU，不改产品源码 |
| 正常推送gh-pages | exit0；push.json/log，无强推，git diff获准master与发布commit为空；merge.json/log |
| GitHub Actions | build/deploy success且head_sha匹配；actions.json |
| 公网全站HTTP | exit0，205目录路由（含占位）/9旧入口/235请求，CSS/JS/KaTeX字体正常、未知路由404；public-http.json/log/public-http.mjs |
| EST-01—08页内原始Python | exit0，20Notebook40cell，静态组件均显示运行完成，每单元有输出，无Traceback；public-courses.cjs/json/log |
| 页面与移动布局 | 八课H1/全级H2文本和ID逐项对获准源码管线、重复ID0/hash目标存在、KaTeX错误0/图片加载、375px无溢出、console/pageerror0；public-courses.json |
| EST-08交互 | 默认RMSE与首拍显示、spike+gate+step6的NIS19.265926拒收及RMSE.318629、恢复默认通过；public-est08-mobile.png/public-est08-diagram.png |

八课公网Python均在读者浏览器运行，loopback请求0，未启动或暴露本地Jupyter。原有各课独立数学/严格内核证据沿用其课程验收；本次实跑是20本40cell，不声称重跑全站全部Notebook或重新进行全站数值仲裁。

首轮公网核验脚本使用native界面完成标记，主动关闭仅该脚本的浏览器后修正为静态组件的状态与输出判据，完整重跑通过；诊断记录public-courses-before-selector-fix.log，不是线上课程故障。八课源码未因此改动。

综合结果validation.json。发布已完成；本目录证据和DEP15完成状态在master追加回执，不再次触发Pages。

后继并行发布：控制实现章会话正常合入本次gh-pages后发布4acd64ae008bd18555caefeb8e937a379dce6fa8。本次release为其祖先；估计章课程资产、共享运行组件与支持策略/workerHash均未变化，当前公网版本匹配此后继且sourceDirty=false，见successor-equivalence.json。保留该发布，不回退。该会话已将其回执调整为DEP16，本任务保留预留的DEP15。原20本40cell执行证据属于de6069b；后继以源码与策略等价继承，不虚称已重新运行。
