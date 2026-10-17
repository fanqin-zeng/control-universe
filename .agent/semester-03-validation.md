# 学期3立项验收记录

日期：2026-10-17。范围：计划、全局清单、新写/重构技能、入口与规划校验脚本。未修改课程正文、catalog、组件或运行逻辑，未签发任何学期3课程。

## 起点实测

`npm run check`：退出码0，PASS17 / WARN36 / FAIL0。16章141课，MDX56（v1.3=29，draft=27），empty85；21篇讨论日志覆盖21课；614小节；47Explorer、45使用、2孤儿；148先修边、环0/悬空0、前向10（导论豁免6+白名单4）、章内倒置2；69课登记先修、30孤立、7章零边。

实测完整输出曾保存到本机 logs/semester03-baseline.log，作为临时工作记录用后清理；本文件保留关键实际输出，来源条目/hash另存 semester-03-baseline.json。

## 技能场景试走（文档审查，非课程实跑）

| 场景 | 输入 | 实际沿规则走查所得结果 |
|---|---|---|
| 新增课 | MATH-01，无源正文，高中数学起点 | 路由新写；先设计起点/目标/H2/最小实验；岳自必到；基建未完不能启动正式签发 |
| 旧课重构 | MATH-02，complex-numbers有MDX | 路由重构；先读旧正文/代码/hash，做保留纠错矩阵；不能继承旧状态跳过四阶段 |
| 合并迁移 | EST-03，modern旧MDX+estimation空条目 | 路由重构；保留旧正文与URL兼容、独立复算；合并不等于本期课完成 |
| 拆分旧课 | 一份旧正文拟分为两目标 | 先改计划/清单保留来源；本对话只交付一个目标，其余片段留源并登记；不能先删未迁材料 |
| 数值/运行失败 | 三路不符或S6 SKIPPED | 数值否决回Phase2；补实跑与受影响重测，不能勾验收/P4签发 |
| 比较缺基线 | 有两条对比曲线、基线未调参 | 触发何疑，不因正文没写“优于”而豁免；补实验、降级限定观察或删结论 |
| 中断与跨课 | 当前课Phase2未完，准备继续下一课 | 保存同课检查点；全局状态维持未完，不预签也不顺带生产下一课 |
| 绿色build吞错 | exit0但含MDX编译失败 | 共同约束明确判不通过，登记I01处理，不能用旧技能“build可抓一切”的过时解释放行 |

审查确认：新技能共用原personas/课型矩阵，未增删角色；Phase2三轮、Phase3六组、A.1/A.2/B/C与原九项均保留。两入口差异在写作前设计与旧文资产审计，不削减共同验收。

## 命令与实际输出

| 命令 | 退出码 | 实际关键输出 |
|---|---|---|
| npm run check | 0 | PASS 17 · WARN 36 · FAIL 0；规模与起点一致 |
| node scripts/check-semester03.mjs | 0 | 21章 / 205课 / 重构56 / 新写149 / 来源141 / 原MDX56 / 合并0；PASS semester-03 plan/checklist |
| node --test scripts/check-semester03.test.mjs | 0 | tests 10 / pass 10 / fail 0 / skipped 0 |
| python …/skill-creator/scripts/quick_validate.py .agent/skills/wiki-lesson-new | 0 | Skill is valid! |
| python …/skill-creator/scripts/quick_validate.py .agent/skills/wiki-lesson-refactor | 0 | Skill is valid! |
| git diff --check | 0 | 无空白错误输出 |
| Node内置脚本核对本次文档本地Markdown链接 | 0 | PASS local Markdown links |

技能校验器原路径：`C:/Users/Administrator/.codex/skills/.system/skill-creator/scripts/quick_validate.py`。系统/捆绑Python均缺PyYAML，最初执行因 ModuleNotFoundError 退出1；随后只向被忽略的临时目录 logs/semester03-validation-deps 安装PyYAML6.0.3，设置PYTHONPATH后重跑，两技能均退出0。未改项目依赖，临时验证依赖用完清理。

校验脚本的异常测试覆盖：遗漏来源、旧文误分类、重复路径、遗漏进度、跳阶段、无合并证据、跳过前课、超长章名、缺失证据文件；加正常计划共10项。场景试走仅是工作流规则审查，不声称课程已真实跑过任何实验。

本次无页面/课程/运行代码变更，未重跑生产build、页面verify或真实内核；这些不计为本期通过，已分别登记到I/S/逐课任务。P04/P05可据上述真实命令与场景结果勾选。
