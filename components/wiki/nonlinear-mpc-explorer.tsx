"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {solveNmpc} from '@/lib/nonlinear-mpc';
export function NonlinearMpcExplorer(){
 const [theta,setTheta]=useState(1.5),[N,setN]=useState(8),[Q,setQ]=useState(10),[limit,setLimit]=useState(5),[iterations,setIterations]=useState(60);
 const plan=useMemo(()=>solveNmpc({theta,N,Q,limit,iterations}),[theta,N,Q,limit,iterations]);
 const first=useMemo(()=>solveNmpc({theta,N,Q,limit,iterations:1}),[theta,N,Q,limit]);
 const statePlot=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},grid:{left:48,right:20,top:25,bottom:40},xAxis:{type:'value',min:0,max:1.6,name:'t(s)'},yAxis:{type:'value',min:-3.5,max:3.5,name:'θ(rad)'},series:[{name:'预算内迭代',type:'line',showSymbol:false,data:plan.trajectory.map((x,k)=>[k*.1,x[0]])},{name:'仅一步SQP',type:'line',showSymbol:false,lineStyle:{type:'dashed'},data:first.trajectory.map((x,k)=>[k*.1,x[0]])}]}),[plan,first]);
 const descent=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},grid:{left:48,right:20,top:25,bottom:40},xAxis:{type:'value',min:0,max:60,name:'迭代'},yAxis:{type:'value',min:0,max:3000,name:'J'},series:[{name:'原非线性目标',type:'line',data:(plan.history.length>plan.used?plan.history:[...plan.history,plan.cost]).map((v,k)=>[k,v]),showSymbol:true}]}),[plan]);
 const ref1=useECharts(statePlot),ref2=useECharts(descent);
 return <section aria-label="非线性MPC实验" style={{border:'1px solid var(--border)',borderRadius:10,padding:16,margin:'24px 0'}}>
 <strong>保留sin预测，用局部QP更新候选</strong><p>向下为θ=0；RK4步长0.1s，Np=N，整个预测窗只用一个恒定力矩，每拍重算。本实验未加入终端稳定证书。费用是加权目标值，不是焦耳。</p>
 {[{name:'初始角度 θ',value:theta,min:0,max:2.8,step:.1,set:setTheta},{name:'预测步数 N',value:N,min:4,max:16,step:1,set:setN},{name:'角度权重 Q',value:Q,min:1,max:20,step:1,set:setQ},{name:'力矩上限',value:limit,min:1,max:8,step:1,set:setLimit},{name:'SQP迭代预算',value:iterations,min:1,max:60,step:1,set:setIterations}].map(p=><label key={p.name} style={{display:'block',margin:'12px 0'}}>{p.name}：{p.value}<input aria-label={p.name} type="range" min={p.min} max={p.max} step={p.step} value={p.value} onChange={e=>p.set(Number(e.target.value))} style={{width:'100%'}}/></label>)}
 <button style={{padding:8}} onClick={()=>{setTheta(1.5);setN(8);setQ(10);setLimit(5);setIterations(60);}}>恢复默认</button>
 <p data-testid="nmpc-plan">候选u={plan.u.toFixed(6)}；J={plan.cost.toFixed(8)}；投影梯度={plan.projectedGradient<1e-6?'小于1e−6':plan.projectedGradient.toExponential(3)}；更新{plan.used}次；{plan.converged?'达到局部一阶阈值':'预算内未达到局部一阶阈值'}。</p>
 <p data-testid="nmpc-one">从零仅更新一步：u={first.u.toFixed(6)}；J={first.cost.toFixed(8)}。这不是完整RTI，不构成全局最优或实时性保证。</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:12}}><div><p>同初态下的非线性预测</p><div ref={ref1} style={{height:300,width:'100%'}}/></div><div><p>原目标随迭代的变化</p><div ref={ref2} style={{height:300,width:'100%'}}/></div></div>
 <p>固定轴便于比较；较小费用的变化可能在总量程内不明显，以数值面板为准。投影梯度只检查输入盒的一阶条件；未认证全局最优、状态安全和硬件期限。改变N或Q也改变了问题，不能把不同目标值直接排名。</p>
 </section>;
}
