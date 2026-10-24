"use client";
import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "./use-echarts";
import { fusionExperiment } from "@/lib/sensor-fusion";
export function SensorFusionExplorer() {
  const [prior,setPrior]=useState(4),[r2,setR2]=useState(4),[rho,setRho]=useState(0),[z1,setZ1]=useState(2),[z2,setZ2]=useState(3);
  const result=useMemo(()=>fusionExperiment(prior,r2,rho,z1,z2),[prior,r2,rho,z1,z2]);
  const show=(x:number)=>Math.abs(x)<.0000005?"0.000000":x.toFixed(6);
  const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:"axis"},legend:{top:0,textStyle:{fontSize:11},data:["完整相关模型","错误独立模型自报","仅传感器1"]},grid:{left:48,right:16,top:75,bottom:45},xAxis:{type:"value",min:-4,max:6,name:"位置 / m",nameLocation:"middle",nameGap:28},yAxis:{type:"value",min:0,max:2,name:"密度 / m⁻¹",nameLocation:"middle",nameGap:32},series:[{name:"完整相关模型",type:"line",showSymbol:false,data:result.curve.map(p=>[p.x,p.joint])},{name:"错误独立模型自报",type:"line",showSymbol:false,lineStyle:{type:"dashed"},data:result.curve.map(p=>[p.x,p.naive])},{name:"仅传感器1",type:"line",showSymbol:false,lineStyle:{type:"dotted"},data:result.curve.map(p=>[p.x,p.single])}]}),[result]);
  const chart=useECharts(option);
  return <section aria-label="相关噪声融合探索" style={{border:"1px solid #94a3b8",borderRadius:12,padding:16,margin:"24px 0",minWidth:0}}>
    <p style={{marginTop:0}}>同一拍、同一坐标的标量位置；先验均值0，第一路噪声方差1。完整模型知道真实相关系数，错误模型始终假设独立。</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
      <label>先验方差 <select aria-label="先验方差" value={prior} onChange={e=>setPrior(Number(e.target.value))}>{[1,4].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
      <label>第二路噪声方差 <select aria-label="第二路噪声方差" value={r2} onChange={e=>setR2(Number(e.target.value))}>{[1,4].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
      <label>噪声相关系数 <select aria-label="噪声相关系数" value={rho} onChange={e=>setRho(Number(e.target.value))}>{[-.5,0,.5,.9].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
      <label>第一路读数 <select aria-label="第一路读数" value={z1} onChange={e=>setZ1(Number(e.target.value))}>{[0,2].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
      <label>第二路读数 <select aria-label="第二路读数" value={z2} onChange={e=>setZ2(Number(e.target.value))}>{[2,3].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
      <button type="button" onClick={()=>{setPrior(4);setR2(4);setRho(0);setZ1(2);setZ2(3);}} style={{padding:"4px 12px",border:"1px solid #64748b",borderRadius:4}}>恢复默认</button>
    </div>
    <p data-testid="fusion-readout" style={{overflowWrap:"anywhere"}}>完整模型均值 {show(result.mean)}、方差 {show(result.variance)}、实际MSE {show(result.actualMse)}；错误独立模型均值 {show(result.naiveMean)}、报告方差 {show(result.naiveVariance)}、实际MSE {show(result.naiveActualMse)}；单路均值 {show(result.singleMean)}、方差 {show(result.singleVariance)}。</p>
    <p data-testid="fusion-whitening" style={{overflowWrap:"anywhere"}}>白化顺序均值 {show(result.whitened.mean)}、方差 {show(result.whitened.variance)}；逆序均值 {show(result.reversed.mean)}、方差 {show(result.reversed.variance)}；观测权重 {show(result.firstWeight)}、{show(result.secondWeight)}。</p>
    <div ref={chart} style={{width:"100%",height:310}} />
    <p style={{fontSize:14}}>均值/读数单位m，方差与MSE单位m²，相关系数无量纲。MSE取随机先验与真实噪声的总体期望，不能由当前读数残差替代。曲线固定显示−4至6m、密度0至2m⁻¹，未显示的尾部不重新归一化；错误模型曲线只代表其自报分布。</p>
  </section>;
}
