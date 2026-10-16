# AGENTS.md · 控制宇宙仓库导航（写给 Agent 的 wiki）

> 本文件是仓库的"第一入口"，目标是让任何新会话的 Agent 在 10 分钟内搞清楚：
> 这个仓库是什么、怎么跑、内容怎么生产、"学期"是什么、哪些红线碰不得。
> 本文件描述**导航与规则**，不复制数据；一切统计与状态以 `npm run check` 与权威文件为准。
> 最后核对日期：2026-10-16。

---

## 1. 一句话定位

**控制宇宙（control-universe）** 是一个中文**控制理论教学 wiki 站点**：Next.js 14 App Router + MDX + KaTeX 数学渲染 + ECharts 交互组件 + Jupyter Kernel 网关（可运行 Python notebook）。

它的特别之处不在技术栈，而在**内容生产方法论**：每门课程由一套**虚拟多角色团队**通过四阶段结构化讨论（Phase 1–4）产出，讨论过程固化为日志，数值断言要求"正文 / notebook 输出 / 交互组件默认值"三方对账。**这是本仓库的既有硬规则，后续所有课程重构与开发必须延续这套讨论式工作流。**

## 2. 新会话开工必读（按顺序）

1. 本文件。
2. `.agent/skills/wiki-discussion/SKILL.md` —— 讨论式内容生成工作流（Phase 1–4、发言纪律、日志结构、数值三方对账）。**写/改任何课程内容前必读。**
3. `.agent/skills/wiki-discussion/personas.md` —— 22 名角色 + 14 类轮值专家的完整人设与检查清单（"团队全貌"一节是人数与分组的最终权威）。
4. `.agent/semester-02-plan.md` —— **按学期（版本迭代）的重构计划**，见 §5。第 4 节含每个工作包的自包含推荐 Prompt。
5. `.agent/delivery-tracker.md` —— 交付台账（每课打勾记录，与 catalog 交叉校验）。
6. `.agent/fix-logs/INDEX.md` —— 历史返工归因库（写组件/数值前扫一眼能省一次返工）。
7. 跑一遍 `npm run check`，以脚本输出刷新你对当前状态的认知（本文件 §10 的快照可能已过期）。

## 3. 技术栈与常用命令

| 命令 | 作用 |
|------|------|
| `npm run dev` | 开发服务器（`scripts/serve.mjs` 包装，**端口 8080**，非默认 3000） |
| `npm run check` | **唯一权威统计与门槛**（`scripts/check-catalog.mjs`）：catalog 一致性、tracker 打勾↔status 交叉核对、prereq 依赖图（环/悬空/前向边）、组件注册、死链等。退出码非 0 即不可交付 |
| `npm run check -- --fix-outline` | 由 `content/catalog.ts` 重新生成 `OUTLINE.md`（**OUTLINE.md 禁止手编**） |
| `npm run check -- --fix-tracker-stats` | 幂等修正 delivery-tracker 底部统计行 |
| `npm run verify` / `verify:all` | 单课/全站课程页验收（`scripts/verify-lesson.mjs`，含 curl 页面 200、H2 与 subsections 对齐、katex-error=0 等） |
| `npm run nb:verify` | Notebook cell 结构校验（`scripts/nb-cells.mjs`） |
| `npm run glossary:check` | 术语表与符号约定一致性（数据在 `docs/semester-02/03-glossary.md`、`04-notation.md`，**这两张表是机器读的，改表即改门槛**） |
| `npm run build` | 生产构建 |

运行时依赖：Next.js 走 8080；`<JupyterNotebook>` 组件需要 Jupyter Kernel HTTP 网关（端口 **8891**，POST 需 `ProxyHandler({})` 绕过系统代理，见 `scripts/jupyter_server.py`）。

已知环境陷阱（Windows）：Tailwind 工具类可能不生效，交互组件需 inline style 兜底；`.next` 缓存损坏时 `rm -rf .next` 后重启。

## 4. 目录地图

