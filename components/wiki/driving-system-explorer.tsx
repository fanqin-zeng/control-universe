"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "./use-echarts";
import { stoppingBudget } from "@/lib/driving-system";

export function DrivingSystemExplorer() {
  const [speed, setSpeed] = useState(20);
  const [delay, setDelay] = useState(0.3);
  const [gap, setGap] = useState(50);
  const [deceleration, setDeceleration] = useState(5);
  const result = stoppingBudget({ speed, delay, gap, deceleration });
  const option = useMemo<EChartsOption>(() => ({
    animation: false,
    tooltip: { trigger: "axis" },
    grid: { left: 55, right: 20, top: 35, bottom: 55 },
    xAxis: { type: "value", min: 0, max: 1, name: "总延迟 / s", nameLocation: "middle", nameGap: 30 },
    yAxis: { type: "value", min: 0, max: 200, name: "距离 / m" },
    series: [
      { name: "所需距离（含2m余量）", type: "line", showSymbol: false, data: Array.from({ length: 101 }, (_, i) => [i / 100, stoppingBudget({ speed, delay: i / 100, gap, deceleration }).required]) },
      { name: "障碍净间距", type: "line", showSymbol: false, lineStyle: { type: "dashed", color: "#d97706" }, data: [[0, gap], [1, gap]] },
      { name: "当前参数", type: "scatter", symbolSize: 12, data: [[delay, result.required]] },
    ],
  }), [speed, delay, gap, deceleration, result.required]);
  const ref = useECharts(option);
  const controls = [
    { label: "车速 / m/s", value: speed, min: 0, max: 25, step: 1, set: setSpeed },
    { label: "总延迟 / s", value: delay, min: 0, max: 1, step: 0.05, set: setDelay },
    { label: "障碍净间距 / m", value: gap, min: 10, max: 100, step: 1, set: setGap },
    { label: "减速度幅值 / m/s²", value: deceleration, min: 2, max: 8, step: 0.5, set: setDeceleration },
  ];
  return <section aria-label="驾驶延迟预算实验" style={{ border: "1px solid #94a3b8", borderRadius: 12, padding: 16, margin: "20px 0", minWidth: 0 }}>
    <p style={{ marginTop: 0 }}>把总延迟从0.30 s改为0.60 s，观察所需距离是否超过障碍净间距。</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12 }}>
      {controls.map(c => <label key={c.label} style={{ display: "block" }}>{c.label}：{c.value.toFixed(2)}
        <input aria-label={c.label} type="range" min={c.min} max={c.max} step={c.step} value={c.value} onChange={e => c.set(Number(e.target.value))} style={{ width: "100%", display: "block" }} />
      </label>)}
    </div>
    <p data-testid="driving-budget" aria-live="polite" style={{ fontVariantNumeric: "tabular-nums" }}>
      延迟行程 {result.reaction.toFixed(2)} m；制动行程 {result.braking.toFixed(2)} m；所需距离 {result.required.toFixed(2)} m；剩余预算 {result.reserve.toFixed(2)} m。
    </p>
    <p>{result.reserve >= 0 ? "满足本简化模型的距离预算。" : "不满足本简化模型的距离预算。"} 这不是车辆安全判定。</p>
    <div ref={ref} style={{ width: "100%", height: 300 }} />
    <button type="button" onClick={() => { setSpeed(20); setDelay(0.3); setGap(50); setDeceleration(5); }} style={{ padding: "6px 12px", border: "1px solid #94a3b8", borderRadius: 6 }}>恢复主例</button>
  </section>;
}
