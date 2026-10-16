# archive · 过时文档归档区

> **归档日期**：2026-10-16　**触发**：全仓 MD 文档冲突审计
> **审计方法**：以 `content/catalog.ts` + `.agent/delivery-tracker.md` + `npm run check` 输出为权威事实源，
> 逐份核对每个 MD 文档的事实陈述、路径引用与状态口径；结论分四类——**归档 / 活文档 / 历史性记录（保留原地）/ 测试夹具**。
> **恢复方法**：`git mv archive/<file> <原路径>` 即可，文件内容未做任何修改。

## 本目录内容

| 文件 | 原路径 | 归档原因 |
|------|--------|---------|
| `root-readme-create-next-app.md` | `README.md` | create-next-app 脚手架模板（2026-09-04 从未更新）。与现状**三处硬冲突**：① 称端口 3000（实际 8080，`scripts/serve.mjs`）；② 指引编辑 `app/page.tsx`（不存在，实际 `app/(wiki)/page.tsx`）；③ 未提任何项目命令（`check`/`verify`/`nb:verify`/`glossary:check`）与双运行时（Jupyter 8891）。已被新的根 `README.md` 取代 |

## 审计分类总表（未归档的及其理由）

### A. 活文档（跟随事实源更新，保留原地）

| 文档 | 性质 | 冲突处理 |
|------|------|---------|
| `AGENTS.md` | Agent 入口导航 | 本次已对齐 semester 术语 + 补改名史 |
| `OUTLINE.md` | 自动生成（`npm run check -- --fix-outline`） | 由脚本保证一致，禁手编 |
| `.agent/semester-02-plan.md` | 第二学期主计划 | 本次补齐 course→semester 残留 6 处 |
| `.agent/delivery-tracker.md` | 交付台账（与 catalog 交叉校验） | 无冲突 |
| `.agent/skills/**`（3 个 SKILL.md + personas.md） | 活工作流 | 本次对齐日志路径模板 2 处 |
| `docs/semester-02/01-structure-diagnosis.md` | 冻结的结构诊断快照 | 文首已声明"只读诊断、产出日期"，快照性质无冲突 |
| `docs/semester-02/02-math-dependency-map.md` | A4 交付物 | 无冲突 |
| `docs/semester-02/03-glossary.md`、`04-notation.md` | **机器读的门槛表**（`glossary.mjs check` 直接解析哨兵块） | 绝不可移动/归档，移动即校验红 |
| `docs/to-online/TR1.md`、`TR2.md` | 上线部署的需求/选型规划（2026-09-22，待启动） | 核对后**无过时事实**：端口 8080/8891、双运行时架构均与现状一致；且被 `semester-02-plan.md` 附录引用为"项目尚未上线"的证据。属**未执行的规划**而非过时文档 |

### B. 历史性记录（本质就是档案，但被工作流引用，保留原地）

| 文档 | 保留理由 |
|------|---------|
| `docs/discuss-log/semester-01/**`（11 篇） | 课堂记录固化资产；`npm run check` 第 4 节按目录统计（11 篇/覆盖 11 门）；是后续课程讨论日志的格式范本 |
| `.agent/fix-logs/**`（18 篇 + INDEX.md） | 返工归因库，fix-tracker 技能的回顾机制数据源；INDEX 正序索引与之强耦合 |
| `.agent/v1.3-refactor-plan.md` | **半活文档**：状态表滞后（只记 1 门完成，实际 19 门）——已在其文首加"权威口径"横幅声明以 tracker 为准；P0 表仍是阶段 C 有效待办，且被 `skills/v1.3-refactor/SKILL.md` 与 tracker 引用，不可归档 |

### C. 测试夹具（脚本消费的常量，勿动）

| 文档 | 保留理由 |
|------|---------|
| `.agent/e1/e3/e4-fixture/**`（含各自 README.md） | 被 `glossary.mjs --root`、`nb-cells.mjs --root`、`verify-lesson.mjs --root` 作为负向/对照组直接加载；移动即测试红。其中残留的 `course-01` 字样是夹具常量的一部分，**有意不改** |

## 审计中修复的其他冲突（本轮审计的相邻提交）

1. **semester 术语残留 17 处**（AGENTS.md 9 + plan 6 + SKILL.md 2）：用户 `09d980a` 只替换了 `course-01`，本次补齐 `course-02/03/NN/0N/XX/*` → `semester-*`，含 plan 标题与 TOC 锚点同步、脚本注释 3 处。
2. **v1.3-refactor-plan 状态口径冲突**：文首加横幅，声明 tracker 为唯一权威、执行顺序以 plan §4 的 C2/C4/C5 为准。
