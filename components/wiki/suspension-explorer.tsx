"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

const M = 250.0;
const K = 16000.0;
const WN = Math.sqrt(K / M);
const T_END = 3;
const NUM_POINTS = 300;

export function SuspensionExplorer() {
  const [zeta, setZeta] = useState(0.3);

  const c = 2 * zeta * WN * M;

  const curveData = useMemo(() => {
    const dt = T_END / NUM_POINTS;
    const wd = WN * Math.sqrt(Math.abs(1 - zeta * zeta));
    const phi = Math.atan2(Math.sqrt(1 - zeta * zeta), zeta);

    const points: [number, number][] = [];
    for (let i = 0; i <= NUM_POINTS; i++) {
      const t = i * dt;
      let y: number;
      if (zeta < 1) {
        y = 1 - (Math.exp(-zeta * WN * t) / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t + phi);
      } else if (zeta === 1) {
        y = 1 - (1 + WN * t) * Math.exp(-WN * t);
      } else {
        const s1 = -zeta * WN + WN * Math.sqrt(zeta * zeta - 1);
        const s2 = -zeta * WN - WN * Math.sqrt(zeta * zeta - 1);
        const A = s2 / (s2 - s1);
        const B = -s1 / (s2 - s1);
        y = 1 - A * Math.exp(s1 * t) - B * Math.exp(s2 * t);
      }
      points.push([t, y]);
    }
    return points;
  }, [zeta]);

  const dampingLabel = zeta < 1 ? "欠阻尼" : zeta === 1 ? "临界阻尼" : "过阻尼";
  const dampingColor = zeta < 1 ? "#2ecc71" : zeta === 1 ? "#3498db" : "#e74c3c";

  const option: EChartsOption = useMemo(() => ({
    animation: false,
    grid: { left: 60, right: 30, top: 40, bottom: 50 },
    xAxis: {
      type: "value",
      name: "时间 (s)",
      min: 0,
      max: T_END,
      nameLocation: "center",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: "位移 y(t)",
      min: 0,
      max: 1.5,
    },
    series: [
      {
        type: "line",
        data: curveData,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 3, color: dampingColor },
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { type: "dashed", color: "#999", width: 1 },
          data: [{ yAxis: 1.0 }],
          label: { show: false },
        },
      },
    ],
    title: {
      text: `悬挂系统阶跃响应`,
      left: "center",
      textStyle: { fontSize: 14, fontWeight: 500, color: "#333" },
    },
  }), [curveData, dampingColor]);

  const chartRef = useECharts(option);

  return (
    <div style={s.wrapper}>
      <div ref={chartRef} style={s.chart} />

      <div style={s.controls}>
        <div style={s.sliderRow}>
          <label style={s.label}>阻尼比 ζ</label>
          <input
            type="range"
            min={0.05}
            max={2.0}
            step={0.05}
            value={zeta}
            onChange={(e) => setZeta(parseFloat(e.target.value))}
            style={s.slider}
          />
          <span style={s.value}>{zeta.toFixed(2)}</span>
        </div>

        <div style={s.infoGrid}>
          <div style={s.infoItem}>
            <span style={s.infoLabel}>阻尼状态</span>
            <span style={{ ...s.infoValue, color: dampingColor }}>{dampingLabel}</span>
          </div>
          <div style={s.infoItem}>
            <span style={s.infoLabel}>阻尼系数 c</span>
            <span style={s.infoValue}>{c.toFixed(0)} N·s/m</span>
          </div>
          <div style={s.infoItem}>
            <span style={s.infoLabel}>质量 m</span>
            <span style={s.infoValue}>{M} kg</span>
          </div>
          <div style={s.infoItem}>
            <span style={s.infoLabel}>刚度 k</span>
            <span style={s.infoValue}>{K} N/m</span>
          </div>
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
  chart: {
    width: "100%",
    height: 320,
  },
  controls: {
    marginTop: 16,
    padding: 16,
    background: "#fff",
    borderRadius: 6,
    border: "1px solid #e5e7eb",
  },
  sliderRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    minWidth: 80,
  },
  slider: {
    flex: 1,
    height: 6,
    cursor: "pointer",
  },
  value: {
    fontSize: 14,
    fontWeight: 600,
    color: "#2563eb",
    minWidth: 50,
    textAlign: "right" as const,
    fontFamily: "monospace",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1f2937",
    fontFamily: "monospace",
  },
};
