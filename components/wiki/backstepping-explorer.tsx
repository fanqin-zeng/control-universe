"use client";

import { useMemo, useState } from "react";
import { useECharts } from "./use-echarts";
import type { EChartsOption } from "echarts";

import {simulateBackstepping, refSignal, LAW_LABEL, type RefKind, type Law, type SimResult} from "@/lib/backstepping";
const G1=1,T_STEP=10,T_SINE=12,ZETA_TARGET=.7;

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
      out[law] = simulateBackstepping(law, kind, k1, k2, m);
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
    for (let kp = G1; kp <= 70; kp += 0.25) {
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
        max: 70,
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
      data-backstepping-explorer
      style={{
        border: "1px solid #d1d5db",
        borderRadius: 8,
        margin: "24px 0",
        padding: 16,
        background: "#fff",
        color: "#1e293b",
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
            aria-label="反步k1"
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

      <button onClick={()=>{setK1(3);setK2(5);setM(1);setKind("step");setShow({bs:true,fl:true,fl7:true});}} style={{padding:"6px 10px",marginBottom:12}}>恢复反步默认</button>
      <p data-backstepping-reading style={{fontSize:13,overflowWrap:"anywhere"}}>t={runs.bs.lastTime.toFixed(1)}s；rms(e)={runs.bs.rmsE.toExponential(6)}；max|u|={runs.bs.maxU.toFixed(6)}；等价残差={runs.bs.equivalenceResidual.toExponential(3)}。</p>
      <p style={{fontSize:13}}>dt=0.0005s；控制每步更新并零阶保持，植物以RK4积分；阶跃尾窗4&lt;t≤10，正弦尾窗7.2&lt;t≤12。所有节点计算指标，图每4步取点；未限幅。阻尼比是标称连续误差方程的参数，非扰动曲线的实测值。</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,280px),1fr))",gap:16}}>
        <div ref={trackRef} style={{width:"100%",minWidth:0,height:330}} />
        <div ref={regionRef} style={{width:"100%",minWidth:0,height:330}} />
      </div>

      <div style={{ fontSize: 13, color: "#475569", marginTop: 8 }}>
        {runs.bs.diverged ? (
          <span style={{ color: "#dc2626" }}>
            轨迹达到数值停止条件；本窗口不足以判断连续系统稳定性，请查看实际终时。
          </span>
        ) : (
          <>
            <strong>max|u_反步 − u_反馈线性化| = {maxDiff.toExponential(1)}</strong>
            ：两条曲线在浮点舍入量级内完全重合，核验本节二阶配方与对应反馈线性化的代数等价，
            增益映射就是 Kp = 1 + k₁k₂、Kv = k₁ + k₂。
            {reachable
              ? ` 当前 (Kp, Kv) = (${Kp.toFixed(2)}, ${Kv.toFixed(2)}) 在可达域内（边界 Kv ≥ 2√(Kp−1) = ${(2 * Math.sqrt(Kp - G1)).toFixed(2)}）。`
              : " 当前增益落在可达域外（理论上不会发生，因为 k₁,k₂ 取正实数）。"}
            {zetaMin > ZETA_TARGET
              ? ` 但同一刚度下反步能达到的最小阻尼是 ζ_min = ${zetaMin.toFixed(3)} > 0.7，所以绿色的 ζ=0.7 目标点落在红色边界下方——这组单位权重配方给不出该标称极点；其它权重或设计需另推。`
              : ` 当前刚度较低（Kp = ${Kp.toFixed(2)}），ζ_min = ${zetaMin.toFixed(3)} 已经小于 0.7，ζ=0.7 目标可达；把 k₁k₂ 调大再看，ζ_min 会迅速逼近 1。`}
            {m < 1
              ? ` m = ${m.toFixed(2)} 时两律仍使用同一个估计模型。误差大小看当前读数；m减小并不保证每个有限窗指标都单调变化。`
              : ""}
          </>
        )}
      </div>
    </div>
  );
}
