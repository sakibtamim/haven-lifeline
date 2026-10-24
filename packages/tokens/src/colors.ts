/**
 * Sanctuary Color Palette Tokens
 * Designed to de-escalate the sympathetic nervous system.
 * Low visual noise, soothing deep slate background, warm accents.
 */
export const sanctuaryColors = {
  // Sanctuary Dark Backgrounds
  background: {
    base: "#090d16",
    surface: "#0f172a",
    elevated: "#1e293b",
    border: "#334155",
    subtleBorder: "rgba(148, 163, 184, 0.15)",
  },
  // Text Hierarchies
  text: {
    primary: "#f8fafc",
    secondary: "#94a3b8",
    muted: "#64748b",
  },
  // Calming Accents (Parasympathetic triggers)
  accent: {
    indigo: "#6366f1",
    teal: "#14b8a6",
    emerald: "#10b981",
    softBlue: "#38bdf8",
  },
  // Emergency & Immediate Life-Safety
  crisis: {
    rose: "#f43f5e",
    roseHover: "#e11d48",
    roseLight: "#ffe4e6",
    roseBg: "rgba(244, 63, 94, 0.12)",
    gold: "#f59e0b",
  },
} as const;

export type SanctuaryColors = typeof sanctuaryColors;
