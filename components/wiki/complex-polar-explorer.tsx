"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

/**
 * 复数极坐标探索器（math/complex-numbers）
 * 四滑块 a、b、r、θ 联动（拖 a/b 反算 r/θ；拖 r/θ 反算 a/b）。
 * 默认 a=3、b=4 复现正文首例（r=5、θ=53.13°）。
 * 画布固定 x/y ∈ [-6,6]（校订反馈要求：画图范围保持固定）。
 */
export function ComplexPolarExplorer() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const r = Math.hypot(a, b);
  const thetaDeg = (Math.atan2(b, a) * 180) / Math.PI;
  const setFromPolar = (nr: number, nd: number) => {
    const rad = (nd * Math.PI) / 180;
    setA(Math.round(nr * Math.cos(rad) * 100) / 100);
    setB(Math.round(nr * Math.sin(rad) * 100) / 100);
  };
  const option = useMemo(() => ({
    tooltip: { trigger: "item" as const },
    grid: { top: 30, left: 60, right: 30, bottom: 45 },
    xAxis: { type: "value" as const, name: "Re", min: -6, max: 6 },
    yAxis: { type: "value" as const, name: "Im", min: -6, max: 6 },
    series: [
      { type: "line" as const, data: [[0, 0], [a, b]], lineStyle: { width: 2.5, color: "#2563eb" }, symbol: "arrow" as const, symbolSize: 10 },
      { type: "line" as const, data: [[0, b], [a, b]], lineStyle: { width: 1, color: "#94a3b8", type: "dashed" as const }, symbol: "none" },
      { type: "line" as const, data: [[a, 0], [a, b]], lineStyle: { width: 1, color: "#94a3b8", type: "dashed" as const }, symbol: "none" },
      { type: "scatter" as const, data: [[a, b]], itemStyle: { color: "#dc2626" }, symbolSize: 9 },
      { type: "line" as const, data: Array.from({ length: 61 }, (_, i) => { const t = (i / 60) * Math.max(thetaDeg, 0) * Math.PI / 180; const rr = Math.min(r, 1.2); return [rr * Math.cos(t), rr * Math.sin(t)]; }), lineStyle: { width: 1, color: "#f59e0b" }, symbol: "none" },
    ],
    animation: false,
  }), [a, b, r, thetaDeg]);
  const ref = useECharts(option);
  const sliders: [string, number, number, number, number, (v: number) => void][] = [
    ["实部 a", a, -5, 5, 0.1, setA],
    ["虚部 b", b, -5, 5, 0.1, setB],
    ["模 r", Math.round(r * 100) / 100, 0.5, 7, 0.05, (v) => setFromPolar(v, thetaDeg)],
    ["辐角 θ (°)", Math.round(thetaDeg * 100) / 100, -180, 180, 1, (v) => setFromPolar(r, v)],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div ref={ref} style={{ height: 400 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 18px", padding: "0 12px" }}>
        {sliders.map(([label, val, mn, mx, st, on]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 13, minWidth: 72 }}>{label}:</label>
            <input type="range" min={mn} max={mx} step={st} value={val} onChange={(ev) => on(parseFloat(ev.target.value))} style={{ flex: 1 }} />
            <span style={{ fontSize: 13, minWidth: 46, textAlign: "right" }}>{val.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 14px", background: "#f8fafc", borderRadius: 8, fontSize: 14, lineHeight: 1.9 }}>
        z = {a.toFixed(2)} {b >= 0 ? "+" : "−"} {Math.abs(b).toFixed(2)}i　·　r = √(a²+b²) = {r.toFixed(3)}　·　θ = arctan(b/a) = {thetaDeg.toFixed(2)}°（注意象限）<br />
        极坐标形式 z = r(cosθ + i·sinθ)。拖 a、b 时 r、θ 跟着变；拖 r、θ 时 a、b 反向联动——两组坐标描述同一个点（默认 a=3、b=4 即正文首例：r=5、θ=53.13°）
      </div>
    </div>
  );
}