import { type Hotline } from "./schemas";

export const emergencyHotlines: readonly Hotline[] = [
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
    countryCode: "BD",
    countryName: "Bangladesh",
    name: "Kaan Pete Roi (Emotional Support Helpline)",
    primaryPhone: "+8801779554391",
    phoneDisplay: "+880 1779-554391",
    availableHours: "3 PM - 3 AM Daily (Bengali / English)",
    isEmergency: true,
    notes: "First emotional support helpline in Bangladesh.",
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
