"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

/**
 * PID控制器 - Ki 和 Kd 参数对闭环响应的影响
 * 
 * 被控对象: G(s) = 1/(s+1)
 * 控制器: C(s) = Kp + Ki/s + Kd*s (简化为 PI 或 PID)
 * 
 * 左图展示不同 Ki 对 PI 响应的影响（Kp=1）
 * 右图展示不同 Kd 对 PID 响应的影响（Kp=2, Ki=1）
 */

// 简化的阶跃响应计算（二阶系统近似）
function computeStepResponse(Kp: number, Ki: number, Kd: number, tEnd: number = 10, numPoints: number = 500) {
  const t: number[] = [];
  const y: number[] = [];
  
  // 被控对象 G(s) = 1/(s+1)，控制器 C(s) = Kp + Ki/s + Kd*s
  // 开环传递函数 L(s) = C(s)*G(s) = (Kd*s^2 + Kp*s + Ki) / (s*(s+1))
  // 闭环传递函数 T(s) = L(s)/(1+L(s)) = (Kd*s^2 + Kp*s + Ki) / ((1+Kd)*s^2 + (1+Kp)*s + Ki)
  
  const a2 = 1 + Kd;
  const a1 = 1 + Kp;
  const a0 = Ki;
  
  // 特征方程: a2*s^2 + a1*s + a0 = 0
  const discriminant = a1 * a1 - 4 * a2 * a0;
  
  for (let i = 0; i <= numPoints; i++) {
    const time = (i / numPoints) * tEnd;
    let response: number;
    
    if (Ki === 0) {
      // 纯 P 或 PD 控制，无积分作用，有稳态误差
      const steadyState = Kp / (1 + Kp);
      const tau = (1 + Kd) / (1 + Kp);
      response = steadyState * (1 - Math.exp(-time / tau));
    } else if (discriminant > 0) {
      // 过阻尼
      const s1 = (-a1 + Math.sqrt(discriminant)) / (2 * a2);
      const s2 = (-a1 - Math.sqrt(discriminant)) / (2 * a2);
      const A = s2 / (s2 - s1);
      const B = -s1 / (s2 - s1);
      response = 1 + A * Math.exp(s1 * time) + B * Math.exp(s2 * time);
    } else if (discriminant === 0) {
      // 临界阻尼
      const s = -a1 / (2 * a2);
      response = 1 - Math.exp(s * time) * (1 - s * time);
    } else {
      // 欠阻尼振荡
      const sigma = -a1 / (2 * a2);
      const wd = Math.sqrt(-discriminant) / (2 * a2);
      const phi = Math.atan(wd / (-sigma));
      const amplitude = Math.sqrt(1 + Math.pow(sigma / wd, 2));
      response = 1 - amplitude * Math.exp(sigma * time) * Math.sin(wd * time + phi);
    }
    
    t.push(time);
    y.push(response);
  }
  
  return [t, y];
}

