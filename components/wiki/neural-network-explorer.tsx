"use client";

import { useMemo, useState } from "react";
import { useECharts } from "./use-echarts";
import type { EChartsOption } from "echarts";

const DEG = Math.PI / 180;

const W1_SUP = [
  [0.0924, 0.0246], [0.1112, 0.7697], [-0.1221, -0.1353],
  [0.6385, 0.1783], [-0.0516, 0.2666], [-0.1369, -0.1648],
  [-0.1153, -0.5649], [-0.7845, -0.0875], [-0.3866, 0.0838],
  [-0.2685, -0.4187],
];
const B1_SUP = [0.0308, 0.0162, 0.0085, -0.0660, -0.0377, 0.0085, 0.0046, 0.0606, -0.0300, 0.0672];
const W2_SUP = [[0.7709, -0.1240, -0.2337, -0.4654, -0.3772, -0.1530, -0.3423, 0.0383, -0.3566, -0.1787]];
const B2_SUP = [-0.0576];

const W1_ES = [
  [0.0892, 0.0489], [0.1099, 0.7682], [-0.1216, -0.1400],
  [0.6380, 0.1743], [-0.0530, 0.2639], [-0.1367, -0.1673],
  [-0.1182, -0.5650], [-0.7840, -0.0861], [-0.3912, 0.0783],
  [-0.2676, -0.4191],
];
const B1_ES = [0.0344, 0.0166, 0.0093, -0.0658, -0.0389, 0.0075, 0.0039, 0.0583, -0.0306, 0.0682];
const W2_ES = [[0.7695, -0.1149, -0.2382, -0.4631, -0.3718, -0.1566, -0.3495, 0.0331, -0.3544, -0.1845]];
const B2_ES = [-0.0525];

const E_MEAN = -0.001608;
const E_STD = 0.045776;
const EDOT_MEAN = 0.051381;
const EDOT_STD = 0.239134;
const U_MAX = 15.0;

function nnForward(
  e: number, edot: number,
  W1: number[][], b1: number[], W2: number[][], b2: number[]
): number {
  const x1 = (e - E_MEAN) / E_STD;
  const x2 = (edot - EDOT_MEAN) / EDOT_STD;
  const h: number[] = [];
  for (let i = 0; i < 10; i++) {
    const z = W1[i][0] * x1 + W1[i][1] * x2 + b1[i];
    h.push(Math.tanh(z));
  }
  let out = b2[0];
  for (let j = 0; j < 10; j++) out += W2[0][j] * h[j];
  return U_MAX * Math.tanh(out);
}

function pidCtrl(e: number, de: number, integral: number): number {
  return Math.max(-15, Math.min(15, 40 * e + 10 * integral + 6 * de));
}

function simulate(
  theta0: number, T: number, dt: number,
  ctrlFn: (e: number, de: number, integral: number) => number
): { theta: number[]; u: number[] } {
  const N = Math.round(T / dt);
  let theta = theta0;
  let thetad = 0;
  let integral = 0;
  const ths = [theta];
  const us = [0];
  for (let k = 0; k < N; k++) {
    const e = -theta;
    const de = -thetad;
    integral += e * dt;
    let u = ctrlFn(e, de, integral);
    u = Math.max(-15, Math.min(15, u));
    const thetaDDot = 19.6 * Math.sin(theta) + 4.0 * u;
    thetad += thetaDDot * dt;
    theta += thetad * dt;
    ths.push(theta);
    us.push(u);
  }
  return { theta: ths, u: us };
}

type CtrlType = "pid" | "nn-sup" | "nn-es";

