"use client";

import { useMemo, useState } from "react";
import { useECharts } from "./use-echarts";
import type { EChartsOption } from "echarts";

const T_MIN = 0;
const T_MAX = 10;
const Y_MIN = -6;
const Y_MAX = 6;
const A_EPS = 0.05;

type State = { x1: number; x2: number };

function closedLoopDeriv(s: State, a: number): State {
  const Lfh = s.x2 + a * s.x1 * s.x2;
  const y = s.x1 + a * s.x2;
  const v = -2 * y;
  const u = (v - Lfh) / a;
  return { x1: s.x2, x2: s.x1 * s.x2 + u };
}

function simulate(a: number): { t: number[]; y: number[]; x1: number[] } {
  const dt = 0.005;
  const steps = Math.round(T_MAX / dt);
  let s: State = { x1: 1.5, x2: 0 };
  const t: number[] = [0];
  const y: number[] = [s.x1 + a * s.x2];
  const x1: number[] = [s.x1];
  let i = 0;
  for (; i < steps; i++) {
    const k1 = closedLoopDeriv(s, a);
    const k2 = closedLoopDeriv(
      { x1: s.x1 + 0.5 * dt * k1.x1, x2: s.x2 + 0.5 * dt * k1.x2 },
      a
    );
    const k3 = closedLoopDeriv(
      { x1: s.x1 + 0.5 * dt * k2.x1, x2: s.x2 + 0.5 * dt * k2.x2 },
      a
    );
    const k4 = closedLoopDeriv(
      { x1: s.x1 + dt * k3.x1, x2: s.x2 + dt * k3.x2 },
      a
    );
    s = {
      x1: s.x1 + (dt / 6) * (k1.x1 + 2 * k2.x1 + 2 * k3.x1 + k4.x1),
      x2: s.x2 + (dt / 6) * (k1.x2 + 2 * k2.x2 + 2 * k3.x2 + k4.x2),
    };
    if (!Number.isFinite(s.x1) || !Number.isFinite(s.x2)) break;
    if (Math.abs(s.x1) > 1e3 || Math.abs(s.x2) > 1e3) break;
    if (i % 4 === 0) {
      t.push((i + 1) * dt);
      y.push(s.x1 + a * s.x2);
      x1.push(s.x1);
    }
  }
  return { t, y, x1 };
}

export function ZeroDynamicsExplorer() {
  const [a, setA] = useState(1.0);
  const degenerate = Math.abs(a) < A_EPS;

  const option = useMemo<EChartsOption>(() => {
    if (degenerate) {
      return {
        animation: false,
        grid: { left: 55, right: 20, top: 40, bottom: 45 },
        legend: { top: 5, textStyle: { fontSize: 11 } },
        xAxis: {
          type: "value",
          min: T_MIN,
          max: T_MAX,
          name: "t (s)",
          nameLocation: "middle",
          nameGap: 25,
        },
        yAxis: {
          type: "value",
          min: Y_MIN,
          max: Y_MAX,
          name: "幅值",
          nameLocation: "middle",
          nameGap: 38,
        },
        series: [],
        graphic: {
          type: "text",
          left: "center",
          top: "middle",
          style: {
            text: "L g h = a ≈ 0：相对阶发生突变，反馈线性化失效",
            fontSize: 13,
            fill: "#dc2626",
          },
        },
      };
    }

    const sim = simulate(a);
    const yData = sim.t.map((tt, i) => [tt, clamp(sim.y[i])] as [number, number]);
    const x1Data = sim.t.map(
      (tt, i) => [tt, clamp(sim.x1[i])] as [number, number]
    );

    return {
      animation: false,
      grid: { left: 55, right: 20, top: 40, bottom: 45 },
      legend: { top: 5, textStyle: { fontSize: 11 } },
      xAxis: {
        type: "value",
        min: T_MIN,
        max: T_MAX,
        name: "t (s)",
        nameLocation: "middle",
        nameGap: 25,
      },
      yAxis: {
        type: "value",
        min: Y_MIN,
        max: Y_MAX,
        name: "幅值",
        nameLocation: "middle",
        nameGap: 38,
      },
      series: [
        {
          type: "line",
          name: "输出 y(t)",
          showSymbol: false,
          lineStyle: { width: 2.5, color: "#2563eb" },
          data: yData,
        },
        {
          type: "line",
          name: "内部状态 x₁(t)",
          showSymbol: false,
          lineStyle: { width: 2, color: "#f59e0b" },
          data: x1Data,
        },
      ],
    };
  }, [a, degenerate]);

  const chartRef = useECharts(option);

  return (
    <div
      className="not-prose"
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 8,
        margin: "24px 0",
        padding: 16,
        background: "#fff",
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
        零动态探索器：x&#775;₁ = x₂, x&#775;₂ = x₁x₂ + u, y = x₁ + a·x₂，反馈律 u = (v − L
        <sub>f</sub>h)/a, v = −2y
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 12 }}>
        <label
          style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}
        >
          输出系数 a = {a.toFixed(1)}
          <input
            type="range"
            min={-2}
            max={2}
            step={0.1}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            style={{ width: 200 }}
          />
        </label>
      </div>

      <div ref={chartRef} style={{ width: "100%", height: 380 }} />

      <div style={{ fontSize: 13, color: "#475569", marginTop: 8 }}>
        {degenerate ? (
          <span style={{ color: "#dc2626" }}>
            |a| &lt; {A_EPS}：L<sub>g</sub>h = a → 0，相对阶从 1 跳到 2，
            (L<sub>g</sub>h)⁻¹ 无界，反馈线性化在这一点奇异（曲线区无解）。
          </span>
        ) : (
          <>
            输出 y 总是以速率 2 指数收敛（蓝线），因为 ẏ = v = −2y 已被精确线性化。
            但内部状态 x₁ 的渐近行为由零动态决定：y ≡ 0 时 x₁ = −a·x₂，
            ẋ₁ = x₂ = −x₁/a，特征值为{" "}
            <strong>−1/a = {(-1 / a).toFixed(2)}</strong>。
            {a > 0
              ? " 现在 a > 0，零动态稳定（最小相位），x₁ 与 y 一起收敛到 0（橙线）。"
              : " 现在 a < 0，零动态不稳定（非最小相位）：y 收敛的同时 x₁ 指数发散——这正是反馈线性化最需要警惕的陷阱。"}
          </>
        )}
      </div>
    </div>
  );
}

function clamp(v: number): number {
  if (!Number.isFinite(v)) return 0;
  if (v > 50) return 50;
  if (v < -50) return -50;
  return v;
}
