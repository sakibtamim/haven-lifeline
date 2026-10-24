import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "crisis" | "sanctuary" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
          {
            "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 active:scale-[0.98]":
              variant === "default",
            "bg-rose-600 text-white font-semibold hover:bg-rose-500 shadow-lg shadow-rose-600/30 active:scale-[0.98] animate-pulse ring-2 ring-rose-500/50":
              variant === "crisis",
            "bg-slate-800 text-slate-100 hover:bg-slate-700/80 border border-slate-700/60 shadow-sm active:scale-[0.98]":
              variant === "sanctuary",
            "hover:bg-slate-800/60 text-slate-300 hover:text-white": variant === "ghost",
            "border border-slate-700 text-slate-200 hover:bg-slate-800/50": variant === "outline",
            "h-11 px-5 py-2.5 text-sm": size === "default",
            "h-9 rounded-lg px-3 text-xs": size === "sm",
            "h-14 rounded-2xl px-8 text-base shadow-lg": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
