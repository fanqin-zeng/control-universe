"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from '@/components/wiki/use-echarts';
import {secondCurve,secondMetrics} from '@/lib/frequency-domain';
export function BodeZetaExplorer(){
 const [z,setZ]=useState(.5);const data=useMemo(()=>secondCurve(z,8),[z]),m=useMemo(()=>secondMetrics(z,8),[z]);
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},grid:[{left:46,right:20,top:35,height:155},{left:46,right:20,top:270,height:155}],xAxis:[{type:'log',min:.01,max:1000,gridIndex:0},{type:'log',min:.01,max:1000,gridIndex:1,name:'ω(rad/s)',nameLocation:'middle',nameGap:25}],yAxis:[{type:'value',min:-90,max:22,name:'幅值(dB)',gridIndex:0},{type:'value',min:-180,max:0,name:'相位(度)',gridIndex:1}],series:[{type:'line',data:data.map(d=>[d.w,d.db]),showSymbol:false,lineStyle:{color:'#2563eb'},xAxisIndex:0,yAxisIndex:0},{type:'line',data:data.map(d=>[d.w,d.phase]),showSymbol:false,lineStyle:{color:'#2563eb'},xAxisIndex:1,yAxisIndex:1}]}),[data]);const chart=useECharts(option);
 return <section aria-label="二阶Bode探索" style={{border:'1px solid #cbd5e1',borderRadius:8,padding:12,margin:'20px 0',color:'#1e293b',minWidth:0}}><p>H=64/(s²+16ζs+64)，单位直流增益；ωn=8rad/s。这是H的幅相，不是任意回路的裕度。</p><label>ζ <input aria-label="Bode阻尼比" type="range" min={.05} max={2} step={.05} value={z} onChange={e=>setZ(+e.target.value)} style={{width:'65%'}}/> {z.toFixed(2)}</label><div ref={chart} style={{height:475,width:'100%'}}/><p>H(j8)幅比={(1/(2*z)).toFixed(6)}、相位−90°；半功率带宽={m.bandwidth.toFixed(6)}rad/s；峰频={m.wr.toFixed(6)}rad/s、峰值={m.mrDb.toFixed(6)}dB（无正频峰时取直流峰）。</p><button onClick={()=>setZ(.5)}>恢复Bode默认值</button></section>;
}
