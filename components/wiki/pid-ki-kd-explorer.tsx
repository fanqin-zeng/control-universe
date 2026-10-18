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

import { pidResponse } from "@/lib/pid-response";
function computeStepResponse(kp: number, ki: number, kd: number) {
  const points=pidResponse(kp,ki,kd); return [points.map(p=>p[0]),points.map(p=>p[1])];
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
    title: { text: "Ki 与响应（Kp=1）", left: "center", textStyle: {fontSize: 15} },
    tooltip: { trigger: "axis" as const },
    legend: { type: "scroll" as const, top: 30, left: 10, right: 10 },
    grid: {top: 85, bottom: 45, left: 45, right: 25},
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
    title: { text: "Kd 与响应（Kp=2, Ki=1）", left: "center", textStyle: {fontSize: 15} },
    tooltip: { trigger: "axis" as const },
    legend: { type: "scroll" as const, top: 30, left: 10, right: 10 },
    grid: {top: 85, bottom: 45, left: 45, right: 25},
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
      <p>理想微分教学模型；包含零点和直通，不能直接作为执行器控制律。</p>
      <button onClick={() => {setKi(2);setKd(.2);}}>恢复 Ki/Kd 默认</button>
      <p data-testid="pid-response-values">默认左图 y(0)=0，当前 y(10)={kiCurves.yCurrent[500].toFixed(6)}；右图 y(0+)={kdCurves.yCurrent[0].toFixed(6)}，y(10)={kdCurves.yCurrent[500].toFixed(6)}</p>
      <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 16 }}>
        <div>
          <label style={{ fontWeight: 600, marginRight: 12 }}>
            Ki (积分增益):
          </label>
          <input
            aria-label={"Ki 积分增益"}
            type="range"
            min={0}
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
            aria-label="Kd 微分增益"
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
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 16 }}>
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
