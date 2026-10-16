"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

const WN = 8.0;
const T_END = 3;
const NUM_POINTS = 500;

function computeStepCurve(zeta: number): [number, number][] {
  const dt = T_END / NUM_POINTS;
  const pts: [number, number][] = [];
  for (let i = 0; i <= NUM_POINTS; i++) {
    const t = i * dt;
    let y: number;
    if (zeta < 1) {
      const wd = WN * Math.sqrt(1 - zeta * zeta);
      const phi = Math.atan2(Math.sqrt(1 - zeta * zeta), zeta);
      y = 1 - (Math.exp(-zeta * WN * t) / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t + phi);
    } else {
      y = 1 - (1 + WN * t) * Math.exp(-WN * t);
    }
    pts.push([t, y]);
  }
  return pts;
}

export function PerformanceMetricsExplorer() {
  const [zeta, setZeta] = useState(0.4);

  const curveData = useMemo(() => computeStepCurve(zeta), [zeta]);
  const isUnderdamped = zeta < 1;

  const metrics = useMemo(() => {
    if (!isUnderdamped) return null;
    const wd = WN * Math.sqrt(1 - zeta * zeta);
    const tp = Math.PI / wd;
    const Mp = Math.exp(-Math.PI * zeta / Math.sqrt(1 - zeta * zeta));
    const ts = 4 / (zeta * WN);
    const peakY = 1 + Mp;
    return { wd, tp, Mp, ts, peakY };
  }, [zeta, isUnderdamped]);

  const option: EChartsOption = useMemo(() => {
    const markData: Array<{
      xAxis?: number;
      yAxis?: number;
      lineStyle?: Record<string, unknown>;
      label?: Record<string, unknown>;
    }> = [{ yAxis: 1.0, lineStyle: { color: "#999", type: "dashed" }, label: { show: false } }];

    const markPoints: Array<[number, number]> = [];

    if (metrics) {
      markData.push(
        { xAxis: metrics.tp, lineStyle: { color: "#ef4444", type: "dotted", width: 1.5 }, label: { show: false } },
        { xAxis: metrics.ts, lineStyle: { color: "#8b5cf6", type: "dashed", width: 1.5 }, label: { formatter: `ts≈${metrics.ts.toFixed(2)}s`, position: "start", fontSize: 10 } },
      );
      markPoints.push([metrics.tp, metrics.peakY]);
    }

    return {
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
        max: isUnderdamped ? 1.6 : 1.2,
      },
      series: [
        {
          type: "line",
          data: curveData,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2.5, color: "#3b82f6" },
          name: "Step response",
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: { width: 1 },
            data: markData,
          },
          markPoint: metrics
            ? {
                data: [
                  {
                    name: "Peak",
                    coord: [metrics.tp, metrics.peakY],
                    symbol: "circle",
                    symbolSize: 12,
                    itemStyle: { color: "#ef4444" },
                    label: {
                      show: true,
                      formatter: `Mp = ${(metrics.Mp * 100).toFixed(1)}%`,
                      position: "top",
                      fontSize: 12,
                      color: "#ef4444",
                    },
                  },
                ],
              }
            : undefined,
          markArea: metrics
            ? {
                silent: true,
                data: [[
                  { yAxis: 0.98, itemStyle: { color: "rgba(16,185,129,0.08)" } },
                  { yAxis: 1.02 },
                ]],
              }
            : undefined,
        },
      ],
      title: {
        text: isUnderdamped
          ? `Performance Metrics (ζ=${zeta.toFixed(2)}, ωn=${WN} rad/s)`
          : `Step Response (ζ=${zeta.toFixed(2)}, ωn=${WN} rad/s)`,
        left: "center",
        textStyle: { fontSize: 14, fontWeight: 500, color: "#333" },
      },
      graphic: metrics
        ? [
            {
              type: "group",
              right: 40,
              top: 55,
              children: [
                {
                  type: "rect",
                  shape: { width: 200, height: 50, r: 4 },
                  style: { fill: "wheat", opacity: 0.5 },
                },
                {
                  type: "text",
                  style: {
                    text: `Theoretical: tp=${metrics.tp.toFixed(3)}s, Mp=${(metrics.Mp * 100).toFixed(1)}%\nts ≈ ${metrics.ts.toFixed(2)}s (2% band)`,
                    fontSize: 11,
                    lineHeight: 16,
                    fill: "#333",
                  },
                  left: 8,
                  top: 6,
                },
              ],
            },
          ]
        : [],
    };
  }, [curveData, zeta, isUnderdamped, metrics]);

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
            max={1.0}
            step={0.05}
            value={zeta}
            onChange={(e) => setZeta(parseFloat(e.target.value))}
            style={s.slider}
          />
          <span style={s.value}>{zeta.toFixed(2)}</span>
        </div>
        {!isUnderdamped && (
          <div style={s.note}>
            ζ ≥ 1（临界阻尼/过阻尼）：无超调，无峰值时间。
          </div>
        )}
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
  note: {
    marginTop: 8,
    fontSize: 13,
    color: "#6b7280",
    padding: "6px 12px",
    background: "#f0f9ff",
    borderRadius: 4,
    borderLeft: "3px solid #3b82f6",
  },
};
