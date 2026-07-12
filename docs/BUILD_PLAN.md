# Build Plan: DIZMO

## Objective

Ship a convincing Slack Agent for Good submission that demonstrates **DIZMO**, a working disaster response coordination agent inside Slack.

## Non-Negotiable Demo Features

1. Slack command: `/relief report`
2. Slack command: `/relief brief`
3. Slack command: `/relief simulate`
4. Structured incident extraction
5. MCP-style shelter and supply tools
6. Context search adapter
7. Human approval buttons
8. Situation brief generation
9. Audit log
10. Architecture diagram

## Suggested Repository Structure

```text
docs/
  ARCHITECTURE.md
  BUILD_PLAN.md
  PRODUCT_DESIGN.md
  STACK.md
  SUBMISSION_COMPLIANCE.md
apps/
  slack-app/
    src/
      index.ts
      slack/
      commands/
      views/
    package.json
services/
  relief-mcp/
    src/
      index.ts
      tools/
    package.json
packages/
  core/
    src/
```

## Implementation Phases

### Phase 1: Slack Skeleton

Deliverables:

- Bolt app starts locally.
- App responds to `/relief status`.
- App can post a simple message to a channel.
- Environment variables documented.

Acceptance check:

- A user can run a Slack command and receive a response.

### Phase 2: Report Intake

Deliverables:

- `/relief report` opens a modal.
- Modal collects incident type, location, need, people affected, and details.
- Submission creates a structured incident record.
- App posts an incident card.

Acceptance check:

- A field report becomes a visible incident card in Slack.

### Phase 3: MCP Tool Layer

Deliverables:

- Relief MCP server exposes shelter and supply tools.
- Slack app calls these tools through a client interface.
- Demo fixtures include shelters, supplies, and volunteers.

Acceptance check:

- Incident card includes resource intelligence from the tool layer.

### Phase 4: Search Adapter

Deliverables:

- `SearchAdapter` interface.
- Local fixture-backed search implementation.
- Optional Slack RTS implementation if access is available.

Acceptance check:

- The agent can attach related prior updates to an incident card.

### Phase 5: Agent Reasoning

Deliverables:

- Report classifier.
- Structured extraction.
- Priority scorer.
- Recommendation generator.
- Safety validator.

Acceptance check:

- A messy field message becomes a grounded recommendation with confidence.

### Phase 6: Human Approval

Deliverables:

- Incident card buttons.
- `Create Task`, `Assign`, `Escalate`, and `Resolve` handlers.
- Audit log entries.

Acceptance check:

- A coordinator can approve an action and see the thread update.

### Phase 7: Situation Brief

Deliverables:

- `/relief brief`
- Brief generator pulls open incidents, recent reports, tool data, and related context.
- Posts concise coordinator brief.

Acceptance check:

- The final demo can end with a high-quality operational brief.

## Core Type Interfaces

```ts
export type IncidentPriority = "low" | "medium" | "high" | "critical";

export interface FieldReport {
  id: string;
  channelId: string;
  threadTs?: string;
  rawText: string;
  reporter: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  type: string;
  location: string;
  priority: IncidentPriority;
  status: "open" | "acknowledged" | "assigned" | "resolved";
  summary: string;
  evidence: EvidenceItem[];
}

export interface EvidenceItem {
  source: "slack" | "mcp" | "user" | "system";
  label: string;
  value: string;
  confidence?: number;
}

export interface RecommendedAction {
  title: string;
  rationale: string;
  requiresApproval: boolean;
  priority: IncidentPriority;
}
```

## Demo Data

Shelters:

- Shelter North: capacity 100, current 80, water crates 12.
- Central High Shelter: capacity 160, current 91, water crates 44.
- Riverside Gym: capacity 70, current 66, water crates 18.

Supply depots:

- Central Depot: water 40, blankets 120, med kits 30.
- East Depot: water 18, blankets 55, med kits 12.

Volunteers:

- Asha: driver, north zone, available.
- Ravi: medic, east zone, available.
- Meera: coordinator, central zone, busy.
- Omar: driver, central zone, available.

Seeded Slack updates:

- "Two buses are headed to Shelter North."
- "Ward 8 bridge checkpoint has rising water."
- "Central Depot has water but needs driver assignment."
- "Riverside Gym says they can take 4 more families only."

## Environment Variables

```text
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
SLACK_APP_TOKEN=
SLACK_RESPONSE_CHANNEL_ID=
OPENAI_API_KEY=
GOOGLE_APPLICATION_CREDENTIALS=
DATABASE_URL=
MCP_SERVER_URL=
USE_LOCAL_SEARCH=true
```

## Demo Success Criteria

The project is demo-ready when:

- Slack app runs without manual code edits.
- `/relief simulate` creates a believable crisis.
- `/relief report` creates a structured card.
- A resource recommendation appears from MCP data.
- A related Slack context result appears.
- A coordinator can approve an action.
- `/relief brief` summarizes the situation clearly.
- `/relief simulate` posts context messages, incident cards, and a situation brief in one deterministic flow.
- The Slack sandbox has judge access configured for `slackhack@salesforce.com` and `testing@devpost.com`.
- The app behavior matches the recorded demo exactly.
- No real emergency, personal, confidential, or proprietary data appears in the demo.

## Final Submission Assets

Required:

- Project name and tagline.
- Text description.
- Demo video.
- Architecture diagram upload.
- Slack sandbox URL.
- Sandbox access for `slackhack@salesforce.com` and `testing@devpost.com`.

Recommended:

- GitHub repository.
- `README.md`
- Screenshots of Slack cards.
- Short impact section.

Compliance:

- Demo video under 3 minutes.
- English submission materials.
- Fictional demo data only.
- No copyrighted music or unauthorized trademarks.

## Three-Minute Video Structure

0:00-0:20: Problem and audience.

0:20-0:50: Scattered Slack reports.

0:50-1:25: Agent structures a field report.

1:25-2:00: MCP resource check and recommendation.

2:00-2:25: Human approval and task update.

2:25-2:50: Situation brief.

2:50-3:00: Impact and close.
