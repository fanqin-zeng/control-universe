"use client";

import { useEffect, useRef } from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "cn"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const log = (type: string, e: Event) => {
      const pe = e as PointerEvent;
      console.debug(`[Slider][${type}]`, {
        pointerId: pe.pointerId,
        pointerType: pe.pointerType,
        button: pe.button,
        buttons: pe.buttons,
        x: pe.clientX,
        y: pe.clientY,
        target: (pe.target as HTMLElement)?.tagName,
        composedPath: e.composedPath().slice(0, 5).map((n) => (n as HTMLElement).tagName || (n as Node).nodeName),
      });
    };
    const events = ["pointerdown", "pointermove", "pointerup", "pointercancel", "mousedown", "touchstart"];
    const handlers = events.map((type) => {
      const handler = (e: Event) => log(type, e);
      el.addEventListener(type, handler, { capture: true });
      return { type, handler };
    });
    console.debug("[Slider] Event listeners attached on", el.getBoundingClientRect());
    return () => {
      handlers.forEach(({ type, handler }) => el.removeEventListener(type, handler, { capture: true }));
      console.debug("[Slider] Event listeners removed");
    };
  }, []);

  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      ref={rootRef}
      className={cn("data-horizontal:w-full data-horizontal:py-3 data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
