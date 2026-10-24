import { type Hotline } from "./schemas";

export const emergencyHotlines: readonly Hotline[] = [
  {
    countryCode: "BD",
    countryName: "Bangladesh",
    name: "Bangladesh National Emergency (999) & Kaan Pete Roi (কান পেতে রই)",
    primaryPhone: "999",
    phoneDisplay: "999 (Emergency) / +880 1779-554391 (Kaan Pete Roi)",
    availableHours: "24/7 Toll-Free (Emergency: 999, Health: 16263, Kaan Pete Roi: 3 PM - 3 AM)",
    isEmergency: true,
    notes: "Bangladesh Emergency: 999; Shastho Batayan: 16263; Kaan Pete Roi: +880 1779-554391; Women & Child Helpline: 109",
  },
  {
    countryCode: "US",
    countryName: "United States",
    name: "988 Suicide & Crisis Lifeline",
    primaryPhone: "988",
    phoneDisplay: "988 (Call or Text)",
    smsKeyword: "HOME",
    smsNumber: "741741",
    availableHours: "24/7 / 365 Free & Confidential",
    isEmergency: true,
    notes: "Direct connection to trained crisis counselor nationwide.",
  },
  {
    countryCode: "CA",
    countryName: "Canada",
    name: "988 Suicide Crisis Helpline",
    primaryPhone: "988",
    phoneDisplay: "988 (Call or Text)",
    smsKeyword: "HOME",
    smsNumber: "741741",
    availableHours: "24/7 Bilingual (English / French)",
    isEmergency: true,
  },
  {
    countryCode: "GB",
    countryName: "United Kingdom",
    name: "Samaritans & NHS Mental Health",
    primaryPhone: "116123",
    phoneDisplay: "116 123 (Samaritans) / 111 (NHS)",
    smsKeyword: "SHOUT",
    smsNumber: "85258",
    availableHours: "24/7 Free Call",
    isEmergency: true,
  },
  {
    countryCode: "AU",
    countryName: "Australia",
    name: "Lifeline Australia",
    primaryPhone: "131114",
    phoneDisplay: "13 11 14 (Call) or Text 0477 13 11 14",
    smsKeyword: "HELP",
    smsNumber: "0477131114",
    availableHours: "24/7 Free Service",
    isEmergency: true,
  },
] as const;

export interface BangladeshService {
  name: string;
  nameBn: string;
  phone: string;
  phoneDisplay: string;
  category: "emergency" | "health" | "emotional" | "helpline";
  hours: string;
  description: string;
}

export const bangladeshHotlines: readonly BangladeshService[] = [
  {
    name: "National Emergency Service",
    nameBn: "জাতীয় জরুরি সেবা",
    phone: "999",
    phoneDisplay: "999",
    category: "emergency",
    hours: "24/7 Toll-Free",
    description: "Immediate police, ambulance, and fire rescue across Bangladesh.",
  },
  {
    name: "Kaan Pete Roi",
    nameBn: "কান পেতে রই",
    phone: "+8801779554391",
    phoneDisplay: "+880 1779-554391",
    category: "emotional",
    hours: "3 PM - 3 AM Daily",
    description: "Bangladesh's premier emotional support & suicide prevention helpline.",
  },
  {
    name: "Shastho Batayan",
    nameBn: "স্বাস্থ্য বাতায়ন",
    phone: "16263",
    phoneDisplay: "16263",
    category: "health",
    hours: "24/7 Toll-Free",
    description: "Ministry of Health 24/7 mental health and medical counseling.",
  },
  {
    name: "National Helpline for Women & Children",
    nameBn: "নারী ও শিশু নির্যাতন প্রতিরোধে জাতীয় হেল্পলাইন",
    phone: "109",
    phoneDisplay: "109",
    category: "helpline",
    hours: "24/7 Toll-Free",
    description: "Legal, medical, and psychological emergency support.",
  },
] as const;

export function getHotlineForCountry(countryCode?: string): Hotline {
  if (!countryCode) return emergencyHotlines[0]!;
  const matched = emergencyHotlines.find(
    (h) => h.countryCode.toUpperCase() === countryCode.toUpperCase()
  );
  return matched ?? emergencyHotlines[0]!;
}

export function formatTelLink(phone: string): string {
  const sanitized = phone.replace(/[^0-9+]/g, "");
  return `tel:${sanitized}`;
}

export function formatSmsLink(smsNumber: string, keyword?: string): string {
  const sanitized = smsNumber.replace(/[^0-9+]/g, "");
  return keyword ? `sms:${sanitized}?body=${encodeURIComponent(keyword)}` : `sms:${sanitized}`;
}
