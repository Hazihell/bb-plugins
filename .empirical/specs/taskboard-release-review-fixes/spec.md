# Taskboard Release Review Fixes

## Request

> Fix two late Taskboard 0.3.0 release-review regressions before the release commit: preserve each project's search query across full/right surfaces and detail round trips as part of durable browse preferences, including clear/provider-reset semantics and safe legacy parsing; and remember a create assignee only when the provider response confirms that exact submitted native assignee ID was applied, preserving the prior remembered value when a partially successful creation omits the assignment. Add focused contract/adapter/preference/UI tests, rerun root checks and live UI evidence as applicable, then rebuild and rebind the immutable 0.3.0 release archive before remote approval.

## Goal

Close every high/medium release-review finding and the adjacent low-risk
consistency defects before producing the final `0.3.0` archive, without changing
provider scope, credential storage, existing routes, or remote release state.

## Acceptance Criteria

- [ ] [AC-UI-1] [UI] A project's search query is part of its validated,
  device-local browse record, is shared by full and right-panel surfaces,
  survives opening/back from detail and BB reload, does not leak across
  projects, clears with that scope's filters/provider reset, and legacy records
  without the field parse safely.
- [ ] [AC-2] Create-assignee memory changes only when creation confirms the
  exact submitted provider-native assignee ID was applied; a confirmed
  unassigned submission clears the scope, while partial success without the
  requested assignment preserves the prior saved value.
- [ ] [AC-3] Linear and Jira create requests that can have committed before a
  timeout, malformed/lost response, or Jira post-create detail failure return
  the existing outcome-uncertain marker so the form blocks duplicate retry and
  directs the user to reconcile, matching GitHub's safety boundary.
- [ ] [AC-4] External issue text escapes the complete C1 control range and
  bidirectional formatting/isolate controls before CLI or agent-context output,
  with adversarial tests preserving readable trust-boundary quoting.
- [ ] [AC-UI-2] [UI] Keyboard opening the constrained filter menu focuses its
  value-search input; long provider values cannot introduce horizontal menu
  scrolling; and create-metadata failures expose their actual safe message in
  an announced alert while Retry remains available.
- [ ] [AC-5] Persisted facet selections reconcile case-insensitively to current
  provider option IDs so a visible checked value can always be toggled off
  without leaving a differently-cased hidden selection.
- [ ] [AC-6] Linear issue payloads retrieve at least the same 100-label maximum
  that creation accepts, so created/listed issues do not silently truncate an
  allowed selection.
- [ ] [AC-7] Taskboard documentation distinguishes UI-only creation from CLI
  capabilities and makes no false feature-parity promise.
- [ ] [AC-8] The living distribution contract requires a real scripts-disabled
  archive, recorded/rechecked SHA-256, publication of that exact file with a
  one-process credential, and an explicit exact-version npm assertion before
  marketplace push; the final archive is rebuilt and reverified after these
  fixes.

## Scope

- Browse preference schema/store, search/facet binding, clear/reconcile behavior,
  and focused persistence/UI tests.
- Structured applied-assignee confirmation through all provider adapters,
  backend/RPC contract, frontend persistence helper, and adapter/contract tests.
- Linear/Jira post-dispatch create safety, external-content sanitization, Linear
  label fetch parity, constrained filter focus/overflow, metadata error UI, and
  README wording.
- Distribution capability hardening and a replacement reviewed `0.3.0` archive.

## Non-goals

- Publishing npm, pushing Git refs, creating/merging PRs, or creating a GitHub
  release before the existing exact-command approval gate.
- Changing provider selection, project scoping, credentials, issue-create field
  availability, routes, Kanban behavior, or the npm/marketplace version.
- Replacing the current test stack or solving inherited package-source-map,
  direct-React-declaration, SBOM, or packaged-development-script hygiene.

## Risks

- A schema change can discard already-saved project filters if the legacy
  default is not applied before strict validation.
- Treating an unconfirmed assignee as applied violates the user's requested
  default; treating every partial success as ordinary failure can invite
  duplicate issues.
- Provider errors before and after dispatch are hard to distinguish, so retry
  safety must be conservative once a create request is attempted.
- Autofocusing a nested menu input can break arrow-key selection or focus
  restoration if Radix default focus is not deliberately replaced.
- Any product-source change invalidates the previously reviewed release archive.

## Verification

- Focused preference, contract, provider-create, external-context, and UI source
  tests plus Taskboard typecheck/build metadata verification.
- Root `npm run check` and `git diff --check`.
- Live BB keyboard/detail/search/error-state walkthrough with screenshot evidence
  for both UI criteria; no external provider mutation is needed.
- Build a new real `.tgz` with scripts disabled, inspect its files/metadata,
  record SHA-256, compare packed sources to the final candidate, and keep remote
  publication blocked pending exact approval.

## Capability Deltas

- `deltas/project-view-preferences.md`
- `deltas/board-capture.md`
- `deltas/external-task-context.md`
- `deltas/taskboard-browser.md`
- `deltas/taskboard-distribution.md`
