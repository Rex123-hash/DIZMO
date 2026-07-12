import { describe, expect, it } from "vitest";
import { generateSituationBrief } from "./brief.js";
import type { Incident, ResponseTask } from "./schemas.js";

const incident: Incident = {
  id: "inc-brief",
  type: "rescue_request",
  location: "Ward 8",
  priority: "critical",
  status: "open",
  summary: "Family stranded near Ward 8",
  evidence: [],
  createdAt: "2026-07-12T13:00:00.000Z",
  updatedAt: "2026-07-12T13:00:00.000Z",
};

const task: ResponseTask = {
  id: "task-brief",
  incidentId: "inc-brief",
  title: "Verify rescue request",
  status: "in_progress",
  priority: "critical",
  createdAt: "2026-07-12T13:01:00.000Z",
  updatedAt: "2026-07-12T13:01:00.000Z",
};

describe("generateSituationBrief", () => {
  it("returns an empty-state brief with no incidents", () => {
    expect(generateSituationBrief([], [])).toContain("No active incidents");
  });

  it("includes top risks and pending tasks", () => {
    const brief = generateSituationBrief([incident], [task]);

    expect(brief).toContain("Ward 8");
    expect(brief).toContain("Verify rescue request");
  });

  it("includes latest audit decisions", () => {
    const brief = generateSituationBrief(
      [incident],
      [task],
      [
        {
          id: "audit-1",
          type: "task_created",
          actor: "coordinator",
          subjectId: "task-brief",
          message: "Coordinator approved rescue verification.",
          createdAt: "2026-07-12T13:02:00.000Z",
        },
      ],
    );

    expect(brief).toContain("Coordinator approved rescue verification.");
  });
});
