# DIZMO Slack-Hosted App

DIZMO is now positioned as a Slack sandbox app, not a Cloud Run web product.

This app is designed for Slack's Deno SDK and Run On Slack Infrastructure:

- `manifest.ts` declares the Slack app, scopes, datastores, functions, and workflows.
- `datastores/` stores incidents and tasks inside Slack-hosted storage.
- `functions/` contains the command-agent logic that runs on Slack infrastructure.
- `workflows/` defines mention intake, manual report intake, and situation brief generation.
- `triggers/` binds the app to `#response-ops` using channel ID `C0BHMNU8PB2`.

## Deploy

Install the Slack CLI, then run:

```powershell
cd "E:\slzack agent\apps\slack-hosted"
slack login
slack deploy
slack trigger create --trigger-def triggers\mention_response_ops.ts
slack trigger create --trigger-def triggers\brief_shortcut.ts
```

## Judge Surface

Judges should be invited to the Slack sandbox as members and test DIZMO inside `#response-ops`.

They should not open a Cloud Run backend URL.
