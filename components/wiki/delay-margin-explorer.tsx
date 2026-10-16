"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

/**
 * 时滞对频率响应的影响（classic/frequency-response-design）
 * 系统 G(s)=10/(s(s+1))：时滞不改幅频、只加相位滞后 −ωL。
 * 默认 L=0.05 s：ωc=3.08 rad/s、PM0=18.0°、Lmax=0.102 s、有效 PM=9.1°（稳定）。
 */
export function DelayMarginExplorer() {
  const [L, setL] = useState(0.05);

  const data = useMemo(() => {
    const w: number[] = [];
    for (let i = 0; i <= 500; i++) w.push(0.01 * Math.pow(10000, i / 500)); // 0.01..100
    const magDb: number[] = [], phNo: number[] = [], phDel: number[] = [];
    for (const x of w) {
      const den = Complex_mul(new Complex(0, x), new Complex(1, x));
      const denSq = den.re * den.re + den.im * den.im;
      const gRe = (10 * den.re) / denSq;
      const gIm = (-10 * den.im) / denSq;
      magDb.push(20 * Math.log10(Math.hypot(gRe, gIm)));
      const angDeg = (Math.atan2(gIm, gRe) * 180) / Math.PI;
      phNo.push(angDeg);
      phDel.push(angDeg - (x * L * 180) / Math.PI);
    }
    // 无时滞系统的 ωc 与 PM0（数值求 |G|=1）
    let wc = 0;
    for (let i = 1; i < w.length; i++) {
      if (magDb[i - 1] > 0 && magDb[i] <= 0) {
        wc = w[i - 1] + (w[i] - w[i - 1]) * ((0 - magDb[i - 1]) / (magDb[i] - magDb[i - 1]));
        break;
      }
    }
    const pm0 = 180 - (90 + (Math.atan(wc) * 180) / Math.PI);
    const lMax = (pm0 / wc) * (Math.PI / 180);
    const pmEff = pm0 - (wc * L * 180) / Math.PI;
    return { w, magDb, phNo, phDel, wc, pm0, lMax, pmEff };
  }, [L]);

  const magOption = useMemo(() => ({
    title: { text: "幅频特性（时滞不改变幅值）", left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" as const },
    grid: { top: 50, left: 55, right: 15, bottom: 45 },
    xAxis: { type: "log" as const, name: "ω (rad/s)", min: 0.01, max: 100 },
    yAxis: { type: "value" as const, name: "幅值 (dB)", min: -60, max: 70 },
    series: [{
      type: "line" as const,
      data: data.w.map((x, i) => [x, data.magDb[i]]),
      lineStyle: { width: 2, color: "#2563eb" },
      symbol: "none",
      markLine: { data: [{ yAxis: 0 }], lineStyle: { color: "#94a3b8", type: "dotted" as const }, label: { formatter: "0 dB" } },
    }],
    animation: false,
  }), [data]);

  const phOption = useMemo(() => ({
    title: { text: `相频特性（L=${L.toFixed(3)} s 时额外滞后）`, left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" as const },
    legend: { top: 26, data: ["无时滞", `含时滞 L=${L.toFixed(3)}s`] },
    grid: { top: 60, left: 55, right: 15, bottom: 45 },
    xAxis: { type: "log" as const, name: "ω (rad/s)", min: 0.01, max: 100 },
    yAxis: { type: "value" as const, name: "相位 (°)", min: -450, max: -80 },
    series: [
      { name: "无时滞", type: "line" as const, data: data.w.map((x, i) => [x, data.phNo[i]]), lineStyle: { width: 2, color: "#94a3b8", type: "dashed" as const }, symbol: "none" },
      { name: `含时滞 L=${L.toFixed(3)}s`, type: "line" as const, data: data.w.map((x, i) => [x, data.phDel[i]]), lineStyle: { width: 2, color: "#dc2626" }, symbol: "none" },
      { name: "−180°", type: "line" as const, data: [[0.01, -180], [100, -180]], lineStyle: { width: 1, color: "#f59e0b", type: "dotted" as const }, symbol: "none" },
    ],
    animation: false,
  }), [data, L]);

  const magRef = useECharts(magOption);
  const phRef = useECharts(phOption);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px" }}>
        <label style={{ fontSize: "14px" }}>时滞 L (s):</label>
        <input type="range" min={0} max={0.3} step={0.005} value={L}
          onChange={(e) => setL(parseFloat(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontSize: "14px", minWidth: "56px" }}>{L.toFixed(3)}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div ref={magRef} style={{ height: "360px" }} />
        <div ref={phRef} style={{ height: "360px" }} />
      </div>
      <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: "8px", fontSize: "14px", lineHeight: 1.9 }}>
        <strong>读数（G(s)=10/(s(s+1))）：</strong><br />
        截止频率 ωc = {data.wc.toFixed(2)} rad/s（正文手算例：3.08）<br />
        无时滞相位裕度 PM₀ = {data.pm0.toFixed(1)}°（正文：18.0°）<br />
        最大允许时滞 L_max = PM₀/ωc × π/180 = {data.lMax.toFixed(3)} s（正文：0.102 s）<br />
        当前有效裕度 PM = PM₀ − ωc·L·180/π = {data.pmEff.toFixed(1)}° →{" "}
        <strong style={{ color: data.pmEff > 0 ? "#16a34a" : "#dc2626" }}>
          {data.pmEff > 0 ? "✓ 稳定" : "✗ 不稳定"}
        </strong>
      </div>
    </div>
  );
}

class Complex {
  constructor(public re: number, public im: number) {}
  abs() { return Math.hypot(this.re, this.im); }
  angleDeg() { return (Math.atan2(this.im, this.re) * 180) / Math.PI; }
}
function Complex_mul(a: Complex, b: Complex) {
  return new Complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
}
