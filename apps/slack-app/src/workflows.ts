import {
  buildIncidentRecommendation,
  createIncidentFromExtraction,
  extractReport,
  type FieldReport,
  generateSituationBrief,
  type Incident,
  type RecommendedAction,
  type ResponseTask,
} from "@dizmo/core";
import { incidentStore, reliefTools, searchAdapter } from "./state.js";

export async function intakeReport(report: FieldReport): Promise<{
  incident: Incident;
  action: RecommendedAction;
}> {
  const extracted = extractReport(report);
  const incident = createIncidentFromExtraction(extracted, report.id);
  const related = await searchAdapter.search(`${extracted.location} ${extracted.need}`);
  const recommendation = await buildIncidentRecommendation(
    incident,
    extracted,
    related,
    reliefTools,
  );

  const savedIncident = incidentStore.saveIncident({
    ...incident,
    evidence: recommendation.evidence,
  });
  incidentStore.addAuditEvent({
    type: "incident_created",
    actor: report.reporter,
    subjectId: savedIncident.id,
    message: `DIZMO created ${savedIncident.priority} incident for ${savedIncident.location}.`,
  });

  return {
    incident: savedIncident,
    action: recommendation.action,
  };
}

export function createTaskForIncident(
  incidentId: string,
  actor = "coordinator",
): ResponseTask | undefined {
  const incident = incidentStore.getIncident(incidentId);

  if (!incident) {
    return undefined;
  }

  const now = new Date().toISOString();
  const task: ResponseTask = {
    id: `task-${incidentId}-${Date.now()}`,
    incidentId,
    title: `Coordinate response for ${incident.location}`,
    status: "approved",
    priority: incident.priority,
    createdAt: now,
    updatedAt: now,
  };

  incidentStore.updateIncident(incidentId, { status: "assigned" });
  const savedTask = incidentStore.saveTask(task);
  incidentStore.addAuditEvent({
    type: "task_created",
    actor,
    subjectId: savedTask.id,
    message: `${actor} approved task for ${incident.location}.`,
  });
  return savedTask;
}

export function acknowledgeIncident(
  incidentId: string,
  actor = "coordinator",
): Incident | undefined {
  const incident = incidentStore.updateIncident(incidentId, { status: "acknowledged" });

  if (incident) {
    incidentStore.addAuditEvent({
      type: "incident_acknowledged",
      actor,
      subjectId: incidentId,
      message: `${actor} acknowledged ${incident.location}.`,
    });
  }

  return incident;
}

export function escalateIncident(incidentId: string, actor = "coordinator"): Incident | undefined {
  const incident = incidentStore.updateIncident(incidentId, {
    priority: "critical",
    status: "acknowledged",
  });

  if (incident) {
    incidentStore.addAuditEvent({
      type: "incident_escalated",
      actor,
      subjectId: incidentId,
      message: `${actor} escalated ${incident.location} to critical.`,
    });
  }

  return incident;
}

export function buildBrief(): string {
  return generateSituationBrief(
    incidentStore.listIncidents(),
    incidentStore.listTasks(),
    incidentStore.listAuditEvents(),
  );
}

export interface DemoEvent {
  kind: "context" | "report";
  text: string;
  report?: FieldReport;
}

export function demoEvents(channelId: string, reporter: string): DemoEvent[] {
  const now = new Date().toISOString();

  return [
    {
      kind: "context",
      text: "Field update: Ward 8 bridge checkpoint has rising water and poor visibility.",
    },
    {
      kind: "context",
      text: "Shelter update: Two buses are headed to Shelter North with more evacuees.",
    },
    {
      kind: "context",
      text: "Supply desk: Central Depot has water crates but needs driver assignment for north route.",
    },
    {
      kind: "report",
      text: "Urgent field report: family of 5 stranded near Ward 8 bridge checkpoint.",
      report: {
        id: `demo-rescue-${Date.now()}`,
        channelId,
        rawText:
          "Family of 5 stranded near Ward 8 bridge checkpoint. Water rising. One elderly person. Need rescue verification.",
        reporter,
        createdAt: now,
      },
    },
    {
      kind: "report",
      text: "Shelter report: Shelter North is close to a water shortage.",
      report: {
        id: `demo-water-${Date.now() + 1}`,
        channelId,
        rawText:
          "Shelter North has only 12 water crates left. 80 people inside and two buses arriving.",
        reporter,
        createdAt: now,
      },
    },
  ];
}
