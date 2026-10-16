"use client";

import { useMemo, useState } from "react";
import { useECharts } from "./use-echarts";
import type { EChartsOption } from "echarts";

const T_MIN = 0;
const T_MAX = 6;
const X_MIN = -2;
const X_MAX = 2;
const XD_MIN = -8;
const XD_MAX = 8;
const DT = 2e-4;

type Law = "sgn" | "sat" | "tanh" | "sta";

const LAW_LABEL: Record<Law, string> = {
  sgn: "sgn 理想切换",
  sat: "sat 边界层",
  tanh: "tanh 光滑",
  sta: "超螺旋 STA",
};

function simulate(
  lam: number,
  K: number,
  phi: number,
  D: number,
  law: Law
) {
  const steps = Math.round(T_MAX / DT);
  let x = 1.5;
  let xd = 0.0;
  let v = 0.0;
  const alpha = 1.5 * Math.sqrt(Math.max(D * 5, 0.5));
  const beta = 1.1 * Math.max(D * 5, 0.5);

  const t: number[] = [];
  const xs: number[] = [];
  const xds: number[] = [];
  const ss: number[] = [];
  const us: number[] = [];

  let tReach = NaN;
  let holdCount = 0;
  const holdNeed = Math.round(0.2 / DT);

  for (let i = 0; i <= steps; i++) {
    const time = i * DT;
    const d = D * Math.sin(5 * time);
    const s = xd + lam * x;
    const uEq = 2 * xd + Math.sin(x) - lam * xd;
    let u: number;
    if (law === "sgn") u = uEq - K * Math.sign(s);
    else if (law === "sat") u = uEq - K * clamp01(s / phi);
    else if (law === "tanh") u = uEq - K * Math.tanh(s / phi);
    else u = uEq - alpha * Math.sqrt(Math.abs(s)) * Math.sign(s) + v;

    if (Number.isNaN(tReach)) {
      if (Math.abs(s) < 0.05) {
        holdCount += 1;
        if (holdCount >= holdNeed) tReach = time - 0.2;
      } else {
        holdCount = 0;
      }
    }

    if (i % 4 === 0) {
      t.push(time);
      xs.push(x);
      xds.push(xd);
      ss.push(s);
      us.push(u);
    }

    const acc = -2 * xd - Math.sin(x) + u + d;
    const xdNew = xd + DT * acc;
    x = x + DT * xdNew;
    xd = xdNew;
    if (law === "sta") v = v - DT * beta * Math.sign(s);
    if (!Number.isFinite(x) || !Number.isFinite(xd)) break;
    if (Math.abs(x) > 1e3 || Math.abs(xd) > 1e3) break;
  }

  const startIdx = Number.isNaN(tReach)
    ? Math.round(3 / DT / 4)
    : Math.round((tReach + 0.5) / DT / 4);
  const bandArr = ss.slice(Math.min(startIdx, ss.length));
  const band = bandArr.length ? Math.max(...bandArr.map(Math.abs)) : NaN;

  const lastN = Math.round(1 / DT / 4);
  const tail = xs.slice(Math.max(0, xs.length - lastN));
  const rmsX = tail.length
    ? Math.sqrt(tail.reduce((a, b) => a + b * b, 0) / tail.length)
    : NaN;

  const tvN = Math.round(2 / DT / 4);
  const uTail = us.slice(Math.max(0, us.length - tvN));
  let tv = 0;
  for (let i = 1; i < uTail.length; i++) tv += Math.abs(uTail[i] - uTail[i - 1]);

  return { t, xs, xds, ss, tReach, band, rmsX, tv };
}

function clamp01(z: number): number {
  if (z > 1) return 1;
  if (z < -1) return -1;
  return z;
}

