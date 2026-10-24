import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { serve } from "@hono/node-server";
import { chatRouter } from "./routes/chat.js";
import { smsRouter } from "./routes/sms.js";

export const app = new Hono();

// Security headers middleware
app.use("*", secureHeaders());

// CORS configuration for web sanctuary
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (
        !origin ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("https://haven-")
      ) {
        return origin || "*";
      }
      return null;
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Health probe endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "haven-crisis-api",
    timestamp: Date.now(),
  });
});

// Mount crisis subrouters
app.route("/api/chat", chatRouter);
app.route("/api/sms", smsRouter);

// Start server if run as standalone process (non-test environment)
if (process.env.NODE_ENV !== "test" && !process.env.VITEST) {
  const port = Number(process.env.PORT) || 4000;
  serve({ fetch: app.fetch, port }, (info) => {
    // Only log port, zero PII
    console.info(`Haven Crisis API listening on http://localhost:${info.port}`);
  });
}

export default app;
