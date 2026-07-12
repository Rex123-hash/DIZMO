import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { IntakeReportDefinition } from "../functions/intake_report.ts";

const MentionWorkflow = DefineWorkflow({
  callback_id: "mention_workflow",
  title: "DIZMO mention intake",
  description: "Handles @DIZMO mentions in the response channel.",
  input_parameters: {
    properties: {
      channel_id: { type: Schema.slack.types.channel_id },
      user_id: { type: Schema.slack.types.user_id },
      text: { type: Schema.types.string },
      ts: { type: Schema.types.string },
    },
    required: ["channel_id", "user_id", "text", "ts"],
  },
});

MentionWorkflow.addStep(IntakeReportDefinition, {
  channel_id: MentionWorkflow.inputs.channel_id,
  user_id: MentionWorkflow.inputs.user_id,
  text: MentionWorkflow.inputs.text,
  ts: MentionWorkflow.inputs.ts,
});

export default MentionWorkflow;
