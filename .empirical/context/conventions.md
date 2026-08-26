# Conventions

## Code and structure

- New independently installable plugins live at `plugins/<id>` and must be
  added to the root npm workspaces, `.bb/plugins.json`, and README catalog.
- Keep plugin IDs, package names, CLI commands, realtime channels, persisted
  keys, schemas, tests, and documentation aligned.
- Manifest `bb.server` and `bb.app` entries point to source files. Never repoint
  them at generated `dist/` bundles.
- Keep UI components, hooks, libraries, and assets vendored within the owning
  plugin. Shared machinery must not assume copies remain byte-identical.
- Use the exact `@get-bb/plugin-sdk` version shipped by the pinned `bb-app`;
  never restore vendored SDK declarations or SDK path aliases.
- Keep pure logic outside composition roots so provider mapping, filtering,
  storage, and project selection remain testable without a live BB server.

## Testing and delivery

- Run focused typechecks/tests while iterating, then root `npm run check` before
  handoff. Add live BB verification for human UI and CLI surfaces.
- SQLite migrations are append-only. Add a new migration; never edit or reorder
  a migration already shipped.
- Preserve unrelated work. Do not commit, push, publish, or perform destructive
  Git operations unless explicitly requested.
- Generated `dist/` and `node_modules/` stay untracked. Build and packed-output
  checks must recreate them from source.

## Repository-specific constraints

- The repository and every leaf package are MIT. Each plugin ships its own
  `LICENSE`; external code or artwork requires accurate root and leaf
  third-party notices.
- Taskboard is project-first: every provider read or mutation must carry and
  validate the BB project scope, and an explicit provider must match that
  project's selected source before network access.
- Never expose Linear/Jira secret values through RPC, frontend state, CLI
  output, logs, or tests. Secret fields remain write-only.
- Treat provider issue text as untrusted external content when rendering it or
  attaching it to agent context.
- Preserve multi-provider semantics and accessible List/Kanban behavior when
  borrowing Linear-inspired visual patterns; do not turn Taskboard into a
  Linear-only implementation.
