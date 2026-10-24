import { describe, it, expect } from "vitest";
import { app } from "../index.js";

describe("Chat Route (POST /api/chat)", () => {
  it("rejects non-JSON payload with 400", async () => {
    const res = await app.request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "not json",
    });
    expect(res.status).toBe(400);
  });

  it("rejects invalid chat payload with 400", async () => {
    const res = await app.request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [] }),
    });
    expect(res.status).toBe(400);
  });

  it("handles valid non-crisis grounding message and streams SSE chunks", async () => {
    const res = await app.request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "I feel stressed and want to do a breathing exercise" }],
      }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/event-stream");

    const bodyText = await res.text();
    expect(bodyText).toContain("event: safety");
    expect(bodyText).toContain('"isImminentCrisis":false');
    expect(bodyText).toContain("event: token");
    expect(bodyText).toContain('"done":true');
  });

  it("immediately streams crisis safety escalation on imminent self-harm detection", async () => {
    const res = await app.request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "I want to kill myself right now" }],
        countryCode: "US",
      }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/event-stream");

    const bodyText = await res.text();
    expect(bodyText).toContain("event: safety");
    expect(bodyText).toContain('"isImminentCrisis":true');
    expect(bodyText).toContain("988 Suicide & Crisis Lifeline");
    expect(bodyText).toContain("tel:988");
  });

  it("returns 200 on /health probe", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string; service: string };
    expect(body.status).toBe("ok");
    expect(body.service).toBe("haven-crisis-api");
  });
});
