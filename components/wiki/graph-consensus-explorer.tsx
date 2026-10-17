"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
export function calculateGraphConsensus(w:number,alpha:number,selected:number){
 if(![w,alpha,selected].every(Number.isFinite)||w<0||w>1.5||alpha<.1||alpha>.5||selected<0||selected>20||!Number.isInteger(selected))throw new RangeError("Outside lesson domain");
 const weights=[1,w,1],states:number[][]=[[0,2,4,6]];
 for(let k=0;k<20;k++){const old=states[k],next=[...old];weights.forEach((a,i)=>{const change=alpha*a*(old[i+1]-old[i]);next[i]+=change;next[i+1]-=change;});states.push(next);}
 const eigenvalues=[0,1+w-Math.sqrt(1+w*w),2,1+w+Math.sqrt(1+w*w)];
 const values=states[selected],mean=values.reduce((a,b)=>a+b,0)/4,energy=weights.reduce((s,a,i)=>s+a*(values[i]-values[i+1])**2,0);
 const rho=Math.max(...eigenvalues.slice(1).map(v=>Math.abs(1-alpha*v)));
 return {states,values,mean,energy,eigenvalues,rho,components:w===0?2:1,limit:w===0?[1,1,5,5]:[3,3,3,3],stable:w>0&&alpha<2/eigenvalues[3],stepBound:2/eigenvalues[3]};
}
export function GraphConsensusExplorer(){
 const[w,setW]=useState(1),[alpha,setAlpha]=useState(.25),[selected,setSelected]=useState(1);
 const d=useMemo(()=>calculateGraphConsensus(w,alpha,selected),[w,alpha,selected]);
 const network:EChartsOption=useMemo(()=>({animation:false,grid:{left:40,right:40,top:40,bottom:30},xAxis:{type:"value",min:-.5,max:3.5,show:false},yAxis:{type:"value",min:-1,max:1,show:false},tooltip:{trigger:"item"},series:[...[1,w,1].flatMap((a,i)=>a===0?[]:[{type:"line" as const,showSymbol:false,data:[[i,0],[i+1,0]],lineStyle:{width:2+a*2,color:"#64748b"}}]),{name:"节点参考值",type:"scatter",symbolSize:18,data:d.values.map((v,i)=>({value:[i,0],label:{show:true,position:"top" as const,formatter:`${i+1}: ${v.toFixed(2)}℃`}})),itemStyle:{color:"#2563eb"}}]}),[w,d]);
 const evolution:EChartsOption=useMemo(()=>({animation:false,grid:{left:45,right:25,top:35,bottom:45},tooltip:{trigger:"axis"},xAxis:{type:"value",min:0,max:20,name:"轮数 k",minInterval:1},yAxis:{type:"value",min:-6,max:12,name:"参考值 ℃"},series:[...Array.from({length:4},(_,i)=>({name:`节点${i+1}`,type:"line" as const,showSymbol:false,data:d.states.map((x,k)=>[k,x[i]])})),{name:"保持的全局平均",type:"line",showSymbol:false,data:[[0,3],[20,3]],lineStyle:{type:"dashed"}},{name:"观察轮",type:"scatter",symbolSize:8,data:d.values.map(v=>[selected,v])}]}),[d,selected]);
 const graph=useECharts(network),curve=useECharts(evolution);
 const button={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,color:"var(--foreground)",background:"var(--background)",cursor:"pointer"};
 return <section className="not-prose" aria-label="四节点通信与一致性实验" style={{border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",color:"var(--foreground)",minWidth:0}}>
 <p>四个记录器仅沿连线交换旧参考值，同步更新。节点位置只画通信关系，不代表房间距离；上图标出观察轮的读数，下图显示0至20轮。</p>
 <div ref={graph} style={{width:"100%",height:160}}/><div ref={curve} style={{width:"100%",height:280}}/>
 <label style={{display:"block"}}>中间边权 w = {w.toFixed(2)}<input aria-label="中间边权" type="range" min={0} max={1.5} step={.25} value={w} onChange={e=>setW(Number(e.target.value))} style={{display:"block",width:"100%"}}/></label>
 <label style={{display:"block"}}>更新幅度 α = {alpha.toFixed(2)}<input aria-label="更新幅度" type="range" min={.1} max={.5} step={.05} value={alpha} onChange={e=>setAlpha(Number(e.target.value))} style={{display:"block",width:"100%"}}/></label>
 <label style={{display:"block"}}>观察轮数 k = {selected}<input aria-label="观察轮数" type="range" min={0} max={20} step={1} value={selected} onChange={e=>setSelected(Number(e.target.value))} style={{display:"block",width:"100%"}}/></label>
 <p aria-live="polite">第{selected}轮 = ({d.values.map(v=>v.toFixed(4)).join(", ")}) ℃；平均 = {d.mean.toFixed(4)} ℃；边差能量 = {d.energy.toFixed(4)} ℃²。</p>
 <p>特征值 = ({d.eigenvalues.map(v=>v.toFixed(4)).join(", ")})；分歧谱半径 = {d.rho.toFixed(4)}；正步长上界 = {d.stepBound.toFixed(4)}。</p>
 <p>{w===0?"图已断开：各分量趋于(1,1,5,5)℃，全局平均3保持，但不能达成全局一致。":d.stable?"固定连通无向图满足谱条件：长期极限为(3,3,3,3)℃，第20轮仍是有限轮读数。":"谱条件不满足：不能保证一般初态长期一致；20轮短图不能证明收敛。"}</p>
 <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button type="button" style={button} onClick={()=>setW(0)}>切断中间边</button><button type="button" style={button} onClick={()=>{setW(1.5);setAlpha(.5);}}>步长反例</button><button type="button" style={button} onClick={()=>setSelected(20)}>观察末轮</button><button type="button" style={button} onClick={()=>{setW(1);setAlpha(.25);setSelected(1);}}>恢复默认</button></div>
 <p style={{fontSize:13}}>固定图、无延迟、同步轮次；α为无量纲协议增益，轮数不是秒。曲线轴固定k=0…20、读数−6…12℃，关闭动画；全局平均虚线表示守恒量，断图或不稳定时不称共同极限。</p>
 </section>;
}
