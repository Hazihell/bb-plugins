# Project Overview

## Purpose

- This workspace contains focused plugins for BB, the agent IDE.
- Taskboard gives each BB project one GitHub, Linear, or Jira-backed List/Kanban
  board with cached browsing, live detail, status changes, issue creation,
  mentions, CLI access, and agent handoff.
- Usage Tracker places Codex and Claude Code quota windows in BB's sidebar
  footer.

## Boundaries

- The repository root is orchestration only. Each installable plugin is an
  independent package under `plugins/<id>` with its own source, tests, assets,
  manifest, license, third-party notices, and README.
- `.bb/plugins.json` is the collection index and must match installable plugin
  directories; it does not override leaf manifests.
- Taskboard selects exactly one external tracker per BB project. Provider APIs
  remain authoritative; Taskboard stores project configuration, credentials,
  cached summaries, sync state, and board preferences.
- Taskboard and Usage Tracker are private/non-publishable workspaces. They
  release through immutable plugin-specific Git tags plus the BB Community
  marketplace.
- Generated `dist/` and `node_modules/` are build/install products, not authored
  source and are not committed.
- Empirical tracker integration is explicitly disabled in this checkout, so
  workflow state remains local-only with no provider requests.

## Evidence

- Repository catalog and setup: `README.md`, `.bb/plugins.json`, `package.json`.
- Workspace rules: `AGENTS.md`.
- Taskboard behavior and package contract: `plugins/taskboard/README.md`,
  `plugins/taskboard/package.json`, `plugins/taskboard/server.ts`, and
  `plugins/taskboard/app.tsx`.
- Taskboard distribution contract:
  `.empirical/capabilities/taskboard-distribution/spec.md`.
- Usage Tracker behavior: `plugins/usage-tracker/README.md` and its manifest.
- Hosted verification: `.github/workflows/ci.yml`.
