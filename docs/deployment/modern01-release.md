# MODERN-01 与现有修改的 Pages 发布

2026-10-18，用户在MODERN-01执行过程中追加授权：“这节课做完后，把当前修改推送到远端github pages上。”课程完成提交7e4ee5f、master交付回执75c4f3b已正常推送origin master；随后将75c4f3b663e55745c0fdd854d01a0198163d1f71以--no-ff合入既有长期gh-pages分支，得到42eed1d509b90699fda0eff8d45f369d7dd7a210并正常推送，无强推、不重写历史。未创建日常工作分支。

发布包含MODERN-01、此前数学两课生活入口、传递函数四张SVG与手机目录独立滚动修复。用户三份未提交proofreading文件未混入提交。课件本地验收见.agent/semester-03/modern-01/acceptance.md；五原始实验原生内核及Pyodide通过，实际TS对独立参考21×601点，两构建通过。Python清单73课/328实验/501cell，301启用、27代码展示；未宣称27待办清零。

[GitHub Actions 39101009419](https://github.com/fanqing-zeng/control-universe/actions/runs/39101009419) 构建、部署均成功，公网发布版本与上述 SHA 一致且 sourceDirty=false。235 次请求通过，覆盖 205 课程页、9 个旧入口及缺失页 404。公网真实 DOM 保留 36 个旧锚点，10 个 H2、KaTeX 错误为零、SVG 加载正常；初值滑块边界与恢复默认通过。390px 手机目录可滚到工程应用，正文位置不随菜单滚动；数学两课引入和传递函数四张 SVG 回归通过。

公网首次冷加载时，实验审计第一份实验触及 180 秒预算，另四份成功；同时启动的课程页实验亦被终止。保留 modern01-public-python-first.json，不将首轮记为通过。资源缓存后顺序重跑，五份原始实验全部通过；随后单独运行课程页“非零初值与恒力响应”，出现“运行完成”、机械读数与图像。该结果证明缓存后运行可用，不代表所有网络环境首次加载均能在预算内完成。本次公网复跑范围为本课五份实验，未宣称全站 328 份重新执行。

证据：modern01-public-actions.json、modern01-public-http.json、modern01-public-browser.json、modern01-public-python.json、modern01-public-validation.json，以及页面和手机截图。node docs/deployment/modern01-public-check.mjs 退出码 0。最终 checklist 与 npm run check 输出另存 modern01-release-checklist.log、modern01-release-check.log；本发布回执直接提交推送 master，不为纯回执再次触发 Pages 发布。
