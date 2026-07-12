import { describe, expect, it } from "vitest";
import type { Incident, ResponseTask } from "./schemas.js";
import { InMemoryIncidentStore } from "./store.js";

const baseIncident: Incident = {
  id: "inc-test",
  type: "supply_shortage",
  location: "Shelter North",
  priority: "high",
  status: "open",
  summary: "Water shortage at Shelter North",
  evidence: [],
  createdAt: "2026-07-12T13:00:00.000Z",
  updatedAt: "2026-07-12T13:00:00.000Z",
};

describe("InMemoryIncidentStore", () => {
  it("stores and retrieves incidents", () => {
    const store = new InMemoryIncidentStore();

    store.saveIncident(baseIncident);

    expect(store.getIncident("inc-test")?.location).toBe("Shelter North");
  });

  it("updates incident status", () => {
    const store = new InMemoryIncidentStore();
    store.saveIncident(baseIncident);

    const updated = store.updateIncident("inc-test", { status: "acknowledged" });

    expect(updated?.status).toBe("acknowledged");
  });

  it("stores tasks", () => {
    const store = new InMemoryIncidentStore();
    const task: ResponseTask = {
      id: "task-test",
      incidentId: "inc-test",
      title: "Dispatch water",
      status: "approved",
      priority: "high",
      createdAt: "2026-07-12T13:01:00.000Z",
      updatedAt: "2026-07-12T13:01:00.000Z",
    };

    store.saveTask(task);

    expect(store.listTasks()).toHaveLength(1);
  });

  it("records audit events", () => {
    const store = new InMemoryIncidentStore();

    const event = store.addAuditEvent({
      type: "task_created",
      actor: "coordinator",
      subjectId: "task-test",
      message: "Task approved.",
    });

    expect(event.id).toContain("audit-");
    expect(store.listAuditEvents()[0]?.message).toBe("Task approved.");
  });
});
