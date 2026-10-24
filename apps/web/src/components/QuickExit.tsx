"use client";

import * as React from "react";
import { Button } from "./ui/Button";
import { ShieldX, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuickExitProps {
  variant?: "topbar" | "floating" | "both";
  className?: string;
}

/**
 * Triggers an immediate discreet exit to a neutral weather website.
 * Uses window.location.replace to prevent back-button navigation in abusive/unsafe environments.
 * Wipes volatile session data prior to redirection.
 */
export function triggerQuickExit() {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.clear();
  } catch (err) {
    // Non-blocking in restricted iframe/incognito contexts
    console.warn("Session storage clear error during quick exit:", err);
  }

  // Use replace to strip Haven from browser history stack
  window.location.replace("https://weather.com");
}

export function QuickExit({ variant = "both", className }: QuickExitProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        triggerQuickExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const renderTopbarButton = () => (
    <Button
      variant="crisis"
      size="sm"
      onClick={triggerQuickExit}
      title="Quick Panic Exit (Press Escape key)"
      aria-label="Quick Exit - Redirects immediately to neutral page (Escape key)"
      className={cn(
        "gap-1.5 bg-rose-700 hover:bg-rose-600 text-white shadow-md font-medium text-xs px-3 py-1.5 animate-none ring-1 ring-rose-500/60",
        className
      )}
    >
      <ShieldX className="w-3.5 h-3.5 text-rose-200" />
      <span>Quick Exit</span>
      <kbd className="hidden sm:inline-block ml-1 rounded bg-rose-900/80 px-1.5 py-0.5 text-[10px] font-mono text-rose-200 border border-rose-500/30">
        Esc
      </kbd>
    </Button>
  );

  const renderFloatingButton = () => (
    <div className="fixed bottom-5 right-5 z-50">
      <Button
        variant="crisis"
        size="default"
        onClick={triggerQuickExit}
        title="Quick Panic Exit (Press Escape key)"
        aria-label="Quick Exit - Redirects immediately to neutral page (Escape key)"
        className="flex items-center gap-2 bg-rose-700 hover:bg-rose-600 text-white shadow-2xl shadow-rose-950/80 border border-rose-500/50 rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold animate-none backdrop-blur-md"
      >
        <LogOut className="w-4 h-4 text-rose-200" />
        <span>Quick Exit</span>
        <kbd className="hidden sm:inline-block rounded bg-rose-900/90 px-1.5 py-0.5 text-[10px] font-mono text-rose-200 border border-rose-400/40">
          Esc
        </kbd>
      </Button>
    </div>
  );

  if (variant === "topbar") {
    return renderTopbarButton();
  }

  if (variant === "floating") {
    return renderFloatingButton();
  }

  return (
    <>
      {renderTopbarButton()}
      {renderFloatingButton()}
    </>
  );
}
