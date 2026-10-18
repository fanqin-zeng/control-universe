"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { useECharts } from "./use-echarts";
import type { EChartsOption } from "echarts";

import {analyse, N_BRANCH, type NlType} from "@/lib/nonlinearity-model";

type Spec = {
  name: string;
  formula: string;
  memory: boolean;
  pLabel: string;
  pMin: number;
  pMax: number;
  pStep: number;
  pDef: number;
  aMin: number;
  aMax: number;
  aStep: number;
  aDef: number;
  uWin: [number, number];
  yWin: [number, number];
};

const SPEC: Record<NlType, Spec> = {
  saturation: {
    name: "饱和",
    formula: "y = clip(u, −M, M)",
    memory: false,
    pLabel: "M（限幅值）",
    pMin: 0.2,
    pMax: 1.5,
    pStep: 0.1,
    pDef: 1.0,
    aMin: 0.2,
    aMax: 4.0,
    aStep: 0.1,
    aDef: 2.0,
    uWin: [-4.2, 4.2],
    yWin: [-1.8, 1.8],
  },
  deadzone: {
    name: "死区",
    formula: "y = sign(u)·max(|u| − a, 0)",
    memory: false,
    pLabel: "a（死区半宽）",
    pMin: 0,
    pMax: 1.5,
    pStep: 0.1,
    pDef: 0.3,
    aMin: 0.2,
    aMax: 3.0,
    aStep: 0.1,
    aDef: 1.5,
    uWin: [-3.2, 3.2],
    yWin: [-3.2, 3.2],
  },
  relay: {
    name: "理想继电器",
    formula: "y = M·sign(u)",
    memory: false,
    pLabel: "M（输出幅值）",
    pMin: 0.2,
    pMax: 1.5,
    pStep: 0.1,
    pDef: 1.0,
    aMin: 0.2,
    aMax: 3.0,
    aStep: 0.1,
    aDef: 1.0,
    uWin: [-3.2, 3.2],
    yWin: [-1.8, 1.8],
  },
  cubic: {
    name: "三次硬化",
    formula: "y = u + β·u³",
    memory: false,
    pLabel: "β（三次系数）",
    pMin: 0,
    pMax: 0.2,
    pStep: 0.02,
    pDef: 0.2,
    aMin: 0.2,
    aMax: 2.5,
    aStep: 0.1,
    aDef: 1.0,
    uWin: [-2.7, 2.7],
    yWin: [-6, 6],
  },
  hysteresis: {
    name: "滞环",
    formula: "y = k·u ± c（k = 1，符号由 du 的方向决定）",
    memory: true,
    pLabel: "c（滞环半宽）",
    pMin: 0.05,
    pMax: 0.6,
    pStep: 0.05,
    pDef: 0.2,
    aMin: 0.2,
    aMax: 3.0,
    aStep: 0.05,
    aDef: 1.5,
    uWin: [-3.2, 3.2],
    yWin: [-4, 4],
  },
  backlash: {
    name: "间隙",
    formula: "路径依赖递推，半宽 b（k = 1）",
    memory: true,
    pLabel: "b（间隙半宽）",
    pMin: 0.05,
    pMax: 0.6,
    pStep: 0.05,
    pDef: 0.3,
    aMin: 0.2,
    aMax: 2.5,
    aStep: 0.1,
    aDef: 1.0,
    uWin: [-2.7, 2.7],
    yWin: [-2.7, 2.7],
  },
};

const ORDER: NlType[] = [
  "hysteresis",
  "backlash",
  "saturation",
  "deadzone",
  "relay",
  "cubic",
];

