"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {eventTriggered,eventCheckSteps} from '@/lib/event-triggered';
export function EventTriggeredExplorer(){
 const[h,setH]=useState(.05),[sigma,setSigma]=useState(.25);const r=useMemo(()=>eventTriggered(h,sigma),[h,sigma]);
 const option=useMemo<EChartsOption>(()=>({animation:false,legend:{data:['按事件更新','每拍更新','发送时刻'],top:0,textStyle:{color:'#172033',fontSize:11}},grid:{left:45,right:15,top:45,bottom:40},tooltip:{trigger:'axis'},xAxis:{type:'value',min:0,max:6,name:'时间 (s)',nameLocation:'middle',nameGap:25},yAxis:{type:'value',min:-2.2,max:2.2,name:'状态 x'},series:[{name:'按事件更新',type:'line',showSymbol:false,data:r.curve,itemStyle:{color:'#0369a1'}},{name:'每拍更新',type:'line',showSymbol:false,data:r.baselineCurve,lineStyle:{type:'dashed'},itemStyle:{color:'#b45309'}},{name:'发送时刻',type:'scatter',data:r.events,symbolSize:6,itemStyle:{color:'#047857'}}]}),[r]);const chart=useECharts(option);
 return <section className="not-prose" aria-label="周期事件触发实验" style={{padding:14,border:'1px solid #cbd5e1',borderRadius:10,margin:'20px 0',color:'#172033',minWidth:0}}>
 <strong>这次读数要不要发出去？</strong><p>x′=−x+u，u=−2x̂，x(0)=1；每次检查都测量，只有触发时才发送并更新。</p>
 <label>检查周期 h：<select aria-label="检查周期" value={h} onChange={e=>setH(+e.target.value)} style={{padding:6,color:'#172033',background:'#fff'}}>{eventCheckSteps.map(v=><option key={v} value={v}>{v} s</option>)}</select></label>
 <label style={{display:'block',marginTop:10}}>相对阈值 σ：{sigma.toFixed(2)}<input aria-label="相对阈值" type="range" min={.1} max={2} step={.05} value={sigma} onChange={e=>setSigma(+e.target.value)} style={{width:'100%'}}/></label>
 <div style={{display:'flex',flexWrap:'wrap',gap:8,margin:'10px 0'}}>{[['每拍都触发',.1,.1],['周期太长',1.2,.25],['漏掉事件',1.2,2],['恢复默认',.05,.25]].map(([name,hh,ss])=><button key={name} onClick={()=>{setH(+hh);setSigma(+ss);}} style={{padding:8,background:'#f8fafc',border:'1px solid #cbd5e1',borderRadius:6,color:'#172033'}}>{name}</button>)}</div>
 <p aria-live="polite">[0,6) s 内发送 {r.count} 次；每拍更新 {r.baselineCount} 次。x(6)={r.terminal.toExponential(6)}；每拍更新 x(6)={r.baselineTerminal.toExponential(6)}。</p>
 <div ref={chart} style={{height:300,width:'100%'}}/>
 <p>次数包含 t=0 的初始化，t=6 只读终态。圆点表示发送，不是所有测量；绿色圆点密集时会重叠。两路线使用同一增益，不代表各自最优设计。</p>
 </section>;
}
