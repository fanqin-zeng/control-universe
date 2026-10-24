# APP-01 电力电子控制验收

2026-10-24，用户指定继续APP-01，rank15。master共享工作区含其它会话改动；仅修改本课路径及共享文件本课条目。

开工check退出1：并行课程统计/OUTLINE漂移、孤儿组件及锚点警告；check-semester03退出1（未合入INTEL-01）。本课不重置别人的状态，不把基线失败写成通过。

独立副本D:/Workspace/control-universe-rank15-app01-validation；候选端口18305页面、9005内核、19305静态Pages，启动前查空闲。所有构建在副本，不操作共享.next/out。Phase1–4已完成并据真实证据签发；master回执在实际提交后登记。


## 已执行验收

| 命令/操作 | 实际结果 | 持久证据 |
|---|---|---|
| node .agent/semester-03/app-01/verify.mjs | 0；实际TS312配置对独立Decimal，三负载精确周期对DOP853射击；PI1001时刻对精确仿射传播 | reconciliation.log/json、actual-ts.json、reference.py |
| node scripts/nb-cells.mjs verify applications/power-electronics --require-kernel --port 9005 --out 本目录/notebooks.json | 0；3Notebook4cell，FAIL0/SKIPPED0，S8结构前提通过 | notebooks.log/json |
| 最终源hash逐课Pyodide浏览器实跑 | 3实验4cell成功，全部放行 | pyodide.json |
| npm run build，独立副本 | 0；Compiled successfully，210/210静态页面，无MDX编译失败 | build.log |
| WIKI_VERIFY_PORT=18305 node scripts/verify-lesson.mjs applications/power-electronics --root 副本 | 0；9PASS/0WARN/0FAIL，HTTP200/H1=1/H2=8/KaTeX0 | verify-page.log |
| 生产页原生全部运行/目录/图片/控件 | 4cell真实输出、两图显示；九目录目标与唯一ID | browser-native.json、default.png |
| 375px同源iframe视口 | 内容宽360/scrollWidth360，8H2，KaTeX0，SVG实际加载，无整页溢出；不是实机测试 | browser-mobile.json、mobile.png |
| npm run glossary:check / npm run math:check | 均0；术语PASS3/WARN3/FAIL0，既有其它课程提示保留 | glossary.log、math.log |

## 过程失败与边界

1. 首轮构建因自己遗漏组件导出注册失败；修正唯一注册表后build退出0。
2. verify旧扫描把行内0<D<1误认D标签；改成等价区间写法后verify九项通过，未修改校验脚本。该脚本旧提取器只识别首属性code，摘要漏计title在前的cell；严格nb-cells及浏览器实际执行4cell，不把摘要0cell当执行证明。
3. 第一轮Pages完成210/210编译，但verify-pages因仅用于验收的app01-mobile.html夹具用了未带basePath的iframe地址退出1。已同时修正副本public/out中的该夹具后，独立verify-pages退出0：205课程、9旧路由、294392831字节；未改产品路径或放宽门槛。最终完整Pages构建另存pages-build-final.log。
4. 最后移除正文中面向维护者的并行草稿说明，保留教学先修说明；实验代码未变。按新源hash重新实跑浏览器、刷新支持策略并再次编译。一次本地回写策略断言忘了归一化Windows换行而中止，改用与正式inventory相同LF归一化后通过；没有伪造源hash。
5. 只启动/停止本会话18305和19305服务，9005严格内核隔离；不操作共享.next/out，不改共享端口脚本、不停止其它会话进程。副本build-pages仅将git发布元数据替换为记录的起点HEAD和dirty=true，用于无.git的本地副本，不代表任何实际发布。

课程界限：理想非同步Buck、小纹波CCM、平衡附近连续PI；120ohm仅展示CCM延拓失效，不提供DCM实际响应；不承诺器件选型、启动、过流或数字闭环稳定。Pages只做本地验收，不发布gh-pages。


## 最终结果

- 最终源码SHA-256（LF归一化）：9357b956aa754b8ddc396ad4d11fe255bbae2790e11c98a59c94d13e7b061620。
- 最终完整npm run build:pages退出0，205课程/9旧路由/294393408字节；pages-build-final.log。
- 最终Pages页面三实验四cell实际运行完成，SVG及两输出图加载，基路径正确；browser-pages.json/pages.png。
- node .agent/semester-03/app-01/validate.mjs退出0；实际TS312组误差1.1368683772161603e-13、PI1001时刻误差1.9337893786275373e-10；validation.log/json。
- 首个本课范围check：PASS21/WARN2/FAIL0；Python支持89课/392可运行/15保留代码，均退出0。本课支持三实验全部启用；其它课程策略从所选HEAD完整保留。
- 临时范围准备脚本一度删除同名APP-01计划映射，校验真实报告204课；只改临时副本，修正为限定EXCEPTIONS块后205课/errors=[]。最终范围随并行HEAD更新重验，见staging-base.json和scoped-*.log/json。
- 共享工作区当时check退出1，唯一FAIL为其它会话driving-system的tracker/status未同步；全局semester检查随后退出0；共享Python策略检查受其它进行中源hash影响失败。未改别课完成态以求变绿。交付使用准确HEAD加APP-01的范围校验，不混入其它进行中内容。

只登记中文润色的本课“已完成/待润色”生产交接，不代做润色，不操作专用分支。未发布Pages，不继续APP-02。


## 实际master交付回执

交付提交：`7ede89f287a870376f0f3d11fd4141dc9e0e979a`。只包含APP-01正文、组件、计算、图示、讨论及证据与本课共享元数据；普通提交已进入master。

最终提交范围的check、Python支持及计划校验均通过，见scoped-check.log、scoped-python-policy.log、scoped-semester-check.json。原验证基线后的变化若仅为其它课程回执，保持其HEAD内容并复核元数据；无覆盖或重写已有提交。共享暂存区以逐文件的本课语义更新保留其它会话内容。
