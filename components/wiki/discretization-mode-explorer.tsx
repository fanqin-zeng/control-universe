"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {discretizationMode} from '@/lib/discretization-mode';
const names=['前向欧拉','后向欧拉','Tustin','精确采样'];
export function DiscretizationModeExplorer(){
 const [a,setA]=useState(10),[Ts,setTs]=useState(.01);
 const r=useMemo(()=>discretizationMode(a,Ts),[a,Ts]);
 const option=useMemo<EChartsOption>(()=>({animation:false,grid:{left:90,right:30,top:25,bottom:45},tooltip:{trigger:'item'},xAxis:{type:'value',min:-4.5,max:1.5,name:'每步乘数 p',nameLocation:'middle',nameGap:28},yAxis:{type:'category',data:names,min:0,max:3,boundaryGap:true},series:[{type:'scatter',symbolSize:14,data:r.multipliers.map((p,i)=>({value:[p,i],itemStyle:{color:Math.abs(p)<1?'#047857':'#b91c1c'}})),markArea:{silent:true,itemStyle:{color:'rgba(16,185,129,.08)'},data:[[{xAxis:-1},{xAxis:1}]]},markLine:{silent:true,symbol:'none',data:[{xAxis:-1},{xAxis:1}],lineStyle:{type:'dashed',color:'#64748b'}}}]}),[r]);
 const chart=useECharts(option);const preset=(x:number,t:number)=>{setA(x);setTs(t);};
 return <section className="not-prose" aria-label="离散化每步乘数" style={{border:'1px solid #cbd5e1',borderRadius:10,padding:14,margin:'20px 0',color:'#172033',minWidth:0}}>
  <strong>同一个衰减过程，四种更新结果</strong><p>x′=−ax，初值x[0]=1；圆内条件在这里是 −1 &lt; p &lt; 1。</p>
  <label style={{display:'block'}}>衰减率a：{a.toFixed(0)} /s<input aria-label="衰减率a" type="range" min={1} max={20} step={1} value={a} onChange={e=>setA(+e.target.value)} style={{width:'100%',display:'block'}}/></label>
  <label style={{display:'block'}}>采样间隔：{Ts.toFixed(3)} s<input aria-label="采样间隔" type="range" min={.005} max={.25} step={.005} value={Ts} onChange={e=>setTs(+e.target.value)} style={{width:'100%',display:'block'}}/></label>
  <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'12px 0'}}>{[['欧拉边界',10,.2],['加大步长',10,.25],['加快衰减',20,.25],['恢复默认',10,.01]].map(([n,x,t])=><button key={n} onClick={()=>preset(+x,+t)} style={{padding:8,border:'1px solid #cbd5e1',borderRadius:6,background:'#f8fafc',color:'#172033'}}>{n}</button>)}</div>
  <p aria-live="polite">aT={r.h.toFixed(3)}；{names.map((n,i)=>`${n} p=${r.multipliers[i].toFixed(6)}`).join('；')}。</p>
  <div ref={chart} style={{height:260,width:'100%'}}/>
  <p>{names.map((n,i)=>`${n}：${r.stable[i]?'衰减':'不满足严格衰减条件'}`).join('；')}。这里仅比较一个零输入模态，不代表完整反馈系统的优劣。</p>
 </section>;
}