```
content/
  catalog.ts                 # ★ 唯一权威数据源：16 章 / 141 课的章节、slug、title、
  │                          #   subsections、prereq、level、type、status(empty|draft|v1.3)
  <chapter>/<lesson>.mdx     # 课程正文（frontmatter + MDX；引用 <JupyterNotebook> 与各种 Explorer）
app/(wiki)/[chapter]/[lesson]/page.tsx   # 单层动态路由；status="empty" 渲染占位页
components/wiki/             # 44 个文件：36 个 *-explorer.tsx 交互组件 + JupyterNotebook +
  │                          #   sidebar / lesson-nav / use-echarts 等基础设施
lib/wiki-components.ts       # ★ 组件注册唯一来源（E2 根治双注册表；mdx-components.tsx 也从它导入）
lib/content.ts               # next-mdx-remote/rsc 编译课程页（走 wikiComponents）
lib/lesson-graph.ts          # prereq 依赖图
docs/
  discuss-log/semester-01/   # ★ 讨论日志（每课一篇，Phase 1–4 全程记录）——"课堂记录固化"
  semester-02/               # 01 结构诊断 / 02 数学依赖图谱 / 03 术语表 / 04 符号约定
  to-online/                 # 待上线素材
scripts/                     # check-catalog / verify-lesson / nb-cells / glossary / serve / jupyter_server
Python/                      # Python 运行时（含 Jupyter kernel）
.agent/                      # ★ Qoder 时期固化的"工作记忆"，见 §7，勿删
OUTLINE.md                   # 自动生成物（npm run check -- --fix-outline）
```

## 5. 「学期」概念（course-NN）——版本迭代周期，不是读者的学期

**"学期"是课程产品的版本迭代代际**，每一代有**不同的虚拟人物队伍与行为规则**：

| 代际 | 含义 | 角色团队 | 标志性变化 |
|------|------|---------|-----------|
| **semester-01**（第一学期） | 初版内容生产，已结束 | 14 名角色，全员到会 | 交付 classic 8 + nonlinear 8 + intelligent 3 = 19 门 v1.3；讨论日志在 `docs/discuss-log/semester-01/`（现存 11 篇，覆盖 nonlinear 8 + intelligent 3） |
| **semester-02**（进行中） | 结构重构 + 团队升级代 | **22 名具名角色 + 14 类轮值领域专家**，按课型上场 7–10 人 | 章节结构 11 章 84 课 → 目标 16 章 155 课；新增验证/体验层角色；固化 M1–M5 五大质量机制 |

### 5.1 学期计划文件（用户要求找到的那份）

**`.agent/semester-02-plan.md`**（约 2400 行）就是按学期的重构计划，结构：

- §0 现状盘点（事实基线，全部脚本实测）
- §1 结构诊断 P1–P11（附行级证据）
- §2 新学期 16 章 155 课结构方案（逐章逐课 slug 表）
- §3 角色团队升级（14 → 22 人 + 轮值；M1 发言纪律 / M2 数值三方对账 / M3 前端九项硬门槛 / M4 红队放行 / M5 fix 归因）
- **§4 执行计划与推荐 Prompt**（A/B/E/C/D 五阶段，每个工作包自带可粘贴的独立 Prompt）
- §5 验收门槛与统计口径

五阶段现状（2026-09-26 口径）：

| 阶段 | 内容 | 状态 |
|------|------|------|
| A 结构治理 | 只动目录与元数据 | A1–A5 ✅；**A6 🔄 仅 classic 完成，剩 modern/robust/mpc/nonlinear/intelligent/rl/multi-agent 7 章章内重排**；A7/A8 ✅ |
| B 角色升级 | 22 人团队与 M1–M5 固化进 skills | B1–B8 ✅ |
| E 质量基建 | 自动验收/单一注册表/cell 标准化/术语表 | E1–E4 ✅ |
| C 存量偿债 | 37 门 draft 课 v1.3 化 + 无日志课补档 | C0–C8 ⬜ 未开工 |
| D 新内容生产 | 约 71 门新课 | D1–D14 ⬜ 未开工（推荐先 P0：D1 math 15 课、D2 discrete-sampled、D3 implementation） |

