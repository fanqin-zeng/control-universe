"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {recedingExample} from '@/lib/receding-horizon';
export function RecedingHorizonExplorer(){
  const [np,setNp]=useState(4),[bound,setBound]=useState(1),[shock,setShock]=useState(.4),[timeout,setTimeout]=useState(false);
  const r=useMemo(()=>recedingExample(np,bound,shock),[np,bound,shock]);
  const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{data:['原预测','测量后新预测','超时保持示例']},grid:{left:42,right:25,top:64,bottom:38},xAxis:{type:'value',min:0,max:9,interval:1,name:'采样步'},yAxis:{type:'value',min:-1,max:2,name:'水位'},series:[{name:'原预测',type:'line',data:[0,...r.initial.prediction].map((v,i)=>[i,v])},{name:'测量后新预测',type:'line',data:[r.measured,...r.revised.prediction].map((v,i)=>[i+1,v])},{name:'超时保持示例',type:'line',lineStyle:{type:'dashed'},data:timeout?[r.measured,...r.held].map((v,i)=>[i+1,v]):[]}]}),[r,timeout]);
  const ref=useECharts(option);
  return <section aria-label="滚动优化实验" style={{padding:16,border:'1px solid var(--border)',borderRadius:10,margin:'24px 0'}}>
    <strong>执行一步后，用刚测到的水位重算</strong>
    <p>无量纲水箱 x⁺=0.8x+0.2u，目标1，初始水位与阀门输入均0。Nu=1：只选一次增量，以后保持开度。权重R=0.1，|u|≤2。</p>
    {[{name:'预测步数 Np',value:np,set:setNp,min:1,max:8,step:1},{name:'单步调整上限',value:bound,set:setBound,min:.25,max:1,step:.25},{name:'首步后状态偏移',value:shock,set:setShock,min:-.4,max:.4,step:.2}].map(p=><label key={p.name} style={{display:'block',margin:'12px 0'}}>{p.name}：{p.value}<input aria-label={p.name} type="range" min={p.min} max={p.max} step={p.step} value={p.value} onChange={e=>p.set(Number(e.target.value))} style={{width:'100%'}}/></label>)}
    <button onClick={()=>setTimeout(!timeout)} style={{padding:8,marginRight:8}}>模拟求解超时：{timeout?'开':'关'}</button>
    <button onClick={()=>{setNp(4);setBound(1);setShock(.4);setTimeout(false);}} style={{padding:8}}>恢复默认</button>
    <p data-testid="receding-readout">首个输入 {r.initial.u.toFixed(6)}；原预测 [{r.initial.prediction.map(v=>v.toFixed(6)).join(', ')}]；新测量 {r.measured.toFixed(6)}；新候选输入 {r.revised.u.toFixed(6)}</p>
    <p data-testid="receding-status">{timeout?'超时模拟：拒绝候选，暂时保持先前输入':'解析解通过此例的边界与驻点核验，采用新输入'} { (timeout?r.initial.u:r.revised.u).toFixed(6)}。保持输入仅是演示分支，实际设备须有独立验证的回退。</p>
    <div ref={ref} style={{height:340,width:'100%'}}/>
    <p>两条实线是不同测量时刻作出的名义预测。它们不构成算法优劣或抗扰保证；偏移也可能代表传感器误差。</p>
  </section>;
}
