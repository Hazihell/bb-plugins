# Community PR Integration Design

## Integration graph and branch

Build one owner-controlled integration branch from current `origin/main` and
retain the original PR heads as merge parents. The exact order is #10, #11,
then #12: #10 is independent; #12 contains all six #11 commits and adds seven
preset commits. A non-squash merge of the final integration branch into main
makes the original contributor commits reachable and preserves GitHub credit.

## PR #10: configurable compact Usage Tracker limit

Merge `201c44a5f825c724fcfdfa6876437ceb2730814b` normally. It cleanly adds a
Weekly/Five-hour select setting, normalization at storage/RPC boundaries, live
compact-render selection and fallback, documentation, changelog, and focused
tests. Retain current private Git-only manifests and version. Confirm expanded
details remain independent of the compact selection.

## PR #11: superseded filter persistence

Current Taskboard already implements the requested remembered-filter outcome
with a richer versioned `BrowsePreferences` store: project/provider and Across
projects isolation, shared full/right-panel observation, query, view, all
facets, collapsed groups, storage-failure fallback, provider reconciliation,
and separate confirmed-assignee memory.

PR #11's SQLite/RPC writer is incompatible: it omits version/provider/collapse
state, duplicates state ownership, creates last-write-wins cross-client races,
uses an unbounded pre-release schema, and can reintroduce npm-era package
metadata. Merge its exact head
`445e5ac4f3943a8eb4821f27a808715f46e57450` with Git's `ours` strategy, not
`-X ours`, so its six author commits become ancestors while the released
implementation tree remains intact. Add visible Andrii Los credit and a guard
proving no `project_filter_state`, `filter-state.ts`, or filter-state RPC path
survives.

## PR #12: port named presets onto BrowsePreferences

After the #11 merge parent exists, merge PR #12 head
`91037db6add4edd08c313025cb8a1e51896458ad`; its merge base becomes #11 and the
semantic delta is the seven preset commits only. Preserve the new preset module,
SQLite CRUD/migration, RPC/CLI behavior, UI affordances, tests, and docs, but
adapt every preset state boundary from obsolete `BoardFilterState` to the
released strict `BrowsePreferences` schema.

### State and storage

Persist the complete `BrowsePreferences` record, including version, provider,
query, source, view, facets, and collapse overrides. Validate before every write
and after every read. Scope every query by the validated BB project id. Bound
names, state arrays/strings, row counts, and request payloads through the
existing schema plus preset limits. Keep corrupt-row omission, locale-independent
name normalization, uniqueness, deterministic positions, exact-permutation
reorder, and idempotent delete.

### UI

Add one Presets control to the existing filter presentation without restoring
the contributor branch's older filter-bar markup. Save reads the current
observable preference snapshot. Apply calls the existing store's `set` for the
current project scope so full and right-panel surfaces update immediately and
the ordinary device-local persistence path records the result. Manage owns
rename/reorder/delete with serialized mutations and authoritative RPC results.
Across projects does not expose project presets.

### CLI and RPC

Port the contributor's preset RPC contract and handlers into the current
contract/server composition. CLI preset CRUD resolves names case-insensitively.
`list --preset` applies explicit source/query precedence, then sends remaining
facets through current `filterWorkItemsByAttributes`; output stays bounded and
project/provider checks remain authoritative.

## Contributor credit

Add a root README Contributors section for Stephen Dolan (`@stephendolan`) and
Andrii Los (`@RIP21`) and plugin-specific credits beside their documented
features. Preserve original commits via merge parents; do not squash or amend
them. Existing Claude co-author metadata on #11 remains historical.

## Verification and delivery

Run focused Usage Tracker and preset tests during resolution, then the root
check and build-metadata validation. Reload both live path plugins only after
the candidate passes, exercise Compact limit and preset CRUD/apply/list, and
inspect logs/status. Independent review checks security, migrations, state
bounds, existing feature regressions, and ancestry. Empirical integrates the
capability deltas on a detached current-main target. Push the reviewed
integration branch, require hosted CI, merge normally, then verify all three PR
heads are ancestors of main and their PRs show merged (or close with an exact
integration reference if GitHub does not auto-detect).
