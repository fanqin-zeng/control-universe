"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {DEFAULT_TUNING,simulateFuzzy,type Design} from '../../lib/fuzzy-controller';
export default function FuzzyTuningExplorer(){
 const [n,setN]=useState(5),[Ge,setGe]=useState(2),[Gce,setGce]=useState(.5),[Gu,setGu]=useState(12);
 const [design,setDesign]=useState<Design>('repaired');
 const r=useMemo(()=>simulateFuzzy({n,Ge,Gce,Gu,design}),[n,Ge,Gce,Gu,design]);
 const chart=(torque:boolean):EChartsOption=>({animation:false,grid:{left:55,right:20,top:35,bottom:45},
  title:{text:torque?'实际力矩 u(t)':'角度 θ(t)',left:'center',textStyle:{fontSize:14}},
  xAxis:{type:'value',min:0,max:6,name:'时间 (s)',nameLocation:'middle',nameGap:28},
  yAxis:{type:'value',min:torque?-16:-30,max:torque?16:30,name:torque?'N·m':'度'},
  series:[{type:'line',showSymbol:false,data:(torque?r.u:r.theta).map((v,i)=>[r.time[i],v]),lineStyle:{width:1.5}}]});
 const thOption=useMemo(()=>chart(false),[r]); // eslint-disable-line react-hooks/exhaustive-deps
 const uOption=useMemo(()=>chart(true),[r]); // eslint-disable-line react-hooks/exhaustive-deps
 const thRef=useECharts(thOption),uRef=useECharts(uOption);
 const reset=()=>{setN(DEFAULT_TUNING.n);setGe(DEFAULT_TUNING.Ge);setGce(DEFAULT_TUNING.Gce);setGu(DEFAULT_TUNING.Gu);setDesign(DEFAULT_TUNING.design);};
 const controls=[{id:'intel02-n',label:'语言值数量 n',v:n,min:3,max:9,step:2,set:setN,unit:''},
 {id:'intel02-ge',label:'Ge 误差缩放',v:Ge,min:.5,max:5,step:.1,set:setGe,unit:'rad⁻¹'},
 {id:'intel02-gce',label:'Gce 速度缩放',v:Gce,min:.1,max:2,step:.1,set:setGce,unit:'s/rad'},
 {id:'intel02-gu',label:'Gu 力矩缩放',v:Gu,min:5,max:30,step:1,set:setGu,unit:'N·m'}];
 return <section data-testid="intel02-explorer" style={{border:'1px solid #cbd5e1',borderRadius:8,padding:16,maxWidth:'100%',minWidth:0}}>
  <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center',marginBottom:14}}>
   <label htmlFor="intel02-design">实现版本</label><select id="intel02-design" value={design} onChange={e=>setDesign(e.target.value as Design)} style={{maxWidth:'100%',padding:6}}>
    <option value="legacy">旧覆盖＋平均规则</option><option value="coverage">完整覆盖＋平均规则</option><option value="repaired">完整覆盖＋加和规则（默认）</option>
   </select><button type="button" onClick={reset} style={{padding:'6px 12px',border:'1px solid #64748b',borderRadius:4}}>恢复默认</button>
  </div>
  <div style={{display:'flex',flexWrap:'wrap',gap:16}}>{controls.map(c=><div key={c.id} style={{flex:'1 1 200px',minWidth:0}}>
   <label htmlFor={c.id} style={{display:'block',fontSize:13}}>{c.label} = {c.v.toFixed(c.id==='intel02-n'?0:1)} {c.unit}</label>
   <input id={c.id} type="range" min={c.min} max={c.max} step={c.step} value={c.v} onChange={e=>c.set(Number(e.target.value))} style={{width:'100%'}}/>
  </div>)}</div>
  <p style={{fontSize:12}}>n 表示从负到正的等距语言集数量；规则表行=e、列=de。采样 2 ms，初角20°，观察6 s；精确包络重心。</p>
  <div role="status" style={{display:'flex',flexWrap:'wrap',gap:12,padding:10,background:'#f1f5f9',borderRadius:6,fontSize:13}}>
   <span>全窗 rms: <b>{r.rms.toFixed(6)}°</b></span><span>6 s末样: <b>{r.final.toFixed(6)}°</b></span>
   <span>末1 s最大角: <b>{r.tail.toFixed(6)}°</b></span><span>TV(u): <b>{r.tv.toFixed(6)} N·m</b></span>
   <span>最大力矩: {r.maxU.toFixed(6)} N·m</span><span>无覆盖拍数: {r.gaps}</span><span>饱和: {(r.saturation*100).toFixed(2)}%</span>
  </div>
  {Math.max(...r.theta.map(Math.abs))>30&&<p style={{color:'#b45309'}}>角度超出固定 ±30° 图框；指标仍包含全部样本。</p>}
  {design==='legacy'&&<p style={{color:'#b45309'}}>旧覆盖在相邻中心中点有全零空隙，即使此条轨迹未恰好采到空隙，也仍存在覆盖缺陷。</p>}
  <div style={{display:'flex',flexWrap:'wrap',gap:12}}><div ref={thRef} style={{flex:'1 1 340px',minWidth:0,height:280}}/><div ref={uRef} style={{flex:'1 1 340px',minWidth:0,height:280}}/></div>
  <p style={{fontSize:12}}>有限窗口不等于稳定性证明；没有加入噪声、延迟或完整旋转臂动力学。</p>
 </section>;
}
