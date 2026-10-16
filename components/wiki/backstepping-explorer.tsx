"use client";

import { useMemo, useState } from "react";
import { useECharts } from "./use-echarts";
import type { EChartsOption } from "echarts";

const A_TRUE = 3.0;
const B_TRUE = 1.0;
const W_AMP = 0.3;
const W_FRQ = 5.0;
const G1 = 1.0;
const DT = 5e-4;
const T_STEP = 10;
const T_SINE = 12;
const SINE_AMP = 0.5;
const SINE_FRQ = 2.0;
const ZETA_TARGET = 0.7;

type RefKind = "step" | "sine";
type Law = "bs" | "fl" | "fl7";

const LAW_LABEL: Record<Law, string> = {
  bs: "反步 (k1,k2)",
  fl: "反馈线性化（同增益）",
  fl7: "反馈线性化（ζ=0.7 目标）",
};

function refSignal(kind: RefKind, t: number): [number, number, number] {
  if (kind === "step") return [1.0, 0.0, 0.0];
  return [
    SINE_AMP * Math.sin(SINE_FRQ * t),
    SINE_AMP * SINE_FRQ * Math.cos(SINE_FRQ * t),
    -SINE_AMP * SINE_FRQ * SINE_FRQ * Math.sin(SINE_FRQ * t),
  ];
}

function plant(x1: number, x2: number, u: number, t: number): [number, number] {
  return [x2, -A_TRUE * Math.sin(x1) - B_TRUE * x2 + u + W_AMP * Math.sin(W_FRQ * t)];
}

interface SimResult {
  t: number[];
  x1: number[];
  e: number[];
  u: number[];
  maxU: number;
  rmsE: number;
  overshoot: number;
  diverged: boolean;
}

function simulate(
  law: Law,
  kind: RefKind,
  k1: number,
  k2: number,
  m: number
): SimResult {
  const T = kind === "step" ? T_STEP : T_SINE;
  const steps = Math.round(T / DT);
  const ah = m * A_TRUE;
  const bh = m * B_TRUE;
  const Kp = G1 + k1 * k2;
  const Kv = k1 + k2;
  const Kp7 = Kp;
  const Kv7 = 2 * ZETA_TARGET * Math.sqrt(Kp7);

  let x1 = kind === "step" ? 0.0 : refSignal(kind, 0)[0];
  let x2 = kind === "step" ? 0.0 : refSignal(kind, 0)[1];

  const control = (t: number, xa: number, xb: number): number => {
    const [xd, xdd, xddd] = refSignal(kind, t);
    const e = xa - xd;
    const ed = xb - xdd;
    const f2h = -ah * Math.sin(xa) - bh * xb;
    if (law === "fl") return -f2h + xddd - Kp * e - Kv * ed;
    if (law === "fl7") return -f2h + xddd - Kp7 * e - Kv7 * ed;
    const z1 = e;
    const a1 = xdd - k1 * z1;
    const z2 = xb - a1;
    const a1d = xddd + k1 * k1 * z1 - k1 * z2;
    return -z1 - f2h + a1d - k2 * z2;
  };

  const t: number[] = [];
  const xs: number[] = [];
  const es: number[] = [];
  const us: number[] = [];
  let maxU = 0;
  let diverged = false;
  const stride = 4;
  const tailStart = kind === "step" ? 4 : 0.6 * T;
  let sq = 0;
  let cnt = 0;
  let peak = 0;

  for (let i = 0; i <= steps; i++) {
    const time = i * DT;
    const u = control(time, x1, x2);
    const [xd] = refSignal(kind, time);
    const e = x1 - xd;
    if (i % stride === 0) {
      t.push(time);
      xs.push(x1);
      es.push(e);
      us.push(u);
    }
    if (time > tailStart) {
      sq += e * e;
      cnt += 1;
    }
    if (Math.abs(u) > maxU) maxU = Math.abs(u);
    if (x1 > peak) peak = x1;

    const k1a = plant(x1, x2, u, time);
    const k2a = plant(x1 + 0.5 * DT * k1a[0], x2 + 0.5 * DT * k1a[1], u, time + 0.5 * DT);
    const k3a = plant(x1 + 0.5 * DT * k2a[0], x2 + 0.5 * DT * k2a[1], u, time + 0.5 * DT);
    const k4a = plant(x1 + DT * k3a[0], x2 + DT * k3a[1], u, time + DT);
    x1 = x1 + (DT / 6) * (k1a[0] + 2 * k2a[0] + 2 * k3a[0] + k4a[0]);
    x2 = x2 + (DT / 6) * (k1a[1] + 2 * k2a[1] + 2 * k3a[1] + k4a[1]);
    if (!Number.isFinite(x1) || !Number.isFinite(x2) || Math.abs(x1) > 1e3) {
      diverged = true;
      break;
    }
  }

  const base = kind === "step" ? 1.0 : 0.0;
  return {
    t,
    x1: xs,
    e: es,
    u: us,
    maxU,
    rmsE: cnt > 0 ? Math.sqrt(sq / cnt) : NaN,
    overshoot: kind === "step" ? Math.max(0, (peak - base) * 100) : NaN,
    diverged,
  };
}

