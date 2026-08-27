# Plan: Usage Tracker Provider and Window Fixes

## 1. Establish the review branch and baseline

- Create one owner branch from the audited `origin/main` commit.
- Install the fresh checkout's locked npm dependencies.
- Run the existing Usage Tracker tests and add a temporary focused reproduction
  through the permanent regression tests rather than committing scratch files.
- Confirm current BB wire keys and an omitted provider fail on unmodified logic.

Acceptance coverage: establishes the pre-fix evidence for AC-1 and AC-3.

## 2. Normalize current and legacy provider responses

- Make raw provider responses partial and enumerate current plus legacy keys.
- Add ordered current-first wire aliases to provider definitions.
- Let provider normalization accept an absent raw value and return only that
  provider as unavailable with null metadata and empty windows.
- Update fixtures to use current BB keys and add legacy, precedence, and
  missing-provider regression cases.
- Run Usage Tracker tests and typecheck.

Acceptance coverage: AC-1, AC-2, AC-3.

## 3. Model every expanded detail row

- Add a pure detail-row helper that returns the canonical placeholder rows
  followed by every unselected provider window in source order.
- Exclude selected canonical windows by object identity so distinct duplicate or
  canonical-looking provider rows are not hidden.
- Consume the helper in the expanded card and leave compact selection on the
  existing canonical pair.
- Add row-order, label, object-identity, Fable, and unchanged compact-reading
  tests.

Acceptance coverage: AC-4, AC-UI-1, AC-UI-2.

## 4. Preserve additional last-known windows

- Retain category-aware restoration and current precedence for the selected
  five-hour/weekly pair.
- Track those selected previous objects as handled, then append every remaining
  previous row whose exact label is absent from current/restored rows.
- Add empty, partial, canonical-alias, exact-label precedence, and extra
  canonical-looking-window regression cases.

Acceptance coverage: AC-5 and the refresh aspect of AC-UI-1.

## 5. Finish card layout and accessible copy

- Keep only the second canonical row's vertical divider.
- Render third and later rows across both columns with top dividers, wrapping
  labels and no horizontal truncation.
- Keep each additional row's percentage, progress rail, and explicit reset or
  unavailable-reset copy identical in grammar to canonical rows.
- Generalize the compact action sentence to usage details and assert that the
  complete computed accessible name still includes the provider name.
- Run focused Usage Tracker tests, typecheck, and build.

Acceptance coverage: AC-4, AC-UI-1, AC-UI-2.

## 6. Exercise the real BB surface

- Record the existing Usage Tracker install and non-secret local cache state.
- Install/reload the audited local path and run its development loop/log view.
- Seed a three-window non-secret cached fixture (`Current session`, `Weekly
  limit`, `Fable`) and exercise a refresh-fallback path.
- Verify the expanded card shows all three rows, Fable percentage/reset state,
  canonical-first order, long-label wrapping, narrow-sidebar vertical flow, no
  horizontal overflow, keyboard open/close, and provider-specific accessible
  naming.
- Verify compact mode shows exactly the configured canonical percentage.
- Capture expanded and compact UI evidence, then restore the prior cache/install
  state.

Acceptance coverage: AC-UI-1, AC-UI-2.

## 7. Complete repository verification and review

- Run focused Usage Tracker check, then root `npm run check`, `git diff --check`,
  and a tracked/ignored output audit.
- Record immutable test and UI evidence receipts required by Empirical.
- Run independent code and UI review passes, address every blocking finding, and
  rerun affected checks.
- Archive the reviewed capability deltas and refresh repository context if the
  workflow reports any stale topics.

Acceptance coverage: AC-1 through AC-6 and AC-UI-1 through AC-UI-2.

## 8. Integrate the fix without releasing

- Commit only the fix, tests, and required Empirical records on the owner branch.
- Push the branch, open one PR closing #13 and #19, and wait for required CI.
- Recheck the exact head/merge state and merge normally into `main` only after
  local review and hosted CI are green.
- Confirm both issues close and the merged commit contains no version, tag, or
  marketplace mutation.
- Hand the exact merged commit to the separately approved `0.1.3` release
  preparation workflow.

Acceptance coverage: integrated completion ceiling; publication remains outside
this feature's authorization.
