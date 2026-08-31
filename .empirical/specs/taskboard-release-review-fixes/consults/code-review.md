---
reviewer: code-review
verdict: advisory
---

# Independent code review

## Scope and evidence

This bounded review checked the accepted specification, design, decisions,
security and UI/UX consults, verification record, current implementation diff,
and the focused Taskboard implementation/tests for the release-review criteria.
The replacement archive was independently hashed:

`9004d7495775ad696ad35517532eaacbd0e4558d429eda5eca55af9d9dca4f08  /home/dyaus/.bb/thread-storage/thr_7my6pz67bn/taskboard-v0.3.0-release-final-candidate-v2/bb-plugin-taskboard-0.3.0.tgz`

That matches the digest recorded in `evidence/verification.md`. The archive
identity and member audit recorded there are accepted as signed verification
evidence; no remote release action was performed.

## Criterion dispositions

- **AC-UI-1 — Pass.** `query` is bounded and defaults safely in the strict
  version-1 browse record. The observable project-scoped store is shared by
  full and constrained surfaces, storage keys encode validated scopes, query
  changes invalidate outstanding list work, and clear/provider reconciliation
  reset the query without leaking across projects. Focused preference/source
  guards and the live detail/reload/full-right walkthrough cover restoration.
- **AC-2 — Pass.** The strict three-state assignee confirmation crosses adapter,
  server, RPC, and UI boundaries. Persistence captures the submitted scope and
  mutates only on an exact native-ID match, including confirmed null/null;
  mismatch, missing evidence, partial success, rejection, and scope isolation
  preserve prior state as required.
- **AC-3 — Pass.** Linear converts post-invocation transport/parse ambiguity to
  the shared outcome-uncertain marker while retaining only an authoritative
  `success: false`/no-issue result as retryable. Jira marks create POST/parse and
  post-create detail failures uncertain. The UI disables repeat creation after
  the marker, and focused adapter cases cover the boundary.
- **AC-4 — Pass.** CLI/context formatting visibly escapes the complete C1 range
  and the specified bidi marks, embeddings, overrides, and isolates. C0 inline
  output, JSON readability, delimiter ordering, and attacker-supplied delimiter
  text have adversarial coverage.
- **AC-UI-2 — Pass.** Constrained-menu open autofocus targets the value-search
  input, key routing and no-match behavior are explicit, and the values region
  clips horizontal overflow while labels wrap. Metadata adapter failures are
  reduced server-side to a provider-specific `safeMessage`; the form renders
  only that value in an announced alert with a disabled/loading Retry action
  and keeps Create unavailable. Source guards and the live keyboard/overflow/
  error walkthrough support the disposition.
- **AC-5 — Pass.** Selected facets reconcile through one case-folded identity,
  deduplicate to current provider casing, use the same checked-state identity,
  and remove every case variant on toggle-off.
- **AC-6 — Pass.** Linear list/detail/create-return issue fields request
  `labels(first: 100)`, matching the accepted create selection maximum, with a
  focused query assertion.
- **AC-7 — Pass.** The Taskboard README describes direct and assisted creation
  as reviewed UI actions and limits CLI claims to browse/detail/status/refresh/
  configuration capabilities.
- **AC-8 — Pass.** The replacement archive and recorded digest are valid. The
  wrapper revalidates file type, canonical path, SHA-256, and package identity
  at the immediate pre-publish boundary while keeping the token non-exported;
  only the adjacent npm process receives it through a command-local assignment.

## Resolved findings

### CR-01 — Archive identity can drift after verification and before publication

- **status:** resolved
- **prior severity:** high
- **category:** release integrity / time-of-check-to-time-of-use
- **location:**
  `.empirical/specs/taskboard-release-review-fixes/artifacts/verify-publish-taskboard.sh`
- **resolution evidence:** After the registry, dotenv, temporary npmrc, and
  token setup, the wrapper now repeats regular/non-symlink state, canonical
  path, approved SHA-256, and package name/version validation. Each check fails
  closed, and the final identity check is directly adjacent to the
  `npm publish "$canonical_archive"` invocation. Narrow `bash -n` and
  verify-only execution pass against the approved digest.

### CR-02 — Pre-publish validation subprocesses inherit the npm credential

- **status:** resolved
- **prior severity:** high
- **category:** credential containment / release integrity
- **location:**
  `.empirical/specs/taskboard-release-review-fixes/artifacts/verify-publish-taskboard.sh:103`
- **resolution evidence:** The wrapper no longer enables `set -a`. Immediately
  after sourcing and validating the token, `export -n NPM_TOKEN` removes its
  export attribute even if the dotenv used `export`. The path/type/hash/package
  revalidation subprocesses therefore do not inherit the credential. The
  adjacent publish command alone receives it through
  `NPM_TOKEN="$NPM_TOKEN" NPM_CONFIG_USERCONFIG=... npm publish ...`, after
  which the shell value is unset. Narrow syntax and verify-only checks pass.

## Current findings

None.

No other findings were identified in this wrapper-only follow-up.
