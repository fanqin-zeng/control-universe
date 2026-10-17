# 全站块级公式排版验收

2026-10-18；基准master 2a68419；工作分支wp/fix-display-math。用户要求恢复居中、全部块级公式与开闭$$分行。只调整排版，不新增课程交付；行内单美元不变，用户proofreading文件不动。

## 结果

- 41篇MDX、2619个同行定界符已分行；引用补续行前缀，代码/JSX区间排除。全58篇课程无活动$$同行遗留。
- 全58篇按共享Math→KaTeX→Slug管线实际编译，2310个块级公式=活动围栏对数，katex-error0。原有Unicode/strict WARN保留，未解释为课程数学审校全部完成。
- 公共CSS从left改center，overflow:auto保留。桌面公式实际中心偏差<0.006px；390像素窄屏正文宽343=scrollWidth343，长式独立滚动且首部可见。传递函数、微积分、线代及补偿器引用均检查；控制台error/warn0，视口已恢复。
- 54门Notebook代码载荷未变，38门正文整体哈希因排版变化；保留原执行hash、测试时间、输出和通过状态，以原git源码、前后哈希及载荷逐字相等完成证据衔接。python-proof-transfer.json明确executedAgain=false，本次没有重新运行长实验。

## 实际命令与证据

| 命令 / 操作 | 退出码 / 结果 | 本目录证据 |
|---|---|---|
| node scripts/format-display-math.mjs --write | 0，41文件2619定界符 | format-results.json，含前后/Notebook哈希 |
| npm run math:check | 0，files0/tokens0，幂等扫描 | fences.log / inventory.json |
| 同守卫 --root fixtures/bad | 1，预期失败 | negative.log |
| 同守卫 --root fixtures/good | 0，引用/代码/JSX不误判 | positive.log |
| node scripts/verify-display-math.mjs | 0，58文件/2310公式/errors0 | rendered.log/json |
| node scripts/rebase-python-format-proof.mjs 2a68419 | 0，54门代码未变，38门衔接；公式/代码编辑负向断言通过 | python-proof-transfer.json，原运行报告的formattingProvenance |
| node scripts/check-python-support.mjs | 0，54课157启用/30展示，Worker未改 | 实际工具输出，状态清单lib/python-support.json |
| npm run check | 0，PASS21/WARN2/FAIL0；旧债不变 | check.log |
| npm run build | 0，无MDX编译失败 | build.log |
| npm run build:pages | 0，205课/9旧入口，298344421字节 | pages-build.log |
| npm run verify -- classic/transfer-function math/calculus-basics math/linear-algebra-basics classic/compensator-design | 最终0，四课HTTP200/H2与目录及真实锚点一致/KaTeX错误0；旧骨架引用等WARN保持 | page-verify.log；首次冷启动SKIPPED保留page-verify-startup.log，不以SKIPPED签发 |
| node scripts/check-fix-logs.mjs | 0，下一号034 | fix-index.log |
| node scripts/check-semester03.mjs | 0，课程进度不增加 | checklist.log |
| 浏览器生产页面桌面与窄屏 | center/无横向页面溢出/引用保留/console空 | browser.json / centered.png |

四阶段专项讨论：docs/discuss-log/semester-03/display-math-layout.md。共同流程新增用户2026-10-18裁决，秦构清单与fix033同步；Pages CI新增math:check。历史“居左”的日志保留，不回写成当时已居中。

源码仅加换行及引用续行前缀；不调整章节/练习/数值断言/算法。原30项实验待办的行号由新源文件重算，处置结论未改变。未发布gh-pages；未来发布仍需具体版本授权。

合并：修正提交8f0fc6a，已--no-ff合入master为edf0fb448d6690c4461a933ad990562f80b28b82。回执沿用工作包分支合回后删除分支。本次未push、未发布gh-pages。
