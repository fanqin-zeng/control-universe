"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

const WN = 8.0;
const T_END = 3;
const NUM_POINTS = 500;

function computeImpulseResponse(zeta: number): [number, number][] {
  const dt = T_END / NUM_POINTS;
  const pts: [number, number][] = [];
  for (let i = 0; i <= NUM_POINTS; i++) {
    const t = i * dt;
    let y: number;
    if (zeta < 1) {
      const wd = WN * Math.sqrt(1 - zeta * zeta);
      y = (WN * WN / wd) * Math.exp(-zeta * WN * t) * Math.sin(wd * t);
    } else if (Math.abs(zeta - 1) < 0.01) {
      y = WN * WN * t * Math.exp(-WN * t);
    } else {
      const sq = WN * Math.sqrt(zeta * zeta - 1);
      const s1 = -zeta * WN + sq;
      const s2 = -zeta * WN - sq;
      y = (WN * WN / sq) * (Math.exp(s1 * t) - Math.exp(s2 * t));
    }
    pts.push([t, y]);
  }
  return pts;
}

export function ImpulseExplorer() {
  const [zeta, setZeta] = useState(0.5);

  const curveData = useMemo(() => computeImpulseResponse(zeta), [zeta]);

  // Fixed y-axis range for stable coordinate system (Fix-002)
  const Y_MAX = 10;

  const isUnderdamped = zeta < 1;
  const wd = isUnderdamped ? WN * Math.sqrt(1 - zeta * zeta) : 0;
  const dampingLabel = isUnderdamped
    ? `欠阻尼, ωd=${wd.toFixed(1)} rad/s`
    : Math.abs(zeta - 1) < 0.01
      ? "临界阻尼"
      : "过阻尼";
  const lineColor = zeta < 0.3 ? "#e74c3c" : isUnderdamped ? "#16a34a" : "#3b82f6";

  const option: EChartsOption = useMemo(() => ({
    animation: false,
    grid: { left: 60, right: 30, top: 50, bottom: 50 },
    xAxis: {
      type: "value",
      name: "Time (s)",
      min: 0,
      max: T_END,
      nameLocation: "center",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: "y(t)",
      min: -Y_MAX,
      max: Y_MAX,
    },
    series: [
      {
        type: "line",
        data: curveData,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2.5, color: lineColor },
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { type: "dashed", color: "#999", width: 1 },
          data: [{ yAxis: 0 }],
          label: { show: false },
        },
      },
    ],
    title: {
      text: `Impulse Response (ζ=${zeta.toFixed(2)}, ωn=${WN} rad/s)`,
      left: "center",
      textStyle: { fontSize: 14, fontWeight: 500, color: "#333" },
    },
    legend: {
      data: [`ζ=${zeta.toFixed(2)} (${dampingLabel})`],
      bottom: 5,
      textStyle: { fontSize: 11 },
    },
  }), [curveData, zeta, lineColor, dampingLabel]);

  const chartRef = useECharts(option);

  return (
    <div style={s.wrapper}>
      <div ref={chartRef} style={s.chart} />
      <div style={s.controls}>
        <div style={s.sliderRow}>
          <label style={s.label}>ζ 阻尼比</label>
          <input
            type="range"
            min={0.1}
            max={1.5}
            step={0.05}
            value={zeta}
            onChange={(e) => setZeta(parseFloat(e.target.value))}
            style={s.slider}
          />
          <span style={s.value}>{zeta.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrapper: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 16,
    margin: "20px 0",
    background: "#fafafa",
  },
  chart: { width: "100%", height: 320 },
  controls: {
    marginTop: 16,
    padding: 16,
    background: "#fff",
    borderRadius: 6,
    border: "1px solid #e5e7eb",
  },
  sliderRow: { display: "flex", alignItems: "center", gap: 12 },
  label: { fontSize: 14, fontWeight: 500, color: "#374151", minWidth: 80 },
  slider: { flex: 1, height: 6, cursor: "pointer" },
  value: {
    fontSize: 14,
    fontWeight: 600,
    color: "#2563eb",
    minWidth: 50,
    textAlign: "right" as const,
    fontFamily: "monospace",
  },
};
