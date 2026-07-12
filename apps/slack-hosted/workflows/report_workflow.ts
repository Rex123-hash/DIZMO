import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { IntakeReportDefinition } from "../functions/intake_report.ts";

const ReportWorkflow = DefineWorkflow({
  callback_id: "report_workflow",
  title: "DIZMO report intake",
  description: "Creates an incident from a manual Slack workflow report.",
  input_parameters: {
    properties: {
      channel_id: { type: Schema.slack.types.channel_id },
      user_id: { type: Schema.slack.types.user_id },
      report_text: { type: Schema.types.string },
    },
    required: ["channel_id", "user_id", "report_text"],
  },
});

ReportWorkflow.addStep(IntakeReportDefinition, {
  channel_id: ReportWorkflow.inputs.channel_id,
  user_id: ReportWorkflow.inputs.user_id,
  text: ReportWorkflow.inputs.report_text,
  ts: "",
});

export default ReportWorkflow;
