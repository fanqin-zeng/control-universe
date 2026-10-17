"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
export function calculateCoolingNumerics(k:number,n:number){
 if(!Number.isFinite(k)||k<0||k>2||!Number.isInteger(k*4)||![4,8,16,32,64].includes(n))throw new RangeError("Outside lesson grid");
 const run=(steps:number)=>{
  const h=4/steps,f=(y:number)=>-k*(y-20);let e=80,b=80,r=80;
  const rows:number[][]=[[0,80,80,80,80]];
  for(let j=0;j<steps;j++){
   e+=h*f(e);b=20+(b-20)/(1+k*h);
   const a=f(r),bb=f(r+h*a/2),cc=f(r+h*bb/2),d=f(r+h*cc);
   r+=h*(a+2*bb+2*cc+d)/6;
   const t=(j+1)*h;rows.push([t,20+60*Math.exp(-k*t),e,b,r]);
  }
  return rows;
 };
 const samples=run(n),finals=samples[n].slice(1),errors=finals.slice(1).map(v=>Math.abs(v-finals[0]));
 const convergence=[4,8,16,32,64].map(m=>{const last=run(m)[m];return [4/m,...last.slice(2).map(v=>Math.abs(v-last[1]))];});
 const h=4/n,factor=1-k*h;
 const reference=Array.from({length:201},(_,i)=>{const t=i/50;return [t,20+60*Math.exp(-k*t)];});
 return {reference,h,kh:k*h,factor,samples,finals,errors,convergence,work:[n,n,4*n],eulerDecay:k>0&&Math.abs(factor)<1,nonnegative:factor>=0,zeroCase:k===0};
}
const labels=["解析参考","前向Euler","后退Euler","RK4"],colors=["#059669","#dc2626","#7c3aed","#2563eb"];
export function CoolingNumericsExplorer(){
 const[k,setK]=useState(1),[n,setN]=useState(8);const d=useMemo(()=>calculateCoolingNumerics(k,n),[k,n]);
 const trajectories:EChartsOption=useMemo(()=>({animation:false,grid:{left:50,right:25,top:30,bottom:50},tooltip:{trigger:"axis"},xAxis:{type:"value",min:0,max:4,name:"时间 min",nameLocation:"middle",nameGap:30},yAxis:{type:"value",min:-50,max:90,name:"温度 ℃"},series:labels.map((name,i)=>({name,type:"line" as const,showSymbol:i>0,symbolSize:4,data:i===0?d.reference:d.samples.map(p=>[p[0],p[i+1]]),lineStyle:{color:colors[i]},itemStyle:{color:colors[i]}}))}),[d]);
 const refinement:EChartsOption=useMemo(()=>({animation:false,grid:{left:60,right:25,top:35,bottom:50},tooltip:{trigger:"axis"},xAxis:{type:"log",min:.0625,max:1,name:"步长 min",nameLocation:"middle",nameGap:30,logBase:2},yAxis:{type:"log",min:1e-10,max:100,name:"终点误差 ℃"},series:labels.slice(1).map((name,i)=>({name,type:"line" as const,showSymbol:true,data:d.convergence.map(p=>[p[0],p[i+1]>0?p[i+1]:null]),lineStyle:{color:colors[i+1]},itemStyle:{color:colors[i+1]}}))}),[d]);
 const chart=useECharts(trajectories),curve=useECharts(refinement);
 const button={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,color:"var(--foreground)",background:"var(--background)",cursor:"pointer"};
 return <section className="not-prose" aria-label="冷却步长与数值误差实验" style={{border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",color:"var(--foreground)",minWidth:0}}>
 <p>同一杯热水、同一模型、同一时间网格：绿线解析参考，红线前向Euler，紫线后退Euler，蓝线RK4。绿线用201个解析样点，三条数值曲线保留全部N+1个节点，横轴为真实分钟；折线之间只作连线，误差图仅核终点。</p>
 <div ref={chart} style={{width:"100%",height:300}}/><div ref={curve} style={{width:"100%",height:260}}/>
 <p style={{fontSize:13}}>下图比较五种步长的终点绝对误差，越小的步长在左侧。零误差没有对数，故不画对应点，不用正数替代。{k===0?"当前k=0：各方法精确保持80℃，五种步长误差全为0，空图表示持平。":"这里只比较同一网格下的误差；RK4每步四次右端计算，预算不同。"}</p>
 <label style={{display:"block"}}>冷却系数 k = {k.toFixed(2)} min⁻¹<input aria-label="冷却系数" type="range" min={0} max={2} step={.25} value={k} onChange={e=>setK(Number(e.target.value))} style={{display:"block",width:"100%"}}/></label>
 <label style={{display:"block"}}>步数 N = {n}<select aria-label="积分步数" value={n} onChange={e=>setN(Number(e.target.value))} style={{marginLeft:10,padding:5,color:"var(--foreground)",background:"var(--background)",border:"1px solid var(--border)"}}>{[4,8,16,32,64].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
 <p>步长 h = {d.h.toFixed(4)} min；kh = {d.kh.toFixed(4)}；Euler一步因子 = {d.factor.toFixed(4)}。</p>
 <p aria-live="polite">4 min终温（解析、前向、后退、RK4）= ({d.finals.map(v=>v.toFixed(4)).join(", ")}) ℃。终点绝对误差（前向、后退、RK4）= ({d.errors.map(v=>v.toExponential(6)).join(", ")}) ℃。</p>
 <p>{d.zeroCase?"无冷却：因子1保持常数，不能当作需要衰减的情况。":d.eulerDecay?(d.nonnegative?"Euler温差衰减且不跨过室温；精度仍需检查。":"Euler温差虽衰减，却会跨室温振荡；数值稳定不等于保持物理形状。") :"Euler位于衰减稳定域边界：正负温差交替、不衰减，不能解释成真实热振荡。"}</p>
 <p>预算：前向Euler {n} 次右端计算；RK4 {4*n} 次；后退Euler {n} 次本例闭式更新，一般隐式问题还需代数求解。</p>
 <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button type="button" style={button} disabled={n===64} onClick={()=>setN(Math.min(64,2*n))}>步长减半</button><button type="button" style={button} onClick={()=>{setK(2);setN(4);}}>振荡边界</button><button type="button" style={button} onClick={()=>setK(0)}>无冷却</button><button type="button" style={button} onClick={()=>{setK(1);setN(8);}}>恢复默认</button></div>
 <p style={{fontSize:13}}>上图时间0…4min、温度−50…90℃固定；下图h=1/16…1min、误差1e−10…100℃固定，动画关闭，无抽稀。默认初温80℃、室温20℃；这是给定模型的数值实验，不是实际杯具测量。</p>
 </section>;
}
