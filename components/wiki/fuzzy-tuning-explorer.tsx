"use client";

import { useMemo, useState } from "react";
import { useECharts } from "./use-echarts";
import type { EChartsOption } from "echarts";

type Triple = [number, number, number];

const N_LABELS = ["NB", "NS", "ZO", "PS", "PB"];
const DEG = Math.PI / 180;

function partition(lo: number, hi: number, n: number): Triple[] {
  const ctr: number[] = [];
  for (let i = 0; i < n; i++) ctr.push(lo + ((hi - lo) * i) / (n - 1));
  const out: Triple[] = [];
  for (let i = 0; i < n; i++) {
    const a = i === 0 ? lo : (ctr[i - 1] + ctr[i]) / 2;
    const c = i === n - 1 ? hi : (ctr[i] + ctr[i + 1]) / 2;
    out.push([a, ctr[i], c]);
  }
  return out;
}

function trimf(x: number, a: number, b: number, c: number): number {
  if (x <= a) return a === b ? 1 : 0;
  if (x >= c) return b === c ? 1 : 0;
  return x <= b ? (x - a) / (b - a) : (c - x) / (c - b);
}

function mamdaniInfer(
  e: number,
  de: number,
  eParams: Triple[],
  deParams: Triple[],
  uParams: Triple[],
  rules: number[][]
): number {
  const n = eParams.length;
  const eMu: number[] = [];
  const deMu: number[] = [];
  for (let i = 0; i < n; i++) {
    eMu.push(trimf(e, eParams[i][0], eParams[i][1], eParams[i][2]));
    deMu.push(trimf(de, deParams[i][0], deParams[i][1], deParams[i][2]));
  }

  const uLo = uParams[0][0];
  const uHi = uParams[n - 1][2];
  const gridN = 201;
  const ug: number[] = [];
  for (let k = 0; k < gridN; k++) ug.push(uLo + ((uHi - uLo) * k) / (gridN - 1));

  const agg = new Array<number>(gridN).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const w = Math.min(eMu[i], deMu[j]);
      if (w > 0) {
        const k = rules[i][j];
        const [a, b, c] = uParams[k];
        for (let m = 0; m < gridN; m++) {
          const mf = trimf(ug[m], a, b, c);
          const clipped = Math.min(w, mf);
          if (clipped > agg[m]) agg[m] = clipped;
        }
      }
    }
  }

  let num = 0;
  let den = 0;
  for (let k = 1; k < gridN; k++) {
    const du = ug[k] - ug[k - 1];
    num += 0.5 * (ug[k] * agg[k] + ug[k - 1] * agg[k - 1]) * du;
    den += 0.5 * (agg[k] + agg[k - 1]) * du;
  }
  return den > 1e-14 ? num / den : 0;
}

function makeRules(n: number): number[][] {
  const rules: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      row.push(Math.max(0, Math.min(n - 1, Math.round((i + j) / 2))));
    }
    rules.push(row);
  }
  return rules;
}

interface SimResult {
  t: number[];
  theta: number[];
  u: number[];
  rms: number;
  final: number;
  tvU: number;
}

function simulate(
  theta0: number,
  T: number,
  dt: number,
  eParams: Triple[],
  deParams: Triple[],
  uParams: Triple[],
  rules: number[][],
  Ge: number,
  Gce: number,
  Gu: number
): SimResult {
  const N = Math.floor(T / dt);
  const t: number[] = [];
  const theta: number[] = [];
  const uArr: number[] = [];

  let th = theta0;
  let thd = 0;
  t.push(0);
  theta.push(th);
  uArr.push(0);

  for (let i = 0; i < N; i++) {
    const eScaled = -th * Ge;
    const deScaled = -thd * Gce;
    const uRaw = mamdaniInfer(eScaled, deScaled, eParams, deParams, uParams, rules);
    const u = Math.max(-15, Math.min(15, uRaw * Gu));

    const thetaDdot = 19.6 * Math.sin(th) + 4.0 * u;
    thd += thetaDdot * dt;
    th += thd * dt;

    t.push((i + 1) * dt);
    theta.push(th);
    uArr.push(u);
  }

  let sumSq = 0;
  for (let i = 0; i < theta.length; i++) sumSq += theta[i] * theta[i];
  const rms = Math.sqrt(sumSq / theta.length) / DEG;

  const finalAngle = theta[theta.length - 1] / DEG;

  let tvU = 0;
  for (let i = 1; i < uArr.length; i++) tvU += Math.abs(uArr[i] - uArr[i - 1]);

  return { t, theta, u: uArr, rms, final: finalAngle, tvU };
}

