"use client";

import * as React from "react";
import { Button } from "./ui/Button";
import { PhoneCall, MessageSquare, Globe2, ShieldAlert } from "lucide-react";
import { emergencyHotlines, getHotlineForCountry, formatTelLink, formatSmsLink } from "@haven/shared";

export function EmergencyBanner() {
  const [selectedCountry, setSelectedCountry] = React.useState("BD");
  const hotline = getHotlineForCountry(selectedCountry);

  return (
    <div className="w-full bg-gradient-to-r from-rose-950/70 via-slate-900/90 to-rose-950/70 border-b border-rose-500/30 p-4 sticky top-0 z-50 backdrop-blur-xl shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-bold text-white tracking-wide">
                Need Immediate Help Right Now?
              </h2>
              <span className="text-xs text-rose-300 font-medium hidden sm:inline">
                Free • 24/7 • Confidential
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {hotline.name} ({hotline.countryName}) — {hotline.availableHours}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Country Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 px-2 py-1 rounded-lg text-xs text-slate-300">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {emergencyHotlines.map((h) => (
                <option key={h.countryCode} value={h.countryCode} className="bg-slate-900 text-white">
                  {h.countryName} ({h.countryCode})
                </option>
              ))}
            </select>
          </div>

          {/* If Bangladesh, render direct 999 and Kaan Pete Roi buttons */}
          {selectedCountry === "BD" ? (
            <>
              <a href={formatTelLink("999")} className="flex-1 sm:flex-none">
                <Button variant="crisis" size="sm" className="w-full gap-1.5">
                  <PhoneCall className="w-4 h-4" />
                  <span>Call 999</span>
                </Button>
              </a>
              <a href={formatTelLink("+8801779554391")} className="flex-1 sm:flex-none">
                <Button variant="sanctuary" size="sm" className="w-full gap-1.5 border-rose-500/30 text-rose-200 hover:text-white">
                  <PhoneCall className="w-4 h-4 text-teal-400" />
                  <span>Kaan Pete Roi</span>
                </Button>
              </a>
              <a href={formatTelLink("16263")} className="hidden lg:inline-block">
                <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs text-slate-300">
                  <span>Shastho 16263</span>
                </Button>
              </a>
            </>
          ) : (
            <>
              {/* Standard 1-Tap Call for other countries */}
              <a href={formatTelLink(hotline.primaryPhone)} className="flex-1 sm:flex-none">
                <Button variant="crisis" size="sm" className="w-full gap-1.5">
                  <PhoneCall className="w-4 h-4" />
                  <span>Call {hotline.primaryPhone}</span>
                </Button>
              </a>

              {/* 1-Tap Text/SMS if available */}
              {hotline.smsNumber && (
                <a href={formatSmsLink(hotline.smsNumber, hotline.smsKeyword)} className="flex-1 sm:flex-none">
                  <Button variant="sanctuary" size="sm" className="w-full gap-1.5 border-rose-500/30 text-rose-200 hover:text-white">
                    <MessageSquare className="w-4 h-4 text-rose-400" />
                    <span>Text {hotline.smsNumber}</span>
                  </Button>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
