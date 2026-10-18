"use client";
import {useMemo, useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from '@/components/wiki/use-echarts';
import {BREAK_GAIN, DEFAULT_GAIN, rootLocusBackground, rootLocusExample} from '@/lib/root-locus';

export function RootLocusKExplorer() {
  const [gain, setGain] = useState(DEFAULT_GAIN);
  const model = useMemo(() => rootLocusExample(gain), [gain]);
  const background = useMemo(() => rootLocusBackground(), []);
  const locusOption = useMemo<EChartsOption>(() => ({
    animation: false,
    grid: {left: '15%', top: '10%', width: '75%', height: '75%'},
    tooltip: {trigger: 'item'},
    xAxis: {type: 'value', min: -8, max: 2, name: 'Re(s)', nameLocation: 'middle', nameGap: 25},
    yAxis: {type: 'value', min: -5, max: 5, name: 'Im(s)'},
    series: [
      {name: 'K=0…60采样', type: 'scatter', data: background, symbolSize: 2, itemStyle: {color: '#94a3b8'}},
      {name: '当前三个根', type: 'scatter', data: model.poles, symbolSize: 10, itemStyle: {color: '#dc2626'}},
      {name: '开环极点', type: 'scatter', data: [[0, 0], [-2, 0], [-4, 0]], symbol: 'diamond', symbolSize: 7, itemStyle: {color: '#111827'}}
    ]
  }), [background, model.poles]);
  const stepOption = useMemo<EChartsOption>(() => ({
    animation: false,
    grid: {left: 42, right: 18, top: 25, bottom: 50},
    tooltip: {trigger: 'axis'},
    xAxis: {type: 'value', min: 0, max: 10, name: 't(s)', nameLocation: 'middle', nameGap: 25},
    yAxis: {type: 'value', min: -4, max: 6, name: 'y(t)'},
    series: [{name: '完整三阶响应', type: 'line', data: model.steps, showSymbol: false, lineStyle: {color: '#2563eb'},
      markLine: {silent: true, label: {show: false}, data: gain > 0 && gain < 48 ? [{yAxis: 1}] : [], lineStyle: {color: '#64748b', type: 'dashed'}}}]
  }), [model.steps, gain]);
  const locusRef = useECharts(locusOption), stepRef = useECharts(stepOption);
  return <section aria-label="根轨迹增益探索" style={{border: '1px solid #cbd5e1', borderRadius: 8, padding: 12, margin: '20px 0', color: '#1e293b', minWidth: 0}}>
    <p>对象1/[s(s+2)(s+4)]，单位负反馈。红点是D+KN的三个实际根，灰点只是K=0…60的有限采样；分离处重根会重叠。</p>
    <label>K <input aria-label="根轨迹增益K" type="range" min={0} max={60} step="any" value={gain} onChange={e => setGain(+e.target.value)} style={{width: '65%'}}/> {gain.toFixed(6)}</label>
    <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8}}>
      <button onClick={() => setGain(DEFAULT_GAIN)}>恢复默认ζ=.5算例</button>
      <button onClick={() => setGain(BREAK_GAIN)}>精确分离点</button>
      <button onClick={() => setGain(48)}>虚轴边界K48</button>
    </div>
    <div ref={locusRef} style={{aspectRatio: '1', width: '100%'}}/>
    <p style={{overflowWrap: 'anywhere'}}>闭环根：{model.poles.map(p => `${p[0].toFixed(6)}${p[1] < 0 ? '' : '+'}${p[1].toFixed(6)}j`).join('；')}。{model.status}。</p>
    <p>下图是完整三阶、零初始单位阶跃，不用二阶近似拼接。内部dt=.001s、每.02s显示；固定0…10s、y−4…6，超过窗口的响应不会被改写。虚轴边界和不稳定时不标稳态。</p>
    <div ref={stepRef} style={{height: 300, width: '100%'}}/>
    <p>y(10s)={model.last.toFixed(6)}，是有限时刻读数，不是稳态或连续峰值。</p>
  </section>;
}
