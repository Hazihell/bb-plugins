# Architecture

## Components and ownership

- The root workspace fans build, typecheck, test, and check scripts into all
  leaf plugins while keeping one lockfile and dependency installation.
- `plugins/taskboard/server.ts` is the backend composition root. It wires typed
  RPC handlers, project-scoped configuration and credentials, the local cache,
  provider adapters, background sync, mentions, and CLI commands. It starts no
  issue-drafting agent; the sync service invokes one retry-safe compatibility
  cleanup for hidden Taskboard-owned helper threads left by older releases.
- `plugins/taskboard/app.tsx` owns the BB frontend registrations and Taskboard
  UI: nav panel, full/right-panel boards, project management, List/Kanban,
  detail, composer creation, pending credential interaction, and realtime
  reconciliation.
- `plugins/taskboard/contract.ts` and companion schemas define the strict JSON
  wire model. `store.ts` owns append-only SQLite migrations and cached work.
  `sources/` contains the GitHub, Linear, and Jira adapters behind one interface.
- `issue-prefill.ts` deterministically converts a composer prompt into editable
  title/description form state. `legacy-issue-draft-cleanup.ts` owns the narrow
  old-helper shutdown/key cleanup boundary. `sources/github-environment.ts`
  constructs the explicit environment for every GitHub CLI process.
- `browse-preferences.ts` owns the observable device-local current view;
  `filter-presets.ts` validates complete named snapshots while `store.ts` owns
  their project-scoped SQLite CRUD/order and `server.ts` exposes RPC/CLI plus
  realtime invalidation.
- `plugins/usage-tracker` is independent and owns its own server, app, provider
  usage model, compact-limit preference, tests, and assets.
- `plugins/host-monitor/server.ts` owns fleet refresh, last-good snapshots,
  thresholds, and host-targeted process orchestration. `host.ts` collects a
  strict privacy-bounded telemetry/process projection on an enrolled machine;
  `app.tsx` owns the dashboard, sidebar summary, floating monitor, inspector,
  settings, and guarded process-confirmation UI. `lib/fleet-presentation.ts`
  derives the shared status tone, visible label, and safe explanation;
  `lib/sidebar-host-monitor.ts` reuses that presentation for compact/floating
  rows, and `app.css` maps it onto BB's semantic status tokens through inline
  labels and small orbs. All host containers remain neutral and expose their
  explanation through hover and keyboard focus. The Processes fixed tab uses
  the registry-backed `ChartColumn` icon.
- All three plugin manifests remain workspace/build manifests but are private.
  BB resolves releases from the monorepo's plugin-specific Git tags and the
  corresponding plugin subdirectory.

## Data and control flow

1. BB loads each plugin backend from its manifest's source entry and builds the
   optional frontend into its shared React/plugin runtime.
2. Taskboard resolves the current BB project and its selected provider, then
   syncs external summaries into its plugin SQLite database. List browsing and
   mentions read the cache; item detail and comments are fetched live.
3. Frontend components call schema-validated RPC methods. Mutations update
   provider state, refresh the cache, publish an ephemeral project-scoped
   realtime invalidation, and let mounted clients refetch durable data.
4. Linear/Jira secrets are stored outside RPC-visible configuration in
   owner-only project credential files. The authenticated pending-interaction
   form is the human credential entry surface.
5. Composer capture prefills the visible form from the original prompt without
   executing it or starting a model. Issue creation loads provider-native
   metadata, sends one validated create request only after confirmation, caches
   the returned item, and inserts a Taskboard mention into the BB composer.
6. A background service refreshes configured projects; the external tracker
   remains authoritative when cache and live state differ.
7. Named presets never auto-apply. UI application provider-checks a preset,
   atomically replaces the current project `BrowsePreferences`, and lets the
   existing observable store synchronize full/right-panel surfaces.
8. Host Monitor asks BB for enrolled hosts, samples only connected targets via
   the authenticated host-worker boundary, validates every response, and keeps
   the last good reading when a target becomes stale, fails, or disconnects.
   Process lists are fetched only for the explicitly opened host and stop
   actions require a fresh one-use confirmation plus host-side revalidation.
9. Host Monitor derives status presentation from connection, sampling
   freshness, and health. Disconnected/offline wins over retained severity;
   sampling and fresh unavailable states stay neutral; stale/error is
   attention; only connected fresh health can render green, yellow, or red on
   its orb. Containers never inherit the status color. Fresh resource alerts
   use a closed mapper over validated metric/severity/percentage fields; other
   states use fixed safe reason copy. Raw alert/error strings never reach the
   explanation or inspector. Decorative orbs remain
   `aria-hidden` while visible labels and accessible descriptions carry meaning.
10. Host Monitor's process list is on-demand and host-targeted. A stop request
    re-collects and revalidates the opaque process identity, ownership,
    ancestry, lifetime, and elevation state around one 60-second one-use
    confirmation; system, self/ancestor, elevated, and other/unknown-owner
    processes remain protected.

## External dependencies

- BB and the exact `@get-bb/plugin-sdk` version provide the host, RPC, UI,
  storage, CLI, and testing contracts. Taskboard keeps the SDK in production
  dependencies because its shared app RPC contract executes a root SDK helper
  during managed Git builds after `--omit=dev`.
- Taskboard uses Zod for runtime validation, better-sqlite3 through BB storage,
  BB-vendored UI source, Radix overlay primitives, Sonner, and Hugeicons.
- GitHub access reuses BB's official GitHub integration and the `gh` CLI. The
  CLI is resolved to an access-checked canonical absolute path; relative and
  current-workspace PATH entries are rejected and version discovery gets no
  credentials. The authenticated child environment is an explicit allowlist
  for GitHub auth/config,
  executable/system lookup, HTTP routing/trust, credential-store roots, and
  temp storage. Linear and Jira use project-isolated API credentials.
- Runtime/build imports needed after production-only installation belong in
  leaf `dependencies`; type-only imports, test harnesses, and pinned build
  tooling belong in `devDependencies`.
- Host Monitor deliberately carries BB 0.40 / SDK 0.4.21 tooling in its own
  workspace while the older plugins retain their compatible BB 0.38 / SDK
  0.4.6 toolchains.
- Host status orbs reuse BB's `--success`, `--warning`, `--destructive`, and
  muted foreground tokens; no extra color dependency or parallel state model
  is introduced.
- Host-page explanations use the existing Radix Tooltip dependency and reapply
  the plugin portal scope. The plain-DOM compact/floating monitor keeps a
  visually hidden per-row accessible description and positions one body-level
  neutral tooltip against the viewport, avoiding scrollport clipping and a
  second presentation or telemetry model.
