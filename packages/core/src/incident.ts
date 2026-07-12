import type { EvidenceItem, ExtractedReport, Incident } from "./schemas.js";

export function createIncidentFromExtraction(
  extracted: ExtractedReport,
  reportId: string,
): Incident {
  const now = new Date().toISOString();
  const evidence: EvidenceItem[] = [
    {
      source: "user",
      label: "Structured field report",
      value: extracted.summary,
      confidence: extracted.confidence,
    },
  ];

  return {
    id: `inc-${reportId}`,
    type: extracted.incidentType,
    location: extracted.location,
    priority: extracted.priority,
    status: "open",
    summary: extracted.summary,
    evidence,
    createdAt: now,
    updatedAt: now,
  };
}
