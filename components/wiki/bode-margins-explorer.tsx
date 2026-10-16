"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

// Calculate Bode plot data for the system G(s) = K/(s(s+1)(s+10))
function calculateBodeData(K: number) {
  const wPoints: number[] = [];
  for (let i = 0; i <= 500; i++) {
    wPoints.push(Math.pow(10, -2 + (i * 5) / 500)); // logspace(-2, 3, 501)
  }

  const mag: number[] = [];
  const phase: number[] = [];

  for (const w of wPoints) {
    // G(jw) = K/(jw(jw+1)(jw+10))
    // Denominator: jw * (jw+1) * (jw+10) = jw * [(jw+1)(jw+10)] = jw * [j²w² + 10jw + jw + 10] = jw * [-w² + 11jw + 10]
    // = jw(-w² + 10) + jw(11jw) = jw(-w² + 10) - 11w²
    // = -11w² + jw(-w² + 10)
    const denomReal = -11 * w * w;
    const denomImag = w * (-w * w + 10);
    
    const denomMagnitude = Math.sqrt(denomReal * denomReal + denomImag * denomImag);
    const magVal = K / denomMagnitude;
    
    const magDb = 20 * Math.log10(magVal);
    mag.push(magDb);
    
    const phaseRad = Math.atan2(denomImag, denomReal);
    const phaseDeg = phaseRad * 180 / Math.PI;
    phase.push(phaseDeg);
  }

  // Calculate gain margin and phase margin
  let gmDb = Infinity;
  let pmDeg = 0;
  let wc = 0; // gain crossover frequency
  let wg = 0; // phase crossover frequency

  // Find gain crossover frequency (where magnitude crosses 0dB)
  for (let i = 0; i < mag.length - 1; i++) {
    if (mag[i] > 0 && mag[i + 1] <= 0) {
      // Linear interpolation to find exact crossing point
      const ratio = (0 - mag[i]) / (mag[i + 1] - mag[i]);
      wc = wPoints[i] + ratio * (wPoints[i + 1] - wPoints[i]);
      break;
    }
  }

  // Find phase crossover frequency (where phase crosses -180deg)
  for (let i = 0; i < phase.length - 1; i++) {
    if (phase[i] > -180 && phase[i + 1] <= -180) {
      // Linear interpolation to find exact crossing point
      const ratio = (-180 - phase[i]) / (phase[i + 1] - phase[i]);
      wg = wPoints[i] + ratio * (wPoints[i + 1] - wPoints[i]);
      break;
    }
  }

  // Calculate margins at the crossover frequencies
  if (wg > 0) {
    // Find magnitude at phase crossover frequency
    for (let i = 0; i < wPoints.length - 1; i++) {
      if (wPoints[i] <= wg && wPoints[i + 1] >= wg) {
        const ratio = (wg - wPoints[i]) / (wPoints[i + 1] - wPoints[i]);
        const magAtWg = mag[i] + ratio * (mag[i + 1] - mag[i]);
        gmDb = -magAtWg; // Gain margin is negative of magnitude at phase crossover
        break;
      }
    }
  }

  if (wc > 0) {
    // Find phase at gain crossover frequency
    for (let i = 0; i < wPoints.length - 1; i++) {
      if (wPoints[i] <= wc && wPoints[i + 1] >= wc) {
        const ratio = (wc - wPoints[i]) / (wPoints[i + 1] - wPoints[i]);
        const phaseAtWc = phase[i] + ratio * (phase[i + 1] - phase[i]);
        pmDeg = 180 + phaseAtWc; // Phase margin is 180 + phase at gain crossover
        break;
      }
    }
  }

  return {
    w: wPoints,
    mag,
    phase,
    gmDb,
    pmDeg,
    wc,
    wg
  };
}

export function BodeMarginsExplorer() {
  const [K, setK] = useState(10);

  const bodeData = useMemo(() => calculateBodeData(K), [K]);

  const magOption = useMemo(() => ({
    title: { text: `Bode 幅频图 (K=${K.toFixed(0)})`, left: "center" },
    tooltip: { trigger: "axis" as const },
    xAxis: {
      type: "log" as const,
      name: "ω (rad/s)",
      min: 0.01,
      max: 1000,
    },
    yAxis: {
      type: "value" as const,
      name: "幅值 (dB)",
    },
    series: [
      {
        type: "line" as const,
        data: bodeData.w.map((w, i) => [w, bodeData.mag[i]]),
        lineStyle: { width: 2, color: "#3b82f6" },
        symbol: "none",
      },
      {
        type: "line" as const,
        data: [[0.01, 0], [1000, 0]],
        lineStyle: { type: "dashed" as const, color: "#9ca3af" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [bodeData, K]);

  const phaseOption = useMemo(() => ({
    title: { text: `Bode 相频图 (K=${K.toFixed(0)})`, left: "center" },
    tooltip: { trigger: "axis" as const },
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
        type: "line" as const,
        data: bodeData.w.map((w, i) => [w, bodeData.phase[i]]),
        lineStyle: { width: 2, color: "#3b82f6" },
        symbol: "none",
      },
      {
        type: "line" as const,
        data: [[0.01, -180], [1000, -180]],
        lineStyle: { type: "dashed" as const, color: "#9ca3af" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [bodeData, K]);

  const magChartRef = useECharts(magOption);
  const phaseChartRef = useECharts(phaseOption);

  const status = bodeData.gmDb > 0 && bodeData.pmDeg > 0 ? '稳定' : '不稳定';

  return (
    <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
        <label style={{ fontSize: "14px" }}>K:</label>
        <input
          type="range"
          min={1}
          max={1000}
          step={1}
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
      
      <div style={{ padding: "10px", background: "#f5f5f5", borderRadius: "4px", fontSize: "14px" }}>
        K={K.toFixed(0)}: GM={bodeData.gmDb === Infinity ? '∞' : bodeData.gmDb.toFixed(1)} dB, 
        PM={bodeData.pmDeg.toFixed(1)}°, ωc={bodeData.wc.toFixed(2)} rad/s → {status}
      </div>
    </div>
  );
}