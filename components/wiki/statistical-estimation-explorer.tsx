"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "@/components/wiki/use-echarts";
import { statisticalEstimate, statisticalObjectives } from "@/lib/statistical-estimation";

export function StatisticalEstimationExplorer() {
  const [r1, setR1] = useState(4);
  const [r2, setR2] = useState(1);
  const [p, setP] = useState(4);
  const result = statisticalEstimate(r1, r2, p);
  const option = useMemo<EChartsOption>(() => {
    const mle = statisticalObjectives(result.weighted, r1, r2, p).data;
    const map = statisticalObjectives(result.posterior, r1, r2, p).posterior;
    const data = Array.from({ length: 121 }, (_, i) => {
      const theta = 16 + i / 10;
      const objectives = statisticalObjectives(theta, r1, r2, p);
      return { theta, data: Math.max(0, objectives.data - mle), posterior: Math.max(0, objectives.posterior - map) };
    });
    return {
      animation: false,
      tooltip: { trigger: "axis" as const },
      legend: { data: ["数据目标", "加入先验后的目标"], top: 0, textStyle: { fontSize: 11 } },
      grid: { left: 48, right: 15, top: 55, bottom: 45 },
      xAxis: { type: "value" as const, min: 16, max: 28, name: "候选温度 θ / °C", nameLocation: "middle" as const, nameGap: 27 },
      yAxis: { type: "value" as const, min: 0, max: 220, name: "目标增量（无量纲）", nameTextStyle: { fontSize: 11 } },
      series: [
        { type: "line" as const, name: "数据目标", showSymbol: false, data: data.map(v => [v.theta, v.data]), markPoint: { symbol: "circle", symbolSize: 12, label: { show: false }, data: [{ name: "ML最小点", coord: [result.weighted, 0] }] } },
        { type: "line" as const, name: "加入先验后的目标", showSymbol: false, data: data.map(v => [v.theta, v.posterior]), markPoint: { symbol: "circle", symbolSize: 12, label: { show: false }, data: [{ name: "MAP最小点", coord: [result.posterior, 0] }] } },
      ],
    };
  }, [r1, r2, p, result.weighted, result.posterior]);
  const chart = useECharts(option);
  return <section aria-label="统计估计目标探索" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 16, margin: "20px 0", minWidth: 0 }}>
    <p style={{ marginTop: 0 }}>两次合成读数固定为 22°C 和 24°C，先验均值固定为 20°C。改变方差，看最小点的位置怎样变化。</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      <label>读数一方差 R₁（°C²） <select aria-label="读数一方差" value={r1} onChange={e => setR1(Number(e.target.value))}>{[0.25, 1, 4, 9, 16].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <label>读数二方差 R₂（°C²） <select aria-label="读数二方差" value={r2} onChange={e => setR2(Number(e.target.value))}>{[0.25, 1, 4, 9, 16].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
      <label>先验方差 P（°C²） <select aria-label="先验方差" value={p} onChange={e => setP(Number(e.target.value))}>{[1, 4, 16].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
    </div>
    <button style={{ marginTop: 16 }} type="button" onClick={() => { setR1(4); setR2(1); setP(4); }}>恢复默认</button>
    <p data-testid="statistics-readout" aria-live="polite">等权 LS {result.ordinary.toFixed(4)} °C；WLS / ML {result.weighted.toFixed(4)} °C，标称方差 {result.weightedVariance.toFixed(4)} °C²；高斯后验均值 / MAP {result.posterior.toFixed(4)} °C，后验方差 {result.posteriorVariance.toFixed(4)} °C²。</p>
    <div ref={chart} style={{ width: "100%", height: 285 }} />
    <p style={{ marginBottom: 0 }}>两条曲线分别减去自己的最小值，纵轴不是估计误差，也不能用曲线高度判断谁更准。假设方差已知且误差独立、高斯模型成立；偏置、相关性与先验失配没有在控件中模拟。</p>
  </section>;
}
