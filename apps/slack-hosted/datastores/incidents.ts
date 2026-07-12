import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export default DefineDatastore({
  name: "incidents",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string },
    channel_id: { type: Schema.slack.types.channel_id },
    reporter: { type: Schema.slack.types.user_id },
    raw_text: { type: Schema.types.string },
    summary: { type: Schema.types.string },
    location: { type: Schema.types.string },
    priority: { type: Schema.types.string },
    status: { type: Schema.types.string },
    recommendation: { type: Schema.types.string },
    created_at: { type: Schema.types.string },
  },
});
