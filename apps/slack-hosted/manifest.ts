import { Manifest } from "deno-slack-sdk/mod.ts";
import IncidentDatastore from "./datastores/incidents.ts";
import TaskDatastore from "./datastores/tasks.ts";
import { BuildBriefDefinition } from "./functions/build_brief.ts";
import { CreateTaskDefinition } from "./functions/create_task.ts";
import { IntakeReportDefinition } from "./functions/intake_report.ts";
import BriefWorkflow from "./workflows/brief_workflow.ts";
import MentionWorkflow from "./workflows/mention_workflow.ts";
import ReportWorkflow from "./workflows/report_workflow.ts";

export default Manifest({
  name: "DIZMO",
  displayName: "DIZMO",
  description:
    "Slack-hosted disaster relief command agent for live field reports, briefs, and task routing.",
  longDescription:
    "DIZMO runs inside the Slack sandbox using Slack-hosted workflows and datastores. It turns channel reports into structured incidents, generates situation briefs, and creates coordinator-approved response tasks without a separate Cloud Run backend.",
  icon: "assets/dizmo-icon.png",
  backgroundColor: "#2563eb",
  datastores: [IncidentDatastore, TaskDatastore],
  functions: [IntakeReportDefinition, BuildBriefDefinition, CreateTaskDefinition],
  workflows: [MentionWorkflow, ReportWorkflow, BriefWorkflow],
  botScopes: [
    "app_mentions:read",
    "channels:history",
    "channels:read",
    "chat:write",
    "commands",
    "datastore:read",
    "datastore:write",
    "groups:history",
    "groups:read",
  ],
});
