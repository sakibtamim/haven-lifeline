import { describe, it, expect } from "vitest";
import {
  evaluateCrisisSafety,
  buildEmergencyEscalationMessage,
  buildTwimlMessage,
  generateDeEscalationResponse,
  escapeXml,
} from "./safety.js";
import { safetyEvaluationSchema } from "./schemas.js";

describe("Crisis Safety Classifier (evaluateCrisisSafety)", () => {
  it("detects explicit suicide intent as imminent crisis", () => {
    const inputs = [
      "I want to kill myself tonight",
      "I am going to end my life",
      "I want to die, nobody can help me",
      "I am ready to commit suicide",
      "I am writing my suicide note right now",
      "I am standing on the bridge ready to jump",
      "I can't go on, going to shoot myself",
      "I have decided to end it all",
    ];

    for (const text of inputs) {
      const evaluation = evaluateCrisisSafety(text);
      expect(evaluation.isImminentCrisis).toBe(true);
      expect(evaluation.distressLevel).toBe("imminent_crisis");
      expect(evaluation.recommendedHotline).toBeDefined();
      expect(evaluation.escalationMessage).toBeDefined();
      expect(evaluation.escalationMessage).toContain("988");
      expect(safetyEvaluationSchema.safeParse(evaluation).success).toBe(true);
    }
  });

  it("detects lethal means combined with self-harm cues", () => {
    const evaluation = evaluateCrisisSafety("I have a gun and I am saying goodbye to everyone");
    expect(evaluation.isImminentCrisis).toBe(true);
    expect(evaluation.hasMeans).toBe(true);
    expect(evaluation.distressLevel).toBe("imminent_crisis");
  });

  it("maps emergency hotlines to the requested country code", () => {
    const evalBD = evaluateCrisisSafety("I want to end my life", "BD");
    expect(evalBD.recommendedHotline?.countryCode).toBe("BD");
    expect(evalBD.recommendedHotline?.name).toContain("Kaan Pete Roi");
    expect(evalBD.escalationMessage).toContain("+880");

    const evalCA = evaluateCrisisSafety("I want to die", "CA");
    expect(evalCA.recommendedHotline?.countryCode).toBe("CA");
    expect(evalCA.recommendedHotline?.phoneDisplay).toContain("988");

    const evalGB = evaluateCrisisSafety("I want to die", "GB");
    expect(evalGB.recommendedHotline?.countryCode).toBe("GB");
    expect(evalGB.recommendedHotline?.primaryPhone).toBe("116123");

    const evalAU = evaluateCrisisSafety("I want to die", "AU");
    expect(evalAU.recommendedHotline?.countryCode).toBe("AU");
    expect(evalAU.recommendedHotline?.primaryPhone).toBe("131114");

    const evalFallback = evaluateCrisisSafety("I want to die", "UNKNOWN");
    expect(evalFallback.recommendedHotline?.countryCode).toBe("US");
  });

  it("classifies severe hopelessness and despair without active suicidal intent", () => {
    const severeInputs = [
      "I feel completely hopeless and worthless",
      "I can't take this pain anymore, everything is dark",
      "I hate myself and nobody cares about me",
      "I feel completely broken and drowning in despair",
      "I am giving up on everything",
    ];

    for (const text of severeInputs) {
      const evaluation = evaluateCrisisSafety(text);
      expect(evaluation.isImminentCrisis).toBe(false);
      expect(evaluation.distressLevel).toBe("severe");
      expect(evaluation.recommendedHotline).toBeDefined();
      expect(safetyEvaluationSchema.safeParse(evaluation).success).toBe(true);
    }
  });

  it("classifies acute panic and anxiety as moderate distress", () => {
    const moderateInputs = [
      "I'm having a panic attack and my heart is racing",
      "I feel so anxious and overwhelmed right now",
      "I am terrified and shaking and can't breathe",
      "I am crying uncontrollably and so stressed",
    ];

    for (const text of moderateInputs) {
      const evaluation = evaluateCrisisSafety(text);
      expect(evaluation.isImminentCrisis).toBe(false);
      expect(evaluation.distressLevel).toBe("moderate");
      expect(safetyEvaluationSchema.safeParse(evaluation).success).toBe(true);
    }
  });

  it("classifies general grounding queries as mild distress", () => {
    const mildInputs = [
      "Hello Haven, can you guide me through a breathing exercise?",
      "I need a moment to calm down after a long day",
      "How does the box breathing orb work?",
      "Good evening",
    ];

    for (const text of mildInputs) {
      const evaluation = evaluateCrisisSafety(text);
      expect(evaluation.isImminentCrisis).toBe(false);
      expect(evaluation.distressLevel).toBe("mild");
      expect(safetyEvaluationSchema.safeParse(evaluation).success).toBe(true);
    }
  });

  it("is pure functional and deterministic", () => {
    const text = "I am having a panic attack";
    const res1 = evaluateCrisisSafety(text);
    const res2 = evaluateCrisisSafety(text);
    expect(res1).toEqual(res2);
  });
});

describe("XML Escaping and TwiML Response Builder", () => {
  it("escapes special characters to prevent XML injection", () => {
    const unsafe = `<script>alert("test & 'bar'")</script>`;
    const escaped = escapeXml(unsafe);
    expect(escaped).toBe("&lt;script&gt;alert(&quot;test &amp; &apos;bar&apos;&quot;)&lt;/script&gt;");
  });

  it("builds valid TwiML XML document", () => {
    const twiml = buildTwimlMessage("Hold on, help is here. Call 988 & stay safe.");
    expect(twiml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(twiml).toContain("<Response>");
    expect(twiml).toContain("<Message>");
    expect(twiml).toContain("&amp;");
    expect(twiml).toContain("</Message>");
    expect(twiml).toContain("</Response>");
  });
});

describe("Emergency Escalation and De-escalation Helpers", () => {
  it("builds emergency escalation message with clickable links", () => {
    const msg = buildEmergencyEscalationMessage({
      countryCode: "US",
      countryName: "United States",
      name: "988 Suicide & Crisis Lifeline",
      primaryPhone: "988",
      phoneDisplay: "988 (Call or Text)",
      smsKeyword: "HOME",
      smsNumber: "741741",
      availableHours: "24/7",
      isEmergency: true,
    });

    expect(msg).toContain("988 Suicide & Crisis Lifeline");
    expect(msg).toContain("tel:988");
    expect(msg).toContain("sms:741741?body=HOME");
  });

  it("generates empathetic grounding de-escalation responses across tiers", () => {
    const tiers = ["imminent_crisis", "severe", "moderate", "mild"] as const;
    for (const tier of tiers) {
      const response = generateDeEscalationResponse(tier);
      expect(typeof response).toBe("string");
      expect(response.length).toBeGreaterThan(20);
    }
  });
});
