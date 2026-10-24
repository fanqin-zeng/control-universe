"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "@/components/wiki/use-echarts";
import { imitationDefaults, imitationRollout } from "@/lib/imitation-learning";

export function ImitationLearningExplorer() {
  const [parameters, setParameters] = useState(imitationDefaults);
  const result = useMemo(() => imitationRollout(parameters), [parameters]);
  const option = useMemo<EChartsOption>(() => ({
    animation: false,
    tooltip: { trigger: "axis" },
    legend: { top: 0 },
    grid: { left: 58, right: 20, top: 44, bottom: 48 },
    xAxis: { type: "value", min: 0, max: 20, name: "步数 n", nameLocation: "middle", nameGap: 28 },
    yAxis: { type: "value", min: -1.25, max: 1.25, name: "位置误差 x / m" },
    series: [
      { name: "解析专家参考", type: "line", symbol: "none", data: result.expert, lineStyle: { type: "dashed", width: 2 } },
      { name: "候选策略", type: "line", symbolSize: 5, data: result.points, lineStyle: { width: 3 }, markLine: { silent: true, symbol: "none", label: { show: false }, data: [{ yAxis: -1 }, { yAxis: 1 }] } },
    ],
  }), [result]);
  const chart = useECharts(option);
  const presets = [
    { label: "默认偏置", k: 0, b: 0.01, x0: 0.1 },
    { label: "反馈可表达", k: 0.5, b: 0, x0: 0.1 },
    { label: "从窗口内偏离", k: 0, b: 0.01, x0: 0 },
    { label: "错误反馈方向", k: -0.2, b: 0.01, x0: 0.1 },
    { label: "零初值持平", k: 0, b: 0, x0: 0 },
  ];
  const buttonStyle = { padding: "7px 10px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--muted)", color: "var(--foreground)", cursor: "pointer" };
  return <section aria-label="模仿策略闭环探索" style={{ padding: 16, margin: "20px 0", border: "1px solid var(--border)", borderRadius: 10, minWidth: 0 }}>
    <p style={{ marginTop: 0 }}>专家动作是 −0.5x，候选动作是 −kx+b。训练窗口只有靠近目标的三个状态；观察同样小的动作误差怎样改变下一次观测。控件是人为指定候选参数，没有在这里训练网络。</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{presets.map(p => <button key={p.label} type="button" style={buttonStyle} onClick={() => setParameters({ k: p.k, b: p.b, x0: p.x0, horizon: 20 })}>{p.label}</button>)}</div>
    <label style={{ display: "block", marginTop: 12 }}>反馈系数 k = {parameters.k.toFixed(2)}<input aria-label="候选反馈系数" type="range" min="-0.2" max="1.5" step="0.1" value={parameters.k} onChange={e => setParameters({ ...parameters, k: Number(e.target.value) })} style={{ display: "block", width: "100%" }} /></label>
    <label style={{ display: "block", marginTop: 12 }}>动作偏置 b = {parameters.b.toFixed(3)} m<input aria-label="候选动作偏置" type="range" min="-0.02" max="0.02" step="0.001" value={parameters.b} onChange={e => setParameters({ ...parameters, b: Number(e.target.value) })} style={{ display: "block", width: "100%" }} /></label>
    <label style={{ display: "block", marginTop: 12 }}>初值 x₀ = {parameters.x0.toFixed(2)} m<input aria-label="初始误差" type="range" min="-0.5" max="0.5" step="0.1" value={parameters.x0} onChange={e => setParameters({ ...parameters, x0: Number(e.target.value) })} style={{ display: "block", width: "100%" }} /></label>
    <button type="button" style={{ ...buttonStyle, marginTop: 12 }} onClick={() => setParameters(imitationDefaults)}>恢复默认</button>
    <p data-testid="imitation-readout" aria-live="polite">训练窗口 MSE：{result.trainMSE.toExponential(6)} m²；第 {result.lastStep} 步候选位置：{result.finalX.toFixed(6)} m；专家同一步位置：{result.expert[result.lastStep][1].toExponential(6)} m。{result.exited ? "候选已越过教学范围，后续演算停止。" : "候选未越过教学范围；这不等于任务成功或稳定性保证。"}</p>
    <div ref={chart} style={{ width: "100%", height: 320 }} />
    <p style={{ marginBottom: 0 }}>每步0.1s，固定观察20步。虚线±1m只表示本例模型的使用范围；记录首个越界点，不隐藏它。图轴始终为0–20步和−1.25–1.25m。没有模拟饱和、延迟、碰撞或真实机械臂。</p>
  </section>;
}
