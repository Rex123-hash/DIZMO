import { describe, expect, it } from "vitest";
import { extractReport, shouldIntakeFieldReport } from "./extraction.js";
import type { FieldReport } from "./schemas.js";

describe("extractReport", () => {
  it("extracts a critical rescue report", () => {
    const report: FieldReport = {
      id: "r1",
      channelId: "C123",
      rawText:
        "Family of 5 stranded near Ward 8 bridge checkpoint. Water rising. One elderly person. Need rescue verification.",
      reporter: "U123",
      createdAt: "2026-07-12T13:45:00.000Z",
    };

    const extracted = extractReport(report);

    expect(extracted.priority).toBe("critical");
    expect(extracted.location).toBe("Ward 8 bridge checkpoint");
    expect(extracted.need).toBe("rescue verification");
    expect(extracted.peopleAffected).toBe(5);
  });

  it("extracts a high-priority water shortage report", () => {
    const report: FieldReport = {
      id: "r2",
      channelId: "C123",
      rawText:
        "Shelter North has only 12 water crates left. 80 people inside and two buses arriving.",
      reporter: "U123",
      createdAt: "2026-07-12T13:46:00.000Z",
    };

    const extracted = extractReport(report);

    expect(extracted.priority).toBe("high");
    expect(extracted.location).toBe("Shelter North");
    expect(extracted.need).toBe("water");
    expect(extracted.peopleAffected).toBe(80);
  });

  it("detects medical support reports", () => {
    const report: FieldReport = {
      id: "r3",
      channelId: "C123",
      rawText: "Medical assistance needed in Central District. One resident has a leg injury.",
      reporter: "U123",
      createdAt: "2026-07-12T13:47:00.000Z",
    };

    const extracted = extractReport(report);

    expect(extracted.location).toBe("Central District");
    expect(extracted.need).toBe("medical support");
    expect(extracted.priority).toBe("high");
  });

  it("detects transport reports", () => {
    const report: FieldReport = {
      id: "r4",
      channelId: "C123",
      rawText: "Road blocked near Main Road. Driver route needs rerouting.",
      reporter: "U123",
      createdAt: "2026-07-12T13:48:00.000Z",
    };

    const extracted = extractReport(report);

    expect(extracted.location).toBe("Main Road");
    expect(extracted.need).toBe("transport");
  });

  it("does not intake greetings as field reports", () => {
    expect(shouldIntakeFieldReport("hey")).toBe(false);
    expect(shouldIntakeFieldReport("hello")).toBe(false);
    expect(shouldIntakeFieldReport("ping")).toBe(false);
  });

  it("intakes operational disaster reports", () => {
    expect(
      shouldIntakeFieldReport("Shelter North has only 12 water crates left and 80 people inside."),
    ).toBe(true);
    expect(shouldIntakeFieldReport("Medical help needed in Central District.")).toBe(true);
    expect(shouldIntakeFieldReport("Family of 5 stranded near Ward 8 bridge.")).toBe(true);
  });
});
