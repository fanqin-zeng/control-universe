"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

const NUM_POINTS = 400;

function computeStepResponse(zeta: number, wn: number, tEnd: number): [number, number][] {
  const dt = tEnd / NUM_POINTS;
  const pts: [number, number][] = [];
  for (let i = 0; i <= NUM_POINTS; i++) {
    const t = i * dt;
    let y: number;
    if (zeta < 1) {
      const wd = wn * Math.sqrt(1 - zeta * zeta);
      const phi = Math.atan2(Math.sqrt(1 - zeta * zeta), zeta);
      y = 1 - (Math.exp(-zeta * wn * t) / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t + phi);
    } else if (Math.abs(zeta - 1) < 0.01) {
      y = 1 - (1 + wn * t) * Math.exp(-wn * t);
    } else {
      const sq = wn * Math.sqrt(zeta * zeta - 1);
      const s1 = -zeta * wn + sq;
      const s2 = -zeta * wn - sq;
      const A = s2 / (s2 - s1);
      const B = -s1 / (s2 - s1);
      y = 1 - A * Math.exp(s1 * t) - B * Math.exp(s2 * t);
    }
    pts.push([t, y]);
  }
  return pts;
}

function computeBodeMagnitude(zeta: number, wn: number): [number, number][] {
  const pts: [number, number][] = [];
  const wMin = 0.1;
  const wMax = 100;
  const logMin = Math.log10(wMin);
  const logMax = Math.log10(wMax);
  for (let i = 0; i <= NUM_POINTS; i++) {
    const logW = logMin + (logMax - logMin) * i / NUM_POINTS;
    const w = Math.pow(10, logW);
    const num = wn * wn;
    const re = wn * wn - w * w;
    const im = 2 * zeta * wn * w;
    const mag = num / Math.sqrt(re * re + im * im);
    const magDb = 20 * Math.log10(mag);
    pts.push([w, magDb]);
  }
  return pts;
}

export function StepBodeExplorer() {
  const [zeta, setZeta] = useState(0.5);
  const [wn, setWn] = useState(8.0);

  // Fixed time range for stable coordinate system (Fix-002)
  const T_END = 3;
  const stepData = useMemo(() => computeStepResponse(zeta, wn, T_END), [zeta, wn]);
  const bodeData = useMemo(() => computeBodeMagnitude(zeta, wn), [zeta, wn]);

  const option: EChartsOption = useMemo(() => ({
    animation: false,
    grid: [
      { left: 60, right: "52%", top: 50, bottom: 50 },
      { left: "55%", right: 30, top: 50, bottom: 50 },
    ],
    xAxis: [
      {
        type: "value",
        name: "时间 (s)",
        gridIndex: 0,
        min: 0,
        max: T_END,
        nameLocation: "center",
        nameGap: 30,
      },
      {
        type: "log",
        name: "ω (rad/s)",
        gridIndex: 1,
        min: 0.1,
        max: 100,
        nameLocation: "center",
        nameGap: 30,
      },
    ],
    yAxis: [
      { type: "value", name: "y(t)", gridIndex: 0, min: 0, max: 2.0 },
      { type: "value", name: "幅值 (dB)", gridIndex: 1, min: -40, max: 20 },
    ],
    series: [
      {
        type: "line",
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: stepData,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2.5, color: "#16a34a" },
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { type: "dashed", color: "#999", width: 1 },
          data: [{ yAxis: 1.0 }],
          label: { show: false },
        },
      },
      {
        type: "line",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: bodeData,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2.5, color: "#3b82f6" },
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { type: "dashed", color: "#999", width: 1 },
          data: [{ yAxis: 0 }],
          label: { show: false },
        },
      },
    ],
    title: [
      {
        text: `阶跃响应 (ζ=${zeta.toFixed(2)}, ωn=${wn.toFixed(1)})`,
        left: "20%",
        textStyle: { fontSize: 13, fontWeight: 500, color: "#333" },
      },
      {
        text: "Bode 幅频特性",
        left: "70%",
        textStyle: { fontSize: 13, fontWeight: 500, color: "#333" },
      },
    ],
  }), [stepData, bodeData, zeta, wn]);

  const chartRef = useECharts(option);

  return (
    <div style={s.wrapper}>
      <div ref={chartRef} style={s.chart} />

      <div style={s.controls}>
        <div style={s.sliderRow}>
          <label style={s.label}>ζ 阻尼比</label>
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
        <div style={s.sliderRow}>
          <label style={s.label}>ωn 自然频率</label>
          <input
            type="range"
            min={0.5}
            max={20.0}
            step={0.5}
            value={wn}
            onChange={(e) => setWn(parseFloat(e.target.value))}
            style={s.slider}
          />
          <span style={s.value}>{wn.toFixed(1)}</span>
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
  sliderRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
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
