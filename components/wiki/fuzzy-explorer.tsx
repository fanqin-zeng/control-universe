"use client";

import { useMemo, useState } from "react";
import { useECharts } from "./use-echarts";
import type { EChartsOption } from "echarts";
import { partition, trimf, buildUG, inferOne, maxSlope, rmsDev } from "@/lib/fuzzy-inference";

const X_LO = -30;
const X_HI = 30;
const U_LO = -15;
const U_HI = 15;
const SCAN_N = 241;

const IDEAL_GAIN = -0.5;

type Defuzz = "cog" | "bis" | "mom";


const DEFUZZ_LABEL: Record<Defuzz, string> = {
  cog: "重心法 COG",
  bis: "平分法 Bisector",
  mom: "最大隶属度 MOM",
};

const DEFUZZ_COLOR: Record<Defuzz, string> = {
  cog: "#2563eb",
  bis: "#16a34a",
  mom: "#dc2626",
};

const MF_COLORS = [
  "#1d4ed8",
  "#0891b2",
  "#059669",
  "#ca8a04",
  "#ea580c",
  "#dc2626",
  "#c026d3",
  "#7c3aed",
  "#475569",
];

function fmt(v: number, d = 4): string {
  return Number.isFinite(v) ? v.toFixed(d) : "—";
}

function stat(label: string, value: string, color?: string) {
  return (
    <div
      key={label}
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: "4px 9px",
        background: "#f8fafc",
        fontSize: 12,
        lineHeight: 1.5,
      }}
    >
      <span style={{ color: "#64748b" }}>{label}</span>{" "}
      <span style={{ fontWeight: 600, color: color ?? "#0f172a", fontVariantNumeric: "tabular-nums" }}>
        {value}
      </span>
    </div>
  );
}

