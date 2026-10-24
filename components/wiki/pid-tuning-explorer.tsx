"use client";
import {useMemo, useState} from 'react';
import type {EChartsOption} from 'echarts';
import {useECharts} from './use-echarts';
import {tuningExperiment, type TuningScenario} from '@/lib/pid-tuning';
const names: Record<TuningScenario, string> = {nominal: '标称', delay: '延迟增大', unreachable: '目标不可达', noise: '扰动与噪声'};
export function PidTuningExplorer() {
  const [lambda, setLambda] = useState(1), [scenario, setScenario] = useState<TuningScenario>('nominal');
  const v = useMemo(() => tuningExperiment(lambda, scenario), [lambda, scenario]);
  const option = useMemo<EChartsOption>(() => ({animation: false,
    tooltip: {trigger: 'axis'}, legend: {data: ['真实温差y', '目标r', '加热指令u']},
    grid: {left: 48, right: 48, top: 50, bottom: 45},
    xAxis: {type: 'value', min: 0, max: 30, name: '时间 (s)', nameLocation: 'middle', nameGap: 28},
    yAxis: [{type: 'value', min: 0, max: 3.5, name: '温差 (℃)'}, {type: 'value', min: 0, max: 1.1, name: '指令'}],
    series: [
      {name: '真实温差y', type: 'line', showSymbol: false, data: v.points.map(p => [p.t, p.y])},
      {name: '目标r', type: 'line', showSymbol: false, lineStyle: {type: 'dashed'}, data: [[0,v.points[0].r],[30,v.points[0].r]]},
      {name: '加热指令u', type: 'line', step: 'end', yAxisIndex: 1, showSymbol: false, data: v.points.map(p => [p.t, p.u])}
    ]}), [v]);
  const chart = useECharts(option);
  return <section className="not-prose" aria-label="PID工程整定实验" style={{padding: 14, margin: '20px 0', border: '1px solid #cbd5e1', borderRadius: 10, minWidth: 0, color: '#172033'}}>
    <strong>同一整定规则，快慢与约束怎样一起改变？</strong>
    <p>固定模型K=2、T=4 s、L=0.5 s；Ts=0.05 s、零初态、限幅0–1、条件积分。只改变λ和检验工况，不自动重新辨识模型。</p>
    <label style={{display: 'block'}}>闭环时间参数 λ：{lambda.toFixed(2)} s<input aria-label="闭环时间参数λ" type="range" min={.25} max={3} step={.25} value={lambda} onChange={e => setLambda(+e.target.value)} style={{width: '100%'}} /></label>
    <label>检验工况 <select aria-label="检验工况" value={scenario} onChange={e => setScenario(e.target.value as TuningScenario)} style={{padding: 6, maxWidth: '100%'}}>{Object.entries(names).map(([key,name]) => <option key={key} value={key}>{name}</option>)}</select></label>
    <p data-tuning-gains>Kp={v.Kp.toFixed(4)} 指令/℃；Ti={v.Ti.toFixed(4)} s；Ki={v.Ki.toFixed(4)} 指令/(℃·s)。</p>
    <div ref={chart} style={{width: '100%', height: 290}} />
    <p aria-live="polite" data-tuning-metrics>IAE={v.metrics.iae.toFixed(4)} ℃·s；采样超调={v.metrics.overshoot.toFixed(4)}%；TV(u)={v.metrics.tv.toFixed(4)}；饱和={v.metrics.saturated}拍；末样误差={v.metrics.finalError.toFixed(4)} ℃。</p>
    <p>{scenario === 'unreachable' ? '模型稳态上界为2℃，目标3℃不可达。减小λ不能增加执行器容量。' : '指标窗口0–30 s；末样误差不代表稳态极限。曲线和指标用于这个教学模型的参数观察。'}</p>
    <button onClick={() => {setLambda(1);setScenario('nominal');}} style={{padding: 8, border: '1px solid #cbd5e1', borderRadius: 6}}>恢复默认</button>
  </section>;
}
