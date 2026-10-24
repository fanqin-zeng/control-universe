"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from '@/components/wiki/use-echarts';
import {mixedDefault,mixedFrequency,mixedReadings,type MixedParameters} from '@/lib/mixed-sensitivity';
export function MixedSensitivityExplorer(){
 const [p,setP]=useState<MixedParameters>({...mixedDefault}),r=useMemo(()=>mixedReadings(p),[p]);
 const points=useMemo(()=>Array.from({length:321},(_,i)=>{const w=10**(-4+8*i/320);return {w,...mixedFrequency(p,w)};}),[p]);
 const left=useMemo<EChartsOption>(()=>({animation:false,title:{text:'S与候选包络',left:'center',top:0,textStyle:{fontSize:14}},tooltip:{trigger:'axis'},legend:{data:['S','1/W1'],top:32},grid:{left:48,right:24,top:76,bottom:52},xAxis:{type:'log',min:.0001,max:10000,name:'rad/s',nameLocation:'middle',nameGap:28,axisLine:{onZero:false},axisLabel:{hideOverlap:true,formatter:(v:number)=>{const e=Math.round(Math.log10(v));return Math.abs(Math.log10(v)-e)<.0001&&e%2===0?'10^'+e:'';}}},yAxis:{type:'value',min:-100,max:20,name:'dB'},series:['S','bound'].map((key,i)=>({name:i?'1/W1':'S',type:'line',symbol:'none',data:points.map(x=>[x.w,20*Math.log10(x[key as 'S'|'bound'])])}))}),[points]);
 const right=useMemo<EChartsOption>(()=>({animation:false,title:{text:'同频率三个通道合成',left:'center',top:0,textStyle:{fontSize:14}},tooltip:{trigger:'axis'},grid:{left:48,right:24,top:52,bottom:52},xAxis:{type:'log',min:.0001,max:10000,name:'rad/s',nameLocation:'middle',nameGap:28,axisLine:{onZero:false},axisLabel:{hideOverlap:true,formatter:(v:number)=>{const e=Math.round(Math.log10(v));return Math.abs(Math.log10(v)-e)<.0001&&e%2===0?'10^'+e:'';}}},yAxis:{type:'value',min:-30,max:40,name:'dB'},series:[{type:'line',symbol:'none',data:points.map(x=>[x.w,20*Math.log10(x.stack)]),markLine:{silent:true,symbol:'none',data:[{yAxis:0}]}}]}),[points]);
 const l=useECharts(left),rr=useECharts(right),button={padding:'7px 10px',border:'1px solid #64748b',background:'#f8fafc',color:'#0f172a',borderRadius:6,cursor:'pointer'};
 const controls:[keyof MixedParameters,string,number,number,number][]=[['a','阻尼参数 a',5,60,1],['k','增益参数 k',20,900,10],['rho','控制权重 rho',.01,.2,.01],['wb','性能权重 wb',.5,10,.5]];
 return <section aria-label="混合灵敏度权衡实验" style={{border:'1px solid #94a3b8',borderRadius:10,padding:14,minWidth:0,maxWidth:'100%'}}>
 <div style={{display:'flex',flexWrap:'wrap',gap:14}}>{controls.map(([key,label,min,max,step])=><label key={key} style={{display:'grid',gap:5}}>{label}={p[key]}<input aria-label={label} type="range" min={min} max={max} step={step} value={p[key]} onChange={e=>setP({...p,[key]:Number(e.target.value)})} style={{width:165,maxWidth:'100%'}}/></label>)}</div>
 <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}><button style={button} onClick={()=>setP({...mixedDefault,k:100})}>较慢候选</button><button style={button} onClick={()=>setP({...mixedDefault,a:30,k:450})}>较快候选</button><button style={button} onClick={()=>setP({...mixedDefault,rho:.2})}>加重控制代价</button><button style={button} onClick={()=>setP({...mixedDefault})}>恢复默认</button></div>
 <p data-testid="mixed-readings" style={{overflowWrap:'anywhere'}}>4001点峰Ms={r.scanPeak.toFixed(6)}；含端点的采样γ={r.gamma.toFixed(6)}；精确|T(j10)|={r.T10.toFixed(6)}；稳态误差={r.DC.toFixed(6)}；单位阶跃u(0+)={r.initialControl.toFixed(6)}</p>
 <p data-testid="mixed-status">{r.stable?'名义闭环内部稳定':'参数不在声明稳定域'}；{r.gamma<1?'当前采样加权栈小于1':'当前采样加权栈未小于1'}。</p>
 <div style={{display:'flex',flexWrap:'wrap',gap:12}}><div ref={l} style={{height:330,flex:'1 1 280px',minWidth:0}}/><div ref={rr} style={{height:330,flex:'1 1 280px',minWidth:0}}/></div>
 <p style={{fontSize:13}}>仅控制器族K=(s²+s+100)k/[100s(s+a)]和名义G=100/(s²+s+100)。改变权重不会自动重新综合K。扫描范围10⁻⁴–10⁴rad/s；读数另纳入0与无穷端，曲线抽稀321点。采样通过不替代连续全频证书；Notebook另查驻点。控制权重限制L2增益，不能直接保证执行器峰值或饱和。坐标固定。</p>
 </section>;
}
