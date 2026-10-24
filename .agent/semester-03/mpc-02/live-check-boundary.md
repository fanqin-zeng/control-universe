# 共享工作区补查边界

2026-10-24，本课交付3b54cd51cf71de061cebc1995d066d865a0ebbec及回执d5cff2e已进入master并推送。提交前隔离候选运行未修改的check-catalog脚本，plain check PASS21/WARN2/FAIL0/exit0；本课真实数值、严格内核、Pyodide、普通/Pages页面和构建证据另见acceptance.md。

共享工作区补跑npm run check时退出1，出现两项并行课程台账不同步：machine-learning/autodiff-optimization及autonomous-driving/driving-system为status=v1.3而tracker未勾；原始输出check-live.log。检查口径不同，不能把隔离候选通过说成共享工作区全绿，也不能把他课未完成台账记成本课失败。未改动这两课或代勾其台账，由对应会话处理。全局WARN同样保留原始输出。

本课使用临时独立Git索引和原子引用更新。索引整理遇到并发index.lock后，确认交付已成功，再仅补齐本课仍匹配旧parent的索引条目；未删除锁或重置其它暂存项。四个本课测试服务通过其原执行会话停止，没有终止他人的服务。未发布gh-pages。
