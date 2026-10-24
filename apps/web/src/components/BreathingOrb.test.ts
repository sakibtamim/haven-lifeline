import { describe, it, expect } from "vitest";

describe("Breathing Orb Rhythm Specifications", () => {
  const boxRhythm = {
    phases: [
      { name: "Inhale", duration: 4 },
      { name: "Hold", duration: 4 },
      { name: "Exhale", duration: 4 },
      { name: "Rest", duration: 4 },
    ],
    totalCycleSeconds: 16,
  };

  const rhythm478 = {
    phases: [
      { name: "Inhale", duration: 4 },
      { name: "Hold", duration: 7 },
      { name: "Exhale", duration: 8 },
    ],
    totalCycleSeconds: 19,
  };

  it("calculates correct total duration for Box Breathing cycle", () => {
    const total = boxRhythm.phases.reduce((acc, p) => acc + p.duration, 0);
    expect(total).toBe(boxRhythm.totalCycleSeconds);
    expect(boxRhythm.phases).toHaveLength(4);
  });

  it("calculates correct total duration for 4-7-8 Relaxation cycle", () => {
    const total = rhythm478.phases.reduce((acc, p) => acc + p.duration, 0);
    expect(total).toBe(rhythm478.totalCycleSeconds);
    expect(rhythm478.phases).toHaveLength(3);
  });

  it("verifies parasympathetic deceleration phases are strictly positive", () => {
    for (const phase of [...boxRhythm.phases, ...rhythm478.phases]) {
      expect(phase.duration).toBeGreaterThan(0);
      expect(phase.name).toBeDefined();
    }
  });
});
