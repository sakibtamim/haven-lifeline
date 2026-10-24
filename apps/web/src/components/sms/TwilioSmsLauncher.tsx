"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import {
  MessageSquare,
  WifiOff,
  Signal,
  ShieldCheck,
  Phone,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { formatSmsLink, emergencyHotlines } from "@haven/shared";

export interface TwilioSmsLauncherProps {
  customTwilioNumber?: string;
  className?: string;
}

export function TwilioSmsLauncher({
  customTwilioNumber,
  className,
}: TwilioSmsLauncherProps) {
  const [selectedRegion, setSelectedRegion] = React.useState("BD");
  const activeHotline =
    emergencyHotlines.find((h) => h.countryCode === selectedRegion) ??
    emergencyHotlines[0]!;

  return (
    <Card className="w-full max-w-3xl mx-auto border-emerald-900/40 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-bold text-white">
                  Offline & Low-Bandwidth Crisis Lifeline
                </CardTitle>
                <Badge variant="teal" className="text-[10px]">
                  100% Offline Capable
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-400">
                Works without Wi-Fi, internet data, or smartphone apps • Direct cellular connection
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs text-slate-300">
            <span className="text-slate-500">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-emerald-400 font-semibold focus:outline-none cursor-pointer"
            >
              {emergencyHotlines.map((h) => (
                <option key={h.countryCode} value={h.countryCode} className="bg-slate-900 text-white">
                  {h.countryName} ({h.countryCode})
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Core Value Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-emerald-950/40 border border-emerald-500/20 text-xs sm:text-sm text-slate-200 flex items-start gap-3">
          <WifiOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-white">
              Spotty internet connection or need quiet, discreet privacy?
            </p>
            <p className="text-slate-300 text-xs leading-relaxed">
              When online streaming is slow or talking aloud feels impossible, you can connect directly through native cellular calling or texting. Trained crisis counselors respond 24/7.
            </p>
          </div>
        </div>

        {/* 1-Tap Trigger Cards */}
        {activeHotline.countryCode === "BD" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Kaan Pete Roi (Emotional Support & Suicide Prevention) */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                    Emotional Support Lifeline
                  </span>
                  <Signal className="w-4 h-4 text-teal-400" />
                </div>
                <h4 className="text-base font-bold text-white mt-1">
                  Kaan Pete Roi (কান পেতে রই)
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Bangladesh's dedicated emotional support and suicide prevention helpline. Free, confidential listening with zero judgment (3 PM – 3 AM).
                </p>
              </div>

              <a href="tel:+8801779554391" className="w-full">
                <Button
                  variant="default"
                  size="default"
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold gap-2 shadow-lg shadow-teal-600/20"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call +880 1779-554391</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
              </a>
            </div>

            {/* Card 2: 999 National Emergency + 16263 Shastho Batayan */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                    24/7 National Emergency
                  </span>
                  <Phone className="w-4 h-4 text-rose-400" />
                </div>
                <h4 className="text-base font-bold text-white mt-1">
                  Call 999 (National Emergency)
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Immediate 24/7 toll-free dispatch for medical, ambulance, and police emergency rescue anywhere across Bangladesh.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a href="tel:999" className="flex-1">
                  <Button
                    variant="crisis"
                    size="default"
                    className="w-full text-xs font-semibold gap-1.5"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call 999</span>
                  </Button>
                </a>
                <a href="tel:16263" className="flex-1">
                  <Button
                    variant="sanctuary"
                    size="default"
                    className="w-full text-xs font-semibold gap-1.5 border-teal-500/40 text-teal-200 hover:text-white"
                  >
                    <Phone className="w-4 h-4 text-teal-400" />
                    <span>Shastho 16263</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Primary Crisis Text Line */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Crisis Text Support
                  </span>
                  <Signal className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-white mt-1">
                  {activeHotline.smsNumber
                    ? `Text ${activeHotline.smsKeyword ? `"${activeHotline.smsKeyword}" to ` : ""}${activeHotline.smsNumber}`
                    : `Text 988 or 741741`}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Connects directly to an accredited crisis counselor. Completely free, confidential, and works over ordinary cellular SMS.
                </p>
              </div>

              <a
                href={
                  activeHotline.smsNumber
                    ? formatSmsLink(activeHotline.smsNumber, activeHotline.smsKeyword ?? "HELP")
                    : "sms:741741?body=HELP"
                }
                className="w-full"
              >
                <Button
                  variant="default"
                  size="default"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open 1-Tap Crisis Text</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
              </a>
            </div>

            {/* Card 2: Regional Hotline Text/Call */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    {activeHotline.name}
                  </span>
                  <Phone className="w-4 h-4 text-indigo-400" />
                </div>
                <h4 className="text-base font-bold text-white mt-1">
                  Call or Text {activeHotline.primaryPhone}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {activeHotline.availableHours}. Trained crisis counselors are standing by to listen without judgment.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a href={`tel:${activeHotline.primaryPhone.replace(/[^0-9+]/g, "")}`} className="flex-1">
                  <Button
                    variant="crisis"
                    size="default"
                    className="w-full text-xs font-semibold gap-1.5"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call {activeHotline.primaryPhone}</span>
                  </Button>
                </a>

                {activeHotline.smsNumber ? (
                  <a
                    href={formatSmsLink(activeHotline.smsNumber, activeHotline.smsKeyword)}
                    className="flex-1"
                  >
                    <Button
                      variant="sanctuary"
                      size="default"
                      className="w-full text-xs font-semibold gap-1.5 border-indigo-500/40 text-indigo-200 hover:text-white"
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      <span>Text {activeHotline.smsNumber}</span>
                    </Button>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Optional Custom Twilio Integration Notice */}
        {customTwilioNumber && (
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Dedicated Twilio Crisis Gateway: {customTwilioNumber}</span>
            </div>
            <a href={`sms:${customTwilioNumber}?body=HELP`} className="text-teal-400 hover:underline">
              Text Gateway
            </a>
          </div>
        )}

        {/* What to Expect Guidance */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2 text-xs text-slate-400">
          <p className="font-semibold text-slate-300">What happens when you send a text?</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 leading-relaxed">
            <li>You will receive an automated confirmation text within seconds.</li>
            <li>A trained crisis counselor will connect with you via SMS to help you through the acute moment.</li>
            <li>You do not have to give your real name or explain everything all at once.</li>
            <li>You can stop or pause the conversation at any moment by texting <strong>STOP</strong>.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
