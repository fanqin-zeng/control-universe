"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from '@/components/wiki/use-echarts';
import {resonanceGrid} from '@/lib/resonance-robustness';

export function ResonanceRobustnessExplorer(){
  const [wn,setWn]=useState(300),[zeta,setZeta]=useState(.1);
  const values=useMemo(()=>resonanceGrid(wn,zeta),[wn,zeta]);
  const option=useMemo<EChartsOption>(()=>({
    animation: false,
    tooltip:{trigger:'axis'},legend:{type:'scroll',top:8,left:8,right:8},
    grid:{left:55,right:20,top:60,bottom:55},
    xAxis:{type:'log',min:.01,max:10000,name:'rad/s',nameLocation:'middle',nameGap:30},
    yAxis:{type:'value',min:0,max:15,name:'幅比'},
    series:[
      {name:'标称 |T|',type:'line',symbol:'none',data:values.data.map(p=>[p.w,p.t])},
      {name:'误差 |Δm|',type:'line',symbol:'none',data:values.data.map(p=>[p.w,p.delta])},
      {name:'同频乘积 |TΔm|',type:'line',symbol:'none',data:values.data.map(p=>[p.w,p.product]),markLine:{symbol:'none',silent:true,data:[{yAxis:1,label:{formatter:'1'}}]}},
    ],
  }),[values]);
  const ref=useECharts(option);
  return <section aria-label="共振与鲁棒性实验" style={{maxWidth:'100%',minWidth:0,border:'1px solid #94a3b8',borderRadius:10,padding:16}}>
    <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
      <label style={{display:'grid',gap:4}}>共振频率 ωn（rad/s）<input aria-label="共振频率" type="range" min={50} max={800} step={10} value={wn} onChange={e=>setWn(Number(e.target.value))} style={{width:'min(220px,100%)'}}/><span>{wn}</span></label>
      <label style={{display:'grid',gap:4}}>共振阻尼 ζ<input aria-label="共振阻尼" type="range" min={.01} max={.5} step={.01} value={zeta} onChange={e=>setZeta(Number(e.target.value))} style={{width:'min(220px,100%)'}}/><span>{zeta.toFixed(2)}</span></label>
      <button onClick={()=>{setWn(300);setZeta(.1);}}>恢复共振默认</button>
    </div>
    <p data-testid="resonance-values" style={{overflowWrap:'anywhere'}}>网格最大值：|T|={values.tMax.toFixed(6)}；|Δm|={values.deltaMax.toFixed(6)}；两峰相乘={(values.tMax*values.deltaMax).toFixed(6)}；同频乘积={values.productMax.toFixed(6)}</p>
    <div ref={ref} style={{height:360,width:'100%',minWidth:0}}/>
    <p style={{fontSize:14}}>固定同一个理想PID；0.01–10000 rad/s，1601个频点。图轴固定，超过15的部分裁剪；网格未超1不能证明全频都小于1。连续峰和实际闭环极点由下方Notebook核对。</p>
  </section>;
}
