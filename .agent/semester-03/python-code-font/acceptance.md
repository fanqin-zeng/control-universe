# 在线Python代码字体统一

用户要求所有网页版用例代码改成初始化代码使用的字体并直接发布。只改BrowserNotebook共享显示样式；初始化代码、全部编辑cell、标准/错误文字输出共用原初始化代码的等宽字体组合，不修改课程/数值/执行逻辑。

实际公网改前computed style见before.json：pre为ui-monospace/SFMono-Regular/Menlo/Monaco/Consolas/Liberation Mono/Courier New/monospace，textarea仅monospace；字号16px、行高28px相同。

| 实际验收 | 结果 |
|---|---|
| npm run build:pages | exit0；205课/9旧路由，无MDX编译错误；build.log |
| npm run check | exit0；PASS21/WARN2/FAIL0；check.log |
| node scripts/check-python-support.mjs | exit0；82课/375可运行/16保留代码；python-policy.log |
| node scripts/check-fix-logs.mjs | exit0；070索引详情一致；fix.log |
| 本地Pages真实DOM | 六初始化pre+七textarea共13元素font-family逐字一致；local.json |
| 目检 | 展开初始化代码与实验编辑框同时可见，字体一致；local.png |

本机四处端口配置和用户proofreading不提交。共享组件覆盖全部BrowserNotebook课程；仅样式变更，无需重跑全部课程数值。发布、实际按钮运行和公网字体复验另记docs/deployment/python-code-font-release.md。
