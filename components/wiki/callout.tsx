import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info, AlertTriangle, Lightbulb } from "lucide-react";

type Variant = "info" | "warning" | "tip";

const icons = { info: Info, warning: AlertTriangle, tip: Lightbulb };

interface CalloutProps {
  variant?: Variant;
  children: React.ReactNode;
}

export function Callout({ variant = "info", children }: CalloutProps) {
  const Icon = icons[variant];
  return (
    <Card
      className={cn("my-6 border-l-4", {
        "border-l-blue-500 bg-blue-50/50": variant === "info",
        "border-l-amber-500 bg-amber-50/50": variant === "warning",
        "border-l-emerald-500 bg-emerald-50/50": variant === "tip",
      })}
    >
      <CardContent className="flex gap-3 p-4">
        <Icon className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="text-sm">{children}</div>
      </CardContent>
    </Card>
  );
}
