"use client";
import { useEffect, useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "@/components/wiki/use-echarts";
export function calculateMotion(t: number) {
  if (!Number.isFinite(t) || t < 0 || t > 4) throw Error("时间范围为0到4秒");
  return { t, position: t * t, speed: 2 * t,
    positions: Array.from({ length: 81 }, (_, i) => [i / 20, (i / 20) ** 2]),
    speeds: Array.from({ length: 81 }, (_, i) => [i / 20, i / 10]) };
}
export function MotionIntroExplorer() {
  const [t, setT] = useState(0), [playing, setPlaying] = useState(false);
  useEffect(() => { if (!playing) return; const timer = setInterval(() => setT(v => Math.min(4, v + 0.05)), 100); return () => clearInterval(timer); }, [playing]);
  useEffect(() => { if (t >= 4) setPlaying(false); }, [t]);
  const data = useMemo(() => calculateMotion(t), [t]);
  const option: EChartsOption = useMemo(() => ({ animation: false,
    grid: [{ left: 48, right: 22, top: 30, height: 105 }, { left: 48, right: 22, top: 195, height: 105 }],
    xAxis: [{ type: "value", gridIndex: 0, min: 0, max: 4, name: "时间(s)" }, { type: "value", gridIndex: 1, min: 0, max: 4, name: "时间(s)" }],
    yAxis: [{ type: "value", min: 0, max: 16, name: "位置(m)" }, { type: "value", gridIndex: 1, min: 0, max: 8, name: "速度(m/s)" }],
    series: [{ type: "line", showSymbol: false, data: data.positions, lineStyle: { color: "#2563eb" } },
      { type: "scatter", data: [[t, data.position]], symbolSize: 10, itemStyle: { color: "#dc2626" } },
      { type: "line", xAxisIndex: 1, yAxisIndex: 1, showSymbol: false, data: data.speeds, lineStyle: { color: "#15803d" } },
      { type: "scatter", xAxisIndex: 1, yAxisIndex: 1, data: [[t, data.speed]], symbolSize: 10, itemStyle: { color: "#dc2626" } }] }), [data, t]);
  const ref = useECharts(option);
  return <section aria-label="小车运动演示" style={{ color: "var(--foreground)", border: "1px solid var(--border)", padding: 14, margin: "16px 0", borderRadius: 8 }}>
    <p style={{ margin: 0 }}>先看小车怎样走：播放或拖动时间，观察两条曲线上的红点。</p>
    <svg viewBox="0 0 380 65" role="img" aria-label="小车沿直线向右运动" style={{ width: "100%", height: 70 }}>
      <line x1="25" y1="50" x2="355" y2="50" stroke="#64748b" />
      <text x="25" y="64" fontSize="11" fill="currentColor">起点 0 m</text><text x="315" y="64" fontSize="11" fill="currentColor">16 m</text>
      <g transform={`translate(${25 + data.position / 16 * 300},20)`}><rect width="28" height="18" rx="4" fill="#2563eb"/><circle cx="6" cy="22" r="4" fill="#334155"/><circle cx="22" cy="22" r="4" fill="#334155"/></g>
    </svg>
    <div aria-live="polite">时间 {t.toFixed(2)} s；当前位置 / 已走路程 {data.position.toFixed(2)} m；当前速度 {data.speed.toFixed(2)} m/s</div>
    <input type="range" aria-label="演示时间" min={0} max={4} step={0.05} value={t} onChange={e => { setPlaying(false); setT(Number(e.target.value)); }} style={{ width: "100%", margin: "10px 0" }} />
    <div style={{ display: "flex", gap: 10 }}><button style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--background)", color: "var(--foreground)", cursor: "pointer" }} type="button" onClick={() => { if (t >= 4) setT(0); setPlaying(v => !v); }}>{playing ? "暂停" : "播放"}</button><button style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--background)", color: "var(--foreground)", cursor: "pointer" }} type="button" onClick={() => { setPlaying(false); setT(0); }}>回到起点</button></div>
    <div ref={ref} style={{ width: "100%", height: 345 }} />
    <p style={{ margin: 0, fontSize: 13 }}>蓝线记录位置，绿线记录速度，红点表示当前时刻。小车始终向右走，所以本例的路程等于位置变化；若折返，两者就不同。播放速度只影响演示节奏。</p>
  </section>;
}
