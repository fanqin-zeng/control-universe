"use client";

import { useMemo, useState } from "react";
import { useECharts } from "@/components/wiki/use-echarts";

/**
 * 灵敏度函数 S 与补灵敏度函数 T（classic/frequency-response-design）
 * 系统 G(s)=K/(s(s+1)(s+10))。默认 K=100 复现答案1：GM=0.83 dB、PM=1.6°、Ms≈38（临界）。
 * 减小 K 可看到 Ms 迅速回落——这正是"裕度即鲁棒性"的直观演示。
 */
export function SensitivityExplorer() {
  const [K, setK] = useState(100);

  const data = useMemo(() => {
    const w: number[] = [];
    for (let i = 0; i <= 500; i++) w.push(0.01 * Math.pow(10000, i / 500)); // 0.01..100
    const sDb: number[] = [], tDb: number[] = [];
    let ms = 0, wMs = 0;
    for (const x of w) {
      const den = C_mul(new C(0, x), C_mul(new C(1, x), new C(10, x)));
      const gre = (K * den.re) / (den.re * den.re + den.im * den.im);
      const gim = -(K * den.im) / (den.re * den.re + den.im * den.im);
      // S = 1/(1+G), T = G/(1+G)
      const d = { re: 1 + gre, im: gim };
      const dd = d.re * d.re + d.im * d.im;
      const sMag = Math.hypot(d.re / dd, -d.im / dd);
      const tMag = Math.hypot((gre * d.re + gim * d.im) / dd, (gim * d.re - gre * d.im) / dd);
      sDb.push(20 * Math.log10(sMag));
      tDb.push(20 * Math.log10(tMag));
      if (sMag > ms) { ms = sMag; wMs = x; }
    }
    // GM / PM
    let wc = 0;
    const gDb = w.map((x) => 20 * Math.log10(Math.abs(K / (C_mul(new C(0, x), C_mul(new C(1, x), new C(10, x))).abs()))));
    for (let i = 1; i < w.length; i++) {
      if (gDb[i - 1] > 0 && gDb[i] <= 0) {
        wc = w[i - 1] + (w[i] - w[i - 1]) * ((0 - gDb[i - 1]) / (gDb[i] - gDb[i - 1]));
        break;
      }
    }
    const phAt = (x: number) => -90 - (Math.atan(x) * 180) / Math.PI - (Math.atan(x / 10) * 180) / Math.PI;
    const pm = 180 + phAt(wc);
    // ωg: 相位 = −180 → arctan(ω)+arctan(ω/10)=90 → ωg²=10（与答案1 解析一致）
    const wg = Math.sqrt(10);
    const gAtWg = K / (wg * Math.sqrt(wg * wg + 1) * Math.sqrt(wg * wg + 100));
    const gm = -20 * Math.log10(gAtWg);
    return { w, sDb, tDb, ms, wMs, wc, pm, gm };
  }, [K]);

  const sOption = useMemo(() => ({
    title: { text: `灵敏度函数 |S(jω)|（K=${K}）`, left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" as const },
    grid: { top: 50, left: 55, right: 15, bottom: 45 },
    xAxis: { type: "log" as const, name: "ω (rad/s)", min: 0.01, max: 100 },
    yAxis: { type: "value" as const, name: "|S| (dB)", min: -40, max: 35 },
    series: [{
      type: "line" as const,
      data: data.w.map((x, i) => [x, data.sDb[i]]),
      lineStyle: { width: 2, color: "#dc2626" },
      symbol: "none",
      markLine: { data: [{ yAxis: 3 }], lineStyle: { color: "#f59e0b", type: "dashed" as const }, label: { formatter: "+3 dB" } },
    }],
    animation: false,
  }), [data, K]);

  const tOption = useMemo(() => ({
    title: { text: `补灵敏度函数 |T(jω)|（K=${K}）`, left: "center", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" as const },
    grid: { top: 50, left: 55, right: 15, bottom: 45 },
    xAxis: { type: "log" as const, name: "ω (rad/s)", min: 0.01, max: 100 },
    yAxis: { type: "value" as const, name: "|T| (dB)", min: -40, max: 35 },
    series: [{
      type: "line" as const,
      data: data.w.map((x, i) => [x, data.tDb[i]]),
      lineStyle: { width: 2, color: "#2563eb" },
      symbol: "none",
      markLine: { data: [{ yAxis: -3 }], lineStyle: { color: "#f59e0b", type: "dashed" as const }, label: { formatter: "−3 dB（带宽）" } },
    }],
    animation: false,
  }), [data, K]);

  const sRef = useECharts(sOption);
  const tRef = useECharts(tOption);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px" }}>
        <label style={{ fontSize: "14px" }}>增益 K:</label>
        <input type="range" min={1} max={200} step={1} value={K}
          onChange={(e) => setK(parseInt(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontSize: "14px", minWidth: "40px" }}>{K}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div ref={sRef} style={{ height: "360px" }} />
        <div ref={tRef} style={{ height: "360px" }} />
      </div>
      <div style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: "8px", fontSize: "14px", lineHeight: 1.9 }}>
        <strong>读数（G(s)=K/(s(s+1)(s+10))）：</strong><br />
        峰值灵敏度 Ms = {data.ms.toFixed(2)}（{data.ms > 0 ? (20 * Math.log10(data.ms)).toFixed(1) : "−"} dB，工程推荐 &lt; 1.3~1.5）<br />
        增益裕度 GM = {data.gm.toFixed(2)} dB（答案1 手算例 K=100：0.83 dB）· 相位裕度 PM = {data.pm.toFixed(1)}°（答案1：1.6°）<br />
        低频 |S|→0（扰动抑制）· 高频 |T|→0（噪声衰减）· S+T=1（两曲线互补）
      </div>
    </div>
  );
}

class C {
  constructor(public re: number, public im: number) {}
  abs() { return Math.hypot(this.re, this.im); }
}
function C_mul(a: C, b: C) {
  return new C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
}
