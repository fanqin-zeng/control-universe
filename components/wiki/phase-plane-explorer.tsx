"use client";

import { useMemo, useState } from "react";
import { useECharts } from "./use-echarts";
import type { EChartsOption } from "echarts";

type SysKey = "pendulum" | "vanderpol" | "duffing" | "lotka" | "cubic";
type Pt = [number, number];
type Trajectory = Pt[] & { times: number[]; termination: string };
type Names = [string, string];

type ExtraReadout =
  | { sys: "pendulum"; wCrit: number }
  | { sys: "duffing"; vCrit: number; barrier: number; E0: number }
  | {
      sys: "vanderpol";
      amp: number;
      ampMin: number;
      period: number;
      smallMu: number;
      relax: number;
    }
  | { sys: "lotka"; h0: number; h1: number; drift: number }
  | {
      sys: "cubic";
      r0: number;
      rEnd: number;
      blow: number;
      rAna: number;
      Tanalytic: number;
    };

const LV_BETA = 0.5;
const LV_GAMMA = 1.5;
const LV_DELTA = 0.75;
const DUF_K = 0.2;

interface SysDef {
  key: SysKey;
  label: string;
  formula: string;
  paramSymbol: string;
  paramName: string;
  pMin: number;
  pMax: number;
  pStep: number;
  pDef: number;
  box: { x1: Pt; x2: Pt };
  axisNames: Names;
  deriv: (s: Pt, p: number) => Pt;
  equilibria: (p: number) => Pt[];
  jacobian: (s: Pt, p: number) => [number, number, number, number];
  nullclines: (p: number, box: SysDef["box"]) => Pt[][];
  hasNullcline: boolean;
  icDef: Pt;
  extraIcs: Pt[];
  T: number;
  icRange: { x1: Pt; x2: Pt };
}

