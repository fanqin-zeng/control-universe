"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

function bodeAnalysis(K: number) {
  // Plant: G(s) = K / (s(s+5))
  // Lead compensator: D(s) = (αTs+1)/(Ts+1), α=6.5, T=0.0114
  const alphaLead = 6.5;
  const TLead = 0.0114;
  
  const wPoints: number[] = [];
  for (let i = 0; i <= 200; i++) {
    wPoints.push(Math.pow(10, -1 + (i * 4) / 200)); // logspace(-1, 3, 201)
  }
  
  const plantMag: number[] = [];
  const plantPhase: number[] = [];
  const leadMag: number[] = [];
  const leadPhase: number[] = [];
  
  for (const w of wPoints) {
    // Plant: K/(jω(jω+5))
    const denom = { re: -w * w, im: 5 * w };
    const magPlant = K / Math.sqrt(denom.re * denom.re + denom.im * denom.im);
    const phasePlant = -Math.atan2(denom.im, denom.re) * 180 / Math.PI;
    
    plantMag.push(20 * Math.log10(magPlant));
    plantPhase.push(phasePlant);
    
    // Lead: (αTjω+1)/(Tjω+1)
    const numLead = { re: 1, im: alphaLead * TLead * w };
    const denLead = { re: 1, im: TLead * w };
    const magLead = Math.sqrt(numLead.re * numLead.re + numLead.im * numLead.im) / 
                    Math.sqrt(denLead.re * denLead.re + denLead.im * denLead.im);
    const phaseLead = (Math.atan2(numLead.im, numLead.re) - Math.atan2(denLead.im, denLead.re)) * 180 / Math.PI;
    
    leadMag.push(20 * Math.log10(magPlant * magLead));
    leadPhase.push(phasePlant + phaseLead);
  }
  
  // Find crossover frequencies and margins (simplified)
  let wc0 = 0, pm0 = 0, wc1 = 0, pm1 = 0;
  for (let i = 1; i < wPoints.length; i++) {
    if (plantMag[i - 1] > 0 && plantMag[i] <= 0) {
      wc0 = wPoints[i];
      pm0 = 180 + plantPhase[i];
    }
    if (leadMag[i - 1] > 0 && leadMag[i] <= 0) {
      wc1 = wPoints[i];
      pm1 = 180 + leadPhase[i];
    }
  }
  
  return {
    w: wPoints,
    plantMag,
    plantPhase,
    leadMag,
    leadPhase,
    wc0,
    pm0,
    wc1,
    pm1,
  };
}

function stepResponse(K: number, withLead: boolean) {
  // Simplified second-order approximation
  
  // For plant K/(s^2+5s), closed-loop approx
  const wn = Math.sqrt(K);
  const zeta = 5 / (2 * wn);
  
  const t: number[] = [];
  const y: number[] = [];
  for (let i = 0; i <= 100; i++) {
    const ti = i * 0.01;
    t.push(ti);
    if (zeta < 1) {
      const wd = wn * Math.sqrt(1 - zeta * zeta);
      y.push(1 - Math.exp(-zeta * wn * ti) * (Math.cos(wd * ti) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * ti)));
    } else {
      y.push(1 - Math.exp(-wn * ti) * (1 + wn * ti));
    }
  }
  
  if (withLead) {
    // Lead improves damping
    const newZeta = Math.min(zeta * 1.5, 0.9);
    for (let i = 0; i <= 100; i++) {
      const ti = i * 0.01;
      const wd = wn * Math.sqrt(1 - newZeta * newZeta);
      y[i] = 1 - Math.exp(-newZeta * wn * ti) * (Math.cos(wd * ti) + (newZeta / Math.sqrt(1 - newZeta * newZeta)) * Math.sin(wd * ti));
    }
  }
  
  return { t, y };
}

