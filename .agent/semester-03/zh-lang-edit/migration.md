# 2026-10-18流程迁移验收

用户将中文润色交其他模型；既有五份技能/人设文件逐字恢复到400d2df，新润色SKILL撤下，旧规则/记忆/40课计划/试稿证据迁入archive且明确停用。新PLAN完整列205课，40课已生产，其余165课待生产；没有宣称任何课已获用户认可。

新流程不需要角色讨论，仅records逐课记录。长期分支codex/semester-03-zh-lang-edit，用户明确要求后维护Agent才简单审核合入master。保留上一轮CLASSIC-01正文、UI修改及用户proofreading未提交改动。

核验：五份既有技能字节对比通过；205课程ID与学期3计划一致且不重复；npm run check退出0（PASS21/WARN2/FAIL0）；node scripts/check-semester03.mjs退出0（原生产merged40）。本次未改页面代码，因此不重复页面/实验验收。历史archive里的脚本和路径不是新流程可执行门槛。
