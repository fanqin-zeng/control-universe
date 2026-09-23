"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

function leadLagAnalysis(K: number) {
  // Plant: G(s) = K / (s(s+1)(s+10)) = K/(s^3+11s^2+10s)
  // Lead-lag: D(s) = (αT1s+1)(βT2s+1)/((T1s+1)(T2s+1)), α=5, T1=0.05, β=0.1, T2=10
  const alpha = 5.0;
  const T1 = 0.05;
  const beta = 0.1;
  const T2 = 10.0;
  
  const wPoints: number[] = [];
  for (let i = 0; i <= 200; i++) {
    wPoints.push(Math.pow(10, -2 + (i * 5) / 200)); // logspace(-2, 3, 201)
  }
  
  const plantMag: number[] = [];
  const plantPhase: number[] = [];
  const llMag: number[] = [];
  const llPhase: number[] = [];
  
  for (const w of wPoints) {
    // Plant: K/(jω(jω+1)(jω+10))
    const s1 = { re: 0, im: w };
    const s2 = { re: 1, im: w };
    const s3 = { re: 10, im: w };
    
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
    
    // Lead-lag compensator
    const numLead = { re: 1, im: alpha * T1 * w };
    const denLead = { re: 1, im: T1 * w };
    const numLag = { re: 1, im: beta * T2 * w };
    const denLag = { re: 1, im: T2 * w };
    
    const magLL = (Math.sqrt(numLead.re * numLead.re + numLead.im * numLead.im) / 
                   Math.sqrt(denLead.re * denLead.re + denLead.im * denLead.im)) *
                  (Math.sqrt(numLag.re * numLag.re + numLag.im * numLag.im) / 
                   Math.sqrt(denLag.re * denLag.re + denLag.im * denLag.im));
    const phaseLL = ((Math.atan2(numLead.im, numLead.re) - Math.atan2(denLead.im, denLead.re)) +
                     (Math.atan2(numLag.im, numLag.re) - Math.atan2(denLag.im, denLag.re))) * 180 / Math.PI;
    
    llMag.push(20 * Math.log10(magPlant * magLL));
    llPhase.push(phasePlant + phaseLL);
  }
  
  let wc0 = 0, pm0 = 0, wc1 = 0, pm1 = 0;
  for (let i = 1; i < wPoints.length; i++) {
    if (plantMag[i - 1] > 0 && plantMag[i] <= 0) {
      wc0 = wPoints[i];
      pm0 = 180 + plantPhase[i];
    }
    if (llMag[i - 1] > 0 && llMag[i] <= 0) {
      wc1 = wPoints[i];
      pm1 = 180 + llPhase[i];
    }
  }
  
  return {
    w: wPoints,
    plantMag,
    plantPhase,
    llMag,
    llPhase,
    wc0,
    pm0,
    wc1,
    pm1,
    kv: K / 10,
  };
}

function stepResponseLL(K: number, withCompensator: boolean) {
  // Simplified third-order approximation
  const wn = Math.cbrt(K); // cube root for third order
  const zeta = withCompensator ? 0.6 : 0.3;
  
  const t: number[] = [];
  const y: number[] = [];
  for (let i = 0; i <= 200; i++) {
    const ti = i * 0.025;
    t.push(ti);
    if (zeta < 1) {
      const wd = wn * Math.sqrt(1 - zeta * zeta);
      y.push(1 - Math.exp(-zeta * wn * ti) * (Math.cos(wd * ti) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * ti)));
    } else {
      y.push(1 - Math.exp(-wn * ti) * (1 + wn * ti + 0.5 * wn * wn * ti * ti));
    }
  }
  
  return { t, y };
}

export function LeadLagCompensatorExplorer() {
  const [K, setK] = useState(1000);
  
  const data = useMemo(() => leadLagAnalysis(K), [K]);
  const stepNoComp = useMemo(() => stepResponseLL(K, false), [K]);
  const stepWithComp = useMemo(() => stepResponseLL(K, true), [K]);
  
  const maxOvershootNoComp = useMemo(() => {
    const maxVal = Math.max(...stepNoComp.y);
    return ((maxVal - 1) * 100).toFixed(0);
  }, [stepNoComp]);
  
  const maxOvershootWithComp = useMemo(() => {
    const maxVal = Math.max(...stepWithComp.y);
    return ((maxVal - 1) * 100).toFixed(0);
  }, [stepWithComp]);
  
  const magOption = useMemo(() => ({
    title: { text: `Bode 幅频 (K=${K})`, left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["未校正", "校正后"] },
    xAxis: {
      type: "log" as const,
      name: "ω (rad/s)",
      min: 0.01,
      max: 1000,
    },
    yAxis: {
      type: "value" as const,
      name: "幅值 (dB)",
      min: -80,
      max: 80,
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
        name: "校正后",
        type: "line" as const,
        data: data.w.map((w, i) => [w, data.llMag[i]]),
        lineStyle: { width: 2, color: "#9b59b6" },
        symbol: "none",
      },
      {
        name: "0 dB",
        type: "line" as const,
        data: [[0.01, 0], [1000, 0]],
        lineStyle: { type: "dotted" as const, color: "#999" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [data, K]);
  
  const phaseOption = useMemo(() => ({
    title: { text: "Bode 相频", left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["未校正", "校正后"] },
    xAxis: {
      type: "log" as const,
      name: "ω (rad/s)",
      min: 0.01,
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
        data: data.w.map((w, i) => [w, data.plantPhase[i]]),
        lineStyle: { type: "dashed" as const, color: "#3b82f6" },
        symbol: "none",
      },
      {
        name: "校正后",
        type: "line" as const,
        data: data.w.map((w, i) => [w, data.llPhase[i]]),
        lineStyle: { width: 2, color: "#9b59b6" },
        symbol: "none",
      },
      {
        name: "-180°",
        type: "line" as const,
        data: [[0.01, -180], [1000, -180]],
        lineStyle: { type: "dotted" as const, color: "#999" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [data]);
  
  const stepOption = useMemo(() => ({
    title: { text: "阶跃响应对比", left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["未校正", "校正后"] },
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
        name: "未校正",
        type: "line" as const,
        data: stepNoComp.t.map((t, i) => [t, stepNoComp.y[i]]),
        lineStyle: { type: "dashed" as const, color: "#3b82f6" },
        symbol: "none",
      },
      {
        name: "校正后",
        type: "line" as const,
        data: stepWithComp.t.map((t, i) => [t, stepWithComp.y[i]]),
        lineStyle: { width: 2, color: "#9b59b6" },
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
  }), [stepNoComp, stepWithComp]);
  
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
          max={2000}
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
          <p style={{ margin: "0 0 10px 0", fontSize: "13px" }}>未校正: PM={data.pm0.toFixed(1)}°, Kv={data.kv.toFixed(0)}</p>
          <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#9b59b6" }}>校正后: PM={data.pm1.toFixed(1)}°, ωc={data.wc1.toFixed(2)}</p>
          <p style={{ margin: 0, fontSize: "13px" }}>超调量: {maxOvershootNoComp}% → {maxOvershootWithComp}%</p>
        </div>
      </div>
    </div>
  );
}
