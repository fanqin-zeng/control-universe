"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

function computeRCBodeData(R: number, C: number): [number[], number[], number[]] {
  const omega: number[] = [];
  const magDb: number[] = [];
  const phaseDeg: number[] = [];
  
  for (let i = 0; i <= 200; i++) {
    const w = Math.pow(10, -1 + (i / 200) * 4); // 0.1 to 1000 rad/s
    const tau = R * C;
    const mag = 1 / Math.sqrt(1 + (w * tau) ** 2);
    const phase = -Math.atan(w * tau);
    
    omega.push(w);
    magDb.push(20 * Math.log10(mag));
    phaseDeg.push(phase * 180 / Math.PI);
  }
  
  return [omega, magDb, phaseDeg];
}

export function RCFilterBodeExplorer() {
  const [R, setR] = useState(1000);
  const [C, setC] = useState(1e-6);

  const [omega, magDb, phaseDeg] = useMemo(() => computeRCBodeData(R, C), [R, C]);
  
  const cutoffFreq = useMemo(() => 1 / (R * C), [R, C]);

  const option: EChartsOption = useMemo(() => ({
    animation: false,
    grid: [{ left: 70, right: 30, top: 70, bottom: 80 }, { left: 70, right: 30, top: 340, bottom: 50 }],
    xAxis: [
      { 
        type: "log", 
        name: "Frequency (rad/s)", 
        min: 0.1, 
        max: 1000,
        nameLocation: "center",
        nameGap: 30,
        gridIndex: 0
      },
      { 
        type: "log", 
        min: 0.1, 
        max: 1000,
        gridIndex: 1
      }
    ],
    yAxis: [
      { 
        type: "value", 
        name: "Magnitude (dB)", 
        min: -40, 
        max: 5,
        gridIndex: 0
      },
      { 
        type: "value", 
        name: "Phase (deg)", 
        min: -90, 
        max: 10,
        gridIndex: 1
      }
    ],
    series: [
      {
        type: "line",
        data: omega.map((w, i) => [w, magDb[i]]),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: "#2ecc71" },
        xAxisIndex: 0,
        yAxisIndex: 0,
        markLine: {
          data: [{ xAxis: cutoffFreq }],
          lineStyle: { color: "gray", type: "dotted" },
          label: { formatter: `fc={cutoffFreq.toFixed(0)} Hz`, position: "insideStartTop" }
        }
      },
      {
        type: "line",
        data: omega.map((w, i) => [w, phaseDeg[i]]),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: "#2ecc71" },
        xAxisIndex: 1,
        yAxisIndex: 1,
        markLine: {
          data: [{ xAxis: cutoffFreq }],
          lineStyle: { color: "gray", type: "dotted" }
        }
      }
    ],
    title: {
      text: `RC Low-Pass Filter Bode Plot (R=${(R/1000).toFixed(1)}kΩ, C=${(C*1e6).toFixed(1)}μF, fc=${cutoffFreq.toFixed(0)} Hz)`,
      left: "center",
      top: 10,
      textStyle: { fontSize: 13, fontWeight: 500 }
    }
  }), [omega, magDb, phaseDeg, R, C, cutoffFreq]);

  const chartRef = useECharts(option);

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: 16, display: "flex", gap: 24, alignItems: "center" }}>
        <div>
          <label style={{ display: "inline-block", width: 40, fontWeight: 500 }}>
            R (kΩ):
          </label>
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={R}
            onChange={(e) => setR(parseFloat(e.target.value))}
            style={{ width: 200, verticalAlign: "middle" }}
          />
          <span style={{ marginLeft: 8, fontVariantNumeric: "tabular-nums" }}>
            {(R/1000).toFixed(1)}
          </span>
        </div>
        <div>
          <label style={{ display: "inline-block", width: 40, fontWeight: 500 }}>
            C (μF):
          </label>
          <input
            type="range"
            min={0.1}
            max={10}
            step={0.1}
            value={C * 1e6}
            onChange={(e) => setC(parseFloat(e.target.value) * 1e-6)}
            style={{ width: 200, verticalAlign: "middle" }}
          />
          <span style={{ marginLeft: 8, fontVariantNumeric: "tabular-nums" }}>
            {(C*1e6).toFixed(1)}
          </span>
        </div>
      </div>
      <div ref={chartRef} style={{ width: "100%", height: 550 }} />
    </div>
  );
}
