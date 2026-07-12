import { shouldIntakeFieldReport } from "@dizmo/core";
import { App } from "@slack/bolt";
import Fastify from "fastify";
import { loadConfig } from "./config.js";
import { buildIncidentBlocks, buildTaskBlocks } from "./slack/blocks.js";
import { buildReportModal } from "./views/report-modal.js";
import {
  acknowledgeIncident,
  buildBrief,
  createTaskForIncident,
  demoEvents,
  escalateIncident,
  intakeReport,
} from "./workflows.js";

const config = loadConfig();
const mentionHelpText =
  "DIZMO is online. Send a field report like `@DIZMO Shelter North has only 12 water crates left and 80 people inside`, or ask `@DIZMO summarize current situation`.";

const app = new App({
  token: config.SLACK_BOT_TOKEN,
  signingSecret: config.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: config.SLACK_APP_TOKEN,
});

const health = Fastify({ logger: false });

health.get("/health", async () => ({
  ok: true,
  service: "dizmo-slack-app",
  mode: "socket",
}));

app.command("/relief", async ({ ack, command, client, respond }) => {
  await ack();

  const [subcommand] = command.text.trim().split(/\s+/);

  if (subcommand === "report") {
    await client.views.open(buildReportModal(command.trigger_id));
    return;
  }

  if (subcommand === "brief") {
    await respond({
      response_type: "in_channel",
      text: buildBrief(),
    });
    return;
  }

  if (subcommand === "simulate") {
    if (config.LIVE_DATA_ONLY && !config.ALLOW_DEMO_DATA) {
      await respond({
        response_type: "ephemeral",
        text: "Simulation is disabled in live-data-only mode. Use `/relief report` with real sandbox updates.",
      });
      return;
    }

    const channel = config.SLACK_RESPONSE_CHANNEL_ID || command.channel_id;
    const events = demoEvents(channel, command.user_id);

    await client.chat.postMessage({
      channel,
      text: "DIZMO simulation started: flood response command channel is receiving field updates.",
    });

    for (const event of events) {
      if (event.kind === "context") {
        await client.chat.postMessage({
          channel,
          text: event.text,
        });
        continue;
      }

      if (!event.report) {
        continue;
      }

      await client.chat.postMessage({
        channel,
        text: event.text,
      });

      const { incident, action } = await intakeReport(event.report);
      await client.chat.postMessage({
        channel,
        text: `${incident.priority.toUpperCase()}: ${incident.summary}`,
        blocks: buildIncidentBlocks(incident, action),
      });
    }

    await client.chat.postMessage({
      channel,
      text: buildBrief(),
    });

    await respond({
      response_type: "ephemeral",
      text: "DIZMO simulation posted context, incident cards, and a situation brief.",
    });
    return;
  }

  await respond({
    response_type: "ephemeral",
    text: "Try `/relief report`, `/relief simulate`, or `/relief brief`.",
  });
});

app.event("app_mention", async ({ event, client }) => {
  const text = event.text.replace(/<@[A-Z0-9]+>/g, "").trim();
  const normalized = text.toLowerCase();

  if (
    normalized.includes("summarize") ||
    normalized.includes("brief") ||
    normalized.includes("status") ||
    normalized.includes("current situation")
  ) {
    await client.chat.postMessage({
      channel: event.channel,
      thread_ts: event.ts,
      text: buildBrief(),
    });
    return;
  }

  if (!text || !shouldIntakeFieldReport(text)) {
    await client.chat.postMessage({
      channel: event.channel,
      thread_ts: event.ts,
      text: mentionHelpText,
    });
    return;
  }

  const { incident, action } = await intakeReport({
    id: `mention-${event.ts}`,
    channelId: event.channel,
    rawText: text,
    reporter: event.user ?? "slack-user",
    createdAt: new Date(Number(event.event_ts.split(".")[0]) * 1000).toISOString(),
  });

  await client.chat.postMessage({
    channel: event.channel,
    thread_ts: event.ts,
    text: `${incident.priority.toUpperCase()}: ${incident.summary}`,
    blocks: buildIncidentBlocks(incident, action),
  });
});

app.view("submit_report", async ({ ack, body, view, client }) => {
  await ack();

  const textInput = view.state.values.details?.text;
  const rawText =
    textInput?.type === "plain_text_input" && typeof textInput.value === "string"
      ? textInput.value
      : "";

  const report = {
    id: `report-${Date.now()}`,
    channelId: config.SLACK_RESPONSE_CHANNEL_ID,
    rawText,
    reporter: body.user.id,
    createdAt: new Date().toISOString(),
  };

  const { incident, action } = await intakeReport(report);

  await client.chat.postMessage({
    channel: config.SLACK_RESPONSE_CHANNEL_ID,
    text: `${incident.priority.toUpperCase()}: ${incident.summary}`,
    blocks: buildIncidentBlocks(incident, action),
  });
});

app.action("ack_incident", async ({ ack, body, client, action }) => {
  await ack();

  if (action.type !== "button" || !action.value) {
    return;
  }

  const incident = acknowledgeIncident(action.value, userFromBody(body));
  const channel = channelFromBody(body);

  if (incident && channel) {
    await client.chat.postMessage({
      channel,
      text: `DIZMO acknowledged ${incident.location}.`,
    });
  }
});

app.action("create_task", async ({ ack, body, client, action }) => {
  await ack();

  if (action.type !== "button" || !action.value) {
    return;
  }

  const task = createTaskForIncident(action.value, userFromBody(body));
  const channel = channelFromBody(body);

  if (task && channel) {
    await client.chat.postMessage({
      channel,
      text: `Task created: ${task.title}`,
      blocks: buildTaskBlocks(task),
    });
  }
});

app.action("escalate_incident", async ({ ack, body, client, action }) => {
  await ack();

  if (action.type !== "button" || !action.value) {
    return;
  }

  const incident = escalateIncident(action.value, userFromBody(body));
  const channel = channelFromBody(body);

  if (incident && channel) {
    await client.chat.postMessage({
      channel,
      text: `DIZMO escalated ${incident.location} to CRITICAL.`,
    });
  }
});

await health.listen({ port: config.PORT, host: "0.0.0.0" });
await app.start();
console.log(`DIZMO Slack app is connected to Slack and serving health on port ${config.PORT}`);

function channelFromBody(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null || !("channel" in body)) {
    return undefined;
  }

  const channel = (body as { channel?: { id?: string } }).channel;
  return channel?.id;
}

function userFromBody(body: unknown): string {
  if (typeof body !== "object" || body === null || !("user" in body)) {
    return "coordinator";
  }

  const user = (body as { user?: { id?: string; username?: string } }).user;
  return user?.username ?? user?.id ?? "coordinator";
}
