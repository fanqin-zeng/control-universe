"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {embeddedExperiment} from '@/lib/embedded-control';
export function EmbeddedControlExplorer(){
  const [bits,setBits]=useState(8),[slots,setSlots]=useState(100),[target,setTarget]=useState(60);
  const v=useMemo(()=>embeddedExperiment(bits,slots,target),[bits,slots,target]);
  const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{data:['接口量化','理想接口','目标']},grid:{left:48,right:12,top:40,bottom:38},
    xAxis:{type:'value',min:0,max:10,name:'时间 (s)',nameLocation:'middle',nameGap:25},yAxis:{type:'value',min:15,max:120,name:'温度 (°C)'},
    series:[{name:'接口量化',type:'line',showSymbol:false,data:v.points.map(p=>[p.t,p.y])},{name:'理想接口',type:'line',showSymbol:false,lineStyle:{type:'dashed'},data:v.points.map(p=>[p.t,p.ideal])},{name:'目标',type:'line',showSymbol:false,lineStyle:{type:'dotted'},data:[[0,target],[10,target]]}]}),[v,target]);
  const chart=useECharts(option);
  return <section className="not-prose" aria-label="嵌入式接口实验" style={{padding:14,margin:'20px 0',border:'1px solid #cbd5e1',borderRadius:10,minWidth:0,color:'#172033'}}>
    <strong>同一恒温箱，接口能记录多细？</strong>
    <p>0–100°C端点标定ADC；PWM抽象命令0..M。相同P控制、限幅与初值，Ts=0.1s，100次更新；这里没有芯片驱动或执行时间模型。</p>
    <label style={{display:'block'}}>ADC位数 N：{bits}<input aria-label="ADC位数" type="range" min={4} max={12} step={1} value={bits} onChange={e=>setBits(+e.target.value)} style={{width:'100%'}}/></label>
    <label style={{display:'block'}}>PWM时隙 <select aria-label="PWM时隙" value={slots} onChange={e=>setSlots(+e.target.value)} style={{padding:6}}>{[20,100,1000].map(m=><option key={m} value={m}>{m}</option>)}</select></label>
    <label style={{display:'block'}}>目标温度 <select aria-label="目标温度" value={target} onChange={e=>setTarget(+e.target.value)} style={{padding:6}}><option value={20}>20°C（持平）</option><option value={60}>60°C</option><option value={110}>110°C（不可达）</option></select></label>
    <p data-embedded-first>首拍ADC码={v.firstCode}，重建温度={v.firstRead.toFixed(6)}°C；PWM命令={v.firstPWM}，下一拍温度={v.firstY.toFixed(6)}°C。</p>
    <div ref={chart} style={{width:'100%',height:270}}/>
    <p aria-live="polite" data-embedded-metrics>10s末温={v.finalY.toFixed(6)}°C，理想接口末温={v.finalIdeal.toFixed(6)}°C；窗口最大轨迹差={v.maxGap.toFixed(6)}°C；命令越限={v.saturated}拍。</p>
    <p>两条曲线只观察本组参数的接口影响。P控制本身有静差；110°C超出模型加热能力。末点不是稳态证明，位数不代表实物总精度。</p>
    <button onClick={()=>{setBits(8);setSlots(100);setTarget(60);}} style={{padding:8,border:'1px solid #cbd5e1',borderRadius:6}}>恢复默认</button>
  </section>;
}
