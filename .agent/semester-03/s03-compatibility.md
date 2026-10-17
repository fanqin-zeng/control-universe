# S03 迁移兼容验收

日期：2026-10-17。起点master `bfe7de9`；范围为迁移的旧URL、必要旧片段、活跃链接、历史日志身份和台账兼容。不是全站锚点治理，也不交付课程；W01/W04/W05及S04保持未完成。

## 最终变更

- `lib/lesson-compat.mjs`集中维护9条直接旧路径映射，`next.config.mjs`和历史日志识别/页面验收共用；只存兼容信息，不复制目录或交付状态。未知路径不猜测迁移去向。
- 8份MDX共10处课程URL规范化：8处Kalman旧入口、2处分布式MPC旧入口；正文文字、公式、notebook、习题与标题均不改。56份正文相对S02，48份完全不变，8份仅URL替换。S02结构验收从真实Git原文推导允许的规范化结果，仍拒绝任意教学变更或缺文件，不覆盖S01/S02历史hash。
- 分布式MPC保留3个旧catalog fragment：`为什么需要分布式MPC`、`ADMM分解算法`、`数值例子`。在rehypeSlug之后注入空的aria-hidden span，放在对应真实标题内部；保留原标题文本及canonical ID，别名不参与slug计算。不改本课catalog subsections，不冒充全站W04锚点契约。目标缺失/ID冲突会抛错，构建不得静默通过。
- checker及verify通过统一旧路径映射识别历史日志；历史日志、旧完整台账、不可变基线与S01清单原文不重命名/重写。真实CLI夹具证明`semester-02/01-modern/01-kalman-filter.md`能归属`estimation/kalman-filter`，夹具明确是测试数据，未制造真实课程日志。
- 旧tracker保持21章205行、29个旧v1.3打勾；当前catalog与旧tracker的课程身份、标题和状态继续由check核对。本期逐课阶段仍全部未勾，0/205合并。

## 旧入口与片段的实际结果

生产构建退出0后，在生产8080服务执行`node scripts/verify-migration-compat.mjs`，[结果](s03-compat-results.json)为614项检查通过：9旧入口直接308→最终200、9次查询参数保留、3个旧正文终点的全部原渲染ID保留、10处新规范URL引用可达，历史证据不变。兼容脚本从真实S02提交编译原MDX，经GFM/Math/KaTeX/Slug生成基线ID，再与生产SSR的真实ID比对；编译时仅用占位组件替代交互组件，不替代数学/标题处理。实际生产走完整现有组件与高亮管线。

| 旧入口 | 最终入口 | 片段验收范围 |
|---|---|---|
| modern/linear-system-theory | modern/lyapunov-modern | 保留S02目标页全部渲染ID，既有跳转未退化 |
| modern/kalman-filter | estimation/kalman-filter | 保留S02目标页全部渲染ID；原12个H2顺序/ID不变 |
| mpc/distributed-mpc | multi-agent/distributed-mpc | 原13个H2顺序/ID不变，另补3个旧catalog片段 |
| estimation/h-infinity-filter | robust/h-infinity-filter | 原空课入口继续到空课200；没有历史正文片段可迁移 |
| estimation/mhe-fusion | mpc/mhe-fusion | 同上 |
| rl-control/safe-rl | safety-ftc/safe-rl | 同上 |
| rl-control/multi-agent-rl | multi-agent/multi-agent-rl | 同上 |
| applications/auto-driving-control | autonomous-driving/vehicle-control | 同上 |
| applications/robotics-control | robotics/robotics-case-study | 同上 |

fragment不发给HTTP服务器：服务端保留的是目标DOM中的ID，查询参数则检查308 Location。未声称支持任意拼错或从未存在的片段，亦未冒充浏览器滚动/拖动验收。原空课不存在正文，不把它们的placeholder200计成课程内容交付。

## 引用和历史去向

