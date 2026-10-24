"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "./use-echarts";
import { buckEstimate } from "@/lib/buck-converter";

export default function BuckConverterExplorer() {
  const [duty, setDuty] = useState(0.5);
  const [resistance, setResistance] = useState(6);
  const [inductance, setInductance] = useState(1);
  const result = buckEstimate(duty, resistance, inductance);
  const option = useMemo<EChartsOption>(() => ({
    animation: false,
    tooltip: { trigger: "axis" },
    grid: { left: 55, right: 20, top: 30, bottom: 50 },
    xAxis: { type: "value", min: 0, max: 100, name: "时间 (μs)", nameLocation: "middle", nameGap: 30 },
    yAxis: { type: "value", min: 0, max: 7, name: "电流 (A)" },
    series: [{ name: "小纹波近似", type: "line", showSymbol: false, data: buckEstimate(duty, resistance, inductance).points }],
  }), [duty, resistance, inductance]);
  const chart = useECharts(option);
  return <section style={{ border: "1px solid var(--border)", padding: 16, borderRadius: 12, margin: "20px 0", minWidth: 0 }} aria-label="Buck稳态纹波探索">
    <h3 style={{ marginTop: 0 }}>占空比、负载与连续电流</h3>
    <p>固定输入 24 V、开关频率 20 kHz、电容 100 μF。所有读数都是理想稳态的小纹波估计，不含启动过程。</p>
    <div style={{ display: "grid", gap: 12 }}>
      <label>占空比 D：{duty.toFixed(2)} <input aria-label="占空比" type="range" min="0.2" max="0.8" step="0.05" value={duty} onChange={e => setDuty(Number(e.target.value))} style={{ width: "100%" }} /></label>
      <label>负载电阻 R：{resistance} Ω <input aria-label="负载电阻" type="range" min="3" max="120" step="3" value={resistance} onChange={e => setResistance(Number(e.target.value))} style={{ width: "100%" }} /></label>
      <label>电感 L：{inductance.toFixed(1)} mH <input aria-label="电感" type="range" min="0.5" max="2" step="0.1" value={inductance} onChange={e => setInductance(Number(e.target.value))} style={{ width: "100%" }} /></label>
    </div>
    <p aria-live="polite">CCM候选：输出 {result.voltage.toFixed(3)} V；平均电流 {result.current.toFixed(3)} A；电流峰峰值 {result.ripple.toFixed(3)} A；预测谷值 {result.minimum.toFixed(3)} A；电压峰峰值 {result.voltageRipple.toFixed(5)} V；临界电阻 {result.boundary.toFixed(3)} Ω。</p>
    <p role="status">{result.valid ? "谷值为正：满足本近似的CCM检查；三角波仍是近似，不是精确开关波形。" : "CCM假设失效或处于边界：上述仅为候选计算，实际输出需DCM模型；不画负电流冒充二极管续流。"}</p>
    <div ref={chart} style={{ width: "100%", height: 300 }} />
    <button type="button" onClick={() => { setDuty(0.5); setResistance(6); setInductance(1); }} style={{ padding: "6px 14px", border: "1px solid var(--border)", borderRadius: 6 }}>恢复默认</button>
  </section>;
}
