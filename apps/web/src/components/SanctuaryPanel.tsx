"use client";

import * as React from "react";
import { MessageSquare, Wind, Shield, PhoneCall, Sparkles } from "lucide-react";
import { CrisisChat } from "./chat/CrisisChat";
import { BreathingOrb } from "./BreathingOrb";
import { Grounding54321 } from "./Grounding54321";
import { HoldOnContract } from "./HoldOnContract";
import { SafetyPlanVault } from "./vault/SafetyPlanVault";
import { TwilioSmsLauncher } from "./sms/TwilioSmsLauncher";
import { emergencyHotlines, formatTelLink, formatSmsLink } from "@haven/shared";
import { Button } from "./ui/Button";

export type SanctuaryTab = "chat" | "tools" | "safety_plan" | "sms_hotlines";

interface TabConfig {
  id: SanctuaryTab;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const SANCTUARY_TABS: readonly TabConfig[] = [
  {
    id: "chat",
    label: "💬 Live Calm Chat",
    shortLabel: "Calm Chat",
    icon: MessageSquare,
    badge: "Live SSE",
  },
  {
    id: "tools",
    label: "🫁 Somatic Tools",
    shortLabel: "Somatic Tools",
    icon: Wind,
  },
  {
    id: "safety_plan",
    label: "🛡️ My Safety Plan",
    shortLabel: "Safety Plan",
    icon: Shield,
    badge: "Encrypted",
  },
  {
    id: "sms_hotlines",
    label: "📱 SMS & Hotlines",
    shortLabel: "SMS & Hotlines",
    icon: PhoneCall,
    badge: "Offline",
  },
];

export interface SanctuaryPanelProps {
  initialTab?: SanctuaryTab;
  className?: string;
}

export function SanctuaryPanel({ initialTab = "chat", className }: SanctuaryPanelProps) {
  const [activeTab, setActiveTab] = React.useState<SanctuaryTab>(initialTab);

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className ?? ""}`}>
      {/* Sanctuary Navigation Tabs Bar */}
      <nav
        role="tablist"
        aria-label="Sanctuary Modules"
        className="flex items-center justify-start sm:justify-center overflow-x-auto p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden gap-1.5"
      >
        {SANCTUARY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 select-none cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-indigo-600 to-teal-600 text-white shadow-lg shadow-indigo-600/30 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-slate-400"}`} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>

              {tab.badge && (
                <span
                  className={`hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono leading-none ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Tab Panels */}
      <div className="relative min-h-[500px]">
        {/* Tab 1: Live Calm Chat */}
        <div
          role="tabpanel"
          id="panel-chat"
          aria-labelledby="tab-chat"
          className={activeTab === "chat" ? "block animate-fadeIn" : "hidden"}
        >
          <CrisisChat />
        </div>

        {/* Tab 2: Somatic Tools */}
        <div
          role="tabpanel"
          id="panel-tools"
          aria-labelledby="tab-tools"
          className={activeTab === "tools" ? "block space-y-8 animate-fadeIn" : "hidden"}
        >
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md">
            <div className="text-center max-w-xl mx-auto mb-4">
              <h3 className="text-lg font-semibold text-white">60fps Somatic Breathing Guide</h3>
              <p className="text-xs text-slate-300 mt-1">
                Box Breathing (4-4-4-4) and 4-7-8 parasympathetic activation. Synchronize your breathing to steady your heart rate.
              </p>
            </div>
            <BreathingOrb />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Grounding54321 />
            <HoldOnContract />
          </section>
        </div>

        {/* Tab 3: My Safety Plan Vault */}
        <div
          role="tabpanel"
          id="panel-safety_plan"
          aria-labelledby="tab-safety_plan"
          className={activeTab === "safety_plan" ? "block animate-fadeIn" : "hidden"}
        >
          <SafetyPlanVault />
        </div>

        {/* Tab 4: SMS Lifeline & Directory */}
        <div
          role="tabpanel"
          id="panel-sms_hotlines"
          aria-labelledby="tab-sms_hotlines"
          className={activeTab === "sms_hotlines" ? "block space-y-8 animate-fadeIn" : "hidden"}
        >
          <TwilioSmsLauncher />

          {/* Full Hotline Directory Table */}
          <div className="w-full max-w-3xl mx-auto p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h3 className="text-base font-semibold text-white">
                Global Accredited Emergency Hotline Directory
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Direct, 1-tap connection to certified non-profit crisis counselors worldwide. Free and confidential.
            </p>

            <div className="divide-y divide-slate-800 border-t border-slate-800">
              {emergencyHotlines.map((h) => (
                <div
                  key={h.countryCode}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-semibold text-white">{h.name}</span>
                    <span className="text-slate-400 ml-2 font-mono">({h.countryName})</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">{h.availableHours}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a href={formatTelLink(h.primaryPhone)}>
                      <Button variant="crisis" size="sm" className="h-8 text-xs py-1 px-3 gap-1">
                        <PhoneCall className="w-3 h-3" />
                        <span>Call {h.primaryPhone}</span>
                      </Button>
                    </a>

                    {h.smsNumber && (
                      <a href={formatSmsLink(h.smsNumber, h.smsKeyword)}>
                        <Button
                          variant="sanctuary"
                          size="sm"
                          className="h-8 text-xs py-1 px-3 border-emerald-500/30 text-emerald-300 hover:text-white gap-1"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                          <span>Text {h.smsNumber}</span>
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
