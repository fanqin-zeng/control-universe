"use client";

import {useMemo, useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";

export function calculateLinearMap(t: number, u1: number, u2: number) {
  if (![t,u1,u2].every(Number.isFinite) || t<0 || t>2 || Math.abs(u1)>2 || Math.abs(u2)>1) throw new Error("参数超出教学范围");
  const output=[u1+t*u2,u1+2*u2];
  const determinant=2-t;
  const rank=determinant===0?1:2;
  const grid=Array.from({length:5},(_,i)=>-1+i/2).flatMap(k=>[
    [[-1+k*t,-1+2*k],[1+k*t,1+2*k]],
    [[k-t,k-2],[k+t,k+2]],
  ]);
  return {output,determinant,rank,norm:Math.hypot(...output),first:[u1,u1],second:[t*u2,2*u2],grid};
}

export function LinearMapExplorer() {
  const [t,setT]=useState(1),[u1,setU1]=useState(2),[u2,setU2]=useState(1);
  const data=useMemo(()=>calculateLinearMap(t,u1,u2),[t,u1,u2]);
  const option:EChartsOption=useMemo(()=>({animation: false,
    grid:{left:45,right:35,top:35,bottom:45},
    xAxis:{type:"value",min:-5,max:5,name:"输出1"},
    yAxis:{type:"value",min:-5,max:5,name:"输出2"},
    tooltip:{trigger:"item"},
    series:[...data.grid.map(points=>({type:"line" as const,data:points,showSymbol:false,silent:true,lineStyle:{color:"#cbd5e1",width:1}})),
      {name:"第一列的贡献",type:"line",data:[[0,0],data.first],symbolSize:8,lineStyle:{color:"#2563eb",width:3}},
      {name:"加上第二列的贡献",type:"line",data:[data.first,data.output],symbolSize:8,lineStyle:{color:"#ea580c",width:3}},
      {name:"合成输出",type:"line",data:[[0,0],data.output],symbolSize:9,lineStyle:{color:"#15803d",type:"dashed",width:2}}],
  }),[data]);
  const ref=useECharts(option);
  const buttonStyle={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,background:"var(--background)",color:"var(--foreground)",cursor:"pointer"};
  return <section aria-label="线性映射实验" className="not-prose" style={{color:"var(--foreground)",border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",minWidth:0}}>
    <p>蓝线先走第一列的贡献，橙线接着走第二列的贡献，绿虚线连到合成输出。灰线是输入网格经矩阵变换后的网格。</p>
    <div ref={ref} style={{width:"100%",maxWidth:420,aspectRatio:"1 / 1"}} />
    <p>A = [[1, {t.toFixed(2)}], [1, 2]]</p>
    <label style={{display:"block"}}>第二列横坐标 t = {t.toFixed(2)}<input aria-label="第二列横坐标 t" type="range" min={0} max={2} step={0.25} value={t} onChange={e=>setT(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <label style={{display:"block"}}>输入 u1 = {u1.toFixed(2)}<input aria-label="输入 u1" type="range" min={-2} max={2} step={0.25} value={u1} onChange={e=>setU1(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <label style={{display:"block"}}>输入 u2 = {u2.toFixed(2)}<input aria-label="输入 u2" type="range" min={-1} max={1} step={0.25} value={u2} onChange={e=>setU2(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <p aria-live="polite">输出 = ({data.output.map(v=>v.toFixed(2)).join(", ")})；行列式 = {data.determinant.toFixed(2)}；秩 = {data.rank}；输出长度 = {data.norm.toFixed(4)}</p>
    <p>{data.rank===1?"两列共线：输出只能落在 y2 = y1 这条直线上，目标 (3, 4) 无法达到。":"两列不共线：允许输入取任意实数时，每个二维目标都有唯一输入。滑块仅展示有限范围。"}</p>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button type="button" style={buttonStyle} onClick={()=>setT(2)}>让两列共线</button><button type="button" style={buttonStyle} onClick={()=>{setT(1);setU1(2);setU2(1);}}>恢复默认</button></div>
    <p style={{fontSize:13}}>坐标轴固定为[−5, 5]，画布保持正方形。灰网格展示的输入范围是[−1, 1]²；滑块控制的输入范围单独列在控件中。这里只观察静态线性关系，不代表真实设备的动态或输入约束。</p>
  </section>;
}
