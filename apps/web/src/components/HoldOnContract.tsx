"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Clock, Sparkles } from "lucide-react";

export function HoldOnContract() {
  const [hasCommitted, setHasCommitted] = React.useState(false);
  const [secondsRemaining, setSecondsRemaining] = React.useState(3600);

  React.useEffect(() => {
    if (!hasCommitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [hasCommitted]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-xl mx-auto border-indigo-900/40 bg-gradient-to-b from-slate-900/80 to-slate-950/80 shadow-2xl backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            The 1-Hour Micro-Commitment
          </span>
        </div>
        <CardTitle className="text-lg font-semibold text-white mt-1">
          "Stay for the Next 60 Minutes"
        </CardTitle>
        <CardDescription>
          Acute suicidal despair changes over time. You don't have to promise forever — just promise to pause for the next 1 hour.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasCommitted ? (
          <div className="flex flex-col items-center text-center py-4 space-y-4">
            <div className="text-5xl font-light font-mono tracking-widest text-indigo-300 bg-slate-900/90 px-8 py-4 rounded-2xl border border-indigo-500/20 shadow-inner">
              {formatTime(secondsRemaining)}
            </div>
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              You have made a sacred micro-promise to yourself to stay. During this hour, drink a glass of water, sit somewhere warm, and let the storm pass around you.
            </p>
            <div className="flex items-center gap-2 p-3 bg-indigo-950/30 rounded-xl border border-indigo-800/30 text-xs text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Milestone 1: Drink a glass of cold water now.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-sm text-slate-300 leading-relaxed">
              When everything feels completely hopeless, making lifelong decisions is terrifying. Postpone irreversible decisions. Give yourself just 60 minutes.
            </p>
            <Button
              variant="default"
              size="lg"
              onClick={() => setHasCommitted(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 font-semibold text-white shadow-lg shadow-indigo-600/30"
            >
              I Promise to Pause for 1 Hour
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
