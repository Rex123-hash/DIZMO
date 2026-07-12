import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { BuildBriefDefinition } from "../functions/build_brief.ts";

const BriefWorkflow = DefineWorkflow({
  callback_id: "brief_workflow",
  title: "DIZMO situation brief",
  description: "Posts a situation brief for the response channel.",
  input_parameters: {
    properties: {
      channel_id: { type: Schema.slack.types.channel_id },
    },
    required: ["channel_id"],
  },
});

BriefWorkflow.addStep(BuildBriefDefinition, {
  channel_id: BriefWorkflow.inputs.channel_id,
});

export default BriefWorkflow;
