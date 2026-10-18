"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {juryStability} from '@/lib/jury-stability';
export function JuryStabilityExplorer(){
 const [a1,setA1]=useState(-1.5),[a2,setA2]=useState(.7);
 const r=useMemo(()=>juryStability(a1,a2),[a1,a2]);
 const option=useMemo<EChartsOption>(()=>({animation:false,grid:{left:45,right:30,top:30,bottom:45},tooltip:{trigger:'item'},xAxis:{type:'value',min:-2.5,max:2.5,name:'Re(z)'},yAxis:{type:'value',min:-2.5,max:2.5,name:'Im(z)'},series:[{type:'line',data:Array.from({length:161},(_,i)=>[Math.cos(i*Math.PI/80),Math.sin(i*Math.PI/80)]),showSymbol:false,lineStyle:{type:'dashed',color:'#64748b'}},{type:'scatter',data:r.roots,symbolSize:12,itemStyle:{color:r.strict?'#047857':'#b91c1c'}}]}),[r]);
 const ref=useECharts(option);
 const preset=(x:number,y:number)=>{setA1(x);setA2(y);};
 return <section className="not-prose" aria-label="二阶Jury稳定性" style={{border:'1px solid #cbd5e1',borderRadius:10,padding:14,margin:'20px 0',color:'#172033'}}>
  <strong>两个旧输出一起决定下一步，会衰减吗？</strong>
  <p>y[k+2] = −a₁y[k+1] − a₂y[k]；下方检查严格稳定，边界需另查。</p>
  <label style={{display:'block'}}>a₁：{a1.toFixed(2)}<input aria-label="一次项系数" type="range" min={-3} max={3} step={.05} value={a1} onChange={e=>setA1(+e.target.value)} style={{display:'block',width:'100%'}}/></label>
  <label style={{display:'block'}}>a₂：{a2.toFixed(2)}<input aria-label="常数项系数" type="range" min={-1.5} max={1.5} step={.05} value={a2} onChange={e=>setA2(+e.target.value)} style={{display:'block',width:'100%'}}/></label>
  <div style={{display:'flex',flexWrap:'wrap',gap:8,margin:'12px 0'}}>{[['正单位根',-1.5,.5],['重单位根',-2,1],['不稳定例',-2.1,.9],['恢复默认',-1.5,.7]].map(([name,x,y])=><button key={name} onClick={()=>preset(+x,+y)} style={{padding:8,border:'1px solid #cbd5e1',borderRadius:6,background:'#f8fafc',color:'#172033'}}>{name}</button>)}</div>
  <p aria-live="polite">P(1)={r.conditions[0].toFixed(6)}；P(−1)={r.conditions[1].toFixed(6)}；1−|a₂|={r.conditions[2].toFixed(6)}。最大根模 {r.radius.toFixed(6)}。{r.strict?'严格圆内，零输入渐近稳定。':r.onBoundary?'根在单位圆边界，不能判为严格稳定。':'不满足严格稳定条件。'}</p>
  <div ref={ref} style={{width:'100%',maxWidth:360,aspectRatio:'1',margin:'0 auto'}}/>
  <p>根：{r.roots.map(([re,im])=>`${re.toFixed(6)}${im<0?' − ':' + '}${Math.abs(im).toFixed(6)}j`).join('；')}。初值 y[0]=1、y[1]=0 时，y[5]={r.samples[5][1].toFixed(6)}，y[50]={r.samples[50][1].toFixed(6)}；有限的两项读数不能代替稳定性证明。</p>
 </section>;
}
