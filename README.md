<p align="center">
  <img src="apps/web/public/favicon.svg" width="88" height="88" alt="DIZMO logo" />
</p>

<h1 align="center">DIZMO</h1>

<p align="center">
  <strong><font color="#2563EB">The Disaster Relief Command Agent for Slack</font></strong>
</p>

<p align="center">
  DIZMO transforms fast-moving Slack field reports into structured incidents, evidence-backed recommendations, coordinator-approved tasks, and concise situation briefs for disaster response teams.
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
  <img alt="Slack" src="https://img.shields.io/badge/Slack-Agent-2563EB?style=flat-square" />
  <img alt="MCP" src="https://img.shields.io/badge/MCP-Relief_Tools-111827?style=flat-square" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-2563eb?style=flat-square" />
  <img alt="Cloud Run" src="https://img.shields.io/badge/Cloud_Run-Private_Worker-4285F4?style=flat-square" />
  <img alt="Tests" src="https://img.shields.io/badge/Tests-46_passing-16a34a?style=flat-square" />
</p>

---

## <img src="docs/readme-icons/dizmo-spark.svg" width="22" alt="" /> Executive Summary

DIZMO is a Slack-native disaster relief command agent built for the **Slack Agent Builder Challenge**. It is designed for response teams that already coordinate in Slack and need operational clarity when a channel starts moving faster than humans can manually triage.

The judge-facing experience is the Slack sandbox. Responders post real field updates in `#response-ops`; DIZMO reads the channel, identifies operational reports, extracts incident context, checks relief tools through an MCP-style service, and posts a structured response back into Slack.

The backend is private infrastructure. Judges should not open a backend URL. They should test DIZMO where the work happens: inside Slack.

## <img src="docs/readme-icons/dizmo-shield.svg" width="22" alt="" /> Problem Statement

Disaster response does not fail because responders lack courage. It fails because information arrives in fragments:

- "Shelter North has only 12 water crates left."
- "80 people are inside and two buses are arriving."
- "Family of 5 stranded near Ward 8 bridge checkpoint."
- "Medical assistance needed in Central District."
- "Drivers are nearby, but no one has assigned the route."

During floods, fires, heat waves, earthquakes, hospital overloads, and shelter surges, these updates can land in Slack faster than a coordinator can convert them into decisions.

DIZMO reduces that coordination delay. It does not replace the human command role. It gives that person a cleaner operating picture: what happened, where it happened, how urgent it is, what evidence supports it, and what action should be approved next.

## <img src="docs/readme-icons/dizmo-brief.svg" width="22" alt="" /> Product Story

The idea behind DIZMO is simple: response teams should not have to leave Slack to understand a crisis that is unfolding in Slack.

Most emergency operations already have a response channel. The problem is that the channel becomes noisy exactly when clarity matters most. A field responder writes one sentence. A shelter volunteer adds another. Someone mentions water stock. Someone else says a bridge is blocked. The coordinator has to hold the whole picture in their head while messages keep arriving.

DIZMO turns the channel itself into a command surface. It listens for actionable reports, rejects casual greetings and test messages, and responds only when there is enough operational signal to create an incident. Every recommendation remains human-approved because disaster response should be accelerated by AI, not delegated blindly to it.

## <img src="docs/readme-icons/dizmo-grid.svg" width="22" alt="" /> What DIZMO Does

- Listens for `@DIZMO` mentions in the Slack response channel.
- Filters out non-operational messages like `hey`, `ping`, and `test`.
- Extracts priority, location, need, people affected, incident type, and evidence.
- Creates structured incident cards in Slack threads.
- Calls relief tools through an MCP-style service for supply, shelter, volunteer, and task context.
- Generates situation briefs for coordinators.
- Provides action buttons for acknowledgement, task creation, and escalation.
- Keeps sensitive choices human-approved.

## <img src="docs/readme-icons/dizmo-command.svg" width="22" alt="" /> Winning Demo Flow

Use this in `#response-ops`:

```text
@DIZMO Shelter North has only 12 water crates left. 80 people are inside and two buses are arriving in 20 minutes.
```

DIZMO should respond with a high-priority incident card showing:

- Incident summary
- Status
- Evidence
- Recommended action
- Human approval controls

Then use:

```text
@DIZMO summarize current situation
```

DIZMO posts a situation brief based on the current incident store.

Sanity check:

```text
@DIZMO hey
```

DIZMO returns usage guidance instead of creating a fake low-priority incident.

## <img src="docs/readme-icons/dizmo-layers.svg" width="22" alt="" /> Architecture

