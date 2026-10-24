"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {implementationCase,caseModes,caseBits,type CaseMode,type CasePath} from '@/lib/implementation-case';

export function ImplementationCaseExplorer(){
  const [bits,setBits]=useState(8),[mode,setMode]=useState<CaseMode>('nominal');
  const [path,setPath]=useState<CasePath>('guarded'),[cost,setCost]=useState(4);
  const value=useMemo(()=>implementationCase(bits,mode,path,cost),[bits,mode,path,cost]);
  const table=useMemo(()=>caseModes.flatMap(m=>(['guarded','naive'] as const).map(p=>implementationCase(bits,m.id,p,cost))),[bits,cost]);
  const option=useMemo<EChartsOption>(()=>({animation: false,tooltip:{trigger:'axis'},legend:{top:0,bottom:'auto',textStyle:{fontSize:10},data:['实际温差','有效或保持的测量','目标']},grid:{left:48,right:16,top:38,bottom:44},xAxis:{type:'value',min:0,max:30,name:'虚拟时间 (s)',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:0,max:3.5,name:'温差 (℃)',nameLocation:'middle',nameGap:32},series:[{name:'实际温差',type:'line',showSymbol:false,data:[...value.points.map(p=>[p.k/10,p.y]),[30,value.final]]},{name:'有效或保持的测量',type:'line',showSymbol:false,lineStyle:{type:'dashed'},data:value.points.map(p=>[p.k/10,p.measured])},{name:'目标',type:'line',showSymbol:false,data:[[0,value.target],[30,value.target]]}]}),[value]);
  const output=useMemo<EChartsOption>(()=>({animation: false,tooltip:{trigger:'axis'},legend:{top:0,bottom:'auto',textStyle:{fontSize:10},data:['施加输出','无效数据','零输出降级']},grid:{left:48,right:16,top:38,bottom:44},xAxis:{type:'value',min:0,max:30,name:'虚拟时间 (s)',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:0,max:1.1,name:'归一化量',nameLocation:'middle',nameGap:32},series:[{name:'施加输出',type:'line',step:'end',showSymbol:false,data:value.points.map(p=>[p.k/10,p.u])},{name:'无效数据',type:'line',step:'end',showSymbol:false,lineStyle:{type:'dashed'},data:value.points.map(p=>[p.k/10,p.valid?0:1])},{name:'零输出降级',type:'line',step:'end',showSymbol:false,data:value.points.map(p=>[p.k/10,p.degraded?1:0])}]}),[value]);
  const chart=useECharts(option),outputChart=useECharts(output);
  return <section aria-label="控制实现回归" className="not-prose" style={{padding:14,border:'1px solid #cbd5e1',borderRadius:10,margin:'20px 0',minWidth:0,color:'#172033'}}>
    <strong>水箱控制：曲线恢复了，验收就通过了吗？</strong>
    <p>离散教学模型，未接硬件。控制周期100 ms；注入成本只决定数据是否有效，不是墙钟测量，也不模拟实际传输延迟。</p>
    <label style={{display:'block'}}>场景 <select aria-label="实现工况" value={mode} onChange={e=>setMode(e.target.value as CaseMode)} style={{padding:6,maxWidth:'100%'}}>{caseModes.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
    <label style={{display:'block'}}>量化位数 <select aria-label="量化位数" value={bits} onChange={e=>setBits(+e.target.value)} style={{padding:6}}>{caseBits.map(n=><option key={n} value={n}>{n}位</option>)}</select></label>
    <label style={{display:'block'}}>实现路径 <select aria-label="实现路径" value={path} onChange={e=>setPath(e.target.value as CasePath)} style={{padding:6,maxWidth:'100%'}}><option value="guarded">有效性检查与三次失败置零</option><option value="naive">旧测量继续积分</option></select></label>
    <label style={{display:'block'}}>假定完成成本={mode==='late'?101:cost} ms<input aria-label="完成成本" type="range" min={1} max={120} step={1} disabled={mode==='late'} value={cost} onChange={e=>setCost(+e.target.value)} style={{width:'100%'}}/></label>
    <div ref={chart} style={{height:260,width:'100%'}}/><div ref={outputChart} style={{height:250,width:'100%'}}/>
    <p data-case-metrics aria-live="polite">末温差={value.final.toFixed(9)}；IAE={value.iae.toFixed(9)}；末窗最大误差={value.lastError.toFixed(9)}；超调={value.overshoot.toFixed(9)}；无效={value.invalid}；降级={value.degraded}；限幅={value.saturated}。</p>
    <p data-case-gates>末窗误差：{value.tracking?'通过':'不通过'}；采样超调：{value.peakOk?'通过':'不通过'}；新鲜度：{value.freshness?'通过':'不通过'}；教学总判定：{value.accepted?'通过':'不通过'}。</p>
    <p data-case-first>u0={value.points[0].u.toFixed(9)}；y1={value.points[1].y.toFixed(9)}；测量1={value.points[1].measured.toFixed(9)}；积分1={value.points[1].integral.toFixed(9)}；u1={value.points[1].u.toFixed(9)}。</p>
    <p>IAE单位℃·s；末温差取30秒，末窗为25.1–30秒的50个边界。降级不是安全认证；成本是同一拍逻辑有效性筛选，不模拟拍内动态。</p>
    <div role="region" aria-label="实现回归表" tabIndex={0} style={{overflowX:'auto',maxWidth:'100%'}}><table style={{minWidth:650,width:'100%',fontSize:12,borderCollapse:'collapse'}}><thead><tr>{['场景','路径','末温差','IAE','末窗误差','无效','降级','通过'].map(t=><th key={t} style={{padding:5,textAlign:'left'}}>{t}</th>)}</tr></thead><tbody>{table.map(v=><tr key={v.mode+v.path}>{[v.mode,v.path,v.final.toFixed(9),v.iae.toFixed(9),v.lastError.toFixed(9),v.invalid,v.degraded,v.accepted?'是':'否'].map((q,i)=><td key={i} style={{padding:5,borderTop:'1px solid #dbe2ea'}}>{q}</td>)}</tr>)}</tbody></table></div>
    <button style={{padding:8,marginTop:10,border:'1px solid #cbd5e1',borderRadius:6}} onClick={()=>{setBits(8);setMode('nominal');setPath('guarded');setCost(4);}}>恢复默认</button>
  </section>;
}
