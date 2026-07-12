import type { Trigger } from "deno-slack-api/types.ts";
import MentionWorkflow from "../workflows/mention_workflow.ts";

const trigger: Trigger<typeof MentionWorkflow.definition> = {
  type: "event",
  name: "DIZMO response-ops mention listener",
  description: "Runs DIZMO when mentioned in #response-ops.",
  workflow: "#/workflows/mention_workflow",
  event: {
    event_type: "slack#/events/app_mentioned",
    channel_ids: ["C0BHMNU8PB2"],
  },
  inputs: {
    channel_id: { value: "{{data.channel_id}}" },
    user_id: { value: "{{data.user_id}}" },
    text: { value: "{{data.text}}" },
    ts: { value: "{{data.event_ts}}" },
  },
};

export default trigger;
