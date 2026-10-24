"use client";
import {useMemo, useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {rlsIdentification, type RlsScenario} from '@/lib/rls-identification';

export function RlsIdentificationExplorer() {
  const [lambda, setLambda] = useState(1), [disturbance, setDisturbance] = useState(0);
  const [scenario, setScenario] = useState<RlsScenario>('steady');
  const result = useMemo(() => rlsIdentification(lambda, disturbance, scenario), [lambda, disturbance, scenario]);
  const option = useMemo<EChartsOption>(() => ({animation: false, tooltip: {trigger: 'axis'}, legend: {top: 0, data: ['真实 b', '估计 b']}, grid: {left: 50, right: 20, top: 45, bottom: 42}, xAxis: {type: 'value', min: 0, max: 32, interval: 8, name: '更新次数', nameLocation: 'middle', nameGap: 27}, yAxis: {type: 'value', min: 0, max: .7, interval: .1, name: 'b (cm)'}, series: [{name: '真实 b', type: 'line', showSymbol: false, step: 'end', data: result.rows.map(r=>[r.n,r.truth])}, {name: '估计 b', type: 'line', showSymbol: false, data: result.rows.map(r=>[r.n,r.estimate])}]}), [result]);
  const informationOption = useMemo<EChartsOption>(() => ({animation: false, tooltip: {trigger: 'axis'}, grid: {left: 50, right: 20, top: 35, bottom: 42}, xAxis: {type: 'value', min: 0, max: 32, interval: 8, name: '更新次数', nameLocation: 'middle', nameGap: 27}, yAxis: {type: 'log', min: .01, max: 100, name: '逆信息量 P'}, series: [{name:'P',type:'line',showSymbol:false,data:result.rows.map(r=>[r.n,r.informationInverse])}]}), [result]);
  const chart=useECharts(option), informationChart=useECharts(informationOption);
  const control={display:'block',marginTop:12} as const;
  return <section aria-label="递推最小二乘探索" style={{padding:16,border:'1px solid #94a3b8',borderRadius:8,background:'#fff',color:'#172033',margin:'20px 0',minWidth:0}}>
    <strong>已知 a=0.8，只估计输入系数 b</strong>
    <label style={control}>遗忘因子 λ={lambda.toFixed(2)}<input aria-label="遗忘因子" type="range" min={.9} max={1} step={.01} value={lambda} onChange={e=>setLambda(+e.target.value)} style={{width:'100%'}}/></label>
    <label style={control}>固定交替扰动幅度={disturbance.toFixed(2)} cm<input aria-label="扰动幅度" type="range" min={0} max={.12} step={.02} value={disturbance} onChange={e=>setDisturbance(+e.target.value)} style={{width:'100%'}}/></label>
    <label style={control}>工况 <select aria-label="辨识工况" value={scenario} onChange={e=>setScenario(e.target.value as RlsScenario)} style={{padding:6,background:'#fff',color:'#172033'}}><option value="steady">定常 b=0.2</option><option value="jump">第17次更新起 b=0.5</option><option value="quiet">全程无输入（扰动关闭）</option></select></label>
    <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}>{([{name:'恢复默认',lambda:1,disturbance:0,scenario:'steady'},{name:'参数跳变',lambda:.9,disturbance:0,scenario:'jump'},{name:'定常扰动',lambda:.9,disturbance:.12,scenario:'steady'},{name:'无输入',lambda:.9,disturbance:0,scenario:'quiet'}] as const).map(p=><button key={p.name} onClick={()=>{setLambda(p.lambda);setDisturbance(p.disturbance);setScenario(p.scenario);}} style={{padding:8,border:'1px solid #94a3b8',borderRadius:4,background:'#f1f5f9',color:'#172033'}}>{p.name}</button>)}</div>
    <p aria-live="polite" data-rls-readout>第32次更新：估计 b={result.final.estimate.toFixed(6)} cm；P={result.final.informationInverse.toFixed(6)}。</p>
    <div ref={chart} style={{width:'100%',height:310}}/><div ref={informationChart} style={{width:'100%',height:250}}/>
    <p>初值估计 b=0、P=1；每次先预测，再用新样本更新。P轴为对数刻度。扰动是固定交替序列，不能据此计算随机方法的方差或置信度；参数更新也不代表闭环控制已获稳定保证。</p>
  </section>;
}
