# 04 · 数学符号约定表（e4-fixture / bad 根）

> 这是 `.agent/e4-fixture` 的**缺陷注入**登记表，故意不完整。真表在 `docs/semester-02/04-notation.md`。
> 两处故意缺陷：① 缺 `\Psi` → C1 FAIL；② 多一条本轮 0 命中的 `\Xi` → C1b WARN。
> ABBREV 块里那条 TMR 本轮也 0 命中 → C5 WARN。

<!-- REGISTER-START -->

| 符号 | 含义 | 出现课程 | 冲突情况 | 裁决建议 |
|---|---|---|---|---|
| $s$ | 复频率 | fx/gloss-bad | 无 | 保留 |
| $i$ | 虚数单位 | fx/gloss-bad | 无 | 保留 |
| $n$ | 状态维数 | fx/gloss-bad | 无 | 保留 |
| $x$ | 状态向量 | fx/gloss-bad | 无 | 保留 |
| $\Xi$ | 死条目：本课从未用到 | — | — | 应被 C1b 点出来 |

<!-- REGISTER-END -->

<!-- ABBREV-START -->

| 全大写连写 | 判定 | 依据 |
|---|---|---|
| TMR | 三模冗余，不是 T·M·R | 死条目：本课从未用到，应被 C5 点出来 |

<!-- ABBREV-END -->
