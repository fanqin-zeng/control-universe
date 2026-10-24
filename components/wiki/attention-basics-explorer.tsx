"use client";
import {useMemo,useState} from 'react';import type {EChartsOption} from 'echarts';import {useECharts} from './use-echarts';import {attentionExperiment,temperatures,deltas} from '@/lib/attention-basics';
export function AttentionBasicsExplorer(){
 const [temperature,setTemperature]=useState(1),[delta,setDelta]=useState(0),[causal,setCausal]=useState(true),[query,setQuery]=useState(1);
 const result=useMemo(()=>attentionExperiment(temperature,delta,causal),[temperature,delta,causal]),base=attentionExperiment(temperature,0,causal);
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},grid:{left:45,right:20,top:25,bottom:45},xAxis:{type:'value',min:0,max:4,interval:1,name:'记录 j'},yAxis:{type:'value',min:0,max:1,name:'权重'},series:[{type:'bar',barWidth:35,data:result.weights[query].map((w,j)=>[j+1,w])}]}),[result,query]);const chart=useECharts(option);const style={padding:7,background:'#fff',color:'#172033',border:'1px solid #94a3b8',borderRadius:5};
 const reset=()=>{setTemperature(1);setDelta(0);setCausal(true);setQuery(1);};
 return <section aria-label="注意力读取实验" className="not-prose" style={{background:'#fff',color:'#172033',padding:16,margin:'20px 0',border:'1px solid #94a3b8',borderRadius:10,minWidth:0}}>
 <strong>只改变未来记录的值，当前输出是否跟着变？</strong>
 <label style={{display:'block',marginTop:10}}>查询时刻 i <select aria-label="查询时刻" value={query} onChange={e=>setQuery(+e.target.value)} style={style}>{[0,1,2].map(i=><option key={i} value={i}>{i+1}</option>)}</select></label>
 <label style={{display:'block',marginTop:10}}>温度系数 τ <select aria-label="注意力温度" value={temperature} onChange={e=>setTemperature(+e.target.value)} style={style}>{temperatures.map(v=><option key={v}>{v}</option>)}</select></label>
 <label style={{display:'block',marginTop:10}}>第三条值的增量 δ <select aria-label="未来值扰动" value={delta} onChange={e=>setDelta(+e.target.value)} style={style}>{deltas.map(v=><option key={v}>{v}</option>)}</select></label>
 <label style={{display:'block',marginTop:10}}><input aria-label="启用因果掩码" type="checkbox" checked={causal} onChange={e=>setCausal(e.target.checked)}/> 仅可读 j≤i（含当前）</label>
 <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}><button style={style} onClick={()=>{setQuery(1);setDelta(10);setCausal(true);setTemperature(1);}}>因果探针</button><button style={style} onClick={()=>{setQuery(1);setDelta(10);setCausal(false);setTemperature(1);}}>解除掩码</button><button style={style} onClick={reset}>恢复默认</button></div>
 <p aria-live="polite">查询第{query+1}条；{causal?'因果可见':'全记录可见'}；输出={result.output[query][0].toFixed(8)}；相对δ=0的变化={(result.output[query][0]-base.output[query][0]).toFixed(8)}。</p>
 <p>三条权重：{result.weights[query].map((w,j)=><span key={j} style={{display:'inline-block',marginRight:12}}>j={j+1}：{w.toFixed(8)}</span>)}</p>
 <div ref={chart} style={{width:'100%',height:300}}/>
 <p>Q、K保持固定，仅第三条V变化。预测下一时刻可读取当前记录；第三条对前两条查询是未来，对第三条查询已是当前。图是读取权重，不是因果解释或预测准确率。</p>
 </section>;
}
