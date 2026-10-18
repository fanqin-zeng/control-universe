"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
import {simulateIss} from "@/lib/iss";
const buttonStyle={padding:"6px 10px",border:"1px solid #94a3b8",borderRadius:5,background:"#f1f5f9",color:"#1e293b",cursor:"pointer"};
export function IssSmallGainExplorer(){
  const [g,setG]=useState(.5),[D,setD]=useState(.2),[opposite,setOpposite]=useState(false);
  const sim=useMemo(()=>simulateIss(g,D,opposite),[g,D,opposite]);
  const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:"axis"},legend:{top:4,data:sim.certified?["x","z","状态绝对值上界"]:["x","z"]},grid:{left:44,right:20,top:48,bottom:45},xAxis:{type:"value",min:0,max:8,name:"归一化时间",nameLocation:"middle",nameGap:28},yAxis:{type:"value",min:-1,max:6,name:"归一化状态"},series:[{name:"x",type:"line",showSymbol:false,data:sim.rows.map(a=>[a[0],a[1]])},{name:"z",type:"line",showSymbol:false,data:sim.rows.map(a=>[a[0],a[2]])},...(sim.certified?[{name:"状态绝对值上界",type:"line" as const,showSymbol:false,lineStyle:{type:"dashed" as const},data:sim.rows.map(a=>[a[0],a[3]])}]:[])]}),[sim]);
  const chart=useECharts(option);
  return <section aria-label="小增益实验台" style={{border:"1px solid #cbd5e1",borderRadius:10,padding:16,margin:"24px 0",background:"#fff",color:"#334155"}}>
    <strong>两个会衰减的系统，接在一起还稳吗？</strong>
    <p>x′=−x+g z+D；z′=−z{opposite?"−":"+"}g x。x(0)=1，z(0)=0；变量和时间均归一化。</p>
    <label style={{display:"block"}}>耦合系数 g={g.toFixed(2)} <input type="range" aria-label="耦合系数" min={0} max={1.2} step={.05} value={g} onChange={e=>setG(Number(e.target.value))} style={{width:"min(280px,100%)"}} /></label>
    <div style={{display:"flex",flexWrap:"wrap",gap:8,margin:"12px 0"}}>
      <button style={buttonStyle} onClick={()=>setOpposite(!opposite)}>第二条耦合：{opposite?"−g x":"+g x"}</button>
      <button style={buttonStyle} onClick={()=>setD(D===0?.2:0)}>恒定扰动 D={D.toFixed(1)}</button>
      <button style={buttonStyle} onClick={()=>{setG(.5);setD(.2);setOpposite(false);}}>恢复默认</button>
    </div>
    <p aria-live="polite">小增益乘积 g²={(g*g).toFixed(4)}；小增益条件：{sim.certified?"通过（严格小于1）":"未通过，不能据此判失稳"}。本例矩阵特征值最大实部={sim.maxReal.toFixed(4)}。</p>
    <p aria-live="polite">x(8)={sim.final[0].toFixed(6)}；z(8)={sim.final[1].toFixed(6)}；{sim.ultimateBound!==null?`最终幅度上界=${sim.ultimateBound.toFixed(6)}`:"这份幅度估计未给出有限上界"}。</p>
    <p>本例线性系统判定：{sim.maxReal<0?"渐近稳定（零扰动）":sim.maxReal===0?"有零特征值，不渐近稳定":"存在正实部特征值，原点不稳定"}。{sim.steady?`恒定扰动平衡 x*=${sim.steady[0].toFixed(6)}，z*=${sim.steady[1].toFixed(6)}。`:"不把形式上的代数解当作吸引终值。"}</p>
    <div ref={chart} style={{height:330,width:"100%",minWidth:0}}/>
    <p>虚线约束 |x| 和 |z|，不要求它们趋于虚线。反向耦合可能在小增益条件未通过时仍稳定；看本例特征值判定。RK4步长0.002，每10步绘图，全部计算节点检查上界；8时刻的读数不冒充稳态。</p>
  </section>;
}
