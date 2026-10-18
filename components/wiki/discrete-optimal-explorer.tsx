"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {discreteOptimal} from '@/lib/discrete-optimal';
export function DiscreteOptimalExplorer(){
 const[N,setN]=useState(3),[s,setS]=useState(1);const r=useMemo(()=>discreteOptimal(N,s),[N,s]);
 const option=useMemo<EChartsOption>(()=>({animation:false,legend:{data:['状态 x[k]','输入 u[k]'],top:0,textStyle:{color:'#172033',fontSize:11}},grid:{left:45,right:20,top:40,bottom:40},tooltip:{trigger:'axis'},xAxis:{type:'value',min:0,max:12,minInterval:1,name:'拍 k',nameLocation:'middle',nameGap:25},yAxis:{type:'value',min:-1.1,max:1.1,name:'归一化值'},series:[{name:'状态 x[k]',type:'line',data:r.x.map((v,k)=>[k,v]),itemStyle:{color:'#0369a1'}},{name:'输入 u[k]',type:'line',data:r.u.map((v,k)=>[k,v]),itemStyle:{color:'#b45309'},lineStyle:{type:'dashed'}}]}),[r]);const chart=useECharts(option);
 return <section className="not-prose" aria-label="有限步最优控制" style={{border:'1px solid #cbd5e1',borderRadius:10,padding:14,margin:'20px 0',color:'#172033',minWidth:0}}>
 <strong>最后还要不要认真控制？</strong><p>x[k+1]=x[k]+u[k]，x[0]=1，q=r=1。先固定三步，只改变终端权重，观察最后一次动作。</p>
 <label style={{display:'block'}}>动作次数 N：{N}<input aria-label="动作次数" type="range" min={1} max={12} step={1} value={N} onChange={e=>setN(+e.target.value)} style={{width:'100%'}}/></label>
 <label style={{display:'block'}}>终端权重 s：{s}<input aria-label="终端权重" type="range" min={0} max={8} step={1} value={s} onChange={e=>setS(+e.target.value)} style={{width:'100%'}}/></label>
 <div style={{display:'flex',flexWrap:'wrap',gap:8,margin:'10px 0'}}>{[['不计终点',0],['重视终点',8],['恢复默认',1]].map(([name,value])=><button key={name} onClick={()=>{setN(3);setS(+value);}} style={{padding:8,background:'#f8fafc',border:'1px solid #cbd5e1',borderRadius:6,color:'#172033'}}>{name}</button>)}</div>
 <p aria-live="polite">P₀={r.P[0].toFixed(6)}，K₀={r.K[0].toFixed(6)}，J={r.J.toFixed(6)}；x[N]={r.x[N].toFixed(6)}，末次输入={r.u[N-1].toFixed(6)}。</p>
 <div ref={chart} style={{height:300,width:'100%'}}/>
 <p>圆点是各拍的数值，连线只帮助阅读；终点 k=N 没有输入。改变 s 就改变了优化目标，不能用各自的 J 给不同目标排优劣。</p>
 </section>;
}
