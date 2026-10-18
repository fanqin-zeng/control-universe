"use client";
import {useMemo,useState} from "react";
import {useECharts} from "@/components/wiki/use-echarts";
import {stateFeedbackResponse} from "@/lib/state-feedback-response";
export function StateFeedbackPoleExplorer() {
  const [p,setP]=useState(-5);
  const d=useMemo(()=>Array.from({length:501},(_,i)=>({t:4*i/500,...stateFeedbackResponse(p,4*i/500)})),[p]);
  const positionOption=useMemo(()=>({
    animation:false,tooltip:{trigger:"axis" as const},legend:{top:0,data:["基线 N=2","状态反馈"]},
    grid:{top:42,left:48,right:18,bottom:42},
    xAxis:{type:"value" as const,min:0,max:4,name:"t (s)",nameLocation:"middle" as const,nameGap:27},
    yAxis:{type:"value" as const,min:0,max:1.1,name:"q (m)"},
    series:[
      {name:"基线 N=2",type:"line" as const,symbol:"none",data:d.map(v=>[v.t,v.baseline]),itemStyle:{color:"#64748b"},lineStyle:{type:"dashed" as const,color:"#64748b"}},
      {name:"状态反馈",type:"line" as const,symbol:"none",data:d.map(v=>[v.t,v.position]),itemStyle:{color:"#2563eb"},lineStyle:{color:"#2563eb",width:2}},
    ],
  }),[d]);
  const forceOption=useMemo(()=>({
    animation:false,tooltip:{trigger:"axis" as const},legend:{top:0,data:["基线 2N","反馈施力"]},
    grid:{top:42,left:48,right:18,bottom:42},
    xAxis:{type:"value" as const,min:0,max:4,name:"t (s)",nameLocation:"middle" as const,nameGap:27},
    yAxis:{type:"value" as const,min:-30,max:105,name:"u (N)"},
    series:[
      {name:"基线 2N",type:"line" as const,symbol:"none",data:[[0,2],[4,2]],itemStyle:{color:"#64748b"},lineStyle:{type:"dashed" as const,color:"#64748b"}},
      {name:"反馈施力",type:"line" as const,symbol:"none",data:d.map(v=>[v.t,v.force]),itemStyle:{color:"#b45309"},lineStyle:{color:"#b45309",width:2}},
    ],
  }),[d]);
  const positionRef=useECharts(positionOption),forceRef=useECharts(forceOption);
  return <section aria-label="状态反馈极点探索" style={{display:"flex",flexDirection:"column",gap:12,margin:"20px 0",color:"#1e293b"}}>
    <label style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",fontSize:14}}>
      二重极点 p (s⁻¹)
      <input aria-label="闭环二重极点" type="range" min={-10} max={-0.5} step={0.5} value={p} onChange={e=>setP(Number(e.target.value))} style={{flex:"1 1 130px",minWidth:0}} />
      <span>{p.toFixed(1)}</span><button type="button" onClick={()=>setP(-5)} style={{border:"1px solid #94a3b8",padding:"4px 9px",borderRadius:4}}>恢复默认</button>
    </label>
    <p style={{fontSize:14,margin:0}}>同一小车、零初态、目标1m。基线只施恒力2N；两方案终值均为1m。固定0–4s窗口不代表都已到稳态。</p>
    <div ref={positionRef} style={{height:290,width:"100%",minWidth:0}} />
    <div ref={forceRef} style={{height:290,width:"100%",minWidth:0}} />
    <div role="status" style={{padding:12,background:"#f1f5f9",borderRadius:8,fontSize:14,lineHeight:1.8}}>
      K=[{d[0].k1.toFixed(2)}, {d[0].k2.toFixed(2)}]，N={d[0].N.toFixed(2)}<br />
      初始施力={d[0].force.toFixed(2)}N；t=4s位置={d[500].position.toFixed(6)}m（采样值）<br />
      默认p=−5：K=[23,7]、N=25；快极点需要更大初始力。p=−0.5时反而比基线慢。<br />
      未模拟饱和、噪声、延迟或模型失配，不能由本图保证实机性能。
    </div>
  </section>;
}
