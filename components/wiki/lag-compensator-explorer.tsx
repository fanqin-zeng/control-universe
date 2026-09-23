"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

function lagBodeAnalysis(K: number) {
  // Plant: G(s) = K / (s(s+1)(s+2))
  // Lag compensator: D(s) = (βTs+1)/(Ts+1), β=0.0215, T=846
  const beta = 0.0215;
  const T = 846;
  
  const wPoints: number[] = [];
  for (let i = 0; i <= 200; i++) {
    wPoints.push(Math.pow(10, -3 + (i * 5) / 200)); // logspace(-3, 2, 201)
  }
  
  const plantMag: number[] = [];
  const plantPhase: number[] = [];
  const lagMag: number[] = [];
  const lagPhase: number[] = [];
  
  for (const w of wPoints) {
    // Plant: K/(jω(jω+1)(jω+2))
    const s1 = { re: 0, im: w };
    const s2 = { re: 1, im: w };
    const s3 = { re: 2, im: w };
    
    const magS1 = Math.sqrt(s1.re * s1.re + s1.im * s1.im);
    const magS2 = Math.sqrt(s2.re * s2.re + s2.im * s2.im);
    const magS3 = Math.sqrt(s3.re * s3.re + s3.im * s3.im);
    const phaseS1 = Math.atan2(s1.im, s1.re);
    const phaseS2 = Math.atan2(s2.im, s2.re);
    const phaseS3 = Math.atan2(s3.im, s3.re);
    
    const magPlant = K / (magS1 * magS2 * magS3);
    const phasePlant = -(phaseS1 + phaseS2 + phaseS3) * 180 / Math.PI;
    
    plantMag.push(20 * Math.log10(magPlant));
    plantPhase.push(phasePlant);
    
    // Lag: (βTjω+1)/(Tjω+1)
    const numLag = { re: 1, im: beta * T * w };
    const denLag = { re: 1, im: T * w };
    const magLag = Math.sqrt(numLag.re * numLag.re + numLag.im * numLag.im) / 
                   Math.sqrt(denLag.re * denLag.re + denLag.im * denLag.im);
    const phaseLag = (Math.atan2(numLag.im, numLag.re) - Math.atan2(denLag.im, denLag.re)) * 180 / Math.PI;
    
    lagMag.push(20 * Math.log10(magPlant * magLag));
    lagPhase.push(phasePlant + phaseLag);
  }
  
  let wc0 = 0, pm0 = 0, wc1 = 0, pm1 = 0;
  for (let i = 1; i < wPoints.length; i++) {
    if (plantMag[i - 1] > 0 && plantMag[i] <= 0) {
      wc0 = wPoints[i];
      pm0 = 180 + plantPhase[i];
    }
    if (lagMag[i - 1] > 0 && lagMag[i] <= 0) {
      wc1 = wPoints[i];
      pm1 = 180 + lagPhase[i];
    }
  }
  
  return {
    w: wPoints,
    plantMag,
    plantPhase,
    lagMag,
    lagPhase,
    wc0,
    pm0,
    wc1,
    pm1,
  };
}

export function LagCompensatorExplorer() {
  const [K, setK] = useState(60);
  
  const data = useMemo(() => lagBodeAnalysis(K), [K]);
  
  const magOption = useMemo(() => ({
    title: { text: `滞后校正：Bode 幅频 (K=${K})`, left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["未校正", "滞后校正后"] },
    xAxis: {
      type: "log" as const,
      name: "ω (rad/s)",
      min: 0.001,
      max: 100,
    },
    yAxis: {
      type: "value" as const,
      name: "幅值 (dB)",
      min: -60,
      max: 60,
    },
    series: [
      {
        name: "未校正",
        type: "line" as const,
        data: data.w.map((w, i) => [w, data.plantMag[i]]),
        lineStyle: { type: "dashed" as const, color: "#3b82f6" },
        symbol: "none",
      },
      {
        name: "滞后校正后",
        type: "line" as const,
        data: data.w.map((w, i) => [w, data.lagMag[i]]),
        lineStyle: { width: 2, color: "#2ecc71" },
        symbol: "none",
      },
      {
        name: "0 dB",
        type: "line" as const,
        data: [[0.001, 0], [100, 0]],
        lineStyle: { type: "dotted" as const, color: "#999" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [data, K]);
  
  const phaseOption = useMemo(() => ({
    title: { text: "Bode 相频", left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["未校正", "滞后校正后"] },
    xAxis: {
      type: "log" as const,
      name: "ω (rad/s)",
      min: 0.001,
      max: 100,
    },
    yAxis: {
      type: "value" as const,
      name: "相位 (°)",
      min: -270,
      max: 0,
    },
    series: [
      {
        name: "未校正",
        type: "line" as const,
        data: data.w.map((w, i) => [w, data.plantPhase[i]]),
        lineStyle: { type: "dashed" as const, color: "#3b82f6" },
        symbol: "none",
      },
      {
        name: "滞后校正后",
        type: "line" as const,
        data: data.w.map((w, i) => [w, data.lagPhase[i]]),
        lineStyle: { width: 2, color: "#2ecc71" },
        symbol: "none",
      },
      {
        name: "-180°",
        type: "line" as const,
        data: [[0.001, -180], [100, -180]],
        lineStyle: { type: "dotted" as const, color: "#999" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [data]);
  
  const magChartRef = useECharts(magOption);
  const phaseChartRef = useECharts(phaseOption);
  
  return (
    <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
        <label style={{ fontSize: "14px" }}>K:</label>
        <input
          type="range"
          min={10}
          max={200}
          step={1}
          value={K}
          onChange={(e) => setK(parseFloat(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: "14px", minWidth: "50px" }}>{K}</span>
      </div>
      
      <div ref={magChartRef} style={{ height: "300px" }} />
      <div ref={phaseChartRef} style={{ height: "300px" }} />
      
      <div style={{ padding: "10px", background: "#f5f5f5", borderRadius: "4px" }}>
        <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}>未校正: PM={data.pm0.toFixed(1)}°, ωc={data.wc0.toFixed(2)} rad/s</p>
        <p style={{ margin: 0, fontSize: "14px" }}>校正后: PM={data.pm1.toFixed(1)}°, ωc={data.wc1.toFixed(2)} rad/s</p>
      </div>
    </div>
  );
}
