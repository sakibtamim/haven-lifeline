export * from "./colors";

export const breathingRhythms = {
  box: {
    name: "Box Breathing (4-4-4-4)",
    description: "Stabilizes racing thoughts and rapidly settles nervous system excitation.",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
  },
  relax478: {
    name: "4-7-8 Deep Relaxation",
    description: "Activates the vagus nerve to counter panic attacks and high distress.",
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
  },
} as const;

export type BreathingRhythmKey = keyof typeof breathingRhythms;
