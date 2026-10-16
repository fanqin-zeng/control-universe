# 04 · 数学符号约定表（e4-fixture / ok 根）

> 这是 `.qoder/e4-fixture` 的**对照**登记表，不是真表。真表在 `docs/semester-02/04-notation.md`。
> 本文件覆盖 `ok/content/fx/gloss-ok.mdx` 里出现的全部符号基，一条不多一条不少：
> 多一条 → C1b WARN（死条目）；少一条 → C1 FAIL。
>
> **哨兵劫持回归夹具**：下面这句故意把字面哨兵写全 —— `<!-- REGISTER-START -->` 与 `<!-- ABBREV-START -->`。
> 本行以 `>` 开头，不是"独占一行"，所以 `sentinelSlice()` 认不出来、切片仍从真哨兵开始。
> 若 loader 退回 `text.indexOf(START)` 取第一次出现，切片会从这句警告开始，
> unit-probe 的 B3/B4（PM/GM 不拆）与 F 组立刻 FAIL。事故经过见真表 §5-1。

<!-- REGISTER-START -->

| 符号 | 含义 | 出现课程 | 冲突情况 | 裁决建议 |
|---|---|---|---|---|
| $A$ | 系统矩阵 | fx/gloss-ok | 无 | 保留 |
| $B$ | 输入矩阵 | fx/gloss-ok | 无 | 保留 |
| $C$ | 输出矩阵 | fx/gloss-ok | 无 | 保留 |
| $D$ | 直通矩阵 | fx/gloss-ok | 无 | 保留 |
| $K$ | 反馈增益 | fx/gloss-ok | 无 | 保留 |
| $P$ | 李雅普诺夫矩阵 | fx/gloss-ok | 无 | 保留 |
| $Q$ | 状态权重矩阵 | fx/gloss-ok | 无 | 保留 |
| $T$ | 采样周期 | fx/gloss-ok | 无 | 保留 |
| $e$ | 误差 | fx/gloss-ok | 无 | 保留 |
| $n$ | 状态维数 | fx/gloss-ok | 无 | 保留 |
| $s$ | 复频率 | fx/gloss-ok | 无 | 保留 |
| $u$ | 控制输入 | fx/gloss-ok | 无 | 保留 |
| $x$ | 状态向量 | fx/gloss-ok | 无 | 保留 |
| $y$ | 输出向量 | fx/gloss-ok | 无 | 保留 |
| $\gamma$ | H∞ 性能界 | fx/gloss-ok | 无 | 保留 |
| $\mu$ | 隶属度函数 | fx/gloss-ok | 无 | 保留 |
| $\omega$ | 自然频率 | fx/gloss-ok | 无 | 保留 |
| $\zeta$ | 阻尼比 | fx/gloss-ok | 无 | 保留 |
| $\mathbb{R}$ | 实数域 | fx/gloss-ok | 无 | 保留 |
| $\mathcal{C}$ | 可控性矩阵 | fx/gloss-ok | 无 | 保留 |
| $PM$ | 相位裕度 | fx/gloss-ok | 与 P·M 连乘同形 | 见 ABBREV 块 |
| $GM$ | 增益裕度 | fx/gloss-ok | 与 G·M 连乘同形 | 见 ABBREV 块 |

<!-- REGISTER-END -->

<!-- ABBREV-START -->

| 全大写连写 | 判定 | 依据 |
|---|---|---|
| PM | 相位裕度，不是 P·M | gloss-ok.mdx 第 19 行 `$PM \geq 50$` |
| GM | 增益裕度，不是 G·M | gloss-ok.mdx 第 19 行 `$GM \geq 10$` |

<!-- ABBREV-END -->
