"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {excitationExperiment,type ExcitationMode} from '@/lib/persistent-excitation';
const modes:Record<ExcitationMode,string>={periodic:'持续四拍',constant:'恒定输入',alternating:'正负交替',burst:'前八拍后停止'};
export function PersistentExcitationExplorer(){
 const [amplitude,setAmplitude]=useState(1),[window,setWindow]=useState(8),[forgetting,setForgetting]=useState(1),[mode,setMode]=useState<ExcitationMode>('periodic');
 const result=useMemo(()=>excitationExperiment(amplitude,window,forgetting,mode),[amplitude,window,forgetting,mode]);
 const options=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{top:0,data:['估计 θ₁','估计 θ₂','真实 θ₁','真实 θ₂']},grid:{left:48,right:18,top:70,bottom:44},xAxis:{type:'value',min:0,max:64,interval:16,name:'已处理样本数',nameLocation:'middle',nameGap:26},yAxis:{type:'value',min:-.7,max:.7,interval:.35,name:'归一化参数'},series:[['估计 θ₁',result.rows.map(r=>[r.n,r.first])],['估计 θ₂',result.rows.map(r=>[r.n,r.second])],['真实 θ₁',[[0,.6],[64,.6]]],['真实 θ₂',[[0,.2],[64,.2]]]].map(([name,data])=>({name:name as string,type:'line' as const,showSymbol:false,data:data as number[][]}))}),[result]);
 const informationOptions=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},grid:{left:48,right:18,top:35,bottom:44},xAxis:{type:'value',min:0,max:64,interval:16,name:'已处理样本数',nameLocation:'middle',nameGap:26},yAxis:{type:'value',min:0,max:8,interval:2,name:'窗口最小特征值'},series:[{type:'line',showSymbol:false,data:result.rows.map(r=>[r.n,r.minEigen])}]}),[result]);
 const chart=useECharts(options),information=useECharts(informationOptions),last=result.rows.at(-1)!;
 return <section style={{border:'1px solid #cbd5e1',borderRadius:12,padding:16,margin:'24px 0',background:'#f8fafc',color:'#0f172a'}} aria-label="持久激励实验">
  <p style={{marginTop:0}}>同一两参数模型、64个样本、零噪声；初值 θ̂=0、P=I。窗口图不含先验，也不加遗忘权重。</p>
  <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{(Object.keys(modes) as ExcitationMode[]).map(key=><button key={key} type="button" onClick={()=>setMode(key)} style={{padding:'7px 10px',border:'1px solid #64748b',borderRadius:6,background:mode===key?'#dbeafe':'white',color:'#0f172a'}}>{modes[key]}</button>)}<button type="button" onClick={()=>{setAmplitude(1);setWindow(8);setForgetting(1);setMode('periodic');}} style={{padding:'7px 10px',border:'1px solid #64748b',borderRadius:6,background:'white'}}>恢复默认</button></div>
  <div style={{display:'flex',gap:16,flexWrap:'wrap',marginTop:14}}>
   <label style={{display:'grid',gap:4}}>输入幅值 A={amplitude.toFixed(1)}<input aria-label="输入幅值" type="range" min={0} max={1} step={.1} value={amplitude} onChange={e=>setAmplitude(Number(e.target.value))}/></label>
   <label style={{display:'grid',gap:4}}>窗口长度 L<select aria-label="窗口长度" value={window} onChange={e=>setWindow(Number(e.target.value))}>{[4,8,12,16].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
   <label style={{display:'grid',gap:4}}>遗忘因子 λ={forgetting.toFixed(2)}<input aria-label="遗忘因子" type="range" min={.9} max={1} step={.02} value={forgetting} onChange={e=>setForgetting(Number(e.target.value))}/></label>
  </div>
  <p data-pe-readout="true" aria-live="polite">64次更新：θ̂₁={last.first.toFixed(6)}，θ̂₂={last.second.toFixed(6)}；已观测完整窗口的最小特征值={result.observedMinimum.toFixed(6)}。</p>
  <div ref={chart} style={{height:300,width:'100%'}}/><div ref={information} style={{height:260,width:'100%'}}/>
  <p style={{fontSize:14,marginBottom:0}}>前L个样本凑齐后才画窗口值；零值保留。有限记录的最低值不是未来PE证书。改变λ只改变RLS，不能改变同一输入产生的窗口信息。</p>
 </section>;
}
