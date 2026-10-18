"use client";
import {useMemo,useState} from "react";
import type {EChartsOption} from "echarts";
import {useECharts} from "@/components/wiki/use-echarts";
import {secondOrder,secondMagnitude} from "@/lib/loop-shaping";
function option(title:string,series:EChartsOption["series"],ymin:number,ymax:number):EChartsOption{return {title:{text:title,left:"center",textStyle:{fontSize:15}},legend:{type:"scroll",top:30,left:8,right:8},tooltip:{trigger:"axis"},grid:{top:80,left:55,right:45,bottom:45},animation: false,xAxis:{type:"log",min:.01,max:100,axisLabel:{hideOverlap:true},name:"rad/s"},yAxis:{type:"value",min:ymin,max:ymax},series};}
export function ClosedLoopFreqExplorer(){
 const [zeta,setZeta]=useState(.5);const values=useMemo(()=>secondOrder(zeta),[zeta]);
 const plot=useMemo<EChartsOption>(()=>option("二阶闭环幅频",[{name:"闭环T",type:"line",symbol:"none",data:Array.from({length:401},(_,i)=>{const w=10**(-2+i/100);return [w,20*Math.log10(secondMagnitude(zeta,w))];})},{name:"半功率参考",type:"line",symbol:"none",lineStyle:{type:"dashed"},data:[[.01,-10*Math.log10(2)],[100,-10*Math.log10(2)]]}],-50,20),[zeta]);const ref=useECharts(plot);
 return <section aria-label="二阶频率交互" style={{minWidth:0,maxWidth:"100%"}}><div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}><label htmlFor="loop-zeta">阻尼比 ζ</label><input id="loop-zeta" aria-label="阻尼比 ζ" type="range" min={.1} max={1.5} step={.01} value={zeta} onChange={e=>setZeta(Number(e.target.value))} style={{width:"min(100%,220px)"}}/><span>{zeta.toFixed(2)}</span><button onClick={()=>setZeta(.5)}>恢复阻尼默认</button></div>
 <p>标准无零点二阶，ωn=10；极值与带宽采用精确公式。ζ≥1时超调0，ζ≥1/√2时非零谐振峰消失。</p><p data-testid="closed-values" style={{overflowWrap:"anywhere"}}>Mr={values.mr.toFixed(6)}（{values.mrDb.toFixed(6)}dB）；ωr={values.wr.toFixed(6)}；ωb={values.wb.toFixed(6)} rad/s；Mp={values.mp.toFixed(6)}%</p><div ref={ref} style={{height:360,minWidth:0}}/><p>半功率线为−10log10(2)dB；图窗外值会裁剪，不改变计算读数。</p></section>;
}
