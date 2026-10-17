"use client";

import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";

export function calculateFourierSynthesis(mode:"vibration"|"square",amplitude:number,phase:number,terms:number,time:number){
  if(![amplitude,phase,terms,time].every(Number.isFinite)||!['vibration','square'].includes(mode)||amplitude<0||amplitude>1||phase< -180||phase>180||!Number.isInteger(terms)||terms<1||terms>15||time<0||time>1)throw new RangeError("Outside the lesson domain");
  const radians=phase*Math.PI/180;
  const harmonics=mode==='vibration'?[[1,1],[3,amplitude]]:Array.from({length:terms},(_,i)=>[2*i+1,4/(Math.PI*(2*i+1))]);
  const at=(t:number)=>{
    const value=mode==='vibration'?Math.cos(2*Math.PI*t)+amplitude*Math.cos(6*Math.PI*t+radians):harmonics.reduce((s,[n,a])=>s+a*Math.sin(2*Math.PI*n*t),0);
    const sine=Math.sin(2*Math.PI*t);
    const target=mode==='square'?(Math.abs(sine)<1e-12?0:Math.sign(sine)):value;
    return [t,Math.abs(value)<1e-14?0:value,target];
  };
  const meanSquare=harmonics.reduce((s,[,a])=>s+a*a/2,0);
  return {value:at(time)[1],target:at(time)[2],meanSquare,rms:Math.sqrt(meanSquare),harmonics,
    samples:Array.from({length:601},(_,i)=>at(i/600))};
}

export function FourierSynthesisExplorer(){
  const[mode,setMode]=useState<"vibration"|"square">('vibration'),[amplitude,setAmplitude]=useState(.5),[phase,setPhase]=useState(0),[terms,setTerms]=useState(3),[time,setTime]=useState(0);
  const data=useMemo(()=>calculateFourierSynthesis(mode,amplitude,phase,terms,time),[mode,amplitude,phase,terms,time]);
  const waveOption:EChartsOption=useMemo(()=>({animation: false,grid:{left:48,right:28,top:40,bottom:45},tooltip:{trigger:"axis"},
    xAxis:{type:"value",min:0,max:1,name:"秒"},yAxis:{type:"value",min:-2.1,max:2.1,name:"位移 mm"},
    series:[{name:"有限正弦和",type:"line",showSymbol:false,data:data.samples.map(p=>[p[0],p[1]]),lineStyle:{color:"#2563eb",width:2}},
      ...(mode==='square'?[{name:"理想方波（跳点取中点）",type:"line" as const,showSymbol:false,data:data.samples.map(p=>[p[0],p[2]]),lineStyle:{color:"#6b7280",type:"dashed" as const}}]:[]),
      {name:"观察值",type:"scatter",data:[[time,data.value]],symbolSize:10,itemStyle:{color:"#b45309"}}],
  }),[data,mode,time]);
  const spectrumOption:EChartsOption=useMemo(()=>({animation: false,grid:{left:48,right:28,top:35,bottom:45},tooltip:{trigger:"axis"},
    xAxis:{type:"value",min:0,max:30,name:"Hz"},yAxis:{type:"value",min:0,max:1.5,name:"单边幅值 mm"},
    series:[{name:"有限和的谐波幅值",type:"bar",barWidth:10,data:data.harmonics,itemStyle:{color:"#2563eb"}}],
  }),[data]);
  const wave=useECharts(waveOption),spectrum=useECharts(spectrumOption);
  const button={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,background:"var(--background)",color:"var(--foreground)",cursor:"pointer"};
  return <section aria-label="傅里叶合成与频谱实验" className="not-prose" style={{border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",color:"var(--foreground)",minWidth:0}}>
    <p>{mode==='vibration'?"教学振动：1 Hz余弦 + 第三谐波。改变幅值或相位，观察波形怎样变；频率位置保持不变。":"方波近似：只保留前N个奇谐波。灰线为理想方波，跳点取左右中点0；蓝线为有限和。"}</p>
    <div ref={wave} style={{width:"100%",height:280}}/>
    <div ref={spectrum} style={{width:"100%",height:230}}/>
    <label style={{display:"block"}}>第三谐波幅值 = {amplitude.toFixed(2)} mm<input aria-label="第三谐波幅值" disabled={mode==='square'} type="range" min={0} max={1} step={.25} value={amplitude} onChange={e=>setAmplitude(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <label style={{display:"block"}}>第三谐波相位 = {phase}°<input aria-label="第三谐波相位" disabled={mode==='square'} type="range" min={-180} max={180} step={15} value={phase} onChange={e=>setPhase(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <label style={{display:"block"}}>方波奇谐波项数 N = {terms}<input aria-label="方波奇谐波项数" disabled={mode==='vibration'} type="range" min={1} max={15} step={1} value={terms} onChange={e=>setTerms(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <label style={{display:"block"}}>观察时刻 = {time.toFixed(2)} 秒<input aria-label="观察时刻" type="range" min={0} max={1} step={.05} value={time} onChange={e=>setTime(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <p aria-live="polite">当前有限和 = {data.value.toFixed(4)} mm；均方值 = {data.meanSquare.toFixed(4)} mm²；RMS = {data.rms.toFixed(4)} mm</p>
    {mode==='square'?<p>当前目标中点值 = {data.target.toFixed(4)} mm；有限和的均方值不等于无限方波的1 mm²。</p>:amplitude===0?<p>第三谐波幅值为零，此时无法从信号辨认它的相位。</p>:<p>上图叠加曲线，下图显示单边幅值；不是双边复系数，也不是从网格做FFT。</p>}
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <button type="button" style={button} onClick={()=>{setMode('vibration');setPhase(90);setTime(0);}}>第三谐波相位90°</button>
      <button type="button" style={button} onClick={()=>{setMode('square');setTerms(3);setTime(.25);}}>方波近似</button>
      <button type="button" style={button} onClick={()=>{setMode('vibration');setAmplitude(.5);setPhase(0);setTerms(3);setTime(0);}}>恢复默认</button>
    </div>
    <p style={{fontSize:13}}>横轴分别是秒与Hz，位置/位移按mm解释。曲线601点、间隔1/600秒；当前值按所选时刻直接算，均方值来自正交积分。幅值轴固定0…1.5，时间图固定±2.1；最高显示29Hz。教学模型不代表实测振动或故障诊断。</p>
  </section>;
}
