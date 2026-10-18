# NONLINEAR-08 自适应控制验收

2026-10-18，起点bafa17259983fd943446d3b0973ec4f10b26c879，master直接交付，仅本课。保留原九实验38cell、六题、13主题和55旧ID；追加独立核验共十实验39cell。用户批阅文件与中文润色分支不动，不发布gh-pages。

纠错包括：常参数与输入信息、固定V权重下的参数界、有限窗口PE和无界推断、噪声相关项、泄漏平衡唯一性、RLS同先验、分母保护误称投影、机器人初速/恢复/谐波以及跳变与饱和的证明边界。组件公开连续反馈RK4口径，半步读取半时参考，显示实际停止时刻与窗口不足，增加恢复默认及窄屏布局。

| 命令/检查 | 结果 | 持久证据 |
|---|---|---|
| node scripts/verify-nonlinear08.mjs | 退出0；最终源原始代码/独立对账完成，957正常打印数值跨环境最大差1.3861e−12 | reconciliation-final.log、reconciliation.json、reference.py |
| 真实TS与独立误差坐标实现 | 19配置27465绘图节点；三参考×增益两端/默认，噪声三种子，泄漏及未建模极点 | 同上 |
| 独立连续积分/数学 | DOP853三参考，三符号恒等、sigma多根、同先验RLS、谐波Gram、无噪声V包络和题设算术 | 第十Notebook及同上 |
| node scripts/nb-cells.mjs verify nonlinear/adaptive-control-basics --require-kernel --out .agent/semester-03/nonlinear-08/notebooks.json | 退出0；EXECUTED、10实验39cell、FAIL0/SKIPPED0/error0 | notebooks.json、notebooks.log |
| 本地Pyodide原始代码 | 10/10实验39/39cell全部通过、最终源指纹一致 | pyodide.json |
| npm run build / build:pages | 最终普通/Pages构建退出0/0、Compiled successfully、205课9旧入口 | build.log、pages-build.log |
| npm run verify -- nonlinear/adaptive-control-basics | 退出0；PASS8/WARN1/FAIL0/SKIPPED0，HTTP200/H2 13/13/KaTeX0；HTML题号静态识别WARN以源码及真实DOM六题六答补验 | verify.log |
| 真实静态页面 | 全部通过；默认/正弦/增益两端/噪声/泄漏/未建模极点/恢复；三个Notebook并行完成；console0；375px无整页溢出 | browser.json、desktop.png、narrow.png |
| npm run math:check / glossary:check | 退出0/0；术语PASS3/WARN2/FAIL0，既有WARN | math-check.log、glossary.log |
| 路由/标题/Pages测试 | 退出0 | tests.log |

25项Python待办保持，W08/W09/W10不提前关闭。Pages首次尝试被Python源指纹门槛正确拦截，旧政策不可用于新代码；以最终重建为准。初次catalog替换工具尾界错误被检查拦截，已从未改动的HEAD原件恢复后只改本课subsections。

Phase4已签发；最终源SHA256：7355b2a943165ebb434d2e23a2ed41d62475b6f6db53d8de23b1cd75fd621d2d。NB4C6两失配的停止前K数值不复现，只放行打印0.01s精度一致的停止事件；详情及待办见followup.md/W14，未据此作连续时间物理失稳结论。delivery-validation.json退出0；39项对账与六题六答详见本期日志。真实master提交回执随后补填。
Phase4交付已进入master：932a40b46200c2db16a297aeb4218ba17d91c144；全局checklist六列完成，merged46。随后按用户新授权，另做润色分支审核、合入与Pages发布。
