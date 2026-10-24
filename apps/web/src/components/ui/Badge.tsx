import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "crisis" | "teal";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors",
        {
          "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20": variant === "default",
          "bg-slate-800 text-slate-300 border border-slate-700/50": variant === "secondary",
          "bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold": variant === "crisis",
          "bg-teal-500/10 text-teal-400 border border-teal-500/20": variant === "teal",
        },
        className
      )}
      {...props}
    />
  );
}
