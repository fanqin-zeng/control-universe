"use client";

import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";

export function calculateBayesWindow(prior:number,hit:number,falseAlarm:number){
  if(![prior,hit,falseAlarm].every(Number.isFinite)||prior<0||prior>.5||hit<0||hit>1||falseAlarm<0||falseAlarm>1)throw new RangeError("Outside the lesson domain");
  const joint=[prior*hit,prior*(1-hit),(1-prior)*falseAlarm,(1-prior)*(1-falseAlarm)];
  const bell=joint[0]+joint[2];
  const posterior=bell>0?joint[0]/bell:null;
  return {joint,bell,posterior,expected:joint.map(v=>10000*v)};
}

export function BayesWindowExplorer(){
  const[prior,setPrior]=useState(.01),[hit,setHit]=useState(.9),[falseAlarm,setFalseAlarm]=useState(.05);
  const data=useMemo(()=>calculateBayesWindow(prior,hit,falseAlarm),[prior,hit,falseAlarm]);
  const option:EChartsOption=useMemo(()=>({animation: false,grid:{left:100,right:30,top:30,bottom:45},tooltip:{trigger:"axis"},
    xAxis:{type:"value",min:0,max:100,name:"访客 %"},yAxis:{type:"category",min:0,max:1,data:["任意窗口","灯亮窗口"]},
    series:[{name:"各自条件下访客比例",type:"bar",barWidth:28,data:[[prior*100,0],...(data.posterior===null?[]:[[data.posterior*100,1]])],itemStyle:{color:"#2563eb"}}],
  }),[data,prior]);
  const chart=useECharts(option);
  const button={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,background:"var(--background)",color:"var(--foreground)",cursor:"pointer"};
  return <section aria-label="感应灯条件概率实验" className="not-prose" style={{border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",color:"var(--foreground)",minWidth:0}}>
    <p>同一教学模型，两根柱的分母不同：任意窗口中的访客比例，与灯亮窗口中的访客比例。横轴固定0…100%。</p>
    <div ref={chart} style={{width:"100%",height:220}}/>
    <label style={{display:"block"}}>访客先验 = {(prior*100).toFixed(0)}%<input aria-label="访客先验" type="range" min={0} max={.5} step={.01} value={prior} onChange={e=>setPrior(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <label style={{display:"block"}}>有访客时亮灯 = {(hit*100).toFixed(0)}%<input aria-label="有访客时亮灯" type="range" min={0} max={1} step={.05} value={hit} onChange={e=>setHit(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <label style={{display:"block"}}>无访客时亮灯 = {(falseAlarm*100).toFixed(0)}%<input aria-label="无访客时亮灯" type="range" min={0} max={1} step={.05} value={falseAlarm} onChange={e=>setFalseAlarm(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <p aria-live="polite">亮灯概率 = {data.bell.toFixed(4)}；{data.posterior===null?"后验无定义：灯亮事件概率为零，不能做条件除法。":`亮灯后访客概率 = ${data.posterior.toFixed(4)}（${(100*data.posterior).toFixed(2)}%）`}</p>
    <p>每10000窗口期望次数（非实测）：访客且亮 {data.expected[0].toFixed(1)}；访客且不亮 {data.expected[1].toFixed(1)}；无访客且亮 {data.expected[2].toFixed(1)}；无访客且不亮 {data.expected[3].toFixed(1)}。</p>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <button type="button" style={button} onClick={()=>{setPrior(.1);setHit(.9);setFalseAlarm(.05);}}>访客先验10%</button>
      <button type="button" style={button} onClick={()=>{setPrior(.01);setHit(.2);setFalseAlarm(.2);}}>亮灯不区分访客</button>
      <button type="button" style={button} onClick={()=>{setPrior(0);setHit(.9);setFalseAlarm(0);}}>零概率条件</button>
      <button type="button" style={button} onClick={()=>{setPrior(.01);setHit(.9);setFalseAlarm(.05);}}>恢复默认</button>
    </div>
    <p style={{fontSize:13}}>概率参数是教学假设，没有执行随机采样；万次只是期望次数标尺。零概率条件下不绘制后验柱，不把未定义值填成0。此图不评测设备或比较检测算法，不把条件亮灯概率统称准确率。</p>
  </section>;
}
