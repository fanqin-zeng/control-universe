"use client";
import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "./use-echarts";
import { kalmanNoise } from "@/lib/kalman-noise";

export function KalmanNoiseExplorer() {
  const [q, setQ] = useState(1), [r, setR] = useState(1);
  const data = useMemo(() => kalmanNoise(q, r), [q, r]);
  const option = useMemo<EChartsOption>(() => ({
    animation: false,
    tooltip: { trigger: "axis" },
    grid: { left: 45, right: 18, top: 60, bottom: 45 },
    legend: { top: 0, textStyle: { fontSize: 11 }, data: ["真实均方误差", "匹配假设基线"] },
    xAxis: { type: "value", min: 0, max: 5, name: "t (s)", nameLocation: "middle", nameGap: 28 },
    yAxis: { type: "value", min: 0, max: 10, name: "均方误差" },
    series: [
      { name: "真实均方误差", type: "line", showSymbol: false, data: data.curve },
      { name: "匹配假设基线", type: "line", showSymbol: false, lineStyle: { type: "dashed" }, data: kalmanNoise(1, 1).curve },
    ],
  }), [data]);
  const chart = useECharts(option);
  return <section aria-label="卡尔曼噪声假设探索" style={{ border: "1px solid #94a3b8", borderRadius: 12, padding: 16, margin: "24px 0", minWidth: 0 }}>
    <p style={{ marginTop: 0 }}>真实模型固定：a = −1，q = r = 1。修改估计器假设，观察真实误差是否跟着标称方差变小。</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      <label>假设过程强度 <select aria-label="假设过程强度" value={q} onChange={e => setQ(Number(e.target.value))}>{[.01, .1, 1, 10, 100].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <label>假设测量强度 <select aria-label="假设测量强度" value={r} onChange={e => setR(Number(e.target.value))}>{[.25, 1, 4].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <button type="button" onClick={() => { setQ(1); setR(1); }} style={{ padding: "4px 12px", border: "1px solid #64748b", borderRadius: 4 }}>恢复默认</button>
    </div>
    <p data-testid="kalman-readout" style={{ overflowWrap: "anywhere" }}>增益 {data.gain.toFixed(6)}；标称方差 {data.nominal.toFixed(6)}；真实稳态方差 {data.actual.toFixed(6)}；匹配基线 {data.optimal.toFixed(6)}；误差极点 {data.pole.toFixed(6)}。</p>
    <div ref={chart} style={{ width: "100%", height: 300 }} />
    <p style={{ fontSize: 14 }}>曲线从初始均方误差1出发，使用解析公式；纵轴始终0至10。默认两条曲线重合。更小的标称方差不能证明模型更准确。</p>
  </section>;
}
