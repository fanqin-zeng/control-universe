# ML-08 扩散与流匹配验收

Phase1–4已完成、无P0；正文9H2、两Notebook四cell、一Explorer/SVG、四题四答。真实master提交后追加回执，不预填hash。仅本课，未生产ML-09，未发布Pages。

本地预览：http://127.0.0.1:8234/control-universe/machine-learning/generative-models/

## 实验合同与边界

标准化重量X~N(m,s²)，默认m2/s.5；扩散a.5/y1，CFM独立端点t.5，Euler N8正号。全控件900配置，无有限样本训练/数据集选择/随机种子筛选。完整DDPM仅讲接口，数值生成实现已知高斯场，不声称训练图像模型或比较两方法效果。

实际TS900配置102600量对独立60位Decimal协方差投影及仿射矩阵，最大差1.77636e-15；Python同量最大差8.88178e-16。最终native/Python/Pyodide/页面原始输出2444量，最大差8.88178e-16。15UI状态195读数，六位显示容差5.1e-7。全部结果与失败保留于numeric/validation/native/pyodide/browser-pages/controls证据。

## 实际验收

| 命令/检查 | 退出码与结果 | 原始证据 |
|---|---|---|
| npm run check（自动生成OUTLINE与tracker统计后） | 0，PASS21/WARN2/FAIL0 | check.log |
| node scripts/check-semester03.mjs | 0，PASS | semester.log |
| node scripts/nb-cells.mjs verify machine-learning/generative-models --require-kernel --port 8992 | 0，四cell EXECUTED/error0/SKIPPED0 | nb-strict.log/json |
| node .agent/semester-03/ml-08/verify-pages.mjs | 0，HTTP200、H1=1/H2=9、KaTeX0、无SKIPPED | verify-pages.log |
| npm run glossary:check | 0，PASS4/WARN2/FAIL0 | glossary.log |
| npm run math:check | 0，files0/tokens0 | math.log |
| npm run build / npm run build:pages | 0/0，无MDX编译失败、205课与9旧路由基路径校验pass | build.log/build-pages.log |
| node .agent/semester-03/ml-08/validate.mjs | 0，全数值/控件/源码哈希/原始执行核对 | validation.json |
| 浏览器与375px | 九H2顺序/ID等于catalog、缺失锚点0/重复ID0/console0；width375/scroll360/canvas294/SVG328 | browser-pages/mobile、三张png |

最终源码LF SHA256：d39044382236768d3e2a391f571d348a8fe1de6b69ca92bda890c1079d1c372a。
双构建基线：d7b631f264c2c5e0590aaf45bd226fdc85c50d09加本课来源；此后主干交付ID-08，最终复投影最新主干加本课并重跑catalog/semester/glossary/math；本课正文、计算库、组件及proof与双构建时逐字不变。全站构建证据对应上述明确基线，不将其冒充后续主干快照的全量构建。

## 并行隔离与已知事项

rank2使用D:/Workspace/control-universe-rank2-ml08，完整git archive加本课投影，node_modules只读链接；独立.next/out、静态8234、短期原始Pyodide8236、native8992。提交用外部私有索引与HEAD比较交换，不碰普通共享索引或别人暂存，不强推。

共享工作区初始check/semester失败是并行草稿，不作为本课通过依据；隔离投影最终门槛均通过。早期verify-dev冷页SKIPPED及旧源码哈希Pages拒绝只为过程记录，最终以无SKIPPED的verify-pages与最后成功双构建为准。

WARN明确保留：motion-planning跨章slug；六门存量正文无日志；glossary四登记符号/二十六NOISE未命中。既有W09/W16/QA01不关闭，不修改全局术语门槛。

## 复现入口

在仓库根目录先运行node .agent/semester-03/ml-08/reconcile.mjs（生成cases/reference.json），再python .agent/semester-03/ml-08/run-python.py；独立参考source为reference.py/expected.py。reference.json为可重算中间产物不入库，原始native/Pyodide/最终页面输出均入库。

最终catalog/semester/glossary/math门槛基线：626f1116420643ff867493b4ff33e6fd461dce33加本课，原始输出final-*.log全部退出0。与构建基线之间为并行ID-08的独立交付，本课三个源文件已逐字确认未变。

最终刷新：170aea3c43b7748ce4d94e83620ec0bb7e0dd5cb加ML-08，已保留并行ID-08与EST-07，final五份门槛日志全部退出0；本课来源与最终双构建逐字不变。

提交门槛最终基线：38866315543e03124bb4bf43ff882720781984af加本课；final五份日志全部退出0，保留已提交并行课程；本课三个源文件与双构建时逐字一致。

提交前仅文档回执前进至04df0dd788a6427563e89beb3a99b847ad4ec611，机器确认课程来源未变并重跑semester通过；metadata-fast-forward.json保留差异。
