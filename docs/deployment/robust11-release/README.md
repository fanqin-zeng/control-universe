# 鲁棒控制章授权发布与公网验收

2026-10-24，用户在ROBUST-11完成后明确要求“将这些内容推送到github pages”。固定获准master `73960c973297019225f0a5b9525ce78465aa2f3d`，将其正常no-ff合入此前gh-pages `beb3108506c42bcc5b50cea36be14da8dcbfac45`，得到发布提交 `abf9217b21179ed366191d1a06443f4054a36cd6`。发布树与获准master完全一致；相对前次上线主要新增ROBUST-09、10、11，既有ROBUST-01—08一并做公网回归。未带入并行会话的未提交内容，未强推或重写历史。

GitHub Actions [构建部署记录](https://github.com/fanqin-zeng/control-universe/actions/runs/40096209033)实际success。[控制宇宙](https://fanqin-zeng.github.io/control-universe/)的release.json实测sourceCommit等于该发布提交、sourceDirty=false。公网全站205课、9旧入口及CSS/字体/图片等235个成功请求，未知页404。

鲁棒控制章11课的37Notebook/56cell均在实际公网页面由生产Pyodide Worker运行完成：逐cell检查输出和Traceback，全部完成，无本机127.0.0.1/localhost请求。逐页H1/H2、共用编译管线的全部标题ID、目录片段/唯一ID/KaTeX0/图片加载/375px文档无横向溢出；ROBUST-11的35旧编译标题ID保留。ROBUST-09—11滑块变化/恢复与ROBUST-11失稳角点按钮通过。H∞滤波旧地址保留query/hash且实际跳转正确，见public-courses.json。

本地预发布check PASS21/WARN2/FAIL0、math通过、发布相关14测试全过、完整build:pages与205课/9旧入口检查退出0。独立发布checkout仅本地临时限制experimental.cpus=2，构建结束恢复next.config.mjs原始字节，推送前完全干净。本地试构建dirty=true由该单项临时配置造成，本地out未上传；真正上线由Actions从干净发布提交构建，公网dirty=false已验证。

发布成功不扩大课程的数学或工程结论：ROBUST-11原PID失败、比例基线瞬态不达标、通用H∞/μ综合模板未执行等边界继续保留，静态上线不替代严格Jupyter与数值证明。页面、代码、交互已发布，并不表示教学中的控制器已通过实机验收。

使用独立detached发布worktree与外部证据目录，未切换共享工作区分支、暂存/重置/清理共享索引或使用8080/8891等并行端口。master只追加本发布回执，不自动再发布回执或之后的并行更新。

证据：target.json/local-gates.json/check.log/math.log/tests.log/pages-build.log为本地门槛；push.log/actions.json/public-http.json为真实推送/部署/公网版本；public-courses.json及public-robust11-*.png为全章页内实验、控件、旧ID与手机布局。
