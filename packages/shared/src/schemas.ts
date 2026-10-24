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

export const triageRequestSchema = z.object({
  userDistressLevel: z.enum(["mild", "moderate", "severe", "imminent_crisis"]),
  selectedNeed: z.enum(["breathing", "grounding", "chat", "hotline", "contract"]),
  locale: z.string().optional(),
});

export type TriageRequest = z.infer<typeof triageRequestSchema>;

export const microCommitmentSchema = z.object({
  durationMinutes: z.number().int().min(10).max(1440),
  timestamp: z.number().int(),
});

export type MicroCommitment = z.infer<typeof microCommitmentSchema>;
