"use client";

import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";

export function calculateARProcess(a:number,q:number,secondMoment:boolean,selected:number){
  if(![a,q,selected].every(Number.isFinite)||a< -.8||a>.8||q<.25||q>1||typeof secondMoment!=="boolean"||!Number.isInteger(selected)||selected<0||selected>12)throw new RangeError("Outside the lesson domain");
  const limit=q/(1-a*a),initialVariance=secondMoment?limit:0;
  const variances=[[0,initialVariance]];
  for(let k=0;k<12;k++)variances.push([k+1,a*a*variances[k][1]+q]);
  const signs=[Array(12).fill(1),Array(12).fill(-1),Array.from({length:12},(_,k)=>k%2===0?1:-1),Array.from({length:12},(_,k)=>Math.floor(k/2)%2===0?1:-1)];
  const paths=signs.map((row,index)=>{
    let x=secondMoment?(index%2===0?1:-1)*Math.sqrt(limit):0;
    const result=[[0,x]];
    for(let k=0;k<12;k++){x=a*x+Math.sqrt(q)*row[k];result.push([k+1,x]);}
    return result;
  });
  return {mean:0,variance:variances[selected][1],sd:Math.sqrt(variances[selected][1]),limit,initialVariance,variances,paths};
}

export function ARProcessExplorer(){
  const[a,setA]=useState(.5),[q,setQ]=useState(.75),[secondMoment,setSecondMoment]=useState(false),[selected,setSelected]=useState(3);
  const data=useMemo(()=>calculateARProcess(a,q,secondMoment,selected),[a,q,secondMoment,selected]);
  const pathOption:EChartsOption=useMemo(()=>({animation: false,grid:{left:48,right:28,top:35,bottom:40},tooltip:{trigger:"axis"},
    xAxis:{type:"value",min:0,max:12,interval:1,name:"秒"},yAxis:{type:"value",min:-5.2,max:5.2,name:"误差 g"},
    series:[...data.paths.map((p,i)=>({name:`选定轨迹${i+1}`,type:"line" as const,showSymbol:true,symbolSize:4,data:p})),{name:"理论均值",type:"line",showSymbol:false,data:data.variances.map(([k])=>[k,0]),lineStyle:{type:"dashed",color:"#111827"}}],
  }),[data]);
  const varianceOption:EChartsOption=useMemo(()=>({animation: false,grid:{left:48,right:28,top:35,bottom:40},tooltip:{trigger:"axis"},
    xAxis:{type:"value",min:0,max:12,interval:1,name:"秒"},yAxis:{type:"value",min:0,max:3,name:"方差 g²"},
    series:[{name:"理论方差",type:"line",data:data.variances,lineStyle:{color:"#2563eb"}},
      {name:"方差极限",type:"line",showSymbol:false,data:data.variances.map(([k])=>[k,data.limit]),lineStyle:{type:"dashed",color:"#6b7280"}},
      {name:"所选时刻",type:"scatter",symbolSize:10,data:[[selected,data.variance]],itemStyle:{color:"#b45309"}}],
  }),[data,selected]);
  const paths=useECharts(pathOption),variance=useECharts(varianceOption);
  const button={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,background:"var(--background)",color:"var(--foreground)",cursor:"pointer"};
  return <section aria-label="AR误差轨迹与总体方差实验" className="not-prose" style={{border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",color:"var(--foreground)",minWidth:0}}>
    <p>{secondMoment?"二阶矩平稳初始化：X0独立取正负sqrt(P∞)，等概率；这不保证完整分布严格平稳。":"从零开始：X0=0，新扰动持续加入。"}上图4条选定可能轨迹，下图理论方差；不从4条线估计总体统计。</p>
    <div ref={paths} style={{width:"100%",height:250}}/>
    <div ref={variance} style={{width:"100%",height:230}}/>
    <label style={{display:"block"}}>记忆比例 a = {a.toFixed(2)}<input aria-label="记忆比例" type="range" min={-.8} max={.8} step={.1} value={a} onChange={e=>setA(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <label style={{display:"block"}}>创新方差 q = {q.toFixed(2)} g²<input aria-label="创新方差" type="range" min={.25} max={1} step={.25} value={q} onChange={e=>setQ(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <label style={{display:"block"}}>观察时刻 k = {selected} 秒<input aria-label="观察时刻" type="range" min={0} max={12} step={1} value={selected} onChange={e=>setSelected(Number(e.target.value))} style={{width:"100%",display:"block"}}/></label>
    <p aria-live="polite">理论均值 = 0.0000 g；所选时刻方差 = {data.variance.toFixed(4)} g²；标准差 = {data.sd.toFixed(4)} g；方差极限 = {data.limit.toFixed(4)} g²。</p>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <button type="button" style={button} onClick={()=>setSecondMoment(true)}>二阶矩平稳初始化</button>
      <button type="button" style={button} onClick={()=>{setA(0);setQ(.75);setSecondMoment(false);setSelected(3);}}>无记忆示例</button>
      <button type="button" style={button} onClick={()=>{setA(-.5);setQ(.75);setSecondMoment(true);setSelected(3);}}>负相关示例</button>
      <button type="button" style={button} onClick={()=>{setA(.5);setQ(.75);setSecondMoment(false);setSelected(3);}}>恢复默认</button>
    </div>
    <p style={{fontSize:13}}>每步1秒，13个时刻k=0…12；轨迹轴±5.2、方差轴0…3固定，动画关闭。创新独立等概率±sqrt(q)，选定符号依次为全正、全负、正负交替、两正两负循环；初始符号按轨迹序号正负交替。这是可能实现的选择，不执行随机抽样、不宣称代表性。P∞来自解析不动点，有限末值不当极限。</p>
  </section>;
}
