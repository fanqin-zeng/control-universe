"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export function useECharts<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    chartRef.current = echarts.init(containerRef.current);

    const onResize = () => chartRef.current?.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  return { containerRef, chartRef };
}
