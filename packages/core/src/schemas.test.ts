import { describe, expect, it } from "vitest";
import { fieldReportSchema, incidentPrioritySchema } from "./schemas.js";

describe("schemas", () => {
  it("accepts valid priorities", () => {
    expect(incidentPrioritySchema.parse("critical")).toBe("critical");
  });

  it("rejects invalid priorities", () => {
    expect(() => incidentPrioritySchema.parse("urgent")).toThrow();
  });

  it("validates field reports", () => {
    const parsed = fieldReportSchema.parse({
      id: "report-1",
      channelId: "C123",
      rawText: "Shelter North needs water.",
      reporter: "U123",
      createdAt: "2026-07-12T13:00:00.000Z",
    });

    expect(parsed.rawText).toContain("water");
  });
});
