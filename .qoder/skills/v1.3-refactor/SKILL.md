---
name: v1.3-refactor
description: v1.3 可视化双轨制重构。自动查找交付记录中未打勾的前3个课程，按决策流程将 ipywidgets 改为 React 交互组件，将纯演示代码保持为 JupyterNotebook。
triggers:
  - v1.3重构
  - 重构代码块
  - 执行重构计划
---

# v1.3 可视化双轨制重构

## 概述

本技能执行 v1.3 重构计划（`.qoder/v1.3-refactor-plan.md`），将课程中的代码块按"可视化双轨制"原则分类重构：
- **代码演示** → `<JupyterNotebook>`（静态输出：文本/表格/图表）
- **交互探索** → React 组件（ECharts + useECharts hook，带可调控件）

## 执行流程

### Step 1: 确定本次重构目标

1. 读取 `.qoder/delivery-tracker.md`，找到**未打勾的前 3 个有代码的课程**
2. 跳过纯理论课程（无代码块的）
3. 记录本次要重构的 3 个课程列表

```
目标课程：
1. <chapter>/<lesson-1>
2. <chapter>/<lesson-2>
3. <chapter>/<lesson-3>
```

### Step 2: 逐课程分析与重构

对每个课程执行以下流程：

#### 2a. 读取课程内容

读取 `content/<chapter>/<lesson>.mdx`，找出所有代码块（`<JupyterNotebook>` 和 ` ```python `）。

#### 2b. 分类每个代码块

对每个代码块应用决策树：

```
这个代码块有可调参数吗？
├── 否 → 保持 <JupyterNotebook>（静态输出）
└── 是 → 读者需要拖动参数看变化趋势吗？
    ├── 否 → 保持 <JupyterNotebook>（静态多曲线对比）
    └── 是 → 改为 React 交互组件（<XxxExplorer>）
```

**判断"需要交互化"的信号**：
- 代码使用了 ipywidgets（interact, FloatSlider, IntSlider 等）→ **必须交互化**
- 代码展示"改变某参数 → 观察响应变化"的模式 → 交互化
- 代码有多个参数组合的对比图 → 考虑交互化
- 代码只是计算并打印结果 → 保持静态
- 代码只是画一条固定曲线 → 保持静态

#### 2c. 执行重构

**对于需要交互化的代码块**：

1. 创建 React 组件 `components/wiki/<name>-explorer.tsx`：
   - 使用 `useECharts` hook（已存在于 `components/wiki/use-echarts.tsx`）
   - 固定坐标轴范围
   - 禁用动画（`animation: false`）
   - 提供合适的控件（滑块、按钮组、下拉菜单等）
   - 用纯 TypeScript 实现计算逻辑（不依赖 Python）

2. 在 `mdx-components.tsx` 注册组件
3. 在 `lib/content.ts` 注册组件
4. 在 MDX 文件中替换对应的 `<JupyterNotebook>` 为新的 `<XxxExplorer>`

**对于保持 JupyterNotebook 的代码块**：

1. 检查是否有 ipywidgets 引用 → 如有，改为静态多曲线/多参数对比
2. 确保 setupCode 不包含 ipywidgets
3. 确认代码可独立运行

#### 2d. fix-logs 回归检查

在验证之前，查阅 `.qoder/fix-logs/INDEX.md`，检查本次重构的课程是否有历史修复记录：

1. 根据课程路径（如 `classic/time-domain-analysis`）在 INDEX.md 中搜索相关条目
2. 阅读相关的 individual fix logs（`.qoder/fix-logs/*.md`），特别关注：
   - 交互组件设计规范（固定坐标轴范围、禁用动画）
   - 已知的可视化 bug 及修复方案
   - ipywidgets 兼容性问题的处理经验
3. 确保本次重构不会引入回归问题

**示例**：如果重构 `classic/time-domain-analysis` 中的阶跃响应章节，必须检查 fix-log 002（横坐标轴动态缩放问题），确保新组件使用固定坐标轴范围。

#### 2e. 验证

1. 运行 `npm run build` 确认编译通过
2. 确认新组件已在 MDX 中正确引用
3. 确认所有交互组件符合 fix-logs 中的设计规范（无历史问题复发）

### Step 3: 更新交付记录

1. 在 `.qoder/delivery-tracker.md` 中将本次重构的 3 个课程打勾：`[ ]` → `[x]`
2. 记录重构摘要

### Step 4: 输出报告

```
## v1.3 重构报告

### 本次重构课程
1. <chapter>/<lesson-1>
2. <chapter>/<lesson-2>
3. <chapter>/<lesson-3>

### 重构内容

#### <lesson-1>
- 代码块总数：X
- 保持 JupyterNotebook：Y 个
- 改为交互组件：Z 个
- 新增组件：<XxxExplorer>
- ipywidgets 修复：是/否

#### <lesson-2>
...

#### <lesson-3>
...

### 下次重构目标
根据 delivery-tracker.md，下一批为：
1. ...
2. ...
3. ...
```

## React 交互组件模板

```tsx
"use client";

import { useState, useMemo } from "react";
import { useECharts } from "@/components/wiki/use-echarts";
import type { EChartsOption } from "echarts";

// 物理常量
const PARAM_DEFAULT = 1.0;

export function XxxExplorer() {
  const [param, setParam] = useState(PARAM_DEFAULT);

  // 计算曲线数据
  const curveData = useMemo(() => {
    // ... 纯 TypeScript 计算
    return [] as [number, number][];
  }, [param]);

  // ECharts 配置
  const option: EChartsOption = useMemo(() => ({
    animation: false,
    grid: { left: 60, right: 30, top: 40, bottom: 50 },
    xAxis: { type: "value", name: "...", min: 0, max: 10 },
    yAxis: { type: "value", name: "..." },
    series: [{
      type: "line",
      data: curveData,
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2, color: "#3b82f6" },
    }],
  }), [curveData]);

  const chartRef = useECharts(option);

  return (
    <div style={s.wrapper}>
      <div ref={chartRef} style={s.chart} />
      <div style={s.controls}>
        <div style={s.sliderRow}>
          <label style={s.label}>参数名</label>
          <input
            type="range"
            min={0.1} max={5.0} step={0.1}
            value={param}
            onChange={(e) => setParam(parseFloat(e.target.value))}
            style={s.slider}
          />
          <span style={s.value}>{param.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrapper: { border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, margin: "20px 0", background: "#fafafa" },
  chart: { width: "100%", height: 320 },
  controls: { marginTop: 16, padding: 16, background: "#fff", borderRadius: 6, border: "1px solid #e5e7eb" },
  sliderRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 500, color: "#374151", minWidth: 80 },
  slider: { flex: 1, height: 6, cursor: "pointer" },
  value: { fontSize: 14, fontWeight: 600, color: "#2563eb", minWidth: 50, textAlign: "right", fontFamily: "monospace" },
};
```

## 注意事项

- **不要删除原有 JupyterNotebook 中不适合交互化的代码块**
- **Python → TypeScript 转换**：交互组件需要用 TS 重写计算逻辑，确保数学公式正确
- **固定坐标轴**：避免拖动时坐标轴缩放导致视觉混乱
- **禁用动画**：`animation: false`，保证拖动时即时响应
- **组件命名**：`<Topic>Explorer`，如 `StateSpaceExplorer`、`LQRExplorer`
- **注册两处**：`mdx-components.tsx` 和 `lib/content.ts` 都要注册
- **构建验证**：每次重构后必须 `npm run build` 确认通过