export function PidKiKdExplorer() {
  const [ki, setKi] = useState(2.0);
  const [kd, setKd] = useState(0.2);
  
  // 左图数据：不同 Ki 对 PI 响应的影响（Kp=1, Kd=0）
  const kiCurves = useMemo(() => {
    const curves = [];
    const kiValues = [0.5, 2.0, 10.0];
    
    for (const kiVal of kiValues) {
      const [t, y] = computeStepResponse(1.0, kiVal, 0.0);
      curves.push({ ki: kiVal, t, y });
    }
    
    // 当前值曲线
    const [tCurrent, yCurrent] = computeStepResponse(1.0, ki, 0.0);
    return { curves, tCurrent, yCurrent };
  }, [ki]);
  
  // 右图数据：不同 Kd 对 PID 响应的影响（Kp=2, Ki=1）
  const kdCurves = useMemo(() => {
    const curves = [];
    const kdValues = [0.0, 0.2, 1.0];
    
    for (const kdVal of kdValues) {
      const [t, y] = computeStepResponse(2.0, 1.0, kdVal);
      curves.push({ kd: kdVal, t, y });
    }
    
    // 当前值曲线
    const [tCurrent, yCurrent] = computeStepResponse(2.0, 1.0, kd);
    return { curves, tCurrent, yCurrent };
  }, [kd]);
  
  const leftOption = useMemo(() => ({
    title: { text: "不同 Ki 对 PI 响应的影响", left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["Ki=0.5", "Ki=2.0", "Ki=10.0", `Ki=${ki.toFixed(1)} (当前)`] },
    xAxis: {
      type: "value" as const,
      name: "Time (s)",
      min: 0,
      max: 10,
    },
    yAxis: {
      type: "value" as const,
      name: "y(t)",
      min: 0,
      max: 1.8,
    },
    series: [
      ...kiCurves.curves.map((curve) => ({
        name: `Ki=${curve.ki}`,
        type: "line" as const,
        data: curve.t.map((t, i) => [t, curve.y[i]]),
        lineStyle: { width: 2, opacity: 0.4 },
        symbol: "none",
      })),
      {
        name: `Ki=${ki.toFixed(1)} (当前)`,
        type: "line" as const,
        data: kiCurves.tCurrent.map((t, i) => [t, kiCurves.yCurrent[i]]),
        lineStyle: { width: 3, color: "#000" },
        symbol: "none",
      },
      {
        name: "稳态值",
        type: "line" as const,
        data: [[0, 1], [10, 1]],
        lineStyle: { type: "dotted" as const, color: "#999" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [kiCurves, ki]);
  
  const rightOption = useMemo(() => ({
    title: { text: "不同 Kd 对闭环响应的影响（Kp=2, Ki=1）", left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 30, data: ["Kd=0 (PI)", "Kd=0.2", "Kd=1.0", `Kd=${kd.toFixed(2)} (当前)`] },
    xAxis: {
      type: "value" as const,
      name: "Time (s)",
      min: 0,
      max: 10,
    },
    yAxis: {
      type: "value" as const,
      name: "y(t)",
      min: 0,
      max: 1.8,
    },
    series: [
      ...kdCurves.curves.map((curve) => ({
        name: curve.kd === 0 ? "Kd=0 (PI)" : `Kd=${curve.kd}`,
        type: "line" as const,
        data: curve.t.map((t, i) => [t, curve.y[i]]),
        lineStyle: { width: 2, opacity: 0.4 },
        symbol: "none",
      })),
      {
        name: `Kd=${kd.toFixed(2)} (当前)`,
        type: "line" as const,
        data: kdCurves.tCurrent.map((t, i) => [t, kdCurves.yCurrent[i]]),
        lineStyle: { width: 3, color: "#000" },
        symbol: "none",
      },
      {
        name: "稳态值",
        type: "line" as const,
        data: [[0, 1], [10, 1]],
        lineStyle: { type: "dotted" as const, color: "#999" },
        symbol: "none",
      },
    ],
    animation: false,
  }), [kdCurves, kd]);
  
  return (
    <div style={{ padding: "16px 0" }}>
      <div style={{ marginBottom: 16, display: "flex", gap: 32 }}>
        <div>
          <label style={{ fontWeight: 600, marginRight: 12 }}>
            Ki (积分增益):
          </label>
          <input
            type="range"
            min={0.1}
            max={15.0}
            step={0.1}
            value={ki}
            onChange={(e) => setKi(parseFloat(e.target.value))}
            style={{ width: 200, verticalAlign: "middle" }}
          />
          <span style={{ marginLeft: 12, fontFamily: "monospace" }}>
            Ki = {ki.toFixed(1)}
          </span>
        </div>
        
        <div>
          <label style={{ fontWeight: 600, marginRight: 12 }}>
            Kd (微分增益):
          </label>
          <input
            type="range"
            min={0.0}
            max={2.0}
            step={0.05}
            value={kd}
            onChange={(e) => setKd(parseFloat(e.target.value))}
            style={{ width: 200, verticalAlign: "middle" }}
          />
          <span style={{ marginLeft: 12, fontFamily: "monospace" }}>
            Kd = {kd.toFixed(2)}
          </span>
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ height: 350 }}>
          <div ref={useECharts(leftOption)} style={{ width: "100%", height: "100%" }} />
        </div>
        <div style={{ height: 350 }}>
          <div ref={useECharts(rightOption)} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    </div>
  );
}
