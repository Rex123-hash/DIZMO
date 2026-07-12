import type {
  EvidenceItem,
  ExtractedReport,
  Incident,
  RecommendedAction,
  SearchResult,
} from "./schemas.js";
import type { ReliefToolset } from "./tools.js";

export async function buildIncidentRecommendation(
  incident: Incident,
  extracted: ExtractedReport,
  relatedContext: SearchResult[],
  tools: ReliefToolset,
): Promise<{ evidence: EvidenceItem[]; action: RecommendedAction }> {
  const evidence: EvidenceItem[] = [
    ...incident.evidence,
    ...relatedContext.slice(0, 3).map<EvidenceItem>((item) => ({
      source: "slack",
      label: `${item.channel} by ${item.author}`,
      value: item.text,
      confidence: item.relevance,
    })),
  ];

  if (extracted.need === "water") {
    const depots = await tools.getSupplyStatus("water");
    const bestDepot = depots.sort((left, right) => right.waterCrates - left.waterCrates)[0];

    if (bestDepot) {
      evidence.push({
        source: "mcp",
        label: "Supply availability",
        value: `${bestDepot.name} has ${bestDepot.waterCrates} water crates available.`,
        confidence: 0.95,
      });

      return {
        evidence,
        action: {
          title: `Dispatch water from ${bestDepot.name} to ${incident.location}`,
          rationale: `DIZMO found a high-priority water need and ${bestDepot.name} has the strongest stock position.`,
          requiresApproval: true,
          priority: incident.priority,
        },
      };
    }
  }

  if (extracted.need === "rescue verification") {
    const volunteers = await tools.findAvailableVolunteers("driver");
    const volunteer = volunteers[0];

    if (volunteer) {
      evidence.push({
        source: "mcp",
        label: "Volunteer availability",
        value: `${volunteer.name} is available as a driver in the ${volunteer.zone} zone.`,
        confidence: 0.9,
      });
    }

    return {
      evidence,
      action: {
        title: `Verify rescue request at ${incident.location}`,
        rationale:
          "The report indicates stranded or trapped people and requires human confirmation.",
        requiresApproval: true,
        priority: incident.priority,
      },
    };
  }

  return {
    evidence,
    action: {
      title: `Review ${extracted.need} report at ${incident.location}`,
      rationale: "DIZMO found a report that should be reviewed by the response coordinator.",
      requiresApproval: true,
      priority: incident.priority,
    },
  };
}
