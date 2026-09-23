"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

export function PoleZeroExplorer() {
  const [zeta, setZeta] = useState(0.3);
  const [wn, setWn] = useState(5.0);

  const { poles, arcData, dampingLabel, angleDeg } = useMemo(() => {
    const poleList: [number, number][] = [];
    const arc: [number, number][] = [];
    let angle = 0;

    if (zeta < 1) {
      const wd = wn * Math.sqrt(1 - zeta * zeta);
      poleList.push([-zeta * wn, wd]);
      poleList.push([-zeta * wn, -wd]);
      angle = Math.acos(zeta) * 180 / Math.PI;

      const pts = 200;
      for (let i = 0; i <= pts; i++) {
        const theta = (2 * Math.PI * i) / pts;
        arc.push([wn * Math.cos(theta), wn * Math.sin(theta)]);
      }
    } else if (Math.abs(zeta - 1) < 0.02) {
      poleList.push([-wn, 0]);
      poleList.push([-wn, 0]);
    } else {
      const sq = wn * Math.sqrt(zeta * zeta - 1);
      poleList.push([-zeta * wn + sq, 0]);
      poleList.push([-zeta * wn - sq, 0]);
    }

    if (zeta < 1) {
      const label = `欠阻尼 (振荡衰减 e^(${(-zeta * wn).toFixed(1)}t))`;
      return { poles: poleList, arcData: arc, dampingLabel: label, angleDeg: angle };
    } else if (Math.abs(zeta - 1) < 0.02) {
      return { poles: poleList, arcData: arc, dampingLabel: "临界阻尼", angleDeg: 0 };
    } else {
      return { poles: poleList, arcData: arc, dampingLabel: "过阻尼 (无振荡)", angleDeg: 0 };
    }
  }, [zeta, wn]);

  // Fixed axis ranges for stable coordinate system (Fix-002)
  const X_RANGE = 30;  // Covers ωn max (15) * 2 with margin
  const Y_RANGE = 22;  // Covers ωn max (15) * 1.5 with margin

  const option: EChartsOption = useMemo(() => ({
    animation: false,
    grid: { left: 60, right: 30, top: 50, bottom: 50 },
    xAxis: {
      type: "value",
      name: "Re(s)",
      min: -X_RANGE,
      max: X_RANGE,
      nameLocation: "center",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: "Im(s)",
      min: -Y_RANGE,
      max: Y_RANGE,
    },
    series: [
      {
        type: "scatter",
        data: poles,
        symbol: "x",
        symbolSize: 16,
        itemStyle: { color: "#ef4444" },
        z: 10,
        name: "极点",
      },
      ...(zeta < 1
        ? [
            {
              type: "line" as const,
              data: arcData,
              smooth: true,
              showSymbol: false,
              lineStyle: { width: 1.5, color: "#3b82f6", type: "dashed" as const, opacity: 0.4 },
              name: `ωn=${wn.toFixed(1)} 圆弧`,
            },
          ]
        : []),
      {
        type: "line" as const,
        data: [] as [number, number][],
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { color: "#333", width: 0.8 },
          data: [
            { xAxis: 0 },
            { yAxis: 0 },
          ],
          label: { show: false },
        },
      },
    ],
    title: {
      text: `ζ=${zeta.toFixed(2)}, ωn=${wn.toFixed(1)} → ${dampingLabel}`,
      left: "center",
      textStyle: { fontSize: 13, fontWeight: 500, color: "#333" },
    },
    ...(zeta < 1 && angleDeg > 0
      ? {
          graphic: [
            {
              type: "text",
              left: "35%",
              top: "35%",
              style: {
                text: `θ=${angleDeg.toFixed(0)}°`,
                fontSize: 12,
                fill: "#16a34a",
              },
            },
          ],
        }
      : {}),
  }), [poles, arcData, zeta, wn, dampingLabel, angleDeg]);

  const chartRef = useECharts(option);

  return (
    <div style={s.wrapper}>
      <div ref={chartRef} style={s.chart} />

      <div style={s.controls}>
        <div style={s.sliderRow}>
          <label style={s.label}>ζ 阻尼比</label>
          <input
            type="range"
            min={0.0}
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
            min={1.0}
            max={15.0}
            step={0.5}
            value={wn}
            onChange={(e) => setWn(parseFloat(e.target.value))}
            style={s.slider}
          />
          <span style={s.value}>{wn.toFixed(1)}</span>
        </div>

        <div style={s.infoGrid}>
          <div style={s.infoItem}>
            <span style={s.infoLabel}>阻尼状态</span>
            <span style={{
              ...s.infoValue,
              color: zeta < 1 ? "#16a34a" : Math.abs(zeta - 1) < 0.02 ? "#2563eb" : "#ef4444",
            }}>{dampingLabel}</span>
          </div>
          {zeta < 1 && (
            <>
              <div style={s.infoItem}>
                <span style={s.infoLabel}>极点</span>
                <span style={s.infoValue}>
                  {(-zeta * wn).toFixed(1)} ± j{(wn * Math.sqrt(1 - zeta * zeta)).toFixed(1)}
                </span>
              </div>
              <div style={s.infoItem}>
                <span style={s.infoLabel}>角度 θ</span>
                <span style={s.infoValue}>{angleDeg.toFixed(0)}°</span>
              </div>
            </>
          )}
          {Math.abs(zeta - 1) < 0.02 && (
            <div style={s.infoItem}>
              <span style={s.infoLabel}>重根极点</span>
              <span style={s.infoValue}>{(-wn).toFixed(1)}</span>
            </div>
          )}
          {zeta > 1.02 && (
            <div style={s.infoItem}>
              <span style={s.infoLabel}>实极点</span>
              <span style={s.infoValue}>
                {(-zeta * wn + wn * Math.sqrt(zeta * zeta - 1)).toFixed(1)}, {(-zeta * wn - wn * Math.sqrt(zeta * zeta - 1)).toFixed(1)}
              </span>
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
  chart: { width: "100%", height: 380 },
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
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  infoItem: { display: "flex", flexDirection: "column", gap: 4 },
  infoLabel: { fontSize: 12, color: "#6b7280" },
  infoValue: { fontSize: 14, fontWeight: 600, color: "#1f2937", fontFamily: "monospace" },
};
