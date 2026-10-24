import { pgTable, text, integer, timestamp, uuid, date } from "drizzle-orm/pg-core";

/**
 * Strict Zero-PII Anonymous Telemetry Aggregation Table
 * Tracks only aggregate counters. Never records user text, IP addresses, or phone numbers.
 */
export const anonymousDailyMetricsTable = pgTable("anonymous_daily_metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  metricDate: date("metric_date").notNull(),
  category: text("category").notNull(), // "breathing_cycle", "grounding_completed", "hotline_click", "contract_hold"
  countryCode: text("country_code").default("UNKNOWN").notNull(),
  counter: integer("counter").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
