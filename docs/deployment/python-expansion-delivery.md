# DEP04 交付记录

2026-10-17；用户授权本地验收通过后直接发布本工作包至 gh-pages。工作包 wp/pyodide-expansion，起点 master 915f100。

范围：全部含 Python notebook 的课程；仅执行基础设施、实验白名单、提示、验收与计划台账。课程数学内容、默认算法、catalog 与交付状态未改动（git diff --exit-code -- content 返回 0）。两份 proofreading 用户修改保持原样，不纳入提交。

## 本地结论

53课 / 183实验 / 356单元格全部纳入盘点。完整原始执行结果见 python-expansion-full-run.json；当前证据集合 python-expansion-local.json 另经传递函数单课复验合并验证。155实验完整执行成功，另2个数学字形警告未放行：最终153实验/314单元格启用，30实验保留代码。32课全部、12课部分、9课全部代码展示。153个启用实验无 Python 异常或缺字警告；并不声明这些课程已重新完成内容重构。

待办：18项ipywidgets、1项cvxpy/求解器、9项代码或库接口异常、2项字体。逐项来源、原始原因与处置建议见 python-expansion.md / python-expansion-pending.json。Slycot仍在独立合成测试中明确不可用；不按课程名称虚构Slycot阻塞项。

## 实际验收

| 命令 / 检查 | 结果 | 证据 |
|---|---|---|
| 浏览器 python-expansion.html 逐课原代码执行 | 完成53课；328个单元格实际执行（含9个异常单元格），144张PNG | python-expansion-full-run.json / local.json / audit.png |
| 字体问题定位及单课复验 | 中文正常显示；未覆盖的ẋ与下标字符2项明确降级 | initial-partial.json / font-partial.json / font-probe.json / font.png |
| 数学参考输出 / 控制库数值 / Slycot探测 | 30/30符合预期（含6个负例），Slycot安装失败明确记录 | python-expansion-probes.json |
| node scripts/finalize-python-support.mjs + write-python-expansion-report.mjs + check-python-support.mjs | 退出码0；153启用 / 30代码展示；源哈希、Worker哈希、完整单元格与显示门槛核对 | lib/python-support.json / python-expansion-pending.json |
| 单课诊断页面与 --merge | 传递函数2实验执行、显示门槛均通过；仅合并该课记录，其余课程哈希不变 | python-expansion-single-rerun.json / local.json.provenance |
| npm run build | 退出码0，正常Next/Jupyter模式可构建 | python-expansion-local-build.log |
| npm run build:pages | 退出码0；205课程、9旧入口及153/30渲染模式逐页核对通过 | python-expansion-pages-build.log |
| 静态诊断页ESM模块更新后同步public文件至out，再运行 node scripts/verify-pages.mjs | 退出码0，296880755字节；只更新独立诊断页，课程JS/HTML未变化。云端全新构建会自动复制这些public文件 | python-expansion-static-audit.json |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | 退出码0，14/14；含混合课程、未知默认展示、缺字不放行、缓存版本、旧Worker错误不杀新Worker | python-expansion-tests.log |
| npx tsc --noEmit | 退出码0 | 本次工具实际输出 |
| npm run check | 退出码0，PASS21/WARN2/FAIL0，原2项WARN未变 | python-expansion-check.log |
| node scripts/check-semester03.mjs | 退出码0；DEP04本地阶段仍待远端发布，不提前勾选 | python-expansion-checklist.log |
| 实际静态课程界面 | 稳定性实验输出PNG与中文；频域3运行/3展示，降级块运行按钮0；cvxpy与字形提示明确；控制台error/warn=0 | python-expansion-ui.json / page-plot.png |
| npm run verify -- math/calculus-basics classic/stability-analysis classic/frequency-domain-analysis robust/robust-stability modern/modern-case-study | 退出码1，仅频域/现代案例两课历史ipywidgets的第3项失败；5课的HTTP/H1/H2/KaTeX全部通过，无非债务FAIL。已在本任务明确保留这些原代码并禁用浏览器运行，不修改校验器、不得解释为课程质量重构通过 | python-expansion-local-verify.log |
| npm run verify -- math/calculus-basics classic/stability-analysis robust/robust-stability | 退出码0；存量WARN保留 | python-expansion-local-verify-green.log |

