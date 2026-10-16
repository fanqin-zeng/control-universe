"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

/**
 * P 控制稳态-动态权衡探索器（classic/classic-case-study）
 * 系统 G=1000/(s²+101s+110)。拖 K 看矛盾：K↑ → e_ss↓ 但 ζ↓、Mp↑。
 * 默认 K=50 复现正文手算例：e_ss=0.22%、ζ=0.226、Mp≈48%。
 */
export function PControlTradeoffExplorer() {
  const [K, setK] = useState(50);
  const d = useMemo(() => {
    const t: number[] = [], y: number[] = [];
    const wn = Math.sqrt(110 + 1000 * K), zt = 101 / (2 * wn), wd = wn * Math.sqrt(Math.max(1e-9, 1 - zt * zt));
    for (let i = 0; i <= 600; i++) { const ti = (3 * i) / 600; t.push(ti); y.push(1 - (Math.exp(-zt * wn * ti) / Math.sqrt(Math.max(1e-9, 1 - zt * zt))) * Math.cos(wd * ti)); }
    const ess = 1 / (1 + (K * 1000) / 110), mp = zt < 1 ? Math.exp((-Math.PI * zt) / Math.sqrt(1 - zt * zt)) * 100 : 0;
    return { t, y, wn, zt, ess, mp };
  }, [K]);
  const option = useMemo(() => ({
    title: { text: `P 控制闭环阶跃响应（K=${K}）`, left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" as const },
    legend: { top: 26, data: ["y(t)", "±2% 带"] },
    grid: { top: 60, left: 55, right: 20, bottom: 45 },
    xAxis: { type: "value" as const, name: "t (s)", min: 0, max: 3 },
    yAxis: { type: "value" as const, name: "ω(t)/ω_ref", min: 0, max: 1.6 },
    series: [
      { name: "y(t)", type: "line" as const, data: d.t.map((x, i) => [x, d.y[i]]), lineStyle: { width: 2, color: "#2563eb" }, symbol: "none" },
      { name: "±2% 带", type: "line" as const, data: [[0, 1.02], [3, 1.02]], lineStyle: { width: 1, color: "#94a3b8", type: "dashed" as const }, symbol: "none" },
      { name: "+2%", type: "line" as const, data: [[0, 0.98], [3, 0.98]], lineStyle: { width: 1, color: "#94a3b8", type: "dashed" as const }, symbol: "none" },
    ],
    animation: false,
  }), [d, K]);
  const ref = useECharts(option);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
        <label style={{ fontSize: 14 }}>增益 K:</label>
        <input type="range" min={1} max={100} step={1} value={K} onChange={(e) => setK(parseInt(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontSize: 14, minWidth: 36 }}>{K}</span>
      </div>
      <div ref={ref} style={{ height: 380 }} />
      <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, fontSize: 14, lineHeight: 1.9 }}>
        <strong>读数（正文手算例 K=50：e_ss=0.22%、ζ=0.226、Mp≈48%）：</strong><br />
        稳态误差 e_ss = 1/(1+9.1K) = {(d.ess * 100).toFixed(2)}%　（指标 &lt;1% 需 K&gt;11）<br />
        阻尼比 ζ = 101/(2ω_n) = {d.zt.toFixed(3)}　·　ω_n = {d.wn.toFixed(1)} rad/s　·　超调 Mp ≈ {d.mp.toFixed(0)}%（指标 &lt;10%）
      </div>
    </div>
  );
}
