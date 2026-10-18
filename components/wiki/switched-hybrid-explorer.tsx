"use client";
import {useMemo,useState}from"react";
import type{EChartsOption}from"echarts";
import{useECharts}from"./use-echarts";
import{simulateSwitched}from"@/lib/switched";
export function SwitchedHybridExplorer(){
  const[tau,setTau]=useState(2),sim=useMemo(()=>simulateSwitched(tau),[tau]);
  const option=useMemo<EChartsOption>(()=>({animation:false,legend:{top:4,data:["状态范数","当前模式"]},tooltip:{trigger:"axis"},grid:{left:65,right:48,top:45,bottom:43},xAxis:{type:"value",min:0,max:16,name:"归一化时间",nameLocation:"middle",nameGap:27},yAxis:[{type:"log",min:1e-7,max:1e5,name:"状态范数（对数）"},{type:"value",min:.8,max:2.2,name:"模式",axisLabel:{formatter:(v:number)=>v===1||v===2?String(v):""}}],series:[{name:"状态范数",type:"line",showSymbol:false,data:sim.rows.map(r=>[r[0],r[3]])},{name:"当前模式",type:"line",step:"end",yAxisIndex:1,showSymbol:false,lineStyle:{type:"dashed"},data:sim.rows.map(r=>[r[0],r[4]])}]}),[sim]);
  const chart=useECharts(option),button={padding:"6px 10px",border:"1px solid #94a3b8",background:"#f1f5f9",borderRadius:5,color:"#1e293b",cursor:"pointer"};
  return <section aria-label="切换驻留实验台" style={{border:"1px solid #cbd5e1",borderRadius:10,padding:16,margin:"24px 0",background:"#fff",color:"#334155"}}>
    <strong>两个稳定模式交替：每次停留多久？</strong>
    <p>A₁=[−1,3;0,−1]，A₂=[−1,0;3,−1]；x(0)=(1,0)，先模式1，再模式2，循环交替；状态与时间均归一化。</p>
    <label style={{display:"block"}}>每个模式停留 τ={tau.toFixed(1)} <input aria-label="驻留时间" type="range" min={.2} max={8} step={.2} value={tau} onChange={e=>setTau(Number(e.target.value))} style={{width:"min(280px,100%)"}}/></label>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"12px 0"}}><button style={button} onClick={()=>setTau(.2)}>快速切换</button><button style={button} onClick={()=>setTau(8)}>慢速切换</button><button style={button} onClick={()=>setTau(2)}>恢复默认</button></div>
    <p aria-live="polite">一个完整周期 2τ={(2*tau).toFixed(1)}；周期矩阵谱半径 ρ={sim.rho.toFixed(6)}。{Math.abs(sim.logRho)<1e-10?"临界：不能据此给渐近衰减结论。":sim.logRho<0?"这条等时交替规则下渐近稳定。":"这条规则存在增长方向，原点不稳定。"}</p>
    <p aria-live="polite">多Lyapunov充分条件要求 τ&gt;{sim.threshold.toFixed(6)}；当前{tau>sim.threshold?"满足":"未满足，不代表这条规则一定不稳定"}。该条件适用于所有满足最小驻留限制的切换，不限于本图交替规则。</p>
    <p>x(16)=({sim.final[1].toFixed(6)}, {sim.final[2].toFixed(6)})；‖x(16)‖₂={sim.final[3].toExponential(6)}。</p>
    <div ref={chart} style={{height:330,width:"100%",minWidth:0}}/>
    <p>每个模式内使用解析流，跨切换点精确分段，每0.02绘图。状态没有跳变；变化的是导数和模式。对数轴便于比较增长与衰减，有限时刻范数不替代周期谱或Lyapunov证明。</p>
  </section>;
}
