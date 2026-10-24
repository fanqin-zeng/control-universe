"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {frequencyExperiment,frequencyDefaults,type FrequencyConfig} from '@/lib/frequency-identification';
export function FrequencyIdentificationExplorer(){
 const [config,setConfig]=useState<FrequencyConfig>({...frequencyDefaults});
 const result=useMemo(()=>frequencyExperiment(config),[config]);
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{top:0},grid:{left:48,right:20,top:60,bottom:45},xAxis:{type:'value',min:0,max:10,name:'Hz',nameLocation:'middle',nameGap:25},yAxis:{type:'value',min:0,max:3,name:'幅值比'},series:[{name:'真实对象',type:'line',showSymbol:false,lineStyle:{color:'#64748b'},itemStyle:{color:'#64748b'},data:result.rows.map(r=>[r.hz,r.trueGain])},{name:'H1估计',type:'scatter',symbolSize:9,data:result.rows.filter(r=>r.gain!==null).map(r=>[r.hz,r.gain])}]}),[result]);
 const coherenceOption=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},grid:{left:48,right:20,top:35,bottom:45},xAxis:{type:'value',min:0,max:10,name:'Hz',nameLocation:'middle',nameGap:25},yAxis:{type:'value',min:0,max:1,name:'平方相干度'},series:[{name:'平方相干度',type:'scatter',symbolSize:9,data:result.rows.filter(r=>r.coherence!==null).map(r=>[r.hz,r.coherence])}]}),[result]);
 const chart=useECharts(option),coherence=useECharts(coherenceOption),fmt=(v:number|null)=>v===null?'不估计':v.toFixed(6),r=result.selected;
 const preset=(outputNoise:number,inputNoise:number,periods:number,missing=false)=>setConfig({...frequencyDefaults,outputNoise,inputNoise,periods,missing});
 return <section aria-label="频域辨识实验" style={{padding:16,margin:'24px 0',border:'1px solid #94a3b8',borderRadius:12,color:'#0f172a',background:'#f8fafc'}}>
  <p style={{marginTop:0}}>周期稳态、开环、固定种子20261024；输入为六条多正弦。每周期64点，20Hz采样；固定频点2.5Hz的读数如下。灰线是真值，圆点只画声明已激励的频点。</p>
  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{[['默认',.2,0,8,false],['无噪声',0,0,8,false],['单周期',.8,0,1,false],['输出噪声',.8,0,16,false],['输入噪声',0,.8,16,false],['缺少该频点',.2,0,8,true]].map(([name,out,inp,m,missing])=><button type="button" key={String(name)} onClick={()=>preset(out as number,inp as number,m as number,missing as boolean)} style={{padding:'7px 9px',background:'white',border:'1px solid #64748b',borderRadius:6}}>{name}</button>)}<button type="button" onClick={()=>setConfig({...frequencyDefaults})} style={{padding:'7px 9px',background:'white',border:'1px solid #64748b',borderRadius:6}}>恢复默认</button></div>
  <div style={{display:'flex',gap:14,flexWrap:'wrap',marginTop:14}}>{[['对象极点','a',[.2,.7,.9]],['输出噪声标准差','outputNoise',[0,.2,.8]],['输入测量噪声标准差','inputNoise',[0,.3,.8]],['平均周期数','periods',[1,4,8,16]]].map(([label,key,values])=><label key={String(key)} style={{display:'grid',gap:4}}>{String(label)}<select aria-label={String(label)} value={config[key as keyof FrequencyConfig] as number} onChange={e=>setConfig({...config,[key as string]:Number(e.target.value)})}>{(values as number[]).map(v=><option key={v} value={v}>{v}</option>)}</select></label>)}</div>
  <p data-frequency-readout="true" aria-live="polite">真幅值={fmt(r.trueGain)}；估计幅值={fmt(r.gain)}；相位={fmt(r.phase)}°；平方相干度={fmt(r.coherence)}。{config.missing?'未激励该频点，拒绝解释。':config.periods===1?'单周期相干度恒为1，不能据此验收。':'这是有限记录读数，不是总体值或置信区间。'}</p>
  <div ref={chart} style={{width:'100%',height:300}}/><div ref={coherence} style={{width:'100%',height:240}}/>
  <p style={{fontSize:14,marginBottom:0}}>改变周期数也改变总采样量；本图不代表固定预算的最优分段。输入测量噪声会产生误差变量偏差；高相干不保证对象正确。非激励线即使测到传感器噪声也不作为对象响应。</p>
 </section>;
}
