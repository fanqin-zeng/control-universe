"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {delayDefault,delayReadings,delayFrequency,delayTrace} from '@/lib/delay-robust-control';
export function DelayRobustControlExplorer(){
 const [p,setP]=useState(delayDefault),r=useMemo(()=>delayReadings(p),[p]),trace=useMemo(()=>delayTrace(p),[p]);
 const timeOption=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{data:['历史DDE数值解','一阶Padé数值解'],top:0},grid:{top:48,left:52,right:20,bottom:52},xAxis:{type:'value',min:0,max:12,name:'时间 (s)',nameLocation:'middle',nameGap:30},yAxis:{type:'value',min:-4,max:4,name:'状态 x'},series:['历史DDE数值解','一阶Padé数值解'].map((name,j)=>({name,type:'line',showSymbol:false,data:trace.time.map((t,i)=>[t,j?trace.pade[i]:trace.x[i]])}))}),[trace]);
 const frequencyOption=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{data:['实际延迟误差乘积','保守包络乘积'],top:0},grid:{top:48,left:52,right:20,bottom:52},xAxis:{type:'value',min:0,max:8,name:'ω (rad/s)',nameLocation:'middle',nameGap:30},yAxis:{type:'value',min:0,max:2,name:'名义回传幅值'},series:['实际延迟误差乘积','保守包络乘积'].map((name,j)=>({name,type:'line',showSymbol:false,data:Array.from({length:401},(_,i)=>{const w=i/50,v=delayFrequency(p,w);return[w,j?v.upper:v.actual];})}))}),[p]);
 const timeRef=useECharts(timeOption),frequencyRef=useECharts(frequencyOption),f=(v:number|null)=>v===null?'∞':v.toFixed(6);
 const button={padding:'7px 10px',border:'1px solid #64748b',borderRadius:6,background:'transparent',cursor:'pointer'};
 return <section aria-label="时滞鲁棒实验" style={{border:'1px solid #64748b',borderRadius:12,padding:16,margin:'24px 0',minWidth:0}}>
  <p style={{marginTop:0}}><strong>同一历史，三种判断</strong>：a&gt;0、k≥0，历史φ=1，无外扰。精确判据负责稳定性，曲线只展示有限窗口的数值响应。</p>
  <div style={{display:'flex',gap:14,flexWrap:'wrap'}}>{([['自然衰减 a','a',.5,2,.05],['反馈增益 k','k',0,4,.05],['时滞 τ','tau',0,2.5,.02]] as const).map(([label,key,min,max,step])=><label key={key} style={{display:'grid',gap:4,flex:'1 1 180px',minWidth:0}}>{label}={p[key].toFixed(6)}<input aria-label={label} type="range" min={min} max={Math.max(max,p[key])} step={key==='tau'?'any':step} value={p[key]} onChange={e=>{const value=+e.target.value;setP({...p,[key]:key==='tau'&&value>0?Math.max(.02,value):value});}} style={{width:'100%'}}/></label>)}</div>
  <p data-testid="delay-status">精确常时滞判据：{r.state==='stable'?'渐近稳定':r.state==='critical'?'临界，不渐近稳定':'失稳'}；小增益：{r.certified?'有严格证书':'证书未通过，不能单凭此判失稳'}；Padé：{r.padeAlpha < -1e-10?'近似根稳定':Math.abs(r.padeAlpha)<=1e-10?'近似根临界':'近似根失稳'}。</p>
  <p data-testid="delay-readings" style={{overflowWrap:'anywhere',fontVariantNumeric:'tabular-nums'}}>精确时滞裕度={f(r.exactMargin)}；小增益严格界={f(r.sgMargin)}；Padé近似界={f(r.padeMargin)}；包络全频峰={f(r.sgPeak)}；Padé最右实部={f(r.padeAlpha)}；Halanay速率={r.halanayRate===null?'条件不满足':f(r.halanayRate)}</p>
  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}><button style={button} onClick={()=>setP({...delayDefault,tau:1})}>证书保守工况</button><button style={button} onClick={()=>setP({...delayDefault,tau:1.5})}>Padé假稳定</button><button style={button} onClick={()=>setP({...delayDefault,tau:delayReadings(delayDefault).exactMargin!})}>精确边界</button><button style={button} onClick={()=>setP({a:1,k:.5,tau:1})}>时滞无关工况</button><button style={button} onClick={()=>setP({...p,tau:0})}>零时滞</button><button style={button} onClick={()=>setP(delayDefault)}>恢复默认</button></div>
  <div ref={timeRef} style={{width:'100%',height:300}}/><div ref={frequencyRef} style={{width:'100%',height:300}}/>
  <p>交互时滞为0或至少0.02秒。时间窗0–12秒、状态轴−4到4；频率轴0–8rad/s、幅值0–2，越界曲线裁切。DDE用RK4与历史插值，步长≤0.005秒且≤τ/4；不是Padé替代的“真实解”。频域图是稳定名义回传T乘延迟误差，不是失稳闭环的H∞范数。∞表示每个有限常时滞均可，而非无界时滞集合的一致衰减率。</p>
 </section>;
}
