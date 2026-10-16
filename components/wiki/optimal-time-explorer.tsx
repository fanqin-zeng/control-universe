"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

/**
 * 终端时间探索器（modern/optimal-control-basics）
 * 最小能量问题 ẋ=−x+u, x(0)=1, x(t_f)=0, J=½∫u²。
 * 解析解：x*=(e^{2tf−t}−e^t)/(e^{2tf}−1)、u*=−2e^t/(e^{2tf}−1)、J*=1/(e^{2tf}−1)。
 * 滑块 t_f∈[0.5,5]，默认 2 复现例3 手算链（λ(0)=0.0373、J*=0.0187）。
 */
export function OptimalTimeExplorer() {
  const [tf, setTf] = useState(2);
  const d = useMemo(() => {
    const D = Math.exp(2 * tf) - 1;
    const t: number[] = [], x: number[] = [], u: number[] = [];
    for (let i = 0; i <= 400; i++) {
      const ti = (tf * i) / 400;
      t.push(ti);
      x.push((Math.exp(2 * tf - ti) - Math.exp(ti)) / D);
      u.push((-2 * Math.exp(ti)) / D);
    }
    const tfC: number[] = [], Jc: number[] = [];
    for (let i = 0; i <= 200; i++) {
      const v = 0.5 + (4.5 * i) / 200;
      tfC.push(v);
      Jc.push(1 / (Math.exp(2 * v) - 1));
    }
    return { t, x, u, lam0: 2 / D, J: 1 / D, tfC, Jc };
  }, [tf]);
  const left = useMemo(() => ({
    title: { text: `最优轨迹与控制（t_f=${tf.toFixed(1)}）`, left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" as const },
    legend: { top: 26, data: ["x*(t)", "u*(t)"] },
    grid: { top: 60, left: 55, right: 15, bottom: 45 },
    xAxis: { type: "value" as const, name: "t", min: 0, max: 5 },
    yAxis: { type: "value" as const, name: "x / u", min: -0.15, max: 1.05 },
    series: [
      { name: "x*(t)", type: "line" as const, data: d.t.map((v, i) => [v, d.x[i]]), lineStyle: { width: 2, color: "#2563eb" }, symbol: "none" },
      { name: "u*(t)", type: "line" as const, data: d.t.map((v, i) => [v, d.u[i]]), lineStyle: { width: 2, color: "#dc2626", type: "dashed" as const }, symbol: "none" },
    ],
    animation: false,
  }), [d, tf]);
  const right = useMemo(() => ({
    title: { text: "最优代价 J*(t_f) = 1/(e^{2t_f}−1)", left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" as const },
    grid: { top: 50, left: 60, right: 15, bottom: 45 },
    xAxis: { type: "value" as const, name: "t_f", min: 0.5, max: 5 },
    yAxis: { type: "log" as const, name: "J*", min: 1e-5, max: 1 },
    series: [
      { type: "line" as const, data: d.tfC.map((v, i) => [v, d.Jc[i]]), lineStyle: { width: 2, color: "#16a34a" }, symbol: "none" },
      { type: "scatter" as const, data: [[tf, d.J]], itemStyle: { color: "#dc2626" }, symbolSize: 10 },
    ],
    animation: false,
  }), [d, tf]);
  const lref = useECharts(left);
  const rref = useECharts(right);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
        <label style={{ fontSize: 14 }}>终端时间 t_f:</label>
        <input type="range" min={0.5} max={5} step={0.1} value={tf} onChange={(e) => setTf(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontSize: 14, minWidth: 32 }}>{tf.toFixed(1)}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div ref={lref} style={{ height: 360 }} />
        <div ref={rref} style={{ height: 360 }} />
      </div>
      <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, fontSize: 14, lineHeight: 1.9 }}>
        <strong>读数（默认 t_f=2 复现例3 手算链）：</strong><br />
        λ(0) = 2/(e^(2t_f)−1) = {d.lam0.toFixed(4)}（例3：0.0373）· J* = {d.J.toFixed(4)}（例3：0.0187）· u*(0) = −λ(0) = {(0 - d.lam0).toFixed(4)}<br />
        时间换能量：t_f→∞ 时 J*→0（不花能量慢慢漂），t_f→0 时 J*→∞（瞬间到位需无穷能量）——右图对数刻度下的陡降曲线
      </div>
    </div>
  );
}
