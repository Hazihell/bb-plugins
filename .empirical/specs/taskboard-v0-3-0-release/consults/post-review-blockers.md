# Independent Taskboard 0.3.0 Release Review

- Reviewer: `code-review`
- Verdict: `blocking`
- Source base: `f3ecae77e9add2ffd649442ee880841e30fc25eb`
- Marketplace commit: `9ae222172804d7c12efd7882cd63ac0a046d7acf`

## Criterion dispositions

### AC-1 — Pass

Taskboard's manifest and root workspace lock entry advance from `0.2.0` to
`0.3.0`. After excluding `version`, the Taskboard lock entry is unchanged; after
excluding `version` and the required new `browse-preferences.ts` package-file
entry, the package manifest is unchanged. Package name, plugin ID, branding,
license, engines, source entry points, repository metadata, and dependencies are
preserved. Usage Tracker remains `0.1.2` with no source or manifest diff.

### AC-2 — Package composition passes; release remains blocked

The signed root check passes Taskboard SDK validation, typecheck, 71/71 tests,
production build, and build-metadata verification, plus the unchanged Usage
Tracker checks. The reviewed archive is `bb-plugin-taskboard@0.3.0`, has SHA-256
`9cec43475954d32974fc10ddbd2ec74fe5b3cd4dd18ed8626b1c8f2c974e6f38`,
contains 53 regular files, and includes the manifest, license, notices, README,
declared source closure, `browse-preferences.ts`, and required app/server build
artifacts. Both metadata files identify Taskboard `0.3.0`, SDK `0.4.6`, and BB
`0.38.0`. Every packed member is byte-identical to its current release-candidate
counterpart. No dotenv, npm config, test tree, `node_modules`, or credential is
present in the archive. These package-integrity checks do not waive the
correctness and safety findings in the packed product code below.

### AC-3 — Pass for local preparation

Marketplace commit `9ae222172804d7c12efd7882cd63ac0a046d7acf` is a clean child of current
`upstream/main` `a683caa2ffb502cdc26926c48c88a45a8579970a`. Its only changed path is
`entries/taskboard.json`, and its only content change is `^0.1.2` to `^0.3.0`.
All listing fields and the npm package are preserved. The marketplace and plugin
icons share SHA-256
`0b77950cec05ed35134dcc8d0c8ff96460c806106cb8e28cedeb15903ccd08ef`.
The recorded 82-entry build and liveness check pass. Because marketplace
liveness checks the package rather than exact semver resolution, the executable
plan's separate exact `bb-plugin-taskboard@0.3.0` registry confirmation remains
mandatory before the post-publication check and marketplace push.

### AC-4 — Blocked

The signed root workspace check and `git diff --check` pass. Public registry
lookup returns 404 for `bb-plugin-taskboard@0.3.0`; the origin has no
`taskboard/v0.3.0` tag or `agent/taskboard-v0.3.0` branch, and no matching source
PR or GitHub release exists. However, the complete source review found a
high-severity duplicate-write risk plus unresolved correctness, accessibility,
and trust-boundary regressions in the packed code. Repair and reverify those
findings before integration. The source tree must then be committed locally,
placed on the declared release branch, shown clean, and rechecked against the
approved archive digest and contents before any remote approval.

### AC-5 — Approval gate preserved

No release or marketplace remote mutation was observed. The authenticated
identities recorded in evidence are GitHub `MateoCerquetella` and npm
`mateocerquetella`; the source repository, package/version, tag, npm source,
marketplace branch, and range are consistently specified. Exact source and
marketplace commit hashes plus every remote-changing command must still be
presented after source finalization, and explicit user approval remains required
before the first push, PR, merge, tag, publication, or GitHub release.

### AC-6 — Pass

`.npm-publish.env` is ignored, untracked, and owner-readable only. It was not
read into review output. The npm configuration contains only an environment
reference, and neither credential material nor npm release configuration occurs
in the archive or marketplace data. The approved publication design rechecks
the archive digest, publishes that exact archive with lifecycle scripts disabled,
and scopes the token to one process.

## Decision consistency

D-001 is supported by the material pre-1.0 feature scope and confirmed version
absence. D-002 is preserved by the unchanged npm package and the marketplace
range-only update. D-003 is upheld: local preparation is separated from remote
release, and no accepted decision is contradicted by the implementation,
archive, evidence, or marketplace commit. The stronger executable controls in
the design—real archive, recorded/rechecked digest, exact-archive publication,
and process-scoped scripts-disabled credentials—must remain authoritative at
execution time, as required by the security consult.

## Findings

### F-1

- Severity: **High**
- Category: data integrity / ambiguous remote writes
- Location: `plugins/taskboard/sources/jira.ts:630-661`,
  `plugins/taskboard/sources/linear.ts:548-572`,
  `plugins/taskboard/app.tsx:914-920`
