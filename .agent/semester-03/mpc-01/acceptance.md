# MPC-01 预测控制原理交付验收

2026-10-24用户指定，rank6，仅本课。按wiki-lesson-refactor与共同Phase1–4完成；不冒充外部专家或独立Agent。旧8H2、预测矩阵/增量形式/QP/LQR/终端与五题的目标均保留，删除旧实现错误与未经公平验证的排名，详见讨论日志D。

隔离：先用D:/Workspace/control-universe-rank6-mpc01工作区快照，后用D:/Workspace/control-universe-rank6-mpc01-delivery（git已提交版本+本课）验收，逐次纳入其它会话已进入master的成果。Next18196、Jupyter8996、Python夹具18396、静态预览18496；不用共享.next，不改共享端口配置。仅独立副本experimental.cpus=1限制构建并发。原生浏览器测试将8891请求路由到8996；不改运行组件源码。

| 验收命令/操作 | 退出码与实际结果 | 证据 |
|---|---|---|
| node scripts/verify-mpc01.mjs | 0；实际TS与独立SciPy BVLS 72组，max误差6.66e-16；14别名无重复或与标题碰撞；原cell独立解析核对 | reconciliation.json/log、actual-ts.json、reference.py |
| node scripts/nb-cells.mjs verify mpc/mpc-principle --require-kernel --port 8996 | 0；2Notebook/3cell/error0/SKIPPED0 | notebooks.json/log |
| 原生npm run build（独立副本） | 0；无MDX编译失败 | build.log |
| WIKI_VERIFY_PORT=18196 node scripts/verify-lesson.mjs mpc/mpc-principle | 0；PASS9/WARN0/FAIL0/SKIPPED0，HTTP200/H1=1/H2=8/KaTeX0 | verify.log |
| 原生page-audit.cjs | 0；3cell真实输出、参数操作、重置、扰动、375px、无pageerror | browser-native.json/log、截图 |
| browser-audit.cjs | 0；最终原始setup/cell经本地固定Pyodide执行，enabled2/codeOnly0 | pyodide.json |
| PAGES_BUILD=1 NEXT_PUBLIC_BASE_PATH=/control-universe NEXT_PUBLIC_STATIC_EXPORT=true npm run build | 0；最终源编译与导出；运行时资源已准备 | pages-build-final.log |
| MPC01_PAGE_URL=本地18496静态页 MPC01_AUDIT_NAME=pages node .../page-audit.cjs | 0；最终源全部3cell实际输出、14旧ID、8H2顺序、ID唯一、正确basePath图片、375px与操作均过 | browser-pages.json/log、desktop/mobile-pages.png |
| npm run math:check | 0 | math.log |
| node scripts/glossary.mjs check | 0；PASS3/WARN3/FAIL0，处置见讨论日志教学支持组 | glossary-final.log |
| node scripts/check-python-support.mjs | 0；本课哈希与浏览器证明一致 | python-policy-final.log |
| npm run check（生成大纲及统计后另跑） | 0；PASS21/WARN2/FAIL0；两WARN为存量跨章同slug与其它课缺日志，不属本课 | check-final.log、refresh-final.log |
| node scripts/check-semester03.mjs | 0；副本无.git，显式GIT_DIR指原仓库，只读核历史hash | semester-final.log |

原生页面与原生构建在兼容锚点移位前完成，Notebook/组件代码此后未变；最终源的锚点与全部代码输出由静态页面再次实测。最终静态构建源快照基于ffc674e；随后其它会话已提交课程只通过局部合成纳入目录/策略集成检查，未把他人未提交稿称为已构建。最终门槛的候选基线见delivery-base.txt。

初次快照构建被他课未完成导入阻断；改用干净候选。默认多worker构建因并行资源压力主动终止，仅终止本课PID树，单worker重跑成功。原生首轮脚本未等待内核按钮就绪已修正；静态首轮缺忽略的Pyodide资源，补齐后捕获锚点搬移重复ID，再修正并重跑最终构建和页面。失败过程保留记录，未以失败冒充通过。最终截图已人工查看，开篇从水箱具体问题引入，目录、代码和输出可读。

真实交付提交与回执在提交后登记；仅push master，不发布gh-pages。其它会话暂存内容保留，本课使用独立索引与原子HEAD检查。

最终正文LF SHA-256：63825a798635ade7cd368a9334fdcb0d06e4b0918d0bf9332001208da744d682。

真实master交付提交：2950ac78055c68d93f699427dd65c3adad01e79d。完成列据此登记，独立索引保留其它会话暂存的8个共享路径。最终目录/策略/学期检查退出0；不会将共享工作区其它未完成稿的失败记成本课失败或通过。
