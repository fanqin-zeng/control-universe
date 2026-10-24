# ID-09 系统辨识案例授权发布

2026-10-24用户要求“将这些内容推送到github pages”。固定批准版本master `dcaa4c8b0eff92b7c96f322042f1fd219396774b`；在独立rank3发布工作树，从origin/gh-pages `4acd64ae008bd18555caefeb8e937a379dce6fa8`正常no-ff合入，生成 `b6a37b164c06da306c40b34a165dfded768dd4fd`。发布树与批准版本完全相同；之后并行产生的master课程更新未自动纳入。主工作区保持master，共享暂存与其它修改保留，没有强推。

本地npm run check：PASS21/WARN2/FAIL0；14项Pages/路由/浏览器Python/发布决策测试通过；npm run math:check和npm run build:pages退出0。静态导出205课、9旧入口及资源检查通过，release.json sourceCommit精确等于发布提交且sourceDirty=false。两WARN为既有motion-planning跨章重名和5门历史正文缺日志。

GitHub Actions构建、部署均成功：[运行记录](https://github.com/fanqin-zeng/control-universe/actions/runs/40085650056)。正式站点为https://fanqin-zeng.github.io/control-universe/ ，公网release.json再次精确核对同一发布SHA及sourceDirty=false。

公网检查：205课、9旧入口、235请求通过，未知地址404；CSS/字体、标题与Python运行模式核验通过。本课实际页面运行3Notebook/3cell，全部96条重复记录保留，1023个输出与独立Python期望值核对，最大差2.1097287504698419e-15；实际服务Worker字节hash匹配。六预设、十控件端点、拒绝、恢复默认，11H2的文本/ID/目录、SVG/双图、375px及pageerror0通过，公网页面截图已复核。

本次只重跑ID-09的三个公网实验，不声称执行全站全部Python。证据位于`.agent/semester-03/id-09/pages-release/`和同级browser-public.json及public截图。工作树只作发布隔离，未占共享8080/8891。回执仅记入master，不自动再部署发布分支。
