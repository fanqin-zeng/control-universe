"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
export function calculateFiniteHorizon(n:number,q:number,r:number,s:number,x0:number){
 if(![n,q,r,s,x0].every(Number.isFinite)||!Number.isInteger(n)||n<2||n>8||q<0||q>2||r<.5||r>2||s<0||s>2||x0< -2||x0>2)throw new RangeError("Outside lesson domain");
 const p=Array(n+1).fill(0) as number[],gains=Array(n).fill(0) as number[];p[n]=s;
 for(let k=n-1;k>=0;k--){gains[k]=p[k+1]/(r+p[k+1]);p[k]=q+r*p[k+1]/(r+p[k+1]);}
 const states=[x0],actions:number[]=[],stages:number[]=[];
 for(let k=0;k<n;k++){const u=-gains[k]*states[k];actions.push(u);stages.push((q*states[k]**2+r*u*u)/2);states.push(states[k]+u);}
 const terminal=s*states[n]**2/2,total=stages.reduce((a,b)=>a+b,terminal),value=p[0]*x0*x0/2;
 const bellman=stages.map((v,k)=>p[k]*states[k]**2/2-v-p[k+1]*states[k+1]**2/2);
 return {p,gains,states,actions,stages,terminal,total,value,bellman};
}
export function FiniteHorizonExplorer(){
 const[n,setN]=useState(2),[q,setQ]=useState(1),[r,setR]=useState(1),[s,setS]=useState(1),[x0,setX0]=useState(2);
 const d=useMemo(()=>calculateFiniteHorizon(n,q,r,s,x0),[n,q,r,s,x0]);
 const trajectory:EChartsOption=useMemo(()=>({animation: false,grid:{left:44,right:28,top:30,bottom:38},tooltip:{trigger:"axis"},xAxis:{type:"value",min:0,max:8,interval:1,name:"步 k"},yAxis:{type:"value",min:-2.2,max:2.2,name:"归一化读数"},series:[{name:"位置 x",type:"line",symbolSize:7,data:d.states.map((x,k)=>[k,x])},{name:"本步位移 u",type:"line",symbolSize:7,data:d.actions.map((u,k)=>[k,u]),lineStyle:{type:"dashed"}}]}),[d]);
 const coefficients:EChartsOption=useMemo(()=>({animation: false,grid:{left:44,right:28,top:30,bottom:38},tooltip:{trigger:"axis"},xAxis:{type:"value",min:0,max:8,interval:1,name:"步 k"},yAxis:{type:"value",min:0,max:4.2,name:"值函数系数 P"},series:[{name:"倒推 P",type:"line",symbolSize:7,data:d.p.map((p,k)=>[k,p])}]}),[d]);
 const chart=useECharts(trajectory),coeff=useECharts(coefficients);
 const button={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,color:"var(--foreground)",background:"var(--background)",cursor:"pointer"};
 return <section aria-label="小车有限步回家实验" className="not-prose" style={{border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",color:"var(--foreground)",minWidth:0}}>
 <p>实线：每步开始时的位置；虚线：本步位移。离散点的连线只辅助读图，不表示步内运动。先从终端 P[N]=s 倒推下图，再从初始位置正向执行上图。</p>
 <div ref={chart} style={{width:"100%",height:250}}/><div ref={coeff} style={{width:"100%",height:220}}/>
 {[["动作步数",n,setN,2,8,1],["过程权重",q,setQ,0,2,.5],["动作权重",r,setR,.5,2,.5],["终端权重",s,setS,0,2,.5],["初始位置",x0,setX0,-2,2,.5]].map(([label,value,setter,min,max,step])=><label key={String(label)} style={{display:"block"}}>{String(label)} = {Number(value).toFixed(2)}<input aria-label={String(label)} type="range" min={Number(min)} max={Number(max)} step={Number(step)} value={Number(value)} onChange={e=>(setter as (x:number)=>void)(Number(e.target.value))} style={{display:"block",width:"100%"}}/></label>)}
 <p aria-live="polite">位置 = [{d.states.map(x=>x.toFixed(4)).join(", ")}]；动作 = [{d.actions.map(x=>x.toFixed(4)).join(", ")}]。</p>
 <p>P = [{d.p.map(x=>x.toFixed(4)).join(", ")}]；K = [{d.gains.map(x=>x.toFixed(4)).join(", ")}]。</p>
 <p>总代价 = {d.total.toFixed(4)}；初始值函数 = {d.value.toFixed(4)}；终端项 = {d.terminal.toFixed(4)}；Bellman最大绝对残差 = {Math.max(...d.bellman.map(Math.abs)).toExponential(2)}。</p>
 <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button type="button" style={button} onClick={()=>setX0(0)}>零初态</button><button type="button" style={button} onClick={()=>{setQ(0);setS(0);}}>只惩罚动作</button><button type="button" style={button} onClick={()=>setS(2)}>加重终端</button><button type="button" style={button} onClick={()=>{setN(2);setQ(1);setR(1);setS(1);setX0(2);}}>恢复默认</button></div>
 <p style={{fontSize:13}}>全部量已归一化；动作是位移而非力。无输入限幅、扰动或硬终点约束。步轴0…8、位置/动作轴±2.2、P轴0…4.2固定，动画关闭；末端只罚偏差，不保证回到零。不同权重改变了目标，不用于性能排名。</p>
 </section>;
}
