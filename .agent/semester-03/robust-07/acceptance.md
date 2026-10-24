# ROBUST-07 结构奇异值验收

起点master 76cf6cd2920432841ced965a3763041b3a33c63e；计划新写，原仅empty占位，无旧MDX/历史锚点/实验。

仅本课；rank5原生20195/fixture20295/Pages20395/Jupyter8995及独立dist/index。Phase1已落盘，尚待实测签发。相邻ROBUST-08旧文错误登记RB08，未修改该课。

## 最终验收

Phase1–4签发，新写九H2、四题全部子问/关键推导、三Notebook五cell、四滑块/两结构双图与真实SVG。起点仅empty占位，无旧MDX/标题/实验可迁。固定教学返回模型与完整标量性能增广，不借新课重构相邻mu-synthesis。

| 命令/范围 | 实际结果 | 证据 |
|---|---|---|
| nb-cells verify robust/mu-analysis --require-kernel --port8995 | 退出0，5cell/error0/SKIPPED0 | extracted.json、notebooks.json/log |
| 实际TS与独立reference.py | 退出0，960配置、784非退化见证；SVD/eig/control正反馈/SymPy核对 | actual-ts.json/log、reference-final.log、reconciliation.json |
| Pyodide Worker | 3/3Notebook、5/5cell通过、codeOnly0、完整源hash一致 | pyodide.json/log、python-isolated.log |
| 两种生产构建 | 最终均退出0，无MDX编译失败，独立dist | build-final.log、pages-build-final.log |
| verify WIKI_VERIFY_PORT20195 | 退出0，PASS9/WARN0/FAIL0/SKIPPED0 | verify-final.log |
| 原生/Pages实际页面 | HTTP200/H1=1/H2=9/KaTeX0；全编译ID/片段、SVG、Notebook PNG、四控件/结构切换/full合法D/预设恢复；375px宽375、pageerror0 | browser-native/pages.json及PNG |
| 数学/术语 | files0/tokens0；PASS4/WARN2/FAIL0，冻结表未命中提示保留 | math.log、glossary.log |
| 提交投影check/semester/fix/python/glossary/math | 最新已提交master叠加仅本课，六项退出0，官方重算outline/tracker统计 | staged-validation.json、staged-*.log |

数值：真实TS对独立算法最大差5.33e−15，784个结构合法致奇异见证最小奇异值残差最大3.52e−16。默认diagμ.5/fullμ2、合法D上界.5，半径2/.5；Δ=I极点−.5/−1.5，full范数.6的扰动产生+.2极点。c.5为零极点边界，c.8真实失稳；三角μ0不冒称任意性能合格。单频ω1 μ.353553/半径2.828427与全频半径2明确区分。性能q.4/.6/.8的物理稳定半径始终2.5，增广μ峰.8/1/1.2，完整非对角耦合保留。实i反例与实重复块DC不连续例不冒充通用solver。

科学边界：所有全频峰来自可解析特殊模型/合法D全频上界与DC见证，不是网格图证明；一般μ只谈上下界，未运行MATLAB mussv或通用实/混合μ求解器。实例非实机辨识，不做μ综合或功能安全承诺。相邻ROBUST-08旧文结构独立性/实μ通用ρ界/D块错误仅登记RB08待办，不改其正文、不代签。

显示收尾：参考线标签靠图边，移到图内；两轴裁切范围改清楚，模型和完整MDX哈希未变，重新双构建/两种页面和375px测试，最终截图已查看。无限半径在标准JSON中用null及说明，不输出非标准Infinity。

并行：rank5独立20195/20295/20395/8995、私有dist与Git索引；不清共享.next、不重置默认索引。开工共享check有6项FAIL、学期表RL-02在途列数错误，保留他课检查点；提交用最新已提交master叠加仅本课检查，不把整个脏工作树说成通过。仅本课，不发布Pages，不生产ROBUST-08；实际master提交后补回执。

提交元数据收尾：并行master已交付全部前课，辅助脚本动态重算暂缓列表生成空项，首轮已签发投影的学期检查退出1；现保留开工时ML-09/ID-09的有效历史顺序例外，不更改校验器/课程内容，重新执行六门槛。
