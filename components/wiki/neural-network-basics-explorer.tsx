"use client";
import {useMemo, useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {forward, losses, centers, gains, hiddenOffsets, type Activation} from '@/lib/neural-network-basics';

export function NeuralNetworkBasicsExplorer() {
  const [kind,setKind]=useState<Activation>('relu'),[c,setC]=useState(0),[gain,setGain]=useState(1),[offset,setOffset]=useState(0),[x,setX]=useState(.5);
  const result=useMemo(()=>forward(x,c,gain,offset,kind),[x,c,gain,offset,kind]);
  const error=useMemo(()=>losses(c,gain,offset,kind),[c,gain,offset,kind]);
  const option=useMemo<EChartsOption>(()=>{
    const xs=Array.from({length:161},(_,i)=>-2+i/40);
    return {animation:false,tooltip:{trigger:'axis'},legend:{bottom:0},grid:{left:45,right:20,top:30,bottom:85},
      xAxis:{type:'value',min:-2,max:2,name:'归一化输入 x',nameLocation:'middle',nameGap:26},yAxis:{type:'value',min:-12,max:8,name:'输出 / 隐藏特征'},
      series:[
        {name:'目标 |x|',type:'line',showSymbol:false,lineStyle:{type:'dashed'},data:xs.map(v=>[v,Math.abs(v)])},
        {name:'网络输出',type:'line',showSymbol:false,lineStyle:{width:3},data:xs.map(v=>[v,forward(v,c,gain,offset,kind).output])},
        {name:'隐藏特征 h₁',type:'line',showSymbol:false,data:xs.map(v=>[v,forward(v,c,gain,offset,kind).h[0]])},
        {name:'隐藏特征 h₂',type:'line',showSymbol:false,data:xs.map(v=>[v,forward(v,c,gain,offset,kind).h[1]])},
        {name:'探针',type:'scatter',symbolSize:12,data:[[x,result.output]]}
      ]};
  },[c,gain,offset,kind,x,result]);
  const chart=useECharts(option);
  const style={padding:6,color:'#172033',background:'#fff'};
  function preset(name:string){setKind(name==='线性相消'?'linear':name==='双曲相消'?'tanh':'relu');setC(name==='移动折点'?.5:0);setGain(name==='零输出'?0:1);setOffset(name==='失活单元'?-3:0);setX(.5);}
  return <section aria-label="神经网络前向实验" className="not-prose" style={{padding:16,margin:'20px 0',border:'1px solid #94a3b8',borderRadius:10,background:'#fff',color:'#172033',minWidth:0}}>
    <strong>两个隐藏单元如何拼出折线？</strong>
    <label style={{display:'block',marginTop:12}}>激活函数 <select aria-label="激活函数" value={kind} onChange={e=>setKind(e.target.value as Activation)} style={style}>{['relu','linear','tanh'].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
    <label style={{display:'block',marginTop:12}}>折点参数 c <select aria-label="折点参数" value={c} onChange={e=>setC(+e.target.value)} style={style}>{centers.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
    <label style={{display:'block',marginTop:12}}>输出增益 g <select aria-label="输出增益" value={gain} onChange={e=>setGain(+e.target.value)} style={style}>{gains.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
    <label style={{display:'block',marginTop:12}}>隐藏偏置增量 d <select aria-label="隐藏偏置增量" value={offset} onChange={e=>setOffset(+e.target.value)} style={style}>{hiddenOffsets.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
    <label style={{display:'block',marginTop:12}}>输入探针 x={x.toFixed(2)}<input aria-label="输入探针" type="range" min={-2} max={2} step={.25} value={x} onChange={e=>setX(+e.target.value)} style={{width:'100%'}}/></label>
    <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}>{['移动折点','线性相消','双曲相消','失活单元','零输出','恢复默认'].map(name=><button key={name} onClick={()=>preset(name)} style={{padding:8,color:'#172033',background:'#f1f5f9',border:'1px solid #94a3b8',borderRadius:6}}>{name}</button>)}</div>
    <p aria-live="polite">z=[{result.z.map(v=>v.toFixed(8)).join(', ')}]；h=[{result.h.map(v=>v.toFixed(8)).join(', ')}]；输出={result.output.toFixed(8)}；训练MSE={error.training.toFixed(8)}，验证MSE={error.validation.toFixed(8)}，测试MSE={error.test.toFixed(8)}。</p>
    <div ref={chart} style={{width:'100%',height:360}}/>
    <p>手工构造的前向演示，没有执行训练。目标始终为 |x|；反复查看测试读数仅供剖析，实际选参数应只看验证集。</p>
  </section>;
}
