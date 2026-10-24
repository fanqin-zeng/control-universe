"use client";
import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { useECharts } from './use-echarts';
import { experiment, predict, trainingX, truth } from '@/lib/learning-generalization';

export function LearningGeneralizationExplorer() {
  const [degree, setDegree] = useState(1);
  const [noise, setNoise] = useState(.2);
  const [shift, setShift] = useState(0);
  const r = useMemo(() => experiment(degree, noise, shift), [degree, noise, shift]);
  const option = useMemo<EChartsOption>(() => {
    const xs = Array.from({length: 101}, (_, i) => -1 + i / 50);
    return {animation: false, tooltip: {trigger: 'axis'}, legend: {data: ['训练读数', '拟合预测', '原工况规律', '测试工况规律'], bottom: 0},
      grid: {left: 52, right: 18, top: 20, bottom: 85},
      xAxis: {type: 'value', min: -1, max: 1, name: '归一化功率', nameLocation: 'middle', nameGap: 28},
      yAxis: {type: 'value', min: -2, max: 5, name: '归一化温升'},
      series: [{name: '训练读数', type: 'scatter', symbolSize: 10, data: trainingX.map((x, i) => [x, truth(x) + noise * (i % 2 === 0 ? 1 : -1)])},
        ...[['拟合预测', (x: number) => predict(r.c, x)], ['原工况规律', (x: number) => truth(x)], ['测试工况规律', (x: number) => truth(x, shift)]].map(([name, f]) => ({name: name as string, type: 'line' as const, showSymbol: false, data: xs.map(x => [x, (f as (x:number)=>number)(x)])}))]};
  }, [r, noise, shift]);
  const chart = useECharts(option);
  return <section aria-label="学习与泛化实验" style={{padding: 16, background: '#fff', color: '#172033', border: '1px solid #cbd5e1', borderRadius: 10, margin: '20px 0', minWidth: 0}}>
    <strong>拟合得更贴，未见过的功率点就更准吗？</strong>
    <label style={{display: 'block', marginTop: 12}}>模型次数 <select aria-label="模型次数" value={degree} onChange={e => setDegree(+e.target.value)} style={{padding: 6, background: '#fff', color: '#172033'}}>{[0,1,4].map(v => <option key={v} value={v}>{v} 次</option>)}</select></label>
    <label style={{display: 'block', marginTop: 12}}>训练扰动幅值 a={noise.toFixed(2)}<input aria-label="训练扰动幅值" type="range" min={0} max={.4} step={.05} value={noise} onChange={e => setNoise(+e.target.value)} style={{width: '100%'}}/></label>
    <label style={{display: 'block', marginTop: 12}}>测试工况变化 d={shift.toFixed(2)}<input aria-label="测试工况变化" type="range" min={0} max={1} step={.1} value={shift} onChange={e => setShift(+e.target.value)} style={{width: '100%'}}/></label>
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12}}>{[['过拟合例',4,.2,0],['无扰动持平',4,0,0],['工况变化',1,.2,1],['恢复默认',1,.2,0]].map(([name,k,a,d]) => <button key={name} onClick={() => {setDegree(+k);setNoise(+a);setShift(+d);}} style={{padding: 8, background: '#f1f5f9', color: '#172033', border: '1px solid #94a3b8', borderRadius: 6}}>{name}</button>)}</div>
    <p aria-live="polite">训练 MSE={r.train.toFixed(8)}；验证 MSE={r.validation.toFixed(8)}；测试 MSE={r.test.toFixed(8)}。</p>
    <div ref={chart} style={{width: '100%', height: 340}}/>
    <p>全部为固定教学点；验证和测试标签不参与拟合。测试工况变化只改变测试关系，验证集保持原工况。这里展示测试结果用于理解反例，实际选模必须先锁定模型再打开测试集。</p>
  </section>;
}
