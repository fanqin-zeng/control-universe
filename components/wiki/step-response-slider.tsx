"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useECharts } from "@/hooks/use-echarts";
import { stepResponseSecondOrder } from "@/lib/control-sim";

export function StepResponseSlider() {
  const [zeta, setZeta] = useState(0.5);
  const [omega, setOmega] = useState(2);
  const data = useMemo(
    () => stepResponseSecondOrder(zeta, omega),
    [zeta, omega]
  );
  const { containerRef, chartRef } = useECharts<HTMLDivElement>();

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.setOption(
      {
        grid: { top: 30, right: 20, bottom: 30, left: 45 },
        tooltip: { trigger: "axis" },
        xAxis: { type: "value", name: "t (s)", min: 0, max: 20 },
        yAxis: { type: "value", name: "y", min: 0, max: 1.8 },
        series: [
          {
            type: "line",
            data: data.map((d) => [d.t, d.y]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 },
          },
        ],
      },
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle className="text-base">二阶系统阶跃响应</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-64 w-full" ref={containerRef} />
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>阻尼比 ζ</span>
              <span>{zeta.toFixed(2)}</span>
            </div>
            <Slider
              value={[zeta]}
              min={0.1}
              max={2}
              step={0.05}
              onValueChange={(values) =>
                setZeta(Array.isArray(values) ? values[0] : zeta)
              }
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>自然频率 ωn</span>
              <span>{omega.toFixed(1)}</span>
            </div>
            <Slider
              value={[omega]}
              min={0.5}
              max={10}
              step={0.5}
              onValueChange={(values) =>
                setOmega(Array.isArray(values) ? values[0] : omega)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
