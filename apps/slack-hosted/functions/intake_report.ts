import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { shouldBuildBrief, triageReport } from "../lib/triage.ts";

export const IntakeReportDefinition = DefineFunction({
  callback_id: "intake_report",
  title: "Intake field report",
  description: "Turns a Slack field update into an incident or situation brief.",
  source_file: "functions/intake_report.ts",
  input_parameters: {
    properties: {
      channel_id: { type: Schema.slack.types.channel_id },
      user_id: { type: Schema.slack.types.user_id },
      text: { type: Schema.types.string },
      ts: { type: Schema.types.string },
    },
    required: ["channel_id", "user_id", "text", "ts"],
  },
  output_parameters: {
    properties: {
      incident_id: { type: Schema.types.string },
      summary: { type: Schema.types.string },
    },
    required: ["incident_id", "summary"],
  },
});

export default SlackFunction(IntakeReportDefinition, async ({ inputs, client }) => {
  const text = inputs.text.replace(/<@[A-Z0-9]+>/g, "").trim();

  if (shouldBuildBrief(text)) {
    const result = await client.apps.datastore.query({
      datastore: "incidents",
      expression: "#channel = :channel",
      expression_attributes: { "#channel": "channel_id" },
      expression_values: { ":channel": inputs.channel_id },
    });

    const incidents = Array.isArray(result.items) ? result.items.slice(0, 5) : [];
    const lines = incidents.length
      ? incidents.map(
          (incident, index) =>
            `${index + 1}. ${incident.priority?.toUpperCase()}: ${incident.summary} (${incident.status})`,
        )
      : ["No incidents recorded yet in this Slack datastore."];

    await client.chat.postMessage({
      channel: inputs.channel_id,
      thread_ts: inputs.ts,
      text: `DIZMO Situation Brief\n${lines.join("\n")}`,
    });

    return { outputs: { incident_id: "brief", summary: "Situation brief posted" } };
  }

  const triage = triageReport(text);
  const incidentId = `inc-${Date.now()}`;
  const createdAt = new Date().toISOString();

  await client.apps.datastore.put({
    datastore: "incidents",
    item: {
      id: incidentId,
      channel_id: inputs.channel_id,
      reporter: inputs.user_id,
      raw_text: text,
      summary: triage.summary,
      location: triage.location,
      priority: triage.priority,
      status: "open",
      recommendation: triage.recommendation,
      created_at: createdAt,
    },
  });

  await client.chat.postMessage({
    channel: inputs.channel_id,
    thread_ts: inputs.ts,
    text: `DIZMO Incident Created\nPriority: ${triage.priority.toUpperCase()}\nLocation: ${triage.location}\nSummary: ${triage.summary}\nRecommended action: ${triage.recommendation}`,
  });

  return { outputs: { incident_id: incidentId, summary: triage.summary } };
});
