"use client";

import { useMemo, useState } from "react";
import { useECharts } from "./use-echarts";
import type { EChartsOption } from "echarts";

const PLANE_TR = 4.5;
const PLANE_DET_MIN = -3;
const PLANE_DET_MAX = 6;
const PORTRAIT = 2.2;

type Kind =
  | "saddle"
  | "stable-node"
  | "unstable-node"
  | "degenerate-stable"
  | "degenerate-unstable"
  | "stable-focus"
  | "unstable-focus"
  | "center"
  | "singular";

const KIND_LABEL: Record<Kind, string> = {
  saddle: "鞍点",
  "stable-node": "稳定节点",
  "unstable-node": "不稳定节点",
  "degenerate-stable": "退化稳定节点",
  "degenerate-unstable": "退化不稳定节点",
  "stable-focus": "稳定焦点",
  "unstable-focus": "不稳定焦点",
  center: "中心（线性化）",
  singular: "零特征值（非线性待判）",
};

const KIND_COLOR: Record<Kind, string> = {
  saddle: "#dc2626",
  "stable-node": "#16a34a",
  "unstable-node": "#ea580c",
  "degenerate-stable": "#0d9488",
  "degenerate-unstable": "#ca8a04",
  "stable-focus": "#2563eb",
  "unstable-focus": "#9333ea",
  center: "#7c3aed",
  singular: "#64748b",
};

const EPS = 1e-9;

function classify(tr: number, det: number): { kind: Kind; hyperbolic: boolean } {
  const disc = tr * tr - 4 * det;
  if (Math.abs(det) < EPS) return { kind: "singular", hyperbolic: false };
  if (det < 0) return { kind: "saddle", hyperbolic: true };
  if (Math.abs(tr) < EPS) return { kind: "center", hyperbolic: false };
  if (disc > EPS) {
    return {
      kind: tr < 0 ? "stable-node" : "unstable-node",
      hyperbolic: true,
    };
  }
  if (disc < -EPS) {
    return {
      kind: tr < 0 ? "stable-focus" : "unstable-focus",
      hyperbolic: true,
    };
  }
  return {
    kind: tr < 0 ? "degenerate-stable" : "degenerate-unstable",
    hyperbolic: true,
  };
}

function eigenvalues(tr: number, det: number): [number, number, number] {
  const disc = tr * tr - 4 * det;
  const re = tr / 2;
  const im = Math.sqrt(Math.abs(disc)) / 2;
  return disc < 0 ? [re, re, im] : [re - im, re + im, 0];
}

