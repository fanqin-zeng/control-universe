"use client";

import { useMemo, useState } from "react";
import { useECharts } from "./use-echarts";
import type { EChartsOption } from "echarts";

import { simulateMrac, type RefKind } from "@/lib/mrac";
const T = 40, K1S = -1, K2S = 5/3;
const manifoldK2 = (k1: number) => 2/3-k1;
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

export function MracExplorer() {
  const [kind, setKind] = useState<RefKind>("step");
  const [gamma, setGamma] = useState(50);
  const [sigma, setSigma] = useState(0);
  const [noiseStd, setNoiseStd] = useState(0);
  const [unmodeled, setUnmodeled] = useState(false);

  const sim = useMemo(
    () => simulateMrac(kind, gamma, sigma, noiseStd, unmodeled),
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
        无噪声时，自适应律 dk_i/dt = −γ·e·φ_i − σγ·k_i（φ = [xp, r]，e = xp − xm）。
        理想增益 k* = (−1, 5/3)；紫色虚线是直流增益匹配流形 k₂ = (2 − 3k₁)/3——
        阶跃稳态只约束这条直线，不唯一决定理想点。连续反馈以RK4计算，dt=0.001秒，参考在各子步更新；每25步绘图一次，指标不抽稀。坐标范围固定，超出范围的数值请看读数。
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
        <label style={{ fontSize: 13, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
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
          噪声名义幅度 = {noiseStd.toFixed(2)}
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

      <button style={btn(false)} onClick={() => { setKind("step"); setGamma(50); setSigma(0); setNoiseStd(0); setUnmodeled(false); }}>恢复默认</button>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        {stat("rms|e| 末段", sci(sim.rmsE))}
        {stat("k₁(末)", sim.k1End.toFixed(4), converged ? "#16a34a" : undefined)}
        {stat("k₂(末)", sim.k2End.toFixed(4), converged ? "#16a34a" : undefined)}
        {stat("距理想点 |k̃|", sim.distIdeal.toExponential(2))}
        {stat("匹配直线纵向偏差", sim.distManifold.toExponential(1), onManifold ? "#9333ea" : undefined)}
        {stat("窗口 λ_min", (sim.peLmin === null ? "窗口不足" : sim.peLmin.toExponential(2)), (sim.peLmin !== null && sim.peLmin < 1e-8) ? "#dc2626" : "#16a34a")}
        {stat("max|u|", sim.maxU.toFixed(2))}
        {stat(
          "结局",
          sim.divT === null ? "完成40s" : `触阈值 t=${sim.divT.toFixed(3)} s`,
          sim.divT === null ? "#16a34a" : "#dc2626"
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 12 }}>
        <div ref={timeRef} style={{ width: "100%", minWidth: 0, height: 300 }} />
        <div ref={errRef} style={{ width: "100%", minWidth: 0, height: 300 }} />
        <div ref={planeRef} style={{ width: "32%", minWidth: 280, height: 300 }} />
      </div>

      <div style={{ fontSize: 13, color: "#475569", marginTop: 10, lineHeight: 1.7 }}>
        实际计算到 {sim.endTime.toFixed(3)} s。末段RMS用 t &gt; 32 s 的全部计算节点；提前停止且未到此窗口时显示“—”。
        {sim.divT !== null ? " 状态触及数值停止阈值，不再外推曲线。" : " 完成40秒不是无限时间有界性的证明。"}
        窗口 λ_min 取起点0至19秒、长度约2π秒的20个完整窗口；窗口不足不计为零。
        有限个正值不能证明对所有未来窗口都成立的PE条件。阶跃稳态的回归量只有一个方向，跟踪好不等于参数接近理想点。
        {sigma > 0 ? " 泄漏会改变平衡，不能据此保证本噪声或失配模型稳定。" : ""}
        {noiseStd > 0 ? " 测得误差用于更新，图中显示真实跟踪误差；噪声名义幅度经时间常数0.01秒的滤波器近似实现。" : ""}
      </div>
    </div>
  );
}
