"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
export function calculateBracketMotion(e:number,theta:number,progress:number){
 if(![e,theta,progress].every(Number.isFinite)||e<.1||e>.8||theta< -Math.PI/2||theta>Math.PI/2||progress<0||progress>1)throw new RangeError("Outside lesson domain");
 const pose=(t:number)=>{
  if(t<=e)return [t*Math.cos(theta),t*Math.sin(theta),theta];
  if(t<=2*e)return [e*Math.cos(theta),e*Math.sin(theta),theta+t-e];
  const a=theta+e;
  if(t<=3*e)return [e*Math.cos(theta)-(t-2*e)*Math.cos(a),e*Math.sin(theta)-(t-2*e)*Math.sin(a),a];
  return [e*(Math.cos(theta)-Math.cos(a)),e*(Math.sin(theta)-Math.sin(a)),a-(t-3*e)];
 };
 const samples=Array.from({length:101},(_,i)=>{const t=4*e*i/100;return [t,...pose(t)];});
 const net=pose(4*e),bracket=[Math.sin(theta),-Math.cos(theta)],approx=bracket.map(v=>e*e*v);
 const selectedTime=4*e*progress,selected=pose(selectedTime),norm=Math.hypot(net[0],net[1]),error=Math.hypot(net[0]-approx[0],net[1]-approx[1]);
 const curve=Array.from({length:81},(_,i)=>{const a=i/100;return a===0?[0,...bracket]:[a,(Math.cos(theta)-Math.cos(theta+a))/a,(Math.sin(theta)-Math.sin(theta+a))/a];});
 return {samples,net,bracket,approx,selectedTime,selected,norm,error,scaled:[net[0]/e**2,net[1]/e**2],duration:4*e,curve};
}
export function BracketMotionExplorer(){
 const[e,setE]=useState(.5),[theta,setTheta]=useState(0),[progress,setProgress]=useState(1);
 const d=useMemo(()=>calculateBracketMotion(e,theta,progress),[e,theta,progress]);
 const geometry:EChartsOption=useMemo(()=>({animation: false,grid:{left:45,right:45,top:40,bottom:50},tooltip:{trigger:"item"},xAxis:{type:"value",min:-1,max:1,name:"x m"},yAxis:{type:"value",min:-1,max:1,name:"y m"},series:[
  {name:"四段轨迹",type:"line",showSymbol:false,data:d.samples.map(p=>[p[1],p[2]])},
  {name:"当前车身朝向",type:"line",showSymbol:false,lineStyle:{color:"#b45309",width:3},itemStyle:{color:"#b45309"},data:[[d.selected[0],d.selected[1]],[d.selected[0]+.15*Math.cos(d.selected[2]),d.selected[1]+.15*Math.sin(d.selected[2])]]},
  {name:"车头标记",type:"scatter",symbol:"arrow",symbolRotate:d.selected[2]*180/Math.PI-90,symbolSize:12,itemStyle:{color:"#b45309"},data:[[d.selected[0]+.15*Math.cos(d.selected[2]),d.selected[1]+.15*Math.sin(d.selected[2])]]},
  {name:"循环终点",type:"scatter",symbolSize:10,data:[[d.net[0],d.net[1]]],itemStyle:{color:"#2563eb"}},
  {name:"二阶主项终点",type:"scatter",symbol:"emptyCircle",symbolSize:10,data:[d.approx],itemStyle:{color:"#dc2626"}}
 ]}),[d]);
 const scaling:EChartsOption=useMemo(()=>({animation: false,grid:{left:45,right:25,top:30,bottom:40},tooltip:{trigger:"axis"},xAxis:{type:"value",min:0,max:.8,name:"段时长 s"},yAxis:{type:"value",min:-1.1,max:1.1,name:"归一化分量"},series:[{name:"dx/ε²",type:"line",showSymbol:false,data:d.curve.map(p=>[p[0],p[1]])},{name:"dy/ε²",type:"line",showSymbol:false,data:d.curve.map(p=>[p[0],p[2]])},...d.bracket.map((v,i)=>({name:`括号${i===0?'x':'y'}极限`,type:"line" as const,showSymbol:false,data:[[0,v],[.8,v]],lineStyle:{type:"dashed" as const}})),{name:"当前时长",type:"scatter",symbolSize:9,data:[[e,d.scaled[0]],[e,d.scaled[1]]]}]}),[d,e]);
 const chart=useECharts(geometry),scale=useECharts(scaling);
 const button={padding:"6px 10px",border:"1px solid var(--border)",borderRadius:6,color:"var(--foreground)",background:"var(--background)",cursor:"pointer"};
 return <section aria-label="搬运车小动作与李括号实验" className="not-prose" style={{border:"1px solid var(--border)",borderRadius:8,padding:14,margin:"16px 0",color:"var(--foreground)",minWidth:0}}>
 <p>顺序：前进→左原转→后退→右原转，各持续ε。蓝线为精确位置轨迹，棕箭头为选定时刻车头；蓝实点是循环终点，红空心点是二阶主项终点，不是另一个控制方案。</p>
 <div ref={chart} style={{width:"100%",maxWidth:440,aspectRatio:"1",margin:"0 auto"}}/><div ref={scale} style={{width:"100%",height:240}}/>
 <p style={{fontSize:13}}>下图两条实线分别是dx/ε²、dy/ε²，虚线分别是括号x、y分量的零时长极限；零点按解析极限填，不执行除零。</p>
 <label style={{display:"block"}}>每段时长 = {e.toFixed(2)} s<input aria-label="每段时长" type="range" min={.1} max={.8} step={.1} value={e} onChange={ev=>setE(Number(ev.target.value))} style={{display:"block",width:"100%"}}/></label>
 <label style={{display:"block"}}>初始朝向 = {(theta*180/Math.PI).toFixed(0)}°（{theta.toFixed(4)} rad）<input aria-label="初始朝向" type="range" min={-90} max={90} step={15} value={theta*180/Math.PI} onChange={ev=>setTheta(Number(ev.target.value)*Math.PI/180)} style={{display:"block",width:"100%"}}/></label>
 <label style={{display:"block"}}>观察进度 = {(progress*100).toFixed(1)}%<input aria-label="观察进度" type="range" min={0} max={100} step={.5} value={progress*100} onChange={ev=>setProgress(Number(ev.target.value)/100)} style={{display:"block",width:"100%"}}/></label>
 <p aria-live="polite">净位移 = ({d.net[0].toFixed(4)}, {d.net[1].toFixed(4)}) m；二阶主项 = ({d.approx[0].toFixed(4)}, {d.approx[1].toFixed(4)}) m；两者误差长度 = {d.error.toFixed(4)} m。</p>
 <p>净位移/ε² = ({d.scaled.map(v=>v.toFixed(4)).join(", ")})；括号极限 = ({d.bracket.map(v=>v.toFixed(4)).join(", ")})；总时长 = {d.duration.toFixed(2)} s。</p>
 <p>观察时刻 = {d.selectedTime.toFixed(3)} s；位置 = ({d.selected[0].toFixed(4)}, {d.selected[1].toFixed(4)}) m；朝向 = {d.selected[2].toFixed(4)} rad。</p>
 <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button type="button" style={button} onClick={()=>{setE(.1);setProgress(1);}}>缩小动作</button><button type="button" style={button} onClick={()=>setProgress(.375)}>观察转向</button><button type="button" style={button} onClick={()=>setTheta(Math.PI/2)}>初始朝北</button><button type="button" style={button} onClick={()=>{setE(.5);setTheta(0);setProgress(1);}}>恢复默认</button></div>
 <p style={{fontSize:13}}>位置轴±1 m、段时长轴0…0.8 s、归一化轴±1.1固定；动画关闭。车身箭头长0.15 m仅作方向标记；101节点来自精确分段流，不是数值积分。无障碍物、惯性或限幅；有限ε的净位移不等于括号流。</p>
 </section>;
}
