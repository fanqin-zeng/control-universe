import fs from 'node:fs';
import assert from 'node:assert/strict';
const dir='.agent/semester-03/multi-01/';
assert(JSON.parse(fs.readFileSync(dir+'page-python-pages.json','utf8')).pass);
assert(fs.readFileSync(dir+'projection-check.log','utf8').includes('EXIT_CODE=0'));
assert(fs.readFileSync(dir+'semester-final.log','utf8').includes('EXIT_CODE=0'));
assert(JSON.parse(fs.readFileSync(dir+'pyodide.json','utf8')).complete);
for(const f of ['build.log','pages-build.log'])assert(!/Failed to compile|Type error:|MDX 编译失败/.test(fs.readFileSync(dir+f,'utf8')));
const p='docs/discuss-log/semester-03/15-multi-agent/01-multi-agent-overview.md';let s=fs.readFileSync(p,'utf8');
for(const name of ['郑核','苏绘','孙助','柯验','林矩','李稳','钱锐','何疑','秦构','陆阅'])s=s.replace(new RegExp('\\| '+name+' \\| 出席 \\| 1 \\|'),'| '+name+' | 出席 | '+(name==='李稳'||name==='钱锐'?'1、2、3':'1、2、3、4')+' |');
s=s.replace('[待定] 数值、内核、构建、浏览器及政策验收尚未执行，不得签发。','[郑核] 林矩2条P1（动力学/离散语义）、李稳1条P1（速度与位置）、钱锐2条P1（有向极限与特殊初值）均按Phase2修订；秦构的schema与资源问题已修复并重测，无P0阻断项。\n\n[林矩] 学术条件和四题答案已核；同源两实验在原生/Pyodide/普通实际页面/Pages实际页面四条路径运行，有限步与解析极限分清。\n\n[孙助] 四题四答覆盖四个目标，原始输出可追溯。\n\n[柯验] A.1全部通过，三方缺省与非默认工况明确区分，没有通过改测量迁就叙述。\n\n[何疑] C中两组条件观察放行，不保留算法排名主张。\n\n[秦构] 附录B九项通过；普通与Pages各7次真实控件操作、375px、真实Python输出及零浏览器错误；严格内核四cell全过。\n\n[陆阅] 四份档案、八H2、图示alt和手机可读性证据齐备。\n\n[待定] 无影响本课正确性的待定项；全站历史WARN、Python保留代码16项及其它会话检查点不随本课关闭。未发布Pages。\n\n[郑核-签发] 仅签发MULTI-01。验收证据见A/B/C及.agent/semester-03/multi-01/acceptance.md；真实master回执在提交后追加，不预填hash。\n\n交付清单：正文、一个Explorer及独立计算模块、一个SVG、两Notebook四cell、四题四答、本日志四份档案、sourceHash绑定的Python运行政策、catalog/tracker/自动OUTLINE及本期checklist。');
s=s.replace('## 附录 B：秦构九项前端硬门槛实际输出\n待执行。',`## 附录 B：秦构九项前端硬门槛实际输出

| 原序号 | 命令/实际输出 | 判定 |
|---|---|---|
| 1 | 独立副本npm run build；exit0，205课程生成，无MDX失败；PAGES_BUILD=1/NEXT_PUBLIC_STATIC_EXPORT=true/NEXT_PUBLIC_BASE_PATH=/control-universe npm run build同样exit0；build.log、pages-build.log | ✅ |
| 2 | WIKI_VERIFY_PORT=8199 node scripts/verify-lesson.mjs multi-agent/multi-agent-overview；exit0，HTTP200；verify-final.log | ✅ |
| 3 | 相同命令：H1=1、H2=8，与catalog逐项吻合；普通/Pages真实DOM顺序及侧栏片段无缺失；browser-normal/pages.json | ✅ |
| 4 | 相同命令及真实DOM：katex-error=0 | ✅ |
| 5 | node scripts/nb-cells.mjs verify multi-agent/multi-agent-overview --require-kernel --port 8999 --out .agent/semester-03/multi-01/notebooks.json；exit0，2Notebook/4cell/error0/SKIPPED0；所有原始setup/cells执行，sourceHash d3213cccc4da9c1abad301fbb4f9d9e25eb9f8cf4aa5b6c481703a561b8d0ff4 的Pyodide四cell亦全passed | ✅ |
| 6 | npm run check独立投影PASS21/WARN2/FAIL0（projection-check.log）；verify注册及单一来源检查通过，仅改lib/wiki-components.ts | ✅ |
| 7 | MDX显式<MultiAgentOverviewExplorer />一次；verify全部组件有实现与注册 | ✅ |
| 8 | useMemo Option对象→useECharts；animation:false；x=[0,20]、y=[-6,9]；node .agent/semester-03/multi-01/reconcile.mjs exit0，135配置8505点独立核验；两页面各7操作/恢复/默认与375px通过，浏览器error=[] | ✅ |
| 9 | 严格nb-cells S2通过；无ipywidgets/interact/Slider引用 | ✅ |

附加：node .agent/semester-03/multi-01/validate.mjs exit0；math:check exit0（同行违规0），glossary:check exit0（全站WARN保留），check-semester03独立投影使用GIT_DIR指向只读历史验证，exit0。snapshot不是Git工作树，首次直接执行历史检查失败不算通过；补足只读GIT_DIR后实测成功。

普通页面原始内核URL在已提交代码中写为8891。本次仅在Playwright本页面请求中将8891转发8999，验证rank9的完整原生UI，不改变共享组件或其它会话服务。Pages使用真实浏览器Pyodide，无此转发。所有路径原始输出见page-python-normal/pages.json；不把默认8891无人服务误称本机默认部署已验收。

仅本地Pages构建/预览，不执行gh-pages推送或公网发布。共享目录另跑check并记录shared-check.log，存在并行瞬态时与本课可提交投影区分。
`);
s=s.replace('Pages原始输出和最终构建待附录B实测齐备才签发。','Pages原始输出及最终构建现已通过，详见附录B。');
s=s.replace('最终门槛仍待实际证据。','最终门槛证据已补齐附录B。');
fs.writeFileSync(p,s);
let q='.agent/semester-03-checklist.md';s=fs.readFileSync(q,'utf8');s=s.replace(/^\| MULTI-01 \|.*$/m,'| MULTI-01 | [x] | [x] | [x] | [x] | [x] | [ ] | docs/discuss-log/semester-03/15-multi-agent/01-multi-agent-overview.md;.agent/semester-03/multi-01/acceptance.md;rank9独立副本验收完成，待真实master回执 |');fs.writeFileSync(q,s);
q='.agent/semester-03-plan.md';s=fs.readFileSync(q,'utf8');if(!s.includes('### MULTI-01执行回执')){s+='\n\n### MULTI-01执行回执（2026-10-24）\n\n多智能体系统由空占位按新写Phase1–4完成：三辆独立车道小车的速度协调串联局部对象、接收信息图、局部反馈与团队目标，区分一致/跟踪/编队，保留断图、单向根节点、临界与超界采样反例。八H2、四题四答、一个Explorer与SVG、两Notebook四cell；135组真TS对独立谱解/Jordan闭式/矩阵幂，严格内核与Pyodide、普通与Pages原始输出、两种页面375px及固定轴全部通过。rank9独立副本/8199/8999/8499；完整证据.agent/semester-03/multi-01/acceptance.md。仅本课，保留其它会话与用户批阅；不发布Pages、不续写MULTI-02。真实master回执提交后登记。\n';fs.writeFileSync(q,s);}
q='.agent/semester-03/zh-lang-edit/PLAN.md';s=fs.readFileSync(q,'utf8');s=s.split('\n').map(l=>l.includes('| MULTI-01 |')?l.replace('| 待完成 | 待生产 | — |','| 已完成 | 待润色 | .agent/semester-03/multi-01/acceptance.md |'):l).join('\n');fs.writeFileSync(q,s);
q=dir+'acceptance.md';s=fs.readFileSync(q,'utf8');s=s.replace('预定页面8199、内核8999、Pages预览8299','页面8199、内核8999、Pages预览8499（原8299被Windows拒绝绑定）');s=s.replace('当前：Phase 1完成；其余阶段等待实作验收，不预签发。',`Phase 1–4与真实验收已完成，签发见本课日志。真实提交hash待提交后追加。

| 验收 | 实际结果 | 证据 |
|---|---|---|
| 独立投影npm run check | exit0；PASS21/WARN2/FAIL0，旧重复slug及其它旧课无日志债务 | projection-check.log |
| 普通生产/Pages静态构建 | 均exit0，205课程生成，无MDX编译失败 | build.log、pages-build.log |
| 课程verify | exit0，HTTP200、H1=1、H2=8、KaTeX0 | verify-final.log |
| 严格原始Notebook | exit0，两Notebook四cell，0error、0SKIPPED；8999 | notebooks.log/json |
| 真实TS与独立参考 | exit0，135组8505点，最大差2.3092638912203256e-14；全图固定轴内 | reconciliation.log/json、actual-ts.json、reference.py |
| 原始Pyodide | 两实验四cell全passed，源hash一致 | pyodide.json |
| 普通/Pages实际页面 | 各两次全部运行，四原始输出及绘图完成，error=[] | page-python-normal.json、page-python-pages.json |
| 操作/布局/链接 | 两页面各7操作，默认/边界/恢复通过；375px无页面横溢；重复ID/缺失本页片段0 | controls-normal/pages.json、browser-normal/pages.json、mobile-normal/pages.json、PNG |
| 学期与Python政策 | exit0；完整历史检查及本课原始证据注册；旧16代码保留项不关闭 | semester-final.log、python-policy.log、register.log |
| 术语、块级公式 | 均exit0；全站词表WARN保留，同行公式违规0 | glossary.log、math.log |
| 聚合验证 | exit0；源hash、独立数值、内核/浏览器、手机与政策 | validation.log、validate.mjs |

源SHA256：d3213cccc4da9c1abad301fbb4f9d9e25eb9f8cf4aa5b6c481703a561b8d0ff4。

普通原生UI仅在本次Playwright请求中转发8891→8999，以避开共享硬编码资源；未修改共享Jupyter组件。Pages两组原始实验使用真实Pyodide。snapshot的历史检查用GIT_DIR指向仓库只读历史；不以“快照无git”引起的首次失败冒充通过。

初稿subsections误用id导致首次build失败，修为契约slug后重建通过；8299绑定拒绝后用8499。折叠details内innerText为空是验收脚本读取问题，改textContent后原始实验通过。未变更Notebook计算迁就输出。共享目录的并行课程/端口/用户批阅不纳入本课提交。`);fs.writeFileSync(q,s);
console.log('MULTI-01 signed; master receipt pending');
