# Stack Decision: DIZMO

## Project Positioning

Build **DIZMO**, the Disaster Intelligence Zone Management Operator: a Slack-native crisis coordination agent for disaster response teams. The agent turns scattered Slack messages, field reports, shelter updates, and supply inventory into prioritized actions that a human coordinator can approve.

Target track: **Slack Agent for Good**

Why this track:

- Strong social impact story.
- Lower submission risk than Slack Agent for Organizations.
- Does not require Slack Marketplace submission or five active workspaces.
- Lets the demo focus on product quality, agent behavior, and real-world usefulness.

## Recommended Stack

### Slack App Layer

- **Slack Bolt for JavaScript/TypeScript**
- **Slack CLI**
- **Socket Mode for local development**
- **Events API, slash commands, modals, and interactive buttons**

Why:

- Fastest path to a working Slack demo.
- Strong support for commands, actions, message events, and workflow-style interactions.
- Easy to deploy as a Node service.
- TypeScript keeps the implementation credible for judging.

Core Slack surfaces:

- `/relief status`
- `/relief report`
- `/relief brief`
- `/relief simulate`
- App mentions in crisis channels
- Interactive buttons: `Acknowledge`, `Assign`, `Escalate`, `Create Task`, `Resolve`
- Modals for structured field reports
- Threaded incident updates

### Agent Orchestration Layer

- **TypeScript service**
- **OpenAI or Google Gemini as the LLM provider**
- **Tool-calling style orchestration**
- **Rule-based safety gates before posting or assigning work**

Why:

- Keeps the demo deterministic enough to trust.
- Lets us show real agentic behavior without letting the model make unsafe decisions unchecked.
- Easy to switch providers if credits or API access changes.

Suggested model usage:

- Small/fast model for classification and routing.
- Stronger model for incident brief generation and multi-source reasoning.

### Required Hackathon Technologies

Use at least two, ideally all three:

1. **Slack AI capabilities**
   - Summarize incident channels.
   - Draft operational briefs.
   - Convert messy field reports into structured incident records.

2. **MCP server integration**
   - Expose tools for shelter capacity, supply inventory, weather alerts, geocoding, and volunteer availability.
   - Keep this as a local/custom MCP server for the hackathon demo.

3. **Real-Time Search API**
   - Search recent Slack messages, files, and channel context for relevant reports.
   - Use it to answer: "What changed in the last 30 minutes?" and "Which shelters are at risk?"

If API access is limited, implement the interface and demo with a local search adapter that can be swapped for Slack RTS.

### Backend API

- **Node.js + TypeScript**
- **Fastify or Express**
- **Zod for input validation**
- **Prisma for database access**

Recommended: **Fastify**

Why:

- Lightweight.
- Good TypeScript support.
- Clean request lifecycle.
- Easy to deploy on Cloud Run.

### Database

Recommended for GCP credits: **Cloud SQL PostgreSQL**

Alternative for faster MVP: **SQLite locally + Prisma**, then Cloud SQL later.

Tables:

- `incidents`
- `reports`
- `shelters`
- `supplies`
- `volunteers`
- `tasks`
- `agent_decisions`
- `audit_log`

Why:

- Postgres is credible and easy to explain.
- Judges can understand the architecture quickly.
- Audit log helps with trust and safety.

### Cache / Queue

MVP:

- In-process job runner
- Scheduled polling

Upgrade:

- **Google Cloud Tasks**
- **Pub/Sub**
- **Memorystore Redis**

Use only if needed. The demo does not require a complex queue.

### Deployment

Recommended:

- **Google Cloud Run**
- **Secret Manager**
- **Cloud SQL**
- **Cloud Logging**

Why:

- Good use of GCP credits.
- Simple production URL for Slack request handling.
- Scales to zero.
- Strong story for architecture.

Local development:

- Socket Mode
- `.env`
- SQLite or local Postgres

### External Data Sources

Demo-safe sources:

- Seeded shelter inventory JSON/CSV
- Seeded volunteer roster
- Seeded supply stock levels
- Mock disaster event feed
- Weather API adapter if time allows

Optional real integrations:

- OpenWeather
- Google Maps / Geocoding
- Google Sheets for supply inventory
- Twilio for SMS escalation

For the hackathon, prioritize reliable seeded data plus one real external source.

## Why This Stack Can Win

This stack gives us:

- A real Slack agent, not a generic chatbot.
- A visible multi-step workflow inside Slack.
- A credible MCP story.
- A believable data architecture.
- A deployable cloud backend.
- A demo that can run even if external APIs fail.

## What Not To Build

Avoid:

- A generic dashboard-first app.
- A pure chatbot with no actions.
- A complex hospital integration that cannot be demoed credibly.
- Too many external APIs.
- Anything that requires private real emergency data.

The winning demo should feel like a response team actually used it during a bad day.
