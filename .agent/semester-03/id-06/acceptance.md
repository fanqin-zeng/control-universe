# ID-06 频域辨识

2026-10-24，rank3，用户指定新写本课。按wiki-lesson-new与既有Phase1–4完成；只交付ID-06。先修模型结构、频域分析、随机过程、频域校正均已交付。

交付正文285行/11H2、4题/4答案、3Notebook/3cell、1React Explorer、1测量链SVG。内容覆盖DFT与周期条件、H1互谱方向、平方相干度、泄漏/窗口/补零及噪声位置。单段相干度恒1与无激励拒绝作为边界；32种子完整披露，不宣称平均必胜、Hann通用占优或用高相干替代模型审查。

隔离目录D:/Workspace/control-universe-rank3-id06；内核/native动态空闲端口，fixture/Pages绑定端口0并核PID与根目录；ports.json及两个port回执保留。共享.next、端口脚本与他人暂存内容保留。开工共享check PASS19/WARN2/FAIL7来自并行未同步项；最终基于HEAD叠本课隔离验收，不把共享工作区称为全站通过。

| 验收 | 实际结果 | 本目录证据 |
|---|---|---|
| 实际TS与独立Python/解析 | 216配置、288重复误差、241168量，maxError6.821210263296962e-13<1e-10；16非法输入拒绝；周期递推/直接DFT对圆周FFT乘G，窗另用有限几何级数 | actual-ts.json/log、reference.py、reconciliation.json/log |
| 浏览器数值输出 | 315项分布读数对独立核过的参考，maxError2.7755575615628914e-16<1e-10 | browser-numeric.json、pyodide.json |
| 原始严格内核 | EXECUTED，3Notebook/3cell，error0、SKIPPED0、exit0 | notebooks.json/log、numeric-commands.json |
| 最终源码Worker | 3/3 passed且enabled；实际抓取Worker hash比对；无模拟执行 | pyodide.json/log、worker-served.json |
| 原生与Pages构建 | 两次exit0，无MDX编译失败 | build/pages-commands.json、build.log/pages-build.log |
| 单课verify | exit0，HTTP200、11H2、KaTeX0、习题答案与前端规范通过 | verify-commands.json、verify.log |
| 两实际页面 | 全部Notebook运行，6预设、控件端点、缺线/恢复、实际标题ID/目录/重复ID、图像加载与375px均过，pageerror0 | browser-native/pages.json/log、desktop/mobile/diagram/controls截图 |
| 全局与学期 | check PASS21/WARN2/FAIL0，学期exit0；catalog最终v1.3前后均需通过 | final-check.log、final-semester.log、check-commands.json |
| Python策略 | exit0；仅添加本课完整源码hash对应记录 | python-policy.log |
| 术语/公式 | 术语PASS4/WARN2/FAIL0，公式files0/tokens0；已有WARN保留 | final-glossary.log、final-math.log |
| 交叉证据 | 最终sourceHash、原始cell、实际双页DOM与SVG字节、所有退出码核对 | validate.mjs、validation.log |

最终sourceHash `54e6f61d1f0a336e5ab3dfc727d013dfe71f8f09e2a39359a0fb42ef6e0ca158`。Worker取worker-served.json与pyodide.json相同值；源与cell只归一化CRLF/LF后比较。构建基线见build-base.txt，提交前目录/策略基线见scope-base.txt，保留并行已提交课程；不带入他人草稿。

讨论日志包括A.1逐断言六列表、B原九项及四附加门槛、C六列红队放行与D实施记录。窗两工况只作为限定观察，未冒充满足通用方法排名的三工况。首次缺策略证明的失败不算通过，最终证明合入后重验。

资源已回收：自己的3个kernel DELETE至0，内核与夹具服务校验PID后关闭；原生/Pages和浏览器均finally关闭，见kernels-closed.json/resources-closed.json。使用私有Git索引与CAS保留他人暂存，验收后正常push master，不发布Pages。真实提交后另登记回执。
