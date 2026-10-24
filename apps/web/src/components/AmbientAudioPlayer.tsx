"use client";

import * as React from "react";
import { Button } from "./ui/Button";
import { Volume2, VolumeX } from "lucide-react";

export function AmbientAudioPlayer() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioContextRef = React.useRef<AudioContext | null>(null);

  const toggleAudio = () => {
    if (isPlaying) {
      if (audioContextRef.current) {
        audioContextRef.current.suspend();
      }
      setIsPlaying(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        whiteNoise.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();
      } else {
        audioContextRef.current.resume();
      }
      setIsPlaying(true);
    } catch {
      // Audio not allowed without user gesture
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleAudio}
      className="text-xs text-slate-400 hover:text-slate-200 gap-1.5"
      title="Calming ambient rain sound (strictly default muted)"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>Ambient Sound Active</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          <span>Play Calming Rain Noise</span>
        </>
      )}
    </Button>
  );
}
