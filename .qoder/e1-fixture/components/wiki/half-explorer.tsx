"use client";

import { useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

export function HalfExplorer() {
  const option: EChartsOption = useMemo(() => ({
    animation: false,
    xAxis: { type: "category", data: ["A", "B", "C"] },
    yAxis: { type: "value", min: 0, max: 10 },
    series: [{ type: "bar", data: [3, 6, 9] }],
  }), []);

  const chartRef = useECharts(option);

  return <div ref={chartRef} style={{ width: "100%", height: 320 }} />;
}