export default function FuzzyTuningExplorer() {
  const [n, setN] = useState(5);
  const [Ge, setGe] = useState(2.0);
  const [Gce, setGce] = useState(0.5);
  const [Gu, setGu] = useState(12.0);

  const eParams = useMemo(() => partition(-1, 1, n), [n]);
  const deParams = useMemo(() => partition(-1, 1, n), [n]);
  const uParams = useMemo(() => partition(-1, 1, n), [n]);
  const rules = useMemo(() => makeRules(n), [n]);

  const T = 6.0;
  const dt = 0.002;
  const theta0 = 20 * DEG;

  const result = useMemo(
    () => simulate(theta0, T, dt, eParams, deParams, uParams, rules, Ge, Gce, Gu),
    [eParams, deParams, uParams, rules, Ge, Gce, Gu, theta0]
  );

  const thetaOption = useMemo<EChartsOption>(() => {
    const thetaDeg = result.theta.map((v) => v / DEG);
    return {
      animation: false,
      grid: { left: 60, right: 20, top: 40, bottom: 40 },
      xAxis: {
        type: "category",
        data: result.t.map((v) => v.toFixed(2)),
        name: "时间 (s)",
        nameLocation: "middle",
        nameGap: 28,
        axisLabel: {
          interval: Math.floor(result.t.length / 6),
          formatter: (v: string) => parseFloat(v).toFixed(1),
        },
      },
      yAxis: {
        type: "value",
        name: "θ (°)",
        min: -30,
        max: 30,
      },
      series: [
        {
          type: "line",
          data: thetaDeg,
          showSymbol: false,
          lineStyle: { width: 1.5, color: "#2563eb" },
        },
      ],
      title: {
        text: "闭环响应 θ(t)",
        left: "center",
        textStyle: { fontSize: 14, fontWeight: "normal" },
      },
    };
  }, [result]);

  const uOption = useMemo<EChartsOption>(() => {
    return {
      animation: false,
      grid: { left: 60, right: 20, top: 40, bottom: 40 },
      xAxis: {
        type: "category",
        data: result.t.map((v) => v.toFixed(2)),
        name: "时间 (s)",
        nameLocation: "middle",
        nameGap: 28,
        axisLabel: {
          interval: Math.floor(result.t.length / 6),
          formatter: (v: string) => parseFloat(v).toFixed(1),
        },
      },
      yAxis: {
        type: "value",
        name: "u (N·m)",
        min: -16,
        max: 16,
      },
      series: [
        {
          type: "line",
          data: result.u,
          showSymbol: false,
          lineStyle: { width: 1.5, color: "#dc2626" },
        },
      ],
      title: {
        text: "控制量 u(t)",
        left: "center",
        textStyle: { fontSize: 14, fontWeight: "normal" },
      },
    };
  }, [result]);

  const thetaChartRef = useECharts(thetaOption);
  const uChartRef = useECharts(uOption);

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>
        模糊 PD 控制器参数调定
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
        <div style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
            语言值数量 n = {n}
          </label>
          <input
            type="range"
            min={3}
            max={9}
            step={2}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <div style={{ fontSize: 11, color: "#6b7280" }}>
            {N_LABELS.slice(0, n).join(", ")}
          </div>
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
            Ge（误差缩放）= {Ge.toFixed(1)}
          </label>
          <input
            type="range"
            min={0.5}
            max={5.0}
            step={0.1}
            value={Ge}
            onChange={(e) => setGe(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
            Gce（微分缩放）= {Gce.toFixed(1)}
          </label>
          <input
            type="range"
            min={0.1}
            max={2.0}
            step={0.1}
            value={Gce}
            onChange={(e) => setGce(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 4 }}>
            Gu（输出缩放）= {Gu.toFixed(0)}
          </label>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={Gu}
            onChange={(e) => setGu(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 16,
          padding: "8px 12px",
          background: "#f9fafb",
          borderRadius: 6,
          fontSize: 13,
        }}
      >
        <span>
          <strong>rms θ:</strong> {result.rms.toFixed(2)}°
        </span>
        <span>
          <strong>稳态:</strong> {result.final.toFixed(2)}°
        </span>
        <span>
          <strong>TV(u):</strong> {result.tvU.toFixed(0)}
        </span>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div ref={thetaChartRef} style={{ flex: "1 1 400px", height: 280 }} />
        <div ref={uChartRef} style={{ flex: "1 1 400px", height: 280 }} />
      </div>

      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
        初始条件 θ(0) = 20°。注意：即使调节参数，Mamdani 模糊 PD 也很难将摆稳定到 ±1° 以内——这是增益结构的限制，不是参数没调好。
      </div>
    </div>
  );
}
