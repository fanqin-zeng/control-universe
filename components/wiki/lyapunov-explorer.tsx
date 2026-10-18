"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
import {PENDULUM_DEFAULT,pendulumEnergy,pendulumLevel,pendulumTrajectory,wrappedPhase,wrapAngle} from "@/lib/lyapunov-pendulum";
export function LyapunovExplorer() {
  const [d,setD]=useState(PENDULUM_DEFAULT.d),[theta,setTheta]=useState(PENDULUM_DEFAULT.theta),[omega,setOmega]=useState(PENDULUM_DEFAULT.omega);
  const samples=useMemo(()=>pendulumTrajectory(d,theta,omega),[d,theta,omega]);
  const initial=pendulumEnergy(theta,omega),last=samples[samples.length-1];
  const option=useMemo<EChartsOption>(()=>({animation:false,grid:{left:55,right:20,top:30,bottom:45},tooltip:{trigger:"item"},
    xAxis:{type:"value",min:-Math.PI,max:Math.PI,name:"θ 折回一圈 (rad)",nameLocation:"middle",nameGap:28},
    yAxis:{type:"value",min:-4,max:4,name:"ω"},
    series:[...[0.25,0.75,1.5,1.9].map(c=>({type:"line" as const,showSymbol:false,lineStyle:{width:1,color:"#cbd5e1"},data:pendulumLevel(c)})),
      {type:"line",showSymbol:false,lineStyle:{width:2,color:"#f59e0b",type:"dashed"},data:pendulumLevel(initial)},
      {type:"line",name:"轨迹",showSymbol:false,connectNulls:false,lineStyle:{width:2,color:"#2563eb"},data:wrappedPhase(samples)},
      {type:"scatter",symbolSize:9,itemStyle:{color:"#dc2626"},data:[[wrapAngle(theta),omega]]}]
  }),[samples,initial,theta,omega]);
  const energyOption=useMemo<EChartsOption>(()=>({animation:false,grid:{left:55,right:20,top:25,bottom:40},tooltip:{trigger:"axis"},
    xAxis:{type:"value",min:0,max:60,name:"t"},yAxis:{type:"value",min:0,max:6.6,name:"V"},
    series:[{type:"line",name:"能量",showSymbol:false,data:samples.map(s=>[s.t,s.energy]),lineStyle:{color:"#dc2626"}}]
  }),[samples]);
  const phaseRef=useECharts(option),energyRef=useECharts(energyOption);
  return <div className="not-prose" data-lyapunov-explorer style={{border:"1px solid #d1d5db",borderRadius:8,padding:16,margin:"24px 0",background:"var(--background)",color:"var(--foreground)"}}>
    <p style={{fontWeight:600}}>阻尼摆：同一张能量图，不同的运动</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:14}}>
      <label>阻尼 d = {d.toFixed(2)} <input aria-label="阻尼 d" type="range" min={0} max={2} step={0.05} value={d} onChange={e=>setD(Number(e.target.value))} style={{width:120}} /></label>
      <label>初始角度 θ₀ = {theta.toFixed(1)} <input aria-label="初始角度" type="range" min={-3} max={3} step={0.1} value={theta} onChange={e=>setTheta(Number(e.target.value))} style={{width:120}} /></label>
      <label>初始角速度 ω₀ = {omega.toFixed(1)} <input aria-label="初始角速度" type="range" min={-3} max={3} step={0.1} value={omega} onChange={e=>setOmega(Number(e.target.value))} style={{width:120}} /></label>
      <button onClick={()=>{setD(PENDULUM_DEFAULT.d);setTheta(PENDULUM_DEFAULT.theta);setOmega(PENDULUM_DEFAULT.omega);}} style={{padding:"4px 10px",border:"1px solid #cbd5e1",borderRadius:4}}>恢复默认</button>
    </div>
    <div ref={phaseRef} style={{width:"100%",height:340}} />
    <div ref={energyRef} style={{width:"100%",height:230}} />
    <p data-lyapunov-reading style={{fontSize:13,lineHeight:1.8}}>V₀ = {initial.toFixed(6)}；t = {last.t.toFixed(2)} 时 θ = {last.theta.toFixed(6)}，ω = {last.omega.toFixed(6)}，V = {last.energy.toFixed(6)}。展开角所在圈：{Math.round((last.theta-wrapAngle(last.theta))/(2*Math.PI))}。</p>
    <p style={{fontSize:13,lineHeight:1.8}}>{d===0?"无阻尼时能量守恒；低于顶点能量的轨迹往复摆动，高能量轨迹可以持续转圈。":initial<2?"初值在当前势阱内且 V₀ < 2，能量下降；可用 LaSalle 证明最终回到该势阱的最低点。":"V₀ ≥ 2：本课的低能量吸引域保证不适用；是否跨圈要看实际运动，不能直接说回到 θ = 0。"}图中只折回角度显示，跨边界断线；计算与读数保留展开角。60时刻的读数不是无穷时刻的极限。</p>
  </div>;
}
