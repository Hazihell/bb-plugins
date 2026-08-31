# Project Overview

## Purpose

- This workspace contains focused plugins for BB, the agent IDE.
- Taskboard gives each BB project one GitHub, Linear, or Jira-backed List/Kanban
  board with cached browsing, live detail, status changes, issue creation,
  remembered and named project views, mentions, CLI access, and agent handoff.
  Composer issue capture copies the prompt into an editable review form and
  never starts an agent or model; provider mutation remains explicitly
  confirmed.
- Usage Tracker places Codex and Claude Code quota windows in BB's sidebar
  footer and lets the user choose the weekly or five-hour compact reading.
- Host Monitor presents live CPU, RAM, disk, network, load, uptime, connection,
  and sample-health data for every enrolled BB host, with guarded on-demand
  process inspection and termination. Its per-host orbs use consistent
  success, warning, destructive, and muted status colors while visible
  connectivity and freshness/health labels remain authoritative. Eligible
  process stops are guarded by explicit confirmation and repeated identity,
  ownership, ancestry, lifetime, and elevation checks.

## Boundaries

- The repository root is orchestration only. Each installable plugin is an
  independent package under `plugins/<id>` with its own source, tests, assets,
  manifest, license, third-party notices, and README.
- `.bb/plugins.json` is the collection index and must match installable plugin
  directories; it does not override leaf manifests.
- Taskboard selects exactly one external tracker per BB project. Provider APIs
  remain authoritative; Taskboard stores project configuration, credentials,
  cached summaries, sync state, and board preferences.
- Taskboard's current browse state stays versioned and device-local; named
  project presets store validated snapshots in the plugin database and apply
  explicitly through that same browse store.
- Taskboard's GitHub CLI subprocesses receive only fixed non-interactive locale
  controls plus explicit GitHub auth/config, executable/system, proxy/CA,
  credential-store, and temp variables; unrelated server secrets are excluded.
  The executable is absolute/canonical and token-free probed after rejecting
  relative or current-workspace search candidates.
- Taskboard, Usage Tracker, and Host Monitor are private/non-publishable
  workspaces. They release through immutable plugin-specific Git tags plus the
  BB Community marketplace.
- Generated `dist/` and `node_modules/` are build/install products, not authored
  source and are not committed.
- Host Monitor status-orb colors are independent of the numeric threshold-color
  preference. Disconnected state overrides retained health severity, and the
  movable sidebar trigger remains free of a notification dot. Status labels
  are borderless inline content; host cards and rows never receive a semantic
  rail or colored surface. Critical and Needs attention text remain emphasized,
  Healthy text stays neutral, and each host exposes a safe hover/focus reason
  without displaying raw refresh errors.
- Empirical tracker integration is explicitly disabled in this checkout, so
  workflow state remains local-only with no provider requests.

## Evidence

- Repository catalog and setup: `README.md`, `.bb/plugins.json`, `package.json`.
- Workspace rules: `AGENTS.md`.
- Taskboard behavior and package contract: `plugins/taskboard/README.md`,
  `plugins/taskboard/package.json`, `plugins/taskboard/server.ts`, and
  `plugins/taskboard/app.tsx`, plus `issue-prefill.ts`,
  `legacy-issue-draft-cleanup.ts`, and `sources/github-environment.ts`.
- Taskboard distribution contract:
  `.empirical/capabilities/taskboard-distribution/spec.md`.
- Usage Tracker behavior: `plugins/usage-tracker/README.md` and its manifest.
- Host Monitor behavior and privacy boundary:
  `plugins/host-monitor/README.md`, its manifest, `contract.ts`, `server.ts`,
  `host.ts`, `app.tsx`, `app.css`, `lib/sidebar-host-monitor.ts`, and
  `lib/fleet-presentation.ts`.
- Host Monitor presentation contracts:
  `.empirical/capabilities/host-monitor-sidebar/spec.md` and
  `.empirical/capabilities/host-monitor-fleet-presentation/spec.md`.
- Hosted verification: `.github/workflows/ci.yml`.
