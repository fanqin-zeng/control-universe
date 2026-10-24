# MPC-02 预测模型

2026-10-24用户明确指定继续MPC-02，rank6；本课为原稿重构，只交付mpc/prediction-model。顺序例外逐课登记，不继承MPC-01授权；其它会话继续生产其课程。

起点commit/hash/H2见baseline.json，原稿source-before.mdx完整留存；本课日志 `docs/discuss-log/semester-03/12-mpc/02-prediction-model.md`，按Phase1规划→Phase2三轮→Phase3六组及实际门槛→Phase4签发形成。保留10H2/全部旧标题ID、三类模型、辨识/失配/拓展和五题全部目标；不迁移、不拆分其它课。

隔离副本D:/Workspace/control-universe-rank6-mpc02；普通服务18296、内核8996、Pyodide夹具18396、静态预览18596。忽略的public/pyodide先复制；node_modules为只读依赖junction；Next的cpus1为隔离环境设置，不提交。未清共享.next、未使用原Git索引，所有服务只关闭本任务会话。测试专用Playwright路由将8891/8981转8996，未改生产端口文件。

## 实际验收

| 命令/检查 | 结果 | 原始证据 |
|---|---|---|
| npm run build | exit0，无MDX编译错误，210/210静态页 | build.log |
| PAGES_BUILD=1 NEXT_PUBLIC_BASE_PATH=/control-universe NEXT_PUBLIC_STATIC_EXPORT=true npm run build | exit0，210/210，Pyodide资源在导出中 | pages-build.log |
| WIKI_VERIFY_PORT=18296 npm run verify -- mpc/prediction-model | exit0，HTTP200/H1=1/H2=10/katex-error0 | verify.log |
| node scripts/nb-cells.mjs verify mpc/prediction-model --require-kernel --port 8996 | exit0，2Notebook/6cell/error0，S6无SKIPPED | notebooks.log/json |
| node scripts/verify-mpc02.mjs | exit0，440组实际TS对独立Fraction，最大差1.5543122344752192e−15；二阶ZOH对连续状态块指数 | reconciliation-run.log/json；reference.py |
| Pyodide生产worker实际执行最终sourceHash | 2Notebook/6cell全passed，无codeOnly | pyodide.json、pyodide.log、browser-audit.cjs |
| 普通生产浏览器/静态Pages浏览器 | 各exit0；实际六格运行至最后秩3，响应图已显示，滑块/复位/截断边界均通过 | browser-native.json/log、browser-pages.json/log、page-audit.cjs |
| DOM与375px | 10H2；全部旧ID/目录链接存在；无重复ID、katex-error或pageerror；宽375/375 | browser-*.json、desktop-top-*.png、mobile-*.png、explorer-pages.png |
| npm run math:check | exit0，files0/tokens0 | math.log |
| npm run glossary:check | exit0，PASS3/WARN3/FAIL0；既有全站WARN不改他课 | glossary.log |
| node scripts/check-python-support.mjs | 最终集成pass true；本课两实验enabled，其余待办由并行会话维护 | python-policy-final.log |

主例预测[1.125,1.3125,1.15625,1.078125]；自由响应[.625,.5625,.53125,.515625]。默认与零未来增量精确重合，a.9/M2截断误差.044145。题解一阶系数.8464817248906141/.30703655021877174；二阶ZOH分子.019412675398669362/.018901196356017884，分母[1,−1.8848024746319485,.9231163463866359]。正文显示取舍和噪声/历史限制，不作控制器性能排名。

## 集成与交接

最终全局check/semester/fix门槛见check-final.log、semester-final.log、fix-final.log；提交前读取最新master并重放本课共享行，scope.json列确切提交路径。构建与浏览器对应起点快照加本课代码；之后刷新其它会话已提交内容，只重跑全局元数据/支持清单/独立数值门槛，不冒称对并行新课重新构建。正文最终sourceHash与Pyodide proof匹配。

fix记录路径见fix-record.txt，明确归因既有检查未执行；独立中文润色PLAN只移交本课“已生产/待润色”，未代做专项润色。没有公开Pages发布；不继续生产MPC-03。master真实交付hash在提交后写commit.txt和全局checklist，推送完成后追加回执。

## master实际交付回执

真实交付提交：`3b54cd51cf71de061cebc1995d066d865a0ebbec`，已进入master，`git push origin master`返回Everything up-to-date（并行会话已推送包含本课的共同历史）。最终集成使用未修改的scripts/check-catalog.mjs执行修复生成后plain检查，PASS21/WARN2/FAIL0；同进程仅复用该模块已有、以课程与完整源串为键的标题缓存，无跳过检查或伪造输出。semester/python-support/fix门槛均退出0。

Git原索引整理阶段遇到另一会话index.lock，交付commit已成功；通过祖先关系和提交树确认后，仅刷新仍等于旧parent的本课索引项，未删除锁、未重置或带入其它暂存内容。普通/Pages构建及两种页面实跑对应正文最终指纹；并行后续新课只纳入集成元数据检查，不冒称本课重建了它们。rank6四个测试服务均已关闭，临时端口释放；未推送gh-pages。
