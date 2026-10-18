# CLASSIC-05「频域分析」验收

唯一课程classic/frequency-domain-analysis，起点master1962c3a，工作分支wp/classic-05-frequency。使用重构专用SKILL及共同Phase1–4，十既有角色为结构化审查视角；日志docs/discuss-log/semester-03/03-classic/05-frequency-domain-analysis.md含三轮、六组、94行六列对账、原九门槛/四补充、三项红队限定观察及来源保留表。不发布gh-pages；两份用户批阅文件未改动或暂存。

## 改动与来源

保留原正弦留数推导、五环节与组合Bode、裕度/完整Nyquist、二阶PM精确推导、RC/路面、非最小相位/时延、全部九题。原六实验目的均有新实验去向；九新实验不再依赖widgets，四组件原注册名不变。无片段外移或下一课生产。

修G10归一化：负实交点−10/126，GM12.6倍率/22.007411dB，K临界126；无有限正增益穿越时PM不填有限值。修幅值数组当复数取相位、二次log与错误元组API。完整顺时针RHP缩进围线Z=P+Ncw，以两组R/epsilon和闭环根核；P1/Ncw−1反例保留。圆心回原点、临界−1可见，有限图窗不冒充完整围线。

上升时间统一首次10–90%，默认ζ.5/wn8：wb10.176157rad/s、tr.204697s、乘积2.083025、超调16.303353%。PM仅从对应开环推闭环，不跨模型推广；路面有分子零点，三正阻尼均有峰且最终−20dB/dec，不作危险车速或舒适性排名。题9精确延迟与Padé同频分列，补唯一穿越/正向穿越的区间证明。

旧73全级ID经共用渲染管线与真实DOM复核可达，三长H2缩短并留别名；HTTP路径/prereq不变。13H2与catalog顺序/ID/目录一致，89display居中且overflow auto、表格列数均匀。W06旧数学目录文本及W07/W08/W09仍开。

## 实际执行与证据

下列最终命令均退出0（相应log在本目录）：

| 命令/动作 | 结果/文件 |
|---|---|
| python minimal.py；node scripts/verify-classic05.mjs | minimal.log；reconciliation-delivery.log/json；真实完整TS对独立SciPy：120×601复数频点、3×601时间点、9×601RC点，最大误差2.4726887204451486e-12；9原始新内核及合同 |
| nb-cells verify classic/frequency-domain-analysis --require-kernel --out … | notebooks-delivery.log/notebooks.json；EXECUTED9/9、FAIL0/SKIPPED0 |
| nb-cells extract / assemble | extract-delivery.log/assemble-delivery.log；18block反向逐字全等，roundtrip临时文件删除 |
| 浏览器逐课全部运行；finalize --merge；preserve-debts；check-python-support | browser-python.json、python-finalize.log/python-policy.log；九passed，最终源hash5934740fc9c3d16013f732b13d8afc855b854aa91669f83c2d746ee2da8d038e；70课/307实验/480cell、280可运行/27代码展示，455成功cell |
| npm run build；npm run build:pages；npx tsc --noEmit | build-delivery-final.log/pages-delivery-final.log/types-delivery-final.log；无MDX失败；205课/9旧路由/317266510字节；只本地静态构建 |
| npm run verify -- classic/frequency-domain-analysis | page-delivery.log；9项PASS、WARN0/FAIL0，HTTP200、H1=1/H2=13/KaTeX错误0，四组件规范通过 |
| node check-browser.mjs | browser-check.log/browser-results.json；四图、5滑块端点/4恢复、默认值、9实验、73旧ID、89居中公式、18表列数；生产答案实际Pyodide完成；console无warn/error |
| node check-source.mjs / check-scope.mjs / check-log.mjs | source-check.log/scope-check.log/log-check.log；正文/数值/浏览器/政策源一致；69其它课记录/政策不变、27余债务逐字段不变，3解决回执；原9项/94行/唯一签发 |
| npm run math:check；npm run glossary:check | math-fences.log/glossary-final.log；围栏无坏项，术语PASS3/WARN1/FAIL0（既有函数名WARN） |
| node --test scripts/pages.test.mjs scripts/lesson-route.test.mjs scripts/browser-python.test.mjs scripts/python-release-decision.test.mjs | regression.log；14测试通过，无SKIPPED |
| node scripts/check-fix-logs.mjs | fix-index.log；fix038详情/索引与陈控清单同步 |
| npm run check -- --fix-outline --fix-tracker-stats；npm run check；node scripts/check-semester03.mjs | check-generated.log/check-delivery.log/semester-check.log；21PASS/2WARN/0FAIL，既有WARN已登记，学期清单通过 |

生产390px实测：article343=scroll343、document375=scroll375，13section无溢出，四canvas均317px宽，Nyquist方图317×317同尺度。实际查看Bode相位非零且双网格不重叠；Nyquist临界/单位圆/端点，带宽精确红线，RC紧凑刻度。opening.png/narrow.png/nyquist-boundary.png/rc-narrow.png为本轮证据。

保留失败与修复证据：reconciliation.log第一轮第九实验合同失败（题3ζ抄错/题6带宽抄成wn），修源后九组全重跑；notebooks-final.log瞬时health失败，notebooks-delivery.log随后严格EXECUTED9/9；glossary.log新增“峰值(dB)”单位被识别成译名，修表达后glossary-final通过。build-delivery.log未使用导入触发eslint失败，清理后重建；首次窄屏RC长数字重叠，改k/M刻度后以delivery-final构建和rc-narrow.png为最终证据。中间构建不作为最终交付。无放宽门槛。

PY-001/PY-002/PY-003保留旧hash/记录及新去向于resolved-python-debts.json。生成器会重排编号，本课preserve-debts.mjs将其余27原记录/编号恢复并逐字段核，不改全局生成器，不关闭全局Slycot债务。

## 合并

正文/组件/讨论日志/台账/验收同提交；真实no-ff后回填hash和checklist合并列，未合并前不预填。仅合master，不推远端或发布gh-pages。
