"use client";
import {useMemo,useState} from 'react';import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';import {simulateSliding,type SlidingLaw} from '@/lib/sliding-mode';
const labels:Record<SlidingLaw,string>={sgn:'sgn切换',sat:'sat边界层',tanh:'tanh平滑',sta:'STA实验配置'};
export function SlidingModeExplorer(){
 const[lam,setLam]=useState(3),[K,setK]=useState(2),[phi,setPhi]=useState(.05),[D,setD]=useState(.3),[law,setLaw]=useState<SlidingLaw>('sat');
 const sim=useMemo(()=>simulateSliding(lam,K,phi,D,law),[lam,K,phi,D,law]);
 const phase=useMemo<EChartsOption>(()=>({animation: false,grid:{left:48,right:16,top:38,bottom:35},legend:{top:2},tooltip:{trigger:'axis'},xAxis:{type:'value',min:-2,max:2,name:'x'},yAxis:{type:'value',min:-8,max:8,name:'速度'},series:[{name:'相轨迹',type:'line',showSymbol:false,data:sim.rows.map(p=>[p.x,p.velocity])},{name:'滑面',type:'line',showSymbol:false,data:[[-2,2*lam],[2,-2*lam]],lineStyle:{type:'dashed'}}]}),[sim,lam]);
 const time=useMemo<EChartsOption>(()=>({animation: false,grid:{left:48,right:16,top:38,bottom:35},legend:{top:2},tooltip:{trigger:'axis'},xAxis:{type:'value',min:0,max:6,name:'t (s)'},yAxis:{type:'value',min:-6,max:6,name:'x / s'},series:[{name:'位置 x',type:'line',showSymbol:false,data:sim.rows.map(p=>[p.t,p.x])},{name:'切换函数 s',type:'line',showSymbol:false,data:sim.rows.map(p=>[p.t,p.s])}]}),[sim]);
 const p=useECharts(phase),t=useECharts(time);
 const reset=()=>{setLam(3);setK(2);setPhi(.05);setD(.3);setLaw('sat');};
 return <div className="not-prose" data-sliding-explorer style={{border:'1px solid #cbd5e1',borderRadius:8,padding:16,margin:'24px 0',background:'#fff',color:'#1e293b'}}>
 <strong>同一滑块，改变切换方式</strong><p style={{fontSize:13}}>ẍ=−2ẋ−sin(x)+u+D sin(5t)，x(0)=1.5，ẋ(0)=0；参考为零。dt=0.0002 s，半隐式Euler，无执行器限幅。</p>
 <label>控制律 <select aria-label="滑模控制律" value={law} onChange={e=>setLaw(e.target.value as SlidingLaw)}>{Object.entries(labels).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
 <div style={{display:'flex',flexWrap:'wrap',gap:16,marginTop:12}}>
 <label>λ={lam.toFixed(1)} <input aria-label="滑面系数" type="range" min={1} max={10} step={.5} value={lam} onChange={e=>setLam(Number(e.target.value))} style={{width:140}} /></label>
 <label>K={K.toFixed(1)} <input aria-label="滑模增益" type="range" min={.5} max={8} step={.5} disabled={law==='sta'} value={K} onChange={e=>setK(Number(e.target.value))} style={{width:140}} /></label>
 <label>Φ={phi.toFixed(2)} <input aria-label="边界层宽度" type="range" min={.01} max={.3} step={.01} disabled={law==='sta'||law==='sgn'} value={phi} onChange={e=>setPhi(Number(e.target.value))} style={{width:140}} /></label>
 <label>D={D.toFixed(2)} <input aria-label="扰动幅值" type="range" min={0} max={.6} step={.05} value={D} onChange={e=>setD(Number(e.target.value))} style={{width:140}} /></label></div>
 <button onClick={reset} style={{marginTop:12,padding:'6px 10px',border:'1px solid #cbd5e1',borderRadius:4}}>恢复滑模默认</button>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:16}}><div ref={p} style={{width:'100%',height:300,minWidth:0}}/><div ref={t} style={{width:'100%',height:300,minWidth:0}}/></div>
 <p data-sliding-reading style={{fontSize:13,overflowWrap:'anywhere'}}>t={sim.lastTime.toFixed(1)} s；阈值带进入={sim.reach===null?'本窗口未满足':sim.reach.toFixed(4)+' s'}；4&lt;t≤6 max|s|={sim.band.toExponential(6)}；5&lt;t≤6 rms|x|={sim.rms.toExponential(6)}；4&lt;t≤6 TV(u)={sim.tv.toFixed(4)}。</p>
 <p style={{fontSize:13}}>阈值为|s|&lt;0.02且连续保持0.2 s；这不是理想精确到达。TV使用全部30001个节点的指定尾窗，绘图每20步取点；轴外曲线只裁显示，不改数值。</p>
 <p style={{fontSize:13}}>{law==='sta'?`本实验α=${sim.alpha.toFixed(3)}，β=${sim.beta.toFixed(3)}；K和Φ不参与STA。增益仅供复现，不是通用收敛保证。`:K>D?'当前K>D满足归一化理想sgn的充分裕度条件；平滑律和数字带另查。':'当前K≤D，不能给出最坏扰动的严格到达裕度；这不等于本条有限轨迹必然失稳。'}</p>
 </div>;
}