推荐执行顺序：**A（收尾）→ C/D 并行**（B/E 基建已完成）。进入 C/D 后每课必须走 wiki-discussion Phase 1–4。

### 5.2 下一代学期（course-03）怎么开

沿用既有惯例：新开 `docs/discuss-log/course-03/` 存日志；以一份新的 `semester-03-plan.md` 立项（先做现状盘点与诊断，数据从 `npm run check` 取，不凭记忆）；角色队伍可在 22 人池上按 §3.1 的设计原则（"每个新角色对应一类可观测返工"）增删；学期末执行 fix-tracker 的《归因回顾机制》。

## 6. 内容生产方法论：多角色讨论（本仓库的核心资产）

完整规则在 `.agent/skills/wiki-discussion/SKILL.md` + `personas.md`，此处只给骨架：

### 6.1 四阶段流程（每课必走，不得跳过直接写内容）

1. **Phase 1 内容规划**——定教学目标、大纲、前置、可视化双轨分配（苏绘）、习题覆盖点（孙助）、数值对账口径（柯验）。
2. **Phase 2 内容生成**——三轮：概念讲解 → 学生反馈 → 调整完善。
3. **Phase 3 内容审校**——教授/工程/验证/体验分层审；柯验交**三方对账表**（正文断言 / notebook 输出 / 组件默认值读数）。
4. **Phase 4 定稿签发**——郑核签发，登记 delivery-tracker。

全程产出讨论日志：`docs/discuss-log/course-NN/<章序>-<章slug>/<课序>-<课slug>.md`，日志结构有固定骨架（SKILL.md《讨论日志固定结构》），缺席角色要显式标 `[沉默-<角色>：<原因>]`，禁止凑数发言。

### 6.2 角色体系（course-02 起，22 人 + 轮值）

| 层 | 角色 | 备注 |
|----|------|------|
| 教授 | 陈控(经典) 林矩(现代) 卫韧(鲁棒/非线性) 方数(数学) | 主责教授按章匹配 |
| 工程 | 周联 何仿(仿真，不自审数值) 吴规(甲方视角) | |
| **验证** | **柯验**(数值仲裁) **秦构**(前端/构建) **何疑**(红队) | course-02 新增层 |
| **体验与脉络** | **陆阅**(学习体验) **许史**(控制史/方法论) **范安**(功能安全) | course-02 新增层 |
| 教学支持 | 孙助(习题/翻译) 郑核(主持/签发) | |
| 可视化 | 苏绘(决策与规范；实现归秦构) | |
| 学生 | 小初 李稳 赵工 钱锐 **林码**(CS转行) **岳自**(高中数学自学) | 林码/岳自为 course-02 新增 |

- **核心常设 4 人（每课必到）**：郑核、苏绘、孙助、柯验；`math` 章另加**岳自必到**（"读者只有高中数学"的唯一真实检验者）。
- **上场规则**：按 `LessonMeta.type`（math/theory/impl/case/frontier/learning/history）查 SKILL.md《角色上场规则》矩阵，单课 7–10 人，不全员到会。
- **否决权**：柯验（数值三方不一致）、何疑（对比公平性）→ 内容级打回；郑核 → 签发级闸门；秦构九项前端硬门槛任一未过 → 郑核不得签发。

## 7. `.agent/` 的地位：Agent 工作记忆（工具中立）

本仓库早期用 Qoder 开发，2026-10-16 已将 `.qoder/` 整体迁移为 `.agent/`（git 历史保留 rename 记录）。它是跨工具的项目过程资产：**任何 vibe coding 工具（Codex / Cursor / Claude Code 等）都通过本文件（AGENTS.md，跨工具通用约定）进入，不依赖特定工具的私有目录**。**是活文档，不是废料，勿删勿移**：

