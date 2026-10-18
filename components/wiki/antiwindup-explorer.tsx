"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "@/components/wiki/use-echarts";
import {antiWindup} from "@/lib/compensator-model";
const names=["无限幅参考","限幅无回算","限幅有回算"];
export function AntiWindupExplorer(){
 const [limit,setLimit]=useState(2);
 const data=useMemo(()=>antiWindup(limit),[limit]);
 const responseOption=useMemo<EChartsOption>(()=>({title:{text:"饱和与输出",left:"center",textStyle:{fontSize:15}},tooltip:{trigger:"axis"},legend:{type:"scroll",top:30,left:10,right:10},grid:{left:45,right:25,top:80,bottom:45},animation: false,xAxis:{type:"value",min:0,max:10,name:"秒"},yAxis:{type:"value",min:-1,max:3,name:"y"},series:data.map((a,i)=>({name:names[i],type:"line",symbol:"none",data:a.points.map(p=>[p.t,p.y])}))}),[data]);
 const controlOption=useMemo<EChartsOption>(()=>({title:{text:"实际控制量",left:"center",textStyle:{fontSize:15}},tooltip:{trigger:"axis"},legend:{type:"scroll",top:30,left:10,right:10},grid:{left:45,right:25,top:80,bottom:45},animation: false,xAxis:{type:"value",min:0,max:10,name:"秒"},yAxis:{type:"value",min:-6,max:6,name:"u"},series:data.slice(1).map((a,i)=>({name:names[i+1],type:"line",symbol:"none",data:a.points.map(p=>[p.t,p.u])}))}),[data]);
 const yRef=useECharts(responseOption),uRef=useECharts(controlOption);
 return <section aria-label="抗饱和交互" style={{minWidth:0,maxWidth:"100%"}}><label htmlFor="aw-limit">执行器限幅</label> <input id="aw-limit" aria-label="执行器限幅" type="range" min={.5} max={5} step={.1} value={limit} onChange={e=>setLimit(Number(e.target.value))} style={{width:"min(100%,220px)"}}/> <span>{limit.toFixed(1)}</span> <button onClick={()=>setLimit(2)}>恢复限幅默认</button>
 <p>G=1/[s(s+2)]，PI为5+2/s，回算Tt=1，单位阶跃/零初值；限幅输出仍在反馈环中。固定参数观察，不保证回算总更好。</p>
 <p data-testid="aw-values">y(10s)：{data.map(a=>a.points[500].y.toFixed(6)).join(" / ")}；窗口采样最大值：{data.map(a=>Math.max(...a.points.map(p=>p.y)).toFixed(6)).join(" / ")}</p>
 <div ref={yRef} style={{height:340,minWidth:0}}/><div ref={uRef} style={{height:340,minWidth:0}}/><p>窗口末样不称稳态，网格峰值不称连续精确峰。图窗外值被裁剪。</p></section>;
}
