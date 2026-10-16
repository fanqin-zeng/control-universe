# 03 · 术语表（e4-fixture / ok 根）

> 这是 `.qoder/e4-fixture` 的**对照**登记表，不是真表。真表在 `docs/semester-02/03-glossary.md`。
> 覆盖 `ok/content/fx/gloss-ok.mdx` 抽出的全部 3 条别名冲突；少裁决一条 → C2 FAIL。
> NOISE 表里的 3 条本轮都有命中；若哪天变成 0 命中 → C2b WARN。

<!-- REGISTER-START -->

| 中文标准译名 | 英文 | 别名（已裁决保留） | 出现课程 | 建议 |
|---|---|---|---|---|
| 零阶保持器 | ZOH | 采样保持器 | fx/gloss-ok | 统一到「零阶保持器」；「采样保持器」仅指 sample-and-hold 的泛称 |
| 抗积分饱和 | anti-windup | 抗饱和 | fx/gloss-ok | 统一到「抗积分饱和」；尾字「和」属「饱和」一词，抽取时不得裁掉 |
| 模型预测控制 | Model Predictive Control, MPC | MPC | fx/gloss-ok | 「全称, 缩写」写法按缩写归一，不另立条目 |
| 滚动优化 | Receding Horizon | — | fx/gloss-ok | 保留；它是 MPC 的一种叫法，但英文归一化后与 MPC 不同，各自成条 |
| 实验结果 | — | — | fx/gloss-ok | 不是术语，是 notebook 单元标号的宿主词，见 NOISE 表 |

<!-- REGISTER-END -->

<!-- NOISE-START -->

| 变体 | 判定 | 依据 |
|---|---|---|
| 不与滚动优化 | 抽取残渣：RE_EN_PAREN 贪婪吃进了括号前的从句 | gloss-ok.mdx 第 33 行 |
| NB1 | 抽取残渣：notebook 单元标号，不是英文名 | gloss-ok.mdx 第 44 行 |
| NB3 | 抽取残渣：notebook 单元标号，不是英文名 | gloss-ok.mdx 第 46 行 |

<!-- NOISE-END -->
