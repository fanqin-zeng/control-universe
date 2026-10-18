# CLASSIC-08「校正网络」验收

本轮唯一课程classic/compensator-design，起点master65715b2，工作分支wp/classic-08-compensator-design。按wiki-lesson-refactor及学期3共同流程完成Phase1–4，十个既有角色视角、三轮生成、六组审校、98行六列三方对账、九门槛与五项红队记录见docs/discuss-log/semester-03/03-classic/08-compensator-design.md。无其它课程交付，不发布gh-pages；两份用户proofreading文件不暂存。

原12主题/全部H3-H4与十题主题保留；H1短名、工程段改电机位置，54旧ID以2别名兼容。四原交互保留，真实完整传函及状态方程替代伪二阶曲线和错误抗饱和对象。固定K滞后不改变Kv、高频β/组合αβ、真实交越与全部模态一并核验；旧组合PM仅16.858985°，撤销虚假达标，新方案wc3/PM53.983891°。题8试探失败不证明整类不可行；原PI5/10临界性公开，新PI5/2固定预算/多限幅含持平。十题答案与六实验复算，不冒充实机性能保证。

## 实际验收

| 命令 / 证据 | 退出码与结果 |
|---|---|
| node scripts/verify-classic08.mjs；reconciliation.log/json、reference.py | 0；102环路×401幅相点，最大差1.705303e-13；真实TS完整响应501节点最大绝对差1.690817e-6，发散工况用1e-6+1e-12×abs(ref)混合容差；12限幅×501三状态量独立ODE误差8.972166e-8、半步差1.139462e-7；六原始实验新内核PASS |
| nb-cells verify classic/compensator-design --require-kernel；notebooks-final.log/json | 0；EXECUTED6Notebook/6cell，WARN0/FAIL0/SKIPPED0 |
| nb-cells extract/assemble；extract.log/assemble.log/extracted.json | 0；12原始求值代码块反向逐字全等，临时roundtrip删除 |
| 浏览器Pyodide原始setup/cell；browser-python.json | 六实验passed/0code，最终源码hash df453758b140aaaf10c2c6677c6feff83607d41052658dcfd3b93ecc0ea1bdd7 |
| finalize --merge/write-report/preserve-debts/check-python-support | 0；71课/316Notebook/489cell，289enabled/27code、464成功cell；70门原记录及27待办完整对象/编号不变 |
| npm run build；npm run build:pages；npx tsc --noEmit | 均0；build.log/pages.log/types.log，无MDX编译失败；205课/9旧路由/313954336bytes。本课初次build多余导入失败已修后重跑 |
| npm run verify -- classic/compensator-design；page.log | 0；9PASS/WARN0/FAIL0，HTTP200/H1=1/H2=12/KaTeX错误0；全仓另两旧组件提示不计本课 |
| node check-browser.mjs；browser-check.log/browser-results.json | 0；真实DOM12H2/全54旧ID/2别名、24居中公式、各表列数一致；6Notebook/textarea、10canvas、四滑条端点/恢复；真实课程最后实验按钮运行完成；console=[] |
| 390px生产页；narrow.png | 文章343=scroll343，文档375=scroll375，6Notebook341=scroll341；10图宽343，无文档溢出，长公式单独滚动；opening.png/interactive.png普通视口 |
| npm run math:check；math.log | 0；同行display围栏files0/tokens0 |
| npm run glossary:check；glossary.log | 0；3PASS/2既知WARN/0FAIL，工业最常NOISE及7处旧函数名 |
| node --test pages/lesson-route/browser-python/python-release-decision；regression.log | 0；14PASS/0FAIL |
| node check-scope-source.mjs；scope-source.json | 0；源码hash三路一致、六原实验执行、70原课/27待办不变、W06–09开放、catalog仅本课subsections变更 |
| npm run check；check-final.log | 0；21PASS/2已登记WARN/0FAIL |
| node scripts/check-semester03.mjs；semester-final.log | 0；本课前五列完成，合并列待真实回执；不预填hash |

固定运行参数、模型、窗口与混合容差公开在讨论日志；只有指定条件观察，未报告全域最佳、连续精确峰值或有限末样稳态。W06/W07/W08/W09及27全局Python待办保持开放。

## 合并回执

验收后以--no-ff合master；真实课程提交与合并hash在完成合并后追加，并同步全局checklist。下一课CLASSIC-09需另一个对话。
