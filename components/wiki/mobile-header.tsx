"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";

export function MobileHeader() {
  return (
    <header className="lg:hidden flex items-center justify-between border-b p-4">
      <span className="font-bold">控制宇宙</span>
      <Sheet>
        <SheetTrigger className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </header>
  );
}
