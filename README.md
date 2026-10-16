# 控制宇宙 · Control Universe

中文控制理论教学 wiki：以**多角色讨论式工作流**（Phase 1–4 + 数值三方对账）生产课程，
Next.js 14 + MDX + KaTeX + ECharts 交互组件 + Jupyter Notebook 双运行时。

## 快速开始

```bash
npm install
npm run dev        # http://localhost:8080（scripts/serve.mjs 编排）
```

`<JupyterNotebook>` 组件需要 Jupyter Kernel 网关（端口 8891）：

```bash
python scripts/jupyter_server.py
```

## 质量门槛（提交/合入前必跑）

| 命令 | 作用 |
|------|------|
| `npm run check` | 唯一权威统计：catalog 一致性、tracker↔status 交叉核对、prereq 依赖图、死链 |
| `npm run verify <chapter>/<lesson>` | 单课交付硬门槛（页面 200、H2 对齐、KaTeX 无错） |
| `npm run nb:verify` | Notebook cell 结构校验 |
| `npm run glossary:check` | 术语表与符号约定一致性 |

## 文档地图

- **`AGENTS.md`** —— 仓库第一入口：项目是什么、"学期"概念、讨论方法论、硬红线、分支规范。**人或 Agent 先读它。**
- `content/catalog.ts` —— 章节课程唯一权威数据源（16 章 / 141 课）
- `.agent/` —— Agent 工作记忆：学期计划、交付台账、22 角色讨论工作流、fix 归因库（工具中立）
- `docs/discuss-log/semester-01/` —— 第一学期课堂讨论日志（11 篇）
- `docs/semester-02/` —— 结构诊断、数学依赖图谱、术语表、符号约定
- `archive/` —— 过时文档归档区（含审计报告）

## 分支模型

`master`（唯一长期分支，`npm run check` 绿）+ 按工作包的短命分支 `wp/<阶段>-<内容>`，
`--no-ff` 合并、即合即删。详见 `AGENTS.md` §12。
