# ROBUST-10 时滞系统控制验收

起点master 9a1abbf31043805dedaf2a82e7b3f0f341b6d818；空占位新写，无旧MDX/标题/实验。rank5独立21095/21195/21295/8995、dist/索引，尚待实测。


## 最终验收

Phase1–4新写签发：九H2、四题全部子问/关键推导、三Notebook五cell、三滑块双图/边界按钮、真实反馈历史SVG。准确标量a>0/k>=0模型，固定常delay与时变Halanay条件分开；无旧MDX/标题/实验可迁，无历史URL需要新增迁移。

| 命令/范围 | 实际结果 | 证据 |
|---|---|---|
| nb-cells verify robust/delay-robust-control --require-kernel --port8995 | 退出0，5cell/error0/SKIPPED0 | notebooks.json/log、extracted.json |
| 实际TS/独立reference.py | 退出0，90解析配置、540频点、12历史/Padé轨迹各两步长，DOP853/expm/复频响/根/SymPy | actual-ts.json/log、reference.log/reconciliation.json、runtime-versions.json |
| Worker/Python支持 | 3/3Notebook、5/5cell通过，codeOnly0，完整MDX hash匹配 | pyodide.json/log、python-isolated.log |
| 两种生产构建 | native/pages均退出0，无MDX编译失败，私有dist/cpus2 | build.log、pages-build.log |
| verify WIKI_VERIFY_PORT21095 | 退出0，PASS9/WARN0/FAIL0/SKIPPED0 | verify.log |
| 原生/Pages真实页面 | HTTP200/H1=1/H2=9/KaTeX0/全编译ID与片段、三滑块/边界/证书保守/假稳定/Halanay/零/最小delay/恢复、375px无pageerror | browser-native/pages.json、各PNG |
| SVG/静态产物 | 全图与局部滚动两端已查看，官方verify-pages205课/9旧路由/310130350bytes退出0 | diagram-audit.json/PNG、pages-official-verify.log |
| 数学/术语 | files0/tokens0；PASS4/WARN2/FAIL0，冻结表提示保留 | math.log、glossary.log |
| 仅本课提交投影 | 最新已提交master叠加本课，六门槛退出0，官方重算outline/tracker | staged-validation.json、staged-*.log |

实测：默认a1/k2/tau.5，精确临界1.209199576/omega1.732050808、小增益严格界.755928946/默认包络峰.8、Padé近似界2。tau1小增益峰1.109400但真实仍稳；tau1.5真实根.065617711+1.466186852j，而Padé实部−.166666667，近似假稳定。a1/k.5/barTau1的Halanay速率.314923058；默认a1/k2不满足该充分条件。标量TS独立误差1.23e−13、Lambert相对残差8.77e−16；DDE归一化窗内粗4.94e−4、半步1.23e−4，符合预设1e−3；Padé与expm差3.07e−8。

科学范围：稳定结论来自指定标量常delay解析界或声明条件的充分证书，不靠有限41分支/12秒曲线/Padé证明。所有响应phi恒1/w0，近似内部记忆v0=1，不能只匹配x0。连续有界时变delay的Halanay仅a>k；k=a的有限常delay稳定不外推无界delay统一速率。未知参数、任意跳变/丢包/采样保持、Smith全设计和实机安全未被代签。

并行：rank5独立21095/21195/21295/8995、私有dist/cpus2/Git索引，不碰共享.next或他课暂存。共享开工check6项在途FAIL、semester的RL-02列数错误留原始输出；本课仅用最新已提交master加本课投影验收。既有build:pages重定向后处理在私有导出目录运行后官方静态检查通过，未改生产发布基础设施。只本课，不发布Pages、不生产ROBUST-11；master真实hash稍后登记。


收尾实测：rank5内核3→0，21095/21195/21295/8995四端口全部释放，见kernel-cleanup.json与ports-cleanup.json。共享工作树末次check退出1（6项在途FAIL），原始semester因RL-02列数退出1，见end-root-exits.json；仅本课最新master投影六项退出0，不带入其它会话在途修改。
