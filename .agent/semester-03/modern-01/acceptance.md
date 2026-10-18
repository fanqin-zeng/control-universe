# MODERN-01 状态空间验收

起点master 7cf1cb5，2026-10-18。按wiki-lesson-refactor完整Phase1–4，日志docs/discuss-log/semester-03/04-modern/01-state-space.md。只交付本课；用户追加授权完成后将届时master现有修改全部发布到gh-pages，实际上线回执另见DEP07。

## 内容与保留

保留10H2、三物理例、两种标准型、矩阵指数/传函联系/离散非线性边界、十题及原两实验用途，扩五Notebook。用同位移不同速度的车身运动引出状态，撤“仅SISO/传矩阵丢耦合/同G必相似/极点无条件等于谱”，加隐藏增长模态与题2非最小不相似反例。补Q6完整3×3指数、Q9正确主对数3.133358、Q10分子2500与一致根/时间常数/降阶代价；不伪称一般工程可接受。原可观标准型经复核正确，保留。

既有Explorer计算提取到lib/state-space-response.ts，UI与验收共同调用；固定轴覆盖所有可调参数，增加默认恢复、可访问滑块和t=1s三路读数。全部36旧标题ID在真实DOM可达，H1与历史小节用两显式别名；课程URL、catalog/prereq/status不变，不手编OUTLINE。用户proofreading文件不改动。

## 实际验收

| 命令/实测 | 退出码/结果 | 证据 |
|---|---|---|
| npm run check | 0，21PASS/2已登记WARN/0FAIL | check.log |
| npm run verify -- modern/state-space | 0，200、10H2、KaTeX0、引用/注册通过 | verify.log |
| node scripts/nb-cells.mjs verify modern/state-space --require-kernel --out .agent/semester-03/modern-01/notebooks.json | 0，五原始cell无错无跳过 | notebooks.log/json |
| node scripts/verify-modern01.mjs | 0，实际TS21×601点对独立expm+物理ODE；全部原setup/cell输出 | reconciliation.log/json、reference.py |
| npm run math:check | 0 | math-check.log |
| npm run glossary:check | 0，3PASS/2已知WARN/0FAIL | glossary.log |
| npm run build | 0 | build.log |
| npm run build:pages | 0，205课程/9旧入口 | pages-build.log |
| 五原始实验Pyodide实跑 | 完成，5/5放行 | pyodide.json |
| node scripts/check-python-support.mjs | 0，73课/328实验，301启用/27保留代码 | python-policy.log |
| node scripts/check-semester03.mjs | 0 | checklist.log |
| 真实页面默认/0/.2/恢复/锚点/390px | 通过；文章与组件343=scroll343，无横向溢出、警告/错误日志为空 | browser.json、desktop.png、narrow.png |
| Pages静态预览 | 5运行入口、正确图片basePath、两别名及KaTeX0 | browser.json.static |

65行六列数值对账/三条限定红队放行/九项门槛均在讨论日志。最大位移误差9.51e−16m、速度6.61e−15m/s；独立物理ODE对照误差小于1e−9。图中0–3s与解析终值分开。初跑空setup与结构相等判据失败在initial-notebooks.log保留，修后最终报告无错误。

按用户新策略直接在master提交并推送，提交后再记录实际回执。W08/W09/W10与27Python待办保持开放；不生产MODERN-02。