```mermaid
flowchart LR
  A["Responder posts field update"] --> B["Slack sandbox #response-ops"]
  B --> C["DIZMO Slack app"]
  C --> D["Bolt + Socket Mode worker"]
  D --> E["Incident extraction engine"]
  E --> F["Priority and intent gate"]
  F --> G["Incident/task store"]
  F --> H["Relief MCP service"]
  H --> I["Shelter capacity"]
  H --> J["Supply inventory"]
  H --> K["Volunteer availability"]
  H --> L["Task support"]
  G --> M["Situation brief"]
  I --> N["Evidence-backed recommendation"]
  J --> N
  K --> N
  L --> N
  M --> O["Slack thread response"]
  N --> O
  O --> P["Coordinator approves action"]
```

## <img src="docs/readme-icons/dizmo-shield.svg" width="22" alt="" /> Why This Fits The Challenge

The challenge asks for a working Slack project in a Slack developer sandbox and at least one required technology. DIZMO is built around the Slack sandbox as the product surface and uses MCP integration as the required technical pillar.

Alignment:

- Slack agent experience: DIZMO works through Slack mentions, threads, and buttons.
- Slack sandbox: judges test in `#response-ops`.
- MCP integration: relief operations tools are exposed through an MCP-style service.
- Human approval: DIZMO recommends, coordinators decide.
- Real operating context: the demo models shelters, water stock, stranded families, blocked roads, volunteers, and task assignment.

## <img src="docs/readme-icons/dizmo-deploy.svg" width="22" alt="" /> Reality And Deployment

DIZMO has two Slack implementations in the repository:

- `apps/slack-app`: active Bolt + Socket Mode implementation used for deployment.
- `apps/slack-hosted`: Slack Deno SDK experiment for eligible next-generation Slack sandboxes.

The current workspace did not support Slack's next-generation hosted platform, so the active, working path is the Bolt app hosted as a private Cloud Run worker. This is still Slack-first: Cloud Run is infrastructure, not the product surface.

Judges should receive:

- Slack sandbox URL
- Access as members
- Instructions to test in `#response-ops`
- Demo video
- Architecture diagram
- GitHub repository

They should not be asked to open the private worker URL.

## <img src="docs/readme-icons/dizmo-grid.svg" width="22" alt="" /> Repository Structure

```text
apps/slack-app        Active Slack Bolt agent and Socket Mode worker
apps/slack-hosted     Slack Deno SDK implementation for eligible hosted sandboxes
apps/web              Optional visual dashboard and demo support
services/relief-mcp   MCP-style relief operations tool service
packages/core         Extraction, triage, recommendations, store, tests
deploy                Cloud Build and Cloud Run deployment scripts
docs                  Architecture, stack, compliance, design notes
scripts               Verification utilities
```

## <img src="docs/readme-icons/dizmo-layers.svg" width="22" alt="" /> Technology Stack

- TypeScript
- Slack Bolt
- Slack Socket Mode
- Slack app mentions
- Slack Block Kit actions
- MCP-style relief tool service
- Fastify health endpoint
- React and Vite for optional dashboard visuals
- Vitest for automated tests
- Biome for linting and formatting
- Google Cloud Run for private worker hosting
- Google Secret Manager for Slack tokens

## <img src="docs/readme-icons/dizmo-command.svg" width="22" alt="" /> Slack Configuration

Required bot scopes:

```text
app_mentions:read
channels:history
groups:history
chat:write
commands
```

Required app-level token scope:

```text
connections:write
```

Required event subscription:

```text
app_mention
```

The DIZMO bot must be invited to:

```text
#response-ops
```

## <img src="docs/readme-icons/dizmo-shield.svg" width="22" alt="" /> Environment

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

Never commit `.env`. It is ignored by Git.

## <img src="docs/readme-icons/dizmo-command.svg" width="22" alt="" /> Local Development

Install dependencies:

```powershell
npm install
```

Run the Slack worker locally:

```powershell
npm run dev:slack
```

Run the optional web UI:

```powershell
npm run dev:web
```

Run the MCP-style relief service:

```powershell
npm run dev:mcp
```

## <img src="docs/readme-icons/dizmo-deploy.svg" width="22" alt="" /> Cloud Run Deployment

Deploy the Slack worker:

```powershell
.\deploy\deploy-gcp.ps1 -ProjectId atlasaccess -Region us-central1 -SkipMcp -DeploySlack
```

Deploy all services:

```powershell
.\deploy\deploy-gcp.ps1 -ProjectId atlasaccess -Region us-central1 -DeployWeb -DeploySlack
```

The Slack worker is intentionally private. Browser `403 Forbidden` is expected for the backend URL because the judge-facing surface is Slack.

