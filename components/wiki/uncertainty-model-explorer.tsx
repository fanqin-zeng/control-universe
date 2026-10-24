"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from '@/components/wiki/use-echarts';
import {uncertaintyPoint} from '@/lib/uncertainty-model';

function chart(title:string,series:EChartsOption['series'],max:number):EChartsOption{
  return {animation: false,title:{text:title,left:'center',textStyle:{fontSize:14}},
    tooltip:{trigger:'axis'},legend:{type:'scroll',top:30,left:5,right:5},
    grid:{left:50,right:20,top:75,bottom:50},
    xAxis:{type:'log',min:.01,max:100,name:'rad/s',nameLocation:'middle',nameGap:30},
    yAxis:{type:'value',min:0,max: max},series};
}
export function UncertaintyModelExplorer(){
  const [K,setK]=useState(.8),[T,setT]=useState(1.3),[gain,setGain]=useState(2),[power,setPower]=useState(0);
  const w=10**power,point=uncertaintyPoint(K,T,gain,w);
  const data=useMemo(()=>Array.from({length:501},(_,i)=>uncertaintyPoint(K,T,gain,10**(-2+4*i/500))),[K,T,gain]);
  const left=useMemo(()=>chart('一阶对象的相对误差',[
    {name:'|Δm|',type:'line',symbol:'none',data:data.map(p=>[p.w,p.relative])},
    {name:'解析边界 |Wcert|',type:'line',symbol:'none',data:data.map(p=>[p.w,p.weight])},
  ],1.2),[data]);
  const right=useMemo(()=>chart('MIMO：输入与输出回路',[
    {name:'σmax(T_O)',type:'line',symbol:'none',data:data.map(p=>[p.w,p.svOutput])},
    {name:'σmax(T_I)',type:'line',symbol:'none',data:data.map(p=>[p.w,p.svInput])},
  ],2.5),[data]);
  const lref=useECharts(left),rref=useECharts(right);
  return <section aria-label="不确定性建模实验" style={{border:'1px solid #94a3b8',borderRadius:10,padding:14,maxWidth:'100%',minWidth:0}}>
    <div style={{display:'flex',flexWrap:'wrap',gap:14}}>
      <label style={{display:'grid',gap:4}}>对象增益 K={K.toFixed(2)}<input aria-label="对象增益 K" type="range" min={.8} max={1.2} step={.01} value={K} onChange={e=>setK(Number(e.target.value))} style={{width:160,maxWidth:'100%'}}/></label>
      <label style={{display:'grid',gap:4}}>时间常数 T={T.toFixed(2)} s<input aria-label="时间常数 T" type="range" min={.8} max={1.3} step={.01} value={T} onChange={e=>setT(Number(e.target.value))} style={{width:160,maxWidth:'100%'}}/></label>
      <label style={{display:'grid',gap:4}}>控制器输入增益 g={gain.toFixed(1)}<input aria-label="控制器输入增益 g" type="range" min={.5} max={4} step={.5} value={gain} onChange={e=>setGain(Number(e.target.value))} style={{width:160,maxWidth:'100%'}}/></label>
      <label style={{display:'grid',gap:4}}>读数频率 ω={w.toFixed(3)} rad/s<input aria-label="读数频率" type="range" min={-2} max={2} step={.1} value={power} onChange={e=>setPower(Number(e.target.value))} style={{width:160,maxWidth:'100%'}}/></label>
    </div>
    <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:12}}><button onClick={()=>setGain(1)}>单位控制器</button><button onClick={()=>{setK(.8);setT(1.3);setGain(2);setPower(0);}}>恢复建模默认</button></div>
    <p data-testid="uncertainty-readings" style={{overflowWrap:'anywhere'}}>当前频点：绝对误差={point.absolute.toFixed(6)}；相对误差={point.relative.toFixed(6)}；解析边界={point.weight.toFixed(6)}；σmax(T_O)={point.svOutput.toFixed(6)}；σmax(T_I)={point.svInput.toFixed(6)}；矩阵差F范数={point.matrixDifference.toFixed(6)}</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,310px),1fr))',gap:12}}><div ref={lref} style={{height:350,minWidth:0}}/><div ref={rref} style={{height:350,minWidth:0}}/></div>
    <p style={{fontSize:14}}>左图只比较相对误差与同量纲边界；解析覆盖限本页固定参数区间。右图是同一标称对象在不同输入增益下的端口观察，g=1时两矩阵相同。当前读数是单频幅比，501点曲线不当作H∞范数或全集合稳定证明。图轴固定，窗外裁剪。</p>
  </section>;
}
