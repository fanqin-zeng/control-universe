# ROBUST-01 鲁棒性：交付验收

2026-10-24用户指定继续ROBUST-01，rank5。重构一课；已走Phase1–4。保留10H2、全部四题子问与原三组实验用途，新增共振交互、信号SVG及习题复算Notebook。纠正GM/dB、超调、最近距离圆、M_S裕度关系、连续范数/网格、小增益前提、LQR边界和题1精确根式。

起点HEAD 28e24b075cdf4ed81458fca671fe2e923ef311fb；旧LF正文SHA256见baseline.mdx.txt与讨论日志审计，旧文不覆盖。构建冻结基线9c11c8b7567cb959a4ebca16d7f1360b9f6c6c81，加本课增量；后续ID-02提交独立保留，最终提交树另验。

隔离副本D:/Workspace/control-universe-rank5-robust01；严格内核8995、最终原生页18295、Pyodide实验18395、最终静态预览18595。最初18195/18495服务退役或保留检查点，未停止其他会话进程。未改共享端口脚本、未清理共享.next；本课构建cpus1，独立.next-final/.next-pages。GitHub Pages仅本地验收，不发布gh-pages。

| 命令/操作 | 退出码与实际结果 | 证据 |
|---|---|---|
| node scripts/verify-robustness-concept.cjs | 0，实际TS九配置，独立Python对复数频响绝对1e-9 | component-values.json/reconciliation.json |
| python .agent/semester-03/robust-01/reference.py | 0，原始cell+独立留数、交越方程、连续标量优化、SymPy精确核验 | reconciliation.log/json |
| node scripts/nb-cells.mjs verify robust/robustness-concept --require-kernel --port 8995 | 0，四Notebook四cell，error0/SKIPPED0 | notebooks.log/json |
| node .agent/semester-03/robust-01/browser-audit.cjs | 0，Pyodide四Notebook四cell全部放行，最终sourceHash一致 | pyodide.log/json |
| 隔离副本RANK5_DIST=.next-final npm run build | 0，无MDX编译失败 | build-final.log |
| WIKI_VERIFY_PORT=18295 node scripts/verify-lesson.mjs robust/robustness-concept --root 隔离副本 | 0，PASS9/WARN0/FAIL0，HTTP200/H2=10/KaTeX0 | verify-final.log |
| ROBUST01_PAGE_URL=原生18295 node .agent/semester-03/robust-01/page-audit.cjs | 0，全部原始代码输出、旧锚点、默认值、两滑块/恢复、375px、无pageerror | browser-native-final.log/browser-native.json及PNG |
| 隔离副本PAGES_BUILD=1 NEXT_PUBLIC_STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/control-universe RANK5_DIST=.next-pages npm run build | 0，静态导出通过；输出目录.next-pages | pages-build.log |
| ROBUST01_PAGE_URL=静态18595/基路径 node .agent/semester-03/robust-01/pages-audit.cjs | 0，四cell输出、basePath图片/worker、桌面/375px全部过 | browser-pages.log/json及PNG |
| 隔离副本node scripts/check-python-support.mjs | 0，85课/383启用/15代码展示（构建基线口径） | python-policy-isolated.log |
| npm run math:check | 0，files0/tokens0 | math.log |
| 隔离副本node scripts/glossary.mjs check | 0，PASS3/WARN2/FAIL0；共享额外术语WARN保留 | glossary-isolated.log |
| 隔离副本npm run check | 0，PASS21/WARN2/FAIL0，WARN均既有登记 | check-isolated.log |

正文断言详见日志A.1共23组：默认连续Ms1.312022973、Mt1.514520935、共振300的同频乘积范数.927946024；前端1601点网格.927541591，明确区分口径。题1正确精确式sqrt((11+5sqrt5)/6)=1.922686484。没有真实电机数据、硬件部署或性能排名声明。

PY-018已按实跑关闭，其它任务ID/原因/处置保留；S04本课Notebook债务已由原生严格执行和Pyodide解除。共享工作区检查可能因并行未完成课的元数据、组件和顺序例外暂时失败，均不修改他课以制造全绿；最终提交隔离检查另记下方。

生产构建既有ESLint警告来自未修改基础组件，未声称全仓零警告。首轮副本缺并行组件、按钮就绪等待、题1根式返修、移动表格溢出、误指out目录等过程与处理见日志B；最终成功输出是另行实跑结果。

最终正文LF SHA256：b77652040c14cf0e4152b97ab4a191f638e7bb789d5b406e12f2b5711e798634.

master真实提交回执待生成后补录；未预填hash。

提交隔离：以52cfac9b01bcd5b89f01d9bdd77b96ea54982ffa为基线只叠加本课改动。staged-check/semester/math/glossary/python均退出0。全局fix编号072已被并行MPC-01未提交详情占用，因此隔离提交将072登记为预留待核，保留本课073；共享工作区已有实际072详情和索引，不改写它，待MPC归档时替换预留。该处修正后staged-fix复验结果见对应日志。刷新大纲/统计首跑退出1仅表示修复前统计差异，后续check退出0。

真实master交付提交：3dbce418c0e2cf0bf1e797bb625f6e3df9ddeb46。最终提交隔离的check/semester/math/glossary/python/fix六项均退出0，原始staged-validation.json与staged-*.log对应本课提交树基线。默认Git索引旧空锁经独占打开确认无进程持有且已持续超过4分钟，移至.git下隔离保存后重试；只同步本课未被其它会话另行暂存的条目，其它会话暂存保持。此后补录本回执，不发布gh-pages。

真实master交付提交：3dbce418c0e2cf0bf1e797bb625f6e3df9ddeb46。最终提交隔离的check/semester/math/glossary/python/fix六项均退出0，原始staged-validation.json与staged-*.log对应本课提交树基线。默认Git索引旧空锁经独占打开确认无进程持有且已持续超过4分钟，移至.git下隔离保存后重试；只同步本课未被其它会话另行暂存的条目，其它会话暂存保持。此后补录本回执，不发布gh-pages。