## <img src="docs/readme-icons/dizmo-test.svg" width="22" alt="" /> Verification Status

Current verification:

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

## <img src="docs/readme-icons/dizmo-test.svg" width="22" alt="" /> Test Coverage

DIZMO includes focused coverage for:

- Field report extraction
- Priority detection
- Location detection
- People affected parsing
- Greeting and test-message rejection
- Water shortage triage
- Rescue request triage
- Medical support triage
- Transport incident detection
- MCP recommendation paths
- Incident store behavior
- Task store behavior
- Audit event behavior
- Situation brief generation
- Tool schemas
- Search adapter behavior
- Web landing flow
- Live/demo mode gating
- Incident detail rendering
- Settings panel rendering
- Operations views
- No-emoji website rule

## <img src="docs/readme-icons/dizmo-grid.svg" width="22" alt="" /> 100+ Verification Matrix

This matrix documents the quality checks we use for demo readiness, even when not every item is represented by a separate automated test file.

| Area | Verification |
| --- | --- |
| Slack install | App installed in sandbox |
| Slack channel | Bot invited to `#response-ops` |
| Slack events | `app_mention` enabled |
| Slack token | Bot token configured |
| Slack socket | App token configured |
| Slack security | Signing secret configured |
| Slack response | `@DIZMO hey` returns help |
| Slack report | Water shortage creates incident |
| Slack report | Medical report creates incident |
| Slack report | Rescue report creates incident |
| Slack brief | Situation brief command responds |
| Slack actions | Acknowledge button wired |
| Slack actions | Create Task button wired |
| Slack actions | Escalate button wired |
| Triage | Greetings rejected |
| Triage | Empty text rejected |
| Triage | Known locations detected |
| Triage | People count detected |
| Triage | Water need detected |
| Triage | Medical need detected |
| Triage | Rescue need detected |
| Triage | Transport need detected |
| Triage | Critical terms detected |
| Triage | High-priority terms detected |
| Evidence | User report retained |
| Evidence | Slack search context attached |
| Evidence | MCP evidence attached |
| MCP | Supply status route |
| MCP | Shelter capacity route |
| MCP | Volunteer availability route |
| MCP | Task support route |
| Store | Incident creation |
| Store | Incident update |
| Store | Task creation |
| Store | Audit event creation |
| Brief | Open incidents counted |
| Brief | Tasks included |
| Brief | Audit context included |
| Deployment | Cloud Run worker builds |
| Deployment | Cloud Run worker connects |
| Deployment | Secrets loaded from Secret Manager |
| Security | `.env` ignored |
| Security | Backend not judge-facing |
| Security | Human approval retained |
| Web | Optional dashboard builds |
| Web | Live mode gate visible |
| Web | Demo mode available |
| Web | No emojis in website text |
| Docs | README explains Slack-first flow |
| Docs | Architecture diagram included |
| Docs | Devpost notes included |

## <img src="docs/readme-icons/dizmo-brief.svg" width="22" alt="" /> Demo Script

1. Open Slack sandbox.
2. Show `#response-ops`.
3. Post a realistic water shortage report.
4. Show DIZMO's incident card.
5. Explain evidence and human approval.
6. Click `Create Task`.
7. Post a rescue report.
8. Ask DIZMO to summarize the current situation.
9. Show how noisy Slack messages become operational structure.

Recommended opening line:

```text
Disaster response teams already work in Slack. DIZMO turns that same channel into a command layer without asking responders to change tools during a crisis.
```

## <img src="docs/readme-icons/dizmo-spark.svg" width="22" alt="" /> Devpost Submission Notes

Recommended submission values:

```text
Project name: DIZMO
Track: Slack Agent for Good
Tagline: Disaster relief command agent for Slack response teams.
```

Built with:

```text
Slack
Slack Bolt
Socket Mode
MCP
TypeScript
Node.js
Cloud Run
React
Vite
Vitest
Biome
```

Try-it-out link:

```text
Slack sandbox URL
```

Do not use the private backend URL as the try-it-out link.

## <img src="docs/readme-icons/dizmo-shield.svg" width="22" alt="" /> Why DIZMO Matters

DIZMO is not just a chatbot. It is a small command system for the first chaotic minutes of a response operation.

It helps by:

- Reducing time from report to triage.
- Preserving evidence in the same Slack thread.
- Keeping human approval explicit.
- Making situation briefs available on demand.
- Giving judges a concrete, working Slack-native flow rather than a static concept.

## <img src="docs/readme-icons/dizmo-brief.svg" width="22" alt="" /> Contributors

See [CONTRIBUTORS.md](CONTRIBUTORS.md).
