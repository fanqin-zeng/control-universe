"use client";

import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";

export function calculateZSequence(a:number,r:number,n:number){
  if(![a,r,n].every(Number.isFinite)||a< -1||a>1||r<.5||r>2||!Number.isInteger(n)||n<0||n>12)throw new RangeError("Outside the lesson domain");
  const ratio=a/r;
  const terms=Array.from({length:n+1},(_,k)=>Math.pow(ratio,k));
  const partial=terms.reduce((s,v)=>s+v,0);
  const converges=Math.abs(a)<r;
  const infinite=converges?1/(1-ratio):null;
  const tail=converges?Math.pow(ratio,n+1)/(1-ratio):null;
  return {partial,last:terms[n],converges,infinite,tail,terms,samples:Array.from({length:13},(_,k)=>[k,Math.pow(a,k)])};
}

export function ZSequenceExplorer(){
  const[a,setA]=useState(.5),[r,setR]=useState(1),[n,setN]=useState(8);
  const data=useMemo(()=>calculateZSequence(a,r,n),[a,r,n]);
  const option:EChartsOption=useMemo(()=>({animation: false,grid:{left:48,right:28,top:40,bottom:45},tooltip:{trigger:"axis"},
    xAxis:{type:"value",min:0,max:12,interval:1,name:"记录 k"},yAxis:{type:"value",min:-1.2,max:1.2,name:"归一化温差"},
    series:[{name:"原始序列 a^k",type:"scatter",symbolSize:9,data:data.samples,itemStyle:{color:"#2563eb"}},
    {name:"求和截止处",type:"scatter",symbolSize:13,data:[data.samples[n]],itemStyle:{color:"#b45309"}}],
  }),[data,n]);
  const chart=useECharts(option);
  const button={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,background:"var(--background)",color:"var(--foreground)",cursor:"pointer"};
  const f=(v:number)=>Math.abs(v)<.00005?"0.0000":v.toFixed(4);
  return <section aria-label="序列与Z变换加权和实验" className="not-prose" style={{border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",color:"var(--foreground)",minWidth:0}}>
    <p>蓝点是原始序列 x[k]=a^k，橙点标出求和截止编号。每步1分钟；权重半径 r 只改变下方加权和，不改变蓝点。</p>
    <div ref={chart} style={{width:"100%",height:290}}/>
    <label style={{display:"block"}}>每步比例 a = {a.toFixed(2)}<input aria-label="每步比例" type="range" min={-1} max={1} step={.1} value={a} onChange={e=>setA(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <label style={{display:"block"}}>正实权重半径 r = {r.toFixed(2)}<input aria-label="权重半径" type="range" min={.5} max={2} step={.25} value={r} onChange={e=>setR(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <label style={{display:"block"}}>截止编号 N = {n}（共 {n+1} 项）<input aria-label="截止编号" type="range" min={0} max={12} step={1} value={n} onChange={e=>setN(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <p aria-live="polite">有限加权和 = {f(data.partial)}；最后加权项 = {f(data.last)}</p>
    {data.converges?<p>无限和存在：{f(data.infinite!)}；有符号尾项 = {f(data.tail!)}。尾项由几何公式计算，不是从图上估计。</p>:<p>无限和不收敛：r 必须严格大于 |a|。{a/r===-1?"此边界部分和在1与0间交替，分式的1/2不是普通级数和。":"有限和能计算，不代表无限和存在。"}</p>}
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <button type="button" style={button} onClick={()=>{setA(1);setR(1);setN(8);}}>同号边界</button>
      <button type="button" style={button} onClick={()=>{setA(-1);setR(1);setN(8);}}>交替边界</button>
      <button type="button" style={button} onClick={()=>{setA(.5);setR(.5);setN(8);}}>收敛圆上</button>
      <button type="button" style={button} onClick={()=>{setA(.5);setR(1);setN(8);}}>恢复默认</button>
    </div>
    <p style={{fontSize:13}}>只看 z=r&gt;0 的实轴切片，不画完整复平面。横轴0…12、纵轴±1.2固定；图是13个离散点，求和含0到N两端。a为负表示相对参考值交替，仅作数学扩展；a=0时k=0取1，其余取0。原序列及加权项均无量纲，不把有限末点当作终值。</p>
  </section>;
}