function rk4(
  tr: number,
  det: number,
  x0: number,
  y0: number,
  T: number,
  steps: number
): [number, number][] {
  // 伴随型矩阵 J = [[0, 1], [-det, tr]]，特征方程恰为 λ² - tr·λ + det = 0
  const f = (x: number, y: number): [number, number] => [y, -det * x + tr * y];
  const dt = T / steps;
  let x = x0;
  let y = y0;
  const pts: [number, number][] = [[x, y]];
  for (let i = 0; i < steps; i++) {
    const [k1x, k1y] = f(x, y);
    const [k2x, k2y] = f(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y);
    const [k3x, k3y] = f(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y);
    const [k4x, k4y] = f(x + dt * k3x, y + dt * k3y);
    x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    y += (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
    if (!isFinite(x) || !isFinite(y)) break;
    if (Math.abs(x) > 50 || Math.abs(y) > 50) break;
    if (i % 3 === 0) pts.push([x, y]);
  }
  return pts;
}

function parabola(): [number, number][] {
  const pts: [number, number][] = [];
  const N = 400;
  for (let i = 0; i <= N; i++) {
    const tr = -PLANE_TR + (2 * PLANE_TR * i) / N;
    const det = (tr * tr) / 4;
    if (det <= PLANE_DET_MAX) pts.push([tr, det]);
  }
  return pts;
}

export function TraceDetExplorer() {
  const [tr, setTr] = useState(-0.5);
  const [det, setDet] = useState(1.0);

  const { kind, hyperbolic } = classify(tr, det);
  const disc = tr * tr - 4 * det;
  const [l1, l2, im] = eigenvalues(tr, det);

  const planeOption = useMemo<EChartsOption>(() => {
    return {
      animation: false,
      grid: { left: 48, right: 16, top: 32, bottom: 40 },
      xAxis: {
        type: "value",
        min: -PLANE_TR,
        max: PLANE_TR,
        name: "tr(J)",
        nameLocation: "middle",
        nameGap: 24,
      },
      yAxis: {
        type: "value",
        min: PLANE_DET_MIN,
        max: PLANE_DET_MAX,
        name: "det(J)",
        nameLocation: "middle",
        nameGap: 34,
      },
      series: [
        {
          type: "line",
          name: "det = tr²/4",
          showSymbol: false,
          lineStyle: { width: 2, color: "#0ea5e9" },
          data: parabola(),
        },
        {
          type: "line",
          name: "det = 0",
          showSymbol: false,
          lineStyle: { width: 1.5, color: "#94a3b8", type: "dashed" },
          data: [
            [-PLANE_TR, 0],
            [PLANE_TR, 0],
          ],
        },
        {
          type: "line",
          name: "tr = 0",
          showSymbol: false,
          lineStyle: { width: 1.5, color: "#a78bfa", type: "dashed" },
          data: [
            [0, PLANE_DET_MIN],
            [0, PLANE_DET_MAX],
          ],
        },
        {
          type: "scatter",
          name: "当前 (tr, det)",
          symbolSize: 14,
          itemStyle: { color: KIND_COLOR[kind], borderColor: "#fff", borderWidth: 2 },
          data: [[tr, det]],
          label: {
            show: true,
            position: "right",
            formatter: KIND_LABEL[kind],
            fontSize: 12,
            fontWeight: 600,
            color: KIND_COLOR[kind],
          },
        },
      ],
    };
  }, [tr, det, kind]);

  const portraitOption = useMemo<EChartsOption>(() => {
    const ics: [number, number][] = [];
    const N = 10;
    for (let i = 0; i < N; i++) {
      const a = (2 * Math.PI * i) / N;
      ics.push([1.7 * Math.cos(a), 1.7 * Math.sin(a)]);
    }
    const T = kind === "center" ? 14 : 9;
    return {
      animation: false,
      grid: { left: 40, right: 16, top: 32, bottom: 40 },
      xAxis: {
        type: "value",
        min: -PORTRAIT,
        max: PORTRAIT,
        name: "x₁",
        nameLocation: "middle",
        nameGap: 24,
      },
      yAxis: {
        type: "value",
        min: -PORTRAIT,
        max: PORTRAIT,
        name: "x₂",
        nameLocation: "middle",
        nameGap: 30,
      },
      series: [
        ...ics.map((ic, i) => ({
          type: "line" as const,
          showSymbol: false,
          lineStyle: { width: 1.6, color: i === 0 ? "#2563eb" : "#93c5fd" },
          data: rk4(tr, det, ic[0], ic[1], T, 900),
        })),
        {
          type: "scatter" as const,
          name: "平衡点",
          symbolSize: 9,
          itemStyle: { color: KIND_COLOR[kind] },
          data: [[0, 0]],
        },
      ],
    };
  }, [tr, det, kind]);

  const planeRef = useECharts(planeOption);
  const portraitRef = useECharts(portraitOption);

  const lamText =
    disc < 0
      ? `λ = ${l1.toFixed(4)} ± ${im.toFixed(4)}j`
      : `λ₁ = ${l1.toFixed(4)}, λ₂ = ${l2.toFixed(4)}`;

  return (
    <div
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 8,
        margin: "24px 0",
        padding: 16,
        background: "#fff",
        color:"#0f172a",
      }}
      aria-label="迹行列式探索"
      className="not-prose"
    >
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
        迹-行列式平面探索器：J = [[0, 1], [-det, tr]]，λ² - tr·λ + det = 0
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 12 }}>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", flexWrap:"wrap", gap: 8 }}>
          tr = {tr.toFixed(2)}
          <input
            type="range"
            min={-4}
            max={4}
            step={0.05}
            value={tr}
            onChange={(e) => setTr(Number(e.target.value))}
            style={{ width: 170 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", flexWrap:"wrap", gap: 8 }}>
          det = {det.toFixed(2)}
          <input
            type="range"
            min={-3}
            max={6}
            step={0.05}
            value={det}
            onChange={(e) => setDet(Number(e.target.value))}
            style={{ width: 170 }}
          />
        </label>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <div style={{ flex: "1 1 340px", minWidth: 0 }}>
          <button onClick={() => {setTr(-.5);setDet(1);}} style={{padding:6,marginBottom:10}}>恢复默认分类</button>
      <div ref={planeRef} style={{ width: "100%", height: 330 }} />
        </div>
        <div style={{ flex: "1 1 340px", minWidth: 0 }}>
          <div ref={portraitRef} style={{ width: "100%", height: 330 }} />
        </div>
      </div>

      <div
        style={{
          fontSize: 13,
          color: "#334155",
          marginTop: 10,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          padding: "8px 10px",
        }}
      >
        <div>
          <b style={{ color: KIND_COLOR[kind] }}>{KIND_LABEL[kind]}</b>
          <span style={{ marginLeft: 10 }}>
            tr = {tr.toFixed(3)}, det = {det.toFixed(3)}, tr² - 4det = {disc.toFixed(3)}
          </span>
          <span style={{ marginLeft: 10 }}>{lamText}</span>
        </div>
        <div style={{ marginTop: 4, color: "#475569" }}>
          {hyperbolic
            ? "双曲平衡点（Re λ ≠ 0）：Hartman-Grobman 适用，非线性系统在该点附近的相图与这里同胚。"
            : "非双曲平衡点（Re λ = 0 或 det = 0）：Hartman-Grobman 失效，这里的图形只反映线性化系统；非线性项可以把中心变成焦点甚至有限时间逃逸。"}
        </div>
      </div>
    </div>
  );
}

export const traceDetNumerics={classify,eigenvalues,rk4};
