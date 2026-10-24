"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {predictionModel} from '@/lib/prediction-model';

export function PredictionModelExplorer(){
  const [a,setA]=useState(.5),[h,setH]=useState(1),[m,setM]=useState(8);
  const r=useMemo(()=>predictionModel(a,h,m),[a,h,m]);
  const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{data:['状态空间 / CARIMA','截断阶跃模型','自由响应']},grid:{left:42,right:16,top:68,bottom:35},xAxis:{type:'value',min:0,max:4,interval:1,name:'未来步'},yAxis:{type:'value',min:0,max:2,name:'输出'},series:[{name:'状态空间 / CARIMA',type:'line',data:[r.current,...r.direct].map((v,i)=>[i,v])},{name:'截断阶跃模型',type:'line',lineStyle:{type:'dashed'},data:[r.current,...r.dmc].map((v,i)=>[i,v])},{name:'自由响应',type:'line',data:[r.current,...r.free].map((v,i)=>[i,v])}]}),[r]);
  const ref=useECharts(option);
  return <section aria-label="预测模型实验" style={{padding:16,border:'1px solid var(--border)',borderRadius:10,margin:'24px 0'}}>
    <strong>同一段输入历史，能否预测出同一条曲线？</strong>
    <p>无量纲水箱：b=1−a，上一时刻水位1、阀门输入0.5；当前水位由模型得到。未来输入增量为 [h, 0, −h/2]，第四步保持阀门。M之后阶跃响应按末值延拓。</p>
    {[{name:'模型极点 a',value:a,set:setA,min:.2,max:.9,step:.1},{name:'未来增量 h',value:h,set:setH,min:0,max:1,step:.25},{name:'阶跃截断长度 M',value:m,set:setM,min:2,max:12,step:1}].map(p=><label key={p.name} style={{display:'block',margin:'12px 0'}}>{p.name}：{p.value}<input aria-label={p.name} type="range" min={p.min} max={p.max} step={p.step} value={p.value} onChange={e=>p.set(Number(e.target.value))} style={{width:'100%'}}/></label>)}
    <button onClick={()=>{setA(.5);setH(1);setM(8);}} style={{padding:8}}>恢复默认</button>
    <p data-testid="prediction-readout">预测 = [{r.direct.map(v=>v.toFixed(6)).join(', ')}]；阶跃截断最大误差 = {r.error.toFixed(6)}</p>
    <p>自由响应 = [{r.free.map(v=>v.toFixed(6)).join(', ')}]。误差是本次四步预测的截断误差，不是闭环鲁棒性指标。</p>
    <div ref={ref} style={{width:'100%',height:340}}/>
  </section>;
}
