"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from '@/components/wiki/use-echarts';
import {secondCurve,secondFrequency} from '@/lib/frequency-domain';
export function NyquistZetaExplorer(){
 const [z,setZ]=useState(.5);const data=useMemo(()=>secondCurve(z,8),[z]),point=useMemo(()=>secondFrequency(z,8,8),[z]);
 const option=useMemo<EChartsOption>(()=>({animation:false,grid:{left:'15%',top:'10%',width:'75%',height:'75%'},tooltip:{trigger:'item'},xAxis:{type:'value',min:-12,max:12,name:'Re',nameLocation:'middle',nameGap:27},yAxis:{type:'value',min:-12,max:12,name:'Im'},series:[{name:'正频率',type:'line',data:[{value:[1,0]},...data.map(d=>({value:[d.re,d.im]}))],showSymbol:false,lineStyle:{color:'#2563eb'}},{name:'负频率',type:'line',data:data.map(d=>[d.re,-d.im]),showSymbol:false,lineStyle:{color:'#94a3b8',type:'dashed'}},{name:'单位圆',type:'line',data:Array.from({length:201},(_,i)=>[Math.cos(i*Math.PI/100),Math.sin(i*Math.PI/100)]),showSymbol:false,lineStyle:{color:'#64748b',type:'dotted'}},{name:'临界点',type:'scatter',data:[[-1,0]],symbolSize:9,itemStyle:{color:'#dc2626'}},{name:'ω=8',type:'scatter',data:[[point.re,point.im]],symbolSize:9,itemStyle:{color:'#111827'}}]}),[data,point]);const chart=useECharts(option);
 return <section aria-label="二阶Nyquist探索" style={{border:'1px solid #cbd5e1',borderRadius:8,padding:12,margin:'20px 0',color:'#1e293b',minWidth:0}}><p>同一个标准二阶H；蓝实线为ω增加的正频支，灰虚线为共轭支。红点−1，黑点ω=8，单位圆中心在原点。这里只画有限频段及直流端点，不代替完整围线计数。</p><label>ζ <input aria-label="Nyquist阻尼比" type="range" min={.05} max={2} step={.05} value={z} onChange={e=>setZ(+e.target.value)} style={{width:'65%'}}/> {z.toFixed(2)}</label><div ref={chart} style={{aspectRatio:'1',width:'100%'}}/><p>H(j8)= {point.re.toFixed(6)} {point.im.toFixed(6)}j；正频支从(1,0)出发趋于(0,0)。固定等比例方窗Re/Im均−12…12。</p><button onClick={()=>setZ(.5)}>恢复Nyquist默认值</button></section>;
}