```
.agent/
  semester-02-plan.md        # ★ 学期重构计划（§5）
  delivery-tracker.md        # ★ 交付台账（打勾与验收记录，与 npm run check 联动）
  v1.3-refactor-plan.md      # 可视化双轨制重构清单（哪些课待转交互组件）
  skills/wiki-discussion/    # ★ 讨论工作流 + 22 人设（SKILL.md + personas.md）
  skills/v1.3-refactor/      # 双轨制重构执行技能
  skills/fix-tracker/        # 修复记录与角色归因技能
  fix-logs/                  # 18+ 条历史返工记录（INDEX.md 索引，正序）
  e1/e3/e4-fixture/          # 校验脚本的测试夹具（供 scripts 消费）
```

新工具链（`npm run check` 等）已把其中部分规则自动化，但**计划、人设、讨论纪律、fix 归因**仍以这些文件为权威。

> 迁移说明：若某工具只认自家入口文件（如 Claude Code 的 `CLAUDE.md`），建一个只含一行 `See AGENTS.md` 的指针文件即可，不要复制内容（避免双源漂移）。

## 8. 硬规则（红线，违反即返工）

1. **任何课程内容的生成/重构/审校必须走 wiki-discussion Phase 1–4**，讨论日志同步固化到 `docs/discuss-log/`（历史上发生过因"没有固化课堂记录"而整课重写的事故）。
2. **`content/catalog.ts` 是唯一权威数据源**：改章节/课程/小节/prereq 只改它；`OUTLINE.md` 自动生成勿手编。
3. **delivery-tracker 打勾必须同步把该课 catalog `status` 改为 `"v1.3"`**，统计行用 `--fix-tracker-stats` 重算；否则 `npm run check` 红。
4. **可视化双轨制**：需要"拖参数看趋势"的 → React Explorer 组件（ECharts、`animation: false`、坐标轴显式 min/max、inline style 兜底）；纯计算/演示 → `<JupyterNotebook>` 静态输出；**禁止 ipywidgets**（kernel 里没装，页面上直接报 ModuleNotFoundError）。
5. **数值三方对账**：正文每个数值断言都要有 notebook 复算输出支撑；交互组件默认参数必须恰好复现正文手算例。
6. **组件注册**：只改 `lib/wiki-components.ts`（唯一来源）；MDX 里用 `<ComponentName />` 显式引用。
7. **MDX 语法陷阱**（来自 fix-012/013/017）：多行 display math 的 `$$` 必须独占开/闭行；JSX 属性之间不得有逗号；notebook cell 首行不得以 `%#` 开头；同页多个 notebook 的 kernel id 必须全局唯一。
8. **改完必跑 `npm run check`**（涉及页面再跑 `npm run verify <chapter>/<lesson>`）；只改声明范围内的文件，临时脚本用完删除。

## 9. 质量工具链对应关系

| 机制 | 落地 |
|------|------|
| M1 发言纪律与日志结构 | SKILL.md + 讨论日志骨架 |
| M2 数值三方对账 | 柯验 + `npm run verify`（notebook 复算） |
| M3 前端九项硬门槛 | `npm run verify`（秦构） |
| M4 定量对比红队 | 何疑三条件（对比课必过） |
| M5 fix 归因与回顾 | `.agent/skills/fix-tracker/` + `fix-logs/` |
| 统计口径统一 | `npm run check`（A7） |
| 依赖图校验 | catalog `prereq` + check 第 9 节（A8） |
| 术语/符号统一 | `npm run glossary:check`（E4） |

## 10. 当前状态快照（2026-10-16 实测，以 `npm run check` 为准）

- 16 章 / 141 课（目标 155）；**v1.3 已交付 19 门**；有 MDX 正文 56 门（draft 37）；骨架占位 85 门。
- prereq 边 148 条（环 0 / 悬空 0；覆盖率 69/141，尚有 7 章零 prereq 边 —— Q20 待裁决）。
- 讨论日志 11 篇 / 覆盖 11 门；**有 MDX 但无日志 45 门**（C0 要补的最大隐性负债）。
- 交互组件 36 个（孤儿 1：`bode-margins-explorer.tsx`，Q3 待裁决）。
- `npm run check`：PASS 17 · WARN 36 · FAIL 0。
- git：semester-02 的 A/B/E 阶段成果已提交并合入 `master`（2026-10-16）；`.qoder/` 已迁移为 `.agent/`。`npm run build` 交付前自行复验。

