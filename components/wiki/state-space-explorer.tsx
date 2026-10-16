"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

/**
 * 状态方程求解：零输入 / 零状态 / 全响应（modern/state-space）
 * 弹簧-质量-阻尼系统 m=250, c=500, k=16000（与 NB1/NB3 同参数）。
 * 拖初始位移 x₀ 看分解；默认 x₀=0.1、F=1000N 阶跃（复现原 NB3 手算例）。
 */
export function StateSpaceExplorer() {
  const [x0, setX0] = useState(0.1);
  const d = useMemo(() => {
    const m = 250, c = 500, k = 16000, F = 1000;
    const wn = Math.sqrt(k / m), zt = c / (2 * Math.sqrt(k * m));
    const wd = wn * Math.sqrt(Math.max(1e-9, 1 - zt * zt));
    const t: number[] = [], yFree: number[] = [], yStep: number[] = [], yTot: number[] = [];
    const yss = F / k;
    for (let i = 0; i <= 600; i++) {
      const ti = (3 * i) / 600; t.push(ti);
      const env = Math.exp(-zt * wn * ti);
      const yf = x0 * env * (Math.cos(wd * ti) + (zt * wn / Math.max(wd, 1e-9)) * Math.sin(wd * ti));
      yFree.push(yf);
      const ys = yss * (1 - env * (Math.cos(wd * ti) + (zt * wn / Math.max(wd, 1e-9)) * Math.sin(wd * ti)));
      yStep.push(ys);
      yTot.push(yf + ys);
    }
    return { t, yFree, yStep, yTot, wn, zt, yss, wd };
  }, [x0]);
  const option = useMemo(() => ({
    title: { text: `状态方程的分解（x₀=${x0.toFixed(2)} m，F=1000 N 阶跃）`, left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" as const },
    legend: { top: 26, data: ["零输入响应", "零状态响应", "全响应"] },
    grid: { top: 60, left: 60, right: 20, bottom: 45 },
    xAxis: { type: "value" as const, name: "t (s)", min: 0, max: 3 },
    yAxis: { type: "value" as const, name: "位移 y(t) (m)", min: -0.05, max: 0.35 },
    series: [
      { name: "零输入响应", type: "line" as const, data: d.t.map((x, i) => [x, d.yFree[i]]), lineStyle: { width: 2, color: "#dc2626", type: "dashed" as const }, symbol: "none" },
      { name: "零状态响应", type: "line" as const, data: d.t.map((x, i) => [x, d.yStep[i]]), lineStyle: { width: 2, color: "#2563eb", type: "dashed" as const }, symbol: "none" },
      { name: "全响应", type: "line" as const, data: d.t.map((x, i) => [x, d.yTot[i]]), lineStyle: { width: 2.5, color: "#111827" }, symbol: "none" },
    ],
    animation: false,
  }), [d, x0]);
  const ref = useECharts(option);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
        <label style={{ fontSize: 14 }}>初始位移 x₀ (m):</label>
        <input type="range" min={0} max={0.2} step={0.01} value={x0} onChange={(e) => setX0(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontSize: 14, minWidth: 44 }}>{x0.toFixed(2)}</span>
      </div>
      <div ref={ref} style={{ height: 400 }} />
      <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, fontSize: 14, lineHeight: 1.9 }}>
        <strong>读数（m=250, c=500, k=16000；默认 x₀=0.10、F=1000 N）：</strong><br />
        ω_n = √(k/m) = {d.wn.toFixed(2)} rad/s　·　ζ = c/(2√(km)) = {d.zt.toFixed(3)}（欠阻尼长振荡）<br />
        零状态稳态 y_ss = F/k = {(d.yss * 1000).toFixed(1)} mm　·　全响应 = 零输入 + 零状态（线性叠加，两条虚线相加恰为黑实线）
      </div>
    </div>
  );
}
