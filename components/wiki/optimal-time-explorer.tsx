"use client";
import {useMemo,useState} from "react";
import {useECharts} from "@/components/wiki/use-echarts";
import {optimalTrajectory} from "@/lib/optimal-trajectory";
export function OptimalTimeExplorer(){
 const [T,setT]=useState(2);
 const d=useMemo(()=>Array.from({length:401},(_,i)=>({t:T*i/400,...optimalTrajectory(T,T*i/400)})),[T]);
 const costs=useMemo(()=>Array.from({length:201},(_,i)=>{const tf=.5+4.5*i/200;return [tf,optimalTrajectory(tf,0).J];}),[]);
 const stateOption=useMemo(()=>({animation:false,tooltip:{trigger:"axis" as const},legend:{top:0,data:["最优状态"]},grid:{top:42,left:50,right:18,bottom:42},xAxis:{type:"value" as const,min:0,max:5,name:"t",nameLocation:"middle" as const,nameGap:26},yAxis:{type:"value" as const,min:-.05,max:1.05,name:"x"},series:[{name:"最优状态",type:"line" as const,symbol:"none",data:d.map(v=>[v.t,v.x]),itemStyle:{color:"#2563eb"},lineStyle:{color:"#2563eb"}}]}),[d]);
 const controlOption=useMemo(()=>({animation:false,tooltip:{trigger:"axis" as const},legend:{top:0,data:["最优输入","同终时恒定输入"]},grid:{top:42,left:50,right:18,bottom:42},xAxis:{type:"value" as const,min:0,max:5,name:"t",nameLocation:"middle" as const,nameGap:26},yAxis:{type:"value" as const,min:-2.1,max:.05,name:"u"},series:[{name:"最优输入",type:"line" as const,symbol:"none",data:d.map(v=>[v.t,v.u]),itemStyle:{color:"#b45309"},lineStyle:{color:"#b45309"}},{name:"同终时恒定输入",type:"line" as const,symbol:"none",data:[[0,d[0].c],[T,d[0].c]],itemStyle:{color:"#64748b"},lineStyle:{color:"#64748b",type:"dashed" as const}}]}),[d,T]);
 const costOption=useMemo(()=>({animation:false,tooltip:{trigger:"axis" as const},legend:{top:0,data:["最优代价","当前终时"]},grid:{top:42,left:60,right:18,bottom:42},xAxis:{type:"value" as const,min:.5,max:5,name:"T",nameLocation:"middle" as const,nameGap:26},yAxis:{type:"log" as const,min:1e-5,max:1,name:"J"},series:[{name:"最优代价",type:"line" as const,symbol:"none",data:costs,itemStyle:{color:"#15803d"},lineStyle:{color:"#15803d"}},{name:"当前终时",type:"scatter" as const,data:[[T,d[0].J]],itemStyle:{color:"#b45309"}}]}),[costs,d,T]);
 const r1=useECharts(stateOption),r2=useECharts(controlOption),r3=useECharts(costOption),v=d[0];
 return <section aria-label="终时与代价探索" style={{display:"flex",flexDirection:"column",gap:12,margin:"20px 0",color:"#1e293b"}}>
 <label style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",fontSize:14}}>终时T<input aria-label="终端时间" type="range" min={.5} max={5} step={.1} value={T} onChange={e=>setT(Number(e.target.value))} style={{flex:"1 1 130px",minWidth:0}}/><span>{T.toFixed(1)}</span><button type="button" onClick={()=>setT(2)} style={{border:"1px solid #94a3b8",padding:"4px 9px",borderRadius:4}}>恢复默认</button></label>
 <p style={{margin:0,fontSize:14}}>无量纲一阶模型；x(0)=1，x(T)=0，无输入幅值约束。每条恒定基线与当前方案使用相同终时；改变T就是改变任务。</p>
 <div ref={r1} style={{height:270,width:"100%",minWidth:0}}/><div ref={r2} style={{height:270,width:"100%",minWidth:0}}/><div ref={r3} style={{height:270,width:"100%",minWidth:0}}/>
 <div role="status" style={{padding:12,background:"#f1f5f9",borderRadius:8,fontSize:14,lineHeight:1.8}}>λ(0)={v.lambda0.toFixed(6)}；J*={v.J.toFixed(6)}<br/>u(0)={v.u.toFixed(6)}；u(T)={d[400].u.toFixed(6)}；x(T)={d[400].x.toFixed(6)}<br/>恒定输入c={v.c.toFixed(6)}，代价={v.Jconstant.toFixed(6)}，二次努力节省={v.saving.toFixed(4)}%<br/>最大|u|={v.peak.toFixed(6)}；{v.peak>1?"超过1，不满足另立的|u|≤1合同":"此解幅值不超过1，仍不是最短时间的比较"}。<br/>等待更久可降低此稳定教学模型的二次努力，不是普遍的省电/省燃料结论。</div></section>;
}
