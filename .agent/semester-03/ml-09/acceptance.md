# ML-09 学习实验评估验收

Phase1–4与本课验收完成，无P0；交付提交和推送已完成，实际hash见本页回执。10H2、两Notebook四cell、四题四答、一Explorer与纵排SVG。仅ML-09，未顺带生产其它课、未发布Pages。

本地预览：http://127.0.0.1:8238/control-universe/machine-learning/learning-evaluation/

## 实验合同和结果

训练4条只拟合类中心、验证8条按成本选择三个预定阈值、测试20条四批。默认漏检5/误报1、正常工况、验证锁定。四批全枚举256经验组合，条件于冻结流程，不保证真实95%覆盖率，评分非校准概率；无随机训练或种子筛选。

实际TS36配置18096主量+23单类边界量，对独立Fraction混淆表及多项式权重；Python主网格18096量，最大差2.220446049250313e-16。原始native/Python/Pyodide/页面1488量、单独原生audit56量与11状态253UI读数全部通过。保留正常准确率输/代价赢、漂移落败、持平、成本1落败与单类空指标。

## 实际验收

| 命令或检查 | 结果/退出码 | 原始证据 |
|---|---|---|
| npm run check | PASS21/WARN2/FAIL0，0；工具生成OUTLINE/tracker统计 | check.log |
| check-semester03 | PASS，0 | semester.log |
| nb-cells verify --require-kernel --port 8992 | 四cell EXECUTED/error0/SKIPPED0，0 | nb-strict.log/json |
| verify-pages.mjs | HTTP200、H1=1/H2=10/KaTeX0，无SKIPPED，0 | verify-pages.log |
| glossary:check / math:check | PASS4/WARN2/FAIL0、files0/tokens0，0/0 | glossary.log/math.log |
| npm run build / build:pages | 无MDX编译失败，205课/9旧路由校验pass，0/0 | build.log/build-pages.log |
| validate.mjs | 原始执行/哈希/NULL/全部控件核验，0 | validation.json |
| 最终页面/375px | H2顺序/ID等于catalog；缺锚点0/重复0/console0；width375/scroll360/canvas294/SVG328 | browser-pages/mobile和截图 |

最终正文LF SHA256：32ecc7ac3fbe1a4f64cd0b62a882882fa3b5caf0156ab7ad236a82291ea71f01。
最终双构建基线：f5ad14ced9cc54f66760eb4cb14ed51fcff0b1e4加本课。后续主干前进时重新叠加本课字段，复查最终catalog/semester/glossary/math；构建输出只对应上述明确基线，不冒充新主干全站构建。本课来源有变化须重验。

## 并行隔离和边界

rank2独立D:/Workspace/control-universe-rank2-ml09，完整git archive加本课投影；独立.next/out，静态8238/临时原始worker8239/严格内核8992。私有Git索引与HEAD比较交换，不碰普通共享索引、不强推，只提交本课来源/证据和共享文件中的本课字段。

共享baseline失败为并行草稿，不作本课通过依据。开发冷编译22秒导致一次导航超时，编译后实际200；开发默认共享内核地址未改/未占，W09保留；本课严格内核8992与最终生产Pyodide/页面都实跑。

横排图手机字小，返回第三轮改纵排；保留mobile-flow-before.png，最终哈希worker/双构建/页面/375px均重验。全局WARN保留motion-planning跨章slug与五门旧正文日志债，glossary四登记符号/二十六NOISE未命中仍由既有清理任务负责。W09/W16/QA01及其它课不关闭。

## 复现入口

仓库根目录依次运行node .agent/semester-03/ml-09/reconcile.mjs与python .agent/semester-03/ml-09/run-python.py。reference.py为精确有理数列联表/多项式计数权重参考；中间reference.json可重算不入库。原始native/Pyodide/最终页面、补充审计代码、切分清单与全部候选均保存在本目录。

提交前最终目录/semester/glossary/math门槛基线：dcaa4c8b0eff92b7c96f322042f1fd219396774b加本课，final五份日志全部退出0。保留并行已提交课程；本课三个源文件与最终双构建未变，构建基线单独列明。

提交前最终目录/semester/glossary/math门槛基线：dcaa4c8b0eff92b7c96f322042f1fd219396774b加本课，final五份日志全部退出0。保留并行已提交课程；本课三个源文件与最终双构建未变，构建基线单独列明。

提交前仅文档回执前进至56c2056b9f9cf68f6fb831cb9b0b79c7962ec8b1；来源未变，semester重验通过，见metadata-fast-forward.json。

## 实际master回执

交付提交：9c75ff1aae5f0a85a87ab479e68bbd375a5a3615，已进入master并成功push origin master。真实hash存在后勾最后列；回执提交前必须receipt-semester守卫通过。未发布gh-pages；静态8238保留，临时8239与严格内核8992已关闭。共享普通索引及他课修改保留。

实际回执守卫：node scripts/check-semester03.mjs退出0（receipt-semester.log，123门已进入master），通过后才创建回执提交。
