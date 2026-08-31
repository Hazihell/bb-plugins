# Community PR integration verification

## Integration history and concurrent main

- The owner integration branch was built from current main and preserves the
  original contributor heads as ancestors:
  - PR #10: `201c44a5f825c724fcfdfa6876437ceb2730814b` — Stephen Dolan.
  - PR #11: `445e5ac4f3943a8eb4821f27a808715f46e57450` — Andrii Los.
  - PR #12: `91037db6add4edd08c313025cb8a1e51896458ad` — Andrii Los.
- PR #10 was merged normally. PR #11 was recorded through a whole-tree `ours`
  merge because its requested remembered-filter outcome is already shipped by
  a safer and richer current architecture. PR #12 was merged afterward so its
  seven unique preset commits remain authentic ancestors.
- Main advanced during the work with Host Monitor at `fc4a1b9`; merge commit
  `9296d03` incorporated it. Host Monitor's complete plugin, lockfile,
  collection, docs, notices, capability, and evidence remain present and its
  full checks pass.
- Root and plugin READMEs visibly credit Stephen Dolan and Andrii Los with
  linked GitHub identities. Original commit authors and the existing Claude
  co-author trailer remain unchanged.

## Usage Tracker compact limit

- Weekly and Five-hour are validated select values; Weekly is the default for
  missing, legacy, and unknown values.
- The compact percentage and progress rail use the selected fresh window, then
  a fresh alternative, and only then last-known data. Expanded details retain
  merged last-known continuity.
- Accessible text names the configured limit, actual selected window/value, and
  whether a current-alternative or last-known fallback is displayed.
- Focused sequence/fallback/accessibility tests pass. Usage Tracker typecheck,
  17/17 tests, and build pass.

## Taskboard named presets

- PR #11's obsolete `filter-state.ts`, `work-schemas.ts`,
  `project_filter_state`, and filter-state RPC writer remain absent. Current
  versioned device-local project/provider and Across-project browse preferences
  remain the sole automatic current-view store.
- Named presets are real-project-only and persist the complete strict current
  `BrowsePreferences`: version, provider, source, query, List/Kanban view, all
  facets, and collapse overrides. Apply requires the authoritative current
  provider and atomically writes the full state through the existing observable
  store; no preset auto-applies.
- SQLite migration is append-only and creates only
  `project_filter_presets`. CRUD is project-scoped and transactional; IDs are
  `NOT NULL`, raw/canonical metadata is checked, corrupt rows are isolated,
  reads are bounded, names are NFKC/lowercase unique, reorder requires an exact
  visible permutation, delete is idempotent, and provider check+save are one
  project mutation critical section.
- Known-shape prevalidation rejects oversized containers before element walks.
  Every schema-valid full view fits the 910,000-byte individual envelope
  (measured adversarial maximum: 900,441 bytes), while the transactional
  950,000-byte project aggregate plus compact JSON/runtime guard keeps list and
  save responses below BB's 1,048,576-byte CLI ceiling without duplicating a
  saved full state in the response.
- CLI preset CRUD and `list --preset` pass explicit source/query precedence,
  post-sync provider revalidation, enabled-board-facet parity with UI, bounded
  item retrieval, and existing external-output escaping.
- Full/constrained preset menus, save dialog, provider errors, background
  realtime/reconnect reconciliation, project-switch scope guards, controlled
  Manage mutations, responsive rows, focus recovery, and apply/save feedback
  are covered by source guards and independent UI review.

## Checks and live runtime

- Signed receipt `executed-13777e8d218261389af72cdf` records the final root
  `npm run check` at tree digest
  `sha256:322e4afd46bb1c33727872f8c76d07ca0bd57d4f2c59c52112171b2d3f5f8f6b`.
- Taskboard: SDK/typecheck, 109/109 tests, production build, and build metadata
  verification pass.
- Usage Tracker: SDK/typecheck, 17/17 tests, and production build pass.
- Host Monitor: SDK/typecheck, complete test suite, and production build pass.
- `git diff --check` and conflict-marker scans pass.
- Live path Taskboard reload succeeds at v0.3.1 with running sync service and no
  status error. `bb taskboard presets list --project proj_ykxahiys47 --json`
  returns `{ "presets": [] }`, proving migration/RPC/CLI activation without
  mutating user preset data. Existing GitHub sync warnings are caused by the
  separately disabled official GitHub plugin, not this candidate.
- The live Usage Tracker source was not moved from the user's other local path;
  its new compact behavior is verified through focused tests/typecheck/build
  without changing that installation.

## Independent review

- Security verdict: advisory, no blocking or medium findings; three low
  residuals are recorded.
- UI/UX verdict: advisory; all five initial findings were resolved. One low
  retained-refresh retry focus advisory remains.
- Independent code review: advisory, no blocking/high/medium findings.

## Acceptance coverage

- AC-1: compact limit selection/default/fresh fallback/a11y pass.
- AC-2: released current preference architecture retained; obsolete writer
  excluded.
- AC-3/AC-4: complete project presets, safe persistence/management, bounds and
  corruption/provider isolation pass.
- AC-5: CLI CRUD/list precedence and effective-filter parity pass.
- AC-6: released Taskboard/Usage/distribution contracts and concurrent Host
  Monitor remain compatible.
- AC-7: feature docs and linked contributors pass.
- AC-8: exact contributor heads are ancestors; remote PR status finalization is
  a post-hosted-merge delivery check.
- AC-9: focused/root/build/live/review checks pass; Empirical integration and
  hosted delivery remain next gates.
