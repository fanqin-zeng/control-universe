"use client";

import { useState } from "react";
import { useECharts } from "./use-echarts";
import * as echarts from "echarts";

export function NyquistLimitCycleExplorer() {
  const [K, setK] = useState(1);
  const [T1, setT1] = useState(1);
  const [T2, setT2] = useState(0.5);
  const [nonlinearityType, setNonlinearityType] = useState<"saturation" | "relay">("relay");

  // Calculate G(jω) = K / (s(s+T1)(T2*s+1))
  const calculateG = (omega: number): { real: number; imag: number } => {
    const a = omega;
    const denom_mag_sq = a * a * (a * a + T1 * T1) * (T2 * T2 * a * a + 1);
    const phase = -Math.PI / 2 - Math.atan(a / T1) - Math.atan(a * T2);
    
    const G_mag = K / Math.sqrt(denom_mag_sq);
    return {
      real: G_mag * Math.cos(phase),
      imag: G_mag * Math.sin(phase),
    };
  };

  // Calculate -1/N(A)
  const calculateNegInvN = (A: number): number => {
    if (nonlinearityType === "saturation") {
      if (A <= 1.01) return -10; // N = k in the linear region, locus starts at -1/k
      const k = 1, a = 1;
      const alpha = Math.asin(Math.min(a / A, 1));
      const N = (2 * k / Math.PI) * (alpha + Math.sin(alpha) * Math.cos(alpha));
      return -1 / N;
    } else {
      // Relay: N(A) = 4M/(πA), M=1
      const N = 4 / (Math.PI * A);
      return -1 / N;
    }
  };

  // Generate G(jω) curve
  const nyquistData: [number, number][] = [];
  const omegaData: number[] = [];
  for (let omega = 0.1; omega <= 10; omega += 0.05) {
    const G = calculateG(omega);
    nyquistData.push([G.real, G.imag]);
    omegaData.push(omega);
  }

  // Generate -1/N(A) trajectory (on negative real axis)
  // Relay: N is finite for any A > 0, so the locus starts at the origin and walks to -inf.
  // Saturation: N <= k, so the locus starts at -1/k.
  const aStart = nonlinearityType === "relay" ? 0.02 : 1.05;
  const aStep = nonlinearityType === "relay" ? 0.02 : 0.1;
  const negInvNData: [number, number][] = [];
  const ampData: number[] = [];
  for (let A = aStart; A <= 10; A += aStep) {
    const negInvN = calculateNegInvN(A);
    negInvNData.push([negInvN, 0]);
    ampData.push(A);
  }

  // Find intersection point (approximate)
  let intersectionPoint: [number, number] | null = null;
  let intersectionOmega = 0;
  let intersectionAmp = 0;
  for (let i = 0; i < nyquistData.length - 1; i++) {
    const [real1, imag1] = nyquistData[i];
    const [real2, imag2] = nyquistData[i + 1];
    
    // Check if imaginary part crosses zero
    if (imag1 * imag2 < 0 && real1 < 0 && real2 < 0) {
      // Linear interpolation
      const ratio = -imag1 / (imag2 - imag1);
      const realCross = real1 + ratio * (real2 - real1);
      intersectionPoint = [realCross, 0];
      intersectionOmega = omegaData[i] + ratio * (omegaData[i + 1] - omegaData[i]);
      break;
    }
  }

  // The -1/N locus runs monotonically from its starting value to -inf as A grows,
  // so an intersection exists only if the crossing point lies on (or left of) that start.
  let hasIntersection = false;
  if (intersectionPoint && negInvNData.length > 0) {
    const locusStart = negInvNData[0][0];
    if (intersectionPoint[0] <= locusStart) {
      let lo = aStart;
      let hi = 10;
      for (let it = 0; it < 60; it++) {
        const mid = 0.5 * (lo + hi);
        if (calculateNegInvN(mid) > intersectionPoint[0]) lo = mid;
        else hi = mid;
      }
      intersectionAmp = 0.5 * (lo + hi);
      hasIntersection = true;
    } else {
      intersectionPoint = null;
    }
  }

  const series: echarts.EChartsOption["series"] = [
    {
      name: "G(jω)",
      type: "line",
      data: nyquistData,
      lineStyle: { width: 2, color: "#1e40af" },
      symbol: "none",
    },
    {
      name: "-1/N(A)",
      type: "line",
      data: negInvNData,
      lineStyle: { width: 2, color: "#dc2626" },
      symbol: "none",
    },
    ...(intersectionPoint
      ? [
          {
            name: "交点",
            type: "scatter" as const,
            data: [intersectionPoint],
            symbolSize: 10,
            itemStyle: { color: "#16a34a" },
          },
        ]
      : []),
    {
      name: "(-1, j0)",
      type: "scatter",
      data: [[-1, 0]],
      symbolSize: 8,
      itemStyle: { color: "#000" },
    },
  ];

  const option: echarts.EChartsOption = {
    animation: false,
    grid: { top: 40, right: 40, bottom: 60, left: 60 },
    xAxis: {
      type: "value",
      name: "实部",
      min: -3,
      max: 1,
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: "虚部",
      min: -2,
      max: 2,
      nameLocation: "middle",
      nameGap: 45,
    },
    series,
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: 10,
      data: hasIntersection
        ? ["G(jω)", "-1/N(A)", "交点", "(-1, j0)"]
        : ["G(jω)", "-1/N(A)", "(-1, j0)"],
    },
  };

  const chartRef = useECharts(option);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">非线性类型:</label>
          <select
            value={nonlinearityType}
            onChange={(e) => setNonlinearityType(e.target.value as "saturation" | "relay")}
            className="border rounded px-2 py-1"
          >
            <option value="saturation">饱和</option>
            <option value="relay">继电器</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">增益 K:</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={K}
            onChange={(e) => setK(parseFloat(e.target.value))}
            className="w-32"
          />
          <span className="ml-2 text-sm">{K.toFixed(1)}</span>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">时间常数 T₁:</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={T1}
            onChange={(e) => setT1(parseFloat(e.target.value))}
            className="w-32"
          />
          <span className="ml-2 text-sm">{T1.toFixed(1)}</span>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">时间常数 T₂:</label>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.1"
            value={T2}
            onChange={(e) => setT2(parseFloat(e.target.value))}
            className="w-32"
          />
          <span className="ml-2 text-sm">{T2.toFixed(1)}</span>
        </div>
      </div>
      
      <div ref={chartRef} className="h-96 w-full" />
      
      {hasIntersection && intersectionPoint && (
        <div style={{ fontSize: 13, padding: 12, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, marginTop: 12 }}>
          <strong>预测的极限环：</strong>
          振幅 A = {intersectionAmp.toFixed(4)}，频率 ω = {intersectionOmega.toFixed(4)} rad/s
          （f = {(intersectionOmega / (2 * Math.PI)).toFixed(4)} Hz）；
          交点位置 ({intersectionPoint[0].toFixed(3)}, 0) = -1/N(A)
        </div>
      )}

      {!hasIntersection && (
        <div style={{ fontSize: 13, padding: 12, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, marginTop: 12 }}>
          <strong>无交点：</strong>
          G(jω) 的负实轴穿越点没有落在 -1/N(A) 轨迹上，描述函数判定不存在极限环
          （{nonlinearityType === "saturation" ? "饱和的 N ≤ k，轨迹只从 -1/k 向左" : "继电器轨迹从原点向左"}）。
        </div>
      )}
    </div>
  );
}
