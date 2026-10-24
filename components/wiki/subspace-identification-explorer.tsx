"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {subspaceExperiment,subspaceDefaults,type SubspaceConfig} from '@/lib/subspace-identification';
export function SubspaceIdentificationExplorer(){
 const [config,setConfig]=useState<SubspaceConfig>({...subspaceDefaults});const result=useMemo(()=>subspaceExperiment(config),[config]);
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},grid:{left:70,right:20,top:40,bottom:35},xAxis:{type:'category',min:0,max:3,data:['σ1','σ2','σ3','σ4']},yAxis:{type:'log',min:1e-8,max:10,name:'奇异值（对数）'},series:[{name:'Hankel奇异值',type:'scatter',symbolSize:10,data:result.singular.map((s,i)=>[i,s<1e-8?null:s]),markLine:{silent:true,symbol:'none',label:{show:false},data:[{yAxis:config.tolerance*result.singular[0]}]}}]}),[result,config.tolerance]);
 const impulse=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{top:0},grid:{left:48,right:20,top:55,bottom:45},xAxis:{type:'value',min:1,max:20,name:'采样序号 ℓ',nameLocation:'middle',nameGap:27},yAxis:{type:'value',min:-2.5,max:2.5,name:'脉冲响应'},series:[{name:'真实响应',type:'line',showSymbol:false,lineStyle:{color:'#64748b'},itemStyle:{color:'#64748b'},data:result.truth.map((y,i)=>[i+1,y])},{name:'前8个测量',type:'scatter',data:result.measured.map((y,i)=>[i+1,y])},{name:'ERA实现',type:'line',showSymbol:false,data:result.prediction?.map((y,i)=>[i+1,y])??[]}]}),[result]);
 const chart=useECharts(option),response=useECharts(impulse),fmt=(v:number|null)=>v===null?'拒绝求逆':v.toFixed(6),preset=(patch:Partial<SubspaceConfig>)=>setConfig({...subspaceDefaults,...patch});
 return <section aria-label="子空间辨识实验" style={{padding:16,margin:'24px 0',border:'1px solid #94a3b8',borderRadius:12,background:'#f8fafc',color:'#0f172a'}}>
  <p style={{marginTop:0}}>从8个脉冲响应构造4×4 Hankel；本图是ERA教学例。第二模态减弱、极点重合或阈值过大时，两阶实现可能被拒绝。灰线为已知仿真真值，扰动是固定种子20261024的有限测量误差。</p>
  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{[['默认',{}],['只保留一阶',{order:1}],['弱模态',{amplitude:.05,tolerance:.02}],['模态消失',{amplitude:0}],['极点重合',{pole:.8}],['测量扰动',{noise:.02}]].map(([name,patch])=><button key={String(name)} type="button" onClick={()=>preset(patch as Partial<SubspaceConfig>)} style={{padding:'7px 9px',background:'white',border:'1px solid #64748b',borderRadius:6}}>{String(name)}</button>)}<button type="button" onClick={()=>preset({})} style={{padding:'7px 9px',background:'white',border:'1px solid #64748b',borderRadius:6}}>恢复默认</button></div>
  <div style={{display:'flex',gap:14,flexWrap:'wrap',marginTop:14}}>{[['第二模态幅度','amplitude',[0,.05,.5,1]],['第二极点','pole',[.3,.8,.95]],['测量误差尺度','noise',[0,.001,.02]],['相对奇异值阈值','tolerance',[1e-8,.02,.1,.4]],['保留阶数','order',[1,2]]].map(([label,key,values])=><label key={String(key)} style={{display:'grid',gap:4}}>{String(label)}<select aria-label={String(label)} value={config[key as keyof SubspaceConfig]} onChange={e=>setConfig({...config,[key as string]:Number(e.target.value)})}>{(values as number[]).map(v=><option key={v} value={v}>{v}</option>)}</select></label>)}</div>
  <p data-subspace-readout="true" aria-live="polite">σ1={fmt(result.singular[0])}；σ2={fmt(result.singular[1])}；阈值阶数={result.rank}；20点脉冲RMSE={fmt(result.rmse)}。{result.prediction?'实现已计算；应继续检查独立记录。':'保留阶数超过阈值阶数，不用ε伪造逆。'}</p>
  <p style={{fontSize:14}}>极点：{result.poles?.map(p=>`${p.re.toFixed(6)}${p.im===0?'':(p.im>0?'+':'')+p.im.toFixed(6)+'j'}`).join('，')??'未定义'}。状态坐标任意，不将实现矩阵元素解释为物理温度。</p>
  <div ref={chart} style={{width:'100%',height:280}}/><div ref={response} style={{width:'100%',height:300}}/>
  <p style={{fontSize:14,marginBottom:0}}>奇异值图低于1e-8不画点，原始值未置零；虚线为相对阈值×σ1。阈值阶数不是物理阶次检验。20点误差使用仿真真值，前8点参与实现，不能冒充现场独立验证；下方Notebook另用未参与估计的输入记录。</p>
 </section>;
}
