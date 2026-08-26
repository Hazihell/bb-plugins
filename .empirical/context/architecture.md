# Architecture

## Components and ownership

- The root npm workspace fans build, typecheck, test, and check scripts into all
  leaf plugins while keeping one lockfile and dependency installation.
- `plugins/taskboard/server.ts` is the backend composition root. It wires typed
  RPC handlers, project-scoped configuration and credentials, the local cache,
  provider adapters, background sync, mentions, CLI commands, and hidden helper
  threads used for issue drafting.
- `plugins/taskboard/app.tsx` owns the BB frontend registrations and Taskboard
  UI: nav panel, full/right-panel boards, project management, List/Kanban,
  detail, composer creation, pending credential interaction, and realtime
  reconciliation.
- `plugins/taskboard/contract.ts` and companion schemas define the strict JSON
  wire model. `store.ts` owns append-only SQLite migrations and cached work.
  `sources/` contains the GitHub, Linear, and Jira adapters behind one interface.
- `plugins/usage-tracker` is independent and owns its own server, app, provider
  usage model, tests, and assets.

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
5. Issue creation loads provider-native metadata, sends one validated create
   request, caches the returned item, and inserts a Taskboard mention into the
   BB composer. The external provider is never written before confirmation.
6. A background service refreshes configured projects; the external tracker
   remains authoritative when cache and live state differ.

## External dependencies

- BB and the exact `@get-bb/plugin-sdk` version provide the host, RPC, UI,
  storage, agent, CLI, and testing contracts.
- Taskboard uses Zod for runtime validation, better-sqlite3 through BB storage,
  BB-vendored UI source, Radix overlay primitives, Sonner, and Hugeicons.
- GitHub access reuses BB's official GitHub integration and the `gh` CLI;
  Linear and Jira use project-isolated API credentials.
- Runtime imports belong in leaf `dependencies`; types, test harnesses, and
  pinned build tooling belong in `devDependencies`.
