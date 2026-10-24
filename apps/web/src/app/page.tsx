import * as React from "react";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { BreathingOrb } from "@/components/BreathingOrb";
import { Grounding54321 } from "@/components/Grounding54321";
import { HoldOnContract } from "@/components/HoldOnContract";
import { AmbientAudioPlayer } from "@/components/AmbientAudioPlayer";
import { QuickExit } from "@/components/QuickExit";
import { SanctuaryPanel } from "@/components/SanctuaryPanel";
import { ShieldCheck, HeartHandshake, Lock } from "lucide-react";

export default function HavenPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between relative">
      {/* 1-Tap Emergency Hotline Banner */}
      <EmergencyBanner />

      {/* Main Sanctuary Container */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 space-y-12">
        {/* Sanctuary Topbar */}
        <header className="flex items-center justify-between border-b border-slate-800/60 pb-4 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-600/20">
              H
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">Project Haven</h1>
              <p className="text-xs text-slate-400">A Safe Harbor in Acute Crisis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AmbientAudioPlayer />
            <QuickExit variant="topbar" />
          </div>
        </header>

        {/* Hero: Somatic Deceleration (Breathing Orb) */}
        <section className="text-center space-y-4">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              Pause for just a moment. <span className="font-semibold text-teal-400">Breathe with us.</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              You do not have to fix everything right now. Your nervous system is overwhelmed. Match your breath to the pulse below.
            </p>
          </div>

          <BreathingOrb />
        </section>

        {/* De-escalation & Validation Anchor */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 text-center max-w-2xl mx-auto backdrop-blur-sm">
          <p className="text-sm sm:text-base text-slate-200 font-light italic leading-relaxed">
            &ldquo;You have carried this heavy weight for a very long time. It makes complete sense that you are exhausted. You do not have to carry it alone right now.&rdquo;
          </p>
        </div>

        {/* Central Single-Page Sanctuary Panel (Tabs: Chat, Somatic Tools, Safety Vault, SMS & Hotlines) */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-semibold text-white">The Sanctuary Hub</h3>
            <p className="text-xs text-slate-400">
              Switch tools freely with zero page reloads • 100% confidential and client-side
            </p>
          </div>
          <SanctuaryPanel />
        </section>

        {/* Immediate Sensory Grounding & Micro-Commitment Anchors */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-4 border-t border-slate-800/60">
          <Grounding54321 />
          <HoldOnContract />
        </section>

        {/* Safety Guarantees & Non-Judgmental Values */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/30 border border-slate-800/40">
            <Lock className="w-4 h-4 text-teal-400 shrink-0" />
            <span>100% Zero-Log Privacy: No chats or IP addresses stored.</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/30 border border-slate-800/40">
            <HeartHandshake className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Zero Judgment: No toxic positivity or sterile clinical jargon.</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/30 border border-slate-800/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Always Free & Direct: Direct 1-tap connection to lifelines.</span>
          </div>
        </section>
      </div>

      {/* Floating Panic Quick Exit (Esc) */}
      <QuickExit variant="floating" />

      {/* Footer & Medical Disclaimer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500 mt-12 space-y-2">
        <p className="max-w-2xl mx-auto leading-relaxed">
          <strong>Crisis Disclaimer:</strong> Haven is an immediate emotional de-escalation and somatic grounding sanctuary, not a replacement for psychiatric or emergency medical care. If you or someone you know is in immediate physical danger in Bangladesh, call <strong>999</strong> (National Emergency Service), <strong>+880 1779-554391</strong> (Kaan Pete Roi), or <strong>16263</strong> (Shastho Batayan) immediately.
        </p>
        <p>© 2026 Project Haven • Built with care for hope and life.</p>
      </footer>
    </main>
  );
}