- Finding: GitHub marks a create response as uncertain when a write may have
  committed without a confirmable response, but Linear and Jira do not. A
  Linear/Jira timeout or malformed response after dispatch therefore leaves the
  form retryable and can create a duplicate. Jira also performs a fallible GET
  after a valid POST response; if that GET fails, Taskboard reports creation
  failure and permits a duplicate retry even though Jira already returned the
  created ID/key.
- Recommendation: apply the uncertain-outcome contract to every provider once
  a create request is dispatched. After Jira confirms the POST, return a
  trustworthy provisional result or reconcile without converting the committed
  write into a retryable failure. Add provider tests for post-dispatch timeout,
  malformed responses, and confirmed-POST/failing-GET behavior.

### F-2

- Severity: **Medium**
- Category: security / untrusted terminal presentation
- Location: `plugins/taskboard/contract.ts:443-477`
- Finding: external tracker text is split and C0 controls are escaped, but C1
  controls such as U+009B/U+009D and bidirectional formatting controls remain.
  Provider-controlled content can manipulate terminal presentation or visually
  obscure the quoted trust boundary, contradicting the recorded
  control-character-confinement assurance.
- Recommendation: visibly escape the complete C1 control range and bidi
  formatting/isolate controls before formatting external context, with focused
  adversarial tests for CLI, mention, and handoff output.

### F-3

- Severity: **Medium**
- Category: preference correctness / provider result handling
- Location: `plugins/taskboard/app.tsx:888-910`,
  `plugins/taskboard/sources/github.ts:513-517`
- Finding: every resolved create RPC persists the selected assignee before its
  warnings are inspected. GitHub can return success while explicitly warning
  that assignment failed, so a rejected assignee becomes the next remembered
  default despite the successful-assignee contract and README promise.
- Recommendation: persist only an assignee confirmed as applied, using
  structured result data rather than warning-text parsing, and add a regression
  test for GitHub's partial-assignment result.

### F-4

- Severity: **Medium**
- Category: persisted filter state / UI correctness
- Location: `plugins/taskboard/browse.ts:318-349`,
  `plugins/taskboard/app.tsx:2457-2506`
- Finding: filter options deduplicate selected and live values
  case-insensitively, while checked and toggle state use exact string equality.
  A restored `Alice` selection paired with a fresh `alice` provider value still
  filters but renders unchecked; checking adds a second casing and unchecking
  leaves the hidden original. This violates visibly checked restored filters.
- Recommendation: reconcile stored selections to canonical live option values
  or use the same normalized identity for checked/toggle/remove behavior, with
  route/reload tests covering provider casing changes.

### F-5

- Severity: **Medium**
- Category: accessibility / keyboard interaction
- Location: `plugins/taskboard/app.tsx:2379-2396`
- Finding: constrained filter search is embedded as a plain input inside a
  Radix dropdown menu. Initial focus and roving menu navigation target menu
  items, and Tab is suppressed by the menu, while the input has no explicit
  open-focus path. The advertised search is therefore not keyboard-reachable
  on desktop.
- Recommendation: use a popover/command composition appropriate for mixed form
  and menu content, or explicitly focus and correctly manage the search input
  when the surface opens; add a mounted keyboard interaction test.

### F-6

- Severity: **Medium**
- Category: error handling / accessibility
- Location: `plugins/taskboard/app.tsx:738-745`,
  `plugins/taskboard/app.tsx:926-936`,
  `plugins/taskboard/app.tsx:1308-1316`
- Finding: metadata failure nulls the submission prerequisites, but the stored
  provider error is never rendered. Users receive only a generic
  `Properties unavailable · Retry` button with no alert/live announcement, so
  persistent authentication, permission, or scope failures are not
  diagnosable while creation remains disabled.
- Recommendation: render the actual safe error beside Retry with accessible
  alert/status semantics and test failed/retried metadata loading.

### F-7

- Severity: **Medium**
- Category: navigation regression / session state
- Location: `plugins/taskboard/app.tsx:3855-3856`,
  `plugins/taskboard/app.tsx:5687-5714`
- Finding: query state always initializes empty inside `TrackerList`. Opening a
  detail unmounts that list and Back remounts it, losing the active search. The
  0.2 implementation retained query and committed query in the parent for this
  route flow; the new design calls search session state, not throwaway detail
  state.
- Recommendation: retain search state in the owning full/right surface across
  detail navigation without adding it to durable local storage, and test
  search → detail → Back on both surfaces.

### F-8

- Severity: **Low**
- Category: responsive layout / regression coverage
- Location: `plugins/taskboard/app.tsx:2399`,
  `plugins/taskboard/test/app-ui.test.ts:5`,
  `plugins/taskboard/test/theme-css.test.ts:5`
- Finding: the constrained option pane permits horizontal overflow and long
  provider values have no truncation guard; a horizontal scrollbar is visible
  in the captured constrained-filter evidence. Regex-only UI tests do not
  exercise this or the interactions in F-4 through F-7.
- Recommendation: prevent horizontal overflow while preserving readable labels
  and add mounted interaction/layout coverage for the repaired constrained
  surface.
