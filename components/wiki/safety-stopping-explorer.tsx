"use client";
import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { useECharts } from './use-echarts';
import { stoppingBudget } from '@/lib/safety-stopping';

export function SafetyStoppingExplorer() {
  const [v, setV] = useState(2), [delay, setDelay] = useState(.2);
  const [brake, setBrake] = useState(2), [gap, setGap] = useState(1.8);
  const result = useMemo(() => stoppingBudget(v, delay, brake, gap), [v, delay, brake, gap]);
  const option = useMemo<EChartsOption>(() => ({
    animation: false,
    tooltip: { trigger: 'axis' },
    legend: { data: ['前进距离', '保守可用距离'], top: 0, textStyle: { color: '#172033', fontSize: 11 } },
    grid: { left: 48, right: 18, top: 45, bottom: 40 },
    xAxis: { type: 'value', min: 0, max: 10, name: '时间 (s)', nameLocation: 'middle', nameGap: 25 },
    yAxis: { type: 'value', min: 0, max: 22, name: '距离 (m)' },
    series: [
      { name: '前进距离', type: 'line', showSymbol: false, data: result.curve, itemStyle: { color: '#0369a1' } },
      { name: '保守可用距离', type: 'line', showSymbol: false, data: [[0, result.available], [10, result.available]], lineStyle: { type: 'dashed', color: '#b45309' } },
    ],
  }), [result]);
  const chart = useECharts(option);
  const controls = [
    { name: '初速', unit: 'm/s', value: v, set: setV, min: 0, max: 4, step: .1 },
    { name: '总延迟', unit: 's', value: delay, set: setDelay, min: 0, max: 1, step: .05 },
    { name: '制动减速度', unit: 'm/s²', value: brake, set: setBrake, min: .5, max: 4, step: .1 },
    { name: '测得间隙', unit: 'm', value: gap, set: setGap, min: .5, max: 6, step: .1 },
  ];
  return <section className="not-prose" aria-label="停车距离预算实验" style={{ padding: 14, border: '1px solid #cbd5e1', borderRadius: 10, margin: '20px 0', color: '#172033', minWidth: 0 }}>
    <strong>现在开始停车，还来得及吗？</strong>
    <p>沿直线前进；延迟期匀速，随后恒定制动到静止。间隙误差界固定为0.1 m。图的范围固定，可用提示框读取局部数值。</p>
    {controls.map(c => <label key={c.name} style={{ display: 'block', marginTop: 8 }}>{c.name}：{c.value.toFixed(2)} {c.unit}
      <input type="range" aria-label={c.name} min={c.min} max={c.max} step={c.step} value={c.value} onChange={e => c.set(+e.target.value)} style={{ width: '100%' }} />
    </label>)}
    <button onClick={() => { setV(2); setDelay(.2); setBrake(2); setGap(1.8); }} style={{ padding: 8, border: '1px solid #94a3b8', borderRadius: 6, background: '#f8fafc', color: '#172033', marginTop: 10 }}>恢复默认</button>
    <p aria-live="polite">延迟路程 {result.delayDistance.toFixed(4)} m；制动路程 {result.brakingDistance.toFixed(4)} m；总路程 {result.distance.toFixed(4)} m；余量 {result.margin.toFixed(4)} m；停住时刻 {result.stopTime.toFixed(4)} s。</p>
    <p><strong>{result.margin < -1e-12 ? '此停车预算不满足约束' : result.margin <= 1e-12 ? '恰在模型边界，无额外余量' : '此停车预算有正余量'}</strong>。这是所列模型假设下的判定，不能替代实车验证。</p>
    <div ref={chart} style={{ width: '100%', height: 300 }} />
  </section>;
}
