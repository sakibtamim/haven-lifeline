"use client";

import * as React from "react";
import { Button } from "./ui/Button";
import { Volume2, VolumeX } from "lucide-react";

export function AmbientAudioPlayer() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const masterGainRef = React.useRef<GainNode | null>(null);

  const startTone = async () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!audioContextRef.current) {
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        masterGainRef.current = masterGain;

        // Lowpass filter to eliminate any high-frequency edge
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(300, ctx.currentTime);
        filter.Q.setValueAtTime(1.0, ctx.currentTime);

        // 1. Fundamental tone: 136.1 Hz (Earth OM frequency)
        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(136.1, ctx.currentTime);
        const gain1 = ctx.createGain();
        gain1.gain.setValueAtTime(0.035, ctx.currentTime);
        osc1.connect(gain1);
        gain1.connect(filter);

        // 2. Harmonic Fifth: 204.1 Hz (soft warmth)
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(204.1, ctx.currentTime);
        const gain2 = ctx.createGain();
        gain2.gain.setValueAtTime(0.012, ctx.currentTime);
        osc2.connect(gain2);
        gain2.connect(filter);

        // 3. Sub-bass grounding: 68.05 Hz (deep grounding resonance)
        const osc3 = ctx.createOscillator();
        osc3.type = "sine";
        osc3.frequency.setValueAtTime(68.05, ctx.currentTime);
        const gain3 = ctx.createGain();
        gain3.gain.setValueAtTime(0.018, ctx.currentTime);
        osc3.connect(gain3);
        gain3.connect(filter);

        // 4. Slow breathing LFO (0.08 Hz = ~12.5s breath cycle)
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.008, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(masterGain.gain);

        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc3.start();
        lfo.start();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      if (masterGainRef.current) {
        masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        masterGainRef.current.gain.setValueAtTime(
          masterGainRef.current.gain.value || 0.0001,
          ctx.currentTime
        );
        masterGainRef.current.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 1.5);
      }

      setIsPlaying(true);
    } catch (_err) {
      console.warn("Ambient audio initialization deferred until user interaction:", _err);
    }
  };

  const stopTone = () => {
    try {
      const ctx = audioContextRef.current;
      if (ctx && masterGainRef.current) {
        masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
        masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
        setTimeout(() => {
          try {
            if (ctx.state === "running") {
              ctx.suspend().catch((_err) => {
                // Non-blocking suspend catch
              });
            }
          } catch (_err) {
            // Non-blocking catch
          }
        }, 1500);
      }
      setIsPlaying(false);
    } catch (_err) {
      console.warn("Ambient audio pause error:", _err);
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopTone();
    } else {
      startTone();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleAudio}
      className="text-xs text-slate-400 hover:text-slate-200 gap-1.5"
      title="Calming meditative sanctuary tone (strictly default muted)"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>Sanctuary Tone Active</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          <span>Play Calming Sanctuary Tone</span>
        </>
      )}
    </Button>
  );
}
