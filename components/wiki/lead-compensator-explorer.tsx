"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "@/components/wiki/use-echarts";
import {frequency,crossover,configuration,stability,response} from "@/lib/compensator-model";

export function LeadCompensatorExplorer() {
 const [gain,setGain]=useState(500);
 const data=useMemo(()=>Array.from({length:401},(_,i)=>{const w=10**(-4+i/50);return {w,a:frequency("lead",gain,w,false),b:frequency("lead",gain,w,true)};}),[gain]);
 const margins=useMemo(()=>[crossover("lead",gain,false),crossover("lead",gain,true)],[gain]);
 const status=useMemo(()=>[stability(configuration("lead",gain,false).closedDen),stability(configuration("lead",gain,true).closedDen)],[gain]);
 const magOption=useMemo<EChartsOption>(()=>({title:{text:"超前幅频",left:"center",textStyle:{fontSize:15}},tooltip:{trigger:"axis"},legend:{top:30,type:"scroll",left:10,right:10},grid:{left:50,right:30,top:80,bottom:45},animation: false,
 xAxis:{type:"log",min:.0001,max:10000,name:"rad/s"},yAxis:{type:"value",min:-140,max:140,name:"dB"},series:[{name:"未校正",type:"line",symbol:"none",data:data.map(p=>[p.w,p.a.db])},{name:"校正后",type:"line",symbol:"none",data:data.map(p=>[p.w,p.b.db])}]}),[data]);
 const phaseOption=useMemo<EChartsOption>(()=>({title:{text:"超前相频",left:"center",textStyle:{fontSize:15}},tooltip:{trigger:"axis"},legend:{top:30,type:"scroll",left:10,right:10},grid:{left:50,right:30,top:80,bottom:45},animation: false,
 xAxis:{type:"log",min:.0001,max:10000,name:"rad/s"},yAxis:{type:"value",min:-360,max:0,name:"度"},series:[{name:"未校正",type:"line",symbol:"none",data:data.map(p=>[p.w,p.a.phase])},{name:"校正后",type:"line",symbol:"none",data:data.map(p=>[p.w,p.b.phase])}]}),[data]);
 const steps=useMemo(()=>[response("lead",gain,false),response("lead",gain,true)],[gain]);
 const stepOption=useMemo<EChartsOption>(()=>({title:{text:"完整闭环阶跃",left:"center",textStyle:{fontSize:15}},tooltip:{trigger:"axis"},legend:{top:30,type:"scroll",left:10,right:10},grid:{left:50,right:30,top:80,bottom:45},animation: false,
 xAxis:{type:"value",min:0,max:5,name:"秒"},yAxis:{type:"value",min:-.5,max:2.5,name:"y"},series:steps.map((points,i)=>({name:i===0?"未校正":"校正后",type:"line",symbol:"none",data:points}))}),[steps]);
 const magRef=useECharts(magOption),phaseRef=useECharts(phaseOption); const stepRef=useECharts(stepOption);
 return <section aria-label="超前校正交互" style={{maxWidth:"100%",minWidth:0}}>
 <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}><label htmlFor="lead-gain">超前增益 K</label><input id="lead-gain" aria-label="超前增益 K" type="range" min={100} max={1000} step={10} value={gain} onChange={e=>setGain(Number(e.target.value))} style={{width:"min(100%,220px)"}}/><span>{gain}</span><button onClick={()=>setGain(500)}>恢复超前默认</button></div>
 <div data-testid="lead-values" style={{overflowWrap:"anywhere"}}>{margins.map((m,i)=><p key={i}>{i===0?"未校正":"校正后"}：ωc={m.wc.toFixed(6)} rad/s，PM={m.pm.toFixed(6)}°；{status[i]}</p>)}</div>
 <p>同一指定增益下观察完整模型；未独立整定，不作最优性能排名。交越由独立求根取得，非图上取下一个采样点。</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,320px),1fr))",gap:12}}><div ref={magRef} style={{height:320,minWidth:0}}/><div ref={phaseRef} style={{height:320,minWidth:0}}/></div>
 <div ref={stepRef} style={{height:340,minWidth:0}}/><p data-testid="lead-endpoint">y(5s)：{steps[0][500][1].toFixed(6)} / {steps[1][500][1].toFixed(6)}。这是有限窗口末样。图窗外曲线会裁剪；不稳定曲线不报告超调或稳态。</p>
 </section>;
}
