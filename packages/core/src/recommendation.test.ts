import { describe, expect, it } from "vitest";
import { createIncidentFromExtraction } from "./incident.js";
import { buildIncidentRecommendation } from "./recommendation.js";
import type { ExtractedReport } from "./schemas.js";
import { DemoReliefToolset } from "./tools.js";

const tools = new DemoReliefToolset();

describe("buildIncidentRecommendation", () => {
  it("recommends dispatch for water shortages", async () => {
    const extracted: ExtractedReport = {
      incidentType: "supply_shortage",
      location: "Shelter North",
      need: "water",
      peopleAffected: 80,
      priority: "high",
      confidence: 0.86,
      summary: "Water shortage at Shelter North",
      keywords: ["water", "shelter"],
    };
    const incident = createIncidentFromExtraction(extracted, "report-water");

    const result = await buildIncidentRecommendation(incident, extracted, [], tools);

    expect(result.action.title).toContain("Dispatch water");
    expect(result.action.requiresApproval).toBe(true);
    expect(result.evidence.some((item) => item.source === "mcp")).toBe(true);
  });

  it("recommends verification for rescue requests", async () => {
    const extracted: ExtractedReport = {
      incidentType: "rescue_request",
      location: "Ward 8 bridge checkpoint",
      need: "rescue verification",
      peopleAffected: 5,
      priority: "critical",
      confidence: 0.9,
      summary: "Family stranded near Ward 8",
      keywords: ["rescue", "ward 8"],
    };
    const incident = createIncidentFromExtraction(extracted, "report-rescue");

    const result = await buildIncidentRecommendation(incident, extracted, [], tools);

    expect(result.action.title).toContain("Verify rescue request");
    expect(result.action.priority).toBe("critical");
  });
});
