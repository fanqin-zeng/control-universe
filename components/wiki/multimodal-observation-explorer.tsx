"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "./use-echarts";
import {evaluateMultimodal,multimodalDefaults,type MultimodalParams} from "@/lib/multimodal-observation";
export function MultimodalObservationExplorer(){
 const [p,setP]=useState<MultimodalParams>({...multimodalDefaults});
 const r=useMemo(()=>evaluateMultimodal(p),[p]);
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:"axis"},legend:{data:["固定独立权重融合","本体单通道"],top:0},grid:{left:62,right:22,top:65,bottom:55},
  xAxis:{type:"value",min:0,max:.4,name:"视觉年龄 / s",nameLocation:"middle",nameGap:28},
  yAxis:{type:"log",min:.1,max:300,name:"MSE / mm²（对数轴）"},
  series:[{name:"固定独立权重融合",type:"line",showSymbol:false,data:Array.from({length:41},(_,i)=>{const age=i/100;return [age,evaluateMultimodal({...p,age}).mse];})},
  {name:"本体单通道",type:"line",lineStyle:{type:"dashed"},showSymbol:false,data:[[0,r.baseline],[.4,r.baseline]]}]}),[p,r.baseline]);
 const chart=useECharts(option);
 return <section aria-label="多模态观测实验台" style={{border:"1px solid #94a3b8",padding:16,borderRadius:10,margin:"24px 0",minWidth:0,color:"#1e293b",background:"white"}}>
  <strong>当前读数与分布误差分开看</strong>
  <p>真值100 mm，视觉随机残差示例+4 mm，本体残差示例−2 mm；假定接触有效。标准差固定4/2 mm，权重按独立假设计算，不随相关性重新整定。</p>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(230px,100%),1fr))",gap:12}}>
   <label>视觉年龄 Δ = {p.age.toFixed(2)} s<input aria-label="视觉年龄" type="range" min={0} max={.4} step={.01} value={p.age} onChange={e=>setP({...p,age:Number(e.target.value)})} style={{display:"block",width:"100%"}}/></label>
   <label>速度 v = {p.speed} mm/s<input aria-label="杯子速度" type="range" min={0} max={40} step={1} value={p.speed} onChange={e=>setP({...p,speed:Number(e.target.value)})} style={{display:"block",width:"100%"}}/></label>
   <label>误差相关系数 ρ = {p.rho.toFixed(1)}<input aria-label="误差相关系数" type="range" min={-1} max={1} step={.1} value={p.rho} onChange={e=>setP({...p,rho:Number(e.target.value)})} style={{display:"block",width:"100%"}}/></label>
  </div>
  <p><label><input type="checkbox" checked={p.vision} onChange={e=>setP({...p,vision:e.target.checked})}/>视觉有效</label>{"　"}<label><input type="checkbox" checked={p.proprio} onChange={e=>setP({...p,proprio:e.target.checked})}/>本体推算有效</label></p>
  <button onClick={()=>setP({...multimodalDefaults})} style={{border:"1px solid #64748b",borderRadius:6,padding:"6px 12px",background:"#f1f5f9",cursor:"pointer"}}>恢复默认</button>
  <p aria-live="polite">{r.available?`视觉权重=${r.w.toFixed(2)}；本体权重=${r.q.toFixed(2)}；本帧估计=${r.estimate!.toFixed(2)} mm；理论MSE=${r.mse!.toFixed(2)} mm²；本体基线=${r.baseline===null?"无效":r.baseline.toFixed(2)+" mm²"}`:"无有效估计：两路位置通道均无效；不输出当前位置或MSE。"}</p>
  <div ref={chart} style={{height:330,width:"100%",minWidth:0}}/>
  <p>曲线扫描年龄0–0.4 s，滑块读数对应所选年龄；固定对数纵轴0.1–300 mm²，同时展示默认差异与单视觉大误差。对数轴等距离表示相同倍数，不是相同差值。空通道不画线；本体基线仅在本体有效时存在。理论MSE来自解析期望；本帧残差是独立设置的演示读数，不随ρ采样，也不用于标定方差。</p>
 </section>;
}
