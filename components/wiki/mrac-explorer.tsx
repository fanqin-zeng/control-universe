"use client";

import { useMemo, useState } from "react";
import { useECharts } from "./use-echarts";
import type { EChartsOption } from "echarts";

const A = -2.0;
const B = 3.0;
const AM = -5.0;
const BM = 5.0;
const K1S = (AM - A) / B;
const K2S = BM / B;
const W1 = 3.0;
const W2 = 20.0;
const TAU_N = 0.01;
const T = 40;
const DT = 1e-3;
const STRIDE = 25;
const PE_STRIDE = 2;
const PE_TW = 2 * Math.PI;

type RefKind = "step" | "sine" | "multi";

const REF_LABEL: Record<RefKind, string> = {
  step: "阶跃 r=1",
  sine: "单正弦 sin(t)",
  multi: "多正弦 1+0.5sin2t+0.3sin5t",
};

const Y_RANGE: Record<RefKind, [number, number]> = {
  step: [-0.3, 1.5],
  sine: [-1.5, 1.5],
  multi: [-0.3, 2.1],
};

function refSignal(kind: RefKind, t: number): number {
  if (kind === "step") return 1.0;
  if (kind === "sine") return Math.sin(t);
  return 1.0 + 0.5 * Math.sin(2 * t) + 0.3 * Math.sin(5 * t);
}

