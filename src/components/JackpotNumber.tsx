import React from "react";
import { cn } from "@/lib/utils";

export default function JackpotNumber({ value, size = "md", className }: { value: number | string; size?: "sm" | "md"; className?: string }) {
  const str = String(value);
  const cellCls =
    size === "sm"
      ? "h-7 w-6 text-base"
      : "h-9 w-8 text-xl";
  return (
    <div className={cn("flex items-center gap-1 font-mono tabular-nums", className)} aria-label={`Número ${str}`}>
      {str.split("").map((ch, i) => (
        <div
          key={i}
          className={cn(
            "grid place-items-center rounded-md border bg-muted text-foreground shadow-sm",
            cellCls
          )}
        >
          {ch}
        </div>
      ))}
      <span className="ml-1 text-xs text-muted-foreground">kcal</span>
    </div>
  );
}
