"use client";
import{useState,useMemo}from"react";import type{EChartsOption}from"echarts";import{useECharts}from"./use-echarts";import{samplingRun}from"@/lib/sampling";
export function SamplingQuantizationExplorer(){const[fs,setFs]=useState(100),[bits,setBits]=useState(8),run=useMemo(()=>samplingRun(fs,bits),[fs,bits]);
 const option=useMemo<EChartsOption>(()=>({animation:false,legend:{top:4,textStyle:{color:"#172033",fontSize:11},data:["连续输入","采样值","量化保持"]},tooltip:{trigger:"axis"},grid:{left:44,right:18,top:48,bottom:42},xAxis:{type:"value",min:0,max:.4,name:"时间 (s)",nameLocation:"middle",nameGap:25},yAxis:{type:"value",min:-2,max:2,name:"信号值"},series:[{type:"line",name:"连续输入",data:run.curve,showSymbol:false,lineStyle:{width:1,opacity:.5}},{type:"scatter",name:"采样值",data:run.rows.map(r=>[r[0],r[1]]),symbolSize:5},{type:"line",name:"量化保持",step:"end",showSymbol:false,data:run.rows.map(r=>[r[0],r[2]])}]}),[run]);const chart=useECharts(option),button={padding:"6px 10px",border:"1px solid #94a3b8",borderRadius:5,background:"#f1f5f9",color:"#1e293b",cursor:"pointer"};
 return <section className="not-prose" aria-label="采样量化实验台" style={{border:"1px solid #cbd5e1",borderRadius:10,padding:16,margin:"24px 0",background:"#fff",color:"#334155",minWidth:0}}>
 <strong>同一个输入，采得快与记得细是两件事</strong><p>x(t)=sin(2π·5t)+0.5sin(2π·95t)，ADC范围[−2,2]，显示0–0.4秒。</p>
 <label style={{display:"block"}}>采样率 fₛ={fs} Hz <input aria-label="采样率" type="range" min={50} max={250} step={10} value={fs} onChange={e=>setFs(Number(e.target.value))} style={{width:"min(260px,100%)"}}/></label>
 <label style={{display:"block"}}>ADC位数 N={bits} <input aria-label="量化位数" type="range" min={3} max={12} step={1} value={bits} onChange={e=>setBits(Number(e.target.value))} style={{width:"min(260px,100%)"}}/></label>
 <div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"12px 0"}}><button style={button} onClick={()=>setFs(190)}>临界采样</button><button style={button} onClick={()=>setFs(250)}>提高采样率</button><button style={button} onClick={()=>{setFs(100);setBits(8);}}>恢复默认</button></div>
 <p aria-live="polite">95 Hz正弦在样点等价于{run.alias.toFixed(1)} Hz；负号表示正弦相位反号。{fs===100?"此时与原5 Hz项部分抵消，合成幅值0.5，频率仍为5 Hz。":fs===190?"恰好每周期两点，本例高频正弦的样点为零，不能保证恢复。":"这里只说明这些采样点的等价关系。"}</p>
 <p aria-live="polite">{run.levels}个电平；q={run.q.toFixed(6)}；不过载误差界 q/2={(run.q/2).toFixed(6)}；本窗口最大量化误差 {run.maxError.toFixed(6)}。</p>
 <div ref={chart} style={{height:340,width:"100%",minWidth:0}}/><p>保持线将本次量化值维持到下一次更新。增加位数能细化幅度，无法把已经混叠的频率信息找回来。</p></section>;
}
