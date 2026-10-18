"use client";
import {useMemo, useState} from "react";
import type {EChartsOption} from "echarts";
import {sampledMode} from "@/lib/sampled-mode";
import {useECharts} from "./use-echarts";

export function SampledModeExplorer() {
  const [sigma, setSigma] = useState(-0.5), [omega, setOmega] = useState(2), [Ts, setTs] = useState(0.1);
  const mode = useMemo(() => sampledMode(sigma, omega, Ts), [sigma, omega, Ts]);
  const option: EChartsOption = useMemo(() => ({animation: false,
    grid:{left:50,right:30,top:30,bottom:50}, tooltip:{trigger:"item"},
    xAxis:{type:"value",name:"Re(z)",min:-1.3,max:1.3},yAxis:{type:"value",name:"Im(z)",min:-1.3,max:1.3},
    series:[{type:"line",name:"单位圆",showSymbol:false,data:Array.from({length:201},(_,i)=>[Math.cos(2*Math.PI*i/200),Math.sin(2*Math.PI*i/200)]),lineStyle:{color:"#64748b"}},
      {type:"line",name:"映射点方向",showSymbol:false,data:[[0,0],[mode.real,mode.imag]],lineStyle:{color:"#2563eb"}},
      {type:"scatter",name:"映射后的模态",symbolSize:15,data:[[mode.real,mode.imag]],itemStyle:{color:"#2563eb"}}],
  }), [mode]);
  const chart = useECharts(option);
  const button = {padding:"7px 10px",border:"1px solid var(--border)",borderRadius:6,background:"var(--background)",color:"var(--foreground)",cursor:"pointer"};
  return <section aria-label="连续模态采样映射" className="not-prose" style={{border:"1px solid var(--border)",borderRadius:10,padding:14,margin:"18px 0",minWidth:0,color:"var(--foreground)"}}>
    <p style={{fontWeight:600,marginTop:0}}>一个连续指数模态，每隔多久看一次？</p>
    <div style={{display:"grid",gap:10}}>
      <label>衰减率 σ：{sigma.toFixed(2)} /s<input aria-label="衰减率" type="range" min={-2} max={0.5} step={0.1} value={sigma} onChange={e=>setSigma(Number(e.target.value))} style={{width:"100%"}} /></label>
      <label>角频率 ω：{omega.toFixed(3)} rad/s<input aria-label="角频率" type="range" min={0} max={80} step={0.1} value={omega} onChange={e=>setOmega(Number(e.target.value))} style={{width:"100%"}} /></label>
      <label>采样间隔：{Ts.toFixed(2)} s<input aria-label="采样间隔" type="range" min={0.05} max={0.2} step={0.01} value={Ts} onChange={e=>setTs(Number(e.target.value))} style={{width:"100%"}} /></label>
    </div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
      <button style={button} onClick={()=>setSigma(0)}>移到单位圆</button>
      <button style={button} onClick={()=>setSigma(0.5)}>增长模态</button>
      <button style={button} onClick={()=>{setSigma(-0.5);setOmega(2+20*Math.PI);setTs(0.1);}}>同点频率示例</button>
      <button style={button} onClick={()=>{setSigma(-0.5);setOmega(2);setTs(0.1);}}>恢复默认</button>
    </div>
    <p aria-live="polite" style={{overflowWrap:"anywhere"}}>z = {mode.real.toFixed(6)} {mode.imag < 0 ? "−" : "+"} {Math.abs(mode.imag).toFixed(6)}j；半径 {mode.radius.toFixed(6)}；每步转角 {mode.angle.toFixed(6)} rad。</p>
    <p style={{fontSize:14}}>σ 小于零：该模态衰减；σ 为零：幅值不变；σ 大于零：增长。单位圆上的一个点不能独自证明整个系统稳定。</p>
    <div ref={chart} style={{width:"100%",aspectRatio:"1 / 1",maxWidth:360,margin:"0 auto",minWidth:0}} />
  </section>;
}
