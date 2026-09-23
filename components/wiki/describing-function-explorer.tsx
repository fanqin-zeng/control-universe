"use client";

import { useState } from "react";
import { useECharts } from "./use-echarts";
import * as echarts from "echarts";

type NonlinearityType = "relay" | "saturation" | "deadzone" | "backlash";

export function DescribingFunctionExplorer() {
  const [type, setType] = useState<NonlinearityType>("saturation");
  const [param1, setParam1] = useState(1); // k for saturation/deadzone, M for relay, b for backlash
  const [param2, setParam2] = useState(1); // a for saturation/deadzone, h for relay with hysteresis

  const calculateN = (A: number): number => {
    if (A <= 0.01) return 0;
    
    switch (type) {
      case "relay":
        // Ideal relay: N(A) = 4M/(πA)
        return (4 * param1) / (Math.PI * A);
      
      case "saturation": {
        // Saturation: N(A) = (2k/π)[α + sin(α)cos(α)], α = arcsin(a/A)
        const alpha = Math.asin(Math.min(param2 / A, 1));
        return (2 * param1 / Math.PI) * (alpha + Math.sin(alpha) * Math.cos(alpha));
      }
      
      case "deadzone": {
        // Deadzone: N(A) = (2k/π)[π/2 - α - sin(α)cos(α)], α = arcsin(a/A)
        if (A < param2) return 0;
        const alpha = Math.asin(param2 / A);
        return (2 * param1 / Math.PI) * (Math.PI / 2 - alpha - Math.sin(alpha) * Math.cos(alpha));
      }
      
      case "backlash": {
        // Backlash (simplified real part only): approximate
        if (A < param2) return 0;
        const beta = Math.asin(1 - 2 * param2 / A);
        return (param1 / Math.PI) * (Math.PI / 2 + beta + Math.sin(beta) * Math.cos(beta));
      }
      
      default:
        return 0;
    }
  };

  const getParamLabels = () => {
    switch (type) {
      case "relay":
        return { label1: "M (relay level)", min1: 0.5, max1: 2, step1: 0.1, label2: "", min2: 0, max2: 0, step2: 0 };
      case "saturation":
        return { label1: "k (gain)", min1: 0.5, max1: 2, step1: 0.1, label2: "a (saturation point)", min2: 0.5, max2: 2, step2: 0.1 };
      case "deadzone":
        return { label1: "k (gain)", min1: 0.5, max1: 2, step1: 0.1, label2: "a (deadzone width)", min2: 0.2, max2: 1, step2: 0.1 };
      case "backlash":
        return { label1: "k (gain)", min1: 0.5, max1: 2, step1: 0.1, label2: "b (backlash half-width)", min2: 0.1, max2: 0.5, step2: 0.05 };
    }
  };

  const paramLabels = getParamLabels();

  const data: [number, number][] = [];
  for (let A = 0.1; A <= 5; A += 0.05) {
    data.push([A, calculateN(A)]);
  }

  const option: echarts.EChartsOption = {
    animation: false,
    grid: { top: 40, right: 40, bottom: 60, left: 60 },
    xAxis: {
      type: "value",
      name: "振幅 A",
      min: 0,
      max: 5,
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: "|N(A)|",
      min: 0,
      max: 2,
      nameLocation: "middle",
      nameGap: 45,
    },
    series: [
      {
        type: "line",
        data,
        smooth: true,
        lineStyle: { width: 2, color: "#1e40af" },
        symbol: "none",
      },
    ],
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const A = params[0].value[0].toFixed(2);
        const N = params[0].value[1].toFixed(3);
        return `A = ${A}<br/>|N(A)| = ${N}`;
      },
    },
  };

  const chartRef = useECharts(option);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">非线性类型:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as NonlinearityType)}
            className="border rounded px-2 py-1"
          >
            <option value="relay">理想继电器</option>
            <option value="saturation">饱和</option>
            <option value="deadzone">死区</option>
            <option value="backlash">间隙</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">{paramLabels.label1}:</label>
          <input
            type="range"
            min={paramLabels.min1}
            max={paramLabels.max1}
            step={paramLabels.step1}
            value={param1}
            onChange={(e) => setParam1(parseFloat(e.target.value))}
            className="w-32"
          />
          <span className="ml-2 text-sm">{param1.toFixed(1)}</span>
        </div>
        
        {paramLabels.label2 && (
          <div>
            <label className="block text-sm font-medium mb-1">{paramLabels.label2}:</label>
            <input
              type="range"
              min={paramLabels.min2}
              max={paramLabels.max2}
              step={paramLabels.step2}
              value={param2}
              onChange={(e) => setParam2(parseFloat(e.target.value))}
              className="w-32"
            />
            <span className="ml-2 text-sm">{param2.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div ref={chartRef} className="h-80 w-full" />
    </div>
  );
}
