# IMPL-07 网络控制验收

新写单课：10个H2、五题答案、三个Notebook/六cell、双图Explorer、SVG。Phase1合同先于实验/正文，三轮生成、六组审校与签发见讨论日志，角色为结构化视角。

数值：40工况，实际TS9886个量、含Notebook总14146；最大绝对差3.055902197957039e-10，满足逐量1e-10*(1+abs(reference))，不是全局绝对1e-10。实际浏览器另复核661个量。

原生内核六cell/error0；原生UI、Pyodide、Pages均三个原始setup和六cell成功。verify PASS9/WARN0/FAIL0，真实DOM H2=10/KaTeX0/目录ID有效；双canvas和四image加载。375px夹具html360/scroll360、图298、表540在298容器内滚动。参数边界与默认恢复实点，Pages控制台无error。

npm run build与build:pages均exit0，无MDX编译失败；build-origin.json保存实际构建基线与源码哈希，正确PostCSS配置与工作区字节相同，css-artifacts.json核验prose样式。最终提交基线在delivery.json，不与构建基线混称。

原始共享工作区npm run check退出1（PASS19/WARN2/FAIL7）；学期校验退出1（RL-02列数），保留baseline日志。隔离HEAD+仅本课原始catalog CLI通过PASS21/WARN2/FAIL0；两WARN为既有重名及缺日志。最终提交前再刷新完整学期证据与Python策略。glossary:check退出0（PASS4/WARN2/FAIL0），implementation公式围栏exit0（files0/tokens0）。首次verify合节失败记录保留，已修复并重测。

证据：reference.json、actual-ts.json、reconciliation.json、notebooks.json/log、ui-native/pages/interactions/narrow*.json、pyodide.json、pages-console.json、build*.json/log、css-artifacts.json、validation.json、scoped-check.log及scoped-semester.json。不得据此声称真实网络最坏时延或硬件安全认证完成。

源码LF SHA256：81c1d7c445e1c9c637a46e704f4aeebfb46bb37ee69e61b15a835c4e9dbc8e30。

rank1使用独立目录/索引及8191/8991/9196端口，仅提交本课，保留并行修改，未发布gh-pages。下一课IMPL-08工业通信，本对话不继续生产。

真实master提交回执待登记。
