"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {zeroDynamicsSeries} from '@/lib/zero-dynamics';
export function ZeroDynamicsExplorer(){
 const [a,setA]=useState(1);
 const series=useMemo(()=>zeroDynamicsSeries(a),[a]);
 const last=series.at(-1);
 const option=useMemo<EChartsOption>(()=>({animation: false,grid:{left:48,right:16,top:48,bottom:40},
 legend:{top:4,textStyle:{fontSize:11}},tooltip:{trigger:'axis'},
 xAxis:{type:'value',min:0,max:10,name:'t (s)'},yAxis:{type:'value',min:-6,max:6,name:'状态'},
 series:a===0?[]:[{type:'line',name:'输出 y',showSymbol:false,clip:true,data:series.map(p=>[p.t,p.y])},
 {type:'line',name:'内部 x₁',showSymbol:false,clip:true,data:series.map(p=>[p.t,p.x1])}]
 }),[a,series]);
 const chart=useECharts(option);
 return <div className="not-prose" data-zero-explorer style={{border:'1px solid #d1d5db',borderRadius:8,margin:'24px 0',padding:16,background:'#fff',color:'#1f2937'}}>
 <strong>输出归零了，内部状态呢？</strong>
 <p style={{fontSize:13}}>x₁(0)=1，x₂(0)=0；y=x₁+a·x₂，v=−2y。曲线为理想、无力矩限制模型的解析解。</p>
 <label style={{display:'flex',flexWrap:'wrap',gap:8,alignItems:'center',fontSize:13}}>输出系数 a = {a.toFixed(1)}
 <input aria-label="零动态输出系数" type="range" min={-2} max={2} step={0.1} value={a} onChange={e=>setA(Number(e.target.value))} style={{width:180,maxWidth:'100%'}} /></label>
 <button onClick={()=>setA(1)} style={{padding:'6px 10px',marginTop:10,border:'1px solid #cbd5e1',borderRadius:4}}>恢复零动态默认</button>
 <div ref={chart} style={{width:'100%',height:340}} />
 <p data-zero-reading style={{fontSize:13,overflowWrap:'anywhere'}}>{last?
 `−1/a = ${last.lambda.toFixed(2)}；t = 10 s：y = ${last.y.toExponential(6)}，x₁ = ${last.x1.toExponential(6)}，u = ${last.u.toExponential(6)}。`:
 'a=0：当前r=1控制律不能除以a；改用y=x₁时相对阶为2，仍可设计另一条反馈律。'}</p>
 {last&&<p style={{fontSize:13}}>{a>0?'a>0，零动态稳定。':'a<0，零动态不稳定；本初值的内部状态增长。'}纵轴只显示−6到6，越界曲线被窗口裁切，末时读数保留实际值。巨大控制量在真实执行器上不可实现；输出收敛不能当成内部安全的证明。</p>}
 </div>;
}