function manifoldK2(k1: number): number {
  return ((BM / AM) * (A + B * k1)) / B;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface SimResult {
  t: number[];
  xp: number[];
  xm: number[];
  r: number[];
  e: number[];
  traj: [number, number][];
  k1End: number;
  k2End: number;
  rmsE: number;
  maxU: number;
  divT: number | null;
  peLmin: number;
  distIdeal: number;
  distManifold: number;
}

function simulate(
  kind: RefKind,
  gamma: number,
  sigma: number,
  noiseStd: number,
  unmodeled: boolean
): SimResult {
  const steps = Math.round(T / DT);
  const rnd = mulberry32(20260924);
  let spare: number | null = null;
  const gauss = (): number => {
    if (spare !== null) {
      const v = spare;
      spare = null;
      return v;
    }
    let u = 0;
    let v = 0;
    while (u === 0) u = rnd();
    while (v === 0) v = rnd();
    const mag = Math.sqrt(-2 * Math.log(u));
    spare = mag * Math.sin(2 * Math.PI * v);
    return mag * Math.cos(2 * Math.PI * v);
  };

  const nAmp = noiseStd * Math.sqrt((2 * TAU_N) / DT);
  let xp = 0;
  let xm = 0;
  let k1 = 0;
  let k2 = 0;
  let v1 = 0;
  let v2 = 0;
  let n = 0;

  const t: number[] = [];
  const xps: number[] = [];
  const xms: number[] = [];
  const rs: number[] = [];
  const es: number[] = [];
  const traj: [number, number][] = [];
  const peR: [number, number][] = [];

  let divT: number | null = null;
  let maxU = 0;
  let sq = 0;
  let cnt = 0;

  const deriv = (
    px: number,
    pm: number,
    p1: number,
    p2: number,
    pv1: number,
    pv2: number,
    pn: number,
    r: number,
    xi: number
  ): number[] => {
    const xpn = px + pn;
    const e = xpn - pm;
    const u = p1 * xpn + p2 * r;
    const d1 = -gamma * e * xpn - sigma * gamma * p1;
    const d2 = -gamma * e * r - sigma * gamma * p2;
    if (unmodeled) {
      return [
        A * px + B * pv2,
        AM * pm + BM * r,
        d1,
        d2,
        W1 * (u - pv1),
        W2 * (pv1 - pv2),
        (-pn + xi) / TAU_N,
      ];
    }
    return [A * px + B * u, AM * pm + BM * r, d1, d2, 0, 0, (-pn + xi) / TAU_N];
  };

  for (let i = 0; i <= steps; i++) {
    const time = i * DT;
    const r = refSignal(kind, time);
    const xi = noiseStd > 0 ? gauss() * nAmp : 0;

    if (i % PE_STRIDE === 0) peR.push([xp, r]);
    if (i % STRIDE === 0) {
      t.push(time);
      xps.push(xp);
      xms.push(xm);
      rs.push(r);
      es.push(xp - xm);
      traj.push([k1, k2]);
    }
    if (time > 0.8 * T) {
      const ee = xp - xm;
      sq += ee * ee;
      cnt += 1;
    }
    const uu = k1 * (xp + n) + k2 * r;
    if (Math.abs(uu) > maxU) maxU = Math.abs(uu);
    if (i === steps) break;

    const s1 = deriv(xp, xm, k1, k2, v1, v2, n, r, xi);
    const s2 = deriv(
      xp + 0.5 * DT * s1[0], xm + 0.5 * DT * s1[1], k1 + 0.5 * DT * s1[2],
      k2 + 0.5 * DT * s1[3], v1 + 0.5 * DT * s1[4], v2 + 0.5 * DT * s1[5],
      n + 0.5 * DT * s1[6], r, xi
    );
    const s3 = deriv(
      xp + 0.5 * DT * s2[0], xm + 0.5 * DT * s2[1], k1 + 0.5 * DT * s2[2],
      k2 + 0.5 * DT * s2[3], v1 + 0.5 * DT * s2[4], v2 + 0.5 * DT * s2[5],
      n + 0.5 * DT * s2[6], r, xi
    );
    const rNext = refSignal(kind, time + DT);
    const s4 = deriv(
      xp + DT * s3[0], xm + DT * s3[1], k1 + DT * s3[2],
      k2 + DT * s3[3], v1 + DT * s3[4], v2 + DT * s3[5],
      n + DT * s3[6], rNext, xi
    );
    xp += (DT / 6) * (s1[0] + 2 * s2[0] + 2 * s3[0] + s4[0]);
    xm += (DT / 6) * (s1[1] + 2 * s2[1] + 2 * s3[1] + s4[1]);
    k1 += (DT / 6) * (s1[2] + 2 * s2[2] + 2 * s3[2] + s4[2]);
    k2 += (DT / 6) * (s1[3] + 2 * s2[3] + 2 * s3[3] + s4[3]);
    v1 += (DT / 6) * (s1[4] + 2 * s2[4] + 2 * s3[4] + s4[4]);
    v2 += (DT / 6) * (s1[5] + 2 * s2[5] + 2 * s3[5] + s4[5]);
    n += (DT / 6) * (s1[6] + 2 * s2[6] + 2 * s3[6] + s4[6]);

    if (!Number.isFinite(xp) || Math.abs(xp) > 1e3 || Math.abs(k1) > 1e4) {
      divT = time;
      break;
    }
  }

  const dtw = PE_STRIDE * DT;
  const nw = Math.round(PE_TW / dtw);
  let peLmin = Infinity;
  for (let j = 0; j < 20; j++) {
    const i0 = Math.round(j / dtw);
    let g00 = 0;
    let g01 = 0;
    let g11 = 0;
    for (let p = 0; p < nw; p++) {
      const idx = i0 + p;
      if (idx >= peR.length) break;
      const a = peR[idx][0];
      const b = peR[idx][1];
      g00 += a * a;
      g01 += a * b;
      g11 += b * b;
    }
    g00 *= dtw;
    g01 *= dtw;
    g11 *= dtw;
    const tr = g00 + g11;
    const det = g00 * g11 - g01 * g01;
    const lam = tr / 2 - Math.sqrt(Math.max(0, (tr * tr) / 4 - det));
    if (lam < peLmin) peLmin = lam;
  }
  if (!Number.isFinite(peLmin)) peLmin = 0;

  const distManifold = Math.abs(k2 - manifoldK2(k1));
  return {
    t,
    xp: xps,
    xm: xms,
    r: rs,
    e: es,
    traj,
    k1End: k1,
    k2End: k2,
    rmsE: cnt > 0 ? Math.sqrt(sq / cnt) : NaN,
    maxU,
    divT,
    peLmin: Math.max(peLmin, 0),
    distIdeal: Math.hypot(k1 - K1S, k2 - K2S),
    distManifold,
  };
}

export function MracExplorer() {
  const [kind, setKind] = useState<RefKind>("step");
  const [gamma, setGamma] = useState(50);
  const [sigma, setSigma] = useState(0);
  const [noiseStd, setNoiseStd] = useState(0);
  const [unmodeled, setUnmodeled] = useState(false);

  const sim = useMemo(
    () => simulate(kind, gamma, sigma, noiseStd, unmodeled),
    [kind, gamma, sigma, noiseStd, unmodeled]
  );

  const timeOption = useMemo<EChartsOption>(() => {
    const pair = (arr: number[]) => sim.t.map((tt, i) => [tt, arr[i]] as [number, number]);
    return {
      animation: false,
      grid: { left: 46, right: 14, top: 46, bottom: 38 },
      legend: { top: 3, textStyle: { fontSize: 11 } },
      tooltip: { trigger: "axis" },
      xAxis: { type: "value", min: 0, max: T, name: "t (s)", nameLocation: "middle", nameGap: 22 },
      yAxis: {
        type: "value",
        min: Y_RANGE[kind][0],
        max: Y_RANGE[kind][1],
        name: "x",
        nameLocation: "middle",
        nameGap: 32,
      },
      series: [
        {
          type: "line",
          name: "参考 r",
          showSymbol: false,
          lineStyle: { width: 1.2, color: "#94a3b8", type: "dotted" },
          data: pair(sim.r),
        },
        {
          type: "line",
          name: "参考模型 xm",
          showSymbol: false,
          lineStyle: { width: 1.8, color: "#f59e0b", type: "dashed" },
          data: pair(sim.xm),
        },
        {
          type: "line",
          name: "对象 xp",
          showSymbol: false,
          lineStyle: { width: 2.2, color: "#2563eb" },
          data: pair(sim.xp),
        },
      ],
    };
  }, [sim, kind]);

  const errOption = useMemo<EChartsOption>(() => ({
    animation: false,
    grid: { left: 46, right: 14, top: 46, bottom: 38 },
    legend: { top: 3, textStyle: { fontSize: 11 } },
    tooltip: { trigger: "axis" },
    xAxis: { type: "value", min: 0, max: T, name: "t (s)", nameLocation: "middle", nameGap: 22 },
    yAxis: {
      type: "value",
      min: -0.5,
      max: 0.5,
      name: "e = xp − xm",
      nameLocation: "middle",
      nameGap: 34,
    },
    series: [
      {
        type: "line",
        name: "跟踪误差 e",
        showSymbol: false,
        lineStyle: { width: 1.8, color: "#dc2626" },
        data: sim.t.map((tt, i) => [tt, sim.e[i]] as [number, number]),
      },
    ],
  }), [sim]);

  const planeOption = useMemo<EChartsOption>(() => {
    const line: [number, number][] = [];
    for (let k1 = -6; k1 <= 3.0001; k1 += 0.05) line.push([k1, manifoldK2(k1)]);
    return {
      animation: false,
      grid: { left: 46, right: 14, top: 46, bottom: 38 },
      legend: { top: 3, textStyle: { fontSize: 11 } },
      tooltip: { trigger: "item" },
      xAxis: { type: "value", min: -6, max: 3, name: "k₁", nameLocation: "middle", nameGap: 22 },
      yAxis: { type: "value", min: -4, max: 7, name: "k₂", nameLocation: "middle", nameGap: 32 },
      series: [
        {
          type: "line",
          name: "直流增益匹配流形",
          showSymbol: false,
          lineStyle: { width: 1.6, color: "#9333ea", type: "dashed" },
          data: line,
        },
        {
          type: "line",
          name: "参数轨迹 (k₁,k₂)",
          showSymbol: false,
          lineStyle: { width: 2, color: "#2563eb" },
          data: sim.traj,
        },
        {
          type: "scatter",
          name: "起点 k(0)",
          symbolSize: 9,
          itemStyle: { color: "#64748b" },
          data: sim.traj.length ? [sim.traj[0]] : [],
        },
        {
          type: "scatter",
          name: "终点 k(末)",
          symbolSize: 11,
          itemStyle: { color: "#16a34a" },
          data: sim.traj.length ? [sim.traj[sim.traj.length - 1]] : [],
        },
        {
          type: "scatter",
          name: "理想点 k*",
          symbol: "diamond",
          symbolSize: 15,
          itemStyle: { color: "#dc2626", borderColor: "#fff", borderWidth: 1 },
          data: [[K1S, K2S]],
        },
      ],
    };
  }, [sim.traj]);

  const timeRef = useECharts(timeOption);
  const errRef = useECharts(errOption);
  const planeRef = useECharts(planeOption);

  const btn = (active: boolean): React.CSSProperties => ({
    padding: "4px 10px",
    fontSize: 13,
    borderRadius: 4,
    border: active ? "1px solid #2563eb" : "1px solid #d1d5db",
    background: active ? "#eff6ff" : "#fff",
    color: active ? "#2563eb" : "#374151",
    cursor: "pointer",
    fontWeight: active ? 600 : 400,
  });

  const stat = (label: string, value: string, tone?: string) => (
    <div
      key={label}
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: "6px 10px",
        background: "#f8fafc",
        minWidth: 112,
      }}
    >
      <div style={{ fontSize: 11, color: "#64748b" }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: tone || "#0f172a" }}>{value}</div>
    </div>
  );

  const sci = (v: number, d = 2) =>
    Number.isFinite(v) ? v.toExponential(d) : "—";
  const converged = sim.distIdeal < 5e-3;
  const onManifold = sim.distManifold < 1e-6;

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
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
        MRAC 实验台：对象 d(xp)/dt = −2xp + 3u，参考模型 d(xm)/dt = −5xm + 5r，
        u = k₁·xp + k₂·r
      </div>
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
        自适应律 dk_i/dt = −γ·e·φ_i − σγ·k_i（φ = [xp, r]，e = xp − xm）。
        理想增益 k* = (−1, 5/3)；紫色虚线是直流增益匹配流形 k₂ = (2 − 3k₁)/3——
        阶跃参考下参数会停在这条线上而不是停在红色菱形上。坐标轴范围固定，拖动时曲线在稳定参考系里移动。
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#374151" }}>参考信号：</span>
        {(Object.keys(REF_LABEL) as RefKind[]).map((k) => (
          <button key={k} style={btn(kind === k)} onClick={() => setKind(k)}>
            {REF_LABEL[k]}
          </button>
        ))}
        <button style={btn(unmodeled)} onClick={() => setUnmodeled((v) => !v)}>
          未建模极点（3 与 20 rad/s）：{unmodeled ? "开" : "关"}
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 12 }}>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          γ = {gamma}
          <input
            type="range"
            min={1}
            max={200}
            step={1}
            value={gamma}
            onChange={(e) => setGamma(Number(e.target.value))}
            style={{ width: 170 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          σ（泄漏） = {sigma.toFixed(2)}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={sigma}
            onChange={(e) => setSigma(Number(e.target.value))}
            style={{ width: 150 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          量测噪声 std = {noiseStd.toFixed(2)}
          <input
            type="range"
            min={0}
            max={0.3}
            step={0.01}
            value={noiseStd}
            onChange={(e) => setNoiseStd(Number(e.target.value))}
            style={{ width: 150 }}
          />
        </label>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        {stat("rms|e| 末段", sci(sim.rmsE))}
        {stat("k₁(末)", sim.k1End.toFixed(4), converged ? "#16a34a" : undefined)}
        {stat("k₂(末)", sim.k2End.toFixed(4), converged ? "#16a34a" : undefined)}
        {stat("距理想点 |k̃|", sim.distIdeal.toExponential(2))}
        {stat("距匹配流形", sim.distManifold.toExponential(1), onManifold ? "#9333ea" : undefined)}
        {stat("PE λ_min", sim.peLmin.toExponential(2), sim.peLmin < 1e-8 ? "#dc2626" : "#16a34a")}
        {stat("max|u|", sim.maxU.toFixed(2))}
        {stat(
          "结局",
          sim.divT === null ? "有界" : `发散 t=${sim.divT.toFixed(2)} s`,
          sim.divT === null ? "#16a34a" : "#dc2626"
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <div ref={timeRef} style={{ width: "32%", minWidth: 280, height: 300 }} />
        <div ref={errRef} style={{ width: "30%", minWidth: 260, height: 300 }} />
        <div ref={planeRef} style={{ width: "32%", minWidth: 280, height: 300 }} />
      </div>

      <div style={{ fontSize: 13, color: "#475569", marginTop: 10, lineHeight: 1.7 }}>
        {sim.divT !== null ? (
          <span style={{ color: "#dc2626" }}>
            闭环在 t = {sim.divT.toFixed(2)} s 发散。
            {unmodeled
              ? " 未建模极点打开时 γ 存在硬上界：本例 γ ≤ 3 有界、γ ≥ 4 发散（Rohrs 反例）。把 γ 降回 3 以下，或关掉未建模极点再看。"
              : " 没有未建模极点时纯 MRAC 不会这样发散——检查 σ 与噪声是否把参数推到了非物理的区域。"}
          </span>
        ) : (
          <>
            <strong>PE λ_min = {sim.peLmin.toExponential(2)}</strong>
            ：这是回归量 φ = [xp, r] 在 20 个长度 2π 秒的窗口上 Gram 矩阵最小特征值的最小值。
            {sim.peLmin < 1e-8
              ? " 它是数值零，说明当前参考不满足持续激励——两个参数不可分辨，"
              : " 它明显大于零，说明持续激励成立，参数会真正收敛到 k*。"}
            {sim.peLmin < 1e-8 && kind === "step"
              ? " 阶跃输入稳态后 xp 与 r 都等于 1，φ = [1, 1] 只剩一个方向。"
              : ""}
            {onManifold && !converged
              ? ` 参数终点 (k₁, k₂) = (${sim.k1End.toFixed(4)}, ${sim.k2End.toFixed(4)}) 落在直流增益匹配流形上（偏差 ${sim.distManifold.toExponential(1)}），距理想点还有 ${sim.distIdeal.toFixed(3)}——可是左图的跟踪误差已经压到 ${sci(sim.rmsE)}。跟踪无差不等于参数收敛。`
              : ""}
            {converged
              ? ` 参数已经收敛到理想点附近（|k̃| = ${sim.distIdeal.toExponential(2)}）。`
              : ""}
            {sigma > 0
              ? ` σ = ${sigma.toFixed(2)} 的泄漏项把平衡点从 k* 拉开，稳态误差正比于 σ；换来的是参数保证有界。`
              : ""}
            {noiseStd > 0
              ? ` 噪声 std = ${noiseStd.toFixed(2)} 时 rms|e| = ${sci(sim.rmsE)}、max|u| = ${sim.maxU.toFixed(2)}：γ 越大，噪声被积分成的随机游走越厉害。`
              : ""}
          </>
        )}
      </div>
    </div>
  );
}
