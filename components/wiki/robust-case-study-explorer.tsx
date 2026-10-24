"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {caseDefault,caseReadings,caseFrequency,caseTrace} from '@/lib/robust-case-study';
export function RobustCaseStudyExplorer(){
 const [p,setP]=useState(caseDefault),r=useMemo(()=>caseReadings(p),[p]),v=useMemo(()=>caseTrace(p),[p]);
 const timeOption=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{data:['位置 x₂','力 F'],top:0},grid:{top:45,left:45,right:20,bottom:45},xAxis:{type:'value',min:0,max:60,name:'t (s)',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:-2,max:3,name:'m / N'},series:['位置 x₂','力 F'].map((name,j)=>({name,type:'line',showSymbol:false,data:v.time.map((t,i)=>[t,j?v.force[i]:v.y[i]])}))}),[v]);
 const frequencyOption=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{data:['|S|','|T|'],top:0},grid:{top:45,left:45,right:20,bottom:45},xAxis:{type:'log',min:.01,max:30,name:'ω (rad/s)',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:0,max:8,name:'幅值'},series:['|S|','|T|'].map((name,j)=>({name,type:'line',showSymbol:false,data:Array.from({length:401},(_,i)=>{const w=.01*3000**(i/400),a=caseFrequency(p,w);return[w,j?a.T:a.S];})}))}),[p]);
 const a=useECharts(timeOption),b=useECharts(frequencyOption),button={padding:8,border:'1px solid #64748b',borderRadius:6,background:'transparent',cursor:'pointer'};
 return <section aria-label="柔性结构案例实验" style={{padding:16,border:'1px solid #64748b',borderRadius:12,margin:'24px 0',minWidth:0}}>
 <p><strong>先判断稳定，再读响应。</strong>仅测量x₂、F=q(1−x₂)，零初值单位阶跃。q为比例反馈教学基线；未执行H∞/μ综合。</p>
 <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>{([['质量 m₂','m',.3,.7,.01],['刚度 k','k',8,12,.1],['比例增益 q','q',.1,10,.1]] as const).map(([label,key,min,max,step])=><label key={key} style={{display:'grid',flex:'1 1 180px',minWidth:0}}>{label}={p[key].toFixed(3)}<input aria-label={label} type="range" min={min} max={max} step={step} value={p[key]} onChange={e=>setP({...p,[key]:+e.target.value})} style={{width:'100%'}}/></label>)}</div>
 <p data-testid="case-status">Routh判据：{r.stable?'渐近稳定':'不满足严格稳定条件'}。{p.q===1?'固定阻尼的整个质量/刚度矩形另有解析证书。':'当前读数只判断选中的对象。'}</p>
 <p data-testid="case-readings" style={{fontVariantNumeric:'tabular-nums',overflowWrap:'anywhere'}}>Δ₂={r.d2.toFixed(6)}；Δ₃={r.d3.toFixed(6)}；无阻尼相对模态频率={r.wn.toFixed(6)}；{r.stable?'稳态误差=0（线性稳定模型）':'失稳时不报告稳态指标'}</p>
 <div style={{display:'flex',gap:8,flexWrap:'wrap'}}><button style={button} onClick={()=>setP({...caseDefault,q:.1})}>低增益慢响应</button><button style={button} onClick={()=>setP({...caseDefault,q:8})}>标称高增益</button><button style={button} onClick={()=>setP({m:.7,k:8,q:8})}>高增益失稳角点</button><button style={button} onClick={()=>setP(caseDefault)}>恢复默认</button></div>
 <div ref={a} style={{width:'100%',height:300}}/><div ref={b} style={{width:'100%',height:300}}/>
 <p>时间0–60秒，RK4步长0.01秒、显示间隔0.04秒；位置/力轴−2至3，超界裁切。频率0.01–30rad/s、幅值0–8。失稳时频率图仅代数幅值，不是闭环H∞范数。有限窗峰值不等于连续峰值或全域保证；未含饱和、噪声、高阶模态和阻尼变化。</p>
 </section>;
}
