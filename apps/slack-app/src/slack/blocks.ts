import type { Incident, RecommendedAction, ResponseTask } from "@dizmo/core";

export function buildIncidentBlocks(incident: Incident, action: RecommendedAction) {
  const evidenceText = incident.evidence
    .slice(0, 4)
    .map((item) => `- *${item.label}:* ${item.value}`)
    .join("\n");
  const approvalText = action.requiresApproval
    ? "Human approval required before dispatch or assignment."
    : "No approval required.";

  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${incident.priority.toUpperCase()}: ${incident.location}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Incident:* ${incident.summary}\n*Status:* ${incident.status}\n*Decision mode:* ${approvalText}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Evidence*\n${evidenceText || "No evidence attached yet."}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Recommended action*\n${action.title}\n_${action.rationale}_\n\nDIZMO recommends. A coordinator decides.`,
      },
    },
    {
      type: "actions",
      elements: [
        button("ack_incident", "Acknowledge", incident.id),
        button("create_task", "Create Task", incident.id, "primary"),
        button("escalate_incident", "Escalate", incident.id, "danger"),
      ],
    },
  ];
}

export function buildTaskBlocks(task: ResponseTask) {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Task created:* ${task.title}\n*Priority:* ${task.priority}\n*Status:* ${task.status}`,
      },
    },
  ];
}

function button(actionId: string, text: string, value: string, style?: "primary" | "danger") {
  return {
    type: "button",
    action_id: actionId,
    text: {
      type: "plain_text",
      text,
    },
    value,
    ...(style ? { style } : {}),
  };
}
