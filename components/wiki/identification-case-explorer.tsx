'use client';
import {useMemo,useState} from 'react';
import {caseDefaults,caseExperiment,CaseConfig} from '@/lib/identification-case';
import {useECharts} from './use-echarts';
import type {EChartsOption} from 'echarts';
export function IdentificationCaseExplorer(){
 const[c,setC]=useState<CaseConfig>({...caseDefaults}),r=useMemo(()=>caseExperiment(c),[c]);
 const preset=[['默认闭环',{}],['无噪声',{sigma:0}],['白测量噪声',{rho:0}],['弱注入',{amplitude:.1}],['无注入',{amplitude:0}],['对象变化',{changed:true}]] as const;
 const style={padding:'8px 12px',border:'1px solid #94a3b8',borderRadius:6,background:'white',color:'#0f172a',cursor:'pointer'};
 const timeOption=useMemo<EChartsOption>(()=>({animation:false,legend:{top:0,data:['测量','OLS','IV']},tooltip:{trigger:'axis'},grid:{left:55,right:18,top:42,bottom:42},xAxis:{type:'value',min:64,max:575,name:'k (s)',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:-1.5,max:1.5,name:'水位 / cm'},series:[{name:'测量',type:'line',showSymbol:false,lineStyle:{width:1},data:r.test.y.slice(64).map((v,i)=>[i+64,v])},...(['OLS','IV'] as const).map(name=>({name,type:'line' as const,showSymbol:false,data:r.models[name].test?.pred.slice(64).map((v,i)=>[i+64,v])??[]}))]}),[r]);
 const spectrumOption=useMemo<EChartsOption>(()=>({animation:false,legend:{top:0,data:['H1','OLS','IV']},tooltip:{trigger:'axis'},grid:{left:55,right:18,top:42,bottom:42},xAxis:{type:'value',min:0,max:.5,name:'频率 / Hz',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:0,max:1.5,name:'幅值'},series:[{name:'H1',type:'scatter',symbolSize:10,data:r.spectrum.map(p=>[p.frequency,p.gain])},...(['OLS','IV'] as const).map(name=>({name,type:'line' as const,showSymbol:false,data:r.models[name].valid?Array.from({length:30},(_,i)=>{const f=(i+2)/64,[a,b]=r.models[name].coefficients!;return[f,b/Math.sqrt(1+a*a-2*a*Math.cos(2*Math.PI*f))];}):[]}))]}),[r]);
 const timeRef=useECharts(timeOption),spectrumRef=useECharts(spectrumOption);
 const fmt=(v:number|null|undefined)=>v==null?'未定义':v.toFixed(6);
 return <section data-testid="case-explorer" style={{border:'1px solid #94a3b8',borderRadius:12,padding:16,margin:'20px 0',background:'#f8fafc',color:'#0f172a',maxWidth:'100%'}}>
 <h3 style={{marginTop:0}}>水箱模型的选择与放行</h3><p>只改测试对象时，训练系数、验证读数和选中模型保持不变。拒绝后应重开实验合同。</p>
 <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{preset.map(([label,patch])=><button key={label} style={style} onClick={()=>setC({...caseDefaults,...patch})}>{label}</button>)}<button style={style} onClick={()=>setC({...caseDefaults})}>恢复默认</button></div>
 <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:14}}>{([['amplitude','注入幅度',[0,.1,.5,1]],['rho','测量相关系数',[0,.6]],['sigma','创新标准差 cm',[0,.2]],['feedback','反馈系数',[0,.4]]] as const).map(([key,label,values])=><label key={key}>{label}<select aria-label={label} value={c[key]} style={{...style,display:'block',minWidth:120}} onChange={e=>setC({...c,[key]:Number(e.target.value)})}>{values.map(v=><option key={v} value={v}>{v}</option>)}</select></label>)}<label>测试对象<select aria-label="测试对象" value={String(c.changed)} style={{...style,display:'block'}} onChange={e=>setC({...c,changed:e.target.value==='true'})}><option value="false">名义对象</option><option value="true">对象变化</option></select></label></div>
 <p data-testid="case-decision" style={{fontWeight:700}}>验证选中：{r.selected??'无合格候选'}；测试结论：{r.admitted?'放行指定预测用途':'拒绝放行'}；输入峰值 {fmt(r.inputPeak)} 单位</p>
 <div style={{overflowX:'auto'}}><table style={{width:'100%',fontSize:14,borderCollapse:'collapse'}}><thead><tr>{['候选','a','b','验证RMSE cm','测试RMSE cm','测试改善率'].map(t=><th key={t} style={{padding:6,textAlign:'left'}}>{t}</th>)}</tr></thead><tbody>{(['OLS','IV'] as const).map(name=>{const m=r.models[name];return <tr key={name} data-testid={'case-'+name}><td style={{padding:6}}>{name}{m.valid?'':'（秩/先验拒绝）'}</td><td>{fmt(m.coefficients?.[0])}</td><td>{fmt(m.coefficients?.[1])}</td><td>{fmt(m.validation?.rmse)}</td><td>{fmt(m.test?.rmse)}</td><td>{m.test?.improvement==null?'未定义':(100*m.test.improvement).toFixed(3)+'%'}</td></tr>;})}</tbody></table></div>
 <div ref={timeRef} style={{width:'100%',height:300}} aria-label="独立测试水位与自由仿真"/><div ref={spectrumRef} style={{width:'100%',height:300}} aria-label="独立测试频响幅值"/>
 <p data-testid="case-spectrum">0.125 Hz：H1幅值 {fmt(r.spectrum[1].gain)}；相干 {fmt(r.spectrum[1].coherence)}；选中残差滞后一阶相关 {fmt(r.selected?r.models[r.selected].test?.residualLag1:null)}。</p>
 <p style={{fontSize:13}}>空曲线表示候选未通过秩/先验，不是零误差。训练512对；验证与测试各在k=64…575计分。固定轴用于同工况比较，图中刻度不是安全边界。</p>
 </section>;
}
