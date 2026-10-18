"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "@/components/wiki/use-echarts";
import {frequency,crossover,configuration,stability} from "@/lib/compensator-model";

export function LagCompensatorExplorer() {
 const [gain,setGain]=useState(60);
 const data=useMemo(()=>Array.from({length:401},(_,i)=>{const w=10**(-4+i/50);return {w,a:frequency("lag",gain,w,false),b:frequency("lag",gain,w,true)};}),[gain]);
 const margins=useMemo(()=>[crossover("lag",gain,false),crossover("lag",gain,true)],[gain]);
 const status=useMemo(()=>[stability(configuration("lag",gain,false).closedDen),stability(configuration("lag",gain,true).closedDen)],[gain]);
 const magOption=useMemo<EChartsOption>(()=>({title:{text:"滞后幅频",left:"center",textStyle:{fontSize:15}},tooltip:{trigger:"axis"},legend:{top:30,type:"scroll",left:10,right:10},grid:{left:50,right:30,top:80,bottom:45},animation: false,
 xAxis:{type:"log",min:.0001,max:10000,name:"rad/s"},yAxis:{type:"value",min:-140,max:140,name:"dB"},series:[{name:"未校正",type:"line",symbol:"none",data:data.map(p=>[p.w,p.a.db])},{name:"校正后",type:"line",symbol:"none",data:data.map(p=>[p.w,p.b.db])}]}),[data]);
 const phaseOption=useMemo<EChartsOption>(()=>({title:{text:"滞后相频",left:"center",textStyle:{fontSize:15}},tooltip:{trigger:"axis"},legend:{top:30,type:"scroll",left:10,right:10},grid:{left:50,right:30,top:80,bottom:45},animation: false,
 xAxis:{type:"log",min:.0001,max:10000,name:"rad/s"},yAxis:{type:"value",min:-360,max:0,name:"度"},series:[{name:"未校正",type:"line",symbol:"none",data:data.map(p=>[p.w,p.a.phase])},{name:"校正后",type:"line",symbol:"none",data:data.map(p=>[p.w,p.b.phase])}]}),[data]);

 const magRef=useECharts(magOption),phaseRef=useECharts(phaseOption);
 return <section aria-label="滞后校正交互" style={{maxWidth:"100%",minWidth:0}}>
 <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}><label htmlFor="lag-gain">滞后增益 K</label><input id="lag-gain" aria-label="滞后增益 K" type="range" min={10} max={200} step={1} value={gain} onChange={e=>setGain(Number(e.target.value))} style={{width:"min(100%,220px)"}}/><span>{gain}</span><button onClick={()=>setGain(60)}>恢复滞后默认</button></div>
 <div data-testid="lag-values" style={{overflowWrap:"anywhere"}}>{margins.map((m,i)=><p key={i}>{i===0?"未校正":"校正后"}：ωc={m.wc.toFixed(6)} rad/s，PM={m.pm.toFixed(6)}°；{status[i]}</p>)}</div>
 <p>同一指定增益下观察完整模型；未独立整定，不作最优性能排名。交越由独立求根取得，非图上取下一个采样点。</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,320px),1fr))",gap:12}}><div ref={magRef} style={{height:320,minWidth:0}}/><div ref={phaseRef} style={{height:320,minWidth:0}}/></div>

 </section>;
}
