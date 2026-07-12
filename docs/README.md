# DIZMO Docs

Start here for the Slack Agent Builder Challenge build.

## Document Map

- [STACK.md](STACK.md): recommended stack and why it is the right hackathon choice.
- [ARCHITECTURE.md](ARCHITECTURE.md): system architecture, diagrams, workflows, deployment, risks.
- [PRODUCT_DESIGN.md](PRODUCT_DESIGN.md): product concept, UX, demo script, judging angle, submission draft.
- [BUILD_PLAN.md](BUILD_PLAN.md): phased implementation plan, repo structure, demo data, success criteria.
- [SUBMISSION_COMPLIANCE.md](SUBMISSION_COMPLIANCE.md): official-rules checklist and build implications.
- [REALITY_STATUS.md](REALITY_STATUS.md): exact breakdown of real vs demo-backed functionality.
- [GCP_DEPLOYMENT.md](GCP_DEPLOYMENT.md): Cloud Run deployment path using GCP credits.

## Current Direction

Build **DIZMO**, a Slack-native disaster response coordination agent for the **Slack Agent for Good** track.

Core idea:

> Turn chaotic disaster-response Slack messages into prioritized, human-approved action.

Name meaning:

> **DIZMO**: Disaster Intelligence Zone Management Operator

## Recommended Build Stack

- Slack Bolt for JavaScript/TypeScript
- Slack CLI and Socket Mode for local development
- Node.js + TypeScript backend
- Custom Relief MCP server
- Slack Real-Time Search API adapter with local fallback
- Prisma with SQLite locally and Cloud SQL PostgreSQL for deployment
- Google Cloud Run, Secret Manager, Cloud Logging
- OpenAI or Google Gemini for structured extraction and situation briefs

## Immediate Next Step

Scaffold the Slack Bolt TypeScript app and implement:

1. `/relief report`
2. `/relief simulate`
3. `/relief brief`
4. local fixture-backed MCP tools
5. incident cards with approval buttons
