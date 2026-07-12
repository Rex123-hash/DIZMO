import { z } from "zod";

export const incidentPrioritySchema = z.enum(["low", "medium", "high", "critical"]);
export type IncidentPriority = z.infer<typeof incidentPrioritySchema>;

export const incidentStatusSchema = z.enum(["open", "acknowledged", "assigned", "resolved"]);
export type IncidentStatus = z.infer<typeof incidentStatusSchema>;

export const evidenceSourceSchema = z.enum(["slack", "mcp", "user", "system"]);
export type EvidenceSource = z.infer<typeof evidenceSourceSchema>;

export const evidenceItemSchema = z.object({
  source: evidenceSourceSchema,
  label: z.string().min(1),
  value: z.string().min(1),
  confidence: z.number().min(0).max(1).optional(),
});
export type EvidenceItem = z.infer<typeof evidenceItemSchema>;

export const fieldReportSchema = z.object({
  id: z.string().min(1),
  channelId: z.string().min(1),
  threadTs: z.string().optional(),
  rawText: z.string().min(1),
  reporter: z.string().min(1),
  createdAt: z.string().datetime(),
});
export type FieldReport = z.infer<typeof fieldReportSchema>;

export const extractedReportSchema = z.object({
  incidentType: z.string().min(1),
  location: z.string().min(1),
  need: z.string().min(1),
  peopleAffected: z.number().int().nonnegative().optional(),
  priority: incidentPrioritySchema,
  confidence: z.number().min(0).max(1),
  summary: z.string().min(1),
  keywords: z.array(z.string().min(1)),
});
export type ExtractedReport = z.infer<typeof extractedReportSchema>;

export const incidentSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  location: z.string().min(1),
  priority: incidentPrioritySchema,
  status: incidentStatusSchema,
  summary: z.string().min(1),
  evidence: z.array(evidenceItemSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Incident = z.infer<typeof incidentSchema>;

export const recommendedActionSchema = z.object({
  title: z.string().min(1),
  rationale: z.string().min(1),
  requiresApproval: z.boolean(),
  priority: incidentPrioritySchema,
});
export type RecommendedAction = z.infer<typeof recommendedActionSchema>;

export const responseTaskSchema = z.object({
  id: z.string().min(1),
  incidentId: z.string().min(1),
  title: z.string().min(1),
  owner: z.string().min(1).optional(),
  status: z.enum(["pending", "approved", "in_progress", "done"]),
  priority: incidentPrioritySchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type ResponseTask = z.infer<typeof responseTaskSchema>;

export const shelterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  zone: z.string().min(1),
  capacity: z.number().int().positive(),
  currentOccupancy: z.number().int().nonnegative(),
  waterCrates: z.number().int().nonnegative(),
  status: z.enum(["normal", "watch", "stressed", "full"]),
});
export type Shelter = z.infer<typeof shelterSchema>;

export const supplyDepotSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  zone: z.string().min(1),
  waterCrates: z.number().int().nonnegative(),
  blankets: z.number().int().nonnegative(),
  medKits: z.number().int().nonnegative(),
});
export type SupplyDepot = z.infer<typeof supplyDepotSchema>;

export const volunteerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  skills: z.array(z.string().min(1)),
  zone: z.string().min(1),
  availability: z.enum(["available", "busy", "offline"]),
});
export type Volunteer = z.infer<typeof volunteerSchema>;

export const searchResultSchema = z.object({
  id: z.string().min(1),
  channel: z.string().min(1),
  author: z.string().min(1),
  text: z.string().min(1),
  createdAt: z.string().datetime(),
  relevance: z.number().min(0).max(1),
});
export type SearchResult = z.infer<typeof searchResultSchema>;
