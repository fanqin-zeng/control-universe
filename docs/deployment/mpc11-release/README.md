# MPC-01—11授权发布与公网验收

2026-10-24，用户在MPC-11完成后要求“将这些内容推送到github pages”。固定获准master `8ab3a802cb8ca133568ebab63ba6bd366f67ddcc`，将其正常no-ff合入远端gh-pages `99945e1fd8f2abe94ed7db92e889d79223692979` 得到发布提交 `beb3108506c42bcc5b50cea36be14da8dcbfac45`。合并内容树与获准master完全一致；未带入后续并行提交，未强推、未重写历史。

GitHub Actions [构建与部署记录](https://github.com/fanqin-zeng/control-universe/actions/runs/40091509399)结论为success。公网 [控制宇宙](https://fanqin-zeng.github.io/control-universe/) 的release.json实测sourceCommit等于上述发布提交、sourceDirty=false。`public-http.json`覆盖205课程/9旧入口及CSS/字体/图片等235个成功请求，未知地址404。

MPC章节11课共25Notebook/51cell全部在真实公网页面由生产浏览器worker运行完成，无Traceback、无本机127.0.0.1/localhost请求；逐页H1/H2精确管线、目录目标、唯一ID、KaTeX0、图片加载及375px无全页溢出。MPC08—11控件变化/复位额外实测；MPC08/11全部历史ID公网存在。证据见public-courses.json，MPC11截图已查看。公网执行不替代各课严格Jupyter内核和数值证书；既有课程交付证据仍保留。

本地预发布npm run check为PASS21/WARN2/FAIL0，math:check通过，发布/路由/浏览器Python相关14个测试通过；完整npm run build:pages及205页/9旧入口静态资源验证exit0。仅本地为限制并行占用临时设置experimental.cpus=1，构建后恢复原始配置字节，推送前checkout完全干净且内容树与获准版本相等。本地试构建release.json的dirty=true由该单一并发配置产生，本地out未上传；实际线上为Actions从干净发布提交构建，公网dirty=false已核。

本会话采用独立发布clone和外部证据目录，未切换共享工作区分支，未暂存/重置/清理共享Git索引或删除索引锁。发布回执追加到master，不自动再次发布此回执或后续并行内容。原11课的模型适用域、安全与性能限制保持不变，不因部署成功扩大承诺。

## 证据

- target.json / local-gates.json / check.log / math.log / tests.log / pages-build.log：固定版本与本地发布闸门。
- push.log / actions.json / public-http.json：真实推送、Actions与公网版本/资源。
- public-courses.json / public-mpc11-*.png：11课逐Notebook运行、控件/锚点/手机。
