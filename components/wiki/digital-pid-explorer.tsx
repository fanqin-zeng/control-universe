"use client";
import {useMemo, useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {digitalPidSample} from '@/lib/digital-pid';

export function DigitalPidExplorer() {
  const [N, setN] = useState(10), [c, setC] = useState(0), [kb, setKb] = useState(2);
  const v = useMemo(() => digitalPidSample(N, c, kb), [N, c, kb]);
  const option = useMemo<EChartsOption>(() => ({animation: false,
    grid: {left: 48, right: 16, top: 30, bottom: 45},
    tooltip: {trigger: 'axis'},
    xAxis: {type: 'value', min: 0, max: 2, name: '时间 (s)', nameLocation: 'middle', nameGap: 27},
    yAxis: {type: 'value', min: 0, max: 5, name: 'D (输出单位)'},
    series: [{type: 'line', step: 'end', showSymbol: false, data: v.response.map(p => [p.time, p.derivative])}]
  }), [v]);
  const chart = useECharts(option);
  return <section className="not-prose" aria-label="数字PID单拍实验" style={{padding: 14, border: '1px solid #cbd5e1', borderRadius: 10, margin: '20px 0', minWidth: 0, color: '#172033'}}>
    <strong>目标跳变，微分器看到了什么？</strong>
    <p>Ts=0.1 s、Kd=0.5；r从0跳到1，y保持0。图只显示这次跳变后的D衰减，随后输入保持，不是闭环响应。</p>
    <label style={{display: 'block'}}>滤波角频率 N：{N} /s<input aria-label="滤波角频率N" type="range" min={1} max={50} step={1} value={N} onChange={e => setN(+e.target.value)} style={{width: '100%'}} /></label>
    <label style={{display: 'block'}}>微分设定值权重 c：{c.toFixed(1)}<input aria-label="微分权重c" type="range" min={0} max={1} step={0.1} value={c} onChange={e => setC(+e.target.value)} style={{width: '100%'}} /></label>
    <div ref={chart} style={{width: '100%', height: 240}} />
    <p aria-live="polite">α={v.alpha.toFixed(4)}；跳变首拍 D={v.derivative.toFixed(4)}。</p>
    <p>另一独立PI快照：本拍P=2、I=1、e=1、Ki=1，输出限幅±1。只检查反算更新，不把这个快照接到上图。</p>
    <label style={{display: 'block'}}>反算增益 Kb：{kb.toFixed(1)} /s<input aria-label="反算增益Kb" type="range" min={0} max={25} step={0.5} value={kb} onChange={e => setKb(+e.target.value)} style={{width: '100%'}} /></label>
    <p aria-live="polite">u_raw={v.raw.toFixed(1)} → u_actual={v.actual.toFixed(1)}；I_next={v.integralNext.toFixed(4)}；局部乘数1−KbTs={v.pole.toFixed(2)}。</p>
    <p>{kb === 0 ? 'Kb=0：没有反算跟踪，局部乘数为1。' : v.trackingStable ? '固定饱和段的跟踪误差收敛；这不证明整个闭环稳定。' : '局部跟踪误差不收敛，不能靠加大Kb来无限加快恢复。'}</p>
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
      <button onClick={() => setC(1)} style={{padding: 8, border: '1px solid #cbd5e1', borderRadius: 6}}>对误差微分</button>
      <button onClick={() => setC(0)} style={{padding: 8, border: '1px solid #cbd5e1', borderRadius: 6}}>对测量微分</button>
      <button onClick={() => {setN(10);setC(0);setKb(2);}} style={{padding: 8, border: '1px solid #cbd5e1', borderRadius: 6}}>恢复默认</button>
    </div>
  </section>;
}
