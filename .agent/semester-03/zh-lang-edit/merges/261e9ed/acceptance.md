# 学期3中文润色分支快速审核与合入

用户2026-10-18在本对话明确授权：NONLINEAR-08完成后拉取润色分支、快速审核，通过则合入master并将全部更新发布Pages。

本课先以932a40b交付、8745142补回执并推送；随后审核远端`codex/semester-03-zh-lang-edit`截至261e9edeb5ba79071c7fd59ca73ea594c6cac0d0的29课，18门数学+11门经典控制。通过后以847d9a424c9adb65a8508af1cd0adbbcd4f85293合入master，未覆盖或提交用户proofreading文件。长期润色分支保留，未将新课生产扩展到下一课。

快速审核重点是本轮diff，不声称重新证明29课原有全部理论：补首次术语、明确主语与指代、区分教学例子和内部交付状态，中文引号与区间/单位排版。保留必要假设。核查新展开的能量20J、阻尼1200N·s/m、1/e约37%、SIS早期1.9I和恢复1000人/日，均与原参数一致；泰勒值及2tanh1仅减少展示精度，未改答案含义。图论/博弈向量只是把相同数字改为数学排版。

机器不变量：59文件范围仅本目录与29课MDX；180组Notebook、181cell求值后setup/cells/title逐字一致；React组件调用、全部块公式、各级标题及ID逐字一致；原链接无删除，补充的站内链接由目录/构建核查。每课before/after及Python载荷SHA256见review.json，可用../../review-merge.mjs按固定历史提交复核。

Python与数学参考证据处理：原180组实验的已执行代码没有变，保留原testedAt与原始输出，仅按等价证据刷新新稿源指纹；逐课登记executedSourceHash、payloadHash和sourceReview。数学两课参考文件本身未改，仅更新metadata来源。明确没有声称新一次运行这180组实验。当前73课357实验、332启用、25代码展示，待办不变。

| 验收 | 状态与证据 |
|---|---|
| 差异与技术资产 | review.json；历史固定提交复核脚本 |
| npm run check | check.log，最终退出0，PASS21/WARN2/FAIL0 |
| math/glossary | math.log、glossary.log，退出0；已知术语WARN保留 |
| 29课HTTP/H2/数学/链接/组件 | verify.log，29课全部HTTP200/H2对齐/KaTeX0，PASS261/WARN0/FAIL0/SKIPPED0 |
| 普通生产构建 | build.log，退出0、Compiled successfully |
| Pages生产构建 | pages-build.log，退出0、205课9旧入口，资源路径通过 |
| 路由/浏览器Python/发布判定测试 | tests.log，14测试通过 |
| 公网发布 | 独立记录docs/deployment/nonlinear08-zh-release.md；未部署成功不得先勾发布 |

PLAN中29课改为已合入，逐课记录追加真实合并回执；本期新完成的NONLINEAR-03–08生产状态同步，润色仍待处理。无新增语言角色、讨论规则或模拟记忆。