纯静态服务器仅提供文件，验收不使用本地Jupyter代理。原开发模式已恢复8080；Python网关保持原本机模式。代码展示区要求在具备相应依赖的原生环境中复核，不保证旧代码只换执行地点就能正确。

资源固定Pyodide0.27.7 / control0.10.2，26个文件68056804字节（约65MiB），SHA256校验。同源新增Noto中文字体和SIL OFL许可，源固定notofonts提交f8d157532fbfaeda587e826d4cd5b21a49186f7c。Windows字体族名映射到Noto，保留字号等属性；inline后端映射Agg/PNG，未替换数值算法。WorkerURL携带源码版本，版本变化重建，不复用旧缓存内核。

## 发布

本地执行功能验收通过；两项严格verify源级失败是用户明确要求保留展示的既有ipywidgets债务，已登记到待办，不声称修复课程。按本次授权发布此工作包；待记录远端SHA、Actions成功和公网模式/运行复验后勾选DEP04。


## 首次扩展发布完成

源码提交0c915e4，--no-ff合入master为6e9d3a4，再合入gh-pages为745514aa3107b00b1a65a2b42979af13e81abcb4；两分支推送均退出码0。Actions [39035517804](https://github.com/fanqing-zeng/control-universe/actions/runs/39035517804) 的build/deploy均success，原始状态见python-expansion-public-actions.json。

公网release.json精确匹配745514a…，sourceDirty=false，pythonExecution=browser-verified-notebooks。命令 node scripts/verify-public-pages.mjs 745514aa3107b00b1a65a2b42979af13e81abcb4 docs/deployment/python-expansion-public-http.json 返回0：235次成功请求，205课/9旧入口/资源通过，未知路径404；逐页核对运行/代码展示数量与Worker版本。公网Worker的归一化SHA256与本地全量审计一致。Worker JS、质量门槛MJS模块、中文字体均200且MIME正确，见python-expansion-public-assets.json。

公网独立复跑频域课，3个可运行实验完整执行、3个widgets实验保留代码；见python-expansion-public-rerun.json。实际课程页稳定性实验输出PNG和中文，混合页无降级运行按钮；cvxpy、缺字、旧绘图接口原因均明确展示，两个浏览器控制台error/warn=0，见python-expansion-public-ui.json / python-expansion-public-plot.png。

DEP04完成，待办30项保留，不将本次平台交付算作课程内容重构完成。仅记录更新不触发发布；首轮公网截图另发现实验文字继承主题后过浅，已增加白底深色文字兜底，并按同一工作包授权追加发布显示修正。后续上线仍需用户逐次授权，本次条件授权仅覆盖本工作包。


### 公网显示修正

原生/静态Python运行策略、Worker、课程源码与153/30清单不变；只给可运行区和代码展示区补显式背景、标题、正文、标签和输出颜色，避免继承主题后文字过浅。14项回归通过，重新完成Pages构建；证据见python-expansion-contrast-tests.log / contrast-build.log。追加发布SHA与最终公网截图随后登记。

实验区外的旧正文在当前主题下仍存在浅色文字，已在R01记录另行审查，未将此次局部颜色兜底宣称为全站主题修复。

### 最终发布验收

显示修正提交5a11816，经master合并e026f77后发布到gh-pages：c96d0728d93c9121deee98086425004c34261004。Actions [39036591940](https://github.com/fanqing-zeng/control-universe/actions/runs/39036591940) 的build/deploy均success，见python-expansion-final-public-actions.json。

`node scripts/verify-public-pages.mjs c96d0728d93c9121deee98086425004c34261004 docs/deployment/python-expansion-final-public-http.json` 退出码0：235次请求通过，205课程、9旧入口及资源核对通过，未知路径404，release精确匹配且sourceDirty=false。公网稳定性课程重新执行完成，生成1张PNG并输出稳定范围0<K<6，控制台error/warn=0。运行区与代码展示区均白底深色文字，降级块运行按钮0；见python-expansion-final-public-ui.json / python-expansion-final-public-plot.png。Worker及153/30策略未变，沿用完整53课实跑证据。

`node scripts/check-semester03.mjs` 与 `node scripts/check-python-support.mjs` 均退出码0（25任务/22完成，53课/153运行/30展示）。本次最终记录仅合入并推送master，不重复触发部署。
