# I04：内核、数值与页面验收可复现性

日期：2026-10-17；起点master `4aa861b`；分支 `wp/s3-i04-reproducibility`。本任务验证并加固验收链路，不重构课程、不变更目录或签发学期3课程。

## 验收合同与范围

一次可复现实验必须同时满足：8891健康且使用独立干净内核；使用MDX求值后的原始setup/cell；两轮关键文本与数值一致；实际TS函数和独立算法在规定容差内一致；页面HTTP/H2/KaTeX以及失败样本都能得到预期结果。环境缺失、setup失败、cell异常和未运行不能记为通过。

固定样本为已有 `modern/multivariable-systems`：一个notebook六个cell、实际 `simulateMimo` 导出、默认比例增益[2,2]与边界[0.5,5]/[5,0.5]。这不是对全站56份正文或全部数值断言的重新认证，每课交付仍须完整Phase1–4和三方对账。

## 发现与修复的假通过

修复前实际执行永久 `setup-error.mdx`：setup抛RuntimeError，cell仅print而独立可运行，nb-cells却PASS1/FAIL0、退出0；内核端口1不可达时也S6 SKIPPED、退出0。代码核对：网关create丢弃setup输出并返回ready，工具只检查cell；这两种绿色退出码不代表数值可运行。

本次修复：

1. 网关setup错误返回HTTP422和真实错误，并清理失败内核；前端已有非2xx错误分支，不再收到假ready。
2. nb-cells先创建空命名空间，再显式执行求值后的setup并核查错误；创建、setup和执行均纳入finally清理；内核回收后的前序重放失败也必须中断。
3. 新增 `--require-kernel`：不可达计S6 FAIL并退出1；与 `--no-kernel` 冲突时退出2。保留静态模式，但不能用于交付。JSON输出明确kernelRequired和executionStatus，不能把静态PASS当数值证明。

失败样本与测试永久保留在 `scripts/fixtures/reproducibility/` 和两份测试中。使用回收故障假网关的单元测试只验证CLI控制流；下述环境/数值/页面实测均使用真实服务，不混淆证据层级。修复按fix-tracker登记为029。

## 复验命令与环境

复验前运行 `npm run dev`，它管理8080 Next开发服务与8891 Jupyter网关；已有服务不重复启动。本次仅在健康接口显示0个活动内核时重启网关一次，使补丁生效，未重启Next或清空其缓存。每次实验创建带随机i04前缀的内核，只删除自己创建的ID。

~~~powershell
curl.exe --noproxy "*" http://127.0.0.1:8891/health
node scripts/verify-reproducibility.mjs --out logs/i04-rerun.json
node scripts/nb-cells.mjs verify modern/multivariable-systems --require-kernel
node scripts/verify-lesson.mjs modern/multivariable-systems --quiet
node --test scripts/verify-reproducibility.test.mjs scripts/nb-cells-repro.test.mjs
~~~

复验写新文件，不覆盖本次版本化 [实测结果](i04-reproducibility-results.json)。Node使用node:http直连，不读取HTTP_PROXY等系统代理变量；Python客户端若另写HTTP请求必须使用 `urllib.request.build_opener(urllib.request.ProxyHandler({}))`。报告保留Node/Python版本、Python可执行路径、库版本、不同进程PID和关键源文件SHA-256（统一LF后计算）。报告commit是实验起点，实际测试的是本次提交的源码哈希。

本机实测：Python3.13.12、NumPy2.4.4、SciPy1.18.1、SymPy1.14.0、Matplotlib3.11.2、jupyter_client8.10.0、ipykernel7.3.0；Node及完整路径见JSON。未安装/升级依赖。该结论限于所记环境与样本，不声称跨平台或跨依赖版本结果不变。

## 两轮真实实验

