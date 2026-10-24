"use client";
import {useMemo,useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from '@/components/wiki/use-echarts';
import {muDefault,muReadings,type MuParameters,type MuStructure} from '@/lib/mu-analysis';
const show=(v:number|null)=>v===null?'∞':v.toFixed(6);
export function MuAnalysisExplorer(){
 const [p,setP]=useState<MuParameters>({...muDefault}),r=useMemo(()=>muReadings(p),[p]);
 const points=useMemo(()=>Array.from({length:241},(_,i)=>{const w=10**(-3+6*i/240);return {w,...muReadings({...p,frequency:w})};}),[p]);
 const left=useMemo<EChartsOption>(()=>({animation:false,title:{text:'同一M的频率读数',top:0,left:'center',textStyle:{fontSize:14}},legend:{data:['精确μ','满块σ','可行D上界'],top:32},tooltip:{trigger:'axis'},grid:{left:45,right:18,top:78,bottom:52},xAxis:{type:'log',min:.001,max:1000,name:'rad/s',nameLocation:'middle',nameGap:28,axisLine:{onZero:false},axisLabel:{hideOverlap:true,formatter:(v:number)=>'10^'+Math.round(Math.log10(v))}},yAxis:{type:'value',min:0,max:5,name:'增益'},series:[['精确μ','mu'],['满块σ','sigma'],['可行D上界','upper']].map(([name,key])=>({name,type:'line',symbol:'none',data:points.map(x=>[x.w,x[key as 'mu'|'sigma'|'upper']]),markLine:key==='mu'?{silent:true,symbol:'none',label:{position:'insideEndTop'},data:[{yAxis:1}]}:undefined}))}),[points]);
 const right=useMemo<EChartsOption>(()=>({animation:false,title:{text:'DC缩放：仅独立块可用',top:0,left:'center',textStyle:{fontSize:14}},tooltip:{trigger:'axis'},grid:{left:45,right:18,top:52,bottom:52},xAxis:{type:'value',min:.05,max:3,name:'d',nameLocation:'middle',nameGap:28},yAxis:{type:'value',min:0,max:8,name:'上界'},series:[{type:'line',symbol:'none',data:Array.from({length:201},(_,i)=>{const d=.05+2.95*i/200;return [d,muReadings({...p,d,frequency:0}).upper];}),markLine:{silent:true,symbol:'none',label:{position:'insideEndTop'},data:[{yAxis:r.peak}]}}]}),[p,r.peak]);
 const l=useECharts(left),rr=useECharts(right),button={padding:'7px 10px',border:'1px solid #64748b',background:'#f8fafc',color:'#0f172a',borderRadius:6,cursor:'pointer'};
 const controls:[keyof Pick<MuParameters,'b'|'c'|'d'|'frequency'>,string,number,number,number][]=[['b','耦合 b',0,4,.25],['c','耦合 c',-1,1,.025],['d','缩放 d',.05,3,.05],['frequency','观察频率',0,4,.25]];
 return <section aria-label="结构奇异值实验" style={{border:'1px solid #94a3b8',borderRadius:10,padding:14,minWidth:0,maxWidth:'100%'}}>
 <label>允许的扰动结构 <select aria-label="扰动结构" value={p.structure} onChange={e=>setP({...p,structure:e.target.value as MuStructure})} style={{padding:6,maxWidth:'100%'}}><option value="diagonal">两个独立复标量块</option><option value="full">一个任意复满块</option></select></label>
 <div style={{display:'flex',flexWrap:'wrap',gap:14,marginTop:12}}>{controls.map(([key,label,min,max,step])=><label key={key} style={{display:'grid',gap:5}}>{label}={p[key]}<input aria-label={label} type="range" min={min} max={max} step={step} value={p[key]} disabled={key==='d'&&p.structure==='full'} onChange={e=>setP({...p,[key]:Number(e.target.value)})} style={{width:165,maxWidth:'100%'}}/></label>)}</div>
 <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}><button style={button} onClick={()=>setP({...muDefault,c:.5})}>边界工况</button><button style={button} onClick={()=>setP({...muDefault,c:.8})}>结构也失败</button><button style={button} onClick={()=>setP({...muDefault,c:0})}>单向耦合</button><button style={button} onClick={()=>setP({...muDefault})}>恢复默认</button></div>
 <p data-testid="mu-readings" style={{overflowWrap:'anywhere'}}>单频μ={show(r.mu)}；满块σ={show(r.sigma)}；可行D上界={show(r.upper)}；单频致奇异半径={show(r.pointRadius)}；全频鲁棒稳定半径={show(r.radius)}</p>
 <p data-testid="mu-status">{r.certified?'解析全频μ峰小于1：该模型通过单位闭球严格稳定检查':r.peak===1?'解析全频μ峰等于1：边界存在零极点，不签严格稳定':'解析全频μ峰大于1：本例可构造单位球内失稳扰动'}。</p>
 <div style={{display:'flex',flexWrap:'wrap',gap:12}}><div ref={l} style={{height:350,flex:'1 1 280px',minWidth:0}}/><div ref={rr} style={{height:350,flex:'1 1 280px',minWidth:0}}/></div>
 <p style={{fontSize:13}}>限定模型M(s)=[[0,b],[c,0]]/(s+1)，上确界在DC解析求得，图线不是证书。观察频率只改读数，不改变全频半径。满块仅使用D=I，缩放旋钮不参与该结构计算；右图满块时为常数。左图上界超过5、右图上界超过8的部分由图框裁切，精确选点读数不截断。μ=0显示半径∞，仅表示该限定模型无有限致奇异扰动，不保证任意性能。实参数与重复块反例见Notebook。</p>
 </section>;
}
