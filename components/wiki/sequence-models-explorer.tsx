"use client";
import {useMemo,useState} from 'react';import type {EChartsOption} from 'echarts';import {useECharts} from './use-echarts';
import {sequence,coefficients,horizons} from '@/lib/sequence-models';
export function SequenceModelsExplorer(){
 const [a,setA]=useState(.5),[n,setN]=useState(4),[kind,setKind]=useState('impulse'),[initial,setInitial]=useState(0),[cut,setCut]=useState(2);
 const k=Math.min(cut,n),r=useMemo(()=>sequence(a,n,kind,initial,k),[a,n,kind,initial,k]);
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{bottom:0},grid:{left:50,right:18,top:35,bottom:65},xAxis:{type:'value',min:0,max:16,name:'步号 t'},yAxis:{type:'value',min:-.31,max:3.21,name:'有符号 log₁₀(1+|值|)'},series:[{name:'状态 h',type:'line',data:r.h.map((v,t)=>[t,Math.sign(v)*Math.log10(1+Math.abs(v))])},{name:'初态敏感度',type:'line',data:r.sensitivity.map((v,t)=>[t,Math.sign(v)*Math.log10(1+Math.abs(v))])}]}),[r]);const chart=useECharts(option);
 const style={padding:7,color:'#172033',background:'#fff',border:'1px solid #94a3b8',borderRadius:5};
 return <section aria-label="时序记忆实验" className="not-prose" style={{padding:16,margin:'20px 0',border:'1px solid #94a3b8',borderRadius:10,background:'#fff',color:'#172033',minWidth:0}}>
 <strong>保留状态，与保留多少条梯度路径，是两件事</strong>
 <label style={{display:'block',marginTop:10}}>记忆系数 a <select aria-label="记忆系数" value={a} onChange={e=>setA(+e.target.value)} style={style}>{coefficients.map(v=><option key={v}>{v}</option>)}</select></label>
 <label style={{display:'block',marginTop:10}}>序列长度 T <select aria-label="序列长度" value={n} onChange={e=>setN(+e.target.value)} style={style}>{horizons.map(v=><option key={v}>{v}</option>)}</select></label>
 <label style={{display:'block',marginTop:10}}>输入 <select aria-label="序列输入" value={kind} onChange={e=>setKind(e.target.value)} style={style}><option value="impulse">首步脉冲</option><option value="constant">恒为1</option><option value="alternating">正负交替</option></select></label>
 <label style={{display:'block',marginTop:10}}>初态 h₀ <select aria-label="循环初态" value={initial} onChange={e=>setInitial(+e.target.value)} style={style}><option>0</option><option>0.25</option></select></label>
 <label style={{display:'block',marginTop:10}}>末端梯度保留 K <select aria-label="梯度长度" value={cut} onChange={e=>setCut(+e.target.value)} style={style}>{[1,2,4,16].map(v=><option key={v} value={v}>{v===16?'完整（K=T）':v}</option>)}</select></label>
 <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}>{['无记忆','增长边界','恢复默认'].map(name=><button key={name} style={style} onClick={()=>{setA(name==='无记忆'?0:name==='增长边界'?1.5:.5);setN(name==='增长边界'?16:4);setKind('impulse');setInitial(0);setCut(2);}}>{name}</button>)}</div>
 <p aria-live="polite">T={n}，有效K={k}；末态={r.h[n].toFixed(8)}；损失={r.loss.toFixed(8)}；完整梯度={r.full.toFixed(8)}；截断梯度={r.truncated.toFixed(8)}；初态敏感度={r.sensitivity[n].toFixed(8)}。</p>
 <div ref={chart} style={{height:320,width:'100%'}}/>
 <p>纵轴为有符号log₁₀(1+|值|)，固定范围兼顾小信号与增长；精确原值见读数。改变K只改变反向路径，状态曲线保持一致。本实验不执行训练，不比较模型预测能力。</p>
 </section>;
}
