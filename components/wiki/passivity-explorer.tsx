"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
import {simulatePassivity} from "@/lib/passivity";

export function PassivityExplorer() {
  const [c,setC]=useState(.8),[b,setB]=useState(.2),[shaped,setShaped]=useState(true);
  const sim=useMemo(()=>simulatePassivity(c,b,shaped),[c,b,shaped]);
  const position=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:"axis"},legend:{data:["位置 q","目标 r"]},grid:{left:48,right:18,top:42,bottom:38},xAxis:{type:"value",min:0,max:10,name:"t (s)"},yAxis:{type:"value",min:-.2,max:2.2,name:"q (m)"},series:[{name:"位置 q",type:"line",showSymbol:false,data:sim.rows.map(a=>[a[0],a[1]])},{name:"目标 r",type:"line",showSymbol:false,lineStyle:{type:"dashed"},data:[[0,1],[10,1]]}]}),[sim]);
  const energy=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:"axis"},legend:{data:["储能 H","已耗散","两者之和"]},grid:{left:48,right:18,top:42,bottom:38},xAxis:{type:"value",min:0,max:10,name:"t (s)"},yAxis:{type:"value",min:0,max:1.5,name:"能量 (J)"},series:[3,4,6].map((j,i)=>({name:["储能 H","已耗散","两者之和"][i],type:"line" as const,showSymbol:false,data:sim.rows.map(a=>[a[0],j===6?a[3]+a[4]:a[j]])}))}),[sim]);
  const p=useECharts(position),h=useECharts(energy);
  return <section aria-label="无源控制实验台" style={{border:"1px solid #cbd5e1",borderRadius:10,padding:16,margin:"24px 0",color:"#334155",background:"#fff"}}>
    <strong>小车回到 1 m：改变阻尼，观察位置与能量</strong>
    <p>m=1 kg，k=2 N/m，α=1 N/m³，q(0)=v(0)=0；目标刚度 k_d=2 N/m。连续反馈 RK4，步长 0.002 s，时域 10 s。</p>
    <label style={{display:"block"}}>附加阻尼 c = {c.toFixed(1)} N·s/m <input aria-label="附加阻尼" type="range" min={0} max={6} step={.1} value={c} onChange={e=>setC(Number(e.target.value))} style={{width:"min(260px,100%)"}} /></label>
    <p>物理阻尼 b = {b.toFixed(1)} N·s/m；能量整形：{shaped?"开":"关"}</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      <button onClick={()=>setShaped(!shaped)}>能量整形：{shaped?"开":"关"}</button>
      <button onClick={()=>{setB(0);setC(0);setShaped(true);}}>无耗散 b=c=0</button>
      <button onClick={()=>{setB(.2);setC(.8);setShaped(true);}}>恢复默认</button>
    </div>
    <p aria-live="polite">H(0)={sim.initial.toFixed(4)} J；q(10)={sim.final[1].toFixed(6)} m；H(10)={sim.final[3].toFixed(6)} J；能量账最大误差={sim.maxBalance.toExponential(2)} J。</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,280px),1fr))",gap:8}}><div ref={p} style={{height:290,minWidth:0}}/><div ref={h} style={{height:290,minWidth:0}}/></div>
    <p>关掉整形时，小车从原平衡点静止出发，阻尼不能把它送到 1 m；图中此时记原系统能量。无耗散时会持续振动。10 秒读数只是这个时刻的结果，不是收敛证明；能量收支用全部计算节点核算。</p>
  </section>;
}
