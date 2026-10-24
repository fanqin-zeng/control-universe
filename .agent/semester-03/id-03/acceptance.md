# ID-03 最小二乘辨识

2026-10-24用户指定ID-03，rank3。开工HEAD52cfac9；本课空占位新写，不沿用旧正文。仅交付本课，先修ID-02、矩阵分解、概率基础均已交付。并行会话大量文件保留；开工check-before.log的FAIL为并行未完成注册/统计，不冒充通过。

范围：批量ARX最小二乘、带先验加权目标与RLS、遗忘/秩亏/协方差膨胀/变量含误差/闭环相关/控制分母边界。一Explorer为已知水箱保留系数a时仅估计b的条件子问题，不能当作未知a/b同时辨识。原自适应课仅补反向链接，其原推导、代码、习题不删；不重新签发该课。补链接导致源hash变化时实跑其浏览器Notebook更新对应证明。

隔离副本D:/Workspace/control-universe-rank3-id03；实用8993内核、18193原生页、18393浏览器实验夹具、18493 Pages预览，使用前检查空闲。不改共享.next/端口脚本，不停他人进程；共享暂存区另有并行修改，使用本任务专用索引，只提交本课差异，推master不发布Pages。

交付：10节正文、4题含答案、3 Notebook/4 cell、1 Explorer、1 SVG、四阶段讨论日志；catalog、双tracker、自动OUTLINE、术语、Python策略与证明同步。原自适应课只增加反向链接，其10 Notebook/39 cell按原代码全部重跑通过，非另一课内容交付。

| 实际验收 | 结果 | 原始证据（本目录） |
|---|---|---|
| 独立信息累加/分数逆解对实际TS及原始cell | 231配置、45,934量，maxError2.842170943040401e-14<1e-10；6类非法输入拒绝 | reconciliation.json、reference.py、actual-ts.json |
| 严格内核执行 | exit0；3 Notebook/4cell；EXECUTED，无SKIPPED | notebooks.log/json |
| 浏览器Worker | 本课3/4及原课10/39全部passed；13实验43cell均enabled | pyodide.json、adaptive-nb-1…10.json、adaptive-pyodide.json、pyodide-combined.json |
| 页面验收 | exit0；HTTP200、H1=1、H2=10、KaTeX0；WARN1为后续空课进一步阅读 | verify.log |
| 原生/Pages真实页面 | 两页全部运行、4预设、λ上界/恢复、DOM/TOC/ID、图片、375px手机均pass，无pageerror | browser-native.json、browser-pages.json及截图 |
| 生产/Pages构建 | 两次exit0、无MDX编译失败；按df72d0a隔离基线另复验 | build.log、pages-build.log、final-build.log、final-pages-build.log |
| 最终目录门槛 | exit0；PASS21/WARN2/FAIL0，已登记全站告警 | final-check.log |
| 学期3、Python策略 | exit0，98课策略hash一致，416enabled/14codeOnly | final-semester.log、python-support.log |
| 术语/公式 | exit0；术语PASS3/WARN3/FAIL0；公式files0/tokens0 | final-glossary.log、final-math.log |
| 证据交叉检查 | pass=true，两课源hash/代码保留/实际页/数值均核 | validation.log、validate.mjs |

本课sourceHash `0bcc1a6463d433fa2f9cdea21e1d2e0f148f67a6f3a8bf47497e5f4835a35d43`；互链旧课 `95b3bd2eb380c7fa0b3674889229b46ba4f0dda6b1fe9376bdcd9a9149618a59`；Worker `c2240df9b66c9edb1c9589b37bfef9c68cd8f1e65166e4166577fd8fed6368f3`。未冒充共享工作区所有并行草稿通过。

全课旧Notebook首次600秒预算超时（pyodide.log），失败如实保留；改逐Notebook清洁Worker后全部通过。脚本初次发现Windows默认GBK解码与CRLF比较问题，固定UTF-8、仅换行归一化后重验通过，未改实验代码。手机图例重叠与注册对象漏项已修复并重测。最终全站术语WARN为既有覆盖线索和max/min漏斜杠提示；不将其冒充本课数值错误。

最终基线若因其他会话推进则重新叠加本课元数据并执行check/学期/Python策略门槛；无关课程使用各自交付验收，不重写其源码或撤销其提交。签发与数值详见讨论日志，真实提交后在下方登记hash。

真实交付提交：`d76422def1c014f4aee6706439082c9c729759f1`，已进入master。共享Git索引未改；通过专用索引和master旧值比较后原子更新。最终门槛针对0deee62加本课，check PASS21/WARN2/FAIL0、Python98课/416enabled/14codeOnly；构建df72d0a加本课的源与交互不变，后续APP-01/EST-02保留各自已验证提交。
