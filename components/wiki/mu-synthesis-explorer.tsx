"use client";
import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { useECharts } from './use-echarts';
import { dkDefault, dkReadings, dkKStep, dkTrace } from '@/lib/mu-synthesis';

export function MuSynthesisExplorer() {
  const [p, setP] = useState(dkDefault), [initial, setInitial] = useState(1);
  const r = useMemo(() => dkReadings(p), [p]);
  const trace = useMemo(() => dkTrace(initial), [initial]);
  const option = useMemo<EChartsOption>(() => ({ animation: false,
    tooltip: { trigger: 'axis' }, legend: { data: ['精确μ', '当前D上界'], top: 0 },
    grid: { top: 48, left: 58, right: 20, bottom: 55 },
    xAxis: { type: 'value', name: 'k', min: 0, max: 1, nameLocation: 'middle', nameGap: 30 },
    yAxis: { type: 'value', name: '全频峰值', min: 0, max: 4 },
    series: ['精确μ', '当前D上界'].map((name, j) => ({ name, type: 'line', showSymbol: false,
      data: Array.from({ length: 201 }, (_, i) => { const k = i / 200, v = dkReadings({ ...p, k }); return [k, j ? v.upper : v.mu]; }) }))
  }), [p]);
  const frequencyOption = useMemo<EChartsOption>(() => ({ animation: false,
    tooltip: { trigger: 'axis' }, legend: { data: ['单频μ', '单频D上界'], top: 0 },
    grid: { top: 48, left: 58, right: 20, bottom: 55 },
    xAxis: { type: 'value', name: 'ω (rad/s)', min: 0, max: 10, nameLocation: 'middle', nameGap: 30 },
    yAxis: { type: 'value', name: '幅值', min: 0, max: 4 },
    series: ['单频μ', '单频D上界'].map((name, j) => ({ name, type: 'line', showSymbol: false,
      data: Array.from({ length: 201 }, (_, i) => { const frequency = i / 20, v = dkReadings({ ...p, frequency }); return [frequency, j ? v.singleUpper : v.singleMu]; }) }))
  }), [p]);
  const ref = useECharts(option), freqRef = useECharts(frequencyOption);
  const button = { padding: '7px 11px', border: '1px solid #64748b', borderRadius: 6, background: 'transparent', cursor: 'pointer' };
  return <section aria-label="D-K交替实验" style={{ border: '1px solid #64748b', borderRadius: 12, padding: 16, margin: '24px 0', minWidth: 0 }}>
    <p style={{ marginTop: 0 }}><strong>限定族交替优化</strong>：K=kI₂，D=diag(d,1)。两步均精确，但只针对本例；没有动态D拟合。</p>
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      {([['控制器 k', 'k', 0, 1, .001], ['缩放 d', 'd', .25, 2, .001], ['观察频率', 'frequency', 0, 10, .05]] as const).map(([label, key, min, max, step]) =>
        <label key={key} style={{ display: 'grid', gap: 4, flex: '1 1 180px', minWidth: 0 }}>{label} = {p[key].toFixed(3)}
          <input aria-label={label} type="range" min={min} max={max} step={step} value={p[key]} onChange={e => setP({ ...p, [key]: +e.target.value })} style={{ width: '100%' }} /></label>)}
    </div>
    <p data-testid="dk-readings" style={{ overflowWrap: 'anywhere', fontVariantNumeric: 'tabular-nums' }}>全频μ={r.mu.toFixed(6)}；当前D全频上界={r.upper.toFixed(6)}；最优d={r.optimalD.toFixed(6)}；单频μ={r.singleMu.toFixed(6)}；单频上界={r.singleUpper.toFixed(6)}</p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <button style={button} onClick={() => setP({ ...p, k: dkKStep(p.d) })}>执行K步</button>
      <button style={button} onClick={() => setP({ ...p, d: r.optimalD })}>执行D步</button>
      <button style={button} onClick={() => setP({ ...p, k: 0, d: .25 })}>端点k=0</button>
      <button style={button} onClick={() => setP({ ...p, k: 1, d: Math.sqrt(1.6) })}>端点k=1</button>
      <button style={button} onClick={() => { setP(dkDefault); setInitial(1); }}>恢复默认</button>
    </div>
    <div ref={ref} style={{ height: 300, width: '100%', marginTop: 16 }} />
    <div ref={freqRef} style={{ height: 300, width: '100%' }} />
    <label>轨迹初始d <select aria-label="轨迹初始d" value={initial} onChange={e => setInitial(+e.target.value)} style={{ padding: 5 }}><option value={1}>1</option><option value={.25}>0.25</option><option value={2}>2</option></select></label>
    <div style={{ overflowX: 'auto', maxWidth: '100%' }}><table style={{ width: '100%', fontVariantNumeric: 'tabular-nums' }}><thead><tr>{['子步', 'k', 'd', 'D上界', '精确μ'].map(x => <th key={x}>{x}</th>)}</tr></thead><tbody>{trace.map((v, i) => <tr key={i}><td>{v.step}</td><td>{v.k.toFixed(6)}</td><td>{v.d.toFixed(6)}</td><td>{v.upper.toFixed(6)}</td><td>{v.mu.toFixed(6)}</td></tr>)}</tbody></table></div>
    <p>观察频率仅改变单频读数；全频峰在ω=0。初始d=1停在坐标固定点，初始d=0.25到k=0，两者不能据此代表通用μ综合的优劣。上界低于1仅对应图中的归一化不确定性互连。</p>
  </section>;
}
