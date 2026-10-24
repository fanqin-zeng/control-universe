"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {constraintExample,quadraticSlack} from '@/lib/constraint-handling';
export function ConstraintHandlingExplorer(){
  const [position,setPosition]=useState(4),[rate,setRate]=useState(1),[limit,setLimit]=useState(5),[power,setPower]=useState(1);
  const r=useMemo(()=>constraintExample(position,rate,limit),[position,rate,limit]),soft=useMemo(()=>quadraticSlack(10**power),[power]);
  const option=useMemo<EChartsOption>(()=>{
    const close=(p:number[][])=>p.length?[...p,p[0]]:[];
    return {animation:false,tooltip:{trigger:'item'},legend:{data:['输入与速率可行域','含硬输出界的可行域','最优点']},grid:{left:48,right:28,top:74,bottom:48},xAxis:{type:'value',min:-2.5,max:2.5,name:'u₀'},yAxis:{type:'value',min:-2.5,max:2.5,name:'u₁'},series:[{name:'输入与速率可行域',type:'line',symbol:'none',data:close(r.inputPolygon),lineStyle:{color:'#64748b'},areaStyle:{color:'rgba(100,116,139,0.10)'}},{name:'含硬输出界的可行域',type:'line',symbol:'none',data:close(r.hardPolygon),lineStyle:{color:'#059669'},areaStyle:{color:'rgba(16,185,129,0.32)'}},{name:'最优点',type:'scatter',symbolSize:13,itemStyle:{color:'#dc2626'},data:r.feasible?[r.u]:[]}]};
  },[r]);
  const ref=useECharts(option);
  return <section aria-label="约束可行域实验" style={{padding:16,border:'1px solid var(--border)',borderRadius:10,margin:'24px 0'}}>
    <strong>约束交集里有没有动作可选？</strong>
    <p>归一化双积分器：Np=3/Nu=2，速度初值1、前输入0.5。未来输入 [u₀,u₁,u₁]，幅值上限2；图的横纵轴都是绝对输入。</p>
    {[{name:'初始位置',value:position,set:setPosition,min:0,max:8,step:.5},{name:'每拍输入增量上限',value:rate,set:setRate,min:.25,max:2,step:.25},{name:'输出绝对上限',value:limit,set:setLimit,min:2,max:8,step:1}].map(p=><label key={p.name} style={{display:'block',margin:'12px 0'}}>{p.name}：{p.value}<input aria-label={p.name} type="range" min={p.min} max={p.max} step={p.step} value={p.value} onChange={e=>p.set(Number(e.target.value))} style={{width:'100%'}}/></label>)}
    <button onClick={()=>{setPosition(4);setRate(1);setLimit(5);setPower(1);}} style={{padding:8}}>恢复默认</button>
    <p data-testid="constraint-readout">{r.feasible?`名义QP可行；U=[${r.u.map(v=>v.toFixed(6)).join(', ')}]；预测y=[${r.prediction.map(v=>v.toFixed(6)).join(', ')}]；活跃行：${r.active.map(i=>i+1).join(', ')}；KKT最大残差 ${r.residual.toExponential(2)}`:'名义QP不可行：没有满足全部硬约束的计划，未给出可执行动作。'}</p>
    <div ref={ref} style={{height:360,width:'100%'}}/>
    <p>灰域只含输入/速率限制，绿域还包含全部三拍的输出界。绿域为空时，不能把优化失败解释成允许设备越限。</p>
    <strong>独立小例：有限二次罚不等于硬界</strong>
    <p>另一个标量问题 min (u−2)²+Vε²，u≤1+ε、ε≥0。这里的可软化界是教学性能要求，未改动上图物理约束。</p>
    <label style={{display:'block',margin:'12px 0'}}>二次罚权重 V：{soft.weight}<input aria-label="二次罚权重指数" type="range" min={0} max={2} step={1} value={power} onChange={e=>setPower(Number(e.target.value))} style={{width:'100%'}}/></label>
    <p data-testid="penalty-readout">u={soft.u.toFixed(6)}；ε={soft.epsilon.toFixed(6)}。硬界解为u=1；本例任意有限V的最优松弛仍为正。</p>
  </section>;
}
