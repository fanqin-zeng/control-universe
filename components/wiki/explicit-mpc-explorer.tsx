"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption,CustomSeriesRenderItemParams,CustomSeriesRenderItemAPI} from 'echarts';
import {useECharts} from './use-echarts';
import {explicitRegions,lookupExplicit,scalarQp} from '@/lib/explicit-mpc';
export function ExplicitMpcExplorer(){
 const [x,setX]=useState(2),[reference,setReference]=useState(-1),[tol,setTol]=useState(0);
 const exact=useMemo(()=>lookupExplicit(x,reference),[x,reference]),candidate=useMemo(()=>lookupExplicit(x,reference,tol),[x,reference,tol]),online=useMemo(()=>scalarQp(x,reference),[x,reference]);
 const plane=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'item'},grid:{left:42,right:25,top:35,bottom:40},xAxis:{type:'value',min:-3.5,max:3.5,name:'x'},yAxis:{type:'value',min:-3.5,max:3.5,name:'r'},series:[...explicitRegions.map(p=>({name:p.id+' '+p.name,type:'custom' as const,data:[[0,0]],renderItem:(_params:CustomSeriesRenderItemParams,api:CustomSeriesRenderItemAPI)=>({type:'polygon' as const,shape:{points:p.polygon.map(v=>api.coord(v) as number[])},style:{fill:p.color,stroke:'#475569',opacity:.65}})})),{name:'当前参数',type:'scatter',data:[[x,reference]],symbolSize:12,itemStyle:{color:'#111827'}}]}),[x,reference]);
 const cut=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},grid:{left:42,right:25,top:35,bottom:40},xAxis:{type:'value',min:-3.5,max:3.5,name:'x'},yAxis:{type:'value',min:-1.25,max:1.25,name:'u'},series:[{name:'固定参考的控制律',type:'line',showSymbol:false,data:Array.from({length:121},(_,i)=>{const z=-3+i*.05,r=lookupExplicit(z,reference);return [z,r.inDomain&&r.found?r.u:null];})},{name:'当前精确动作',type:'scatter',data:exact.inDomain&&exact.found?[[x,exact.u]]:[],symbolSize:12,itemStyle:{color:'#111827'}}]}),[x,reference,exact]);
 const planeRef=useECharts(plane),cutRef=useECharts(cut);
 return <section aria-label="显式MPC实验" style={{border:'1px solid var(--border)',borderRadius:10,padding:16,margin:'24px 0'}}>
 <strong>同一QP，先查区域再算动作</strong><p>x⁺=x+u，|u|≤1、|x⁺|≤2；目标为 (x⁺−r)²+u²。固定离线域：x、r 均在[−3,3]。彩色区为五条仿射律的适用区域。</p>
 {[{name:'当前状态 x',value:x,set:setX},{name:'目标参考 r',value:reference,set:setReference}].map(p=><label key={p.name} style={{display:'block',margin:'12px 0'}}>{p.name}：{p.value}<input aria-label={p.name} type="range" min={-3.5} max={3.5} step={.01} value={p.value} onChange={e=>p.set(Number(e.target.value))} style={{width:'100%'}}/></label>)}
 <button style={{padding:8,marginRight:8}} onClick={()=>{setX(2);setReference(-1);setTol(0);}}>恢复默认</button><button style={{padding:8}} onClick={()=>{setX(2.01);setReference(0);setTol(.02);}}>载入容差反例</button>
 <p data-testid="explicit-readout">{exact.inDomain&&exact.found?`精确查表：${exact.region}；u=${exact.u.toFixed(6)}；x⁺=${exact.next.toFixed(6)}；J=${exact.cost.toFixed(8)}；命中=${exact.hits.join(',')}；KKT残差=${exact.residual.toExponential(2)}`:'超出离线参数域：未批准查表动作。'}</p>
 <p data-testid="explicit-qp">{online.feasible?`原QP解析对照：u=${online.u.toFixed(6)}，J=${online.cost.toFixed(8)}。`:'原QP也不可行：下一状态界与输入界没有交集。'} 对照值是教学审计，不替代域外回退设计。</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:12}}><div><p>参数平面：横轴x，纵轴r</p><div ref={planeRef} style={{height:320,width:'100%'}}/></div><div><p>当前r={reference}的控制律截面</p><div ref={cutRef} style={{height:320,width:'100%'}}/></div></div>
 <label style={{display:'block',margin:'12px 0'}}>宽松定位容差（仅错误候选演示）：{tol}<input aria-label="宽松定位容差" type="range" min={0} max={.05} step={.01} value={tol} onChange={e=>setTol(Number(e.target.value))} style={{width:'100%'}}/></label>
 <p data-testid="explicit-tolerance">{candidate.inDomain&&candidate.found?`宽松候选：${candidate.region}；u=${candidate.u.toFixed(6)}；物理约束违反量=${candidate.violation.toFixed(6)}。`:'宽松候选也不跨越离线参数域。'} 它不参与执行；容差不能把区域外的公式变成有效证书。</p>
 <p style={{marginBottom:0}}>R0中央；R1/R2输入上/下界；R3/R4下一状态上/下界。区域共享边界时按R0→R4选第一个，精确律在边界给出同一输入。轴固定，域外不延长图线。</p>
 </section>;
}