export function FuzzyExplorer() {
  const [n, setN] = useState(5);
  const [hs, setHs] = useState(1.0);
  const [x, setX] = useState(5);
  const [show, setShow] = useState<Record<Defuzz, boolean>>({ cog: true, bis: true, mom: true });

  const ug = useMemo(buildUG, []);

  const model = useMemo(() => {
    const PX = partition(X_LO, X_HI, n, hs);
    const PU = partition(U_LO, U_HI, n, 1.0);
    const PUg = PU.map((p) => ug.map((u) => trimf(u, p[0], p[1], p[2])));
    const ruleOf = PX.map((_, i) => n - 1 - i);
    return { PX, PU, PUg, ruleOf };
  }, [n, hs, ug]);

  const unity = useMemo(() => {
    const N = 1201;
    let mn = Infinity;
    let mx = -Infinity;
    for (let k = 0; k < N; k++) {
      const xx = X_LO + ((X_HI - X_LO) * k) / (N - 1);
      let t = 0;
      for (const p of model.PX) t += trimf(xx, p[0], p[1], p[2]);
      if (t < mn) mn = t;
      if (t > mx) mx = t;
    }
    return { mn, mx, dev: Math.max(Math.abs(mn - 1), Math.abs(mx - 1)) };
  }, [model]);

  const scan = useMemo(() => {
    const xs: number[] = [];
    const cog: number[] = [];
    const bis: number[] = [];
    const mom: number[] = [];
    for (let k = 0; k < SCAN_N; k++) {
      const xx = X_LO + ((X_HI - X_LO) * k) / (SCAN_N - 1);
      const r = inferOne(xx, model.PX, ug, model.PUg, model.ruleOf);
      xs.push(xx);
      cog.push(r.cog);
      bis.push(r.bis);
      mom.push(r.mom);
    }
    return { xs, cog, bis, mom };
  }, [model, ug]);

  const here = useMemo(
    () => inferOne(x, model.PX, ug, model.PUg, model.ruleOf),
    [x, model, ug]
  );

  const fired = here.alphas.filter((a) => a > 0).length;
  const sumAlpha = here.alphas.reduce((s, v) => s + v, 0);
  const s = model.PX[1][1] - model.PX[0][1];
  const h = hs * s;
  const muCross = 1 - s / (2 * h);
  const isUnity = unity.dev < 1e-9;
  const active = (Object.keys(show) as Defuzz[]).filter((k) => show[k]);

  const vline = (xv: number, yLo: number, yHi: number, color: string, name: string) => ({
    name,
    type: "line" as const,
    showSymbol: false,
    animation: false,
    lineStyle: { width: 2, color },
    itemStyle: { color },
    data: [
      [xv, yLo],
      [xv, yHi],
    ],
  });

  const mfOption = useMemo<EChartsOption>(() => {
    const N = 481;
    const xs = Array.from({ length: N }, (_, k) => X_LO + ((X_HI - X_LO) * k) / (N - 1));
    const series: EChartsOption["series"] = model.PX.map((p, i) => ({
      name: "μ" + (i + 1),
      type: "line",
      showSymbol: false,
      animation: false,
      lineStyle: { width: 2, color: MF_COLORS[i % MF_COLORS.length] },
      itemStyle: { color: MF_COLORS[i % MF_COLORS.length] },
      data: xs.map((xx) => [xx, trimf(xx, p[0], p[1], p[2])]),
    }));
    series.push({
      name: "Σμ",
      type: "line",
      showSymbol: false,
      animation: false,
      lineStyle: { width: 3, color: "#0f172a", type: "dashed" },
      itemStyle: { color: "#0f172a" },
      data: xs.map((xx) => {
        let t = 0;
        for (const p of model.PX) t += trimf(xx, p[0], p[1], p[2]);
        return [xx, t];
      }),
    });
    series.push(vline(x, 0, 2.2, "#f59e0b", "当前 x"));
    return {
      animation: false,
      grid: { left: 44, right: 16, top: 34, bottom: 36 },
      title: { text: "输入论域的隶属度划分与 Σμ", left: 8, top: 4, textStyle: { fontSize: 12 } },
      tooltip: { trigger: "axis", animation: false },
      xAxis: { type: "value", min: X_LO, max: X_HI, name: "x (deg)", nameLocation: "middle", nameGap: 22 },
      yAxis: { type: "value", min: 0, max: 2.2, name: "μ", splitNumber: 5 },
      series,
    };
  }, [model, x]);

  const mapOption = useMemo<EChartsOption>(() => {
    const series: EChartsOption["series"] = [];
    active.forEach((k) => {
      series.push({
        name: DEFUZZ_LABEL[k],
        type: "line",
        showSymbol: false,
        animation: false,
        lineStyle: { width: 2.5, color: DEFUZZ_COLOR[k] },
        itemStyle: { color: DEFUZZ_COLOR[k] },
        data: scan.xs.map((xx, i) => [xx, scan[k][i]]),
      });
    });
    series.push({
      name: "理想线性 u = -0.5x",
      type: "line",
      showSymbol: false,
      animation: false,
      lineStyle: { width: 1.5, color: "#94a3b8", type: "dotted" },
      itemStyle: { color: "#94a3b8" },
      data: scan.xs.map((xx) => [xx, IDEAL_GAIN * xx]),
    });
    series.push(vline(x, U_LO - 1, U_HI + 1, "#f59e0b", "当前 x"));
    active.forEach((k) => {
      series.push({
        name: DEFUZZ_LABEL[k] + " @x",
        type: "scatter",
        animation: false,
        symbolSize: 9,
        itemStyle: { color: DEFUZZ_COLOR[k], borderColor: "#fff", borderWidth: 1 },
        data: [[x, here[k]]],
      });
    });
    return {
      animation: false,
      grid: { left: 48, right: 16, top: 34, bottom: 36 },
      title: { text: "输入 → 输出映射（三种解模糊化）", left: 8, top: 4, textStyle: { fontSize: 12 } },
      tooltip: { trigger: "axis", animation: false },
      xAxis: { type: "value", min: X_LO, max: X_HI, name: "x (deg)", nameLocation: "middle", nameGap: 22 },
      yAxis: { type: "value", min: U_LO - 1, max: U_HI + 1, name: "u" },
      series,
    };
  }, [scan, active, x, here]);

  const aggOption = useMemo<EChartsOption>(() => {
    const series: EChartsOption["series"] = here.parts.map((p, i) => ({
      name: "裁剪后 " + (i + 1),
      type: "line",
      showSymbol: false,
      animation: false,
      lineStyle: { width: 1.2, color: "#94a3b8", type: "dashed" },
      itemStyle: { color: "#94a3b8" },
      data: ug.map((u, k) => [u, p[k]]),
    }));
    series.push({
      name: "聚合后的 μB",
      type: "line",
      showSymbol: false,
      animation: false,
      lineStyle: { width: 2.5, color: "#0f172a" },
      itemStyle: { color: "#0f172a" },
      areaStyle: { color: "rgba(37,99,235,0.18)" },
      data: ug.map((u, k) => [u, here.mu[k]]),
    });
    active.forEach((k) => {
      series.push(vline(here[k], 0, 1.1, DEFUZZ_COLOR[k], DEFUZZ_LABEL[k] + " = " + here[k].toFixed(2)));
    });
    return {
      animation: false,
      grid: { left: 44, right: 16, top: 34, bottom: 36 },
      title: {
        text: "x = " + x.toFixed(1) + " 时的输出模糊集合（" + fired + " 条规则）",
        left: 8,
        top: 4,
        textStyle: { fontSize: 12 },
      },
      tooltip: { trigger: "axis", animation: false },
      legend: { show: false },
      xAxis: { type: "value", min: U_LO, max: U_HI, name: "u", nameLocation: "middle", nameGap: 22 },
      yAxis: { type: "value", min: 0, max: 1.1, name: "μ" },
      series,
    };
  }, [here, ug, x, fired, active]);

  const mfRef = useECharts(mfOption);
  const mapRef = useECharts(mapOption);
  const aggRef = useECharts(aggOption);

  const btn = (on: boolean): React.CSSProperties => ({
    border: "1px solid " + (on ? "#2563eb" : "#cbd5e1"),
    background: on ? "#2563eb" : "#fff",
    color: on ? "#fff" : "#334155",
    borderRadius: 6,
    padding: "4px 11px",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: on ? 600 : 400,
  });

  return (
    <div
      className="not-prose"
      style={{ border: "1px solid #d1d5db", borderRadius: 8, margin: "24px 0", padding: 16, background: "#fff" }}
    >
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
        隶属度划分与解模糊化实验台：单输入单输出 Mamdani，规则 IF x is A_i THEN u is B_(n-1-i)（下标从0起）
      </div>
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
        输入论域 [-30, 30]，输出论域 [-15, 15]，结论部固定用 h/s = 1 的均匀三角划分。
        改变重叠度 h/s 看 Σμ 何时脱离 1；切换解模糊化方法看输出台阶与抖振。三个图的坐标轴范围固定，拖动时曲线在稳定参考系里移动。
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10, alignItems: "center" }}>
        <button style={btn(false)} onClick={() => { setN(5); setHs(1); setX(5); setShow({cog:true,bis:true,mom:true}); }}>恢复默认</button>
        <span style={{ fontSize: 13, color: "#374151" }}>语言值数量 n：</span>
        {[3, 5, 7, 9].map((v) => (
          <button key={v} style={btn(n === v)} onClick={() => setN(v)}>
            {v}
          </button>
        ))}
        <span style={{ fontSize: 13, color: "#374151", marginLeft: 10 }}>解模糊化：</span>
        {(Object.keys(show) as Defuzz[]).map((k) => (
          <button key={k} style={btn(show[k])} onClick={() => setShow((p) => ({ ...p, [k]: !p[k] }))}>
            {DEFUZZ_LABEL[k]}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 12 }}>
        <label style={{ fontSize: 13, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, maxWidth: "100%" }}>
          重叠度 h/s = {hs.toFixed(2)}
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.05}
            value={hs}
            onChange={(e) => setHs(Number(e.target.value))}
            style={{ width: 180, maxWidth: "100%" }}
          />
        </label>
        <label style={{ fontSize: 13, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, maxWidth: "100%" }}>
          输入 x = {x.toFixed(1)} deg
          <input
            type="range"
            min={X_LO}
            max={X_HI}
            step={0.5}
            value={x}
            onChange={(e) => setX(Number(e.target.value))}
            style={{ width: 180, maxWidth: "100%" }}
          />
        </label>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        {stat("交叉隶属度 μx", fmt(muCross))}
        {stat("Σμ 范围", "[" + fmt(unity.mn, 3) + ", " + fmt(unity.mx, 3) + "]", isUnity ? "#16a34a" : "#dc2626")}
        {stat("max|Σμ − 1|", unity.dev.toExponential(2), isUnity ? "#16a34a" : "#dc2626")}
        {stat("激活规则数", fired + " / " + n)}
        {stat("Σα(x)", fmt(sumAlpha))}
        {stat("COG 最大斜率", fmt(maxSlope(scan.cog, scan.xs), 3) + " /deg")}
        {stat("MOM 最大斜率", fmt(maxSlope(scan.mom, scan.xs), 3) + " /deg", "#dc2626")}
        {stat("rms 偏差 COG", fmt(rmsDev(scan.cog, scan.xs), 3))}
        {stat("rms 偏差 MOM", fmt(rmsDev(scan.mom, scan.xs), 3), "#dc2626")}
        {stat("COG − MOM", fmt(here.cog - here.mom, 3))}
        {stat("当前 COG", fmt(here.cog, 6))}
        {stat("当前 Bisector", fmt(here.bis, 6))}
        {stat("当前 MOM", fmt(here.mom, 6))}
        {stat("覆盖状态", sumAlpha > 1e-14 ? "有效" : "无覆盖：回退0", sumAlpha > 1e-14 ? "#16a34a" : "#dc2626")}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <div ref={mfRef} style={{ flex: "1 1 280px", minWidth: 0, width: "100%", height: 300 }} />
        <div ref={mapRef} style={{ flex: "1 1 280px", minWidth: 0, width: "100%", height: 300 }} />
        <div ref={aggRef} style={{ flex: "1 1 280px", minWidth: 0, width: "100%", height: 300 }} />
      </div>

      <div style={{ fontSize: 13, color: "#475569", marginTop: 10, lineHeight: 1.7 }}>
        <strong>h/s = {hs.toFixed(2)}</strong>：
        {isUnity
          ? " 相邻三角形恰好在 μ = 0.5 处相交，Σμ(x) ≡ 1——左图的黑色虚线是一条水平直线，偏差 " +
            unity.dev.toExponential(1) +
            " 只是浮点舍入。这是均匀三角划分的特有性质，归一化Sugeno只要非负权重和为正就仍是凸组合。"
          : hs < 1
          ? " h < s，总隶属度在中点处降低到 " +
            fmt(unity.mn, 3) +
            "，交叉隶属度只有 " +
            fmt(muCross, 3) +
            "。h/s > 0.5时仍有覆盖；h/s = 0.5的相邻中点权重全零，本演示回退到0，该值不代表有效推理。归一化分母小不决定输出方向。"
          : " h > s，三角形重叠过头：Σμ 在中点处是 " +
            fmt(unity.mn, 3) +
            "、在中心处是 " +
            fmt(unity.mx, 3) +
            "。宽重叠可能激活两个以上语言值；输出取决于整个推理管线，不能只看Σμ判断增益。"}
        {fired <= 2
          ? " 当前只有 " + fired + " 条规则被激活：三角形支撑有限，当前激活数按实际位置显示。只有h≤s的相邻支撑才有每输入最多2条的界，宽重叠不适用；搜索与积分仍有成本。"
          : ""}
        {show.mom
          ? " MOM 的最大斜率 " +
            fmt(maxSlope(scan.mom, scan.xs), 3) +
            " /deg，COG 是 " +
            fmt(maxSlope(scan.cog, scan.xs), 3) +
            " /deg：本切片可见平台与跳变，是否造成闭环抖振还取决于对象、采样和噪声。"
          : ""}
        {show.bis
          ? " 平分法与重心法只在聚合形状左右不对称时才分开——相对左右位置需看当前参数，不能预设绿线总在蓝线左侧。"
          : ""}
      </div>
    </div>
  );
}
