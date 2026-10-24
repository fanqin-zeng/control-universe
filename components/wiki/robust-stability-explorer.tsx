"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from '@/components/wiki/use-echarts';
import {robustStabilityPoint} from '@/lib/robust-stability';
export function RobustStabilityExplorer(){
 const [K,setK]=useState(4),[b,setB]=useState(.6),[N,setN]=useState(5000);
 const p=robustStabilityPoint(K,b,N);
 const left=useMemo<EChartsOption>(()=>({animation:false,title:{text:'闭环最右极点实部',left:'center',textStyle:{fontSize:14}},tooltip:{trigger:'axis'},grid:{left:55,right:20,top:50,bottom:50},xAxis:{type:'value',min:0,max:10,name:'K',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:-.5,max:.25,name:'1/s'},series:[{type:'line',symbol:'none',data:Array.from({length:191},(_,i)=>{const k=.5+i*.05;return [k,robustStabilityPoint(k,.6,5000).alpha];}),markLine:{silent:true,symbol:'none',data:[{yAxis:0}]}},{type:'scatter',symbolSize:10,data:[[K,p.alpha]]}]}),[K,p.alpha]);
 const right=useMemo<EChartsOption>(()=>({animation:false,title:{text:'候选公共证书的最大Q特征值',left:'center',textStyle:{fontSize:13}},tooltip:{trigger:'axis'},grid:{left:55,right:20,top:50,bottom:50},xAxis:{type:'value',min:.2,max:1,name:'b',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:-.6,max:.3},series:[{type:'line',symbol:'none',data:Array.from({length:161},(_,i)=>{const v=.2+i*.005;return [v,robustStabilityPoint(4,v,5000).qMax];}),markLine:{silent:true,symbol:'none',data:[{yAxis:0}]}},{type:'scatter',symbolSize:10,data:[[b,p.qMax]]}]}),[b,p.qMax]);
 const lref=useECharts(left),rref=useECharts(right);
 const button={border:'1px solid #64748b',borderRadius:6,padding:'7px 10px',background:'#f8fafc',color:'#0f172a',cursor:'pointer'};
 return <section aria-label="鲁棒稳定性实验" style={{border:'1px solid #94a3b8',borderRadius:10,padding:14,minWidth:0,maxWidth:'100%'}}>
  <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
   <label style={{display:'grid',gap:5}}>回路增益K={K.toFixed(1)}<input aria-label="回路增益 K" type="range" min={.5} max={10} step={.5} value={K} onChange={e=>setK(Number(e.target.value))} style={{width:170,maxWidth:'100%'}}/></label>
   <label style={{display:'grid',gap:5}}>振子阻尼b={b.toFixed(6)}<input aria-label="振子阻尼 b" type="range" min={.2} max={1} step={.01} value={b} onChange={e=>setB(Number(e.target.value))} style={{width:170,maxWidth:'100%'}}/></label>
   <label style={{display:'grid',gap:5}}>假定零失败的样本数N={N}<input aria-label="零失败样本数 N" type="range" min={100} max={10000} step={100} value={N} onChange={e=>setN(Number(e.target.value))} style={{width:170,maxWidth:'100%'}}/></label>
  </div>
  <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:14}}>
   <button style={button} onClick={()=>setK(10)}>题2增益10</button><button style={button} onClick={()=>setB(.5)}>原始阻尼0.5</button><button style={button} onClick={()=>setB(p.critical)}>二次证书临界值</button><button style={button} onClick={()=>{setK(4);setB(.6);setN(5000);}}>恢复分析默认</button>
  </div>
  <p data-testid="stability-readings" style={{overflowWrap:'anywhere'}}>最右极点实部={p.alpha.toFixed(6)}；GM倍率={p.gm.toFixed(6)}；GM(dB)={p.gmDB.toFixed(6)}；最小P特征值={p.pMin.toFixed(6)}；最大Q特征值={p.qMax.toFixed(6)}；零失败99.9%单侧上界={p.zeroUpper.toFixed(9)}</p>
  <p data-testid="stability-status">当前回路：{p.alpha < -1e-10?'严格稳定':p.alpha>1e-10?'不稳定':'临界，非严格稳定'}。振子冻结参数均稳定；{p.quadratic==='strict'?'严格公共二次证书成立':p.quadratic==='none'?'不存在严格公共二次证书':'二次证书临界，非严格通过'}。</p>
  <div style={{display:'flex',flexWrap:'wrap',gap:12}}><div ref={lref} style={{height:320,flex:'1 1 280px',minWidth:0}}/><div ref={rref} style={{height:320,flex:'1 1 280px',minWidth:0}}/></div>
  <p style={{fontSize:13}}>左图是三次闭环极点，K=6临界；右图是正文给定P的Q特征值，解析推导另证明本振子族的公共二次可行性恰以b={p.critical.toFixed(6)}为界。两图指标不同，不比较高低。置信读数假定固定试验零失败，拖N不会重新抽样，不能把该读数当作全部参数稳定的证明。图轴固定。</p>
 </section>;
}
