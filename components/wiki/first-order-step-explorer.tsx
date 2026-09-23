"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

const T_END = 30;
const NUM_POINTS = 500;

export function FirstOrderStepExplorer() {
  const [tau, setTau] = useState(1.0);

  const curveData = useMemo(() => {
    const dt = T_END / NUM_POINTS;
    const pts: [number, number][] = [];
    for (let i = 0; i <= NUM_POINTS; i++) {
      const t = i * dt;
      pts.push([t, 1 - Math.exp(-t / tau)]);
    }
    return pts;
  }, [tau]);

  const tr = 2.2 * tau;
  const ts2 = 4 * tau;
  const ts5 = 3 * tau;

  const option: EChartsOption = useMemo(() => ({
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
      max: 1.15,
    },
    series: [
      {
        type: "line",
        data: curveData,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2.5, color: "#3b82f6" },
        name: "y(t) = 1 − e^(−t/T)",
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { width: 1 },
          data: [
            { yAxis: 0.632, lineStyle: { color: "#f59e0b", type: "dashed" }, label: { formatter: "63.2%", position: "end", fontSize: 10 } },
            { yAxis: 0.95, lineStyle: { color: "#10b981", type: "dashed" }, label: { formatter: "95%", position: "end", fontSize: 10 } },
            { yAxis: 0.982, lineStyle: { color: "#8b5cf6", type: "dashed" }, label: { formatter: "98.2%", position: "end", fontSize: 10 } },
            { yAxis: 1.0, lineStyle: { color: "#6b7280", type: "dashed" }, label: { formatter: "稳态值", position: "end", fontSize: 10 } },
            { xAxis: tau, lineStyle: { color: "#f59e0b", width: 2 }, label: { formatter: `T=${tau.toFixed(1)}s`, position: "start", fontSize: 10 } },
            { xAxis: 3 * tau, lineStyle: { color: "#10b981", width: 2 }, label: { formatter: `3T=${(3 * tau).toFixed(1)}s`, position: "start", fontSize: 10 } },
            { xAxis: 4 * tau, lineStyle: { color: "#8b5cf6", width: 2 }, label: { formatter: `4T=${(4 * tau).toFixed(1)}s`, position: "start", fontSize: 10 } },
          ],
        },
      },
    ],
    title: {
      text: `一阶系统阶跃响应  T = ${tau.toFixed(1)}s`,
      left: "center",
      textStyle: { fontSize: 14, fontWeight: 500, color: "#333" },
    },
    graphic: [
      {
        type: "group",
        left: 70,
        top: 55,
        children: [
          {
            type: "rect",
            shape: { width: 240, height: 75, r: 4 },
            style: { fill: "wheat", opacity: 0.5 },
          },
          {
            type: "text",
            style: {
              text: [
                `时间常数 T = ${tau.toFixed(1)}s (t=T 时达到 63.2%)`,
                `上升时间 tr ≈ 2.2T = ${tr.toFixed(2)}s`,
                `调节时间 ts(5%) = 3T = ${ts5.toFixed(1)}s`,
                `调节时间 ts(2%) = 4T = ${ts2.toFixed(1)}s`,
              ].join("\n"),
              fontSize: 11,
              lineHeight: 16,
              fill: "#333",
            },
            left: 8,
            top: 6,
          },
        ],
      },
    ],
  }), [curveData, tau, tr, ts2, ts5]);

  const chartRef = useECharts(option);

  return (
    <div style={s.wrapper}>
      <div ref={chartRef} style={s.chart} />
      <div style={s.controls}>
        <div style={s.sliderRow}>
          <label style={s.label}>T 时间常数</label>
          <input
            type="range"
            min={0.2}
            max={5.0}
            step={0.1}
            value={tau}
            onChange={(e) => setTau(parseFloat(e.target.value))}
            style={s.slider}
          />
          <span style={s.value}>{tau.toFixed(1)}</span>
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
  chart: { width: "100%", height: 340 },
  controls: {
    marginTop: 16,
    padding: 16,
    background: "#fff",
    borderRadius: 6,
    border: "1px solid #e5e7eb",
  },
  sliderRow: { display: "flex", alignItems: "center", gap: 12 },
  label: { fontSize: 14, fontWeight: 500, color: "#374151", minWidth: 100 },
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
