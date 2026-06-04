import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "warning" | "default";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-green-500/10 text-green-400 border border-green-500/20": variant === "success",
          "bg-red-500/10 text-red-400 border border-red-500/20": variant === "error",
          "bg-brand-500/10 text-brand-400 border border-brand-500/20": variant === "warning",
          "bg-slate-500/10 text-slate-400 border border-slate-500/20": variant === "default",
        },
        className
      )}
      {...props}
    />
  );
}
