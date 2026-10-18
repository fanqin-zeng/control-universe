"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
import {motorP,motorPCritical} from "@/lib/motor-case";
export function PControlTradeoffExplorer(){
 const[k,setK]=useState(50);const d=useMemo(()=>motorP(k,0),[k]);
 const option=useMemo<EChartsOption>(()=>({animation:false,title:{text:"P control: actual target response",left:"center",textStyle:{fontSize:14}},legend:{top:28},grid:{top:65,left:55,right:18,bottom:45},tooltip:{trigger:"axis"},xAxis:{type:"value",name:"t (s)",min:0,max:3},yAxis:{type:"value",name:"speed (rad/s)",min:0,max:1.6},series:[{name:"speed",type:"line",symbol:"none",data:Array.from({length:3001},(_,i)=>[i/1000,motorP(k,i/1000).y])},{name:"target",type:"line",symbol:"none",data:[[0,1],[3,1]],lineStyle:{type:"dashed"}},{name:"+2%",type:"line",symbol:"none",data:[[0,1.02],[3,1.02]],lineStyle:{type:"dashed"}},{name:"-2%",type:"line",symbol:"none",data:[[0,.98],[3,.98]],lineStyle:{type:"dashed"}}]}),[k]);
 const ref=useECharts(option);
 return <section aria-label="电机P控制权衡" style={{border:"1px solid #cbd5e1",borderRadius:8,padding:12,maxWidth:"100%",overflow:"hidden"}}>
 <label style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>增益 K<input aria-label="电机比例增益 K" type="range" min={1} max={100} step="any" value={k} onChange={e=>setK(Number(e.target.value))} style={{flex:1,minWidth:120}}/><output>{k.toFixed(4)}</output></label>
 <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:8}}><button onClick={()=>setK(50)}>恢复 K=50</button><button onClick={()=>setK(motorPCritical)}>临界阻尼</button></div>
 <div ref={ref} style={{height:380,width:"100%"}}/>
 <div data-testid="motor-p-readout" style={{fontSize:14,lineHeight:1.9,overflowWrap:"anywhere"}}>目标1 rad/s；初值 y(0)=0。终值={d.dc.toFixed(6)}；残差={(100*d.ess).toFixed(6)}%；ζ={d.zeta.toFixed(6)}；ωn={d.wn.toFixed(6)} rad/s。<br/>相对终值超调={d.mpFinal.toFixed(6)}%；超过目标={d.peakTarget.toFixed(6)}%；初始电压={d.initialU.toFixed(6)} V。<br/>参数来自物理模型1000/(s²+100.1s+110)，K小于10.89时阶跃残差大于1%；各候选仍须单独验电压限制。</div>
 </section>;
}
