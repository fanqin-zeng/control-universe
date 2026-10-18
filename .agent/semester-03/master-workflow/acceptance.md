# 日常直接提交master

2026-10-18用户裁决：平时更新直接往master推，有长期维护分支需求时再创建/切换分支。此裁决取代按工作包建短命分支及日常--no-ff要求。

同步范围：AGENTS.md §12、学期3计划执行方式、共同流程与新写/重构技能、全局checklist说明、Pages分支说明、check-semester03提交回执校验。旧课程完成列保留“合并”兼容名称，当前含义为交付提交已进入master；历史日志/hash不重写。Pages继续采用独立长期发布分支及逐次具体版本授权。

校验：移除回执必须有两个父提交的要求，仍要求Git commit存在且是master祖先。测试使用独立临时仓库验证普通master提交通过、未合入分支提交失败、不存在提交失败、历史合并与已进入master的分支提交通过。同时修复三个原测试针对“课程尚未打勾”的旧字符串夹具，改为按课程ID替换目标行，保证负例实际注入；没有放宽阶段顺序或证据存在门槛。

- node --test scripts/check-semester03.test.mjs：退出0，11测试全部通过（tests.log）。
- node scripts/check-semester03.mjs：退出0（checklist.log）。
- npm run check：退出0，21 PASS / 2已登记WARN / 0 FAIL（check.log）。
- 仅规则和进度校验改动，无页面/课程内容改动，沿用前轮已通过Pages构建，不重复站点构建。

远端同步前已git fetch origin，origin/master相对本地master为0个新提交、本地112个待同步历史提交。按用户新规则，本轮在master直接提交，正常push origin master；不会强推、改写历史或把用户未提交proofreading文件混入提交。具体推送结果以Git实际回执与会话交付为准，不预填发布成功。
