"use client";
import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { useECharts } from './use-echarts';
import { filterDefault, filterReadings, filterFrequency, filterPulseRatio } from '@/lib/h-infinity-filter';

export function HInfinityFilterExplorer() {
  const [p, setP] = useState(filterDefault);
  const r = useMemo(() => filterReadings(p), [p]);
  const option = useMemo<EChartsOption>(() => ({ animation: false,
    tooltip: { trigger: 'axis' }, legend: { data: ['误差通道行范数'], top: 0 },
    grid: { top: 48, left: 52, right: 24, bottom: 52 },
    xAxis: { type: 'value', min: 0, max: 10, name: 'ω (rad/s)', nameLocation: 'middle', nameGap: 30 },
    yAxis: { type: 'value', min: 0, max: 5, name: '幅值' },
    series: [{ name: '误差通道行范数', type: 'line', showSymbol: false,
      data: Array.from({ length: 201 }, (_, i) => [i / 20, filterFrequency(p, i / 20)]) }]
  }), [p]);
  const tradeoff = useMemo<EChartsOption>(() => ({ animation: false,
    tooltip: { trigger: 'axis' }, legend: { data: ['最坏能量增益', '白噪声稳态方差'], top: 0 },
    grid: { top: 48, left: 52, right: 52, bottom: 52 },
    xAxis: { type: 'value', min: 0, max: 8, name: 'L', nameLocation: 'middle', nameGap: 30 },
    yAxis: [{ type: 'value', min: 0, max: 5, name: '增益' }, { type: 'value', min: 0, max: 10, name: '方差' }],
    series: ['最坏能量增益', '白噪声稳态方差'].map((name, j) => ({ name, type: 'line', showSymbol: false, yAxisIndex: j,
      data: Array.from({ length: 401 }, (_, i) => { const gain = i / 50, v = filterReadings({ ...p, gain }); return [gain, j ? v.variance : v.peak]; }) }))
  }), [p]);
  const ref = useECharts(option), tradeRef = useECharts(tradeoff);
  const f = (v: number | null) => v === null ? '不适用' : v.toFixed(6);
  const button = { padding: '7px 10px', border: '1px solid #64748b', background: 'transparent', borderRadius: 6, cursor: 'pointer' };
  return <section aria-label="H∞滤波实验" style={{ border: '1px solid #64748b', borderRadius: 12, padding: 16, margin: '24px 0', minWidth: 0 }}>
    <p style={{ marginTop: 0 }}><strong>同一误差模型，两种目标</strong>：过程扰动和测量噪声都进入误差；四个参数决定模型和增益。</p>
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>{([
      ['对象系数 a', 'a', -2, 1, .05], ['滤波增益 L', 'gain', 0, 8, .05],
      ['过程尺度 q', 'q', .1, 2, .05], ['测量尺度 r', 'r', .1, 2, .05]
    ] as const).map(([label, key, min, max, step]) => <label key={key} style={{ display: 'grid', gap: 4, flex: '1 1 180px', minWidth: 0 }}>{label}={p[key].toFixed(3)}<input aria-label={label} type="range" min={min} max={key === 'gain' ? Math.max(max, p.gain) : max} step={step} value={p[key]} onChange={e => setP({ ...p, [key]: +e.target.value })} style={{ width: '100%' }} /></label>)}</div>
    <p data-testid="filter-status">{r.stable ? '误差系统稳定：可以解释零初值能量增益。' : '误差系统不稳定或临界：不报告H∞能量增益或稳态方差，频率曲线留空。'}</p>
    <p data-testid="filter-readings" style={{ overflowWrap: 'anywhere', fontVariantNumeric: 'tabular-nums' }}>衰减率={f(r.rate)}；H∞增益={f(r.peak)}；白噪声方差={f(r.variance)}；Kalman增益={f(r.kalmanGain)}；H∞族内增益={f(r.hinfGain)}；最小值或下确界={f(r.bestPeak)}；20秒脉冲能量比={f(filterPulseRatio(p, 20))}</p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <button style={button} onClick={() => setP({ ...p, gain: r.kalmanGain })}>采用Kalman增益</button>
      <button style={button} disabled={r.hinfGain === null} onClick={() => { if (r.hinfGain !== null) setP({ ...p, gain: r.hinfGain }); }}>采用H∞族内增益</button>
      <button style={button} onClick={() => setP({ ...filterDefault, a: 0 })}>积分对象</button>
      <button style={button} onClick={() => setP({ ...filterDefault, a: 1, gain: .5 })}>误差失稳</button>
      <button style={button} onClick={() => setP(filterDefault)}>恢复默认</button>
    </div>
    <p>{r.finiteOptimum ? 'a<0时本观测器族存在有限H∞最优增益；按钮可能选到滑块显示区间以外的解析值。' : 'a≥0时只有L趋于无穷的下确界，不能把最大滑块值称为最优。'}</p>
    <div ref={ref} style={{ width: '100%', height: 300 }} /><div ref={tradeRef} style={{ width: '100%', height: 300 }} />
    <p>图仅显示ω∈[0,10]、L∈[0,8]、能量增益[0,5]及方差[0,10]；越界部分裁切，读数仍按完整解析式计算。方差对应独立白噪声增量合同，不能把白噪声当有限能量输入。这里保证误差稳定，不是在控制对象使其稳定。</p>
  </section>;
}
