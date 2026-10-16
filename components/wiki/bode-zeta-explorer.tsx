"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

const WN = 10.0;

function computeBodeData(zeta: number): [number[], number[], number[]] {
  const omega: number[] = [];
  const magDb: number[] = [];
  const phaseDeg: number[] = [];
  
  for (let i = 0; i <= 200; i++) {
    const w = Math.pow(10, -1 + (i / 200) * 3); // 0.1 to 100 rad/s
    const denomReal = 1 - (w / WN) ** 2;
    const denomImag = 2 * zeta * (w / WN);
    const mag = 1 / Math.sqrt(denomReal ** 2 + denomImag ** 2);
    const phase = -Math.atan2(denomImag, denomReal);
    
    omega.push(w);
    magDb.push(20 * Math.log10(mag));
    phaseDeg.push(phase * 180 / Math.PI);
  }
  
  return [omega, magDb, phaseDeg];
}

export function BodeZetaExplorer() {
  const [zeta, setZeta] = useState(0.5);

  const [omega, magDb, phaseDeg] = useMemo(() => computeBodeData(zeta), [zeta]);

  const option: EChartsOption = useMemo(() => ({
    animation: false,
    grid: [{ left: 70, right: 30, top: 50, bottom: 60 }, { left: 70, right: 30, top: 320, bottom: 30 }],
    xAxis: [
      { 
        type: "log", 
        name: "Frequency (rad/s)", 
        min: 0.1, 
        max: 100,
        nameLocation: "center",
        nameGap: 30,
        gridIndex: 0
      },
      { 
        type: "log", 
        min: 0.1, 
        max: 100,
        gridIndex: 1
      }
    ],
    yAxis: [
      { 
        type: "value", 
        name: "Magnitude (dB)", 
        min: -60, 
        max: 20,
        gridIndex: 0
      },
      { 
        type: "value", 
        name: "Phase (deg)", 
        min: -180, 
        max: 0,
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
        yAxisIndex: 0
      },
      {
        type: "line",
        data: omega.map((w, i) => [w, phaseDeg[i]]),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: "#2ecc71" },
        xAxisIndex: 1,
        yAxisIndex: 1
      }
    ],
    title: {
      text: `Bode Plot (ζ=${zeta.toFixed(2)}, ωn=${WN} rad/s)`,
      left: "center",
      top: 10,
      textStyle: { fontSize: 14, fontWeight: 500 }
    }
  }), [omega, magDb, phaseDeg, zeta]);

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
