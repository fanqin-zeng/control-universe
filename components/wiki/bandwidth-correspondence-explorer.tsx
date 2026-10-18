"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from '@/components/wiki/use-echarts';
import {secondCurve,bandwidthExample} from '@/lib/frequency-domain';
export function BandwidthCorrespondenceExplorer(){
 const [wn,setWn]=useState(8);const data=useMemo(()=>secondCurve(.5,wn),[wn]),m=useMemo(()=>bandwidthExample(wn),[wn]);
 const option=useMemo<EChartsOption>(()=>({animation:false,grid:[{left:46,right:20,top:35,height:155},{left:46,right:20,top:270,height:155}],xAxis:[{type:'log',min:.01,max:1000,gridIndex:0,name:'ω(rad/s)',nameLocation:'middle',nameGap:25},{type:'value',min:0,max:3,gridIndex:1,name:'t(s)',nameLocation:'middle',nameGap:25}],yAxis:[{type:'value',min:-90,max:5,name:'幅值(dB)',gridIndex:0},{type:'value',min:0,max:1.2,name:'y(t)',gridIndex:1}],series:[{type:'line',data:data.map(d=>[d.w,d.db]),showSymbol:false,lineStyle:{color:'#2563eb'},xAxisIndex:0,yAxisIndex:0,markLine:{silent:true,label:{show:false},data:[{xAxis:m.bandwidth}],lineStyle:{color:'#dc2626',type:'dashed'}}},{type:'line',data:m.steps,showSymbol:false,lineStyle:{color:'#2563eb'},xAxisIndex:1,yAxisIndex:1}]}),[data,m]);const chart=useECharts(option);
 return <section aria-label="带宽时域探索" style={{border:'1px solid #cbd5e1',borderRadius:8,padding:12,margin:'20px 0',color:'#1e293b',minWidth:0}}><p>固定ζ=.5，无零点单位增益标准二阶；零初值单位阶跃。上升时间按首次10%→90%，红线为精确半功率带宽。</p><label>ωn <input aria-label="带宽自然频率" type="range" min={2} max={50} step={1} value={wn} onChange={e=>setWn(+e.target.value)} style={{width:'60%'}}/> {wn.toFixed(0)}rad/s</label><div ref={chart} style={{height:475,width:'100%'}}/><p>ωB={m.bandwidth.toFixed(6)}rad/s；tr={m.tr.toFixed(6)}s；tr·ωB={m.product.toFixed(6)}；连续超调={m.mp.toFixed(6)}%。图只显示0…3s，末样不当极限。</p><button onClick={()=>setWn(8)}>恢复带宽默认值</button></section>;
}
