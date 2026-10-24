import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import {
  chatRequestSchema,
  evaluateCrisisSafety,
  generateDeEscalationResponse,
  type SafetyEvaluation,
} from "@haven/shared";

export const chatRouter = new Hono();

// Helper to delay tokens gently without blocking tests
const delay = (ms: number) =>
  ms > 0 ? new Promise<void>((resolve) => setTimeout(resolve, ms)) : Promise.resolve();

chatRouter.post("/", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch (_err) {
    return c.json({ error: "Invalid JSON payload" }, 400);
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "Validation failed", details: parsed.error.issues },
      400
    );
  }

  const { messages, countryCode } = parsed.data;
  const userMessages = messages.filter((m) => m.role === "user");
  const latestMessage = userMessages[userMessages.length - 1];

  if (!latestMessage) {
    return c.json({ error: "No user message provided" }, 400);
  }

  // 1. Perform deterministic crisis safety heuristic evaluation first
  // Pure functional, zero PII logging
  const safety: SafetyEvaluation = evaluateCrisisSafety(
    latestMessage.content,
    countryCode
  );

  return streamSSE(c, async (stream) => {
    // If imminent crisis, immediately stream emergency escalation payload
    if (safety.isImminentCrisis) {
      await stream.writeSSE({
        event: "safety",
        data: JSON.stringify({
          isImminentCrisis: true,
          distressLevel: safety.distressLevel,
          triggers: safety.detectedTriggers,
          hotline: safety.recommendedHotline,
        }),
      });

      const escalationText = safety.escalationMessage || "";
      await stream.writeSSE({
        event: "token",
        data: JSON.stringify({ token: escalationText, done: false }),
      });

      await stream.writeSSE({
        event: "token",
        data: JSON.stringify({ token: "", done: true }),
      });
      return;
    }

    // Non-imminent distress or calm grounding
    await stream.writeSSE({
      event: "safety",
      data: JSON.stringify({
        isImminentCrisis: false,
        distressLevel: safety.distressLevel,
        triggers: safety.detectedTriggers,
        hotline: safety.recommendedHotline,
      }),
    });

    const responseText = generateDeEscalationResponse(
      safety.distressLevel,
      latestMessage.content
    );

    // Stream words with gentle pacing (0ms in tests to preserve sub-second invariant)
    const tokens = responseText.split(" ");
    const isTest = process.env.NODE_ENV === "test" || Boolean(process.env.VITEST);
    const delayMs = isTest ? 0 : 20;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i] + (i < tokens.length - 1 ? " " : "");
      await stream.writeSSE({
        event: "token",
        data: JSON.stringify({ token, done: false }),
      });
      if (delayMs > 0) {
        await delay(delayMs);
      }
    }

    await stream.writeSSE({
      event: "token",
      data: JSON.stringify({ token: "", done: true }),
    });
  });
});
