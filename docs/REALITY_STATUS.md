# Reality Status: What Is Real vs Demo-Backed

This document keeps DIZMO honest. It separates production-ready surfaces from demo-backed surfaces so we know exactly what must be upgraded before final judging.

## Current Real Parts

- TypeScript monorepo with npm workspaces.
- Shared `@dizmo/core` package with schemas, extraction, prioritization, recommendation helpers, search adapter, fixtures, audit trail, and tests.
- Slack Bolt app shell with `/relief report`, `/relief simulate`, `/relief brief`, modals, action buttons, and incident cards.
- HTTP MCP-style service with Fastify endpoints for shelter, supply, and volunteer lookup.
- Web dashboard with React/Vite using DIZMO data models and visual theme.
- Browser verification through Playwright.
- Lint, typecheck, build, tests, and React Doctor command.

## Current Demo-Backed Parts

- Dashboard data is generated from fictional fixtures in `apps/web/src/data/dashboard.ts`.
- MCP service returns fictional shelter, supply, and volunteer data from `@dizmo/core`.
- Search uses `LocalSearchAdapter` and fictional Slack-like messages.
- Slack app falls back to local fictional tool data if the MCP service is unavailable.
- No real database persistence yet.
- No real Slack Real-Time Search API integration yet.
- No real LLM provider call yet.
- No real weather, maps, or geocoding API call yet.

## Credit Usage

### GCP Credits

We can and should use GCP credits for production reliability:

- Cloud Run for `apps/slack-app`.
- Cloud Run for `services/relief-mcp`.
- Secret Manager for Slack, OpenAI/Gemini, and maps/weather keys.
- Cloud SQL PostgreSQL if we add persistent incidents/tasks.
- Cloud Logging for judge/debug visibility.

GCP credits are not currently being consumed by the local build.

### Slack Credits

There is no separate Slack credit usage in the current code. Slack is used through the Slack app/dev sandbox APIs. The required hackathon value comes from using Slack surfaces and qualifying capabilities, not from paid Slack credits.

### AI/API Credits

No OpenAI or Gemini calls are currently wired. The current extraction is deterministic TypeScript logic for demo reliability.

Recommended upgrade:

- Keep deterministic rules as safety fallback.
- Add an LLM adapter for structured extraction and situation brief drafting.
- Log model input/output metadata for trust.

## What To Make Real Next

Priority order:

1. Connect the Slack app to a real Slack developer sandbox.
2. Deploy Slack app and MCP service to GCP Cloud Run.
3. Add persistent storage for incidents, tasks, and audit events.
4. Add a real Slack search implementation behind the existing `SearchAdapter`.
5. Add an LLM adapter with schema validation and deterministic fallback.
6. Add one real external data source, preferably weather or geocoding.

## Submission-Safe Demo Policy

Use fictional emergency data only. Do not use real victim, medical, personal, confidential, or proprietary data in the app, screenshots, or video.