const DEFS: SysDef[] = [
  {
    key: "pendulum",
    label: "阻尼摆",
    formula: "θ̇ = ω, ω̇ = -sin θ - d·ω",
    paramSymbol: "d",
    paramName: "阻尼",
    pMin: 0,
    pMax: 1.5,
    pStep: 0.05,
    pDef: 0.1,
    box: { x1: [-7, 7], x2: [-3.5, 3.5] },
    axisNames: ["θ (rad)", "ω (rad/s)"],
    deriv: (s, p) => [s[1], -Math.sin(s[0]) - p * s[1]],
    equilibria: () => [-2, -1, 0, 1, 2].map((n) => [n * Math.PI, 0] as Pt),
    jacobian: (s, p) => [0, 1, -Math.cos(s[0]), -p],
    nullclines: (p, box) => {
      const hz: Pt[] = [
        [box.x1[0], 0],
        [box.x1[1], 0],
      ];
      if (p < 1e-6) {
        return [hz, ...[-2, -1, 0, 1, 2].map((n) => [[n * Math.PI, box.x2[0]], [n * Math.PI, box.x2[1]]] as Pt[])];
      }
      return [hz, sampleCurve((x) => -Math.sin(x) / p, box)];
    },
    hasNullcline: true,
    icDef: [0, 2.0],
    extraIcs: [
      [0, 2.6],
      [Math.PI - 0.05, 0],
      [-Math.PI + 0.05, 0],
      [3.5, 1.5],
      [-3.5, -1.5],
    ],
    T: 40,
    icRange: { x1: [-6.5, 6.5], x2: [-3.4, 3.4] },
  },
  {
    key: "vanderpol",
    label: "Van der Pol",
    formula: "ẋ₁ = x₂, ẋ₂ = μ(1 - x₁²)x₂ - x₁",
    paramSymbol: "μ",
    paramName: "非线性阻尼",
    pMin: 0,
    pMax: 2,
    pStep: 0.05,
    pDef: 0.5,
    box: { x1: [-3.5, 3.5], x2: [-4, 4] },
    axisNames: ["x₁", "x₂"],
    deriv: (s, p) => [s[1], p * (1 - s[0] * s[0]) * s[1] - s[0]],
    equilibria: () => [[0, 0]],
    jacobian: (s, p) => [0, 1, -1 - 2 * p * s[0] * s[1], p * (1 - s[0] * s[0])],
    nullclines: (p, box) => {
      const hz: Pt[] = [
        [box.x1[0], 0],
        [box.x1[1], 0],
      ];
      if (p < 1e-6) {
        return [hz, [[0, box.x2[0]], [0, box.x2[1]]]];
      }
      const branches: Pt[][] = [hz];
      const edges = [-1, 1];
      const segs: number[] = [box.x1[0], ...edges, box.x1[1]];
      for (let i = 0; i < segs.length - 1; i++) {
        const a = i === 0 ? segs[0] : segs[i] + 0.02;
        const b = i === segs.length - 2 ? segs[segs.length - 1] : segs[i + 1] - 0.02;
        if (a >= b) continue;
        const poly = sampleRange((x) => x / (p * (1 - x * x)), a, b, box.x2);
        if (poly.length) branches.push(poly);
      }
      return branches;
    },
    hasNullcline: true,
    icDef: [0.2, 0],
    extraIcs: [
      [2.8, 0],
      [0, 2.4],
      [0.001, 0],
      [-3, -2],
    ],
    T: 200,
    icRange: { x1: [-3.4, 3.4], x2: [-3.9, 3.9] },
  },
  {
    key: "duffing",
    label: "非线性振子（手算例）",
    formula: "ẋ₁ = x₂, ẋ₂ = -x₁ - d·x₂ + 0.2x₁³",
    paramSymbol: "d",
    paramName: "阻尼",
    pMin: 0,
    pMax: 1.5,
    pStep: 0.05,
    pDef: 0.5,
    box: { x1: [-3.5, 3.5], x2: [-3.5, 3.5] },
    axisNames: ["x₁", "x₂"],
    deriv: (s, p) => [s[1], -s[0] - p * s[1] + DUF_K * s[0] ** 3],
    equilibria: () => [[0, 0], [Math.sqrt(5), 0], [-Math.sqrt(5), 0]],
    jacobian: (s, p) => [0, 1, -1 + 3 * DUF_K * s[0] * s[0], -p],
    nullclines: (p, box) => {
      const hz: Pt[] = [
        [box.x1[0], 0],
        [box.x1[1], 0],
      ];
      if (p < 1e-6) {
        return [
          hz,
          ...[0, Math.sqrt(5), -Math.sqrt(5)].map(
            (x) => [[x, box.x2[0]], [x, box.x2[1]]] as Pt[]
          ),
        ];
      }
      return [hz, sampleCurve((x) => (-x + DUF_K * x ** 3) / p, box)];
    },
    hasNullcline: true,
    icDef: [2.3, 0],
    extraIcs: [
      [0.936426, 0],
      [2.0, 0],
      [0, 1.2],
      [0, 2.3],
      [-2.3, 0],
      [1.0, 1.5],
    ],
    T: 60,
    icRange: { x1: [-3.4, 3.4], x2: [-3.4, 3.4] },
  },
  {
    key: "lotka",
    label: "Lotka-Volterra",
    formula: `ẋ₁ = αx₁ - ${LV_BETA}x₁x₂, ẋ₂ = -${LV_GAMMA}x₂ + ${LV_DELTA}x₁x₂`,
    paramSymbol: "α",
    paramName: "猎物增长率",
    pMin: 0.4,
    pMax: 2.2,
    pStep: 0.05,
    pDef: 1.0,
    box: { x1: [0, 5.5], x2: [0, 5.5] },
    axisNames: ["x₁ 猎物", "x₂ 捕食者"],
    deriv: (s, p) => [
      p * s[0] - LV_BETA * s[0] * s[1],
      -LV_GAMMA * s[1] + LV_DELTA * s[0] * s[1],
    ],
    equilibria: (p) => [
      [0, 0],
      [LV_GAMMA / LV_DELTA, p / LV_BETA],
    ],
    jacobian: (s, p) => [
      p - LV_BETA * s[1],
      -LV_BETA * s[0],
      LV_DELTA * s[1],
      -LV_GAMMA + LV_DELTA * s[0],
    ],
    nullclines: (p, box) => {
      const yStar = p / LV_BETA;
      const xStar = LV_GAMMA / LV_DELTA;
      const segs: Pt[][] = [
        [[0, box.x2[0]], [0, box.x2[1]]],
        [[box.x1[0], yStar], [box.x1[1], yStar]],
        [[box.x1[0], 0], [box.x1[1], 0]],
        [[xStar, box.x2[0]], [xStar, box.x2[1]]],
      ];
      return segs;
    },
    hasNullcline: true,
    icDef: [2.0, 3.5],
    extraIcs: [
      [3.5, 2.0],
      [1.2, 1.5],
      [2.0, 4.5],
      [0.6, 2.0],
    ],
    T: 40,
    icRange: { x1: [0.05, 5.4], x2: [0.05, 5.4] },
  },
  {
    key: "cubic",
    label: "线性化失效例",
    formula: "ẋ₁ = -x₂ + a·x₁r², ẋ₂ = x₁ + a·x₂r², r² = x₁² + x₂²",
    paramSymbol: "a",
    paramName: "三次项系数",
    pMin: -0.5,
    pMax: 0.5,
    pStep: 0.02,
    pDef: 0,
    box: { x1: [-1.5, 1.5], x2: [-1.5, 1.5] },
    axisNames: ["x₁", "x₂"],
    deriv: (s, p) => {
      const r2 = s[0] * s[0] + s[1] * s[1];
      return [-s[1] + p * s[0] * r2, s[0] + p * s[1] * r2];
    },
    equilibria: () => [[0, 0]],
    jacobian: () => [0, -1, 1, 0],
    nullclines: () => [],
    hasNullcline: false,
    icDef: [0.7, 0],
    extraIcs: [
      [0.3, 0],
      [1.0, 0],
      [0, 0.5],
      [-0.8, 0.4],
    ],
    T: 30,
    icRange: { x1: [-1.4, 1.4], x2: [-1.4, 1.4] },
  },
];

