"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Eye, Hand, Ear, Sparkles, Heart, CheckCircle2 } from "lucide-react";

interface Step {
  step: number;
  icon: React.ReactNode;
  title: string;
  instruction: string;
  color: string;
}

export function Grounding54321() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);

  const steps: Step[] = [
    {
      step: 5,
      icon: <Eye className="w-5 h-5 text-indigo-400" />,
      title: "5 Things You Can SEE",
      instruction: "Gently look around the room. Name 5 distinct items (e.g. a shadow on the floor, a picture, a pen, your shoes, a light switch). Notice their shapes.",
      color: "indigo",
    },
    {
      step: 4,
      icon: <Hand className="w-5 h-5 text-teal-400" />,
      title: "4 Things You Can FEEL",
      instruction: "Notice 4 physical textures right now. Feel the soles of your feet on the ground, the texture of your clothes, the temperature of the air, or the surface under your hands.",
      color: "teal",
    },
    {
      step: 3,
      icon: <Ear className="w-5 h-5 text-sky-400" />,
      title: "3 Things You Can HEAR",
      instruction: "Close your eyes for a moment. Listen carefully for 3 subtle sounds. A clock ticking, distant traffic outside, your own steady breath, or a refrigerator hum.",
      color: "sky",
    },
    {
      step: 2,
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      title: "2 Things You Can SMELL",
      instruction: "Take a gentle breath in. Can you smell coffee, fresh air from a window, fabric softener on your pillow, or simply clean air?",
      color: "amber",
    },
    {
      step: 1,
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      title: "1 Grounding Truth",
      instruction: "Say this quietly to yourself: \"I am right here in this room. My feet are on the floor. I am carrying a heavy weight, but I am safe in this exact moment.\"",
      color: "rose",
    },
  ];

  const step = steps[currentStep]!;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setCompleted(true);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setCompleted(false);
  };

  return (
    <Card className="w-full max-w-xl mx-auto border-slate-800 bg-slate-900/50 backdrop-blur-md shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
            Sensory Reset Protocol
          </span>
          <span className="text-xs text-slate-400">
            {completed ? "Completed" : `Step ${currentStep + 1} of 5`}
          </span>
        </div>
        <CardTitle className="text-lg font-semibold text-white mt-1">
          5-4-3-2-1 Sensory Grounding
        </CardTitle>
        <CardDescription>
          When overwhelmed, this exercise reconnects your senses to physical reality.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {completed ? (
          <div className="flex flex-col items-center text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-semibold text-white">You did it. Well done.</h4>
            <p className="text-sm text-slate-300 max-w-md">
              Your nervous system is beginning to decelerate. Remember: you only have to live this next breath. You are doing great.
            </p>
            <Button variant="sanctuary" size="sm" onClick={reset} className="mt-2">
              Restart Sensory Exercise
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                {step.icon}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                <p className="text-xs text-slate-400">Anchor yourself here</p>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
              {step.instruction}
            </p>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button variant="default" size="sm" onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-500">
                {currentStep === steps.length - 1 ? "Complete Exercise" : "Next Step →"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
