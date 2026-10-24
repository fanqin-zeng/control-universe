"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {economicDefaults,planEconomic,type EconomicConfig} from '@/lib/economic-mpc';
export function EconomicMpcExplorer(){
 const [c,setC]=useState<EconomicConfig>({...economicDefaults});
 const plan=useMemo(()=>planEconomic(c),[c]);
 const state=useMemo<EChartsOption>(()=>({animation:false,legend:{top:0},tooltip:{trigger:'axis'},grid:{left:42,right:18,top:40,bottom:35},xAxis:{type:'value',min:0,max:2,name:'k'},yAxis:{type:'value',min:0,max:2.5,name:'库存'},series:plan.feasible?[{name:'经济目标',type:'line',data:plan.economic.x.map((v,k)=>[k,v]),color:'#2563eb'},{name:'跟踪目标',type:'line',lineStyle:{type:'dashed'},data:plan.tracking.x.map((v,k)=>[k,v]),color:'#d97706'}]:[]}),[plan]);
 const input=useMemo<EChartsOption>(()=>({animation:false,legend:{top:0},tooltip:{trigger:'axis'},grid:{left:42,right:18,top:40,bottom:35},xAxis:{type:'category',data:['时段0','时段1'],min:0,max:1},yAxis:{type:'value',min:0,max:2.5,name:'泵水量'},series:plan.feasible?[{name:'经济目标',type:'bar',data:plan.economic.u,color:'#2563eb'},{name:'跟踪目标',type:'bar',data:plan.tracking.u,color:'#d97706'}]:[]}),[plan]);
 const ref1=useECharts(state),ref2=useECharts(input);
 const sliders:{key:keyof EconomicConfig;name:string;min:number;max:number;step:number}[]=[{key:'x0',name:'初库存',min:0,max:2,step:.25},{key:'capacity',name:'容量',min:0,max:2,step:.25},{key:'limit',name:'泵限',min:.5,max:2,step:.25},{key:'p0',name:'时段0价格',min:0,max:5,step:.5},{key:'p1',name:'时段1价格',min:0,max:5,step:.5},{key:'h',name:'库存权重',min:0,max:4,step:.2}];
 return <section aria-label="经济MPC实验" style={{padding:16,border:'1px solid var(--border)',borderRadius:10,margin:'24px 0'}}>
 <strong>同一水箱、同一约束，改变运行目标</strong><p>每时段需求1，末库存回到初库存；输入二次权重固定为1。所有费用均为归一化教学目标值。</p>
 {sliders.map(p=><label key={p.key} style={{display:'block',margin:'12px 0'}}>{p.name}：{c[p.key]}<input aria-label={p.name} type="range" min={p.min} max={p.max} step={p.step} value={c[p.key]} onChange={e=>setC({...c,[p.key]:Number(e.target.value)})} style={{width:'100%'}}/></label>)}
 <button style={{padding:8}} onClick={()=>setC({...economicDefaults})}>恢复默认</button>
 {plan.feasible?<><p data-testid="economic-plan">经济输入 [{plan.economic.u.map(v=>v.toFixed(6)).join(', ')}]；经济成本 {plan.economic.cost.toFixed(6)}。</p><p data-testid="tracking-plan">跟踪输入 [{plan.tracking.u.map(v=>v.toFixed(6)).join(', ')}]；以同一经济成本评价 {plan.tracking.cost.toFixed(6)}。</p><p data-testid="economic-kkt">原QP的KKT残差：{plan.residual<1e-9?'低于1e−9':plan.residual.toExponential(3)}。严格凸目标在可行区间上的唯一全局解。</p></>:<p role="status">不可行：{plan.reason}。不显示可执行计划；先修正需求、边界或终端合同。</p>}
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:12}}><div><p>结点库存预测</p><div ref={ref1} style={{height:280,width:'100%'}}/></div><div><p>时段泵水量</p><div ref={ref2} style={{height:280,width:'100%'}}/></div></div>
 <p>固定坐标便于比较；仅保证结点约束。h=0时仍有唯一输入解，但下文常价旋转成本不再严格惩罚库存偏差。经济最优依赖这里使用的预测；模型失配可能使实际费用更高。</p>
 </section>;
}