export default function NeuralNetworkExplorer() {
  const [ctrlType, setCtrlType] = useState<CtrlType>("nn-sup");
  const [theta0Deg, setTheta0Deg] = useState(20);

  const result = useMemo(() => {
    const T = 6.0;
    const dt = 0.005;
    const theta0 = theta0Deg * DEG;
    const t: number[] = [];
    for (let k = 0; k <= Math.round(T / dt); k++) t.push(k * dt);

    const pidRes = simulate(theta0, T, dt, pidCtrl);

    let nnRes: { theta: number[]; u: number[] };
    if (ctrlType === "nn-sup") {
      nnRes = simulate(theta0, T, dt, (e, de) => nnForward(e, de, W1_SUP, B1_SUP, W2_SUP, B2_SUP));
    } else {
      nnRes = simulate(theta0, T, dt, (e, de) => nnForward(e, de, W1_ES, B1_ES, W2_ES, B2_ES));
    }

    const nnName = ctrlType === "nn-sup" ? "NN-Supervised" : "NN-ES";

    const pidRms = Math.sqrt(pidRes.theta.reduce((s, v) => s + v * v, 0) / pidRes.theta.length) / DEG;
    const nnRms = Math.sqrt(nnRes.theta.reduce((s, v) => s + v * v, 0) / nnRes.theta.length) / DEG;
    const pidTV = pidRes.u.reduce((s, v, i) => i === 0 ? 0 : s + Math.abs(v - pidRes.u[i - 1]), 0);
    const nnTV = nnRes.u.reduce((s, v, i) => i === 0 ? 0 : s + Math.abs(v - nnRes.u[i - 1]), 0);

    return { t, pidRes, nnRes, nnName, pidRms, nnRms, pidTV, nnTV };
  }, [ctrlType, theta0Deg]);

  const thetaOption = useMemo<EChartsOption>(() => ({
    animation: false,
    title: { text: "闭环响应 θ(t)", left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" },
    legend: { data: ["PID", result.nnName], bottom: 0 },
    grid: { left: 60, right: 30, top: 40, bottom: 40 },
    xAxis: { type: "category", data: result.t.map(v => v.toFixed(2)), name: "时间 (s)", nameLocation: "middle", nameGap: 25 },
    yAxis: { type: "value", name: "θ (deg)", min: -50, max: 50, nameLocation: "middle", nameGap: 40 },
    series: [
      {
        name: "PID", type: "line", data: result.pidRes.theta.map(v => v / DEG),
        lineStyle: { width: 2, color: "#5470c1" }, symbol: "none",
      },
      {
        name: result.nnName, type: "line", data: result.nnRes.theta.map(v => v / DEG),
        lineStyle: { width: 2, color: ctrlType === "nn-sup" ? "#ee6666" : "#91cc75" }, symbol: "none",
      },
    ],
  }), [result, ctrlType]);

  const uOption = useMemo<EChartsOption>(() => ({
    animation: false,
    title: { text: "控制量 u(t)", left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" },
    legend: { data: ["PID", result.nnName], bottom: 0 },
    grid: { left: 60, right: 30, top: 40, bottom: 40 },
    xAxis: { type: "category", data: result.t.map(v => v.toFixed(2)), name: "时间 (s)", nameLocation: "middle", nameGap: 25 },
    yAxis: { type: "value", name: "u (N·m)", min: -16, max: 16, nameLocation: "middle", nameGap: 40 },
    series: [
      {
        name: "PID", type: "line", data: result.pidRes.u,
        lineStyle: { width: 2, color: "#5470c1" }, symbol: "none",
      },
      {
        name: result.nnName, type: "line", data: result.nnRes.u,
        lineStyle: { width: 2, color: ctrlType === "nn-sup" ? "#ee6666" : "#91cc75" }, symbol: "none",
      },
    ],
  }), [result, ctrlType]);

  const thetaRef = useECharts(thetaOption);
  const uRef = useECharts(uOption);

  return (
    <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, padding: 16, margin: "16px 0" }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>神经网络控制器交互探索</h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
        <div style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>
            控制器类型
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["pid", "nn-sup", "nn-es"] as CtrlType[]).map((ct) => (
              <button
                key={ct}
                onClick={() => setCtrlType(ct)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 4,
                  border: ctrlType === ct ? "2px solid #1976d2" : "1px solid #ccc",
                  background: ctrlType === ct ? "#e3f2fd" : "#fff",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: ctrlType === ct ? 600 : 400,
                }}
              >
                {ct === "pid" ? "PID" : ct === "nn-sup" ? "NN-Sup" : "NN-ES"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", marginBottom: 4, fontSize: 13, fontWeight: 600 }}>
            初始角度 θ₀ = {theta0Deg}°
          </label>
          <input
            type="range"
            min={5}
            max={45}
            step={1}
            value={theta0Deg}
            onChange={(e) => setTheta0Deg(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12, fontSize: 13 }}>
        <span style={{ padding: "2px 8px", borderRadius: 4, background: "#e8f5e9" }}>
          PID: rms = {result.pidRms.toFixed(2)}°, TV(u) = {result.pidTV.toFixed(1)}
        </span>
        <span style={{ padding: "2px 8px", borderRadius: 4, background: ctrlType === "nn-sup" ? "#ffebee" : "#e8f5e9" }}>
          {result.nnName}: rms = {result.nnRms.toFixed(2)}°, TV(u) = {result.nnTV.toFixed(1)}
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <div ref={thetaRef} style={{ flex: "1 1 400px", height: 300 }} />
        <div ref={uRef} style={{ flex: "1 1 400px", height: 300 }} />
      </div>
    </div>
  );
}
