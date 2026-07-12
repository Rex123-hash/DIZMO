# Product Design: DIZMO

## Product Name

Recommended submission name: **DIZMO**

Full descriptive name:

> DIZMO: Disaster Relief Command Agent

Acronym expansion:

> **DIZMO**: Disaster Intelligence Zone Management Operator

Alternative names:

- DIZMO Relief
- DIZMO Command
- DIZMO Response
- DIZMO CrisisOps

Final naming recommendation:

> Use **DIZMO** as the brand name and **Disaster Relief Command Agent** as the explanatory subtitle.

Tagline:

> Turn chaotic disaster-response Slack messages into prioritized, human-approved action.

## User Problem

During floods, storms, fires, heatwaves, and other emergencies, response teams often coordinate through fast-moving chat channels. Critical information arrives as scattered messages:

- "Shelter North is almost full."
- "We need water near Ward 8."
- "Two buses just arrived."
- "Volunteer driver canceled."
- "Family still waiting at bridge checkpoint."

The problem is not lack of communication. The problem is that urgent signals get buried, duplicated, or delayed.

DIZMO helps teams move from noisy updates to coordinated action.

## Target Users

Primary users:

- Disaster response coordinators.
- NGO operations leads.
- Shelter managers.
- Volunteer dispatchers.

Secondary users:

- Field responders.
- Supply desk teams.
- Local government emergency cells.
- Community health and safety teams.

## Core Promise

DIZMO watches crisis coordination channels, understands field reports, checks operational resources, and posts clear action cards that coordinators can approve.

It is not a replacement for emergency services or human incident commanders. It is a coordination layer for teams already working in Slack.

## Product Principles

1. **Slack-first**
   The user should not need to leave Slack during a crisis.

2. **Human-approved**
   The agent recommends actions. Coordinators approve important decisions.

3. **Evidence-visible**
   Every alert should show why it was raised.

4. **Fast under pressure**
   The interface should be compact, scannable, and direct.

5. **Demo-proof**
   The product should show a complete workflow in under three minutes.

## Key Features

### 1. Field Report Intake

Users can submit reports through:

- A Slack modal.
- A channel message.
- An app mention.

Structured fields:

- Incident type.
- Location.
- People affected.
- Need.
- Urgency.
- Free-text details.

Agent output:

- Structured report card.
- Confidence score.
- Suggested incident priority.
- Suggested next action.

### 2. Intelligent Incident Cards

Incident cards appear in the response channel.

Card contents:

- Incident title.
- Priority.
- Location.
- Latest update.
- Evidence from Slack context.
- Resource check results.
- Recommended action.
- Action buttons.

Buttons:

- `Acknowledge`
- `Assign`
- `Escalate`
- `Create Task`
- `Resolve`

### 3. Situation Brief

Command:

```text
/relief brief
```

Output:

- Current situation.
- Top risks.
- Resource shortages.
- Blocked tasks.
- New updates since last brief.
- Recommended next moves.

### 4. Duplicate and Pattern Detection

The agent searches recent context for related reports.

Examples:

- Three people mention water shortage at the same shelter.
- Multiple field teams report blocked roads near the same bridge.
- Two channels discuss the same family needing rescue.

### 5. Resource Lookup Through MCP

The agent calls tools for:

- Shelter capacity.
- Supply levels.
- Volunteer availability.
- Weather alerts.
- Location risk.

### 6. Demo Simulation

Command:

```text
/relief simulate
```

This creates a controlled demo scenario:

- Flood event begins.
- Shelter reaches capacity.
- Water supply drops.
- Field responder submits urgent report.
- Agent creates incident cards and a final brief.

## Slack UX Design

### Main Channel Card

```text
High Priority: Water shortage at Shelter North

Evidence
- Shelter lead reported 12 water crates remaining.
- 80 people currently inside.
- Two earlier reports mentioned incoming buses.

Resource check
- Nearby stock: 40 crates at Central Depot.
- Volunteer drivers: 3 available within 4 km.

Recommended action
Dispatch 25 water crates from Central Depot to Shelter North.

[Acknowledge] [Assign Driver] [Escalate] [Create Task]
```

### Situation Brief Example

