"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "@/components/wiki/use-echarts";

// Four independent plant channels, diagonal proportional feedback.
// r=[1,0], x(0)=0; fixed-step RK4 is independently checked against SciPy.
export function simulateMimo(kp1: number, kp2: number) {
  const derivative = (x: number[]) => {
    const u1 = kp1 * (1 - x[0] - x[1]);
    const u2 = -kp2 * (x[2] + x[3]);
    return [-x[0] + u1, -3 * x[1] + 0.5 * u2, -2 * x[2] + 0.3 * u1, -x[3] + u2];
  };
  const points: { t: number; y1: number; y2: number; u1: number; u2: number }[] = [];
  let x = [0, 0, 0, 0];
  const steps = 5000, dt = 10 / steps;
  for (let i = 0; i <= steps; i++) {
    if (i % 10 === 0) {
      const y1 = x[0] + x[1], y2 = x[2] + x[3];
      points.push({ t: i * dt, y1, y2, u1: kp1 * (1 - y1), u2: -kp2 * y2 });
    }
    if (i === steps) break;
    const k1 = derivative(x);
    const k2 = derivative(x.map((v, j) => v + dt * k1[j] / 2));
    const k3 = derivative(x.map((v, j) => v + dt * k2[j] / 2));
    const k4 = derivative(x.map((v, j) => v + dt * k3[j]));
    x = x.map((v, j) => v + dt * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]) / 6);
  }
  // (I + Kdc*diag(kp)) yInf = Kdc*diag(kp) r.
  const a = 1 + kp1, b = kp2 / 6, c = 0.15 * kp1, d = 1 + kp2;
  const determinant = a * d - b * c;
  const steady1 = (kp1 * d - b * 0.15 * kp1) / determinant;
  const steady2 = (a * 0.15 * kp1 - c * kp1) / determinant;
  const peak2 = points.reduce((best, v) => Math.abs(v.y2) > Math.abs(best.y2) ? v : best, points[0]);
  return { points, steady1, steady2, peak2 };
}

export function MimoProportionalExplorer() {
  const [kp1, setKp1] = useState(2), [kp2, setKp2] = useState(2);
  const data = useMemo(() => simulateMimo(kp1, kp2), [kp1, kp2]);
  const option: EChartsOption = useMemo(() => ({
    animation: false,
    tooltip: { trigger: "axis" },
    legend: { data: ["y₁", "y₂", "u₁", "u₂"], top: 0 },
    grid: [{ left: 58, right: 24, top: 36, height: 170 }, { left: 58, right: 24, top: 265, height: 155 }],
    xAxis: [
      { type: "value", min: 0, max: 10, name: "t (s)", gridIndex: 0 },
      { type: "value", min: 0, max: 10, name: "t (s)", gridIndex: 1 },
    ],
    yAxis: [
      { type: "value", min: -0.1, max: 1.1, name: "输出", gridIndex: 0 },
      { type: "value", min: -1, max: 5.1, name: "控制", gridIndex: 1 },
    ],
    series: [
      { name: "y₁", type: "line", showSymbol: false, data: data.points.map(p => [p.t, p.y1]), xAxisIndex: 0, yAxisIndex: 0 },
      { name: "y₂", type: "line", showSymbol: false, data: data.points.map(p => [p.t, p.y2]), xAxisIndex: 0, yAxisIndex: 0 },
      { name: "u₁", type: "line", showSymbol: false, data: data.points.map(p => [p.t, p.u1]), xAxisIndex: 1, yAxisIndex: 1 },
      { name: "u₂", type: "line", showSymbol: false, data: data.points.map(p => [p.t, p.u2]), xAxisIndex: 1, yAxisIndex: 1 },
    ],
  }), [data]);
  const chartRef = useECharts(option);
  const last = data.points[data.points.length - 1];
  return <section style={{ border: "1px solid #cbd5e1", borderRadius: 8, padding: 16, margin: "20px 0", background: "#fff", color: "#0f172a" }}>
    <strong>分散比例反馈：交叉输出与稳态误差</strong>
    <p style={{ fontSize: 14 }}>零初态，r₁=1、r₂=0。默认 Kp₁=Kp₂=2；这是教学模型，不代表实测装置。</p>
    {[{ label: "Kp₁", v: kp1, set: setKp1 }, { label: "Kp₂", v: kp2, set: setKp2 }].map(s =>
      <label key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, margin: "12px 0", fontSize: 14 }}>
        <span>{s.label}</span>
        <input aria-label={s.label} type="range" min={0.5} max={5} step={0.1} value={s.v} onChange={e => s.set(Number(e.target.value))} style={{ flex: 1, minWidth: 80 }} />
        <output style={{ minWidth: 34 }}>{s.v.toFixed(1)}</output>
      </label>)}
    <div ref={chartRef} style={{ width: "100%", height: 465, minWidth: 0 }} />
    <p style={{ fontSize: 14, lineHeight: 1.9, overflowWrap: "anywhere" }}>
      t=10 s 输出：[{last.y1.toFixed(6)}, {last.y2.toFixed(6)}]；控制：[{last.u1.toFixed(6)}, {last.u2.toFixed(6)}]<br />
      代数稳态 y∞=[{data.steady1.toFixed(6)}, {data.steady2.toFixed(6)}]；e₁∞={(1 - data.steady1).toFixed(6)}<br />
      采样最大 |y₂|={Math.abs(data.peak2.y2).toFixed(6)}，t={data.peak2.t.toFixed(2)} s（0–10 s、501点）<br />
      固定轴便于观察趋势；纯比例反馈没有积分保证。稳态值由代数方程计算，不把最后一个采样点当成精确稳态。
    </p>
    <button type="button" onClick={() => { setKp1(2); setKp2(2); }} style={{ border: "1px solid #94a3b8", borderRadius: 5, padding: "6px 12px", cursor: "pointer" }}>恢复正文默认值</button>
  </section>;
}
