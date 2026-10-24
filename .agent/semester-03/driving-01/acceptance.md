# DRIVING-01 自动驾驶系统

2026-10-24，用户指定继续 DRIVING-01，rank 14。计划模式为新写，目标路径 autonomous-driving/driving-system 无既有正文。仅使用已交付 modern/state-space；原候选先修 safety-ftc/safety-overview 正由并行会话生产，改为后续阅读，所需运行域、监控和回退定义本课局部补足。

隔离副本 D:/Workspace/control-universe-rank14-driving01；Next 18114、Jupyter 18914、Pages 18214、浏览器实验夹具 18314。使用前核查端口，不修改共享服务配置，不删除共享 .next，不停止他人进程。只交付本课，不发布 Pages。

开工共享工作区包含多课设计与用户批阅，npm run check 实测 PASS17/WARN9/FAIL7，涉及并行注册、小节和统计检查点；保留，不代修。最终交付另在 HEAD 叠加本课差异的隔离快照检查，不能用共享中间状态代替交付版本。

设计合同：从障碍前停车的问题解释运行范围、系统数据流、消息合同、端到端延迟、监控回退及闭环证据；10H2、四题四答、两Notebook四cell、一个延迟Explorer、一SVG。合成恒速延迟加恒减速度模型；不声称车辆试验、合规认证或算法排名。

Phase1–4已完成并签发；真实master提交后再登记最终完成列。

## 实际验收

| 命令/操作 | 退出码与实际结果 | 证据 |
|---|---|---|
| python reference.py + node numeric-audit.cjs | 0；6配置精确分数/实际TS，7098轴配置 | numeric.log/json |
| nb-cells单课 --require-kernel --port 18914 | 0；2Notebook4cell/error0/SKIPPED0 | notebooks.log/json |
| 生产Pyodide browser-audit.cjs | 0；2Notebook4cell全部通过 | pyodide.log/json |
| 隔离npm run build | 0；无MDX编译失败 | build.log |
| 独立distDir的PAGES_BUILD=1 npm run build | 0；全站静态导出通过 | pages-build.log |
| WIKI_VERIFY_PORT=18114 verify-lesson单课 | 0；9项PASS，H1=1/H2=10/KaTeX0 | verify-final.log |
| page-audit.cjs普通与Pages本地URL | 0；控件更新/恢复/零速、4cell输出、图片/锚点/375px/error0 | browser-native-current.log/browser-pages-final.log及JSON/PNG |
| npm run check隔离快照 | 0；PASS21/WARN2/FAIL0 | check-isolated.log |
| check-python-support.mjs | 0；86课/383可运行/16代码展示（HEAD+本课隔离口径） | python-policy-final.log |
| npm run math:check；glossary.mjs check | 均0；files0/tokens0，PASS3/WARN2/FAIL0 | math-final.log/glossary-final.log |
| check-semester03.mjs（显式GIT_DIR只读核实历史master回执） | 0；21章205课、141来源/56正文覆盖 | semester-isolated.log |

两项catalog WARN：motion-planning跨章重名（组合路由无冲突）；19门旧正文缺本期日志，沿用既有偿债登记，本课有完整日志。术语两WARN为既有跨课符号多义和四处max/min拼写，本课不新增。

修正记录：首次verify的“参考答案”标题不符合固定“答案”约定，已修正重跑；首次浏览器脚本过早统计未完成内核初始化的按钮，加入就绪等待后通过；dev首次编译超30s，改为120s页面加载等待后通过。Pages独立distDir导出到.next-driving-pages，最初误指out造成404，改用实际产物目录后全部通过。失败输出保留，不冒充通过。生产build与dev分别使用独立.next目录，未清理他人缓存。

正文LF SHA-256：bda85a6edb39936024aeb26ff37e1e3e05e34b029398a88e0d68eee7a252da16。两Notebook在生产Worker中的完整原始输出见pyodide.json；代码不依赖第三方车辆数据。资料检索与证据层级见sources.md。

本地静态验收不代表线上发布；仅向origin master提交推送，gh-pages需独立授权。

提交候选在最新HEAD ffc674ea33f87fd15d57a4d47587c77fc347f12d 上只叠加本课差异；latest-check.log与latest-python-policy.log均exit0。完整七项命令退出码在staged-commands.json，后续只因其它会话推进HEAD而重组共享元数据；本课正文/组件/计算/SVG与生产构建、两种实际页面验收源逐字相同。

提交候选在最新HEAD 3dbce418c0e2cf0bf1e797bb625f6e3df9ddeb46 上只叠加本课差异；latest-check.log与latest-python-policy.log均exit0。完整七项命令退出码在staged-commands.json，后续只因其它会话推进HEAD而重组共享元数据；本课正文/组件/计算/SVG与生产构建、两种实际页面验收源逐字相同。

真实master交付提交：4784a21caea543bf17fbf2b12ac8b5808202875c。独立Git索引及原子基线校验提交，未触碰其它会话暂存区；最终完成列据此勾选。回执候选再次运行check-catalog和check-semester03，均exit0，见receipt-commands.json。
