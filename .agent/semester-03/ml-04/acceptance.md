# ML-04 自动微分与训练验收

2026-10-24；rank2；空课新写，最终数值、原始内核、浏览器、两种构建与375px修正复验通过，学期守卫通过，Phase4已签发，待真实master回执。

范围：content/machine-learning/autodiff-optimization.mdx；lib/autodiff-training.ts；components/wiki/autodiff-training-explorer.tsx；唯一注册器、catalog本课对象、tracker/checklist/plan本课字段、自动OUTLINE和Python政策本课两实验。单一Agent使用仓库规定的角色审查视角。全为自造无量纲数据，实际运行自含标量AD和小网络训练；没有PyTorch/GPU/真实房间试验。

| 实际命令/操作 | 结果 | 证据 |
|---|---|---|
| node .agent/semester-03/ml-04/reconcile.mjs | exit0；实际TS120训练配置/40梯度点，5028局部更新、35808参考量；10296绘图量在固定轴内；原始Python198量核验 | reconcile.log、reference.json、ts-cases.json、reference.py、raw-python.json、notebook-comparison.json、native.json |
| node scripts/nb-cells.mjs verify machine-learning/autodiff-optimization --require-kernel --port 8992 --out .agent/semester-03/ml-04/nb-strict.json | exit0；两Notebook四cell，S6真跑error0，无SKIPPED | nb-strict.log/json |
| node scripts/verify-lesson.mjs machine-learning/autodiff-optimization（WIKI_VERIFY_PORT=8212） | exit0；HTTP200/H1=1/H2=10/KaTeX0，后续ML-05骨架链接WARN | verify-dev.log |
| 浏览器原始setup/cell清单 | 最终原文hash的两实验四cell全passed | pyodide.json |
| 最终Pages课程页两次全部运行 | 最终两实验四cell运行完成，396数值量通过 | browser-pages.json |
| 真实五预设与所有选择框/checkbox | 默认选54、末步选200、全零70、保护拒绝6、自定义组合均实测 | controls.json |
| 375px | 首测scrollWidth423，定位长行内四参数；改为四个可换行参数说明，最终scrollWidth360、canvas295，恢复成功 | browser-mobile-before.json、mobile-before.png，最终browser-mobile.json |
| npm run build / npm run build:pages | 初版exit0；最终排版修正版exit0，205课/9旧路由 | build-before-mobile-fix.log、build-pages-before-mobile-fix.log；build.log/build-pages.log |
| npm run check（独立HEAD+本课） | exit0；PASS21/WARN2/FAIL0 | final-check.log |
| npm run glossary:check / math:check | exit0；术语无FAIL，同行公式违规0 | final-glossary.log、final-math.log |
| node scripts/check-python-support.mjs | exit0；本课新增2可运行，保留既有降级 | final-python-policy.log |

最终正文SHA256：33745108f178a480b6c10770c34a49ae11a1fd90140210a0ff20bfe6ab1638fc。独立Oracle是NumPy复步微分（支持光滑tanh，不抄AD/手写链式梯度），默认数值误差约1e-15，逐状态范围容差1e-8+1e-11|参考值|，显示8位舍入按5e-9。最大逐量绝对差1.1176e-8发生在大尺度值；原始Notebook绝对最大差1.397e-9为约百万的拒绝候选，不能误报成所有值都绝对1e-9以内。

**漂移边界保留**：δ=0/η=4/正初值的预算50与200自主复算发生浮点舍入放大；Node实际TS最长52步保护、独立自主复步54步保护。reference.json公开两行诊断，reference-first-error.log保留首次失败；未删除工况、未扩大公差把长轨迹强记相等。对全部实际TS轨迹，用独立复步在同一实际状态逐一复算损失、梯度范数、更新、检查点规则与拒绝候选，全部通过；正文只对默认五工况陈述精确读数，另外明确跨实现不稳定轨迹可漂移。原始Python/严格内核/Pyodide与最终页面验证正文五工况，未将它们包装成全120工况自主轨迹一致。

资源与并行：D:/Workspace/control-universe-rank2-ml04隔离源码与.next，静态预览8212，严格内核8992；其它会话端口、共享.next及正常索引保持。原生开发页IAB跨端口连接仍是W09，HTTP200不冒充原生UI成功；最终静态页Pyodide另实跑。shared-check.log启动共享目录FAIL6、shared-semester.log的EST-03顺序项当时失败如实保留，不修他课。QA01旧负向套件、W09/W16保留，不发布gh-pages，只生产ML-04。

复验来源：最终排版修正构建使用已提交HEAD a4d3d13ad871f6cbb63a8d4411c4e45345e2977c叠加本课；验收只覆盖记录的源码快照，其后主干若前进则重新投影共享元数据并过守卫。native.json补充审计只读取原始cell已经生成的q/s及梯度，不改原始算法；全部原始setup/cell本身仍真实运行。

最终静态页面与Pyodide对独立参考396量通过，最大绝对差1.63e-9，见validation.log；单元原始输出198量及额外native q/s读取全部通过。8位读数舍入容差5e-9；科学计数法按其显示位数核对，正文百万级候选仅保留两位小数，舍入容差0.005。

提交准备的投影基线：6ebdfe534e647b416e230f9182803d5e895e2074。已包含其它会话后续提交，重新运行隔离check与学期守卫均exit0，见delivery-check.log/semester-pre-sign.log（PASS21/WARN2/FAIL0）。最终完整普通/Pages构建的精确源码基线仍为a4d3d13+本课，之后新增他课由其自身证据验收，不将此前整站构建冒称覆盖后来源码。shared-final-check.log的共享在制FAIL6为他课tracker/统计不一致，未改他课消除失败；本课共享元数据仅从已提交HEAD叠加自身字段。

主干7475da3及e5e7b38仅追加IMPL-04隔离CSS验收文档，已逐个读取并保留全部新提交文件，再刷新ML-04自己的两行进度/计划。metadata-fast-forward.json证明无课程或运行时代码变化；root-configuration.json核对本隔离构建的package/tsconfig/next/postcss均与提交一致，使用完整git archive，没有选择性复制漏掉PostCSS配置。

最终元数据快进基线e5e7b388a01dfe6d95a90be7b4edb26a73cc4a19，commit-semester.log在独立工作目录退出0。一次误从共享cwd运行守卫读到RL-02在制表格，随后按隔离目录重跑通过，未修改该课程。课程源码与已验证6ebdfe5投影一致；完整构建范围仍如前述精确基线。

暂存前MPC-03已进入master，因此以6a4c724重新投影并完整运行check/学期守卫，均exit0。随后仅接纳无课程源码变化的MPC-03回执快进至e52dac2b7651226105689a3f467a3a63ae904326，保留全部他课新记录；共享字段只追加本课。
