# ROBUST-06 混合灵敏度验收

起点master d7b631f264c2c5e0590aaf45bd226fdc85c50d09；原MDX LF SHA256 1da1e9b7d70bc12c6bff267bdf4d289325481facaf9274d4f9f56b1dd7c07a3f。

仅本课，原九H2/全部标题/四题/原二Notebook四cell用途保留；rank5原生19895、fixture19995、Pages20095、内核8995，尚待验收。

## 最终验收

Phase1–4签发，九H2/全部历史标题/四题全部子问/原二Notebook四cell用途保留；现三Notebook五cell、四参数双图Explorer/SVG。原两个给定K均失稳，保留作诊断，不宣称算法优越。mixsyn调用改W1/W3/W2，Python三返回、MATLAB四返回；CL为加权栈，通用综合未执行。

| 命令/范围 | 实际结果 | 证据 |
|---|---|---|
| nb-cells verify robust/mixed-sensitivity --require-kernel --port8995 | 退出0，5cell/error0/SKIPPED0 | extracted.json、notebooks.json/log |
| 真实TS与独立reference.py | 退出0，180参数/1260频点/各4001扫描；峰驻点/时域/符号/积分 | actual-ts.json/log、reference-final.log、reconciliation.json |
| 最终Pyodide Worker | 3/3Notebook、5/5cell、codeOnly0，完整源hash匹配 | pyodide.json、pyodide-final.log、python-isolated.log |
| 原生/Pages生产构建 | 最终均退出0，无MDX编译失败 | build-final.log、pages-build-final.log |
| verify，WIKI_VERIFY_PORT19895 | 退出0，PASS9/WARN0/FAIL0/SKIPPED0 | verify-final.log |
| 两种真实页面 | HTTP200/H1=1/H2=9/KaTeX0；所有旧ID、SVG、Notebook PNG、四滑块/预设/默认恢复通过；375px文档宽375、pageerror0 | browser-native/pages.json及桌面/移动/Explorer PNG |
| 标题/数学/术语 | 全旧ID保留；math files0/tokens0；术语PASS4/WARN2/FAIL0，冻结表未命中提示保留 | headings-before/after.json、math.log、glossary.log |
| 提交投影check/semester/fix/python/glossary/math | 最新已提交master叠加仅本课，六项实际退出0；官方脚本重算outline/tracker统计 | staged-validation.json、staged-*.log |

真实TS对独立control最大误差2.84e−14，连续峰对独立control频率优化3.34e−16，1601点输出和控制信号对独立SciPy lsim4.22e−15；SymPy核名义约简与完整特征式，quad核−π积分。默认连续Ms1.2720196495、γ.7533800615；界面采样Ms1.2720159944、γ.7533784654不冒称连续值。

边界：proper名义族默认a20/k200通过误差/Ms/T10要求，控制峰仅0–8秒1601点采样2，原题未给执行器限幅，不签饱和安全。慢候选γ1.000693失败，快候选控制初值4.5；固定K的9rad/s失配α+.265724失稳，10/11稳定。三rho同一540格预算仅采样目标网格候选，不证明族内连续全局或通用H∞最优，没有Slycot/MATLAB伪造结果。

初检与纠错：一次私有原生缓存构建触发Webpack WasmHash异常，保留build-cache-attempt.log，改用新的私有dist .next-r5-r6-native-final完整构建通过，未清共享缓存或改业务代码。数学小于号紧连M被静态扫描误识为组件，改空格；预设断言误把全频.770909用作采样值，改对应采样.770908。首轮提交投影在最终源哈希刷新期间读旧Python策略，策略与最终Worker证据合并后六项退出0；原始失败日志保留。截图发现图例/标题与频率刻度拥挤，调整布局和刻度后重新双构建/页面/375px验收。

并行隔离：rank5使用19895/19995/20095/8995、私有dist与Git索引，不清共享.next/不重置默认索引。共享开工check有6项FAIL、学期表RL-02列数在途错误，后续共享check仍有他课未同步项；保留他课工作，不把整个工作树说成通过。交付以最新已提交master叠加仅本课的六项门槛为准；提交前检查HEAD并原子更新。仅本课，不发布Pages，不生产ROBUST-07。真实master提交生成后补回执。


真实master交付提交：80b5b9e1353742ff07934eba8e0e4ab2c9a1ade9。仅本课投影check/semester/fix/python/glossary/math六项退出0，原始学期CLI随回执再验；使用私有Git索引保留其他暂存，推送origin master，不发布Pages。

收尾实测：rank5独立8995内核9→0，19895/19995/20095/8995全部释放，证据kernel-cleanup.json与ports-cleanup.json；其他会话进程和共享缓存保留。
