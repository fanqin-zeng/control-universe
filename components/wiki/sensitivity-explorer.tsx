"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "@/components/wiki/use-echarts";
import {sensitivity,loopMetrics} from "@/lib/loop-shaping";
function option(title:string,series:EChartsOption["series"],ymin:number,ymax:number):EChartsOption{return {title:{text:title,left:"center",textStyle:{fontSize:15}},legend:{type:"scroll",top:30,left:8,right:8},tooltip:{trigger:"axis"},grid:{top:80,left:55,right:45,bottom:45},animation: false,xAxis:{type:"log",min:.01,max:100,axisLabel:{hideOverlap:true},name:"rad/s"},yAxis:{type:"value",min:ymin,max:ymax},series};}
export function SensitivityExplorer(){
 const [gain,setGain]=useState(100);const values=useMemo(()=>loopMetrics(gain),[gain]);
 const data=useMemo(()=>Array.from({length:401},(_,i)=>{const w=10**(-2+i/100);return {w,...sensitivity(gain,w)};}),[gain]);
 const sOption=useMemo<EChartsOption>(()=>option("灵敏度S",[{name:"S的形式模值",type:"line",symbol:"none",data:data.map(x=>[x.w,20*Math.log10(x.s)])}],-70,60),[data]);
 const tOption=useMemo<EChartsOption>(()=>option("互补灵敏度T",[{name:"T的形式模值",type:"line",symbol:"none",data:data.map(x=>[x.w,20*Math.log10(x.t)])}],-100,60),[data]);const sRef=useECharts(sOption),tRef=useECharts(tOption);
 return <section aria-label="灵敏度交互" style={{minWidth:0,maxWidth:"100%"}}><div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}><label htmlFor="loop-gain">环路增益 K</label><input id="loop-gain" aria-label="环路增益 K" type="range" min={1} max={200} step={1} value={gain} onChange={e=>setGain(Number(e.target.value))} style={{width:"min(100%,220px)"}}/><span>{gain}</span><button onClick={()=>setGain(100)}>恢复增益默认</button><button onClick={()=>setGain(110)}>增益临界点</button></div>
 <p>固定L=K/[s(s+1)(s+10)]，0&lt;K&lt;110渐近稳定；K110临界，更大不稳定。同一对象指定增益观察，不作最优排名。</p><p data-testid="sensitivity-values" style={{overflowWrap:"anywhere"}}>ωc={values.wc.toFixed(6)}；PM={values.pm.toFixed(6)}°；GM={values.gm.toFixed(6)}dB；{values.status}；{values.status==="渐近稳定"?"Ms":"形式峰值"}={Number.isFinite(values.ms)?values.ms.toFixed(6):"∞"}；峰频={values.wms.toFixed(6)}rad/s</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,320px),1fr))",gap:12}}><div ref={sRef} style={{height:360,minWidth:0}}/><div ref={tRef} style={{height:360,minWidth:0}}/></div><p>连续峰独立求导数零点，不依绘图网格。临界/不稳定时不把曲线称稳态频响或H∞性能；固定图窗外裁剪。S+T=1是复数恒等式，两模不相加为1。</p></section>;
}
