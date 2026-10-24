"use client";
import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "./use-echarts";
import { particleExperiment, type ParticleMode } from "@/lib/particle-filter";
export function ParticleFilterExplorer() {
  const show = (x: number) => Math.abs(x) < .0000005 ? "0.000000" : x.toFixed(6);
  const [mode, setMode] = useState<ParticleMode>("discrete"), [count, setCount] = useState(256), [mu, setMu] = useState(0), [r, setR] = useState(1), [z, setZ] = useState(4), [seed, setSeed] = useState(7);
  const result = useMemo(() => particleExperiment(mode, count, mu, r, z, seed), [mode, count, mu, r, z, seed]);
  const option = useMemo<EChartsOption>(() => ({
    animation: false, tooltip: { trigger: "axis" },
    legend: { top: 0, textStyle: { fontSize: 11 }, data: ["加权粒子 CDF", "重采样 CDF", "参考 CDF"] },
    grid: { left: 52, right: 15, top: 75, bottom: 45 },
    xAxis: { type: "value", min: -6, max: 6, name: "位置阈值 / m", nameLocation: "middle", nameGap: 28 },
    yAxis: { type: "value", min: 0, max: 1, name: "累计概率", nameLocation: "middle", nameGap: 34 },
    series: [
      { name: "加权粒子 CDF", type: "line", step: "end", showSymbol: false, data: result.weightedCurve },
      { name: "重采样 CDF", type: "line", step: "end", showSymbol: false, lineStyle: { type: "dotted" }, data: result.resampledCurve },
      { name: "参考 CDF", type: "line", step: mode === "discrete" ? "end" : false, showSymbol: false, lineStyle: { type: "dashed" }, data: result.reference.curve },
    ],
  }), [result, mode]);
  const chart = useECharts(option), b = result.before, a = result.after, ref = result.reference;
  return <section aria-label="粒子权重与重采样探索" style={{ border: "1px solid #94a3b8", borderRadius: 12, padding: 16, margin: "24px 0", minWidth: 0 }}>
    <p style={{ marginTop: 0 }}>离散模式固定四点先验，默认复现手算。高斯模式才使用粒子数、先验均值与种子；两个模式各用自己的参考模型。</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <label>先验模式 <select aria-label="先验模式" value={mode} onChange={e => setMode(e.target.value as ParticleMode)}><option value="discrete">四点离散</option><option value="gaussian">高斯采样</option></select></label>
      <label>高斯粒子数 <select aria-label="高斯粒子数" disabled={mode === "discrete"} value={count} onChange={e => setCount(Number(e.target.value))}>{[64, 256, 1024].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <label>先验均值 <select aria-label="先验均值" disabled={mode === "discrete"} value={mu} onChange={e => setMu(Number(e.target.value))}>{[0, 2].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <label>测量噪声方差 <select aria-label="测量噪声方差" value={r} onChange={e => setR(Number(e.target.value))}>{[.25, 1, 4].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <label>本拍读数 <select aria-label="本拍读数" value={z} onChange={e => setZ(Number(e.target.value))}>{[1, 4].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <label>随机种子 <select aria-label="随机种子" disabled={mode === "discrete"} value={seed} onChange={e => setSeed(Number(e.target.value))}>{[7, 19, 43].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <button type="button" onClick={() => { setMode("discrete"); setCount(256); setMu(0); setR(1); setZ(4); setSeed(7); }} style={{ padding: "4px 12px", border: "1px solid #64748b", borderRadius: 4 }}>恢复默认</button>
    </div>
    <p data-testid="particle-readout" style={{ overflowWrap: "anywhere" }}>加权均值 {show(b.mean)}、方差 {show(b.variance)}、ESS {show(b.ess)}、负分支 {show(b.negativeMass)}；重采样均值 {show(a.mean)}、方差 {show(a.variance)}、ESS {show(a.ess)}、不同祖先 {result.uniqueAncestors}；参考均值 {show(ref.mean)}、方差 {show(ref.variance)}。</p>
    <div ref={chart} style={{ width: "100%", height: 310 }} />
    <p style={{ fontSize: 14 }}>当前粒子数 {result.count}；按 ESS&lt;N/2 是否触发：{b.ess < result.count / 2 ? "是" : "否"}。本图始终额外演示一次重采样，不把演示当成自动触发。CDF纵轴无量纲，均值/方差单位m/m²，R单位m⁴；固定显示±6m，区间外质量不会重新归一化。</p>
  </section>;
}
