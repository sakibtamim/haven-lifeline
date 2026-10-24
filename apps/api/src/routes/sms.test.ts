import { describe, it, expect } from "vitest";
import { app } from "../index.js";

describe("Twilio SMS Webhook Route (POST /api/sms)", () => {
  it("rejects invalid payload missing required fields with 400", async () => {
    const res = await app.request("/api/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Invalid: "data" }),
    });
    expect(res.status).toBe(400);
  });

  it("handles JSON payload with non-crisis message and returns valid TwiML", async () => {
    const res = await app.request("/api/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        From: "+15551234567",
        To: "+15557654321",
        Body: "I am feeling anxious and need to ground myself",
        MessageSid: "SM1234567890abcdef",
      }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/xml");
    const text = await res.text();
    expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(text).toContain("<Response>");
    expect(text).toContain("<Message>");
    expect(text).toContain("</Message>");
    expect(text).toContain("</Response>");
  });

  it("handles form-urlencoded payload and escalates imminent crisis with 988 in TwiML", async () => {
    const params = new URLSearchParams();
    params.append("From", "+15551234567");
    params.append("To", "+15557654321");
    params.append("Body", "I want to kill myself, I cannot take this anymore");
    params.append("MessageSid", "SM0987654321fedcba");

    const res = await app.request("/api/sms", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/xml");
    const text = await res.text();
    expect(text).toContain("<Response>");
    expect(text).toContain("<Message>");
    expect(text).toContain("988");
    expect(text).toContain("Suicide &amp; Crisis Lifeline");
    expect(text).toContain("</Message>");
    expect(text).toContain("</Response>");
  });
});
