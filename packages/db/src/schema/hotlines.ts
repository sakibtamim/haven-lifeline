import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

export const hotlinesTable = pgTable("hotlines", {
  id: uuid("id").defaultRandom().primaryKey(),
  countryCode: text("country_code").notNull(),
  countryName: text("country_name").notNull(),
  name: text("name").notNull(),
  primaryPhone: text("primary_phone").notNull(),
  phoneDisplay: text("phone_display").notNull(),
  smsKeyword: text("sms_keyword"),
  smsNumber: text("sms_number"),
  availableHours: text("available_hours").notNull(),
  isEmergency: boolean("is_emergency").default(true).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
