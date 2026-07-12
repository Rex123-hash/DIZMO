import type { Incident, ResponseTask } from "./schemas.js";

export interface AuditEvent {
  id: string;
  type: "incident_created" | "incident_acknowledged" | "incident_escalated" | "task_created";
  actor: string;
  subjectId: string;
  message: string;
  createdAt: string;
}

export class InMemoryIncidentStore {
  private readonly incidents = new Map<string, Incident>();
  private readonly tasks = new Map<string, ResponseTask>();
  private readonly auditEvents: AuditEvent[] = [];

  saveIncident(incident: Incident): Incident {
    this.incidents.set(incident.id, incident);
    return incident;
  }

  listIncidents(): Incident[] {
    return [...this.incidents.values()].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    );
  }

  getIncident(id: string): Incident | undefined {
    return this.incidents.get(id);
  }

  updateIncident(id: string, patch: Partial<Incident>): Incident | undefined {
    const current = this.incidents.get(id);

    if (!current) {
      return undefined;
    }

    const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
    this.incidents.set(id, next);
    return next;
  }

  saveTask(task: ResponseTask): ResponseTask {
    this.tasks.set(task.id, task);
    return task;
  }

  listTasks(): ResponseTask[] {
    return [...this.tasks.values()].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    );
  }

  addAuditEvent(event: Omit<AuditEvent, "id" | "createdAt">): AuditEvent {
    const auditEvent: AuditEvent = {
      ...event,
      id: `audit-${Date.now()}-${this.auditEvents.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    this.auditEvents.push(auditEvent);
    return auditEvent;
  }

  listAuditEvents(): AuditEvent[] {
    return [...this.auditEvents].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    );
  }
}
