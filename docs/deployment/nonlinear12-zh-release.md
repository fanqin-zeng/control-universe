# 课程与润色授权发布

2026-10-19用户要求拉取润色分支，快速审核后合入master，并发布所有现有更新。审核通过17课，真实merge为1a0ea71af824828a085379101a122d8d71c7092a。包含NONLINEAR-09至12新交付成果；发布及公网验收已完成，证据如下。


审核后合并17课为1a0ea71，随后同步拉取期间新增的仅流程文档提交b21db52（master合并f6c6c5c）：46课旧润色重置待重做，旧记录归档，生产进度保留50课，修正流程示例平均速度算术笔误。当前最终发布目标de07d3e9a8495e40693d44baba79e5fe8a6cb13f，前一发布36d0327与此版的content/components/lib/public/scripts/.github没有差异（git diff --quiet退出0），第二版仅补流程文档。公网Python实跑按同一最终源码/worker指纹核验，不把流程重置解释为语言已合格。


最终发布：de07d3e9a8495e40693d44baba79e5fe8a6cb13f，源master为f6c6c5cc8c1c2b2f0f079e8de9af1586ee1bd3fb；Actions run 39149628302的build/deploy均success。公网release.json精确匹配发布SHA、sourceDirty=false。分支gh-pages与master正常合并，无强推；长期润色分支本地已快进到b21db52。用户三份未提交批阅保持原样。

| 公网验收 | 实测结果/证据 |
|---|---|
| 版本/构建部署 | nonlinear12-zh-public-actions.json；https://github.com/fanqing-zeng/control-universe/actions/runs/39149628302 |
| 全站HTTP | node scripts/verify-public-pages.mjs de07d3e9a8495e40693d44baba79e5fe8a6cb13f docs/deployment/nonlinear12-zh-public-http.json，退出0；205课程、9旧入口、235请求通过，未知路径404，CSS/KaTeX字体及脚本资源正常 |
| 新四课全部Python | nonlinear12-zh-public-python.json；NONLINEAR-09–12共14实验15cell全部passed，三方对账源指纹一致，全部stdout与原本地浏览器证据逐字一致 |
| 版本等价说明 | 新四课公网运行始于已部署36d0327，最终de07d3e仅增加流程文档；runtime树完全相同，equivalence.json保存真实git diff退出0及14组输出比对；最终版又刷新页内实验复验通过 |
| 润色抽查 | LQR对r符号的解释、相平面对扰动边界的措辞公网可见，两课首实验运行完成；未宣称重跑17课107个旧实验 |
| 最新课UI与手机 | 分岔与混沌13H2/4Notebook/KaTeX0，默认/特殊不动点/恢复成功，最终部署刷新后页内实验完成；375px实际宽/滚动宽360，无console warn/error，截图与browser.json留存 |
| 联合放行 | node docs/deployment/nonlinear12-zh-public-check.mjs退出0，nonlinear12-zh-public-validation.json pass=true |

全局checklist的ZH02表示技术审核合并已完成；独立润色PLAN已按远端新增要求将旧46课语言状态重置待重做，归档中保留实际合并历史。技术不变量通过不等于用户认可语言质量，不把旧17课表面排版处理宣称为新的语言精读验收。

发布后的本记录/截图/回执在master追加提交，不再次自动触发Pages；课程运行内容已经全部包含在上述授权发布版本。25个Python代码展示待办与W14保持，不降低原质量门槛。
