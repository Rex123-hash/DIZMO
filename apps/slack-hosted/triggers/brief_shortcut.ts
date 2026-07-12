import type { Trigger } from "deno-slack-api/types.ts";
import BriefWorkflow from "../workflows/brief_workflow.ts";

const trigger: Trigger<typeof BriefWorkflow.definition> = {
  type: "shortcut",
  name: "DIZMO situation brief",
  description: "Post the current response brief in #response-ops.",
  workflow: "#/workflows/brief_workflow",
  inputs: {
    channel_id: { value: "C0BHMNU8PB2" },
  },
};

export default trigger;
