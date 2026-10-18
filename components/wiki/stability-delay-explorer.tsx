"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from '@/components/wiki/use-echarts';
import {delayCurves,delayStatus} from '@/lib/stability-analysis';
export function StabilityDelayExplorer(){
 const[k,setK]=useState(5),[l,setL]=useState(.46);
 const data=useMemo(()=>delayStatus(k,l),[k,l]),curves=useMemo(()=>delayCurves(),[]);
 const option=useMemo<EChartsOption>(()=>({animation:false,title:{text:'精确与近似时滞边界',left:'center',top:0,textStyle:{fontSize:14}},legend:{top:30,data:['精确模型','一阶Padé'],textStyle:{fontSize:11}},tooltip:{trigger:'axis'},grid:{left:45,right:25,bottom:45,top:78},xAxis:{type:'value',name:'K',min:.5,max:15},yAxis:{type:'value',name:'时滞(s)',min:0,max:8},series:[{name:'精确模型',type:'line',data:curves.map(d=>[d.k,d.exact]),symbol:'none',itemStyle:{color:'#2563eb'},lineStyle:{color:'#2563eb'}},{name:'一阶Padé',type:'line',data:curves.map(d=>[d.k,d.pade]),symbol:'none',itemStyle:{color:'#dc2626'},lineStyle:{color:'#dc2626',type:'dashed'}},{name:'所选时滞',type:'line',data:[[.5,l],[15,l]],symbol:'none',lineStyle:{color:'#64748b',type:'dotted'}},{name:'当前(K,L)',type:'scatter',data:[[k,l]],symbolSize:12,itemStyle:{color:'#111827'}}]}),[curves,k,l]);
 const chart=useECharts(option);
 return <section aria-label="时滞稳定性探索" style={{border:'1px solid #cbd5e1',borderRadius:8,padding:12,margin:'20px 0',color:'#1e293b',minWidth:0}}>
 <p>单位负反馈 G=Ke⁻ᴸˢ/[s(s+2)]；两条曲线是严格稳定区间的上确界，边界不可取。</p>
 <label>K <input aria-label="时滞增益K" type="range" min={.5} max={15} step={.5} value={k} onChange={e=>setK(+e.target.value)} style={{width:'60%'}}/> {k.toFixed(1)}</label><br/>
 <label>L(s) <input aria-label="时滞L" type="range" min={0} max={3} step={.01} value={l} onChange={e=>setL(+e.target.value)} style={{width:'60%'}}/> {l.toFixed(2)}</label>
 <div ref={chart} style={{height:330,width:'100%',minWidth:0}}/>
 <p>ω*={data.omega.toFixed(6)}rad/s；精确临界L*={data.exact.toFixed(6)}s；Padé临界Lₚ₁={data.pade.toFixed(6)}s。</p>
 <p>K={k.toFixed(1)}、L={l.toFixed(2)}s：精确模型{data.exactStatus}；一阶Padé{data.padeStatus}。</p>
 <p>图窗固定K=.5…15、L=0…8s；滑块时滞上限3s不代表稳定边界。此结论只适用于这里的模型。</p>
 <button onClick={()=>{setK(5);setL(.46);}}>恢复时滞默认值</button>
 </section>;
}
