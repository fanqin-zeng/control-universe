"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {sampledData} from '@/lib/sampled-data';
export function SampledDataExplorer(){
 const[T,setT]=useState(.5);const r=useMemo(()=>sampledData(T),[T]);
 const option=useMemo<EChartsOption>(()=>({animation:false,grid:{left:48,right:54,top:50,bottom:45},legend:{data:['连续状态','采样点','保持输入'],top:0,textStyle:{fontSize:11,color:'#172033'}},tooltip:{trigger:'axis'},xAxis:{type:'value',min:0,max:6,name:'时间 (s)',nameLocation:'middle',nameGap:27},yAxis:[{type:'value',min:-4,max:4,interval:1,name:'状态 x'},{type:'value',min:-8,max:8,interval:2,name:'输入 u'}],series:[{name:'连续状态',type:'line',showSymbol:false,data:r.curve,lineStyle:{color:'#0369a1'},itemStyle:{color:'#0369a1'}},{name:'采样点',type:'scatter',symbolSize:6,data:r.samples,itemStyle:{color:'#b45309'}},{name:'保持输入',type:'line',step:'end',showSymbol:false,yAxisIndex:1,data:r.held,lineStyle:{color:'#047857',type:'dashed'},itemStyle:{color:'#047857'}}]}),[r]);
 const chart=useECharts(option);
 return <section aria-label="采样间隔中的状态" className="not-prose" style={{border:'1px solid #cbd5e1',borderRadius:10,padding:14,margin:'20px 0',color:'#172033',minWidth:0}}>
  <strong>控制指令停着，物理状态还在走</strong><p>x′=−x+u；x(0)=1；u[k]=−2x[k]，采样后立即更新并保持，无额外延迟。</p>
  <label style={{display:'block'}}>采样周期：{T.toFixed(3)} s<input type="range" aria-label="采样周期秒" min={.1} max={1.5} step={.05} value={T} onChange={e=>setT(+e.target.value)} style={{width:'100%',display:'block'}}/></label>
  <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'12px 0'}}>{[['更快采样',.1],['临界周期',Math.log(3)],['出现发散',1.2],['恢复默认',.5]].map(([name,t])=><button key={name} onClick={()=>setT(+t)} style={{padding:8,border:'1px solid #cbd5e1',borderRadius:6,background:'#f8fafc',color:'#172033'}}>{name}</button>)}</div>
  <p aria-live="polite">Φ={r.phi.toFixed(6)}，Γ={r.gamma.toFixed(6)}，p={r.p.toFixed(6)}；x(T/2)={r.firstMid.toFixed(6)}，x(T)={r.p.toFixed(6)}；{r.nearBoundary?'临界附近（按显示精度）':r.stable?'严格稳定':'不稳定'}。</p>
  <div ref={chart} style={{height:320,width:'100%'}}/>
  <p>蓝线由连续方程计算，圆点才是计算机读到的状态。绿色输入读右轴；同一周期内保持不变。图中最后时刻为{r.samples.at(-1)![0].toFixed(3)} s，没有把下一拍提前画出来。</p>
 </section>;
}
