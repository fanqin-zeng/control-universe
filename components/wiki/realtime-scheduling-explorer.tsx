"use client";
import {useMemo,useState} from 'react';import type {EChartsOption} from 'echarts';import {useECharts} from './use-echarts';
import {schedulingCases,schedulingExperiment,type SchedulingPolicy} from '@/lib/realtime-scheduling';
export function RealtimeSchedulingExplorer(){
 const [scenario,setScenario]=useState(0),[c3,setC3]=useState(3),[policy,setPolicy]=useState<SchedulingPolicy>('RMS');
 const v=useMemo(()=>schedulingExperiment(scenario,c3,policy),[scenario,c3,policy]);
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},grid:{left:45,right:12,top:25,bottom:40},
  xAxis:{type:'value',min:0,max:60,name:'时间 (ms)',nameLocation:'middle',nameGap:26},yAxis:{type:'value',min:0,max:4,interval:1,name:'任务编号'},
  series:v.tasks.map((_,i)=>({name:'τ'+(i+1),type:'line',showSymbol:false,lineStyle:{width:9},data:v.trace.flatMap((task,k)=>task===i?[[k/2,i+1],[(k+1)/2,i+1],[(k+1)/2,null]]:[[k/2,null]])}))}),[v]);
 const chart=useECharts(option);
 return <section className="not-prose" aria-label="实时调度实验" style={{padding:14,margin:'20px 0',border:'1px solid #cbd5e1',borderRadius:10,minWidth:0,color:'#172033'}}>
 <strong>同样的作业，什么时候能完成？</strong><p>单核、可抢占、独立周期任务、D=T、零开销；0.5ms网格，观察0–60ms。超期作业保留继续执行，释放新作业不会覆盖旧工作。</p>
 <label style={{display:'block'}}>工况 <select aria-label="调度工况" value={scenario} onChange={e=>setScenario(+e.target.value)} style={{padding:6,maxWidth:'100%'}}>{schedulingCases.map((v,i)=><option key={i} value={i}>{v.name}</option>)}</select></label>
 <label style={{display:'block'}}>算法 <select aria-label="调度算法" value={policy} onChange={e=>setPolicy(e.target.value as SchedulingPolicy)} style={{padding:6}}><option>RMS</option><option>EDF</option></select></label>
 <label style={{display:'block'}}>默认工况第三任务执行预算 C3：{c3} ms<input aria-label="第三任务执行预算" disabled={scenario!==0} type="range" min={1} max={14} step={1} value={c3} onChange={e=>setC3(+e.target.value)} style={{width:'100%'}}/></label>
 <p data-scheduling-tasks>{v.tasks.map((t,i)=>`τ${i+1}: T=${t.period}, C=${t.cost} ms`).join('；')}</p>
 <div ref={chart} style={{width:'100%',height:260}}/>
 <p data-scheduling-metrics aria-live="polite">U={v.utilization.toFixed(6)}；RMS充分界={v.bound.toFixed(6)}；首作业完成时刻={v.first.join(' / ')} ms；到期作业={v.due}；错过截止={v.misses}；窗口末未完成={v.pending}。</p>
 <p>{v.utilization<=v.bound?'满足RMS充分界（限定上述模型）。':'未满足RMS充分界不能直接判RMS不可调度。'} 有限时间线只是观察；理论证明须查适用条件与响应时间，不能据此声称目标板已满足时限。</p>
 <button onClick={()=>{setScenario(0);setC3(3);setPolicy('RMS');}} style={{padding:8,border:'1px solid #cbd5e1',borderRadius:6}}>恢复默认</button>
 </section>;
}
