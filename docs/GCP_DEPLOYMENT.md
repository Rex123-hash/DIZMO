# GCP Deployment

DIZMO can use GCP credits for hosting. The Slack sandbox remains mandatory for judging, but the backend can and should run on Cloud Run.

## Services

- `dizmo-relief-mcp`: Cloud Run HTTP service for shelter, supply, and volunteer tools.
- `dizmo-slack-app`: Cloud Run worker/service that connects to Slack through Socket Mode and exposes `/health` for Cloud Run.
- `dizmo-web`: Cloud Run service for the DIZMO dashboard/demo command console.

## Why Cloud Run

- Stable HTTPS/runtime for judges.
- Simple deployment from containers.
- Secret Manager integration.
- Cloud Logging for debugging during judging.

## Cost Note

The Slack app uses Socket Mode. For reliable judging, deploy it with:

- `--min-instances 1`
- `--no-cpu-throttling`

This consumes some GCP credits, but avoids the Slack websocket going idle.

The MCP service can stay at `min-instances 0`.

## First Deployment

From the repository root:

```powershell
.\deploy\deploy-gcp.ps1 -ProjectId atlasaccess -Region us-central1
```

This deploys only the MCP service.

To also deploy the web dashboard:

```powershell
.\deploy\deploy-gcp.ps1 -ProjectId atlasaccess -Region us-central1 -DeployWeb
```

## Deploy Slack App

Set these environment variables first:

```powershell
$env:SLACK_BOT_TOKEN = "xoxb-..."
$env:SLACK_SIGNING_SECRET = "..."
$env:SLACK_APP_TOKEN = "xapp-..."
$env:SLACK_RESPONSE_CHANNEL_ID = "C..."
```

Then deploy:

```powershell
.\deploy\deploy-gcp.ps1 -ProjectId atlasaccess -Region us-central1 -DeploySlack
```

## Slack Sandbox Still Required

After deployment:

1. Create/install the Slack app in the developer sandbox.
2. Enable Socket Mode.
3. Add slash command `/relief`.
4. Add bot scopes.
5. Install the app.
6. Invite `slackhack@salesforce.com` and `testing@devpost.com` as Member access.
7. Submit the sandbox URL on Devpost.

## Required Slack Scopes

Recommended bot scopes:

- `commands`
- `chat:write`
- `app_mentions:read`
- `channels:history`
- `groups:history`
- `im:history`
- `mpim:history`

Use the minimum scopes needed for the final demo.
