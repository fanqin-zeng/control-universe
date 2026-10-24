# ID-07 子空间辨识

2026-10-24用户指定rank3继续本课；新写，按wiki-lesson-new与既有Phase1–4。先修最小二乘辨识、可控可观、矩阵分解均已交付。只交付ID-07。

正文373行/11H2、4题/4答案、3Notebook/3cell、1React Explorer、1SVG。覆盖Markov参数/Hankel低秩、ERA错位实现、相似变换、弱模态与数值秩、一般输入QR消去、移位/联合回归、独立验证与噪声边界。明确未实施完整随机N4SID，教学数据不冒充真实设备试验。

隔离目录D:/Workspace/control-universe-rank3-id07；内核与原生动态空闲端口，fixture/Pages绑定端口0并核PID/根目录，见ports.json及port回执。共享.next、固定8080/8891、他人修改和暂存保留。开工共享check PASS19/WARN2/FAIL7，原始opening-check.log；最终以最新HEAD叠本课验收，不把共享草稿称为全站通过。

| 验收 | 实际结果 | 本目录证据 |
|---|---|---|
| 实际TS与独立SVD | 288配置/13350量，maxError6.850076061937216e-14<1e-9；15非法输入拒绝；对称Jacobi vs NumPy直接SVD，比较不变量不比较任意基符号 | actual-ts.json/log、reference.py、reconciliation.json/log |
| 一般输入独立审计 | 总15370量，maxError1.9301823264705753e-9<1e-8；解析传函、伪逆投影与OXP恒等式；256成功验证RMSE经ss2tf/lfilter复核，32无噪声三阶拒绝 | reconciliation.json/log、raw-python-output.txt、summaries.json |
| 实际浏览器数值 | 315分布读数及缺失掩码对参考，maxError8.541111949644797e-10<1e-9 | browser-numeric.json、pyodide.json |
| 原始严格内核 | EXECUTED，3Notebook/3cell、error0、SKIPPED0，exit0 | notebooks.json/log、numeric-commands.json |
| 最终源码Worker | 3/3 passed且enabled；实际抓取Worker hash，非模拟执行 | pyodide.json/log、worker-served.json |
| 双构建 | 最终散点/图例视觉修正后原生与Pages各exit0，无MDX编译失败 | build/pages-commands.json、build.log/pages-build.log |
| 单课verify | exit0，HTTP200、11H2、KaTeX0、习题/答案与前端规范通过 | verify.log、verify-commands.json |
| 两实际页面 | 全部Notebook运行、6预设、控件端点/拒绝/恢复、实际标题ID/目录/重复ID、SVG与两个canvas、375px均过，pageerror0；截图已查看 | browser-native/pages.json/log、各截图 |
| 目录与学期 | check PASS21/WARN2/FAIL0；学期exit0，最终v1.3切换后重跑 | final-check.log、final-semester.log、check-commands.json |
| Python策略/术语/公式 | 策略exit0；术语PASS4/WARN2/FAIL0，公式files0/tokens0 | python-policy.log、final-glossary.log、final-math.log |
| 证据交叉核 | 最终sourceHash/原始cell、实际Worker、双页DOM/控件与SVG字节、所有退出码 | validate.mjs、validation.log |

最终sourceHash `f03895f2a0bfd4e4b7d05e5aa11fc431e2920a88c2ef59be622ff45f2cce1992`。Worker以worker-served.json和pyodide.json相同值为准。源与cell只归一化CRLF/LF。构建基线build-base.txt，最终目录/策略基线scope-base.txt；保留并行已提交课程，不纳入他人草稿。

M2分开两条独立路线的误差与容差，不用ERA小误差掩盖传函转换差异。三噪声/三候选/32种子完整披露；无噪声三阶拒绝，不伪造低误差；20点脉冲含前8个拟合点，与独立128点记录分开。

讨论日志含A.1六列表逐断言、B原九项加四附加门槛、C六列放行及D实际修正。对数柱状图在手机复核后改散点，最终两模式重新构建并实际全量运行，不沿用旧截图。

资源回收：自己的6个kernel DELETE后余0，内核/夹具核PID后关闭；原生、Pages与浏览器finally关闭，见kernels-closed.json/resources-closed.json。私有Git索引与CAS保留共享暂存，正常push master，不发布Pages。真实提交后补hash回执。

真实交付提交：`d931844104fe97b7b06598ecacef73b961f4d930`，已进入master。共享Git索引保留，本课使用私有索引与master旧值比较后原子更新；回执补充最终检查输出。
