"use client";
import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "./use-echarts";
import { estimationCase, type CaseScenario } from "@/lib/estimation-case-study";
export function EstimationCaseExplorer(){
  const [scenario,setScenario]=useState<CaseScenario>("clean"),[qscale,setQscale]=useState(1),[gate,setGate]=useState(false),[seed,setSeed]=useState(7),[step,setStep]=useState(1);
  const r=useMemo(()=>estimationCase(scenario,qscale,gate,seed),[scenario,qscale,gate,seed]);const h=r.history[step-1];const show=(x:number)=>Math.abs(x)<.0000005?"0.000000":x.toFixed(6);
  const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:"axis"},legend:{top:0,textStyle:{fontSize:11},data:["融合误差","单路误差","+2σ","−2σ"]},grid:{left:49,right:15,top:65,bottom:45},xAxis:{type:"value",min:0,max:12,name:"时间 / s",nameLocation:"middle",nameGap:28},yAxis:{type:"value",min:-12,max:12,name:"位置误差 / m",nameLocation:"middle",nameGap:34},series:[{name:"融合误差",type:"line",data:r.history.map(h=>[h.step,h.error])},{name:"单路误差",type:"line",lineStyle:{type:"dotted"},data:r.singleHistory.map(h=>[h.step,h.error])},{name:"+2σ",type:"line",showSymbol:false,lineStyle:{type:"dashed"},data:r.history.map(h=>[h.step,2*h.sigma])},{name:"−2σ",type:"line",showSymbol:false,lineStyle:{type:"dashed"},data:r.history.map(h=>[h.step,-2*h.sigma])}]}),[r]);const chart=useECharts(option);
  return <section aria-label="小车估计案例探索" style={{border:"1px solid #94a3b8",borderRadius:12,padding:16,margin:"24px 0",minWidth:0}}>
    <p style={{marginTop:0}}>每秒先共同预测，再按传感器1→2更新。真值只用于离线评分；三种工况共用同一种子的加速度与测量噪声。门限固定9，Q倍率只改估计器。</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
      <label>工况 <select aria-label="工况" value={scenario} onChange={e=>setScenario(e.target.value as CaseScenario)}><option value="clean">两路正常</option><option value="dropout">观测中断</option><option value="spike">第6秒离群</option></select></label>
      <label>估计器Q倍率 <select aria-label="估计器Q倍率" value={qscale} onChange={e=>setQscale(Number(e.target.value))}>{[.25,1,4].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
      <label>创新门限 <select aria-label="创新门限" value={gate?"on":"off"} onChange={e=>setGate(e.target.value==="on")}><option value="off">关闭</option><option value="on">开启</option></select></label>
      <label>噪声种子 <select aria-label="噪声种子" value={seed} onChange={e=>setSeed(Number(e.target.value))}>{[7,19,43].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
      <label>查看时刻 <select aria-label="查看时刻" value={step} onChange={e=>setStep(Number(e.target.value))}>{Array.from({length:12},(_,i)=><option key={i} value={i+1}>{i+1}s</option>)}</select></label>
      <button type="button" onClick={()=>{setScenario("clean");setQscale(1);setGate(false);setSeed(7);setStep(1);}} style={{padding:"4px 12px",border:"1px solid #64748b",borderRadius:4}}>恢复默认</button>
    </div>
    <p data-testid="case-readout" style={{overflowWrap:"anywhere"}}>位置RMSE 融合 {show(r.rmse)}、单路 {show(r.singleRmse)}；带内计数 {r.coverage}/12；拒收 {r.rejected}、纯预测拍 {r.predictionOnly}；最大NIS {show(r.peakNis)}。</p>
    <p data-testid="case-step" style={{overflowWrap:"anywhere"}}>第{step}秒：估计位置 {show(h.mean[0])}、速度 {show(h.mean[1])}；Ppp {show(h.covariance[0])}、Ppv {show(h.covariance[1])}、Pvv {show(h.covariance[2])}；{h.predictionOnly?"仅预测":"含观测更新"}。</p>
    <p data-testid="case-events" style={{overflowWrap:"anywhere"}}>{h.events.length?h.events.map(e=>`传感器${e.sensor} 创新 ${show(e.innovation)}、S ${show(e.S)}、NIS ${show(e.nis)}、${e.accepted?"接受":"拒收"}`).join("；"):"本拍没有可用观测"}。</p>
    <div ref={chart} style={{width:"100%",height:320}} />
    <p style={{fontSize:14}}>统计窗1—12秒，不含初始拍；RMSE/误差单位m，速度m/s，Ppp为m²、Ppv为m²/s、Pvv为m²/s²，NIS无量纲。±2σ来自报告协方差，带内计数不等于置信保证。固定轴±12m，超界曲线可能裁切，评分使用完整数值。数据与代码在本页Notebook可复算。</p>
  </section>;
}
