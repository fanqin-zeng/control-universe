"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "@/components/wiki/use-echarts";
import {delayMetrics,delayedFrequency} from "@/lib/loop-shaping";
function option(title:string,series:EChartsOption["series"],ymin:number,ymax:number):EChartsOption{return {title:{text:title,left:"center",textStyle:{fontSize:15}},legend:{type:"scroll",top:30,left:8,right:8},tooltip:{trigger:"axis"},grid:{top:80,left:55,right:45,bottom:45},animation: false,xAxis:{type:"log",min:.01,max:100,axisLabel:{hideOverlap:true},name:"rad/s"},yAxis:{type:"value",min:ymin,max:ymax},series};}
export function DelayMarginExplorer(){
 const [tau,setTau]=useState(.05);const values=useMemo(()=>delayMetrics(tau),[tau]);
 const data=useMemo(()=>Array.from({length:401},(_,i)=>{const w=10**(-2+i/100);return {w,a:delayedFrequency(0,w),b:delayedFrequency(tau,w)};}),[tau]);
 const mag=useMemo<EChartsOption>(()=>option("延迟不改变幅值",[{name:"同一幅值",type:"line",symbol:"none",data:data.map(x=>[x.w,x.a.db])}],-80,70),[data]);
 const phase=useMemo<EChartsOption>(()=>option("延迟改变相位",[{name:"无延迟",type:"line",symbol:"none",data:data.map(x=>[x.w,x.a.phase])},{name:"有延迟",type:"line",symbol:"none",data:data.map(x=>[x.w,x.b.phase])},{name:"临界相位",type:"line",symbol:"none",lineStyle:{type:"dashed"},data:[[.01,-180],[100,-180]]}],-450,-80),[data]);
 const magRef=useECharts(mag),phaseRef=useECharts(phase);
 return <section aria-label="延迟裕度交互" style={{minWidth:0,maxWidth:"100%"}}><div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}><label htmlFor="loop-delay">纯延迟 τ</label><input id="loop-delay" aria-label="纯延迟 τ" type="range" min={0} max={.3} step={.005} value={tau} onChange={e=>setTau(Number(e.target.value))} style={{width:"min(100%,220px)"}}/><span>{tau.toFixed(6)}s</span><button onClick={()=>setTau(.05)}>恢复延迟默认</button><button onClick={()=>setTau(delayMetrics(0).limit)}>精确临界延迟</button></div>
 <p>固定L₀=10/[s(s+1)]，单位负反馈。这里只改变纯延迟；稳定判定限于这一对象。</p><p data-testid="delay-values" style={{overflowWrap:"anywhere"}}>ωc={values.wc.toFixed(6)}；PM₀={values.pm0.toFixed(6)}°；τcrit={values.limit.toFixed(9)}s；PM={values.pm.toFixed(6)}°；{values.status}</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,320px),1fr))",gap:12}}><div ref={magRef} style={{height:360,minWidth:0}}/><div ref={phaseRef} style={{height:360,minWidth:0}}/></div><p>临界边界不算渐近稳定；相位连续展开，低于−450°的曲线在固定图窗中裁剪。</p></section>;
}
