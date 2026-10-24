# ROBUST-08 μ综合验收

起点master ad7cad786f75c71d13c22f36538d35f7ca117ea3，原文LF SHA256 f0aead984faf849a47f23c559b24959ac10eabce8c07a6fbf0582ae973880047。Phase1与原资产映射完成，尚待实测签发。rank5独立端口20495/20595/20695/8995，私有dist/索引；不发布Pages。


## 最终验收

Phase1–4重构签发：33原编译标题ID与11H2、原四题所有子问和两Notebook四cell实验目的全部保留。新增三滑块/双图、真实K-D单步与初值轨迹、SVG，最终三Notebook六cell。原PI保留失稳失败，不伪造成H∞/μ综合优胜；外部MATLAB模板完整但明确未执行。

| 命令/范围 | 实际结果 | 证据 |
|---|---|---|
| nb-cells verify robust/mu-synthesis --require-kernel --port8995 | 退出0，6cell/error0/SKIPPED0 | notebooks.json/log、extracted.json |
| 实际TS与独立reference.py | 退出0，2020配置、101独立LP、500额外LFT回代、符号消元与见证 | actual-ts.json/log、reference.log、reconciliation.json |
| Worker/Python支持 | 3/3Notebook和6/6cell通过、codeOnly0、完整源hash一致 | pyodide.json/log、python-isolated.log |
| 两种生产构建 | native-final与pages-final均退出0，无MDX编译失败，私有dist/cpus2 | build-final.log、pages-build-final.log |
| verify WIKI_VERIFY_PORT20495 | 退出0，PASS9/WARN0/FAIL0/SKIPPED0 | verify-final.log |
| 两种实际页面 | HTTP200/H1=1/H2=11/KaTeX0、旧ID33/所有片段、3滑块/两子步/端点/3初值/恢复、PNG/SVG/375px | browser-native/pages.json、各PNG |
| 旧锚点/图示 | 同一Math→KaTeX→全级slug与DOM；局部SVG可横滚/全图已查看 | headings-before/after.json、diagram-audit.json/PNG |
| 数学与术语 | files0/tokens0；PASS4/WARN2/FAIL0，冻结表提示保留 | math.log、glossary.log |
| 仅本课提交投影 | 最新已提交master叠加本课，check/semester/fix/python/glossary/math均退出0 | staged-validation.json、staged-*.log |

实测数值：TS独立误差最大1.34e−15；2020见证残差3.24e−16；物理LFT额外回代误差1.41e−15。默认k.5/d1：μ.760345316、可行D上界1.25、最优d.608276253。两初始D四轮分别停在k25/29、μ41/58与k0、μ.5；初始d2另到k1/μ.632455532。一般D-K不承诺联合局部最优/全局最优、动态拟合不无条件单调。原PI标称maxRe+.065471556，全物理方形Routh失败，500/500样本失稳，有限30秒maxabsu28.135920未满足原10约束；不将形式频响/代数DC冒充稳定范数或终值。

科学范围：限定静态K=kI2/常D模型完整给P，精确全频峰来自特殊解析结构与DC见证；实际H∞/混合μ通用综合未在本机执行。原质量刚度正方形包括同时端点，角点和随机频响不冒充满块保守性比例；Monte Carlo不证明全域稳定性能，能量增益不等于阶跃硬限幅。

并行：rank5独立20495/20595/20695/8995、私有dist和Git索引，保留共享.next及其他会话暂存。开工共享check退出1（他课status/tracker在途不一致），semester退出1（RL-02在途列数）；仅本课投影六门槛通过，不把全工作树冒称绿。构建保留仓库既有img/hook提示，本课无新lint错误；曾在最终构建完成前启动预览导致缺manifest，待构建退出0后重启完成全页面验收，不当成课程或框架失败。只交付本课、RB08实际修复，不发布Pages、不生产ROBUST-09。真实master hash随后登记。


收尾实测：rank5内核3→0，20495/20595/20695/8995四端口全部释放，见kernel-cleanup.json与ports-cleanup.json；共享缓存、其他会话进程及暂存均保留。共享工作树末次check仍因并行在途元数据退出1（6项FAIL），semester因RL-02列数退出1；仅本课提交投影六项均退出0。
