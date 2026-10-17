"use client";
import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "@/components/wiki/use-echarts";
export function calculateComplex(a: number, b: number) {
  if (![a,b].every(Number.isFinite) || Math.abs(a)>5 || Math.abs(b)>5) throw Error("坐标范围为-5到5");
  const r=Math.hypot(a,b), angle=r===0?null:(Math.atan2(b,a)<=-Math.PI?Math.PI:Math.atan2(b,a)), degrees=angle===null?null:angle*180/Math.PI;
  return { a,b,r,angle,degrees,conjugate:[a,-b],rotation:[-b,a],
    arc:angle===null?[]:Array.from({length:61},(_,i)=>{const t=i/60*angle;return [Math.min(r,1)*Math.cos(t),Math.min(r,1)*Math.sin(t)];}) };
}
export function ComplexPolarExplorer() {
  const [a,setA]=useState(3),[b,setB]=useState(4);
  const data=useMemo(()=>calculateComplex(a,b),[a,b]);
  const option:EChartsOption=useMemo(()=>({animation:false,tooltip:{trigger:"item"},
    grid:{left:45,right:45,top:45,bottom:45},
    xAxis:{type:"value",min:-6,max:6,name:"实部"},yAxis:{type:"value",min:-6,max:6,name:"虚部"},
    series:[{name:"复数",type:"line",data:[[0,0],[a,b]],symbolSize:9,lineStyle:{color:"#2563eb"}},
      {name:"共轭",type:"scatter",data:[data.conjugate],symbolSize:9,itemStyle:{color:"#15803d"}},
      {name:"有向角",type:"line",data:data.arc,showSymbol:false,lineStyle:{color:"#ea580c"}}]}),[a,b,data]);
  const ref=useECharts(option);
  return <section aria-label="复平面实验" style={{color:"var(--foreground)",border:"1px solid var(--border)",padding:14,borderRadius:8,margin:"16px 0",minWidth:0}}>
    <p>蓝线连接原点与复数，绿点是它的共轭；橙色小弧显示角度的方向。</p>
    <div ref={ref} style={{width:"100%",maxWidth:400,aspectRatio:"1 / 1"}} />
    <label style={{display:"block"}}>实部 a = {a.toFixed(2)}<input aria-label="实部 a" type="range" min={-5} max={5} step={0.1} value={a} onChange={e=>setA(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <label style={{display:"block"}}>虚部 b = {b.toFixed(2)}<input aria-label="虚部 b" type="range" min={-5} max={5} step={0.1} value={b} onChange={e=>setB(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <p aria-live="polite">z = {a.toFixed(2)} {b<0?"−":"+"} {Math.abs(b).toFixed(2)}i；模 {data.r.toFixed(4)}；主辐角 {data.degrees===null?"未定义（原点没有方向）":data.degrees.toFixed(4)+"°"}</p>
    <p style={{fontSize:13}}>角度由 atan2(b,a) 结合两个坐标计算，主值取 (−180°,180°]。图的横纵轴都固定为[−6,6]；画布保持正方形，让长度与角度的图示和坐标一致。</p>
    <button style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--background)", color: "var(--foreground)", cursor: "pointer" }} type="button" onClick={()=>{setA(3);setB(4);}}>恢复默认</button>
  </section>;
}
