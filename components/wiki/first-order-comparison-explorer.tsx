"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

const NUM_POINTS = 400;
const T_NORM_END = 5;

export function FirstOrderComparisonExplorer() {
  const [tauRc, setTauRc] = useState(1.0);
  const [tauTherm, setTauTherm] = useState(1125);

  const { rcCurve, thermCurve } = useMemo(() => {
    const dt = T_NORM_END / NUM_POINTS;
    const rc: [number, number][] = [];
    const therm: [number, number][] = [];
    for (let i = 0; i <= NUM_POINTS; i++) {
      const tn = i * dt;
      const y = 1 - Math.exp(-tn);
      rc.push([tn, y]);
      therm.push([tn, y]);
    }
    return { rcCurve: rc, thermCurve: therm };
  }, []);

  const option: EChartsOption = useMemo(() => ({
    animation: false,
    grid: { left: 60, right: 30, top: 50, bottom: 50 },
    legend: {
      data: [
        `RC电路 (τ=${tauRc.toFixed(1)}s)`,
        `热冷却 (τ=${tauTherm}s)`,
      ],
      top: 5,
      textStyle: { fontSize: 11 },
    },
    xAxis: {
      type: "value",
      name: "归一化时间 t/τ",
      min: 0,
      max: T_NORM_END,
      nameLocation: "center",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: "归一化响应",
      min: 0,
      max: 1.1,
    },
    series: [
      {
        name: `RC电路 (τ=${tauRc.toFixed(1)}s)`,
        type: "line",
        data: rcCurve,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2.5, color: "#3b82f6" },
      },
      {
        name: `热冷却 (τ=${tauTherm}s)`,
        type: "line",
        data: thermCurve,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2.5, color: "#ef4444", type: "dashed" },
      },
    ],
    title: {
      text: "跨领域类比：一阶系统的统一行为",
      left: "center",
      textStyle: { fontSize: 14, fontWeight: 500, color: "#333" },
    },
  }), [rcCurve, thermCurve, tauRc, tauTherm]);

  const chartRef = useECharts(option);

  return (
    <div style={s.wrapper}>
      <div ref={chartRef} style={s.chart} />

      <div style={s.controls}>
        <div style={s.sliderRow}>
          <label style={s.label}>τ_RC (s)</label>
          <input
            type="range"
            min={0.1}
            max={5.0}
            step={0.1}
            value={tauRc}
            onChange={(e) => setTauRc(parseFloat(e.target.value))}
            style={s.slider}
          />
          <span style={s.value}>{tauRc.toFixed(1)}</span>
        </div>
        <div style={s.sliderRow}>
          <label style={s.label}>τ_热 (s)</label>
          <input
            type="range"
            min={100}
            max={3000}
            step={50}
            value={tauTherm}
            onChange={(e) => setTauTherm(parseInt(e.target.value))}
            style={s.slider}
          />
          <span style={s.value}>{tauTherm}</span>
        </div>

        <div style={s.note}>
          两条曲线在归一化时间轴上完全重合——这说明不同物理领域的一阶系统具有完全相同的归一化动态行为。差异只在于时间尺度（τ 的值不同）。
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
    minWidth: 80,
  },
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
    lineHeight: 1.6,
    padding: "8px 12px",
    background: "#f0f9ff",
    borderRadius: 4,
    borderLeft: "3px solid #3b82f6",
  },
};
