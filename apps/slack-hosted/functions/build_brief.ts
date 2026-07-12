import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const BuildBriefDefinition = DefineFunction({
  callback_id: "build_brief",
  title: "Build situation brief",
  description: "Posts the current incident summary for a Slack response channel.",
  source_file: "functions/build_brief.ts",
  input_parameters: {
    properties: {
      channel_id: { type: Schema.slack.types.channel_id },
    },
    required: ["channel_id"],
  },
});

export default SlackFunction(BuildBriefDefinition, async ({ inputs, client }) => {
  const result = await client.apps.datastore.query({
    datastore: "incidents",
    expression: "#channel = :channel",
    expression_attributes: { "#channel": "channel_id" },
    expression_values: { ":channel": inputs.channel_id },
  });

  const incidents = Array.isArray(result.items) ? result.items.slice(0, 10) : [];
  const open = incidents.filter((incident) => incident.status !== "closed");
  const critical = open.filter((incident) => incident.priority === "critical").length;
  const high = open.filter((incident) => incident.priority === "high").length;

  const incidentLines = open.length
    ? open.map(
        (incident, index) =>
          `${index + 1}. ${incident.priority?.toUpperCase()} - ${incident.summary} - ${incident.location}`,
      )
    : ["No open incidents in the Slack datastore."];

  await client.chat.postMessage({
    channel: inputs.channel_id,
    text: `DIZMO Situation Brief\nOpen incidents: ${open.length}\nCritical: ${critical}\nHigh: ${high}\n\n${incidentLines.join("\n")}`,
  });

  return { outputs: {} };
});
