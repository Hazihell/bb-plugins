# Integrate Community PRs 10, 11, and 12

## Request

> Review open PRs #10, #11, and #12 in MateoCerquetella/bb-plugins; resolve their merge conflicts against current main without regressing the released Taskboard and Usage Tracker behavior; preserve original contributor authorship, add the contributors to repository credits, run the complete checks, and prepare all safe PRs for merge into main.

## Goal

Integrate the useful community work from all three PRs onto current main with
one coherent preference architecture, passing checks, visible contributor
credit, and Git history that retains the original authors.

## Acceptance Criteria

- [ ] [AC-1] Usage Tracker exposes a validated **Compact limit** setting with
  Weekly and Five-hour choices, defaults legacy/unknown values to Weekly,
  updates the compact percentage/bar live, and falls back to the other reported
  window when the preferred window is absent; expanded details still show both.
- [ ] [AC-2] Taskboard retains the released versioned, project/provider-scoped,
  device-local browse preference store shared by full and right-panel surfaces,
  including query, filters, view, and collapse state. Conflict resolution SHALL
  not introduce a second automatic server-side filter-state writer, stale RPC
  race, or schema that discards released preference fields.
- [ ] [AC-3] Taskboard supports named filter presets scoped to one BB project:
  save the complete current browse state, apply it explicitly from the filter
  bar, and rename/reorder/delete it in Manage. Applying a preset replaces all
  preset fields through the existing preference store and never auto-applies a
  default preset.
- [ ] [AC-4] Presets are stored in Taskboard's plugin database with bounded,
  locale-independent case-insensitive names, deterministic ordering, strict
  state validation, project isolation, duplicate rejection, corrupt-row
  containment, permutation-checked reorder, and idempotent deletion.
- [ ] [AC-5] The Taskboard CLI can list/save/rename/delete presets and use
  `list --preset`; explicit `--source` and `--query` override preset values,
  while remaining preset facets use the same filtering logic as the UI.
- [ ] [AC-6] Existing Taskboard creation, provider, browsing, remembered query,
  assignee, filters, List/Kanban, and Usage Tracker refresh/error behavior remain
  compatible; no package version, Git-only distribution, credential, or release
  contract regresses.
- [ ] [AC-7] Root and plugin documentation describe both new capabilities, and
  a Contributors section credits [Stephen Dolan](https://github.com/stephendolan)
  and [Andrii Los](https://github.com/RIP21).
- [ ] [AC-8] Original PR commits/authors remain ancestors of the delivered
  integration or equivalent commits carry explicit `Co-authored-by` credit;
  PRs #10, #11, and #12 end merged or are closed only with a precise superseded-
  by-merged-integration explanation.
- [ ] [AC-9] Focused tests, root `npm run check`, build metadata, live plugin
  reload checks, independent review, and Empirical integration all pass before
  remote merge.

## Scope

- PR #10 Usage Tracker compact-limit preference.
- PR #11 remembered-filter contribution and its conflicts with the released
  browse preference architecture.
- PR #12 named filter preset module, database, RPC, UI, Manage, CLI, tests, and
  documentation.
- Repository contributor credits and authorship-preserving Git integration.

## Non-goals

- Replacing released device-local browse preferences with an incompatible
  server-only automatic filter-state mechanism.
- Automatically applying a default preset or tracking a dirty/active preset.
- Adding provider-specific `@me` identity resolution.
- Publishing new plugin versions, tags, npm packages, or marketplace changes.
- Merging code that fails current contracts merely to make an old PR green.

## Risks

- PR #12 is stacked on #11 and both predate major Taskboard preference/UI work;
  naive merging can duplicate persistence, lose query/collapse state, or revive
  old bundle/package assumptions.
- Preset state crosses UI, RPC, SQLite, and CLI trust boundaries; unbounded or
  loosely parsed state can create resource or cross-project integrity failures.
- Squashing or recreating contributor work can erase GitHub attribution.

## Verification

- Compare each PR commit/file set with current main and record conflict choices.
- Unit tests for compact-limit selection/fallback and preset schema/name/order/
  project/state behavior, plus existing suites and root `npm run check`.
- CLI/RPC checks and a live Taskboard/Usage Tracker reload walkthrough.
- Git ancestry/author audit and README contributor-link assertions.
- Independent security/code review and Empirical detached integration replay.

## Capability Deltas

- `deltas/usage-tracker-compact-display.md`
- `deltas/project-view-preferences.md`
