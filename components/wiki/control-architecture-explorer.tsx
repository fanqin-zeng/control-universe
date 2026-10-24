"use client";

import { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { useECharts } from './use-echarts';
import { controlArchitectureBudget } from '@/lib/control-architecture';

const names = ['采集', '通信', '等待', '计算', '输出'];
const colors = ['#0369a1', '#7c3aed', '#b45309', '#047857', '#be123c'];
export function ControlArchitectureExplorer() {
  const [communication, setCommunication] = useState(0.8);
  const [waiting, setWaiting] = useState(0.5);
  const budget = useMemo(() => controlArchitectureBudget(communication, waiting), [communication, waiting]);
  const option = useMemo<EChartsOption>(() => ({
    animation: false,
    legend: { top: 0, data: names, textStyle: { color: '#172033', fontSize: 11 } },
    grid: { left: 30, right: 20, top: 55, bottom: 45 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'value', min: 0, max: 12, name: '测量到输出时间 (ms)', nameLocation: 'middle', nameGap: 28 },
    yAxis: { type: 'category', min: 0, max: 0, data: ['串行路径'], show: false },
    series: names.map((name, index) => ({ name, type: 'bar', stack: 'budget',
      data: [budget.stages[index]], barWidth: 45, itemStyle: { color: colors[index] },
      ...(index === 0 ? { markLine: { silent: true, symbol: 'none',
        label: { formatter: '{b}', color: '#172033', position: 'insideEndTop' },
        data: [{ xAxis: 5, name: '截止5ms', lineStyle: { color: '#dc2626', type: 'dashed' } },
          { xAxis: 10, name: '周期10ms', lineStyle: { color: '#334155', type: 'dotted' } }] } } : {})
    }))
  }), [budget]);
  const chart = useECharts(option);
  return <section className="not-prose" aria-label="控制链路时间预算实验" style={{ padding: 14, margin: '20px 0', border: '1px solid #cbd5e1', borderRadius: 10, minWidth: 0, color: '#172033' }}>
    <strong>阀门何时收到这次测量对应的指令？</strong>
    <p>采集0.4 ms、计算1.0 ms、输出0.3 ms固定。把通信与等待的预算加长，观察是否越过截止线。</p>
    <label style={{ display: 'block' }}>通信预算：{communication.toFixed(1)} ms
      <input aria-label="通信预算" type="range" min={0} max={8} step={0.1} value={communication} onChange={e => setCommunication(+e.target.value)} style={{ width: '100%' }} />
    </label>
    <label style={{ display: 'block' }}>等待上界：{waiting.toFixed(1)} ms
      <input aria-label="等待上界" type="range" min={0} max={2} step={0.1} value={waiting} onChange={e => setWaiting(+e.target.value)} style={{ width: '100%' }} />
    </label>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '10px 0' }}>
      {([['短通信', 0.2, 0.5], ['恰好截止', 2.8, 0.5], ['超出截止', 3, 0.5], ['恢复默认', 0.8, 0.5]] as const).map(([label, c, w]) =>
        <button key={label} onClick={() => { setCommunication(c); setWaiting(w); }} style={{ padding: 8, border: '1px solid #cbd5e1', borderRadius: 6, background: '#f8fafc', color: '#172033' }}>{label}</button>)}
    </div>
    <p aria-live="polite">总预算 {budget.total.toFixed(2)} ms；余量 {budget.slack.toFixed(2)} ms；{budget.meetsDeadline ? '满足所设截止' : '超出所设截止'}。</p>
    <div ref={chart} style={{ width: '100%', height: 220 }} />
    <p>这是一条串行路径的上界相加。图中等待已单列；各项不得重复计入。预算满足不等于实机已按时完成，也不证明闭环稳定。</p>
  </section>;
}
