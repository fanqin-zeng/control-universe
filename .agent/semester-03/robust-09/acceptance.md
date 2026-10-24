# ROBUST-09 H∞滤波验收

起点master 0c76b06f7c248055f6977b1ca3abd318c6fc54fe；空占位新写，无原MDX/标题/习题/实验。rank5独立20795/20895/20995/8995、dist/索引，尚待实测。


## 最终验收

Phase1–4新写签发：九H2、四题全部子问/推导、三Notebook五cell、四滑块双图/解析候选与边界按钮、真实信号SVG。准确标量模型、限定常数L族；无旧MDX/标题/实验可迁，历史URL沿用已有兼容规则，未改其它课程。

| 命令/范围 | 实际结果 | 证据 |
|---|---|---|
| nb-cells verify robust/h-infinity-filter --require-kernel --port8995 | 退出0，5cell/error0/SKIPPED0 | notebooks.json/log、extracted.json |
| 实际TS/独立reference.py | 退出0，481配置、241优化，SVD/CARE/Lyapunov/quad/SymPy | actual-ts.json/log、minimal.json、reconciliation.json/reference.log |
| Worker/Python支持 | 3/3Notebook和5/5cell通过，codeOnly0，完整MDX hash一致 | pyodide.json/log、python-isolated.log |
| 两种生产构建 | 私有native/pages均退出0，无MDX编译失败 | build.log、pages-build.log |
| verify WIKI_VERIFY_PORT20795 | 退出0，PASS9/WARN0/FAIL0/SKIPPED0 | verify.log |
| 原生/Pages真实页面 | HTTP200/H1=1/H2=9/KaTeX0、全级ID/片段、四控件/两候选/边界/恢复、375px/无pageerror | browser-native/pages.json、各PNG |
| 历史URL/SVG | 原生和静态旧URL跳canonical，SVG局部横滚/全图已查看 | browser-*.json、diagram-audit.json/PNG |
| 正常Pages后处理/官方verify-pages | 独立目录生成既有9跳转页，官方检查退出0：205课/310355251bytes | pages-postprocess.mjs/log、pages-official-verify.log |
| 数学/术语 | files0/tokens0；PASS4/WARN2/FAIL0，冻结表提示保留 | math.log、glossary.log |
| 提交投影 | 最新已提交master叠加仅本课，六门槛退出0 | staged-validation.json/staged-*.log |

数值：实际TS独立误差3.56e−15，完整尾部比值误差4.45e−15。默认a−1/q1/r.25/L4，误差极点−5/B[1,−2]，精确峰.447213595、白噪声方差.5；KalmanL1.23606798、方差.309016994、能量峰.525731112。gamma.5/p.25严格证书最大特征值−.036474508，初始误差1总能量.1≤储能.25。T.2/2/20脉冲比.271248757/.424265139/.444971909，有限见证低于精确峰。三q/r工况双目标分别解析优化，无种子筛选。a0下确界.5而L4峰.559016994；a1/L.5误差失稳不报范数/方差；Euler.4临界/.5失稳，未代签数字全链路。

边界：H∞零初值有限能量与Kalman独立Wiener增量合同分开，q/r仍需建模尺度。常值偏置非半轴L2，默认误差−.4不消失。族内最优不冒充所有动态滤波器全局最优；准确模型证书不自动抗参数失配、有色噪声、延迟、饱和或实机安全。

并行：rank5独立20795/20895/20995/8995、私有dist/cpus2/Git索引，不碰共享.next或他课暂存。开工共享check6项在途FAIL、semester的RL-02列数错误已留原始输出；仅本课投影六门槛通过。首轮UI审计将约400的DOM浮点属性按字符串比较，改为既定1e−9数值容差；原始失败native-page-first.log保留。私有next build最初未执行build:pages原有重定向后处理，静态历史路径未跳转；补同一后处理到私有导出目录后完整页面与官方verify-pages通过，未改生产基础设施或放宽课程门槛。Pages仅本地预览，不发布、不生产ROBUST-10；真实master hash随后登记。


收尾实测：rank5内核6→0，20795/20895/20995/8995四端口全部释放，见kernel-cleanup.json与ports-cleanup.json。共享工作树末次check仍因并行在途元数据退出1（6项FAIL），semester因RL-02列数退出1；本课仅以最新已提交master加本课的投影六项验收，不带入他课在途修改。
