"use client";

import { useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

export function BadExplorer() {
  const [k, setK] = useState(1);

  const data: [number, number][] = [];
  for (let t = 0; t <= 5; t += 0.05) data.push([t, Math.exp(-k * t)]);

  // 注入 5a：缺 animation:false；注入 5b：yAxis 是 value 轴却没有 min/max；
  // 注入 5c：option 是普通对象字面量而非 useMemo 产物
  const option: EChartsOption = {
    xAxis: { type: "value", min: 0, max: 5 },
    yAxis: { type: "value" },
    series: [{ type: "line", showSymbol: false, data }],
  };

  const chartRef = useECharts(option);

  return (
    <div style={{ padding: 12 }}>
      <input type="range" min={0.1} max={3} step={0.1} value={k}
        onChange={(e) => setK(Number(e.target.value))} />
      <div ref={chartRef} style={{ width: "100%", height: 320 }} />
    </div>
  );
}
