"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

import { stateSpaceResponse } from "@/lib/state-space-response";

export function StateSpaceExplorer() {
  const [x0, setX0] = useState(0.1);
  const d = useMemo(() => Array.from({ length: 601 }, (_, i) => ({ t: i / 200, ...stateSpaceResponse(x0, i / 200) })), [x0]);
  const reading = stateSpaceResponse(x0, 1);
  const option = useMemo(() => ({
    tooltip: { trigger: "axis" as const },
    legend: { top: 0, textStyle: { fontSize: 11 }, data: ["零输入", "零状态", "全响应"] },
    grid: { top: 45, left: 58, right: 22, bottom: 45 },
    xAxis: { type: "value" as const, name: "t (s)", min: 0, max: 3 },
    yAxis: { type: "value" as const, name: "位移 (m)", min: -0.16, max: 0.24 },
    series: [
      { name: "零输入", type: "line" as const, data: d.map(p => [p.t, p.free]), itemStyle: { color: "#dc2626" }, lineStyle: { type: "dashed" as const }, symbol: "none" },
      { name: "零状态", type: "line" as const, data: d.map(p => [p.t, p.step]), itemStyle: { color: "#2563eb" }, lineStyle: { type: "dashed" as const }, symbol: "none" },
      { name: "全响应", type: "line" as const, data: d.map(p => [p.t, p.total]), itemStyle: { color: "#111827" }, lineStyle: { width: 2.5 }, symbol: "none" },
    ],
    animation: false,
  }), [d]);
  const ref = useECharts(option);
  return (
    <section aria-label="状态响应分解实验" style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
      <strong>同一模型的零输入、零状态与全响应</strong>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
        <label htmlFor="state-space-initial">初始位移 (m)</label>
        <input id="state-space-initial" type="range" min={0} max={0.2} step={0.01} value={x0} onChange={e => setX0(Number(e.target.value))} style={{ flex: "1 1 120px", minWidth: 80 }} />
        <output>{x0.toFixed(2)}</output>
        <button onClick={() => setX0(0.1)} style={{ padding: "5px 10px", border: "1px solid #94a3b8", borderRadius: 6 }}>恢复默认</button>
      </div>
      <div ref={ref} style={{ height: 360, width: "100%", minWidth: 0 }} />
      <div style={{ padding: 12, background: "#f8fafc", color: "#0f172a", borderRadius: 8, fontSize: 14, lineHeight: 1.9 }}>
        m=250 kg，c=500 N·s/m，k=16000 N/m，F=1000 N阶跃，初始速度为零。<br />
        ωn={reading.wn.toFixed(2)} rad/s，ζ={reading.zeta.toFixed(3)}；解析终值={reading.limit.toFixed(4)} m（并非3s末样值）。<br />
        t=1s：零输入={reading.free.toFixed(6)} m；零状态={reading.step.toFixed(6)} m；全响应={reading.total.toFixed(6)} m。<br />
        两条虚线逐点相加为黑实线；三条线是同一模型的响应分解，不是三种控制器。坐标轴固定，图示区间0–3s。
      </div>
    </section>
  );
}
