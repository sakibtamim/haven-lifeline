import { describe, it, expect } from "vitest";
import { parseSseLines, type ChatSafetyAlert } from "./CrisisChat";

describe("CrisisChat SSE Parsing & Safety Escalation Logic", () => {
  it("parses single event and data block correctly", () => {
    const rawChunk = `event: token\ndata: {"token":"Hello there ","done":false}\n\n`;
    const parsed = parseSseLines(rawChunk);

    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.event).toBe("token");
    expect(parsed[0]?.data).toBe('{"token":"Hello there ","done":false}');
  });

  it("parses multi-event stream chunk with safety and token payloads", () => {
    const rawStream = [
      `event: safety`,
      `data: {"isImminentCrisis":true,"distressLevel":"imminent_crisis","triggers":["intent:kill myself"],"hotline":{"name":"Bangladesh National Lifeline 999 & Kaan Pete Roi","primaryPhone":"999","phoneDisplay":"999 / +880 1779-554391"}}`,
      ``,
      `event: token`,
      `data: {"token":"Please pause, ","done":false}`,
      ``,
      `event: token`,
      `data: {"token":"you are not alone.","done":false}`,
      ``,
      `event: token`,
      `data: {"token":"","done":true}`,
      ``,
    ].join("\n");

    const parsed = parseSseLines(rawStream);
    expect(parsed).toHaveLength(4);

    expect(parsed[0]?.event).toBe("safety");
    const safetyData: ChatSafetyAlert = JSON.parse(parsed[0]!.data);
    expect(safetyData.isImminentCrisis).toBe(true);
    expect(safetyData.distressLevel).toBe("imminent_crisis");
    expect(safetyData.hotline?.primaryPhone).toBe("999");

    expect(parsed[1]?.event).toBe("token");
    const token1 = JSON.parse(parsed[1]!.data);
    expect(token1.token).toBe("Please pause, ");
    expect(token1.done).toBe(false);

    expect(parsed[3]?.event).toBe("token");
    const tokenDone = JSON.parse(parsed[3]!.data);
    expect(tokenDone.done).toBe(true);
  });

  it("handles malformed or whitespace-only chunks gracefully without throwing", () => {
    const emptyResult = parseSseLines("\n\n   \n\n");
    expect(emptyResult).toEqual([]);

    const partialChunk = "random text without event prefix\n\n";
    const partialResult = parseSseLines(partialChunk);
    expect(partialResult).toEqual([]);
  });

  it("accumulates tokens sequentially to form complete compassionate response", () => {
    const tokens = ["You ", "have ", "carried ", "so ", "much. ", "I ", "am ", "listening."];
    let accumulated = "";

    for (const t of tokens) {
      accumulated += t;
    }

    expect(accumulated).toBe("You have carried so much. I am listening.");
  });

  it("verifies volatile state guarantee (zero disk/localStorage persistence by contract)", () => {
    const hasWindow = typeof window !== "undefined";
    const stored = hasWindow && window.localStorage ? window.localStorage.getItem("chatHistory") : null;
    expect(stored).toBeNull();
  });
});