export function NonlinearityExplorer() {
  const [type, setType] = useState<NlType>("hysteresis");
  const [A, setA] = useState(SPEC.hysteresis.aDef);
  const [p, setP] = useState(SPEC.hysteresis.pDef);

  const spec = SPEC[type];
  const r = useMemo(() => analyse(type, A, p), [type, A, p]);

  const pick = (t: NlType) => {
    setType(t);
    setA(SPEC[t].aDef);
    setP(SPEC[t].pDef);
  };

  const loop: [number, number][] = useMemo(() => {
    const out: [number, number][] = [];
    for (let i = 0; i <= N_BRANCH; i++) out.push([r.uGrid[i], r.yRise[i]]);
    for (let i = N_BRANCH; i >= 0; i--) out.push([r.uGrid[i], r.yFall[i]]);
    return out;
  }, [r]);

  const waveU: [number, number][] = useMemo(
    () => r.th.map((t, i) => [t, r.uu[i]]),
    [r]
  );
  const waveY: [number, number][] = useMemo(
    () => r.th.map((t, i) => [t, r.yy[i]]),
    [r]
  );

  const curveOption: EChartsOption = useMemo(
    () => ({
      animation: false,
      grid: { top: 20, right: 18, bottom: 46, left: 52 },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "value",
        name: "输入 u",
        nameLocation: "middle",
        nameGap: 26,
        min: spec.uWin[0],
        max: spec.uWin[1],
      },
      yAxis: {
        type: "value",
        name: "输出 y",
        nameLocation: "middle",
        nameGap: 38,
        min: spec.yWin[0],
        max: spec.yWin[1],
      },
      series: [
        {
          name: "u–y 轨迹",
          type: "line",
          data: loop,
          showSymbol: false,
          lineStyle: { width: 2, color: "#1e40af" },
        },
      ],
    }),
    [loop, spec]
  );

  const timeOption: EChartsOption = useMemo(
    () => ({
      animation: false,
      grid: { top: 32, right: 18, bottom: 46, left: 52 },
      legend: { top: 0, data: ["输入 u(t)", "输出 y(t)"] },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "value",
        name: "相位 ωt (rad)",
        nameLocation: "middle",
        nameGap: 26,
        min: 0,
        max: 2 * Math.PI,
      },
      yAxis: {
        type: "value",
        name: "幅值",
        nameLocation: "middle",
        nameGap: 38,
        min: Math.min(spec.yWin[0], spec.uWin[0]),
        max: Math.max(spec.yWin[1], spec.uWin[1]),
      },
      series: [
        {
          name: "输入 u(t)",
          type: "line",
          data: waveU,
          showSymbol: false,
          lineStyle: { width: 1.5, color: "#94a3b8", type: "dashed" },
        },
        {
          name: "输出 y(t)",
          type: "line",
          data: waveY,
          showSymbol: false,
          lineStyle: { width: 2, color: "#dc2626" },
        },
      ],
    }),
    [waveU, waveY, spec]
  );

  const curveRef = useECharts(curveOption);
  const timeRef = useECharts(timeOption);

  return (
    <div
      aria-label="非线性类型探索"
      className="not-prose"
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 8,
        margin: "24px 0",
        padding: 16,
        background: "#fff",
        color: "#0f172a",
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
        非线性类型探索器：输入 u = A·sin(ωt)，看 u–y 轨迹是单值曲线还是闭合环
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        {ORDER.map((t) => (
          <button
            key={t}
            aria-pressed={t === type}
            onClick={() => pick(t)}
            style={{
              fontSize: 13,
              padding: "5px 12px",
              borderRadius: 6,
              cursor: "pointer",
              border: t === type ? "1px solid #1e40af" : "1px solid #cbd5e1",
              background: t === type ? "#1e40af" : "#f8fafc",
              color: t === type ? "#fff" : "#334155",
            }}
          >
            {SPEC[t].name}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 13, color: "#334155", marginBottom: 12 }}>
        <strong>{spec.name}</strong>：{spec.formula}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginBottom: 12 }}>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          输入幅值 A = {A.toFixed(2)}
          <input
            aria-label="输入幅值"
            type="range"
            min={spec.aMin}
            max={spec.aMax}
            step={spec.aStep}
            value={A}
            onChange={(e) => setA(Number(e.target.value))}
            style={{ width: "100%", maxWidth: 200 }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          {spec.pLabel} = {p.toFixed(2)}
          <input
            aria-label="非线性参数"
            type="range"
            min={spec.pMin}
            max={spec.pMax}
            step={spec.pStep}
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
            style={{ width: "100%", maxWidth: 200 }}
          />
        </label>
      </div>

      <button onClick={() => pick("hysteresis")} style={{padding:6,marginBottom:12}}>恢复默认</button>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <div style={{ flex: "1 1 340px", minWidth: 0 }}>
          <div ref={curveRef} style={{ width: "100%", height: 320 }} />
        </div>
        <div style={{ flex: "1 1 340px", minWidth: 0 }}>
          <div ref={timeRef} style={{ width: "100%", height: 320 }} />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 8,
          marginTop: 12,
          fontSize: 13,
        }}
      >
        <div style={cellStyle}>
          <span style={labelStyle}>记忆性</span>
          <strong style={{ color: spec.memory ? "#b45309" : "#15803d" }}>
            {spec.memory ? "有记忆（可能形成回线）" : "无记忆（单值曲线）"}
          </strong>
        </div>
        <div style={cellStyle}>
          <span style={labelStyle}>环面积 ∮ y du</span>
          <strong>{r.area.toFixed(6)}</strong>
        </div>
        <div style={cellStyle}>
          <span style={labelStyle}>基波幅值 b₁</span>
          <strong>{r.b1.toFixed(6)}</strong>
        </div>
        <div style={cellStyle}>
          <span style={labelStyle}>三次谐波 b₃</span>
          <strong>{r.b3.toFixed(6)}</strong>
        </div>
        <div style={cellStyle}>
          <span style={labelStyle}>THD（2–25次）</span>
          <strong>{r.thd.toFixed(4)} %</strong>
        </div>
        <div style={cellStyle}>
          <span style={labelStyle}>max |y − u|</span>
          <strong>{r.maxDev.toFixed(6)}</strong>
        </div>
      </div>

      <div style={{ fontSize: 13, color: "#475569", marginTop: 10 }}>
        {spec.memory ? (
          <>本模型依赖输入历史；当前输入行程不一定足以形成明显回线。</>
        ) : (
          <>本模型是无记忆静态映射 y = φ(u)，往返轨迹重合。</>
        )}
        {type === "hysteresis" && (
          <>
            {" "}
            解析环面积 4cA = <strong>{(4 * p * A).toFixed(6)}</strong>，与实测一致；
            这是双支教学模型的几何面积；只有定义了共轭物理量及方向，才能解释为每周期的功。
          </>
        )}
        {type === "backlash" && (
          <>
            {" "}
            足幅换向空程 2b = <strong>{(2 * p).toFixed(2)}</strong>；换向后输入要走完这段空程输出才动，
            最大输出偏差不超过 b = <strong>{p.toFixed(2)}</strong>（见 max |y − u|）。
          </>
        )}
        {type === "saturation" && (
          <>
            {" "}
            A ≤ M 时 clip 从不触发，THD = 0，该次输入没有触发限幅；超过阈值后失真连续增加，不是阶跃跳变。
          </>
        )}
        {type === "deadzone" && (
          <>
            {" "}
            A ≤ a 时输出恒为 0，小信号被完全丢弃；是否产生静差或振荡还取决于完整闭环。
          </>
        )}
        {type === "relay" && (
          <>
            {" "}
            u = 0 处不连续，经典导数不存在；此处约定 u = 0 时取 +M，不能在跳变处直接求切线；
            基波 b₁ = 4M/π = <strong>{((4 * p) / Math.PI).toFixed(6)}</strong>。
          </>
        )}
        {type === "cubic" && (
          <>
            {" "}
            奇对称 → 只有奇次谐波；基波被抬高到 A + 3βA³/4 ={" "}
            <strong>{(A + (3 * p * A * A * A) / 4).toFixed(6)}</strong>
            ，等效增益随幅值增大——描述函数法的出发点。
          </>
        )}
      </div>
    </div>
  );
}

const cellStyle: CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  padding: "6px 10px",
  background: "#f8fafc",
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  color: "#64748b",
};
