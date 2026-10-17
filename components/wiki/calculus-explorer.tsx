"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import { useECharts } from "@/components/wiki/use-echarts";

/** 页面使用的实际计算实现；镜像验收直接加载本函数，不另抄JS公式。 */
export function calculateCalculus(h: number, n: number) {
  if (!Number.isFinite(h) || Math.abs(h) > 1 || !Number.isInteger(n) || n < 1 || n > 16) {
    throw new Error("参数超出教学范围");
  }
  const position = (t: number) => t * t;
  // 约分后的式子避免小增量相减损失；h=0仍然不是差商的定义点。
  const secant = h === 0 ? null : 4 + h;
  const width = 2 / n;
  const rectangles = Array.from({ length: n }, (_, i) => ({
    start: i * width, end: (i + 1) * width, height: 2 * (i + 1) * width,
  }));
  const rightSum = rectangles.reduce((sum, r) => sum + width * r.height, 0);
  return {
    h, n, secant, derivative: 4, basePosition: 4, shiftedPosition: position(2 + h),
    rightSum, exactIntegral: 4, width, rectangles,
    curve: Array.from({ length: 201 }, (_, i) => { const t = i / 50; return [t, position(t)]; }),
  };
}

export function CalculusExplorer({ mode = "derivative" }: { mode?: "derivative" | "integral" }) {
  const [h, setH] = useState(0.5);
  const [n, setN] = useState(4);
  const data = useMemo(() => calculateCalculus(h, n), [h, n]);
  const option: EChartsOption = useMemo(() => mode === "derivative" ? {
    animation: false,
    tooltip: { trigger: "axis" },
    legend: { data: ["位置 s(t)=t²", "割线段", "切线"], top: 0 },
    grid: { left: 54, right: 22, top: 55, bottom: 42 },
    xAxis: { type: "value", min: 0, max: 4, name: "t (s)" },
    yAxis: { type: "value", min: 0, max: 16, name: "s (m)" },
    series: [
      { name: "位置 s(t)=t²", type: "line", showSymbol: false, data: data.curve, lineStyle: { color: "#2563eb" } },
      { name: "割线段", type: "line", data: h === 0 ? [] : [[2, 4], [2 + h, data.shiftedPosition]], symbolSize: 8, lineStyle: { color: "#ea580c", width: 3 } },
      { name: "切线", type: "line", showSymbol: false, data: [[1, 0], [3, 8]], lineStyle: { color: "#15803d", type: "dashed" } },
    ],
  } : {
    animation: false,
    tooltip: { trigger: "axis" },
    legend: { data: ["速度 v(t)=2t", "右端矩形"], top: 0 },
    grid: { left: 54, right: 22, top: 55, bottom: 42 },
    xAxis: { type: "value", min: 0, max: 2, name: "t (s)" },
    yAxis: { type: "value", min: 0, max: 4, name: "v (m/s)" },
    series: [
      // 阶梯线按每段右端速度取高度；不把折线插值误画成梯形。
      { name: "右端矩形", type: "line", step: "end", showSymbol: false,
        data: [...data.rectangles.map(r => [r.start, r.height]), [2, 4]],
        lineStyle: { color: "#ea580c", width: 1 }, areaStyle: { color: "#fed7aa", opacity: 0.5 } },
      { name: "速度 v(t)=2t", type: "line", showSymbol: false, data: [[0, 0], [2, 4]], lineStyle: { color: "#2563eb", width: 2 } },
    ],
  }, [mode, data, h]);
  const chartRef = useECharts(option);
  const isDerivative = mode === "derivative";
  return <section aria-label={isDerivative ? "割线与切线实验" : "速度累积实验"}
    style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 16, color: "var(--foreground)", margin: "20px 0", minWidth: 0 }}>
    <p style={{ margin: "0 0 10px", fontWeight: 600 }}>{isDerivative ? "拖动增量，分清差商与导数" : "改变矩形数，分清有限和与积分"}</p>
    <label style={{ display: "block" }}>
      {isDerivative ? `时间增量 h = ${h.toFixed(2)} s` : `矩形个数 N = ${n}`}
      <input aria-label={isDerivative ? "时间增量 h" : "矩形个数 N"} type="range"
        min={isDerivative ? -1 : 1} max={isDerivative ? 1 : 16} step={isDerivative ? 0.05 : 1}
        value={isDerivative ? h : n}
        onChange={event => isDerivative ? setH(Number(event.target.value)) : setN(Number(event.target.value))}
        style={{ display: "block", width: "100%", margin: "10px 0" }} />
    </label>
    <div aria-live="polite" style={{ display: "flex", flexWrap: "wrap", gap: "8px 22px", fontVariantNumeric: "tabular-nums" }}>
      {isDerivative ? <><span>差商：<strong>{data.secant === null ? "未定义（h=0）" : `${data.secant.toFixed(4)} m/s`}</strong></span><span>导数：<strong>{data.derivative.toFixed(4)} m/s</strong></span></>
        : <><span>右端和：<strong>{data.rightSum.toFixed(4)} m</strong></span><span>积分：<strong>{data.exactIntegral.toFixed(4)} m</strong></span></>}
    </div>
    <div ref={chartRef} style={{ width: "100%", height: 300, minWidth: 0 }} />
    <p style={{ fontSize: 13, margin: "6px 0" }}>{isDerivative
      ? "橙色只连两个取样点，绿色为 t=2 的切线；h=0 时隐藏割线，不能计算 0/0。"
      : "橙色高度取各段右端速度，宽为 2/N；固定速度纵轴，有限矩形和不会伪装成积分极限。"}</p>
    <button type="button" onClick={() => { setH(0.5); setN(4); }}
      style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--background)", color: "var(--foreground)", cursor: "pointer" }}>恢复默认</button>
  </section>;
}
