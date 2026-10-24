"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {nonlinearExperiment,nonlinearDefaults,type NonlinearConfig} from '@/lib/nonlinear-identification';
export function NonlinearIdentificationExplorer(){
 const [config,setConfig]=useState<NonlinearConfig>({...nonlinearDefaults});const result=useMemo(()=>nonlinearExperiment(config),[config]);
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{top:0},grid:{left:45,right:18,top:60,bottom:45},xAxis:{type:'value',min:1,max:128,name:'测试步 k（Ts=1s）',nameLocation:'middle',nameGap:27},yAxis:{type:'value',min:-5,max:5,name:'归一化输出'},series:[{name:'实际记录',type:'line',showSymbol:false,itemStyle:{color:'#64748b'},data:result.test.y.slice(1).map((y,i)=>[i+1,y])},{name:'线性滚动',type:'line',showSymbol:false,data:result.models.linear.test?.roll.map((y,i)=>[i+1,y])??[]},{name:'三次滚动',type:'line',showSymbol:false,data:result.models.cubic.test?.roll.map((y,i)=>[i+1,y])??[]}]}),[result]);
 const errors=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{top:0},grid:{left:45,right:18,top:55,bottom:35},xAxis:{type:'category',min:0,max:1,data:['验证滚动','测试滚动']},yAxis:{type:'value',min:0,max:2,name:'RMSE'},series:[{name:'线性',type:'bar',data:[result.models.linear.validation?.rollRMSE??null,result.models.linear.test?.rollRMSE??null]},{name:'三次',type:'bar',data:[result.models.cubic.validation?.rollRMSE??null,result.models.cubic.test?.rollRMSE??null]}]}),[result]);
 const chart=useECharts(option),bar=useECharts(errors),fmt=(v:number|undefined)=>v===undefined?'不可估计':v.toFixed(6),selected=result.selected==='cubic'?'三次':result.selected==='linear'?'线性':'不可辨识';const preset=(patch:Partial<NonlinearConfig>)=>setConfig({...nonlinearDefaults,...patch});
 return <section aria-label="非线性辨识实验" style={{padding:16,margin:'24px 0',border:'1px solid #94a3b8',borderRadius:12,background:'#f8fafc',color:'#0f172a'}}>
  <p style={{marginTop:0}}>两模型只拟合128步训练记录；验证128步、幅值固定1，按自由滚动RMSE选择。独立测试再差也不回头改选择。默认tanh对象、训练幅值1、测试幅值2、种子20261024，无噪声。</p>
  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{[['默认外推',{}],['同幅值测试',{testAmplitude:1}],['小幅值训练',{amplitude:.5}],['二值激励',{binary:true}],['零输入',{amplitude:0}],['线性对象',{plant:'linear'}]].map(([name,patch])=><button type="button" key={String(name)} onClick={()=>preset(patch as Partial<NonlinearConfig>)} style={{padding:'7px 9px',background:'white',border:'1px solid #64748b',borderRadius:6}}>{String(name)}</button>)}<button type="button" onClick={()=>preset({})} style={{padding:'7px 9px',background:'white',border:'1px solid #64748b',borderRadius:6}}>恢复默认</button></div>
  <div style={{display:'flex',gap:14,flexWrap:'wrap',marginTop:14}}>
   <label style={{display:'grid',gap:4}}>训练幅值<select aria-label="训练幅值" value={config.amplitude} onChange={e=>setConfig({...config,amplitude:Number(e.target.value)})}>{[0,.5,1].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
   <label style={{display:'grid',gap:4}}>训练激励<select aria-label="训练激励" value={config.binary?'binary':'multi'} onChange={e=>setConfig({...config,binary:e.target.value==='binary'})}><option value="multi">五级</option><option value="binary">二值</option></select></label>
   <label style={{display:'grid',gap:4}}>创新尺度<select aria-label="创新尺度" value={config.noise} onChange={e=>setConfig({...config,noise:Number(e.target.value)})}>{[0,.03].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
   <label style={{display:'grid',gap:4}}>教学对象<select aria-label="教学对象" value={config.plant} onChange={e=>setConfig({...config,plant:e.target.value as 'tanh'|'linear'})}><option value="tanh">tanh饱和</option><option value="linear">线性对照</option></select></label>
   <label style={{display:'grid',gap:4}}>测试幅值<select aria-label="测试幅值" value={config.testAmplitude} onChange={e=>setConfig({...config,testAmplitude:Number(e.target.value)})}>{[.5,1,2].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
  </div>
  <p data-nonlinear-readout="true" aria-live="polite">验证选择={selected}；线性秩={result.models.linear.rank}；三次秩={result.models.cubic.rank}；线性测试滚动={fmt(result.models.linear.test?.rollRMSE)}；三次测试滚动={fmt(result.models.cubic.test?.rollRMSE)}。</p>
  <p style={{fontSize:14}}>三次测试一步={fmt(result.models.cubic.test?.oneRMSE)}；三次系数：{result.models.cubic.coefficients?.map(v=>v.toFixed(6)).join('，')??'秩不足，拒绝完整模型'}。测试幅值只影响评估；缺失模型不补零误差。</p>
  <div ref={chart} style={{width:'100%',height:310}}/><div ref={bar} style={{width:'100%',height:260}}/>
  <p style={{fontSize:14,marginBottom:0}}>一步预测每拍使用真实上一输出，自由滚动只使用初值和自身预测。三次模型是固定特征的最小二乘，未训练神经网络。此仿真不证明闭环稳定、真实装置可辨识或工作区外可靠。</p>
 </section>;
}
