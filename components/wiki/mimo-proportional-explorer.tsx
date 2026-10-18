"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "@/components/wiki/use-echarts";

import { simulateMimo } from "@/lib/mimo-model";
export { simulateMimo } from "@/lib/mimo-model";

export function MimoProportionalExplorer() {
  const [kp1, setKp1] = useState(2), [kp2, setKp2] = useState(2);
  const data = useMemo(() => simulateMimo(kp1, kp2), [kp1, kp2]);
  const option: EChartsOption = useMemo(() => ({
    animation:false,tooltip:{trigger:"axis",confine:true,valueFormatter:v=>Number(v).toFixed(6)},
    legend:{data:["y₁","y₂"],top:0},grid:{left:46,right:18,top:40,bottom:42},
    xAxis:{type:"value",min:0,max:10,name:"t (s)",nameLocation:"middle",nameGap:26},
    yAxis:{type:"value",min:-0.1,max:1.1,name:"输出"},
    series:[
      {name:"y₁",type:"line",showSymbol:false,data:data.points.map(p=>[p.t,p.y1]),itemStyle:{color:"#2563eb"},lineStyle:{color:"#2563eb"}},
      {name:"y₂",type:"line",showSymbol:false,data:data.points.map(p=>[p.t,p.y2]),itemStyle:{color:"#15803d"},lineStyle:{color:"#15803d"}},
    ],
  }),[data]);
  const controlOption: EChartsOption = useMemo(() => ({
    animation:false,tooltip:{trigger:"axis",confine:true,valueFormatter:v=>Number(v).toFixed(6)},
    legend:{data:["u₁","u₂"],top:0},grid:{left:46,right:18,top:40,bottom:42},
    xAxis:{type:"value",min:0,max:10,name:"t (s)",nameLocation:"middle",nameGap:26},
    yAxis:{type:"value",min:-1,max:5.1,name:"控制"},
    series:[
      {name:"u₁",type:"line",showSymbol:false,data:data.points.map(p=>[p.t,p.u1]),itemStyle:{color:"#b45309"},lineStyle:{color:"#b45309"}},
      {name:"u₂",type:"line",showSymbol:false,data:data.points.map(p=>[p.t,p.u2]),itemStyle:{color:"#9333ea"},lineStyle:{color:"#9333ea"}},
    ],
  }),[data]);
  const chartRef = useECharts(option),controlRef=useECharts(controlOption);
  const last = data.points[data.points.length - 1];
  return <section aria-label="多变量分散比例反馈" style={{ border: "1px solid #cbd5e1", borderRadius: 8, padding: 16, margin: "20px 0", background: "#fff", color: "#0f172a", overflow:"hidden" }}>
    <strong>分散比例反馈：交叉输出与稳态误差</strong>
    <p style={{ fontSize: 14 }}>零初态，r₁=1、r₂=0。默认 Kp₁=Kp₂=2；这是教学模型，不代表实测装置。</p>
    {[{ label: "Kp₁", v: kp1, set: setKp1 }, { label: "Kp₂", v: kp2, set: setKp2 }].map(s =>
      <label key={s.label} style={{ display: "flex", flexWrap:"wrap", alignItems: "center", gap: 12, margin: "12px 0", fontSize: 14 }}>
        <span>{s.label}</span>
        <input aria-label={s.label} type="range" min={0.5} max={5} step={0.1} value={s.v} onChange={e => s.set(Number(e.target.value))} style={{ flex: 1, minWidth: 80 }} />
        <output style={{ minWidth: 34 }}>{s.v.toFixed(1)}</output>
      </label>)}
    <div ref={chartRef} style={{ width: "100%", height: 280, minWidth: 0 }} />
    <div ref={controlRef} style={{ width: "100%", height: 280, minWidth: 0 }} />
    <p role="status" style={{ fontSize: 14, lineHeight: 1.9, overflowWrap: "anywhere" }}>
      t=10 s 输出：[{last.y1.toFixed(6)}, {last.y2.toFixed(6)}]；控制：[{last.u1.toFixed(6)}, {last.u2.toFixed(6)}]<br />
      代数稳态 y∞=[{data.steady1.toFixed(6)}, {data.steady2.toFixed(6)}]；e₁∞={(1 - data.steady1).toFixed(6)}<br />
      采样最大 |y₂|={Math.abs(data.peak2.y2).toFixed(6)}，t={data.peak2.t.toFixed(2)} s（0–10 s、501点）<br />
      固定轴便于观察趋势；纯比例反馈没有积分保证。稳态值由代数方程计算，不把最后一个采样点当成精确稳态。
    </p>
    <button type="button" onClick={() => { setKp1(2); setKp2(2); }} style={{ border: "1px solid #94a3b8", borderRadius: 5, padding: "6px 12px", cursor: "pointer" }}>恢复正文默认值</button>
  </section>;
}
