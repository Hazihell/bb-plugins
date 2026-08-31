# Conventions

## Code and structure

- New independently installable plugins live at `plugins/<id>` and must be
  added to the root workspaces, `.bb/plugins.json`, and README catalog.
- Keep plugin IDs, package names, CLI commands, realtime channels, persisted
  keys, schemas, tests, and documentation aligned.
- Manifest `bb.server` and `bb.app` entries point to source files. Never repoint
  them at generated `dist/` bundles.
- Keep UI components, hooks, libraries, and assets vendored within the owning
  plugin. Shared machinery must not assume copies remain byte-identical.
- Use the exact `@get-bb/plugin-sdk` version shipped by the pinned `bb-app`.
  Keep type-only/build-shimmed use in `devDependencies`, but place a real SDK
  runtime import in `dependencies` when a managed Git build must resolve it
  after `--omit=dev` (Taskboard's `defineRpcContract` path). Never duplicate it
  across both sections, restore vendored declarations, or add SDK path aliases.
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
- Composer-assisted Taskboard creation remains a deterministic manual prefill;
  do not reintroduce a hidden agent unless the public SDK provides an enforced
  read-only execution boundary and the behavior is explicitly reviewed.
- GitHub CLI children inherit only the reviewed allowlist; do not restore
  `process.env` passthrough, bare executable lookup, credential-bearing probes,
  or unrelated editor/debug/provider variables.
- Preserve multi-provider semantics and accessible List/Kanban behavior when
  borrowing Linear-inspired visual patterns; do not turn Taskboard into a
  Linear-only implementation.
- Host Monitor may expose only its strict telemetry/process contracts: one
  masked-by-default primary IP, no credentials/interface inventory/command
  lines/usernames, and no reading persistence or third-party telemetry.
- Host Monitor's canonical active identity is `host-monitor` at
  `plugins/host-monitor`; retired identities remain immutable history, not
  aliases, duplicate collection rows, routes, or marketplace entries.
- Host Monitor process stops remain explicitly host-targeted, one-at-a-time,
  freshly confirmed, and revalidated; do not add bulk, automatic, tree, or
  connection-management actions.
