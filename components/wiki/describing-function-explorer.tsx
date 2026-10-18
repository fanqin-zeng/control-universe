"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
import {describingN,type DFType} from "@/lib/describing-function";
const names:Record<DFType,string>={relay:"理想继电器",saturation:"饱和",deadzone:"死区",hysteresis:"滞环继电器",backlash:"间隙"};
export function DescribingFunctionExplorer(){
  const [type,setType]=useState<DFType>("saturation"),[k,setK]=useState(1),[a,setA]=useState(1),[amplitude,setAmplitude]=useState(2);
  const n=describingN(type,amplitude,k,a);
  const option=useMemo<EChartsOption>(()=>{const data=Array.from({length:91},(_,i)=>{const A=.5+i*.05;return {A,...describingN(type,A,k,a)};});return {animation:false,grid:{left:45,right:15,top:40,bottom:45},legend:{top:0},tooltip:{trigger:"axis"},xAxis:{type:"value",min:.5,max:5,name:"输入幅值 A"},yAxis:{type:"value",min:-6,max:6,name:"N"},series:([['实部','re'],['虚部','im'],['模','mag']] as const).map(([name,key])=>({type:"line",name,showSymbol:false,data:data.map(d=>[d.A,d[key]])}))};},[type,k,a]);
  const ref=useECharts(option);
  const reset=()=>{setType("saturation");setK(1);setA(1);setAmplitude(2);};
  return <div className="not-prose" data-df-explorer style={{padding:16,border:"1px solid #cbd5e1",borderRadius:8,margin:"24px 0",color:"var(--foreground)"}}>
    <p style={{fontWeight:600}}>只看输出基波，会得到怎样的增益？</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
      <label>非线性 <select aria-label="描述函数类型" value={type} onChange={e=>{const t=e.target.value as DFType;setType(t);setA(t==="saturation"?1:.3);}}>{Object.entries(names).map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></label>
      <label>{type==="relay"||type==="hysteresis"?"继电器幅值 M":"斜率 k"} = {k.toFixed(1)} <input aria-label="非线性增益" type="range" min={.5} max={2} step={.1} value={k} onChange={e=>setK(Number(e.target.value))} style={{width:110}} /></label>
      {type!=="relay"&&<label>{type==="backlash"?"间隙半宽 b":type==="hysteresis"?"滞环半宽 h":"输入阈值 a"} = {a.toFixed(1)} <input aria-label="非线性阈值" type="range" min={.1} max={2} step={.1} value={a} onChange={e=>setA(Number(e.target.value))} style={{width:110}} /></label>}
      <label>A = {amplitude.toFixed(1)} <input aria-label="读数幅值" type="range" min={.5} max={5} step={.1} value={amplitude} onChange={e=>setAmplitude(Number(e.target.value))} style={{width:110}} /></label>
      <button onClick={reset} style={{padding:"4px 10px",border:"1px solid #cbd5e1",borderRadius:4}}>恢复描述函数默认</button>
    </div>
    <div ref={ref} style={{width:"100%",height:350}} />
    <p data-df-reading>Re N = {n.re.toFixed(6)}；Im N = {n.im.toFixed(6)}；|N| = {n.mag.toFixed(6)}。</p>
    {!n.switches&&<p>幅值未超过阈值，按保持原状态的周期响应基波为零；输出可能带直流，不能据此直接套对称切换的谐波平衡。</p>}
  </div>;
}
