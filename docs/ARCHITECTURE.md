# System Architecture: DIZMO

## One-Sentence Summary

**DIZMO**, the Disaster Intelligence Zone Management Operator, is a Slack-native coordination system that monitors crisis channels, structures field reports, searches recent operational context, consults external response tools through MCP, and recommends prioritized actions for human approval.

## Architecture Goals

- Make Slack the command center for disaster response.
- Convert messy messages into structured, actionable incident intelligence.
- Keep humans in control of high-impact decisions.
- Use agentic reasoning only where it improves speed and clarity.
- Make the demo reliable under hackathon conditions.

## High-Level Diagram

```mermaid
flowchart LR
    Field["Field Teams in Slack"] --> Slack["Slack Workspace"]
    Ops["Operations Coordinators"] --> Slack

    Slack --> Bolt["Slack Bolt App"]
    Bolt --> Router["Agent Router"]

    Router --> Search["Slack Context Search Adapter"]
    Search --> RTS["Slack Real-Time Search API or Local Demo Index"]

    Router --> LLM["LLM Reasoning Layer"]
    Router --> Rules["Safety and Escalation Rules"]
    Router --> MCP["Relief MCP Server"]

    MCP --> Shelter["Shelter Capacity Tool"]
    MCP --> Supply["Supply Inventory Tool"]
    MCP --> Weather["Weather Alert Tool"]
    MCP --> Volunteer["Volunteer Availability Tool"]
    MCP --> Geo["Location Risk Tool"]

    Router --> DB["Postgres / SQLite"]
    DB --> Audit["Audit Log"]
    DB --> Tasks["Incident Tasks"]
    DB --> Incidents["Incident Records"]

    Router --> Approval["Human Approval Step"]
    Approval --> Slack

    Router --> Brief["Situation Brief Generator"]
    Brief --> Slack
```

## Core Components

### 1. Slack Interface

The Slack app is the main product surface.

Inputs:

- Channel messages in response channels.
- App mentions.
- Slash commands.
- Structured report modals.
- Button clicks from coordinators.

Outputs:

- Incident summaries.
- Risk alerts.
- Assignment suggestions.
- Situation briefs.
- Threaded updates.
- Action buttons for human approval.

Primary commands:

- `/relief report` opens a field report modal.
- `/relief status` returns current incident status.
- `/relief brief` generates a situation brief.
- `/relief simulate` injects demo events.

### 2. Slack Bolt App

The Bolt app receives Slack events and routes them into the agent workflow.

Responsibilities:

- Verify Slack requests.
- Parse commands and interactions.
- Normalize Slack events.
- Send responses back to Slack.
- Preserve thread context.
- Trigger agent workflows.

### 3. Agent Router

The router decides what should happen for each incoming event.

Example routing:

- A short field update becomes a candidate report.
- A supply shortage triggers inventory lookup.
- A shelter capacity warning triggers capacity and volunteer checks.
- A coordinator command triggers a full situation brief.

The router should be deterministic around sensitive actions. The model can recommend, but the system decides when human approval is required.

### 4. Slack Context Search Adapter

This adapter retrieves recent and relevant Slack context.

Uses:

- Find reports about the same location.
- Detect duplicate incidents.
- Gather updates from the last 30 minutes.
- Pull supporting evidence for an alert.

Production path:

- Slack Real-Time Search API.

Hackathon fallback:

- Local indexed demo messages seeded from fixtures.

The public interface should stay the same so the demo and production path share the same architecture.

### 5. Relief MCP Server

The MCP server exposes response tools to the agent.

Tools:

- `get_shelter_capacity(location)`
- `get_supply_status(item, location)`
- `find_available_volunteers(skill, location)`
- `get_weather_alerts(location)`
- `estimate_location_risk(location, incident_type)`
- `create_response_task(title, owner, priority, incident_id)`

Why MCP matters:

- Shows the agent can use external systems through a standard tool layer.
- Makes the architecture extensible.
- Separates operational systems from Slack interaction logic.

### 6. LLM Reasoning Layer

The model is used for tasks that benefit from language understanding.

Model tasks:

- Classify incoming reports.
- Extract structured fields from free text.
- Summarize long threads.
- Generate situation briefs.
- Compare conflicting updates.
- Draft suggested next actions.

The model should not directly:

- Assign emergency priority without rule validation.
- Mark an incident resolved.
- Send external notifications without approval.
- Invent shelter or supply data.

### 7. Safety and Escalation Rules

Rules protect the workflow from overconfident automation.

Examples:

- Any report containing `injury`, `trapped`, `missing`, or `medical` becomes high priority.
- Any action that changes task ownership requires a coordinator click.
- Any low-confidence extraction is posted as a clarification request.
- Any conflicting shelter capacity update is flagged for review.

### 8. Database

The database stores operational state and audit history.

Key tables:

- `incidents`: canonical incident records.
- `reports`: raw and structured field reports.
- `shelters`: capacity and status.
- `supplies`: inventory by location.
- `volunteers`: availability and skills.
- `tasks`: response tasks and assignments.
- `agent_decisions`: recommendations and model outputs.
- `audit_log`: every important system action.

### 9. Situation Brief Generator

Generates a coordinator-ready update.

Brief format:

- Current situation.
- Highest-risk locations.
- Unresolved blockers.
- Resource shortages.
- Recommended next actions.
- New changes since previous brief.

## Main Workflows

### Workflow A: Field Report Intake

