"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
export function calculateChargingGame(c:number,u1:number,u2:number){
 if(![c,u1,u2].every(Number.isFinite)||c<0||c>.45||u1<0||u1>4||u2<0||u2>4)throw new RangeError("Outside lesson domain");
 const cost=(a:number,b:number)=>.5*(a-2)**2+c*a*b;
 const br=(b:number)=>Math.max(0,Math.min(4,2-c*b));
 const costs=[cost(u1,u2),cost(u2,u1)],bestResponses=[br(u2),br(u1)];
 const gains=[Math.max(0,costs[0]-cost(bestResponses[0],u2)),Math.max(0,costs[1]-cost(bestResponses[1],u1))];
 const nash=[2/(1+c),2/(1+c)],planner=[2/(1+2*c),2/(1+2*c)];
 const nashCosts=[cost(nash[0],nash[1]),cost(nash[1],nash[0])],plannerCosts=[cost(planner[0],planner[1]),cost(planner[1],planner[0])];
 const costCurves=Array.from({length:81},(_,i)=>{const x=i/20;return [x,cost(x,u2),cost(x,u1)];});
 const brCurves=Array.from({length:81},(_,i)=>{const x=i/20;return [x,br(x)];});
 return {costs,bestResponses,gains,epsilon:Math.max(...gains),nash,planner,nashCosts,plannerCosts,totals:[nashCosts[0]+nashCosts[1],plannerCosts[0]+plannerCosts[1]],costCurves,brCurves};
}
export function ChargingGameExplorer(){
 const[c,setC]=useState(.25),[u1,setU1]=useState(2),[u2,setU2]=useState(2);
 const d=useMemo(()=>calculateChargingGame(c,u1,u2),[c,u1,u2]);
 const responses:EChartsOption=useMemo(()=>({animation:false,grid:{left:45,right:35,top:35,bottom:45},tooltip:{trigger:"item"},xAxis:{type:"value",min:0,max:4,name:"甲 u₁"},yAxis:{type:"value",min:0,max:4,name:"乙 u₂"},series:[
 {name:"甲最佳响应",type:"line",showSymbol:false,data:d.brCurves.map(p=>[p[1],p[0]]),lineStyle:{color:"#2563eb"},itemStyle:{color:"#2563eb"}},
 {name:"乙最佳响应",type:"line",showSymbol:false,data:d.brCurves,lineStyle:{color:"#b45309"},itemStyle:{color:"#b45309"}},
 {name:"当前组合",type:"scatter",symbolSize:13,data:[[u1,u2]],itemStyle:{color:"#111827"}},
 {name:"只改甲的响应",type:"scatter",symbol:"emptyCircle",symbolSize:10,data:[[d.bestResponses[0],u2]],itemStyle:{color:"#2563eb"}},
 {name:"只改乙的响应",type:"scatter",symbol:"emptyCircle",symbolSize:10,data:[[u1,d.bestResponses[1]]],itemStyle:{color:"#b45309"}},
 {name:"纳什点",type:"scatter",symbol:"diamond",symbolSize:14,data:[d.nash],itemStyle:{color:"#dc2626"}},
 {name:"共同目标点",type:"scatter",symbol:"rect",symbolSize:10,data:[d.planner],itemStyle:{color:"#7c3aed"}}
 ]}),[d,u1,u2]);
 const unilateral:EChartsOption=useMemo(()=>({animation:false,grid:{left:45,right:30,top:35,bottom:45},tooltip:{trigger:"axis"},xAxis:{type:"value",min:0,max:4,name:"自己的行动"},yAxis:{type:"value",min:0,max:10,name:"代价评分"},series:[{name:"甲代价（乙固定）",type:"line",showSymbol:false,data:d.costCurves.map(p=>[p[0],p[1]]),lineStyle:{color:"#2563eb"},itemStyle:{color:"#2563eb"}},{name:"乙代价（甲固定）",type:"line",showSymbol:false,data:d.costCurves.map(p=>[p[0],p[2]]),lineStyle:{color:"#b45309"},itemStyle:{color:"#b45309"}},{name:"当前各代价",type:"scatter",symbolSize:10,data:[[u1,d.costs[0]],[u2,d.costs[1]]],itemStyle:{color:"#111827"}}]}),[d,u1,u2]);
 const plane=useECharts(responses),curves=useECharts(unilateral);
 const button={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,color:"var(--foreground)",background:"var(--background)",cursor:"pointer"};
 return <section className="not-prose" aria-label="充电选择与最佳响应实验" style={{border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",color:"var(--foreground)",minWidth:0}}>
 <p>上图横轴甲、纵轴乙：蓝线是甲响应，棕线是乙响应；黑圆点为当前组合，两个空心点各表示只改一人的响应，红菱形为纳什点、紫方形为共同目标点。它们是静态选择，不是时间轨迹。</p>
 <div ref={plane} style={{width:"100%",maxWidth:440,aspectRatio:"1",margin:"0 auto"}}/><div ref={curves} style={{width:"100%",height:250}}/>
 <p style={{fontSize:13}}>下图固定对方当前行动，分别画甲（蓝）与乙（棕）的单方代价；代价越低越好。两人选同样功率时曲线重合，不是比较两种控制算法。</p>
 <label style={{display:"block"}}>影响强度 c = {c.toFixed(2)}<input aria-label="影响强度" type="range" min={0} max={.45} step={.05} value={c} onChange={e=>setC(Number(e.target.value))} style={{display:"block",width:"100%"}}/></label>
 <label style={{display:"block"}}>甲功率 = {u1.toFixed(4)} kW<input aria-label="甲功率" type="range" min={0} max={4} step="any" value={u1} onChange={e=>setU1(Number(e.target.value))} style={{display:"block",width:"100%"}}/></label>
 <label style={{display:"block"}}>乙功率 = {u2.toFixed(4)} kW<input aria-label="乙功率" type="range" min={0} max={4} step="any" value={u2} onChange={e=>setU2(Number(e.target.value))} style={{display:"block",width:"100%"}}/></label>
 <p aria-live="polite">当前代价 = ({d.costs.map(v=>v.toFixed(4)).join(", ")})；各自最佳响应 = ({d.bestResponses.map(v=>v.toFixed(4)).join(", ")}) kW；单方改善 = ({d.gains.map(v=>v.toFixed(4)).join(", ")})；最大改善 ε = {d.epsilon.toFixed(4)}。</p>
 <p>纳什点 = ({d.nash.map(v=>v.toFixed(4)).join(", ")}) kW，总分 {d.totals[0].toFixed(4)}；共同目标点 = ({d.planner.map(v=>v.toFixed(4)).join(", ")}) kW，总分 {d.totals[1].toFixed(4)}。</p>
 <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button type="button" style={button} onClick={()=>setU1(d.bestResponses[0])}>只让甲响应</button><button type="button" style={button} onClick={()=>{setU1(d.nash[0]);setU2(d.nash[1]);}}>移到纳什点</button><button type="button" style={button} onClick={()=>{setU1(d.planner[0]);setU2(d.planner[1]);}}>移到共同目标</button><button type="button" style={button} onClick={()=>setC(0)}>无耦合</button><button type="button" style={button} onClick={()=>{setC(.25);setU1(2);setU2(2);}}>恢复默认</button></div>
 <p style={{fontSize:13}}>功率按1kW归一，评分无量纲；无随机、无时间窗、无额外共同硬约束，不代表实际账单或电网保护。所有功率轴0…4、代价轴0…10固定，动画关闭。ε取最大单方改善；显示为0.0000不等于已证明精确为零。c=0时两种基准重合。</p>
 </section>;
}
