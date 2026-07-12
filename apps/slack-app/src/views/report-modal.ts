import type { ViewsOpenArguments } from "@slack/web-api";

export function buildReportModal(triggerId: string): ViewsOpenArguments {
  return {
    trigger_id: triggerId,
    view: {
      type: "modal",
      callback_id: "submit_report",
      title: {
        type: "plain_text",
        text: "DIZMO Report",
      },
      submit: {
        type: "plain_text",
        text: "Submit",
      },
      close: {
        type: "plain_text",
        text: "Cancel",
      },
      blocks: [
        {
          type: "input",
          block_id: "details",
          label: {
            type: "plain_text",
            text: "Field update",
          },
          element: {
            type: "plain_text_input",
            action_id: "text",
            multiline: true,
            placeholder: {
              type: "plain_text",
              text: "Family of 5 stranded near Ward 8 bridge checkpoint...",
            },
          },
        },
      ],
    } as const,
  };
}
