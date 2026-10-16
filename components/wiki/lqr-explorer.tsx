"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "@/components/wiki/use-echarts";

// Double integrator, Q=diag(q1,q2), R=r. Closed-form CARE solution.
export function lqrModel(q1: number, q2: number, r: number, gain = 1) {
  const k1 = Math.sqrt(q1 / r);
  const k2 = Math.sqrt(2 * k1 + q2 / r);
  const a = gain * k2 / 2, b = gain * k1;
  const delta = a * a - b;
  const pole = delta >= 0
    ? `${(-a + Math.sqrt(delta)).toFixed(4)}, ${(-a - Math.sqrt(delta)).toFixed(4)}`
    : `${(-a).toFixed(4)} ± ${Math.sqrt(-delta).toFixed(4)}j`;
  const points = Array.from({ length: 601 }, (_, i) => {
    const t = 15 * i / 600; // T/(len-1), no subsampling time conversion.
    let x: number, v: number;
    if (Math.abs(delta) < 1e-10) {
      x = Math.exp(-a * t) * (1 + a * t);
      v = -b * t * Math.exp(-a * t);
    } else if (delta < 0) {
      const w = Math.sqrt(-delta);
      x = Math.exp(-a * t) * (Math.cos(w * t) + a / w * Math.sin(w * t));
      v = -b / w * Math.exp(-a * t) * Math.sin(w * t);
    } else {
      const d = Math.sqrt(delta), p = -a + d, m = -a - d;
      x = (-m * Math.exp(p * t) + p * Math.exp(m * t)) / (2 * d);
      v = b * (Math.exp(m * t) - Math.exp(p * t)) / (2 * d);
    }
    return { t, x, v, u: -gain * (k1 * x + k2 * v) };
  });
  return { k1, k2, p11: r * k1 * k2, p12: r * k1, p22: r * k2, pole, points };
}

export function LqrExplorer({ mode = "weights" }: { mode?: "weights" | "gain" }) {
  const [q1, setQ1] = useState(1), [q2, setQ2] = useState(1);
  const [r, setR] = useState(1), [gain, setGain] = useState(1);
  const d = useMemo(() => lqrModel(q1, q2, r, gain), [q1, q2, r, gain]);
  const option: EChartsOption = useMemo(() => ({
    animation: false,
    tooltip: { trigger: "axis" },
    legend: { data: ["x₁", "x₂", "u"], top: 4 },
    grid: [{ left: 58, right: 58, top: 40, height: 190 }, { left: 58, right: 58, top: 285, height: 140 }],
    xAxis: [
      { type: "value", min: 0, max: 15, name: "t", gridIndex: 0 },
      { type: "value", min: 0, max: 15, name: "t", gridIndex: 1 },
    ],
    yAxis: [
      { type: "value", min: -3, max: 1.1, name: "状态", gridIndex: 0 },
      { type: "value", min: -15, max: 15, name: "控制 u", gridIndex: 1 },
    ],
    series: [
      { name: "x₁", type: "line", showSymbol: false, data: d.points.map(p => [p.t, p.x]), xAxisIndex: 0, yAxisIndex: 0 },
      { name: "x₂", type: "line", showSymbol: false, data: d.points.map(p => [p.t, p.v]), xAxisIndex: 0, yAxisIndex: 0 },
      { name: "u", type: "line", showSymbol: false, data: d.points.map(p => [p.t, p.u]), xAxisIndex: 1, yAxisIndex: 1 },
    ],
  }), [d]);
  const poleOption: EChartsOption = useMemo(() => {
    const a = gain * d.k2 / 2, delta = a * a - gain * d.k1;
    const points = delta >= 0
      ? [[-a + Math.sqrt(delta), 0], [-a - Math.sqrt(delta), 0]]
      : [[-a, Math.sqrt(-delta)], [-a, -Math.sqrt(-delta)]];
    return {
      animation: false,
      title: { text: "闭环极点", textStyle: { fontSize: 14 } },
      tooltip: { trigger: "item" }, grid: { left: 58, right: 24, top: 40, bottom: 40 },
      xAxis: { type: "value", min: -26, max: 1, name: "实部" },
      yAxis: { type: "value", min: -5, max: 5, name: "虚部" },
      series: [{ type: "scatter", symbolSize: 10, data: points }],
    };
  }, [d, gain]);
  const chartRef = useECharts(option), poleRef = useECharts(poleOption);
  const sliders = mode === "gain"
    ? [{ name: "输入增益 α", value: gain, min: 0.1, max: 3, step: 0.05, set: setGain }]
    : [
      { name: "状态权重 q₁", value: q1, min: 0.1, max: 20, step: 0.1, set: setQ1 },
      { name: "状态权重 q₂", value: q2, min: 0.1, max: 20, step: 0.1, set: setQ2 },
      { name: "控制权重 R", value: r, min: 0.1, max: 32, step: 0.1, set: setR },
    ];
  return <section style={{ border: "1px solid #cbd5e1", borderRadius: 8, padding: 16, margin: "20px 0", color: "#0f172a", background: "#fff" }}>
    <strong>{mode === "gain" ? "LQR 输入增益探索" : "LQR 权重探索"}</strong>
    <p style={{ fontSize: 14 }}>双积分器，x(0)=[1,0]，调节到零。默认 Q=I、R=1、α=1 复现例2。</p>
    {sliders.map(s => <label key={s.name} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, margin: "12px 0", fontSize: 14 }}>
      <span style={{ minWidth: 120 }}>{s.name}</span>
      <input aria-label={s.name} type="range" min={s.min} max={s.max} step={s.step} value={s.value} onChange={e => s.set(Number(e.target.value))} style={{ flex: 1, minWidth: 100 }} />
      <output style={{ minWidth: 52 }}>{s.value.toFixed(2)}</output>
    </label>)}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 12 }}>
      <div ref={chartRef} style={{ height: 470, width: "100%", minWidth: 0 }} />
      <div ref={poleRef} style={{ height: 320, width: "100%", minWidth: 0 }} />
    </div>
    <p style={{ fontSize: 14, lineHeight: 1.9, overflowWrap: "anywhere" }}>
      名义 K=[{d.k1.toFixed(4)}, {d.k2.toFixed(4)}]；P=[{d.p11.toFixed(4)}, {d.p12.toFixed(4)}; {d.p12.toFixed(4)}, {d.p22.toFixed(4)}]<br />
      当前极点：{d.pole}；u(0)={d.points[0].u.toFixed(4)}；名义最优代价 J*=P₁₁/2={(d.p11 / 2).toFixed(4)}（α=1 时）<br />
      {mode === "gain" ? "一般保证 α>0.5；本双积分器实际上对所有 α>0 稳定。这里只改输入增益，不代表任意模型误差。" : "权重为软惩罚，不保证限幅。改变权重观察响应与控制，不据此推断所有系统的单调趋势。"}
    </p>
    <button type="button" onClick={() => { setQ1(1); setQ2(1); setR(1); setGain(1); }} style={{ padding: "6px 12px", border: "1px solid #94a3b8", borderRadius: 5, cursor: "pointer" }}>恢复例2参数</button>
  </section>;
}
