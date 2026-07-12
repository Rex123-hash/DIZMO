import { InMemoryIncidentStore, LocalSearchAdapter } from "@dizmo/core";
import { loadConfig } from "./config.js";
import { HttpReliefToolset } from "./mcp-client.js";
import { SlackChannelSearchAdapter } from "./slack-search.js";

const config = loadConfig();

export const incidentStore = new InMemoryIncidentStore();
export const searchAdapter =
  config.USE_LOCAL_SEARCH && config.ALLOW_DEMO_DATA
    ? new LocalSearchAdapter()
    : new SlackChannelSearchAdapter(config.SLACK_BOT_TOKEN, config.SLACK_RESPONSE_CHANNEL_ID);
export const reliefTools = new HttpReliefToolset(config.MCP_SERVER_URL, config.ALLOW_DEMO_DATA);
