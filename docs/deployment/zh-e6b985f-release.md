# e6b985f 中文润色授权发布

2026-10-19用户授权快速审核后合入master并发布Pages。来源润色分支e6b985fceccc266c07a6f58483e746e34d85be0b，真实master合并66c1b1385623331982ec643842493df006b7a013，发布源master bc39c2d2ae7ffc7cac58c4938f3783d9d6a99bad。四课正文润色、一课零编辑复核；审核修正、代码等价与本地实际验收见.agent/semester-03/zh-lang-edit/merges/e6b985f/acceptance.md。

gh-pages发布提交4a4dc5f333416ce79c7c3320f81a3a3eb8f91b84，普通no-ff合入并正常推送，无强推；content/components/lib/public/scripts/.github与源master一致，四处本地端口及用户proofreading未提交。长期润色分支保留。

GitHub Actions [39181708024](https://github.com/fanqing-zeng/control-universe/actions/runs/39181708024)的build/deploy均success。公网release.json精确匹配本次发布SHA，sourceDirty=false。

| 实际公网验收 | 结果与证据 |
|---|---|
| node scripts/verify-public-pages.mjs 4a4dc5f333416ce79c7c3320f81a3a3eb8f91b84 docs/deployment/zh-e6b985f-public-http.json | exit0；205课程/9旧入口/235请求通过，未知页404，脚本/CSS/字体正常 |
| 四改课真实页面 | math/calculus-basics、adaptive-control-basics、iss-small-gain、bifurcation-chaos的H2/旧ID保留；KaTeX0、console error0；public-browser.json |
| 微积分六实验 | 公网原始setup与六cell全passed；源hash和workerHash与本地一致，输出逐字相同；public-python.json |
| 引入与术语 | 秒表记录时刻/再量位置正确，STR实验标题为“确定性等价”；public-browser.json/png |
| node docs/deployment/zh-e6b985f-public-check.mjs | exit0，public-validation.json pass=true；运行源码树与源master完全相同 |

合并只覆盖本轮四课正文、一课零编辑记录及交接资产；不是全站重新润色或全部实验重跑。原有DISCRETE-01、Python字体修复、60课生产进度与W14/W15/W16保持。全局ZH04和DEP14登记真实hash。发布后回执仅文档提交至master，无需再次触发Pages部署。
