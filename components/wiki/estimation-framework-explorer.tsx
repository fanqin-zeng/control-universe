"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import { estimationCorrection } from "@/lib/estimation-framework";

export function EstimationFrameworkExplorer() {
  const [priorVariance, setPriorVariance] = useState(4);
  const [sensorVariance, setSensorVariance] = useState(1);
  const [gain, setGain] = useState(0.8);
  const result = estimationCorrection(priorVariance, sensorVariance, gain);
  const option = useMemo(() => ({
    animation: false,
    tooltip: { trigger: "axis" as const },
    grid: { left: 55, right: 20, top: 28, bottom: 44 },
    xAxis: { type: "value" as const, min: 0, max: 1, name: "增益 K", nameLocation: "middle" as const, nameGap: 28 },
    yAxis: { type: "value" as const, min: 0, max: 10, name: "均方误差 / °C²" },
    series: [
      { type: "line" as const, name: "模型下的均方误差", symbol: "none", data: Array.from({ length: 101 }, (_, i) => [i / 100, estimationCorrection(priorVariance, sensorVariance, i / 100).risk]) },
      { type: "scatter" as const, name: "当前增益", symbolSize: 12, data: [[gain, result.risk]] },
    ],
  }), [priorVariance, sensorVariance, gain, result.risk]);
  const chart = useECharts(option);
  return <section aria-label="标量估计修正探索" style={{ padding: 16, margin: "20px 0", border: "1px solid var(--border)", borderRadius: 12, minWidth: 0 }}>
    <p style={{ marginTop: 0 }}>预测温度固定为 20°C，读数固定为 23°C。先选误差方差，再拖动增益，看估计温度和模型均方误差怎样变化。</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      <label>预测误差方差 P（°C²） <select aria-label="预测误差方差" value={priorVariance} onChange={e => setPriorVariance(Number(e.target.value))}>{[1, 4, 9].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <label>测量噪声方差 R（°C²） <select aria-label="测量噪声方差" value={sensorVariance} onChange={e => setSensorVariance(Number(e.target.value))}>{[0, 1, 4, 9].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
    </div>
    <label style={{ display: "block", margin: "16px 0" }}>修正增益 K = {gain.toFixed(4)}<input aria-label="修正增益" type="range" min="0" max="1" step="any" value={gain} onChange={e => setGain(Number(e.target.value))} style={{ display: "block", width: "100%" }} /></label>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <button type="button" onClick={() => setGain(result.optimalGain)}>使用模型最优增益</button>
      <button type="button" onClick={() => { setPriorVariance(4); setSensorVariance(1); setGain(0.8); }}>恢复默认</button>
    </div>
    <p data-testid="estimation-readout" aria-live="polite">修正温度 {result.estimate.toFixed(4)} °C；模型均方误差 {result.risk.toFixed(4)} °C²；最优增益 {result.optimalGain.toFixed(4)}；最小均方误差 {result.optimalRisk.toFixed(4)} °C²。</p>
    <div ref={chart} style={{ width: "100%", height: 270 }} />
    <p style={{ marginBottom: 0 }}>曲线是独立、零均值误差模型下的总体均方误差，不是本次真实误差。R=0 表示理想无噪声传感器。控件没有模拟偏置、相关误差、丢包或延迟。</p>
  </section>;
}
