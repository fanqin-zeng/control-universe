# EMBODIED-02 多模态感知

2026-10-24，用户明确指定本课，rank13。唯一交付目标 embodied/multimodal-observation；开工确认为空占位，无沿用正文。先修具身智能系统已交付；表征学习尚未交付，本课局部定义编码器、特征与融合，不预设读者会训练模型，不顺带生产先修。

隔离目录 D:/Workspace/control-universe-rank13-embodied02，Next18133、内核18933、浏览器实验18233，启动前查占用均空闲。保留前课与其它会话进程；不使用共享.next/out，不修改公共端口脚本。共享元数据从已提交HEAD按本课局部变换合成，保留暂存区与工作区的其它内容。

## Phase 1 设计合同

读者起点：读过上一课，能理解状态/观测之别和时间戳，会代入加权平均。贯穿问题：夹爪挡住杯子时，图像、关节编码器与触觉为何会给出不同信息？目标：列清三种模态的可见性边界；把观测整理成带时间/坐标/掩码的合同；推导两路独立标量融合并复算偏差反例；区分数值融合与学习特征融合；设计不泄漏的模态消融。

H2依次：夹爪挡住杯子之后；三种模态各知道什么；先把观测对齐；怎样合成位置读数；迟到和相关误差；从传感器到学习表征；怎样验证多模态有用；小结；习题；答案。

双轨：一张SVG表示采样/对齐/编码/融合/策略；Notebook1算对齐与缺失、Notebook2复算融合与全部习题数字；Explorer调视觉年龄、速度、相关性和缺失，显示理论均方误差与一帧读数，显式区分两者。训练模型只讲接口与数据划分，不下载权重、不训练大模型。

最小实验合同：杯子一维基座位置，单位mm，当前真值100，视觉标准差4、接触成立时本体推算标准差2，视觉旧帧偏差为-v*age，速度mm/s、年龄s；相关系数rho，联合误差协方差rho*4*2。两路权重固定按独立无偏公式，不针对测试工况调参；基线单独本体通道权重1。比较年龄0/0.2/0.4、速度20、rho=0，以及rho=1等失效；无随机数，解析期望MSE，不把一帧误差当总体精度。假设杯子牢固夹住、接触成立；接触丢失则本体通道不可估计物体位置。

练习四题：模态与隐藏状态解释；加权融合推导；旧帧MSE与缺失处理；消融与训练/验证/测试划分。所有数字含答案由原始Notebook与独立Fraction算术核验，TS实际导出函数对照Python协方差矩阵计算。阶段记录按执行追加；此时尚未签发。

## Phase 2–4 实际验收

先完成设计和最小实验，再扩写、学生反馈、修改、分层审校及签发；完整记录见docs/discuss-log/semester-03/19-embodied/02-multimodal-observation.md。最终10H2、2Notebook2cell、1Explorer1SVG、4题4答。接触关系、采集/到达时间、因果掩码、相关误差与旧帧落败例、学习表征/模态消融均明确交代。

- `node .agent/semester-03/embodied-02/verify-model.mjs`及`python .agent/semester-03/embodied-02/oracle.py`：exit0，实际TS600配置与独立Fraction精度归一化/协方差二次型比较3450标量，最大误差1.4210854715202004e-14，容差1e-9；原始脚本与oracle-results.json可复跑。
- `node scripts/nb-cells.mjs verify embodied/multimodal-observation --port 18933 --require-kernel`：exit0，干净原始setup/cell2/2，无Python error，无SKIPPED；notebook.log/notebooks.json。实际浏览器点击两组全部运行，坐标104、旧帧偏差−4、权重0.2/0.8、默认99.2/MSE3.2、阈值0.223607等输出与正文和答案一致。
- 固定Pyodide0.27.7真实浏览器运行：2/2passed、0code-only、complete=true，MDX sourceHash及workerHash严格匹配；browser-python.json。启用两个新Notebook，仅合入本课政策和实测记录；未关闭其它课程债务。
- `WIKI_VERIFY_PORT=18133 node scripts/verify-lesson.mjs embodied/multimodal-observation`：exit0，单课PASS9/WARN0/FAIL0/SKIPPED0；HTTP200、H1=1、H2=10/10、katex-error0。build后生产服务再复验同样通过；page.log。
- 浏览器真实DOM十标题/ID/目录目标逐项相同、重复ID0、破图0、console warn/error为空；年龄0.4与rho1都MSE5.76，失视觉98/MSE4，两路无效无估计，恢复默认99.2/MSE3.2。375px设置实际内容宽360、scrollWidth360、图容器328/内部960、canvas295；browser-ui.json。首轮包装接口重置viewport不能算窄屏，已切到文档化原始tab接口取得实际窄屏证据并复位。
- `node node_modules/next/dist/bin/next build`：exit0、210/210静态页，无MDX编译失败；build.log。构建基线与最终整合基线分别留在snapshot.json；本课教学源码保持一致，主干其他课程正常并行推进。原有lint/Unicode KaTeX警告保留，不宣称全站零警告。
- `node scripts/check-catalog.mjs`：exit0，PASS21/WARN2/FAIL0；两WARN为历史旧课缺日志和跨章motion-planning同slug，check.log。最终整合以最新已提交HEAD加本课变更再次运行未修改的全量脚本，并用它生成OUTLINE/统计；不把共享工作区其他未完成课程拷入候选。
- `node scripts/check-semester03.mjs`：exit0，PASS semester-03 plan/checklist；通过GIT_DIR指向原库、GIT_WORK_TREE指向副本核验真实历史，semester.log。原入口共享基线曾catalogFAIL8、学期校验因ML-03进行中证据格式失败；保留其工作，未在本课擅自改别课。
- 数学围栏检查、术语检查、`tsc --noEmit`：exit0；math.log/glossary.log/types.log。术语全仓PASS3/WARN3/FAIL0，无放宽规则。
- `node scripts/check-python-support.mjs`：pass=true，全库存量与本课sourceHash/workerHash匹配；python-policy.log。全量数字随并行课交付变化，不当本课固定产出数。

作者一手资料2026-10-24核阅，版本/代码许可证/实际复现范围在sources.json；只阅读接口，不下载模型与训练，不用作者成功率给本课背书。交付签发见讨论日志。仅本课唯一文件和局部元数据进入master，保持其它暂存/未提交工作；提交hash与推送在产生后追加。不发布Pages。

并行Git资源：共享.git/index.lock存在，本课第一次正常索引合成遇EEXIST后停止，未删除或抢占该锁；其它ML-03/DRIVING-02也已登记同一限制。改用独立GIT_INDEX_FILE、commit-tree及带预期旧HEAD的update-ref原子提交，主干推进即重新整合验证。共享索引文件完全不写入；根工作目录同步本课唯一文件与本课局部元数据。正常索引可能暂把已提交的新文件显示为旧快照删除/未跟踪，属于共享索引未同步，未擅自reset或清理它。
