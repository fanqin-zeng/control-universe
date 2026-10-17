# 未投用组件归档（S04 / W02）

2026-10-17从运行目录移出两份全站无MDX引用的组件，源代码不改，扩展名改为`.tsx.txt`以避免参与Next/TypeScript编译。不是已交付课程，不通过伪造引用清除WARN。

| 文件 | 原位置/状态 | 去向判断 |
|---|---|---|
| bode-margins-explorer.tsx.txt | components/wiki/bode-margins-explorer.tsx；未注册/未引用 | Bode裕度概念与现有频域探索器重叠，且存在轴界门槛缺陷；当前没有经Phase1确认的独立教学任务，保留源码供未来审计，不纳入上线资产 |
| first-order-comparison-explorer.tsx.txt | components/wiki/first-order-comparison-explorer.tsx；已注册但未引用 | RC/热冷却归一化时间对比有潜在用途，但当前正文无此交互任务，拖参数不改变归一化曲线；撤销运行注册，保留实现等待对应课程Phase1决定是否需要 |

恢复时移回原`.tsx`位置，经对应课Phase1–4确认、修组件门槛、注册并在MDX真实引用后才算上线；本次未承诺未来复用。历史fix-019/020仍为预留待核，归档事实不能倒推原事故已被复现，不填假详情。
