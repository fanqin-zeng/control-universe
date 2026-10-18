"use client";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";

export function MobileHeader() {
  return (
    <header className="lg:hidden flex items-center justify-between border-b px-4 py-3">
      <span className="text-lg font-bold tracking-tight">控制宇宙</span>
      <Sheet>
        <SheetTrigger aria-label="打开课程目录" className="inline-flex items-center justify-center rounded-md border border-input bg-background h-9 w-9 hover:bg-muted hover:border-foreground/20 transition-colors">
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-4"
          style={{ height: "100dvh", maxHeight: "100dvh", overflow: "hidden", paddingTop: "3.5rem" }}
        >
          <SheetTitle className="sr-only">课程目录</SheetTitle>
          <div
            data-slot="mobile-navigation-scroll"
            role="region"
            aria-label="课程列表"
            tabIndex={0}
            style={{ flex: "1 1 0%", minHeight: 0, overflowY: "auto", overflowX: "hidden", overscrollBehaviorY: "contain", WebkitOverflowScrolling: "touch", touchAction: "pan-y", paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