**下一步（按 plan §4）**：收尾 A6（7 章章内重排）→ C0（补讨论日志）→ C1–C8（存量 v1.3 化）与 D1–D3（P0 新课）交错推进。

## 11. 给后续 Agent 的操作提醒

- **叙述服从测量**：所有统计/行号/结论先实测（`npm run check`、`wc -l`、grep），不凭记忆写。fix-log 里有两次"行数凭印象写错"的返工教训。
- **只改本工作包声明的文件**；完成后更新 delivery-tracker 与 plan 勾选，删除临时产物。
- 每次修改后把实际验收输出（命令 + 退出码）粘贴进交付记录。
- 用户裁决项以 Q 编号登记在 plan/tracker 的批注里（已到 Q24+）；发现新矛盾先登记待裁决，不要擅自大改冻结文件（plan §1–§2 与诊断报告已冻结）。

## 12. 分支管理与交付节奏（2026-10-16 起）

### 12.1 模型：master 主干 + 按工作包的短命分支

```
master  ──●──────────●──────────●──▶   （永远 = npm run check 绿 + 可 build）
            \        / \        /
             ●──●──●    ●──●──●         （wp/<阶段>-<工作包>，寿命 ≤ 1 个工作包）
```

| 规则 | 内容 |
|------|------|
| `master` | 唯一长期分支。合入门槛：`npm run check` 退出码 0（FAIL=0，WARN 需已在 plan/tracker 登记为已知项）；涉及页面改动另跑 `npm run verify <chapter>/<lesson>` |
| 工作包分支 | 从 `master` 切出，命名 `wp/<阶段>-<内容>`，如 `wp/a6-modern-reorder`、`wp/d1-math-chapter`、`wp/c1-classic-v13`。**以工作包命名，禁止以工具/日期命名**（教训：`qoder/context/0921` 这种分支让工作在工具专属分支上滞留数周无人认领） |
| 分支寿命 | 一个工作包一条分支，做完即合即删；跨天继续也沿用同一条分支，不另开 |
| 合并方式 | `git merge --no-ff`，保留工作包边界，便于整体 revert 一个工作包 |
| 提交粒度 | 一次提交 = 一个可独立描述的完成态（如"迁移 .qoder→.agent"单独成 commit）；讨论日志、tracker 打勾、plan 勾选与正文改动同 commit 落盘，不留"改了内容没记台账"的悬空态 |
| 版本标记 | 学期阶段边界（如 course-02 的 A/C/D 各阶段收官）打 tag：`git tag course02-A`、`course02-C1` 等，方便回溯"当时 19 门交付"这类口径 |

### 12.2 为什么不用更重的模型

- 单人维护 + Agent 协作的内容仓库，没有多人并行 / CI 门禁 / 发布列车，Git Flow 的 develop/release 分支是纯开销。
- 课程生产的工作单元天然是 plan §4 的工作包（A6/C1/D1…），一个包一个分支正好与 delivery-tracker 的勾选粒度对齐。
- 本仓库的"状态"在文件里（catalog status + tracker 勾选 + plan 复选框），`npm run check` 就是事实上的 CI；合入前本地跑一遍等价于 PR 检查。

### 12.3 操作口诀

```bash
git checkout master && git checkout -b wp/<阶段>-<内容>   # 开工
# ...改内容 + 讨论日志 + tracker + plan 勾选...
npm run check                                               # 必须退出码 0
git add -A && git commit                                    # 台账同 commit
git checkout master && git merge --no-ff wp/<阶段>-<内容>   # 合入
git branch -d wp/<阶段>-<内容>                               # 即合即删
```
