import {readFileSync,writeFileSync} from 'node:fs';
const audit=JSON.parse(readFileSync('docs/deployment/python-expansion-local.json','utf8'));
const policy=JSON.parse(readFileSync('lib/python-support.json','utf8'));
const pending=JSON.parse(readFileSync('docs/deployment/python-expansion-pending.json','utf8'));
const entries=Object.values(policy.lessons).flatMap(l=>l.notebooks);
const fully=Object.values(policy.lessons).filter(l=>l.notebooks.every(b=>b.status==='enabled')).length;
const mixed=Object.values(policy.lessons).filter(l=>l.notebooks.some(b=>b.status==='enabled')&&l.notebooks.some(b=>b.status==='code')).length;
const codeOnly=Object.values(policy.lessons).filter(l=>l.notebooks.every(b=>b.status==='code')).length;
const executed=audit.lessons.flatMap(l=>l.notebooks.flatMap(b=>b.cells));
function category(reason){
 if(/字形/.test(reason))return ['FONT','补齐数学字符字体回退并重新验证布局/PNG；计算虽完成，显示未放行。'];
 if(/ipywidgets/i.test(reason))return ['WIDGET','依课程重构 SKILL 将交互迁移到 React Explorer，不恢复 ipywidgets。'];
 if(/cvxpy/i.test(reason))return ['SOLVER','单独验证求解器的 WASM 支持或原生 Python 后端，当前不宣称支持。'];
 if(/slycot|sb10ad|sb10hd|tb01pd/i.test(reason))return ['SLYCOT','保留原算法；评估原生 Python 后端或独立移植，不用替代算法冒充通过。'];
 if(/超时|timeout/i.test(reason))return ['BUDGET','单独剖析性能；不缩减样本冒充原实验通过。'];
 return ['RUNTIME','随该课 Phase 1–4 分析原代码/库版本差异，当前不修改课程数学内容。'];
}
let text=`# Python 逐课兼容验收与待处理清单\n\n2026-10-17；当前浏览器兼容清单。起点为DEP04，后续按课程交付合并实跑证据（见原始记录provenance）；MATH-03新增4个、MATH-04新增5个、MATH-05与MATH-06各新增6个、MATH-07、MATH-08与MATH-09各新增7个、MATH-10新增6个、MATH-11与MATH-12各新增7个、MATH-13与MATH-14各新增6个实验；各次实跑日期见对应报告。DEP04的自动发布授权仅限其原工作包，后续发布仍需用户逐次同意。本文不代表课程内容签发。\n\n## 结果口径\n\n含 notebook 的 ${audit.lessons.length} 课 / ${entries.length} 个实验 / ${entries.reduce((n,b)=>n+b.cells,0)} 个单元格全部纳入盘点。${fully} 课全部可运行，${mixed} 课混合，${codeOnly} 课全部保留代码；启用 ${entries.filter(b=>b.status==='enabled').length} 个实验，保留 ${pending.length} 个。实际执行 ${executed.length} 个单元格（含异常单元格），生成 ${executed.reduce((n,c)=>n+c.outputs.filter(o=>o.type==='image').length,0)} 张 PNG。原始记录中 ${audit.totals.enabled} 个实验完整执行，发布门槛另将 2 个存在数学字形缺失的实验降级。已知依赖阻塞的实验预判跳过；异常实验在首个错误停止，后续单元格不伪记通过。\n\n“可运行”表示在固定 Pyodide 0.27.7 / control 0.10.2 环境完整运行该实验默认 setup/cells，无 Python 异常且无缺字警告；不是该课程已完成学期重构，也不是对全部理论与数值断言重新签发。数学参考输出与控制库数值断言另在 python-expansion-probes.json 完成 30 项回归（含 6 项不支持验证）。\n\n## 逐课清单\n\n| 课程 | 可运行实验 / 总数 | 成功运行单元格 | 代码展示实验 |\n|---|---|---|---|\n`;
for(const lesson of audit.lessons){const p=policy.lessons[lesson.key];text+=`| ${lesson.key}（${lesson.title}） | ${p.notebooks.filter(n=>n.status==='enabled').length}/${p.notebooks.length} | ${lesson.notebooks.reduce((n,b)=>n+b.cells.filter(c=>c.status==='passed').length,0)} | ${p.notebooks.filter(n=>n.status==='code').map(n=>n.id.split('#')[1]).join(', ')||'无'} |\n`;}
text+='\n## 待处理实验\n\n每项保留原始代码，并在该实验上方显示具体阻塞原因；同课其他已通过实验继续运行。未配置的依赖不因“import 能成功”而放行。\n\n| ID | 课程 / 实验 | 分类 | 原因 | 后续处置 |\n|---|---|---|---|\n';
for(const [i,item]of pending.entries()){const [type,action]=category(item.reason);item.task='PY-'+String(i+1).padStart(3,'0');item.category=type;item.next=action;text+=`| ${item.task} | ${item.id}：${item.notebook}（源码 L${item.line}） | ${type} | ${item.reason.replace(/\|/g,'/').replace(/\n/g,' ')} | ${action} |\n`;}
text+='\nSlycot 的合成探测仍确认 hinfsyn/h2syn/mixsyn/状态空间 minreal/MIMO tf→ss 不支持；表中只登记实际课程实验出现的阻塞，不按章节名称推断依赖，也不凭空登记未使用的 Slycot 实验。完整的负例见前次试验及本次 probes JSON。\n\n## 执行与渲染\n\n每课使用新 Worker，各 notebook 有独立变量字典，单元格按源代码顺序执行。原有 Jupyter inline 后端声明在浏览器映射到 Agg/PNG，不改课程源代码或数值算法。同源发布 Noto Sans CJK SC 字体及 SIL OFL 许可，弥补浏览器无法读取操作系统中文字体的问题。运行时资源约 65 MiB，首次按需加载。\n\nlib/python-support.json 是由浏览器记录生成的执行白名单；MDX 编译按课程/实验序号注入策略，未登记默认代码展示。构建检查课程源哈希（LF 规范化）、Worker 哈希、实际执行记录及每页渲染的两种模式数量；改源或 Worker 后须重新实跑。正常 npm run dev 仍接本地 Jupyter。\n\n原始全量输出：python-expansion-local.json（图片仅记 MIME/长度，文本长输出注明截断）；早期中文缺字发现记录：python-expansion-initial-partial.json，明确为未完成初查，不作为放行证据。待办机器表：python-expansion-pending.json。\n\n重跑：node scripts/prepare-python-expansion.mjs；本地静态服务打开 python-expansion.html，点击逐课运行全部课程，下载 JSON 后执行 node scripts/finalize-python-support.mjs <报告路径>、node scripts/write-python-expansion-report.mjs、node scripts/check-python-support.mjs。单课可用 python-expansion.html?lesson=chapter/lesson 运行，再用 finalize-python-support.mjs <单课报告路径> --merge 合并；其余课程源哈希须不变，Worker 变化必须全量重跑。本流程不替代课程写作/重构的讨论 SKILL。\n\n## 验收与发布\n\n逐课浏览器执行完成；页面验收、构建和远端发布结果在交付记录 python-expansion-delivery.md 登记。只有实际通过的实验启用运行。\n';
writeFileSync('docs/deployment/python-expansion.md',text);
writeFileSync('docs/deployment/python-expansion-pending.json',JSON.stringify(pending,null,2)+'\n');
console.log(JSON.stringify({fully,mixed,codeOnly,enabled:entries.filter(b=>b.status==='enabled').length,pending:pending.length,executed:executed.length}));
