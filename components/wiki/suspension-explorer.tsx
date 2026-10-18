"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
export function calculateSuspension(zeta:number,time:number){
 if(!Number.isFinite(zeta)||zeta<0||zeta>2||Math.abs(zeta*20-Math.round(zeta*20))>1e-10||!Number.isFinite(time)||time<0||time>3)throw new RangeError("Outside lesson range");
 const m=250,k=16000,wn=8,y0=.05,c=2*zeta*wn*m;
 const at=(t:number)=>{let y:number,v:number;
  if(zeta<1){const q=Math.sqrt(1-zeta*zeta),wd=wn*q,e=Math.exp(-zeta*wn*t);y=y0*e*(Math.cos(wd*t)+zeta/q*Math.sin(wd*t));v=-y0*wn/q*e*Math.sin(wd*t);}
  else if(zeta===1){const e=Math.exp(-wn*t);y=y0*(1+wn*t)*e;v=-y0*wn*wn*t*e;}
  else{const q=Math.sqrt(zeta*zeta-1),r1=wn*(-zeta+q),r2=wn*(-zeta-q),a=-r2/(r1-r2),b=r1/(r1-r2);y=y0*(a*Math.exp(r1*t)+b*Math.exp(r2*t));v=y0*(a*r1*Math.exp(r1*t)+b*r2*Math.exp(r2*t));}
  return [t,y,v,.5*m*v*v+.5*k*y*y,c*v*v];
 };
 return {zeta,c,wn,samples:Array.from({length:301},(_,j)=>at(j/100)),cursor:at(time),end:at(3)};
}
export function SuspensionExplorer(){
 const[zeta,setZeta]=useState(.3),[time,setTime]=useState(1);const d=useMemo(()=>calculateSuspension(zeta,time),[zeta,time]);
 const option=useMemo<EChartsOption>(()=>({animation:false,grid:{left:50,right:20,top:30,bottom:50},tooltip:{trigger:"axis"},xAxis:{type:"value",min:0,max:3,name:"时间 s",nameLocation:"middle",nameGap:30},yAxis:{type:"value",min:-5,max:5.5,name:"位移 cm"},series:[{name:"车身位移",type:"line",smooth:false,showSymbol:false,data:d.samples.map(p=>[p[0],100*p[1]]),lineStyle:{color:"#2563eb"},itemStyle:{color:"#2563eb"},markPoint:{symbol:"circle",symbolSize:8,label:{show:false},data:[{name:"当前时刻",coord:[time,100*d.cursor[1]]}]} }]}),[d,time]);
 const energy=useMemo<EChartsOption>(()=>({animation:false,grid:{left:50,right:20,top:30,bottom:50},tooltip:{trigger:"axis"},xAxis:{type:"value",min:0,max:3,name:"时间 s",nameLocation:"middle",nameGap:30},yAxis:{type:"value",min:0,max:21,name:"总能量 J"},series:[{name:"机械能",type:"line",showSymbol:false,data:d.samples.map(p=>[p[0],p[3]]),lineStyle:{color:"#059669"},itemStyle:{color:"#059669"},markPoint:{symbol:"circle",symbolSize:8,label:{show:false},data:[{name:"当前时刻",coord:[time,d.cursor[3]]}]} }]}),[d,time]);
 const chart=useECharts(option),power=useECharts(energy);const button={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,color:"var(--foreground)",background:"var(--background)",cursor:"pointer"};
 return <section className="not-prose" aria-label="压下车身再松手" style={{padding:14,border:"1px solid var(--border)",borderRadius:8,margin:"16px 0",minWidth:0,color:"var(--foreground)"}}>
 <p>向下压5 cm再松手，支座保持不动。调节阻尼比，比较车身回到原位的过程和机械能的变化。</p>
 <div ref={chart} style={{width:"100%",height:280}}/><div ref={power} style={{width:"100%",height:230}}/>
 <label style={{display:"block"}}>阻尼比 ζ = {zeta.toFixed(2)}<input aria-label="阻尼比" type="range" min={0} max={2} step={.05} value={zeta} onChange={e=>setZeta(Number(e.target.value))} style={{display:"block",width:"100%"}}/></label>
 <label style={{display:"block"}}>读数时刻 t = {time.toFixed(2)} s<input aria-label="读数时刻" type="range" min={0} max={3} step={.01} value={time} onChange={e=>setTime(Number(e.target.value))} style={{display:"block",width:"100%"}}/></label>
 <p>m = 250kg，k = 16000N/m，ωₙ = {d.wn.toFixed(4)}rad/s，c = {d.c.toFixed(4)}N·s/m；初值 y = 0.05m，速度0m/s。</p>
 <p aria-live="polite">当前位移 = {(100*d.cursor[1]).toFixed(4)} cm，速度 = {d.cursor[2].toFixed(4)} m/s；总能量 = {d.cursor[3].toFixed(4)} J，阻尼耗散功率 = {d.cursor[4].toFixed(4)} W。</p>
 <p>{zeta===0?"无阻尼：能量保持20J，位移持续振荡，不会自行平息。":zeta<1?"欠阻尼：本例位移振荡衰减，总能量不增加。":zeta===1?"临界阻尼：本例位移不反向，能量逐渐耗散。":"过阻尼：车身不再来回晃，但回到原位可能更慢。"}</p>
 <div style={{display:"flex",flexWrap:"wrap",gap:8}}><button type="button" style={button} onClick={()=>setZeta(0)}>无阻尼</button><button type="button" style={button} onClick={()=>setZeta(1)}>临界阻尼</button><button type="button" style={button} onClick={()=>setZeta(2)}>过阻尼</button><button type="button" style={button} onClick={()=>{setZeta(.3);setTime(1);}}>恢复默认</button></div>
 <p style={{fontSize:13}}>拖动“读数时刻”，可以查看图中任意时刻的数值；曲线画到3秒，仍可继续运动。</p>
 </section>;
}
