"use client";
import {useMemo, useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {deploymentExperiment, type DeploymentSignal} from '@/lib/controller-deployment';
export function ControllerDeploymentExplorer() {
  const [Ts,setTs] = useState(.02), [F,setF] = useState(8), [signal,setSignal] = useState<DeploymentSignal>('step');
  const v = useMemo(() => deploymentExperiment(Ts,F,signal), [Ts,F,signal]);
  const option = useMemo<EChartsOption>(() => ({animation: false, tooltip: {trigger: 'axis'},
    legend: {data: ['浮点递推','16位定点递推']}, grid: {left: 45,right: 15,top: 40,bottom: 45},
    xAxis: {type:'value',min:0,max:80*Ts,name:'时间 (s)',nameLocation:'middle',nameGap:28},
    yAxis: {type:'value',min:-2.5,max:2.5,name:'补偿器输出'},
    series: [
      {name:'浮点递推',type:'line',step:'end',showSymbol:false,data:v.points.map(p=>[p.t,p.floating])},
      {name:'16位定点递推',type:'line',step:'end',showSymbol:false,lineStyle:{type:'dashed'},data:v.points.map(p=>[p.t,p.fixed])}
    ]}),[v,Ts]);
  const chart = useECharts(option);
  return <section className="not-prose" aria-label="控制器部署实验" style={{padding:14,margin:'20px 0',border:'1px solid #cbd5e1',borderRadius:10,minWidth:0,color:'#172033'}}>
    <strong>同一补偿器，有限字长会留下什么？</strong>
    <p>C(s)=2/(0.2s+1)，当前输入入式后提交状态；80拍。定点系数/状态都使用F个小数位，最近舍入、半值远离零、16位饱和；未模拟某款芯片的指令。</p>
    <label style={{display:'block'}}>采样周期 Ts：{Ts.toFixed(2)} s<input aria-label="采样周期Ts" type="range" min={.01} max={.1} step={.01} value={Ts} onChange={e=>setTs(+e.target.value)} style={{width:'100%'}} /></label>
    <label style={{display:'block'}}>小数位 F：{F}<input aria-label="小数位F" type="range" min={4} max={12} step={1} value={F} onChange={e=>setF(+e.target.value)} style={{width:'100%'}} /></label>
    <label>输入工况 <select aria-label="输入工况" value={signal} onChange={e=>setSignal(e.target.value as DeploymentSignal)} style={{padding:6,maxWidth:'100%'}}><option value="step">单位阶跃</option><option value="pulse">正负脉冲</option><option value="decay">零输入衰减</option></select></label>
    <p data-deployment-coeff>a={v.a.toFixed(6)}；b0=b1={v.b.toFixed(6)}；整数系数A={v.A}、B={v.B}；aq={v.aq.toFixed(6)}。</p>
    <div ref={chart} style={{width:'100%',height:270}} />
    <p aria-live="polite" data-deployment-metrics>首拍浮点={v.first.toFixed(6)}，定点={v.fixedFirst.toFixed(6)}；末拍浮点={v.finalFloat.toFixed(6)}，定点={v.finalFixed.toFixed(6)}；最大绝对差={v.maxError.toFixed(6)}；存储饱和={v.clipped}拍。</p>
    <p>{signal==='decay'?'零输入时u[-1]=0.25，误差历史为0。稳定的量化系数仍可能留下非零状态；末拍值不是稳态证明。':'两条曲线是同一实现约定下的精度观察；不代表完整闭环或实际硬件已验收。'}</p>
    <button onClick={()=>{setTs(.02);setF(8);setSignal('step');}} style={{padding:8,border:'1px solid #cbd5e1',borderRadius:6}}>恢复默认</button>
  </section>;
}
