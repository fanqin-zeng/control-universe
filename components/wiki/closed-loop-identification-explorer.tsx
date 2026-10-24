"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {closedLoopMoments,closedLoopCurve,type ClosedLoopInstrument} from '@/lib/closed-loop-identification';
export function ClosedLoopIdentificationExplorer(){
 const [feedback,setFeedback]=useState(.5),[color,setColor]=useState(.5),[amplitude,setAmplitude]=useState(.5),[instrument,setInstrument]=useState<ClosedLoopInstrument>('reference');
 const moments=useMemo(()=>closedLoopMoments(feedback,color,amplitude,instrument),[feedback,color,amplitude,instrument]);
 const curve=useMemo(()=>closedLoopCurve(feedback,amplitude,instrument),[feedback,amplitude,instrument]);
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{top:0,data:['LS目标','工具比值','真实 b']},grid:{left:46,right:18,top:68,bottom:45},xAxis:{type:'value',min:0,max:.8,interval:.2,name:'扰动系数 ρ',nameLocation:'middle',nameGap:27},yAxis:{type:'value',min:-1.5,max:1.5,interval:.5,name:'总体增益目标'},series:[{name:'LS目标',type:'line',showSymbol:false,data:curve.map(r=>[r.rho,r.lsTarget]),markLine:{silent:true,symbol:'none',label:{show:false},data:[{xAxis:color}]}},{name:'工具比值',type:'line',showSymbol:false,data:curve.map(r=>[r.rho,r.ivTarget])},{name:'真实 b',type:'line',showSymbol:false,lineStyle:{type:'dashed'},data:[[0,.8],[.8,.8]]}]}),[curve,color]);
 const momentOption=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},grid:{left:46,right:18,top:35,bottom:40},xAxis:{type:'category',min:0,max:2,data:['E[u v]','E[z v]','E[z u]']},yAxis:{type:'value',min:-1,max:3,interval:1,name:'归一化总体矩'},series:[{type:'bar',data:[moments.covarianceUV,moments.momentZV,moments.momentZU]}]}),[moments]);
 const chart=useECharts(option),bar=useECharts(momentOption),fmt=(v:number|null)=>v===null?'未定义':v.toFixed(6);
 const preset=(f:number,rho:number,a:number,z:ClosedLoopInstrument)=>{setFeedback(f);setColor(rho);setAmplitude(a);setInstrument(z);};
 return <section aria-label="闭环辨识总体矩实验" style={{margin:'24px 0',padding:16,border:'1px solid #94a3b8',borderRadius:12,background:'#f8fafc',color:'#0f172a'}}>
  <p style={{marginTop:0}}>解析总体矩，非随机抽样曲线。固定 b=0.8、创新标准差0.5；r为独立输入端注入，虚线定位当前ρ。</p>
  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{[['有色闭环',.5,.5,.5,'reference'],['开环',0,.5,.5,'reference'],['白创新',.5,0,.5,'reference'],['无外部注入',.5,.5,0,'reference'],['拿输入作工具',.5,.5,.5,'input']].map(([name,f,rho,a,z])=><button key={name} type="button" onClick={()=>preset(f as number,rho as number,a as number,z as ClosedLoopInstrument)} style={{padding:'7px 9px',border:'1px solid #64748b',borderRadius:6,background:'white',color:'#0f172a'}}>{name}</button>)}<button type="button" onClick={()=>preset(.5,.5,.5,'reference')} style={{padding:'7px 9px',border:'1px solid #64748b',borderRadius:6,background:'white'}}>恢复默认</button></div>
  <div style={{display:'flex',gap:14,flexWrap:'wrap',marginTop:14}}>
   <label style={{display:'grid',gap:4}}>扰动系数 ρ={color.toFixed(1)}<input aria-label="扰动系数" type="range" min={0} max={.8} step={.1} value={color} onChange={e=>setColor(Number(e.target.value))}/></label>
   <label style={{display:'grid',gap:4}}>反馈系数 f<select aria-label="反馈系数" value={feedback} onChange={e=>setFeedback(Number(e.target.value))}>{[0,.5,.8].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
   <label style={{display:'grid',gap:4}}>注入幅值 A<select aria-label="注入幅值" value={amplitude} onChange={e=>setAmplitude(Number(e.target.value))}>{[0,.5,1].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
   <label style={{display:'grid',gap:4}}>工具选择<select aria-label="工具选择" value={instrument} onChange={e=>setInstrument(e.target.value as ClosedLoopInstrument)}><option value="reference">外部注入 r</option><option value="input">实际输入 u</option></select></label>
  </div>
  <p data-closed-loop-readout="true" aria-live="polite">LS目标={fmt(moments.lsTarget)}；工具比值={fmt(moments.ivTarget)}；E[zv]={fmt(moments.momentZV)}。{moments.admissible?'本模型的两个工具条件成立。':moments.momentZU<=1e-14?'工具相关矩为零，拒绝求比值。':'工具与扰动相关，比值不是真参数的一致估计。'}</p>
  <div ref={chart} style={{width:'100%',height:300}}/><div ref={bar} style={{width:'100%',height:240}}/>
  <p style={{fontSize:14,marginBottom:0}}>曲线横轴扫描ρ，调ρ改变竖线和下方矩；零相关矩保留，未定义值不绘制。工具有效性来自本模型假设，不能用样本相关接近零替代证明。</p>
 </section>;
}
