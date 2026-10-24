# IMPL-08 工业通信验收

新写单课，10个H2、5题答案、3个Notebook/6cell、双图Explorer与SVG。教学合同先于独立最小实验，三轮生成、六组审校、三方对账/九项/红队与签发在讨论日志。角色为结构化审查视角。

146参数工况；实际TS2796个数值，含原始Notebook合计5515；最大绝对误差5.684341886080802e-14，低于绝对1e-10ms，CRC与整数差0。规范02 07校验向量、响应72个单bit翻转全部拒收、1..16寄存器组解包已实际测试。原生及最终Pages共38个交互状态，浏览器1039个数值/报文复核；原始流1e-10，UI显示1e-6。

原生nb-cells严格内核六cell/error0、S6无跳过；原生UI/Pyodide/Pages均三实验六cell成功。verify-native PASS9/WARN0/FAIL0；真实H1=1/H2=10/KaTeX0，ID与目录href正确，双canvas/4image全部加载。375px夹具内容宽/scroll360，图298，表500在298容器内滚动。Pages控制台error=[]。

首次构建本课两条Hooks依赖提示已修；原生UI为修前验收，修后最终Pages回归19种状态。最终npm run build、build:pages exit0/0，无MDX编译失败及本课Hooks提示。build-origin.json保存构建父基线、MDX/组件/计算模块哈希及PostCSS哈希；后续提交基线在delivery.json，不能混称。实际PostCSS字节与工作区相同，CSS含prose。

共享工作区开工npm run check exit1（PASS19/WARN2/FAIL6），check-semester03 exit1（RL-02列数错误），保留baseline原始日志。隔离HEAD+本课原catalog CLI PASS21/WARN2/FAIL0；WARN为既有重名及缺日志。交付前刷新最新HEAD并运行完整学期证据及Python策略检查。glossary:check exit0（PASS4/WARN2/FAIL0）；implementation章math围栏exit0（files0/tokens0）。

源码LF SHA256：bc4bcf6b720fe0475f4aafa4ead180f8708c54155af85bb7d9c290331cbbf928。

证据：reference.json、actual-ts.json、reconciliation.json、notebooks.json/log、pyodide.json、ui-*.json、pages-console.json、build*.json/log、css-artifacts.json、validation.json、scoped-check.log及scoped-semester.json，来源版本见sources.json。只做内存报文/预算，不宣称串口驱动、真实设备互操作、最坏时延或安全认证完成。

rank1独立目录/索引及8191/8991/9197端口，保留并行修改，只提交本课；未发布gh-pages。下一课IMPL-09半实物仿真，本对话不继续生产。

真实master提交回执见下。

真实master交付提交：`3e95f6e9c5ecb8948349e8e6cd05ca0e157ae78c`，父提交`e06d60feb8263fca0b75219c276c36851ff7f5b3`。采用独立索引与预期父提交原子更新master，未改写共享默认索引。最终原始catalog CLI：PASS21/WARN2/FAIL0，学期完整校验errors=[]，Python策略检查pass。两项WARN为既有跨章motion-planning重名及存量正文缺日志，未新增本课死锚点。本课进入master列在提交存在后据实回填，未发布Pages。
