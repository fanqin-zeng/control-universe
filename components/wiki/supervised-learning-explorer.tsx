"use client";
import {useMemo, useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {fitRegression, fitClassifier, sigmoid, ridgeValues, iterationBudgets, classificationX, classificationY, trainingAccuracy} from '@/lib/supervised-learning';

export function SupervisedLearningExplorer() {
  const [mode, setMode] = useState('regression');
  const [lambda, setLambda] = useState(1);
  const [disturbance, setDisturbance] = useState(0);
  const [budget, setBudget] = useState(40);
  const [threshold, setThreshold] = useState(.5);
  const r = useMemo(() => fitRegression(lambda, disturbance), [lambda, disturbance]);
  const c = useMemo(() => fitClassifier(lambda, budget), [lambda, budget]);
  const option = useMemo<EChartsOption>(() => {
    const xs = Array.from({length: 101}, (_, i) => -2 + i / 25);
    const regression = mode === 'regression';
    return {animation: false, tooltip: {trigger: 'axis'}, legend: {bottom: 0}, grid: {left: 45, right: 20, top: 30, bottom: 80},
      xAxis: {type: 'value', min: -2, max: 2, name: regression ? '功率偏差' : '振动特征', nameLocation: 'middle', nameGap: 27},
      yAxis: {type: 'value', min: regression ? -3 : 0, max: regression ? 6 : 1, name: regression ? '归一化温升' : '模型概率'},
      series: regression ? [
        {name: '训练标签', type: 'scatter', symbolSize: 10, data: [[-1,0],[0,1],[1,2+disturbance]]},
        {name: '拟合预测', type: 'line', showSymbol: false, data: xs.map(x => [x,r.b+r.w*x])},
        {name: '原工况规律', type: 'line', showSymbol: false, lineStyle: {type: 'dashed'}, data: xs.map(x => [x,1+x])}
      ] : [
        {name: '训练标签', type: 'scatter', symbolSize: 10, data: classificationX.map((x,i) => [x,classificationY[i]])},
        {name: '模型概率', type: 'line', showSymbol: false, data: xs.map(x => [x,sigmoid(c.b+c.w*x)])},
        {name: '判别阈值', type: 'line', showSymbol: false, lineStyle: {type: 'dashed'}, data: [[-2,threshold],[2,threshold]]}
      ]};
  }, [mode, disturbance, r, c, threshold]);
  const chart = useECharts(option);
  const controlStyle = {padding: 6, color: '#172033', background: '#fff'};
  return <section className="not-prose" aria-label="监督学习实验" style={{padding:16,margin:'20px 0',border:'1px solid #cbd5e1',borderRadius:10,background:'#fff',color:'#172033',minWidth:0}}>
    <strong>同样有标签，预测数值和预测类别怎样不同？</strong>
    <label style={{display:'block',marginTop:12}}>任务 <select aria-label="学习任务" value={mode} onChange={e=>setMode(e.target.value)} style={controlStyle}><option value="regression">温升回归</option><option value="classification">检修分类</option></select></label>
    <label style={{display:'block',marginTop:12}}>惩罚系数 λ <select aria-label="惩罚系数" value={lambda} onChange={e=>setLambda(+e.target.value)} style={controlStyle}>{ridgeValues.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
    {mode==='regression' ? <label style={{display:'block',marginTop:12}}>最后一个训练标签的扰动 a={disturbance.toFixed(1)}<input aria-label="标签扰动" type="range" min={0} max={2} step={.5} value={disturbance} onChange={e=>setDisturbance(+e.target.value)} style={{width:'100%'}}/></label> : <>
      <label style={{display:'block',marginTop:12}}>更新预算 <select aria-label="更新预算" value={budget} onChange={e=>setBudget(+e.target.value)} style={controlStyle}>{iterationBudgets.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
      <label style={{display:'block',marginTop:12}}>判别阈值 τ={threshold.toFixed(1)}<input aria-label="判别阈值" type="range" min={.1} max={.9} step={.1} value={threshold} onChange={e=>setThreshold(+e.target.value)} style={{width:'100%'}}/></label>
    </>}
    <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}>{['无惩罚回归','扰动回归','可分分类','高阈值分类','恢复默认'].map(name=><button key={name} onClick={()=>{
      setMode(name.includes('分类')?'classification':'regression');setLambda(name==='无惩罚回归'||name==='可分分类'?0:name==='扰动回归'?.5:1);setDisturbance(name==='扰动回归'?1:0);setBudget(name==='可分分类'?200:40);setThreshold(name==='高阈值分类'?.9:.5);
    }} style={{padding:8,color:'#172033',background:'#f1f5f9',border:'1px solid #94a3b8',borderRadius:6}}>{name}</button>)}</div>
    <p aria-live="polite">{mode==='regression' ? `b=${r.b.toFixed(8)}，w=${r.w.toFixed(8)}；训练MSE=${r.mse.toFixed(8)}，验证MSE=${r.validation.toFixed(8)}，测试MSE=${r.test.toFixed(8)}；数据损失=${r.dataLoss.toFixed(8)}，惩罚=${r.penalty.toFixed(8)}，总目标=${r.objective.toFixed(8)}。` : `b=${c.b.toFixed(8)}，w=${c.w.toFixed(8)}；训练交叉熵=${c.ce.toFixed(8)}，惩罚=${c.penalty.toFixed(8)}；梯度范数=${c.gradientNorm.toExponential(3)}；实际更新${c.updates}次，${c.converged?'达到梯度容差':'达到更新预算，未达梯度容差'}；训练准确率=${trainingAccuracy(c.probabilities,threshold).toFixed(2)}。`}</p>
    <div ref={chart} style={{height:340,width:'100%'}}/>
    <p>{mode==='regression'?'测试读数只用于教学剖析；实际先用验证集选λ，再锁定方案报告测试。不同λ的总目标不能直接比较。':'这里只计算四个固定训练点的准确率；改变阈值不重新训练，也不证明概率已校准。λ=0的可分数据不存在有限的交叉熵最小解。'}</p>
  </section>;
}
