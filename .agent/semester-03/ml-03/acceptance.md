# ML-03 神经网络基础验收

2026-10-24；rank2；本课从空占位新写。已按新写Phase1–4完成，最终横轴排版复验通过，真实交付已提交并推送master。

范围：content/machine-learning/neural-networks.mdx；lib/neural-network-basics.ts；components/wiki/neural-network-basics-explorer.tsx；单一注册器与本课目录元数据；讨论日志、进度与Python政策本课条目。所有数据为自造无量纲教具，无训练或现实水泵试验。

| 实际命令/操作 | 结果 | 证据 |
|---|---|---|
| node .agent/semester-03/ml-03/reconcile.mjs | exit0；实际TS4080前向/240损失/25二维；115920绘图量；独立Fraction/60位mpmath最大误差7.11e-15；原始Notebook96量误差0 | reconcile.log、reference.json、ts-cases.json、notebook-comparison.json、raw-python.json、native.json |
| node scripts/nb-cells.mjs verify machine-learning/neural-networks --require-kernel --port 8992 --out .agent/semester-03/ml-03/nb-strict.json | exit0；两Notebook四cell、S6实跑无error、无SKIPPED | nb-strict.log/json |
| node scripts/verify-lesson.mjs machine-learning/neural-networks（WIKI_VERIFY_PORT=8196） | exit0；HTTP200/H1=1/H2=10/KaTeX0；保留后续ML-04骨架链接WARN | verify-dev.log |
| 浏览器原始Python清单运行 | 两实验四cell passed、sourceHash匹配 | pyodide.json |
| 最终Pages课程页点击两次全部运行 | 两实验运行完成，输出逐量匹配 | browser-pages.json |
| 真实控件预设/选择框/键盘范围输入/恢复 | 六预设和练习2输出2；默认输出0.5 | controls.json |
| 375px页面 | scrollWidth360，无整页横向溢出、恢复默认成功 | browser-mobile.json、mobile.png |
| node .agent/semester-03/ml-03/validate.mjs | exit0；浏览器192量对独立参考，native96量 | validation.log |
| npm run check（独立HEAD+本课投影） | exit0；PASS21/WARN2/FAIL0 | check.log |
| npm run glossary:check / math:check | exit0；术语PASS3/WARN3/FAIL0、同行公式违规0 | glossary.log、math.log |
| node scripts/check-python-support.mjs | exit0；只追加本课2个可运行实验，保留旧降级 | python-policy.log |
| npm run build / npm run build:pages | 最终两次均exit0；205课/9旧路由；最终手机轴名/图例完整 | build-final.log、build-pages-final.log、mobile-chart.png |

正文SHA256：b3b7444f4ba56ab725df551aa95736e9c5cd839b6ede5c9caac2a4b5e5b31856。数值容差1e-10，组件显示8位（舍入差≤5e-9）。源代码原始setup/cell未替换；独立参考不用TS同款实现。Native与最终静态Pyodide分别验证，不把开发页面Jupyter连接失败（既有W09）写成原生UI通过。

并行边界：独立目录D:/Workspace/control-universe-rank2-ml03，页面8196、严格内核8992；未停其它会话端口。shared-check.log的共享在制FAIL4、shared-semester.log时点MPC-01缺日志真实保留，不修他课。最终以已提交HEAD叠加本课的完整投影与独立Git索引交付，未带入共享暂存区其它修改。已知QA01旧负向套件及W09/W16不关闭。两个历史全局check WARN是重复slug/历史日志债务；术语WARN见原始日志，均无FAIL。

执行修正：首轮注册键遗漏、提取字段误用、清单未生成、range fill未触发React事件、手机横轴标题靠右；分别通过守卫/真实运行/键盘事件/截图发现并修正，未将失败尝试作为成功证据。最终提交不包含临时索引和archive。

最终普通/Pages构建的隔离源码基线：d76422def1c014f4aee6706439082c9c729759f1；其后主干由其它已验收课程和回执推进，本课源hash保持不变。预签学期守卫exit0，见semester-pre-sign.log。最终提交前再按当时HEAD重投影本课共享元数据，运行check及学期守卫，不带入并行草稿。

最终投影元数据基线：bae122d38cad76d02da19513aa3aace7a9908710；与最终构建基线d76422d之间仅其它课验收/回执文档变化，无课程或运行时代码差异。最终学期守卫exit0、Python政策exit0（99课/418可运行/14保留代码）、验证脚本exit0，见final-semester.log/final-python-policy.log/final-validation.log。术语与公式最终复验退出0。shared-final-check.log保留6个共享在制不一致（他课tracker和共享统计）；本课以隔离完整投影check为准，未改他课字段来消除共享失败。

最终隔离npm run check：exit0，PASS21/WARN2/FAIL0，见final-check.log。所有必需门槛完成后签发；真实hash见下方回执。

并行DRIVING-02在暂存前进入master；首次提交保护发现HEAD已前进，未修改任何分支。已基于7d1b49bb501e57e13babeb39cbb2b130f23206c4重投影并重跑check/学期守卫，均exit0（PASS21/WARN2/FAIL0）。本课已构建源码保持不变，新增他课由其自身证据交付；本轮没有把早先整站构建冒称覆盖这次新主干源码。

真实交付回执：commit:4ed302698915b30c3228a60753bb450d13cf56ed，parent:7d1b49bb501e57e13babeb39cbb2b130f23206c4；2026-10-24正常push origin master成功。独立Git索引只含ML-03字段，分支使用预期旧HEAD的原子比较更新，HEAD推进时先中止再刷新。origin返回仓库迁移提示但推送成功，未擅改远端地址。共享正常暂存区存在其它进程的index.lock，尝试仅同步本课新增文件被Git拒绝，未执行reset、未删除锁。提交始终使用独立索引，真实工作文件存在；正常索引的旧快照可能把本课显示为虚假删除/未跟踪，未擅自清理其它会话的索引状态。未发布gh-pages，不继续ML-04。

回执前复验：以真实交付4ed3026为基线，仅补ML-03真实hash/已进入master列，隔离npm run check和check-semester03均退出0（PASS21/WARN2/FAIL0），见receipt-check.log、receipt-semester.log。
