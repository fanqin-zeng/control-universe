"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from '@/components/wiki/use-echarts';
import {cubicPlane,pendulumPlane} from '@/lib/stability-analysis';
export function StabilityThirdOrderExplorer(){
 const [a2,setA2]=useState(3),[kp,setKp]=useState(12),[kd,setKd]=useState(2);
 const data=useMemo(()=>cubicPlane(a2),[a2]),pd=useMemo(()=>pendulumPlane(kp,kd),[kp,kd]);
 const leftOption=useMemo<EChartsOption>(()=>({animation:false,title:{text:'三阶严格稳定域',left:'center',textStyle:{fontSize:15}},tooltip:{trigger:'item'},grid:{left:45,right:20,bottom:45,top:48},xAxis:{type:'value',name:'a₁',min:0,max:10},yAxis:{type:'value',name:'a₀',min:0,max:10},series:[{name:'严格稳定网格点',type:'scatter',data:data.stable,symbolSize:3,itemStyle:{color:'#16a34a',opacity:.5}},{name:'a₀=a₂a₁（不含）',type:'line',data:data.boundary,symbol:'none',lineStyle:{color:'#dc2626',type:'dashed'}}]}),[data]);
 const rightOption=useMemo<EChartsOption>(()=>({animation:false,title:{text:'局部转矩摆PD稳定域',left:'center',textStyle:{fontSize:15}},tooltip:{trigger:'item'},grid:{left:45,right:20,bottom:45,top:48},xAxis:{type:'value',name:'K_d',min:0,max:10},yAxis:{type:'value',name:'K_p',min:0,max:20},series:[{name:'严格稳定网格点',type:'scatter',data:pd.stable,symbolSize:3,itemStyle:{color:'#16a34a',opacity:.5}},{name:'Kp=9.8（不含）',type:'line',data:[[0,9.8],[10,9.8]],symbol:'none',lineStyle:{color:'#dc2626',type:'dashed'}},{name:'当前参数',type:'scatter',data:[[kd,kp]],symbolSize:12,itemStyle:{color:'#2563eb'}}]}),[pd,kd,kp]);
 const left=useECharts(leftOption),right=useECharts(rightOption);
 return <section aria-label="稳定域探索" style={{border:'1px solid #cbd5e1',borderRadius:8,padding:12,margin:'20px 0',color:'#1e293b',minWidth:0}}>
 <p>三阶模型 s³+a₂s²+a₁s+a₀；a₂&gt;0，绿色点不含边界。</p>
 <label>a₂ <input aria-label="稳定域a2" type="range" min={.5} max={10} step={.5} value={a2} onChange={e=>setA2(+e.target.value)} style={{width:'60%'}}/> {a2.toFixed(1)}</label>
 <div ref={left} style={{height:300,width:'100%',minWidth:0}}/>
 <p>a₁=5 时：0&lt;a₀&lt;{data.atFive.toFixed(6)}；等号处有虚轴根，不严格稳定。</p>
 <p>转矩摆：J=1kg·m²，mgl=9.8N·m；τ=−Kpθ−Kdθ̇，零输入。角度仅在上平衡点附近线性化。</p>
 <label>Kp <input aria-label="稳定域Kp" type="range" min={0} max={20} step={.2} value={kp} onChange={e=>setKp(+e.target.value)} style={{width:'60%'}}/> {kp.toFixed(1)}</label><br/>
 <label>Kd <input aria-label="稳定域Kd" type="range" min={0} max={10} step={.2} value={kd} onChange={e=>setKd(+e.target.value)} style={{width:'60%'}}/> {kd.toFixed(1)}</label>
 <div ref={right} style={{height:300,width:'100%',minWidth:0}}/>
 <p>{pd.status}；极点 {pd.poles.map(([r,i])=>`${r.toFixed(6)}${i<0?'':'+'}${i.toFixed(6)}j`).join('，')}。范围为Kp&gt;9.8且Kd&gt;0。</p>
 <button onClick={()=>{setA2(3);setKp(12);setKd(2);}}>恢复稳定域默认值</button>
 </section>;
}