```mermaid
sequenceDiagram
    participant User as Field Responder
    participant Slack as Slack
    participant App as Bolt App
    participant Agent as Agent Router
    participant MCP as MCP Tools
    participant DB as Database
    participant Coord as Coordinator

    User->>Slack: Posts update or opens /relief report
    Slack->>App: Sends event or command
    App->>Agent: Normalized report payload
    Agent->>Agent: Extract location, need, urgency
    Agent->>MCP: Check shelter/supply/volunteer data
    MCP-->>Agent: Tool results
    Agent->>DB: Save report and recommendation
    Agent->>Slack: Post structured incident card
    Coord->>Slack: Clicks Assign or Escalate
    Slack->>App: Interaction event
    App->>DB: Update task and audit log
    App->>Slack: Thread update
```

### Workflow B: Situation Brief

```mermaid
sequenceDiagram
    participant Coord as Coordinator
    participant Slack as Slack
    participant App as Bolt App
    participant Search as Search Adapter
    participant MCP as MCP Tools
    participant LLM as LLM
    participant DB as Database

    Coord->>Slack: /relief brief
    Slack->>App: Command
    App->>Search: Find recent crisis-channel context
    Search-->>App: Relevant messages and files
    App->>DB: Load open incidents and tasks
    App->>MCP: Query resource status
    MCP-->>App: Shelter, supply, weather data
    App->>LLM: Generate grounded brief
    LLM-->>App: Draft brief with citations
    App->>Slack: Post coordinator brief
```

### Workflow C: Shortage Escalation

1. A shelter lead reports: "Shelter North is down to 12 water crates, 80 people inside, more buses arriving."
2. Agent extracts:
   - Location: Shelter North
   - Resource: water
   - Capacity pressure: high
   - Urgency: high
3. MCP checks inventory and nearby shelters.
4. Agent finds Slack context showing two prior water complaints.
5. Agent posts an escalation card with:
   - Evidence
   - Suggested owner
   - Suggested action
   - Approval buttons
6. Coordinator approves.
7. Task is created and logged.

## Data Model

```mermaid
erDiagram
    INCIDENTS ||--o{ REPORTS : contains
    INCIDENTS ||--o{ TASKS : creates
    INCIDENTS ||--o{ AGENT_DECISIONS : receives
    SHELTERS ||--o{ REPORTS : referenced_by
    SUPPLIES ||--o{ TASKS : requested_by
    VOLUNTEERS ||--o{ TASKS : assigned_to

    INCIDENTS {
      string id
      string type
      string location
      string status
      string priority
      datetime created_at
      datetime updated_at
    }

    REPORTS {
      string id
      string incident_id
      string slack_channel
      string slack_thread_ts
      string raw_text
      json structured_fields
      float confidence
    }

    TASKS {
      string id
      string incident_id
      string owner
      string status
      string priority
      string title
    }

    AGENT_DECISIONS {
      string id
      string incident_id
      string decision_type
      json inputs
      json output
      boolean required_approval
    }
```

## Demo Scenario

Scenario: Flood response in a mid-sized city.

Channels:

- `#flood-response`
- `#shelter-ops`
- `#supply-desk`
- `#volunteer-dispatch`

Demo sequence:

1. Use `/relief simulate` to inject a flood event.
2. Field responder submits a trapped-family report.
3. Shelter lead reports water shortage.
4. Agent searches Slack context and identifies duplicate reports.
5. Agent checks shelter capacity and supply inventory through MCP.
6. Agent posts prioritized action cards.
7. Coordinator approves an assignment.
8. Coordinator runs `/relief brief`.
9. Agent posts a concise situation brief.

## Trust and Safety

Principles:

- The agent recommends; humans approve.
- Every recommendation includes evidence.
- Every action is logged.
- The system avoids pretending to know unavailable facts.
- The demo uses fictional data.

High-risk actions requiring approval:

- Assigning volunteers.
- Marking incidents resolved.
- Sending public alerts.
- Escalating medical or rescue events.
- Changing shelter status.

## Deployment Architecture

```mermaid
flowchart TB
    Slack["Slack Workspace"] --> CloudRun["Google Cloud Run: Slack App"]
    CloudRun --> Secret["Secret Manager"]
    CloudRun --> SQL["Cloud SQL Postgres"]
    CloudRun --> Logs["Cloud Logging"]
    CloudRun --> MCP["Cloud Run: Relief MCP Server"]
    CloudRun --> LLM["LLM Provider API"]
    MCP --> SQL
    MCP --> External["Weather / Maps / Sheets APIs"]
```

## MVP Scope

Must have:

- Slack app with `/relief report`, `/relief brief`, `/relief simulate`.
- Incident extraction from free text.
- MCP-style tools for shelters and supplies.
- Search adapter with local demo index or Slack RTS if available.
- Human approval buttons.
- Audit log.
- Architecture diagram.
- Three-minute demo script.

Should have:

- Weather API adapter.
- Volunteer matching.
- Duplicate report detection.
- Confidence scores.

Could have:

- SMS escalation.
- Map dashboard.
- Multilingual intake.
- Real-time analytics dashboard.

## Technical Risks

### Slack RTS Access

Risk: Real-Time Search API access may be gated.

Mitigation: Build a search adapter with a local demo index and clearly document the production RTS path.

### MCP Complexity

Risk: MCP implementation can consume time.

Mitigation: Build a small custom MCP server exposing 4-6 tools. Keep tool responses deterministic.

### LLM Reliability

Risk: Model output may be inconsistent.

Mitigation: Use schemas, confidence thresholds, validation, and fallback templates.

### Demo Fragility

Risk: External APIs may fail during recording.

Mitigation: Seed demo fixtures and make simulation deterministic.
