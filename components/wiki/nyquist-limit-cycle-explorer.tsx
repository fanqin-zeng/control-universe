"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
import {describingG,describingN,harmonicCandidate} from "@/lib/describing-function";
export function NyquistLimitCycleExplorer(){
  const [K,setK]=useState(1),[a,setA]=useState(1),[T,setT]=useState(.5),[type,setType]=useState<"relay"|"saturation">("relay");
  const result=useMemo(()=>harmonicCandidate(type,K,a,T),[type,K,a,T]);
  const option=useMemo<EChartsOption>(()=>({animation:false,grid:{left:45,right:15,top:40,bottom:45},legend:{top:0},tooltip:{trigger:"item"},
    xAxis:{type:"value",min:-4,max:1,name:"实部"},yAxis:{type:"value",min:-4,max:4,name:"虚部"},
    series:[{type:"line",name:"G(jω)",showSymbol:false,data:Array.from({length:500},(_,i)=>{const w=.05*Math.exp(i*Math.log(400)/499),g=describingG(w,K,a,T);return[g.re,g.im];})},
      {type:"line",name:"-1/N(A)",showSymbol:false,data:Array.from({length:300},(_,i)=>{const A=.02+i*4/299;return[-1/describingN(type,A,1,1).re,0];})},
      ...(result.status!=="none"?[{type:"scatter" as const,name:result.status==="critical"?"临界穿越":"HB候选",symbolSize:10,data:[[result.real,0]]}]:[])]
  }),[K,a,T,type,result]);
  const ref=useECharts(option);
  return <div className="not-prose" data-hb-explorer style={{padding:16,border:"1px solid #cbd5e1",borderRadius:8,margin:"24px 0",color:"var(--foreground)"}}>
    <p style={{fontWeight:600}}>G(s) = K / [s(s+a)(T s+1)]，非线性单位幅值/斜率</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
      <label>非线性 <select aria-label="谐波平衡类型" value={type} onChange={e=>setType(e.target.value as "relay"|"saturation")}><option value="relay">理想继电器 M=1</option><option value="saturation">饱和 k=aₛ=1</option></select></label>
      <label>K = {K.toFixed(1)} <input aria-label="环路增益" type="range" min={.5} max={2} step={.1} value={K} onChange={e=>setK(Number(e.target.value))} style={{width:110}} /></label>
      <label>极点速率 a = {a.toFixed(1)} <input aria-label="极点速率" type="range" min={.5} max={2} step={.1} value={a} onChange={e=>setA(Number(e.target.value))} style={{width:110}} /></label>
      <label>时间常数 T = {T.toFixed(1)} <input aria-label="时间常数" type="range" min={.2} max={1} step={.1} value={T} onChange={e=>setT(Number(e.target.value))} style={{width:110}} /></label>
      <button onClick={()=>{setK(1);setA(1);setT(.5);setType("relay");}} style={{padding:"4px 10px",border:"1px solid #cbd5e1",borderRadius:4}}>恢复谐波平衡默认</button>
    </div>
    <div ref={ref} style={{width:"100%",height:380}} />
    <p data-hb-reading>{result.status==="none"?"无谐波平衡候选：所需增益超出饱和可给出的范围；不能据此证明没有任何周期解。":result.status==="critical"?"临界：饱和在线性区内有一族HB解，幅值不唯一，不能标成孤立极限环。":`HB候选 A = ${result.amplitude!.toFixed(6)}；ω = ${result.omega.toFixed(6)} rad/s；f = ${(result.omega/(2*Math.PI)).toFixed(6)} Hz；交点实部 = ${result.real.toFixed(6)}。`}</p>
    <p style={{fontSize:13}}>候选来自基波近似，是否存在孤立周期轨道及其稳定性仍需检查。图窗仅显示实部[-4,1]、虚部[-4,4]，不代表完整Nyquist围线。</p>
  </div>;
}
