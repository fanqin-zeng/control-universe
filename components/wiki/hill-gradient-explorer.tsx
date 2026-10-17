"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";

export function calculateHillGradient(x:number,y:number,angle:number,step:number){
  if(![x,y,angle,step].every(Number.isFinite)||Math.abs(x)>1.5||Math.abs(y)>1.5||angle<0||angle>360||step<0||step>.5)throw new Error("参数超出教学范围");
  const height=(a:number,b:number)=>10-a*a-2*b*b;
  const a=angle*Math.PI/180,direction=[Math.cos(a),Math.sin(a)],gradient=[-2*x,-4*y];
  const base=height(x,y),slope=gradient[0]*direction[0]+gradient[1]*direction[1];
  const next=[x+step*direction[0],y+step*direction[1]],predicted=base+step*slope,actual=height(next[0],next[1]);
  const profile=Array.from({length:41},(_,i)=>{const t=-.5+i/40;return [t,height(x+t*direction[0],y+t*direction[1]),base+t*slope];});
  const contours=[6,8,9].map(level=>({level,points:Array.from({length:121},(_,i)=>{const t=2*Math.PI*i/120;return [Math.sqrt(10-level)*Math.cos(t),Math.sqrt((10-level)/2)*Math.sin(t)];})}));
  return {base,gradient,direction,slope,next,predicted,actual,remainder:actual-predicted,gradientNorm:Math.hypot(...gradient),gradientTip:[x+.15*gradient[0],y+.15*gradient[1]],profile,contours};
}

export function HillGradientExplorer(){
  const [x,setX]=useState(1),[y,setY]=useState(1),[angle,setAngle]=useState(0),[step,setStep]=useState(.1);
  const data=useMemo(()=>calculateHillGradient(x,y,angle,step),[x,y,angle,step]);
  const mapOption:EChartsOption=useMemo<EChartsOption>(()=>({animation: false,grid:{left:45,right:45,top:45,bottom:45},
    xAxis:{type:"value",min:-2.2,max:2.2,name:"东 x"},yAxis:{type:"value",min:-2.2,max:2.2,name:"北 y"},
    tooltip:{trigger:"item"},
    series:[...data.contours.map(c=>({name:"等高线 "+c.level,type:"line" as const,data:c.points,showSymbol:false,lineStyle:{color:"#94a3b8",width:1}})),
      {name:"选定的一步",type:"line",data:[[x,y],data.next],symbol:"none",lineStyle:{color:"#2563eb",width:3},markLine:{silent:true,label:{show:false},symbol:["none","arrow"],symbolSize:9,lineStyle:{color:"#2563eb",width:3},data:[[{coord:[x,y]},{coord:data.next}]]}},
      {name:"梯度方向（缩放显示）",type:"line",data:[[x,y],data.gradientTip],symbol:"none",lineStyle:{color:"#15803d",width:2},markLine:{silent:true,label:{show:false},symbol:["none","arrow"],symbolSize:10,lineStyle:{color:"#15803d",width:2},data:[[{coord:[x,y]},{coord:data.gradientTip}]]}},
      {name:"当前位置",type:"scatter",data:[[x,y]],symbolSize:8,itemStyle:{color:"#111827"}}],
  }),[data,x,y]);
  const profileOption:EChartsOption=useMemo(()=>({animation: false,grid:{left:45,right:30,top:40,bottom:45},
    legend:{data:["真实高度","一阶预测"]},xAxis:{type:"value",min:-.5,max:.5,name:"沿路位移 t"},yAxis:{type:"value",min:-3,max:11,name:"高度"},tooltip:{trigger:"axis"},
    series:[{name:"真实高度",type:"line",data:data.profile.map(p=>[p[0],p[1]]),showSymbol:false,lineStyle:{color:"#2563eb",width:2}},
      {name:"一阶预测",type:"line",data:data.profile.map(p=>[p[0],p[2]]),showSymbol:false,lineStyle:{color:"#ea580c",type:"dashed",width:2}},
      {name:"当前小步真实值",type:"scatter",data:[[step,data.actual]],symbolSize:9,itemStyle:{color:"#2563eb"}},
      {name:"当前小步预测",type:"scatter",data:[[step,data.predicted]],symbol:"diamond",symbolSize:10,itemStyle:{color:"#ea580c"}}],
  }),[data,step]);
  const mapRef=useECharts(mapOption),profileRef=useECharts(profileOption);
  const buttonStyle={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,background:"var(--background)",color:"var(--foreground)",cursor:"pointer"};
  return <section aria-label="地图与坡度实验" className="not-prose" style={{color:"var(--foreground)",border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",minWidth:0}}>
    <p>俯视图：灰线从外层到内层的高度分别为6、8、9。黑点是站位，蓝箭头是选定的一小步；绿箭头沿梯度，固定缩放0.15倍显示，并非实际步长。</p>
    <div ref={mapRef} style={{width:"100%",maxWidth:420,aspectRatio:"1 / 1"}} />
    <p>沿选定方向的高度剖面：t=0表示站位，正t向前走，负t反向走。蓝线是模型真实值，橙虚线是一阶近似；两点标出当前步长对应的值。</p>
    <div ref={profileRef} style={{width:"100%",height:280}} />
    <label style={{display:"block"}}>东西位置 x = {x.toFixed(2)}<input aria-label="东西位置 x" type="range" min={-1.5} max={1.5} step={.25} value={x} onChange={e=>setX(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <label style={{display:"block"}}>南北位置 y = {y.toFixed(2)}<input aria-label="南北位置 y" type="range" min={-1.5} max={1.5} step={.25} value={y} onChange={e=>setY(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <label style={{display:"block"}}>行进角度 = {angle}°（0°向东，90°向北）<input aria-label="行进角度" type="range" min={0} max={360} step={15} value={angle} onChange={e=>setAngle(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <label style={{display:"block"}}>小步长度 = {step.toFixed(2)}<input aria-label="小步长度" type="range" min={0} max={.5} step={.05} value={step} onChange={e=>setStep(Number(e.target.value))} style={{display:"block",width:"100%"}} /></label>
    <p aria-live="polite">当前位置高度 = {data.base.toFixed(4)}；梯度 = ({data.gradient.map(v=>v.toFixed(4)).join(", ")})；方向导数 = {data.slope.toFixed(4)}</p>
    <p aria-live="polite">预测高度 = {data.predicted.toFixed(4)}；真实高度 = {data.actual.toFixed(4)}；真实减预测 = {data.remainder.toFixed(4)}</p>
    <p>{data.gradientNorm===0?"此处梯度为零，绿箭头没有方向；小步后是否变化还要看二阶项。":"绿箭头表示局部上升方向，不表示某条真实山路或有限步的最优路线。"}</p>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <button type="button" style={buttonStyle} onClick={()=>setAngle(45)}>向东北</button>
      <button type="button" style={buttonStyle} onClick={()=>setAngle(225)}>向西南</button>
      <button type="button" style={buttonStyle} onClick={()=>{setX(0);setY(0);}}>移到山顶</button>
      <button type="button" style={buttonStyle} onClick={()=>{setX(1);setY(1);setAngle(0);setStep(.1);}}>恢复默认</button>
    </div>
    <p style={{fontSize:13}}>地图轴固定±2.2；剖面位移固定−0.5…0.5、高度−3…11。位置、位移和高度都是教学归一化量；非实测地形，不作路线或安全建议。</p>
  </section>;
}
