"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

/**
 * 观测器收敛速度探索器（modern/state-observer）
 * 系统 A=[[0,1],[-2,-3]], C=[1,0]；控制侧固定 K=[7,1.2]、N=9（例3，分离性原理）。
 * 拖观测器二重极点 p（原 ipywidgets 滑块 min/max 写反，已修正区间 [-30,-5]）。
 * 默认 p=-15 复现例3手算：L=[27,142]。
 */
export function ObserverSpeedExplorer() {
  const [p, setP] = useState(-15);
  const d = useMemo(() => {
    const l1 = -2 * p - 3;
    const l2 = p * p - 3 * l1 - 2;
    const t: number[] = [];
    const xh1: number[] = [];
    for (let i = 0; i <= 400; i++) {
      const ti = (2 * i) / 400;
      t.push(ti);
      xh1.push(1 - Math.exp(p * ti) * (1 - p * ti));
    }
    return { t, xh1, l1, l2 };
  }, [p]);
  const option = useMemo(() => ({
    title: { text: `状态估计收敛（观测器极点 p=${p}，控制极点实部 −2.1）`, left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" as const },
    legend: { top: 26, data: ["真实 x₁（初值 1）", "估计 x̂₁（初值 0）"] },
    grid: { top: 60, left: 55, right: 20, bottom: 45 },
    xAxis: { type: "value" as const, name: "t (s)", min: 0, max: 2 },
    yAxis: { type: "value" as const, name: "x₁ / x̂₁", min: -0.2, max: 1.2 },
    series: [
      { name: "真实 x₁（初值 1）", type: "line" as const, data: d.t.map((x) => [x, 1]), lineStyle: { width: 2, color: "#2563eb" }, symbol: "none" },
      { name: "估计 x̂₁（初值 0）", type: "line" as const, data: d.t.map((x, i) => [x, d.xh1[i]]), lineStyle: { width: 2, color: "#dc2626", type: "dashed" as const }, symbol: "none" },
    ],
    animation: false,
  }), [d, p]);
  const ref = useECharts(option);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
        <label style={{ fontSize: 14 }}>观测器二重极点 p:</label>
        <input type="range" min={-30} max={-5} step={1} value={p} onChange={(e) => setP(parseInt(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontSize: 14, minWidth: 32 }}>{p}</span>
      </div>
      <div ref={ref} style={{ height: 380 }} />
      <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, fontSize: 14, lineHeight: 1.9 }}>
        <strong>读数（默认 p=−15 复现例3手算链）：</strong><br />
        L = [l₁, l₂] = [{d.l1}, {d.l2}]（例3：[27, 142]）· 控制侧 K=[7, 1.2]、N=9 不变——分离性原理<br />
        误差衰减 ∝ e^(pt)：p=−15 时时间常数 67 ms，约为控制极点（476 ms）的 1/7——观测器要比控制器快，但太快会放大量测噪声
      </div>
    </div>
  );
}
