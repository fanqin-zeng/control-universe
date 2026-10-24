# QA01：历史顺序测试假设漂移

2026-10-24，运行 `node --test scripts/check-semester03.test.mjs scripts/mdx-headings.test.mjs`：28项中18通过、10失败；完整输出tests.log。

失败集中在顺序负向用例。它们直接读取当前全局checklist，但构造反例时假设DISCRETE-01仍未交付：例如删除DISCRETE-03自己的顺序例外、只重置03进度，不把已交付01改回未完成，便预期“跳过前课DISCRETE-03”。当前01已交付，这不再是反例。删除全部例外的用例也硬编码最早错误为DISCRETE-02，而现在并行生产的ML-01/ID-01才依赖换课例外。详见scripts/check-semester03.test.mjs实际输入。

这组测试在本课之前已存在，校验器本体未修改。当前 `node scripts/check-semester03.mjs` 对真实计划/台账退出0；ML-01自己的例外仅放行IMPL-01–10。未用这18个PASS冒称整套回归通过。后续修复应构造固定、完整、自足的未交付前课fixture，分别验证有/无目标自身例外、前课已完成/未完成，避免测试依赖生产进度；不得删除失败用例或放宽顺序规则。

本课不修改该跨课程测试工具，登记全局任务QA01。mdx-headings测试组自身5项通过，课程verify九项与严格内核另有完整证据。
