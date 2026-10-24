# INTEL-02 模糊控制器

2026-10-24用户指定，rank7。本课按wiki-lesson-refactor与既有角色Phase1–4完成并签发，一次对话仅交付本课。起点df72d0abdecd7c72041b91f50b6aeae6e5d6d8c9；生产构建范围为该已提交基线加本课；最新主干元数据复验基线52a8b02391f069abb87fd0fd30c9e605bc72bfa1，范围定义见scoped-base.json。

保留14H2、旧URL与42旧ID（六个错误H3改正确标题并保留别名）、原6组实验主题与5题知识点；现6Notebook14cell、6题、原名FuzzyTuningExplorer、真实纯TS计算模块和反馈SVG。旧源/12cell归档，去向见讨论日志附录D。catalog原status=v1.3、课名、先修、小节均符合，无需伪造元数据变更或手编OUTLINE。

纠正半宽覆盖空隙、跨语言取整、平均规则死区、TS反馈符号、反对称/负反馈混用、无积分必有静差及错误凸组合稳定性推断；撤回Mamdani硬上限。默认同尺度rms3.669619度；完整报告各9候选锁定后的5测试及落败/持平。有限轨迹、候选和指标均不冒充通用稳定性/方法排名。

## 实际验收

| 命令/方式 | 结果 | 证据 |
|---|---|---|
| npm run check（最新已提交master加本课） | PASS21/WARN2/FAIL0，exit0 | scoped-check.log |
| node scripts/check-semester03.mjs | PASS，exit0 | scoped-semester.log |
| node scripts/check-fix-logs.mjs | PASS，exit0；076按并行占用保留，不收录其它课未提交详情 | scoped-fix.log |
| node scripts/check-python-support.mjs | PASS，exit0 | scoped-python.log |
| npm run math:check / glossary:check | exit0，数学files0/tokens0；现存术语WARN保留 | math.log / glossary.log |
| WIKI_VERIFY_PORT=18207 node scripts/verify-lesson.mjs intelligent/fuzzy-controller-design | HTTP200，PASS9/WARN0/FAIL0/SKIPPED0，exit0 | scoped-verify-final.log |
| node scripts/nb-cells.mjs verify intelligent/fuzzy-controller-design --port 9007 --require-kernel | 6实验14cell，error0，无SKIPPED，exit0 | notebooks.log/json |
| 原版默认程序实际Python执行 | rms21.10、末样21.69、TV915，exit0；不追认原文“稳态”用语 | baseline-default.log / baseline-run.py |
| node scripts/verify-intel02.mjs / reference.py | 396真实TS输入对独立quad、3逐拍DOP853；exit0 | actual-ts.json / reference.json |
| 真实原生/Pyodide输出互核 | 504数值完全相同；6/6浏览器实验放行 | native-outputs.json / pyodide-download.json |
| 真实TS全配置指标 | 31配置217指标；正常模式容差1e-6，旧不连续模式2e-4 | component-measurements.json / validation.json |
| node .agent/semester-03/intel-02/validate.mjs | pass=true；含真实375px DOM、42旧ID、目录及图像核对 | validation.json/log |
| npm run build | exit0，完整MDX编译 | build-final.log |
| npm run build:pages | exit0，205课程/9旧路由，basePath正确 | pages-build-final.log |
| 实际组件UI | 三预设、四滑块min/max、恢复默认、2canvas、console error0 | browser-native.json |
| 原生页面/Pages页面按钮 | NB1原始代码输出完成；Pages显示运行完成 | browser-native.json / browser-pages.json |
| 实际375px两种课页 | document/body360，无溢出、重复ID0、14H2、KaTeX错误0、框图加载 | browser-mobile.json / browser-pages.json |

独立积分最大差9.44e-15；独立保持输入ODE最大指标差1.18e-9。原生/Pyodide504值最大差0。旧半宽模式切换敏感，跨语言轨迹217指标检查中的最大差0.00012714，不声称旧模式六位打印逐位同值。

## 过程边界

初次MDX裸小于号500、Set在ES5下直接展开的类型错误均修复，保留build.log；第一次误启动旧全课验收中止，未记通过。最终范围页面首次冷编译探测SKIPPED保留在scoped-verify.log，warm后实际HTTP200、最终无SKIPPED记录才作为验收。页面并行初始化造成原生按钮较久等待，最终已返回正常输出；仅释放本任务9007上的空闲内核。

浏览器运行后仅修改散文、标题别名、框图与布局，不改setup/cell；refresh-proof.mjs逐字符串核相等后转移whole-MDX hash，原始下载保留，未伪造再次执行。生产与Pages构建使用独立副本，避免共享.next；Next18207、kernel9007、实验18407、Pages18507初始空闲，未更改共享端口脚本。其它会话的未提交正文、暂存索引、中文润色、gh-pages均不属于本课。

完整Phase1–4、86行三方对账、80行测量、九项门槛、6条红队及保留矩阵见docs/discuss-log/semester-03/13-intelligent/02-fuzzy-controller-design.md。fix-077落实既有清单执行。真实master提交与正常推送后另补回执；本次仅本地Pages验收，未发布。
