"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {samplingBudget} from '@/lib/sampling-budget';
export function SamplingBudgetExplorer(){
 const [period,setPeriod]=useState(3),[delay,setDelay]=useState(1);
 const r=useMemo(()=>samplingBudget(period,delay),[period,delay]);
 const option=useMemo<EChartsOption>(()=>({animation:false,grid:{left:55,right:24,top:20,bottom:44},tooltip:{trigger:'axis'},xAxis:{type:'value',min:0,max:10,name:'周期 (ms)',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:0,max:70,name:'估算 PM (°)'},series:[{type:'line',showSymbol:false,data:Array.from({length:100},(_,i)=>{const t=(i+1)/10;return [t,samplingBudget(t,delay).estimatedPM];}),markLine:{silent:true,symbol:'none',data:[{yAxis:45,name:'要求 45°'},{xAxis:.7,name:'串行预算 .7ms'}]}},{type:'scatter',symbolSize:14,data:[[period,r.estimatedPM]],itemStyle:{color:r.phaseOK&&r.deadlineOK?'#047857':'#b91c1c'}}]}),[delay,period,r]);
 const chart=useECharts(option);
 return <section className="not-prose" aria-label="采样周期预算" style={{border:'1px solid #cbd5e1',borderRadius:10,padding:14,margin:'20px 0',color:'#172033',minWidth:0}}>
  <strong>快得来，也得算得完</strong><p>ωgc=100 rad/s，连续PM=60°，要求45°；题设串行执行预算0.7ms。</p>
  <label style={{display:'block'}}>采样周期：{period.toFixed(1)} ms<input aria-label="采样周期毫秒" type="range" min={.1} max={10} step={.1} value={period} onChange={e=>setPeriod(+e.target.value)} style={{width:'100%',display:'block'}}/></label>
  <label style={{display:'block'}}>额外延迟：{delay.toFixed(1)} ms<input aria-label="额外延迟毫秒" type="range" min={0} max={3} step={.1} value={delay} onChange={e=>setDelay(+e.target.value)} style={{width:'100%',display:'block'}}/></label>
  <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'12px 0'}}>{[['改用5ms周期',5,1],['来不及计算',.5,1],['预算无解',1,3],['恢复默认',3,1]].map(([name,t,d])=><button key={name} onClick={()=>{setPeriod(+t);setDelay(+d);}} style={{padding:8,border:'1px solid #cbd5e1',borderRadius:6,background:'#f8fafc',color:'#172033'}}>{name}</button>)}</div>
  <p aria-live="polite">估算PM={r.estimatedPM.toFixed(3)}°；周期上界={r.upperMs.toFixed(3)} ms；{r.feasible?'预算区间存在':'相位与执行预算没有交集'}；当前{r.phaseOK?'相位预算满足':'相位预算不满足'}，{r.deadlineOK?'执行预算满足':'执行预算不满足'}。</p>
  <div ref={chart} style={{height:260,width:'100%'}}/>
  <p>这里只做初选。最终要用实际数字模型检查交越、闭环极点和响应。执行预算为题设，没有测量真实硬件。</p>
 </section>;
}