export function BacksteppingExplorer() {
  const [k1, setK1] = useState(3.0);
  const [k2, setK2] = useState(5.0);
  const [m, setM] = useState(1.0);
  const [kind, setKind] = useState<RefKind>("step");
  const [show, setShow] = useState<Record<Law, boolean>>({
    bs: true,
    fl: true,
    fl7: true,
  });

  const Kp = G1 + k1 * k2;
  const Kv = k1 + k2;
  const wn = Math.sqrt(Kp);
  const zeta = Kv / (2 * wn);
  const zetaMin = Math.sqrt((Kp - G1) / Kp);
  const reachable = Kv >= 2 * Math.sqrt(Kp - G1) - 1e-12;

  const runs = useMemo(() => {
    const out = {} as Record<Law, SimResult>;
    (Object.keys(LAW_LABEL) as Law[]).forEach((law) => {
      out[law] = simulate(law, kind, k1, k2, m);
    });
    return out;
  }, [kind, k1, k2, m]);

  const maxDiff = useMemo(() => {
    const a = runs.bs;
    const b = runs.fl;
    const n = Math.min(a.u.length, b.u.length);
    let d = 0;
    for (let i = 0; i < n; i++) d = Math.max(d, Math.abs(a.u[i] - b.u[i]));
    return d;
  }, [runs]);

  const trackOption = useMemo<EChartsOption>(() => {
    const yBounds: [number, number] = kind === "step" ? [-0.25, 1.35] : [-0.85, 0.85];
    const colors: Record<Law, string> = {
      bs: "#2563eb",
      fl: "#f59e0b",
      fl7: "#dc2626",
    };
    const series: EChartsOption["series"] = [];
    const refData = runs.bs.t.map((tt) => {
      const [xd] = refSignal(kind, tt);
      return [tt, xd] as [number, number];
    });
    series.push({
      type: "line",
      name: "参考 xd",
      showSymbol: false,
      lineStyle: { width: 1.4, color: "#64748b", type: "dashed" },
      data: refData,
    });
    (Object.keys(LAW_LABEL) as Law[]).forEach((law) => {
      if (!show[law]) return;
      const r = runs[law];
      series.push({
        type: "line",
        name: LAW_LABEL[law],
        showSymbol: false,
        lineStyle: { width: law === "bs" ? 2.2 : 1.6, color: colors[law] },
        data: r.t.map((tt, i) => [tt, r.x1[i]] as [number, number]),
      });
    });
    return {
      animation: false,
      grid: { left: 52, right: 15, top: 52, bottom: 42 },
      legend: { top: 3, textStyle: { fontSize: 11 } },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "value",
        min: 0,
        max: kind === "step" ? T_STEP : T_SINE,
        name: "t (s)",
        nameLocation: "middle",
        nameGap: 25,
      },
      yAxis: {
        type: "value",
        min: yBounds[0],
        max: yBounds[1],
        name: "x1",
        nameLocation: "middle",
        nameGap: 38,
      },
      series,
    };
  }, [runs, show, kind]);

  const regionOption = useMemo<EChartsOption>(() => {
    const boundary: [number, number][] = [];
    const iso: [number, number][] = [];
    for (let kp = G1; kp <= 40; kp += 0.25) {
      boundary.push([kp, 2 * Math.sqrt(kp - G1)]);
      iso.push([kp, 2 * ZETA_TARGET * Math.sqrt(kp)]);
    }
    const Kp7 = Kp;
    const Kv7 = 2 * ZETA_TARGET * Math.sqrt(Kp7);
    return {
      animation: false,
      grid: { left: 52, right: 15, top: 52, bottom: 42 },
      legend: { top: 3, textStyle: { fontSize: 11 } },
      tooltip: { trigger: "item" },
      xAxis: {
        type: "value",
        min: 0,
        max: 40,
        name: "Kp",
        nameLocation: "middle",
        nameGap: 25,
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 25,
        name: "Kv",
        nameLocation: "middle",
        nameGap: 38,
      },
      series: [
        {
          type: "line",
          name: "反步可达边界 Kv=2√(Kp−1)",
          showSymbol: false,
          lineStyle: { width: 2.4, color: "#dc2626" },
          data: boundary,
        },
        {
          type: "line",
          name: "ζ=0.7 等阻尼线",
          showSymbol: false,
          lineStyle: { width: 1.6, color: "#9333ea", type: "dashed" },
          data: iso,
        },
        {
          type: "scatter",
          name: "当前 (Kp,Kv)",
          symbolSize: 13,
          itemStyle: { color: "#2563eb" },
          data: [[Kp, Kv]],
        },
        {
          type: "scatter",
          name: "同刚度的 ζ=0.7 目标",
          symbol: "diamond",
          symbolSize: 13,
          itemStyle: { color: "#16a34a" },
          data: [[Kp7, Kv7]],
        },
      ],
    };
  }, [Kp, Kv]);

  const trackRef = useECharts(trackOption);
  const regionRef = useECharts(regionOption);

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
        minWidth: 118,
      }}
    >
      <div style={{ fontSize: 11, color: "#64748b" }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: tone || "#0f172a" }}>
        {value}
      </div>
    </div>
  );

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
        反步探索器：x&#775;₁ = x₂，x&#775;₂ = −3sin(x₁) − x₂ + u + 0.3sin(5t)
      </div>
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
        拖动 k₁、k₂ 看等价增益 Kp = 1 + k₁k₂、Kv = k₁ + k₂ 与阻尼下界；蓝线（反步）与橙线（反馈线性化同增益）
        应当完全重合——重合的残差就显示在下面的读数里。
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: "#374151" }}>参考：</span>
        <button style={btn(kind === "step")} onClick={() => setKind("step")}>
          阶跃设定值 xd=1
        </button>
        <button style={btn(kind === "sine")} onClick={() => setKind("sine")}>
          正弦 xd=0.5sin(2t)
        </button>
        <span style={{ fontSize: 13, color: "#374151", marginLeft: 8 }}>曲线：</span>
        {(Object.keys(LAW_LABEL) as Law[]).map((law) => (
          <button
            key={law}
            style={btn(show[law])}
            onClick={() => setShow((s) => ({ ...s, [law]: !s[law] }))}
          >
            {LAW_LABEL[law]}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 12 }}>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          k₁ = {k1.toFixed(1)}
          <input
            type="range"
            min={0.5}
            max={8}
            step={0.5}
            value={k1}
            onChange={(e) => setK1(Number(e.target.value))}
            style={{ width: 150 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          k₂ = {k2.toFixed(1)}
          <input
            type="range"
            min={0.5}
            max={8}
            step={0.5}
            value={k2}
            onChange={(e) => setK2(Number(e.target.value))}
            style={{ width: 150 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          模型精度 m = {m.toFixed(2)}（â = m·a, b̂ = m·b）
          <input
            type="range"
            min={0.4}
            max={1}
            step={0.05}
            value={m}
            onChange={(e) => setM(Number(e.target.value))}
            style={{ width: 150 }}
          />
        </label>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        {stat("Kp = 1 + k₁k₂", Kp.toFixed(2))}
        {stat("Kv = k₁ + k₂", Kv.toFixed(2))}
        {stat("ωn = √Kp", wn.toFixed(2))}
        {stat("ζ = Kv/(2ωn)", zeta.toFixed(3), zeta < ZETA_TARGET ? "#dc2626" : undefined)}
        {stat("ζ_min = √((Kp−1)/Kp)", zetaMin.toFixed(3))}
        {stat(
          "ζ=0.7 目标",
          zetaMin <= ZETA_TARGET + 1e-9 ? "可达" : "不可达",
          zetaMin <= ZETA_TARGET + 1e-9 ? "#16a34a" : "#dc2626"
        )}
        {stat(
          "反步超调（实测）",
          kind === "step" && !runs.bs.diverged ? runs.bs.overshoot.toFixed(2) + " %" : "—"
        )}
        {stat("rms|e| 末段（反步）", runs.bs.rmsE.toExponential(2))}
        {stat("max|u|（反步）", runs.bs.maxU.toFixed(2))}
        {stat("max|u_反步 − u_FL|", maxDiff.toExponential(1), "#16a34a")}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <div ref={trackRef} style={{ width: "48%", minWidth: 320, height: 330 }} />
        <div ref={regionRef} style={{ width: "48%", minWidth: 320, height: 330 }} />
      </div>

      <div style={{ fontSize: 13, color: "#475569", marginTop: 8 }}>
        {runs.bs.diverged ? (
          <span style={{ color: "#dc2626" }}>
            反步闭环发散：k₁、k₂ 太小盖不住 30% 以上的模型误差与扰动，把增益调大或把 m 调回 1.00。
          </span>
        ) : (
          <>
            <strong>max|u_反步 − u_反馈线性化| = {maxDiff.toExponential(1)}</strong>
            ：两条曲线在浮点舍入量级内完全重合，说明标称反步与反馈线性化是同一个控制律，
            增益映射就是 Kp = 1 + k₁k₂、Kv = k₁ + k₂。
            {reachable
              ? ` 当前 (Kp, Kv) = (${Kp.toFixed(2)}, ${Kv.toFixed(2)}) 在可达域内（边界 Kv ≥ 2√(Kp−1) = ${(2 * Math.sqrt(Kp - G1)).toFixed(2)}）。`
              : " 当前增益落在可达域外（理论上不会发生，因为 k₁,k₂ 取正实数）。"}
            {zetaMin > ZETA_TARGET
              ? ` 但同一刚度下反步能达到的最小阻尼是 ζ_min = ${zetaMin.toFixed(3)} > 0.7，所以绿色的 ζ=0.7 目标点落在红色边界下方——反步给不出这个响应，反馈线性化可以。`
              : ` 当前刚度较低（Kp = ${Kp.toFixed(2)}），ζ_min = ${zetaMin.toFixed(3)} 已经小于 0.7，ζ=0.7 目标可达；把 k₁k₂ 调大再看，ζ_min 会迅速逼近 1。`}
            {m < 1
              ? ` m = ${m.toFixed(2)} 时反步与反馈线性化的 rms 误差一起变差（标称设计对模型误差没有免疫力），这正是第 6 节自适应反步要解决的问题。`
              : ""}
          </>
        )}
      </div>
    </div>
  );
}
