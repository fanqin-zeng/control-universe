"use client";
import {useMemo,useState} from "react";
import {useECharts} from "@/components/wiki/use-echarts";
import {observerResponse} from "@/lib/observer-response";
export function ObserverSpeedExplorer(){
 const [p,setP]=useState(-15);
 const d=useMemo(()=>Array.from({length:401},(_,i)=>({t:i/200,...observerResponse(p,i/200)})),[p]);
 const positionOption=useMemo(()=>({animation:false,tooltip:{trigger:"axis" as const},legend:{top:0,data:["真实位置","估计位置"]},grid:{top:42,left:48,right:18,bottom:42},xAxis:{type:"value" as const,min:0,max:2,name:"t (s)",nameLocation:"middle" as const,nameGap:26},yAxis:{type:"value" as const,min:-0.1,max:1.2,name:"q (m)"},series:[
  {name:"真实位置",type:"line" as const,symbol:"none",data:d.map(x=>[x.t,x.position]),itemStyle:{color:"#2563eb"},lineStyle:{color:"#2563eb"}},
  {name:"估计位置",type:"line" as const,symbol:"none",data:d.map(x=>[x.t,x.estimate]),itemStyle:{color:"#b45309"},lineStyle:{color:"#b45309",type:"dashed" as const}},
 ]}),[d]);
 const errorOption=useMemo(()=>({animation:false,tooltip:{trigger:"axis" as const},legend:{top:0,data:["速度估计误差"]},grid:{top:42,left:48,right:18,bottom:42},xAxis:{type:"value" as const,min:0,max:2,name:"t (s)",nameLocation:"middle" as const,nameGap:26},yAxis:{type:"value" as const,min:0,max:10,name:"误差 (m/s)"},series:[{name:"速度估计误差",type:"line" as const,symbol:"none",data:d.map(x=>[x.t,x.e2]),itemStyle:{color:"#9333ea"},lineStyle:{color:"#9333ea"}}]}),[d]);
 const ref1=useECharts(positionOption),ref2=useECharts(errorOption),v=d[0];
 return <section aria-label="观测器速度探索" style={{display:"flex",flexDirection:"column",gap:12,margin:"20px 0",color:"#1e293b"}}>
 <label style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",fontSize:14}}>二重极点 p (s⁻¹)<input aria-label="观测器二重极点" type="range" min={-30} max={-5} step={1} value={p} onChange={e=>setP(Number(e.target.value))} style={{flex:"1 1 130px",minWidth:0}}/><span>{p}</span><button type="button" onClick={()=>setP(-15)} style={{border:"1px solid #94a3b8",padding:"4px 9px",borderRadius:4}}>恢复默认</button></label>
 <p style={{margin:0,fontSize:14}}>同一小车u=0；真实初值[1,0]，估计初值[0,0]。只改变观测器增益，固定0–2s观察。</p>
 <div ref={ref1} style={{height:290,width:"100%",minWidth:0}}/><div ref={ref2} style={{height:290,width:"100%",minWidth:0}}/>
 <div role="status" style={{padding:12,background:"#f1f5f9",borderRadius:8,fontSize:14,lineHeight:1.8}}>L=[{v.l1}, {v.l2}]；默认[27,142]<br/>速度误差连续峰值={v.peak.toFixed(6)}m/s，时刻={v.peakTime.toFixed(6)}s<br/>100rad/s测量扰动到速度误差幅值={v.noiseVelocity.toFixed(6)}s⁻¹（单频增益）<br/>末样t=2s位置误差={d[400].e1.toExponential(3)}m。K=[7,1.2]、N=9未改；此图没有施加该控制律。<br/>峰值来自非零初差；未模拟随机噪声、采样、饱和或失配，不能保证实机性能。</div>
 </section>;
}
