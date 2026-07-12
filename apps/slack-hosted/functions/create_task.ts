import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const CreateTaskDefinition = DefineFunction({
  callback_id: "create_task",
  title: "Create response task",
  description: "Creates a Slack-hosted response task tied to an incident.",
  source_file: "functions/create_task.ts",
  input_parameters: {
    properties: {
      channel_id: { type: Schema.slack.types.channel_id },
      incident_id: { type: Schema.types.string },
      title: { type: Schema.types.string },
      owner: { type: Schema.types.string },
      priority: { type: Schema.types.string },
    },
    required: ["channel_id", "incident_id", "title", "owner", "priority"],
  },
});

export default SlackFunction(CreateTaskDefinition, async ({ inputs, client }) => {
  const taskId = `task-${Date.now()}`;
  await client.apps.datastore.put({
    datastore: "tasks",
    item: {
      id: taskId,
      incident_id: inputs.incident_id,
      channel_id: inputs.channel_id,
      title: inputs.title,
      owner: inputs.owner,
      priority: inputs.priority,
      status: "open",
      created_at: new Date().toISOString(),
    },
  });

  await client.chat.postMessage({
    channel: inputs.channel_id,
    text: `DIZMO Task Created\n${inputs.title}\nOwner: ${inputs.owner}\nPriority: ${inputs.priority}`,
  });

  return { outputs: {} };
});
