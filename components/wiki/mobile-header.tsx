"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";

export function MobileHeader() {
  return (
    <header className="lg:hidden flex items-center justify-between border-b p-4">
      <span className="font-bold">控制宇宙</span>
      <Sheet>
        <SheetTrigger>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </header>
  );
}
