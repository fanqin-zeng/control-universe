"use client";

import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";

export function calculateLaplaceWeight(a:number,sigma:number,cutoff:number){
  if(![a,sigma,cutoff].every(Number.isFinite)||a<.25||a>2||sigma<-.5||sigma>2||cutoff<0||cutoff>8)throw new RangeError("Outside the lesson domain");
  const r=a+sigma;
  const value=Math.exp(-r*cutoff);
  const area=r===0?cutoff:-Math.expm1(-r*cutoff)/r;
  const converges=r>0;
  const total=converges?1/r:null,tail=converges?value/r:null;
  const samples=Array.from({length:161},(_,i)=>[i/20,Math.exp(-r*i/20)]);
  const shaded=samples.filter(p=>p[0]<cutoff).concat([[cutoff,value]]);
  return {r,value,area,converges,total,tail,samples,shaded};
}

export function LaplaceWeightExplorer(){
  const[a,setA]=useState(1),[sigma,setSigma]=useState(0),[cutoff,setCutoff]=useState(4);
  const data=useMemo(()=>calculateLaplaceWeight(a,sigma,cutoff),[a,sigma,cutoff]);
  const option:EChartsOption=useMemo(()=>({animation: false,
    grid:{left:45,right:25,top:40,bottom:45},tooltip:{trigger:"axis"},
    xAxis:{type:"value",min:0,max:8,name:"分钟"},yAxis:{type:"value",min:0,max:8,name:"加权值"},
    series:[{name:"加权曲线",type:"line",showSymbol:false,data:data.samples,lineStyle:{color:"#2563eb",width:2},itemStyle:{color:"#2563eb"}},
      {name:"积分到T",type:"line",showSymbol:false,data:data.shaded,lineStyle:{opacity:0},areaStyle:{color:"#60a5fa",opacity:.4}},
      {name:"截止时刻",type:"scatter",data:[[cutoff,data.value]],symbolSize:10,itemStyle:{color:"#b45309"}}],
  }),[data,cutoff]);
  const chart=useECharts(option);
  const button={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,background:"var(--background)",color:"var(--foreground)",cursor:"pointer"};
  return <section aria-label="拉普拉斯权重与积分实验" className="not-prose" style={{border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",color:"var(--foreground)",minWidth:0}}>
    <p>原曲线 f(t)=exp(-at)，乘权重 exp(-σt)，得到 exp[-(a+σ)t]。蓝色阴影只积分到 T；图外的后续时间仍要判断。</p>
    <div ref={chart} style={{width:"100%",height:300}}/>
    <label style={{display:"block"}}>衰减速率 a = {a.toFixed(2)} /分钟<input aria-label="衰减速率 a" type="range" min={.25} max={2} step={.25} value={a} onChange={e=>setA(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <label style={{display:"block"}}>权重实部 σ = {sigma.toFixed(2)} /分钟<input aria-label="权重实部 σ" type="range" min={-.5} max={2} step={.25} value={sigma} onChange={e=>setSigma(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <label style={{display:"block"}}>积分截止 T = {cutoff.toFixed(2)} 分钟<input aria-label="积分截止 T" type="range" min={0} max={8} step={.25} value={cutoff} onChange={e=>setCutoff(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <p aria-live="polite">a + σ = {data.r.toFixed(2)}；截止处加权值 = {data.value.toFixed(4)}；有限面积 = {data.area.toFixed(4)} 分钟</p>
    <p aria-live="polite">{data.converges?`无限积分 = ${data.total!.toFixed(4)} 分钟；尚未积入的尾项 = ${data.tail!.toFixed(4)} 分钟`:"无限积分不存在：加权曲线不衰减，有限窗口有面积不代表全程可积。"}</p>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <button type="button" style={button} onClick={()=>{setA(.5);setSigma(-.5);setCutoff(4);}}>收敛边界</button>
      <button type="button" style={button} onClick={()=>{setA(.25);setSigma(-.5);setCutoff(4);}}>不收敛示例</button>
      <button type="button" style={button} onClick={()=>setCutoff(0)}>积分到零</button>
      <button type="button" style={button} onClick={()=>{setA(1);setSigma(0);setCutoff(4);}}>恢复默认</button>
    </div>
    <p style={{fontSize:13}}>无限积分用解析式求得，不是阴影估计。只画复变量的 ω=0 切片。a/σ 用每分钟，T 用分钟；原信号无量纲。时间轴固定0…8，加权值轴0…8；采样间隔0.05分钟，面积和当前值按解析式直接求，不用采样末点冒充无限积分。</p>
  </section>;
}
