"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";

export function calculatePowerAllocation(r1:number,r2:number,b:number,eta:number){
 if(![r1,r2,b,eta].every(Number.isFinite)||r1<0||r1>3||r2<0||r2>3||b<0||b>4||eta<.25||eta>2)throw new RangeError("Outside lesson domain");
 const project=(y:number[])=>{
  const z=y.map(v=>Math.max(v,0));if(z[0]+z[1]<=b)return z;
  const hi=Math.max(y[0],y[1]),lo=Math.min(y[0],y[1]);
  if(hi-lo>=b)return y[0]>=y[1]?[b,0]:[0,b];
  const t=(y[0]+y[1]-b)/2;return [y[0]-t,y[1]-t];
 };
 const r=[r1,r2],optimum=project(r),objective=(u:number[])=>((u[0]-r1)**2+(u[1]-r2)**2)/2;
 const lambda=r1+r2<=b?0:Math.max(r1-optimum[0],r2-optimum[1]);
 const mu=r.map((v,i)=>optimum[i]-v+lambda),v=mu.map(m=>lambda-m);
 const dual=v[0]*r1+v[1]*r2-lambda*b-(v[0]**2+v[1]**2)/2;
 let u=[0,0];const paths=[u],values=[[0,objective(u)]];
 for(let k=1;k<=18;k++){u=project(u.map((x,i)=>x-eta*(x-r[i])));paths.push(u);values.push([k,objective(u)]);}
 const mapped=project(u.map((x,i)=>x-eta*(x-r[i])));
 return {optimum,optimalValue:objective(optimum),lambda,mu,dual,paths,values,last:u,lastValue:objective(u),distance:Math.hypot(u[0]-optimum[0],u[1]-optimum[1]),residual:Math.hypot(u[0]-mapped[0],u[1]-mapped[1])/eta,violation:Math.max(0,-u[0],-u[1],u[0]+u[1]-b)};
}
export function PowerAllocationExplorer(){
 const[r1,setR1]=useState(2),[r2,setR2]=useState(1),[b,setB]=useState(2),[eta,setEta]=useState(.5);
 const d=useMemo(()=>calculatePowerAllocation(r1,r2,b,eta),[r1,r2,b,eta]);
 const geometry:EChartsOption=useMemo(()=>({animation: false,grid:{left:46,right:22,top:30,bottom:38},tooltip:{trigger:"item"},xAxis:{type:"value",min:0,max:4.2,name:"一号 kW"},yAxis:{type:"value",min:0,max:4.2,name:"二号 kW"},series:[
  {name:"可行边界",type:"line",data:[[0,0],[b,0],[0,b],[0,0]],showSymbol:false,areaStyle:{opacity:.08},lineStyle:{color:"#64748b"}},
  ...[.25,1,2.5].map(f=>({name:`目标等值线 ${f}`,type:"line" as const,showSymbol:false,data:Array.from({length:121},(_,i)=>{const a=i*Math.PI*2/120;return [r1+Math.sqrt(2*f)*Math.cos(a),r2+Math.sqrt(2*f)*Math.sin(a)];}),lineStyle:{type:"dashed" as const,width:1,color:"#94a3b8"}})),
  {name:"迭代分配",type:"line",data:d.paths,symbolSize:4,lineStyle:{color:"#b45309"}},
  {name:"请求",type:"scatter",data:[[r1,r2]],symbol:"emptyCircle",symbolSize:13,itemStyle:{color:"#dc2626"}},
  {name:"精确最优",type:"scatter",data:[d.optimum],symbolSize:10,itemStyle:{color:"#2563eb"}}
 ]}),[b,r1,r2,d]);
 const convergence:EChartsOption=useMemo(()=>({animation: false,grid:{left:46,right:22,top:30,bottom:36},tooltip:{trigger:"axis"},xAxis:{type:"value",min:0,max:18,name:"迭代 k"},yAxis:{type:"value",min:0,max:10,name:"目标 kW²"},series:[{name:"迭代目标",type:"line",data:d.values},{name:"精确最优值",type:"line",showSymbol:false,data:[[0,d.optimalValue],[18,d.optimalValue]],lineStyle:{type:"dashed",color:"#2563eb"}}]}),[d]);
 const chart=useECharts(geometry),curve=useECharts(convergence);
 const button={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,color:"var(--foreground)",background:"var(--background)",cursor:"pointer"};
 return <section aria-label="电暖器功率分配实验" className="not-prose" style={{border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",color:"var(--foreground)",minWidth:0}}>
 <p>空心红点：请求；蓝点：精确最优；棕线：从全关开始的18次投影更新。浅色三角形：可行集。虚线圆是目标等值线，超出坐标的部分截去。</p>
 <div ref={chart} style={{width:"100%",height:280}}/><div ref={curve} style={{width:"100%",height:220}}/>
 {[["一号请求",r1,setR1,0,3,.25],["二号请求",r2,setR2,0,3,.25],["合计上限",b,setB,0,4,.25],["迭代步长",eta,setEta,.25,2,.25]].map(([label,value,setter,min,max,step])=><label key={String(label)} style={{display:"block"}}>{String(label)} = {Number(value).toFixed(2)}<input aria-label={String(label)} type="range" min={Number(min)} max={Number(max)} step={Number(step)} value={Number(value)} onChange={e=>(setter as (x:number)=>void)(Number(e.target.value))} style={{display:"block",width:"100%"}}/></label>)}
 <p aria-live="polite">精确最优 = ({d.optimum.map(x=>x.toFixed(4)).join(", ")}) kW；最优值 = {d.optimalValue.toFixed(4)} kW²；总约束乘子 = {d.lambda.toFixed(4)} kW；对偶下界 = {d.dual.toFixed(4)} kW²。</p>
 <p>第18步 = ({d.last.map(x=>x.toFixed(4)).join(", ")}) kW；目标 = {d.lastValue.toFixed(4)} kW²；解距离 = {d.distance.toExponential(3)} kW；映射残差 = {d.residual.toExponential(3)} kW；约束违规 = {d.violation.toExponential(1)} kW。</p>
 <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button type="button" style={button} onClick={()=>setB(0)}>全部关机</button><button type="button" style={button} onClick={()=>{setR1(3);setR2(0);setB(1);setEta(.5);}}>单台活跃</button><button type="button" style={button} onClick={()=>{setR1(1);setR2(1);setB(4);setEta(2);}}>步长边界</button><button type="button" style={button} onClick={()=>{setR1(2);setR2(1);setB(2);setEta(.5);}}>恢复默认</button></div>
 <p style={{fontSize:13}}>坐标0…4.2 kW、目标0…10 kW²固定，动画关闭。迭代编号不是秒；步长2可能振荡。精确解由二维分段投影计算，乘子在退化边界不一定唯一。模型不含温度、单机额定上限或硬件保护。</p>
 </section>;
}
