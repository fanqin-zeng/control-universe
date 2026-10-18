"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "@/components/wiki/use-echarts";
import {responseAt,responseCurve,responseMetrics,firstOrder} from "@/lib/time-domain";

type Mode="impulse"|"first"|"second"|"metrics"|"road";
const names={impulse:"冲激响应探索",first:"一阶阶跃探索",second:"二阶响应探索",metrics:"时域指标探索",road:"路面阶跃探索"};
function TimeDomainPanel({mode}:{mode:Mode}){
  const [zeta,setZeta]=useState(.5),[wn,setWn]=useState(8),[tau,setTau]=useState(.5);
  const end=mode==="first"?30:mode==="second"?15:3,count=mode==="second"?1500:mode==="first"?500:600;
  const data=useMemo(()=>mode==="first"?firstOrder(tau).samples:responseCurve(zeta,wn,end,count,mode==="impulse"?"impulse":mode==="road"?"road":"step"),[mode,tau,zeta,wn,end,count]);
  const metrics=useMemo(()=>mode==="first"||mode==="impulse"?null:responseMetrics(zeta,wn,mode==="road"),[mode,zeta,wn]);
  const one=useMemo(()=>firstOrder(tau),[tau]);
  const option:EChartsOption=useMemo(()=>({animation:false,grid:{left:54,right:18,top:42,bottom:48},
    title:{text:names[mode],left:"center",textStyle:{fontSize:13,color:"#334155"}},
    xAxis:{type:"value",name:"时间 (s)",min:0,max:end,nameLocation:"center",nameGap:28},
    yAxis:{type:"value",name:mode==="impulse"?"h (s⁻¹)":"归一化输出",min:mode==="impulse"?-10:0,max:mode==="impulse"?10:2.1},
    series:[{name:"响应",type:"line",data,smooth:false,showSymbol:false,lineStyle:{color:"#2563eb",width:2.3},
      markPoint:metrics?.tp!=null&&metrics.tp<=end?{data:[{name:"连续峰",coord:[metrics.tp,1+metrics.mp!/100] as [number,number],symbol:"circle",symbolSize:9,label:{show:false}}]}:undefined,
      markArea:mode!=="impulse"&&(mode==="first"||zeta>0)?{silent:true,data:[[{yAxis:.98,itemStyle:{color:"rgba(16,185,129,.12)"}},{yAxis:1.02}]]}:undefined,
      markLine:{silent:true,symbol:"none",label:{show:false},data:[{yAxis:mode==="impulse"?0:1}]}}]}),[data,end,mode,metrics,zeta]);
  const chartRef=useECharts(option);
  const fmt=(x:number|null)=>x===null?"不适用":x.toFixed(6);
  const controls=mode==="first"?[{name:"时间常数",value:tau,min:.2,max:5,step:.1,set:setTau}]:[
    {name:"阻尼比",value:zeta,min:mode==="second"?0:.1,max:2,step:.05,set:setZeta},
    ...(mode==="second"?[{name:"自然频率",value:wn,min:1,max:10,step:.5,set:setWn}]:[])];
  return <section aria-label={names[mode]} style={{border:"1px solid #cbd5e1",borderRadius:8,padding:14,margin:"20px 0",background:"#f8fafc",color:"#1e293b"}}>
    <p style={{marginTop:0}}>{mode==="first"?"G=1/(Ts+1)，零初值，单位阶跃。":mode==="road"?"Y/R=(2ζωn s+ωn²)/(s²+2ζωn s+ωn²)，m=250kg、k=16000N/m，理想路面阶跃，显示y/R₀。":mode==="impulse"?"G=ωn²/(s²+2ζωn s+ωn²)，零初值，单位面积冲激；h的单位是s⁻¹。":"G=ωn²/(s²+2ζωn s+ωn²)，零初值，单位阶跃；输出无量纲。"}</p>
    <div ref={chartRef} style={{width:"100%",height:310}}/>
    {controls.map(c=><label key={c.name} style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",marginTop:12}}>
      <span style={{minWidth:85}}>{c.name}</span><input aria-label={names[mode]+c.name} type="range" min={c.min} max={c.max} step={c.step} value={c.value} onChange={e=>c.set(Number(e.target.value))} style={{flex:"1 1 90px",minWidth:0}}/><span>{c.value.toFixed(2)}</span>
    </label>)}
    <div style={{overflowWrap:"anywhere",lineHeight:1.8}}>
      {mode==="first"?<p>T={tau.toFixed(2)}s；tᵣ(10→90%)={fmt(one.tr)}s；tₛ(2%)={fmt(one.ts2)}s；tₛ(5%)={fmt(one.ts5)}s。均为精确阈值。</p>:mode==="impulse"?<p>ζ={zeta.toFixed(2)}，ωn=8rad/s；h(0.25s)={fmt(responseAt(zeta,8,.25,"impulse"))}s⁻¹；3s末样={fmt(data.at(-1)![1])}s⁻¹。</p>:<>
      <p>ζ={zeta.toFixed(2)}，ωn={wn.toFixed(2)}rad/s{mode==="road"?`，c=${(4000*zeta).toFixed(1)}N·s/m`:""}；Mₚ={fmt(metrics!.mp)}{metrics!.mp===null?"":"%"}；tₚ={fmt(metrics!.tp)}{metrics!.tp===null?"":"s"}；tₛ(2%)={fmt(metrics!.ts)}{metrics!.ts===null?"":"s"}。</p>
      <p>0→100%上升时间={fmt(metrics!.tr)}{metrics!.tr===null?"":"s"}；{end}s末样={fmt(data.at(-1)![1])}；采样最大={fmt(Math.max(...data.map(x=>x[1])))}。末样不是极限，采样峰不冒充连续峰。</p>
      {zeta===0&&<p>无阻尼：不存在阶跃稳态极限，调节时间与相对稳态超调不适用。</p>}
      </>}
      <p>{mode==="first"?"改变T只缩放时间，不改变最终值1。":mode==="impulse"?"同一归一化模型中，冲激响应等于阶跃响应的导数。":mode==="road"?"这里是带零点的基座阶跃响应，不能套无零点超调公式，也不等于舒适性。":"调节时间按连续响应的最后出带边界计算，可能超过图的时间窗口。"}</p>
    </div>
    <button type="button" onClick={()=>{setZeta(.5);setWn(8);setTau(.5);}} style={{padding:"6px 12px",background:"white",border:"1px solid #94a3b8",borderRadius:6,color:"#1e293b"}}>恢复{names[mode]}默认值</button>
  </section>;
}

export function ImpulseExplorer(){return <TimeDomainPanel mode="impulse"/>;}
