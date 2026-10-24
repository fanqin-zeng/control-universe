"use client";
import {useMemo,useState} from 'react';import type {EChartsOption} from 'echarts';import {useECharts} from './use-echarts';
import {hilExperiment,hilModes,hilSteps,type HilMode,type HilPolicy} from '@/lib/hil-rehearsal';
export function HilRehearsalExplorer(){
 const [steps,setSteps]=useState(10),[mode,setMode]=useState<HilMode>('clean'),[policy,setPolicy]=useState<HilPolicy>('zero3'),[cost,setCost]=useState(4);
 const v=useMemo(()=>hilExperiment(steps,mode,policy,cost),[steps,mode,policy,cost]);
 const table=useMemo(()=>hilModes.flatMap(m=>(['hold','zero3'] as const).map(p=>hilExperiment(steps,m.id,p,cost))),[steps,cost]);
 const option=useMemo<EChartsOption>(()=>({animation: false,tooltip:{trigger:'axis'},legend:{top:0,bottom:'auto',itemWidth:12,itemHeight:8,textStyle:{fontSize:10},data:['Euler状态','同输入精确影子','目标']},grid:{left:50,right:15,top:38,bottom:44},xAxis:{type:'value',min:0,max:2,name:'虚拟时间 (s)',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:0,max:1.1,name:'状态'},series:[{name:'Euler状态',type:'line',showSymbol:false,data:v.points.map(p=>[p.k*.02,p.x])},{name:'同输入精确影子',type:'line',showSymbol:false,lineStyle:{type:'dashed'},data:v.points.map(p=>[p.k*.02,p.exact])},{name:'目标',type:'line',showSymbol:false,data:[[0,1],[2,1]]}]}),[v]);
 const timing=useMemo<EChartsOption>(()=>({animation: false,tooltip:{trigger:'axis'},legend:{top:0,bottom:'auto',itemWidth:12,itemHeight:8,textStyle:{fontSize:10},data:['施加命令','注入成本','期限']},grid:{left:50,right:50,top:38,bottom:44},xAxis:{type:'value',min:0,max:1.98,name:'虚拟时间 (s)',nameLocation:'middle',nameGap:28},yAxis:[{type:'value',min:0,max:2.2,name:'u'},{type:'value',min:0,max:35,name:'成本 (ms)'}],series:[{name:'施加命令',type:'line',step:'end',showSymbol:false,data:v.points.slice(0,100).map(p=>[p.k*.02,p.u])},{name:'注入成本',yAxisIndex:1,type:'line',step:'end',showSymbol:false,data:v.jobs.map(j=>[j.k*.02,j.costMs])},{name:'期限',yAxisIndex:1,type:'line',showSymbol:false,lineStyle:{type:'dashed'},data:[[0,20],[1.98,20]]}]}),[v]);
 const chart=useECharts(option),timeChart=useECharts(timing);
 return <section className="not-prose" aria-label="虚拟台架实验" style={{padding:14,margin:'20px 0',border:'1px solid #cbd5e1',borderRadius:10,minWidth:0,color:'#172033'}}>
 <strong>软件排练：哪个命令会在下一拍生效？</strong><p>虚拟时钟、未接硬件。T=20 ms，100次提交，结果下一拍锁存；注入成本不是CPU实测。超期丢弃，不模拟CPU排队；zero3仅是教学零输出降级，未证明安全。</p>
 <label style={{display:'block'}}>工况 <select aria-label="台架工况" value={mode} onChange={e=>setMode(e.target.value as HilMode)} style={{padding:6,maxWidth:'100%'}}>{hilModes.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
 <label style={{display:'block'}}>每帧子步 <select aria-label="模型子步数" value={steps} onChange={e=>setSteps(+e.target.value)} style={{padding:6}}>{hilSteps.map(n=><option key={n} value={n}>{n}（h={20/n} ms）</option>)}</select></label>
 <label style={{display:'block'}}>超期动作 <select aria-label="超期动作" value={policy} onChange={e=>setPolicy(e.target.value as HilPolicy)} style={{padding:6,maxWidth:'100%'}}><option value="zero3">连续3次失败后置零</option><option value="hold">保持最后命令</option></select></label>
 <label style={{display:'block'}}>可调工况成本={cost} ms<input aria-label="注入完成成本" disabled={mode!=='clean'} type="range" min={1} max={30} step={1} value={cost} onChange={e=>setCost(+e.target.value)} style={{width:'100%'}}/></label>
 <div ref={chart} style={{width:'100%',height:260}}/><div ref={timeChart} style={{width:'100%',height:260}}/>
 <p data-hil-metrics aria-live="polite">x100={v.final.toFixed(9)}；IAE={v.iae.toFixed(9)} s；最大同输入差={v.maxError.toFixed(9)}；超期任务={v.misses}；降级区间={v.zeroFrames}。</p>
 <p data-hil-first>首帧u0={v.points[0].u?.toFixed(6)}；x1={v.points[1].x.toFixed(6)}；u1={v.points[1].u?.toFixed(6)}；x2={v.points[2].x.toFixed(9)}。</p>
 <p>末状态取2秒；IAE按前100个采样值乘T；数值差仅在101个帧边界统计。精确影子用相同施加命令而不反馈自身状态。下表同一K与成本规则，不是安全策略或控制器最优排名。</p>
 <div role="region" aria-label="台架工况对照" tabIndex={0} style={{overflowX:'auto',maxWidth:'100%'}}><table style={{minWidth:560,width:'100%',borderCollapse:'collapse',fontSize:13}}><thead><tr>{['工况','动作','x100','IAE(s)','超期','降级'].map(t=><th key={t} style={{padding:6,textAlign:'left'}}>{t}</th>)}</tr></thead><tbody>{table.map(q=><tr key={q.mode+q.policy}>{[hilModes.find(m=>m.id===q.mode)?.name,q.policy,q.final.toFixed(9),q.iae.toFixed(9),q.misses,q.zeroFrames].map((x,i)=><td key={i} style={{padding:6,borderTop:'1px solid #dbe2ea'}}>{x}</td>)}</tr>)}</tbody></table></div>
 <button onClick={()=>{setSteps(10);setMode('clean');setPolicy('zero3');setCost(4);}} style={{padding:8,border:'1px solid #cbd5e1',borderRadius:6,marginTop:12}}>恢复默认</button>
 </section>;
}
