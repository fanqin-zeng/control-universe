# RL-02 价值函数与贝尔曼方程

2026-10-24用户指定继续RL-02，rank8。唯一目标rl-control/dynamic-programming，从空占位新写；先修RL-01与math/variational-dp已交付。独立副本D:/Workspace/control-universe-rank8-rl02；候选端口8198/8998/9298/9208，启动前检查，不使用RL-01预览9198，不碰共享.next/out及其他暂存内容。

开工有大量他课草稿和暂存删除，保持原状，不将它们混入提交。提交采用最新已提交master加本课差异的独立索引；只交付RL-02，不发布Pages，不生产RL-03。未完成验收不签发。

## 本课交付内容与实测

十H2、内嵌SVG、一个双图交互Explorer、两Notebook四cell、四题四答。内容由上一课一次送餐的V/Q定义进入另设循环MDP，推导贝尔曼期望/最优方程、线性策略评估、策略改进、同步值迭代与返回向量上的残差误差界。有限状态/动作、有界奖励、gamma<1条件和gamma=1反例清楚；这是已知模型规划，没有训练神经网络或实机实验。

最终MDX SHA256：`4b65e421a1e1317aec3201e6bc82f612d9893971efa2ab5a396fb6e2ace3e37d`。

| 命令或实测 | 结果 | 版本化证据（同目录） |
|---|---|---|
| 普通 npm run build | exit0，无MDX编译失败；边界代码随后改为秩判定，最终源由下一行再编译 | build.log |
| PAGES_BUILD=1 / NEXT_PUBLIC_STATIC_EXPORT=true / NEXT_PUBLIC_BASE_PATH=/control-universe npm run build | 最终源exit0，210静态页面生成 | pages-build.log |
| WIKI_VERIFY_PORT=8198 npm run verify -- rl-control/dynamic-programming | 最终导出HTML验收exit0，全九项绿、HTTP200、H1=1/H2=10/KaTeX0 | verify-final.log；preview.mjs为仅验收清洁URL适配器，正式本地预览9208 |
| node scripts/nb-cells.mjs verify rl-control/dynamic-programming --require-kernel --port 8998 --out .agent/semester-03/rl-02/notebooks.json | 最终原始setup/cell：2Notebook4cell全部成功，EXECUTED/FAIL0/SKIPPED0 | notebooks.log/json |
| node .agent/semester-03/rl-02/reconcile.mjs | exit0；364真实TS配置对独立矩阵幂/线性系统/LP，74个有限时域LP，最大差2.1316282072803006e-14；70,602组全图轴范围内 | reconciliation.log/json、reference.py |
| 最终原始Pyodide实验 | 2实验4cell全passed，最终hash/worker与Python支持策略一致 | pyodide.json |
| 最终Pages两个全部运行 | 四段原始输出完整，gamma=1 rank1/det0，206次满足1e-8；error控制台为空 | browser-pages.json、browser-console.json |
| 控件12次记录 | 三预设、恢复、N=0/80、p/gamma/alpha各端点通过；最优模式禁用alpha，恢复后启用 | browser-controls.json |
| 375px实际浏览器与图像 | clientWidth=scrollWidth=360；两图宽294.6667/高300、SVG宽328；H2与所有目录锚点一致、无重复ID、KaTeX0 | browser-mobile.json、mobile.png、desktop.png |
| node .agent/semester-03/rl-02/validate.mjs | exit0，源hash/严格内核/独立数值/最终页面输出/375px/Python支持策略断言全部通过 | validation.log |
| npm run glossary:check | exit0，PASS3/WARN3/FAIL0；C1b/C2b既有未命中与C4其它全站文本登记，不改共享术语表消除提示 | glossary.log；隔离结果另存glossary-projection.log |
| npm run math:check | exit0，同行display定界违规0 | math.log；隔离结果另存math-projection.log |

完整Phase1–4、六组审校、六列三方对账、原九项门槛与六列红队表见本课讨论日志。数值内部abs1e-9；正文/六位读数按末位舍入，科学显示5有效位按相应精度，不把显示舍入当内部计算误差。两不同任务回报不做算法排名；策略迭代与值迭代没有不同预算的速度比较。

普通IAB原生Notebook仍有既有W09的Failed to fetch地址边界，8998严格执行与最终Pages Pyodide各自提供实际证据，不宣称W09已解除。首次Pages脚本复制与奇异矩阵演示修正见repair-record.md。开工共享check-baseline.log实际PASS17/WARN6/FAIL8来自并行暂态，不宣称全工作区绿色；本课交付门槛在最新已提交master加本课的隔离投影执行，最终记录后附。

运行期间不碰共享.next/out，保留此前9198。最终本地预览保留9208，其余本课临时服务交付后关闭；本地预览不是公网发布。真实提交hash在提交进入master后才追加。

## 签发与提交前门槛

隔离运行快照check-projection.log：PASS21/WARN2/FAIL0，exit0；两个WARN为既有跨章重复slug与历史缺讨论日志。Python支持策略python-policy.log：pass=true/96课409实验可运行/14保留代码；glossary-projection.log为PASS3/WARN3/FAIL0、math-projection.log违规0。学期投影semester-projection.json对真实仓库文件与master祖先校验，errors=[]。郑核据此签发；提交前更新到最新已提交HEAD后，check-final.log/python-policy-final.log/semester-projection.json再留最终结果。

共享目录check-shared-final.log：PASS19/WARN2/FAIL6，exit1；保留其它会话的组件/catalog/生成统计等在途修改，不为取得全工作区绿色而改它们。本课最终隔离检查与共享检查分别登记，不能混淆。真实内容提交与回执均使用独立索引，默认索引只同步未被并行独立暂存过的本课项，保留其余暂存内容。

原版validateSemester03（evidence=true，逐条调用git）完整通过的原始结果另存semester-full.json。后续最新HEAD投影由semester-projection.mjs调用同一验证器检查结构，再对所有生效证据路径/课程ID逐一检查，使用git cat-file --batch-check与git rev-list master批量验证唯一提交的存在及祖先关系，避免同一hash被重复启动数百次Git进程。等价证据检查的首次结果为errors=[]/160条记录/91个唯一提交（semester-batched.json）；未跳过文件或合入证据，不修改全局检查脚本。
