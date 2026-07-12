import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export default DefineDatastore({
  name: "tasks",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string },
    incident_id: { type: Schema.types.string },
    channel_id: { type: Schema.slack.types.channel_id },
    title: { type: Schema.types.string },
    owner: { type: Schema.types.string },
    priority: { type: Schema.types.string },
    status: { type: Schema.types.string },
    created_at: { type: Schema.types.string },
  },
});
