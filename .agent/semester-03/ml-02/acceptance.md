# ML-02 监督学习验收

2026-10-24，用户指定继续ML-02，rank2。仅本课新写；ML-01和凸优化为已交付先修，暂缓并行中的IMPL-01–10，不依赖其草稿。

保留所有开工时用户及其它会话修改。构建采用已提交master加本课的独立副本D:/Workspace/control-universe-rank2-ml02；页面8194（8192仍为上一轮ML-01预览，未终止）；本课内核8992。不得删除共享.next或终止其它会话进程；Git只暂存本课及共享文件的本课差异，提交前核对master与暂存范围。Pages未获发布授权，仅本地验收。

Phase1–4与本课真实验收完成，郑核已据日志签发；真实交付提交已进入master并推送origin/master：`739e31043ce4f29ef132cafa86d9536cfd8334d9`。不发布Pages。

交付：244行正文、9H2、两Notebook四cell、一个回归/分类Explorer及一幅SVG、四题四答。先修ML-01与凸优化；回归半MSE/正则化、逻辑回归概率/交叉熵、训练与预测接口、停止条件、阈值和可分数据有限最优解边界。

| 实际命令/操作 | 结果 | 版本化证据 |
|---|---|---|
| npm run check（开工共享基线） | exit0；PASS21/WARN2/FAIL0 | check-before.log |
| 独立副本npm run build | exit0，无MDX失败 | build.log |
| 独立副本PAGES_BUILD=1/NEXT_PUBLIC_STATIC_EXPORT=true/NEXT_PUBLIC_BASE_PATH=/control-universe npm run build | exit0，最终原文与浏览器政策静态导出 | pages-build.log；本地预览，不推gh-pages |
| WIKI_VERIFY_PORT=8194 node scripts/verify-lesson.mjs machine-learning/supervised-learning | exit0，九项PASS、HTTP200/H1=1/H2=9/KaTeX0 | verify.log；最终静态DOM另存 |
| curl.exe --noproxy '*' -s -o NUL -w '%{http_code}' http://127.0.0.1:8194/control-universe/machine-learning/supervised-learning/ | HTTP200 | static-http.log |
| node scripts/nb-cells.mjs verify machine-learning/supervised-learning --require-kernel --port8992 | exit0；2Notebook/4cell/error0/SKIPPED0 | notebooks.log/json |
| node .agent/semester-03/ml-02/reconcile.mjs | exit0；20回归/24分类配置对独立SVD+Fraction/70位mpmath，最大差8.881784197001252e-16；34原始Notebook量最大差1.2378986724570495e-14 | reconciliation.log/json、reference.py、actual-ts.json；6464节点/216阈值组合 |
| 原始Pyodide逐课运行 | 两实验四cell全passed，最终sourceHash一致 | pyodide.json；首轮缺资源失败另留pyodide-first.json |
| 最终真实课页两次“全部运行” | 四原始输出全部完成，图像生成；控制台error为空 | browser-pages.json、desktop.png |
| 任务/惩罚/扰动/阈值/预算/默认恢复 | 十组交互读数核验；零步、一步、提前收敛、预算未收敛均显示真实状态 | browser-controls.json |
| 最终DOM/侧栏/375px | H1=1/H2=9/重复ID0/KaTeX0，全部本站片段有效；width375/scrollWidth360；SVG存在 | browser-pages.json、browser-mobile.json、mobile.png、mobile-controls.png |
| node .agent/semester-03/ml-02/validate.mjs | exit0，源hash/内核/页面/控件/手机/政策核验 | validation.log |
| 独立交付投影npm run check | exit0；PASS21/WARN2/FAIL0 | projection-check.log；两WARN为既有重复slug与旧日志债务 |
| 独立交付投影npm run glossary:check / math:check | exit0；术语PASS3/WARN2/FAIL0，同行围栏违规0 | projection-glossary.log、projection-math.log |
| 独立交付投影node scripts/check-python-support.mjs | exit0；只增加本课两实验可运行状态，旧降级政策保留 | projection-python-policy.log |
| 独立交付投影node scripts/check-semester03.mjs | exit0；使用真实仓库GIT_DIR校验历史master提交，非无Git假快照 | projection-semester.log |

最终正文SHA256：87fe654d4d096524885406c1ac0da0332b5fbff6786c8ded01bcdeac1f4652b9。数值绝对容差1e-9，组件显示按8位舍入。

共享目录的校验保留真实边界：glossary.log中C2失败为并行robust/robustness-concept的“增益裕度下界（dB）”新增别名，非本课词条；shared-check.log保留他课catalog/tracker在制不同步，shared-semester.log保留INTEL-01顺序例外尚未登记的时点。未修他课，也不冒称这些共享命令通过；本课使用已提交master叠加ML-02的投影完整验收与独立暂存。QA01历史负向测试未修改，不把旧失败套件算作本课通过。

运行资源：独立8194静态预览与8992严格内核；上一轮8192及其它会话端口不动。Git archive未包含ignored Pyodide资产，首次浏览器运行404，复制既有本地public/pyodide后重启本会话Next刷新文件索引，HTTP200后重新执行四原始cell全部通过。未改公共worker或全站运行时；W09/W16历史债务保留。

最终已验证投影基线：9d920bbaed693d869f943701acc8658c4d9914b6；提交父版本：9d920bbaed693d869f943701acc8658c4d9914b6。仅接纳不改变源码的回执快进。最终check PASS21/WARN2/FAIL0，术语与学期检查退出0；Python政策报告：{"pass": true, "lessons": 91, "enabled": 396, "codeOnly": 15}。独立Git索引提交，保留其它会话共享暂存状态。

真实交付回执：commit:739e31043ce4f29ef132cafa86d9536cfd8334d9，2026-10-24正常推送origin master成功，源父版本9d920bb。提交使用独立Git索引，未带入其它会话暂存内容；未发布gh-pages，未继续ML-03。远端返回迁移提示但push成功，本轮未擅改origin URL。
