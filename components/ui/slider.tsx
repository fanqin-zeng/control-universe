"use client";

import { useCallback, useRef } from "react";
import { cn } from "cn";

interface SliderProps {
  className?: string;
  value?: readonly number[];
  defaultValue?: readonly number[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number | readonly number[]) => void;
  onValueCommitted?: (value: number | readonly number[]) => void;
}

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  onValueChange,
  onValueCommitted,
}: SliderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentVal = value ? value[0] : defaultValue ? defaultValue[0] : min;
  const pct = ((currentVal - min) / (max - min)) * 100;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      onValueChange?.([v]);
    },
    [onValueChange]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      const v = parseFloat((e.target as HTMLInputElement).value);
      onValueCommitted?.([v]);
    },
    [onValueCommitted]
  );

  return (
    <div
      className={cn(
        "relative flex w-full items-center py-3",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="relative h-1 w-full rounded-full bg-muted">
        <div
          className="absolute h-full rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
      <input
        ref={inputRef}
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentVal}
        disabled={disabled}
        onChange={handleChange}
        onMouseUp={handleMouseUp}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        style={{ margin: 0 }}
      />
      <div
        className="pointer-events-none absolute size-3 -translate-x-1/2 rounded-full border border-ring bg-white ring-ring/50 shadow-sm"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}

export { Slider };