| 检查 | 实际结果 | 判据 |
|---|---|---|
| 命名空间隔离 | A定义的marker在B不存在 | 不共享变量 |
| 同ID重建 | marker消失 | 旧内核被替换，不继承状态 |
| 删除后执行 | HTTP404 | 不能继续使用已删内核 |
| setup负样本 | HTTP422，含I04_SETUP_SENTINEL；随后执行404 | 错误可见且无失败内核残留 |
| cell负样本 | HTTP200中有ValueError输出 | 检查输出错误，不能只看HTTP状态 |
| 干净重放 | 两个不同Python PID，初始marker均不存在 | 独立进程/干净命名空间 |
| 实际MDX | 每轮同一份求值后setup+6cell成功，两轮文本输出一致 | 不使用旧缓存输出或另抄harness cell |
| 实际TS对独立expm | 三组增益、每组501点；两轮均过 | 输出/控制最大绝对误差≤1e-8，稳态≤1e-10 |
| 实际notebook默认值对实际TS | 全501点及稳态最大差约9.845e-12 | ≤1e-8 |
| 正文与SSR默认读数 | 六位小数与实测一致 | [0.662921,0.033708]，e1∞=0.337079，采样峰值0.076380@0.36s；u(10)=[0.674157,-0.067416] |
| 清理 | 实验前后活动内核均0 | 不遗留本工具内核 |

独立复算以 `scipy.linalg.expm` 构造线性系统精确采样响应；TS执行实际组件函数的RK4实现，notebook使用其原始SciPy solve_ivp。不是复制一份RK4自证。三组最大输出差约5.650e-11、控制差2.825e-10、稳态差1.110e-16。末样值与代数稳态分开测量；峰值仅称501点网格上的采样最大值。PNG只记录是否生成，不声称跨进程图片字节一致。

## 页面、CLI与已知失败

两轮MIMO页HTTP200、h1=1、H2与catalog一致、katex-error=0；两轮页面verify均退出0，PASS8/WARN1/FAIL0，唯一WARN仍是已知数学骨架引用。空课程占位200、目录外404、旧现代控制URL308→lyapunov-modern，状态均符合当前契约。没有使用浏览器拖动控件，不宣称验证了全部客户端交互。

I03/W05两页MPC每轮都仍HTTP200但H2只有1/8与2/11，实际class计数各1个KaTeX错误；报告明确标记knownFailure，未把它们当通过课程。I04不处理这两课，W05与MPC对应课程行继续未完成。

每轮实际CLI正样本为nb-cells与页面verify退出0；setup错误和cell错误样本均退出1，并核对各自sentinel；另测严格模式端口1不可达退出1。总计9条CLI命令，错误样本是预期失败，不混同产品修复。源码及环境记录、完整CLI输出、两轮文本和数值误差均在JSON。

## 最终验收

| 命令 | 退出码 | 实际输出 |
|---|---|---|
| node scripts/verify-reproducibility.mjs --out .agent/semester-03/i04-reproducibility-results.json | 0 | pass=true，51项检查、2轮、9条CLI命令；前后kernel=0 |
| node --test scripts/verify-reproducibility.test.mjs scripts/nb-cells-repro.test.mjs scripts/check-warning-audit.test.mjs scripts/check-fix-logs.test.mjs scripts/check-semester03.test.mjs scripts/lesson-route.test.mjs | 0 | tests50 / pass50 / fail0 / skipped0 |
| node scripts/check-warning-audit.mjs --live | 0 | 基线36/当前36，新变更0；已知W05仍待处理 |
| node scripts/check-fix-logs.mjs | 0 | 索引27 / 详情27 / 预留2，nextId030 |
| npm run check | 0 | PASS17 / WARN36 / FAIL0，与起点一致 |
| node scripts/check-semester03.mjs | 0 | I04关闭后治理完成9/21；课程合并0/205 |
| Python compile检查jupyter_server.py | 0 | PASS Python syntax，不生成临时pyc |
| git diff --check | 0 | 无空白错误输出 |
| E3既有静态坏夹具全集 --no-kernel | 1（预期） | PASS3/WARN1/FAIL4，S0–S8分布与原README一致；静态负向门槛未被破坏 |
| E3 mock回收重放协议 | CLI退出1（夹具故意含S8缺陷） | S6 cell error0，creates2 / executes9，前后setup codeHash相同；独立mock已退出，不影响8891 |

I04的环境、隔离、数值、页面和失败传播门槛已实测通过，故关闭本任务。使用现有开发服务验证SSR/HTTP与真实网关；未重复Next生产build或认证跨环境运行，I01的构建错误传播测试仍作为独立门槛。课程本身、W01–W05及结构任务不据此预签发。

旧E3 mock的默认fail-at与文档已同步为4（包含setup），9次execute包含两次setup；新增codeHash用于确认setup重发内容相同。不能继续按旧协议的7次去断言新验收链路，否则正确实现也会被误报为失败。该同步只改测试夹具，不改课程或角色团队。