export function SlidingModeExplorer() {
  const [lam, setLam] = useState(3.0);
  const [K, setK] = useState(2.0);
  const [phi, setPhi] = useState(0.05);
  const [D, setD] = useState(0.3);
  const [law, setLaw] = useState<Law>("sat");

  const sim = useMemo(
    () => simulate(lam, K, phi, D, law),
    [lam, K, phi, D, law]
  );

  const phaseOption = useMemo<EChartsOption>(() => {
    const traj = sim.t.map((_, i) => [sim.xs[i], sim.xds[i]] as [number, number]);
    const surf: [number, number][] = [];
    for (let xv = X_MIN; xv <= X_MAX + 1e-9; xv += 0.1) {
      const yv = -lam * xv;
      if (yv >= XD_MIN && yv <= XD_MAX) surf.push([xv, yv]);
    }
    return {
      animation: false,
      grid: { left: 50, right: 15, top: 35, bottom: 40 },
      legend: { top: 3, textStyle: { fontSize: 11 } },
      xAxis: {
        type: "value",
        min: X_MIN,
        max: X_MAX,
        name: "x",
        nameLocation: "middle",
        nameGap: 25,
      },
      yAxis: {
        type: "value",
        min: XD_MIN,
        max: XD_MAX,
        name: "x_dot",
        nameLocation: "middle",
        nameGap: 35,
      },
      series: [
        {
          type: "line",
          name: "相轨迹",
          showSymbol: false,
          lineStyle: { width: 1.6, color: "#2563eb" },
          data: traj,
        },
        {
          type: "line",
          name: "切换面 s=0",
          showSymbol: false,
          lineStyle: { width: 3, color: "#dc2626" },
          data: surf,
        },
      ],
    };
  }, [sim, lam]);

  const timeOption = useMemo<EChartsOption>(() => {
    const xData = sim.t.map((tt, i) => [tt, sim.xs[i]] as [number, number]);
    const sData = sim.t.map((tt, i) => [tt, sim.ss[i]] as [number, number]);
    return {
      animation: false,
      grid: { left: 50, right: 15, top: 35, bottom: 40 },
      legend: { top: 3, textStyle: { fontSize: 11 } },
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
        min: X_MIN,
        max: X_MAX,
        name: "幅值",
        nameLocation: "middle",
        nameGap: 35,
      },
      series: [
        {
          type: "line",
          name: "x(t)",
          showSymbol: false,
          lineStyle: { width: 2, color: "#16a34a" },
          data: xData,
        },
        {
          type: "line",
          name: "s(t)",
          showSymbol: false,
          lineStyle: { width: 1.4, color: "#9333ea" },
          data: sData,
        },
      ],
    };
  }, [sim]);

  const phaseRef = useECharts(phaseOption);
  const timeRef = useECharts(timeOption);

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
        滑模探索器：x&#775; = -2x&#775; - sin(x) + u + D·sin(5t)，s = x&#775; + λx，
        u = u_eq - K·切换项（STA 时含积分项）
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 18,
          marginBottom: 10,
          alignItems: "center",
        }}
      >
        {(Object.keys(LAW_LABEL) as Law[]).map((l) => (
          <button key={l} style={btn(law === l)} onClick={() => setLaw(l)}>
            {LAW_LABEL[l]}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 12 }}>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          λ = {lam.toFixed(1)}
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={lam}
            onChange={(e) => setLam(Number(e.target.value))}
            style={{ width: 150 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          K = {K.toFixed(1)}
          <input
            type="range"
            min={0.5}
            max={8}
            step={0.5}
            value={K}
            onChange={(e) => setK(Number(e.target.value))}
            style={{ width: 150 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          Φ = {phi.toFixed(2)}
          <input
            type="range"
            min={0.01}
            max={0.3}
            step={0.01}
            value={phi}
            onChange={(e) => setPhi(Number(e.target.value))}
            disabled={law === "sgn" || law === "sta"}
            style={{ width: 150, opacity: law === "sgn" || law === "sta" ? 0.4 : 1 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          D = {D.toFixed(2)}
          <input
            type="range"
            min={0}
            max={0.6}
            step={0.05}
            value={D}
            onChange={(e) => setD(Number(e.target.value))}
            style={{ width: 150 }}
          />
        </label>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <div ref={phaseRef} style={{ width: "48%", minWidth: 300, height: 320 }} />
        <div ref={timeRef} style={{ width: "48%", minWidth: 300, height: 320 }} />
      </div>

      <div style={{ fontSize: 13, color: "#475569", marginTop: 8 }}>
        {Number.isNaN(sim.tReach) ? (
          <span style={{ color: "#dc2626" }}>
            滑动未建立：K={K.toFixed(1)} 盖不住扰动（需要 K &gt; D = {D.toFixed(2)}
            且有裕度）。把 K 调大或把 D 调小。
          </span>
        ) : (
          <>
            到达时间 t<sub>r</sub> ≈ <strong>{sim.tReach.toFixed(2)} s</strong>
            ；滑动段 max|s| = <strong>{sim.band.toExponential(2)}</strong>
            ；末 1 s 的 rms|x| = <strong>{sim.rmsX.toExponential(2)}</strong>
            ；末 2 s 控制量总变差 TV(u) ={" "}
            <strong>{sim.tv.toFixed(1)}</strong>。
            {law === "sgn"
              ? " 理想切换的 max|s| 只是定步长仿真的数值带（正比于步长），它真正的代价是 TV(u)：换向次数随步长细化发散。"
              : law === "sta"
              ? " 超螺旋用积分项换连续性：TV(u) 小且稳态精度高，但到达通常更慢。"
              : ` 边界层把切换变成线性区：max|s| 的量级由 Φ·D/K ≈ ${((phi * D) / K).toExponential(2)} 决定，稳态精度约 max|s|/λ。`}
            {D > K
              ? " 当前 D > K，鲁棒裕度为负，滑动随时可能被扰动打断。"
              : ""}
          </>
        )}
      </div>
    </div>
  );
}