修改文件：modern的lyapunov-modern、state-observer、lqr-controller、modern-case-study；nonlinear的adaptive-control-basics；mpc的prediction-model、receding-horizon、mpc-case-study。生产回归逐处记录文件/目标及200，详见结果references数组。运行MDX中不再含这9个历史课程URL的Markdown活跃引用。

历史日志和报告中的旧路径属于当时证据，保留原义；代码兼容表中的旧路径是直接入口定义，必须保留；S01/S02快照、旧tracker归档、fixture和固定历史复算脚本不批量替换。当前legacy resolver只映射显式9条路径，未知课程日志仍会被check报出，不用basename猜同名课。

现代控制案例原文把Kalman列为必读、state-observer写“下一章”的教学顺序措辞均属于已登记逐课重构问题，本次只修URL。MODERN-09/05 Phase1再审教学边界，不在一个结构对话里批量改写课程。原文的扩展阅读也不自动加入catalog硬先修。

## 存量失败与边界

对8份改链接正文及2份迁移正文实跑verify共10课，退出1，PASS69/WARN14/FAIL7：modern-case-study、prediction-model、receding-horizon、mpc-case-study、kalman-filter五课有ipywidgets失败；receding-horizon另有既有公式语法/H2损坏两项失败（W05）。所有10课第7项交叉引用均通过。锚点WARN仍按W01/W04处理；缺档35课归逐课Phase1–4。S03不改这些教学资产，绝不标记整课验收通过。

本次未执行notebook，S02真实在线对照与EST-03 setup/ipywidgets债务保留，不用生产页面200推断数值可运行。没有改kernel、组件默认参数或数值断言。

check仍为PASS20/WARN30/FAIL0；S02的30项WARN快照逐项一致，26页源码锚点WARN仍在（兼容别名不能代替canonical侧栏修复），无新增/变化/消失WARN。W01/W04/W05不关闭；W02/W03同样按各自条件推进，S04还需整体验收。

## 实际命令与退出码

| 命令 | 退出码 | 实际结果/证据 |
|---|---|---|
| npm run build | 0 | s03-build.log；编译/类型/预渲染通过，保留既有Hook/img lint提示 |
| npx tsc --noEmit | 0 | s03-types.log，无错误输出 |
| node scripts/verify-migration-compat.mjs | 0 | s03-compat-results.json；614检查、9跳转、3正文终点、10引用 |
| npm run verify -- modern/lyapunov-modern modern/state-observer modern/lqr-controller modern/modern-case-study nonlinear/adaptive-control-basics mpc/prediction-model mpc/receding-horizon mpc/mpc-case-study estimation/kalman-filter multi-agent/distributed-mpc --quiet | 1（存量失败） | s03-pages.log；PASS69/WARN14/FAIL7，无交叉引用FAIL |
| node --test scripts/lesson-compat.test.mjs scripts/check-structure-migration.test.mjs scripts/check-migration-review.test.mjs scripts/check-migration-warnings.test.mjs scripts/check-semester03.test.mjs scripts/check-warning-audit.test.mjs scripts/lesson-route.test.mjs | 0 | s03-tests.log；60通过/0失败/0跳过；含真实MDX别名渲染、真实CLI历史日志夹具、目标缺失/冲突、代码保护和原结构负向测试 |
| node scripts/check-structure-migration.mjs | 0 | 21章205课/56正文/149空课/464边/9跳转；仅允许推导出的URL替换 |
| node scripts/check-warning-audit.mjs --live | 0 | I03历史36项完整；S02实时30项完全一致 |
| npm run check | 0 | PASS20/WARN30/FAIL0；s03-check.log |
| npm run glossary:check | 0 | s03-glossary.log；PASS3/WARN1/FAIL0，既有函数名排版WARN |
| node scripts/check-semester03.mjs | 0 | 任务12/21完成；课程合并0/205 |
| git diff --check；git diff --cached --check | 0 | 日志仅去行尾空白；用户校对文本未暂存 |

测试完成后恢复8080开发服务及8891网关。S03按迁移兼容范围完成；下一项S04的全局验收须遵守W任务门槛，不能直接凭本次兼容通过预签发。
