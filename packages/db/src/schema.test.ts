import { describe, it, expect } from "vitest";
import { hotlinesTable, anonymousDailyMetricsTable } from "./schema/index.js";

describe("Database Schemas & Zero-PII Invariant", () => {
  it("verifies hotlines table columns exist", () => {
    expect(hotlinesTable.countryCode).toBeDefined();
    expect(hotlinesTable.primaryPhone).toBeDefined();
    expect(hotlinesTable.isEmergency).toBeDefined();
  });

  it("verifies anonymous metrics table strictly prohibits PII columns", () => {
    // Audit check: Verify NO user_ip, chat_text, phone_number columns exist in metrics table
    const tableKeys = Object.keys(anonymousDailyMetricsTable);
    expect(tableKeys).not.toContain("userIp");
    expect(tableKeys).not.toContain("chatText");
    expect(tableKeys).not.toContain("phoneNumber");
    expect(tableKeys).not.toContain("userMessage");
    expect(anonymousDailyMetricsTable.counter).toBeDefined();
  });
});
