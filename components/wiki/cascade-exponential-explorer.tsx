"use client";

import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";

/** Exact constant-rate cascade; expm1 avoids cancellation near repeated rates. */
export function calculateCascadeExponential(a:number,b:number,time:number) {
  if (![a,b,time].every(Number.isFinite)||a<.25||a>2||b<.25||b>2||time<0||time>8) throw new RangeError("Outside the lesson domain");
  const at=(t:number)=>{
    const first=Math.exp(-a*t), delta=b-a;
    const second=delta===0?b*t*first:b*first*(-Math.expm1(-delta*t))/delta;
    return [t,first,second];
  };
  const current=at(time);
  const transition=[current[1],0,current[2],Math.exp(-b*time)];
  return {first:current[1],second:current[2],transition,
    rates:[-a*current[1],b*(current[1]-current[2])],
    samples:Array.from({length:161},(_,i)=>at(i/20))};
}

export function CascadeExponentialExplorer(){
  const [a,setA]=useState(1),[b,setB]=useState(1),[time,setTime]=useState(1);
  const data=useMemo(()=>calculateCascadeExponential(a,b,time),[a,b,time]);
  const option:EChartsOption=useMemo(()=>({animation: false,
    grid:{left:50,right:25,top:45,bottom:48},legend:{data:["第一箱","第二箱"]},tooltip:{trigger:"axis"},
    xAxis:{type:"value",min:0,max:8,name:"分钟"},yAxis:{type:"value",min:0,max:1.1,name:"归一化浓度"},
    series:[{name:"第一箱",type:"line",showSymbol:false,data:data.samples.map(p=>[p[0],p[1]]),lineStyle:{width:2,color:"#2563eb"},itemStyle:{color:"#2563eb"}},
      {name:"第二箱",type:"line",showSymbol:false,data:data.samples.map(p=>[p[0],p[2]]),lineStyle:{width:2,color:"#b45309"},itemStyle:{color:"#b45309"}},
      {name:"当前第一箱",type:"scatter",data:[[time,data.first]],symbolSize:10,itemStyle:{color:"#2563eb"}},
      {name:"当前第二箱",type:"scatter",data:[[time,data.second]],symbol:"diamond",symbolSize:12,itemStyle:{color:"#b45309"}}],
  }),[data,time]);
  const chart=useECharts(option);
  const box={border:"2px solid var(--border)",borderRadius:"4px 4px 14px 14px",padding:12,flex:"1 1 130px",minWidth:0};
  const button={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,color:"var(--foreground)",background:"var(--background)",cursor:"pointer"};
  return <section aria-label="串联水箱与矩阵指数实验" className="not-prose" style={{border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",color:"var(--foreground)",minWidth:0}}>
    <p>纯水 → 第一箱 → 第二箱 → 排出。两箱始终充分混合、体积不变；颜色深浅表示相对浓度。</p>
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
      <div style={box}><strong>第一箱 x₁</strong><div style={{height:55,marginTop:6,background:`rgba(37,99,235,${.08+.8*data.first})`,borderRadius:4}}/><p>{data.first.toFixed(4)}</p></div>
      <div style={box}><strong>第二箱 x₂</strong><div style={{height:55,marginTop:6,background:`rgba(180,83,9,${.08+.8*data.second})`,borderRadius:4}}/><p>{data.second.toFixed(4)}</p></div>
    </div>
    <div ref={chart} style={{height:300,width:"100%"}} />
    <label style={{display:"block"}}>第一箱换水速率 a = {a.toFixed(2)} /分钟<input aria-label="第一箱换水速率 a" type="range" min={.25} max={2} step={.25} value={a} onChange={e=>setA(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <label style={{display:"block"}}>第二箱换水速率 b = {b.toFixed(2)} /分钟<input aria-label="第二箱换水速率 b" type="range" min={.25} max={2} step={.25} value={b} onChange={e=>setB(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <label style={{display:"block"}}>观察时刻 t = {time.toFixed(2)} 分钟<input aria-label="观察时刻 t" type="range" min={0} max={8} step={.05} value={time} onChange={e=>setTime(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <p aria-live="polite">t = {time.toFixed(2)}：第一箱 = {data.first.toFixed(4)}；第二箱 = {data.second.toFixed(4)}；变化率 = ({data.rates.map(v=>v.toFixed(4)).join(", ")}) /分钟</p>
    <p>eᴬᵗ = [[{data.transition[0].toFixed(4)}, 0], [{data.transition[2].toFixed(4)}, {data.transition[3].toFixed(4)}]]；乘初值 (1, 0) 得当前两箱浓度。</p>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <button type="button" style={button} onClick={()=>{setA(1);setB(2);setTime(1);}}>第二箱速率为2</button>
      <button type="button" style={button} onClick={()=>setTime(0)}>回到初始时刻</button>
      <button type="button" style={button} onClick={()=>setTime(8)}>观察第8分钟</button>
      <button type="button" style={button} onClick={()=>{setA(1);setB(1);setTime(1);}}>恢复默认</button>
    </div>
    <p style={{fontSize:13}}>默认 a=b=1，初值固定(1,0)。同一流量下，速率变化代表箱体体积变化。曲线每0.05分钟取点，当前值按所选时刻直接求解析式；第8分钟的值不是无穷远极限。教学模型不含延迟、反应或混合不充分。</p>
  </section>;
}
