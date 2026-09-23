"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

function computeBodeData(wn: number): [number[], number[]] {
  const zeta = 0.5;
  const omega: number[] = [];
  const magDb: number[] = [];
  
  for (let i = 0; i <= 200; i++) {
    const w = Math.pow(10, -1 + (i / 200) * 3); // 0.1 to 100 rad/s
    const denomReal = 1 - (w / wn) ** 2;
    const denomImag = 2 * zeta * (w / wn);
    const mag = 1 / Math.sqrt(denomReal ** 2 + denomImag ** 2);
    
    omega.push(w);
    magDb.push(20 * Math.log10(mag));
  }
  
  return [omega, magDb];
}

function computeStepResponse(wn: number): [number[], number[]] {
  const zeta = 0.5;
  const tEnd = 3;
  const numPoints = 300;
  const t: number[] = [];
  const y: number[] = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const time = (i / numPoints) * tEnd;
    const wd = wn * Math.sqrt(1 - zeta ** 2);
    const response = 1 - (Math.exp(-zeta * wn * time) / Math.sqrt(1 - zeta ** 2)) * 
                     Math.sin(wd * time + Math.acos(zeta));
    t.push(time);
    y.push(response);
  }
  
  return [t, y];
}

export function BandwidthCorrespondenceExplorer() {
  const [wn, setWn] = useState(10.0);

  const [omega, magDb] = useMemo(() => computeBodeData(wn), [wn]);
  const [t, y] = useMemo(() => computeStepResponse(wn), [wn]);

  // Find bandwidth (-3 dB point)
  const bandwidth = useMemo(() => {
    for (let i = 0; i < magDb.length; i++) {
      if (magDb[i] < -3) {
        return omega[i];
      }
    }
    return omega[omega.length - 1];
  }, [omega, magDb]);

  const option: EChartsOption = useMemo(() => ({
    animation: false,
    grid: [{ left: 70, right: 30, top: 60, bottom: 80 }, { left: 70, right: 30, top: 320, bottom: 40 }],
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
        type: "value", 
        name: "Time (s)",
        min: 0,
        max: 3,
        nameLocation: "center",
        nameGap: 25,
        gridIndex: 1
      }
    ],
    yAxis: [
      { 
        type: "value", 
        name: "Magnitude (dB)", 
        min: -40, 
        max: 10,
        gridIndex: 0
      },
      { 
        type: "value", 
        name: "y(t)", 
        min: 0, 
        max: 1.2,
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
          data: [{ xAxis: bandwidth }],
          lineStyle: { color: "gray", type: "dotted" },
          label: { formatter: `ωB={c.toFixed(1)}`, position: "insideStartTop" }
        }
      },
      {
        type: "line",
        data: t.map((time, i) => [time, y[i]]),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: "#2ecc71" },
        xAxisIndex: 1,
        yAxisIndex: 1,
        markLine: {
          data: [{ yAxis: 1.0 }],
          lineStyle: { color: "gray", type: "dashed" }
        }
      }
    ],
    title: [
      {
        text: "Bode Magnitude",
        left: "center",
        top: 10,
        textStyle: { fontSize: 14, fontWeight: 500 }
      },
      {
        text: `Step Response (ωn=${wn.toFixed(1)} rad/s)`,
        left: "center",
        top: 270,
        textStyle: { fontSize: 14, fontWeight: 500 }
      }
    ]
  }), [omega, magDb, t, y, wn, bandwidth]);

  const chartRef = useECharts(option);

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "inline-block", width: 80, fontWeight: 500 }}>
          ωn (rad/s):
        </label>
        <input
          type="range"
          min={2.0}
          max={50.0}
          step={1.0}
          value={wn}
          onChange={(e) => setWn(parseFloat(e.target.value))}
          style={{ width: 300, verticalAlign: "middle" }}
        />
        <span style={{ marginLeft: 12, fontVariantNumeric: "tabular-nums" }}>
          {wn.toFixed(1)}
        </span>
      </div>
      <div ref={chartRef} style={{ width: "100%", height: 550 }} />
    </div>
  );
}
