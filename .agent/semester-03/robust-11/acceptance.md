# ROBUST-11 鲁棒控制案例验收

本课按wiki-lesson-refactor完成Phase1–4。保留35旧编译标题ID、11H2、四题全部子问、原两Notebook五cell用途，增加答案cell、真实物理/流程SVG与三滑块双图/四工况按钮。

修正双质量分母、参数重复缩放、完整物理LFT与权重DC冲突；原手调PID在正确对象上最右极点+.515387707，失败诊断保留。无来源的H∞/μ数值与D-K迭代表撤销结果身份，外部MATLAB模板未执行。显式比例q1在固定阻尼的m2[.3,.7]/k[8,12]矩形稳定有Routh正系数解析证书，下界6.825/10.2997；原工程性能需求尚未满足，不能把课程交付当成控制器设计成功。

| 验收范围 | 实际结果 | 证据 |
|---|---|---|
| 原始Notebook | 3Notebook/6cell、严格8995/error0/SKIPPED0；Pyodide3/3、codeOnly0、完整源hash相符 | extracted.json、notebooks.json/log、pyodide.json/log、python-isolated.log |
| 独立数值 | 真实TS150配置/1050频点/6轨迹两步长、独立物理矩阵特征值/expm、500LFT/SymPy | actual-ts.cjs/json/log、reference.py/log、reconciliation.json/runtime-versions.json |
| 原cell与样本 | 抽出的原始setup/cells终端实跑，1000样本与独立物理特征向量解误差<1e−9 | minimal.py/json/log |
| 页面验收 | verify PASS9/WARN0/FAIL0/SKIPPED0；两模式HTTP200/11H2/35旧ID/KaTeX0、控件/恢复/375px/no pageerror | verify.log、heading-audit.log、headings-before/after.json、browser-native/pages.json/log、PNG |
| 两生产构建 | native/pages退出0、210/210页、无MDX编译失败，私有dist/cpus2 | build.log、pages-build.log、build-exits.json |
| 静态/SVG | 官方verify-pages205课/9旧路由退出0；完整图/窄屏两端截图已查看 | pages-official-verify.log、diagram-audit.json/log/PNG |
| 本课提交投影 | 最新已提交master仅叠加本课，check/semester/fix/python/glossary/math六门槛退出0，官方生成outline/tracker | staged-validation.json、staged-*.log、scope-audit.json |

实测：标称q1超调79.2852%、采样调节57.80s；1000样本全稳，超调最小77.1200%/均79.2334%/最大81.4131%/p95 80.9550%，实际采样F峰约1N，最慢已调节65.60s，120s未调节0。q8标称稳定却在m.7/k8角点失稳。采样峰值/调节读数不冒充连续极值/全域性能。标量误差2.82e−14、LFT误差1.21e−13，轨迹按窗口最大幅值归一化粗5.89e−7/半步3.68e−8，低于1e−5。

范围：仅两实参数、固定阻尼、连续线性模型、原测量x2、零初值单位阶跃。阻尼±30%、高阶动态/饱和/噪声/采样实现与功能安全未代签。传感器冻结/卡死、独立监测/限位/制动与停机验证在正文交代；无接地弹簧所以断力不自动归位。

并行与WARN：使用rank5独立21395/21495/21595/8995、私有dist/索引，保留其它会话暂存与未提交内容。开工共享check有6项在途FAIL、semester因RL-02列数错误退出1，原始日志保留；本课用最新已提交master投影六项验收。nb-cells S7×3仅language属性被忽略，6cell实际执行均成功；术语冻结表WARN2保留。旧Pages重定向后处理仅用于私有导出，未改发布设施，不发布Pages。

起点与原文完整LF hash见baseline.json，原文source-before.mdx永久保留；所有资产映射见讨论日志附录D，无未迁材料。本对话仅ROBUST-11；真实master提交后登记hash。


收尾实测：rank5内核6→0，21395/21495/21595/8995四端口全部释放，见kernel-cleanup.json与ports-cleanup.json。共享末次check/semester均退出1，原始日志保留；本课投影六项和原始semester CLI均退出0。SVG标签/流程箭头作最后视觉调整后，私有public与静态导出同字节，官方Pages与SVG截图复验通过，见scope-audit.json。
