"use client";
import {useMemo,useState} from 'react';import type {EChartsOption} from 'echarts';import {useECharts} from './use-echarts';
import {networkExperiment,networkModes,networkPoles,type NetworkMode,type ReceivePolicy} from '@/lib/network-feedback';
export function NetworkFeedbackExplorer(){
 const [gain,setGain]=useState(4),[mode,setMode]=useState<NetworkMode>('clean'),[policy,setPolicy]=useState<ReceivePolicy>('fresh');
 const v=useMemo(()=>networkExperiment(gain,mode,policy),[gain,mode,policy]),p=networkPoles(gain);
 const table=networkModes.flatMap(m=>(['fresh','arrival'] as const).map(q=>networkExperiment(gain,m.id,q)));
 const limit=Math.max(1.2,...v.points.map(q=>Math.abs(q.x)))*1.05;
 const option=useMemo<EChartsOption>(()=>({animation: false,tooltip:{trigger:'axis'},grid:{left:48,right:12,top:28,bottom:40},xAxis:{type:'value',min:0,max:4,name:'时间 (s)',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:-limit,max:limit,name:'归一化状态 x'},series:[{name:'x',type:'line',showSymbol:false,data:v.points.map(q=>[q.k*.1,q.x])}]}),[v,limit]);
 const ageOption=useMemo<EChartsOption>(()=>({animation: false,tooltip:{trigger:'axis'},grid:{left:48,right:12,top:28,bottom:40},xAxis:{type:'value',min:0,max:3.9,name:'时间 (s)'},yAxis:{type:'value',min:0,max:.4,name:'信息年龄 (s)'},series:[{name:'年龄',type:'line',step:'end',data:v.points.slice(0,40).map(q=>[q.k*.1,q.age])}]}),[v]);
 const chart=useECharts(option),ageChart=useECharts(ageOption);
 return <section className="not-prose" aria-label="网络反馈实验" style={{padding:14,margin:'20px 0',border:'1px solid #cbd5e1',borderRadius:10,minWidth:0,color:'#172033'}}>
 <strong>同一控制律，收到的测量有多旧？</strong><p>Ts=0.1 s，40次更新；初始接收值为0，尚无样本的年龄留空。仅传感器网络受扰，无噪声和限幅。曲线轴范围随当前有限窗口重新计算，不能据图形高度比较不同工况。</p>
 <label style={{display:'block'}}>K={gain}<input aria-label="反馈增益" type="range" min={1} max={12} step={1} value={gain} onChange={e=>setGain(+e.target.value)} style={{width:'100%'}}/></label>
 <label style={{display:'block'}}>网络轨迹 <select aria-label="网络轨迹" value={mode} onChange={e=>setMode(e.target.value as NetworkMode)} style={{padding:6,maxWidth:'100%'}}>{networkModes.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
 <label style={{display:'block'}}>接收规则 <select aria-label="接收规则" value={policy} onChange={e=>setPolicy(e.target.value as ReceivePolicy)} style={{padding:6,maxWidth:'100%'}}><option value="fresh">只接收更大序号</option><option value="arrival">每个到达包都覆盖</option></select></label>
 <div ref={chart} style={{width:'100%',height:260}}/><div ref={ageChart} style={{width:'100%',height:210}}/>
 <p data-network-metrics aria-live="polite">x40={v.final.toExponential(6)}；采样峰值={v.peak.toFixed(6)}；最大年龄={v.maxAge.toFixed(3)} s；拒收旧包={v.rejected}；即时极点={p.clean.toFixed(6)}；一拍时延谱半径={p.rho.toFixed(6)}。</p>
 <p>下表固定相同K及发送规则，只改变接收规则；不代表独立整定后的控制性能排名。x40为有限末值，峰值为41个采样点的最大绝对值。</p>
 <div role="region" aria-label="网络工况对照" tabIndex={0} style={{overflowX:'auto',maxWidth:'100%'}}><table style={{minWidth:540,width:'100%',borderCollapse:'collapse',fontSize:13}}><thead><tr>{['轨迹','规则','x40','采样峰值','年龄(s)','拒收'].map(t=><th key={t} style={{padding:6,textAlign:'left'}}>{t}</th>)}</tr></thead><tbody>{table.map(t=><tr key={t.mode+t.policy}>{[networkModes.find(m=>m.id===t.mode)?.name,t.policy,t.final.toExponential(6),t.peak.toFixed(6),t.maxAge.toFixed(3),t.rejected].map((q,i)=><td key={i} style={{padding:6,borderTop:'1px solid #dbe2ea'}}>{q}</td>)}</tr>)}</tbody></table></div>
 <button onClick={()=>{setGain(4);setMode('clean');setPolicy('fresh');}} style={{padding:8,border:'1px solid #cbd5e1',borderRadius:6,marginTop:12}}>恢复默认</button>
 </section>;
}
