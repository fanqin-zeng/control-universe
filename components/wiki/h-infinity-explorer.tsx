"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from '@/components/wiki/use-echarts';
import {hInfinityDefault,hInfinityFrequency,hInfinityReadings,type LoopParameters} from '@/lib/h-infinity';
export function HInfinityExplorer(){
 const [p,setP]=useState<LoopParameters>({...hInfinityDefault});const r=useMemo(()=>hInfinityReadings(p),[p]);
 const points=useMemo(()=>Array.from({length:281},(_,i)=>{const w=10**(-1+3.5*i/280);return {w,...hInfinityFrequency(p,w)};}),[p]);
 const grid={left:48,right:30,top:50,bottom:42};
 const left=useMemo<EChartsOption>(()=>({animation:false,title:{text:'回路幅值与0dB门槛',left:'center',textStyle:{fontSize:14}},tooltip:{trigger:'axis'},grid,xAxis:{type:'log',min:.1,max:10**2.5,name:'rad/s'},yAxis:{type:'value',min:-80,max:90,name:'dB'},series:[{type:'line',symbol:'none',data:points.map(v=>[v.w,20*Math.log10(v.L)]),markLine:{silent:true,symbol:'none',data:[{yAxis:0}]}}]}),[points]);
 const right=useMemo<EChartsOption>(()=>({animation:false,title:{text:'灵敏度的频响采样',left:'center',textStyle:{fontSize:14}},legend:{data:['S','T'],top:25},tooltip:{trigger:'axis'},grid,xAxis:{type:'log',min:.1,max:10**2.5,name:'rad/s'},yAxis:{type:'value',min:-80,max:60,name:'dB'},series:[{name:'S',type:'line',symbol:'none',data:points.map(v=>[v.w,20*Math.log10(v.S)]),markLine:{silent:true,symbol:'none',data:[{yAxis:20*Math.log10(1.5)}]}},{name:'T',type:'line',symbol:'none',data:points.map(v=>[v.w,20*Math.log10(v.T)])}]}),[points]);
 const l=useECharts(left),rr=useECharts(right),button={padding:'7px 10px',background:'#f8fafc',color:'#0f172a',border:'1px solid #64748b',borderRadius:6,cursor:'pointer'};
 const controls:[keyof LoopParameters,string,number,number,number][]=[['gain','增益 K',1,30,1],['frequency','滤波中心频率',5,20,.5],['numeratorDamping','零点阻尼',.02,.5,.01],['denominatorDamping','极点阻尼',.02,1,.02],['lowpass','低通角频率',0,.3,.01]];
 return <section aria-label="H∞回路整形实验" style={{border:'1px solid #94a3b8',borderRadius:10,padding:14,minWidth:0,maxWidth:'100%'}}>
 <div style={{display:'flex',flexWrap:'wrap',gap:15}}>{controls.map(([key,name,min,max,step])=><label key={key} style={{display:'grid',gap:5}}>{name}={p[key].toFixed(2)}<input aria-label={name} type="range" min={min} max={max} step={step} value={p[key]} onChange={e=>setP({...p,[key]:Number(e.target.value)})} style={{width:165,maxWidth:'100%'}}/></label>)}</div>
 <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:14}}><button style={button} onClick={()=>setP({gain:20,frequency:10,numeratorDamping:.5,denominatorDamping:.02,lowpass:0})}>原稿参数</button><button style={button} onClick={()=>setP({gain:20,frequency:10,numeratorDamping:.02,denominatorDamping:.5,lowpass:0})}>仅交换阻尼</button><button style={button} onClick={()=>setP({...hInfinityDefault,lowpass:.2})}>低通加快到0.2</button><button style={button} onClick={()=>setP({...hInfinityDefault})}>恢复整形默认</button></div>
 <p data-testid="hinfinity-readings" style={{overflowWrap:'anywhere'}}>2001点频响峰={r.scanPeak.toFixed(6)}；精确|T(j10)|={r.T10.toFixed(6)}；代数S(0)={r.DC.toFixed(6)}；滤波器中心模比={r.notchRatio.toFixed(6)}</p>
 <p data-testid="hinfinity-status">{r.stable?'Routh：闭环严格稳定':r.unstable?'Routh：闭环不稳定':'Routh：临界或退化，需要进一步判定'}。{r.stable?'此时DC值可按终值条件解释为单位阶跃稳态误差。':'此时不宣称阶跃稳态存在，频响峰不叫H∞范数。'}</p>
 <div style={{display:'flex',gap:12,flexWrap:'wrap'}}><div ref={l} style={{height:310,flex:'1 1 280px',minWidth:0}}/><div ref={rr} style={{height:310,flex:'1 1 280px',minWidth:0}}/></div>
 <p style={{fontSize:13}}>读数采用0.1–316.23rad/s的2001点扫描；图线抽稀为281点，精确j10单独计算。低通值0表示不接低通；仅名义对象G=100/(s²+s+100)。默认候选以较低穿越频率换取名义性能，参数失配结果见Notebook；没有执行自动H∞综合。坐标范围固定。</p>
 </section>;
}
