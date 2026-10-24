"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {mpcTwoStep} from '@/lib/mpc-principle';

export function MpcPrincipleExplorer(){
  const [x,setX]=useState(4),[r,setR]=useState(1),[limit,setLimit]=useState(1),[disturbed,setDisturbed]=useState(false);
  const result=useMemo(()=>mpcTwoStep(x,r,limit),[x,r,limit]);
  const measured=result.states[0]+(disturbed?.5:0);
  const replanned=useMemo(()=>mpcTwoStep(measured,r,limit),[measured,r,limit]);
  const option=useMemo<EChartsOption>(()=>({animation: false,tooltip:{trigger:'axis'},legend:{data:['原计划','测量后重算']},grid:{left:46,right:20,top:46,bottom:42},xAxis:{type:'value',name:'采样步',min:0,max:3,interval:1},yAxis:{type:'value',name:'状态偏差',min:-1,max:6},series:[{name:'原计划',type:'line',data:[[0,x],[1,result.states[0]],[2,result.states[1]]]},{name:'测量后重算',type:'line',data:[[1,measured],[2,replanned.states[0]],[3,replanned.states[1]]]}]}),[x,result,measured,replanned]);
  const ref=useECharts(option);
  return <section aria-label="两步预测控制实验" style={{padding:16,border:'1px solid var(--border)',borderRadius:10,margin:'24px 0'}}>
    <strong>先计划两步，只执行第一步</strong>
    <p>无量纲模型 x(k+1)=0.5x(k)+u(k)，N=2，Q=P=1。图中第二条线从新的测量状态出发。</p>
    {([{name:'初始偏差',value:x,set:setX,min:0,max:6,step:.5},{name:'输入权重 R',value:r,set:setR,min:0,max:4,step:.25},{name:'输入上限',value:limit,set:setLimit,min:.25,max:2,step:.25}]).map(p=><label key={p.name} style={{display:'block',margin:'12px 0'}}>{p.name}：{p.value}<input aria-label={p.name} type="range" min={p.min} max={p.max} step={p.step} value={p.value} onChange={e=>p.set(Number(e.target.value))} style={{width:'100%'}}/></label>)}
    <button onClick={()=>setDisturbed(!disturbed)} style={{padding:8,marginRight:8}}>第一步后扰动 +0.5：{disturbed?'开':'关'}</button>
    <button onClick={()=>{setX(4);setR(1);setLimit(1);setDisturbed(false);}} style={{padding:8}}>恢复默认</button>
    <p data-testid="mpc-readout">计划 u = [{result.u.map(v=>v.toFixed(6)).join(', ')}]；预测 x = [{result.states.map(v=>v.toFixed(6)).join(', ')}]；J = {result.cost.toFixed(6)}</p>
    <p>实测下一状态 {measured.toFixed(6)}；重新规划第一输入 {replanned.u[0].toFixed(6)}。扰动超出名义预测，约束与稳定性需另行核验。</p>
    <div ref={ref} style={{height:320,width:'100%'}}/>
  </section>;
}
