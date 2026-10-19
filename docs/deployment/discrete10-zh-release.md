# 离散控制与润色授权发布

2026-10-19用户明确授权：拉取润色分支、快速审核通过后合master，并将全部当前更新发布GitHub Pages。固定润色d05e876，包含45课记录/37课正文；新增课程DISCRETE-02–10的已交付成果全部包含。01未完草稿与四处本地端口/用户批阅不提交。审核证据.agent/semester-03/zh-lang-edit/merges/d05e876/acceptance.md。

当前尚未发布：真实master合并、gh-pages SHA、Actions与公网HTTP/Python/UI结果将在完成后补入，不能以本地验收冒充公网。

实际润色合并master 9cafbd4020cd72457b36bbbf1b8edb7d5c5e570e。45课记录/37正文经技术审核，修正指代与兼容锚点；227实验载荷等价迁移而非全部重跑；微积分6实验实际抽测。W15历史数字笔误登记待独立勘误。最终发布结果见下表。


发布SHA：2dd926fe7d2a4daa810a76690d69582933b54a0b；源master：58d828d77b38f34a684035dcd774e17950f713e0。正常--no-ff合入gh-pages并推送，无强推。Actions run [39167345295](https://github.com/fanqing-zeng/control-universe/actions/runs/39167345295) build/deploy均success；公网release.json精确匹配SHA且sourceDirty=false。

| 实际公网验收 | 结果与版本化证据 |
|---|---|
| 全站HTTP | node scripts/verify-public-pages.mjs 2dd926fe7d2a4daa810a76690d69582933b54a0b docs/deployment/discrete10-zh-public-http.json退出0；205课程/9旧入口/235请求通过，未知页404，CSS/脚本/KaTeX字体正常 |
| 新离散课完整Python | discrete10-zh-public-python-02.json至-10.json；9课/29实验/39cell全passed，worker及课程源hash一致；1085个打印数字与本地按1e−8容差比较通过 |
| 润色新稿 | 公网微积分首实验实际按钮运行，新引入文案可见；本地原始六实验全部重跑，227旧实验仅按代码载荷等价迁移指纹，未声称全量重跑 |
| 新旧锚点 | modern/lyapunov-modern旧模式ID与新模态标题同时存在；LQR旧鲁棒性ID实际存在，verify仅H2集合WARN非新死链 |
| 最新课页面 | 公网事件触发控制8H2/KaTeX0，四cell按钮全部运行、漏检预设/恢复、图例与曲线正常，images加载/console error0 |
| 手机375px | actual width375/scrollWidth360，KaTeX0，控件/图例可读，public-mobile.json/png |
| 联合放行 | node docs/deployment/discrete10-zh-public-check.mjs退出0，public-validation.json pass=true；发布运行树与源master完全相同 |

上述缩写public-*证据均为本目录discrete10-zh-public-*前缀。桌面截图discrete10-zh-public-desktop.png；Actions原始作业在public-actions.json。全局checklist ZH03/DEP11据实际合并/发布勾选，生产进度仍59课；01草稿与本地端口、用户批阅均未提交。17个Python代码展示待办、W14与W15保留；长期润色分支保留，不宣称用户已经认可全部语言质量。

发布后的验收记录/截图/回执在master补充提交，不再次自动触发Pages；课程与运行内容已全部包含上述授权版本。
