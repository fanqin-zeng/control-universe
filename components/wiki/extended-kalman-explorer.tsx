"use client";
import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "./use-echarts";
import { ekfPosterior, type MeasurementKind } from "@/lib/extended-kalman";
export function ExtendedKalmanExplorer() {
  const show = (value: number) => Math.abs(value) < .0000005 ? "0.000000" : value.toFixed(6);
  const [kind, setKind] = useState<MeasurementKind>("square"), [mu, setMu] = useState(2), [p, setP] = useState(.25), [r, setR] = useState(1), [z, setZ] = useState(5);
  const result = useMemo(() => ekfPosterior(mu, p, r, z, kind), [kind, mu, p, r, z]);
  const option = useMemo<EChartsOption>(() => ({
    animation: false, tooltip: { trigger: "axis" },
    legend: { top: 0, textStyle: { fontSize: 11 }, data: ["EKF 高斯近似", "数值参考后验"] },
    grid: { left: 45, right: 15, top: 65, bottom: 45 },
    xAxis: { type: "value", min: -6, max: 6, name: "位置 x / m", nameLocation: "middle", nameGap: 28 },
    yAxis: { type: "value", min: 0, max: 8, name: "概率密度 / m⁻¹" },
    series: [
      { name: "EKF 高斯近似", type: "line", showSymbol: false, data: result.curve.map(p => [p.x, p.approximate]) },
      { name: "数值参考后验", type: "line", showSymbol: false, lineStyle: { type: "dashed" }, data: result.curve.map(p => [p.x, p.reference]) },
    ],
  }), [result]);
  const chart = useECharts(option);
  return <section aria-label="EKF后验近似探索" style={{ border: "1px solid #94a3b8", borderRadius: 12, padding: 16, margin: "24px 0", minWidth: 0 }}>
    <p style={{ marginTop: 0 }}>同一先验和同一拍测量：比较局部高斯近似与一维积分参考。均值为0也可能对应两个不同位置。</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <label>观测模型 <select aria-label="观测模型" value={kind} onChange={e => setKind(e.target.value as MeasurementKind)}><option value="square">平方 x²</option><option value="linear">线性 x</option></select></label>
      <label>先验均值 <select aria-label="先验均值" value={mu} onChange={e => setMu(Number(e.target.value))}>{[-2, 0, 2].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <label>先验方差 <select aria-label="先验方差" value={p} onChange={e => setP(Number(e.target.value))}>{[.25, 1].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <label>测量噪声方差 <select aria-label="测量噪声方差" value={r} onChange={e => setR(Number(e.target.value))}>{[.25, 1, 4].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <label>本拍读数 <select aria-label="本拍读数" value={z} onChange={e => setZ(Number(e.target.value))}>{[4, 5].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <button type="button" onClick={() => { setKind("square"); setMu(2); setP(.25); setR(1); setZ(5); }} style={{ padding: "4px 12px", border: "1px solid #64748b", borderRadius: 4 }}>恢复默认</button>
    </div>
    <p data-testid="ekf-readout" style={{ overflowWrap: "anywhere" }}>H {show(result.jacobian)}；K {show(result.gain)}；EKF 均值 {show(result.mean)}、方差 {show(result.variance)}；参考均值 {show(result.referenceMean)}、方差 {show(result.referenceVariance)}。</p>
    <div ref={chart} style={{ width: "100%", height: 310 }} />
    <p style={{ fontSize: 14 }}>位置/状态方差单位为m/m²；{kind === "square" ? "平方观测单位m²、R单位m⁴。" : "线性观测单位m、R单位m²。"}参考曲线用一维积分，不表示EKF额外执行了积分。坐标始终固定，曲线为概率密度。</p>
  </section>;
}
