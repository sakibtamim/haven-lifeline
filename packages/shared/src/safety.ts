import {
  type SafetyEvaluation,
  type DistressLevel,
  type Hotline,
} from "./schemas";
import {
  getHotlineForCountry,
  formatTelLink,
  formatSmsLink,
} from "./hotlines";

// Regex patterns for detecting imminent suicide ideation, intent, or self-harm
const IMMINENT_PATTERNS: readonly RegExp[] = [
  /\bkill\s+myself\b/i,
  /\bend\s+my\s+life\b/i,
  /\bwant\s+to\s+die\b/i,
  /\bcommit\s+suicide\b/i,
  /\btake\s+my\s+own\s+life\b/i,
  /\bhang\s+(myself|myself\s+with)\b/i,
  /\bhanging\s+myself\b/i,
  /\bslit\s+my\s+wrists?\b/i,
  /\boverdose\b/i,
  /\bod\s+on\s+pills\b/i,
  /\bgoodbye\s+note\b/i,
  /\bsuicide\s+note\b/i,
  /\bno\s+reason\s+to\s+live\b/i,
  /\b(don'?t|dont)\s+want\s+to\s+live\b/i,
  /\bbetter\s+off\s+dead\b/i,
  /\bjump\s+off\s+(a\s+|the\s+)?(bridge|roof|building|balcony)\b/i,
  /\bjumping\s+off\s+(a\s+|the\s+)?(bridge|roof|building|balcony)\b/i,
  /\bshoot\s+myself\b/i,
  /\bbullet\s+in\s+my\s+head\b/i,
  /\bend\s+it\s+all\b/i,
  /\bready\s+to\s+die\b/i,
  /\bplanning\s+to\s+die\b/i,
];

// Patterns for lethal means detection
const MEANS_PATTERNS: readonly RegExp[] = [
  /\b(gun|firearm|pistol|revolver|shotgun|rifle)\b/i,
  /\b(bottle\s+of\s+pills|sleeping\s+pills|handful\s+of\s+pills|lethal\s+dose)\b/i,
  /\b(rope|noose)\b/i,
  /\b(razor|razor\s+blade|box\s+cutter|exacto|knife|blade)\b/i,
  /\b(cyanide|poison|bleach)\b/i,
  /\b(bridge|train\s+tracks?|subway\s+tracks?|rooftop|balcony)\b/i,
];

// Contextual self-harm cues indicating actionability when combined with means
const SELF_HARM_CUES: readonly RegExp[] = [
  /\b(have\s+a|got\s+a|holding\s+a|bought\s+a|with\s+a)\b/i,
  /\b(taking\s+all|swallow|swallowed|cut\s+myself|cutting\s+myself)\b/i,
  /\b(standing\s+on|ready\s+to\s+jump)\b/i,
  /\b(goodbye|farewell|ending\s+it)\b/i,
];

// Patterns for severe distress (hopelessness, unbearable psychological pain)
const SEVERE_PATTERNS: readonly RegExp[] = [
  /\b(can'?t|cant)\s+take\s+this\s+(pain|anymore)\b/i,
  /\b(can'?t|cant)\s+bear\s+this\s+pain\b/i,
  /\bunbearable\s+pain\b/i,
  /\bhate\s+myself\b/i,
  /\bworthless\b/i,
  /\bhopeless\b/i,
  /\bgiving\s+up\s+on\s+everything\b/i,
  /\beveryone\s+would\s+be\s+better\s+without\s+me\b/i,
  /\bnobody\s+cares\s+about\s+me\b/i,
  /\bcompletely\s+broken\b/i,
  /\bdrowning\s+in\s+despair\b/i,
  /\b(can'?t|cant)\s+keep\s+going\b/i,
  /\bno\s+point\s+in\s+(living|anything|going\s+on)\b/i,
];

// Patterns for moderate distress (anxiety, acute panic, acute overwhelm)
const MODERATE_PATTERNS: readonly RegExp[] = [
  /\b(anxious|anxiety)\b/i,
  /\bpanic\s+attack\b/i,
  /\bterrified\b/i,
  /\boverwhelmed\b/i,
  /\bcrying\s+uncontrollably\b/i,
  /\bso\s+stressed\b/i,
  /\b(can'?t|cant)\s+breathe\b/i,
  /\bchest\s+tight\b/i,
  /\bshaking\b/i,
  /\bheart\s+racing\b/i,
  /\bfeel\s+so\s+alone\b/i,
  /\bhaving\s+a\s+breakdown\b/i,
];

/**
 * Escapes unsafe XML characters to prevent injection in TwiML responses.
 * Pure functional, zero PII logging.
 */
export function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates an empathetic, urgent, and accessible escalation message
 * with direct 1-tap dial and text links for accredited emergency hotlines.
 */
export function buildEmergencyEscalationMessage(hotline: Hotline): string {
  const parts: string[] = [
    "I care about your safety and you do not have to carry this alone.",
    "Please connect right now with someone who can support you through this exact moment. Free, confidential, 24/7 help is available immediately:",
    `• ${hotline.name}: Call ${hotline.phoneDisplay}`,
  ];

  if (hotline.smsNumber) {
    const textDetails = hotline.smsKeyword
      ? `Text ${hotline.smsKeyword} to ${hotline.smsNumber}`
      : `Text ${hotline.smsNumber}`;
    parts.push(`• Crisis Text Support: ${textDetails}`);
  }

  parts.push(`• Direct Call: ${formatTelLink(hotline.primaryPhone)}`);

  if (hotline.smsNumber) {
    parts.push(`• Direct Text: ${formatSmsLink(hotline.smsNumber, hotline.smsKeyword)}`);
  }

  parts.push("\nPlease reach out to them now or call your local emergency services. You matter and support is here.");

  return parts.join("\n");
}

/**
 * Formats a valid TwiML XML response for Twilio SMS webhooks.
 * Completely hermetic and escaped.
 */
export function buildTwimlMessage(message: string): string {
  const sanitized = escapeXml(message);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Message>${sanitized}</Message>\n</Response>`;
}

/**
 * Generates an empathetic, trauma-informed de-escalation response based on distress level.
 * Pure functional, zero side-effects.
 */
export function generateDeEscalationResponse(tier: DistressLevel, _userText?: string): string {
  switch (tier) {
    case "imminent_crisis":
      return "I hear how much pain you are in right now, and I want you to be safe. Please pause, take one gentle breath, and reach out to the crisis lifeline right now. You are not alone, and there is support for you this very minute.";
    case "severe":
      return "I hear how heavy and exhausting everything feels right now, and I want to acknowledge your courage in reaching out. You don't have to carry this alone. Let's pause for just a moment. Can you feel the surface beneath you supporting you? Let's take a slow, gentle breath together. I'm right here listening.";
    case "moderate":
      return "Thank you for sharing that with me. When emotions or anxiety feel intense, your body is doing its best to cope. Let's take this one step at a time. Try taking a slow inhale through your nose for 4 counts, holding gently for 4, and exhaling softly for 4. What is one thing you can see in the room around you right now?";
    case "mild":
    default:
      return "I'm here with you in this safe space. Whatever is on your mind, you can share it at your own pace. How are you feeling in your body right now?";
  }
}

/**
 * Pure functional deterministic crisis safety heuristic classifier.
 * Evaluates raw text for imminent suicide ideation, lethal means, and distress tiers.
 * Zero PII logging, zero mutations, zero external calls.
 */
export function evaluateCrisisSafety(
  rawText: string,
  countryCode?: string
): SafetyEvaluation {
  const normalized = (rawText || "").toLowerCase().trim();
  const detectedTriggers: string[] = [];

  // 1. Detect means
  let hasMeans = false;
  for (const pattern of MEANS_PATTERNS) {
    if (pattern.test(normalized)) {
      hasMeans = true;
      detectedTriggers.push(`means:${pattern.source}`);
      break;
    }
  }

  // 2. Detect imminent intent
  let isImminent = false;
  for (const pattern of IMMINENT_PATTERNS) {
    if (pattern.test(normalized)) {
      isImminent = true;
      detectedTriggers.push(`intent:${pattern.source}`);
      break;
    }
  }

  // 3. Imminent crisis: direct intent or (means + self-harm cue)
  if (isImminent || (hasMeans && SELF_HARM_CUES.some((cue) => cue.test(normalized)))) {
    const hotline = getHotlineForCountry(countryCode);
    return {
      isImminentCrisis: true,
      distressLevel: "imminent_crisis",
      detectedTriggers,
      hasMeans,
      recommendedHotline: hotline,
      escalationMessage: buildEmergencyEscalationMessage(hotline),
    };
  }

  // 4. Detect severe distress
  let isSevere = false;
  for (const pattern of SEVERE_PATTERNS) {
    if (pattern.test(normalized)) {
      isSevere = true;
      detectedTriggers.push(`severe:${pattern.source}`);
      break;
    }
  }

  if (isSevere) {
    const hotline = getHotlineForCountry(countryCode);
    return {
      isImminentCrisis: false,
      distressLevel: "severe",
      detectedTriggers,
      hasMeans,
      recommendedHotline: hotline,
      escalationMessage: `If you feel overwhelmed or need someone to talk to right now, free confidential support is always here for you at ${hotline.name} (${hotline.phoneDisplay}).`,
    };
  }

  // 5. Detect moderate distress
  let isModerate = false;
  for (const pattern of MODERATE_PATTERNS) {
    if (pattern.test(normalized)) {
      isModerate = true;
      detectedTriggers.push(`moderate:${pattern.source}`);
      break;
    }
  }

  if (isModerate) {
    return {
      isImminentCrisis: false,
      distressLevel: "moderate",
      detectedTriggers,
      hasMeans,
    };
  }

  // 6. Mild / Baseline
  return {
    isImminentCrisis: false,
    distressLevel: "mild",
    detectedTriggers,
    hasMeans,
  };
}
