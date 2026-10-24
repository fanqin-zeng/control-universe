# ROBUST-04 鲁棒性能交付证据

起点：ad91f73a2499ad184c34a1d0c8cd3434fe87c46a；旧MDX LF SHA256 65b6cd9828a4260e534797da816512d098fb6b38fd35d188493eca2c96957956。

范围：本课正文/新组件/独立数值/SVG/讨论日志/进度与Python证据；rank5使用19295/19395/19495/8995，独立构建目录和Git索引。验收待实跑。
## 最终验收

已完成Phase1–4与签发。原十H2、全部历史标题ID、四题全部子问保留；原两Notebook四cell用途保留并增加统一复算，现三Notebook五cell；新增双图Explorer和真实SVG。

| 命令/范围 | 实际结果 | 证据 |
|---|---|---|
| nb-cells verify robust/robust-performance --require-kernel --port8995 | 退出0，EXECUTED 3Notebook5cell，error0/SKIPPED0 | notebooks.json/log、extracted.json |
| 实际TS与独立reference.py | 退出0，90配置/603包络点；全500样本独立传递函数/极点；精确LFT符号恒等与完整D界复核 | actual-ts.json/log、reconciliation.json/final.log |
| 最终Pyodide Worker | 3/3Notebook、5/5cell，release codeOnly0，源hash匹配 | pyodide.json、pyodide-final.log |
| 原生/Pages生产构建 | 最终均退出0，无MDX编译错误 | build-final.log、pages-build.log |
| verify-lesson，WIKI_VERIFY_PORT19295 | 退出0，PASS9/WARN0/FAIL0/SKIPPED0 | verify-final.log |
| 两模式真实页面 | 页面200，H1=1/H2=10，KaTeX0，全旧锚点与片段、SVG、各两幅Notebook PNG、七默认读数/三滑块/严格边界9与18/19通过/恢复均过；375px文档宽375，pageerror0 | browser-native.json、browser-pages.json、桌面/移动端/Explorer PNG |
| 标题编译/数学围栏 | 全部旧ID保留，math files0/tokens0 | headings-before/after.json、math.log |
| 提交投影check/semester/math/glossary/python/fix | 完整六项逐命令结果见最终JSON；OUTLINE/tracker统计由官方脚本生成 | staged-validation.json、staged-*.log |

实际TS最大差1.12e−15；500样本独立传递响应差4.36e−14、极点差1.34e−15；已选D以Hermitian特征值复核差8.89e−16。完整有限参数LFT经九组数值回代和SymPy恒等消元双验证。

原固定PID没有实测支持旧稿0.85/0.72/1.3，本轮撤回。改可实现的滤波PID后，名义WpS网格峰4.210744，设计如实失败；没有编造综合后的控制器或μ值。全频NP+RS不推出RP由解析一阶例另行证明，性能权重We=5/(s+1)，NP范数5/11，允许扰动的加权DC5/3。完整D上界、实际失败见证、有限频率/参数观察分别解释，不拿采样通过当全集保证。

MATLAB外部模板未运行，官方接口核对不冒充综合执行。本页必需Notebook原生与Pyodide全部实跑；不核销其他课程的PY待办。权重给需求包络，不把ωb直接认作T带宽；性能满块维数n_w×n_z；实参数复外包只是充分上界；题4.9结果仅在给定频率成立。

并行现场：起始共享check有他课status/tracker/OUTLINE和统计未同步，semester有RL-02编辑中的列数错误；最终共享Python白名单也可能落后于他课未提交正文。不替他课改内容或证据。交付投影从最新已提交master叠加本课文件、自己的共享行/注册/白名单记录，官方检查全部通过后才构造提交；默认Git索引不参与构造本课提交。

初次静态预检将行内0<A和M_s<M误读为组件，已加空格修正并保留失败日志；原生初次浏览器因私有副本前端指向8891超时，修成8995后重新构建与页面全验，kernelCalls记录8995。私有Jupyter组件及dist配置不进入交付。Pages页面在本机19495验证，没有发布gh-pages。

固定端口19295/19395/19495/8995仅本会话使用；独立构建目录避免共享.next。最终截图已查看，375px无表格溢出。术语C1/C2通过，C1b/C2b仅全站表项未命中提示，不改冻结术语表。fix084记录本课规范未执行及角色归因，所有审计去向见讨论日志附录D。

真实master提交生成后追加回执，不预填hash。

真实master交付提交：b749fcc2576f8f96ae3afd64a0e3b07fc4123efd。该提交投影六项检查退出0，默认Git索引未用于构造提交；回执另记录真实hash并原始CLI复验学期进度。
