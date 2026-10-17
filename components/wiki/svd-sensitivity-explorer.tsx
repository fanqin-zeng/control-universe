"use client";

import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";

export function calculateSvdSensitivity(s:number,delta:number,angle:number,tau:number) {
  if(![s,delta,angle,tau].every(Number.isFinite)||s<0||s>1||Math.abs(delta)>.05||angle<0||angle>90||tau<0||tau>.2)throw new Error("参数超出教学范围");
  const radians=angle*Math.PI/180,co=Math.cos(radians),si=Math.sin(radians);
  const matrix=[[co,-si*s],[si,co*s]];
  const map=(a:number,b:number)=>[co*a-si*s*b,si*a+co*s*b];
  const trueOutput=map(1,1);
  const measured=[trueOutput[0]-si*delta,trueOutput[1]+co*delta];
  const exact=[1,s>0?1+delta/s:0];
  const truncated=[1,s>tau?1+delta/s:0];
  const prediction=map(truncated[0],truncated[1]);
  const residual=Math.hypot(measured[0]-prediction[0],measured[1]-prediction[1]);
  const ellipse=Array.from({length:121},(_,i)=>map(Math.cos(2*Math.PI*i/120),Math.sin(2*Math.PI*i/120)));
  return {matrix,singularValues:[1,s],rank:s>0?2:1,retained:s>tau?2:1,condition:s>0?1/s:null,trueOutput,measured,exact,truncated,error:Math.hypot(truncated[0]-1,truncated[1]-1),residual,ellipse};
}

export function SvdSensitivityExplorer(){
  const [s,setS]=useState(.1),[delta,setDelta]=useState(.01),[angle,setAngle]=useState(0),[tau,setTau]=useState(.05);
  const data=useMemo(()=>calculateSvdSensitivity(s,delta,angle,tau),[s,delta,angle,tau]);
  const option:EChartsOption=useMemo(()=>({animation: false,
    grid:{left:45,right:45,top:45,bottom:45},
    legend:{data:["单位圆的像","无噪输出","含噪测量"]},
    xAxis:{type:"value",min:-1.6,max:1.6,name:"输出1"},yAxis:{type:"value",min:-1.6,max:1.6,name:"输出2"},
    tooltip:{trigger:"item"},
    series:[{name:"单位圆的像",type:"line",data:data.ellipse,showSymbol:false,lineStyle:{color:"#2563eb",width:2}},
      {name:"无噪输出",type:"scatter",data:[data.trueOutput],symbol:"diamond",symbolSize:12,itemStyle:{color:"#15803d"}},
      {name:"含噪测量",type:"scatter",data:[data.measured],symbolSize:8,itemStyle:{color:"#ea580c"}}],
  }),[data]);
  const ref=useECharts(option);
  const buttonStyle={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,background:"var(--background)",color:"var(--foreground)",cursor:"pointer"};
  const pair=(x:number[])=>"("+x.map(v=>v.toFixed(3)).join(", ")+")";
  return <section aria-label="奇异值与截断实验" className="not-prose" style={{color:"var(--foreground)",border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",minWidth:0}}>
    <p>A = R(θ) diag(1, s)，R(θ)表示平面旋转。真实输入固定(1, 1)；噪声δ沿第二条左奇异方向。蓝线是单位圆的无噪声像，绿菱形和橙点分别是无噪输出与含噪测量，重合时橙点覆盖中心。</p>
    <div ref={ref} style={{width:"100%",maxWidth:440,aspectRatio:"1 / 1"}} />
    <label style={{display:"block"}}>较小奇异值 s = {s.toFixed(2)}<input aria-label="较小奇异值 s" type="range" min={0} max={1} step={.01} value={s} onChange={e=>setS(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <label style={{display:"block"}}>测量噪声 δ = {delta.toFixed(2)}<input aria-label="测量噪声 delta" type="range" min={-.05} max={.05} step={.01} value={delta} onChange={e=>setDelta(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <label style={{display:"block"}}>旋转角 θ = {angle}°<input aria-label="旋转角 theta" type="range" min={0} max={90} step={15} value={angle} onChange={e=>setAngle(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <label style={{display:"block"}}>绝对截断阈值 τ = {tau.toFixed(2)}<input aria-label="绝对截断阈值 tau" type="range" min={0} max={.2} step={.01} value={tau} onChange={e=>setTau(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <p aria-live="polite">精确秩 = {data.rank}；保留方向数 = {data.retained}；二范数条件数 = {data.condition===null?"∞":data.condition.toFixed(3)}</p>
    <p aria-live="polite">精确伪逆解 = {pair(data.exact)}；截断解 = {pair(data.truncated)}；截断解误差 = {data.error.toFixed(3)}；残差长度 = {data.residual.toFixed(3)}</p>
    <p>无噪输出 = {pair(data.trueOutput)}；含噪测量 = {pair(data.measured)}</p>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <button type="button" style={buttonStyle} onClick={()=>setTau(.2)}>舍弃弱方向</button>
      <button type="button" style={buttonStyle} onClick={()=>setS(0)}>矩阵秩亏</button>
      <button type="button" style={buttonStyle} onClick={()=>setDelta(0)}>去掉噪声</button>
      <button type="button" style={buttonStyle} onClick={()=>{setS(.1);setDelta(.01);setAngle(0);setTau(.05);}}>恢复默认</button>
    </div>
    <p style={{fontSize:13}}>坐标轴固定[−1.6, 1.6]。只有奇异值严格大于τ才保留；精确秩不随阈值改变。解向量可能很大，故不画进输出平面；所有误差均指本实验已知真实输入，并非实际任务自动可得。</p>
  </section>;
}
