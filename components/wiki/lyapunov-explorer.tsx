"use client";

import { useMemo, useState } from "react";
import { useECharts } from "./use-echarts";
import type { EChartsOption } from "echarts";

const AXIS_MIN = -4;
const AXIS_MAX = 4;

function pendulumDeriv(th: number, w: number, d: number): [number, number] {
  return [w, -Math.sin(th) - d * w];
}

function energy(th: number, w: number): number {
  return 0.5 * w * w + (1 - Math.cos(th));
}

function levelCurve(c: number): [number, number][] {
  if (c >= 2) return [];
  const thMax = Math.acos(1 - c);
  const N = 140;
  const upper: [number, number][] = [];
  const lower: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const th = -thMax + (2 * thMax * i) / N;
    const w = Math.sqrt(Math.max(0, 2 * (c - (1 - Math.cos(th)))));
    upper.push([th, w]);
    lower.push([th, -w]);
  }
  return upper.concat(lower.reverse());
}

function simulate(th0: number, w0: number, d: number): [number, number][] {
  const dt = 0.01;
  const steps = 6000;
  let th = th0;
  let w = w0;
  const pts: [number, number][] = [[th, w]];
  for (let i = 0; i < steps; i++) {
    const [k1t, k1w] = pendulumDeriv(th, w, d);
    const [k2t, k2w] = pendulumDeriv(th + 0.5 * dt * k1t, w + 0.5 * dt * k1w, d);
    const [k3t, k3w] = pendulumDeriv(th + 0.5 * dt * k2t, w + 0.5 * dt * k2w, d);
    const [k4t, k4w] = pendulumDeriv(th + dt * k3t, w + dt * k3w, d);
    th += (dt / 6) * (k1t + 2 * k2t + 2 * k3t + k4t);
    w += (dt / 6) * (k1w + 2 * k2w + 2 * k3w + k4w);
    if (i % 4 === 0) pts.push([th, w]);
    if (Math.abs(th) > 10 || Math.abs(w) > 10) break;
  }
  return pts;
}

export function LyapunovExplorer() {
  const [d, setD] = useState(0.3);
  const [th0, setTh0] = useState(2.0);
  const [w0, setW0] = useState(0.0);

  const option = useMemo<EChartsOption>(() => {
    const V0 = energy(th0, w0);
    const series: Record<string, unknown>[] = [0.25, 0.75, 1.5, 1.9].map(
      (c) => ({
        type: "line",
        name: `V=${c}`,
        showSymbol: false,
        lineStyle: { width: 1, color: "#cbd5e1" },
        data: levelCurve(c),
      })
    );

    if (V0 < 2) {
      series.push({
        type: "line",
        name: `V=V0=${V0.toFixed(2)}`,
        showSymbol: false,
        lineStyle: { width: 2, color: "#f59e0b", type: "dashed" },
        data: levelCurve(V0),
      });
    }

    series.push({
      type: "line",
      name: "轨迹",
      showSymbol: false,
      lineStyle: { width: 2, color: "#2563eb" },
      data: simulate(th0, w0, d),
    });

    series.push({
      type: "scatter",
      name: "初值",
      symbolSize: 10,
      itemStyle: { color: "#dc2626" },
      data: [[th0, w0]],
    });

    return {
      animation: false,
      grid: { left: 50, right: 20, top: 40, bottom: 40 },
      legend: { top: 5, textStyle: { fontSize: 11 } },
      xAxis: {
        type: "value",
        min: AXIS_MIN,
        max: AXIS_MAX,
        name: "θ (rad)",
        nameLocation: "middle",
        nameGap: 25,
      },
      yAxis: {
        type: "value",
        min: AXIS_MIN,
        max: AXIS_MAX,
        name: "ω (rad/s)",
        nameLocation: "middle",
        nameGap: 35,
      },
      series,
    };
  }, [d, th0, w0]);

  const chartRef = useECharts(option);
  const V0 = energy(th0, w0);

  return (
    <div
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 8,
        margin: "24px 0",
        padding: 16,
        background: "#fff",
      }}
      className="not-prose"
    >
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
        阻尼摆相图探索器：θ&#775; = ω, ω&#775; = -sin θ - d·ω，V = ½ω² + (1 - cos θ)
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 12 }}>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          阻尼 d = {d.toFixed(2)}
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={d}
            onChange={(e) => setD(Number(e.target.value))}
            style={{ width: 140 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          θ₀ = {th0.toFixed(1)}
          <input
            type="range"
            min={-3}
            max={3}
            step={0.1}
            value={th0}
            onChange={(e) => setTh0(Number(e.target.value))}
            style={{ width: 140 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          ω₀ = {w0.toFixed(1)}
          <input
            type="range"
            min={-3}
            max={3}
            step={0.1}
            value={w0}
            onChange={(e) => setW0(Number(e.target.value))}
            style={{ width: 140 }}
          />
        </label>
      </div>

      <div ref={chartRef} style={{ width: "100%", height: 420 }} />

      <div style={{ fontSize: 13, color: "#475569", marginTop: 8 }}>
        初值能量 V₀ = {V0.toFixed(3)}
        {V0 < 2
          ? "（橙色虚线为过初值的等值线）"
          : "（V₀ ≥ 2，初值在分离线之外，轨迹可能翻转越过顶点）"}
        。沿轨迹 V̇ = -d·ω² ≤ 0：d = 0 时轨迹沿等值线周期运动（稳定不渐近）；d &gt; 0
        时轨迹逐层向内穿越等值线收敛到原点（LaSalle）。
      </div>
    </div>
  );
}
