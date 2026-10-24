'use client';
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {bellmanExperiment} from '@/lib/bellman-values';
const buttonStyle={border:'1px solid #64748b',borderRadius:6,padding:'5px 10px',background:'#f1f5f9',color:'#172033',cursor:'pointer'};
export function BellmanValuesExplorer(){
 const [p,setP]=useState(.6),[gamma,setGamma]=useState(.9),[alpha,setAlpha]=useState(.25),[steps,setSteps]=useState(20),[optimal,setOptimal]=useState(false);
 const r=useMemo(()=>bellmanExperiment(p,gamma,alpha,steps,optimal),[p,gamma,alpha,steps,optimal]);
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{top:0,data:['L估计','H估计','L固定点','H固定点']},grid:{left:48,right:20,top:55,bottom:45},
 xAxis:{type:'value',min:0,max:80,name:'备份次数 k',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:-5,max:45,name:'价值 / 分'},series:[
 {name:'L估计',type:'line',showSymbol:false,data:r.history.map((v,k)=>[k,v[0]])},
 {name:'H估计',type:'line',showSymbol:false,data:r.history.map((v,k)=>[k,v[1]])},
 {name:'L固定点',type:'line',showSymbol:false,lineStyle:{type:'dashed'},data:[[0,r.exact[0]],[80,r.exact[0]]]},
 {name:'H固定点',type:'line',showSymbol:false,lineStyle:{type:'dashed'},data:[[0,r.exact[1]],[80,r.exact[1]]]}]}),[r]);
 const qOption=useMemo<EChartsOption>(()=>({animation:false,title:{text:'用当前 V 得到的一步动作备份',textStyle:{fontSize:13},left:'center'},tooltip:{trigger:'axis'},grid:{left:48,right:20,top:55,bottom:45},
 xAxis:{type:'value',min:0,max:3,axisLabel:{formatter:(x:number)=>x===1?'配送':x===2?'充电':''},interval:1},yAxis:{type:'value',min:-5,max:45,name:'分'},series:[{type:'bar',barWidth:35,data:[[1,r.q[0]],[2,r.q[1]]]}]}),[r]);
 const ref=useECharts(option),qRef=useECharts(qOption);
 const reset=()=>{setP(.6);setGamma(.9);setAlpha(.25);setSteps(20);setOptimal(false);};
 return <section aria-label="贝尔曼备份实验" style={{border:'1px solid #94a3b8',borderRadius:10,padding:16,margin:'20px 0'}}>
 <p style={{marginTop:0}}>循环送餐模型；所有曲线从 V₀=(0,0) 同步备份。虚线是独立解析固定点，条形图的数值只使用当前 V。</p>
 <label>备份规则 <select aria-label="备份规则" value={optimal?'optimal':'policy'} onChange={e=>setOptimal(e.target.value==='optimal')} style={{padding:5,border:'1px solid #64748b',borderRadius:4}}><option value="policy">给定策略的期望备份</option><option value="optimal">最优备份</option></select></label>
 <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:12}}>
 {([{label:'配送成功概率 p',value:p,set:setP,min:.4,max:.8,step:.01},{label:'折扣 γ',value:gamma,set:setGamma,min:.5,max:.9,step:.01},{label:'充电概率 α',value:alpha,set:setAlpha,min:0,max:1,step:.05},{label:'备份次数 N',value:steps,set:setSteps,min:0,max:80,step:1}]).map(x=><label key={x.label} style={{display:'grid',minWidth:180,flex:1,gap:4}}>{x.label} = {x.value.toFixed(x.label.includes('次数')?0:2)}<input type="range" aria-label={x.label} value={x.value} min={x.min} max={x.max} step={x.step} disabled={optimal&&x.label.includes('α')} onChange={e=>x.set(Number(e.target.value))}/></label>)}
 </div>
 <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}><button type="button" style={buttonStyle} onClick={reset}>恢复默认</button><button type="button" style={buttonStyle} onClick={()=>{setP(.8);setGamma(.9);setAlpha(0);setSteps(20);setOptimal(true);}}>配送最优</button><button type="button" style={buttonStyle} onClick={()=>{setP(.6);setGamma(.9);setAlpha(1);setSteps(20);setOptimal(true);}}>充电最优</button><button type="button" style={buttonStyle} onClick={()=>{setP(12/19);setGamma(.9);setSteps(20);setOptimal(true);}}>持平阈值</button></div>
 <p aria-live="polite" data-bellman-readout="true">当前 V：{r.v[0].toFixed(6)} / {r.v[1].toFixed(6)}；固定点：{r.exact[0].toFixed(6)} / {r.exact[1].toFixed(6)}；残差 δ：{r.residual.toExponential(4)}；价值误差上界：{r.bound.toExponential(4)}</p>
 <p>固定点的 L 动作价值：配送 {r.exactQ[0].toFixed(6)}，充电 {r.exactQ[1].toFixed(6)}。{optimal?'最优备份忽略 α，每个状态逐次取最大值。':'期望备份按 α 加权，评估固定策略。'}</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,320px),1fr))',gap:8}}><div ref={ref} role="img" aria-label="价值估计与固定点随备份次数的关系" style={{height:300,width:'100%',minWidth:0}}/><div ref={qRef} role="img" aria-label="当前L状态配送与充电的一步动作备份" style={{height:300,width:'100%',minWidth:0}}/></div>
 <p style={{marginBottom:0}}>图轴固定；本面板限定 p∈[0.4,0.8]、γ∈[0.5,0.9]，不把有限步估计称为已收敛价值。已知模型计算不代表完成了强化学习训练。</p>
 </section>;
}
