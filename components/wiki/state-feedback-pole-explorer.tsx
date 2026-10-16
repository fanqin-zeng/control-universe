"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

/**
 * 极点配置探索器（modern/state-feedback）
 * 系统 A=[[0,1],[-2,-3]], B=[0;1], C=[1,0]。拖动二重实极点 p：
 * K = [p²−2, −2p−3]（比较系数），前馈 N = 1/(−C(A−BK)⁻¹B)。
 * 默认 p=−5 复现正文例1/例4/例5 手算链：K=[23,7]、N=25。
 */
export function StateFeedbackPoleExplorer() {
  const [p, setP] = useState(-5);
  const d = useMemo(() => {
    const k1 = p * p - 2, k2 = -2 * p - 3; // Acl=[[0,1],[-2-k1,-3-k2]] => char s²+(3+k2)s+(2+k1)
    const wn = Math.sqrt(2 + k1), zt = (3 + k2) / (2 * Math.sqrt(2 + k1));
    const N = 2 + k1; // -C(Acl)^-1 B = 1/(2+k1)
    const t: number[] = [], yO: number[] = [], yC: number[] = [];
    for (let i = 0; i <= 500; i++) {
      const ti = (4 * i) / 500; t.push(ti);
      yO[i] = 0.5 * (1 + Math.exp(-ti) - 2 * Math.exp(-2 * ti));
      // closed-loop with feedforward: DC gain 1, second-order (p,p): y = 1 - e^{pt}(1 - pt) ... for double pole
      const ept = Math.exp(p * ti);
      yC.push(1 - ept * (1 - p * ti));
    }
    return { t, yO, yC, k1, k2, wn, zt, N };
  }, [p]);
  const option = useMemo(() => ({
    title: { text: `开环 vs 极点配置闭环（p = ${p.toFixed(1)} 二重极点）`, left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" as const },
    legend: { top: 26, data: ["开环（极点 −1, −2）", "闭环 + 前馈"] },
    grid: { top: 60, left: 55, right: 20, bottom: 45 },
    xAxis: { type: "value" as const, name: "t (s)", min: 0, max: 4 },
    yAxis: { type: "value" as const, name: "y(t)", min: 0, max: 1.6 },
    series: [
      { name: "开环（极点 −1, −2）", type: "line" as const, data: d.t.map((x, i) => [x, d.yO[i]]), lineStyle: { width: 2, color: "#94a3b8", type: "dashed" as const }, symbol: "none" },
      { name: "闭环 + 前馈", type: "line" as const, data: d.t.map((x, i) => [x, d.yC[i]]), lineStyle: { width: 2.5, color: "#2563eb" }, symbol: "none" },
      { name: "r=1", type: "line" as const, data: [[0, 1], [4, 1]], lineStyle: { width: 1, color: "#f59e0b", type: "dotted" as const }, symbol: "none" },
    ],
    animation: false,
  }), [d, p]);
  const ref = useECharts(option);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
        <label style={{ fontSize: 14 }}>闭环二重极点 p:</label>
        <input type="range" min={-10} max={-0.5} step={0.5} value={p} onChange={(e) => setP(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontSize: 14, minWidth: 40 }}>{p.toFixed(1)}</span>
      </div>
      <div ref={ref} style={{ height: 400 }} />
      <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, fontSize: 14, lineHeight: 1.9 }}>
        <strong>读数（默认 p=−5 复现正文手算链）：</strong><br />
        反馈增益 K = [k₁, k₂] = [p²−2, −2p−3] = [{d.k1}, {d.k2}]（正文例 1/4：[23, 7]）<br />
        前馈增益 N = p² = {d.N}（正文例 5：25）· 闭环 ω_n = |p| = {d.wn.toFixed(1)} rad/s（临界阻尼）<br />
        注意 p 越远 K 越大（|K|∝p²）——执行器饱和与噪声放大的代价，见「极点选择的工程考量」
      </div>
    </div>
  );
}
