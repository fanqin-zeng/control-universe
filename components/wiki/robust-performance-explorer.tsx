"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from '@/components/wiki/use-echarts';
import {performancePoint,weightEnvelope} from '@/lib/robust-performance';
export function RobustPerformanceExplorer(){
 const [k,setK]=useState(10),[delta,setDelta]=useState(-1),[wb,setWb]=useState(2);
 const p=performancePoint(k,delta,wb);
 const left=useMemo<EChartsOption>(()=>({animation:false,title:{text:'同一闭环的DC误差',left:'center',textStyle:{fontSize:14}},tooltip:{trigger:'axis'},grid:{left:48,right:16,top:50,bottom:45},xAxis:{type:'value',min:-1,max:1,name:'δ'},yAxis:{type:'value',min:0,max:.3},series:[{type:'line',symbol:'none',data:Array.from({length:101},(_,i)=>{const d=-1+i*.02;return [d,performancePoint(k,d,wb).actual];}),markLine:{silent:true,symbol:'none',data:[{yAxis:.1}]}},{type:'scatter',symbolSize:10,data:[[delta,p.actual]]}]}),[k,delta,wb,p.actual]);
 const right=useMemo<EChartsOption>(()=>({animation:false,title:{text:'权重给出的误差包络',left:'center',textStyle:{fontSize:14}},tooltip:{trigger:'axis'},grid:{left:48,right:16,top:50,bottom:45},xAxis:{type:'log',min:.001,max:100,name:'rad/s'},yAxis:{type:'value',min:0,max:2.1},series:[{type:'line',symbol:'none',data:Array.from({length:201},(_,i)=>{const w=10**(-3+i*.025);return [w,weightEnvelope(w,wb)];}),markLine:{silent:true,symbol:'none',data:[{yAxis:1},{xAxis:wb}]}},{type:'scatter',symbolSize:10,data:[[wb,1/p.weightAtWb]]}]}),[wb,p.weightAtWb]);
 const l=useECharts(left),r=useECharts(right);const button={padding:'7px 10px',border:'1px solid #64748b',borderRadius:6,background:'#f8fafc',color:'#0f172a',cursor:'pointer'};
 return <section aria-label="鲁棒性能实验" style={{border:'1px solid #94a3b8',borderRadius:10,padding:14,minWidth:0,maxWidth:'100%'}}>
 <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
 <label style={{display:'grid',gap:5}}>增益k={k}<input aria-label="增益 k" type="range" min={5} max={25} step={1} value={k} onChange={e=>setK(Number(e.target.value))} style={{width:170,maxWidth:'100%'}}/></label>
 <label style={{display:'grid',gap:5}}>归一化静态δ={delta.toFixed(2)}<input aria-label="归一化静态 δ" type="range" min={-1} max={1} step={.05} value={delta} onChange={e=>setDelta(Number(e.target.value))} style={{width:170,maxWidth:'100%'}}/></label>
 <label style={{display:'grid',gap:5}}>权重参数ωb={wb.toFixed(1)}<input aria-label="权重参数 ωb" type="range" min={.5} max={5} step={.5} value={wb} onChange={e=>setWb(Number(e.target.value))} style={{width:170,maxWidth:'100%'}}/></label>
 </div><div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:14}}>
 <button style={button} onClick={()=>setK(9)}>标称边界9</button><button style={button} onClick={()=>setK(18)}>鲁棒DC边界18</button><button style={button} onClick={()=>setK(19)}>增益19</button><button style={button} onClick={()=>{setK(10);setDelta(-1);setWb(2);}}>恢复性能默认</button></div>
 <p data-testid="performance-readings" style={{overflowWrap:'anywhere'}}>标称DC={p.nominal.toFixed(6)}；当前DC={p.actual.toFixed(6)}；最坏DC={p.worst.toFixed(6)}；当前极点={p.pole.toFixed(6)}；RS小增益={p.rs.toFixed(6)}；权重在ωb处模={p.weightAtWb.toFixed(6)}；权重单位交越={p.unity.toFixed(6)} rad/s</p>
 <p data-testid="performance-status">标称DC严格达标：{p.nominalDC?'是':'否'}；鲁棒DC严格达标：{p.robustDC?'是':'否'}。等于0.1不算通过。当前模型在这些增益下均稳定。</p>
 <div style={{display:'flex',flexWrap:'wrap',gap:12}}><div ref={l} style={{height:300,flex:'1 1 280px',minWidth:0}}/><div ref={r} style={{height:300,flex:'1 1 280px',minWidth:0}}/></div>
 <p style={{fontSize:13}}>左图只检验题2的DC指标，δ取固定实数；动态不确定性的鲁棒稳定条件另见正文。右图是题3的1/|Wp|设计包络，A=0.01、M=2；拖ωb没有改变左图对象或实际闭环带宽，也没有完成控制器综合。两图不比较高低。</p>
 </section>;
}
