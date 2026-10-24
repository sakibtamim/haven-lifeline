import { z } from "zod";

export const hotlineSchema = z.object({
  countryCode: z.string().min(2).max(3),
  countryName: z.string().min(1),
  primaryPhone: z.string().min(3),
  phoneDisplay: z.string().min(3),
  smsKeyword: z.string().optional(),
  smsNumber: z.string().optional(),
  name: z.string().min(1),
  availableHours: z.string().min(1),
  isEmergency: z.boolean(),
  notes: z.string().optional(),
});

export type Hotline = z.infer<typeof hotlineSchema>;

export const distressLevelSchema = z.enum(["mild", "moderate", "severe", "imminent_crisis"]);
export type DistressLevel = z.infer<typeof distressLevelSchema>;

export const triageRequestSchema = z.object({
  userDistressLevel: distressLevelSchema,
  selectedNeed: z.enum(["breathing", "grounding", "chat", "hotline", "contract"]),
  locale: z.string().optional(),
});

export type TriageRequest = z.infer<typeof triageRequestSchema>;

export const microCommitmentSchema = z.object({
  durationMinutes: z.number().int().min(10).max(1440),
  timestamp: z.number().int(),
});

export type MicroCommitment = z.infer<typeof microCommitmentSchema>;

export const chatRoleSchema = z.enum(["user", "assistant", "system"]);
export type ChatRole = z.infer<typeof chatRoleSchema>;

export const chatMessageSchema = z.object({
  role: chatRoleSchema,
  content: z.string().min(1),
  timestamp: z.number().int().optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1),
  countryCode: z.string().optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const safetyEvaluationSchema = z.object({
  isImminentCrisis: z.boolean(),
  distressLevel: distressLevelSchema,
  detectedTriggers: z.array(z.string()),
  hasMeans: z.boolean(),
  recommendedHotline: hotlineSchema.optional(),
  escalationMessage: z.string().optional(),
});

export type SafetyEvaluation = z.infer<typeof safetyEvaluationSchema>;

export const twilioWebhookSchema = z.object({
  From: z.string().min(1),
  To: z.string().min(1),
  Body: z.string(),
  MessageSid: z.string().min(1),
  AccountSid: z.string().optional(),
});

export type TwilioWebhook = z.infer<typeof twilioWebhookSchema>;

export const smsPayloadSchema = twilioWebhookSchema;
export type SmsPayload = TwilioWebhook;

export const twilioResponseSchema = z.object({
  twiml: z.string().min(1),
  distressLevel: distressLevelSchema,
  escalated: z.boolean(),
});

export type TwilioResponse = z.infer<typeof twilioResponseSchema>;