export function LeadCompensatorExplorer() {
  const [K, setK] = useState(500);
  
  const bodeData = useMemo(() => bodeAnalysis(K), [K]);
  const stepNoLead = useMemo(() => stepResponse(K, false), [K]);
  const stepWithLead = useMemo(() => stepResponse(K, true), [K]);
  
  const maxOvershootNoLead = useMemo(() => {
    const maxVal = Math.max(...stepNoLead.y);
    return ((maxVal - 1) * 100).toFixed(0);
  }, [stepNoLead]);
  
  const maxOvershootWithLead = useMemo(() => {
    const maxVal = Math.max(...stepWithLead.y);
    return ((maxVal - 1) * 100).toFixed(0);
  }, [stepWithLead]);
  
  const magOption = useMemo(() => ({
    title: { text: "Bode 幅频", left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["未校正", "超前校正后"] },
    xAxis: {
      type: "log" as const,
      name: "ω (rad/s)",
      min: 0.1,
      max: 1000,
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
        data: bodeData.w.map((w, i) => [w, bodeData.plantMag[i]]),
        lineStyle: { type: "dashed" as const, color: "#3b82f6" },
        symbol: "none",
      },
      {
        name: "超前校正后",
        type: "line" as const,
        data: bodeData.w.map((w, i) => [w, bodeData.leadMag[i]]),
        lineStyle: { width: 2, color: "#e74c3c" },
        symbol: "none",
      },
      {
        name: "0 dB",
        type: "line" as const,
        data: [[0.1, 0], [1000, 0]],
        lineStyle: { type: "dotted" as const, color: "#999" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [bodeData]);
  
  const phaseOption = useMemo(() => ({
    title: { text: "Bode 相频", left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["未校正", "超前校正后"] },
    xAxis: {
      type: "log" as const,
      name: "ω (rad/s)",
      min: 0.1,
      max: 1000,
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
        data: bodeData.w.map((w, i) => [w, bodeData.plantPhase[i]]),
        lineStyle: { type: "dashed" as const, color: "#3b82f6" },
        symbol: "none",
      },
      {
        name: "超前校正后",
        type: "line" as const,
        data: bodeData.w.map((w, i) => [w, bodeData.leadPhase[i]]),
        lineStyle: { width: 2, color: "#e74c3c" },
        symbol: "none",
      },
      {
        name: "-180°",
        type: "line" as const,
        data: [[0.1, -180], [1000, -180]],
        lineStyle: { type: "dotted" as const, color: "#999" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [bodeData]);
  
  const stepOption = useMemo(() => ({
    title: { text: "阶跃响应对比", left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["未校正", "超前校正"] },
    xAxis: {
      type: "value" as const,
      name: "Time (s)",
      min: 0,
      max: 1,
    },
    yAxis: {
      type: "value" as const,
      name: "y(t)",
      min: 0,
      max: 2,
    },
    series: [
      {
        name: "未校正",
        type: "line" as const,
        data: stepNoLead.t.map((t, i) => [t, stepNoLead.y[i]]),
        lineStyle: { type: "dashed" as const, color: "#3b82f6" },
        symbol: "none",
      },
      {
        name: "超前校正",
        type: "line" as const,
        data: stepWithLead.t.map((t, i) => [t, stepWithLead.y[i]]),
        lineStyle: { width: 2, color: "#e74c3c" },
        symbol: "none",
      },
      {
        name: "稳态值",
        type: "line" as const,
        data: [[0, 1], [1, 1]],
        lineStyle: { type: "dotted" as const, color: "#999" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [stepNoLead, stepWithLead]);
  
  const magChartRef = useECharts(magOption);
  const phaseChartRef = useECharts(phaseOption);
  const stepChartRef = useECharts(stepOption);
  
  return (
    <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
        <label style={{ fontSize: "14px" }}>K:</label>
        <input
          type="range"
          min={100}
          max={1000}
          step={10}
          value={K}
          onChange={(e) => setK(parseFloat(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: "14px", minWidth: "50px" }}>{K}</span>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div ref={magChartRef} style={{ height: "300px" }} />
        <div ref={phaseChartRef} style={{ height: "300px" }} />
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
        <div ref={stepChartRef} style={{ height: "300px" }} />
        <div style={{ padding: "20px", background: "#f5f5f5", borderRadius: "4px" }}>
          <p style={{ margin: "0 0 10px 0", fontSize: "13px" }}>未校正: PM={bodeData.pm0.toFixed(1)}°, ωc={bodeData.wc0.toFixed(2)}</p>
          <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#e74c3c" }}>校正后: PM={bodeData.pm1.toFixed(1)}°, ωc={bodeData.wc1.toFixed(2)}</p>
          <p style={{ margin: 0, fontSize: "13px" }}>超调量: {maxOvershootNoLead}% → {maxOvershootWithLead}%</p>
        </div>
      </div>
    </div>
  );
}
