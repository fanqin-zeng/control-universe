"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

/**
 * PID控制器 - 实际微分 vs 理想微分的频率响应对比
 * 
 * 物理意义：
 * - 理想微分：增益随频率线性增长，高频噪声被无限放大
 * - 实际微分：加入一阶低通滤波器，高频段增益被限制在 Kd/Tf
 * - Tf 越小，滤波效果越弱，接近理想微分；Tf 越大，高频抑制越强
 */

import { pidFilter } from "@/lib/pid-response";
function computeBodeData(kd: number, tf: number) {
 const a=pidFilter(kd,tf); return {omega:a.map(p=>p.w),idealMag:a.map(p=>p.ideal),idealPhase:a.map(()=>90),actualMag:a.map(p=>p.actual),actualPhase:a.map(p=>p.phase)};
}

export function PidDerivativeFilterExplorer() {
  const [tf, setTf] = useState(0.05);
  const Kd = 1.0;
  
  const data = useMemo(() => computeBodeData(Kd, tf), [tf]);
  
  const magOption = useMemo(() => ({
    title: { text: "幅频特性", left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["理想微分", `Tf=${tf.toFixed(3)} (当前)`] },
    xAxis: {
      type: "log" as const,
      name: "ω (rad/s)",
      min: 0.01,
      max: 1000,
    },
    yAxis: {
      type: "value" as const,
      name: "幅值 (dB)",
      min: -40,
      max: 60,
    },
    series: [
      {
        name: "理想微分",
        type: "line" as const,
        data: data.omega.map((w, i) => [w, data.idealMag[i]]),
        lineStyle: { type: "dashed" as const, color: "#999" },
        symbol: "none",
      },
      {
        name: `Tf=${tf.toFixed(3)} (当前)`,
        type: "line" as const,
        data: data.omega.map((w, i) => [w, data.actualMag[i]]),
        lineStyle: { width: 3, color: "#e74c3c" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [data, tf]);
  
  const phaseOption = useMemo(() => ({
    title: { text: "相频特性", left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["理想微分", `Tf=${tf.toFixed(3)} (当前)`] },
    xAxis: {
      type: "log" as const,
      name: "ω (rad/s)",
      min: 0.01,
      max: 1000,
    },
    yAxis: {
      type: "value" as const,
      name: "相位 (°)",
      min: 0,
      max: 120,
    },
    series: [
      {
        name: "理想微分",
        type: "line" as const,
        data: data.omega.map((w, i) => [w, data.idealPhase[i]]),
        lineStyle: { type: "dashed" as const, color: "#999" },
        symbol: "none",
      },
      {
        name: `Tf=${tf.toFixed(3)} (当前)`,
        type: "line" as const,
        data: data.omega.map((w, i) => [w, data.actualPhase[i]]),
        lineStyle: { width: 3, color: "#e74c3c" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [data, tf]);
  
  const highFreqGain = Kd / tf;
  const highFreqGainDb = 20 * Math.log10(highFreqGain);
  
  return (
    <div style={{ padding: "16px 0" }}>
      <button onClick={() => setTf(.05)}>恢复滤波默认</button>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 600, marginRight: 12 }}>
          Tf (滤波器时间常数):
        </label>
        <input
          aria-label="Tf 滤波时间常数"
          type="range"
          min={0.005}
          max={0.2}
          step={0.005}
          value={tf}
          onChange={(e) => setTf(parseFloat(e.target.value))}
          style={{ width: "min(100%, 300px)", verticalAlign: "middle" }}
        />
        <span style={{ marginLeft: 12, fontFamily: "monospace" }}>
          Tf = {tf.toFixed(3)} s
        </span>
      </div>
      
      <div style={{ 
        background: "#f8f9fa", 
        padding: 12, 
        borderRadius: 6, 
        marginBottom: 16,
        fontFamily: "monospace",
        fontSize: 14,
      }}>
        高频增益限制: Kd/Tf = {highFreqGain.toFixed(1)} ({highFreqGainDb.toFixed(1)} dB)
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 16 }}>
        <div style={{ height: 350 }}>
          <div ref={useECharts(magOption)} style={{ width: "100%", height: "100%" }} />
        </div>
        <div style={{ height: 350 }}>
          <div ref={useECharts(phaseOption)} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    </div>
  );
}
