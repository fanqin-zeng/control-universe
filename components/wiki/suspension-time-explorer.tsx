"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

const M = 250.0;
const K = 16000.0;
const WN = Math.sqrt(K / M);
const T_END = 3;
const NUM_POINTS = 600;

export function SuspensionTimeExplorer() {
  const [zeta, setZeta] = useState(0.5);

  const curveData = useMemo(() => {
    const dt = T_END / NUM_POINTS;
    const points: [number, number][] = [];

    for (let i = 0; i <= NUM_POINTS; i++) {
      const t = i * dt;
      let y: number;

      if (zeta < 1) {
        const wd = WN * Math.sqrt(1 - zeta * zeta);
        const phi = Math.atan2(Math.sqrt(1 - zeta * zeta), zeta);
        const sigma = zeta * WN;
        const yStd = 1 - (Math.exp(-sigma * t) / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t + phi);
        const yZero = (zeta / Math.sqrt(1 - zeta * zeta)) * Math.exp(-sigma * t) * Math.sin(wd * t);
        y = yStd + yZero;
      } else {
        const s1 = -zeta * WN + WN * Math.sqrt(zeta * zeta - 1);
        const s2 = -zeta * WN - WN * Math.sqrt(zeta * zeta - 1);
        const A = s2 / (s2 - s1);
        const B = -s1 / (s2 - s1);
        const yStd = 1 - A * Math.exp(s1 * t) - B * Math.exp(s2 * t);
        const yZero = (K / (M * (s2 - s1))) * ((Math.exp(s1 * t) - Math.exp(s2 * t)));
        y = yStd + yZero;
      }

      points.push([t, y]);
    }
    return points;
  }, [zeta]);

  const c = 2 * zeta * WN * M;

  let scheme: string;
  let schemeColor: string;
  if (zeta < 0.5) {
    scheme = "偏软";
    schemeColor = "#f59e0b";
  } else if (zeta < 0.8) {
    scheme = "最优";
    schemeColor = "#2ecc71";
  } else if (zeta < 1) {
    scheme = "偏硬";
    schemeColor = "#3498db";
  } else {
    scheme = "临界阻尼";
    schemeColor = "#e74c3c";
  }

  const peakY = useMemo(() => {
    let max = 0;
    for (const [, v] of curveData) {
      if (v > max) max = v;
    }
    return max;
  }, [curveData]);
  const actualMp = (peakY - 1.0) * 100;
  const tsApprox = 4 / (zeta * WN);

  // Fixed y-axis range for stable coordinate system (Fix-002)
  const Y_MAX = 1.8;

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
      min: 0,
      max: Y_MAX,
    },
    series: [
      {
        type: "line",
        data: curveData,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2.5, color: schemeColor },
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { type: "dashed", color: "#999", width: 1 },
          data: [{ yAxis: 1.0, label: { show: false } }],
        },
      },
    ],
    title: {
      text: `悬挂系统阶跃响应 (ζ=${zeta.toFixed(2)}, ωn=${WN.toFixed(1)} rad/s)`,
      left: "center",
      textStyle: { fontSize: 13, fontWeight: 500, color: "#333" },
    },
  }), [curveData, schemeColor, zeta]);

  const chartRef = useECharts(option);

  return (
    <div style={s.wrapper}>
      <div ref={chartRef} style={s.chart} />

      <div style={s.controls}>
        <div style={s.sliderRow}>
          <label style={s.label}>阻尼比 ζ</label>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.05}
            value={zeta}
            onChange={(e) => setZeta(parseFloat(e.target.value))}
            style={s.slider}
          />
          <span style={s.value}>{zeta.toFixed(2)}</span>
        </div>

        <div style={s.infoGrid}>
          <div style={s.infoItem}>
            <span style={s.infoLabel}>阻尼方案</span>
            <span style={{ ...s.infoValue, color: schemeColor }}>{scheme}</span>
          </div>
          <div style={s.infoItem}>
            <span style={s.infoLabel}>阻尼系数 c</span>
            <span style={s.infoValue}>{c.toFixed(0)} N·s/m</span>
          </div>
          <div style={s.infoItem}>
            <span style={s.infoLabel}>实际超调量</span>
            <span style={s.infoValue}>{actualMp.toFixed(1)}%</span>
          </div>
          <div style={s.infoItem}>
            <span style={s.infoLabel}>调节时间 ts</span>
            <span style={s.infoValue}>~{tsApprox.toFixed(2)}s</span>
          </div>
        </div>

        <div style={s.note}>
          注意：由于传递函数存在零点 s = -k/c，实际超调量大于标准二阶公式预测值
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
  note: {
    marginTop: 12,
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
    lineHeight: 1.5,
  },
};
