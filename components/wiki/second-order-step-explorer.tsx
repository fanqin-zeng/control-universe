"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

const T_END = 15;
const NUM_POINTS = 1500;

export function SecondOrderStepExplorer() {
  const [zeta, setZeta] = useState(0.5);
  const [wn, setWn] = useState(2.0);

  const curveData = useMemo(() => {
    const dt = T_END / NUM_POINTS;
    const points: [number, number][] = [];

    for (let i = 0; i <= NUM_POINTS; i++) {
      const t = i * dt;
      let y: number;

      if (zeta === 0) {
        y = 1 - Math.cos(wn * t);
      } else if (zeta < 1) {
        const wd = wn * Math.sqrt(1 - zeta * zeta);
        const phi = Math.acos(zeta);
        y = 1 - (Math.exp(-zeta * wn * t) / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t + phi);
      } else if (zeta === 1) {
        y = 1 - (1 + wn * t) * Math.exp(-wn * t);
      } else {
        const sq = Math.sqrt(zeta * zeta - 1);
        const s1 = wn * (-zeta + sq);
        const s2 = wn * (-zeta - sq);
        const e1 = Math.exp(s1 * t);
        const e2 = Math.exp(s2 * t);
        y = 1 + (s1 * e1 - s2 * e2) / (s2 - s1) + (e2 - e1) / (s2 - s1);
      }

      points.push([t, y]);
    }
    return points;
  }, [zeta, wn]);

  const isUnderdamped = zeta > 0 && zeta < 1;
  const wd = isUnderdamped ? wn * Math.sqrt(1 - zeta * zeta) : null;
  const tp = wd ? Math.PI / wd : null;
  const Mp = isUnderdamped ? Math.exp(-Math.PI * zeta / Math.sqrt(1 - zeta * zeta)) * 100 : 0;
  const ts = isUnderdamped ? 4 / (zeta * wn) : null;

  const dampingLabel = zeta === 0 ? "无阻尼" : zeta < 1 ? "欠阻尼" : zeta === 1 ? "临界阻尼" : "过阻尼";
  const dampingColor = zeta === 0 ? "#f59e0b" : zeta < 1 ? "#2ecc71" : zeta === 1 ? "#3498db" : "#e74c3c";

  const yMax = zeta === 0 ? 2.2 : zeta < 0.3 ? 1.8 : 1.5;

  const option: EChartsOption = useMemo(() => {
    const markData: EChartsOption[] = [];
    void markData;

    const seriesMarkPoint = isUnderdamped && tp !== null
      ? {
          data: [
            {
              name: "Peak",
              coord: [tp, 1 + Mp / 100] as [number, number],
              symbol: "circle",
              symbolSize: 10,
              itemStyle: { color: "#ef4444" },
              label: {
                show: true,
                formatter: `Mp = ${Mp.toFixed(1)}%`,
                fontSize: 11,
                color: "#ef4444",
              },
            },
          ],
        }
      : undefined;

    const markLineData: Array<{ yAxis?: number; xAxis?: number; lineStyle?: Record<string, unknown>; label?: Record<string, unknown> }> = [
      {
        yAxis: 1.0,
        lineStyle: { type: "dashed" as const, color: "#6b7280", width: 1 },
        label: { show: false },
      },
    ];

    if (isUnderdamped && tp !== null) {
      markLineData.push({
        xAxis: tp,
        lineStyle: { color: "#ef4444", width: 2, type: "solid" as const },
        label: { show: true, formatter: `tp=${tp.toFixed(2)}s`, position: "start", fontSize: 10, color: "#ef4444" },
      });
    }

    if (ts !== null) {
      markLineData.push({
        xAxis: ts,
        lineStyle: { color: "#8b5cf6", width: 2, type: "solid" as const },
        label: { show: true, formatter: `ts=${ts.toFixed(2)}s`, position: "start", fontSize: 10, color: "#8b5cf6" },
      });
    }

    return {
      animation: false,
      grid: { left: 60, right: 30, top: 50, bottom: 50 },
      xAxis: {
        type: "value",
        name: "t (s)",
        min: 0,
        max: T_END,
        nameLocation: "center",
        nameGap: 30,
      },
      yAxis: {
        type: "value",
        name: "y(t)",
        min: 0,
        max: yMax,
      },
      series: [
        {
          type: "line",
          data: curveData,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2.5, color: "#3b82f6" },
          markLine: {
            silent: true,
            symbol: "none",
            data: markLineData,
          },
          markPoint: seriesMarkPoint,
          markArea: ts !== null
            ? {
                silent: true,
                data: [
                  [
                    { yAxis: 0.98, itemStyle: { color: "rgba(16,185,129,0.08)" } },
                    { yAxis: 1.02 },
                  ],
                ],
              }
            : undefined,
        },
      ],
      title: {
        text: `二阶系统阶跃响应  ζ=${zeta.toFixed(2)} (${dampingLabel}), ωn=${wn.toFixed(1)} rad/s`,
        left: "center",
        textStyle: { fontSize: 13, fontWeight: 500, color: "#333" },
      },
    };
  }, [curveData, zeta, wn, dampingLabel, yMax, isUnderdamped, tp, Mp, ts]);

  const chartRef = useECharts(option);

  return (
    <div style={s.wrapper}>
      <div ref={chartRef} style={s.chart} />

      <div style={s.controls}>
        <div style={s.sliderRow}>
          <label style={s.label}>ζ 阻尼比</label>
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.05}
            value={zeta}
            onChange={(e) => setZeta(parseFloat(e.target.value))}
            style={s.slider}
          />
          <span style={s.value}>{zeta.toFixed(2)}</span>
        </div>
        <div style={s.sliderRow}>
          <label style={s.label}>ωn 自然频率</label>
          <input
            type="range"
            min={1.0}
            max={5.0}
            step={0.1}
            value={wn}
            onChange={(e) => setWn(parseFloat(e.target.value))}
            style={s.slider}
          />
          <span style={s.value}>{wn.toFixed(1)}</span>
        </div>

        <div style={s.infoGrid}>
          <div style={s.infoItem}>
            <span style={s.infoLabel}>阻尼状态</span>
            <span style={{ ...s.infoValue, color: dampingColor }}>{dampingLabel}</span>
          </div>
          {isUnderdamped ? (
            <>
              <div style={s.infoItem}>
                <span style={s.infoLabel}>ωd</span>
                <span style={s.infoValue}>{wd!.toFixed(2)} rad/s</span>
              </div>
              <div style={s.infoItem}>
                <span style={s.infoLabel}>tp</span>
                <span style={s.infoValue}>{tp!.toFixed(2)} s</span>
              </div>
              <div style={s.infoItem}>
                <span style={s.infoLabel}>Mp</span>
                <span style={s.infoValue}>{Mp.toFixed(1)}%</span>
              </div>
              <div style={s.infoItem}>
                <span style={s.infoLabel}>ts (2%)</span>
                <span style={s.infoValue}>{ts!.toFixed(2)} s</span>
              </div>
            </>
          ) : (
            <div style={s.infoItem}>
              <span style={s.infoLabel}>特性</span>
              <span style={s.infoValue}>无超调，无振荡</span>
            </div>
          )}
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
    height: 340,
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
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    minWidth: 100,
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
    marginTop: 4,
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
