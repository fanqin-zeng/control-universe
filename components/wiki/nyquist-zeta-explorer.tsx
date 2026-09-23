"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

const WN = 10.0;

function computeNyquistData(zeta: number): [number[], number[]] {
  const re: number[] = [];
  const im: number[] = [];
  
  for (let i = 0; i <= 300; i++) {
    const w = Math.pow(10, -2 + (i / 300) * 4); // 0.01 to 100 rad/s
    const denomReal = 1 - (w / WN) ** 2;
    const denomImag = 2 * zeta * (w / WN);
    const mag = 1 / Math.sqrt(denomReal ** 2 + denomImag ** 2);
    const phase = -Math.atan2(denomImag, denomReal);
    
    re.push(mag * Math.cos(phase));
    im.push(mag * Math.sin(phase));
  }
  
  return [re, im];
}

export function NyquistZetaExplorer() {
  const [zeta, setZeta] = useState(0.3);

  const [re, im] = useMemo(() => computeNyquistData(zeta), [zeta]);

  const option: EChartsOption = useMemo(() => ({
    animation: false,
    grid: { left: 70, right: 50, top: 60, bottom: 60 },
    xAxis: { 
      type: "value", 
      name: "Re[G(jω)]",
      min: -0.5, 
      max: 1.2,
      nameLocation: "center",
      nameGap: 30
    },
    yAxis: { 
      type: "value", 
      name: "Im[G(jω)]",
      min: -1.2, 
      max: 0.5,
      nameLocation: "center",
      nameGap: 40
    },
    series: [
      {
        type: "line",
        data: re.map((r, i) => [r, im[i]]),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: "#2ecc71" }
      },
      {
        type: "scatter",
        data: [[-1, 0]],
        symbolSize: 15,
        itemStyle: { color: "red" },
        label: {
          show: true,
          formatter: "(-1, j0)",
          position: "right",
          fontSize: 11,
          color: "red"
        }
      }
    ],
    title: {
      text: `Nyquist Plot (ζ=${zeta.toFixed(2)}, ωn=${WN} rad/s)`,
      left: "center",
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 }
    }
  }), [re, im, zeta]);

  const chartRef = useECharts(option);

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "inline-block", width: 80, fontWeight: 500 }}>
          ζ (damping):
        </label>
        <input
          type="range"
          min={0.05}
          max={2.0}
          step={0.05}
          value={zeta}
          onChange={(e) => setZeta(parseFloat(e.target.value))}
          style={{ width: 300, verticalAlign: "middle" }}
        />
        <span style={{ marginLeft: 12, fontVariantNumeric: "tabular-nums" }}>
          {zeta.toFixed(2)}
        </span>
      </div>
      <div ref={chartRef} style={{ width: "100%", height: 500 }} />
    </div>
  );
}
