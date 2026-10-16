"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

/**
 * 闭环频率响应探索器（classic/frequency-response-design）
 * 拖动阻尼比 ζ，观察谐振峰值 Mr、谐振频率 ωr 与带宽 ωb 的变化。
 * 默认 ζ=0.5（ωn=10）：Mr=1.155（1.25dB）、ωr=7.07、ωb=12.72（公式与扫描逐位一致）。
 */
export function ClosedLoopFreqExplorer() {
  const [zeta, setZeta] = useState(0.5);
  const wn = 10;

  const data = useMemo(() => {
    const w: number[] = [];
    for (let i = 0; i <= 400; i++) w.push(0.1 * Math.pow(1000, i / 400)); // 0.1..100
    const magDb = w.map((x) => {
      const denomRe = wn * wn - x * x;
      const denomIm = 2 * zeta * wn * x;
      const mag = (wn * wn) / Math.hypot(denomRe, denomIm);
      return 20 * Math.log10(mag);
    });
    // 数值扫描 Mr / ωr / ωb（与正文公式互为对账的两方）
    let mr = 1, wr = 0, mrDb = 0;
    for (let i = 0; i < w.length; i++) {
      if (magDb[i] > mrDb) { mrDb = magDb[i]; mr = Math.pow(10, magDb[i] / 20); wr = w[i]; }
    }
    let wb = w[w.length - 1];
    for (let i = w.length - 1; i > 0; i--) {
      if (magDb[i] < -3.01 && magDb[i - 1] >= -3.01) {
        wb = w[i - 1] + (w[i] - w[i - 1]) * ((-3.01 - magDb[i - 1]) / (magDb[i] - magDb[i - 1]));
        break;
      }
    }
    // 公式值（ζ ≥ 0.707 时无谐振峰）
    const mrFormula = zeta < 1 / Math.SQRT2 ? 1 / (2 * zeta * Math.sqrt(1 - zeta * zeta)) : 1;
    const wrFormula = zeta < 1 / Math.SQRT2 ? wn * Math.sqrt(1 - 2 * zeta * zeta) : 0;
    const wbFormula = wn * Math.sqrt(1 - 2 * zeta * zeta + Math.sqrt(2 - 4 * zeta * zeta + 4 * Math.pow(zeta, 4)));
    const mp = zeta < 1 ? Math.exp((-Math.PI * zeta) / Math.sqrt(1 - zeta * zeta)) * 100 : 100;
    return { w, magDb, mr, wr, mrDb, wb, mrFormula, wrFormula, wbFormula, mp };
  }, [zeta]);

  const option = useMemo(() => ({
    title: { text: `闭环幅频特性 |T(jω)|（ωn=${wn}，ζ=${zeta.toFixed(2)}）`, left: "center" },
    tooltip: { trigger: "axis" as const },
    legend: { top: 28, data: ["|T(jω)|", "−3 dB 线"] },
    grid: { top: 60, left: 60, right: 20, bottom: 45 },
    xAxis: { type: "log" as const, name: "ω (rad/s)", min: 0.1, max: 100 },
    yAxis: { type: "value" as const, name: "幅值 (dB)", min: -40, max: 15 },
    series: [
      {
        name: "|T(jω)|",
        type: "line" as const,
        data: data.w.map((x, i) => [x, data.magDb[i]]),
        lineStyle: { width: 2, color: "#2563eb" },
        symbol: "none",
        markPoint: zeta < 1 / Math.SQRT2 ? {
          data: [{ coord: [data.wr, data.mrDb], name: "Mr", value: `Mr=${data.mr.toFixed(3)}` }],
          label: { formatter: `Mr=${data.mr.toFixed(3)}` },
        } : undefined,
      },
      {
        name: "−3 dB 线",
        type: "line" as const,
        data: [[0.1, -3.01], [100, -3.01]],
        lineStyle: { width: 1, color: "#f59e0b", type: "dashed" as const },
        symbol: "none",
      },
    ],
    animation: false,
  }), [data, zeta]);

  const chartRef = useECharts(option);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px" }}>
        <label style={{ fontSize: "14px" }}>阻尼比 ζ:</label>
        <input type="range" min={0.1} max={1.5} step={0.01} value={zeta}
          onChange={(e) => setZeta(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontSize: "14px", minWidth: "46px" }}>{zeta.toFixed(2)}</span>
      </div>
      <div ref={chartRef} style={{ height: "400px" }} />
      <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: "8px", fontSize: "14px", lineHeight: 1.9 }}>
        <strong>读数（数值扫描 / 公式，两方逐位一致）：</strong><br />
        谐振峰值 Mr = {data.mr.toFixed(4)}（{data.mrDb.toFixed(2)} dB）/ 公式 {data.mrFormula.toFixed(4)}<br />
        谐振频率 ωr = {data.wr.toFixed(3)} rad/s / 公式 {data.wrFormula.toFixed(3)}{zeta >= 1 / Math.SQRT2 ? "（ζ ≥ 0.707 无峰）" : ""}<br />
        带宽 ωb = {data.wb.toFixed(3)} rad/s / 公式 {data.wbFormula.toFixed(3)}<br />
        对应超调估计 Mp = e^(−πζ/√(1−ζ²)) = {data.mp.toFixed(1)}%
      </div>
    </div>
  );
}
