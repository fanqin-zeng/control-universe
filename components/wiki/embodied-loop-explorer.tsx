"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
import {embodiedDefaults,simulateEmbodied,type EmbodiedParams} from "@/lib/embodied-loop";

export function EmbodiedLoopExplorer() {
  const [p,setP]=useState<EmbodiedParams>({...embodiedDefaults});
  const result=useMemo(()=>simulateEmbodied(p),[p]);
  const option=useMemo<EChartsOption>(()=>({
    animation:false, tooltip:{trigger:"axis"}, legend:{data:["真实位置","延迟观测","目标","速度命令"],top:0},
    grid:[{left:52,right:24,top:90,height:160},{left:52,right:24,top:320,height:100}],
    xAxis:[{type:"value",min:0,max:6,gridIndex:0,name:"时间 / s"},{type:"value",min:0,max:6,gridIndex:1,name:"时间 / s"}],
    yAxis:[{type:"value",min:-2,max:4,gridIndex:0,name:"位置 / m"},{type:"value",min:-1.1,max:1.1,gridIndex:1,name:"命令 / (m/s)"}],
    series:[
      {name:"真实位置",type:"line",showSymbol:false,data:result.x.map((v,k)=>[k*.1,v])},
      {name:"延迟观测",type:"line",showSymbol:false,lineStyle:{type:"dashed"},data:result.y.map((v,k)=>[k*.1,v])},
      {name:"目标",type:"line",showSymbol:false,lineStyle:{type:"dotted"},data:[[0,1],[6,1]]},
      {name:"速度命令",type:"line",step:"end",xAxisIndex:1,yAxisIndex:1,showSymbol:false,data:[...result.u.map((v,k)=>[k*.1,v]),[6,result.u[59]]]}
    ]}),[result]);
  const chart=useECharts(option);
  const controls: {key:keyof EmbodiedParams;title:string;min:number;max:number;step:number}[]=[
    {key:"delay",title:"观测延迟 d（拍）",min:0,max:4,step:1},
    {key:"hold",title:"动作刷新间隔 H（拍）",min:1,max:5,step:1},
    {key:"gain",title:"反馈增益 K（1/s）",min:.5,max:3,step:.5},
    {key:"body",title:"本体响应 b（无量纲）",min:.5,max:1.5,step:.25}
  ];
  return <section aria-label="具身闭环实验台" style={{border:"1px solid #94a3b8",borderRadius:10,padding:16,margin:"24px 0",background:"#fff",color:"#1e293b",minWidth:0}}>
    <strong>观测旧一点、动作多执行几拍，会发生什么？</strong>
    <p>固定采样0.1秒、目标1米；在2.0→2.1秒的状态更新后施加−0.2米位移扰动。仿真共6秒，无训练、无随机数。</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(240px,100%),1fr))",gap:12}}>
      {controls.map(c=><label key={c.key} style={{display:"block"}}>{c.title} = {p[c.key]}<input aria-label={c.title} type="range" min={c.min} max={c.max} step={c.step} value={p[c.key]} onChange={e=>setP({...p,[c.key]:Number(e.target.value)})} style={{display:"block",width:"100%"}}/></label>)}
    </div>
    <button onClick={()=>setP({...embodiedDefaults})} style={{marginTop:12,padding:"6px 12px",border:"1px solid #64748b",borderRadius:6,cursor:"pointer",background:"#f1f5f9",color:"#1e293b"}}>恢复默认</button>
    <p aria-live="polite">末时位置 x(6)={result.final.toFixed(6)} m；末时绝对误差={result.error.toFixed(6)} m；采样最大位置={result.peak.toFixed(6)} m；策略更新{result.updates}次。</p>
    <div ref={chart} style={{width:"100%",height:480,minWidth:0}}/>
    <p>本图所用模型是理想速度接口，不含惯性与接触。延迟观测只有60个读数，末时真实位置有第61个状态；末端命令线仅表示保持到6秒，不代表又计算了一步。改变H会改变刷新次数，不改变底层积分时标；末时读数不能当稳定性证书。</p>
  </section>;
}
