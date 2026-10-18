# 手机课程目录滚动修复

2026-10-18。用户反馈公网手机目录打开后无法下拉。起点 master `67d8a05`，分支 `wp/mobile-sidebar-scroll`。不改课程正文或实验。

## 原因和修改

公网390×700实测：Sheet固定面板高700px、内容1474px、overflow-y为visible；用户滚动后面板scrollTop仍为0，弹层锁住背景页。桌面侧栏已有独立overflow-y:auto容器，移动版直接嵌入Sidebar，缺少同等处理。

为移动目录增加flex剩余空间内的独立滚动区域，min-height:0允许其收缩，overflow-y:auto与触摸纵向滚动明确启用；面板按100dvh约束，关闭按钮保留在滚动区域外，底部考虑安全区。使用inline style以覆盖仓库既有工具类失效环境。菜单按钮补上可访问名称，弹层补充隐藏标题。不改共享Sheet、桌面侧栏或背景滚动锁。

## 浏览器实测

browser.json与mobile-bottom.png：

- 公网旧版：700px面板/1474px内容；滚动后scrollTop=0。
- 本地修复：390×700，628px滚动区域/1458px内容，滚动到830px，底部“工程应用”在视口内，背景pageY=0。
- 展开工程应用后内容增至1660px，仍可滚动。
- 关闭后弹层消失，body overflow恢复visible。
- 横屏667×375，303px滚动区域/1458px内容，滚动到1155px。

以上是浏览器手机尺寸模拟和滚动输入实测，不冒充实体iOS/Android触屏测试。公网旧版仅用于复现，尚未发布修复。

## 构建验收

- npm run check：退出0，21 PASS / 2已知WARN / 0 FAIL，见check.log。
- 首次npm run build:pages：在构建前被全文指纹门槛拦住。上一轮两数学课和传递函数正文变更后未刷新浏览器验收清单，原Python代码虽未改变，仍按规则重新执行三课14份原始实验。
- python-refresh.json保存本轮浏览器实跑全部结果；node scripts/finalize-python-support.mjs .agent/semester-03/mobile-sidebar-scroll/python-refresh.json --merge以及node scripts/check-python-support.mjs均退出0，见python-refresh.log。只更新三课指纹和本轮证据；保持298可运行/27代码展示，保留全部既有待办的task/category/next字段。
- 再次npm run build:pages：退出0，205课程、9旧入口静态验收通过，见pages-build.log。
- Pages预览http://localhost:8081/control-universe/classic/transfer-function/手机390×700：实际目录可滚动到底，链接含正确basePath，见browser.json的staticPages及static-mobile-bottom.png。这是本地静态产物验收，尚未远端发布。
- node scripts/check-semester03.mjs：退出0，见checklist.log。

构建后已恢复8080开发服务。此修复随master下次授权发布，当前不推送gh-pages。
