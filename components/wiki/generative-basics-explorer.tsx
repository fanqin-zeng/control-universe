"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {GENERATIVE_DEFAULT,generativeSnapshot} from '@/lib/generative-basics';
export function GenerativeBasicsExplorer(){
 const [c,setC]=useState({...GENERATIVE_DEFAULT});const r=useMemo(()=>generativeSnapshot(c),[c]);
 const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{top:0,data:['解析标准差','Euler标准差']},grid:{left:45,right:18,top:45,bottom:45},xAxis:{type:'value',min:0,max:1,interval:.25,name:'生成时间 t',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:0,max:4,interval:1,name:'标准差'},series:[{name:'解析标准差',type:'line',showSymbol:false,lineStyle:{color:'#2563eb',type:'dashed'},data:Array.from({length:201},(_,i)=>{const t=i/200;return [t,Math.sqrt((1-t)**2+(t*c.s)**2)];})},{name:'Euler标准差',type:'line',symbolSize:5,lineStyle:{color:'#d97706'},data:r.flow.history.map(v=>[v.t,v.std])}]}),[r,c.s]);const chart=useECharts(option);
 const style={padding:7,background:'#fff',color:'#172033',border:'1px solid #94a3b8',borderRadius:5};
 const controls=[['m','数据均值',[0,2]],['s','数据标准差',[.5,1,2]],['a','信号保留率',[.1,.5,.9]],['t','流场查询时间',[0,.25,.5,.75,1]],['n','Euler步数',[1,4,8,16,64]]] as const;
 return <section aria-label="高斯生成实验" className="not-prose" style={{background:'#fff',color:'#172033',border:'1px solid #94a3b8',borderRadius:10,padding:16,margin:'20px 0',minWidth:0}}>
 <strong>均值正确时，分布宽度也对了吗？</strong>
 {controls.map(([key,label,values])=><label key={key} style={{display:'block',marginTop:10}}>{label} <select aria-label={label} value={c[key]} onChange={e=>setC({...c,[key]:+e.target.value})} style={style}>{values.map(v=><option key={v} value={v}>{v}</option>)}</select></label>)}
 <label style={{display:'block',marginTop:10}}><input aria-label="错误速度符号" type="checkbox" checked={c.sign===-1} onChange={e=>setC({...c,sign:e.target.checked?-1:1})}/> 故意把生成速度取反（时间仍从0到1）</label>
 <button onClick={()=>setC({...GENERATIVE_DEFAULT})} style={{...style,marginTop:12}}>恢复默认</button>
 <div aria-live="polite" data-generative-readout style={{overflowWrap:'anywhere'}}>
 <p>加噪均值={r.diffusion.mean.toFixed(6)}；方差={r.diffusion.variance.toFixed(6)}；最优噪声预测={r.diffusion.noise.toFixed(6)}。</p>
 <p>观测固定 y=1：条件均值={r.diffusion.estimate.toFixed(6)}；后验方差={r.diffusion.posteriorVariance.toFixed(6)}；仅条件均值输出的方差={r.diffusion.estimateVariance.toFixed(6)}。</p>
 <p>查询 x=1：流速度={r.field.velocity.toFixed(6)}；条件标签剩余MSE={r.field.risk.toFixed(6)}。</p>
 <p>Euler终点均值={r.flow.mean.toFixed(6)}；标准差={r.flow.std.toFixed(6)}；高斯W₂距离={r.flow.w2.toFixed(6)}。目标均值={c.m}；标准差={c.s}。</p>
 </div>
 <div ref={chart} style={{width:'100%',height:300}}/>
 <p>蓝虚线是独立端点插值的解析边缘宽度，橙线是Euler仿射映射后的整批标准差。解析曲线独立加密，Euler线只连接实际步进节点；三条确定性探针用于恢复仿射系数，不是三样本的经验标准差。固定纵轴0–4。加噪参数与流时间分别控制两个实验，互不替代。当前使用已知高斯解析场，没有训练网络。</p>
 </section>;
}
