# Plan: Taskboard Release Review Fixes

## 1. Repair durable browse state and facet identity

- Add compatible bounded query persistence to version-1 browse records, clones,
  defaults, clear, provider reconciliation, and shared List binding.
- Add pure case-folded selection reconciliation/toggle helpers and reconcile
  current provider option casing without leaking scopes or notification loops.
- Extend preference and UI guards for legacy records, reload/detail round trips,
  clear/reset, case variants, duplicates, and maximum query length.

## 2. Confirm native assignee application end to end

- Add `confirmedAssigneeId` to adapter, backend, and RPC create results.
- Derive it from returned GitHub login, Linear member ID, and Jira account ID.
- Persist/clear the scoped default only for exact confirmation and preserve prior
  memory on partial success or mismatch.
- Update adapter, contract, server, preference, and frontend wiring tests.

## 3. Harden provider writes and external text

- Mark Linear/Jira post-dispatch response/parse failures and Jira post-create
  detail failures outcome-uncertain so duplicate submission stays blocked.
- Escape full C1 and bidi formatting/isolate controls inside untrusted issue
  context and add adversarial delimiter/terminal tests.
- Raise Linear list/detail label connections to the accepted 100-value limit.

## 4. Fix constrained UI accessibility and documentation

- Focus the constrained value-search input on menu open, preserve editing,
  Down/Escape/focus-return behavior, render a no-match row, and prevent horizontal
  overflow for long values.
- Render metadata failures as a stable announced message with a loading-protected
  Retry and connect disabled Create to the explanation.
- Correct README UI/CLI scope language and add focused UI source guards.

## 5. Verify in code and live BB

- Keep the existing Taskboard dev watcher active; run focused typecheck/tests
  during edits.
- Run root `npm run check` and `git diff --check` under signed Empirical evidence.
- Exercise search/detail/full-right sharing, case-canonical toggles, keyboard
  menu focus/long values, and metadata error/Retry in real BB; capture required
  screenshots without mutating an external provider.
- Complete independent security, UI/UX, and code review, then integrate all five
  capability deltas against the independent verification worktree.

## 6. Replace and audit the release archive

- Build a new real scripts-disabled `bb-plugin-taskboard@0.3.0` tarball in a new
  artifact directory; never overwrite or publish the obsolete earlier archive.
- Inspect exact metadata/paths, forbidden files, source/build byte equivalence,
  and record/recheck SHA-256.
- Reconfirm npm/tag/release-branch absence and keep all remote actions paused
  until the final source commit, clean-tree audit, exact command presentation,
  and explicit user approval.