function sampleRange(
  g: (x: number) => number,
  a: number,
  b: number,
  yRange: Pt
): Pt[] {
  const out: Pt[] = [];
  const N = 600;
  for (let i = 0; i <= N; i++) {
    const x = a + ((b - a) * i) / N;
    const y = g(x);
    if (isFinite(y) && y >= yRange[0] && y <= yRange[1]) out.push([x, y]);
  }
  return out;
}

function sampleCurve(g: (x: number) => number, box: SysDef["box"]): Pt[] {
  return sampleRange(g, box.x1[0], box.x1[1], box.x2);
}

function rk4(def: SysDef, ic: Pt, p: number): Trajectory {
  const steps = Math.max(400, Math.round(def.T * 240));
  const dt = def.T / steps;
  // The exactly critical undamped release has a known separatrix. Generic
  // floating-point integration eventually chooses a side due to energy drift.
  if (def.key === "pendulum" && p === 0 && ic[0] === 0 && Math.abs(ic[1]) === 2) {
    const points = Object.assign([] as Pt[], {times:[] as number[],termination:"horizon-analytic"});
    const keep = Math.max(1, Math.round(steps/1200)), sign = Math.sign(ic[1]);
    for(let i=0;i<=steps;i++) if(i%keep===0||i===steps){const t=i*dt;points.push([sign*(4*Math.atan(Math.exp(t))-Math.PI),sign*2/Math.cosh(t)]);points.times.push(t);}
    return points;
  }
  const lim = Math.max(
    Math.abs(def.box.x1[0]),
    Math.abs(def.box.x1[1]),
    Math.abs(def.box.x2[0]),
    Math.abs(def.box.x2[1])
  ) * 2.2;
  let x = ic[0];
  let y = ic[1];
  const f = def.deriv;
  const pts = Object.assign([[x, y]] as Pt[], {times:[0],termination:"horizon"});
  const keep = Math.max(1, Math.round(steps / 1200));
  for (let i = 0; i < steps; i++) {
    const [k1x, k1y] = f([x, y], p);
    const [k2x, k2y] = f([x + 0.5 * dt * k1x, y + 0.5 * dt * k1y], p);
    const [k3x, k3y] = f([x + 0.5 * dt * k2x, y + 0.5 * dt * k2y], p);
    const [k4x, k4y] = f([x + dt * k3x, y + dt * k3y], p);
    x += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    y += (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
    if (!isFinite(x) || !isFinite(y)) {pts.termination="nonfinite";break;}
    if (Math.abs(x) > lim || Math.abs(y) > lim) {
      pts.push([x, y]);pts.times.push((i+1)*dt);pts.termination="display-cutoff";
      break;
    }
    if ((i+1) % keep === 0 || i===steps-1) {pts.push([x, y]);pts.times.push((i+1)*dt);}
  }
  return pts;
}

function classify(tr: number, det: number): { label: string; color: string; hyperbolic: boolean } {
  const disc = tr * tr - 4 * det;
  const EPS = 1e-9;
  if (Math.abs(det) < EPS)
    return { label: "零特征值（非线性待判）", color: "#64748b", hyperbolic: false };
  if (det < 0) return { label: "鞍点", color: "#dc2626", hyperbolic: true };
  if (Math.abs(tr) < EPS)
    return { label: "中心（线性化）", color: "#7c3aed", hyperbolic: false };
  if (disc > EPS)
    return tr < 0
      ? { label: "稳定节点", color: "#16a34a", hyperbolic: true }
      : { label: "不稳定节点", color: "#ea580c", hyperbolic: true };
  if (disc < -EPS)
    return tr < 0
      ? { label: "稳定焦点", color: "#2563eb", hyperbolic: true }
      : { label: "不稳定焦点", color: "#9333ea", hyperbolic: true };
  return tr < 0
    ? { label: "退化稳定节点", color: "#0d9488", hyperbolic: true }
    : { label: "退化不稳定节点", color: "#ca8a04", hyperbolic: true };
}

function eigText(tr: number, det: number): string {
  const disc = tr * tr - 4 * det;
  const re = tr / 2;
  if (disc < 0) return `${re.toFixed(4)} ± ${(Math.sqrt(-disc) / 2).toFixed(4)}j`;
  const h = Math.sqrt(disc) / 2;
  return `${(re - h).toFixed(4)}, ${(re + h).toFixed(4)}`;
}

// 越过势垒的临界初速：对 damped pendulum 与 duffing 用「是否翻过鞍点」二分
function bisectThreshold(
  escapes: (v: number) => boolean,
  lo: number,
  hi: number
): number {
  let a = lo;
  let b = hi;
  for (let i = 0; i < 60; i++) {
    const m = 0.5 * (a + b);
    if (escapes(m)) b = m;
    else a = m;
  }
  return 0.5 * (a + b);
}

export function PhasePlaneExplorer() {
  const [key, setKey] = useState<SysKey>("duffing");
  const def = DEFS.find((d) => d.key === key) as SysDef;
  const [p, setP] = useState(def.pDef);
  const [ic1, setIc1] = useState(def.icDef[0]);
  const [ic2, setIc2] = useState(def.icDef[1]);
  const [showNull, setShowNull] = useState(true);
  const [showMany, setShowMany] = useState(true);

  const switchTo = (k: SysKey) => {
    const d = DEFS.find((x) => x.key === k) as SysDef;
    setKey(k);
    setP(d.pDef);
    setIc1(d.icDef[0]);
    setIc2(d.icDef[1]);
  };

  const ic: Pt = [ic1, ic2];

  const eqData = useMemo(
    () =>
      def.equilibria(p).map((pt) => {
        const [a, b, c, dd] = def.jacobian(pt, p);
        const tr = a + dd;
        const det = a * dd - b * c;
        const cl = classify(tr, det);
        return { pt, tr, det, disc: tr * tr - 4 * det, cl, eig: eigText(tr, det) };
      }),
    [def, p]
  );

  const mainTraj = useMemo(() => rk4(def, ic, p), [def, ic, p]);
  const otherTrajs = useMemo(
    () => (showMany ? def.extraIcs.map((e) => rk4(def, e, p)) : []),
    [def, p, showMany]
  );

  const stats = useMemo(() => {
    const xs = mainTraj.map((q) => q[0]);
    const endPt = mainTraj[mainTraj.length - 1];
    const nearest = eqData.reduce(
      (best, e) => {
        const d = Math.hypot(endPt[0] - e.pt[0], endPt[1] - e.pt[1]);
        return d < best.d ? { d, e } : best;
      },
      { d: Infinity, e: eqData[0] }
    );
    return {
      x1min: Math.min(...xs),
      x1max: Math.max(...xs),
      endPt,
      endTime: mainTraj.times[mainTraj.times.length-1],
      settled: nearest.d < 1e-3,
      nearest,
      leftBox:
        Math.abs(endPt[0]) > Math.max(Math.abs(def.box.x1[0]), Math.abs(def.box.x1[1])) * 1.05 ||
        Math.abs(endPt[1]) > Math.max(Math.abs(def.box.x2[0]), Math.abs(def.box.x2[1])) * 1.05,
    };
  }, [mainTraj, eqData, def]);

  const extra = useMemo(() => phaseExtra(key, def, p, ic, mainTraj, stats), [key,def,p,ic1,ic2,mainTraj,stats]);

  const option = useMemo<EChartsOption>(() => {
    const series: Record<string, unknown>[] = [];

    if (showNull && def.hasNullcline) {
      def.nullclines(p, def.box).forEach((poly, i) => {
        if (poly.length < 2) return;
        series.push({
          type: "line",
          name: i === 0 ? "nullcline" : undefined,
          showSymbol: false,
          lineStyle: { width: 1.4, color: i % 2 === 0 ? "#f59e0b" : "#c026d3", type: "dashed" },
          data: poly,
        });
      });
    }

    otherTrajs.forEach((tr, i) => {
      series.push({
        type: "line",
        name: i === 0 ? "其他初值" : undefined,
        showSymbol: false,
        lineStyle: { width: 1.2, color: "#93c5fd" },
        data: tr,
      });
    });

    series.push({
      type: "line",
      name: "当前初值轨迹",
      showSymbol: false,
      lineStyle: { width: 2.2, color: "#2563eb" },
      data: mainTraj,
    });

    eqData.forEach((e, i) => {
      series.push({
        type: "scatter",
        name: i === 0 ? "平衡点" : undefined,
        symbolSize: 11,
        symbol: e.cl.label === "鞍点" ? "diamond" : "circle",
        itemStyle: { color: e.cl.color, borderColor: "#fff", borderWidth: 1.5 },
        data: [e.pt],
        label: {
          show: true,
          position: "top",
          fontSize: 10,
          color: e.cl.color,
          formatter: `(${e.pt[0].toFixed(2)}, ${e.pt[1].toFixed(2)}) ${e.cl.label}`,
        },
      });
    });

    series.push({
      type: "scatter",
      name: "当前初值",
      symbolSize: 10,
      itemStyle: { color: "#0f172a" },
      data: [ic],
    });

    return {
      animation: false,
      grid: { left: 52, right: 20, top: 36, bottom: 42 },
      xAxis: {
        type: "value",
        min: def.box.x1[0],
        max: def.box.x1[1],
        name: def.axisNames[0],
        nameLocation: "middle",
        nameGap: 26,
      },
      yAxis: {
        type: "value",
        min: def.box.x2[0],
        max: def.box.x2[1],
        name: def.axisNames[1],
        nameLocation: "middle",
        nameGap: 38,
      },
      series,
    };
  }, [def, p, ic, mainTraj, otherTrajs, eqData, showNull, showMany]);

  const chartRef = useECharts(option);

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
      aria-label="相平面探索"
      className="not-prose"
    >
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>
        相平面探索器：{def.formula}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {DEFS.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => switchTo(d.key)}
            style={{
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 5,
              cursor: "pointer",
              border: "1px solid",
              borderColor: d.key === key ? "#2563eb" : "#cbd5e1",
              background: d.key === key ? "#2563eb" : "#fff",
              color: d.key === key ? "#fff" : "#334155",
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginBottom: 10 }}>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", flexWrap:"wrap", gap: 8 }}>
          {def.paramSymbol} = {p.toFixed(2)}（{def.paramName}）
          <input
            aria-label="模型参数"
            type="range"
            min={def.pMin}
            max={def.pMax}
            step={def.pStep}
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
            style={{ width: 150 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", flexWrap:"wrap", gap: 8 }}>
          {def.axisNames[0].split(" ")[0]}₀ = {ic1.toFixed(3)}
          <input
            aria-label="初始位置"
            type="range"
            min={def.icRange.x1[0]}
            max={def.icRange.x1[1]}
            step={0.01}
            value={ic1}
            onChange={(e) => setIc1(Number(e.target.value))}
            style={{ width: 130 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", flexWrap:"wrap", gap: 8 }}>
          {def.axisNames[1].split(" ")[0]}₀ = {ic2.toFixed(3)}
          <input
            aria-label="初始速度"
            type="range"
            min={def.icRange.x2[0]}
            max={def.icRange.x2[1]}
            step={0.01}
            value={ic2}
            onChange={(e) => setIc2(Number(e.target.value))}
            style={{ width: 130 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
          <input
            type="checkbox"
            checked={showNull}
            disabled={!def.hasNullcline}
            onChange={(e) => setShowNull(e.target.checked)}
          />
          nullcline
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>
          <input
            type="checkbox"
            checked={showMany}
            onChange={(e) => setShowMany(e.target.checked)}
          />
          多初值
        </label>
      </div>

      <button onClick={() => switchTo("duffing")} style={{padding:6,marginBottom:10}}>恢复默认相图</button>
      <div ref={chartRef} style={{ width: "100%", height: 430 }} />

      <div
        style={{
          fontSize: 12.5,
          color: "#334155",
          marginTop: 10,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          padding: "8px 10px",
          overflowX: "auto",
          maxWidth: "100%",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "#64748b", textAlign: "left" }}>
              <th style={{ padding: "2px 6px", fontWeight: 500 }}>平衡点</th>
              <th style={{ padding: "2px 6px", fontWeight: 500 }}>tr</th>
              <th style={{ padding: "2px 6px", fontWeight: 500 }}>det</th>
              <th style={{ padding: "2px 6px", fontWeight: 500 }}>tr²−4det</th>
              <th style={{ padding: "2px 6px", fontWeight: 500 }}>特征值</th>
              <th style={{ padding: "2px 6px", fontWeight: 500 }}>类型</th>
            </tr>
          </thead>
          <tbody>
            {eqData.map((e, i) => (
              <tr key={i} style={{ borderTop: "1px solid #e2e8f0" }}>
                <td style={{ padding: "2px 6px" }}>
                  ({e.pt[0].toFixed(4)}, {e.pt[1].toFixed(4)})
                </td>
                <td style={{ padding: "2px 6px" }}>{e.tr.toFixed(4)}</td>
                <td style={{ padding: "2px 6px" }}>{e.det.toFixed(4)}</td>
                <td style={{ padding: "2px 6px" }}>{e.disc.toFixed(4)}</td>
                <td style={{ padding: "2px 6px" }}>{e.eig}</td>
                <td style={{ padding: "2px 6px", color: e.cl.color, fontWeight: 600 }}>
                  {e.cl.label}
                  {e.cl.hyperbolic ? "" : "（非双曲）"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 6, color: "#475569" }}>
          <Readout
            p={p}
            ic={ic}
            stats={stats}
            extra={extra}
          />
        </div>
      </div>
    </div>
  );
}

export function phaseExtra(key: SysKey, def: SysDef, p: number, ic: Pt, mainTraj: Trajectory, stats: {endPt:Pt}): ExtraReadout {

    if (key === "pendulum") {
      const wCrit = bisectThreshold(
        (w0) => {
          const tr = rk4(def, [0, w0], p);
          return Math.max(...tr.map((q) => q[0])) > Math.PI + 0.05;
        },
        0.5,
        6
      );
      return { sys: "pendulum", wCrit };
    }
    if (key === "duffing") {
      const esc = (v0: number) => {
        const tr = rk4(def, [0, v0], p);
        return Math.max(...tr.map((q) => q[0])) > Math.sqrt(5) + 0.1;
      };
      const vCrit = p < 1e-6 ? Math.sqrt(2 * 1.25) : bisectThreshold(esc, 0.2, 6);
      const V = (x: number) => 0.5 * x * x - (DUF_K / 4) * x ** 4;
      return {
        sys: "duffing",
        vCrit,
        barrier: V(Math.sqrt(5)) - V(0),
        E0: V(ic[0]) + 0.5 * ic[1] * ic[1],
      };
    }
    if (key === "vanderpol") {
      const Tlong = 400;
      const long = rk4({ ...def, T: Tlong }, ic, p);
      const tail = long.slice(Math.floor(long.length * 0.75));
      const xs = tail.map((q) => q[0]);
      // rk4 decimates to ~1200 stored samples, so index i is not an integration step.
      // Every retained point carries its actual integration timestamp.
      const ups: number[] = [];
      for (let i = 1; i < long.length; i++) {
        if (long[i - 1][0] < 0 && long[i][0] >= 0 && i > long.length * 0.75) {
          const frac = -long[i - 1][0] / (long[i][0] - long[i - 1][0]);
          ups.push(long.times[i-1]+frac*(long.times[i]-long.times[i-1]));
        }
      }
      const gaps: number[] = [];
      for (let i = 1; i < ups.length; i++) gaps.push(ups[i] - ups[i - 1]);
      gaps.sort((a, b) => a - b);
      return {
        sys: "vanderpol",
        amp: Math.max(...xs),
        ampMin: Math.min(...xs),
        period: gaps.length ? gaps[Math.floor(gaps.length / 2)] : NaN,
        smallMu: 2 * Math.PI * (1 + (p * p) / 16),
        relax: (3 - 2 * Math.LN2) * p,
      };
    }
    if (key === "lotka") {
      const H = (x: number, y: number) =>
        LV_DELTA * x - LV_GAMMA * Math.log(x) + LV_BETA * y - p * Math.log(y);
      const h0 = H(ic[0], ic[1]);
      const endP = mainTraj[mainTraj.length - 1];
      const h1 = H(endP[0], endP[1]);
      return { sys: "lotka", h0, h1, drift: Math.abs(h1-h0)/Math.max(1,Math.abs(h0)) };
    }
    const r0 = Math.hypot(ic[0], ic[1]);
    const rEnd = Math.hypot(stats.endPt[0], stats.endPt[1]);
    const blow = p > 1e-9 ? 1 / (2 * p * r0 * r0) : Infinity;
    const Tanalytic = mainTraj.times[mainTraj.times.length-1];
    const rAna =
      Tanalytic < blow
        ? r0 / Math.sqrt(Math.max(1e-300, 1 - 2 * p * r0 * r0 * Tanalytic))
        : r0;
    return { sys: "cubic", r0, rEnd, blow, rAna, Tanalytic };

}

export const phasePlaneNumerics = {DEFS,rk4,classify,bisectThreshold,phaseExtra};

function Readout({
  p,
  ic,
  stats,
  extra,
}: {
  p: number;
  ic: Pt;
  stats: {
    x1min: number;
    x1max: number;
    endPt: Pt;
    endTime: number;
    settled: boolean;
    nearest: { d: number; e: { pt: Pt; cl: { label: string } } };
    leftBox: boolean;
  };
  extra: ExtraReadout;
}) {
  const dest = stats.settled
    ? `末样点靠近平衡点 (${stats.nearest.e.pt[0].toFixed(3)}, ${stats.nearest.e.pt[1].toFixed(3)})`
    : stats.leftBox
      ? "轨迹越过显示范围/达到数值截断；这不等于数值证明无穷远"
      : "当前窗口末样点未靠近平衡点；不能据此断言长期有界";

  if (extra.sys === "pendulum") {
    return (
      <>
        <div>
          初值 ({ic[0].toFixed(3)}, {ic[1].toFixed(3)})，实际积分到 {stats.endTime.toFixed(3)} s：{dest}；x₁ 范围 [
          {stats.x1min.toFixed(3)}, {stats.x1max.toFixed(3)}]。
        </div>
        <div>
          d = {p.toFixed(2)} 时，从 θ = 0 出发能翻过顶点 θ = π 的有限窗口越顶阈值估计 ω_crit ={" "}
          <b>{extra.wCrit.toFixed(6)}</b>；无阻尼能量判据 2·(1−cos π) = ½ω² 给出 ω = 2。
          两者之比 = {(extra.wCrit / 2).toFixed(4)}。
        </div>
      </>
    );
  }

  if (extra.sys === "duffing") {
    return (
      <>
        <div>
          初值 ({ic[0].toFixed(3)}, {ic[1].toFixed(3)})：E = ½x₂² + V(x₁) ={" "}
          <b>{extra.E0.toFixed(6)}</b>，势垒高度 ΔV = V(√5) − V(0) ={" "}
          <b>{extra.barrier.toFixed(6)}</b>；实际积分到 {stats.endTime.toFixed(3)} s：{dest}。
        </div>
        <div>
          沿 x₂ 轴（初值 (0, v₀)）的有限窗口越界速度估计 v_crit = <b>{extra.vCrit.toFixed(6)}</b>
          ；无阻尼能量判据 √(2ΔV) = {Math.sqrt(2 * extra.barrier).toFixed(6)}，比值 ={" "}
          {(extra.vCrit / Math.sqrt(2 * extra.barrier)).toFixed(4)}。
        </div>
        <div style={{ color: "#b45309" }}>
          注意 E 与 ΔV 的大小并不能单独决定逃逸：初值若已在势垒外侧，即使 E &lt; ΔV 也会被推出去。
          真正的判据是初值落在鞍点稳定流形的哪一侧。
        </div>
      </>
    );
  }

  if (extra.sys === "vanderpol") {
    return (
      <>
        <div>
          μ = {p.toFixed(2)}：极限环振幅 x₁ ∈ [{extra.ampMin.toFixed(6)},{" "}
          {extra.amp.toFixed(6)}]，峰峰值 {(extra.amp - extra.ampMin).toFixed(6)}，实测周期{" "}
          <b>{Number.isFinite(extra.period) ? extra.period.toFixed(6) : "未检出完整周期"}</b> s。
        </div>
        <div>
          小 μ 渐近式 2π(1 + μ²/16) = {extra.smallMu.toFixed(6)}（相对误差{" "}
          {Number.isFinite(extra.period) ? (Math.abs(extra.period / extra.smallMu - 1) * 100).toFixed(3) : "未定义"}%）；
          大 μ 张弛振荡渐近式 (3 − 2ln2)μ = {extra.relax.toFixed(6)}（比值{" "}
          {Number.isFinite(extra.period) && extra.relax>0 ? (extra.period / extra.relax).toFixed(4) : "未定义"}）。
        </div>
        <div>
          这里显示后段采样峰值与周期估计；稳定极限环及其吸引域需另证，振幅不直接等于阻尼项过零位置。
        </div>
      </>
    );
  }

  if (extra.sys === "lotka") {
    return (
      <>
        <div>
          首次积分 H = {LV_DELTA}x₁ − {LV_GAMMA}ln x₁ + {LV_BETA}x₂ − {p.toFixed(2)}ln x₂：
          H(0) = <b>{extra.h0.toFixed(9)}</b>，H(T) = <b>{extra.h1.toFixed(9)}</b>，
          按 max(1, |H(0)|) 归一的漂移 {extra.drift.toExponential(2)}。
        </div>
        <div>
          H 守恒说明这里的闭合轨道是一族守恒量水平线（真正的非线性中心），
          而不是线性化误判出来的假中心；平衡点 (2, {(p / LV_BETA).toFixed(2)}) 处 tr = 0，
          线性化不能定性，是 H 的存在性给出了结论。
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        a = {p.toFixed(2)}，r₀ = |x(0)| = {extra.r0.toFixed(6)}；积分到 T ={" "}
        {extra.Tanalytic.toFixed(3)} s 时数值 r = <b>{extra.rEnd.toFixed(6)}</b>
        ，解析解 r(T) = r₀/√(1 − 2ar₀²T) = <b>{extra.rAna.toFixed(6)}</b>。
      </div>
      <div>
        {extra.r0===0 ? "零初态保持原点，径向爆破公式不适用于零半径。" : p > 1e-9
          ? `a > 0：解析爆破时刻 t* = 1/(2ar₀²) = ${extra.blow.toFixed(4)} s，轨道在有限时间内跑到无穷。`
          : p < -1e-9
            ? "a < 0：r 单调衰减到 0，原点是全局渐近稳定的焦点。"
            : "a = 0：r 恒定，原点才是真正的中心。"}
      </div>
      <div style={{ color: "#b45309" }}>
        三种情况下 J(0) 都是 [[0, −1], [1, 0]]，tr = 0、det = 1、λ = ±j，一阶模型为线性中心，原非线性系统需另判。
        非双曲点上 Hartman-Grobman 失效，三次项才是真正的裁判。
      </div>
    </>
  );
}
