"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "./use-echarts";
import { robotSlide } from "@/lib/robot-system";

export function RobotSystemExplorer() {
  const [mass, setMass] = useState(2);
  const [command, setCommand] = useState(3);
  const [initialVelocity, setInitialVelocity] = useState(0.2);
  const result = useMemo(() => robotSlide(mass, command, initialVelocity), [mass, command, initialVelocity]);
  const option = useMemo<EChartsOption>(() => ({
    animation: false,
    tooltip: { trigger: "axis" },
    grid: { left: 58, right: 20, top: 20, bottom: 52 },
    xAxis: { type: "value", min: 0, max: 1, name: "时间 / s", nameLocation: "middle", nameGap: 30 },
    yAxis: { type: "value", min: -1.6, max: 1.6, name: "位置 / m" },
    series: [{ type: "line", showSymbol: false, data: result.samples.map(s => [s.t, s.q]), name: "滑台位置" }],
  }), [result]);
  const ref = useECharts(option);
  return <section aria-label="滑台模型探索" style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 16, margin: "20px 0", minWidth: 0 }}>
    <p style={{ marginTop: 0 }}>水平无摩擦滑台 · 恒力保持 1 s · 力限幅 ±2 N</p>
    <div style={{ display: "grid", gap: 12 }}>
      <label>质量 / kg：{mass.toFixed(1)}<input aria-label="质量" type="range" min={1} max={4} step={0.5} value={mass} onChange={e => setMass(Number(e.target.value))} style={{ display: "block", width: "100%" }} /></label>
      <label>力指令 / N：{command.toFixed(1)}<input aria-label="力指令" type="range" min={-4} max={4} step={0.5} value={command} onChange={e => setCommand(Number(e.target.value))} style={{ display: "block", width: "100%" }} /></label>
      <label>初速度 / (m/s)：{initialVelocity.toFixed(1)}<input aria-label="初速度" type="range" min={-0.5} max={0.5} step={0.1} value={initialVelocity} onChange={e => setInitialVelocity(Number(e.target.value))} style={{ display: "block", width: "100%" }} /></label>
    </div>
    <p aria-live="polite" data-testid="slide-readout">实际力 {result.force.toFixed(3)} N；加速度 {result.acceleration.toFixed(3)} m/s²；1 s 位置 {result.end.q.toFixed(3)} m；速度 {result.end.v.toFixed(3)} m/s</p>
    <div ref={ref} style={{ height: 300, width: "100%", minWidth: 0 }} />
    <button type="button" onClick={() => { setMass(2); setCommand(3); setInitialVelocity(0.2); }} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 6 }}>恢复默认</button>
    <p style={{ fontSize: 14 }}>曲线是解析模型预测，没有位置反馈、止挡或碰撞处理；负位置表示相对起点向负方向移动。传感器偏置不改变真实运动。</p>
  </section>;
}
