"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {stabilityExperiment} from '@/lib/mpc-stability';
export function MpcStabilityExplorer(){
 const [x,setX]=useState(2),[radius,setRadius]=useState(1),[w,setW]=useState(0);
 const r=useMemo(()=>stabilityExperiment(x,radius,w),[x,radius,w]);
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{data:['原名义计划','移位候选（测量后）','下一拍重算']},grid:{left:45,right:20,top:85,bottom:42},xAxis:{type:'value',min:0,max:3,interval:1,name:'拍'},yAxis:{type:'value',min:-3.5,max:3.5,name:'状态x'},series:[{name:'原名义计划',type:'line',data:r.plan.feasible?r.plan.states.map((v,i)=>[i,v]):[]},{name:'移位候选（测量后）',type:'line',lineStyle:{type:'dashed'},data:r.candidateStates?.map((v,i)=>[i+1,v])??[]},{name:'下一拍重算',type:'line',data:r.next?.feasible?r.next.states.map((v,i)=>[i+1,v]):[]}]}),[r]);
 const ref=useECharts(option);
 return <section aria-label="递归可行性实验" style={{border:'1px solid var(--border)',borderRadius:10,padding:16,margin:'24px 0'}}>
 <strong>把一段计划接到下一拍</strong><p>固定 x⁺=1.2x+u，N=2，P=17/8，|u|≤1、|x|≤3。r 改变终端区间。w 仅在第一拍测量中加入一次，虚线用于检查原移位候选，不能当作已批准动作。</p>
 {[{name:'初始状态',value:x,set:setX,min:-2.5,max:2.5,step:.05},{name:'终端半径',value:radius,set:setRadius,min:.5,max:1.5,step:.25},{name:'第一拍扰动',value:w,set:setW,min:-.75,max:.75,step:.05}].map(p=><label key={p.name} style={{display:'block',margin:'12px 0'}}>{p.name}：{p.value}<input aria-label={p.name} type="range" min={p.min} max={p.max} step={p.step} value={p.value} onChange={e=>p.set(Number(e.target.value))} style={{width:'100%'}}/></label>)}
 <button onClick={()=>{setX(2);setRadius(1);setW(0);}} style={{padding:8}}>恢复默认</button>
 <p data-testid="stability-plan">{r.plan.feasible?`本拍可行；U=[${r.plan.u.map(v=>v.toFixed(6)).join(', ')}]；x=[${r.plan.states.map(v=>v.toFixed(6)).join(', ')}]；V₂=${r.plan.cost.toFixed(8)}`:'本拍不可行：未提供可执行输入。'}</p>
 {r.plan.feasible&&<><p data-testid="stability-shift">移位 U=[{r.shift!.map(v=>v.toFixed(6)).join(', ')}]；候选费用={r.candidateCost!.toFixed(8)}；约束最大违反量={r.violation!.toFixed(6)}。</p><p data-testid="stability-next">{r.next?.feasible?`下一拍重算可行；V₂=${r.next.cost.toFixed(8)}；值函数差=${(r.next.cost-r.plan.cost).toFixed(8)}`:'下一拍不可行或测量超出状态界，未给出下一动作。'}；本拍阶段费={r.stage!.toFixed(8)}。</p></>}
 <div ref={ref} style={{width:'100%',height:350}}/>
 <p>名义可行初态：|x|≤{r.plan.bound.toFixed(6)}；终端区间为[−{radius}, {radius}]。{w===0?'w=0时，移位可行且值函数差不大于负阶段费。':'w≠0，名义证明前提不满足；重新可行也不代表原下降式仍成立。'} 轴固定；图线连接离散样本。</p>
 </section>;
}
