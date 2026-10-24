"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {multiAgentExperiment,type MultiTopology} from "@/lib/multi-agent-overview";
import {useECharts} from "./use-echarts";
export function MultiAgentOverviewExplorer(){
  const[topology,setTopology]=useState<MultiTopology>("chain"),[alpha,setAlpha]=useState(.25),[selected,setSelected]=useState(1);
  const d=useMemo(()=>multiAgentExperiment(topology,alpha,selected),[topology,alpha,selected]);
  const option:EChartsOption=useMemo(()=>({animation: false,tooltip:{trigger:"axis"},legend:{top:0,data:["小车1","小车2","小车3"]},grid:{left:48,right:18,top:40,bottom:42},xAxis:{type:"value",min:0,max:20,minInterval:1,name:"步 k",nameLocation:"middle",nameGap:26},yAxis:{type:"value",min:-6,max:9,name:"速度 m/s"},series:[...Array.from({length:3},(_,i)=>({name:`小车${i+1}`,type:"line" as const,showSymbol:false,data:d.states.map((v,k)=>[k,v[i]])})),{name:"观察步",type:"scatter",symbolSize:9,data:d.values.map(v=>[selected,v])}]}),[d,selected]);
  const chart=useECharts(option);
  const button={padding:"6px 9px",border:"1px solid var(--border)",borderRadius:6,color:"var(--foreground)",background:"var(--background)",cursor:"pointer"};
  return <section className="not-prose" aria-label="三辆小车局部协调实验" style={{border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",minWidth:0,color:"var(--foreground)"}}>
    <p>各车在独立车道上运动，只协调速度。连线表示通信；每步同时读取旧速度。γ = 1 s⁻¹，因此周期 h 的秒数与 α 相同。</p>
    <label style={{display:"block"}}>通信结构 <select aria-label="通信结构" value={topology} onChange={e=>setTopology(e.target.value as MultiTopology)} style={{...button,maxWidth:"100%"}}><option value="chain">双向链 1 ↔ 2 ↔ 3</option><option value="split">断开 2–3：1 ↔ 2；3孤立</option><option value="directed">单向链 1 → 2 → 3</option></select></label>
    <div ref={chart} style={{height:290,width:"100%"}}/>
    <label style={{display:"block"}}>更新幅度 α = {alpha.toFixed(2)}；h = {alpha.toFixed(2)} s<input aria-label="更新幅度" type="range" min={.05} max={.7} step={.05} value={alpha} onChange={e=>setAlpha(Number(e.target.value))} style={{display:"block",width:"100%"}}/></label>
    <label style={{display:"block"}}>观察步 k = {selected}<input aria-label="观察步" type="range" min={0} max={20} step={1} value={selected} onChange={e=>setSelected(Number(e.target.value))} style={{display:"block",width:"100%"}}/></label>
    <p aria-live="polite" data-multi-readout>第{selected}步（t = {d.time.toFixed(2)} s）：({d.values.map(v=>v.toFixed(4)).join(", ")}) m/s；均值 = {d.mean.toFixed(4)} m/s；极差 = {d.spread.toFixed(4)} m/s。</p>
    <p>{topology==="split"?"通信已断开：两车趋于0.5 m/s，孤立车保持5 m/s；全局没有一致。":topology==="directed"?"根节点1不接收信息，速度保持0；其余两车长期趋于0。一般不保持初始算术平均。":d.convergent?"固定无向连通图满足0 < α < 2/3：长期趋于2 m/s；第20步只是末样值。":"α ≥ 2/3：不满足一般初态的一致条件。曲线会出现不衰减或增长的分歧；不要把短时交点当成收敛。"}</p>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button type="button" style={button} onClick={()=>{setTopology("split");setSelected(20);}}>失联末步</button><button type="button" style={button} onClick={()=>{setTopology("directed");setSelected(20);}}>单向末步</button><button type="button" style={button} onClick={()=>{setTopology("chain");setAlpha(.7);setSelected(20);}}>过大步长</button><button type="button" style={button} onClick={()=>{setTopology("chain");setAlpha(.25);setSelected(1);}}>恢复默认</button></div>
    <p style={{fontSize:13}}>曲线固定0–20步、−6至9 m/s，关闭动画。周期改变时20步对应的物理时长也改变，不能用末步差作同时间效率排名。允许有符号速度，模型没有执行器限幅、延迟或避碰保证。</p>
  </section>;
}