```text
DIZMO Situation Brief

Current status
Flood response is active across 4 locations. Shelter North and Ward 8 require immediate attention.

Top risks
1. Shelter North water shortage may become critical within 45 minutes.
2. Ward 8 has duplicate reports of stranded families near the bridge checkpoint.
3. Volunteer driver coverage is thin for the north route.

Recommended next actions
1. Dispatch water from Central Depot to Shelter North.
2. Assign rescue verification for Ward 8 bridge checkpoint.
3. Ask volunteer dispatch for two additional drivers.
```

## Demo Script

Target length: 2 minutes 45 seconds.

### Scene 1: The Problem

Show Slack channels with scattered messages:

- Shelter almost full.
- Supply shortage.
- Field rescue request.
- Volunteer availability update.

Narration:

> In a disaster response channel, the issue is not that teams are silent. The issue is that the important signal is buried in fast-moving coordination.

### Scene 2: Field Report

Run:

```text
/relief report
```

Submit:

```text
Family of 5 stranded near Ward 8 bridge checkpoint. Water rising. One elderly person. Need rescue verification.
```

Show:

- Agent extracts location, people affected, urgency, and need.
- Agent creates a high-priority incident card.

### Scene 3: Resource Intelligence

Post:

```text
Shelter North has only 12 water crates left. 80 people inside and two buses arriving.
```

Show:

- Agent finds previous related Slack updates.
- Agent checks supply inventory through MCP.
- Agent recommends dispatching water from Central Depot.

### Scene 4: Human Approval

Coordinator clicks `Create Task` or `Assign Driver`.

Show:

- Task created.
- Thread updated.
- Audit trail recorded.

### Scene 5: Situation Brief

Run:

```text
/relief brief
```

Show:

- Concise summary.
- Top risks.
- Recommended next moves.
- Evidence-based output.

Closing narration:

> DIZMO does not replace the incident commander. It gives them the missing operational picture while the team stays inside Slack.

## Judging Angle

### Technological Implementation

- Slack app with real commands, modals, events, and interactions.
- Agentic orchestration with tool use.
- MCP server for operational systems.
- Search adapter for Slack context.
- Database-backed incident state.
- Audit log and human approval.

### Design

- Slack-native, not dashboard-first.
- Scannable cards.
- Low-friction reporting.
- Clear approval buttons.
- Briefs designed for high-pressure operations.

### Potential Impact

- Speeds up disaster response coordination.
- Reduces missed urgent reports.
- Helps small NGOs and local teams operate with less overhead.
- Applicable to floods, fires, heatwaves, storms, and shelter operations.

### Quality of Idea

- More specific than a generic productivity bot.
- More actionable than a summarizer.
- Uses Slack as the command center for real-world response operations.
- Combines unstructured chat, external tools, and human-approved agent workflows.

## MVP Build Plan

### Day 1

- Create Slack Bolt TypeScript app.
- Add slash commands.
- Add report modal.
- Add demo fixtures.
- Build incident extraction.

### Day 2

- Build MCP-style tool server.
- Add shelter and supply tools.
- Add local search adapter.
- Add incident cards and action buttons.

### Day 3

- Add situation brief.
- Add audit log.
- Polish demo scenario.
- Record demo video.
- Create architecture diagram.

If the deadline is same-day, compress to:

1. Slack commands and modals.
2. Demo fixtures.
3. MCP tools for shelter and supply.
4. Incident cards with buttons.
5. Brief command.
6. Architecture diagram and video.

## Submission Description Draft

DIZMO is a Slack-native disaster response coordinator for NGOs, shelter teams, and emergency operations groups. During a crisis, important information often arrives as scattered Slack messages across field, shelter, supply, and volunteer channels. DIZMO turns that noise into structured incident records, searches recent Slack context for related updates, checks operational data through MCP tools, and recommends prioritized actions that human coordinators approve.

In the demo scenario, a flood response team receives reports about a stranded family, shelter crowding, and a water shortage. DIZMO extracts the key details, identifies related updates, checks shelter and supply data, recommends dispatch actions, creates approved tasks, and generates a concise situation brief for the operations lead.

The project is designed for social impact: helping small response teams coordinate faster during disasters without leaving Slack.
