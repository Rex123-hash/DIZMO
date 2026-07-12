import type { Incident, ResponseTask } from "./schemas.js";
import type { AuditEvent } from "./store.js";

const priorityWeight = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
} as const;

export function generateSituationBrief(
  incidents: Incident[],
  tasks: ResponseTask[],
  auditEvents: AuditEvent[] = [],
): string {
  if (incidents.length === 0) {
    return "DIZMO Situation Brief\n\nNo active incidents are currently tracked.";
  }

  const openIncidents = incidents.filter((incident) => incident.status !== "resolved");
  const topRisks = [...openIncidents]
    .sort((left, right) => priorityWeight[right.priority] - priorityWeight[left.priority])
    .slice(0, 3);
  const pendingTasks = tasks.filter((task) => task.status !== "done").slice(0, 3);
  const latestEvents = auditEvents.slice(0, 3);

  const riskLines = topRisks.map(
    (incident, index) =>
      `${index + 1}. ${incident.priority.toUpperCase()}: ${incident.location} - ${incident.summary}`,
  );
  const taskLines = pendingTasks.map(
    (task, index) => `${index + 1}. ${task.title} (${task.status})`,
  );
  const eventLines = latestEvents.map((event, index) => `${index + 1}. ${event.message}`);

  return [
    "DIZMO Situation Brief",
    "",
    `Current status: ${openIncidents.length} active incident(s), ${pendingTasks.length} pending task(s).`,
    "",
    "Top risks:",
    riskLines.length > 0 ? riskLines.join("\n") : "No unresolved high-risk incidents.",
    "",
    "Recommended next actions:",
    taskLines.length > 0
      ? taskLines.join("\n")
      : "Create assignments for the highest-priority open incidents.",
    "",
    "Latest decisions:",
    eventLines.length > 0 ? eventLines.join("\n") : "No coordinator decisions recorded yet.",
  ].join("\n");
}
