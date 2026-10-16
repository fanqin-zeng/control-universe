"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

function routhTable(coeffs: number[]): [number[][], boolean, number] {
  const n = coeffs.length - 1;
  const rows = n + 1;
  const cols = Math.floor((n + 2) / 2);
  const table: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  
  // Fill first two rows with alternating coefficients
  for (let j = 0; j < Math.ceil((n + 1) / 2); j++) {
    if (j < cols) table[0][j] = coeffs[2 * j];
  }
  for (let j = 0; j < Math.floor((n + 1) / 2); j++) {
    if (j < cols) table[1][j] = coeffs[2 * j + 1];
  }
  
  for (let i = 2; i < rows; i++) {
    for (let j = 0; j < cols - 1; j++) {
      if (Math.abs(table[i - 1][0]) < 1e-12) {
        table[i - 1][0] = 1e-10;
      }
      const det = table[i - 1][0] * table[i - 2][j + 1] - table[i - 2][0] * table[i - 1][j + 1];
      table[i][j] = det / table[i - 1][0];
    }
  }
  
  const firstCol = table.map(row => row[0]);
  let signChanges = 0;
  for (let i = 1; i < firstCol.length; i++) {
    if ((firstCol[i] > 0 && firstCol[i - 1] < 0) || (firstCol[i] < 0 && firstCol[i - 1] > 0)) {
      signChanges++;
    }
  }
  
  return [table, signChanges === 0, signChanges];
}

function padeApprox(K: number, L: number, order: number = 1): number[] {
  let numDelay: number[];
  let denDelay: number[];
  
  if (order === 1) {
    numDelay = [-L / 2, 1];
    denDelay = [L / 2, 1];
  } else {
    numDelay = [L ** 2 / 12, -L / 2, 1];
    denDelay = [L ** 2 / 12, L / 2, 1];
  }
  
  const numPlant = [K];
  const denPlant = [1, 2, 0];
  
  const numOpen = multiplyPolynomials(numPlant, numDelay);
  const denOpen = multiplyPolynomials(denPlant, denDelay);
  
  const maxLen = Math.max(numOpen.length, denOpen.length);
  const numPadded = new Array(maxLen).fill(0);
  const denPadded = new Array(maxLen).fill(0);
  
  for (let i = 0; i < numOpen.length; i++) {
    numPadded[maxLen - numOpen.length + i] = numOpen[i];
  }
  for (let i = 0; i < denOpen.length; i++) {
    denPadded[maxLen - denOpen.length + i] = denOpen[i];
  }
  
  return denPadded.map((d, i) => d + numPadded[i]);
}

function multiplyPolynomials(a: number[], b: number[]): number[] {
  const result = new Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      result[i + j] += a[i] * b[j];
    }
  }
  return result;
}

export function StabilityDelayExplorer() {
  const [K, setK] = useState(5.0);
  
  const data = useMemo(() => {
    const lValues: number[] = [];
    for (let i = 1; i <= 100; i++) {
      lValues.push(i * 0.01);
    }
    
    const stableL: boolean[] = [];
    for (const L of lValues) {
      const coeffs = padeApprox(K, L, 1);
      const [, isStable] = routhTable(coeffs);
      stableL.push(isStable);
    }
    
    const kTestValues = [1, 2, 5, 10];
    const multiCurves: { k: number; data: [number, number][] }[] = [];
    
    for (const kTest of kTestValues) {
      const curveData: [number, number][] = [];
      for (let i = 0; i < lValues.length; i++) {
        const L = lValues[i];
        const coeffs = padeApprox(kTest, L, 1);
        const [, isStable] = routhTable(coeffs);
        curveData.push([L, isStable ? 1 : 0]);
      }
      multiCurves.push({ k: kTest, data: curveData });
    }
    
    let lMax = 0;
    for (let i = stableL.length - 1; i >= 0; i--) {
      if (stableL[i]) {
        lMax = lValues[i];
        break;
      }
    }
    
    return {
      lValues,
      stableL,
      multiCurves,
      lMax,
    };
  }, [K]);
  
  const leftOption = useMemo(() => ({
    title: { text: `时滞对稳定性的影响 (K=${K.toFixed(1)})`, left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["稳定", "不稳定"] },
    xAxis: {
      type: "value" as const,
      name: "时滞 L (s)",
      min: 0,
      max: 1.0,
    },
    yAxis: {
      type: "value" as const,
      name: "稳定性",
      min: 0,
      max: 1,
    },
    series: [
      {
        name: "稳定",
        type: "line" as const,
        data: data.lValues.map((l, i) => [l, data.stableL[i] ? 1 : 0]),
        lineStyle: { width: 2, color: "#2ecc71" },
        symbol: "none",
        areaStyle: { opacity: 0.3 },
      },
    ],
    animation: false,
  }), [data, K]);
  
  const rightOption = useMemo(() => ({
    title: { text: "不同增益下的最大允许时滞", left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30 },
    xAxis: {
      type: "value" as const,
      name: "时滞 L (s)",
      min: 0,
      max: 1.0,
    },
    yAxis: {
      type: "value" as const,
      name: "稳定性",
      min: 0,
      max: 1,
    },
    series: data.multiCurves.map((curve) => ({
      name: `K=${curve.k}`,
      type: "line" as const,
      data: curve.data,
      lineStyle: { 
        width: 2, 
        color: curve.k === K ? "#000" : undefined,
        opacity: curve.k === K ? 1.0 : 0.4,
      },
      symbol: "none",
    })),
    animation: false,
  }), [data, K]);
  
  const leftChartRef = useECharts(leftOption);
  const rightChartRef = useECharts(rightOption);
  
  return (
    <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px" }}>
        <label style={{ fontSize: "14px" }}>K:</label>
        <input
          type="range"
          min={0.5}
          max={15.0}
          step={0.5}
          value={K}
          onChange={(e) => setK(parseFloat(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: "14px", minWidth: "50px" }}>{K.toFixed(1)}</span>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div ref={leftChartRef} style={{ height: "400px" }} />
        <div ref={rightChartRef} style={{ height: "400px" }} />
      </div>
      
      <div style={{ padding: "10px", background: "#f5f5f5", borderRadius: "4px" }}>
        <p style={{ margin: 0, fontSize: "14px" }}>
          K={K.toFixed(1)} 时最大允许时滞 L_max ≈ {data.lMax.toFixed(3)} s
        </p>
      </div>
    </div>
  );
}
