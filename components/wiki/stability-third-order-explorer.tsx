"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

export function StabilityThirdOrderExplorer() {
  const [a2, setA2] = useState(3.0);
  
  const data = useMemo(() => {
    const a3 = 1.0;
    const a1Range: number[] = [];
    for (let i = 0; i <= 100; i++) {
      a1Range.push(i * 0.1);
    }
    
    const stableRegion: [number, number][] = [];
    const boundaryLine: [number, number][] = [];
    
    a1Range.forEach((a1) => {
      const a0Critical = (a1 * a2) / a3;
      boundaryLine.push([a1, a0Critical]);
      
      for (let a0 = 0; a0 <= 10; a0 += 0.2) {
        const isStable = (a1 * a2 > a0 * a3) && (a1 > 0) && (a0 > 0);
        if (isStable) {
          stableRegion.push([a1, a0]);
        }
      }
    });
    
    const pendulumData: [number, number, boolean][] = [];
    for (let kd = 0; kd <= 10; kd += 0.2) {
      for (let kp = 0; kp <= 20; kp += 0.4) {
        const isStable = (kd > 0) && (kp > 9.8);
        pendulumData.push([kd, kp, isStable]);
      }
    }
    
    return {
      a1Range,
      boundaryLine,
      stableRegion,
      pendulumData,
      boundaryValue: (5 * a2 / a3).toFixed(1),
    };
  }, [a2]);
  
  const leftOption = useMemo(() => ({
    title: { text: `三阶系统稳定域 (a2=${a2.toFixed(1)}, a3=1)`, left: "center" },
    tooltip: { trigger: "axis" as const },
    xAxis: {
      type: "value" as const,
      name: "a1",
      min: 0,
      max: 10,
    },
    yAxis: {
      type: "value" as const,
      name: "a0",
      min: 0,
      max: 10,
    },
    series: [
      {
        name: "稳定边界",
        type: "line" as const,
        data: data.boundaryLine,
        lineStyle: { width: 2, color: "#e74c3c" },
        symbol: "none",
      },
      {
        name: "稳定区域",
        type: "scatter" as const,
        data: data.stableRegion,
        symbolSize: 2,
        itemStyle: { color: "#2ecc71", opacity: 0.3 },
      },
    ],
    animation: false,
  }), [data, a2]);
  
  const rightOption = useMemo(() => ({
    title: { text: "倒立摆 PD 控制稳定域", left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["Kp = 9.8"] },
    xAxis: {
      type: "value" as const,
      name: "Kd",
      min: 0,
      max: 10,
    },
    yAxis: {
      type: "value" as const,
      name: "Kp",
      min: 0,
      max: 20,
    },
    series: [
      {
        name: "稳定区域",
        type: "scatter" as const,
        data: data.pendulumData.filter((item) => item[2]).map(([kd, kp]) => [kd, kp]),
        symbolSize: 2,
        itemStyle: { color: "#2ecc71", opacity: 0.3 },
      },
      {
        name: "Kp = 9.8",
        type: "line" as const,
        data: [[0, 9.8], [10, 9.8]],
        lineStyle: { type: "dashed" as const, color: "#e74c3c", width: 2 },
        symbol: "none",
      },
    ],
    animation: false,
  }), [data]);
  
  const leftChartRef = useECharts(leftOption);
  const rightChartRef = useECharts(rightOption);
  
  return (
    <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
        <label style={{ fontSize: "14px" }}>a2:</label>
        <input
          type="range"
          min={0.5}
          max={10.0}
          step={0.5}
          value={a2}
          onChange={(e) => setA2(parseFloat(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: "14px", minWidth: "50px" }}>{a2.toFixed(1)}</span>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div ref={leftChartRef} style={{ height: "400px" }} />
        <div ref={rightChartRef} style={{ height: "400px" }} />
      </div>
      
      <div style={{ padding: "10px", background: "#f5f5f5", borderRadius: "4px" }}>
        <p style={{ margin: 0, fontSize: "14px" }}>
          稳定边界: a0 &lt; a1 × {a2.toFixed(1)} (当 a1=5 时, a0 &lt; {data.boundaryValue})
        </p>
      </div>
    </div>
  );
}
