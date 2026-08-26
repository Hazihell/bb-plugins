# Decisions: Taskboard Release Review Fixes

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Extend version-1 browse records compatibly

Status: Accepted

### Evidence

The version-1 schema is already exercised locally but `0.3.0` is unpublished.
Strict legacy records omit query, and losing their other facets would violate
the persistence goal.

### Options

- Add a version-2 migration.
- Keep version 1 and make the new bounded field default to empty.

### Chosen approach

Keep version 1 and parse missing query as empty. Persist it on the next real
update.

### Trade-offs and risks

This treats query as a compatible completion of an unreleased record. Strict
unknown-field rejection and unsupported-version fallback remain unchanged.

### Verification

Parse both old/new records, reload independent scopes, clear/reconcile, and
exercise full/right detail return in BB.

## D-002: Carry structured assignee confirmation

Status: Accepted

### Evidence

Provider-native assignee IDs differ from display strings, and GitHub can return
success with an assignment warning.

### Options

- Parse warning text.
- Compare the displayed assignee.
- Carry a structured confirmed native ID through adapter/server/RPC layers.

### Chosen approach

Carry the strict union
`{ confirmed: true; id: string | null } | { confirmed: false }` and update
storage only on an exact submitted/confirmed match, including explicitly
confirmed unassigned null/null.

### Trade-offs and risks

This adds one strict result union across three adapters, but avoids provider- and
locale-specific string coupling. Jira responses without account IDs remain
unconfirmed and preserve the old default rather than guessing.

### Verification

Adapter/result schema tests and persistence tests cover match, null/null,
mismatch, rejection, and scope isolation.

## D-003: Prefer duplicate prevention after mutation invocation

Status: Accepted

### Evidence

Linear/Jira requests can commit before the client loses or fails to parse a
response; Jira also performs a second GET after a confirmed POST.

### Options

- Leave every error retryable.
- Retry automatically.
- Conservatively mark post-dispatch failures outcome-uncertain.

### Chosen approach

Set the attempted boundary immediately before the provider transport, reuse the
existing outcome-uncertain marker for every thrown/malformed/lost result after
that point, and require refresh/provider review before another attempt. Only a
parsed authoritative rejection with no issue remains normally retryable.

### Trade-offs and risks

A pre-commit network failure may require a manual check even when nothing was
created, but automatic duplicate creation is the higher-cost failure.

### Verification

Simulate lost/malformed Linear responses and Jira POST/detail failures; assert
the marker reaches the strict RPC/UI error path.

## D-004: Focus the visible constrained search on open

Status: Accepted

### Evidence

Radix focuses the first menu item and traps Tab, leaving the visible input
pointer-only when the menu opens from a keyboard.

### Options

- Replace the menu with a popover/command stack.
- Remove the nested search.
- Override open autofocus to the existing input.

### Chosen approach

Use the existing Radix `onOpenAutoFocus` contract and an input ref, while
preserving editing keys, Down-to-options navigation, Escape/focus return, and a
non-selectable no-match row.

### Trade-offs and risks

This is the smallest change and keeps current semantics; live keyboard testing
must confirm it across constrained layout.

### Verification

Browser-open with keyboard, type a filter value, inspect focus, close with
Escape, and capture the constrained menu without horizontal overflow.

## D-005: Canonicalize facets to current provider casing

Status: Accepted

### Evidence

Option generation deduplicates case-insensitively but checked/toggle behavior is
exact, producing visible unchecked values that cannot clear the saved variant.

### Options

- Make every UI comparison case-insensitive indefinitely.
- Reconcile stored selections to the current option value and use one identity
  helper for checked/toggle behavior.

### Chosen approach

Reconcile and persist canonical option values after fresh items load; remove all
case variants on toggle-off.

### Trade-offs and risks

Provider display casing becomes authoritative, which matches fresh list data and
prevents duplicates. Stale values with no current option remain available until
the user clears them.

### Verification

Pure option/selection tests cover case changes, duplicates, checked state, and
complete removal.

## D-006: Replace, never reuse, the earlier archive

Status: Accepted

### Evidence

The first reviewed archive predates these fixes and cannot represent the final
release source.

### Options

- Publish it anyway.
- Repack the directory during publication.
- Create and approve a new immutable archive, then publish that exact file.

### Chosen approach

Create a new scripts-disabled archive after final verification. A fail-closed
wrapper pins the npm registry, rejects symlink/path/name/version/digest drift,
and publishes the canonical absolute file with a token scoped to that npm
process only after approval.

### Trade-offs and risks

The earlier digest becomes obsolete evidence. The replacement adds one build and
archive audit but closes source/archive drift.

### Verification

Inspect archive metadata/paths, compare members, confirm version/tag absence,
and present the new path/digest in the exact remote approval gate.
