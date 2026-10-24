# MPC-04 约束处理验收

2026-10-24，用户指定MPC-04/rank6，仅交付本节。正文保留12H2、全部旧标题ID和五题全部目标，新增可行域Explorer与纵向流程SVG；修正物理界软化、有限二次罚、KKT下界/退化、14行与公共松弛5，以及旧实验未实际处理输出约束。

实际执行：`node scripts/verify-mpc04.mjs` exit0，952真实TS配置对独立HiGHS/直接递推/强对偶证书，466可行486不可行，最大KKT9.237055564881302e−14；原40QP独立矩阵幂/对偶证书，最大KKT2.5261023086642354e−6、对偶差3.962163930282259e−12。reconciliation.json/log保留原始证据。

严格`nb-cells verify ... --require-kernel --port 9036` exit0，3Notebook/6cell无error/SKIPPED；生产worker Pyodide夹具同6cell通过，无codeOnly。原始源/提取/独立执行/实际页面闭环。普通`npm run build`及带/control-universe的Pages静态构建均exit0；verify本课exit0/HTTP200/H1=1/H2=12/KaTeX0。普通与Pages真实Edge浏览器都运行三个Notebook至末格和绘图，检查旧锚点/目录目标/唯一ID/可行及空集/增量限制/复位/罚权/375px；browser-native/pages.json及截图可查。截图已实际查看。

基线与开发完成check PASS21/WARN2/FAIL0/exit0，math:check exit0，glossary PASS3/WARN3/FAIL0/exit0，既有全站WARN保留。正式提交前从最新已提交master刷新候选，只叠加本课，再执行未修改的权威plain check、semester/Python支持/fix门槛；check-final/semester-final/python-policy-final/fix-final.log为最终证据。若master并发推进则重新集成全部门槛，使用检查器已有按完整源码键的标题缓存，没有跳过检查。Phase4在门槛实际通过后签发。

测试隔离目录D:/Workspace/control-universe-rank6-mpc04，Next19096/内核9036/夹具19196/Pages19296；隔离缓存/临时索引/单核构建设置不进入生产配置。检查候选来自已提交master，不将其他会话未提交内容算成本课验收。共享Git索引及现有锁不改，提交使用独立索引及CAS；共享文件只合并本课条目。未发布Pages、不生产MPC-05。实际master提交和推送回执随后登记。
