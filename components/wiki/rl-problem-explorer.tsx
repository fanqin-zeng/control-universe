'use client';
import {useMemo, useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {rlProblem} from '@/lib/rl-problem';
const buttonStyle={border:'1px solid #64748b',borderRadius:6,padding:'5px 10px',background:'#f1f5f9',color:'#172033',cursor:'pointer'};

export function RlProblemExplorer() {
  const [p,setP]=useState(.6),[gamma,setGamma]=useState(.9),[alpha,setAlpha]=useState(1);
  const r=rlProblem(p,gamma,alpha);
  const option=useMemo<EChartsOption>(()=>({animation:false,
    tooltip:{trigger:'axis'},grid:{left:55,right:20,top:35,bottom:45},
    xAxis:{type:'value',name:'充电概率 α',nameLocation:'middle',nameGap:28,min:0,max:1},
    yAxis:{type:'value',name:'期望回报',min:-4,max:6},
    series:[{name:'随机策略',type:'line',showSymbol:false,data:Array.from({length:21},(_,i)=>[i/20,rlProblem(p,gamma,i/20).expected])},
      {name:'当前策略',type:'scatter',symbolSize:12,data:[[alpha,r.expected]]}]
  }),[p,gamma,alpha,r.expected]);
  const rewardOption=useMemo<EChartsOption>(()=>({animation:false,
    tooltip:{trigger:'axis'},grid:{left:55,right:20,top:35,bottom:45},
    xAxis:{type:'value',name:'折扣 γ',nameLocation:'middle',nameGap:28,min:0,max:1},
    yAxis:{type:'value',name:'期望回报',min:-4,max:6},
    legend:{top:0,data:['直接送餐','先充电']},series:[
      {name:'直接送餐',type:'line',showSymbol:false,data:[[0,r.direct],[1,r.direct]]},
      {name:'先充电',type:'line',showSymbol:false,data:[[0,-1],[1,5]]}]
  }),[r.direct]);
  const ref=useECharts(option),rewardRef=useECharts(rewardOption);
  const reset=()=>{setP(.6);setGamma(.9);setAlpha(1);};
  return <section style={{border:'1px solid #94a3b8',borderRadius:10,padding:16,margin:'20px 0'}} aria-label="送餐回报实验">
    <p style={{marginTop:0}}>固定教学模型的精确期望；没有训练算法。折扣和奖励由设计者指定。</p>
    <div style={{display:'flex',flexWrap:'wrap',gap:12}}>
      {([{label:'低电送达概率 p',value:p,set:setP},{label:'折扣 γ',value:gamma,set:setGamma},{label:'充电概率 α',value:alpha,set:setAlpha}]).map(x=><label key={x.label} style={{display:'grid',gap:4,minWidth:180,flex:1}}>{x.label} = {x.value.toFixed(2)}<input aria-label={x.label} type="range" min={0} max={1} step={.01} value={x.value} onChange={e=>x.set(Number(e.target.value))}/></label>)}
    </div>
    <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}>
      <button type="button" style={buttonStyle} onClick={reset}>恢复默认</button>
      <button type="button" style={buttonStyle} onClick={()=>{setP(.6);setGamma(.2);setAlpha(1);}}>低折扣</button>
      <button type="button" style={buttonStyle} onClick={()=>{setP(.9);setGamma(.9);setAlpha(1);}}>高成功率</button>
      <button type="button" style={buttonStyle} onClick={()=>{setP(.84);setGamma(.9);setAlpha(1);}}>持平工况</button>
    </div>
    <p aria-live="polite" data-rl-readout="true">直接送餐 {r.direct.toFixed(4)}；先充电 {r.charge.toFixed(4)}；当前策略 {r.expected.toFixed(4)}；送达概率 {r.success.toFixed(4)}；期望步数 {r.steps.toFixed(4)}</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))',gap:8}}>
      <div ref={ref} style={{width:'100%',height:280,minWidth:0}} role="img" aria-label="回报随充电概率变化，当前策略以圆点表示"/>
      <div ref={rewardRef} style={{width:'100%',height:280,minWidth:0}} role="img" aria-label="两种固定首动作的回报随折扣变化"/>
    </div>
    <p style={{marginBottom:0}}>先充电多走一步，并在模型中避免失败；高回报本身不证明真实机器人的安全。图轴始终固定为回报 −4 至 6。</p>
  </section>;
}
