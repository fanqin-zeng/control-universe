"use client";
import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "./use-echarts";
import { lateralResponse } from "@/lib/vehicle-dynamics";

export function VehicleDynamicsExplorer() {
  const [speed, setSpeed] = useState(10), [steer, setSteer] = useState(0.04), [mu, setMu] = useState(0.8);
  const result = useMemo(() => lateralResponse(speed, steer, mu), [speed, steer, mu]);
  const option = useMemo<EChartsOption>(() => ({
    animation: false, tooltip: { trigger: "axis" },
    grid: { left: 58, right: 18, top: 35, bottom: 50 },
    xAxis: { type: "value", min: 0, max: 2, name: "时间 / s", nameLocation: "middle", nameGap: 27 },
    yAxis: { type: "value", min: -0.8, max: 0.8, name: "横摆角速度 / rad/s" },
    series: [
      { name: "r(t)", type: "line", showSymbol: false, data: result.points.map(p => [p[0], p[2]]) },
      { name: "解析稳态 r∞", type: "line", showSymbol: false, lineStyle: { type: "dashed" }, data: [[0, result.rSteady], [2, result.rSteady]] },
    ],
  }), [result]);
  const ref = useECharts(option);
  const controls = [
    { label: "纵向速度 / m/s", value: speed, min: 5, max: 25, step: 1, set: setSpeed },
    { label: "前轮偏角 / rad", value: steer, min: -0.08, max: 0.08, step: 0.01, set: setSteer },
    { label: "附着系数", value: mu, min: 0.2, max: 1, step: 0.1, set: setMu },
  ];
  return <section aria-label="车辆横向动力学实验" style={{ border: "1px solid #94a3b8", borderRadius: 12, margin: "20px 0", padding: 16, minWidth: 0 }}>
    <p style={{ marginTop: 0 }}>前轮偏角阶跃后保持不变。把速度调到20 m/s、附着系数调到0.3，检查线性模型的稳态要求。</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12 }}>
      {controls.map(c => <label key={c.label}>{c.label}：{c.value.toFixed(2)}<input aria-label={c.label} type="range" min={c.min} max={c.max} step={c.step} value={c.value} onChange={e => c.set(Number(e.target.value))} style={{ display: "block", width: "100%" }} /></label>)}
    </div>
    <p data-testid="lateral-values" aria-live="polite" style={{ fontVariantNumeric: "tabular-nums" }}>r(2 s) = {result.points[200][2].toFixed(6)} rad/s；解析稳态 r∞ = {result.rSteady.toFixed(6)} rad/s；vᵧ(2 s) = {result.points[200][1].toFixed(6)} m/s。</p>
    <p data-testid="lateral-budget">稳态横向加速度 = {result.ay.toFixed(6)} m/s²；总附着预算占用 = {result.usage.toFixed(6)}；前/后侧偏角 = {result.frontSlip.toFixed(6)} / {result.rearSlip.toFixed(6)} rad。</p>
    <p>{result.usage > 1 ? "稳态超出示例总附着预算：下图是未施加轮胎饱和的线性外推，不能当作可实现运动。" : "稳态满足示例总附着预算；瞬态还需用实际加速度另核，轮胎线性范围及各轴约束也不能省略。"}</p>
    <div ref={ref} style={{ width: "100%", height: 300 }} />
    <button type="button" onClick={() => { setSpeed(10); setSteer(0.04); setMu(0.8); }} style={{ border: "1px solid #94a3b8", borderRadius: 6, padding: "6px 12px" }}>恢复主例</button>
  </section>;
}
