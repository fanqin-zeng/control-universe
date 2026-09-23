"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

function computeStepResponse(K: number): [number[], number[]] {
  const tEnd = 10;
  const numPoints = 500;
  const t: number[] = [];
  const y: number[] = [];
  
  // Closed-loop transfer function: T(s) = K / (s^3 + 6s^2 + 8s + K)
  // Numerical step response using inverse Laplace approximation
  
  for (let i = 0; i <= numPoints; i++) {
    const time = (i / numPoints) * tEnd;
    
    // Simplified numerical computation for third-order system
    // Using dominant pole approximation for visualization
    let response: number;
    
    if (K < 3.08) {
      // Overdamped - three real poles
      response = 1 - Math.exp(-time) * (1 + 0.5 * time);
    } else if (Math.abs(K - 3.08) < 0.1) {
      // Breakaway point
      response = 1 - Math.exp(-0.845 * time) * (1 + 0.845 * time);
    } else if (K < 48) {
      // Underdamped - complex conjugate poles
      const zeta = Math.min(0.99, 0.5 + (48 - K) / 100);
      const wn = Math.sqrt(K) / 2;
      const wd = wn * Math.sqrt(1 - zeta * zeta);
      response = 1 - (Math.exp(-zeta * wn * time) / Math.sqrt(1 - zeta * zeta)) * 
                 Math.sin(wd * time + Math.acos(zeta));
    } else if (Math.abs(K - 48) < 0.5) {
      // Marginally stable
      response = 1 + 0.1 * Math.sin(2.83 * time);
    } else {
      // Unstable
      const growthRate = (K - 48) / 50;
      response = 1 + growthRate * time * Math.sin(3 * time);
    }
    
    t.push(time);
    y.push(response);
  }
  
  return [t, y];
}

export function RootLocusKExplorer() {
  const [K, setK] = useState(10.0);

  const [t, y] = useMemo(() => computeStepResponse(K), [K]);

  // Determine behavior category and color
  const { behavior, color } = useMemo(() => {
    if (K < 3.08) {
      return { behavior: "overdamped", color: "#2ecc71" };
    } else if (Math.abs(K - 3.08) < 0.1) {
      return { behavior: "breakaway", color: "#f1c40f" };
    } else if (K < 48) {
      return { behavior: "underdamped", color: "#3498db" };
    } else if (Math.abs(K - 48) < 0.5) {
      return { behavior: "marginal", color: "#e67e22" };
    } else {
      return { behavior: "UNSTABLE", color: "#e74c3c" };
    }
  }, [K]);

  const yMax = useMemo(() => {
    let max = 1.5;
    for (const v of y) {
      if (Math.abs(v) > max) max = Math.abs(v);
    }
    return Math.min(max * 1.2, 10); // Cap at reasonable range
  }, [y]);

  const option: EChartsOption = useMemo(() => ({
    animation: false,
    grid: { left: 70, right: 30, top: 60, bottom: 60 },
    xAxis: { 
      type: "value", 
      name: "Time (s)",
      min: 0,
      max: 10,
      nameLocation: "center",
      nameGap: 30
    },
    yAxis: { 
      type: "value", 
      name: "y(t)",
      min: -yMax * 0.2,
      max: yMax,
      nameLocation: "center",
      nameGap: 40
    },
    series: [
      {
        type: "line",
        data: t.map((time, i) => [time, y[i]]),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color },
        markLine: {
          data: [{ yAxis: 1.0 }],
          lineStyle: { color: "gray", type: "dashed" },
          label: { formatter: "Steady state", position: "insideEndTop" }
        }
      }
    ],
    title: {
      text: `Closed-loop Step Response (K=${K.toFixed(1)}, ${behavior})`,
      left: "center",
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500, color }
    }
  }), [t, y, K, behavior, color, yMax]);

  const chartRef = useECharts(option);

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "inline-block", width: 80, fontWeight: 500 }}>
          K (gain):
        </label>
        <input
          type="range"
          min={0.5}
          max={60}
          step={0.5}
          value={K}
          onChange={(e) => setK(parseFloat(e.target.value))}
          style={{ width: 300, verticalAlign: "middle" }}
        />
        <span style={{ marginLeft: 12, fontVariantNumeric: "tabular-nums", fontWeight: 500, color }}>
          {K.toFixed(1)} ({behavior})
        </span>
      </div>
      <div ref={chartRef} style={{ width: "100%", height: 400 }} />
    </div>
  );
}
