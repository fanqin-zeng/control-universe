"use client";

import {useMemo, useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";

export function calculateEigenIteration(p:number,q:number,k:number) {
  if(![p,q,k].every(Number.isFinite)||p<0.5||p>1.25||q<-.75||q>.75||!Number.isInteger(k)||k<0||k>8) throw new Error("参数超出教学范围");
  const trajectory=Array.from({length:9},(_,i)=>({k:i,first:p**i+q**i,second:p**i-q**i,plus:p**i,minus:q**i}));
  return {matrix:[[(p+q)/2,(p-q)/2],[(p-q)/2,(p+q)/2]],eigenvalues:[p,q],state:[trajectory[k].first,trajectory[k].second],modes:[trajectory[k].plus,trajectory[k].minus],trajectory};
}

export function EigenIterationExplorer() {
  const [p,setP]=useState(1),[q,setQ]=useState(.5),[k,setK]=useState(3);
  const data=useMemo(()=>calculateEigenIteration(p,q,k),[p,q,k]);
  const option:EChartsOption=useMemo(()=>({animation: false,
    grid:{left:48,right:20,top:48,bottom:45},
    legend:{data:["第一路","第二路","第一模态系数","第二模态系数"]},
    xAxis:{type:"value",min:0,max:8,minInterval:1,name:"步数 k"},
    yAxis:{type:"value",min:-8,max:8,name:"无量纲读数"},
    tooltip:{trigger:"axis"},
    series:[{name:"第一路",field:"first",color:"#2563eb"},{name:"第二路",field:"second",color:"#ea580c"},{name:"第一模态系数",field:"plus",color:"#15803d"},{name:"第二模态系数",field:"minus",color:"#9333ea"}].map((s,i)=>({name:s.name,type:"line" as const,data:data.trajectory.map(t=>[t.k,t[s.field as "first"|"second"|"plus"|"minus"]]),symbolSize:6,lineStyle:{color:s.color,type:i>1?"dashed" as const:"solid" as const},itemStyle:{color:s.color},...(i===0?{markLine:{silent:true,symbol:"none",data:[{xAxis:k}],label:{show:false}}}:{})})),
  }),[data,k]);
  const ref=useECharts(option);
  const buttonStyle={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,background:"var(--background)",color:"var(--foreground)",cursor:"pointer"};
  return <section aria-label="特征倍率实验" className="not-prose" style={{color:"var(--foreground)",border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",minWidth:0}}>
    <p>实线是原坐标的两路读数；虚线是两条特征方向上的系数。初值始终为(2, 0)，两条特征方向始终为(1, 1)与(1, −1)。</p>
    <div ref={ref} style={{width:"100%",height:340}} />
    <label style={{display:"block"}}>第一倍率 p = {p.toFixed(2)}<input aria-label="第一倍率 p" type="range" min={.5} max={1.25} step={.25} value={p} onChange={e=>setP(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <label style={{display:"block"}}>第二倍率 q = {q.toFixed(2)}<input aria-label="第二倍率 q" type="range" min={-.75} max={.75} step={.25} value={q} onChange={e=>setQ(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <label style={{display:"block"}}>选中步数 k = {k}<input aria-label="选中步数 k" type="range" min={0} max={8} step={1} value={k} onChange={e=>setK(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <p aria-live="polite">第{k}步：状态 = ({data.state.map(v=>v.toFixed(3)).join(", ")})；模态系数 = ({data.modes.map(v=>v.toFixed(3)).join(", ")})</p>
    <p>A = [[{data.matrix[0].map(v=>v.toFixed(3)).join(", ")}], [{data.matrix[1].map(v=>v.toFixed(3)).join(", ")}]]</p>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <button type="button" style={buttonStyle} onClick={()=>{setP(.75);setQ(.5);}}>两模态衰减</button>
      <button type="button" style={buttonStyle} onClick={()=>setQ(-.5)}>第二模态反向</button>
      <button type="button" style={buttonStyle} onClick={()=>setP(1.25)}>第一模态增长</button>
      <button type="button" style={buttonStyle} onClick={()=>{setP(1);setQ(.5);setK(3);}}>恢复默认</button>
    </div>
    <p style={{fontSize:13}}>横轴固定0–8步、纵轴固定−8–8。整数点才是更新状态，连线仅帮助阅读；有限步图像不能代替长期证明。两倍率相等时，这个矩阵族仍可对角化，不能据此推断所有重根矩阵都可对角化。</p>
  </section>;
}
