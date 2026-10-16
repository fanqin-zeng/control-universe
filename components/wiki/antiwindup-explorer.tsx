"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

function simulateAntiWindup(uLimit: number) {
  // Plant: G(s) = 1/(s^2+2s), PI controller Kp=5, Ki=10
  const Kp = 5.0;
  const Ki = 10.0;
  const dt = 0.001;
  const tEnd = 5;
  const steps = Math.floor(tEnd / dt);
  
  const t: number[] = [];
  const yIdeal: number[] = [];
  const ySat: number[] = [];
  const yAw: number[] = [];
  const uSat: number[] = [];
  const uAw: number[] = [];
  
  // Ideal (no saturation)
  let xIntIdeal = 0;
  let yPrevIdeal = 0;
  for (let i = 0; i < steps; i++) {
    const ti = i * dt;
    t.push(ti);
    const e = 1 - yPrevIdeal;
    const u = Kp * e + Ki * xIntIdeal;
    const dydt = (u - 2 * yPrevIdeal) / (ti + 0.001);
    yPrevIdeal += dt * dydt;
    xIntIdeal += dt * e;
    yIdeal.push(yPrevIdeal);
  }
  
  // With saturation (no anti-windup)
  let xIntSat = 0;
  let yPrevSat = 0;
  for (let i = 0; i < steps; i++) {
    const e = 1 - yPrevSat;
    const v = Kp * e + Ki * xIntSat;
    const u = Math.max(-uLimit, Math.min(uLimit, v));
    const dydt = (u - 2 * yPrevSat) / (t[i] + 0.001);
    yPrevSat += dt * dydt;
    xIntSat += dt * e;
    ySat.push(yPrevSat);
    uSat.push(u);
  }
  
  // With anti-windup (back-calculation Kb=1)
  let xIntAw = 0;
  let yPrevAw = 0;
  const Kb = 1.0;
  for (let i = 0; i < steps; i++) {
    const e = 1 - yPrevAw;
    const v = Kp * e + Ki * xIntAw;
    const u = Math.max(-uLimit, Math.min(uLimit, v));
    const dydt = (u - 2 * yPrevAw) / (t[i] + 0.001);
    yPrevAw += dt * dydt;
    xIntAw += dt * (e + Kb * (u - v));
    yAw.push(yPrevAw);
    uAw.push(u);
  }
  
  const maxOvershootSat = ((Math.max(...ySat) - 1) * 100).toFixed(1);
  const maxOvershootAw = ((Math.max(...yAw) - 1) * 100).toFixed(1);
  
  return {
    t: t.filter((_, i) => i % 10 === 0), // Downsample for performance
    yIdeal: yIdeal.filter((_, i) => i % 10 === 0),
    ySat: ySat.filter((_, i) => i % 10 === 0),
    yAw: yAw.filter((_, i) => i % 10 === 0),
    uSat: uSat.filter((_, i) => i % 10 === 0),
    uAw: uAw.filter((_, i) => i % 10 === 0),
    maxOvershootSat,
    maxOvershootAw,
  };
}

export function AntiWindupExplorer() {
  const [uLimit, setULimit] = useState(2.0);
  
  const data = useMemo(() => simulateAntiWindup(uLimit), [uLimit]);
  
  const responseOption = useMemo(() => ({
    title: { text: `抗积分饱和效果对比（限幅 ±${uLimit}）`, left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["无限幅（理想）", "有限幅（无抗饱和）", "有限幅（有抗饱和）"] },
    xAxis: {
      type: "value" as const,
      name: "Time (s)",
      min: 0,
      max: 5,
    },
    yAxis: {
      type: "value" as const,
      name: "y(t)",
      min: 0,
      max: 2,
    },
    series: [
      {
        name: "无限幅（理想）",
        type: "line" as const,
        data: data.t.map((t, i) => [t, data.yIdeal[i]]),
        lineStyle: { width: 2, color: "#3b82f6" },
        symbol: "none",
      },
      {
        name: "有限幅（无抗饱和）",
        type: "line" as const,
        data: data.t.map((t, i) => [t, data.ySat[i]]),
        lineStyle: { type: "dashed" as const, color: "#e74c3c" },
        symbol: "none",
      },
      {
        name: "有限幅（有抗饱和）",
        type: "line" as const,
        data: data.t.map((t, i) => [t, data.yAw[i]]),
        lineStyle: { width: 2, color: "#2ecc71" },
        symbol: "none",
      },
      {
        name: "稳态值",
        type: "line" as const,
        data: [[0, 1], [5, 1]],
        lineStyle: { type: "dotted" as const, color: "#999" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [data, uLimit]);
  
  const controlOption = useMemo(() => ({
    title: { text: "控制器输出（限幅）", left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["无抗饱和", "有抗饱和"] },
    xAxis: {
      type: "value" as const,
      name: "Time (s)",
      min: 0,
      max: 5,
    },
    yAxis: {
      type: "value" as const,
      name: "u(t)",
      min: -6,
      max: 6,
    },
    series: [
      {
        name: "无抗饱和",
        type: "line" as const,
        data: data.t.map((t, i) => [t, data.uSat[i]]),
        lineStyle: { type: "dashed" as const, color: "#e74c3c" },
        symbol: "none",
      },
      {
        name: "有抗饱和",
        type: "line" as const,
        data: data.t.map((t, i) => [t, data.uAw[i]]),
        lineStyle: { width: 2, color: "#2ecc71" },
        symbol: "none",
      },
      {
        name: `限幅 ±${uLimit}`,
        type: "line" as const,
        data: [[0, uLimit], [5, uLimit]],
        lineStyle: { type: "dotted" as const, color: "#999" },
        symbol: "none",
      },
      {
        name: `限幅 ±${uLimit}`,
        type: "line" as const,
        data: [[0, -uLimit], [5, -uLimit]],
        lineStyle: { type: "dotted" as const, color: "#999" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [data, uLimit]);
  
  const responseChartRef = useECharts(responseOption);
  const controlChartRef = useECharts(controlOption);
  
  return (
    <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
        <label style={{ fontSize: "14px" }}>限幅:</label>
        <input
          type="range"
          min={0.5}
          max={5.0}
          step={0.1}
          value={uLimit}
          onChange={(e) => setULimit(parseFloat(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: "14px", minWidth: "50px" }}>{uLimit.toFixed(1)}</span>
      </div>
      
      <div ref={responseChartRef} style={{ height: "350px" }} />
      <div ref={controlChartRef} style={{ height: "350px" }} />
      
      <div style={{ padding: "10px", background: "#f5f5f5", borderRadius: "4px" }}>
        <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}>无抗饱和超调量: {data.maxOvershootSat}%</p>
        <p style={{ margin: 0, fontSize: "14px" }}>有抗饱和超调量: {data.maxOvershootAw}%</p>
      </div>
    </div>
  );
}
