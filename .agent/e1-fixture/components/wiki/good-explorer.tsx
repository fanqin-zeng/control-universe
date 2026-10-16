"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

export function GoodExplorer() {
  const [k, setK] = useState(1);

  const data = useMemo(() => {
    const out: [number, number][] = [];
    for (let t = 0; t <= 5; t += 0.05) out.push([t, Math.exp(-k * t)]);
    return out;
  }, [k]);

  const option: EChartsOption = useMemo(() => ({
    animation: false,
    xAxis: { type: "value", min: 0, max: 5 },
    yAxis: { type: "value", min: 0, max: 1.2 },
    series: [{ type: "line", showSymbol: false, data }],
  }), [data]);

  const chartRef = useECharts(option);

  return (
    <div style={{ padding: 12 }}>
      <input type="range" min={0.1} max={3} step={0.1} value={k}
        onChange={(e) => setK(Number(e.target.value))} />
      <div ref={chartRef} style={{ width: "100%", height: 320 }} />
    </div>
  );
}
