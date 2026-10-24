"use client";
import {useMemo,useState} from 'react';import type {EChartsOption} from 'echarts';import {useECharts} from './use-echarts';
import {fit,trainingData,validationData,testData,mse,initializations,learningRates,budgets} from '@/lib/autodiff-training';
export function AutodiffTrainingExplorer(){
  const [eta,setEta]=useState(.2),[budget,setBudget]=useState(200),[init,setInit]=useState('positive'),[noise,setNoise]=useState(.3),[restore,setRestore]=useState(true);
  const result=useMemo(()=>fit(trainingData(noise),validationData,eta,budget,initializations[init]),[eta,budget,init,noise]);
  const chosen=restore?result.best:result.last;
  const option=useMemo<EChartsOption>(()=>({animation:false,tooltip:{trigger:'axis'},legend:{bottom:0},grid:{left:50,right:20,top:35,bottom:75},xAxis:{type:'value',min:0,max:200,name:'接受的更新次数',nameLocation:'middle',nameGap:27},yAxis:{type:'value',min:-12,max:6,name:'log₁₀(MSE)'},series:[
    {name:'训练',type:'line',showSymbol:false,data:result.history.map(r=>[r.step,Math.log10(Math.max(r.train,1e-12))])},
    {name:'验证',type:'line',showSymbol:false,data:result.history.map(r=>[r.step,Math.log10(Math.max(r.validation,1e-12))])},
    {name:'选用检查点',type:'scatter',symbolSize:12,data:[[chosen.step,Math.log10(Math.max(chosen.validation,1e-12))]]}
  ]}),[result,chosen]);const chart=useECharts(option);const style={padding:6,background:'#fff',color:'#172033'};
  return <section aria-label="自动微分训练实验" className="not-prose" style={{padding:16,margin:'20px 0',border:'1px solid #94a3b8',borderRadius:10,color:'#172033',background:'#fff',minWidth:0}}>
    <strong>同一网络：更新到哪里，最终保存哪一份参数？</strong>
    <label style={{display:'block',marginTop:12}}>学习率 η <select aria-label="学习率" value={eta} onChange={e=>setEta(+e.target.value)} style={style}>{learningRates.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
    <label style={{display:'block',marginTop:12}}>更新预算 <select aria-label="更新预算" value={budget} onChange={e=>setBudget(+e.target.value)} style={style}>{budgets.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
    <label style={{display:'block',marginTop:12}}>初始化 <select aria-label="初始化" value={init} onChange={e=>setInit(e.target.value)} style={style}><option value="positive">正初值</option><option value="zero">全零</option><option value="asymmetric">非对称</option></select></label>
    <label style={{display:'block',marginTop:12}}>训练中心标签扰动 δ <select aria-label="训练标签扰动" value={noise} onChange={e=>setNoise(+e.target.value)} style={style}><option value={0}>0</option><option value={.3}>0.3</option></select></label>
    <label style={{display:'block',marginTop:12}}><input aria-label="恢复验证最优" type="checkbox" checked={restore} onChange={e=>setRestore(e.target.checked)}/> 恢复验证最优检查点</label>
    <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}>{['不更新','全零初始化','大步长','只看末步','恢复默认'].map(name=><button key={name} onClick={()=>{setEta(name==='不更新'?0:name==='大步长'?4:.2);setInit(name==='全零初始化'?'zero':'positive');setBudget(200);setNoise(.3);setRestore(name!=='只看末步');}} style={{...style,padding:8,border:'1px solid #94a3b8',borderRadius:6}}>{name}</button>)}</div>
    <p aria-live="polite">已接受更新{result.updates}次；停止原因：{result.status==='gradient'?'梯度容差':result.status==='guard'?'数值保护（拒绝候选）':'达到预算，未达梯度容差'}；选用第{chosen.step}步，验证最优第{result.best.step}步。参数[w,b,v,a]=[{chosen.p.map(v=>v.toFixed(8)).join(', ')}]；训练MSE={chosen.train.toFixed(8)}，验证MSE={chosen.validation.toFixed(8)}，测试MSE={mse(chosen.p,testData).toFixed(8)}；末步训练MSE={result.last.train.toFixed(8)}，末步验证MSE={result.last.validation.toFixed(8)}；末步梯度范数={result.last.norm.toExponential(3)}。</p>
    {result.rejected&&<p>拒绝第{result.rejected.step}步候选：训练MSE={result.rejected.train?.toExponential(3)??'非有限'}，验证MSE={result.rejected.validation?.toExponential(3)??'非有限'}；保留此前接受轨迹，保护阈值为10⁶。</p>}
    <div ref={chart} style={{height:330,width:'100%'}}/>
    <p>确定性全批半MSE梯度下降；步数不是物理时间。图中MSE低于10⁻¹²只按显示地板绘制；无裁剪或隐藏失败。测试读数仅教学剖析，不能据此调参。</p>
  </section>;
}
