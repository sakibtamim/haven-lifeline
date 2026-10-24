import { Hono } from "hono";
import {
  twilioWebhookSchema,
  evaluateCrisisSafety,
  buildTwimlMessage,
  generateDeEscalationResponse,
} from "@haven/shared";

export const smsRouter = new Hono();

smsRouter.post("/", async (c) => {
  let rawBody: Record<string, unknown> = {};

  const contentType = c.req.header("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      rawBody = (await c.req.json()) as Record<string, unknown>;
    } catch (_err) {
      return c.text("Invalid JSON payload", 400);
    }
  } else {
    // Parse form-urlencoded / multipart payload from Twilio
    try {
      const parsedBody = await c.req.parseBody();
      rawBody = parsedBody as Record<string, unknown>;
    } catch (_err) {
      return c.text("Invalid form payload", 400);
    }
  }

  const parsed = twilioWebhookSchema.safeParse(rawBody);
  if (!parsed.success) {
    return c.text("Validation failed: required fields missing", 400);
  }

  const { Body } = parsed.data;

  // Run deterministic crisis safety evaluation (zero PII logged)
  const evaluation = evaluateCrisisSafety(Body);

  let replyText: string;

  if (evaluation.isImminentCrisis) {
    // Return urgent emergency helpline instructions
    replyText =
      evaluation.escalationMessage ||
      "You are not alone. Please reach out right now: Call or text 988 for free 24/7 crisis support, or text HOME to 741741 to connect with Crisis Text Line.";
  } else {
    // Empathetic de-escalation response
    replyText = generateDeEscalationResponse(evaluation.distressLevel, Body);
  }

  const twiml = buildTwimlMessage(replyText);

  return new Response(twiml, {
    status: 200,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
    },
  });
});
