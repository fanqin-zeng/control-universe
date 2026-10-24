# IMPL-09 半实物仿真验收

2026-10-24，rank1。交付单课implementation/hil-rapid-prototyping；讨论与A/B/C/D见docs/discuss-log/semester-03/07-implementation/09-hil-rapid-prototyping.md。

完成MIL/SIL/PIL/HIL/RCP边界、接口与时序合同、双图软件台架、3 Notebook/6 cell、5题与答案。未执行板级HIL，不声称硬件实时性或安全认证。

- 独立Fraction参照对TS与原始MDX：48配置、98096个数值，最大差1.7763568394002505e-15；容差1e-10，事件严格相等。
- 原生nb-cells S1–S8结构及6cell执行通过；Pyodide原始6cell通过。MDX LF SHA256：2789512d8ca4bcba485c846a07e58e5443f31802b3ebcb76d9de1a0004bf7d9b。
- 原始verify：PASS9/WARN0/FAIL0/SKIPPED0，HTTP200/H1=1/H2=10/10/KaTeX错误0。
- 页面96参数状态、1327个量比较通过；原生48为图例修正前，最终静态48为修正后，计算源码未变。最终静态三Python输出、四图片、双图完整，控制台error/warn0。360px页面无横向溢出。
- npm run build及build:pages退出0，图例修正后均重跑。两构建基线d7b631f264c2c5e0590aaf45bd226fdc85c50d09；实际交付基线另记录delivery.json，后续并行变化不冒称已重建。PostCSS与工作区字节一致，构建CSS含prose及KaTeX规则。
- 术语PASS4/WARN2/FAIL0退出0；数学围栏files0/tokens0。独立候选原始catalog最终PASS21/WARN2/FAIL0；完整学期与Python策略闸门输出留存。

隔离目录D:/Workspace/control-universe-rank1-impl09-validation；原生8191、gateway8991仅本课使用并在交付后释放；避免9198与9199，保留最终静态预览9291。共享默认Git索引不修改，不清理其他会话进程或缓存。仅本课路径及共享元数据本课条目进入提交；工作区并行基线失败原始记录保留。未发布GitHub Pages。

预览：http://127.0.0.1:9291/control-universe/implementation/hil-rapid-prototyping/

真实master提交回执见下。

下一课IMPL-10 implementation/implementation-case-study，本次未生产。

真实master交付提交：`a021dd9b0d8047097e2a1dee5169c834d1dc6582`，父提交`ff641708325044855775090a3f6e4a01220b6631`。采用独立索引与预期父提交原子更新master，未改写共享默认索引。最终原始catalog CLI：PASS21/WARN2/FAIL0，学期完整校验errors=[]，Python策略检查pass。两项WARN为既有跨章motion-planning重名及存量正文缺日志，未新增本课死锚点。本课进入master列在提交存在后据实回填，未发布Pages。提交复核发现Python清单生成器移除了其它课待办的task/category/next注释，回执提交按原记录恢复这些元数据，不改运行状态。
