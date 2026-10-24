"use client";

import * as React from "react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";

export type RhythmType = "box" | "478";

interface PhaseConfig {
  label: string;
  duration: number;
  scale: number;
  color: string;
  glow: string;
}

export function BreathingOrb() {
  const [isActive, setIsActive] = React.useState(true);
  const [rhythm, setRhythm] = React.useState<RhythmType>("box");
  const [phaseIndex, setPhaseIndex] = React.useState(0);
  const [secondsRemaining, setSecondsRemaining] = React.useState(4);
  const [cyclesCompleted, setCyclesCompleted] = React.useState(0);

  const boxPhases: PhaseConfig[] = React.useMemo(
    () => [
      { label: "Inhale slowly...", duration: 4, scale: 1.25, color: "#6366f1", glow: "rgba(99, 102, 241, 0.45)" },
      { label: "Hold gently...", duration: 4, scale: 1.25, color: "#14b8a6", glow: "rgba(20, 184, 166, 0.45)" },
      { label: "Exhale completely...", duration: 4, scale: 0.85, color: "#38bdf8", glow: "rgba(56, 189, 248, 0.45)" },
      { label: "Rest & pause...", duration: 4, scale: 0.85, color: "#64748b", glow: "rgba(100, 116, 139, 0.25)" },
    ],
    []
  );

  const phases478: PhaseConfig[] = React.useMemo(
    () => [
      { label: "Inhale through nose...", duration: 4, scale: 1.3, color: "#6366f1", glow: "rgba(99, 102, 241, 0.45)" },
      { label: "Hold breath peacefully...", duration: 7, scale: 1.3, color: "#14b8a6", glow: "rgba(20, 184, 166, 0.45)" },
      { label: "Exhale gently through mouth...", duration: 8, scale: 0.8, color: "#38bdf8", glow: "rgba(56, 189, 248, 0.45)" },
    ],
    []
  );

  const activePhases = rhythm === "box" ? boxPhases : phases478;
  const currentPhase = activePhases[phaseIndex] ?? activePhases[0]!;

  React.useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (typeof window !== "undefined" && "vibrate" in navigator) {
            try {
              navigator.vibrate(30);
            } catch {
              // Ignore haptic failures
            }
          }

          setPhaseIndex((currPhase) => {
            const nextPhase = (currPhase + 1) % activePhases.length;
            if (nextPhase === 0) {
              setCyclesCompleted((c) => c + 1);
            }
            return nextPhase;
          });
          return activePhases[(phaseIndex + 1) % activePhases.length]?.duration ?? 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phaseIndex, activePhases]);

  const handleRhythmChange = (newRhythm: RhythmType) => {
    setRhythm(newRhythm);
    setPhaseIndex(0);
    setSecondsRemaining(newRhythm === "box" ? 4 : 4);
  };

  const resetCycle = () => {
    setPhaseIndex(0);
    setSecondsRemaining(activePhases[0]?.duration ?? 4);
    setCyclesCompleted(0);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 text-center select-none">
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="teal" className="text-xs py-1 px-3">
          <Wind className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
          Somatic Grounding Orb
        </Badge>
        {cyclesCompleted > 0 && (
          <Badge variant="secondary" className="text-xs py-1 px-3">
            {cyclesCompleted} {cyclesCompleted === 1 ? "cycle" : "cycles"} complete
          </Badge>
        )}
      </div>

      {/* The Breathing Orb */}
      <div className="relative flex items-center justify-center my-8 h-64 w-64">
        {/* Soft background aura */}
        <div
          className="absolute inset-0 rounded-full blur-3xl transition-all duration-1000"
          style={{
            backgroundColor: currentPhase.glow,
            transform: `scale(${currentPhase.scale * 1.1})`,
            opacity: isActive ? 0.35 : 0.1,
          }}
        />

        {/* Outer rhythmic ripple ring */}
        <div
          className="absolute inset-2 rounded-full border border-slate-700/60 transition-all duration-1000"
          style={{
            transform: `scale(${isActive ? currentPhase.scale : 1})`,
            borderColor: currentPhase.color,
            opacity: 0.4,
          }}
        />

        {/* Core animated orb */}
        <div
          className="orb-pulse relative flex flex-col items-center justify-center w-48 h-48 rounded-full border border-white/20 shadow-2xl"
          style={{
            transform: `scale(${isActive ? currentPhase.scale : 1})`,
            background: `radial-gradient(circle, ${currentPhase.color}33 0%, #0f172a 80%)`,
            boxShadow: `0 0 50px ${currentPhase.glow}`,
          }}
        >
          <span className="text-4xl font-light text-white tracking-wider mb-1">
            {secondsRemaining}
          </span>
          <span className="text-xs font-medium text-slate-300 max-w-[130px] px-2 leading-tight">
            {currentPhase.label}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 w-full justify-center">
        <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800">
          <button
            onClick={() => handleRhythmChange("box")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              rhythm === "box" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Box (4-4-4-4)
          </button>
          <button
            onClick={() => handleRhythmChange("478")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              rhythm === "478" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Deep Calm (4-7-8)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="sanctuary"
            size="sm"
            onClick={() => setIsActive((prev) => !prev)}
            className="gap-1.5"
          >
            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isActive ? "Pause" : "Resume"}
          </Button>
          <Button variant="ghost" size="sm" onClick={resetCycle} title="Reset timer">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
