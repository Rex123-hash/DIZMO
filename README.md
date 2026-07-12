<p align="center">
  <img src="apps/web/public/favicon.svg" width="76" height="76" alt="DIZMO logo" />
</p>

<h1 align="center">DIZMO</h1>

<p align="center">
  <strong>The Disaster Relief Command Agent for Slack</strong>
</p>

<p align="center">
  DIZMO turns chaotic Slack field reports into structured incidents, situation briefs, evidence-backed recommendations, and human-approved response tasks.
</p>

<p align="center">
  <a href="docs/ARCHITECTURE.md">Architecture</a>
  &nbsp;|&nbsp;
  <a href="docs/SUBMISSION_COMPLIANCE.md">Submission Compliance</a>
  &nbsp;|&nbsp;
  <a href="docs/REALITY_STATUS.md">Reality Status</a>
  &nbsp;|&nbsp;
  <a href="CONTRIBUTORS.md">Contributors</a>
</p>

<p align="center">
  <img alt="Slack" src="https://img.shields.io/badge/Slack-Agent-4A154B?style=flat-square" />
  <img alt="MCP" src="https://img.shields.io/badge/MCP-Relief_Tools-111827?style=flat-square" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-2563eb?style=flat-square" />
  <img alt="Cloud Run" src="https://img.shields.io/badge/Cloud_Run-Private_Worker-4285F4?style=flat-square" />
  <img alt="Tests" src="https://img.shields.io/badge/Tests-46_passing-16a34a?style=flat-square" />
</p>

## Overview

DIZMO is built for the **Slack Agent Builder Challenge** as a disaster response command agent for relief teams. The product surface is Slack: responders post field updates in `#response-ops`, coordinators review recommendations in threads, and DIZMO keeps the response picture structured without forcing teams into a separate dashboard during an emergency.

The backend runs as a private Slack worker and MCP tool service. Judges should test DIZMO in the Slack sandbox, not by opening backend URLs.

## Problem Statement

Disaster operations fail when information arrives faster than teams can structure it.

During floods, fires, hospital overloads, heat waves, and shelter surges, responders send fragments like:

- Shelter North has only 12 water crates left.
- 80 people are inside and two buses are arriving.
- A family is stranded near Ward 8 bridge.
- Medical support is needed in Central District.
- Drivers are nearby, but no one has assigned the route.

Slack is already where teams coordinate, but during a crisis the channel becomes noisy. DIZMO turns those messages into a live operational layer: incidents, priorities, evidence, recommended actions, and situation briefs.

## What DIZMO Does

- Listens for `@DIZMO` mentions in the Slack response channel.
- Rejects greetings and test messages so it does not create fake incidents.
- Extracts location, affected people, need, priority, and incident type from real field reports.
- Posts structured incident cards back into Slack threads.
- Shows evidence and recommended action before any operational decision.
- Provides human approval controls: acknowledge, create task, escalate.
- Generates situation briefs from the active incident store.
- Uses an MCP relief tool service for operational context such as supplies, shelters, volunteers, and task support.

## Demo Flow

Use this in `#response-ops`:

```text
@DIZMO Shelter North has only 12 water crates left. 80 people are inside and two buses are arriving in 20 minutes.
```

DIZMO creates a high-priority water incident with evidence and a coordinator-approved dispatch recommendation.

Then:

```text
@DIZMO summarize current situation
```

DIZMO posts a situation brief for the response channel.

For sanity checking:

```text
@DIZMO hey
```

DIZMO returns help text instead of polluting the incident list.

## Architecture

```mermaid
flowchart LR
  A["Field responder in Slack"] --> B["#response-ops"]
  B --> C["DIZMO Slack app (Bolt + Socket Mode)"]
  C --> D["Incident extraction and priority engine"]
  D --> E["In-memory incident/task store"]
  D --> F["Relief MCP service"]
  F --> G["Shelter, supply, volunteer, task tools"]
  E --> H["Situation brief"]
  G --> I["Evidence-backed recommendation"]
  H --> J["Slack thread response"]
  I --> J
  J --> K["Coordinator approves action"]
```

## Why This Fits The Challenge

The challenge asks for a working Slack agent in the Slack developer sandbox and at least one required technology. DIZMO uses:

- **Slack app / agent surface**: all judging interaction happens in the Slack sandbox.
- **MCP server integration**: DIZMO calls relief operations tools through the MCP-style relief service.
- **Human-in-the-loop actions**: DIZMO recommends; coordinators decide.

The Cloud Run URL is not the product. It is private infrastructure for keeping the Slack worker alive.

## Repository Structure

```text
apps/slack-app        Slack Bolt agent used for the active deployment
services/relief-mcp   Relief operations MCP-style tool service
packages/core         Incident extraction, triage, recommendations, tests
apps/web              Optional dashboard and visual demo support
apps/slack-hosted     Experimental Slack Deno SDK version for eligible sandboxes
docs                  Architecture, stack, compliance, design notes
deploy                Cloud Run build and deploy scripts
```

## Stack

- TypeScript
- Slack Bolt
- Slack Socket Mode
- MCP-style relief tool service
- Fastify health endpoint
- React and Vite for optional dashboard visuals
- Vitest for core and UI tests
- Biome for linting and formatting
- Google Cloud Run for private worker hosting

## Setup

Create `.env` from `.env.example`:

```env
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-socket-mode-token
SLACK_RESPONSE_CHANNEL_ID=C0BHMNU8PB2
MCP_SERVER_URL=https://your-relief-mcp-service
USE_LOCAL_SEARCH=false
LIVE_DATA_ONLY=true
ALLOW_DEMO_DATA=false
PORT=3000
```

Install dependencies:

```powershell
npm install
```

Run locally:

```powershell
npm run dev:slack
```

## Slack Configuration

Required bot scopes:

```text
app_mentions:read
channels:history
groups:history
chat:write
commands
```

Socket Mode:

```text
connections:write
```

Event subscription:

```text
app_mention
```

The bot must be invited to `#response-ops`.

## Deploy

Deploy the Slack worker:

```powershell
.\deploy\deploy-gcp.ps1 -ProjectId atlasaccess -Region us-central1 -SkipMcp -DeploySlack
```

Deploy everything when needed:

```powershell
.\deploy\deploy-gcp.ps1 -ProjectId atlasaccess -Region us-central1 -DeployWeb -DeploySlack
```

## Verification

Current verification status:

```text
lint: passed
typecheck: passed
tests: 46 passed
Slack worker: deployed and connected
```

Commands:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

## Test Coverage

DIZMO includes coverage for:

- Field report extraction
- Priority detection
- Location detection
- People affected parsing
- Greeting/test-message rejection
- MCP recommendation paths
- Incident store behavior
- Situation brief generation
- Tool schemas
- Web UI interaction surfaces
- No-emoji website rule

## Submission Notes

Use the Slack sandbox as the “try it out” surface. Add judges as members to the Slack workspace and direct them to `#response-ops`.

Devpost should include:

- Project name: `DIZMO`
- Track: `Slack Agent for Good`
- Sandbox URL
- GitHub repo
- Architecture diagram
- Public demo video under 3 minutes
- Built with tags including Slack, Bolt, MCP, TypeScript, Cloud Run

## Contributors

See [CONTRIBUTORS.md](CONTRIBUTORS.md).
